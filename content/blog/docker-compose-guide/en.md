---
title: Docker Compose Guide: Running Multi-Container Apps Locally
description: Build a compose file for an app, database and cache step by step: services, networks, volumes, env files, depends_on and everyday commands.
summary: Docker Compose describes all of a project's containers in one YAML file and starts them with a single docker compose up. Services reach each other by name, data lives in volumes, settings in .env.
---

## What Docker Compose is

**Docker Compose** is a tool that describes several containers in one `compose.yaml` file and manages them as a single application. Instead of three long `docker run` commands with flags, you write the configuration once and start everything with `docker compose up`.

A typical web project set: an **application**, a **database** (PostgreSQL) and a **cache** (Redis). Let us build it step by step.

## Step 1: the app service

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file: .env
```

- `build: .` builds the image from the Dockerfile in the current folder.
- `ports` maps a container port to the host: `host:container`.
- `env_file` loads environment variables from a file.

## Step 2: the database and a volume

```yaml
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER}"]
      interval: 5s
      retries: 5

volumes:
  db-data:
```

- `image` uses a ready-made official image, nothing to build.
- `${...}` values are substituted from the `.env` file next to the compose file.
- The **named volume** `db-data` keeps data outside the container, so recreating the container does not delete it.
- `healthcheck` verifies the database is actually ready for connections. `$$` escapes `$` so the shell inside the container expands the variable.

## Step 3: the cache

```yaml
  cache:
    image: redis:7
```

We do not publish a port: only the app needs Redis.

## Step 4: depends_on and startup order

Add to the `app` service:

```yaml
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started
```

Plain `depends_on` only guarantees the order in which containers **start**, not that a service is ready. The `service_healthy` condition waits until the database healthcheck passes. It is still wise for the app to retry its database connection.

## Networks: how services find each other

Compose automatically creates a shared network for the project. Inside it, every service is reachable **by name**. So in the app's `.env` the host is `db`, not `localhost`:

```text
POSTGRES_USER=app
POSTGRES_PASSWORD=change-me
POSTGRES_DB=app
DATABASE_URL=postgres://app:change-me@db:5432/app
REDIS_URL=redis://cache:6379
```

Inside a container, `localhost` points to that container itself, a frequent cause of "connection refused". Add `.env` to `.gitignore` and keep a `.env.example` in the repository.

Separate networks via the `networks` key are useful when services should be isolated from each other, for example the frontend from the database.

## Everyday commands

| Command | What it does |
|---|---|
| `docker compose up -d` | Start everything in the background |
| `docker compose up -d --build` | Rebuild images and start |
| `docker compose ps` | List services and their status |
| `docker compose logs -f app` | Follow a service's logs |
| `docker compose exec db psql -U app` | Run a command in a running container |
| `docker compose down` | Stop and remove containers and the network |
| `docker compose down -v` | Same, plus remove volumes: **database data is lost** |

## Common mistakes

- `localhost` instead of the service name in the connection string.
- Passwords written directly in `compose.yaml` and committed to Git.
- Running `down -v` "just in case" and losing the local database.
- Publishing the database port on a server without a reason.
- Expecting `depends_on` without a healthcheck to wait for the database to be ready.

## FAQ

### Can Docker Compose be used in production?

Yes, for small projects on a single server it is a workable option. When you need several servers, autoscaling and rolling updates, teams usually move to an orchestrator.

### What is the difference between compose.yaml and docker-compose.yml?

They mean the same thing. `compose.yaml` is the current preferred name, and the old one is still supported. Modern Compose does not need the `version` key at the top of the file.

### How do I separate development and production settings?

Keep a base `compose.yaml` plus an override file, for example `compose.override.yaml` for local development, which is picked up automatically, or include the file you need with the `-f` flag.
