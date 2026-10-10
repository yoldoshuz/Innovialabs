---
title: PostgreSQL Backup and Restore with pg_dump and pg_restore
description: How to back up PostgreSQL with pg_dump: dump formats, compression, restoring on a new server, cron automation, retention and why restores must be tested.
summary: Use pg_dump in the custom format (-Fc) for compressed, flexible backups and restore them with pg_restore; save roles separately with pg_dumpall --globals-only. Automate dumps with cron, keep several copies including one off the server, and regularly test that a restore actually works.
---

## The short version

- **pg_dump** creates a **logical backup** of one database: a consistent snapshot of schema and data at the moment the dump starts.
- The **custom format** (`-Fc`) is the best default: compressed, restorable with **pg_restore**, supports restoring single tables and parallel restore.
- Roles and other cluster-wide objects are not in a database dump — save them with `pg_dumpall --globals-only`.
- A backup counts only when you have **successfully restored** it at least once.

## Dump formats

| Format | Flag | Restore with | When to use |
|---|---|---|---|
| Plain SQL | `-Fp` (default) | `psql` | Small databases, readable output, editing by hand |
| Custom | `-Fc` | `pg_restore` | Default choice: compressed, selective and parallel restore |
| Directory | `-Fd` | `pg_restore` | Large databases: parallel dump with `-j` |
| Tar | `-Ft` | `pg_restore` | Rarely needed |

```bash
# Custom format, compressed by default
pg_dump -Fc -d appdb -f appdb.dump

# Directory format with 4 parallel jobs
pg_dump -Fd -j 4 -d appdb -f appdb_dir

# Plain SQL compressed with gzip
pg_dump -d appdb | gzip > appdb.sql.gz

# Roles and tablespaces for the whole cluster
pg_dumpall --globals-only -f globals.sql
```

The compression level of the custom and directory formats can be changed with `-Z`.

## Restoring to a new server

1. Install PostgreSQL of the **same or newer** major version. A dump from a newer server is not guaranteed to restore into an older one.
2. Restore roles: `psql -U postgres -f globals.sql`. Errors about roles that already exist, such as `postgres`, are expected.
3. Create the empty database and restore:

```bash
createdb -O appuser appdb
pg_restore -d appdb -j 4 appdb.dump
```

For a plain SQL dump:

```bash
gunzip -c appdb.sql.gz | psql -d appdb
```

Useful `pg_restore` options:

- `--no-owner` — when the roles on the new server are different; objects will belong to the user who runs the restore.
- `-t table_name` — restore a single table.
- `--list` — show the contents of the archive without restoring.

Use `pg_dump` of a version equal to or newer than the server you dump from.

## Automating with cron

Prepare a folder owned by the `postgres` user:

```bash
sudo mkdir -p /var/backups/postgres
sudo chown postgres:postgres /var/backups/postgres
```

Script `/usr/local/bin/pg-backup.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

DB="appdb"
DIR="/var/backups/postgres"
FILE="$DIR/${DB}_$(date +%F_%H-%M).dump"

pg_dump -Fc -d "$DB" -f "$FILE.tmp"
mv "$FILE.tmp" "$FILE"

find "$DIR" -name "${DB}_*.dump" -mtime +14 -delete
```

Make it executable with `chmod +x` and add it to the `postgres` user's crontab (`sudo crontab -u postgres -e`):

```text
30 2 * * * /usr/local/bin/pg-backup.sh >> /var/backups/postgres/backup.log 2>&1
```

Running as `postgres` uses local peer authentication, so no password is stored in the script. If you must connect with a password, use a `~/.pgpass` file with permissions `600`. Writing to a `.tmp` file first ensures a failed dump never looks like a finished one.

## Retention and storage

- Define how much data you can afford to lose — that sets **how often** to dump.
- Keep **several generations**: for example, daily dumps for a couple of weeks and weekly ones for a few months.
- Follow the **3-2-1 rule**: three copies, on two different types of storage, one of them off-site. A backup on the same server dies with the server.
- Encrypt dumps stored outside your infrastructure; they contain all your data.
- Set up **alerts** when the job fails or a fresh file does not appear.

## Testing restores

An untested backup is a hope, not a backup. Regularly:

1. Restore the latest dump to a separate test server or database.
2. Check row counts of key tables and that the app starts on the restored data.
3. Note how long the restore takes — that is your real recovery time.

## Limits of pg_dump

A dump is a snapshot: changes made after it are lost on restore. For large databases or recovery to an exact moment, use physical backups with **WAL archiving** (`pg_basebackup` or tools like pgBackRest). Details are in the [PostgreSQL backup documentation](https://www.postgresql.org/docs/current/backup.html).

## FAQ

### Does pg_dump block the database?

No, normal reads and writes continue while it runs. It does hold light locks on tables, so schema changes such as `ALTER TABLE` will wait until the dump finishes. Schedule dumps in quiet hours.

### How often should I make backups?

As often as the amount of data you are willing to lose. If losing a day of orders is unacceptable, daily dumps are not enough — add WAL archiving or more frequent dumps.

### Can I restore just one table?

Yes, with the custom or directory format: `pg_restore -d appdb -t orders appdb.dump`. Be careful with foreign keys and restore into a test database first if the table is related to others.
