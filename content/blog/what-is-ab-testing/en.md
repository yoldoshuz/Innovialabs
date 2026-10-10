---
title: What Is A/B Testing and What You Can Test on a Website
description: How A/B testing works: control vs variant, which website elements are worth testing, how to avoid false conclusions and when traffic is too low.
summary: An A/B test is an experiment that randomly splits traffic between the current page (control) and a changed version (variant), then uses one metric chosen in advance to check which version performs better and whether the difference is more than chance.
---
## The short answer

**A/B testing** is a way to check a change on real users instead of debating it in a meeting. Visitors are randomly split into two groups:

- **A — control**: they see the current version of the page;
- **B — variant**: they see a version with one change.

Both groups arrive at the same time, from the same sources. If group B converts noticeably better and the difference is statistically significant, the change is rolled out to everyone.

The key difference from "change it and see what happens": in a before-and-after comparison, seasonality, ads, news and competitors all affect the result. In an A/B test, these factors affect both groups equally.

## How to run a test, step by step

1. **State a hypothesis.** Not "let's make the button green", but "if we show the price on the first screen, more people will reach the form, because callers often ask about cost".
2. **Pick one primary metric.** For example, request submission. Look at secondary metrics, but decide based on the primary one.
3. **Calculate the sample size.** Sample size calculators tell you how many visitors you need based on your current conversion rate and the smallest effect you want to detect.
4. **Launch and leave it alone.** Do not change conditions mid-test or stop as soon as the variant pulls ahead.
5. **Run full weekly cycles.** Behaviour on weekdays and weekends often differs.
6. **Wrap up and record the conclusion** — even if there is no winner. That is knowledge too.

## What is worth testing

| Element | Example changes |
|---|---|
| **Offer** | what exactly you propose: free consultation, cost estimate, demo |
| **Headline** | focus on benefit, on the problem, on timing |
| **Forms** | number of fields, order, whether phone is required, multi-step form |
| **Prices and plans** | plan order, which one is highlighted, monthly vs annual billing by default |
| **Call to action** | button text, placement, number of buttons per screen |
| **Trust** | reviews, guarantees, answers to objections near the form |
| **Page structure** | block order, page length |

The biggest effects usually come from changes in **meaning** — offer, price, form. Button colour and font rarely move anything noticeably, yet they consume the same amount of traffic to test.

Be careful with price experiments: showing different people different prices for the same thing can be unethical and in some cases conflict with law or platform rules. More often teams test how the price is presented rather than the price itself.

## When traffic is too low

A/B testing needs volume. With a few dozen conversions a month, a test for a modest improvement can run for a very long time and still give no reliable answer.

Signs it is too early to test:

- the sample size calculator suggests several months;
- target actions happen only a handful of times per week;
- traffic swings wildly because of ad campaigns.

What to do instead:

- **test bold changes** — a new offer or a different page structure produces a bigger difference that is easier to detect;
- **measure a micro conversion** closer to the top of the funnel, such as reaching the form, accepting that it is a compromise;
- **run qualitative research** — session recordings, heatmaps, customer interviews, usability tests with a few people;
- **ship obvious fixes without a test** — a broken form or slow loading does not need an experiment to prove it is a problem.

## Common mistakes

- **Stopping at the first lead.** With small numbers, the leader changes constantly.
- **Changing several things at once** and not knowing what worked. Multivariate tests check combinations, but they need even more traffic.
- **Peeking and choosing a convenient metric** after the test.
- **Ignoring the technical side:** the variant loads slower, flickers or breaks on mobile.
- **Overlooking traffic mix**, when one group happened to get more ad visits.

## FAQ

### How long should an A/B test run?

As long as it takes to reach the sample size you calculated in advance, and no less than one or two full weeks to cover different days. Set the duration before launch, not along the way.

### Can I test more than two versions?

Yes, that is an A/B/n test. But each extra group splits traffic further, so you need more visitors and more time for a reliable result.

### What tools can I use?

Dedicated experimentation platforms, built-in features of site builders, or your own traffic-splitting code that sends events to analytics. What matters is that the split is random and each user consistently sees the same version.
