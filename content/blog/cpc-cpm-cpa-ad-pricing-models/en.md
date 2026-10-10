---
title: CPC, CPM, CPA: How Online Ad Pricing Models Work
description: What CPC, CPM and CPA mean, how the ad auction sets the price, where CTR and CPL fit in, and which pricing model to choose for each campaign goal.
summary: CPM means paying per thousand impressions, CPC per click and CPA per target action. In every model the price is set by an auction that weighs your bid against predicted ad quality, and the right model depends on your goal: reach, traffic or conversions.
---

## The short answer

| Model | What you pay for | Best for |
|---|---|---|
| **CPM** (cost per mille) | Every 1,000 impressions | Reach and awareness |
| **CPC** (cost per click) | A click on the ad | Website traffic |
| **CPA** (cost per action) | A target action: lead, purchase, install | Sales and leads |

There are also narrower variants: **CPV** (per video view), **CPI** (per app install), **CPL** (per lead). They are essentially versions of CPA or CPM tied to a different event.

## How the metrics connect

All models convert into one another through two ratios:

- **CTR** (click-through rate) = Clicks / Impressions × 100%
- **CR** (conversion rate) = Actions / Clicks × 100%

From this:

- **CPC** = CPM / (1,000 × CTR)
- **CPA** = CPC / CR
- **CPL** = Spend / Number of leads, a special case of CPA where the action is a lead

An illustrative example: CPM $5, CTR 1%, site conversion rate 5%.

- CPC = $5 / (1,000 × 0.01) = **$0.50**
- CPA = $0.50 / 0.05 = **$10**

The takeaway: at the same impression price, you can lower cost per lead by raising CTR (a better ad) or conversion rate (a better site). Working on creatives and landing pages is working on ad cost too.

## How the auction works

Ad placements on Google, Meta, TikTok and other platforms are sold through an **auction** that runs for each impression. The principle is similar across platforms:

1. You set a **bid** or a strategy, such as "maximize conversions" or "target cost per action".
2. The platform evaluates the ad's **quality and relevance** and **predicts the likelihood** of a click or conversion for the specific user.
3. The winner is not whoever pays most, but whoever has the best combination of bid and prediction. The platform benefits more from showing an ad people will click than an expensive one they will scroll past.
4. The winner usually pays not its maximum bid but roughly what is needed to beat competitors.

That is why a high-quality ad with a strong CTR can cost less than a competitor's ad with a higher bid.

## Optimizing for actions is not paying for actions

A common confusion. You can choose a **conversion-optimized** strategy or a **target cost per action**, and the algorithm will look for people more likely to buy. But you will often still be charged for **impressions or clicks**. Target CPA is guidance for the algorithm, not a guaranteed price.

Platforms offer true pay-per-action billing only in limited cases and with conditions; the pure CPA model is more common in affiliate marketing and CPA networks.

## Which model to choose

- **You need reach** (brand launch, announcement, video): **CPM** or CPV. Track reach, frequency and cost per thousand unique users.
- **You need traffic** (filling a site, testing a landing page): **CPC**. Watch visit quality, not just click price.
- **You need leads and sales**: **conversion-optimized strategies**. They depend on conversions being passed correctly to the ad platform through a pixel or server-side integration.
- **Little conversion data**: the algorithm has nothing to learn from. Start by optimizing for clicks or a more frequent event (such as add to cart), then move to the target event.

## Common mistakes

- Comparing campaigns by CPC when the goal is sales. A cheap click may never convert.
- Setting target CPA too low, so the campaign stops getting impressions.
- Changing bids and settings daily without letting the algorithm learn.
- Not sending conversions to the ad account and optimizing blind.

## FAQ

### Why is CPM higher in one niche than another?

Impression price depends on competition for the audience: the more advertisers want to reach the same people, the more expensive the auction. Season, location, format and your ad quality also matter.

### Which is better, CPC or CPM?

Neither is better on its own. Convert both into CPA using the formulas above and compare the final cost of the result you need.

### What is CPL and how is it different from CPA?

CPL is the cost per lead, meaning a form submission or contact. CPA is broader: the action can be a purchase, install or registration. CPL is a special case of CPA.
