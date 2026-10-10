---
title: The Twelve-Factor App: Principles for Deployable Applications
description: All twelve factors of the Twelve-Factor App in plain language: config in environment variables, stateless processes, logs as streams and dev/prod parity.
summary: The Twelve-Factor App is a set of twelve rules that let an app run the same way in any environment: one codebase, config in environment variables, stateless processes, logs to stdout and minimal differences between dev and prod.
---
## The short answer

The **Twelve-Factor App** is a set of twelve principles for web apps and services deployed to the cloud, containers or plain servers. The goal is simple: the app should **build, configure and run the same way** everywhere — a developer laptop, staging and production — and scale by adding more processes.

The methodology is language- and framework-agnostic. Its ideas underpin Docker, Kubernetes and most PaaS platforms.

## All twelve factors

| # | Factor | What it means |
|---|--------|---------------|
| 1 | Codebase | One codebase in version control, many deploys |
| 2 | Dependencies | Dependencies are declared explicitly and isolated |
| 3 | Config | Configuration lives in environment variables |
| 4 | Backing services | Databases, caches, queues are attached resources via URL |
| 5 | Build, release, run | Build, release and run stages are strictly separated |
| 6 | Processes | Processes are stateless and store nothing locally |
| 7 | Port binding | The service binds to a port and exports HTTP itself |
| 8 | Concurrency | Scale out by running more processes |
| 9 | Disposability | Fast startup and graceful shutdown |
| 10 | Dev/prod parity | Environments are kept as similar as possible |
| 11 | Logs | Logs are an event stream written to stdout |
| 12 | Admin processes | One-off tasks run with the same code and environment |

## Config via environment variables

Anything that differs between environments — database URL, API keys, feature flags — lives **outside the code**. A simple test: could you make the repository public right now without leaking a single secret?

```python
import os

DATABASE_URL = os.environ["DATABASE_URL"]
REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379/0")
DEBUG = os.environ.get("DEBUG", "false") == "true"
```

Locally, values can sit in a `.env` file listed in `.gitignore`; on servers they come from the orchestrator or a secrets manager. Avoid `config.production.py` files with hardcoded values: they leak secrets and multiply "special" environments.

## Stateless processes

An app process should keep nothing important between requests. **Sessions, uploaded files and caches** belong in Redis, the database or object storage.

- A user uploads an avatar — it goes to S3-compatible storage, not an `uploads/` folder on disk.
- A session lives in Redis or a signed cookie, not in process memory.

Then any instance can be restarted or removed, and load can be spread across copies without sticky sessions.

## Logs as event streams

The app **does not manage log files**. It writes events to `stdout`/`stderr`, and the environment handles collection, rotation and storage: Docker, systemd, an agent like Fluent Bit or Vector, a backend like Loki or ELK.

```javascript
console.log(JSON.stringify({ level: "info", msg: "order created", orderId }));
```

Structured JSON is easy to filter and search. Rotating files inside a container, on the other hand, leads to lost logs and full disks.

## Dev/prod parity

A twelve-factor app narrows three gaps: **time** (code reaches production quickly), **personnel** (developers take part in deploys) and **tools**.

A classic mistake is SQLite locally and PostgreSQL in production. Small SQL differences only surface in production. The fix is to run the same services at the same major versions locally with Docker Compose.

## The remaining factors in practice

- **Dependencies:** lock files (`package-lock.json`, `poetry.lock`) committed, no reliance on globally installed tools.
- **Build, release, run:** the image is built once, tagged, and that exact image moves from staging to production. No editing code on the server.
- **Port binding:** the app starts its own HTTP server on the port from `PORT`; nginx or a load balancer sits in front.
- **Disposability:** handle `SIGTERM` — finish in-flight requests, close connections, then exit.
- **Admin processes:** migrations and scripts run as separate processes from the same release, e.g. `docker compose run app python manage.py migrate`.

## Common mistakes

- Secrets committed to the repo or baked into a Docker image.
- User files stored on a container's local disk.
- Different database versions in dev and prod.
- Manual hotfixes on the production server, bypassing the release process.

## FAQ

### Do I have to follow all twelve factors at once?

No. Start with the highest-value ones: config in the environment, stateless processes, logs to stdout and identical services in dev and prod. The rest usually fall into place once you adopt containers and CI/CD.

### Does it apply to a monolith?

Yes. Twelve-Factor describes how an app is run and configured, not its internal architecture. A monolith that follows these principles is just as easy to deploy and scale.

### Where do secrets go if not in the code?

Into environment variables populated from a protected source: CI/CD secrets, Kubernetes Secrets, Vault or your cloud provider's secrets manager.
