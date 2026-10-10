---
title: SQL Basics: SELECT, WHERE, ORDER BY and LIMIT
description: Your first SQL queries on a sample orders table: selecting, filtering, sorting, LIKE, IN, NULL handling and the mistakes beginners make most often.
summary: Almost every read query follows the pattern SELECT columns FROM table WHERE condition ORDER BY sorting LIMIT count. Learn these five parts plus LIKE, IN and IS NULL, and you can pull most of the data you need from a database.
---

## The shape of a first query

A read query in SQL is almost always built from the same parts in a fixed order:

```sql
SELECT columns
FROM table
WHERE condition
ORDER BY sorting
LIMIT count;
```

- **SELECT** — which columns to show.
- **FROM** — which table to read.
- **WHERE** — which rows to keep.
- **ORDER BY** — how to sort them.
- **LIMIT** — how many rows to return.

Only `SELECT` and `FROM` are required; the rest is added when needed. The order of the parts cannot change.

## The sample orders table

All examples below use this orders table:

| id | customer | city | status | total | created_at |
|----|----------|------|--------|-------|------------|
| 1 | Aliya | Tashkent | paid | 450000 | 2026-03-01 |
| 2 | Bobur | Samarkand | new | 120000 | 2026-03-02 |
| 3 | Dilnoza | Tashkent | cancelled | 89000 | 2026-03-02 |
| 4 | Eugene | Bukhara | paid | 1200000 | 2026-03-03 |
| 5 | Aliya | Tashkent | new | NULL | 2026-03-04 |

## SELECT: choosing columns

```sql
SELECT customer, total FROM orders;
```

`SELECT *` returns every column. It is handy for exploring a table, but in application code list the columns explicitly: the query is faster and will not break when someone adds new fields.

## WHERE: filtering rows

```sql
SELECT id, customer, total
FROM orders
WHERE status = 'paid' AND total > 300000;
```

Core operators:

- comparison: `=`, `<>` (not equal), `>`, `<`, `>=`, `<=`;
- logic: `AND`, `OR`, `NOT`;
- range: `total BETWEEN 100000 AND 500000` (both ends included).

When mixing `AND` and `OR`, use parentheses — `AND` is evaluated first:

```sql
WHERE city = 'Tashkent' AND (status = 'new' OR status = 'paid')
```

## IN and LIKE

**IN** replaces a chain of `OR`s:

```sql
SELECT * FROM orders WHERE city IN ('Tashkent', 'Bukhara');
```

**LIKE** matches a pattern: `%` means any number of characters, `_` means exactly one.

```sql
SELECT * FROM orders WHERE customer LIKE 'Al%';
```

Note that in PostgreSQL `LIKE` is case-sensitive (use `ILIKE` for case-insensitive search), while in MySQL it depends on the collation. A pattern that starts with `%` usually cannot use a regular index and gets slow on large tables.

## NULL needs special care

**NULL** means "unknown value" — not zero and not an empty string. Order 5 has no total yet.

```sql
-- wrong: returns no rows
SELECT * FROM orders WHERE total = NULL;

-- correct
SELECT * FROM orders WHERE total IS NULL;
SELECT * FROM orders WHERE total IS NOT NULL;
```

Any comparison with NULL yields "unknown", so the row fails the filter. That is also why `WHERE total < 100000` will not show order 5. To substitute a default value, use `COALESCE(total, 0)`.

## ORDER BY and LIMIT

```sql
SELECT customer, total, created_at
FROM orders
WHERE status <> 'cancelled'
ORDER BY total DESC, created_at ASC
LIMIT 3;
```

- `ASC` sorts ascending (the default), `DESC` descending.
- You can sort by several columns: first by the first one, then by the second on ties.
- Where NULLs land in the sort order depends on the DBMS. PostgreSQL lets you set it explicitly with `NULLS LAST`.
- `LIMIT` works in PostgreSQL, MySQL and SQLite. SQL Server uses `TOP` or `OFFSET ... FETCH` instead.

Without `ORDER BY`, row order is not guaranteed, so `LIMIT` without sorting may return different rows each time.

## Common beginner mistakes

- **Double quotes for text.** Strings go in single quotes: `'paid'`. In standard SQL, double quotes mark column names.
- **`= NULL` instead of `IS NULL`.**
- **Missing parentheses** when combining `AND` and `OR`.
- **`NOT IN` with a list that contains NULL** — the query returns no rows at all.
- **`LIMIT` without `ORDER BY`** — your "top 10" ends up random.
- **Practicing on a production database.** Use a copy while you learn.

## FAQ

### Does case matter in SQL keywords?

No, `select` and `SELECT` work the same. Keywords are conventionally written in uppercase so they stand out from table and column names.

### Where can I practice SQL?

Install PostgreSQL or SQLite locally and create a small table of your own, such as orders. Online sandboxes that run queries in the browser also work well.

### How do I get a page of results, like rows 11 to 20?

Combine `LIMIT` with `OFFSET`: `ORDER BY id LIMIT 10 OFFSET 10`. On very large tables big `OFFSET` values get slow, so keyset pagination is used instead: `WHERE id > last_id ORDER BY id LIMIT 10`.
