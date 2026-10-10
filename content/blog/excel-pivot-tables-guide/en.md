---
title: Pivot Tables in Excel and Google Sheets: Step-by-Step
description: How to prepare source data and build a pivot table in Excel and Google Sheets: date grouping, calculated fields, filters, slicers and why pivots break.
summary: A pivot table groups and totals data in a few clicks without formulas, but it only stays reliable on a clean source: one header row, one record per row and correct data types in every column.
---
## The short answer

A **pivot table** turns a long list of records into a compact report: revenue by sales rep, orders by month, sales by city and product. No formulas — you drag fields into the Rows, Columns, Values and Filters areas.

Most pivot problems don't come from the pivot itself but from the source data, so start there.

## Step 1. Prepare the source data

Run through this checklist:

- **one header row**, with a unique name for every column;
- **one row = one record**: one order, one sale, one transaction;
- no **merged cells**, and no blank rows or columns inside the data;
- no "Total" or subtotal rows — the pivot would count them again;
- **one data type per column**: dates are real dates, amounts are numbers.

In Excel, convert the range into a Table with **Ctrl+T**, so new rows are picked up by the pivot automatically. In Google Sheets, reference whole columns, such as `Sales!A:F`.

A quick type check: `=ISNUMBER(A2)` returns TRUE for a real date or amount. Numbers aligned to the left are usually stored as text.

## Step 2. Build the pivot

- **Excel:** Insert → PivotTable → choose the source and a new worksheet.
- **Google Sheets:** Insert → Pivot table → range and a new sheet.

Example with a sales table (date, rep, city, product, amount, status):

1. **Rep** to Rows.
2. **Amount** to Values, summarised by Sum.
3. **City** to Columns.
4. **Status** to Filters, keeping only paid orders.

Check the aggregation. If a numeric column contains text or blanks, Excel may pick Count instead of Sum; change it in Value Field Settings. The same place lets you show values as **% of grand total**, which is useful for each rep's or city's share.

## Step 3. Group by dates

To see sales by month rather than by day:

- **Excel:** drag the date to Rows. Recent versions often group dates automatically; if not, right-click a date in the pivot → **Group** → select **Months and Years**. Choosing only months merges January of different years into one row.
- **Google Sheets:** add the date to Rows, then right-click any date in the pivot → **Create pivot date group** → for example, Year-Month.

If grouping isn't available, the column contains values that aren't dates: text, errors or dates typed as strings.

## Step 4. Calculated fields

A calculated field is a new metric built from existing ones, such as margin.

- **Excel:** PivotTable Analyze → Fields, Items & Sets → **Calculated Field**, with a formula like `=(Amount-Cost)/Amount`.
- **Google Sheets:** Values → Add → **Calculated field**, with a formula like `=SUM(Amount)-SUM(Cost)` and the Custom summarise option. Wrap field names with spaces in single quotes.

An important Excel detail: calculated fields work on **field totals**, not row by row. That's correct for shares and margins. But `=Price*Quantity` multiplies the sum of all prices by the sum of all quantities, which is meaningless. Add row-level calculations as a column in the source data.

## Step 5. Filters and slicers

- **Filters** inside the pivot are fine for one-off views.
- **Slicers** are buttons that managers find easy to use. In Excel: Insert → Slicer; for dates there's a **Timeline**. One slicer can drive several pivots built on the same source via Report Connections.
- In Google Sheets: Data → **Add a slicer**. It filters pivots and charts on the sheet that use the same range.

## Why pivots break

| Symptom | Cause | Fix |
|---|---|---|
| New data missing from the report | Excel pivots don't refresh on their own, or the source doesn't include new rows | Refresh (Data → Refresh All), use a Table as the source |
| A field disappeared | A header in the source was renamed | Add the field again |
| Count instead of Sum, or zero sums | Numbers stored as text | Convert them to numbers |
| Dates won't group | Text or errors in the date column | Fix the values |
| A "(blank)" row | Empty rows in the source | Delete them or narrow the range |
| "Tashkent" appears twice | Different spelling or trailing spaces | Clean with TRIM, standardise against a list |
| Totals are too high | The source contains "Total" rows | Remove them from the data |

If Excel warns that a pivot would overlap another one on refresh, two pivots are too close on the same sheet. Move them to separate sheets.

## FAQ

### Does a pivot table update automatically?

In Google Sheets, yes, as soon as the data changes. In Excel, no: click Refresh, or enable refresh on file open in PivotTable Options.

### Can I build a pivot from several sheets?

It's more reliable to combine the data into one table first. Excel has Power Query and the Data Model for this; in Google Sheets you can stack ranges with a formula, for example using QUERY.

### Pivot table or SUMIFS formulas?

A pivot is better for quickly exploring data from different angles. Formulas are better for a report with a fixed layout that recalculates on its own.
