---
title: Docker Multi-Stage Builds: How to Separate Build and Runtime
description: How Docker multi-stage builds work, with examples for Go, Node.js and a frontend served by Nginx, plus how to measure the image size savings yourself.
summary: A single Dockerfile defines several stages: a heavy stage with all the tools builds the app, and only the finished output is copied into a small final image, without compilers, sources or dev dependencies.
---
## The short answer

A **multi-stage build** is a Dockerfile with more than one `FROM` instruction. Each `FROM` starts a new stage with its own base image. Only the last stage becomes the final image, and you explicitly pull the files you need from earlier stages with `COPY --from=<stage>`.

Why it matters:

- **Smaller images** — compilers, package managers, sources and test dependencies never reach production.
- **Smaller attack surface** — fewer tools in the image means fewer findings from vulnerability scanners.
- **One Dockerfile** instead of a build script plus a separate runtime Dockerfile.
- **Per-stage caching** — Docker reuses each stage's layers when its inputs have not changed.

## Go: from a compiler to an almost empty image

Go compiles to a static binary, so the final image can be minimal.

```dockerfile
FROM golang:1.22 AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /app ./cmd/server

FROM gcr.io/distroless/static-debian12
COPY --from=build /app /app
USER nonroot
ENTRYPOINT ["/app"]
```

Two details do the heavy lifting: `CGO_ENABLED=0` produces a binary with no libc dependency, and copying `go.mod` before the sources keeps the dependency layer cached.

## Node.js: separate build and runtime dependencies

A Node.js app has no single binary, but splitting still pays off: TypeScript, bundlers and test packages are only needed while building.

```dockerfile
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
USER node
CMD ["node", "dist/server.js"]
```

The final stage installs production dependencies only and copies the compiled `dist` folder from the build stage.

## Frontend: build in Node, serve with Nginx

For an SPA (React, Vue, Svelte), Node is only needed to produce static files. Serving them is a job for a lightweight web server.

```dockerfile
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

The resulting image contains no Node.js and no `node_modules` — just Nginx and the build output. The output folder depends on your bundler; some use `build` instead of `dist`.

## How to measure the gain

Do not rely on someone else's numbers; size depends on your dependencies. Compare it yourself:

1. Build a naive single-stage version: `docker build -t app:single -f Dockerfile.single .`
2. Build the multi-stage version: `docker build -t app:multi .`
3. Compare them: `docker images app`
4. See which layers take space: `docker history app:multi`

The biggest difference usually shows up with compiled languages (Go, Rust), where the final image holds a single binary. For Node.js the gain is smaller but still visible, thanks to dropping dev dependencies and the full base image.

## Common mistakes

- **Copying the whole context** without a `.dockerignore` — `node_modules`, `.git` and local `.env` files end up in the build.
- **`COPY . .` before installing dependencies** — every code change invalidates the `npm ci` or `go mod download` cache.
- **A dynamically linked binary** in distroless or scratch — the container fails with a "not found" error.
- **Running as root** in the final stage when a single `USER` line would fix it.
- **Unnamed stages** — `COPY --from=0` breaks once you add a stage. Name stages with `AS`.

## FAQ

### Can I build just one intermediate stage?

Yes. The `--target` flag stops the build at a given stage: `docker build --target build -t app:build .`. This is handy for running tests in CI inside the stage that has all the tooling.

### Do multi-stage builds slow things down?

Usually not. BuildKit skips stages the target does not depend on and can build independent stages in parallel. With a sensible instruction order, caching works just like in a regular Dockerfile.

### Which base should the final stage use: alpine, slim or distroless?

For static binaries, distroless/static or scratch. For interpreted languages, the slim variant of the official image or a distroless image for that runtime. Alpine uses musl instead of glibc, so check that native modules are compatible.
