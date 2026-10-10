---
title: WordPress Security: How to Harden Your Site Step by Step
description: A step-by-step WordPress hardening checklist: updates, plugin vetting, login protection, file permissions, XML-RPC and file editor, backups and scans.
summary: Most WordPress hacks come through outdated plugins and weak passwords, not the core. Keep everything updated, run a small set of vetted plugins, protect login with 2FA and attempt limits, disable the file editor and unused XML-RPC, set sane permissions and keep off-site backups.
---

## Where WordPress hacks come from

WordPress core is updated regularly and is fairly solid when kept current. Most compromises come through three things:

- **outdated or abandoned plugins and themes**;
- **weak and reused passwords** on admin accounts;
- **careless server setup**: loose file permissions, exposed backups, an old PHP version.

So hardening is not one "security plugin" but a set of simple habits. Here they are, step by step.

## Step 1. Updates

- Update core, plugins and themes. Automatic updates for minor core releases are fine to leave on.
- Before major updates, back up and test on a **staging copy** if the site makes money.
- Keep an eye on your host's **PHP version**: a branch without security patches is a risk of its own.
- Delete inactive plugins and themes. A deactivated plugin still sits on the server, and its files may be reachable from outside.

## Step 2. Vet plugins before installing

Before installing, check:

- when it was **last updated** and whether it supports your WordPress version;
- the number of active installs and how the author responds in support;
- whether it was pulled from the official directory over security issues.

Never install **"nulled"** (pirated premium) plugins or themes — they often ship with a backdoor. The rule is simple: fewer plugins mean a smaller attack surface.

## Step 3. Protect login and the admin area

- A **unique, long password** for every administrator, stored in a password manager.
- **Two-factor authentication** (2FA) for every role from editor upward.
- **Login attempt limits** — via a plugin, a WAF or the server.
- Do not use the username `admin`. Give people the minimum role they need: an author does not need administrator rights.
- Moving `/wp-admin` or `/wp-login.php` cuts bot noise, but it is not protection by itself — only an addition to 2FA and rate limits.
- If your team works from fixed addresses, you can restrict the admin area by IP at the web server level.

## Step 4. Disable the file editor and unused XML-RPC

The built-in theme and plugin editor lets anyone with admin access change PHP code from the dashboard. If an attacker gets an admin account, this is the first tool they reach for. Turn it off in `wp-config.php`:

```php
define( 'DISALLOW_FILE_EDIT', true );
```

**XML-RPC** (`xmlrpc.php`) is a legacy remote management interface often abused for password guessing and attack amplification. If you do not publish through third-party apps or use services that rely on it, block it at the web server, for example in Nginx:

```nginx
location = /xmlrpc.php {
    deny all;
}
```

Before blocking it, check that none of your integrations or mobile apps depend on it.

## Step 5. File permissions and server configuration

A common baseline from the WordPress documentation:

| Item | Permissions |
|---|---|
| Directories | `755` |
| Files | `644` |
| `wp-config.php` | stricter, e.g. `640` or `600`, depending on which user PHP runs as |

Also:

- disable PHP execution in `wp-content/uploads`;
- never keep backups or database dumps in the public web root;
- enable **HTTPS** with a redirect from HTTP;
- change the default table prefix only on a fresh install — on a live site it is risky and adds little protection.

## Step 6. Backups and scanning

- **Automated backups** of files and the database, stored **off the server**. A copy on the same hosting account disappears together with it.
- Regularly confirm that a backup can actually be restored.
- Set up a **malware scanner** and file change monitoring — via a plugin or your host.
- Turn on alerts for new administrator accounts and logins from unfamiliar locations.

## Common mistakes

- Running five "security plugins" at once — they conflict and slow the site down.
- Giving contractors permanent admin access and never revoking it.
- Assuming a small site is not interesting: bots attack everything automatically.

## FAQ

### Do I need a paid security plugin?

Not necessarily. The basics — updates, 2FA, login limits, backups — can be covered with free tools and server configuration. Paid options are convenient when you want a WAF, scanning and support in one place.

### How often should I update plugins?

Apply security updates as soon as they are released. Everything else on a regular schedule, for example weekly, with a backup before updating.

### Is changing the admin URL enough?

No. It reduces automated attempts but does not stop a targeted attack. Strong passwords, 2FA and login attempt limits are the foundation.
