---
title: How to Reduce Docker Image Size: Practical Techniques
description: Make Docker images smaller with alpine and distroless bases, multi-stage builds, package cache cleanup and layer inspection with dive.
summary: The biggest wins come from multi-stage builds and a lean base image (slim, alpine or distroless); then clean package caches in the same layer, add a .dockerignore and inspect layers with dive.
---

## The short answer

Image size is the sum of the **base image**, your **dependencies** and **everything left in the layers** after the build. Four things make the difference:

1. **Multi-stage builds** — build in one image, copy only the result into the final one.
2. **A lean base** — `slim`, `alpine` or `distroless` instead of a full distribution.
3. **Cleanup in the same layer** — remove package manager caches in the same `RUN` instruction that created them.
4. **Inspection** — check what actually sits in each layer with `dive`.

A smaller image downloads faster during deploys, starts faster on new nodes and ships fewer packages that might contain vulnerabilities.

## Multi-stage builds

Compilers, dev dependencies and source code are only needed at build time. A multi-stage build leaves them in an intermediate stage:

```dockerfile
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:20-slim
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
CMD ["node", "dist/server.js"]
```

For Go and Rust the effect is even stronger: the final image holds a single binary, and the base can be `distroless` or even `scratch`.

## Choosing a base image

| Base | What's inside | When it fits |
|---|---|---|
| Full (`debian`, `ubuntu`) | Shell, package manager, many tools | Debugging, complex system dependencies |
| `slim` | Trimmed Debian | A good default for most languages |
| `alpine` | musl libc, busybox, `apk` | Small size, if your dependencies work with musl |
| `distroless` | Runtime only, no shell or package manager | Production, minimal attack surface |
| `scratch` | Empty | Statically linked binaries |

**The alpine caveat:** because it uses musl instead of glibc, some native modules (for example Python packages with C extensions) must be compiled from source. Builds get slower and sometimes the image even gets bigger. In that case `slim` is often more practical.

**The distroless caveat:** there is no shell, so `docker exec ... sh` won't work. For debugging use the debug image variants or ephemeral containers.

## Cleaning caches and layers

Every `RUN`, `COPY` and `ADD` instruction creates a layer. A file deleted in a later layer **still stays in the image**. So install and clean up in a single command:

```dockerfile
RUN apt-get update \
 && apt-get install -y --no-install-recommends curl \
 && rm -rf /var/lib/apt/lists/*
```

The same idea elsewhere:

- `pip install --no-cache-dir ...`
- `apk add --no-cache ...`
- `npm ci` followed by `npm cache clean --force` in the same `RUN`, if the cache ends up in the image.

**Squashing layers** into one can reduce size, but it breaks layer cache reuse between images. Multi-stage builds usually solve the same problem more cleanly.

## .dockerignore

Without it, `.git`, `node_modules`, logs, local `.env` files and test data end up in the build context and then, through `COPY . .`, in the image. A minimal example:

```text
.git
node_modules
*.log
.env
coverage
```

It also speeds up builds and prevents secrets from leaking into the image by accident.

## Finding what takes up space

- `docker images` — total image size.
- `docker history <image>` — size of each layer and the command that created it.
- **dive** — interactively shows the contents of each layer, added and modified files and wasted space. It can also run in CI so the image doesn't grow unnoticed.

## Common mistakes

- Copying the whole project before installing dependencies — this breaks layer caching, so every build reinstalls everything.
- Leaving dev dependencies and build tools in the final image.
- Deleting files in a separate `RUN` and assuming the image got smaller.
- Switching to alpine blindly without checking native dependencies.

## FAQ

### Should I pick alpine or distroless?

If you need a shell and a package manager inside the container, go with alpine or slim. If the app simply runs and you are fine debugging from outside, distroless carries less extra software and fewer potential vulnerabilities.

### Does image size affect application performance?

It barely affects how fast the application itself runs. It affects image pull time, cold starts of new pods and load on the registry.

### Do I need dive if I have docker history?

`docker history` shows layer sizes but not their contents. dive shows the actual files, which makes it much easier to spot a forgotten cache or an unnecessary directory.
