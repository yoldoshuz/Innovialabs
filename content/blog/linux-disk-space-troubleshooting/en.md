---
title: "No Space Left on Device: How to Free Disk Space on Linux"
description: Find what fills a Linux disk with df, du and ncdu, clean logs, Docker leftovers and package caches, fix inode exhaustion and set up log rotation.
summary: Check df -h and df -i, find large directories with du or ncdu, clean old logs, Docker leftovers and package caches, then configure logrotate so the problem does not return.
---

## The short answer: what to do

**No space left on device** means one of two things: you ran out of bytes or you ran out of **inodes** (file entries). Work step by step:

1. Find out which partition is full: `df -h`.
2. Check inodes: `df -i`.
3. Find what takes the space: `du` or `ncdu`.
4. Clean safely: logs, Docker, caches.
5. Set up rotation so it does not happen again.

Do not delete random files in `/var` or `/usr` — find out what they are first.

## Step 1. Which partition is full

```bash
df -h
```

Look at **Use%** and **Mounted on**. Often it is not the whole disk but a single partition: `/`, `/var` or `/boot`.

## Step 2. Find the culprit

The heaviest directories on the root partition:

```bash
sudo du -xh --max-depth=1 / | sort -rh | head -20
```

The `-x` flag keeps it on one filesystem. Then go deeper: `/var`, `/var/log`, `/home`, `/opt`.

It is easier interactively with **ncdu**:

```bash
sudo apt install ncdu   # or dnf install ncdu
sudo ncdu -x /
```

You can browse directories with arrow keys and see sizes immediately.

Large individual files:

```bash
sudo find / -xdev -type f -size +500M -exec ls -lh {} \;
```

## Step 3. Usual suspects and how to clean them

**Logs.** The systemd journal can grow large:

```bash
journalctl --disk-usage
sudo journalctl --vacuum-size=500M
```

Application logs in `/var/log` or the project directory: if a file is being written right now, do not `rm` it — empty it instead: `sudo truncate -s 0 /var/log/app.log`.

**Docker.** Old images, stopped containers, unused volumes and build cache:

```bash
docker system df
docker system prune
docker image prune -a
```

The `--volumes` flag also removes unused volumes — they may hold database data. Use it only when you know exactly what is there. Container logs grow too: limit them in the logging driver settings (`max-size`, `max-file`).

**Package caches:**

```bash
sudo apt clean          # Debian/Ubuntu
sudo dnf clean all      # RHEL/Fedora
```

Also check npm, pip and CI build caches in home directories, old backups and database dumps.

## Deleted a file but the space did not come back

If you delete a file a process still holds open, the space is freed only when the file is closed. Find such files:

```bash
sudo lsof +L1
```

Restart the process holding them and the space returns.

## Running out of inodes

`df -h` shows free space but files cannot be created — check `df -i`. If **IUse%** is near 100%, the cause is a huge number of tiny files: sessions, cache, temp files, queued mail.

Find the directory with the most files:

```bash
sudo du --inodes -x / 2>/dev/null | sort -rn | head -20
```

Delete what is not needed and fix the cause, for example by cleaning old sessions automatically.

## Step 4. Set up log rotation

**logrotate** archives and deletes old logs on a schedule. An example for an app — the file `/etc/logrotate.d/myapp`:

```text
/var/www/myapp/logs/*.log {
    daily
    rotate 14
    compress
    missingok
    notifempty
    copytruncate
}
```

Dry run without applying: `sudo logrotate -d /etc/logrotate.d/myapp`. For journald, set `SystemMaxUse` in `/etc/systemd/journald.conf`.

Most importantly, set up **disk usage monitoring** that alerts you in advance, not after the service has already crashed.

## FAQ

### Can I just delete everything in /var/log?

No. Services need some of those files, and deleting open logs will not free space. Use `journalctl --vacuum-*`, `truncate` and logrotate.

### Is docker system prune safe?

Without flags it removes stopped containers, unused networks, dangling images and build cache. Running containers are untouched. Volumes are removed only with `--volumes`, which requires care.

### Why does the disk fill up again quickly?

The root cause is still there: no log rotation, overly verbose application logs or accumulating backups. Find the source of growth and limit it instead of only cleaning by hand.
