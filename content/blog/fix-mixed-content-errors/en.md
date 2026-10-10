---
title: Mixed Content Errors: Why They Happen and How to Fix Them
description: Why an HTTPS site still loads HTTP resources, how to find them in code and CMS databases, and how upgrade-insecure-requests works as a safety net.
summary: Mixed content means an HTTPS page loads scripts, styles or images over plain HTTP; find them in DevTools, rewrite the URLs to HTTPS in code and in the database, and add upgrade-insecure-requests as a safety net.
---
## What mixed content is

**Mixed content** happens when a page is served over HTTPS but some of its resources — scripts, stylesheets, images, fonts, iframes, API calls — are still requested over plain `http://`. The page itself is encrypted, but those requests are not, so an attacker on the same network could read or replace them.

Browsers react in two ways:

- **Active content** (scripts, stylesheets, iframes, `fetch`/XHR requests) is **blocked**. This is why a site can suddenly lose its styles or a widget stops working after moving to HTTPS.
- **Passive content** (images, audio, video) is usually upgraded to HTTPS automatically by modern browsers. If the resource is not available over HTTPS, it simply does not load, and the padlock may show a warning.

The fix is always the same: every resource must be requested over HTTPS.

## Why it appears after moving to HTTPS

- **Hardcoded URLs** in templates, CSS (`background: url(http://...)`) and JavaScript.
- **CMS databases** store absolute links inside posts, settings and widgets. WordPress, for example, saves `http://` image URLs directly in post content.
- **Wrong site URL in config** — the app builds links from a base URL that still starts with `http://`.
- **A reverse proxy or load balancer** terminates TLS, so the app sees a plain HTTP request and generates `http://` links. It needs to trust the `X-Forwarded-Proto` header.
- **Third-party embeds** — old counters, widgets and CDNs that were added years ago.

## How to find insecure resources

1. Open the page, then **DevTools → Console**. Each blocked or upgraded request is reported as a "Mixed Content" warning with the exact URL.
2. Check the **Network** tab: look at the scheme of every request, including ones triggered after clicks and scrolls.
3. Search the codebase:

```bash
grep -rn "http://" --include=*.{html,css,js,php,tsx,twig} .
```

4. Search the database export for your own domain with `http://`.
5. For large sites, crawl all pages with a site crawler or collect reports with a **report-only Content Security Policy**: the browser will report violations without blocking anything.

```http
Content-Security-Policy-Report-Only: default-src https: data: blob: 'unsafe-inline' 'unsafe-eval'; report-uri /csp-report
```

## How to fix it in code

- Replace `http://` with `https://` for every resource that supports it.
- For your own files, use **root-relative paths** (`/assets/app.css`) — they automatically inherit the page scheme.
- Move the base URL into an environment variable and set it to `https://`.
- Behind a proxy, enable trusted proxy headers in your framework so it knows the original request was HTTPS.
- If a third-party resource has no HTTPS version, **replace it or host it yourself**. There is no safe way to keep it.

## How to fix it in a CMS database

Do not run a plain SQL `REPLACE` on WordPress tables: some values are **serialized PHP arrays** that store string lengths, and a blind replace breaks them. Use a tool that understands serialization, such as WP-CLI:

```bash
wp db export backup.sql
wp search-replace 'http://example.com' 'https://example.com' --all-tables --dry-run
wp search-replace 'http://example.com' 'https://example.com' --all-tables
```

Always make a backup first and look at the dry-run output. Then update the site URL settings and clear all caches (page cache, CDN, object cache), otherwise old HTML keeps being served.

## upgrade-insecure-requests as a safety net

The CSP directive **upgrade-insecure-requests** tells the browser to rewrite every `http://` subresource request on the page to `https://` before sending it. Add it as a response header:

```nginx
add_header Content-Security-Policy "upgrade-insecure-requests" always;
```

Or as a meta tag in `<head>`:

```html
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
```

Keep its limits in mind:

- It does **not** make a resource available over HTTPS. If the server has no HTTPS version, the request fails.
- It does not upgrade links to other sites that users click.
- It hides problems instead of fixing them, so treat it as insurance, not as the fix.

After cleaning up, add **HSTS** so browsers always use HTTPS for your domain.

## FAQ

### Can I just add upgrade-insecure-requests and skip the cleanup?

It will remove most warnings, but resources without HTTPS will still break, and new `http://` links keep piling up in the database. Fix the sources and keep the directive as a backup.

### Are protocol-relative URLs like //example.com/file.js fine?

They work, but they are a legacy pattern. Today almost everything is available over HTTPS, so write `https://` explicitly — it is clearer and avoids surprises on local files.

### Why does the padlock still show a warning after I fixed everything?

Usually it is a cached page, a CDN cache, or a resource loaded later by JavaScript. Clear the caches and check the Console again while clicking through the page.
