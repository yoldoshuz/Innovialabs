---
title: What Is ClickHouse and Why Analytics Teams Use It
description: ClickHouse is a columnar database built for fast analytical queries over huge tables. See how it stores data, where it shines and how it compares to PostgreSQL.
summary: ClickHouse is an open-source columnar database designed for analytics: it scans and aggregates billions of rows quickly because it reads only the needed columns and compresses them well. It is a poor fit for frequent single-row updates and transactions, so it usually works next to PostgreSQL, not instead of it.
---

## The short answer

**ClickHouse** is an open-source **columnar** database management system for **OLAP** — online analytical processing. Its job is to answer questions like "how many purchases per city per day over the last year" across very large tables, fast enough for dashboards and ad-hoc exploration.

Analytics teams pick it because it combines high query speed, strong compression and plain SQL that analysts already know.

## Columnar storage: why it is fast

A classic database like PostgreSQL stores data **by rows**: all fields of one record sit together. That is ideal for "fetch order #1042 and update its status".

ClickHouse stores data **by columns**: all values of `city` together, all values of `amount` together, and so on. For analytics this changes everything:

- A query that uses 3 columns out of 50 **reads only those 3** from disk.
- Values in one column are similar, so they **compress very well**.
- Processing works on batches of values (vectorized execution), which uses the CPU efficiently.

Compression is configurable per column. LZ4 is the default; ZSTD gives a higher ratio, and specialized codecs such as `Delta`, `DoubleDelta` or `Gorilla` help with timestamps and metrics.

## MergeTree: the core table engine

Most ClickHouse tables use the **MergeTree** family of engines:

- Each insert creates an immutable **part** on disk; background processes **merge** parts into larger ones.
- `ORDER BY` defines how data is sorted and builds a **sparse primary index** — it points to blocks of rows (granules), not to every row.
- `PARTITION BY` splits data, usually by month or day, so old partitions are easy to drop.

Specialized variants solve common tasks: **ReplacingMergeTree** (keeps the latest version of a row), **SummingMergeTree** and **AggregatingMergeTree** (pre-aggregate during merges), and **Replicated** versions for replication.

```sql
CREATE TABLE events
(
    event_time DateTime,
    user_id    UInt64,
    event_type LowCardinality(String),
    url        String
)
ENGINE = MergeTree
PARTITION BY toYYYYMM(event_time)
ORDER BY (event_type, event_time);

SELECT event_type, count() AS events, uniq(user_id) AS users
FROM events
WHERE event_time >= now() - INTERVAL 7 DAY
GROUP BY event_type
ORDER BY events DESC;
```

## Typical workloads

- **Product and web analytics**: clicks, page views, funnels, retention.
- **Event logs** from applications and services.
- **Observability**: logs, metrics and traces at large volume.
- **Ad tech and marketing**: impressions, attribution, campaign reports.
- **Business dashboards** in BI tools that need to stay fast on large history.

The common pattern: lots of append-only events, rare changes, queries that aggregate many rows.

## ClickHouse vs PostgreSQL

| | PostgreSQL | ClickHouse |
|---|---|---|
| Storage | Rows | Columns |
| Best at | Transactions, point lookups, updates | Aggregations over large tables |
| Updates and deletes | Cheap, routine | Heavy operations, best avoided as routine |
| Inserts | Row by row is fine | Large batches preferred |
| Transactions | Full ACID | Limited |
| Typical role | Main app database | Analytics store |

In practice, many systems use **both**: PostgreSQL runs the product, while events and copies of business data flow into ClickHouse through ETL or change data capture for reporting.

## Common mistakes

- **Inserting one row at a time.** Every insert creates a part; thousands of tiny inserts overload merges. Batch them or use asynchronous inserts.
- **Choosing ORDER BY carelessly.** Put the columns you filter by most often first.
- **Treating it like an OLTP database** with frequent updates of individual rows.
- **Moving to ClickHouse too early.** If PostgreSQL with good indexes handles your reports, you may not need a second database yet.

## FAQ

### Can ClickHouse replace PostgreSQL as the main database?

Usually not. It lacks the cheap updates, full transactions and point-lookup performance that a typical application needs. It works best as a dedicated analytics layer next to the main database.

### When is it worth adding ClickHouse?

When analytical queries over large event tables become slow in your main database or start affecting its performance, and the data is mostly appended rather than updated.

### Do analysts need to learn a new language?

No. ClickHouse uses SQL with extra functions for analytics. Most popular BI tools, including Metabase and other common dashboards, can connect to it.
