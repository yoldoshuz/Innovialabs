---
title: How to Structure a React Project: Folders and Conventions
description: Type-based vs feature-based structure, a scalable folder tree, naming conventions, shared UI and where API logic belongs in a React project.
summary: Grouping by file type is fine for small projects, but a growing app is better split by feature: everything for one feature lives in one folder, and shared code goes to shared.
---

## The short answer

React does not enforce a structure, so the decision is up to the team. A rule that works: **small project — group by type, growing project — group by feature**. What matters most is that any developer can tell within a minute where to find code and where to add new code.

## By type or by feature

**Type-based** — all components in `components/`, all hooks in `hooks/`, all requests in `api/`.

**Feature-based** — code is grouped by product features: `auth/`, `cart/`, `orders/`. Each feature holds its own components, hooks, requests and types.

| Criterion | By type | By feature |
|---|---|---|
| Learning curve | Low, obvious from day one | Requires agreeing on feature boundaries |
| Project growth | Folders swell to hundreds of files | Each feature stays compact |
| Removing a feature | Files are scattered across the project | Delete one folder |
| Teamwork | Frequent conflicts in shared folders | Teams work within their features |

## A scalable folder tree

```text
src/
  app/            # entry point, routing, providers
  pages/          # pages that compose features
  features/
    cart/
      components/
      hooks/
      api.ts
      types.ts
      index.ts    # the feature's public interface
    auth/
  shared/
    ui/           # Button, Modal, Input
    lib/          # utilities, date formatting
    api/          # HTTP client, base setup
    config/
```

If you use a framework like Next.js, its router defines the `app/` or `pages/` folder. Keep only routes and thin pages there, and put logic into `features/` and `shared/`.

## Rules that keep the structure clean

- **Dependencies flow one way:** `pages` → `features` → `shared`. Nothing in `shared` imports a feature.
- **Features do not reach into each other.** If `orders` needs something from `cart`, import it through `features/cart/index.ts`, not from internal files.
- **Code lives next to where it is used.** A hook needed by one component sits beside it. Move things to `shared` only when several places actually use them.
- **Shallow nesting.** More than three or four folder levels usually means the structure is overcomplicated.

## Naming conventions

- **Components** — PascalCase: `ProductCard.tsx`. One folder per component if it has styles, tests and subcomponents.
- **Hooks** — prefixed with `use`: `useCart.ts`.
- **Utilities and other modules** — camelCase or kebab-case; pick one and enforce it with a linter.
- **Tests** — next to the file: `ProductCard.test.tsx`.
- **Import aliases** such as `@/shared/ui` instead of `../../../shared/ui`.

## Shared UI

`shared/ui` holds interface building blocks without business logic: buttons, inputs, modals, typography. They know nothing about carts or orders and receive everything through props. A component that knows the domain (for example `CartItem`) belongs to a feature.

## Where API logic goes

Do not call `fetch` directly in components. A convenient three-layer setup:

1. **`shared/api`** — a configured HTTP client: base URL, headers, error handling.
2. **`features/*/api.ts`** — the feature's request functions: `getCart()`, `addToCart()`.
3. **Feature hooks** — wrap requests, for example with TanStack Query, and give components data and status.

That way a component only renders, and an API change touches a single layer.

## Common mistakes

- A `utils/` or `helpers/` folder that becomes a dumping ground.
- Premature splitting: ten folders for a five-component project.
- Circular imports between features.
- Different conventions in different parts of the project with no written rules.

## FAQ

### When should I move from type-based to feature-based structure?

When files become hard to find in shared folders, or several developers keep editing the same folders. You can migrate gradually: build every new feature as a feature folder from the start.

### Should I adopt Feature-Sliced Design right away?

Not necessarily. It is a detailed methodology with strict layers that pays off on large projects. To start, its core ideas are enough: layers, public module interfaces and one-way dependencies.

### Where do global types go?

Types for a specific feature go in its `types.ts`. Shared types, such as an API response or a user, go in `shared`.
