---
title: How to Fix CLS: Eliminating Layout Shifts on Your Site
description: How to find elements that jump during loading and fix CLS: image dimensions, ad slots, web fonts, injected banners and late-loading embeds.
summary: CLS grows when elements appear without reserved space. Set dimensions for media and slots, never insert content above what users already see, and tune font loading.
---

## What CLS is and why it grows

**CLS (Cumulative Layout Shift)** is a Core Web Vitals metric that measures how much content jumps around while someone uses a page. A visitor goes to tap a button, a banner suddenly appears above it, and the tap lands somewhere else. Google considers **0.1 or lower** a good score.

Almost every shift has the same root cause: **the browser does not know an element's size in advance**. It paints the page, then an image, ad or font arrives late, and everything below moves.

Note that shifts happening shortly after a user action (click, key press) are excluded. An accordion opening on click is fine. The problem is a page that moves on its own.

## How to find shifting elements

- **PageSpeed Insights** shows field data (from real Chrome users) and a lab test. Its diagnostics list the elements behind the largest shifts.
- **Chrome DevTools → Performance**: record a load and check the Layout Shifts track to see each shift and its element.
- **Rendering → Layout Shift Regions** in DevTools highlights shifted areas in blue right on the page.
- **Search Console → Core Web Vitals** groups URLs with problems based on real-user data.

Check both mobile and desktop: shifts are usually worse on narrow screens.

## Main causes and how to fix them

### Images and video without dimensions

The most common cause. Set `width` and `height` and modern browsers will compute the aspect ratio and reserve space before the file loads.

```html
<img src="/photo.jpg" width="1200" height="800" alt="Company office">
```

For responsive containers, use CSS `aspect-ratio`:

```css
.video-wrapper { aspect-ratio: 16 / 9; width: 100%; }
```

### Ad slots and embeds

Ads, maps, YouTube videos and social widgets load late and often without a known height.

- Give the container a **min-height** matching the most common ad size.
- Do not collapse the slot when no ad is served; keep the space or show a placeholder.
- For embeds, use a facade: a static preview of the right size, loading the real iframe on click.

### Web fonts

When a fallback font is swapped for the downloaded one, line widths change and text reflows.

- Preload key fonts with `<link rel="preload">`.
- Use `font-display: optional` for secondary fonts, or `swap` with a well-matched fallback.
- Align fallback metrics with `size-adjust` and `ascent-override` in `@font-face` so the swap is barely visible.
- Self-host fonts and load only the weights you use.

### Banners, notices and cookie bars

A block that JavaScript inserts at the top of the page after load pushes all content down.

- Display such elements **over the content** (`position: fixed`), not in the document flow.
- If the block must be in the flow, reserve its space in the initial HTML.
- Never insert new content **above** what the user is already looking at.

### Animations

Animate `transform` and `opacity`, not `top`, `height` or `margin`. Changing geometry properties triggers layout and can count as a shift.

## Pre-release checklist

- Every `img`, `video` and `iframe` has dimensions or `aspect-ratio`.
- Ad and dynamic blocks have a `min-height`.
- Fonts are preloaded and the fallback is metric-matched.
- Banners and popups do not push content down.
- Skeletons match the height of the real content.
- The page has been checked at mobile width.

## Common mistakes

- **Testing only in the lab.** Lighthouse measures the load, while real shifts often happen during scrolling and feed loading.
- **Lazy-loading without dimensions.** Lazy images without `width`/`height` guarantee shifts on scroll.
- **Wrong-height skeletons.** A 200px placeholder replaced by a 400px block is still a shift.

## FAQ

### How fast will CLS update in Search Console after a fix?

Field data is collected over a rolling window of roughly 28 days, so improvement shows gradually. The lab test in PageSpeed Insights reflects changes immediately.

### Does CLS affect search rankings?

Core Web Vitals are part of the page experience signals, but content relevance matters more. A good CLS mainly helps user behavior and conversion rather than producing a direct ranking jump.

### Should I fix the shift when a menu opens on click?

No. Changes right after a user action are excluded from CLS. Just make sure the response is fast.
