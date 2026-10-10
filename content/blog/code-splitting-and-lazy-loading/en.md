---
title: Code Splitting and Lazy Loading in JavaScript Apps
description: How code splitting works: dynamic import, route and component splitting in React and Next.js, prefetching strategies and measuring the effect.
summary: Code splitting breaks your bundle into chunks loaded only when needed: routes separately, heavy components via dynamic import, with prefetching to load likely next steps ahead of time.
---

## What it is and why it matters

**Code splitting** means dividing your JavaScript bundle into several files (chunks). Instead of one large script, users first get only the code for the current page and the rest on demand. That is **lazy loading**.

The result: less JavaScript at startup, faster parsing and execution, better responsiveness. The cost is extra network requests later, so split thoughtfully.

## The foundation: dynamic import

Everything is built on `import()` — a function that loads a module asynchronously and returns a Promise. Bundlers (webpack, Vite, Turbopack, Rollup) detect it and automatically move the module into its own chunk.

```js
button.addEventListener("click", async () => {
  const { exportToPdf } = await import("./export-pdf.js");
  exportToPdf(data);
});
```

The PDF export code stays out of the main bundle and loads only on click.

## Route-based splitting

This is the most valuable level: a visitor on the home page should not download the account dashboard.

- **Next.js** does it automatically: every page in `app/` or `pages/` is its own entry point. Nothing to configure.
- **React with a router** (for example, React Router) — wrap pages in `React.lazy`:

```jsx
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("./pages/Dashboard"));

export function App() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <Dashboard />
    </Suspense>
  );
}
```

## Component-based splitting

Within a page, split out what is heavy and not needed immediately:

- modals and forms opened on click;
- charts, maps, rich text editors, video players;
- sections below the fold.

Next.js provides `next/dynamic` for this:

```jsx
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("@/components/chart"), {
  loading: () => <p>Loading chart…</p>,
  ssr: false,
});
```

`ssr: false` is for components that only work in the browser (they use `window`). Note that in the App Router it can only be used inside client components — check the docs for your version.

**Do not split tiny things.** A button or icon in its own chunk adds a request with no benefit.

## Prefetching: removing the delay

Lazy loading adds a pause at the moment code is needed. Prefetching loads it in advance, in the background.

| Strategy | When to load | Good for |
|---|---|---|
| **Link enters the viewport** | Link is visible on screen | Page navigation (what `next/link` does by default in production) |
| **On hover / focus** | User hovers the trigger | Heavy modals, menus |
| **During idle time** | Browser is free (`requestIdleCallback`) | The likely next step in a flow |
| **No prefetch** | Only on action | Rare features, admin tools |

Prefetch on hover:

```js
const loadEditor = () => import("./editor");
button.addEventListener("mouseenter", loadEditor, { once: true });
button.addEventListener("click", async () => (await loadEditor()).open());
```

Calling `import()` again for the same module does not re-download it — the cached module is reused.

## How to measure the effect

1. **Before changes**, record a baseline: initial JS size (bundle analyzer), Lighthouse, LCP and INP.
2. Check the **Network** panel in DevTools: new chunks should appear only on the intended action.
3. The **Coverage** panel shows how much loaded JS actually runs at startup.
4. Compare field metrics after release — a lab run may not reflect real devices.

## Common mistakes

- Too many tiny chunks — network overhead eats the gains.
- Lazy-loading what is visible above the fold — users see a placeholder instead of content.
- No `fallback` and no handling of chunk load errors (for example, old chunks may disappear after a new deploy).
- A heavy shared library imported statically in a common module still ends up in the main bundle.

## FAQ

### Do I need to configure code splitting manually in Next.js?

Next.js splits by page on its own. You only need to manually split heavy components inside pages with `next/dynamic` or `import()`.

### How is React.lazy different from next/dynamic?

Both rely on dynamic import. `next/dynamic` is additionally integrated with Next.js server rendering and offers options like `loading` and `ssr`.

### Can lazy loading hurt SEO?

Not if you lazy-load only interactive and secondary parts. Main content that matters for search should render immediately, ideally on the server.
