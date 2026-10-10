---
title: Caching Layers Explained: Browser, CDN, Reverse Proxy and App Cache
description: Where caching happens along a request: browser, CDN, reverse proxy and application. What to cache at each level and how to avoid serving stale data.
summary: Caching happens at four levels: browser, CDN, reverse proxy and application; static assets are cached as close to the user as possible, personal data only in the application, and the hard part everywhere is invalidating stale data on time.
---
## Where the cache lives

A user's request travels a long way: browser → CDN → reverse proxy (such as nginx) → application → database. At each step the response can be stored and served next time without going further. The **closer to the user** the cache hits, the faster the response and the lower the load on your servers.

| Level | Where it is | What to cache | Controlled by |
|---|---|---|---|
| **Browser** | On the user's device | JS, CSS, fonts, images | `Cache-Control`, `ETag` headers |
| **CDN** | Edge nodes worldwide | Static assets, public pages | Headers + CDN settings |
| **Reverse proxy** | In front of your app | Public HTML pages, API responses | nginx/Varnish config |
| **Application** | Redis, Memcached, process memory | Database query results, computations | Application code |

## Browser

The browser decides whether to reuse a stored file based on response headers:

- `Cache-Control: max-age=...` — how many seconds the file is considered fresh;
- `immutable` — the file will never change, no need to revalidate;
- `no-cache` — may be stored but must be revalidated with the server before use;
- `no-store` — do not store at all (for personal and sensitive data);
- `ETag` / `Last-Modified` — let the server reply `304 Not Modified` without resending the file.

**A working setup:** files with a hash in their name (`app.3f9a1c.js`) are cached for a long time with `immutable`, while HTML uses `no-cache` so users get the new version right after a deploy. Modern bundlers add hashes automatically.

## CDN

A **CDN** stores copies of files on servers in different regions and serves them from the node nearest to the user.

- Great for static assets, images, video and public pages.
- Respects `Cache-Control` and `s-maxage` (a separate lifetime for shared caches).
- Offers **purge** to clear content by URL, by tag or entirely.

The risk: a CDN can cache what it should not, such as a page with a logged-in user's data. Mark responses with personal data as `private` or `no-store`.

## Reverse proxy

nginx or Varnish in front of your app can store ready responses and avoid hitting the backend on every request. This helps most with heavy public pages: catalogs, articles, landing pages.

```nginx
proxy_cache_path /var/cache/nginx keys_zone=pages:10m max_size=1g inactive=60m;

server {
    location / {
        proxy_cache pages;
        proxy_cache_valid 200 5m;
        proxy_cache_bypass $cookie_session;
        proxy_no_cache $cookie_session;
        proxy_pass http://app;
    }
}
```

Pages are cached for 5 minutes, and requests carrying a session cookie bypass the cache, so a logged-in user never sees someone else's data.

## Application cache

Inside the app you cache what is expensive to get: slow database queries, external API responses, heavy computations. **Redis** or Memcached are typical, so the cache is shared by all app instances.

The common pattern is **cache-aside**: the app checks the cache first, on a miss queries the database and stores the result in the cache with a TTL.

## Invalidation strategies

Clearing stale data is the hardest part. The main approaches:

- **TTL (time to live).** Simple and reliable, but data may be stale until it expires.
- **Versioned keys and URLs.** A new file version gets a new name (hash in the filename), and the old cache simply stops being used.
- **Explicit invalidation on change.** Update a product, delete its Redis key and purge it in the CDN.
- **stale-while-revalidate.** Serve a slightly stale response instantly and refresh it in the background.

## Common pitfalls

- **Cached HTML without versioning.** After a deploy users see an old page that links to deleted files.
- **Personal data in a shared cache.** The most dangerous mistake: one user sees another user's data.
- **Cache stampede.** A popular key expires and hundreds of requests hit the database at once. Locks, randomized TTL and stale-while-revalidate help.
- **Cache as the only storage.** Redis can be flushed; data must be recoverable from the primary source.
- **Caching everything.** Each cache layer is another place where data can go stale. Cache what is actually slow.

For header details, see the [MDN documentation on HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching).

## FAQ

### Which level should I start with?

The browser and CDN for static assets: correct `Cache-Control` headers and hashed filenames give a noticeable effect with almost no risk. Add application caching selectively, once profiling shows a specific bottleneck.

### Why do some users see the old site after a deploy?

Usually the HTML is cached by the browser or CDN for too long. Serve HTML with `no-cache` or a short lifetime, give static files hashed names, and purge the CDN on release.

### Can API responses be cached?

Yes, if the response is the same for all users, or if the cache key includes everything the response depends on. Cache responses with personal data only at the application level, keyed by user.
