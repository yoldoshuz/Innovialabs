---
title: How to Protect a Website from DDoS Attacks
description: Choosing DDoS protection: Cloudflare and scrubbing services, hosting-level filtering, hiding your origin IP, caching and a plan for when an attack starts.
summary: Put your site behind a traffic filtering service such as Cloudflare, hide the real server IP and allow traffic only from that service, cache everything you can, and prepare an attack response plan in advance.
---
## The short answer

A **DDoS attack** tries to overwhelm a website with so many requests or so much traffic that it stops responding to real visitors. A single server cannot absorb that, so protection follows one principle: **filter traffic before it reaches you**.

1. Route traffic through a **filtering service** (Cloudflare or a similar provider).
2. **Hide the real IP** of your server and close it to everyone except the filter.
3. **Cache** whatever you can, so the attack hits the cache instead of your database.
4. Have a **response plan** and the right access ready before anything happens.

## Types of attacks

- **L3/L4 (volumetric)** — flood the network link or stack: UDP floods, SYN floods, amplification. Tuning nginx does not help here, because the link is already saturated.
- **L7 (application)** — look like normal HTTP requests: thousands of hits on search, the cart or the login page. Each request is expensive for the server, so relatively little traffic is enough.

Good protection covers both layers.

## Protection options

| Option | What it filters | Pros | Cons |
|---|---|---|---|
| **Cloudflare and similar CDN/WAF** | L3/L4 and L7 | Quick to enable via DNS, free tier available, cache and WAF in one place | All traffic passes through a third party; fine-grained L7 rules may require a paid plan |
| **Dedicated scrubbing services** | L3/L4 and L7 | Strong filtering, hands-on support during attacks, can protect non-HTTP services | More expensive, harder to set up |
| **Hosting or cloud provider filtering** | Mostly L3/L4 | Nothing to configure, often on by default | Usually weak against L7; under a large attack the provider may simply null-route your server |
| **Your own server only (nginx, firewall)** | Small L7 attacks | Full control | A volumetric attack fills the link before your rules ever run |

For most websites and online stores, start with **a CDN with DDoS protection plus basic hosting-level filtering**. A scrubbing service makes sense when downtime is expensive or serious attacks have already happened.

## Hiding the origin IP

Protection fails if the attacker knows your real IP and hits it directly, bypassing the filter. Check that:

- The **server firewall** accepts ports 80/443 only from your protection provider's IP ranges. Providers publish these lists officially.
- There are **no unproxied subdomains** pointing to the same server: `mail`, `ftp`, `dev`, `cpanel`.
- **Email** is not sent from the same IP: message headers reveal the sender's address. Use a separate email delivery service.
- **Outgoing requests** (webhooks, fetching images by URL) do not leak the IP either.
- If the IP was ever exposed in DNS, it can be found in historical records. After enabling protection, **change the server IP**.

An nginx example in case direct requests still reach the server:

```nginx
# allow only the protection provider's ranges (example; get the list from your provider)
allow 173.245.48.0/20;
allow 103.21.244.0/22;
deny all;
```

It is more robust to do this in the firewall or the cloud security group, so packets are dropped before they ever reach nginx.

## Caching as protection

The more responses are served from the edge cache, the fewer requests reach your application:

- Cache static assets (JS, CSS, images) for a long time.
- Cache pages that are the same for everyone (home, articles, catalog) at least briefly — even a few seconds of caching cuts load sharply during a spike.
- Protect expensive endpoints (search, filters, login, API) with **rate limits** and bot checks.

## What to do when an attack starts

1. **Confirm it is an attack**, not a bug or a marketing campaign: check logs, traffic graphs and request sources.
2. **Turn on the hardened mode** in your protection service (Cloudflare calls it Under Attack Mode): visitors get a browser check.
3. **Add rules**: limits on the targeted URLs, blocks based on request patterns (User-Agent, path, parameters), temporary restrictions by country or network — carefully, so you do not cut off your own customers.
4. **Contact your protection and hosting providers** with the start time and sample requests.
5. **Check whether traffic bypasses the filter.** If it does, your IP is exposed and must be changed.
6. **Afterwards**, keep the logs, review what worked and make the useful rules permanent.

Prepare in advance: DNS and dashboard access for two people, support contacts, a simple maintenance page.

## Common mistakes

- Cloudflare is enabled, but the server is still open to the whole internet.
- Caching is switched off "just in case", so every request hits the database.
- Only one employee has DNS access, and they are on vacation.
- Blocking entire countries without analysis — customers leave along with the attack.

## FAQ

### Is Cloudflare's free plan enough?

For many small sites, yes: basic protection against volumetric attacks is included in the free plan. Fine-tuned L7 rules, an advanced WAF and priority support usually require a paid plan.

### Can nginx settings alone protect a site?

Only against small application-layer attacks. A volumetric attack saturates the link to the server, so nginx never even sees it. nginx limits are a useful second layer, not the only one.

### Should I do anything if I have never been attacked?

Yes. Filtering, IP hiding and caching are much easier to set up in advance than mid-attack.
