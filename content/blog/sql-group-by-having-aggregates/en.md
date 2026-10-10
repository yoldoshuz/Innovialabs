---
title: SQL GROUP BY, HAVING and Aggregate Functions
description: Build sales reports in SQL with COUNT, SUM, AVG, MIN and MAX, learn how WHERE differs from HAVING, group by dates and avoid the most common grouping errors.
summary: GROUP BY collects rows into groups, aggregate functions compute one value per group, WHERE filters rows before grouping and HAVING filters the finished groups.
---

## The short answer

- **GROUP BY** merges rows with the same values into groups.
- **Aggregate functions** (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`) return one value per group.
- **WHERE** removes rows before grouping.
- **HAVING** removes groups after they are computed.

```sql
SELECT city, COUNT(*) AS orders, SUM(total) AS revenue
FROM orders
WHERE status = 'paid'
GROUP BY city
HAVING SUM(total) > 1000000
ORDER BY revenue DESC;
```

Read it as: take paid orders, group them by city, count orders and revenue, keep cities with revenue above one million.

## Five aggregate functions on sales data

Table `orders(id, customer_id, city, total, status, created_at)`.

```sql
SELECT
  COUNT(*)                     AS orders_count,
  COUNT(DISTINCT customer_id)  AS customers,
  SUM(total)                   AS revenue,
  AVG(total)                   AS avg_check,
  MIN(total)                   AS min_order,
  MAX(total)                   AS max_order
FROM orders
WHERE status = 'paid';
```

Without `GROUP BY`, the whole result is one group and you get a single row of totals. Add `GROUP BY city` and you get one such row per city.

Details that matter:

- `COUNT(*)` counts all rows; `COUNT(column)` counts only rows where the value is **not NULL**.
- `SUM`, `AVG`, `MIN`, `MAX` **ignore NULL**. `AVG` over a column with gaps averages only the filled values.
- `SUM` over an empty set returns `NULL`, not 0. Use `COALESCE(SUM(total), 0)`.

## WHERE or HAVING

| | WHERE | HAVING |
|---|---|---|
| When it runs | before grouping | after grouping |
| What it filters | individual rows | groups |
| Aggregates allowed | no | yes |

Rule of thumb: if a condition is about a single row (status, date, city), put it in **WHERE** so the database processes less data. Keep only conditions on aggregates in **HAVING**.

```sql
-- Customers with 3+ paid orders in 2026
SELECT customer_id, COUNT(*) AS orders
FROM orders
WHERE status = 'paid'
  AND created_at >= '2026-01-01' AND created_at < '2027-01-01'
GROUP BY customer_id
HAVING COUNT(*) >= 3;
```

## Grouping by dates

A monthly report is the most common task. Truncate each date to the start of its period:

```sql
-- PostgreSQL
SELECT DATE_TRUNC('month', created_at) AS month, SUM(total) AS revenue
FROM orders
WHERE status = 'paid'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month;

-- MySQL
SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, SUM(total) AS revenue
FROM orders
WHERE status = 'paid'
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY month;
```

Note: a month with no sales simply **won't appear** in the result. To show zeros, `LEFT JOIN` the result onto a calendar (`generate_series` in PostgreSQL or a dates table).

Watch time zones too: an order placed at 01:00 local time may land on the previous day if timestamps are stored in UTC.

## Common mistakes

- **A SELECT column that is neither grouped nor aggregated.** PostgreSQL raises an error; MySQL without `ONLY_FULL_GROUP_BY` returns an arbitrary value from the group.
- **An aggregate in WHERE** — `WHERE SUM(total) > 100` does not work; use `HAVING`.
- **Double counting after a JOIN.** Join orders to line items and each order total repeats once per item. Aggregate first, then join, or sum the line items instead.
- **Integer division.** In PostgreSQL `AVG` over integers returns a fraction, but `SUM(a) / COUNT(*)` with integers can drop the decimal part.
- **Aliases in HAVING.** MySQL allows `HAVING revenue > 100`, PostgreSQL does not: repeat the `SUM(total)` expression.

## FAQ

### Can I use HAVING without GROUP BY?

Yes. The whole result is then treated as a single group, and `HAVING` decides whether that one row is returned. It is rare in practice.

### Why is COUNT(column) lower than COUNT(*)?

`COUNT(column)` skips rows where that column is `NULL`. Use `COUNT(*)` for the number of rows and `COUNT(column)` for the number of filled values.

### How do I group by several columns?

List them separated by commas: `GROUP BY city, DATE_TRUNC('month', created_at)`. A group is formed for each unique combination of values, such as "city and month".
