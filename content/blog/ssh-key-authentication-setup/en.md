---
title: How to Set Up SSH Key Authentication on a Server
description: A step-by-step guide to SSH key login: generating a key, copying it to the server, disabling passwords, using ssh config and agent forwarding risks.
summary: Generate an ed25519 key with ssh-keygen, copy the public part with ssh-copy-id, confirm key login works, and only then disable password login in sshd_config.
---

## The short answer: four steps

Key-based login is safer than a password: a key cannot be brute-forced and you do not have to type it every time. The order is:

1. Create a key pair on your own machine.
2. Put the **public key** on the server.
3. Test key login in a new session.
4. Disable password login.

The golden rule: **do not close your current SSH session** until you have confirmed key login works. Otherwise you can lock yourself out.

## Step 1. Generate a key

```bash
ssh-keygen -t ed25519 -C "you@laptop"
```

- **ed25519** is the modern key type: short, fast and strong. Use RSA only if an old system does not support ed25519.
- Set a **passphrase**. Without it, anyone who gets the key file gets access to your servers.
- You get two files: `~/.ssh/id_ed25519` (private, never share it) and `~/.ssh/id_ed25519.pub` (public, safe to copy anywhere).

## Step 2. Copy the key to the server

The easiest way:

```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server
```

If `ssh-copy-id` is not available (for example on Windows), append the contents of the `.pub` file to `~/.ssh/authorized_keys` on the server manually. Permissions matter — sshd ignores the key if they are too open:

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

## Step 3. Test it

Open a **new** terminal and run `ssh user@server`. If the server did not ask for the account password (only the key passphrase, if you set one), it works. To debug, use `ssh -v user@server` — the output shows which keys are offered and why they are rejected.

## Step 4. Disable password login

In `/etc/ssh/sshd_config` (or a separate file in `/etc/ssh/sshd_config.d/`) set:

```text
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin prohibit-password
```

Check the syntax and reload the service:

```bash
sudo sshd -t && sudo systemctl reload ssh
```

On some distributions the service is called `sshd`. Note that files in `sshd_config.d/` can override the main config — check them if your change does not apply.

## ssh config for multiple servers

To stop memorising IPs, ports and usernames, create `~/.ssh/config`:

```text
Host prod
    HostName 203.0.113.10
    User deploy
    Port 2222
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes

Host staging
    HostName 203.0.113.20
    User deploy
```

Now `ssh prod` is enough. **IdentitiesOnly** makes the client offer only the specified key — useful when you have many keys and the server drops the connection after too many attempts.

## Agent forwarding: convenient but risky

`ssh-agent` keeps decrypted keys in memory so you do not retype the passphrase. `ForwardAgent yes` forwards that agent to the remote server — for example, to run `git pull` there with your key.

The risk: **root or an attacker on that server** can use your agent while you are connected and log in as you to other hosts. So:

- never enable `ForwardAgent` globally, only for specific trusted hosts;
- to hop through an intermediate server use **ProxyJump** (`ssh -J bastion target`) — it does not expose your agent to the jump host;
- for deploying from a server, issue a separate read-only **deploy key** for the repository.

## Common mistakes

- Disabling passwords before testing the key and getting locked out.
- Wrong permissions on `~/.ssh` or the home directory.
- One key without a passphrase shared across every server and every developer.
- Forgetting to remove former employees' keys from `authorized_keys`.

## FAQ

### Can I use one key for all servers?

Technically yes, and for personal use that is fine. For a team, each person should have their own key so access can be revoked individually.

### What if I lose my private key?

Log in another way (a different key or the hosting provider's console), remove the old public key from `authorized_keys` and add a new one.

### Should I change the default port 22?

It reduces noise from automated scanners in your logs but does not replace real protection. The actual security comes from keys, disabled passwords and, optionally, fail2ban or IP restrictions.
