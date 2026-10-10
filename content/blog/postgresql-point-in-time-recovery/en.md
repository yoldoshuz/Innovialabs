---
title: PostgreSQL Point-in-Time Recovery with WAL Archiving
description: Set up base backups and WAL archiving with pgBackRest or WAL-G, restore PostgreSQL to the second before an accidental delete and test the procedure.
summary: Point-in-time recovery restores a base backup and then replays archived WAL files up to a chosen moment, so you can return the database to the second before a bad DELETE; it requires continuous WAL archiving and regular restore tests.
---

## The short answer

PostgreSQL writes every change to the **write-ahead log (WAL)** before applying it to data files. If you keep:

1. a **base backup** (a physical copy of the data directory), and
2. every **WAL segment** produced since that backup,

you can restore the backup and replay WAL up to any moment you choose. That is **point-in-time recovery (PITR)**. A nightly `pg_dump` cannot do this: it only returns you to the moment of the dump.

Writing `archive_command` scripts by hand is fragile, so most teams use **pgBackRest** or **WAL-G**. Both handle compression, retention, parallelism and storage in a local repository or object storage such as S3.

## Setting up pgBackRest

PostgreSQL configuration (`postgresql.conf`):

```ini
wal_level = replica
archive_mode = on
archive_command = 'pgbackrest --stanza=main archive-push %p'
```

`archive_mode` requires a restart. Then the pgBackRest config (`/etc/pgbackrest/pgbackrest.conf`):

```ini
[global]
repo1-path=/var/lib/pgbackrest
repo1-retention-full=2

[main]
pg1-path=/var/lib/postgresql/data
```

Initialize and verify, then take the first full backup:

```bash
pgbackrest --stanza=main stanza-create
pgbackrest --stanza=main check
pgbackrest --stanza=main --type=full backup
```

Schedule backups with cron or a systemd timer, for example weekly full and daily differential (`--type=diff`). Keep the repository on **another machine or in object storage**: a backup on the same disk dies with the server.

## The WAL-G alternative

WAL-G is configured through environment variables (storage prefix, credentials, compression) and works well with cloud storage:

```ini
archive_command = 'wal-g wal-push %p'
```

```bash
wal-g backup-push "$PGDATA"
```

The choice is mostly about operations: pgBackRest has rich verification and a local repository mode, WAL-G is light and cloud-oriented. Both support PITR.

## Restoring after an accidental delete

Suppose someone ran `DELETE FROM orders` without a `WHERE` at about 14:30.

**1. Find the target time.** Use application logs, the PostgreSQL log (if `log_statement` captures it) or `pg_waldump` to locate the transaction. Pick a moment **just before** the delete. If you know the transaction ID or LSN, `recovery_target_xid` or `recovery_target_lsn` are more precise.

**2. Prefer restoring to a separate server.** This lets you copy the lost rows back into production without rolling back everything else that happened after 14:30.

**3. Restore with pgBackRest:**

```bash
sudo systemctl stop postgresql
pgbackrest --stanza=main --delta \
  --type=time "--target=2026-10-10 14:29:00+05" \
  --target-action=promote restore
sudo systemctl start postgresql
```

pgBackRest writes the recovery settings for you. With WAL-G you fetch the backup and set them yourself:

```bash
wal-g backup-fetch "$PGDATA" LATEST
touch "$PGDATA/recovery.signal"
```

```ini
restore_command = 'wal-g wal-fetch %f %p'
recovery_target_time = '2026-10-10 14:29:00+05'
recovery_target_action = 'promote'
```

**4. Check the result** before promoting it anywhere: row counts, the latest records before the incident, application smoke tests. If you chose the wrong moment, restore again with a different target.

After recovery, PostgreSQL starts a **new timeline**. Take a fresh full backup soon after.

## Testing the procedure

A backup you have never restored is a hope, not a backup. Make testing routine:

- Restore to a separate server on a schedule, not only during incidents.
- Run `pgbackrest check` or monitor `pg_stat_archiver` for failed archive attempts.
- Alert when WAL archiving lags or fails: a full disk from unarchived WAL can stop the primary.
- Measure how long a restore takes. That is your real recovery time, and it grows with data volume and the amount of WAL to replay.
- Write a short runbook with the exact commands, so recovery under stress is copy and paste.

## Common mistakes

- Storing backups on the same server or disk as the database.
- Enabling archiving but never checking that it succeeds.
- Retention too short to cover the period in which mistakes are usually noticed.
- Restoring directly over production, losing legitimate changes made after the incident.
- Forgetting time zones in the recovery target.

## FAQ

### Is pg_dump enough for backups?

It is useful for logical copies, migrations and small databases, but it only restores to the moment of the dump. For recovery to an arbitrary point you need base backups plus WAL archiving.

### Do replicas replace backups?

No. Replication copies mistakes instantly: a `DELETE` on the primary is replayed on replicas within moments. Delayed replicas help a little, but PITR from an archive is the reliable tool.

### How far back can I recover?

As far as your oldest base backup with a continuous chain of archived WAL after it. Retention settings define this window. See the [PostgreSQL continuous archiving documentation](https://www.postgresql.org/docs/current/continuous-archiving.html) for details.
