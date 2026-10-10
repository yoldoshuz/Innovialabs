---
title: Marketing Attribution Models Explained: Last Click to Data-Driven
description: How last click, first click, linear, time decay, position-based and data-driven attribution differ, and how your choice of model shifts budget decisions.
summary: An attribution model is the rule that splits the value of a sale between marketing touchpoints. The model you choose decides which channels look profitable, and therefore where your budget goes.
---

## What an attribution model is

Customers rarely buy after the first contact. They see a social ad, later read an article from search, get an email, and buy a week after that. **Attribution** answers the question: which channel gets credit for that sale, and how much?

An **attribution model** is the rule for splitting that credit. The sale is the same, but different models show different channel value in reports. That is why the model directly affects budget decisions.

## One customer journey, six answers

Here is an example. A customer made a purchase worth **100 units**, after four touchpoints:

1. **Day 1** — saw an Instagram ad and visited the site.
2. **Day 5** — found an article through organic search.
3. **Day 10** — opened an email newsletter and returned to the site.
4. **Day 12** — searched for the brand name, clicked a search ad and bought.

How each model splits the 100 units:

| Model | Instagram | Organic | Email | Search ads |
|---|---|---|---|---|
| **Last click** | 0 | 0 | 0 | 100 |
| **First click** | 100 | 0 | 0 | 0 |
| **Linear** | 25 | 25 | 25 | 25 |
| **Time decay** (7-day half-life) | 13 | 19 | 31 | 37 |
| **Position-based** (40/20/40) | 40 | 10 | 10 | 40 |
| **Data-driven** | depends on your data | | | |

## How each model works

- **Last click.** All credit goes to the final touchpoint. Simple and clear, but it undervalues channels that create demand: social, content, display. Branded search almost always looks like the hero.
- **First click.** All credit goes to the first touchpoint. It shows what brings new people in but ignores everything that closed the sale.
- **Linear.** Credit is split equally. Fair to every channel, but it cannot tell important touches from incidental ones.
- **Time decay.** The closer a touch is to the purchase, the more credit it gets. Useful for short cycles and promotions, but it undervalues the channel that found the customer.
- **Position-based (U-shaped).** Typically 40% each to the first and last touch, with the remaining 20% shared across the middle. A compromise that values both acquisition and closing.
- **Data-driven.** An algorithm compares paths that converted with paths that did not and estimates each channel's real contribution. The most accurate option, but it needs enough conversion volume and its logic is not transparent.

Yandex Metrica also offers **last significant click**: similar to last click, but it ignores "insignificant" sources such as direct visits when an ad or search visit came before them.

## How the model changes your budget

Back to the example. Under last click, Instagram and email look useless, and it is tempting to turn them off. But without Instagram the customer would never have heard of the brand, and there would be no branded search at all. Cut the "useless" channels and search ads will slowly start delivering less too.

Practical rules:

- **Compare channels in at least two models.** A channel that is weak on last click but strong on first click creates demand rather than closing deals.
- **Never kill a channel based on one report.** Reduce its budget gradually and watch total sales.
- **Consider cycle length.** For long B2B deals, last click distorts the picture the most.
- **Keep consistent UTM tags.** Any model only works with touchpoints your analytics can recognize.

## Common mistakes

- Treating your chosen model as "the truth". Every model is a simplification.
- Comparing ad platform reports with each other: each platform attributes sales in its own favor and may count the same purchase several times.
- Switching models and comparing straight away with a past period calculated under a different one.
- Ignoring offline sales and phone calls that are not linked to the online journey.

## FAQ

### Which attribution model should a beginner use?

Start with the default in your analytics tool and also check a first-click report. Once you have enough conversions, move to data-driven if your tool supports it.

### Why do Google Ads and Meta report more sales than my analytics?

Each platform sees only its own touches and claims the sale if its ad was anywhere in the path, including view-through without a click. So the totals from ad accounts are almost always higher than real sales.

### Do I need end-to-end analytics for attribution?

For simple online sales, GA4 or Yandex Metrica is enough. If deals close in a CRM or offline, end-to-end analytics is needed to connect an ad touch to the actual payment.
