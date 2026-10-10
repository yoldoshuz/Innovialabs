---
title: Notion Formulas and Rollups: Advanced Guide with Examples
description: Notion formula syntax, date and conditional logic, rollups across relations, plus ready-to-use formulas for deadlines, progress bars and budget tracking.
summary: A formula calculates a value inside one record, a rollup collects and aggregates data from related records; together they give you automatic deadlines, project progress and remaining budget in Notion without manual math.
---
## The key idea

- **Formula** — a property that calculates a value from other properties of the same record: text, number, date or checkbox.
- **Rollup** — a property that follows a **relation**, takes values from related records and aggregates them: sum, count, percentage, latest date.

The classic combo: a "Project → Tasks" relation, a rollup that counts the share of completed tasks, and a formula that turns it into a progress bar.

## Formula syntax

Properties are referenced with `prop("Name")`. You get the operators `+ - * /`, comparisons `== != > <`, logic `and`, `or`, `not`, and dot notation for methods.

```js
prop("Price") * prop("Quantity")
prop("Name") + " — " + prop("Client")
prop("Tags").length()
```

Useful functions:

| Function | What it does |
|---|---|
| `if(condition, yes, no)` | Two-branch condition |
| `ifs(c1, v1, c2, v2, else)` | A chain of conditions without nesting |
| `empty(x)` | Checks for an empty value |
| `let(name, value, expression)` | A variable inside the formula |
| `format(x)` | Turns a number or date into text |
| `round(x)`, `abs(x)` | Rounding and absolute value |

Break long formulas across lines for readability — the formula editor allows it.

## Dates

- `now()` returns the current date and time, `today()` returns today's date.
- `dateBetween(date1, date2, "days")` returns `date1 − date2` in days, weeks or months.
- `dateAdd(date, 14, "days")` and `dateSubtract(...)` shift a date.
- `dateStart(...)` and `dateEnd(...)` return the start and end of a date range.
- `formatDate(date, "DD.MM.YYYY")` prints a date in the format you need.

Example: the next review date, 90 days after the last one.

```js
dateAdd(prop("Reviewed"), 90, "days")
```

## Rollups across relations

To create a rollup:

1. Make sure there is a **relation** to the database you need.
2. Add a **Rollup** property and pick the relation.
3. Pick a property of the related database and a calculation.

Calculations include showing the original values, **Count all**, **Count values**, **Sum**, **Average**, **Min / Max**, **Earliest / Latest date**, **Percent checked** for checkboxes, and percentages per status group.

Examples:

- In "Projects": total hours across tasks, the latest task date, percent completed.
- In "Clients": total invoiced, date of the most recent deal.

Formulas can also work with relations directly: `prop("Tasks")` returns a list of pages that supports `filter`, `map` and `length`.

## Ready-made formulas

### Deadline status

Shows "Overdue", "Due today" or how many days are left. Needs a `Due` (Date) and a `Status` (Status) property.

```js
if(empty(prop("Due")) or prop("Status") == "Done", "",
  let(d, dateBetween(prop("Due"), today(), "days"),
    ifs(
      d < 0, "Overdue by " + format(abs(d)) + " d",
      d == 0, "Due today",
      format(d) + " d left"
    )
  )
)
```

### Project progress from tasks

The share of completed tasks from 0 to 1, computed straight from the relation without a separate rollup:

```js
let(t, prop("Tasks"),
  if(t.length() == 0, 0,
    t.filter(current.prop("Status") == "Done").length() / t.length()
  )
)
```

Set the number format to percent.

### Progress bar

Takes a number from 0 to 1 in the `Progress` property and draws a ten-step bar:

```js
let(p, round(prop("Progress") * 10),
  repeat("●", p) + repeat("○", 10 - p) + " " +
  format(round(prop("Progress") * 100)) + "%"
)
```

### Remaining budget

`Spent` is a **Sum** rollup over expense amounts in a related database; `Budget` is a number.

```js
if(empty(prop("Budget")) or prop("Budget") == 0, "No budget set",
  let(left, prop("Budget") - prop("Spent"),
    if(left < 0,
      "Over budget by " + format(abs(left)),
      format(round(prop("Spent") / prop("Budget") * 100)) + "% used"
    )
  )
)
```

## Common mistakes

- **Division by zero** — always guard the denominator with `if`.
- **Comparing against a renamed status** — the formula looks for the exact value. Rename "Done" and you must update your formulas.
- **Mixing types** — you cannot add text to a number without `format()`.
- **Long chains** of rollups and formulas across several databases get slower and harder to debug. If the calculation starts looking like a financial model, it belongs in a spreadsheet or BI tool.

## FAQ

### What is the difference between a formula and a rollup?

A formula computes a value from the record's own properties. A rollup gathers values from related records and aggregates them. Often a rollup produces a raw number and a formula turns it into a readable result.

### Can I skip rollups entirely?

In many cases, yes: formulas can access relations directly and filter related records. Rollups are easier to set up without code, so they remain handy for standard sums and counts.

### Where can I find the full list of functions?

The formula editor has a built-in reference with a description and example for every function. Up-to-date documentation is also available in the Notion Help Center.
