---
title: Website Speed Optimization Checklist for Developers
description: A practical website speed checklist covering server, network, JS, CSS, fonts, images and third-party scripts, plus how to measure each step.
summary: Measure first (Lighthouse plus field Core Web Vitals data), then work through server response, network, images, JS, CSS, fonts and third-party scripts, re-measuring after every change.
---

## The short answer: where to start

Site speed is not one setting but a chain: the server responds, the browser downloads resources, parses and runs code, then paints the page. Optimize the link that is actually slow for you. The order is always the same:

1. **Measure** — in the lab and on real users.
2. **Find the biggest bottleneck** — using LCP, INP, CLS and TTFB.
3. **Fix one thing** and **measure again**.

Below is a checklist by layer, with a way to verify each item.

## How to measure

- **Lab data**: Lighthouse and the Performance panel in Chrome DevTools. Great for debugging, but it is a single simulation.
- **Field data**: the Core Web Vitals report in Google Search Console, CrUX, or your own collection via the `web-vitals` library. This is what real users experience.
- **Waterfall**: the Network panel in DevTools or WebPageTest shows what loads, in what order and what blocks rendering.

Test with network and CPU throttling: on a fast laptop almost any site feels fast.

## Server response (TTFB)

- [ ] Cache HTML where possible: static generation, ISR, CDN or reverse-proxy caching.
- [ ] Check slow database queries and external API calls on the critical rendering path.
- [ ] Enable **Brotli** or gzip compression for text resources.
- [ ] Use **HTTP/2 or HTTP/3** and a CDN close to your audience.

How to check: TTFB in DevTools (the document's Timing tab), server logs and APM.

## Network and caching

- [ ] Hashed static files are served with a long `Cache-Control: public, max-age=31536000, immutable`.
- [ ] Critical third-party origins have `preconnect`.
- [ ] No redirect chains (http → https → www → final URL).
- [ ] The LCP resource (usually the hero image) is discovered early — use `fetchpriority="high"` or `preload` if needed.

## Images

- [ ] Modern formats: **WebP** or **AVIF**.
- [ ] Responsive sizes via `srcset` and `sizes`.
- [ ] `loading="lazy"` for below-the-fold images — but **not** for the LCP image.
- [ ] `width` and `height` are set to prevent layout shift (CLS).

How to check: Lighthouse audits "Properly size images" and "Serve images in next-gen formats".

## JavaScript

- [ ] Analyze the bundle with a bundle analyzer and remove heavy or unused dependencies.
- [ ] **Code splitting**: page code and heavy widgets load on demand.
- [ ] Non-critical scripts use `defer` or `async`.
- [ ] Long tasks are broken up; heavy computation moves to the server or a Web Worker — this directly affects **INP**.

How to check: Coverage and Performance in DevTools, the "Reduce unused JavaScript" audit.

## CSS

- [ ] Unused styles are removed (by your build tooling or tools like PurgeCSS).
- [ ] Critical above-the-fold CSS is not blocked by one huge shared file.
- [ ] No heavy animations of layout-triggering properties; animate `transform` and `opacity`.

## Fonts

- [ ] **WOFF2** format, only the weights and character sets you need (subsetting).
- [ ] `font-display: swap` or `optional` so text is never invisible.
- [ ] The main font is preloaded or self-hosted.
- [ ] Fallback font metrics are tuned so the swap does not cause CLS.

## Third-party scripts

- [ ] List them all: analytics, chats, pixels, widgets. Remove what nobody uses.
- [ ] Load them after the main render or on interaction (for example, chat on click).
- [ ] Replace embedded videos and maps with a lightweight preview placeholder.

How to check: "Reduce the impact of third-party code" in Lighthouse, grouping by domain in the Network panel.

## Common mistakes

- Optimizing based on one Lighthouse run instead of field data.
- Putting `loading="lazy"` on the hero image, which makes LCP worse.
- Changing ten things at once and not knowing what worked.
- Forgetting about mid-range mobile devices.

## FAQ

### Which metric matters most?

It depends on the problem. LCP reflects perceived loading, INP responsiveness and CLS visual stability. Start with whichever is worst in your field data.

### Do I need a Lighthouse score of 100?

No. The score is a guide for lab testing. What matters more is that real users stay within the "good" Core Web Vitals thresholds.

### How often should I check performance?

After every significant release and whenever new third-party scripts are added. Adding Lighthouse CI or performance budgets to your pipeline makes this automatic.
