---
title: How to Build a KPI Dashboard for a Business
description: How to choose KPIs per department, combine data from a CRM, 1C and spreadsheets, design a clear dashboard layout and set up a reliable refresh schedule.
summary: Start from the decisions the dashboard must support, pick a few KPIs per department, combine CRM, 1C and spreadsheet data in one store with shared reference data, then build a summary-trends-details layout with a clear refresh schedule.
---

## The short answer

A good KPI dashboard is built in this order:

1. **Decisions** — which questions a manager should be able to answer from the screen.
2. **Metrics** — a few KPIs per department, each with an exact formula.
3. **Data** — where every number comes from and how sources link together.
4. **Layout** — from the headline to the details.
5. **Refresh** — how often, and how readers know the data is current.

The most common mistake is starting with the tool and good-looking charts. Without agreed metrics, a dashboard becomes a set of numbers nobody trusts.

## Step 1. Metrics per department

Each department needs only a few indicators that actually drive decisions:

| Department | Example KPIs |
|---|---|
| Sales | Revenue, number of deals, lead-to-deal conversion, average order value, pipeline value |
| Marketing | Leads by channel, cost per lead, customer acquisition cost (CAC) |
| Finance | Cash flow, accounts receivable, gross margin |
| Operations and warehouse | Order fulfilment time, stock levels, share of orders with errors |
| Support | First response time, ticket volume, first-contact resolution rate |

For each KPI, document:

- **the formula** — what is counted and what is excluded (returns, cancelled deals, VAT);
- **the source** — which system it comes from;
- **the owner** — who is responsible for the number;
- **the target**, if there is one.

Without this, "revenue" in the CRM and in accounting will inevitably differ.

## Step 2. Bring the data together

A typical setup: deals in a CRM (amoCRM, Bitrix24 and others), money and shipments in 1C, plans and ad spend in Excel or Google Sheets.

**How to combine them:**

- **CRM** — scheduled exports through its API.
- **1C** — the standard OData interface, HTTP services or regular report exports to files. The choice depends on the configuration and who maintains it.
- **Spreadsheets** — the Google Sheets API, or file uploads following a template with fixed columns.

It is best to load everything into a **separate analytics database** (PostgreSQL, for example) rather than pointing the BI tool at every system directly. That keeps load off operational systems and lets you store history.

The crucial part is **shared reference data**. A customer in the CRM and a counterparty in 1C must be matched by tax ID, phone or an internal code. The same goes for managers, branches and products. Without it, numbers from different systems never add up to one picture.

## Step 3. Dashboard layout

A reader should see within seconds whether things are on track. A structure that works, top to bottom:

1. **KPI cards** — current value, comparison with the previous period and with the plan.
2. **Trends** — line charts by day or week.
3. **Breakdowns** — by channel, manager, branch, product.
4. **Details** — a table you can drill into from a chart.

Rules that help:

- **one dashboard, one audience**: the owner needs a summary screen, the head of sales needs their own with pipeline details;
- a limited number of KPIs per screen, the rest on separate tabs;
- the same **period filter** for every chart;
- meaningful colour: highlight deviations from plan, not everything;
- labels with units and currency.

## Step 4. Choosing a tool

| Tool | Strengths | Keep in mind |
|---|---|---|
| Power BI | Powerful data model, familiar in corporate environments | Licences for publishing and sharing |
| Metabase | Open source, self-hostable, simple interface | Complex modelling is better done in the database |
| Looker Studio | Free, works well with Google Sheets and Google services | Can get slow on large data volumes |

Pick the tool after you know your sources and data volume, not before.

## Step 5. Refreshing the data

- Set **frequency by purpose**: financial indicators are usually fine with a daily refresh, operational sales data may need more.
- Show the **last refresh time** on the dashboard.
- Set up an **alert** when a load fails: a silently stale dashboard is worse than none.
- Reconcile key numbers with source systems after any change to the loading process.

## FAQ

### How many KPIs should a dashboard have?

As many as the reader can realistically follow. If a metric doesn't change any decision, remove it or move it to a detail tab.

### Can I build the dashboard in Excel?

For a small company with manual data, yes, it's a good first step. Once there are several sources and the data must refresh automatically, move to a separate database and a BI tool.

### Why don't dashboard numbers match the 1C report?

Usually because of different formulas (returns, VAT, shipment date versus payment date) or refresh timing. That is why every KPI formula should be documented and agreed with accounting.
