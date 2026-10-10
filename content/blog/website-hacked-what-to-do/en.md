---
title: Website Hacked: A Step-by-Step Incident Response Plan
description: A calm plan for a hacked website: contain, preserve evidence, find the entry point, clean and restore, rotate credentials, notify and clear warnings.
summary: If your site is hacked, do not delete everything in a panic: first limit the damage and keep a copy for analysis, then find how the attacker got in, restore from a clean source, rotate every password and key, notify users if required and ask search engines to review the site.
---

## The key point: act in order

Signs of a hack vary: redirects to strange sites, odd pages in search results, browser warnings, spam sent from your domain, new admin accounts, a sudden load spike. The first instinct is to wipe and reinstall everything. That is a mistake: evidence is lost, and **the hole the attacker used stays open**, so the site gets hacked again.

The sequence:

1. Contain.
2. Preserve evidence.
3. Find the entry point.
4. Clean and restore.
5. Rotate all credentials.
6. Notify, if required.
7. Clear search engine warnings.

## 1. Contain

The goal is to stop harm to visitors and data.

- Turn on **maintenance mode** or temporarily serve a static page.
- If the server is sending spam or attacking others, restrict outbound traffic or disconnect it through your provider's panel.
- Avoid a full shutdown unless necessary: memory and temporary files may hold traces.
- Tell your hosting provider — they may have logs and tools.

## 2. Preserve evidence

Before any cleanup, take a **full copy**: site files, a database dump, web server logs and login logs (SSH, hosting panel, CMS admin). On a cloud server, take a disk snapshot.

Store the copy separately and never restore the site from it — it is infected. You need it to understand what happened and possibly to report to law enforcement.

## 3. Find the entry point

Without this step, recovery is pointless. Where to look:

- **Web server logs** — unusual POST requests to individual files, requests to uploaded PHP files.
- **Modified files** — compare against a clean copy or the original CMS package; look for recently changed files and PHP inside upload folders.
- **Accounts** — new CMS administrators, new users and keys on the server.
- **Outdated components** — plugins, themes and libraries with known vulnerabilities.
- **Leaked passwords** — logins with real accounts at odd hours or from unusual addresses.

Common entry points: a vulnerable plugin, a stolen admin or FTP password, an admin panel without 2FA, keys committed to a public repository.

## 4. Clean and restore

**Rebuilding beats disinfecting**:

- Deploy the site to a clean server or environment.
- Take code from your repository or a fresh CMS package, not from the infected server.
- Restore the database from a backup taken **before the breach**. If none exists, inspect it manually for injected content and unknown users.
- Move uploaded files over only after making sure they contain no executable code.
- **Close the entry point**: update the component, remove the vulnerable plugin, fix the code.
- Update everything else and enable file change monitoring.

## 5. Rotate all credentials

Treat everything stored on or reachable from the server as compromised:

- passwords for CMS admins, hosting, FTP/SFTP and the database;
- SSH keys and access tokens;
- API keys for payment providers, email services and messaging platforms;
- application secrets (for example, session signing keys) — this logs users out, which is fine.

Turn on two-factor authentication wherever it is available.

## 6. Notify, if required

If **personal data** may have leaked — names, phone numbers, emails, passwords, order details — check the laws that apply to you: your country's personal data legislation and, if you serve people in the EU, the GDPR, which sets a 72-hour deadline for notifying the supervisory authority. A lawyer's advice is useful here.

Tell users honestly what happened, which data was affected and what they should do — for example, change their password if they reused it elsewhere.

## 7. Clear search engine warnings

If browsers or search results flag the site as dangerous:

- in **Google Search Console**, open the security issues report, fix the problems and request a review;
- in **Yandex Webmaster**, check the security and violations section and request a recheck;
- remove spam pages and make sure your sitemap has no leftover URLs.

Reviews take some time, so submit a request only once you are confident the site is clean.

## FAQ

### Can I just restore yesterday's backup?

Only if you know for certain the breach happened later and you have also closed the entry point. Otherwise you restore either an infected version or a clean one with the same vulnerability.

### Should we pay a ransom?

Paying does not guarantee you get data back or that it will not be published. Make that decision with legal and security professionals; the real protection against this scenario is regular backups stored away from the server.

### How do I know the site is clean again?

No unknown files or users, files match the repository, no suspicious requests in the logs, and external scanners find no threats. Keep monitoring for several weeks after recovery.
