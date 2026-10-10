---
title: How to Get a Free SSL Certificate with Let's Encrypt
description: Issue a free Let's Encrypt SSL certificate via your hosting panel or Certbot, set up automatic renewal and check that renewal really works on your server.
summary: Click the Let's Encrypt button in your hosting panel or run certbot on your server, then confirm auto-renewal is enabled, run certbot renew --dry-run and add external expiry monitoring.
---
## The short answer

**Let's Encrypt** is a free certificate authority that issues DV certificates — they prove you control the domain. For HTTPS encryption they are just as good as paid ones.

There are two ways to get one:

- **Hosting panel** (cPanel, Plesk, ISPmanager and others) — the certificate is issued and renewed with a button.
- **Certbot** on your own server (VPS, dedicated) — the official client that obtains the certificate, installs it in the web server and renews it.

Let's Encrypt certificates are **short-lived**: currently 90 days, and the project plans to shorten that further. So issuing is the easy part — **automatic renewal**, and checking that it works, is what matters.

## What to prepare

- The domain already points to the server: the A record (and AAAA, if you have IPv6) resolves to the right IP.
- **Port 80 is open** in the firewall — the standard HTTP challenge runs over it.
- If the domain has an **AAAA record**, the same server must answer over IPv6: Let's Encrypt validates that address too.
- If you have **CAA records**, one of them must allow `letsencrypt.org`.

## Option 1: hosting panel

1. Open the "SSL/TLS" or "Certificates" section.
2. Choose Let's Encrypt and tick the domain and `www`.
3. Turn on the HTTP to HTTPS redirect if the panel offers it.

The panel renews automatically. Your job is to check every few months that the expiry date moves forward, and not to remove the rules that serve `/.well-known/acme-challenge/`.

## Option 2: Certbot on a server with Nginx

Install Certbot following the official instructions for your OS and web server at certbot.eff.org. On Debian and Ubuntu it can look like this:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d example.com -d www.example.com
```

Certbot validates the domain, obtains the certificate, writes it into the Nginx config and offers to set up the HTTPS redirect. For Apache, use the `--apache` plugin.

If you run another web server or prefer to edit configs yourself, get the certificate only:

```bash
sudo certbot certonly --webroot -w /var/www/example -d example.com -d www.example.com
```

Files land in `/etc/letsencrypt/live/example.com/`. In your server config use **`fullchain.pem`** (certificate plus chain) and `privkey.pem`, not `cert.pem`.

## Automatic renewal

Certbot packages usually create a systemd timer or cron job that runs `certbot renew` regularly. It renews only certificates that are close to expiry. Check it:

```bash
systemctl list-timers | grep certbot
sudo certbot renew --dry-run
```

`--dry-run` runs the whole process against a test server without changing anything. If there is no timer, add a cron job yourself.

With `certonly`, the web server will not pick up the new certificate on its own. Add a **deploy hook** — a script Certbot runs after a successful renewal:

```bash
sudo tee /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh <<'EOF'
#!/bin/sh
systemctl reload nginx
EOF
sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh
```

## How to check renewal really works

A passing `--dry-run` does not prove the site serves the new certificate. Check three things:

1. **What Certbot knows:** `sudo certbot certificates` shows the expiry date.
2. **What the server serves:**

```bash
echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null | openssl x509 -noout -enddate
```

   If the dates in steps 1 and 2 differ, the server was not reloaded after renewal.

3. **External monitoring.** Let's Encrypt no longer sends expiry reminder emails, so use a monitoring service with SSL checks that warns you when only a few days are left.

## Common mistakes

- **Port 80 is closed**, or a redirect or security rule blocks `/.well-known/acme-challenge/` — validation fails.
- **Using `cert.pem` instead of `fullchain.pem`** — desktop browsers work, but some devices and API clients report a chain error.
- **Two Certbot installs** (distro package and snap) — one renews while you inspect the other.
- **Repeated tests on production** — you can hit Let's Encrypt rate limits. Use `--dry-run` or `--staging` for experiments.

## FAQ

### Is a free certificate worse than a paid one?
The encryption is identical. Paid certificates differ in validation type (OV and EV verify the organization), validity period, support and warranty. For most websites, a DV certificate from Let's Encrypt is enough.

### Can I get a wildcard certificate?
Yes, but only through DNS validation: you create an `_acme-challenge` TXT record manually or with a plugin for your DNS provider's API.

### Why can't Certbot validate my domain?
Usually the domain still points to another IP, port 80 is closed, the AAAA record points to a different server or a CAA record does not allow Let's Encrypt. Certbot's error message normally names the cause.
