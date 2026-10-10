---
title: Zero-Downtime Database Schema Changes: Expand and Contract
description: Rename columns, add NOT NULL fields and build indexes on large PostgreSQL tables without blocking production, using the expand and contract pattern.
summary: Never change a live schema in one breaking step: first expand (add new structures that work alongside the old ones), migrate data and code gradually, then contract (remove the old parts) once nothing uses them.
---

## The short answer

A schema change causes downtime for two reasons: **locks** that block queries while the change runs, and **incompatibility** between the new schema and the application code that is still running. The **expand and contract** pattern solves both:

1. **Expand**: add new columns, tables or indexes without removing anything. Old and new code both work.
2. **Migrate**: deploy code that writes to both shapes, backfill existing data in batches, switch reads.
3. **Contract**: once no code uses the old structure, remove it.

Each step is a separate, small, reversible deployment.

## Rule zero: protect yourself from lock queues

In PostgreSQL, most `ALTER TABLE` commands need an `ACCESS EXCLUSIVE` lock. Even if the change itself is instant, it has to wait for running transactions, and **every new query queues behind it**. One long report can freeze the table for everyone.

Always set a short lock timeout in migration sessions and retry on failure:

```sql
SET lock_timeout = '3s';
SET statement_timeout = '15min';
ALTER TABLE orders ADD COLUMN note text;
```

If the lock is not acquired in time, the migration fails cleanly instead of causing an outage.

## Renaming a column

`ALTER TABLE ... RENAME COLUMN` is instant, but it breaks every running instance of the old code. Do it in stages instead. Example: `name` becomes `full_name`.

1. **Expand**: `ALTER TABLE users ADD COLUMN full_name text;`
2. **Dual write**: deploy code that writes to both columns (or add a trigger that copies `name` into `full_name`).
3. **Backfill** in small batches to avoid long transactions and replication lag:

```sql
UPDATE users SET full_name = name
WHERE id IN (
  SELECT id FROM users
  WHERE full_name IS NULL
  LIMIT 5000
);
-- repeat until 0 rows updated
```

4. **Switch reads** to `full_name`, then stop writing `name`.
5. **Contract**: `ALTER TABLE users DROP COLUMN name;` in a later release.

## Adding a NOT NULL column

Adding a nullable column, or a column with a constant default, is a metadata-only change in modern PostgreSQL versions. The risky part is enforcing `NOT NULL` on an existing column, because a plain `SET NOT NULL` scans the whole table under an exclusive lock.

The safe sequence:

```sql
-- 1. Add without the constraint
ALTER TABLE orders ADD COLUMN currency text;

-- 2. Deploy code that always fills it, backfill old rows in batches

-- 3. Add a check that is not validated yet (fast)
ALTER TABLE orders ADD CONSTRAINT orders_currency_nn
  CHECK (currency IS NOT NULL) NOT VALID;

-- 4. Validate without blocking writes
ALTER TABLE orders VALIDATE CONSTRAINT orders_currency_nn;

-- 5. Optional: convert to a real NOT NULL (recent PostgreSQL
--    versions use the validated check and skip the full scan)
ALTER TABLE orders ALTER COLUMN currency SET NOT NULL;
ALTER TABLE orders DROP CONSTRAINT orders_currency_nn;
```

The same `NOT VALID` then `VALIDATE` trick works for foreign keys.

## Building indexes concurrently

A regular `CREATE INDEX` blocks writes to the table until it finishes. On a large table that can take a long time. Use:

```sql
CREATE INDEX CONCURRENTLY idx_orders_customer
  ON orders (customer_id);
```

Things to know:

- It **cannot run inside a transaction block**, so many migration tools need a special flag to disable the wrapping transaction.
- It is slower and does two passes over the table.
- If it fails, it leaves an **INVALID index**. Drop it with `DROP INDEX CONCURRENTLY` and try again.
- `DROP INDEX CONCURRENTLY` and `REINDEX CONCURRENTLY` exist for the reverse and repair cases.

In MySQL, InnoDB supports online DDL for many operations (`ALGORITHM=INPLACE, LOCK=NONE`), and tools like gh-ost or pt-online-schema-change rebuild tables in the background.

## Checklist before running a migration

- Is the change **backward compatible** with the currently deployed code?
- Does any statement take an exclusive lock or rewrite the table? Check the documentation for that `ALTER` form.
- Is `lock_timeout` set, and is there a retry?
- Are backfills batched and throttled, with replication lag monitored?
- Can each step be rolled back independently?
- Have you rehearsed it on a copy of production-sized data?

## Common mistakes

- Changing a column type in place (`ALTER COLUMN TYPE`), which often rewrites the whole table. Use a new column plus backfill instead.
- Dropping a column in the same release that stops using it, while old instances are still running.
- One giant `UPDATE` for the backfill, which bloats the table and delays replicas.
- Forgetting that ORMs may cache the column list and fail after a drop.

## FAQ

### Do I need expand and contract for small tables?

For small tables a direct change usually completes instantly. The compatibility problem remains, though: if old code is still running during deploy, a rename or drop can still break requests.

### How long should I wait before the contract step?

Until every running instance uses the new code and you are confident you will not roll back. In practice, many teams do the contract step in the next release cycle.

### Can migration tools handle this automatically?

Some tools warn about dangerous operations or wrap them safely, but none can know your application's compatibility. The staged plan is still your responsibility. The [PostgreSQL ALTER TABLE documentation](https://www.postgresql.org/docs/current/sql-altertable.html) lists the lock level for each form.
