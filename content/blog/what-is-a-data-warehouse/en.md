---
title: What Is a Data Warehouse and Why Businesses Need One
description: How a data warehouse combines CRM, accounting, website and ad data, how star and snowflake schemas differ, and how BigQuery, Snowflake and ClickHouse compare.
summary: A data warehouse (DWH) is a separate database for analytics that regularly pulls in data from your CRM, accounting, website and ads, so every business question is answered from the same verified numbers.
---

## A data warehouse in plain words

A **data warehouse (DWH)** is a database built for analysis rather than for running an application. Data from different company systems lands there on a schedule, gets cleaned into a common format and is kept with its history.

Without a DWH the picture is familiar: sales live in the CRM, payments in the accounting system, leads in the website database, ad spend in ad platforms. To find out what a customer from a given channel really cost, someone exports four tables to a spreadsheet and stitches them together by hand. Every time slightly differently, every time with mistakes.

A DWH fixes this by giving you:

- **One source of truth** — revenue, customers and orders are calculated the same way in every report.
- **History** — you can compare periods even after statuses in the CRM have been overwritten.
- **Connections across systems** — ad click, lead, deal and payment join into one chain.
- **No load on production** — heavy reports do not slow down the CRM or the website.

## How data gets into the warehouse

A typical setup:

1. **Sources**: CRM (HubSpot, amoCRM, Bitrix24), accounting, the app or website database, Google Analytics, ad accounts.
2. **Loading**: connectors or scripts pull data via APIs or from databases, usually hourly or daily.
3. **Layers inside the DWH**: raw data as-is, then cleaned and joined data, then ready-made marts for reports.
4. **Consumption**: BI dashboards, finance exports, forecasting models.

The hard part is not loading but **agreeing on definitions**: what counts as a "customer", a "deal" or "revenue". If departments disagree, a warehouse only makes the confusion faster.

## Star and snowflake schemas

Warehouse data is usually organized into **fact tables** and **dimension tables**.

- **Facts** are events with numbers: a sale, a payment, a click, a visit. Many rows, mostly appended.
- **Dimensions** are context: customer, product, sales rep, date, channel.

**Star schema**: a fact table in the center surrounded by dimensions, each in a single table. Queries are simple, joins are few, and BI tools handle this model easily.

**Snowflake schema**: dimensions are normalized further. For example, "product" points to "category", which points to "group". Less duplication, but more joins per query.

```sql
-- Revenue by channel for one month in a star schema
SELECT c.channel, SUM(f.amount) AS revenue
FROM fact_sales f
JOIN dim_channel c ON c.channel_id = f.channel_id
JOIN dim_date d ON d.date_id = f.date_id
WHERE d.year = 2026 AND d.month = 9
GROUP BY c.channel;
```

In practice, analytics teams lean toward the star schema: storage in columnar databases is cheap, and simple queries matter more than saving space.

## Popular options

| Option | Model | Good fit when |
|---|---|---|
| **Google BigQuery** | Serverless cloud service, you pay for storage and for data processed by queries | You already use Google Cloud, GA4 or Looker Studio and do not want to manage servers |
| **Snowflake** | Cloud platform that bills storage and compute separately, runs on AWS, Azure and GCP | Many teams and workloads that need isolated compute |
| **ClickHouse** | Open-source columnar database, self-hosted or as a managed cloud service | Large event volumes, fast response times and control over infrastructure |

For small volumes, a separate analytics replica of **PostgreSQL** often does the job just as well with less overhead.

## Signs you need a DWH

- Reports are assembled by hand from several systems and regularly disagree.
- You want end-to-end analytics from ad spend to payment.
- Analytical queries slow down the production database.
- Management wants history, but your systems only keep the current state.

Common mistakes: picking a technology before listing the questions, loading "everything" without a data owner, and not monitoring load quality. Start with 3–5 key metrics and only the sources they require.

## FAQ

### Can a regular database work instead of a DWH?

Yes, at the start. A PostgreSQL or MySQL replica with a separate reporting schema covers many needs. Moving to a columnar warehouse makes sense once queries over historical data become slow.

### How much does a data warehouse cost?

It depends on data volume, refresh frequency, number of sources and how many queries users run. In cloud services the main cost is usually compute for queries, so well-designed data marts matter.

### How is a DWH different from BI?

The DWH stores and prepares data; the BI tool presents it as reports and dashboards. They usually work as a pair.
