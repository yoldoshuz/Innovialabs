---
title: Cohort Analysis in Marketing: Measuring Retention and LTV
description: How to build acquisition cohorts, read a retention table, compare channels by cohort LTV and turn the results into budget decisions.
summary: Cohort analysis groups customers by the month of their first purchase and their acquisition channel, then tracks how many return and how much revenue they bring over time. Comparing channels by cohort LTV at the same horizon against acquisition cost shows where your budget pays off best.
---

## Why cohorts matter

Aggregate metrics mix all customers together. If revenue grows, you cannot tell whether new customers spend more or existing ones return more often. A **cohort** is a group of customers who share an event in the same period, most often a **first purchase or sign-up in the same month**. Tracking each cohort separately shows you:

- how quickly customers drop off;
- whether retention improves for newer cohorts after product changes;
- which channels bring customers who stay and pay longer.

## How to build acquisition cohorts

You need an orders (or activity) table with three fields: customer ID, date and amount. Plus each customer's acquisition channel, usually by first touch or first order.

1. For each customer, find the **first purchase date**: that is the cohort month.
2. For each order, compute the **period number** since the first purchase: month 0, 1, 2 and so on.
3. Group by cohort and period number: count active customers and sum revenue.

```sql
WITH first_order AS (
  SELECT customer_id, DATE_TRUNC(MIN(order_date), MONTH) AS cohort_month
  FROM orders
  GROUP BY customer_id
)
SELECT
  f.cohort_month,
  DATE_DIFF(DATE_TRUNC(o.order_date, MONTH), f.cohort_month, MONTH) AS month_n,
  COUNT(DISTINCT o.customer_id) AS active_customers,
  SUM(o.revenue) AS revenue
FROM orders o
JOIN first_order f USING (customer_id)
GROUP BY 1, 2
ORDER BY 1, 2;
```

The syntax is BigQuery; date functions are named differently in other databases. To compare channels, add the channel to `first_order` and to the grouping.

## How to read a retention table

Rows are cohorts, columns are months since first purchase, cells are the share of the cohort that bought in that month. A hypothetical example:

| Cohort | Customers | M0 | M1 | M2 | M3 |
|---|---|---|---|---|---|
| January | 400 | 100% | 22% | 15% | 12% |
| February | 450 | 100% | 25% | 17% | — |
| March | 380 | 100% | 30% | — | — |

The numbers are made up for illustration only. Read the table in three directions:

- **Across a row**: one cohort's lifecycle. Where is the steepest drop, and does the curve flatten? A plateau means the product has a core of loyal customers.
- **Down a column**: cohorts compared at the same age. If M1 rises from cohort to cohort, your changes are working.
- **Along a diagonal**: calendar events. A sale or an outage hits every cohort in the same calendar month.

## Cohort LTV and comparing channels

**Cohort LTV** at horizon N is the cumulative revenue (better: **gross margin**) of a cohort by month N divided by the number of customers in it. Channels can only be compared fairly at the **same horizon**: 3-month LTV against 3-month LTV.

Then set it against **CAC** (customer acquisition cost) for the same channel:

| Metric | What it shows |
|---|---|
| LTV(N) / CAC | whether the channel paid back by month N |
| Payback period | the month when cumulative margin caught up with CAC |
| LTV curve shape | whether revenue keeps growing after the first purchase or the channel brings one-off buyers |

A typical pattern: a cheap channel brings customers with little repeat demand, an expensive one brings customers who return. The first wins on first-order metrics, the second on cohort LTV.

## Using cohorts for budget decisions

- **Shift budget** to channels with the best LTV/CAC ratio at a horizon your cash flow can sustain.
- **Set target CAC** per channel from expected LTV: how much you can pay for a customer and still pay back by the month you need.
- **Watch new cohorts**: if retention of fresh cohorts drops, a bigger budget only accelerates losses.
- For young cohorts, use an **LTV forecast** based on older cohorts' curves, and recheck it as data accumulates.

## Common mistakes

- **Incomplete cohorts**: the March cohort has no M3 yet, so do not compare its "final" LTV with January's.
- **Revenue instead of margin**: a channel full of discount-driven buyers looks better than it is.
- **Small cohorts**: with a few dozen customers, percentages jump around by chance. Use longer periods or merge channels.
- **Mixing in returning customers**: a cohort must contain only new customers.

## FAQ

### Should cohorts be weekly or monthly?

It depends on purchase frequency. Weeks suit apps and services used daily; months suit e-commerce and B2B. What matters is having enough customers per cohort for stable percentages.

### Where can I run cohort analysis without a developer?

GA4 has a cohort exploration, and many CRMs have built-in cohort reports. For LTV with margin and channels you usually need to export orders into a spreadsheet or BI tool.

### What counts as a customer's acquisition channel?

Most often the source of the first order or first touch. Pick one rule and apply it to every cohort, otherwise the channel comparison loses its meaning.
