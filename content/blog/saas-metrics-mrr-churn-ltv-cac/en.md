---
title: SaaS Metrics Explained: MRR, Churn, LTV and CAC
description: What MRR, churn, LTV and CAC mean, how to calculate them with formulas and simple examples, and how together they show the health of a SaaS business.
summary: MRR is your recurring monthly revenue, churn is how many customers or how much money you lose, LTV is what a customer brings over their lifetime and CAC is what it costs to win them. A healthy SaaS has LTV well above CAC and a short payback.
---

## The short answer: four numbers that describe a SaaS

SaaS runs on subscriptions, so one-off revenue says little. What matters is how much money comes in **every month**, how many customers leave, how much one customer brings and how much it costs to find them. Those four questions are answered by **MRR**, **Churn**, **LTV** and **CAC**.

All numbers in the examples below are illustrative and only show how the calculation works.

## MRR — monthly recurring revenue

**MRR (Monthly Recurring Revenue)** is the sum of all monthly payments from active subscriptions. One-off payments such as onboarding or setup are excluded.

**Formula:** MRR = sum of monthly payments from all active customers.

If a customer pays annually, divide the payment by 12. Example: 40 customers at $50 and 10 customers at $120 give MRR = 2,000 + 1,200 = $3,200.

It helps to split MRR changes into parts:

- **New MRR** — from new customers;
- **Expansion MRR** — from upgrades and upsells;
- **Churned MRR** — lost to cancellations and downgrades.

**ARR** is the same figure on a yearly basis: MRR × 12.

## Churn — losing customers and money

**Churn rate** shows what share you lose over a period. There are two kinds:

- **Customer churn** — share of customers lost: customers who left this month / customers at the start of the month.
- **Revenue churn** — share of revenue lost: lost MRR / MRR at the start of the month.

Example: you started the month with 200 customers and 6 left. Customer churn = 6 / 200 = 3%.

Revenue churn matters more when plans differ a lot: losing one large customer can cost more than losing ten small ones. When upsells to existing customers outweigh the losses, you get **negative net churn** — revenue from your current base grows even without new sales.

## LTV — what a customer brings over time

**LTV (Lifetime Value)** is the gross profit a customer generates over their whole subscription.

**Simple formula:** LTV = ARPA × gross margin / churn rate.

- **ARPA** — average revenue per account per month (MRR / number of customers).
- **Gross margin** — the share of revenue left after direct costs: servers, support, third-party services.

Example: ARPA = $50, margin 80%, monthly churn 2%. LTV = 50 × 0.8 / 0.02 = $2,000.

Keep in mind that the formula assumes stable churn. For a young product with little history, LTV is a rough estimate.

## CAC — what it costs to win a customer

**CAC (Customer Acquisition Cost)** is the average cost of acquiring one paying customer.

**Formula:** CAC = sales and marketing spend for a period / new customers in the same period.

Example: you spent $6,000 on ads and sales salaries in a month and gained 20 customers. CAC = $300.

A common mistake is counting only the ad budget. CAC includes sales salaries, tools, agencies and content.

## How the metrics connect

| Indicator | What is compared | What it shows |
|---|---|---|
| **LTV / CAC** | customer value vs. acquisition cost | whether growth pays off |
| **CAC payback** | CAC / (ARPA × margin) | how many months to recover the cost |
| **Net MRR growth** | new + expansion − churned | whether revenue is really growing |

In the example above LTV / CAC = 2,000 / 300 ≈ 6.7 and CAC payback = 300 / (50 × 0.8) = 7.5 months. An LTV / CAC ratio of about 3:1 is often quoted as a guideline, but the right level depends on your market, sales model and cash runway.

The logic is simple: if customers leave before they have paid back their acquisition cost, every new sale loses money and scaling only speeds up the problem.

## Common mistakes

- **Mixing one-off and recurring revenue** in MRR.
- **Calculating churn across the whole base** without splitting by plan and cohort.
- **Using revenue instead of margin** in LTV, which inflates the estimate.
- **Ignoring salaries** in CAC.
- **Looking only at averages**: channels and plans can behave very differently.

## FAQ

### Which metric should I start with if the product has just launched?

MRR and customer churn: both are easy to track from the first month. LTV and CAC become reliable once you have several months of history and clear acquisition channels.

### Is it better to lower CAC or reduce churn?

It depends on which is weaker right now. But lower churn usually improves both LTV and revenue from your existing base, so it is worth checking first.

### Do I need a dedicated analytics system for this?

At the start, a spreadsheet with data from your payment system and CRM is enough. Specialised tools pay off once you have many customers and plans and manual calculations start to go wrong.
