---
title: What Is Cloudflare and What It Does for Your Site
description: Cloudflare in plain terms: DNS, proxy, CDN, SSL and attack protection, what the free plan includes and what changes once your traffic goes through it.
summary: Cloudflare is a network that sits between visitors and your server: it runs your DNS, caches static files, provides SSL and filters out part of the attacks. The basics are free, but after connecting you need to configure SSL and your server correctly.
---

## What it is

**Cloudflare** is a global network of data centers that your site's traffic passes through. Instead of reaching your server directly, a visitor's browser hits the nearest Cloudflare node, which decides whether to serve a cached response, block a suspicious request or forward it to your server (called the **origin**).

Setup usually looks like this: you add the domain to Cloudflare and change the nameservers at your registrar to the ones Cloudflare gives you. From then on, Cloudflare serves your domain's DNS.

## Cloudflare's five roles

- **DNS.** Fast authoritative DNS with a convenient dashboard. Changes propagate quickly, and DNS works even without proxying.
- **Proxy.** For proxied records (the orange cloud), DNS returns Cloudflare's IP addresses instead of your server's. The real origin address stays hidden.
- **CDN.** Static files such as images, CSS and JS are cached across the network and served from the node closest to the visitor, which takes load off your server.
- **SSL.** Cloudflare issues a certificate for your domain automatically, so the site opens over HTTPS without extra setup on the visitor side.
- **Protection.** DDoS mitigation, basic firewall rules, bot protection and rate limiting.

## What the free plan includes

The free plan is enough for many small and mid-sized sites. It covers:

- DNS hosting;
- proxying and CDN;
- a free SSL certificate for your domain;
- DDoS protection;
- basic security and caching rules, traffic analytics.

Paid plans add an advanced WAF, more rules, more flexible image optimization, priority support and guarantees. The exact feature set changes over time, so check the pricing page.

## What changes after you connect

This is the part that matters most, because this is where most issues appear.

**1. SSL mode.** The connection between the visitor and Cloudflare is always HTTPS; between Cloudflare and your server it depends on the mode:

| Mode | What happens | When it fits |
|---|---|---|
| Flexible | Plain HTTP to your server | Almost never: origin traffic is unencrypted |
| Full | HTTPS to your server, certificate not validated | Temporarily, until you have a proper certificate |
| Full (strict) | HTTPS with certificate validation | The recommended option |

Flexible mode combined with an HTTPS redirect on the server often causes an **infinite redirect loop**.

**2. Visitor IPs.** Your server sees Cloudflare's IP addresses. The real address arrives in the `CF-Connecting-IP` header. Without configuration, logs, rate limits and geolocation on the server will be wrong. An nginx example:

```nginx
# repeat set_real_ip_from for every range listed at cloudflare.com/ips
set_real_ip_from 173.245.48.0/20;
real_ip_header CF-Connecting-IP;
```

**3. Not everything is proxied.** The proxy handles web traffic. Email (MX records), SSH and other protocols go directly, so their records stay unproxied. A subdomain like `mail.example.com` pointing to the same server can reveal your real IP.

**4. Caching.** By default static assets are cached and HTML is not. If you see old styles or scripts after a deploy, purge the cache in the dashboard or use versioned file names.

**5. Direct server access.** If the origin is reachable directly by IP, an attacker can bypass the protection. It makes sense to allow inbound web traffic only from Cloudflare's ranges.

## Common mistakes

- Choosing Flexible SSL and ending up in a redirect loop.
- Forgetting about real visitor IPs in logs and anti-fraud checks.
- Proxying a record that is not used for web traffic.
- Leaving the server open to everyone and assuming Cloudflare protects it completely.

## FAQ

### Will Cloudflare make my site faster?

It usually speeds up static file delivery, especially for visitors far from your server. It will not fix a slow backend or heavy database queries: dynamic pages are still generated on your server.

### Can I use only the DNS without the proxy?

Yes. Turn off proxying for the records you choose (grey cloud), and Cloudflare acts as a regular DNS provider, without CDN or protection for those records.

### Will my email break after moving DNS?

Not if you move every record: MX, SPF, DKIM, DMARC. Cloudflare tries to import existing records when you add a domain, but check them manually before switching nameservers.
