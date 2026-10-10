---
title: Content Security Policy (CSP): A Practical Setup Guide
description: CSP directives, nonces and hashes, report-only mode, third-party scripts and analytics, and a step-by-step path from a loose policy to a strict one.
summary: CSP is a response header that lists which scripts and other resources the browser may run on your page; the most robust setup is a nonce-based policy with strict-dynamic, reached gradually through report-only mode so nothing breaks along the way.
---

## The short answer

**Content Security Policy** is a header that tells the browser where scripts, styles, images, frames and network requests may come from. If an attacker manages to inject `<script>` into your page through an XSS bug, a good policy stops the browser from executing it.

Two kinds of policy exist:

- **Allowlist** — list trusted domains (`script-src 'self' cdn.example.com`). Easy to start, but often bypassable through a JSONP endpoint or an old library on an allowed domain.
- **Strict** — every allowed script carries a **nonce** or matches a **hash**. Much harder to bypass and the recommended target.

## Key directives

| Directive | Controls | Typical value |
|---|---|---|
| `default-src` | Fallback for fetch directives that are not set | `'self'` |
| `script-src` | JavaScript | Nonce + `'strict-dynamic'` |
| `style-src` | CSS | `'self'`, often with `'unsafe-inline'` early on |
| `img-src`, `font-src`, `media-src` | Images, fonts, media | `'self'` plus your CDN, `data:` if needed |
| `connect-src` | fetch, XHR, WebSocket, analytics beacons | `'self'` plus your API and analytics endpoints |
| `frame-src` | Iframes you embed | Only the providers you use (maps, video, payments) |
| `frame-ancestors` | Who may embed **your** page | `'self'` or `'none'` |
| `object-src` | Flash-era plugins | `'none'` |
| `base-uri` | The `<base>` tag | `'none'` or `'self'` |
| `form-action` | Where forms may be submitted | `'self'` plus payment providers |

Note that `frame-ancestors` does not fall back to `default-src` and does not work in a `<meta>` tag — only in the HTTP header.

## Nonces and hashes

**Nonce:** the server generates a fresh random value for every response and puts it both in the header and on each legitimate script tag.

```http
Content-Security-Policy: script-src 'nonce-R4nd0mBase64' 'strict-dynamic'; object-src 'none'; base-uri 'none'
```

```html
<script nonce="R4nd0mBase64" src="/app.js"></script>
```

An injected script has no valid nonce, so it does not run. The nonce must be unpredictable and **different on every response** — a hardcoded nonce is worthless. That makes nonces a fit for server-rendered pages; fully static cached HTML cannot carry a fresh one.

**Hash:** for static inline scripts you can allow `'sha256-...'` of their exact content. Any change to the script, even whitespace, changes the hash. Hashes suit static sites.

**`'strict-dynamic'`** lets a trusted script load further scripts without listing every domain. Browsers that support it ignore host allowlists in `script-src`, so you can keep `https:` as a fallback for older browsers.

## Report-only mode

```http
Content-Security-Policy-Report-Only: default-src 'self'; report-to csp
Reporting-Endpoints: csp="https://example.com/csp-reports"
```

The browser logs violations and sends reports but blocks nothing. Some browsers still need the older `report-uri` directive, so many sites send both. Expect noise: browser extensions and injected toolbars generate reports that are not your problem.

## Third-party scripts and analytics

- **Analytics, chat widgets, pixels** load their own scripts and then send data to their own domains. They usually need entries in `script-src` (or a nonce on the loader with `strict-dynamic`), `connect-src` and `img-src`. Take the list of domains from the vendor's documentation and confirm it with reports.
- **Tag managers** that let marketers paste custom HTML effectively allow arbitrary code. Restrict who can publish tags.
- **Inline event handlers** (`onclick="..."`) and `javascript:` links are blocked by a strict policy. Replace them with `addEventListener`.
- **`eval` and `new Function`** need `'unsafe-eval'`. Find the library that uses them and upgrade or replace it rather than allowing eval globally.

## From loose to strict, step by step

1. **Inventory.** Open the main page types with DevTools and note every external script, style, font, frame and API host.
2. **Report-only baseline.** Deploy a report-only policy close to what you saw. Collect reports for a while across real traffic.
3. **Enforce the safe directives first:** `object-src 'none'`, `base-uri 'none'`, `frame-ancestors 'self'`, `form-action 'self'`. They rarely break anything.
4. **Clean up the code:** move inline scripts into files or give them nonces, remove inline handlers and `eval`.
5. **Switch `script-src` to nonce + `'strict-dynamic'`** in report-only, fix what shows up, then enforce.
6. **Tighten styles and the rest** later, and keep monitoring reports after each release.

Check the final header with Google's CSP Evaluator and with the browser console.

## FAQ

### Can I set CSP with a meta tag instead of a header?

Partly. A `<meta http-equiv>` policy works for most directives, but not for frame-ancestors, reporting or sandbox. The HTTP header is preferable.

### Is style-src 'unsafe-inline' a serious hole?

It is weaker than strict, but injected CSS is far less dangerous than injected script. Many sites keep it temporarily and focus on locking down scripts first.

### Does CSP replace escaping user input?

No. CSP is a safety net for when escaping fails. Output encoding and input validation in the code remain the primary defence against XSS.
