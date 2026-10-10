---
title: npm vs Yarn vs pnpm: Which Package Manager to Use
description: What package.json, lockfiles and semver are, and how npm, Yarn and pnpm differ in speed, disk usage, workspaces and dependency strictness.
summary: npm is the reliable default, pnpm saves disk space and enforces stricter dependencies, which shines in monorepos, and Yarn suits teams that want its special modes; above all, use one manager and one lockfile per project.
---

## The short answer

- **npm** ships with Node.js, nothing to install. It fits most projects.
- **pnpm** keeps packages in a shared store and links them in: less disk space, fast reinstalls and strict access to dependencies. Great for monorepos.
- **Yarn** (modern versions) offers Plug'n'Play mode without a `node_modules` folder and well-designed workspaces, but the team needs to understand its quirks.

More important than the choice itself: **don't mix managers**. A repository should have one lockfile.

## The basics: package.json, semver and lockfiles

**package.json** describes the project: dependencies, scripts, Node.js version. Dependency versions follow **semver** — `MAJOR.MINOR.PATCH`:

- `^1.4.2` — any `1.x.x` from 1.4.2 up (new minor and patch versions);
- `~1.4.2` — patches only, `1.4.x`;
- `1.4.2` — exactly this version.

A range means `install` can pick different versions today and a month from now. That is why a **lockfile** exists — it records exact versions of the whole dependency tree:

| Manager | Lockfile |
|---|---|
| npm | `package-lock.json` |
| Yarn | `yarn.lock` |
| pnpm | `pnpm-lock.yaml` |

**Commit the lockfile.** In CI, install strictly from it: `npm ci`, `yarn install --immutable` (modern Yarn), `pnpm install --frozen-lockfile`.

## Comparing the three

| Criterion | npm | Yarn | pnpm |
|---|---|---|---|
| Installation | Bundled with Node.js | Via Corepack or separately | Via Corepack or separately |
| Disk usage | A copy per project | Depends on mode | Shared store, links |
| Strictness | Flat `node_modules` | PnP is strict | Strict by default |
| Workspaces | Yes | Yes, mature | Yes, mature |
| Compatibility | Highest | PnP sometimes needs setup | High, rare packages need tweaks |

Speed depends heavily on cache, network and project size, so compare on your own repository rather than trusting someone else's benchmarks.

## What strictness means

npm creates a **flat** `node_modules`: your dependencies' dependencies sit at the top level, so code can import a package that is not in your `package.json`. That is a **phantom dependency** — it works until something higher up the tree drops it.

pnpm puts only direct dependencies at the root of `node_modules`; the rest are hidden. The bug shows up immediately instead of after an update. Yarn in PnP mode controls module resolution itself.

## Workspaces and monorepos

All three support **workspaces** — several packages in one repo with a shared install. A pnpm example:

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

Internal packages are linked and there is a single lockfile. Large monorepos often pick pnpm for disk savings and strictness, while npm works fine for simplicity when there are only a few packages.

## How to choose

1. **Small project or a team with no special needs** — npm.
2. **Monorepo, many projects on one machine, strictness wanted** — pnpm.
3. **Team already on Yarn and happy** — stay; migrating for its own sake is not worth it.
4. Pin the manager in the `packageManager` field of `package.json` and enable Corepack so everyone uses the same version.

## Common mistakes

- **Two lockfiles in the repo** — half the team installs one set of versions, half another.
- **Lockfile in `.gitignore`** — builds stop being reproducible.
- **`npm install` instead of `npm ci` in CI** — the lockfile can change silently.
- **Importing packages missing from package.json** — works until the next update.

## FAQ

### Can I move from npm to pnpm painlessly?

Usually yes: pnpm can import an existing lockfile with `pnpm import`. Trouble appears when code relies on phantom dependencies — you will need to add them to package.json explicitly.

### What do I do with lockfile conflicts when merging branches?

Don't edit it by hand. Resolve the conflict in package.json, then run the install again and let the manager regenerate the lockfile.

### Does the package manager affect the final application?

No, it does not change the code running in the browser or on the server as long as the same versions are installed. It determines install speed, reproducibility and protection against accidental dependencies.
