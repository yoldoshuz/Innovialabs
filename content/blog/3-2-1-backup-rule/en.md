---
title: The 3-2-1 Backup Rule: What It Is and How to Apply It
description: The 3-2-1 rule explained: three copies, two storage types, one off-site. Plus immutable and offline backups and setups for a website, laptop and office.
summary: Keep three copies of your data on two different types of storage, with one copy in another location, and make at least one copy immutable or offline so it cannot be deleted or encrypted.
---
## The short answer

**The 3-2-1 rule** is a simple way to make sure no single failure wipes out your data:

- **3 copies** of the data: the working copy plus two backups.
- **2 different types of storage**: for example, an internal drive and a NAS, or a server and cloud storage.
- **1 copy off-site**: in another building, with another provider, or in the cloud.

The point is that one cause — a failed drive, fire, theft, a staff mistake, malware — cannot destroy every copy at once.

## Why each number matters

- **Three copies**, because a backup can turn out to be corrupted too. Two independent backups greatly reduce the chance of ending up with nothing.
- **Two types of storage**, because identical media tend to fail in identical ways: drives from the same batch, the same controller, the same account with the same provider.
- **One copy off-site**, because fire, flooding or theft takes everything that sits in one room.

## The modern addition: immutable and offline copies

Ransomware and attackers with admin access go after every backup they can reach, deleting or encrypting it first. That is why people now often talk about **3-2-1-1-0**:

- **+1 immutable or offline copy.** **Immutable** means storage with object locking (Object Lock), where a file cannot be deleted or changed until a retention period ends. **Offline** means a drive that is connected only during the backup and then disconnected.
- **0 errors in restore tests.** A backup counts as working only after you have successfully restored something from it.

## What 3-2-1 is not

- **Sync is not backup.** Google Drive, Dropbox or OneDrive instantly replicate a deleted or encrypted file to every device. Version history helps, but its duration and size are limited.
- **RAID is not backup.** It protects against a single drive failure, not against deletion, malware or fire.
- **A snapshot at the same host** is useful, but it lives in the same place and under the same account.

## Setup for a website

| Copy | Where | How |
|---|---|---|
| 1. Working | Website server | Files and database |
| 2. Local backup | Disk snapshots or host-provided backups | Daily, via the control panel |
| 3. External | Object storage at a **different** provider with versioning or Object Lock | Scheduled daily database dump and file archive |

Important: the external storage gets its own access keys that can write but cannot delete.

## Setup for a laptop

- **Copy 1** — the laptop itself.
- **Copy 2** — an external drive: Time Machine on macOS or File History / the backup tool on Windows. Connect it regularly and store it separately between backups.
- **Copy 3** — a cloud backup service with version history (not just a synced folder).

## Setup for a small office

- **Copy 1** — work computers and the shared file server.
- **Copy 2** — a NAS in the office that automatically backs up shared folders and key computers. Use a dedicated backup account, not a domain administrator.
- **Copy 3** — a copy from the NAS to cloud storage with immutability, **or** rotating external drives: one is connected, the other is kept at home by a responsible employee, and they are swapped weekly.

## Common mistakes

- All copies sit under one account or password — lose one, lose everything.
- The external drive stays plugged in permanently — malware will encrypt it too.
- Backups were set up but a restore was never tested.
- Files are copied but the database is not, or the database is copied mid-write without a proper dump.

## FAQ

### Do I have to use the cloud for the off-site copy?

No. Any physically separate storage outside your main location works: a drive at a responsible person's home, a second office, a server with another provider. The cloud is simply easier to automate.

### How often should I back up?

It depends on how much data you can afford to lose. If losing a day of work is acceptable, daily backups are enough. If not, back up more often, and for databases use continuous log archiving.

### How do I know a backup actually works?

Restore from it regularly to a separate location: individual files often, a full system at least a few times a year. If a restore has never been tested, assume you have no backup.
