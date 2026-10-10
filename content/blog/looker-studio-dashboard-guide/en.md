---
title: Looker Studio Guide: Free Dashboards from Google Sheets
description: How to connect Google Sheets, BigQuery and other sources to Looker Studio, build charts with filters and calculated fields, and share dashboards safely.
summary: Looker Studio turns Google Sheets, BigQuery and dozens of other sources into interactive dashboards for free. What matters most is a clean source table and deliberate sharing settings: whose credentials the data source uses and who can download the data.
---

## The short answer

**Looker Studio** (formerly Google Data Studio) is Google's free web tool for dashboards. All you need is a Google account. The workflow:

1. Prepare the source table.
2. Connect it as a **data source**.
3. Build the report: charts, tables, filters.
4. Add **calculated fields**.
5. Share it — with the right permissions.

## Prepare Google Sheets for connection

Most Looker Studio problems start in the spreadsheet. The rules are simple:

- **One header row**, no merged cells, no empty columns.
- **One row per record** (an order, a lead, a visit), no subtotals mixed into the data.
- **One type per column**: dates are dates, amounts contain no text like "about 500".
- Months go in a single "date" column, not spread across columns.
- Keep raw data on its own sheet, and notes and calculations on another.

If the sheet grows very large, Sheets slows down — that is your cue to move the data into **BigQuery** or a regular database.

## Connect your sources

Create → Data source → pick a connector:

| Source | When to use it |
|---|---|
| **Google Sheets** | Small data, manual input, CRM exports |
| **BigQuery** | Large volumes, data combined from several systems |
| **GA4, Google Ads, Search Console** | Marketing analytics |
| **MySQL, PostgreSQL** | Direct connection to the application database |
| **Partner connectors** | Social networks, ad platforms; often paid |

After connecting, check field types: dates should be **Date**, amounts **Number** or **Currency**, and default aggregation should be Sum or Count where it makes sense.

With **BigQuery**, remember that each dashboard query may be billed. Build small aggregated tables or views for the dashboard and use the **Data freshness** setting to cache results.

## Build charts, filters and calculated fields

A basic page:

- **Scorecard** — key numbers with comparison to the previous period.
- **Time series** — trends by day or week.
- **Bar chart** — breakdown by channel or category.
- **Table** — details with sorting.

Controls add interactivity: a **Date range control** and a **Drop-down list** for channel or city. Turn on **cross-filtering** so that clicking a chart filters the whole page.

**Calculated fields** are created in the data source (Add a field) or directly in a chart. Average order value:

```sql
SUM(revenue) / COUNT_DISTINCT(order_id)
```

Grouping traffic channels:

```sql
CASE
  WHEN source IN ("google", "bing") THEN "Search"
  WHEN source = "telegram" THEN "Telegram"
  ELSE "Other"
END
```

Fields created in the data source are available in every report built on it, which keeps formulas consistent.

To combine two tables (for example, ad spend and leads), use **Blend data** with a shared key such as date or campaign.

## Share the dashboard safely

This is where most mistakes happen. Check three things.

**1. Whose credentials the data source uses.** The data source settings include **Data credentials**:

- **Owner's credentials** — viewers see data through your access, even if they have no access to the underlying sheet.
- **Viewer's credentials** — each person sees only what they already have access to.

For sensitive data, choose the second option or create a separate table containing only what may be shown.

**2. Who can open the report, and how.**

- Share with specific people or a group, not "anyone with the link".
- Give **Viewer** by default and **Editor** only to people who maintain the report.
- Disable downloading, printing and copying for viewers when the data is sensitive.

**3. What the data source itself contains.** Even if a column is hidden in a chart, report editors can see every field in the source. Do not connect more than needed — customer personal data rarely belongs in a sales dashboard.

## FAQ

### Is Looker Studio really free?

The core product is free. Costs can come from partner connectors, BigQuery queries and Looker Studio Pro, which adds team management features.

### Why does my dashboard show outdated data?

Looker Studio caches responses from data sources. Check **Data freshness** in the data source settings or use the refresh data option in the report menu. For Sheets, also make sure new rows fall inside the connected range.

### Can I embed a dashboard on a website?

Yes, via File → Embed report. The embedded report follows the same sharing settings, so for every visitor to see it, it has to be public. Only embed data you are comfortable publishing.
