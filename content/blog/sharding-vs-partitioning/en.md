---
title: Database Sharding vs Partitioning: Scaling Large Tables
description: Partitioning splits a table inside one database, sharding splits data across servers. Learn range, list and hash partitioning and when sharding pays off.
summary: Partitioning divides one large table into smaller pieces inside a single database server, while sharding spreads data across several servers by a shard key; start with partitioning and shard only when one server truly cannot cope.
---

## The short answer

**Partitioning** splits one logical table into several physical tables on the **same server**. The application still talks to one database, and PostgreSQL routes rows to the right partition.

**Sharding** splits data across **several independent servers**. Each shard holds a subset of rows, chosen by a **shard key**. The application (or a proxy layer) must know where each row lives.

Partitioning solves "this table is too big to maintain". Sharding solves "one machine cannot handle the write load or the data volume". The second problem is much rarer, and much more expensive to solve.

## Partitioning in PostgreSQL

PostgreSQL supports declarative partitioning with three strategies.

| Strategy | How rows are split | Typical use |
|---|---|---|
| **Range** | By value ranges, e.g. dates | Logs, events, orders by month |
| **List** | By explicit values | Region, country, tenant type |
| **Hash** | By hash of a column modulo N | Even spread when no natural range exists |

Range partitioning by time is the most common case:

```sql
CREATE TABLE events (
  id         bigint GENERATED ALWAYS AS IDENTITY,
  created_at timestamptz NOT NULL,
  payload    jsonb,
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

CREATE TABLE events_2026_10 PARTITION OF events
  FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');
```

List and hash look similar:

```sql
CREATE TABLE customers (...) PARTITION BY LIST (region);
CREATE TABLE customers_uz PARTITION OF customers FOR VALUES IN ('uz');

CREATE TABLE sessions (...) PARTITION BY HASH (user_id);
CREATE TABLE sessions_p0 PARTITION OF sessions
  FOR VALUES WITH (MODULUS 4, REMAINDER 0);
```

What you actually gain:

- **Partition pruning**: queries filtered by the partition key scan only the relevant partitions.
- **Cheap data removal**: `DETACH PARTITION` and `DROP TABLE` instead of a huge `DELETE` that bloats the table.
- **Smaller indexes** per partition and faster maintenance (VACUUM, reindexing).

Rules to remember: the primary key and unique constraints must include the partition key, and queries that do not filter by the partition key still touch every partition.

## Horizontal sharding

With sharding, each server holds part of the data. The central decision is the **shard key**:

- **Good shard key**: present in almost every query, spreads load evenly, rarely changes. Examples: `tenant_id` in a B2B SaaS, `user_id` in a consumer app.
- **Bad shard key**: low cardinality (country), skewed (one giant customer), or time-based for writes (all new rows hit the newest shard).

Common ways to map a key to a shard:

- **Hash-based**: even distribution, but adding shards requires moving data unless you use many virtual buckets.
- **Range-based**: simple, but prone to hot spots.
- **Directory (lookup table)**: flexible, at the cost of an extra lookup service.

Tools like Citus for PostgreSQL or Vitess for MySQL hide much of the routing, but they do not remove the design constraints.

## Cross-shard queries: the real cost

Once data is sharded, anything that spans several shards becomes harder:

- **Joins** across shards need either co-location (related tables sharded by the same key) or application-side merging.
- **Aggregations** (`COUNT`, `SUM`, reports) must fan out to all shards and combine results.
- **Transactions** across shards require two-phase commit or a saga pattern, with more failure modes.
- **Unique constraints and sequences** stop being global by default.

This is why analytics usually moves to a separate warehouse once data is sharded.

## When each is premature

Partitioning is premature when:

- The table fits comfortably in memory and queries are fast with proper indexes.
- Most queries do not filter by any natural partition key.

Sharding is premature when you have not yet tried:

- Query and index optimization, connection pooling.
- Vertical scaling (a larger server) and read replicas for read-heavy load.
- Partitioning and archiving old data.
- Moving analytics off the primary database.

A useful order of operations: **optimize, scale up, add replicas, partition, then shard**.

## Common mistakes

- Choosing a shard key based on today's queries without thinking about tomorrow's reports.
- Creating thousands of tiny partitions, which slows down planning.
- Forgetting to create future partitions in advance, so inserts fail at the start of a new month.
- Sharding to fix slow queries that were really caused by missing indexes.

## FAQ

### Can I combine partitioning and sharding?

Yes. A common setup shards by tenant or user and then partitions each shard's large tables by time. Start with partitioning alone and add sharding only when needed.

### Does partitioning make every query faster?

No. It helps queries that filter by the partition key and simplifies maintenance. Queries without that filter may become slightly slower because they touch more tables.

### How do I know a single server is no longer enough?

Look for sustained write saturation, storage limits or replication lag that remain after tuning, scaling up and offloading reads. If those limits are real, sharding becomes a reasonable next step.
