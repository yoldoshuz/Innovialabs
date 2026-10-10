---
title: How to Speed Up CI Pipelines: Caching, Parallelism and More
description: Practical ways to speed up CI: measure bottlenecks, cache dependencies, run jobs in parallel, test only what changed and shrink your images.
summary: First measure which steps take the time, then cache dependencies, split work into parallel jobs, run only affected tests and shrink your Docker images.
---
## The short answer

A slow CI almost always burns time on the same things: **downloading dependencies**, **running everything sequentially** and **building heavy images**. The order of work:

1. Measure where time goes.
2. Cache dependencies and build artifacts.
3. Parallelize independent tasks.
4. Run only what the change affects.
5. Shrink images and the runner environment.

## Step 1. Measure before you optimize

Open the last few runs and note how long each step takes. Usually one or two steps account for most of the time. Optimizing anything else is pointless until those are fixed.

What to look at:

- **Runner wait time** — the job sits in a queue instead of running.
- **Dependency install** — `npm ci`, `pip install`, `go mod download`.
- **Tests** — which suites are slowest, whether a few individual tests dominate.
- **Image builds** — whether the layer cache actually works.

## Step 2. Caching

Caching is the cheapest win. The cache key is derived from the lock file: as long as dependencies do not change, they come from the cache.

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: npm
- run: npm ci
```

Also worth caching:

- compiler and bundler caches (for example `.next/cache`, the Gradle cache, the Go build cache);
- **Docker layers** via BuildKit (`cache-from` / `cache-to`);
- browsers downloaded for e2e tests.

Do not cache what is faster to download than to restore, and make sure the cache key changes when dependencies change.

## Step 3. Parallelism

Linting, type checking, unit tests and the build usually do not depend on each other — run them as **separate jobs** at the same time.

A large test suite can be split into parts (**sharding**) with a matrix:

```yaml
strategy:
  matrix:
    shard: [1, 2, 3, 4]
steps:
  - run: npx playwright test --shard=${{ matrix.shard }}/4
```

Keep in mind that every parallel job pays for startup and dependency installation. Splitting pays off only while the gain exceeds that overhead.

## Step 4. Run only what is affected

If only the README changed, there is no reason to run the full test suite.

- **Path filters** (`paths`, `paths-ignore`) skip workflows for irrelevant changes.
- In monorepos, tools like Nx and Turborepo detect **affected packages** from the dependency graph and cache task results.
- Jest supports `--changedSince=origin/main`.

Keep a full run for the main branch or a nightly schedule so nothing slips through.

## Step 5. Lean images and environment

- Use **slim/alpine** base images where they do not break dependencies.
- Multi-stage builds: the final image holds only what is needed at runtime.
- If tools get installed on every run, bake them into your own runner image.
- Use `fetch-depth: 1` on checkout when Git history is not needed.

## Common mistakes

- **Optimizing blind**, without looking at step durations.
- **Flaky tests** with automatic retries — they hide the problem and eat time.
- **No cancellation of duplicates.** Use `concurrency` with `cancel-in-progress` so a new push cancels the older run on the same branch.
- **Over-split jobs**, where installing dependencies takes longer than the actual work.

## FAQ

### Where do I start if I have little time?

With dependency caching and cancelling stale runs via `concurrency`. It is a few lines of config, and the effect shows up in almost any project.

### Is it risky not to run all tests?

There is a risk of missing an indirect dependency, so selective runs are paired with a full run before merging to main or on a schedule. Tools that use a dependency graph reduce this risk.

### Will bigger runners help?

If the bottleneck is CPU — compilation or tests — yes. If time goes to downloads and waiting, more power gives almost nothing. That is why measurement comes before decisions.
