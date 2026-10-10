---
title: Browser Caching: Cache-Control, ETag and Cache Busting
description: How Cache-Control and ETag headers work, why HTML and static files need different caching rules and how to check the cache in DevTools.
summary: Cache hashed static files for a year with immutable and serve HTML with no-cache plus an ETag, so users get updates immediately while repeat visits stay almost instant.
---

## The short answer

The browser decides whether to use a cached file or ask the server based on response headers. A setup that works for most sites:

- **Static files with a hash in the name** (`app.3f9a2c.js`, `logo.81bd.svg`) — `Cache-Control: public, max-age=31536000, immutable`. A file with that name never changes, so it can be stored for a year.
- **HTML and API responses** — `Cache-Control: no-cache` plus `ETag` or `Last-Modified`. The browser asks the server "has it changed?" every time, and if not it gets a short `304 Not Modified` response with no body.
- **Personal data** — `Cache-Control: private, no-store`.

## The key headers

| Header | What it does |
|---|---|
| `max-age=N` | Response is fresh for N seconds, no server request |
| `no-cache` | May be stored, but must be revalidated before use |
| `no-store` | Do not store at all |
| `private` / `public` | Browser only / also CDNs and proxies |
| `immutable` | File will not change, no revalidation even on reload |
| `s-maxage=N` | Separate lifetime for CDNs and shared caches |
| `ETag` | A fingerprint of the resource version |
| `Last-Modified` | Date of the last change |

A common mix-up: **no-cache does not mean "don't cache"**. It means "cache, but always revalidate". Forbidding storage is `no-store`.

## How revalidation works

1. The server sends a file with `ETag: "abc123"`.
2. Freshness has expired (or `no-cache` is set), so the browser sends `If-None-Match: "abc123"`.
3. If the version is the same, the server replies `304` with no body — you save bandwidth, but not the request itself.
4. If it changed, the browser gets `200` with new content and a new `ETag`.

Revalidation is cheaper than a full download, but it is still a network round trip. That is why for static files it is better to **avoid requests entirely** with a long `max-age`.

## Cache busting with hashed file names

If you serve `styles.css` with a one-year `max-age`, users will not see the new version. The fix is **cache busting**: the bundler (Vite, webpack, Next.js) adds a content hash to the file name. Code changes, the hash changes, the name changes, and the browser downloads a new file.

One condition matters: **the HTML that references these files must not be cached for long**. Otherwise old HTML keeps pointing to old assets. An nginx example:

```nginx
location /assets/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
}

location / {
    add_header Cache-Control "no-cache";
    try_files $uri $uri/ /index.html;
}
```

Adding `?v=2` to the URL also works, but it is easy to forget to bump manually, while the bundler sets hashes for you.

## Checking the cache in DevTools

- Open the **Network** tab, pick a request and look at **Response Headers**: which `Cache-Control` is set and whether there is an `ETag`.
- The **Size** column shows `(memory cache)` or `(disk cache)` — the file came from cache without the network. Status `304` means a revalidation happened.
- **Disable cache** turns caching off only while DevTools is open. Uncheck it to see real behaviour.
- A normal reload may revalidate resources, so also test by following a link inside the site.
- Mind the CDN: headers such as `Age` or `X-Cache` (provider-specific) show whether an intermediate cache answered.

## Common mistakes

- **HTML with a long max-age.** Users see an old version of the site for days.
- **Long caching for files without a hash.** You update `logo.png` and some visitors keep the old logo.
- **Personal responses without `private`.** A CDN might serve them to another user.
- **Different ETags across servers** behind a load balancer — the browser keeps re-downloading the file.
- **Relying on `Expires`.** When `max-age` is present it wins; `Cache-Control` alone is enough.

## FAQ

### Should I use ETag or Last-Modified?

Both work for revalidation. ETag is more precise because it reflects content, not time. You can send both: the browser returns the matching conditional headers and the server checks them.

### How do I make every user get the new version of the site?

If assets are hashed and HTML uses `no-cache`, you do not need to do anything — new files load on the next visit. If HTML was cached for a long time, you have to wait for it to expire or change resource URLs; a server cannot remotely clear a browser cache without extra mechanisms.

### Should API responses be cached?

Private and frequently changing data usually gets `no-cache` or `no-store`. Public reference data that rarely changes can use a short `max-age` together with an ETag.
