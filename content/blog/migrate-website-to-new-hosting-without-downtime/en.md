---
title: How to Move a Website to New Hosting Without Downtime
description: A step-by-step plan to migrate a site to new hosting: lower TTL, copy files and database, test via hosts file, final sync, DNS switch and a rollback plan.
summary: Lower DNS TTL in advance, build a full copy of the site on the new server, test it through your hosts file, run a final data sync and only then switch DNS, keeping the old server ready for rollback.
---
## The short answer

A zero-downtime move is possible because **the old and new servers run in parallel for a while**. Visitors keep using the old server while you prepare and test the new one. Then you switch DNS and traffic gradually shifts over. Success depends on a short **TTL**, a verified copy and a clear rollback plan.

## Step-by-step plan

### 1. Inventory

Before starting, list everything that moves:

- site files and user uploads;
- databases;
- cron jobs, background workers, queues;
- language runtime, extension and web server versions;
- SSL certificates;
- email (if it lives on the same hosting) and every DNS record: A, AAAA, CNAME, MX, TXT.

Email and DNS are the most commonly forgotten items, and mail quietly stops arriving after the move.

### 2. Lower the TTL

**TTL** controls how long resolvers cache a DNS answer. If it is long, some visitors will keep hitting the old server for a long time.

At least one full current TTL ahead of the move (a day or two is safer), lower the TTL on the relevant records to a few minutes, for example 300 seconds. Check the current value:

```bash
dig +noall +answer example.com A
```

The number in the second column is the remaining TTL in seconds.

### 3. Prepare the new server and copy data

Install the same environment as the old server, then copy files and the database:

```bash
rsync -avz --progress user@old-server:/var/www/site/ /var/www/site/
mysqldump -u user -p dbname > dump.sql   # on the old server
mysql -u user -p dbname < dump.sql       # on the new server
```

For PostgreSQL, use `pg_dump` and `pg_restore`. Issue an SSL certificate on the new server in advance or move the existing one.

### 4. Test via the hosts file

DNS still points to the old server, but you can open the site on the new one. Add a line with the new server's IP to your computer's hosts file:

```text
203.0.113.10  example.com www.example.com
```

On Linux and macOS it is `/etc/hosts`; on Windows it is `C:\Windows\System32\drivers\etc\hosts`. Walk through key flows: login, forms, payments, file uploads, outgoing email. Remove the line when done.

### 5. Final sync

While you were testing, the old server received new orders, comments and files. Before switching:

1. Enable read-only mode or a short maintenance window for writes if the data is critical.
2. Re-run `rsync` (it transfers only changes) and take a fresh database dump.
3. For large, busy databases, consider **replication** from the old database to the new one so data stays in sync continuously.

### 6. Switch DNS

Point the A/AAAA records to the new server's IP. Thanks to the short TTL most traffic moves quickly, but **do not shut down the old server**: some resolvers may hold old records longer. Watch the logs on both servers; once real requests stop reaching the old one, the move is done.

After things settle, raise the TTL back to its normal value.

### 7. Rollback plan

Decide in advance which signals trigger a rollback (errors, a drop in orders, email issues) and who makes the call. Rolling back means pointing DNS back to the old IP. It only works if the old server is still alive and any data written to the new one can be carried back.

## Common mistakes

- TTL lowered at the last minute, so caches hold the old IP for hours.
- MX and TXT records (SPF, DKIM) forgotten, breaking email.
- Cron jobs and backups not moved.
- Old hosting cancelled right after the DNS change.
- File permissions and config paths not checked.

## FAQ

### Can I migrate with no maintenance window at all?

Yes, if the site is mostly static or you have set up database replication. For shops and services with frequent writes, a short read-only window is usually simpler and safer than reconciling data after the switch.

### How long should I keep the old server?

At least until real requests stop appearing in its logs, plus a buffer in case you need to roll back. The exact time depends on the previous TTL and how confident you are in the new server.

### Do I need to change nameservers during the move?

Not necessarily. If DNS is hosted at your registrar or a separate DNS service, changing the A/AAAA records is enough. If you also want to change nameservers, do it as a separate step so you are not combining two risky operations.
