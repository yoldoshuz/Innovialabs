---
title: Power Query in Excel: Automate Data Cleaning
description: A practical Power Query guide: import files and whole folders, clean and transform data, merge and append tables, and refresh Excel reports in one click.
summary: Power Query records every cleaning step you do once (import, trim, retype, merge, append) and replays it on new data, so a report that took an hour of copy-paste refreshes with one click.
---
## What Power Query solves

**Power Query** is the data import and transformation engine built into Excel (Data → Get Data). Instead of cleaning an export by hand every week, you describe the steps once. Excel stores them as a query and repeats them on every refresh.

Key ideas:

- The source file is **never changed**. Power Query reads it and loads a clean copy.
- Every action becomes a step in the **Applied Steps** list. You can rename, reorder or delete steps.
- Behind the steps is a formula language called **M**. You can work without writing it, but reading it helps with debugging.

It fits recurring tasks: weekly sales exports, bank statements, CRM dumps, reports from several branches in the same format.

## Importing from files and folders

**One file:** Data → Get Data → From File → From Workbook, From Text/CSV, and so on. Select the sheet or table and click **Transform Data**, not Load, to open the Power Query Editor.

**A whole folder** is the most useful scenario. Put all monthly files with the same structure into one folder, then:

1. Data → Get Data → From File → From Folder, choose the folder.
2. Click **Combine & Transform Data** and pick the sheet or table to use.
3. Power Query creates a helper query based on a **sample file**. Cleaning steps that must apply to each file go into "Transform Sample File"; steps on the combined result go into the main query.

From then on, dropping a new file into the folder and refreshing is enough.

Tip: filter the file list by extension right after the source step, so temporary files (for example ones starting with `~$`) and stray documents are not picked up.

## Cleaning and transforming

The most common steps, all available from the ribbon:

- **Use First Row as Headers** and **Remove Top Rows** for exports with titles above the table.
- **Change Type**: dates, numbers, text. Set types deliberately and check the locale (Using Locale) when dates or decimals come from another regional format.
- **Trim** and **Clean** to remove extra spaces and non-printable characters, the usual reason why lookups fail.
- **Replace Values**, **Fill Down** for blank cells under a group header, **Remove Duplicates**.
- **Split Column** by delimiter, for example "Last name, First name".
- **Unpivot Columns** to turn months spread across columns into rows, which pivot tables handle much better.
- **Filter** out totals, empty rows and test records.

This is what such steps look like in M (Home → Advanced Editor):

```powerquery
let
    Source = Excel.CurrentWorkbook(){[Name="Sales"]}[Content],
    Trimmed = Table.TransformColumns(Source, {{"Client", Text.Trim, type text}}),
    Typed = Table.TransformColumnTypes(Trimmed, {{"Date", type date}, {"Amount", type number}}),
    NoBlanks = Table.SelectRows(Typed, each [Amount] <> null)
in
    NoBlanks
```

## Merging and appending tables

Two different operations, often confused:

| Operation | What it does | SQL analogy | Example |
|---|---|---|---|
| **Append Queries** | stacks tables with the same columns one under another | UNION | January + February + March sales |
| **Merge Queries** | adds columns from another table by a matching key | JOIN | sales + client directory by client ID |

For Merge you choose the key columns and the **join kind**: Left Outer (all rows from the first table), Inner (only matches), Left Anti (rows without a match, useful for finding gaps) and others. After merging, expand the new column and select only the fields you need.

Before merging, make sure keys have the **same type and are trimmed**, otherwise "123" and "123 " will not match.

## Refreshing reports in one click

Use **Close & Load To…** to choose where the result goes: a table on a sheet, a PivotTable, or **Only Create Connection** for intermediate queries that should not clutter the workbook.

Then:

- **Data → Refresh All** reruns every query and refreshes pivot tables built on them.
- In query properties you can enable **refresh on file open** or refresh at an interval.
- Store the folder path in a **parameter** (Manage Parameters) so the report can be moved to another computer by changing a single value.

## Common mistakes

- **Hardcoded column names.** If the source renames a column, steps like Change Type fail. Agree on a stable export format or rename columns early in one step.
- **Loading everything to sheets.** Helper queries should be connections only.
- **Mixed files in the folder.** Different structures break the combine step.
- **Privacy level errors** when combining sources. Check Query Options → Privacy instead of switching protection off blindly.

## FAQ

### Do I need to know the M language?

No. Most tasks are solved with ribbon buttons. M is useful when you need logic the interface does not offer, or to understand why a step fails.

### How is Power Query different from macros (VBA)?

Power Query is designed specifically for import and transformation: steps are visible and editable, and the source data is never modified. VBA is a general-purpose language for any action in Excel, but it is harder to maintain for data cleaning.

### What should I do when the data outgrows Excel?

The same queries can be reused in Power BI, which uses the same Power Query engine. When several systems must exchange data automatically, a database and proper integration usually replace file-based reports.
