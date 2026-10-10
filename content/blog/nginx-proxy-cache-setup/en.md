---
title: Nginx Proxy Cache: How to Cache Backend Responses
description: Setting up proxy_cache in Nginx: cache zone and key, bypass rules for logged-in users, serving stale content during outages and cache purging.
summary: Declare a cache zone with proxy_cache_path, enable proxy_cache and proxy_cache_valid, exclude logged-in users with proxy_cache_bypass and proxy_no_cache, and use proxy_cache_use_stale to keep the site up when the backend fails.
---

## The short answer

**proxy_cache** is Nginx's on-disk cache for your backend's responses. A repeated request for the same page is served from the cache and the application is not called at all. The basic setup has two parts:

```nginx
# in the http block
proxy_cache_path /var/cache/nginx/app levels=1:2 keys_zone=app_cache:10m
                 max_size=1g inactive=60m use_temp_path=off;

server {
    location / {
        proxy_pass http://app_backend;
        proxy_cache app_cache;
        proxy_cache_valid 200 301 10m;
        proxy_cache_valid 404 1m;
        add_header X-Cache-Status $upstream_cache_status;
    }
}
```

- **keys_zone** — the name and size of the in-memory zone that holds keys and metadata.
- **max_size** — the disk space limit; old entries are evicted automatically.
- **inactive** — an entry is removed if nobody requested it for this long, even if it is still "fresh".
- **proxy_cache_valid** — how long to keep responses with specific status codes.

The `X-Cache-Status` header shows `HIT`, `MISS`, `BYPASS`, `STALE` and other statuses, which makes it easy to check the cache with `curl -I`.

## The cache key

The key decides which requests count as "the same". The default is `$scheme$proxy_host$request_uri`. If several domains share one upstream, include the host explicitly:

```nginx
proxy_cache_key "$scheme$request_method$host$request_uri";
```

Add everything the response depends on: for example, the language if it comes from a cookie rather than the URL. Otherwise a user gets a page in someone else's language.

## Do not cache logged-in users

The main risk of caching is showing one user another user's personal data. For requests with a session cookie, bypass the cache both on read and on write:

```nginx
proxy_cache_bypass $cookie_sessionid $http_authorization;
proxy_no_cache     $cookie_sessionid $http_authorization;
```

- **proxy_cache_bypass** — do not serve the response from the cache.
- **proxy_no_cache** — do not store the response in the cache.

The rule fires if any of the variables is non-empty and not `0`. Also keep `/admin`, the cart, checkout and APIs with personal data out of the cache — the simplest way is separate `location` blocks without `proxy_cache`.

Note that by default Nginx respects backend headers: responses with `Set-Cookie` or `Cache-Control: private, no-store` are not cached. This is a safety net, so only override it with `proxy_ignore_headers` if you understand the consequences.

## Serving stale content during outages

The cache can keep your site alive when the backend is down or overloaded:

```nginx
proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
proxy_cache_background_update on;
proxy_cache_lock on;
```

- **proxy_cache_use_stale** — on a backend error, serve the stale copy instead of the error.
- **updating** with **proxy_cache_background_update** — while an entry refreshes in the background, users get the old version without waiting.
- **proxy_cache_lock** — on a miss, only one request goes to the backend while the rest wait for its result. This prevents a stampede when a popular entry expires.

## How to purge the cache

The `proxy_cache_purge` directive exists only in the commercial NGINX Plus. With open source Nginx, use other approaches:

| Approach | How it works | Downsides |
|---|---|---|
| Short TTL | Data refreshes on its own after a few minutes | Changes are not instant |
| Forced refresh | `proxy_cache_bypass $http_x_refresh` — a request with the header overwrites the entry | The header must be protected from outsiders |
| Deleting files | Clear the cache directory | Wipes the whole cache |
| Third-party module | For example, ngx_cache_purge | Requires building Nginx with the module |
| Versioned URLs | For static files: `app.3f2a.js` | Only works for assets |

For content sites, a short TTL combined with `proxy_cache_use_stale` is usually enough: pages refresh quickly and the site stays available during failures.

## Common mistakes

- Caching pages with personal data — the most dangerous mistake.
- No `X-Cache-Status`, so nobody knows whether the cache works.
- A key without the host or language — users see the wrong version of a page.
- A cache directory the Nginx worker user cannot write to.

## FAQ

### How is proxy_cache different from browser caching?

The browser cache lives on each user's device and is controlled by `Cache-Control` headers. proxy_cache lives on your server and is shared by all visitors, so it reduces backend load even for first-time users.

### What TTL should I choose?

It depends on how often the data changes and how much an update delay matters. Minutes usually work for the home page and articles; a catalog with prices and stock needs less, or no cache at all.

### Can I cache an API?

Yes, if the response is the same for everyone, such as a category list or a public catalog. Personal endpoints and any requests other than GET and HEAD should not be cached.
