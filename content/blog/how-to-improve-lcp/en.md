---
title: How to Improve LCP: Speeding Up the Largest Contentful Paint
description: How to find the LCP element and speed it up: server response time, render-blocking resources, image priority, preloading and fonts, step by step.
summary: Find the LCP element, see which of its four phases takes the most time and fix that one: speed up the server, remove render-blocking resources, give the main image high priority and never lazy-load it.
---
## The short answer: what LCP is and how to improve it

**LCP (Largest Contentful Paint)** is the time it takes the browser to render the largest visible element in the first screen: usually the hero image, a banner or a large heading. Google's guidance treats **2.5 seconds or less** for most visits as a good result.

Improving LCP is not a general cleanup. First find the element, then find the stage where time is lost.

## Step 1. Find the LCP element

- **PageSpeed Insights** shows the LCP element and field data from real users when there is enough traffic.
- **Chrome DevTools → Performance**: record a page load and the timings track will show an LCP marker linked to the element.
- The **Core Web Vitals** report in Search Console shows groups of pages with problems.

Test the mobile version: the LCP element often differs there, and the network and CPU are slower.

## Step 2. Break LCP into phases

| Phase | What happens | Typical cause of delay |
|---|---|---|
| **TTFB** | Waiting for the first byte of HTML | Slow server, no caching, distant hosting |
| **Resource load delay** | From TTFB to the image starting to load | Image discovered late, via CSS or JS |
| **Resource load duration** | Downloading the file itself | Heavy image, poor format |
| **Element render delay** | From download to display | Blocking CSS/JS, fonts, hydration |

Fix whichever phase takes the most time.

## Speed up the server response

- Cache HTML: static generation or caching at the server and CDN level.
- Put the server or CDN closer to your audience.
- Remove unnecessary redirects: each one adds a network round trip.
- Optimize slow database queries on critical pages.

## Remove render-blocking resources

- Load scripts with `defer` or `async` when they do not need to run before rendering.
- Inline critical CSS for the first screen and load the rest later.
- Drop unused libraries and third-party widgets from the first screen.
- Do not hide the main content behind JavaScript: if a heading or image appears only after a script runs, LCP grows.

## Prioritize the main image

The most common mistake is `loading="lazy"` on a first-screen image. Lazy loading is for images further down; the LCP element needs the opposite, high priority:

```html
<img src="/hero.avif" width="1200" height="600"
     fetchpriority="high" alt="Description">
```

If the image is a CSS background, the browser discovers it late. Make it a regular `<img>` or add a preload:

```html
<link rel="preload" as="image" href="/hero.avif" fetchpriority="high">
```

Also:

- use modern formats such as **WebP** or **AVIF**;
- serve the right size for the screen with `srcset` and `sizes`;
- avoid fade-in animations that keep the element hidden until a script finishes.

## Tune your fonts

If the LCP element is text, a web font download can delay it.

- Use `font-display: swap` so text shows immediately in a system font.
- Preload only one or two key font files.
- Self-host fonts and include only the character subsets you need.

## How to check the result

Lab tests show the effect immediately, but Google's assessment is based on **field data** from real users over recent weeks. Compare lab measurements after changes, and expect the improvement in Search Console with a delay.

## FAQ

### Why is LCP good in PageSpeed Insights but poor in Search Console?

A lab test is a single run under fixed conditions. Search Console shows data from real users with different devices and networks, which are often slower.

### Does a CDN improve LCP?

Yes, when the problem is TTFB or file download speed for a distant audience. If blocking scripts delay LCP, a CDN alone will not fix it.

### Should I preload every image?

No. Preload raises priority, and preloading many resources makes them compete with each other. Use it only for the LCP element.
