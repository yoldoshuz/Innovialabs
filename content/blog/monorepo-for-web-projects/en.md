---
title: Monorepo for Web Projects: Turborepo, Nx and pnpm Workspaces
description: How a monorepo shares UI and types between web, admin and API, how task caching works, and how pnpm workspaces, Turborepo and Nx compare.
summary: A monorepo keeps the website, admin, API and shared packages in one repository; pnpm workspaces link the packages, while Turborepo or Nx speed up builds with caching and running only affected tasks.
---

## What a monorepo gives you

A **monorepo** is a single Git repository holding several apps and libraries. A typical web project: a public site, an admin panel, an API and shared packages — UI components, types, configs.

The main benefits:

- **Shared types between frontend and API.** Change a field in a model and TypeScript immediately shows every place that broke.
- **One design system** for the site and admin without publishing packages to npm.
- **Atomic changes**: the API and client fix land in one commit and one pull request.
- **Uniform rules**: one set of linters, formatting and dependency versions.

The cost is tooling: without it, building and testing every package on every change gets slow.

## A sample layout

```text
my-project/
├── apps/
│   ├── web/          # public site (Next.js)
│   ├── admin/        # admin panel
│   └── api/          # backend (Node.js)
├── packages/
│   ├── ui/           # shared components
│   ├── types/        # shared types and schemas
│   └── config/       # eslint, tsconfig
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

The rule: **apps depend on packages, never on each other**. If the admin needs code from the site, move it into `packages/`.

## Layer 1: pnpm workspaces

**pnpm workspaces** link packages inside the repository. You only declare where they live:

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

Then add a local package to an app:

```json
{
  "dependencies": {
    "@acme/ui": "workspace:*"
  }
}
```

pnpm links the local folder, so changes in `packages/ui` show up in `apps/web` right away. On its own, pnpm does not know what to rebuild or cache — that is the orchestrator's job.

## Layer 2: task orchestration and caching

An orchestrator understands the dependency graph between packages and can:

- run tasks (`build`, `test`, `lint`) in the right order and in parallel;
- **cache results**: if a package's inputs have not changed, the result comes from cache instead of being recomputed;
- run tasks **only for packages affected** by a change;
- share the cache between developers and CI via a **remote cache**.

A Turborepo configuration example:

```json
{
  "$schema": "https://turborepo.com/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "lint": {},
    "test": { "dependsOn": ["^build"] }
  }
}
```

`^build` means "build this package's dependencies first". The config format changes between major versions, so check the docs for the version you use.

## Turborepo, Nx or just pnpm

| Criterion | pnpm workspaces | Turborepo | Nx |
|---|---|---|---|
| What it is | Package manager | Lightweight task runner | Full monorepo platform |
| Task caching | No | Yes, local and remote | Yes, local and remote |
| Learning curve | Minimal | Low | Higher |
| Code generators, plugins | No | Minimal | Many |
| Enforcing package boundaries | No | Limited | Dependency rules built in |
| Best for | 2–3 packages, simple scripts | Most JS/TS projects | Large repos, many teams |

A practical path: start with **pnpm workspaces**, add **Turborepo** when builds get noticeably slow, and consider **Nx** if you need strict boundaries, generators and large scale.

## Common mistakes

- **Circular dependencies** between packages: `ui` imports from `types` and `types` imports from `ui`.
- **Importing from a sibling app** instead of moving code into a shared package.
- **Wrong `outputs`** in cache settings: the cache restores the wrong files or nothing at all.
- **Environment variables missing from the cache key**: a build with different values reuses a stale result.
- **Different versions of the same library** across apps for no reason.
- **Secrets in shared packages**: code from `packages/` can end up in the client bundle.

## FAQ

### Do I need a monorepo for a single website?

No. It pays off when there are several apps with shared code: a site and admin, web and API, several sites on one design system.

### Can a mobile app live in the monorepo?

Yes, if it is JavaScript or TypeScript, such as React Native: types, validation schemas and the API client can be shared. UI components for web and mobile usually differ.

### How do I deploy apps from a monorepo separately?

Each app builds with its own command filtered by package, and CI deploys only the apps affected by a change. Orchestrators can work this out from the dependency graph.
