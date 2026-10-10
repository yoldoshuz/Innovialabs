---
title: Nginx vs Apache: Performance, Configuration and Use Cases
description: Nginx vs Apache compared: process models, .htaccess vs central config, static and dynamic content, and when running Nginx in front of Apache makes sense.
summary: Nginx handles static files and many concurrent connections better and is the usual reverse proxy, while Apache is convenient where .htaccess and built-in modules matter, such as shared hosting and legacy PHP projects.
---
## The short answer

For a new project, **Nginx** is the more common choice: it serves static files quickly, holds many connections cheaply and works great as a reverse proxy in front of your app.

**Apache** is still a sensible choice when a project depends on `.htaccess`, uses Apache-specific modules or lives on shared hosting without access to the main configuration.

## Process models

### Apache: MPMs

Apache handles requests through **MPMs** (Multi-Processing Modules):

- **prefork** — one process per connection. Robust and compatible with the old `mod_php`, but memory-hungry.
- **worker** — processes with several threads each.
- **event** — an evolution of worker that handles idle keep-alive connections separately, saving a lot of resources.

### Nginx: the event loop

Nginx was built around an **asynchronous, event-driven model** from day one: a few worker processes, each serving many connections without blocking. With lots of concurrent and slow clients, memory usage grows far more gently.

## .htaccess vs central configuration

**Apache** supports `.htaccess` files inside site directories. You can change them without touching the main config or restarting the server.

- Pro: convenient on shared hosting and for CMSs that write their own rules (WordPress, many PHP frameworks).
- Con: Apache checks for these files in every directory along the request path on every request, which is extra work. Rules end up scattered across the project and are harder to debug.

**Nginx** has no `.htaccess`. All configuration lives in central files and is applied with a `reload`.

- Pro: faster, more predictable, easier to review and keep in Git.
- Con: you need server access, and existing `.htaccess` rules must be rewritten by hand.

## Static and dynamic content

| Task | Nginx | Apache |
|---|---|---|
| Static files | Very efficient | Good, but heavier on resources |
| PHP | Via PHP-FPM (FastCGI) | Via `mod_php` or PHP-FPM |
| Node.js, Python, Go | Reverse proxy | Reverse proxy via `mod_proxy` |
| Per-directory rules | No | `.htaccess` |
| Modules | Compiled in or loaded dynamically | Rich set, easy to enable |

The key difference: **Apache can run PHP inside itself** (`mod_php`), while **Nginx always hands dynamic requests to an external process**. Modern practice for both is PHP-FPM.

## When Nginx in front of Apache makes sense

In this setup Nginx receives every request, serves static files and HTTPS itself, and proxies dynamic requests to Apache.

It is justified when:

- you have a legacy PHP application deeply tied to `.htaccess` and Apache modules, and rewriting the rules is expensive;
- you need to quickly offload static files and slow clients from Apache;
- you are migrating to Nginx gradually, piece by piece.

The downsides: two servers in the chain, two sets of configs and logs, more points of failure. A new project usually does not need it.

## How to choose

- **New project, SPA, API in Node.js/Python/Go** — Nginx as a reverse proxy.
- **WordPress or another PHP project on your own server** — Nginx with PHP-FPM; rewrite the rules once.
- **Shared hosting where `.htaccess` is required** — Apache.
- **Legacy you cannot easily touch** — Nginx in front of Apache as a transition step.

## Common mistakes

- Copying `.htaccess` rules into Nginx literally — the syntax and logic differ.
- Keeping Apache on prefork for no reason when event would serve better.
- Chaining two servers "for speed" where a single Nginx would do.

## FAQ

### Is Nginx always faster than Apache?

For static files and many concurrent connections Nginx is usually more efficient. For dynamic content, speed is mostly determined by your application and database, not the web server.

### Can I use .htaccess with Nginx?

No. The rules must be moved into the server configuration. Online converters exist, but always review and test the result by hand.

### Which one is better for WordPress?

Both work. Apache is simpler because WordPress manages `.htaccess` itself. Nginx with PHP-FPM is usually lighter on resources but needs the rewrite rules set up once by hand.
