---
title: How to Run an App as a systemd Service on Linux
description: How to write a systemd unit file: user, working directory, environment variables, restart policy, start on boot and reading logs with journalctl.
summary: Create a unit file in /etc/systemd/system with ExecStart, User, WorkingDirectory, EnvironmentFile and Restart=on-failure, run daemon-reload and enable --now, and read logs with journalctl -u.
---
## The short answer

To keep an app running in the background, starting with the server and recovering after crashes, turn it into a **systemd service**:

1. Create `/etc/systemd/system/myapp.service`.
2. Specify the start command, user, working directory and restart policy.
3. Run `systemctl daemon-reload` and `systemctl enable --now myapp`.
4. Read logs with `journalctl -u myapp`.

Starting with `nohup`, `screen` or `&` does not survive a reboot and does not restart a crashed process — systemd handles both.

## The unit file

```ini
[Unit]
Description=My web app
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=myapp
Group=myapp
WorkingDirectory=/opt/myapp
EnvironmentFile=/etc/myapp/env
ExecStart=/usr/bin/node /opt/myapp/server.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Let us go through the key settings.

## What each setting means

**[Unit]**

- **Description** — a readable name shown in `systemctl status`.
- **After / Wants** — start once the network is up. If the app needs a database on the same server, add its service to `After=`.

**[Service]**

- **ExecStart** — the full start command with **absolute paths**. systemd does not use your shell `PATH`.
- **User / Group** — a dedicated system user without root rights. Create it with `sudo useradd --system --no-create-home myapp`.
- **WorkingDirectory** — the folder the app resolves relative files from.
- **EnvironmentFile** — a file with `KEY=value` lines. Keep secrets there with `600` permissions, not in the unit file itself. For a couple of non-secret values, `Environment=` is fine.
- **Restart** — the restart policy.
- **RestartSec** — a pause before restarting, to avoid a tight crash loop.

**[Install]**

- **WantedBy=multi-user.target** — start during normal system boot.

## Restart policies

| Value | Restarts when |
|---|---|
| `no` | never |
| `on-failure` | non-zero exit code, signal, timeout |
| `always` | always, even after a clean exit |

Web services usually use `on-failure` or `always`. If a process crashes too often, systemd stops restarting it — tune this with `StartLimitIntervalSec` and `StartLimitBurst` in the `[Unit]` section.

## Managing the service

```bash
sudo systemctl daemon-reload        # after any unit file change
sudo systemctl enable --now myapp   # start on boot + start now
sudo systemctl status myapp
sudo systemctl restart myapp
sudo systemctl stop myapp
```

## Logs with journalctl

Everything the app writes to stdout and stderr goes to the journal:

```bash
journalctl -u myapp -f                  # follow live
journalctl -u myapp -n 100              # last 100 lines
journalctl -u myapp --since "1 hour ago"
journalctl -u myapp -p err              # errors only
```

Log to stdout — then you do not need separate log files and their rotation.

## Common mistakes

- **Forgetting `daemon-reload`** — systemd keeps using the old version of the file.
- **Relative paths** in `ExecStart` — the service fails with "not found".
- **Running as root** without a reason.
- **Secrets inside the unit file** — any user on the system can read it.
- **The app daemonizes itself** while `Type=simple` is set — systemd thinks the process exited. Run the app in the foreground.

The full list of settings is in the [systemd.service](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html) documentation.

## FAQ

### Why systemd instead of pm2 or supervisor?

systemd already ships with most distributions, needs no extra runtime and is integrated with the journal and system boot. pm2 is handy for Node.js-specific features, but for one or two services per server systemd is usually enough.

### How do I run several instances of one app?

Use a template unit `myapp@.service` with `%i` in its settings, for example for the port. Then start `myapp@3000` and `myapp@3001` as separate services.

### The service fails immediately — where do I look?

Run `systemctl status myapp` and `journalctl -u myapp -n 50`. The usual causes are a wrong path, missing permissions for the service user or a missing environment variable.
