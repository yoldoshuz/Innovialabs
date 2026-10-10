---
title: Change Data Capture (CDC) with Debezium Explained
description: How log-based change data capture works, how Debezium streams database changes to Kafka and downstream systems, and when CDC beats batch ETL.
summary: Log-based CDC reads the database transaction log and turns every insert, update and delete into an event; Debezium does this for PostgreSQL, MySQL and others and publishes the events to Kafka, keeping warehouses, search indexes and caches in sync within seconds instead of after the next batch job.
---

## The short answer

**Change Data Capture (CDC)** means capturing every change in a database and delivering it to other systems. The most reliable form is **log-based CDC**: instead of querying tables, it reads the database's own transaction log, the same log the database uses for replication.

**Debezium** is an open-source CDC platform. It connects to the log, converts each row change into an event and usually publishes it to **Apache Kafka**, from where any number of consumers can read it.

## Three ways to capture changes

| Approach | How it works | Weak spots |
|---|---|---|
| **Query-based** | Poll `WHERE updated_at > last_run` | Misses hard deletes, depends on a reliable timestamp, loads the database |
| **Trigger-based** | Triggers write changes to an audit table | Extra write on every transaction, triggers to maintain |
| **Log-based** | Read WAL (PostgreSQL) or binlog (MySQL) | Needs log access and configuration, more moving parts |

Log-based CDC sees **every committed change, including deletes**, in commit order, with almost no extra load on the tables themselves.

## How Debezium works

Debezium most often runs as a **source connector in Kafka Connect**. For each database it:

1. Takes an optional **initial snapshot** of the selected tables.
2. Switches to streaming changes from the log: in PostgreSQL through a **logical replication slot** (`pgoutput` plugin), in MySQL through the **row-based binlog**.
3. Writes events to Kafka topics, typically one topic per table, named like `prefix.schema.table`.
4. Stores its position (offset) so it can resume after a restart.

Each event carries the row state **before** and **after** the change, the operation (`c` create, `u` update, `d` delete, `r` snapshot read) and source metadata such as the transaction and timestamp.

Preparing PostgreSQL:

```ini
# postgresql.conf
wal_level = logical
```

A minimal connector registration for Kafka Connect:

```json
{
  "name": "shop-connector",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "plugin.name": "pgoutput",
    "database.hostname": "db",
    "database.port": "5432",
    "database.user": "debezium",
    "database.password": "${file:/secrets/db.properties:password}",
    "database.dbname": "shop",
    "topic.prefix": "shop",
    "table.include.list": "public.orders,public.customers"
  }
}
```

Use a dedicated database user with only the replication and read privileges Debezium needs.

## Delivering changes downstream

Once events are in Kafka, many consumers can use them independently:

- **Data warehouse** (ClickHouse, BigQuery, Snowflake and others) through sink connectors or a streaming job.
- **Search index** such as Elasticsearch, updated as soon as a product changes.
- **Cache invalidation** in Redis.
- **Other microservices** that react to business events.

If you do not want Kafka, **Debezium Server** can send events directly to other messaging systems, and an embedded engine exists for JVM applications.

## CDC vs batch ETL for warehouse sync

| | Batch ETL | Log-based CDC |
|---|---|---|
| Freshness | After the next run | Near real time |
| Deletes | Often missed | Captured |
| Load on source | Heavy queries during runs | Reading the log |
| Complexity | Low: scheduler and SQL | Higher: Kafka, connectors, monitoring |
| History of changes | Only the final state | Every intermediate change |

Batch ETL is still a good choice when daily or hourly freshness is enough, data volume is moderate and the team has no streaming infrastructure. CDC pays off when reports must be fresh, tables are large, or several systems need the same changes.

## Pitfalls to plan for

- **Replication slots retain WAL.** If the connector stops, PostgreSQL keeps WAL for the slot and the disk can fill up. Monitor slot lag and set alerts.
- **At-least-once delivery.** After failures, events may repeat. Make consumers **idempotent**, for example upserts by primary key.
- **Schema changes** must be handled by consumers; consider a schema registry.
- **Ordering** is guaranteed per key (Kafka partition), not globally.
- **Internal tables leak structure.** For events meant for other services, the **outbox pattern** (a dedicated events table captured by CDC) gives a stable contract.

## FAQ

### Do I need Kafka to use Debezium?

No, but Kafka Connect is the most common setup. Debezium Server and the embedded engine let you deliver events to other systems without running Kafka.

### Does CDC slow down the database?

Reading the log is light compared with polling queries, but logical decoding still uses CPU and the replication slot retains WAL while the consumer is behind. Monitor both.

### Can CDC replace backups?

No. CDC streams changes, including mistakes, to other systems. Backups and point-in-time recovery remain necessary. The [Debezium documentation](https://debezium.io/documentation/) covers connector-specific setup.
