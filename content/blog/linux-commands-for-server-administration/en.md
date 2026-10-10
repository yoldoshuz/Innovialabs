---
title: Essential Linux Commands for Server Administration
description: A practical Linux cheat sheet for servers: files, processes, networking, logs, packages and users, grouped by task with ready-to-run examples.
summary: Day-to-day server work needs only a couple dozen commands: ls, df, du for files, ps, top, systemctl for processes, ss, curl for network, journalctl, tail for logs, apt or dnf for packages, and adduser, chmod for permissions.
---
## Which commands you need first

You do not need hundreds of commands to run a server confidently. A core set grouped by task is enough: **files and disk**, **processes and services**, **networking**, **logs**, **packages**, **users and permissions**. That set is below, with examples you can run as is. They assume a systemd-based distribution (Ubuntu, Debian, the RHEL family).

## Files and disk

| Command | What it does |
|---|---|
| `ls -lah` | List files with permissions, sizes and hidden files |
| `cd`, `pwd` | Change directory, print the current one |
| `cp -r`, `mv`, `rm -r` | Copy, move, delete |
| `find / -name "*.log"` | Find files by name |
| `df -h` | Free space per disk |
| `du -sh /var/*` | Size of each directory |

A classic situation is "the disk is full". The sequence:

```bash
df -h                          # which partition is full
sudo du -sh /var/* | sort -h   # what takes the most space inside
```

**Be careful with `rm -rf`**: there is no trash and no confirmation. Check the path with `ls` before deleting.

## Processes and services

- `top` or `htop` shows CPU and memory load in real time.
- `ps aux | grep nginx` finds a process by name.
- `kill PID` stops a process gracefully; `kill -9 PID` forces it, only when the normal signal fails.
- `systemctl status nginx` shows service state.
- `systemctl restart nginx` restarts; `reload` rereads config without stopping, if the service supports it.
- `systemctl enable nginx` starts the service at boot.
- `free -h` and `uptime` show memory and load average.

## Networking

```bash
ip a                           # interface IP addresses
ss -tulpn                      # listening ports and their processes
curl -I https://example.com    # response headers of a site
ping -c 4 8.8.8.8              # basic connectivity
dig example.com                # DNS records for a domain
```

`ss -tulpn` is the key command when a service "does not respond": you immediately see whether it runs and on which port. The older `netstat` is often not installed by default anymore.

On Ubuntu the firewall is usually managed with `ufw`: `sudo ufw status`, `sudo ufw allow 443/tcp`. Always allow SSH before enabling the firewall, or you will lock yourself out.

## Logs

- `journalctl -u nginx -n 100` shows the last 100 lines of a service log.
- `journalctl -u nginx -f` follows the log in real time.
- `journalctl --since "1 hour ago"` shows events from the last hour.
- `tail -f /var/log/nginx/error.log` follows logs written to files.
- `grep -i "error" /var/log/syslog` searches by text.
- `less file` pages through large files, with search on `/`.

Rule of thumb: for any problem, **read the logs first**, restart second.

## Packages

| Task | Debian/Ubuntu | RHEL/Rocky/Alma |
|---|---|---|
| Refresh package list | `sudo apt update` | `sudo dnf check-update` |
| Upgrade the system | `sudo apt upgrade` | `sudo dnf upgrade` |
| Install a package | `sudo apt install nginx` | `sudo dnf install nginx` |
| Remove a package | `sudo apt remove nginx` | `sudo dnf remove nginx` |

Update regularly, but on production do it after testing and with a rollback plan.

## Users and permissions

```bash
sudo adduser deploy                    # create a user (Debian/Ubuntu)
sudo usermod -aG sudo deploy           # grant sudo rights
sudo chown -R deploy:deploy /srv/app   # change owner
chmod 640 config.env                   # owner reads/writes, group reads
id deploy                              # user's groups
```

`chmod` permissions are three digits: owner, group, others. 4 is read, 2 is write, 1 is execute. **Never use `chmod 777`**: it opens the file to everyone.

## Common mistakes

- **Working as root all the time.** Use a regular user with `sudo`.
- **Rebooting instead of diagnosing.** The problem comes back, and you lose useful state.
- **Editing config without validating it.** nginx has `nginx -t`, and many other services offer similar checks.
- **Ignoring disk space.** A partition filled with logs breaks databases and applications.

## FAQ

### Do I need to learn vim to administer a server?
Knowing the basics helps because it is available almost everywhere. To start, `nano` is fine: it is simpler and often installed by default.

### What is the difference between restart and reload?
`restart` stops and starts the service again, dropping current connections. `reload` rereads configuration without stopping, but only for services that support it.

### How do I find out what an unfamiliar command does?
Run `man command` or `command --help`. That is the official documentation right on the server.
