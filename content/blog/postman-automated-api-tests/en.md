---
title: Automated API Tests in Postman and Newman
description: How to write Postman test scripts, chain requests with pre-request scripts, run collections in the Collection Runner and Newman, and add API checks to CI.
summary: In Postman you add JavaScript checks to each request with pm.test, pass data between requests through variables, and run the whole collection from the command line with Newman, including in CI on every commit.
---
## How it works

A Postman automated test is a regular request plus a script that checks the response. Each request has two places for code:

- **Pre-request** — runs before sending: prepare data, fetch a token, generate a unique email.
- **Post-response** (called the **Tests** tab in older versions) — runs after the response: check status, fields and timing, save values for later requests.

Scripts can also live at folder or collection level, so they run for every request inside.

The **Collection Runner** in the app or **Newman** on the command line runs the whole collection in sequence.

## Writing checks

```javascript
pm.test("Status is 200", () => {
  pm.response.to.have.status(200);
});

pm.test("Response has a user id", () => {
  const body = pm.response.json();
  pm.expect(body.id).to.be.a("number");
  pm.expect(body.email).to.include("@");
});

pm.test("Responds in under a second", () => {
  pm.expect(pm.response.responseTime).to.be.below(1000);
});
```

`pm.test` names a check, and `pm.expect` uses Chai assertion syntax. What to check first:

- **Status codes** — for both success and error scenarios.
- **Response shape** — required fields and their types.
- **Business rules** — for example, the order total equals the sum of its items.
- **Negative cases** — a request without a token must return 401, not 200.

## Chaining requests

A typical chain: log in → create a resource → read it → delete it.

After **Login**, save the token:

```javascript
const { token } = pm.response.json();
pm.collectionVariables.set("token", token);
```

After **Create order**, save the new order's id:

```javascript
pm.collectionVariables.set("orderId", pm.response.json().id);
```

The next request uses it in the URL: `{{baseUrl}}/orders/{{orderId}}`.

A **pre-request** script is the right place for unique data, so runs do not collide with each other:

```javascript
pm.variables.set("email", `qa+${Date.now()}@example.com`);
```

If a token is needed before any request, fetch it in the collection-level pre-request script with `pm.sendRequest`.

## Collection Runner

Open a collection in Postman and click **Run**. You can:

- pick the environment and the request order;
- set the number of iterations;
- attach a **CSV or JSON data file** — each row becomes an iteration, and its values are available as variables.

The Runner is handy for manual checks before a release and for debugging tests.

## Newman: running from the command line

**Newman** is a Node.js command-line runner for Postman collections. Export the collection and environment to JSON and run:

```bash
npm install -g newman

newman run api.postman_collection.json \
  -e staging.postman_environment.json \
  --reporters cli,junit \
  --reporter-junit-export results/newman.xml
```

Useful flags:

- `-d data.csv` — a test data file;
- `--env-var "token=..."` — inject a variable from outside, such as a CI secret;
- `--bail` — stop at the first failure.

When a check fails, Newman exits with a non-zero code and CI marks the build as failed. Postman also ships its own **Postman CLI** for a similar job; it is tied more closely to the Postman cloud, while Newman works fully locally with files.

## Adding it to CI

A GitHub Actions example:

```yaml
name: API tests
on: [push]

jobs:
  api-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install -g newman
      - run: >
          newman run tests/api.postman_collection.json
          -e tests/staging.postman_environment.json
          --env-var "token=${{ secrets.API_TOKEN }}"
          --reporters cli,junit
          --reporter-junit-export results/newman.xml
```

Most CI systems can display a JUnit report as a test list. In GitLab CI, Jenkins and others the steps are the same: install Newman, run the collection.

## Common mistakes

- **Tests depend on each other for no reason.** One failed request breaks the whole chain. Keep scenarios independent where you can.
- **Tests write to production.** Run them against a dedicated environment with test data.
- **Only status 200 is checked.** A server can return 200 with an error in the body.
- **Secrets are committed in the environment file.** Pass them with `--env-var` and CI secrets.
- **The collection in the repo is stale.** Agree that the file in Git is the source of truth and update it together with the API code.

## FAQ

### How are Postman tests different from backend unit tests?

Unit tests check individual functions inside the code. Postman tests check the API from the outside, the way a client sees it: over the network, with real auth and a real database. They are different layers and complement each other.

### Do I need a paid Postman plan to use Newman?

No. Newman is an open-source tool that runs exported JSON collection files and needs no subscription.

### How do I run the tests against different environments?

Create one environment file per target and pass the right one with the `-e` flag. The collection itself stays the same.
