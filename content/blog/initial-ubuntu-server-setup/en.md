---
title: Initial Ubuntu Server Setup Checklist for Production
description: A first-hour checklist for a new Ubuntu server: updates, a sudo user, key-only SSH, ufw, timezone, swap, fail2ban and automatic security updates.
summary: On a new server, update the system, create a sudo user with SSH key login, disable root and password logins, enable ufw, set the time, add swap, and install fail2ban and automatic security updates.
---
## The short answer

A fresh server with a public IP gets scanned almost immediately. So before installing your app, go through a basic checklist:

1. Update packages.
2. Create a sudo user with SSH key login.
3. Disable root and password logins.
4. Enable the **ufw** firewall.
5. Set the timezone and time sync.
6. Add swap if memory is tight.
7. Install **fail2ban** and **unattended-upgrades**.
8. Install the base software.

The commands below are for current Ubuntu LTS releases.

## 1. Updates

```bash
apt update && apt upgrade -y
reboot   # if the kernel was updated
```

## 2. A sudo user

Working as root all the time is risky: every mistake runs with full privileges.

```bash
adduser deploy
usermod -aG sudo deploy
```

Copy your public key to the server (from your local machine):

```bash
ssh-copy-id deploy@SERVER_IP
```

**Test the login as the new user in a separate window** before changing SSH settings.

## 3. Lock down SSH

In `/etc/ssh/sshd_config` (or a file in `/etc/ssh/sshd_config.d/`) set:

```text
PermitRootLogin no
PasswordAuthentication no
```

Then run `sudo systemctl restart ssh`. Changing the SSH port reduces log noise but does not replace key-only login.

## 4. The ufw firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80,443/tcp
sudo ufw enable
sudo ufw status
```

Allow SSH first, then enable ufw — otherwise you can lock yourself out. Do not expose databases or internal services.

Note: **Docker publishes ports bypassing ufw rules**. If you use Docker, bind ports to `127.0.0.1` or configure filtering separately.

## 5. Time

```bash
sudo timedatectl set-timezone Asia/Tashkent
timedatectl
```

Make sure time sync is active. Many teams keep servers in UTC so logs from different systems line up — pick one approach and stick with it.

## 6. Swap

On servers with little RAM, swap keeps processes from being killed during memory spikes:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

Size it to your workload. Swap is a safety net, not a substitute for memory.

## 7. fail2ban and automatic updates

```bash
sudo apt install -y fail2ban unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

**fail2ban** bans IPs after a series of failed logins. **unattended-upgrades** installs security updates automatically.

## 8. Base software

A typical set: `git`, `curl`, `htop`, nginx as a reverse proxy, Docker or your runtime, certbot for HTTPS. Install only what you actually use.

## Common mistakes

- Disabling password login without testing key login.
- Enabling ufw without an SSH rule.
- Exposing a database port to the internet.
- Skipping backups and disk monitoring — the server "works" until the disk fills up.

## FAQ

### Should I change the default SSH port?

It is optional. A different port cuts down automated login attempts in the logs, but the real protection comes from key-only login, no root login and fail2ban.

### Will automatic updates break my app?

By default unattended-upgrades installs only security updates, so the risk is low. You can leave automatic reboots for kernel updates off and schedule them manually.

### Can this checklist be automated?

Yes. It fits well into a cloud-init script at server creation or an Ansible role — then every new server is configured the same way.
