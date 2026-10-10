---
title: What Is a DDoS Attack and How It Takes Websites Down
description: DDoS explained simply: volumetric, protocol and L7 attacks, the role of botnets, how to tell an attack from a traffic spike and what downtime really costs.
summary: A DDoS attack is a flood of traffic from thousands of compromised devices that saturates your bandwidth, network equipment or the application itself, so the site stops responding to real users. The defense is filtering traffic before it reaches your server: CDN, anti-DDoS and rate limiting.
---

## What DDoS is

**DDoS (Distributed Denial of Service)** is an attack from many sources at once that aims to deny service. The goal is not to steal data but to **make the service unavailable**: the site does not load, the app does not respond, payments fail.

A plain DoS comes from one address and is easy to block. A distributed attack is run by thousands of devices around the world, so simply banning IPs does not help.

## Three types of attacks

| Type | What it exhausts | Measured in | Examples |
|---|---|---|---|
| **Volumetric** | the internet link to your server | bits per second | UDP floods, DNS or NTP amplification |
| **Protocol** | connection tables on servers, firewalls, load balancers | packets per second | SYN floods, fragmented packets |
| **Application (L7)** | the app itself: CPU, database, workers | requests per second | HTTP floods on search, login, cart |

### Volumetric

The attacker pushes more junk traffic than the link can carry. **Amplification** is common: a small request to an open DNS or NTP server with the victim's spoofed address triggers a large response that goes to the victim. Your server can be configured perfectly — the traffic simply never gets through.

### Protocol

Here the goal is to exhaust resources spent on each connection. In a **SYN flood** the server receives a mass of connection requests, reserves memory for each and waits for a reply that never comes. The table fills up and real users cannot connect.

### Application (L7)

The trickiest kind. Requests look normal: `GET /search?q=...` or login attempts. There may not be many by network standards, but each one makes the app work — hit the database, render a page. If an uncached search is slow, a relatively small stream is enough to take the site down.

## Where botnets come from

A **botnet** is a network of compromised devices controlled by the attacker: routers, IP cameras, smart devices with factory passwords, hacked servers and computers. Their owners usually notice nothing. Botnet capacity is rented out, so someone with no technical skills can order an attack — a competitor, an extortionist or an angry user.

## Attack or traffic spike

Sudden traffic growth also comes from ads, newsletters or press mentions. Signs that help tell them apart:

| Sign | Real spike | Attack |
|---|---|---|
| Cause | clear: launch, newsletter, post | no obvious reason |
| Pages | varied, in a logical sequence | one or two, often "heavy" ones |
| Behavior | images, CSS, JS load | only HTML or a single endpoint |
| Sources | your usual countries and ISPs | unusual countries, hosting providers, similar networks |
| User-Agent and Referer | diverse | identical, empty or odd |
| Conversions | grow with traffic | flat or falling |

Look at web server logs, analytics and CDN metrics together. JavaScript analytics often does not see bots at all, so "analytics is quiet but the server is down" is also a signal.

## What downtime really costs

The exact figure is different for every business. It is made up of several factors:

- **Direct losses** — orders and leads that never happened while the site was down.
- **Wasted ad spend** — campaigns keep spending and sending people to a broken page.
- **Team load** — support handles complaints, developers drop planned work.
- **SLA penalties** to your own customers if you run a B2B service.
- **Reputation** — a user who could not pay may leave for a competitor for good.
- **SEO** — with long or frequent outages, search crawlers keep hitting errors.

Sometimes DDoS is a **smokescreen**: while the team fights the load, someone attempts a breach. Another scenario is extortion: "pay, or the attack continues".

## How protection works in general

- Put a **CDN or anti-DDoS service** in front to filter traffic before it reaches your server, and hide your origin's real IP.
- Set up **rate limiting** on login, search, forms and APIs.
- **Cache** everything you can so heavy pages do not hit the database on every request.
- Ask your hosting provider in advance what they do during an attack, and prepare a response plan.

Autoscaling helps survive a peak, but during an attack it can turn into a big infrastructure bill, so set limits.

## FAQ

### Can a firewall on the server alone stop DDoS?

Only small attacks. A volumetric attack saturates the link to the server, so the firewall on it never gets a chance to filter anything. You need filtering at the provider or CDN level.

### Does DDoS break the site or steal data?

Not by itself: it makes the service unavailable while the attack lasts. But it can be used as cover for a parallel breach, so watch your logs more closely during an attack.

### How do I know it is an attack and not just slow hosting?

Compare server metrics and logs: during an attack, requests and connections spike and similar sources and URLs appear. If traffic looks normal and the server is still slow, the problem is more likely infrastructure or code.
