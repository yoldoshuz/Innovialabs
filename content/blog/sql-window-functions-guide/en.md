---
title: SQL Window Functions: ROW_NUMBER, RANK, LAG and More
description: SQL window functions in practice: top-N per group, running totals, month-over-month change and deduplication with PARTITION BY and window frames.
summary: A window function computes a value over a set of related rows but, unlike GROUP BY, does not collapse them: every row stays in the result and gets a number, rank, running sum or a neighboring row's value.
---

## The short answer

A window function is written with `OVER (...)`:

```sql
function() OVER (PARTITION BY group ORDER BY sort_order frame)
```

- **PARTITION BY** splits rows into independent groups (like GROUP BY, without collapsing).
- **ORDER BY** sets the order inside each group.
- The **frame** (`ROWS BETWEEN ...`) narrows which rows count for the current one.

The key difference from `GROUP BY`: **the number of rows stays the same**. You can see an order and, say, its position among the customer's orders in the same row. Window functions are supported by PostgreSQL, MySQL 8+, SQL Server, Oracle, SQLite and ClickHouse.

## ROW_NUMBER, RANK and DENSE_RANK

The difference shows up on ties:

| Amount | ROW_NUMBER | RANK | DENSE_RANK |
|---|---|---|---|
| 500 | 1 | 1 | 1 |
| 400 | 2 | 2 | 2 |
| 400 | 3 | 2 | 2 |
| 300 | 4 | 4 | 3 |

- **ROW_NUMBER** — always unique; order among ties is arbitrary.
- **RANK** — ties share a rank and the next rank is skipped.
- **DENSE_RANK** — ties share a rank, no gaps.

## Task 1. Top-N per group

The three most expensive products in each category:

```sql
SELECT *
FROM (
  SELECT p.*,
         ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY price DESC) AS rn
  FROM products p
) t
WHERE rn <= 3;
```

You **cannot use a window function in the WHERE** of the same query: windows are computed after filtering. That is why you need a subquery or CTE. To include all products tied on price, swap `ROW_NUMBER` for `DENSE_RANK`.

## Task 2. Running total

Cumulative revenue by day:

```sql
SELECT day, revenue,
       SUM(revenue) OVER (
         ORDER BY day
         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS running_total
FROM daily_sales;
```

Specify the frame explicitly. If you omit it, `ORDER BY` implies a `RANGE` frame, and rows with equal sort values are all added at once, making the total jump.

A 7-day moving average is the same idea with a different frame: `ROWS BETWEEN 6 PRECEDING AND CURRENT ROW`. It is correct only if you have exactly one row per day with no gaps.

## Task 3. Month-over-month change

**LAG** reads the previous row's value, **LEAD** the next one's.

```sql
WITH monthly AS (
  SELECT DATE_TRUNC('month', created_at) AS month, SUM(total) AS revenue
  FROM orders
  GROUP BY 1
)
SELECT month, revenue,
       LAG(revenue) OVER (ORDER BY month) AS prev_revenue,
       ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
             / NULLIF(LAG(revenue) OVER (ORDER BY month), 0), 1) AS change_pct
FROM monthly
ORDER BY month;
```

For the first month `LAG` returns `NULL`, which is expected. `NULLIF` prevents division by zero. If a month is missing from the data, `LAG` compares with an earlier one, so fill gaps with a calendar.

## Task 4. Deduplication

Keep only the newest record for each email:

```sql
DELETE FROM users
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at DESC) AS rn
    FROM users
  ) d
  WHERE rn > 1
);
```

Run the inner `SELECT` first to see what will be deleted, and take a backup. After cleanup, add a unique index so duplicates don't come back.

## Common mistakes

- Filtering on a window function in `WHERE` instead of an outer query.
- Forgetting `PARTITION BY`, so numbering runs over the whole table instead of each group.
- Relying on the implicit `RANGE` frame for running totals.
- `ROW_NUMBER` with a non-unique `ORDER BY`, so results can change between runs; add `id` as a tiebreaker.

## FAQ

### How is a window function different from GROUP BY?

`GROUP BY` turns a group of rows into a single row. A window function computes over the group but keeps every original row, attaching the result to each one.

### Can I use several windows in one query?

Yes, each function can have its own `OVER (...)`. If a window repeats, PostgreSQL and MySQL let you define it once with `WINDOW w AS (...)` and refer to it as `OVER w`.

### Do window functions slow queries down?

They need a sort by the `PARTITION BY` and `ORDER BY` columns, which is noticeable on large tables. An index on those columns and filtering out unneeded rows before the window is computed usually solve it.
