---
title: VLOOKUP vs XLOOKUP vs INDEX MATCH: Which to Use
description: VLOOKUP, XLOOKUP and INDEX MATCH compared for Excel and Google Sheets: exact vs approximate match, left lookups, common errors and performance.
summary: In Excel 365/2021 or Google Sheets, default to XLOOKUP; use INDEX MATCH when the file must work in older Excel versions, and keep VLOOKUP for small, stable tables where the key sits in the first column.
---
## The short answer

- **XLOOKUP** is the modern choice: it looks left or right, uses exact match by default and has a built-in "if not found" argument. Available in Excel 365, Excel 2021 and later, and Google Sheets.
- **INDEX + MATCH** works everywhere, including old Excel versions, looks in any direction and survives inserted columns.
- **VLOOKUP** is the best known and the most fragile: it only searches the first column of a range and returns a value by column number.

Examples use comma separators. Some regional settings use semicolons instead; the logic stays the same.

## Sample data

Sheet "Products": column A is the SKU, B the name, C the price. On the "Orders" sheet, cell A2 holds a SKU and you need its price.

## VLOOKUP

```
=VLOOKUP(A2, Products!A:C, 3, FALSE)
```

- Arguments: what to find, where to look (**the key must be in the first column**), which column number to return, match type.
- **FALSE (or 0) means exact match.** If you omit the fourth argument, VLOOKUP switches to approximate match and, on unsorted data, quietly returns the wrong row with no error. This is the most common VLOOKUP bug.
- No left lookups: if the SKU sits to the right of the name, you have to rearrange columns.
- The column number is hard-coded. Insert a column in the middle of the table and the formula silently starts returning different data.

## INDEX + MATCH

```
=INDEX(Products!C:C, MATCH(A2, Products!A:A, 0))
```

- **MATCH** finds the row number of the key. The trailing **0** means exact match; the default is 1, which is approximate.
- **INDEX** returns the value from the result column at that position.
- The result column can be anywhere, including to the left of the key.
- The formula points at specific columns, so inserting new ones doesn't break it.
- Handy for two-way lookups: `=INDEX(B2:M50, MATCH(H1, A2:A50, 0), MATCH(H2, B1:M1, 0))` returns sales for the product in H1 and the month in H2.

## XLOOKUP

```
=XLOOKUP(A2, Products!A:A, Products!C:C, "Not in catalog")
```

- Arguments: what to find, where to look, what to return, what to show if nothing is found.
- **Exact match by default**, so there is no FALSE to forget.
- The fifth argument is the match mode: `0` exact, `-1` exact or next smaller, `1` exact or next larger, `2` wildcards `*` and `?`.
- The sixth argument is the search direction: `-1` searches from the bottom and finds the **last** occurrence, such as a customer's latest order.
- It can return several columns at once: `=XLOOKUP(A2, Products!A:A, Products!B:C)`.

## Exact vs approximate match

Approximate match is for **tiers and brackets**: discounts by order value, rates, grades. For example, "from 0 — 0%, from 1,000,000 — 5%, from 5,000,000 — 10%", and you need the discount for 3,200,000.

- VLOOKUP with `TRUE` and MATCH with `1` require the first column to be **sorted ascending**; otherwise results are unpredictable.
- XLOOKUP with match mode `-1` doesn't need sorting: `=XLOOKUP(D2, Tiers!A:A, Tiers!B:B, , -1)`.

For everything else — reference lists, SKUs, IDs, emails — use **exact match only**.

## Errors and performance

| Situation | Result | Fix |
|---|---|---|
| Key not found | #N/A | Check the data, wrap in IFNA or fill XLOOKUP's "if not found" argument |
| VLOOKUP column number exceeds the range width | #REF! | Fix the number or switch to INDEX MATCH |
| You search for a number stored as text | #N/A | Align types with VALUE or TEXT, remove spaces with TRIM |
| Unsorted data with approximate match | Wrong value, no error | Switch to exact match |

On small tables the speed difference is negligible. On large files, a few habits help:

- use bounded ranges or Excel Tables (Ctrl+T) instead of referencing far more rows than you need;
- when you pull several fields from the same row, calculate MATCH once in a helper column and point several INDEX formulas at it;
- on data that is guaranteed to be sorted, enable binary search with `2` or `-2` in XLOOKUP's sixth argument.

Don't hide every problem behind IFERROR: it also masks typos in the formula itself. For lookups, **IFNA** is safer because it only catches #N/A.

## How to choose

1. The file is used only in Excel 365/2021+ or Google Sheets — **XLOOKUP**.
2. Someone still opens it in older Excel — **INDEX MATCH**.
3. Small, stable table with the key on the left — **VLOOKUP** is fine.

## FAQ

### Does XLOOKUP work in Google Sheets?

Yes. Google Sheets has XLOOKUP with the same behaviour: exact match by default, lookups in any direction and an argument for missing values.

### Why does VLOOKUP return #N/A when the value is clearly there?

Usually the keys look identical but aren't: a number in one table and text in the other, a trailing space, or an invisible character from an export. Compare two cells with something like `=A2=Products!A5`; if it returns FALSE, clean the data.

### Can I look up by two conditions?

Yes. The most robust way is a helper column that joins the keys (for example SKU and warehouse) and a lookup on that column. In Excel 365 you can join ranges inside the formula: `=XLOOKUP(A2&B2, Products!A2:A1000&Products!D2:D1000, Products!C2:C1000)`; in Google Sheets, wrap that formula in ARRAYFORMULA.
