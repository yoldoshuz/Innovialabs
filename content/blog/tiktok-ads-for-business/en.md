---
title: How to Advertise on TikTok: TikTok Ads Manager for Business
description: How to set up TikTok Ads Manager campaigns: structure, native video creatives, Spark Ads, pixel events and which products and audiences perform well on TikTok.
summary: On TikTok, ads that look like regular videos win: set up the pixel with events, launch a conversion-optimized campaign, test several vertical videos and boost organic posts that already work with Spark Ads.
---
## The short answer: what you need to start

- A **TikTok Ads Manager** account and ideally a **Business Center** to manage company access and assets.
- A **TikTok Pixel** on your site with events configured (lead, purchase), or the Events API for server-side tracking.
- Several **vertical 9:16 videos** shot in the platform's style.
- A campaign objective that matches the business goal: sales, leads, traffic or app installs.

Before launch, check that ad delivery is available in your target country: TikTok's advertising tools vary by country.

## How a campaign is structured

The structure mirrors other ad platforms:

1. **Campaign** — the objective: reach, traffic, video views, community interaction, lead generation, website conversions, app promotion.
2. **Ad group** — audience, placements, budget, schedule, optimization event and bid strategy.
3. **Ad** — video, text, call to action, link.

Practical tips:

- For sales and leads, choose an objective that **optimizes for a pixel event**, not for clicks.
- Start with a **broad audience** (country, age) once the pixel receives conversions; narrow interests at the start only make impressions more expensive.
- TikTok offers automated campaigns (Smart+), where the algorithm picks the audience and creative combinations. They are handy when you have many creatives and little time for manual setup.

## Principles of native creative

People scroll TikTok for entertainment, so TV-style ads get skipped instantly.

- **The first seconds decide everything**: show the problem, the result or a surprising moment right away.
- **Shoot on a phone**, with a real person on screen, natural light and natural speech.
- **Sound is on**: voice, a trending but licensed sound, and captions for people watching muted.
- **Safe zone**: keep text and key details away from the bottom and right edge, where the interface covers them.
- One video, **one idea** and one call to action.
- Make **variations**: the same video with different opening frames and copy.

## Spark Ads

**Spark Ads** boost an organic video that is already published, either from your own account or from a creator who gave you an **authorization code**. Likes, comments and follows stay on the original post and account.

When it helps:

- working with creators: the video is published by the creator and you promote it with your budget;
- an organic video has already performed well, so scaling it makes sense;
- you want the ad to look as natural as possible.

## Pixel and events

The pixel tells TikTok what a user did on your site. The main standard events are `ViewContent`, `AddToCart`, `InitiateCheckout`, `CompletePayment`, `SubmitForm`, `CompleteRegistration` and `Contact`.

Example of a purchase event:

```javascript
ttq.track('CompletePayment', {
  value: 25,
  currency: 'USD',
  contents: [{ content_id: 'sku-123', quantity: 1 }]
});
```

Check events in **Events Manager** before launch and always pass value and currency — without them you cannot optimize for revenue. For reliability, add the **Events API** alongside the pixel, especially when accurate purchase data matters.

## What performs well on TikTok

- Products that are **easy to show on video**: cosmetics, clothing, accessories, food, home goods.
- Impulse purchases and **accessible prices**.
- Apps, online education, delivery services, events.
- Brands that need awareness among younger audiences.

Harder: long B2B sales cycles with several decision-makers. There, TikTok works mostly for awareness, and leads are better captured through search and other channels.

## FAQ

### How many videos do I need to launch?

At least 3-5 different videos per ad group so the algorithm has options. Creatives fatigue quickly on TikTok, so prepare new ones regularly.

### Can I advertise without a website?

Yes. There are in-app lead forms, profile promotion and links to messengers. For sales optimization, though, a site with a pixel provides more data.

### How are Spark Ads different from regular ads?

A regular ad exists only as an ad. Spark Ads promote a real post, so engagement accumulates on the account and the video looks like organic content.
