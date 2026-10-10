---
title: How to Secure SSH on a Linux Server
description: Practical SSH hardening: key-based login, no root or password access, a dedicated user, fail2ban, firewall rules, a second factor and auditing login attempts.
summary: Secure SSH means key-only login as a dedicated sudo user, root and password login disabled, fail2ban against brute force, a firewall that limits who can connect, and regular log review. For critical servers, add a second factor such as a hardware security key.
---

## What to do first

Any server with port 22 open receives a steady stream of bot login attempts. The minimum protection set:

1. **Key-only** SSH authentication.
2. **No root login** and no password login.
3. A dedicated user with `sudo`.
4. **fail2ban** or similar against brute force.
5. A **firewall** that opens SSH only to the addresses that need it, when possible.

The golden rule while configuring: **do not close your current session** until you have confirmed you can log in from a new terminal window. Otherwise it is easy to lock yourself out.

## Step 1. A dedicated user and keys

Create a user on the server and grant `sudo` rights (the exact command depends on the distribution — for example the `sudo` group on Debian/Ubuntu or `wheel` on RHEL-like systems).

On your computer, generate a key and copy the public part to the server:

```bash
ssh-keygen -t ed25519 -C "laptop-work"
ssh-copy-id deploy@your-server
```

Protect the private key with a **passphrase** — a stolen key file is then useless on its own. Use a separate key per device: if a laptop is lost, you remove one line from `authorized_keys`.

## Step 2. Configure sshd

Edit `/etc/ssh/sshd_config` (or add a file in `/etc/ssh/sshd_config.d/` if your distribution includes that directory) and set:

```text
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
AllowUsers deploy
MaxAuthTries 3
```

Check the syntax and reload:

```bash
sudo sshd -t && sudo systemctl reload ssh
```

On some distributions the service is called `sshd`. After reloading, open a **new** window and confirm you can log in with your key.

**Changing the port** from 22 reduces log noise but is not protection: scanners find SSH on any port. Do it if you like, but not instead of the other steps.

## Step 3. fail2ban

**fail2ban** reads logs and temporarily bans an IP after several failed attempts. A minimal `/etc/fail2ban/jail.local`:

```ini
[sshd]
enabled = true
maxretry = 5
findtime = 10m
bantime = 1h
```

Check status and banned addresses:

```bash
sudo fail2ban-client status sshd
```

With key-only login, password guessing is already pointless, but fail2ban still cuts load and log noise.

## Step 4. Firewall

Close everything you do not need and, where possible, limit SSH to trusted addresses. An example with `ufw`:

```bash
sudo ufw default deny incoming
sudo ufw allow from 203.0.113.10 to any port 22 proto tcp
sudo ufw allow 80,443/tcp
sudo ufw enable
```

Without a static IP, use a **VPN** or a **bastion host** (jump host): SSH is open only to it, and it is hardened with extra care. Most cloud providers also offer network filters (security groups) — an extra layer in front of the server.

## Step 5. A second factor

For critical servers, add 2FA. Two common options:

| Option | How it works | Notes |
|---|---|---|
| Hardware key (FIDO2) | An `ed25519-sk` key that requires a physical token | Easy setup, protects against a stolen key file |
| TOTP via PAM | Key plus a code from an authenticator app | Requires PAM and `AuthenticationMethods` configuration |

Creating a hardware-backed key:

```bash
ssh-keygen -t ed25519-sk
```

For TOTP, follow your distribution's instructions and keep a working session open while you test.

## Step 6. Audit logins

Review regularly who logs in and from where:

```bash
sudo journalctl -u ssh --since "24 hours ago"
last -n 20
sudo lastb -n 20
```

What to look for:

- successful logins from unfamiliar IPs;
- new lines in users' `~/.ssh/authorized_keys`;
- new users with sudo rights.

With several servers, ship logs to a central system and set up alerts.

## FAQ

### Should I change the SSH port?

It is optional. A different port reduces automated attempts but does not stop targeted scanning. Keys, disabled passwords and a firewall matter far more.

### What if I lose my private key?

Log in from another device or through your hosting provider's console, remove the old key from `authorized_keys` and add a new one. That is why it helps to have at least two keys and emergency access via the provider's panel.

### Can I keep password login for convenience?

Better not. If logging in from several devices is the issue, create a key per device — just as quick, and far safer.
