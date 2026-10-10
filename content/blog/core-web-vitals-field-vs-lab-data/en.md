---
title: Core Web Vitals Field vs Lab Data: CrUX, Lighthouse and RUM
description: Why Lighthouse and Search Console disagree, how the 28-day CrUX window works and how to set up real user monitoring (RUM) to track your fixes.
summary: Lighthouse measures one load in artificial conditions, while Search Console shows real Chrome users over 28 days at the 75th percentile, so the numbers differ; to track fixes you need your own RUM.
---

## Why the numbers differ

**Lab data** (Lighthouse, the diagnostics section of PageSpeed Insights) is a single page load on an emulated device with a fixed network speed. **Field data** (CrUX, Search Console) is what real Chrome users actually experienced on their own devices and networks.

They diverge for several reasons:

- **Different devices and networks.** Real users range from powerful phones on fast connections to old phones on slow networks.
- **Cache and repeat visits.** The lab usually loads the page cold, while real visitors often have cached resources.
- **Behaviour.** The lab does not click, scroll or wait — yet layout shifts and slow responses often happen during interaction.
- **INP is not measured in the lab.** Interaction to Next Paint needs real interactions; Lighthouse shows only a proxy, **Total Blocking Time**.

Search engines rely on **field data** for ranking. Lab data is for debugging.

## How CrUX works

**Chrome UX Report (CrUX)** is a public performance dataset collected from Chrome users who opted in to sending usage statistics.

- **Rolling 28-day window.** Each day a new day is added and the oldest one drops off. That is why results in Search Console change gradually after a fix, not immediately.
- **75th percentile.** A page counts as "good" if the metric meets the threshold for at least 75% of visits.
- **Traffic threshold.** If a page lacks enough data, CrUX falls back to origin-level data or shows nothing.
- **Grouping in Search Console.** The report groups similar URLs, so one template problem affects many pages at once.

## Comparing the sources

| Source | Type | What it gives | Limitations |
|---|---|---|---|
| Lighthouse | Lab | Root causes, reproducibility | One load, no INP |
| PageSpeed Insights | Field + lab | Quick CrUX snapshot and diagnostics | Needs enough traffic |
| Search Console | Field (CrUX) | URL groups, search status | 28-day lag, few details |
| Your own RUM | Field | All pages, segments, fast feedback | Needs setup and data storage |

## How to set up RUM

**Real User Monitoring** collects metrics directly in your visitors' browsers. It shows the effect of a fix within days instead of waiting for the 28-day window.

The simplest route is the `web-vitals` library from the Chrome team:

```js
import { onLCP, onINP, onCLS } from 'web-vitals';

function send(metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    page: location.pathname,
  });
  navigator.sendBeacon('/api/vitals', body);
}

onLCP(send);
onINP(send);
onCLS(send);
```

Then:

1. **Store the data** in your analytics or database along with page type, device and connection type.
2. **Calculate the 75th percentile**, not the average — that way you see the metric the same way CrUX does.
3. **Segment** by page template and by mobile vs desktop.
4. **Annotate releases** on the chart to see the effect of each change.
5. **Use attribution** (the `web-vitals/attribution` build) to learn which element became the LCP or which interaction caused poor INP.

## A workflow for fixes

1. Find the problem URL group in Search Console.
2. Confirm the issue and its segment in RUM.
3. Reproduce it and find the cause in Lighthouse and DevTools.
4. Ship the fix and check RUM a few days later.
5. Wait for CrUX to update and click "Validate fix" in Search Console.

## Common mistakes

- Optimising for a perfect Lighthouse score while ignoring field data.
- Expecting Search Console to change the day after a release.
- Looking only at desktop when most traffic is mobile.

## FAQ

### Why is my Lighthouse score perfect while Search Console reports problems?

Lighthouse measures one load in ideal conditions. Real users on slower devices, interacting with the page, get a different experience — and that is what CrUX records.

### How soon will Search Console reflect a fix?

The data updates gradually across the 28-day window. To avoid waiting blindly, check the effect in your own RUM within a few days.

### Do I need RUM if I have CrUX?

For a small site CrUX may be enough. RUM is worth it when you need to see every page, every segment and the effect of releases quickly and in detail.
