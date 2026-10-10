---
title: Heatmaps and Session Recordings: How to Analyze User Behavior
description: What click, scroll and attention maps show, how to watch session replays in Webvisor and Clarity, which patterns to look for and how to fix what you find.
summary: Heatmaps show where users click, how far they scroll and where they linger, while session recordings show how one specific person moved through a page. Together they explain why your analytics numbers look the way they do and point to what to fix.
---

## What they are and why they matter

Standard analytics answers **"what happened"**: how many people came, how many left, what the conversion rate was. Heatmaps and session recordings answer **"why"**: what people saw, where they tried to click and where they got stuck.

- A **heatmap** is an aggregated view of many users' behavior overlaid on the page: the "hotter" the color, the more activity.
- A **session recording (session replay)** plays back one person's visit: cursor movement, clicks, scrolling and form input (with data masked).

Popular tools are **Webvisor** and maps in Yandex Metrica, **Microsoft Clarity** and Hotjar. Metrica and Clarity are free and are often used alongside GA4.

## Types of heatmaps

| Map | What it shows | Question it answers |
|---|---|---|
| **Click map** | Where people click, including non-clickable elements | Do they see the button, do they mistake text for a link |
| **Link map** (in Metrica) | Clicks on links and buttons | Which menu items and CTAs are actually used |
| **Scroll map** | What share of visitors reaches each part of the page | Where attention drops, whether a key block is seen |
| **Attention map** | Where people keep content on screen longest | Which blocks get read and which get skipped |

An attention map is built from how long each area stayed in the viewport, not from real eye tracking. It is an approximation, but a useful one.

## How to set them up

In Yandex Metrica, session recording and the click map are enabled via counter options:

```js
ym(COUNTER_ID, 'init', {
  webvisor: true,
  clickmap: true,
  trackLinks: true,
  accurateTrackBounce: true
});
```

In Clarity, create a project and add its script to the site or install it through Google Tag Manager. Details are in the official [Clarity documentation](https://learn.microsoft.com/en-us/clarity/).

Mind privacy: password and personal data fields must be masked, and your privacy policy should mention behavioral data collection.

## Patterns to look for

- **Clicks on non-clickable elements.** People tap an image, icon or underlined text and nothing happens. The element looks like a link.
- **Rage clicks** — rapid repeated clicks in one spot. Usually a broken button, slow response or unclear loading state.
- **Dead clicks** — a click with no interface response at all.
- **A sharp drop on the scroll map.** Most visitors never reach a key block: it sits too low, or there is a "false bottom" above it — a block that looks like the end of the page.
- **Erratic scrolling and backtracking.** People scroll up and down looking for information that is missing or hidden.
- **Abandoned forms.** Recordings show which field people stop at before leaving. Metrica also has a dedicated form analysis report.
- **Different behavior on mobile.** Always split maps by device: on a phone a button may end up under a banner or off screen.

## How to turn findings into fixes

1. **Start with a question, not with watching everything.** For example: "Why is the mobile bounce rate high on the pricing page?"
2. **Filter the right sessions**: by page, device, source, or users who did not reach the goal.
3. **Watch 15–20 recordings** and note recurring problems. One odd session is not a pattern.
4. **Cross-check with the heatmap** and analytics numbers to gauge the scale.
5. **Write a hypothesis**: "If we move the form higher and remove two fields, more people will submit it."
6. **Ship the change and measure it** — by comparing periods or with an A/B test.
7. **Recheck the maps** afterward: has the pattern disappeared?

## Common mistakes

- Drawing conclusions from one or two recordings.
- Reading a map built on a tiny sample: with a few dozen visits the picture is random.
- Mixing desktop and mobile in one map.
- Forgetting that dynamic elements (sliders, pop-ups) can distort click maps.
- Collecting recordings and never reviewing them.

## FAQ

### Webvisor or Clarity — which should I choose?

If you already use Yandex Metrica, Webvisor and maps are enabled in the same counter. Clarity pairs well with GA4 and highlights rage and dead clicks automatically. Both are free, and you can run them together as long as they do not slow the site down.

### Do these tools slow down my site?

The scripts load asynchronously and usually do not block rendering, but any third-party code adds load. Install only the tools you actually use.

### How many recordings should I watch?

Usually 15–20 sessions for one scenario are enough to spot recurring issues. If nothing new appears after the tenth recording, move on to fixes.
