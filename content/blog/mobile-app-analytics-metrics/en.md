---
title: Mobile App Metrics: Retention, DAU/MAU, LTV and Churn Explained
description: What retention, DAU/MAU, LTV and churn mean, how to calculate them, how to benchmark them and which metrics matter at each growth stage of a mobile app.
summary: The key metric for a young app is retention, whether people come back after a day, a week and a month; DAU/MAU shows habit strength, churn shows who leaves, and LTV shows lifetime revenue per user, which is only worth calculating once retention has stabilized.
---

## In short: the four metrics that matter

Installs and sign-ups look good in reports but say very little about product health. The real picture comes from four numbers:

- **Retention** — the share of new users who come back after N days.
- **DAU/MAU (stickiness)** — how often people use the app within a month.
- **Churn** — the share of users or subscribers who leave during a period.
- **LTV (lifetime value)** — how much revenue an average user brings over their whole time with the app.

If retention is weak, optimizing the others is pointless: you are pouring water into a leaking bucket.

## How to calculate them

| Metric | Formula | What it shows |
|---|---|---|
| Day N retention | users active on day N / users who installed on day 0 | Value of the product for newcomers |
| DAU/MAU | average DAU over a month / MAU | Usage frequency, habit strength |
| Churn | users lost in period / active users at start of period | How fast you lose your audience |
| LTV | ARPU per period × average user lifetime | The ceiling for acquisition spend |

A few important details:

- **Retention is measured by cohort** — groups of users who arrived on the same day or week. An average across the whole base mixes loyal long-time users with random newcomers and hides the signal.
- The classic checkpoints are **D1, D7 and D30**. For apps people use rarely (travel, real estate), weekly or monthly retention works better.
- A **simplified LTV formula** for subscriptions is monthly ARPU / monthly churn. It is rough, but good enough for a first estimate.
- **ARPU** is average revenue per user for a period: revenue / number of active users.

## What counts as healthy

There are no universal benchmarks: everything depends on the category and how often people actually need the job your app does.

- **Messengers, social apps, games** — daily use is expected, so high DAU/MAU and strong D1 matter.
- **Banking, delivery, ride-hailing** — used several times a week or month; lower DAU/MAU is normal here.
- **Travel, home buying, event services** — episodic use, so watch monthly retention and repeat purchases.

Compare yourself with apps in the same category and, above all, with your own previous cohorts. The most important health signal is a **retention curve that flattens into a plateau**: after the first weeks, the share of remaining users stops falling. If the curve keeps sliding toward zero, the product has not yet found its core audience.

## Which metrics to watch at each stage

**MVP and the search for product-market fit:**
- cohort retention and the shape of the curve;
- **activation** — the share of users who complete the key action (first order, first message);
- qualitative feedback: interviews, store reviews.

**Growth:**
- DAU/MAU and session frequency;
- the funnel from install to first payment;
- retention and customer acquisition cost (**CAC**) by ad channel;
- the LTV to CAC ratio.

**Mature product:**
- subscriber churn and cancellation reasons;
- LTV, ARPU, revenue from retained cohorts;
- technical health: **crash-free** sessions, startup time.

## How to set up tracking

1. **Write a tracking plan**: install, sign-up, key action, purchase, subscription cancellation. Give each event a name and parameters.
2. **Use identical event names on iOS and Android**, or your reports will never match.
3. **Pick one tool to start**: Google Analytics for Firebase, AppMetrica, Amplitude or Mixpanel.
4. **Connect payment data** from the stores or your billing so ARPU and LTV are based on real revenue.
5. **Respect privacy**: on iOS, tracking across apps requires user consent (App Tracking Transparency), and your privacy policy must describe what data you collect.

## Common mistakes

- Celebrating install growth without looking at retention.
- Averaging retention across the whole base instead of using cohorts.
- Calculating LTV in the product's first month, when there is almost no data.
- Changing the definition of an "active user" midway and comparing numbers that are not comparable.
- Tracking hundreds of events nobody looks at while missing the one that matters.

## FAQ

### Which matters more at launch: DAU or retention?

Retention. DAU can be pushed up temporarily with ads, while retention shows whether people actually need the product. Until the retention curve plateaus, scaling acquisition is premature.

### How is churn different from retention?

They are two sides of the same process. Retention shows what share of a cohort is still active on a given day, while churn shows what share of the active audience left during a period. Retention suits new users; churn suits subscriptions and a mature base.

### How often should LTV be recalculated?

Usually once a month or after major changes to pricing or the product. Treat early LTV estimates as a forecast and refine them as cohort data accumulates.
