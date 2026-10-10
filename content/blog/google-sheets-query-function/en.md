---
title: QUERY Function in Google Sheets: SQL-Like Data Analysis
description: QUERY syntax in Google Sheets explained: select, where, group by, pivot, order by and label, date conditions and live reports built with IMPORTRANGE.
summary: QUERY runs a SQL-like query against a range, filtering, grouping, sorting and renaming columns in one formula; combined with IMPORTRANGE it builds reports that update as the source spreadsheet changes.
---
## The short answer

**QUERY** is a Google Sheets function that takes a range and a query written in a SQL-like language:

```
=QUERY(data, "query", [headers])
```

- **data** — a range, such as `Orders!A:F`;
- **query** — a string in double quotes;
- **headers** — how many top rows are headers; always set it explicitly, usually `1`.

Clauses must appear **in this exact order**: `select`, `where`, `group by`, `pivot`, `order by`, `limit`, `offset`, `label`, `format`. You can skip any of them, but you can't reorder them.

## Referring to columns

- When data is a plain range, columns are **letters**: `A`, `B`, `C`, in upper case.
- When data comes from another function (IMPORTRANGE, an array in curly braces), use **Col1, Col2, Col3** with a capital C.
- Text values inside the query go in **single quotes**: `'Tashkent'`.

Sample data on the "Orders" sheet: A — date, B — sales rep, C — city, D — product, E — amount, F — status.

## select and where

```
=QUERY(Orders!A:F, "select A, B, E where F = 'Paid' and E > 100000", 1)
```

Operators available in `where`:

- comparison: `=`, `!=`, `<>`, `>`, `<`, `>=`, `<=`;
- logic: `and`, `or`, `not`;
- empty values: `is null`, `is not null`;
- text: `contains`, `starts with`, `ends with`, `like` (with `%` and `_`), `matches` (regular expression).

Text comparison in QUERY is **case-sensitive**: `'tashkent'` and `'Tashkent'` are different. If the data is entered inconsistently, use `lower(C) = 'tashkent'`.

You can take a condition from a cell by concatenating the string:

```
=QUERY(Orders!A:F, "select A, B, E where C = '"&H1&"'", 1)
```

## group by and aggregates

Revenue and order count per rep:

```
=QUERY(Orders!A:F, "select B, sum(E), count(A) where F = 'Paid' group by B order by sum(E) desc", 1)
```

- Aggregate functions: `sum`, `count`, `avg`, `min`, `max`.
- Rule: every column in `select` without an aggregate must also appear in `group by`.

## pivot

`pivot` turns the values of a column into headers, giving you a pivot table in one formula:

```
=QUERY(Orders!A:F, "select B, sum(E) where F = 'Paid' group by B pivot C", 1)
```

Rows are reps, columns are cities, and each cell holds revenue.

## order by, limit, label, format

```
=QUERY(Orders!A:F, "select B, sum(E) group by B order by sum(E) desc limit 10 label B 'Rep', sum(E) 'Revenue' format sum(E) '#,##0'", 1)
```

- `order by ... desc` — descending sort;
- `limit 10` — first 10 rows, handy for leaderboards;
- `label` — readable headers instead of "sum Amount";
- `format` — number format for the result.

## Working with dates

A date in the query is written as the literal `date 'yyyy-mm-dd'`:

```
=QUERY(Orders!A:F, "select B, sum(E) where A >= date '2025-03-01' and A < date '2025-04-01' group by B", 1)
```

To use a date from cell H1, convert it to that format with TEXT:

```
=QUERY(Orders!A:F, "select B, sum(E) where A >= date '"&TEXT(H1,"yyyy-mm-dd")&"' group by B", 1)
```

`year(A)` and `month(A)` let you group by period. One catch: **month() is zero-based**, so January is 0. Account for it in labels, or keep the month number in a helper column.

## QUERY + IMPORTRANGE: a live report

A report in a separate file that reads data from the working spreadsheet:

```
=QUERY(IMPORTRANGE("spreadsheet_url", "Orders!A:F"), "select Col2, sum(Col5) where Col6 = 'Paid' group by Col2 label sum(Col5) 'Revenue'", 1)
```

- After IMPORTRANGE, columns are **Col1, Col2…**, not letters.
- The first time, grant access: put IMPORTRANGE on its own in an empty cell and click "Allow access". After that it works inside QUERY.
- The report follows the source spreadsheet, but not instantly; expect a short delay.

## Common mistakes

- **Mixed data types in a column.** QUERY picks the column type from the majority of values and turns the rest into nulls. If the amount column contains text, some rows silently disappear.
- **Headers argument omitted.** QUERY guesses and sometimes merges the first data rows into the header.
- **Letters instead of ColN** after IMPORTRANGE, or the other way round.
- **Clauses in the wrong order**, such as `order by` before `group by`.
- **Columns inserted into the source** shift the letters, and the report starts counting the wrong data. Add new columns at the end.

## FAQ

### Does Excel have QUERY?

No, it's a Google Sheets function. In Excel, similar tasks are handled by Power Query, pivot tables and dynamic array functions such as FILTER and SORT.

### Why does QUERY return nothing when the data is there?

Check letter case in text conditions, extra spaces, the date literal format and data types: amounts stored as text won't pass a condition like `E > 0`.

### Can I query several ranges at once?

Yes: combine them into an array and use ColN. For example, `{Sheet1!A2:F; Sheet2!A2:F}` stacks the rows of two sheets, as long as both have the same column layout.
