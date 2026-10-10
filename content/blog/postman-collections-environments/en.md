---
title: Postman Collections, Environments and Variables
description: How to organize requests into Postman collections, switch between dev and production, understand variable scopes and share everything with your team.
summary: Group requests into collections with folders, move URLs and tokens into variables like {{baseUrl}}, and create one environment per server, so switching between dev and production takes a single click.
---
## The core idea

Three Postman features solve one problem — not duplicating requests:

- **Collection** — a folder of requests for one API or project, with subfolders, shared auth and documentation.
- **Variable** — a named value substituted into a request: `{{baseUrl}}/users`.
- **Environment** — a set of variables for one target: local, dev, staging, production.

You write each request once, and the server address and token change with the selected environment.

## Structuring a collection

A good structure mirrors the API:

```text
Shop API
├── Auth
│   ├── Login
│   └── Refresh token
├── Products
│   ├── List products
│   ├── Get product
│   └── Create product
└── Orders
    ├── Create order
    └── Get order
```

Practical rules:

- **Name requests by action**: "Create order", not "POST /orders 2".
- **Set auth at the collection level** and leave requests on **Inherit auth from parent**. The token changes in one place.
- **Save example responses** (Save as example) — they show up in the docs and help anyone new to the API.

## Environments: dev, staging, production

Create one environment per target with identical variable names:

| Variable | Local | Staging | Production |
|---|---|---|---|
| `baseUrl` | `http://localhost:3000` | `https://staging.api.example.com` | `https://api.example.com` |
| `token` | local token | staging token | production token |

Use only variables in requests: `{{baseUrl}}/products`. The environment switcher sits in the top-right corner. Postman highlights variables: resolved ones in one color, unresolved ones in red.

To avoid changing production data by accident, many teams keep a separate collection or environment for production with only safe read requests.

## Variable scopes

Postman has five levels. If the same name exists in several of them, the **narrowest** scope wins:

| Scope | Applies to | Use it for |
|---|---|---|
| **Global** | Whole workspace | Rarely needed, easy to get confused |
| **Collection** | One collection | API constants: version, paths |
| **Environment** | Selected environment | Server URLs, tokens |
| **Data** | One run with a data file | Test data sets in the Runner |
| **Local** | One request or run | Temporary values from scripts |

Precedence: Local → Data → Environment → Collection → Global.

## Setting variables from scripts

Instead of copying a token by hand, save it from the login response. In the script tab that runs after the request, add:

```javascript
const data = pm.response.json();
pm.environment.set("token", data.access_token);
```

After running Login, every request using `{{token}}` gets the fresh token.

## Secrets and shared values

A variable has a **shared value** that syncs to the whole team and a **current value** that stays on your machine. The field names differ between Postman versions, but the principle is the same:

- Put only harmless data in the shared value: URLs, IDs, empty placeholders.
- Keep tokens and passwords in the current value only and set the type to **secret**, which masks them on screen.
- For sensitive data there is **Postman Vault**: secrets stay local and are referenced as `{{vault:name}}`.

## Collaboration and documentation

- **Team workspaces** — collections and environments are visible to the team and stay in sync.
- **Fork and pull request** — copy a collection, change it and propose the changes back, Git-style.
- **JSON export** — export the collection and environments as files and keep them in the repo next to the code.
- **Documentation** — collection, folder and request descriptions are written in Markdown. Postman builds a documentation page from them with sample requests and responses.

## Common mistakes

- The server URL is hard-coded in requests, so switching targets means editing everything.
- Tokens sit in shared values and are visible to the whole team.
- The same variable name exists globally and in an environment, and nobody knows which one applied.
- No descriptions: a month later nobody remembers what "test 3" was for.

## FAQ

### What is the difference between a collection variable and an environment variable?

A collection variable is the same for every target, such as the API version. An environment variable changes with the target, such as the server URL and token.

### Can Postman collections live in Git?

Yes. Export the collection and environments to JSON, strip secrets and commit them. The same files can later run in CI with Newman.

### Why is my variable highlighted in red?

It is not defined in any available scope. Check that the right environment is selected and that the variable name has no typo.
