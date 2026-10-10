---
title: A/B Test Statistics: Significance, Sample Size and Peeking
description: P-values, statistical power, minimum detectable effect, the peeking problem, multiple comparisons and Bayesian vs frequentist testing, explained plainly.
summary: A reliable A/B test is planned up front: you pick a primary metric and the smallest effect worth detecting, then calculate sample size from them. The test then runs to that size without stopping at the first "significant" result; otherwise false wins become far more common than the significance level promises.
---

## The one-minute version

Most A/B testing mistakes are about process, not formulas. The right order:

1. Write a hypothesis and choose **one primary metric**.
2. Set the **minimum detectable effect** (MDE): the smallest change that would justify shipping the variant.
3. Calculate the **sample size** for that MDE, significance level and power.
4. Run the test and make no decisions until the sample is reached (or use a sequential method).
5. Check data quality, then read the result.

## What a p-value actually means

A **p-value** is the probability of seeing a difference at least as large as the one observed *if the variants were actually identical*. It is not the probability that B beats A, nor the probability of being wrong.

The usual **significance level is α = 0.05**: if the p-value is below it, the result is called significant. That means when there is no real effect, roughly one test in twenty will still produce a false "win". This is a **Type I error**.

## Power and MDE

**Power** is the probability of detecting an effect if it really exists and is at least as large as the MDE. The common target is 80%. The remaining 20% is the **Type II error**: the effect was there and the test missed it.

MDE, power and sample size are linked:

| You want | The cost |
|---|---|
| To detect smaller effects | A larger sample |
| Higher power | A larger sample |
| A stricter α | A larger sample |
| A higher baseline rate | A smaller sample for the same relative lift |

For conversion metrics there is a rough rule (α = 0.05, 80% power): each group needs about `16 × p × (1 − p) / δ²` users, where `p` is the baseline rate and `δ` the absolute difference. With a 5% baseline and a goal of detecting a lift to 6%, that is about 7,600 users per group. For precise numbers, use a calculator or a library.

```python
from statsmodels.stats.power import NormalIndPower
from statsmodels.stats.proportion import proportion_effectsize

effect = proportion_effectsize(0.06, 0.05)
n = NormalIndPower().solve_power(effect_size=effect, alpha=0.05, power=0.8)
print(round(n))  # users per group
```

If you lack traffic for a reasonable MDE, the test cannot give an answer. Test bolder changes or metrics higher in the funnel instead.

## The peeking problem

**Peeking** means checking results every day and stopping as soon as the p-value dips below 0.05. Random swings early in a test are large, and with repeated checks the chance of seeing false significance at least once is much higher than the stated 5%.

How to handle it:

- **Fixed horizon**: decide only after the planned sample is reached. You can look to catch breakages, but not to draw conclusions.
- **Sequential testing**: methods with pre-set checkpoints and adjusted thresholds (group sequential designs, alpha spending) or "always valid" p-values. Many experimentation platforms support them.
- **Full weeks**: weekday and weekend behavior differ, so run for whole weeks.

## Multiple comparisons

The more variants, metrics and segments you check, the higher the chance of finding something "significant" by luck. Ten metrics at α = 0.05 almost guarantees one false finding.

- Name **one primary metric** in advance; the rest are secondary and guardrail metrics.
- With several variants, apply corrections: **Bonferroni** (divide α by the number of comparisons; simple but conservative), **Holm**, or **Benjamini–Hochberg** (controls the false discovery rate).
- Treat segment findings ("it won on Safari iOS") as hypotheses for a new test, not results.

## Bayesian vs frequentist

| | Frequentist | Bayesian |
|---|---|---|
| Output | p-value and confidence interval | "probability B beats A" and expected loss |
| Assumptions | no prior data | requires a prior distribution |
| Interpretation | less intuitive | closer to the business question |
| Peeking | breaks error control | still needs a stopping rule |

The Bayesian approach is easier to explain to a team, but it does not remove the need for discipline: stopping as soon as the probability crosses a threshold also increases errors. Which approach you choose matters less than fixing the plan in advance.

## Checks before reading results

- **SRM (sample ratio mismatch)**: if you split 50/50 and got noticeably uneven groups, the split or tracking is broken and the result cannot be trusted.
- Identical events and filters in both groups.
- No overlapping tests on the same pages without isolation.
- Novelty effect accounted for: a spike in the first days often fades.

## FAQ

### Can I stop a test early if the result is obvious?

Only if you planned a sequential method with an early stopping rule from the start. In a classic test, stopping early inflates the false win rate.

### What if the test is "not significant"?

That does not prove the variants are equal, only that an effect the size of your MDE was not detected. Look at the confidence interval: if it is narrow and centered near zero, a large effect is unlikely.

### Does a small site need A/B tests?

If traffic is not enough even for a large MDE, qualitative methods are more useful: usability tests, session recordings, surveys. Such sites should only test bold changes.
