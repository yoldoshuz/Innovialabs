---
title: How to Back Up and Restore a MySQL Database
description: Back up MySQL with mysqldump using a consistent InnoDB snapshot, restore dumps, schedule backups, store them offsite and know when to switch to XtraBackup.
summary: For most databases, mysqldump with --single-transaction, run on a schedule and copied to another location, is enough; for large databases and fast restores, use Percona XtraBackup.
---

## The short answer

A logical MySQL backup is one command:

```bash
mysqldump --single-transaction --routines --triggers --events \
  -u backup -p shop > shop_$(date +%F).sql
```

Restoring is one command too:

```bash
mysql -u root -p shop < shop_2026-10-10.sql
```

But a backup only counts when it is **automated**, **stored away from the database server** and **regularly tested by restoring it**.

## Why --single-transaction matters

Without this flag, mysqldump reads tables one after another while your application keeps writing. You can end up with an order in the dump but not its line items.

`--single-transaction` opens a transaction with REPEATABLE READ isolation, so every table is read as **one snapshot at a single point in time**. Tables are not locked and the site keeps working.

Caveats:

- It only works for **InnoDB**. MyISAM tables are not captured consistently.
- Avoid DDL (`ALTER TABLE`, `TRUNCATE`) while the dump runs — it can break the snapshot.
- Use `--all-databases` for everything, or `--databases db1 db2` for a selection.

Useful flags:

| Flag | Purpose |
|---|---|
| `--routines` | stored procedures and functions |
| `--triggers` | triggers (usually on by default) |
| `--events` | scheduled events |
| `--source-data=2` or `--master-data=2` | binlog position as a comment, needed for point-in-time recovery |
| `--hex-blob` | safe export of binary columns |

## How to restore a dump

1. Create an empty database: `CREATE DATABASE shop_restore;`
2. Load the dump: `mysql -u root -p shop_restore < shop.sql`
3. Check row counts in key tables and point a copy of the app at it.

For a compressed dump: `gunzip < shop.sql.gz | mysql -u root -p shop_restore`.

Restore into a **separate database first**, not over production. That way you can compare data and keep anything that is still intact.

## Scheduled backups

Create a dedicated user with minimal privileges (`SELECT`, `SHOW VIEW`, `TRIGGER`, `LOCK TABLES`, `EVENT`, `PROCESS`) and keep the password in `~/.my.cnf` with 600 permissions, not on the command line.

A cron job for a daily compressed backup at 03:00:

```bash
0 3 * * * mysqldump --single-transaction --routines --events shop | gzip > /backup/shop_$(date +\%F).sql.gz
```

Add cleanup of old files, for example `find /backup -name '*.sql.gz' -mtime +14 -delete`, and an alert when the job fails.

## Offsite storage

A backup on the same disk won't help if the disk dies, the server is compromised or deleted. Follow the **3-2-1 rule**: three copies, on two different media, one offsite.

- Push dumps to S3-compatible object storage with `rclone` or `aws s3 cp`.
- Enable versioning or object lock so an attacker cannot delete the copies.
- Encrypt dumps before upload if they contain personal data.

## When to use Percona XtraBackup instead

mysqldump produces a SQL file that is replayed statement by statement on restore. On large databases this is slow because every index is rebuilt.

**Percona XtraBackup** takes a **physical backup**: it copies InnoDB data files while the server keeps running. Choose it when:

- the database is large and restoring a dump takes unacceptably long;
- you need incremental backups;
- you want to spin up a new replica quickly.

Limits: the XtraBackup version must match your MySQL version, and a physical copy restores only onto a compatible server version. For moving between versions or restoring single tables, mysqldump is more convenient.

## Common mistakes

- No `--single-transaction`, so the data is inconsistent.
- Password passed on the command line, visible in the process list.
- Backups never tested; during an incident the dump turns out empty or truncated.
- Binary logging disabled, so you can only restore to the backup time, not to the minute before the failure.

## FAQ

### Does mysqldump lock the database during a backup?

With `--single-transaction` on InnoDB tables, no — writes continue. The dump still loads disk and CPU, so run it during low traffic or against a replica.

### How often should I back up?

Start from how much data the business can afford to lose. If the answer is an hour or less, a nightly dump is not enough: you need binary logs for point-in-time recovery or more frequent backups.

### How do I know a backup actually works?

Restore it regularly to a separate server, compare row counts in key tables and run the application against the copy. A tested restore proves far more than the existence of a file.
