---
title: Conditional Formatting in Excel and Google Sheets
description: How to use conditional formatting in Excel and Google Sheets: built-in rules, custom formulas, duplicates, overdue dates, color scales and rule cleanup.
summary: Conditional formatting colors cells automatically when a condition is true: use built-in rules for simple checks and a custom formula with correct $ anchors for everything else, such as highlighting a whole row.
---
## What conditional formatting does

**Conditional formatting** changes how a cell looks (fill, font color, icon, bar) when a condition is met. The data stays the same, only the display changes, and it updates by itself whenever values change.

Where to find it:

- **Excel:** Home → Conditional Formatting.
- **Google Sheets:** Format → Conditional formatting (a side panel opens).

For simple checks use the built-in rules. For anything that depends on another column, a date or several conditions at once, use a **custom formula**.

## Built-in rules worth knowing

- **Highlight cells rules**: greater than, less than, between, text contains, a date occurring. Good for "amount over limit" or "status contains Error".
- **Top/Bottom rules** (Excel): top 10 items, above average.
- **Data bars and icon sets** (Excel): a mini bar chart or arrows right inside the cell.
- **Color scales** (both): a gradient from low to high values.

In Google Sheets the panel has two tabs: **Single color** (all condition types, including custom formula) and **Color scale**.

## Custom formula rules

The formula must return TRUE or FALSE, and it is written **for the top-left cell of the selected range**. The program then shifts it for every other cell, exactly as when you copy a formula. That is why the `$` anchors matter.

Example: highlight the entire row of a task when column F says "Overdue".

1. Select the data range, for example `A2:F200`, starting from the first data row, not the header.
2. Excel: New Rule → "Use a formula to determine which cells to format". Sheets: Format rules → "Custom formula is".
3. Enter the formula and pick a fill color:

```text
=$F2="Overdue"
```

`$F` locks the column, so every cell in the row looks at column F. The `2` without a dollar sign lets the row change. If you write `$F$2`, every row checks only row 2, which is the most common mistake.

## Duplicates and overdue dates

**Duplicates.** Excel has a built-in rule: Highlight Cells Rules → Duplicate Values. For more control, or in Google Sheets, apply a formula to `A2:A200`:

```text
=COUNTIF($A$2:$A$200,$A2)>1
```

To mark only the second and later occurrences, count up to the current row: `=COUNTIF($A$2:$A2,$A2)>1`.

**Overdue dates.** Deadline in column D, status in column F, range `A2:F200`:

```text
=AND($D2<>"",$D2<TODAY(),$F2<>"Done")
```

The `$D2<>""` part stops empty cells from being treated as overdue. For "due within 7 days" add a second rule with a different color:

```text
=AND($D2>=TODAY(),$D2<=TODAY()+7)
```

Make sure the column holds real dates, not text that only looks like dates, otherwise the comparison silently fails.

## Color scales

A color scale helps you scan numbers quickly: margins, response times, sales by manager.

- Use a **two-color** scale for "more is better" and a **three-color** scale with a midpoint when there is a meaningful middle, such as a target value.
- Set the minimum and maximum as **numbers or percentiles** instead of automatic values, otherwise one outlier washes out the rest of the range.
- Do not mix a color scale with fill-based rules on the same cells: the reader will not know what a color means.

## Keeping rules manageable

Rules multiply quietly. Copying and pasting formatted cells can split one rule into many fragments.

- **Review the list regularly.** Excel: Conditional Formatting → Manage Rules, then choose "This worksheet". Sheets: the side panel shows rules for the selection or the whole sheet.
- **One rule per range.** Merge fragments by editing the "Applies to" range.
- **Order matters.** In Google Sheets, when several rules match, the higher one wins. In Excel, non-conflicting formats combine, conflicts are resolved by order, and "Stop If True" blocks lower rules.
- **Paste values only** (Paste Special → Values) when you move data, so formatting is not copied along.
- **Add a short legend** near the table explaining each color.
- **Limit ranges to the data.** Volatile functions such as `TODAY()` over entire columns make large files slow.

## Common mistakes

- Wrong anchors: `$A$2` instead of `$A2`.
- The formula refers to a row other than the first row of the selected range.
- Comparing text with numbers: `"100"` and `100` are different values.
- In Google Sheets, referencing another sheet directly in a custom formula. Use `INDIRECT("Sheet2!A2:A200")` instead.

## FAQ

### Why does my formula rule color the wrong rows?

Almost always it is the anchors or the starting row. The formula must point to the first row of the selected range, with `$` before the column letter and no `$` before the row number.

### Can I copy conditional formatting to another range?

Yes. Use Format Painter in Excel or Paste special → Format only in Google Sheets. Afterwards check the rule list: copying often creates duplicate rules that are better merged into one.

### Will Excel rules keep working after I open the file in Google Sheets?

Simple rules, color scales and most custom formulas convert. Data bars, icon sets and some Excel-specific options may be lost or look different, so review the rules after converting.
