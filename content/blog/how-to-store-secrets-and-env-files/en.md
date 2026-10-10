---
title: How to Store API Keys and Secrets: Beyond .env Files
description: Where to keep API keys, database passwords and tokens: environment variables, CI/CD secret stores, per-environment keys, rotation and least privilege.
summary: Secrets never belong in code or the repository: the app reads them from environment variables, while the values live in a CI/CD or cloud secret store, separate per environment, with minimal permissions and regular rotation.
---
## The short answer

A **secret** is anything that grants access: API keys, database passwords, bot tokens, signing keys. The setup that works looks like this:

1. The code contains only the variable **name**, such as `DATABASE_URL`.
2. The values live in a **secret store**: your CI/CD or hosting settings, or a cloud secret manager.
3. Each environment has **its own keys**: development, staging and production never share one.
4. Each key has **minimal permissions** and a clear **rotation** procedure.

A `.env` file is a convenient tool for local development, not a way for a team to store secrets.

## Why secrets leak

- **A key in the code.** Someone pasted it in "temporarily" and it landed in a commit. Git history keeps it even after the line is deleted.
- **A committed `.env`.** A missing `.gitignore` entry exposes it to everyone with repo access, including contractors and forks.
- **A key in the frontend.** Anything shipped to a browser or mobile app can be extracted. A payment provider's secret key in a JavaScript bundle is already a leak.
- **Logs and error reports.** The app prints its config on startup, or the error tracker stores request headers.
- **Chat messages.** A key sent to a colleague in a messenger stays there forever.

Bots constantly scan public repositories, so a key in public code should be treated as compromised immediately.

## Environment variables done right

The app reads its configuration from the environment and **fails at startup** if a required value is missing. That way the problem shows up immediately, not on the first payment.

```ts
const required = ["DATABASE_URL", "PAYMENT_API_KEY"] as const;

for (const name of required) {
  if (!process.env[name]) {
    throw new Error(`Missing env variable: ${name}`);
  }
}
```

Rules for `.env`:

- Add `.env` and `.env.*` to `.gitignore` before the first commit.
- Commit an **`.env.example`** with variable names and safe placeholders only.
- Never log the whole `process.env`.
- In Next.js and similar frameworks, variables with a public prefix (such as `NEXT_PUBLIC_`) are exposed to the browser — never put secrets there.

## Secrets in CI/CD and hosting

GitHub Actions, GitLab CI and other systems have built-in secret storage. Values are encrypted, masked in logs and injected only into the jobs that need them.

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - run: ./deploy.sh
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

Scope secrets to **environments** and protect production: deploy only from the main branch, with approval from a responsible person.

Once you have many services, move to a **secret manager** — cloud-native or self-hosted. It gives you central auditing, versioning and rotation.

## Separate keys per environment

| Environment | Which keys | Who has access |
|---|---|---|
| Local development | Test keys, payment sandboxes | Developers |
| Staging | Separate keys with limited data | Team and CI |
| Production | Live keys | CI/CD and a few responsible people only |

If a developer's key leaks, production is unaffected. And the logs immediately show which environment a request came from.

## Rotation and least privilege

**Least privilege:** a key for sending email should not be able to delete domains, and a reporting database user does not need write access. Many services let you restrict a key by action, IP address or resource — use that.

**Rotation** is the planned replacement of a key. To make it painless:

1. The app should pick up a new key without a rebuild — update the secret and restart.
2. Follow the order: create the new key, update the store, deploy, verify everything works, revoke the old key.
3. Always rotate when an employee or contractor who had access leaves.

## Common mistakes

- One "universal" key with full rights across all projects.
- Live keys on developers' laptops.
- Secrets baked into a Docker image via `ENV` or a copied `.env`.
- Nobody knows which keys are used where, so rotation is impossible.

## FAQ

### Is it OK to keep a .env file on a production server?

As a temporary solution for a single server, yes, if only the app's user can read the file and it does not end up in backups in plain text. As the project grows, switch to your host's secrets or a secret manager, which add auditing and rotation.

### How often should keys be rotated?

There is no universal interval. Rotation is mandatory after any suspected leak and whenever people with access change. Planned rotation frequency depends on how critical the key is and on your company's security requirements.

### What if a secret has already been committed to Git?

Revoke and replace the key first, then check the access logs, and only then clean the history. Deleting the file in a new commit does not fix the problem.
