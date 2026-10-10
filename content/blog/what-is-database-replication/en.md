---
title: What Is Database Replication and Why It Matters
description: Replication keeps live copies of a database on other servers. Learn how primary-replica setups work, sync vs async modes, failover and why it is not a backup.
summary: Replication continuously copies changes from a primary database to one or more replicas, so you can spread read load and switch to a replica if the primary fails. It protects against server failure, not against mistakes: a deleted table is deleted on every replica too, so you still need backups.
---

## Replication in plain terms

**Database replication** means keeping one or more **live copies** of a database on other servers and updating them automatically as data changes.

The most common setup is **primary-replica** (also called leader-follower or, in older docs, master-slave):

- The **primary** accepts all writes.
- **Replicas** receive a stream of changes from the primary and apply them.
- Applications can **read** from replicas; writes go only to the primary.

PostgreSQL streams its write-ahead log (WAL) to replicas; MySQL uses its binary log (binlog). The idea is the same: every change recorded on the primary is replayed on the copies.

## Why you need it

- **High availability.** If the primary server dies, a replica already has almost all the data and can take over in minutes or seconds instead of hours of restoring.
- **Read scaling.** Reports, search pages and analytics can run on replicas without slowing down the main workload.
- **Geography.** A replica closer to users or in another data center reduces latency and survives a site outage.
- **Safe heavy operations.** Long exports and analytical queries can run on a replica.

## Synchronous vs asynchronous

| | Asynchronous | Synchronous |
|---|---|---|
| When the write is confirmed | As soon as the primary saves it | After at least one replica confirms it too |
| Write latency | Lower | Higher, depends on network to the replica |
| Risk on primary failure | The latest transactions may be lost | No loss of confirmed transactions |
| Risk if a replica is down | None for writes | Writes may stall without a healthy sync replica |

**Asynchronous** is the default in most setups: fast, but replicas lag slightly behind. **Synchronous** guarantees confirmed data exists in two places, at the cost of speed and availability. Many teams combine them: one synchronous replica nearby, others asynchronous. MySQL also offers a **semi-synchronous** mode in between.

## Read scaling and replication lag

Sending reads to replicas works well, but remember **replication lag**: a replica can be behind the primary by milliseconds or, under load, much more.

Classic bug: a user saves a profile, the next page reads from a replica, and the old data appears. Solutions:

- Read **"your own writes"** from the primary for a short time after a change.
- Keep critical reads (balances, payments, stock) on the primary.
- **Monitor lag** and remove replicas that fall too far behind from the read pool.

## Failover

**Failover** is switching the primary role to a replica when the primary fails.

- **Manual failover**: an engineer promotes a replica and repoints the application. Simple, but slow at night.
- **Automatic failover**: tools such as Patroni for PostgreSQL or the built-in mechanisms of managed cloud databases detect failure and promote a replica.

The main danger is **split-brain** — two servers both believing they are the primary and accepting writes. Proper automatic failover uses a consensus store or quorum and fences off the old primary. Test failover regularly; an untested switch tends to fail exactly when needed.

## Replication is not a backup

Replication copies **every** change faithfully — including mistakes:

- `DROP TABLE` or a bad `UPDATE` without `WHERE` reaches all replicas within moments.
- Application bugs that corrupt data are replicated.
- Ransomware or a compromised account affects all copies.

You still need **backups** stored separately, ideally with **point-in-time recovery** so you can restore the state from just before the mistake. A **delayed replica** that applies changes with a fixed lag can help catch errors, but it does not replace backups.

## FAQ

### How many replicas do I need?

For high availability, one replica is the minimum, and for automatic failover with quorum-based tools you usually need at least three nodes in the cluster. Add more replicas only when read load or geography requires it.

### Can I write to a replica?

In a standard primary-replica setup, no: replicas are read-only. Multi-primary setups that accept writes on several nodes exist, but they bring conflict resolution complexity and are used for specific needs.

### Does a managed cloud database handle replication for me?

Usually it offers replicas and automatic failover as options you turn on. You still choose the setup, watch replication lag, plan how the application reconnects and keep backups configured.
