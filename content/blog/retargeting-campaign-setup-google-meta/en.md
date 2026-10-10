---
title: How to Set Up Retargeting in Google Ads and Meta Ads
description: Step-by-step retargeting in Google Ads and Meta Ads: behaviour-based segments, membership windows, exclusions, frequency caps and creative per segment.
summary: Retargeting works when you split visitors by intent (cart, pricing page, visit depth), give each segment its own window and creative, exclude buyers and cap how often people see your ads.
---
## The short answer

**Retargeting** shows ads to people who have already visited your website or app. To make it generate leads rather than annoy people, you need five things:

1. A working tag: the **Google tag** for Google Ads and the **Meta Pixel** (ideally with the Conversions API) for Meta.
2. **Behaviour-based segments**, not a single "all visitors" audience.
3. A **membership window** that matches the decision cycle in your niche.
4. **Exclusions**: buyers, people who already submitted a form, employees.
5. **Frequency caps** and dedicated creative for each segment.

## Step 1. Check your data collection

No events, no segments. Make sure the tag fires on every page and sends the key events: product view, add to cart, checkout start, purchase or form submission. Verify with **Tag Assistant** for Google and **Events Manager** for Meta.

Handle cookie consent and your privacy policy properly: both platforms require lawful data collection, and personalised advertising is restricted for sensitive topics such as health or financial hardship.

## Step 2. Segment the audience by intent

The closer someone is to buying, the more valuable the segment. A practical setup:

| Segment | Condition | What to show |
|---|---|---|
| Abandoned cart | Added to cart, did not buy | The product itself plus answers to doubts: delivery, warranty, payment |
| Pricing page | Viewed plans or the price list | Plan comparison, a case study, a consultation offer |
| Deep visit | Several pages or long time on site | Core advantage, reviews, a useful resource |
| Quick bounce | One page, short visit | A soft brand introduction, no hard offer |

In **Google Ads** you build these in the audience manager (your data segments) using URL rules or events. In **Meta** you use website custom audiences, which let you combine events, URLs and time spent on site.

## Step 3. Set membership windows

The **membership duration** is how many days a person stays in the audience after the action. The logic:

- **Cart and checkout** — a short window, usually days to a couple of weeks: these decisions happen fast.
- **Pricing page** — a medium window, tied to your sales cycle.
- **General visitors** — a long window, especially for expensive services and B2B.

Mind the limits: Meta caps the retention period for website audiences, while Google allows a much longer one. Check current values in each platform's help centre. A window that is too short produces a tiny audience that may not serve at all because of minimum size requirements.

## Step 4. Configure exclusions

Exclusions save more budget than any bidding tweak:

- **Buyers** are excluded from the cart segment for as long as a repeat purchase is unlikely.
- **Hot segments** are excluded from colder ones so one person does not land in several campaigns and see conflicting messages.
- **Form submitters** are excluded from all lead generation campaigns.
- **Employees and contractors** via a list, or by IP where available.

## Step 5. Cap the frequency

Retargeting burns through a small audience quickly. In Google, frequency caps are set at campaign level for Display and Video campaigns. In Meta, direct frequency control is available in Reach campaigns; elsewhere, monitor the **Frequency** metric and refresh creative.

Signs of fatigue: rising frequency, falling CTR, more expensive conversions, negative comments.

## Step 6. Match creative to the segment

One "Come back to us" banner for everyone is the main reason retargeting underperforms. For each segment:

- **Cart** — the exact product (dynamic retargeting via a Merchant Center feed or a Meta catalog) and removal of purchase barriers.
- **Pricing** — value arguments, not the price repeated.
- **Deep visit** — social proof and a clear next step.
- **Cold** — usefulness and brand recognition.

Refresh creative regularly and test one variable at a time.

## Common mistakes

- One "all visitors, 180 days" audience with a single ad.
- No buyer exclusion, so ads follow customers after they have paid.
- Overlapping segments without exclusions, so campaigns compete with each other.
- Judging by last click only, ignoring that many of these people would have returned anyway.

## FAQ

### How many visitors do I need to start retargeting?

Each platform has a minimum audience size below which ads will not serve, and it differs by network. If a segment is too small, extend the membership window or merge similar segments.

### Which is better: retargeting in Google or in Meta?

They reach people in different places: Google on the Display Network, YouTube and Search, Meta in Instagram and Facebook feeds. Most businesses run both, separate them with exclusions and creative, and compare cost per lead.

### How do I know retargeting actually works?

Look at incremental lift, not just in-platform conversions: run a test with a holdout group (Conversion Lift in Meta, experiments in Google) or compare periods with similar traffic.
