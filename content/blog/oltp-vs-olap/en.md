---
title: OLTP vs OLAP: Transactional vs Analytical Databases
description: How OLTP and OLAP workloads differ, how row and column storage affect query speed, and why reports should not run on your application's production database.
summary: OLTP databases handle many small application operations such as orders, payments and sign-ups. OLAP databases are built for heavy analytical queries over large amounts of history. Mixing both workloads in one database is a common cause of slow production systems.
---

## The core difference

**OLTP (Online Transaction Processing)** databases run the application itself. A user places an order, pays, changes an address — each action becomes a short transaction that reads or changes a few rows. There are lots of them, and each must finish in milliseconds. Typical examples: PostgreSQL, MySQL, SQL Server.

**OLAP (Online Analytical Processing)** databases are built for analysis. They receive fewer queries, but each may scan millions of rows: revenue by month over three years, average order value by region, funnel by channel. What matters is aggregation speed, not individual records. Examples: ClickHouse, BigQuery, Snowflake.

## Workloads compared

| Aspect | OLTP | OLAP |
|---|---|---|
| Typical operation | Insert, update or read a single record | Sum, average or count over a large range |
| Data per query | A few rows | Millions of rows, but only a few columns |
| Frequency | Very many short queries | Few long queries |
| Users | The application and its customers | Analysts, BI tools, management |
| Priority | Integrity, transactions, low latency | Aggregation speed, compression, history |
| Data model | Normalized, no duplication | Denormalized, star schemas and marts |

## Row vs column storage

The workload determines how data sits on disk.

**Row storage (OLTP).** All fields of a record are stored together. To show an order page, the database reads one place on disk and gets every field at once. Perfect for "find order by ID and update its status".

**Column storage (OLAP).** Values of each column are stored separately. A query like "sum of `amount` by month" needs two columns out of, say, thirty — the database never reads the rest. Similar values in one column also compress very well.

The trade-off: updating individual rows in a columnar database is expensive, so data is usually loaded in batches rather than one record at a time.

```sql
-- Typical OLTP query: one record by key
SELECT status, total FROM orders WHERE id = 48213;

-- Typical OLAP query: aggregation over the whole history
SELECT date_trunc('month', created_at) AS month, SUM(total)
FROM orders
GROUP BY 1
ORDER BY 1;
```

## Why reports should not run on production

The second query looks harmless, but on a large table it:

- **Scans the whole table** and pushes data the application needs out of the cache.
- **Loads CPU and disk**, so regular user queries start waiting.
- **Holds a long-running snapshot**, which in PostgreSQL blocks cleanup of old row versions and bloats tables.
- **Invites extra "reporting" indexes** that slow down every write.

The result is familiar: at month-end, finance runs a report and the website and CRM slow to a crawl.

## What to do instead

1. **Read replica.** A separate copy of the production database where reports are sent. The simplest first step.
2. **Analytical database.** Regularly load data into ClickHouse, BigQuery or another columnar store.
3. **Data marts.** Pre-aggregated tables, such as daily revenue, so dashboards do not recompute the whole history.
4. **Guardrails.** A dedicated analytics user with a query timeout.

## FAQ

### Can one database handle both workloads?

Hybrid systems exist (often called HTAP), and PostgreSQL handles simple analytics fine at small volumes. But as data grows, separating the workloads is almost always simpler and more reliable.

### Does a read replica fully solve the problem?

It protects the primary database from heavy queries, but a replica is still a row-based database. When analytical queries become slow there too, it is time for a columnar store.

### Can application data live in an OLAP database?

It is not a good idea. Columnar databases are not designed for frequent point updates and the strict transactions that orders and payments need.
