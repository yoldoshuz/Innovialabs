---
title: Power BI for Beginners: Build Your First Report
description: A step-by-step guide to loading data from Excel and a database, cleaning it in Power Query, modeling it, writing DAX measures and publishing a report.
summary: Your first Power BI report takes five steps: connect the sources, clean the data in Power Query, link tables into a star schema, write a few DAX measures and publish to the Power BI Service with scheduled refresh.
---

## The short answer: what a first report involves

You need the free **Power BI Desktop** app (Windows). The whole path looks like this:

1. **Get Data** — connect Excel and a database.
2. **Power Query** — clean the data and set types.
3. **Model** — relate fact and lookup tables.
4. **DAX** — write measures: revenue, order count, average order value.
5. **Publish** — send the report to the Power BI Service and set up refresh.

The example below uses sales data: an orders table in a database and a product list in Excel.

## Step 1. Load data from Excel and a database

- **Excel**: Home → Get Data → Excel workbook. Pick a sheet or, better, a **formatted table** (Ctrl+T in Excel) — it handles new rows more reliably.
- **Database**: Get Data → SQL Server, PostgreSQL or MySQL. Enter the server and database. Some databases may require installing a driver first.

When connecting, choose a storage mode:

| Mode | How it works | When to use it |
|---|---|---|
| **Import** | Data is copied into the report file | Most reports, fastest visuals |
| **DirectQuery** | Every visual sends a query to the database | Very large or near-real-time data |

Start with **Import** — it is simpler and more forgiving of modeling mistakes.

Tip: do not pull the whole table "just in case". Select only the columns and time range you need, and the report stays fast and small.

## Step 2. Clean the data in Power Query

Click **Transform data**. Every action is recorded as a step and replayed on each refresh, so you never clean the same data by hand twice.

A typical set of steps:

- **Change Type** — dates as dates, amounts as decimal numbers.
- **Remove Duplicates** on the key column (for example, the SKU in the product list).
- **Trim / Clean** — strip stray spaces that stop relationships from matching.
- **Replace Values** and **Fill Down** — fill gaps.
- **Unpivot Columns** — if months are spread across columns, turn them into rows.

Give steps clear names; you will thank yourself a month later. Then click **Close & Apply**.

## Step 3. Build the data model

Open the **Model** view. Aim for a **star schema**: a fact table (orders) in the center, lookup tables (products, customers, dates) around it.

- Use **one-to-many** relationships: one product, many order rows.
- Keep filter direction **single**, from lookup to facts. Save bidirectional filters for special cases.
- Create a dedicated **date table** and mark it as a Date table. Without it, time-comparison functions are unreliable.

```dax
Date = CALENDAR ( DATE ( 2023, 1, 1 ), DATE ( 2026, 12, 31 ) )
```

Relate `Date[Date]` to the order date.

## Step 4. Write your first DAX measures

A **measure** is calculated on the fly and respects the filters on the page; a **calculated column** is computed once per row at refresh. For totals and KPIs you almost always want measures.

```dax
Total Sales = SUM ( Orders[Amount] )
Orders Count = DISTINCTCOUNT ( Orders[OrderID] )
Avg Check = DIVIDE ( [Total Sales], [Orders Count] )
Sales LY = CALCULATE ( [Total Sales], SAMEPERIODLASTYEAR ( 'Date'[Date] ) )
Sales YoY % = DIVIDE ( [Total Sales] - [Sales LY], [Sales LY] )
```

`DIVIDE` handles division by zero safely. Keep measures in a separate empty table so they are easy to find.

## Step 5. Build the page and publish

A minimal page: cards with key measures, a line chart of sales over time, a bar chart by category, and **slicers** for period and region. Clicking a bar filters the other visuals — that is the interactivity.

To publish: **Publish** → a workspace in the Power BI Service. Then:

- To refresh data from an on-premises database, install the **on-premises data gateway** and configure **scheduled refresh**.
- Sharing with colleagues usually requires paid licenses or capacity — check the terms of your plan.
- Never use **Publish to web** for internal data: it makes the report available to anyone with the link.

## Common beginner mistakes

- One huge flat table instead of a star schema — slow and awkward to calculate.
- Totals in calculated columns instead of measures.
- No date table, so year-over-year comparisons look wrong.
- Manual edits in the Excel source instead of Power Query steps.
- Dozens of visuals on one page. Five to seven with a clear title work better.

## FAQ

### Do I need a paid license to get started?

No. Power BI Desktop is free, and you can build and save reports locally. Licenses matter once you need to publish a report and share it with colleagues.

### What is the difference between Power Query and DAX?

Power Query prepares data before it reaches the model: cleaning, merging and reshaping tables. DAX calculates metrics on top of the loaded model. Clean data in Power Query first, then write measures in DAX.

### Why does my measure show the same value in every row?

Usually there is no relationship between the tables, or the filter direction does not reach the fact table. Check relationships in the Model view and make sure the field in the visual comes from a lookup table related to the facts.
