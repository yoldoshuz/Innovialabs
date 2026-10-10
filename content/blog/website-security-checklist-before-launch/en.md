---
title: Website Security Checklist Before Launch
description: A practical pre-launch security checklist: HTTPS, security headers, admin access, default passwords, debug mode, backups, updates, forms and monitoring.
summary: Before launch, enforce HTTPS and security headers, lock down the admin panel, remove default accounts and debug mode, update everything, protect forms, and make sure backups restore and errors reach you.
---
## Short answer

Most website breaches do not need clever hacking — they use something left open: a default password, a forgotten `.env` file, an outdated plugin, a debug page. Go through the list below on the **production** server, not on your laptop, a few days before launch.

## HTTPS

- A valid certificate covers every domain and subdomain you use, including `www`.
- **All HTTP requests redirect to HTTPS** with a permanent redirect.
- Automatic certificate renewal is set up and tested.
- No mixed content: images, scripts and fonts load over HTTPS.
- Old protocols are disabled; your server or CDN uses TLS 1.2 and 1.3.

## Security headers

Headers tell the browser how to protect your users. A reasonable starting point for nginx:

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header X-Frame-Options "DENY" always;
add_header Content-Security-Policy "default-src 'self'; frame-ancestors 'none'" always;
```

The **Content-Security-Policy** above is strict and will likely block analytics, fonts or widgets — list the sources you actually use. Enable HSTS only when you are sure every subdomain works over HTTPS.

## Admin access

- The admin panel is not at an obvious address, or better, is reachable only via VPN or an IP allowlist.
- **Two-factor authentication** for every admin account.
- Each person has their own account; no shared "admin" login.
- Login attempts are rate-limited.
- SSH uses keys, password login and direct root login are disabled.
- Database ports are not open to the internet.

## Default credentials and test data

- Default passwords on CMS, databases, routers, control panels are changed.
- Test users like `test@test.com` and demo content are removed.
- API keys and passwords are not in the code repository; they are stored in environment variables or a secrets manager, and the ones used in development are rotated.

## Debug mode and exposed files

- **Debug mode is off**: users see a neutral error page, not a stack trace.
- These paths return 404 or 403: `/.git`, `/.env`, backup archives, `phpinfo`, database dumps.
- Directory listing is disabled.
- Source maps are not publicly served unless you intentionally decided to.
- Server and framework version banners are hidden where possible.

## Updates and dependencies

- The CMS, plugins, themes, framework and server packages are on current supported versions.
- Unused plugins and modules are deleted, not just disabled.
- A dependency audit (`npm audit`, `composer audit`, `pip-audit` or similar) shows no known critical issues.
- Someone is responsible for applying security updates after launch.

## Forms protection

- **Server-side validation** of every field; browser checks are only for convenience.
- Database queries use parameters, never string concatenation.
- User input is escaped when displayed.
- CSRF protection on forms that change data.
- Rate limiting and anti-spam on contact, login, registration and password reset forms.
- File uploads: allowed types and size checked on the server, files stored outside the web root or in object storage, never executed.

## Backups

- Automatic backups of the database **and** uploaded files.
- Copies are stored separately from the main server.
- **A test restore has been done** — a backup nobody has restored is only a hope.

## Logging and monitoring

- Access and application logs are kept long enough to investigate an incident.
- Logs do not contain passwords, tokens or full card numbers.
- Uptime monitoring alerts a real person.
- Application errors are collected in a tool where the team will see them.
- Admin logins and permission changes are logged.

## FAQ

### Is a free certificate good enough?

Yes. Free certificates such as Let's Encrypt provide the same encryption as paid ones. Paid certificates differ in validation type, warranty and support, not in how well traffic is protected.

### Do I need a WAF before launch?

It is not mandatory, but a CDN or WAF in front of the site helps filter bots, brute force attempts and simple attacks, and hides your server's IP. For public sites it is a cheap extra layer, not a replacement for the items above.

### Launch is tomorrow — what is most important?

HTTPS, no default passwords, debug mode off, closed `.env` and `.git`, 2FA on admin accounts and a working backup. These close the most common and most easily exploited gaps.
