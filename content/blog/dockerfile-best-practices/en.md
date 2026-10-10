---
title: Dockerfile Best Practices: Writing Fast and Clean Images
description: Layer ordering for cache, base image choice, .dockerignore, non-root users and pinned versions, with ready-to-use Dockerfiles for Node.js and Python.
summary: A good Dockerfile copies dependency files before the code, uses a compact base image with a pinned version, excludes clutter via .dockerignore and runs the app as a non-root user.
---

## In short: what makes a Dockerfile good

You get a fast, clean image by following five rules:

- **Layer order**: things that rarely change go first, things that change often go last.
- **A compact base image** with a specific version.
- **.dockerignore** so junk and secrets stay out of the image.
- **A non-privileged user** instead of root.
- **Pinned versions** of the base image and dependencies.

## Layer order and caching

Docker builds an image layer by layer and caches each one. When a layer changes, every layer after it is rebuilt. So copy **only the dependency files** first and install them, then copy the source code.

Bad: `COPY . .` at the top. Any code edit forces a full reinstall of packages.

Good: `package.json` and the lock file separately, install, then the code. As long as dependencies do not change, the install step comes from cache.

More tips:

- Combine related commands in a single `RUN` and clear the package manager cache in the same layer.
- Keep build-only tools out of the final image by using a **multi-stage build**.

## Choosing a base image

| Option | Pros | Cons |
|---|---|---|
| Full (`node:22`, `python:3.12`) | Everything included | Large size, more vulnerabilities |
| Slim (`-slim`) | Smaller, Debian-based | Sometimes missing system packages |
| Alpine (`-alpine`) | Very small | musl instead of glibc, possible issues with native modules |
| Distroless | Minimal attack surface | No shell, harder to debug |

For most applications a reasonable start is **slim** or **alpine** with an official tag for a specific version.

## .dockerignore

Without it, everything ends up in the build context: `node_modules`, `.git`, local `.env` files. Builds get slower, images get bigger and secrets can leak.

```text
node_modules
.git
.env
*.log
dist
__pycache__
.venv
```

## Example for Node.js

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --chown=node:node . .
USER node
EXPOSE 3000
CMD ["node", "server.js"]
```

What matters here:

- The first stage installs dependencies from the lock file with `npm ci`, which is reproducible.
- The final stage receives only the finished `node_modules` and the code.
- `USER node` is the built-in non-privileged user of the official image.
- `CMD` in exec form (an array) lets the process receive stop signals correctly.

If the project needs a build step (TypeScript, frontend), add a separate `build` stage and copy only its output into the final image.

## Example for Python

```dockerfile
FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN useradd --create-home appuser
COPY --chown=appuser:appuser . .
USER appuser
EXPOSE 8000
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8000"]
```

What matters here:

- `requirements.txt` is copied before the code, so the install is cached.
- `--no-cache-dir` leaves no pip cache in the image.
- `PYTHONUNBUFFERED=1` sends logs straight to the container's stdout.
- The app runs as a separate `appuser`.

## Common mistakes

- Using the `latest` tag for the base image, so builds change without you knowing.
- Secrets in `ENV` or `COPY`: they stay in image layers even after deletion.
- `apt-get update` in a separate `RUN` from `apt-get install`, leading to a stale index cache.
- One huge production image with compilers and dev dependencies.

## FAQ

### Should I pin the version down to the patch, or is the major version enough?

At minimum, pin the major and minor version. For full reproducibility you can pin the image digest, but then you need a process for regular updates.

### Why is a multi-stage build better than a single stage?

Build tools and dev dependencies stay in an intermediate stage, and the final image contains only what is needed to run. It is smaller and safer.

### Why not just run the container as root?

If a vulnerability is found in the app, an attacker gets more privileges inside the container and a better chance of escaping it. A non-privileged user limits the possible damage.
