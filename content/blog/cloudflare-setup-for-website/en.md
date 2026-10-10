---
title: How to Put Your Website Behind Cloudflare Step by Step
description: Put a site behind Cloudflare: add the domain, switch nameservers, pick the right SSL mode, set basic caching and avoid mistakes that take sites down.
summary: Add the domain to Cloudflare, check the imported DNS records, switch nameservers at your registrar and use the Full (strict) SSL mode to get CDN and protection without breaking anything. Most outages come from Flexible SSL, missing DNS records and DNSSEC left enabled.
---
## The short answer: five steps

1. Add the domain to Cloudflare and check the imported DNS records.
2. Decide which records to proxy (orange cloud) and which to leave as DNS only (grey).
3. Disable DNSSEC at the registrar and switch to the nameservers Cloudflare assigns.
4. Choose **Full (strict)** SSL and turn on **Always Use HTTPS**.
5. Keep default caching and add rules only where needed.

The free plan is enough for most websites.

## Step 1. Add the domain and check the records

In the Cloudflare dashboard, add your domain and pick the free plan. Cloudflare scans your existing DNS records and offers to import them.

The scan does not find everything. Before continuing, open the DNS zone at your current provider and compare line by line:

- A, AAAA and CNAME records for the site and every subdomain;
- **MX** records and email TXT records (SPF, DKIM, DMARC);
- service verification records (Google, Microsoft and others);
- SRV records, if any.

Keep a copy of the old zone in case you need to roll back.

## Step 2. Orange or grey cloud

- **Proxied (orange)**: traffic goes through Cloudflare, so you get the CDN, attack protection and a hidden origin IP.
- **DNS only (grey)**: Cloudflare only answers DNS queries and traffic goes straight to your server.

Proxy the website records: root domain, `www` and subdomains with web apps. Leave grey anything that is not HTTP(S): mail servers (for example `mail.example.com`, which your MX points to), FTP, SSH, game and VPN services.

## Step 3. Switch nameservers

Cloudflare gives you two nameservers. Replace the current ones with them in your registrar's panel.

**Disable DNSSEC at the registrar first** by removing the DS record. Otherwise the domain may stop resolving for some users after the switch. Once Cloudflare activates the domain, enable DNSSEC in Cloudflare and add the new DS record at the registrar.

The nameserver change usually takes effect within a few hours, sometimes longer. Cloudflare emails you when the domain is active.

## Step 4. Choose the right SSL mode

Go to **SSL/TLS → Overview**:

| Mode | What happens | When to use |
|---|---|---|
| Off | No HTTPS | Never |
| Flexible | HTTPS to Cloudflare, plain HTTP to your server | Only if the server has no SSL at all, and temporarily |
| Full | HTTPS to the server, certificate not validated | As a transition step |
| **Full (strict)** | HTTPS to the server with certificate validation | **Recommended** |

Full (strict) needs a valid certificate on the server: from Let’s Encrypt or Cloudflare's free **Origin CA**. Origin CA certificates are trusted only by Cloudflare, so the record using one must stay proxied.

Then enable **Always Use HTTPS**. Turn on HSTS last, once everything is stable: browsers remember it and you cannot roll it back quickly.

## Step 5. Basic caching

By default Cloudflare caches static files by extension (images, CSS, JS, fonts) and **does not cache HTML**. That is a good starting point.

- In **Caching → Configuration**, keep the standard caching level.
- Use **Cache Rules** to set long cache times for folders with versioned files, such as `/assets/*`.
- Cache HTML only for fully static pages. Exclude admin areas, carts and user accounts.
- After a release, use **Purge Cache**, either everything or by URL. **Development Mode** bypasses the cache temporarily while you work.

## Mistakes that break a site

- **Flexible SSL plus an HTTPS redirect on the server** creates an endless loop and an `ERR_TOO_MANY_REDIRECTS` error.
- **DNSSEC left on** while changing nameservers.
- **Records missed during import**, most often breaking email.
- **Proxying mail or SSH subdomains**: these protocols do not pass through the proxy.
- **Caching HTML with personal data**, so visitors see someone else's page.
- **The server firewall blocking Cloudflare IPs**: all traffic now comes from them. For the same reason your logs show Cloudflare addresses. The real visitor IP arrives in the `CF-Connecting-IP` header:

```nginx
# Add every range from Cloudflare's official IP list
set_real_ip_from 173.245.48.0/20;
real_ip_header CF-Connecting-IP;
```

- **Rocket Loader and other script optimizations** sometimes break JavaScript. If forms or widgets stop working after the switch, disable these first.

## FAQ

### Is the free plan enough?

For most websites and small apps, yes: it includes the CDN, SSL, basic DDoS protection and cache rules. Paid plans add an advanced WAF, more rules and priority support.

### The site shows an old version after an update. What now?

Purge the Cloudflare cache and check the caching headers your server sends. For build assets, use hashed file names so purging is not needed at all.

### Can I use Cloudflare without changing nameservers?

A CNAME-based partial setup exists, but only on higher paid plans. On the free plan you need to delegate the domain to Cloudflare's nameservers.
