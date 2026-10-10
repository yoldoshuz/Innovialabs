---
title: IMPORTRANGE and ARRAYFORMULA in Google Sheets
description: How to pull data between Google Sheets with IMPORTRANGE, grant access, apply one formula to a whole column and keep the spreadsheet fast and robust.
summary: IMPORTRANGE pulls a range from another Google Sheet and ARRAYFORMULA applies one formula to an entire column; together they replace manual copying, as long as you import once, keep ranges bounded and avoid long chains of files.
---
## The short answer

- **IMPORTRANGE** takes a range from another spreadsheet and displays it in the current one. When the source changes, the import follows.
- **ARRAYFORMULA** lets you write a formula once in the top cell and have it calculate the whole column. No dragging formulas down thousands of rows, no checking whether new rows got them.

Together they replace copy-pasting between files. But every extra link and every unbounded range slows the spreadsheet down, so design the setup with care.

## IMPORTRANGE syntax

```
=IMPORTRANGE("https://docs.google.com/spreadsheets/d/KEY/edit", "Sales!A1:F")
```

- The first argument is the spreadsheet URL or just its key (the part between `/d/` and `/edit`).
- The second is the range **as text**: sheet name, exclamation mark, address.
- Both can live in cells: `=IMPORTRANGE(B1, B2)`. If a sheet gets renamed, you fix one settings cell instead of every formula.

## Granting access

1. Enter the formula. The first time, you'll see **#REF!** with a prompt.
2. Hover over the cell and click **Allow access**.
3. You need at least view access to the source spreadsheet.

Access is granted **once per pair of files**. Mind the consequence: afterwards, any editor of the destination file can import any range from the source, not just the one you set up. For confidential data, create a separate source file containing only the columns you want to share.

## ARRAYFORMULA: one formula for a whole column

Instead of `=B2*C2` dragged down, put this in D2:

```
=ARRAYFORMULA(IF(A2:A="", , B2:B*C2:C))
```

- **References are ranges**, not single cells: `B2:B` instead of `B2`.
- The `IF(A2:A="", , ...)` check keeps rows without data empty; otherwise the column fills with zeros.
- Pressing **Ctrl+Shift+Enter** while entering a formula wraps it in ARRAYFORMULA.
- Cells below the formula must be empty. If something is there, the array can't expand and the formula returns #REF!.

A handy trick is to put the formula in the header row so sorting never moves it:

```
={"Total"; ARRAYFORMULA(IF(A2:A="", , B2:B*C2:C))}
```

A lookup for the whole column:

```
=ARRAYFORMULA(IF(A2:A="", , IFNA(VLOOKUP(A2:A, Lookup!A:C, 3, FALSE), "not in list")))
```

One limitation: functions that collapse a range into a single value (SUM, AND, OR) don't work row by row inside ARRAYFORMULA. Replace `AND(cond1, cond2)` with multiplication `(cond1)*(cond2)`, and OR with addition. For complex row-level logic, use BYROW or MAP with LAMBDA.

## A working setup for reports

1. In the report file, create an "Import" sheet with **one** IMPORTRANGE per source.
2. Import **only the columns you need** and a bounded range.
3. Do all calculations on separate sheets that reference "Import", using ARRAYFORMULA, QUERY or FILTER.
4. Protect the formula sheet: Data → Protect sheets and ranges.

## Avoiding slow, fragile spreadsheets

- **Don't call IMPORTRANGE in every cell.** Each call is a separate request to another file. One import plus local references is faster.
- **Avoid chains** like "file A → file B → file C → report". Delays add up, and one break stops everything downstream.
- **Delete empty rows and columns** at the bottom and right of the sheet. ARRAYFORMULA over `A2:A` processes every row of the sheet, including empty ones.
- **Go easy on NOW, TODAY, RAND and RANDBETWEEN** across large ranges; they make the spreadsheet recalculate often.
- **Don't rename source sheets or insert columns in the middle**: the range in IMPORTRANGE is text and won't update itself. Add new columns at the end.
- **Watch the growth.** When dozens of files are linked and many people enter data, the spreadsheet becomes a bottleneck — a sign it's time for a database or a CRM.

## FAQ

### Why does IMPORTRANGE keep showing "Loading..." or an error?

Usually because of too many imports in the file, an overly wide range or lost access to the source. Reduce the number of calls, narrow the ranges and check that you still have access to the source spreadsheet.

### Can I import from an Excel file on Google Drive?

IMPORTRANGE works only with Google Sheets files. Save the .xlsx file as a Google Sheet from the File menu first.

### Do QUERY and FILTER need ARRAYFORMULA?

No. QUERY, FILTER, SORT and UNIQUE already return a whole array, so there's no need to wrap them.
