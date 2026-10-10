---
title: Secure Cookie Settings: HttpOnly, Secure and SameSite
description: How to configure a session cookie: what HttpOnly, Secure and SameSite do, Lax vs Strict vs None, why __Host- prefixes matter and which mistakes break login.
summary: A session cookie should be HttpOnly, Secure, SameSite=Lax (or Strict), use the __Host- prefix and have a server-enforced lifetime. Together these flags block theft via XSS, leaks over HTTP and most CSRF.
---

## The short answer

For the session cookie of most web applications, this set works well:

```http
Set-Cookie: __Host-session=abc123; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=86400
```

Each attribute closes a specific threat, and dropping any of them opens a specific hole.

## What each flag does

| Flag | What it does | What it protects against |
|---|---|---|
| `HttpOnly` | cookie is not readable from JavaScript (`document.cookie`) | session theft via XSS |
| `Secure` | cookie is sent only over HTTPS | interception on open networks, accidental HTTP visits |
| `SameSite` | limits sending with cross-site requests | CSRF, some cross-site leaks |
| `Domain` | extends the cookie to subdomains | nothing (it widens the attack surface) |
| `Path` | limits the path | not a security boundary |
| `Max-Age` / `Expires` | lifetime in the browser | long-lived stolen sessions |

**HttpOnly** does not stop XSS itself: a malicious script can still send requests as the user. But it cannot carry the cookie away and reuse it from another device.

**Domain** is best left out entirely. Without it the cookie is host-only and is sent only to the exact domain that set it.

## Lax, Strict and None

- **Strict** — the cookie is never sent with cross-site requests, not even when clicking a link from email or a messenger. A user arriving via an external link appears logged out on the first page.
- **Lax** — the cookie is sent on normal top-level navigation (`GET`), but not with cross-site `POST`, `fetch`, `iframe` or image requests. A sensible default.
- **None** — the cookie is always sent. Needed for widgets inside third-party `iframe`s and some cross-domain setups. Must be paired with `Secure` or the browser rejects it.

If `SameSite` is not set, browsers differ: some apply `Lax` by default, some do not. Always set it explicitly.

A common compromise is two cookies: a `Strict` one for dangerous actions (password change, payments) and a `Lax` one for normal navigation.

## Cookie prefixes

The browser enforces name prefixes and refuses cookies that break their rules:

- **`__Secure-`** — the cookie must have `Secure` and be set from an HTTPS page.
- **`__Host-`** — the same, plus `Path=/` and **no** `Domain`. Such a cookie cannot be overwritten from a subdomain.

For sessions, `__Host-` is the best choice unless you need shared login across subdomains.

## Session lifetime

- A cookie without `Max-Age` or `Expires` is a session cookie, but browsers that restore tabs may keep it for days. Do not rely on "closed the browser, logged out".
- The real lifetime is enforced **on the server**: an idle timeout (session dies after inactivity) and an absolute timeout (even an active session ends).
- On login and privilege changes, **issue a new session ID** — this closes session fixation.
- On logout, destroy the session on the server, not just the cookie in the browser.
- Admin panels and financial sections deserve shorter lifetimes than a regular account area.

## Mistakes that break login or leak sessions

- **`Secure` on a local HTTP environment** with a custom hostname — the cookie is not stored and login silently fails. Use HTTPS locally or `localhost`.
- **`SameSite=None` without `Secure`** — the browser drops the cookie.
- **`SameSite=Strict` with OAuth or payment redirects**: the provider sends the user back via a cross-site request and session state is lost. Returns via `POST` break most often — they do not get the cookie even with `Lax`.
- **`Domain=.example.com`** without a reason — every subdomain sees the cookie, including staging and third-party services.
- Session tokens in `localStorage` — readable by any script on the page.
- Same cookie name on different subdomains or paths — the browser sends several values and the server picks the wrong one.
- Endless "remember me" tokens that are not revoked on password change.

Attribute reference: [MDN Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie).

## FAQ

### Can I store a JWT in a cookie?

Yes, and it is often safer than `localStorage`: with `HttpOnly`, scripts cannot read it. But then you need CSRF protection — `SameSite` plus a token or an `Origin` check.

### Why does a user appear logged out after following a link from a messenger?

Most likely the session cookie is set with `SameSite=Strict`. Use `Lax` for the main session and keep `Strict` for a separate cookie used only by dangerous actions.

### Why use Secure if the whole site is already on HTTPS?

A user can open an `http://` address before the redirect happens, and without `Secure` the cookie travels in plain text. The flag together with HSTS rules that out.
