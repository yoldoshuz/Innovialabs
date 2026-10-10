---
title: SQL Query Optimization Checklist
description: A practical checklist for slow SQL queries: EXPLAIN, selecting only needed columns, sargable filters, indexes, keyset pagination, batching and N+1.
summary: Measure the query with EXPLAIN ANALYZE first, then select only the columns you need, write filters that can use an index, replace OFFSET with keyset pagination and remove N+1 with batched queries.
---

## The short answer

A slow query almost always comes down to one of three things: the database reads **too many rows**, sends **too much data**, or the application runs **too many queries**. The checklist below follows that order. Examples use PostgreSQL, but the ideas apply to MySQL and other databases.

## Step 0: measure, don't guess

Before changing anything, look at the execution plan:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, total FROM orders WHERE customer_id = 42;
```

What to look for:

- a **Seq Scan** over a large table where you expected a handful of rows;
- a big gap between estimated (`rows=`) and actual row counts — a hint to refresh statistics with `ANALYZE`;
- the nodes where most of the time is spent.

To find which queries are worth optimizing at all, enable the `pg_stat_statements` extension: it ranks queries by total time. Remember that `EXPLAIN ANALYZE` actually runs the statement, so test `UPDATE` and `DELETE` inside a transaction and `ROLLBACK`.

## The checklist

### 1. Select only the columns you need

`SELECT *` pulls extra data over the network, prevents covering indexes from helping and breaks when someone adds a heavy column. List fields explicitly.

### 2. Write sargable conditions

A **sargable** condition is one the database can answer with an index. Wrapping the column in a function or expression usually breaks that.

| Bad | Better |
|---|---|
| `WHERE date(created_at) = '2026-01-15'` | `WHERE created_at >= '2026-01-15' AND created_at < '2026-01-16'` |
| `WHERE lower(email) = 'a@b.uz'` | an expression index on `lower(email)`, or normalise on write |
| `WHERE price * 1.12 > 1000` | `WHERE price > 1000 / 1.12` |
| `WHERE name LIKE '%son'` | full-text search or a trigram index (`pg_trgm`) |

Also watch for **type mismatches**: comparing a text column with a number can force a cast and skip the index.

### 3. Check your indexes

- Index columns used in `WHERE`, `JOIN` and `ORDER BY` of frequent queries.
- In a **composite index** order matters: equality columns first, then the range or sort column. `(customer_id, created_at)` fits "a customer's orders for a period".
- Index **foreign keys** — PostgreSQL does not create those indexes automatically.
- Don't add indexes "just in case": each one slows down writes and takes space. Unused ones show up in `pg_stat_user_indexes`.

### 4. Paginate without OFFSET

`OFFSET 100000 LIMIT 20` makes the database read and discard a hundred thousand rows, and later pages get slower. Use **keyset pagination**, which continues from the last value seen:

```sql
SELECT id, created_at, total
FROM orders
WHERE (created_at, id) < ($1, $2)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

This needs an index on `(created_at, id)`. The trade-off is that you can't jump straight to page 500, which feeds and infinite scroll don't need anyway.

### 5. Work in batches

- Insert many rows with one `INSERT ... VALUES (...), (...)` or with `COPY`, not a thousand separate statements.
- Split large `UPDATE` and `DELETE` jobs into chunks by key — locks stay short and replication keeps up.
- Don't keep a transaction open while the application makes network calls.

### 6. Remove N+1

**N+1** happens when the application loads a list of N records and then runs one more query for each. A hundred orders means a hundred and one queries. ORMs make this easy to miss.

Fixes:

- one query with a `JOIN`;
- a second query with `WHERE id = ANY($1)` for all ids at once;
- in the ORM, eager loading of relations (`include`, `select_related`, `prefetch_related` and similar).

The development query log reveals N+1 quickly: dozens of identical queries with different ids for one page view is the classic sign.

### 7. Verify the result

After a change, run `EXPLAIN (ANALYZE, BUFFERS)` again on a realistic data volume. A query that is fast on a hundred test rows can behave very differently on millions.

## Common mistakes

- Optimising a query that runs once a day instead of the one called thousands of times an hour.
- Testing against an empty local database.
- Adding an index without checking that the plan actually uses it.
- Hiding slow queries behind a cache without understanding the cause.

## FAQ

### Why doesn't the database use the index I created?

Common reasons: the condition isn't sargable, the types don't match, statistics are stale, or the query returns a large share of the table so a sequential scan really is cheaper. Start with `ANALYZE` on the table and a fresh `EXPLAIN`.

### Should I drop the ORM to get better performance?

No. An ORM is fine for most queries. Check the SQL it generates, use eager loading for relations and write plain SQL for the few heavy reports.

### How often should slow queries be reviewed?

A regular look at the top of `pg_stat_statements` works well, for example after major releases or when data grows noticeably. Load changes with the product, and yesterday's fast query can become today's bottleneck.
