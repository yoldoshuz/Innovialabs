---
title: Build and Push Docker Images with GitHub Actions
description: How to build a Docker image in GitHub Actions with buildx, layer caching, multi-platform builds and commit/version tags, then push it to GHCR or Docker Hub.
summary: Use Docker's official actions (setup-buildx, login, metadata, build-push) with type=gha caching — the image builds fast, gets commit and version tags and lands in GHCR or Docker Hub.
---
## The short answer

A solid Docker pipeline in GitHub Actions is four ready-made steps:

1. **docker/setup-buildx-action** — enables BuildKit and buildx.
2. **docker/login-action** — logs in to the registry (GHCR or Docker Hub).
3. **docker/metadata-action** — generates tags and labels automatically.
4. **docker/build-push-action** — builds and pushes the image with layer caching.

You do not need hand-written shell scripts with `docker build` and `docker push`: these actions already handle tags, caching and multi-platform builds.

## A ready workflow

```yaml
name: docker

on:
  push:
    branches: [main]
    tags: ["v*"]

permissions:
  contents: read
  packages: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-qemu-action@v3
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/${{ github.repository }}
          tags: |
            type=sha
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
      - uses: docker/build-push-action@v6
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

## What matters here

**Registry.** For GHCR the built-in `GITHUB_TOKEN` plus the `packages: write` permission is enough. For Docker Hub, create an **access token** in your account settings, store it in repository secrets and drop `registry` from the login step.

**Tags.** The metadata action turns Git events into image tags:

| Event | Tags |
|---|---|
| Push to main | `main`, `sha-<short hash>` |
| Tag `v1.4.2` | `1.4.2`, `1.4` |

The commit tag ties an image to exact code — use it for deploys and rollbacks. Semantic tags serve people who pull by version.

**Layer cache.** `type=gha` stores the cache in GitHub Actions cache. `mode=max` also caches intermediate layers of a multi-stage build, not just the final ones. The alternative is `type=registry`, keeping the cache as a separate tag in the registry — handy when other systems need it too.

**Multi-platform.** QEMU lets you build `arm64` images on a regular `amd64` runner. It is slow: emulation drags down compilation. If the ARM build takes too long, use ARM runners and merge images into a manifest, or cross-compile inside the Dockerfile.

## A Dockerfile that caches well

Caching only works when layers are stable:

- Copy dependency files first (`package.json`, `go.mod`, `requirements.txt`), install dependencies, and only then copy the source.
- Use a **multi-stage build**: compile in one stage, ship only the artifacts in the final one.
- Add a `.dockerignore` so `node_modules`, `.git` and local files stay out of the context and do not bust the cache.

## Common mistakes

- **Pushing from pull requests.** PRs from forks cannot access secrets. Set `push: ${{ github.event_name != 'pull_request' }}` — the image is built for verification but not pushed.
- **Only a `latest` tag.** You cannot tell which version is in production, and rollbacks get painful.
- **Secrets in build args.** They stay in the image history. For build-time secrets use `secrets` in build-push-action and `RUN --mount=type=secret`.
- **Missing `packages: write`.** The push to GHCR fails with an authorization error.

Parameter details are in the [Docker documentation for GitHub Actions](https://docs.docker.com/build/ci/github-actions/).

## FAQ

### GHCR or Docker Hub — which one?

GHCR is convenient when the code already lives on GitHub: authentication via the built-in token, permissions inherited from the repository. Docker Hub is more familiar for public images, but it rate-limits anonymous pulls. You can publish to both by listing two images in the metadata action.

### Why does the cache not speed up my build?

Usually the Dockerfile order is to blame: if the source is copied before dependencies are installed, any code change invalidates every layer after it. Also check `.dockerignore` and that `mode=max` is set.

### Do I always need a multi-platform build?

No. If your servers and developers run on `amd64`, one platform is enough and the build will be noticeably faster. Add ARM when you have ARM servers or developers on Apple Silicon run the image locally.
