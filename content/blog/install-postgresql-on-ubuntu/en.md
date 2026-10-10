---
title: How to Install and Configure PostgreSQL on Ubuntu
description: Step-by-step PostgreSQL setup on Ubuntu: installation, a user and database for your app, safe remote access and basic memory tuning for a small VPS.
summary: Install PostgreSQL from the Ubuntu repositories with apt, create a separate login role and database for your app, open remote access only for specific IP addresses via listen_addresses and pg_hba.conf, and size shared_buffers, work_mem and connections to your VPS memory.
---

## The quick path

On a fresh Ubuntu server the whole process takes a few minutes:

1. Install the `postgresql` package with `apt`.
2. Create a role and a database for the application.
3. If the app runs on another server, allow remote access for its IP only.
4. Adjust a few memory settings and restart.

## Step 1. Install PostgreSQL

```bash
sudo apt update
sudo apt install -y postgresql
sudo systemctl status postgresql
```

The service starts automatically and is enabled on boot. Ubuntu ships a tested version; if you need a newer major release, use the official PostgreSQL apt repository described on the [PostgreSQL download page](https://www.postgresql.org/download/linux/ubuntu/).

Configuration files live in `/etc/postgresql/<version>/main/`. To find the exact paths:

```bash
sudo -u postgres psql -c "SHOW config_file;"
sudo -u postgres psql -c "SHOW hba_file;"
```

## Step 2. Create a user and a database

Installation creates a system user and database superuser called `postgres`. Locally it logs in through **peer authentication** — by matching the Linux user name, without a password. Use it only for administration, never in application settings.

```bash
sudo -u postgres psql
```

```sql
CREATE ROLE appuser WITH LOGIN PASSWORD 'use-a-long-random-password';
CREATE DATABASE appdb OWNER appuser;
\q
```

The application now connects as `appuser` to `appdb` and owns its tables. Keep separate roles for separate apps; add a read-only role for reports when needed.

## Step 3. Remote access

By default PostgreSQL listens only on `localhost`. If the app runs on the same server, skip this step — it is the safest setup.

**postgresql.conf** — tell the server which network interfaces to listen on:

```ini
listen_addresses = 'localhost,10.0.0.5'   # or '*' for all interfaces
```

**pg_hba.conf** — decide who may connect. Add a line that allows only your app server:

```text
# TYPE  DATABASE  USER     ADDRESS           METHOD
host    appdb     appuser  203.0.113.10/32   scram-sha-256
```

Then restart (changing `listen_addresses` requires a restart; `pg_hba.conf` alone needs only a reload) and open the port in the firewall for that IP only:

```bash
sudo systemctl restart postgresql
sudo ufw allow from 203.0.113.10 to any port 5432 proto tcp
```

Test from the app server:

```bash
psql "host=SERVER_IP dbname=appdb user=appuser"
```

**Security rules:**

- Never use `0.0.0.0/0` together with `trust` — that is an open database.
- Prefer a **private network** between servers or an **SSH tunnel** over exposing port 5432 to the internet.
- Use `scram-sha-256`, not the older `md5` method. If a password was set while another method was active, set it again.

## Step 4. Basic memory tuning for a small VPS

Default settings are very conservative. A common starting point for a server with **2 GB of RAM** that runs only PostgreSQL:

```sql
ALTER SYSTEM SET shared_buffers = '512MB';
ALTER SYSTEM SET effective_cache_size = '1536MB';
ALTER SYSTEM SET work_mem = '8MB';
ALTER SYSTEM SET maintenance_work_mem = '128MB';
ALTER SYSTEM SET max_connections = 50;
ALTER SYSTEM SET random_page_cost = 1.1;
```

`ALTER SYSTEM` writes to `postgresql.auto.conf`, which overrides `postgresql.conf`. Restart afterwards, because `shared_buffers` and `max_connections` only change on restart.

| Setting | What it does | Rule of thumb |
|---|---|---|
| `shared_buffers` | PostgreSQL's own data cache | About a quarter of RAM |
| `effective_cache_size` | Hint for the planner about total cache incl. OS | Half to three quarters of RAM |
| `work_mem` | Memory per sort or hash operation | Small: it is used per operation, per connection |
| `maintenance_work_mem` | Memory for VACUUM, index creation | Larger than work_mem |
| `max_connections` | Connection limit | Keep modest, use a pooler like PgBouncer |
| `random_page_cost` | Cost of random disk reads | Lower on SSD |

If the app and PostgreSQL share the server, scale these values down. Check what is applied with `SHOW shared_buffers;`.

## Common mistakes

- Connecting the application as `postgres`.
- Opening port 5432 to the whole internet "temporarily".
- Setting a large `work_mem` — many parallel queries can exhaust RAM.
- Forgetting backups: set up `pg_dump` or physical backups right after installation.

## FAQ

### Should I install PostgreSQL in Docker instead?

Docker is convenient for development and for keeping versions identical across environments. On a single production VPS, a native install is simpler to update and tune. If you use Docker, store data in a volume and plan backups the same way.

### Why does the connection fail with "no pg_hba.conf entry"?

The server is reachable, but no `pg_hba.conf` line matches the combination of database, user and client IP. Add a precise line for that IP and run `sudo systemctl reload postgresql`.

### How do I know my memory settings are right?

Watch the server under real load: free memory, swap usage and slow queries. If the server starts swapping, reduce `shared_buffers`, `work_mem` or connections; tuning is iterative, not a one-time formula.
