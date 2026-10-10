---
title: What Are Core Web Vitals: LCP, INP and CLS Explained
description: A plain guide to Core Web Vitals: what LCP, INP and CLS measure, which values count as good or poor, and where to check them for your site.
summary: Core Web Vitals are three Google metrics for loading speed (LCP), responsiveness (INP) and visual stability (CLS). Good values are LCP under 2.5 s, INP under 200 ms and CLS under 0.1.
---
## The short answer

**Core Web Vitals** are a set of three metrics Google uses to describe the real user experience of a page:

- **LCP** (Largest Contentful Paint) — how fast the main content appears;
- **INP** (Interaction to Next Paint) — how quickly the page responds to actions;
- **CLS** (Cumulative Layout Shift) — how much the layout jumps around while loading.

They are measured on data from real visitors (field data), not only in lab tests. A page passes when the thresholds are met at the **75th percentile** of visits — for most users, not on average.

## Thresholds

| Metric | Good | Needs improvement | Poor |
|---|---|---|---|
| LCP | up to 2.5 s | 2.5–4 s | over 4 s |
| INP | up to 200 ms | 200–500 ms | over 500 ms |
| CLS | up to 0.1 | 0.1–0.25 | over 0.25 |

## LCP: how fast the main content loads

LCP marks the moment the largest visible element above the fold is rendered — usually a banner, a product photo or a large heading.

What most often hurts LCP:

- a slow server response (high **TTFB**);
- heavy, uncompressed images in old formats;
- render-blocking CSS and JavaScript;
- a hero image that is lazy-loaded (`loading="lazy"`) or injected by a script.

## INP: how responsive the interface is

INP measures the delay between a user action (click, tap, key press) and the next frame painted on screen. In 2024 INP replaced the older FID metric because it accounts for all interactions during a visit, not just the first one.

Typical causes of poor INP:

- long JavaScript tasks blocking the main thread;
- heavy third-party scripts: widgets, chats, trackers;
- unnecessary re-renders in React and other frameworks;
- event handlers that do too much work at once.

## CLS: how stable the layout is

CLS adds up unexpected element shifts. The classic case: you are about to tap a button, a banner loads above it, and you hit something else.

How to prevent shifts:

- set `width` and `height` (or `aspect-ratio`) on images and videos;
- reserve space for ads, embeds and cookie banners;
- load fonts so that swapping does not change text size;
- never insert content above what is already visible without a user action.

## How Core Web Vitals affect rankings

Core Web Vitals are part of Google's **page experience** signals. Keep the scale in mind: they are not the main factor. Relevant, useful content still matters more, and a fast page with weak content will not outrank a strong but slower one.

Where the metrics really make a difference:

- when competitors are close in quality;
- in conversion: a slow, jumpy site loses leads regardless of its position;
- on mobile devices and weak connections, where problems are most visible.

## Where to check them

- **PageSpeed Insights** — field data (when there is enough traffic) plus a Lighthouse lab test for a specific URL.
- **Google Search Console**, Core Web Vitals report — groups of pages with problems across the site.
- **Chrome DevTools**, Performance panel — to find specific causes.
- **The web-vitals library** — to collect metrics from real users into your own analytics.

Remember that a lab test is a single load on an emulated device. Judge results by field data and use lab tools for diagnosis.

## Common mistakes

- **Optimizing only the home page.** Users land on product pages and articles too — check every page template.
- **Chasing a Lighthouse score of 100.** The Lighthouse score is not Core Web Vitals; what counts are thresholds on real data.
- **Expecting instant results.** Field data is aggregated over roughly 28 days, so improvements show up with a delay.

## FAQ

### Do all three metrics need to be green?

Yes. A page passes the assessment only when all three metrics are in the good range at the 75th percentile. Start with the one that lags the most.

### Why does PageSpeed Insights show no field data?

Field data comes from the Chrome UX Report, which only covers pages and sites with enough real traffic. New or low-traffic pages get only the lab assessment.

### Do Core Web Vitals matter for Yandex?

Yandex does not use Core Web Vitals as an official metric set, but speed and usability shape user behaviour, and that affects results in any search engine.
