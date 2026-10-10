---
title: Nginx Config for Static Sites and Single-Page Applications
description: Ready Nginx server blocks for static sites and SPAs: try_files for client-side routing, cache headers for assets and multiple sites on one server.
summary: For an SPA, Nginx only needs a root pointing to the build and try_files $uri $uri/ /index.html; give hashed assets a long cache and keep index.html uncached.
---
## The short answer

A built static site or SPA (React, Vue, Angular, Svelte) is just a folder with `index.html`, JS, CSS and images. Nginx serves them straight from disk, with no backend. An SPA needs one important detail: a **fallback to index.html**, so direct links like `/profile/settings` do not return 404.

## A basic server block for an SPA

```nginx
server {
    listen 80;
    server_name app.example.com;

    root /var/www/app/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**try_files** checks options in order: does the file exist, does the directory exist, and if nothing is found, serve `/index.html`. The app's router then handles the route in the browser.

## Caching assets

Bundlers (Vite, webpack and others) put a content hash into file names: `app.3f9a1c.js`. When the file changes, the name changes too. So these files can be cached for a long time, while `index.html` cannot, or users will not see the new version.

```nginx
server {
    listen 80;
    server_name app.example.com;
    root /var/www/app/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        try_files $uri =404;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location = /index.html {
        add_header Cache-Control "no-cache";
    }
}
```

| File type | Cache policy |
|---|---|
| Hashed JS, CSS, fonts | Long cache, `immutable` |
| `index.html` | `no-cache` — the browser revalidates every time |
| Images without a hash in the name | Moderate cache, or add a hash |

Note `try_files $uri =404` in `/assets/`: a missing JS file should return an honest 404, not `index.html` with status 200. Otherwise the browser receives HTML instead of a script and shows a confusing error.

The `/assets/` path depends on your bundler — check where it puts the files.

## A multi-page static site

For a site where each page is a separate HTML file (static site generators, landing pages), the index.html fallback is not needed. Instead, support extensionless URLs and a custom 404 page:

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/site;
    index index.html;

    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    error_page 404 /404.html;
}
```

## Multiple sites on one server

Nginx picks a block by the Host header and the **server_name** directive. Give each site its own file:

- `/etc/nginx/sites-available/app.example.com` with a link in `sites-enabled`, or
- `/etc/nginx/conf.d/app.example.com.conf` — depending on the distribution.

Each file holds its own `server` with its own `server_name` and `root`. To keep requests for unknown domains from landing on a random site, add a separate block with `listen 80 default_server;` and `return 444;`.

## Common mistakes

- **No SPA fallback.** The home page works, but refreshing `/dashboard` returns 404.
- **Long cache on index.html.** After a deploy, users see the old version until they clear their cache.
- **Lost headers.** `add_header` inside a location cancels all server-level `add_header` directives. If you set security headers at the server level, repeat them in the location or move them to a shared include.
- **Wrong permissions.** The user Nginx runs as needs read access to the site folder.
- **Reloading without a check.** Always run `nginx -t` before `systemctl reload nginx`.

## FAQ

### Why does my SPA return 404 on page refresh?

The browser asks the server for a path like `/orders/42`, and no such file exists on disk. `try_files $uri $uri/ /index.html` serves index.html, and the app's router handles the route.

### How do I make sure users get the new version right after a deploy?

Serve `index.html` with `Cache-Control: no-cache` and assets with hashed names and a long cache. The new index.html will reference the new files.

### Do I need Nginx if the site is hosted on a CDN or static hosting?

Not necessarily: those platforms handle fallbacks and caching through their own settings. Nginx is needed when the site lives on your own server or VPS.
