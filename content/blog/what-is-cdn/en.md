---
title: What Is a CDN and How It Speeds Up Your Website
description: How a CDN works: edge servers, cached versus dynamic content, why pages load faster for distant visitors and when a CDN is not worth adding.
summary: A CDN is a network of servers around the world that keep copies of your site's files and serve them from the point closest to each visitor, so pages load faster and your main server does less work; the gain is largest for static files and audiences far from the server.
---
## The short answer

A **CDN (Content Delivery Network)** is a network of servers in many cities and countries. They sit between visitors and your main server (the **origin**) and keep copies of your site's files. When someone opens a page, images, styles and scripts arrive from the nearest node in the network instead of from the origin.

The result: pages open faster, the origin handles fewer requests, and the site copes better with traffic spikes.

## How it works

CDN nodes are called **edge servers** or points of presence (PoPs). The flow is:

1. A visitor in Tashkent requests `example.com/logo.png`.
2. DNS routes them to the nearest CDN edge server.
3. If the file is already cached at the edge, it is served immediately (**cache hit**).
4. If not (**cache miss**), the edge fetches it from the origin, serves it and keeps a copy for the next visitor.

How long a copy is kept is controlled by your server's response headers, for example:

```http
Cache-Control: public, max-age=31536000, immutable
```

That header suits files with a hash in the name (`app.3f9a2c.js`): when the file changes, the name changes, so the old cache never gets in the way.

## Why a CDN makes a site faster

The main factor is **latency**: the round-trip time to the server and back. It grows with distance and the number of network hops. If the server is in Europe and the visitor is in Central Asia, every request travels a long way — and a page load is dozens of requests plus several connection set-up steps (TCP, TLS).

A CDN shortens that path:

- **static files come from a nearby node**, so each request is shorter;
- **the TLS handshake happens with the nearest edge**, not a distant server;
- **between edge and origin**, CDNs usually keep persistent, optimised connections.

For visitors close to the origin the difference is small. For distant ones it is noticeable.

## Cached versus dynamic content

| Content | Examples | Cached? |
|---|---|---|
| **Static** | Images, fonts, CSS, JS, video | Yes, for a long time |
| **Public pages** | Home page, blog posts, product pages | Often, for a short time |
| **Personal content** | Cart, account area, API responses with user data | No |

The CDN still passes personal pages through, it just does not cache them. Even there you may gain a little from faster TLS and an optimised route to the origin, but less than with static files.

## What else a CDN gives you

- **DDoS protection** and filtering of malicious traffic at the network level.
- **Free SSL** at the edge.
- **Compression and image optimisation** with some providers.
- **Resilience**: if the origin is briefly down, some pages can still be served from cache.

## When a CDN is not worth it

- **Your whole audience is near the server** and the site is small. The gain is minimal and complexity grows.
- **Almost all content is personal**, such as an internal CRM. There is nothing to cache.
- **You have data-residency requirements** and the provider has no nodes in the required jurisdiction.
- **You have no time to manage caching.** A bad configuration can show one user's data to another or keep a stale page after an update.

## Common mistakes

- **Caching pages with personal data.** Make sure responses tied to session cookies or personal data are marked `Cache-Control: private` or `no-store`.
- **Long cache times for files without a hash in the name.** After an update, visitors still get the old `style.css`.
- **Forgetting to purge the cache** after a deploy.
- **An exposed origin.** If the server can be reached bypassing the CDN, its attack protection loses its point.

## FAQ

### Does a small website need a CDN?

If your audience is in one country and the server is in or near it, not necessarily. But many hosts and platforms such as Vercel or Netlify include a CDN by default, in which case there is nothing extra to set up.

### Does a CDN replace hosting?

No. A CDN distributes copies and proxies requests, but the site still has to run somewhere. The exception is fully static sites, which some CDN platforms can host themselves.

### How can I tell whether a file came from the CDN cache?

Check the response headers in the Network tab of your browser's developer tools. Most providers add a cache-status header, such as `cf-cache-status: HIT` on Cloudflare or `x-cache: Hit` on other networks.
