---
title: React State Management: Context vs Redux vs Zustand
description: How local, global and server state differ in React, and when to choose Context, Redux Toolkit, Zustand or TanStack Query for your app.
summary: First separate server data (give it to TanStack Query) from client state; Context is enough for rarely changing globals, Zustand for frequent updates, Redux Toolkit for large teams that need strict rules.
---

## The short answer

Most React state problems come from **storing different kinds of state the same way**. The right choice starts not with a library but with a question: what kind of data is this?

- **Server data** (lists, profiles, orders) — TanStack Query or similar.
- **Local state** (is the modal open, an input value) — `useState` in the component.
- **Global client state** (theme, cart, signed-in user) — Context, Zustand or Redux.

## Three kinds of state

**Local.** Needed by one component or a small subtree. Keep it as close to where it is used as possible. Lift it up only when siblings truly need it.

**Global client.** Needed across the app and exists only in the browser: theme, language, cart contents before checkout, the state of a complex wizard.

**Server.** A copy of data that lives on the server. It has its own concerns: caching, refetching, staleness, optimistic updates, pagination. Managing it by hand in Redux is a common source of unnecessary code.

## Comparing the tools

| Tool | Good for | Downsides |
|---|---|---|
| **Context** | Rarely changing values: theme, language, current user | Every consumer re-renders when the value changes |
| **Zustand** | Global state with frequent updates, minimal code | Fewer built-in conventions; the team defines structure |
| **Redux Toolkit** | Large apps, complex business logic, many developers | More boilerplate and concepts to learn |
| **TanStack Query** | Server data: fetching, caching, mutations | Not meant for purely client-side state |

## Context: built in, but not a state manager

Context is a way to **pass** a value down the tree without props. On its own it does not optimize updates: when the provider value changes, every component reading it re-renders.

Practical rules:

- Split contexts by purpose: `ThemeContext` separate from `CartContext`.
- Memoize the provider value if you pass an object.
- Do not put values that change on every keystroke into Context.

## Zustand: a simple global store

```js
import { create } from 'zustand';

export const useCart = create((set) => ({
  items: [],
  add: (item) => set((s) => ({ items: [...s.items, item] })),
  clear: () => set({ items: [] }),
}));

// In a component, subscribe only to the slice you need
const count = useCart((s) => s.items.length);
```

The component re-renders only when the value picked by the **selector** changes. No provider is needed and the code is short, which is why Zustand is a popular pick for small and medium projects.

## Redux Toolkit: when you need structure

Redux Toolkit is the modern way to write Redux. It gives you a predictable one-way data flow, DevTools with action history and well-established patterns. That pays off when many people work on the code and the business logic is complex. It also ships RTK Query for server data.

## TanStack Query: server state on its own

```js
const { data, isPending, error } = useQuery({
  queryKey: ['orders', userId],
  queryFn: () => fetchOrders(userId),
});
```

The library caches responses, deduplicates requests and refreshes data when the user returns to the tab. Once server data moves here, very little global client state usually remains.

## Choosing by app size

1. **Landing page or small app:** `useState` + Context for theme and language.
2. **Medium app with an API:** TanStack Query for data + Zustand or Context for the rest.
3. **Large product, big team:** TanStack Query or RTK Query + Redux Toolkit for complex client logic.

**Common mistakes:** making everything global "just in case", duplicating server data across several stores, choosing Redux for a five-screen app.

## FAQ

### Can I use Zustand and TanStack Query together?

Yes, it is a common pairing: TanStack Query handles server data, Zustand handles client state such as filters, the cart or open panels.

### Is Redux outdated?

No. What is outdated is the old style with hand-written action types and lots of boilerplate. Redux Toolkit remains a solid choice for large apps with complex logic.

### When does Context start slowing things down?

When it holds frequently changing data that many components read. Split the context or move that data into a store with selectors.
