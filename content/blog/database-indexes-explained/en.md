---
title: Database Indexes Explained: How They Speed Up Queries
description: How B-tree indexes work, when to use composite and unique indexes, why column order matters, what indexes cost on writes and how to check one is used.
summary: An index is a separate sorted structure, usually a B-tree, that lets the database jump straight to matching rows instead of reading the whole table; it speeds up reads but slows down every insert, update and delete, so add indexes for real queries, not just in case.
---

## The short answer

Without an index, a query like `WHERE email = 'a@b.com'` makes the database read every row of the table: a **sequential scan**. An **index** is an extra structure that keeps the values of one or more columns sorted, with pointers to the rows. The database searches the index, finds the right pointers in a few steps and reads only those rows.

The trade-off is simple: **faster reads, slower writes and more disk space**.

## How a B-tree index works

Most relational databases (PostgreSQL, MySQL, SQL Server) use a **B-tree** as the default index type. Picture a phone book split into levels:

- the **root** page says "A–K go left, L–Z go right";
- **internal** pages narrow the range further;
- **leaf** pages hold the sorted values and pointers to table rows.

The tree is balanced and wide, so even a very large table needs only a few page reads to reach any value. Because leaves are sorted and linked, a B-tree handles more than equality:

- `=` and `IN`;
- ranges: `>`, `<`, `BETWEEN`;
- prefix search: `LIKE 'abc%'` (but not `LIKE '%abc'`);
- `ORDER BY` on the indexed columns, often without a separate sort.

## Creating indexes

```sql
-- single column
CREATE INDEX idx_orders_customer ON orders (customer_id);

-- unique: also enforces a rule
CREATE UNIQUE INDEX idx_users_email ON users (email);

-- composite: several columns
CREATE INDEX idx_orders_customer_date ON orders (customer_id, created_at);
```

A **unique index** both speeds up lookups and guarantees no duplicates. Primary keys and `UNIQUE` constraints create one automatically.

## Composite indexes and column order

A composite index is sorted by the first column, then by the second inside each value of the first, and so on, like a phone book sorted by last name, then first name.

For an index on `(customer_id, created_at)`:

| Query condition | Uses the index well? |
|---|---|
| `customer_id = 5` | Yes |
| `customer_id = 5 AND created_at > '2026-01-01'` | Yes, ideal |
| `customer_id = 5 ORDER BY created_at` | Yes, no extra sort |
| `created_at > '2026-01-01'` only | Usually not |

The rule of thumb: **put columns used with equality first, then the range or sort column**. An index on `(a, b)` also covers queries on `a` alone, so a separate index on `a` is usually redundant.

## The write cost

Every index must be updated whenever a row is inserted, a relevant column is updated or a row is deleted. More indexes mean:

- slower `INSERT`, `UPDATE` and `DELETE`;
- more disk space and memory for cache;
- longer backups and restores.

For a read-heavy catalog this is a good deal. For a table that receives a constant stream of writes, such as events or logs, each extra index should earn its place.

## How to tell if an index is used

Ask the database for the query plan. In PostgreSQL:

```sql
EXPLAIN ANALYZE
SELECT * FROM orders WHERE customer_id = 5;
```

What to look for:

- **Index Scan** or **Index Only Scan**: the index is used.
- **Bitmap Index Scan**: the index is used to collect many matching rows.
- **Seq Scan**: the whole table is read.

A Seq Scan is not always a problem. On a small table, or when the query returns a large share of rows, reading everything is cheaper, and the planner chooses it on purpose. In MySQL, use `EXPLAIN` and check the `key` column.

## Common reasons an index is ignored

- A function is applied to the column: `WHERE LOWER(email) = ...` needs an index on `LOWER(email)`.
- Type mismatch, for example comparing a text column with a number.
- Leading wildcard: `LIKE '%term'`.
- The query skips the first column of a composite index.
- Statistics are outdated; running `ANALYZE` refreshes them.

## A practical checklist

1. Find slow queries first (slow query log, `pg_stat_statements` or your APM).
2. Index columns in `WHERE`, `JOIN` and `ORDER BY` of those queries.
3. Index foreign key columns that are used in joins.
4. Check the plan before and after.
5. Periodically remove unused and duplicate indexes.

## FAQ

### Should I index every column just in case?

No. Each index slows down writes and takes space, and many of them will never be used. Add indexes for specific slow or frequent queries and confirm the effect with `EXPLAIN`.

### Does a primary key need a separate index?

No. Declaring a primary key creates a unique index automatically. The same is true for `UNIQUE` constraints.

### Why is my query still slow with an index?

The query may return too many rows, use a function on the column, skip the leading column of a composite index or rely on stale statistics. Read the plan with `EXPLAIN ANALYZE` to see what actually happens.
