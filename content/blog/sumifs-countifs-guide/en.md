---
title: SUMIFS and COUNTIFS: Summing and Counting by Conditions
description: How to sum and count rows by several conditions in Excel and Google Sheets: date ranges, wildcards, comparison operators and the mistakes that skew totals.
summary: SUMIFS adds up values from rows where every condition is true and COUNTIFS counts those rows; conditions come in range–criterion pairs and can use dates, comparison operators and the * and ? wildcards.
---
## The short answer

**SUMIFS** adds up numbers from rows where **all** conditions are met. **COUNTIFS** counts how many such rows there are.

```
=SUMIFS(sum_range, criteria_range1, criterion1, [criteria_range2, criterion2], ...)
=COUNTIFS(criteria_range1, criterion1, [criteria_range2, criterion2], ...)
```

Note the order: in SUMIFS the sum range comes **first**, while in the older SUMIF it comes last. It's simpler to always use SUMIFS, even with a single condition.

Both functions behave the same in Excel and Google Sheets. Examples use commas; some regional settings use semicolons.

## Example: a sales report

Sheet "Sales": A — date, B — sales rep, C — city, D — product, E — amount, F — order status.

Revenue for rep Alisher in Tashkent:

```
=SUMIFS(E:E, B:B, "Alisher", C:C, "Tashkent")
```

Better: keep values out of the formula and reference cells, `=SUMIFS(E:E, B:B, H2, C:C, H3)`, so you can fill the formula across a whole report grid. Matching is case-insensitive: "tashkent" equals "Tashkent".

## Comparison operators

| Criterion | Meaning |
|---|---|
| `">100000"` | greater than 100,000 |
| `"<=50"` | less than or equal to 50 |
| `"<>Cancelled"` | everything except "Cancelled" |
| `"<>"` | non-empty cells |
| `"="` | empty cells |
| `">="&H2` | greater than or equal to the value in H2 |

The classic mistake is putting the reference inside the quotes: `">=H2"` compares against the text "H2". Keep the operator in quotes and join the reference with **&**.

## Date conditions

Revenue for March 2025:

```
=SUMIFS(E:E, A:A, ">="&DATE(2025,3,1), A:A, "<"&DATE(2025,4,1))
```

- You can use the same column twice — that's how you define a **range**.
- Set the upper bound as "**less than the first day of the next month**", not "less than or equal to the 31st": if dates include a time, rows from the last day would otherwise drop out.
- Don't type dates as text like `">=03/01/2025"`; the result depends on locale settings.

For a monthly report, put the first day of the month in H2 and use EDATE:

```
=SUMIFS(E:E, A:A, ">="&H2, A:A, "<"&EDATE(H2,1))
```

The start of the current month is `=EOMONTH(TODAY(),-1)+1`.

## Wildcards

- `*` — any number of characters: `"*iPhone*"` matches every product containing iPhone.
- `?` — exactly one character: `"A-???"` matches codes like "A-101".
- `~` — escape when you need the character itself: `"~*"`.

Wildcards only work with text. For numbers, use comparison operators.

## Counting orders

Paid orders in a month:

```
=COUNTIFS(F:F, "Paid", A:A, ">="&H2, A:A, "<"&EDATE(H2,1))
```

Average order value is the sum divided by the count. To avoid #DIV/0! in a month with no sales, use **AVERAGEIFS** with the same conditions and wrap it in IFERROR with a clear label such as "no sales".

## "OR" logic

All conditions inside one SUMIFS are joined with **AND**. To get "Tashkent **or** Samarkand", add two formulas:

```
=SUMIFS(E:E, C:C, "Tashkent") + SUMIFS(E:E, C:C, "Samarkand")
```

With many options or complex logic, SUMPRODUCT or a helper column with a "matches / doesn't match" flag is easier to maintain.

## Common mistakes

- **Ranges of different sizes** — `E2:E100` with `B2:B90` returns #VALUE!. All ranges must have the same number of rows.
- **Amounts stored as text** are skipped silently, so the total is lower than it should be. A telltale sign is numbers aligned to the left.
- **Extra spaces**: "Tashkent " with a trailing space doesn't equal "Tashkent". Clean the data with TRIM.
- **Dates stored as text** never fall into date ranges. Check with ISNUMBER: a real date is a number.
- **Total rows inside the data** cause double counting. Keep the source table free of subtotals.

## FAQ

### Is SUMIFS case-sensitive?

No. If case matters, use SUMPRODUCT together with EXACT, which compares text case-sensitively.

### Can criteria point to another sheet?

Yes. Both ranges and criteria can live on other sheets, for example `Sales!E:E` and `Report!H2`. Just make sure all criteria ranges and the sum range have the same length.

### When is SUMIFS better than a pivot table?

Formulas suit reports with a fixed layout that should update on their own. A pivot table is faster for exploring data when you don't yet know which breakdown you need.
