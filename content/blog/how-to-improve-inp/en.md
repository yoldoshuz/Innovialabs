---
title: How to Improve INP: Making Your Site Respond Faster
description: How INP is measured, how to find slow interactions, and how to fix long tasks, heavy third-party scripts and expensive re-renders on your site.
summary: INP shows how quickly a page visually responds to clicks and typing. Improve it by breaking up long tasks, trimming third-party scripts and reducing the rendering work after each action.
---

## What INP is and how it is measured

**INP (Interaction to Next Paint)** is the Core Web Vitals metric for responsiveness. It looks at all clicks, taps and key presses during a visit and reports one of the slowest. **Up to 200 ms** is good; above 500 ms is poor.

Every interaction has three parts:

| Phase | What happens | Typical cause of delay |
|---|---|---|
| **Input delay** | Waiting for the main thread to be free | Other scripts already running |
| **Processing time** | Event handlers run | Heavy logic in onClick |
| **Presentation delay** | Style, layout and paint | Large DOM, mass re-renders |

Scrolling and hovering are not part of INP. The metric comes from real users, so a lab page-load test will not show it.

## How to find slow interactions

1. **Search Console → Core Web Vitals** shows which page groups have INP issues.
2. **PageSpeed Insights** gives the field INP for a specific URL.
3. **Chrome DevTools → Performance**: enable CPU throttling (4x or 6x), record, and repeat the action — clicking a filter, opening a menu, typing in search. The Interactions track shows duration and the phase breakdown.
4. **RUM collection**: the `web-vitals` library can send INP with the target element to your analytics, so you learn which exact button is slow for real users.

```js
import { onINP } from 'web-vitals/attribution';

onINP(({ value, attribution }) => {
  console.log(value, attribution.interactionTarget);
});
```

Test on low-end devices: problems often stay hidden on a powerful laptop.

## Fixing long tasks

A **long task** is any block of JavaScript over 50 ms. While it runs, the browser cannot respond to input.

- **Split work into chunks** and yield to the browser between them. The modern way is `scheduler.yield()`; the fallback is `setTimeout(resolve, 0)`.
- **Update the UI first, compute later.** Show feedback for the click (spinner, state change), then run analytics, saving and heavy calculations.
- **Move computation to a Web Worker**: sorting large arrays, parsing, data processing.
- **Debounce** search input and filters so a request is not fired on every keystroke.

```js
async function handleClick() {
  showSpinner();
  await scheduler.yield();
  runHeavyWork();
}
```

Check `scheduler.yield()` support in your target browsers and add a fallback.

## Third-party scripts

Chats, pixels, tag managers, A/B tests and widgets occupy the main thread right when the user tries to tap something.

- Run an **audit**: in the DevTools Performance panel, group time by domain.
- Remove what nobody uses.
- Load non-critical scripts with `defer` or after the first interaction.
- Show a chat widget as a lightweight button and load it fully on click.

## Expensive re-renders

Even a fast handler can cause a slow paint.

- **Shrink the DOM.** Thousands of nodes make style recalculation expensive. Virtualize long lists.
- **In React**, avoid unnecessary re-renders: keep state close to where it is used, apply `memo`, and use `useTransition` for non-urgent updates.
- **Avoid layout thrashing**: alternating size reads (`offsetHeight`) and style writes in a loop.
- Use `content-visibility: auto` for off-screen sections.

## Common mistakes

- Optimizing only the load and ignoring what happens after it.
- Testing on a powerful machine without CPU throttling.
- Adding scripts through a tag manager without tracking their cost.

## FAQ

### How is INP different from FID?

FID measured only the input delay of the first interaction. INP covers all interactions and the full time until the next paint, so it reflects real responsiveness more accurately. INP replaced FID in Core Web Vitals.

### Why doesn't Lighthouse show INP?

A standard Lighthouse run only loads the page and never clicks. In the lab, watch Total Blocking Time, which correlates with INP, or use Timespan mode with manual interactions.

### What should I fix first?

Start with the most frequent actions on key pages: add to cart, filters, menus and forms. These are the interactions most likely to define your INP value.
