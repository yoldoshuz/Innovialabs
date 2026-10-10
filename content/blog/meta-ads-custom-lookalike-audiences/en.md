---
title: Meta Ads Targeting: Custom and Lookalike Audiences Explained
description: How to build Meta Ads audiences from site visitors, customer lists and engagement, how lookalikes work and when broad targeting beats detailed targeting.
summary: Custom audiences are people who already know you (site, customer list, social engagement), lookalikes are new people who resemble them, and once your pixel has enough conversions, broad targeting often performs as well as manual targeting.
---
## The short answer: three ways to reach people

Meta Ads Manager gives you three layers of targeting:

- **Custom Audiences** — people who have already interacted with you: visited your site, sit in your CRM, watched your videos or messaged you on Instagram.
- **Lookalike Audiences** — new people the algorithm considers similar to a source you choose.
- **Broad and detailed targeting** — location, age, gender, interests, or almost no restrictions at all, letting the algorithm find the audience.

Use custom audiences for retargeting and exclusions, lookalikes for scaling, and broad targeting once your pixel has collected enough conversion data.

## Custom audiences: where to build them from

**Website visitors.** You need the **Meta Pixel** on your site, ideally combined with the **Conversions API**, which sends events server-side and depends less on ad blockers and browser restrictions. Then, in the Audiences section, create rules such as:

- all visitors within a chosen time window;
- visitors to specific pages (product pages, pricing);
- people who fired an event: `AddToCart`, `Lead`, `InitiateCheckout`;
- exclusions, for example "added to cart but did not purchase".

**Customer list.** Upload a CSV with phone numbers and emails from your CRM. Meta hashes the data before matching. To improve the match rate:

- use international phone format with the country code (for Uzbekistan, `998...`);
- include several identifiers: phone, email, name, country;
- split lists by meaning: all customers, repeat buyers, churned customers.

**Engagement.** You can build audiences from people who watched your videos, interacted with your Instagram account or Facebook Page, or opened a lead form without submitting it. This is the warmest source for businesses without a website.

## How lookalike audiences work

You pick a **source** (a custom audience), a country and a size expressed as a percentage of that country's population. The algorithm then finds people with similar behavioral signals.

What matters in practice:

- **Source quality beats source size.** A list of real buyers gives better results than "all site visitors".
- Meta requires at least 100 people from one country in the source, but a source that small produces a blurry lookalike. Aim for a thousand people or more.
- **A smaller percentage stays closer to the source**; a larger one gives more reach and less precision.
- For some campaign objectives Meta may expand beyond your lookalike when it expects better results. Check the Advantage settings in the ad set.

## When broad targeting beats detailed targeting

| Situation | What to use |
|---|---|
| Pixel receives conversions regularly, mass-market product | Broad targeting or Advantage+ audience |
| Little data, new pixel | Lookalikes and interests |
| Narrow B2B niche, small budget | Detailed targeting and custom audiences |
| Bringing warm users back | Custom audiences |
| Hiding ads from existing customers | Customer list exclusions |

The logic of broad targeting: the algorithm optimizes for an event (a lead, for example) and finds the people who complete it. In that setup **your creative effectively defines the audience** — the ad is delivered to whoever finds it relevant. Detailed interests often just shrink reach and raise the cost of impressions.

## Common mistakes

- Retargeting and cold audiences mixed in one ad set, so you cannot tell what works.
- No exclusions: buyers keep seeing ads for what they already bought.
- A lookalike built from all visitors, including random traffic.
- An audience that is too narrow for a small budget, leading to expensive impressions and a long learning phase.
- A pixel that fires events without parameters, so action-based audiences cannot be built.

## FAQ

### What is the best source for a lookalike audience?

People who completed your goal action: paying customers or qualified leads from your CRM. The closer the source is to your objective, the more accurate the lookalike.

### How long do website visitor audiences last?

You set the retention window when creating the audience, up to 180 days. The audience updates automatically: new visitors are added and people past the window drop out.

### Do I need a website to use custom audiences?

No. You can work with customer lists and engagement audiences from Instagram and Facebook. A site with a pixel, however, gives you more data for optimization and retargeting.
