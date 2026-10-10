---
title: How to Fix #N/A, #REF!, #VALUE! and Other Formula Errors
description: What #N/A, #REF!, #VALUE!, #DIV/0!, #NAME? and other errors mean in Excel and Google Sheets, why they appear and how to trace them to the source.
summary: Each spreadsheet error points to a specific problem: #N/A means a value wasn't found, #REF! means a reference to deleted cells, #VALUE! means the wrong data type; trace the source with formula auditing tools first, then decide whether to catch the error.
---
## The short answer

An error in a cell isn't a crash — it's a hint, and the code tells you what went wrong. The routine is always the same: **read the code → find the source cell → fix the data or the formula**. Wrap a formula in IFERROR only when the error is expected.

## Error reference

| Error | Meaning | Typical causes |
|---|---|---|
| #N/A | Value not available | VLOOKUP or MATCH didn't find the key; number vs text; trailing spaces |
| #REF! | Reference to cells that no longer exist | Deleted row, column or sheet; VLOOKUP column number larger than the range |
| #VALUE! | Wrong argument type | Text in arithmetic; ranges of different sizes in SUMIFS; dates stored as text |
| #DIV/0! | Division by zero | The divisor is zero or an empty cell |
| #NAME? | Unknown name | Typo in a function name; text without quotes; function not available in this version |
| #NUM! | Invalid number | Square root of a negative; an iterative function didn't converge; value too large |
| #NULL! | Empty intersection of ranges | A space instead of a comma or colon between references (Excel only) |
| #SPILL! | A dynamic array has no room | Cells below or beside the formula aren't empty (Excel 365) |
| #ERROR! | Formula can't be parsed | Syntax problem: brackets, quotes, separators (Google Sheets) |

Separately, **#####** isn't an error: the column is too narrow or a date is negative. Widen the column.

## Fixing the most common errors

**#N/A.** Check that the lookup value really exists and matches character for character. Compare cells with `=A2=Lookup!A5`. Remove spaces with TRIM and align types: if a numeric key is stored as text, VALUE helps. Also make sure VLOOKUP uses exact match — FALSE as the fourth argument.

**#REF!** Open the formula: you'll see `#REF!` in place of an address. Undo the deletion with Ctrl+Z if it just happened, or rewrite the reference. To prevent it, use INDEX MATCH or XLOOKUP instead of hard-coded column numbers, and don't delete sheets that other formulas depend on.

**#VALUE!** Find the argument with the wrong type. A frequent case is numbers with spaces or the wrong decimal separator after an export from another system. Use ISNUMBER to check whether a cell holds a number, and compare the sizes of all ranges in conditional functions.

**#DIV/0!** Check the divisor explicitly:

```
=IF(B2=0, "", A2/B2)
```

**#NAME?** Check the function name and the quotes around text. If your Excel or Sheets uses another interface language, formulas copied from English guides may need localized function names and separators.

## IFERROR vs IFNA

- **IFERROR** catches any error: `=IFERROR(A2/B2, 0)`.
- **IFNA** catches only #N/A: `=IFNA(VLOOKUP(A2, Products!A:C, 3, FALSE), "Not in catalog")`.

The rule: use **IFNA** for lookups. IFERROR also hides #REF! and #NAME?, which are real breakages, and you end up with a quietly wrong report. Don't return 0 where "not found" and "zero" mean different things — it distorts sums and averages.

## Formula auditing tools

**Excel**, Formulas tab:

- **Trace Precedents** and **Trace Dependents** — arrows show where a formula gets its data and where results go.
- **Evaluate Formula** — a step-by-step walk-through that shows exactly which step produces the error.
- **Error Checking** — cycles through errors on the sheet and suggests fixes.
- **Show Formulas** (Ctrl+`) — displays formulas instead of values in every cell.
- **Watch Window** — keeps an eye on key cells from other sheets.

**Google Sheets:**

- hover over the error cell to see a note explaining the cause;
- select the cell and press F2: references in the formula are highlighted with coloured borders;
- **View → Show formulas** (Ctrl+`);
- there's no step-by-step evaluator, so split a long formula into parts in helper cells and see which part fails.

Errors propagate: if a source cell returns #N/A, every dependent formula shows the same. So work **from the result back to the source** along the chain of precedents until you find the first error.

## FAQ

### Why did a working formula break after new data was pasted?

Usually the structure changed: columns were deleted or inserted, a sheet was renamed, or new data arrived in a different format, such as dates as text. Check the precedents and the data types in the new rows.

### Can I just hide all errors?

Technically yes, but it's risky: errors signal problems in the data. Catch only expected cases, such as #N/A for a new product that isn't in the reference list yet.

### What about a circular reference?

It's a warning rather than an error code: the formula refers to itself directly or through other cells. In Excel, find it via Formulas → Error Checking → Circular References and move the calculation to a separate cell.
