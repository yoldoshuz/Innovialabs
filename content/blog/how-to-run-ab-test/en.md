---
title: How to Run an A/B Test Correctly: From Hypothesis to Result
description: How to run an A/B test without fooling yourself: hypothesis, primary metric, sample size and duration, choice of tool and documenting the outcome.
summary: A sound A/B test starts with a hypothesis and one primary metric chosen before launch. You then calculate the sample size in advance, don't stop the test early, and record the outcome in an experiment log, even when it is negative.
---
## The short answer

An **A/B test** is an experiment where traffic is randomly split between version A (current) and version B (changed), and a metric chosen in advance is compared. For the conclusion to be reliable, everything important is decided **before launch**: the hypothesis, the primary metric, the sample size and the duration.

## Step 1. Hypothesis

A good hypothesis is grounded in data and testable. Format:

> If we **[change]**, then **[metric]** will change, because **[reason from data]**.

Example: "If we cut the lead form to two fields, the lead conversion rate will rise, because session recordings show people abandon the form at the third field."

Sources of hypotheses: funnel analytics, click maps, session recordings, support tickets, customer interviews. A bad hypothesis is "let's try a green button and see."

## Step 2. Primary and guardrail metrics

- There is **one primary metric**. It decides whether version B wins. Usually it is conversion to the target action: a lead, a purchase, a sign-up.
- **Guardrail metrics** make sure you don't break anything: average order value, refund rate, lead quality, page speed.

If you watch ten metrics and pick whichever "went up", random noise will almost certainly hand you a false win.

## Step 3. Sample size and duration

Sample size depends on four inputs:

| Input | Meaning | Common choice |
|---|---|---|
| **Baseline conversion** | Version A's current rate | Taken from analytics |
| **MDE** | The minimum effect you want to detect | Your call: what lift matters for the business |
| **Significance level** | Acceptable risk of a false win | Often 5% |
| **Power** | Chance of detecting the effect if it exists | Often 80% |

For these standard values there is a rough per-group formula:

```text
n ≈ 16 × p × (1 − p) / δ²
```

where `p` is the baseline conversion and `δ` the absolute difference you want to detect. For example, with 4% conversion and a goal of detecting a rise to 5% (δ = 0.01), you need roughly 6–7 thousand visitors per version. For a precise figure, use a sample size calculator or your testing tool.

**Duration** = total sample across groups ÷ daily traffic in the test, rounded up **to whole weeks**. Behavior differs between weekdays and weekends, so a test shorter than a week is almost always skewed.

If the calculation says the test will take many months, you lack traffic: test bolder changes with a larger expected effect, or use qualitative methods such as usability tests and interviews.

## Step 4. Tools

| Option | Best for |
|---|---|
| **Varioqub** (Yandex Metrica ecosystem) | Sites that already use Metrica |
| **A/B testing services** (VWO, Optimizely, AB Tasty and others) | Marketing tests without development, visual editor |
| **Feature flags** (GrowthBook, LaunchDarkly, in-house) | Product and mobile app tests, server-side logic |
| **Built-in ad platform experiments** | Comparing ads, bidding strategies and landing pages in Google Ads, Meta, Direct |

Client-side visual editors can cause **flicker**: the visitor briefly sees version A, then B. For important pages, server-side traffic splitting is more reliable.

## Step 5. Launch and monitoring

- Assignment is random and **sticky**: one visitor always sees the same version.
- Check for **SRM** (sample ratio mismatch): if you split 50/50 but the groups differ noticeably in size, the split is broken and the results can't be trusted.
- **Don't peek and stop.** Stopping the moment a difference "becomes significant" sharply raises the risk of a false win. Wait for the planned sample, or use a tool with sequential analysis that accounts for this.
- Don't change versions, ads or budgets mid-test.

## Step 6. Conclusion and documentation

There are three outcomes: B is better, B is worse, or no difference was detected. The last one is a result too: the change had no effect of a meaningful size.

Keep an **experiment log** — a table row or page per test:

- the hypothesis and the data behind it;
- screenshots of the versions;
- primary and guardrail metrics;
- dates, sample size, split;
- the result with a confidence interval;
- the decision and what to test next.

The log prevents repeating failed tests and helps new team members get up to speed.

## FAQ

### Can I test several changes at once?

Yes, in one version B, but then you learn the effect of the whole bundle, not of each change. Measuring them separately requires a multivariate test, which needs much more traffic.

### What if the result is not significant?

Accept that the effect is smaller than your MDE or absent. Don't extend the test indefinitely hoping to "push" it to significance — formulate a stronger hypothesis instead.

### Is a before-and-after comparison a substitute for an A/B test?

Only as a rough estimate. Before-and-after results are affected by seasonality, ad campaigns and competitors, while an A/B test compares versions under identical conditions.
