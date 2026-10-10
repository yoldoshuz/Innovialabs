---
title: "Cron Jobs in Linux: How to Schedule Tasks Correctly"
description: Crontab syntax with examples, environment and PATH gotchas, logging output, preventing overlapping runs and systemd timers as an alternative.
summary: Add jobs with crontab -e, use absolute paths, redirect output to a log file and wrap long jobs in flock so they never run in parallel.
---

## The short answer: adding a job

Open your schedule editor:

```bash
crontab -e
```

Each line is a schedule plus a command:

```text
*/15 * * * * /usr/bin/php /var/www/app/artisan schedule:run >> /var/log/app-cron.log 2>&1
```

List current jobs with `crontab -l`. Most cron problems are not about syntax but about the **environment**: the job works from your terminal and silently fails on schedule.

## Schedule syntax

Five fields from left to right:

| Field | Values |
|---|---|
| Minute | 0-59 |
| Hour | 0-23 |
| Day of month | 1-31 |
| Month | 1-12 |
| Day of week | 0-7 (0 and 7 are Sunday) |

Examples:

- `0 3 * * *` — every day at 03:00;
- `*/10 * * * *` — every 10 minutes;
- `0 9 * * 1-5` — at 09:00 on weekdays;
- `30 2 1 * *` — on the 1st of every month at 02:30;
- `0 */6 * * *` — every 6 hours on the hour.

Times follow the **server time zone**. Check it with `timedatectl` before scheduling "overnight" jobs.

A gotcha: if both day of month and day of week are set, cron runs the job when **either** matches, not both.

## Environment and PATH

Cron runs commands with a minimal environment: a short `PATH`, a different shell (`/bin/sh`), and none of the variables from `.bashrc` or `.env`. Hence the classic "command not found".

What to do:

- use **absolute paths** to programs and files (`/usr/bin/node`, not `node`); find the path with `which node`;
- set variables at the top of the crontab:

```text
SHELL=/bin/bash
PATH=/usr/local/bin:/usr/bin:/bin
```

- put complex logic in a separate script and call only that script from cron;
- `%` in a crontab means a newline — escape it as `\%` (common in `date +%F`).

## Logging output

By default, job output is mailed to the local user — on most servers that means it is lost. Redirect output explicitly:

```text
0 3 * * * /opt/scripts/backup.sh >> /var/log/backup.log 2>&1
```

`2>&1` matters: without it, errors (stderr) do not reach the log. Remember to rotate this file, or it will eventually fill the disk. To check whether cron ran at all, look at the system journal: `journalctl -u cron` or `grep CRON /var/log/syslog` (the service name depends on the distribution).

## Preventing overlapping runs

If a job scheduled every 5 minutes sometimes takes 7, runs will overlap: duplicate emails, database races, overload. The simple fix is `flock`:

```text
*/5 * * * * /usr/bin/flock -n /tmp/sync.lock /opt/scripts/sync.sh
```

`-n` means: if the previous run still holds the lock, the new one simply does not start.

## systemd timers as an alternative

On modern distributions you can use **systemd timers**. You need two files: a `.service` (what to run) and a `.timer` (when).

```ini
# /etc/systemd/system/backup.timer
[Timer]
OnCalendar=*-*-* 03:00:00
Persistent=true

[Install]
WantedBy=timers.target
```

| | cron | systemd timer |
|---|---|---|
| Setup | one line | two files |
| Logs | must be redirected | automatic in journalctl |
| Missed runs | lost | `Persistent=true` catches up |
| Overlapping runs | needs flock | a service will not start twice |
| Resource limits | none | yes (CPU, memory) |

For a couple of simple jobs, cron is easier. For important background work, timers give more control.

## Common mistakes

- Relative paths and relying on your terminal's `PATH`.
- Output goes nowhere, so nobody knows about failures.
- Jobs run in UTC while you expect local time.
- Editing `/etc/crontab` and forgetting it has an extra user-name field.

## FAQ

### Why does my script work manually but not in cron?

It is almost always the environment: a different PATH, missing variables, another working directory. Use absolute paths, set the required variables and redirect output to a log to see the error.

### How do I run a job more often than once a minute?

Cron has one-minute precision. For more frequent runs, use a systemd timer or a long-running process with its own loop.

### Do I need to restart anything after crontab -e?

No, cron picks up changes automatically once you save the file.
