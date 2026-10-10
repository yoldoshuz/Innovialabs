---
title: How to Launch Instagram and Facebook Ads in Meta Ads Manager
description: Launching Instagram and Facebook ads in Meta Ads Manager: business portfolio, campaign objectives, ad sets, placements, budgets, creatives, pixel and review.
summary: First set up a business portfolio with an ad account, Page, Instagram account and pixel, then in Ads Manager pick a campaign objective, configure audience, placements and budget in the ad set, upload creatives in the right formats and check them against Meta's advertising standards.
---
## The short answer

Launching ads on Meta has two stages: **setting up the infrastructure** and **building the campaign** in Ads Manager.

1. Business portfolio: Facebook Page, Instagram account, ad account, payment method.
2. Pixel and events on your website — if the goal involves the site.
3. Campaign: objective.
4. Ad set: conversion location, audience, placements, budget and schedule.
5. Ad: creative, copy, link, button.
6. Ad review and the learning phase.

The Boost button under an Instagram post is faster but offers far fewer settings. For leads and sales, use Ads Manager.

## Business portfolio

A **business portfolio** (formerly Business Manager) is the hub for your company's assets in Meta Business Suite.

- Add your **Facebook Page** and connect your **Instagram professional account**.
- Create an **ad account**. Currency and time zone are hard to change later, so choose carefully.
- Add a **payment method**.
- Give employees and agencies access through roles rather than a shared login. Turn on **two-factor authentication** — it protects against hacks and restrictions.

## Pixel and events

If your ads lead to a website, Meta cannot optimize delivery without data about what people do there.

- Create a **pixel** (dataset) in Events Manager and install it on the site.
- Set up **standard events**: `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`, `Lead`, `CompleteRegistration`, `Contact`.
- Connect the **Conversions API** to send events from your server. It complements the pixel when browsers block scripts.
- **Verify your domain** in the business portfolio settings.

Example of a lead event fired after a successful form submission:

```javascript
fbq('track', 'Lead', { content_name: 'contact_form' });
```

## Campaign objective

| Objective | When to choose it |
|---|---|
| Awareness | Maximum reach and recall |
| Traffic | Visits to a website or profile |
| Engagement | Messages, video views, reactions |
| Leads | Sign-ups via instant forms, website or messaging apps |
| App promotion | Installs and in-app actions |
| Sales | Purchases and other valuable website actions |

Choose the objective by the action your business actually needs. The system optimizes exactly what you ask for: a Traffic objective brings people who click, not people who buy.

## Ad set

- **Conversion location:** website, messaging apps, instant form, calls.
- **Audience.** Set location, age and interests manually, or turn on Advantage+ audience, where your inputs become suggestions. For retargeting, use custom audiences: website visitors, people who engaged with your profile, customer lists.
- **Placements.** Advantage+ placements spread delivery across Facebook, Instagram, Messenger and Audience Network. Manual placements make sense if your creatives are not ready for every format.
- **Budget.** A campaign-level budget lets the system shift money between ad sets; an ad set budget gives you more manual control. A daily budget suits always-on ads, a lifetime budget suits promotions with an end date.

## Creatives

- Prepare formats for each placement: **1:1 or 4:5** for feeds, **9:16** for Stories and Reels.
- Keep key elements near the centre of vertical frames: the edges are covered by interface elements.
- The first seconds of a video should explain what it is about and work without sound.
- Add **UTM parameters** to your link so results show up in your analytics.
- Run several creative variants in one ad set and let the system find the best ones.

## Ad review: common rejection reasons

- **Personal attributes:** "Are you overweight?" Frame the message around the product, not assumptions about the person.
- **Before-and-after images** and unrealistic promises in health and appearance.
- **Special ad categories:** credit and financial services, employment, housing, social issues and politics must be declared.
- **Restricted goods:** alcohol, supplements, gambling and similar products follow separate rules and may need authorization.
- **Landing page mismatch:** broken link, a different offer, a site that does not load.
- **Third-party trademarks** and altered Instagram or Facebook logos.

## Learning phase

After launch an ad set goes through a **learning phase**. According to Meta's guidance, it needs around 50 optimization events within a week to exit. Significant edits — budget, audience, creative — restart learning, so batch your changes.

## FAQ

### Why was my ad rejected and what should I do?

The reason is shown in Ads Manager and in Account Quality. Fix the ad, or request another review if you believe the decision is wrong. Frequent rejections can restrict your account, so check copy before submitting.

### How much budget should I start with?

There is no universal amount. The budget should let the ad set collect optimization events. If there are too few, choose a more frequent event or combine ad sets.

### Do I need a website to advertise on Instagram?

No. You can send people to your profile, Direct, WhatsApp or an instant form. A website with a pixel is needed when you want to optimize for purchases and other on-site actions.
