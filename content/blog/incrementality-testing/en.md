---
title: Incrementality Testing: How to Measure the True Effect of Ads
description: Why attributed conversions overstate the impact of ads and how to measure the real effect with holdout groups, geo-lift experiments and platform lift studies.
summary: Incrementality is the difference in conversions between people who saw an ad and a comparable group who did not. It can only be measured with an experiment, such as a holdout group, a geo test or a platform lift study, because attribution also credits ads with purchases that would have happened anyway.
---

## Attribution and incrementality are not the same

**Attribution** answers "which touchpoint came before the purchase". **Incrementality** answers "how many purchases would not have happened without the ads". They are different questions, and the answers can diverge a lot.

Why attributed conversions overstate the contribution of ads:

- **Branded search** catches people who were already looking for you and would have arrived organically.
- **Retargeting** is shown to people who were already close to buying.
- **View-through conversions** credit an ad for a purchase even if the person only saw a banner.
- **Every platform counts itself**: conversions summed across ad accounts usually exceed real orders.
- **Optimization algorithms** find people who were likely to buy anyway, which looks great in reports but does not necessarily help the business.

Attribution is useful for daily optimization. To answer "should we spend this budget at all", you need an experiment.

## The core idea: a control group

Every incrementality test compares two comparable groups:

- **test**: sees the ads;
- **control**: does not, but is otherwise the same.

Incremental conversions = test group conversions − control group conversions (adjusted for group size). From this you get **iROAS** (incremental revenue per unit of spend) and the **incrementality factor**: the share of attributed conversions actually caused by the ads.

## Method 1: holdout group

A random part of the audience is excluded from ads.

- **When it fits**: you own the audience: a customer base, email subscribers, retargeting lists. You upload the list and split it randomly.
- **How**: randomly split users before launch, exclude the control part from targeting, and compare purchases using your own data (CRM), not the ad account.
- **Challenges**: on open audiences you cannot exclude people yourself, and the control group must be large enough.

For email and push this is the simplest and cleanest test: do not send to everyone, keep a small random share without the campaign.

## Method 2: geo-lift experiment

Split **regions** instead of people: ads run (or increase) in some cities and not in others.

1. Pick a metric visible by region: orders, revenue, calls.
2. Select test and control regions with similar metric history.
3. Turn ads on or off in test regions for a fixed period.
4. Compare the actual result to a **counterfactual**: a forecast built from control regions (synthetic control methods, for example the open-source GeoLift and CausalImpact libraries).

Pros: works for any channel, including offline and TV, and does not depend on cookies. Cons: you need enough regions with stable data. In markets where demand is concentrated in the capital, matching regions is harder; tests sometimes use delivery zones or alternating time periods instead.

## Method 3: platform lift studies

Meta and Google offer **Conversion Lift**: the platform randomly splits the audience and withholds ads from the control group (or shows another advertiser's ad in that slot).

- **Pros**: true user-level randomization with minimal work on your side.
- **Cons**: availability depends on budget and account; the platform measures results with its own data; one test covers one channel.

Use them, but check results against your own order data.

## How to plan a test

- **One hypothesis**: "Meta retargeting drives additional sales", not "all our ads work".
- **Size and duration** set in advance, based on the purchase cycle and expected effect. A short test on an expensive product will miss delayed purchases.
- **A business metric**: orders and revenue from the CRM, not ad account conversions.
- **Stability**: during the test, do not change prices, promotions or other channels differently between test and control.

## How to use the results

- Multiply a channel's attributed conversions by its **incrementality factor** to get a realistic CPA and ROAS.
- Cut budget where incrementality is low (often brand search and broad retargeting) and test moving money into acquisition channels.
- Repeat tests: the effect changes with season, creatives and budget level.

## FAQ

### How big does the budget need to be for a test?

There is no fixed threshold. It depends on conversion volume, the size of the expected effect and noise in the data. With few conversions, the effect drowns in random variation; then test larger budget changes or a longer period.

### Can I just turn ads off for a week and see what happens?

That gives a hint, not a measurement: the week can be affected by season, competitors and holidays. You need a control group or region living through the same period without the change.

### Does incrementality replace attribution?

No, they complement each other. Attribution guides daily decisions within a channel; incrementality tests calibrate it and guide budget allocation across channels.
