---
title: How to Analyze and Reduce JavaScript Bundle Size
description: Step by step: bundle analyzers, tree shaking, replacing heavy libraries, dropping extra polyfills and moving work to the server, measured before and after.
summary: Inspect the bundle with an analyzer to find the largest modules, then apply tree shaking, replace heavy dependencies, narrow polyfills and move work to the server, recording the size before and after each step.
---

## The short answer

You reduce bundle size with data, not guesses. The working loop:

1. **Record a baseline** — how much JS (compressed and uncompressed) loads on key pages.
2. **Find the largest modules** with a bundle analyzer.
3. **Remove or replace** them using one of the techniques below.
4. **Measure again** and write down the result.

Do not look only at bytes over the network: the browser still has to parse and execute uncompressed JS, and on low-end phones that often takes longer than the download.

## Step 1. Analyze the bundle

These tools draw a treemap: each rectangle is a module and its area is its size.

| Stack | Tool |
|---|---|
| webpack | `webpack-bundle-analyzer` |
| Next.js | `@next/bundle-analyzer` |
| Vite / Rollup | `rollup-plugin-visualizer` |
| Anything with source maps | `source-map-explorer` |

Example for Next.js:

```js
// next.config.js
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
module.exports = withBundleAnalyzer({});
```

Run `ANALYZE=true npm run build`. What to look for in the report:

- a single library taking a disproportionate share;
- **duplicates** — two versions of the same package;
- code needed by one page that ended up in a shared chunk;
- locales, icons and data loaded in full.

## Step 2. Tree shaking

**Tree shaking** removes unused exports at build time. It works when:

- your code and dependencies use **ES modules** (`import`/`export`), not CommonJS;
- imports are named: `import { debounce } from "lodash-es"`, not the whole package;
- the library's `package.json` declares `sideEffects` correctly.

The test is simple: import one function and check in the analyzer how much of the library ended up in the bundle. If it is all of it, tree shaking is not working.

## Step 3. Replace heavy libraries

Common candidates and typical alternatives:

- **Dates**: large libraries with bundled locales → `date-fns` (modular imports), `dayjs` or the built-in `Intl.DateTimeFormat`.
- **Utilities**: full `lodash` → individual functions from `lodash-es` or native array and object methods.
- **Icons**: importing the whole set → importing individual icons or an SVG sprite.
- **HTTP client**: for simple requests the built-in `fetch` is often enough.
- **Charts and editors**: do not replace them, **lazy-load** them via dynamic import.

Before adding a dependency, check its size (for example, on bundlephobia) and whether it supports tree shaking.

## Step 4. Unneeded polyfills and transpilation

If your build targets old browsers, the bundle gets polyfills and verbose transpiled code.

- Define target browsers in **browserslist** based on your real audience from analytics.
- Do not include polyfills wholesale "just in case" — only for features you actually use that your targets lack.
- Check whether a dependency ships its own polyfills.

## Step 5. Move work to the server

The most efficient JS is the JS you never send to the browser.

- **Server rendering and React Server Components**: non-interactive components render on the server, so their code and dependencies (a Markdown parser, for example) stay out of the client bundle.
- Format, sort and filter large datasets on the server and send the finished result.
- Keep `"use client"` as low in the component tree as possible so you do not pull extra code to the client.

## How to record before and after

Log every step in one table so you can see what worked and what did not:

| Change | Initial JS (gzip/brotli) | Initial JS (uncompressed) | Lighthouse TBT | INP (field) |
|---|---|---|---|---|
| Baseline | — | — | — | — |
| Tree-shaking icons | — | — | — | — |
| Replacing the date library | — | — | — | — |
| Moving the parser to the server | — | — | — | — |

Fill it with your own measurements under identical conditions (same build mode, same page, same throttling). To keep size from creeping back, add a **budget** to CI — for example, `size-limit` or a Lighthouse CI assertion.

## Common mistakes

- Optimizing based on `node_modules` size rather than the actual bundle.
- Measuring a dev build instead of production.
- Removing a dependency but leaving its import in a shared module.
- Not tracking size after release — the bundle slowly grows again.

## FAQ

### What bundle size is considered normal?

There is no universal number: it depends on your audience, devices and type of app. Use real-user Core Web Vitals as your guide and set a budget relative to your own baseline.

### Which matters more: compressed or uncompressed size?

Both. Compressed size affects download time; uncompressed size affects parse and execution time. On low-end devices the latter is often more critical.

### Does code splitting reduce bundle size?

It reduces **initial** JS by distributing code across chunks, but not the total. The best results come from combining both: remove what is unnecessary first, then split what remains.
