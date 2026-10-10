---
title: HTTP Security Headers Checklist for Websites
description: Each essential HTTP security header, what attack it blocks, the recommended value, an nginx snippet and how to check your site in a few minutes.
summary: A handful of response headers — HSTS, CSP, X-Content-Type-Options, X-Frame-Options or frame-ancestors, Referrer-Policy, Permissions-Policy plus Secure cookie flags — switch on browser protections against downgrade, clickjacking, MIME sniffing and data leaks at almost no cost.
---

## The short answer

Security headers are instructions your server sends with every response, telling the browser to enable extra protections. They do not fix bugs in your code, but they remove whole classes of attacks and limit the damage when something slips through. Setting them takes minutes; the only real work is testing that nothing breaks.

## The checklist

| Header | What it blocks | Recommended value |
|---|---|---|
| **Strict-Transport-Security** | Downgrade to HTTP, SSL stripping | `max-age=31536000; includeSubDomains` (roll out gradually) |
| **Content-Security-Policy** | XSS, injected scripts, unwanted embedding | Site-specific; at minimum `frame-ancestors 'self'; object-src 'none'; base-uri 'self'` |
| **X-Content-Type-Options** | MIME sniffing: an uploaded file treated as script or style | `nosniff` |
| **X-Frame-Options** | Clickjacking via your site in a hidden iframe | `DENY` or `SAMEORIGIN` |
| **Referrer-Policy** | Leaking full URLs with paths and tokens to other sites | `strict-origin-when-cross-origin` |
| **Permissions-Policy** | Abuse of camera, microphone, geolocation, including by embedded iframes | `camera=(), microphone=(), geolocation=()` — allow only what you use |
| **Cross-Origin-Opener-Policy** | Cross-origin windows getting a handle to your page | `same-origin` (or `same-origin-allow-popups` if you use OAuth or payment popups) |

### A note on each

- **HSTS** only works over HTTPS and is hard to undo quickly, so increase max-age in steps.
- **CSP** is the most powerful and the most likely to break things. Start with `Content-Security-Policy-Report-Only` and tighten over time.
- **X-Frame-Options** is the older mechanism; CSP `frame-ancestors` replaces it in modern browsers. Sending both is fine and covers older clients.
- **Referrer-Policy**: the recommended value is already the default in modern browsers, but setting it explicitly protects you from differences between browsers and lets you be stricter on sensitive pages (`no-referrer`).
- **Permissions-Policy**: an empty list `()` disables the feature for your page and all frames.

## Cookies are headers too

Every `Set-Cookie` for a session or token should have:

- **Secure** — sent only over HTTPS;
- **HttpOnly** — invisible to JavaScript, so an XSS bug cannot read it;
- **SameSite=Lax** (or `Strict`) — not sent with most cross-site requests, which reduces CSRF risk.

## What to remove or not use

- **Server** with a version number and **X-Powered-By** — they give attackers a free inventory. In nginx use `server_tokens off`; most frameworks have an option to drop `X-Powered-By`.
- **X-XSS-Protection** — the browser filter it controlled has been removed from modern browsers and could itself create issues. Omit it or send `0`; rely on CSP.
- **Public-Key-Pins (HPKP)** and **Expect-CT** — obsolete. HPKP in particular could lock users out of a site permanently.

## nginx example

Put shared headers in one file and include it in every `server` and in any `location` that has its own `add_header` — otherwise nginx does not inherit them there.

```nginx
# /etc/nginx/snippets/security-headers.conf
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
add_header Cross-Origin-Opener-Policy "same-origin" always;
```

```nginx
server {
    listen 443 ssl;
    server_tokens off;
    include snippets/security-headers.conf;
}
```

If the app sits behind a CDN or is served by a framework, set the headers in one place only, to avoid duplicates with conflicting values.

## How to verify

1. **Command line:** `curl -sI https://example.com` lists the response headers.
2. **Browser DevTools:** Network tab → select the document → Response Headers. Check the console for CSP and Permissions-Policy violations.
3. **Online scanners:** Mozilla HTTP Observatory and securityheaders.com grade the result and explain each missing header.
4. **Check several page types:** home page, an API response, a static file, a 404 page and a redirect. Headers often go missing on errors and static assets.

## FAQ

### Do security headers replace fixing vulnerabilities?

No. They are a second layer that makes exploitation harder and limits damage. Input validation, output escaping and access control in the code are still required.

### Which header is most likely to break my site?

Content-Security-Policy, followed by Cross-Origin-Opener-Policy if you rely on popups for login or payments. Test them in report-only mode or on staging first.

### Should API responses have these headers too?

Yes, at least HSTS and X-Content-Type-Options. Frame and permission headers matter less for pure JSON, but sending the same set everywhere is simpler and harmless.
