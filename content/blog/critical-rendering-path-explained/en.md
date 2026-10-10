---
title: Critical Rendering Path: How the Browser Draws a Page
description: How the browser turns HTML and CSS into pixels: DOM, CSSOM, render tree, layout, paint, composite, and how to deal with render-blocking resources.
summary: The Critical Rendering Path is the chain of steps from receiving HTML to the first pixels on screen; the fewer blocking CSS and JS files at its start, the sooner users see the page.
---

## What the Critical Rendering Path is

The **Critical Rendering Path (CRP)** is the sequence of steps the browser goes through to show the first frame of a page:

1. Parse HTML and build the **DOM**.
2. Parse CSS and build the **CSSOM**.
3. Combine them into the **render tree**.
4. Calculate element geometry — **layout**.
5. Fill in pixels — **paint**.
6. Assemble layers into the final frame — **composite**.

Optimizing the CRP means reducing the work and waiting before the first render. Metrics like **FCP** and **LCP** depend directly on it.

## DOM and CSSOM

The browser reads HTML as a stream: bytes become tokens, tokens become nodes, nodes become the DOM tree. The DOM can be built incrementally while the document is still downloading.

CSS is different. The **CSSOM** cannot be used partially: a rule at the end of a file can override one at the start. That is why CSS is **render-blocking** — the browser will not paint until it has downloaded and parsed every unconditionally linked stylesheet.

## Render tree, layout, paint and composite

- The **render tree** contains only visible nodes with computed styles. Elements with `display: none`, `<head>` and `<script>` are left out.
- **Layout** (reflow in Firefox) computes the size and position of every box relative to the viewport.
- **Paint** fills in pixels: text, colors, shadows, images.
- **Composite** stacks layers in the right order with the right opacity.

A practical detail: changing `width` or `top` triggers layout again, changing `color` triggers only paint, while `transform` and `opacity` are often handled at the composite stage alone. That is why animations should rely on `transform` and `opacity`.

## What blocks rendering

| Resource | Blocks HTML parsing | Blocks rendering |
|---|---|---|
| `<link rel="stylesheet">` | no | yes |
| plain `<script>` | yes | indirectly |
| `<script defer>` | no | no |
| `<script async>` | only while executing | no |
| `<script type="module">` | no (behaves like defer) | no |

A plain `<script>` stops the parser: the browser downloads and runs it, and if CSS comes before it, it also waits for the CSSOM, because the script might read styles.

## How to shorten the path

**1. Fewer critical resources.** Anything the first screen does not need can load later.

**2. Scripts with `defer` or `async`.**

```html
<script src="/app.js" defer></script>
<script src="/analytics.js" async></script>
```

`defer` keeps order and runs after HTML parsing; `async` runs as soon as it is ready, in no particular order. Use `async` for independent analytics and `defer` for application code.

**3. Inline critical CSS.** First-screen styles can live in a `<style>` tag in `<head>`, with the rest loaded separately.

**4. Conditional styles via `media`.**

```html
<link rel="stylesheet" href="/print.css" media="print">
```

This file still downloads but does not block rendering on screen.

**5. Discover important resources earlier.** Use `<link rel="preload">` for a font or the hero image and `<link rel="preconnect">` for third-party domains.

**6. Fewer bytes.** Compression (gzip, Brotli), minification, removing unused CSS.

**7. Fonts without invisible text.** `font-display: swap` shows a fallback font while the main one loads.

## Common mistakes

- Scripts in `<head>` without `defer` — the page waits for them before showing content.
- One huge CSS bundle for the whole site when the first screen needs only a small part of it.
- `@import` inside CSS: files load in a chain instead of in parallel.
- Animating `top`/`left`/`width`, which triggers layout on every frame.
- Reading `offsetHeight` right after changing styles inside a loop — **forced synchronous layout** (layout thrashing).
- Setting `loading="lazy"` on the hero image — the LCP element should never be deferred.

## How to measure it

The **Performance** panel in Chrome DevTools shows when the DOM and CSSOM were ready, how long layout and paint took, and which resources blocked the first frame. **Lighthouse** flags render-blocking resources separately. The stages are described in detail on [web.dev](https://web.dev/articles/critical-rendering-path).

## FAQ

### Why does CSS block rendering while HTML does not?

The DOM can be shown partially, but the CSSOM cannot: any later rule may change how already-parsed elements look. Without the full CSSOM, the browser risks painting the page incorrectly.

### Should I use defer or async?

Use `defer` for scripts that depend on the DOM or on each other, since order is preserved. Use `async` for independent scripts, such as counters, where execution order does not matter.

### Do I always need to inline critical CSS?

Not always. If your CSS is small and well cached, the gain is minimal. Inlining pays off when the stylesheet is large and the first screen uses only part of it.
