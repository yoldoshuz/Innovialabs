---
title: Backup Strategy for a Small Business: What, How Often, Where
description: How to set RPO and RTO, list what to back up (website, CRM, 1C, email, files), choose tools and storage, and schedule regular restore tests.
summary: First decide how much data and downtime you can afford to lose (RPO and RTO), then list every system, automate backups following the 3-2-1 rule, and test restores on a schedule.
---
## The short answer

A backup strategy answers three questions: **what** to back up, **how often** and **where**. The steps:

1. Define **RPO** and **RTO** for each system.
2. Build an **inventory** of every place company data lives.
3. Pick **tools and storage** following the 3-2-1 rule, with one immutable copy.
4. Assign an **owner** and test **restores** on a schedule.

## RPO and RTO in plain words

- **RPO (Recovery Point Objective)** — how much data you can lose. If RPO is one day, a daily backup is enough. If losing even an hour of orders is unacceptable, you need to back up more often.
- **RTO (Recovery Time Objective)** — how quickly the system must be running again. RTO dictates where copies live: restoring terabytes from the cloud over an office connection can take far longer than restoring from a local NAS.

Set these numbers together with management, not only with IT: this is a decision about business money and risk. Different systems need different values — accounting and an ordering website usually need stricter targets than a document archive.

## What to back up

| System | What exactly | Watch out for |
|---|---|---|
| **Website** | Files, database, user uploads, server configuration | Take a database dump instead of copying live database files |
| **CRM (cloud)** | Regular export of contacts, deals, history | The provider protects its infrastructure, not data you deleted; check the terms |
| **1C** | An infobase export (.dt) or a DBMS backup; for a file-based infobase, a copy of the database file with all sessions closed | Copying a file-based infobase with open sessions can produce a corrupted copy |
| **Email** | Mailboxes, especially management and accounting | Trash and retention in Google Workspace or Microsoft 365 are not a backup |
| **Files** | Shared folders, NAS, documents on laptops | Cloud sync replicates deletion and encryption |
| **Access** | Domains, DNS, hosting, password manager, licenses | Without them there is nowhere to restore your data to |

Don't forget the **non-obvious**: spreadsheets in employees' personal cloud accounts, Telegram bots and their databases, router and phone system settings.

## Tools

- **For servers and websites**: restic, BorgBackup, Duplicati — they encrypt, compress and deduplicate data and can send it to object storage.
- **For the office**: built-in NAS tools (Synology, QNAP and others ship their own apps for backing up computers and to the cloud), Windows Server Backup, Veeam Agent.
- **For cloud services**: built-in export, or dedicated backup services for Google Workspace and Microsoft 365.

An example for a server with PostgreSQL and restic:

```bash
#!/bin/sh
set -e
pg_dump -Fc shop > /var/backups/shop.dump
restic -r s3:https://storage.example.com/backups backup /var/www /var/backups
restic -r s3:https://storage.example.com/backups forget --keep-daily 7 --keep-weekly 4 --keep-monthly 6 --prune
```

Keep the repository password and keys in environment variables, not in the script. Also store the password somewhere off the server: without it, the backups cannot be decrypted.

## Where to store backups

- **Locally (NAS, a separate server)** — fast restores, good for a short RTO.
- **Cloud object storage** — the off-site copy; enable **versioning** and **Object Lock** if your provider supports them.
- **Offline drives** — a fallback against ransomware: connected only while the backup runs.

Backup accounts should be **separate**, with minimal permissions, and unrelated to the domain and the administrator's email.

## Schedule and checks

- **Backups**: databases and key systems daily or more often depending on RPO; files daily; full server images weekly.
- **Retention**: for example, daily copies for a week, weekly for a month, monthly for six months — adjust to your needs.
- **Monitoring**: an email or Telegram alert when a job fails.
- **Restore tests**: restore individual files regularly, and once a quarter restore a whole system to a test server. Time it and compare with your RTO.
- **A document**: a short guide on where backups are, how to restore them and who has access.

## FAQ

### My cloud CRM already makes backups — do I need anything else?

Ideally, yes. The provider protects its infrastructure but usually does not restore individual records deleted by your employee or an integration. A regular export to your own storage covers that, as well as losing access to the service.

### How much does backup cost?

It depends on data volume, retention period, number of copies and the RTO you need. The main items are storage (NAS, drives, cloud), software licenses, and time for setup and testing. Add them up and compare with the cost of a day of downtime.

### Who should own backups in a small company?

A specific person — an in-house administrator or a contractor whose duties explicitly include watching alerts and testing restores. Without an owner, backups quietly stop working.
