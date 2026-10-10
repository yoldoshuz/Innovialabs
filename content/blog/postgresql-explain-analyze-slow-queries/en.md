---
title: How to Find Slow Queries in PostgreSQL with EXPLAIN ANALYZE
description: Find slow PostgreSQL queries with pg_stat_statements and the slow query log, read EXPLAIN ANALYZE plans and speed up a real query with the right index.
summary: First find the most expensive queries with pg_stat_statements or log_min_duration_statement, then run EXPLAIN (ANALYZE, BUFFERS) on them and look for the node where time is spent, usually a Seq Scan on a large table or an extra sort that the right index fixes.
---

## The short answer

Fixing slow queries is a two-step job:

1. **Find** which queries actually load the database: `pg_stat_statements` and the slow query log.
2. **Diagnose** a specific query: `EXPLAIN (ANALYZE, BUFFERS)` shows which plan node spends the time, and that tells you what to fix.

## Step 1. Find slow queries

**pg_stat_statements** collects statistics for every normalized query. Enable it in `postgresql.conf`, restart the server and create the extension:

```sql
-- postgresql.conf: shared_preload_libraries = 'pg_stat_statements'
CREATE EXTENSION pg_stat_statements;

SELECT query, calls, total_exec_time, mean_exec_time, rows
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;
```

Sort by **total_exec_time**: a 5 ms query that runs a million times often matters more than a rare 3-second one. Older PostgreSQL versions name these columns `total_time` and `mean_time`.

The **slow query log** records every query above a threshold:

```sql
ALTER SYSTEM SET log_min_duration_statement = '500ms';
SELECT pg_reload_conf();
```

The **auto_explain** module can also log the plans of those queries, which helps when a query is slow only on production.

## Step 2. Read the plan

`EXPLAIN` shows the plan with estimates; `EXPLAIN ANALYZE` **actually runs** the query and adds real timings and row counts. For `UPDATE` and `DELETE`, wrap it in `BEGIN; ... ROLLBACK;`.

Read the plan bottom-up and inside-out. The main nodes:

| Node | What it means | When it is a problem |
|---|---|---|
| **Seq Scan** | reads the whole table | big table, but you need only a few rows |
| **Index Scan** | looks up the index, then fetches rows from the table | rarely; bad if it returns a huge number of rows |
| **Index Only Scan** | everything comes from the index | a good outcome |
| **Bitmap Heap Scan** | collects row addresses from the index, then reads the table | fine for medium-sized results |
| **Nested Loop** | for each row on the left, finds matches on the right | many left rows and no index on the right |
| **Hash Join** | builds a hash table from one side | the hash does not fit in `work_mem` |
| **Sort** | sorting | `external merge Disk` means the sort spilled to disk |

What to look at:

- **actual time** — where the time accumulates;
- estimated vs actual **rows** — a gap of orders of magnitude means stale statistics or a planner misestimate;
- **Rows Removed by Filter** — rows read for nothing;
- **Buffers** — pages read from cache versus disk.

## Step 3. Fixing a real query

The "My orders" page is slow:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, total, created_at
FROM orders
WHERE customer_id = 42
ORDER BY created_at DESC
LIMIT 20;
```

The plan shows `Seq Scan on orders` with a large `Rows Removed by Filter` and a `Sort` above it. The database reads the entire table to find one customer's orders, then sorts them.

The fix is a composite index that both filters and is already sorted:

```sql
CREATE INDEX CONCURRENTLY idx_orders_customer_created
  ON orders (customer_id, created_at DESC);
ANALYZE orders;
```

Running `EXPLAIN ANALYZE` again shows `Index Scan using idx_orders_customer_created` under `Limit`, and the `Sort` node is gone: the database reads exactly the 20 rows it needs from the index.

Column order matters: equality columns first (`customer_id`), then the sort or range column.

## Other common causes

- **Stale statistics** — run `ANALYZE` and check that autovacuum is working.
- **A function on a column** in `WHERE`, such as `lower(email) = ...`, cannot use a plain index; create an expression index.
- **Type mismatches** in comparisons can prevent index use.
- **N+1 queries from an ORM** — each is fast, but there are thousands; visible in `pg_stat_statements` as a huge `calls` value.
- **Too little work_mem** for a specific sort or hash — the plan shows the work happening on disk.

## FAQ

### Is it safe to run EXPLAIN ANALYZE on production?

It really executes the query, so a heavy query will load the database again and a modifying one will change data. For `SELECT` this is usually acceptable; wrap modifying statements in a transaction with `ROLLBACK`.

### Why doesn't PostgreSQL use my index?

Common reasons: the query returns a large share of the table so a sequential read is cheaper, statistics are stale, a function is applied to the column, or the column order of a composite index does not match the condition.

### What is the difference between EXPLAIN and EXPLAIN ANALYZE?

`EXPLAIN` only builds the plan and shows estimates without running the query. `EXPLAIN ANALYZE` runs it and shows actual timings and row counts, which is what you need to find the real cause.
