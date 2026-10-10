---
title: What Is Conversion Rate and How to Calculate It Correctly
description: What a website conversion rate is, how macro and micro conversions differ, which formulas to use and which calculation mistakes distort the result.
summary: Conversion rate is the share of visits or users that complete a target action: target actions divided by visits or users, times 100%; what matters most is deciding upfront which action counts and what goes in the denominator.
---
## The short answer

**Conversion rate** is the share of people (or visits) that complete the action you care about: submit a request, buy, call, subscribe. It is expressed as a percentage.

The basic formula:

```text
Conversion rate = Target actions / Visits (or users) × 100%
```

Example: a week brought 2,000 visits and 40 requests. The visit-based conversion rate is 40 / 2,000 × 100% = 2%.

On its own, the number says little. What matters is **which action** you count and **what sits in the denominator**.

## Macro and micro conversions

A **macro conversion** is the main action the site exists for: a purchase, a paid order, a submitted request, a phone call.

A **micro conversion** is an intermediate step that brings a person closer to the macro conversion:

- adding a product to the cart;
- viewing the pricing page;
- clicking the phone number or a messenger button;
- starting to fill in a form;
- subscribing to a newsletter or a Telegram channel.

Micro conversions help when macro conversions are rare: they show sooner which channel or page performs better. But optimizing only for them is risky — more button clicks mean nothing if requests did not grow.

## Common formulas

| Metric | Formula | When to use |
|---|---|---|
| Visit conversion rate | actions / visits | evaluating pages and ad campaigns |
| User conversion rate | users who converted / all users | when people visit several times before buying |
| Funnel step conversion | entered next step / entered current step | finding where people drop off |
| Lead-to-sale conversion | paid deals / requests | evaluating the sales team |

Visit conversion is almost always lower than user conversion: one person may visit five times and buy once. That is not an error — they answer different questions. Just never compare one with the other.

## Why a "normal" conversion rate differs for everyone

There is no universal benchmark. The number depends on:

- **Niche and price.** An impulse purchase of a cheap item and choosing an equipment supplier are completely different journeys.
- **Traffic source.** Someone from search with a precise query is already looking for a solution. Someone from a social feed saw the ad by chance. Their conversion will differ even on the same page.
- **Type of action.** Subscribing is easier than paying for an order.
- **Device.** Long forms are harder to complete on mobile.
- **Seasonality and promotions.** Compare periods with similar conditions.

So instead of "industry averages", track **your own trend** for each channel separately.

## Common calculation mistakes

- **Mixing denominators.** One report uses visits, another uses users, and the numbers get compared anyway.
- **Counting duplicates.** The goal fires on every reload of the thank-you page, so one request becomes three.
- **Including spam and bots.** An unprotected form collects junk submissions; conversion grows, sales do not.
- **Not excluding your own traffic.** Staff, testers and contractors visit the site and send test requests.
- **Looking only at the overall rate.** A site-wide average hides both the best and the worst channel.
- **Drawing conclusions from a tiny sample.** Three requests versus one is not "conversion tripled".
- **Stopping before revenue.** A high request rate with a low lead-to-sale rate means you are attracting the wrong customers.

## How to set up tracking properly

1. Write down which actions are macro and which are micro conversions.
2. Configure goals or events in Google Analytics 4 or Yandex Metrica so each action is counted once.
3. Filter internal traffic and protect forms from spam.
4. Tag ad links with UTM parameters to see conversion per source.
5. Send requests to your CRM and reconcile the number of requests in analytics with real inquiries.

## FAQ

### Should I use visits or users in the denominator?

It depends on the question. Visits suit page and campaign evaluation; users suit products with a long decision cycle. Pick one and do not mix them.

### What is a good conversion rate?

One that improves on your own past result in the same channel under the same conditions. Other companies' averages depend too much on niche, price and traffic source.

### Why does analytics show more requests than the CRM?

Usually because of duplicate goal firing, spam or test submissions. Check when the event triggers and compare data for the same day by time and contact details.
