---
title: How to Set Up PostgreSQL Streaming Replication
description: Step-by-step PostgreSQL streaming replication: primary and standby setup, replication slots, lag monitoring, read replicas and manual or Patroni failover.
summary: Allow replication on the primary, create a role and a slot, build the standby with pg_basebackup -R, watch lag in pg_stat_replication, and fail over with pg_promote or automatically with Patroni.
---

## The short answer

**Streaming replication** ships the write-ahead log (WAL) from the main server (**primary**) to one or more **standby** servers in near real time. A standby can serve reads and act as a ready replacement if the primary fails.

The setup order:

1. Allow replication connections on the primary.
2. Create a role and a **replication slot**.
3. Copy the data to the standby with `pg_basebackup`.
4. Start the standby and check the lag.
5. Plan read routing and a **failover** procedure.

Note: replication is not a backup. A mistaken `DELETE` reaches every replica instantly, so you still need backups with point-in-time recovery.

## Step 1. Configure the primary

In `postgresql.conf`:

```ini
listen_addresses = '*'
wal_level = replica
max_wal_senders = 10
max_replication_slots = 10
```

`wal_level = replica` is the default in modern versions, but verify it. Changing `listen_addresses` or `wal_level` requires a restart.

Create a replication role and a slot:

```sql
CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD 'strong_password';
SELECT pg_create_physical_replication_slot('standby1');
```

Allow the connection in `pg_hba.conf` from the replica's address only:

```text
host  replication  replicator  10.0.0.12/32  scram-sha-256
```

After editing `pg_hba.conf`, `SELECT pg_reload_conf();` is enough.

## Step 2. Build the standby

On the replica server, stop PostgreSQL and empty the data directory. Then copy the data from the primary:

```bash
pg_basebackup -h 10.0.0.11 -U replicator \
  -D /var/lib/postgresql/data \
  -X stream -S standby1 -R -P
```

- `-X stream` — stream WAL during the copy;
- `-S standby1` — use the slot you created;
- `-R` — create `standby.signal` and write `primary_conninfo` into `postgresql.auto.conf`.

Check that `postgresql.auto.conf` contains `primary_slot_name = 'standby1'`, then start the server. `hot_standby = on` (the default) allows read queries on the replica.

## Why slots matter, and why they are risky

A **replication slot** makes the primary keep WAL until the standby has received it. Without a slot, a replica that was down for a long time may fall behind for good and need a fresh copy.

The flip side: if a replica is gone for good but its slot remains, WAL piles up on the primary until the disk fills. So:

- drop slots of retired replicas: `SELECT pg_drop_replication_slot('standby1');`;
- cap retention with `max_slot_wal_keep_size` (available in modern versions);
- monitor how much WAL each slot retains.

## Step 3. Monitor lag

On the primary:

```sql
SELECT client_addr, state, replay_lag,
       pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn) AS lag_bytes
FROM pg_stat_replication;

SELECT slot_name, active,
       pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn) AS retained_bytes
FROM pg_replication_slots;
```

On the standby, time since the last replayed transaction:

```sql
SELECT now() - pg_last_xact_replay_timestamp() AS replay_delay;
```

This value also grows when the primary simply has no writes, so read it together with `lag_bytes`. Export the metrics to your monitoring system (for example, Prometheus with postgres_exporter) and alert on lag, inactive slots and disconnected replicas.

## Step 4. Read from replicas

Replicas take reports, analytics and heavy queries off the primary. Routing options:

- **in the application** — two connection pools: writes to the primary, reads to the replica;
- **through libpq** — several hosts in the connection string plus `target_session_attrs` (`read-write` for writes, `read-only` or `prefer-standby` in newer versions);
- **through a proxy** — HAProxy or Pgpool-II.

Remember replication is **asynchronous** by default: data you just wrote may not be on the replica yet. Send "read your own writes" queries, such as right after saving a form, to the primary. If losing the last transactions in a failure is unacceptable, consider synchronous replication with `synchronous_standby_names`, at the cost of write latency.

## Step 5. Failover

### Manually

1. Confirm the primary is really down and **fence it** so it can't come back as a second primary (split-brain).
2. On the standby run `SELECT pg_promote();` or `pg_ctl promote`.
3. Switch the application: DNS, a virtual IP or the connection string.
4. Bring the old primary back only as a replica, using `pg_rewind` or a new `pg_basebackup`.

### With Patroni

**Patroni** manages the cluster automatically: it stores leader information in a DCS (etcd, Consul or ZooKeeper), watches node health and promotes the best replica on failure. HAProxy usually sits in front, checking Patroni's REST API (the `/primary` and `/replica` endpoints) to route traffic to the right node.

Useful commands:

```bash
patronictl -c /etc/patroni.yml list
patronictl -c /etc/patroni.yml switchover
```

Rehearse a planned `switchover` regularly on a staging cluster — a failover that has never been run can't be trusted. Details are in the [PostgreSQL documentation](https://www.postgresql.org/docs/current/warm-standby.html).

## FAQ

### How many replicas do I need?

At least one for resilience. For automatic failover with Patroni, a common setup is three PostgreSQL nodes and a three-node DCS cluster for quorum. Add more replicas as read load grows.

### Can I replicate between different PostgreSQL versions?

No, physical streaming replication requires the same major version and platform. To move between versions, use logical replication or `pg_upgrade`.

### Does a replica replace backups?

No. A replica protects against server failure, not against bad data — mistakes replicate instantly. You still need separate backups with point-in-time recovery.
