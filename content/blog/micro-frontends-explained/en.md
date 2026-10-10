---
title: Micro-Frontends: When Splitting a Frontend Makes Sense
description: What micro-frontends are, how Module Federation and other integration approaches work, what teams gain from them and what you pay in return.
summary: Micro-frontends split one interface into parts that different teams build and deploy independently; they solve an organizational problem and are almost always overkill for a single small team.
---

## In short: what they are and why

**Micro-frontends** are an approach where one web interface is assembled from several independent applications. For example, the catalog, cart and account area are built by different teams, live in different repositories and deploy separately, while the user sees one site.

The key point: micro-frontends solve an **organizational** problem, not a technical one. They help when several teams get in each other's way inside one frontend: waiting for shared releases, clashing in code, unable to upgrade dependencies. Without that problem, the approach adds complexity with no payoff.

## Integration approaches

There are several ways to stitch the parts together:

| Approach | How it works | Pros | Cons |
|---|---|---|---|
| **Module Federation** | The bundler lets one app load modules from another at runtime | Independent deploys, shared dependencies load once | Tied to the bundler, version issues are hard to debug |
| **Server / edge composition** | The server assembles HTML from fragments of different services | Fast first render, good for SEO | Harder interactivity and shared state |
| **Build-time packages** | Each part ships as an npm package, the host bundles them | Simple, typed | No independent deploys: every change means rebuilding the host |
| **iframe** | Each part opens in a frame | Full isolation | Problems with UX, responsiveness, navigation and SEO |
| **Web Components** | Parts are custom elements | Framework-agnostic | You handle loading, versions and shared state yourself |
| **Path-based routing** | Different URLs are served by different apps | The simplest option | Moving between parts is a full page reload |

Often the most practical start is **splitting by path**: `/shop` is one app, `/account` is another, and only a design package is shared.

## What you gain

- **Independent releases**: the cart team ships without waiting for the catalog team.
- **Clear ownership**: every part has an owner.
- **Gradual migration**: a legacy interface can be rewritten piece by piece without stopping the product.
- **Technology freedom** — in theory. In practice, mixing frameworks usually causes more trouble than it is worth.

## What you pay

- **Performance.** The risk of loading several copies of a framework and libraries, more JavaScript and more requests. Shared dependencies must be configured explicitly.
- **UI consistency.** Without a shared design system, buttons and spacing start drifting between parts.
- **Shared state.** Auth, cart, interface language — all of it must be synced through contracts: events, URLs, a shared store.
- **Infrastructure.** Multiple pipelines, versioned contracts, per-part error monitoring, end-to-end tests.
- **Debugging.** A bug can appear at the seam between two independently deployed parts.

## Signs you do not need micro-frontends

- **One team** or a handful of people work on the frontend.
- Releases do not block each other and code conflicts are rare.
- The real problem is **poor code structure** — solved by modules, boundaries inside a monorepo and code review.
- The motivation is "trying different frameworks".
- The product is still finding its shape, and boundaries between parts will keep changing.

A good alternative is a **modular monolith**: one app with clear domain boundaries, separate folders and import rules. It is easier to split later if you grow.

## How to decide

1. Name the exact problem you are solving: release speed, conflicts, migration.
2. Check whether something cheaper solves it — modules, a monorepo, feature flags.
3. If you split, split by **business domain**, not by technical layer.
4. Set up a shared design system and contracts between parts up front.
5. Start with one extracted piece and measure the effect on load speed.

## FAQ

### Can micro-frontends use different frameworks?

Technically yes, but each framework adds its own code to the download and makes maintenance harder. Teams usually agree on one stack and split only code ownership and releases.

### Are micro-frontends a good fit for a small startup?

Usually not. For a small team the infrastructure and coordination overhead outweighs the benefit. A well-structured monolith is a better start.

### How is Module Federation different from npm packages?

Packages are included at build time, so a change requires rebuilding the host. Module Federation loads code at runtime, so one part can be updated without rebuilding the others.
