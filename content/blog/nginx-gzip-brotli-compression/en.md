---
title: How to Enable Gzip and Brotli Compression in Nginx
description: How response compression works, configuring gzip and brotli in Nginx with sensible levels and MIME types, precompressed files and checking with curl.
summary: Gzip is enabled with the built-in gzip on and gzip_types directives, Brotli needs the ngx_brotli module; compress text formats at a mid level, precompress static files and verify via the Content-Encoding header.
---
## How compression works

In every request the browser says which algorithms it understands: `Accept-Encoding: gzip, deflate, br`. The server picks one, compresses the response and marks it with a `Content-Encoding` header. The browser decompresses the data itself.

**Text formats** benefit the most: HTML, CSS, JavaScript, JSON, SVG. **Brotli** usually compresses text more tightly than gzip, while **gzip** is supported by practically every client. So it makes sense to enable both: Brotli for modern browsers, gzip as the fallback.

## Configuring gzip

Gzip is built into Nginx. Add to the `http` block:

```nginx
gzip on;
gzip_comp_level 5;
gzip_min_length 256;
gzip_vary on;
gzip_proxied any;
gzip_types
    text/plain
    text/css
    text/xml
    application/javascript
    application/json
    application/xml
    image/svg+xml;
```

What matters here:

- **gzip_comp_level** — from 1 to 9. A higher level costs more CPU for a small size gain. For on-the-fly compression, mid values are the usual choice.
- **gzip_min_length** — very small responses are not worth compressing.
- **gzip_vary** — adds `Vary: Accept-Encoding` so CDNs and proxies do not serve a compressed copy to a client that cannot read it.
- **gzip_proxied any** — compress responses to requests that came through a proxy or CDN as well.
- **text/html** does not need to be listed in `gzip_types`: it is always compressed.

## Configuring Brotli

Brotli is not part of the standard Nginx build. You need the **ngx_brotli** module: some distributions ship it as a package, otherwise it is built as a dynamic module for your Nginx version. Once installed, load the modules at the top of `nginx.conf`:

```nginx
load_module modules/ngx_http_brotli_filter_module.so;
load_module modules/ngx_http_brotli_static_module.so;
```

And in the `http` block:

```nginx
brotli on;
brotli_comp_level 5;
brotli_types
    text/plain
    text/css
    text/xml
    application/javascript
    application/json
    application/xml
    image/svg+xml;
```

If the client supports both algorithms, Brotli is used; if only gzip, then gzip.

## What not to compress

JPEG, PNG, WebP, AVIF, MP4, WOFF2 and archives are already compressed. Compressing them again wastes CPU and barely reduces size. That is why you list types explicitly instead of compressing everything.

## Precompressed files

For static files (JS and CSS after the build), it is better to compress them ahead of time at the maximum level and let Nginx simply serve the result:

```bash
gzip -k -9 dist/assets/*.js dist/assets/*.css
brotli -q 11 dist/assets/*.js dist/assets/*.css
```

Next to `app.js` you get `app.js.gz` and `app.js.br`. Enable serving them:

```nginx
gzip_static on;
brotli_static on;
```

Nginx checks whether a file with the right extension exists and serves it without compressing on the fly. `gzip_static` requires the `ngx_http_gzip_static_module`; `nginx -V` shows whether your build includes it.

## How to verify

1. `sudo nginx -t` and `sudo systemctl reload nginx`.
2. Send a request with the header:

```bash
curl -s -o /dev/null -D - -H "Accept-Encoding: br" https://example.com/assets/app.js
curl -s -o /dev/null -D - -H "Accept-Encoding: gzip" https://example.com/assets/app.js
```

Look for `content-encoding: br` or `content-encoding: gzip` in the response.

3. In browser DevTools, enable the Content-Encoding column in the Network tab and compare transferred and actual file sizes.

## Common mistakes

- **A missing MIME type.** For example, the API returns `application/json`, but it is not in `gzip_types`.
- **Brotli module not loaded.** The `brotli` directive without the module makes `nginx -t` fail.
- **Maximum level on the fly.** It loads the CPU on every request; keep the maximum for precompressed static files.
- **Double compression.** If the backend already compresses responses and a CDN sits in front, check where compression happens and keep it in one place.

## FAQ

### Which is better: gzip or Brotli?

Brotli usually produces smaller files, especially for static assets at high levels. But enable both: gzip is needed for clients and tools without Brotli support.

### Does compression affect site speed and SEO?

Compression reduces the amount of data transferred, so pages and scripts load faster, especially on mobile connections. That helps the loading metrics search engines take into account.

### Do I need compression if a CDN sits in front of the site?

Many CDNs can compress on their own. Still, it is useful to enable compression in Nginx with `gzip_vary on`, so the CDN receives already compressed content and caches the variants correctly.
