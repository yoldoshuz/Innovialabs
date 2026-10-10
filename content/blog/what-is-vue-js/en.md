---
title: What Is Vue.js: A Beginner's Overview
description: What Vue.js is, how single-file components and reactivity work, how the Composition API differs from the Options API, and what Pinia and Vue Router do.
summary: Vue.js is a JavaScript framework for building interfaces where each component lives in one file and the page updates itself when data changes. New projects usually use the Composition API, Pinia for shared state and Vue Router for pages.
---

## Vue.js in a nutshell

**Vue.js** is a progressive JavaScript framework for building user interfaces. "Progressive" means you can drop it into a single page for a small widget or build an entire single-page application (SPA) with it.

Two ideas hold it all together:

- **Components** — the interface is built from independent blocks: a button, a card, a form.
- **Reactivity** — you change data and Vue updates the right places on the page.

Developers value Vue for its gentle learning curve, clear documentation and templates that look like regular HTML.

## Single-file components

A Vue component usually lives in a `.vue` file (Single-File Component, SFC) with three parts: logic, markup and styles.

```vue
<script setup>
import { ref, computed } from "vue";

const count = ref(0);
const double = computed(() => count.value * 2);
</script>

<template>
  <button @click="count++">Clicked: {{ count }}</button>
  <p>Doubled: {{ double }}</p>
</template>

<style scoped>
button { padding: 8px 16px; }
</style>
```

This is a working counter. `scoped` means the styles apply only inside this component.

## How reactivity works

- **`ref()`** creates a reactive value. In script you access it via `.value`; in the template, directly.
- **`reactive()`** makes a whole object reactive.
- **`computed()`** is a derived value recalculated only when its dependencies change.
- **`watch()`** runs code when a specific value changes, for example to send a request.

Vue tracks which data the template uses and, on change, re-renders only what depends on it.

## Composition API vs Options API

| | Options API | Composition API |
|---|---|---|
| Looks like | An object with `data`, `methods`, `computed` sections | `ref`, `computed` functions inside `<script setup>` |
| Learning curve | Easier for the very first steps | Requires a bit more understanding |
| Large components | Logic for one task is spread across sections | Logic can be grouped and extracted into composables |
| TypeScript | Supported | Supported much more comfortably |

Both APIs are officially supported. New projects more often choose the **Composition API**: code is easier to reuse through your own composables such as `useCart()` or `useAuth()`.

## Pinia: shared state

When many components need the same data — the user, the cart, settings — it goes into a **store**. The official library for this is **Pinia**.

```js
import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({ items: [] }),
  getters: {
    total: (state) => state.items.length,
  },
  actions: {
    add(item) {
      this.items.push(item);
    },
  },
});
```

Call `useCartStore()` in any component, and every component that uses it updates when the cart changes.

## Vue Router: pages without reloads

**Vue Router** is the official router. It maps URLs to components and switches pages without a full browser reload.

```js
import { createRouter, createWebHistory } from "vue-router";
import Home from "./pages/Home.vue";
import Product from "./pages/Product.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Home },
    { path: "/product/:id", component: Product },
  ],
});
```

In templates you use `<RouterLink to="/">` instead of `<a>`, and `<RouterView />` marks where the current page renders.

## Where to start

1. Install Node.js and create a project with the official `npm create vue@latest` command — it offers to add Router, Pinia and TypeScript.
2. Learn reactivity and components with small examples.
3. Add routes and one store.
4. If you need SEO and server rendering, look at **Nuxt**, a framework built on Vue.

Official documentation: [vuejs.org](https://vuejs.org/).

## Common beginner mistakes

- Forgetting `.value` when working with a `ref` in script.
- Destructuring a `reactive` object and losing reactivity.
- Putting everything into Pinia, even the local state of a single form.
- Mutating props inside a child component instead of emitting an event with `emit`.

## FAQ

### Vue or React — which to choose?

Both work for serious projects. Vue is often easier to learn thanks to HTML-like templates and built-in official solutions; React has more third-party libraries and a larger talent pool. Choose based on your team and goals.

### Do I need TypeScript for Vue?

Not necessarily — Vue works fine with JavaScript. For medium and large projects, TypeScript helps catch errors earlier, and the Composition API pairs well with it.

### Is Vue good for SEO sites?

A plain Vue SPA renders in the browser, which is weaker for search. For SEO-sensitive sites, use Nuxt with server-side rendering or static generation.
