---
title: Data Analytics Basics: Descriptive, Diagnostic, Predictive
description: The four types of data analytics explained with business examples, the metric vocabulary you need and a simple workflow that turns a question into an insight.
summary: Analytics answers four questions in order: what happened (descriptive), why it happened (diagnostic), what will happen (predictive) and what to do about it (prescriptive). Every useful analysis starts with a clear business question and a precisely defined metric, not with the data.
---

## Four questions analytics answers

Data analytics is not one activity but a ladder of questions. Each step builds on the previous one:

| Type | Question | Business example |
|---|---|---|
| **Descriptive** | What happened? | Sales dropped last month compared to the month before |
| **Diagnostic** | Why did it happen? | The drop came from mobile users after a checkout update |
| **Predictive** | What is likely to happen? | Demand forecast for the next quarter by region |
| **Prescriptive** | What should we do? | Which stock to order and where to move the ad budget |

Most companies get the most value from the first two steps done well. Forecasts built on messy descriptive data are worse than no forecasts.

## Descriptive analytics

This is reporting: totals, averages, trends and comparisons over time. Dashboards in BI tools such as Power BI, Metabase or Looker Studio are mostly descriptive.

Good descriptive analytics is **consistent**: the same metric is calculated the same way in every report, and everyone knows the definition.

## Diagnostic analytics

Here you look for causes. Typical techniques:

- **Segmentation** — split the metric by channel, device, region, customer type.
- **Drill-down** — go from the total to the level where the change actually happened.
- **Funnel analysis** — find the step where users drop off.
- **Cohort analysis** — compare groups of customers who started in the same period.

The main trap is **confusing correlation with causation**. Two metrics moving together does not mean one drives the other. When the decision is important, confirm the cause with an experiment such as an A/B test.

## Predictive analytics

Predictive analytics uses historical data to estimate the future: demand forecasts, churn probability for each customer, expected revenue. Methods range from simple trend lines and seasonality to machine learning models.

A forecast is always a **range with uncertainty**, not a promise. It is only as good as the history it learns from: if the business has changed sharply, old data may mislead.

## Prescriptive analytics

The final step recommends actions: optimal prices, stock levels, delivery routes, which customers to offer a discount. It combines forecasts with constraints and goals. This level usually requires mature data and clear rules for how decisions are made.

## Metric vocabulary

- **Metric** — any measurable value: orders, revenue, visits.
- **KPI** — a key metric tied to a goal; a team should have only a few.
- **Dimension** — what you slice a metric by: date, city, channel.
- **Conversion rate** — share of users who complete a target action.
- **Retention** and **churn** — share of customers who stay or leave over a period.
- **AOV** (average order value) — revenue divided by the number of orders.
- **LTV** (lifetime value) — revenue a customer brings over the whole relationship.
- **CAC** (customer acquisition cost) — marketing and sales spend per new customer.
- **DAU / MAU** — daily and monthly active users.
- **Vanity metric** — a number that looks good but does not inform decisions, like total registrations without activity.

## From question to insight: the workflow

1. **Formulate the question.** "Why did repeat purchases fall in Q3?" is workable; "let's look at the data" is not.
2. **Define the metric precisely.** What counts as a repeat purchase, in what time window, which orders are excluded.
3. **Collect the data** from the CRM, website analytics, accounting, ad accounts.
4. **Clean it**: duplicates, test orders, missing values, different time zones.
5. **Analyze**: compare periods, segment, look at distributions, not only averages.
6. **Visualize** with the simplest chart that answers the question.
7. **Formulate the insight and the action**: what we learned and what we will change.
8. **Measure the effect** of the action and return to step 1.

## Common mistakes

- Starting with a dashboard of everything instead of a specific question.
- Different departments calculating the "same" metric differently.
- Trusting averages that hide outliers and different customer groups.
- Drawing conclusions from very small samples.
- Building forecasts before the basic reporting is reliable.

## FAQ

### Which type of analytics should a small business start with?

Descriptive. Set up reliable reporting on a few key metrics — sales, conversion, repeat purchases — with clear definitions. Diagnostics follows naturally once you see changes you want to explain.

### Do I need a data scientist for predictive analytics?

For simple forecasts based on trends and seasonality, a capable analyst and standard tools are often enough. Machine learning models for churn or demand at scale usually need specialized skills and well-prepared data.

### What is the difference between a metric and a KPI?

Every KPI is a metric, but not every metric is a KPI. A KPI is one of the few metrics directly linked to a business goal and used to judge progress; the rest help explain why a KPI changes.
