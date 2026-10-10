---
title: What Is CSRF and How to Protect Your Web Application
description: CSRF explained: how a forged form acts on behalf of a logged-in user, and which defenses work — tokens, double-submit cookies, Origin checks and SameSite.
summary: CSRF is an attack where another site makes a user's browser send a request to your app along with their cookies. Defend with a CSRF token or Origin check on every state-changing request, and use SameSite cookies as an extra layer.
---

## What CSRF is

**CSRF (Cross-Site Request Forgery)** is an attack where someone tricks a logged-in user's browser into sending a request to your application. The browser automatically attaches the session cookie, so the server treats the action as legitimate: an email gets changed, money is transferred, data is deleted.

The key detail: the attacker **never sees the response** and never steals the cookie. They only need the request to go through.

## A forged form example

Say a bank has an email change form that sends `POST /account/email`. The attacker hosts this page on their own site:

```html
<form action="https://bank.example/account/email" method="POST" id="f">
  <input type="hidden" name="email" value="attacker@evil.example">
</form>
<script>document.getElementById('f').submit();</script>
```

A user who is logged in to the bank opens the page and the form submits itself. If the server only checks the cookie, the email changes, and the attacker then resets the password to their own address.

Anything that changes state and relies on cookies alone is vulnerable: forms, `GET` links with side effects, APIs without their own check.

## How to defend against it

### CSRF token (synchronizer token)

The server generates a random, unpredictable token, ties it to the session and embeds it in every form. On `POST`, `PUT`, `PATCH` and `DELETE` the server compares the token from the body or header with the stored one.

A foreign site cannot read your page (the Same-Origin Policy forbids it), so it cannot know the token. This is the classic and most reliable option, and most frameworks (Django, Laravel, Rails, Spring Security) ship it by default.

### Double-submit cookie

Useful when you have no server-side session store. The token is set in a cookie and also sent in a header or form field; the server checks that both values match. Important: the token should be **signed** (HMAC) and bound to the session, otherwise an attacker who can write cookies from a subdomain can bypass it.

### Origin and Referer checks

Browsers add an `Origin` header to cross-site and `POST` requests. The server can reject state-changing requests whose `Origin` is not on your list of domains. If `Origin` is missing, fall back to `Referer`. Modern browsers also send `Sec-Fetch-Site`, which makes it easy to tell `same-origin` from `cross-site`.

This is a good extra layer and a simple option for APIs, but treat requests without these headers strictly — reject them.

### SameSite cookies

The `SameSite` attribute tells the browser whether to send a cookie with cross-site requests:

| Value | Behavior | CSRF protection |
|---|---|---|
| `Strict` | never sent with cross-site requests | strong |
| `Lax` | sent only on top-level navigation (`GET` links) | blocks cross-site `POST` forms |
| `None` | always sent (requires `Secure`) | none |

## When SameSite alone is enough

`SameSite=Lax` or `Strict` closes most scenarios, but rely on it alone only when all of these hold:

- **every** state-changing action uses `POST`/`PUT`/`DELETE`, never `GET`;
- no subdomain is controlled by someone else: SameSite treats the whole site (`*.example.com`) as "same", not just your exact origin;
- cookies set `SameSite` explicitly instead of relying on browser defaults;
- your users run browsers that support the attribute.

If any of these fails, add tokens or an Origin check. For banking, admin panels and payments, the right choice is **token plus SameSite**.

## Common mistakes

- Changing data via `GET` (`/delete?id=5`) — such links work even with `SameSite=Lax`.
- Validating the token only when it is present: a missing token must mean rejection.
- One token for all users, or a token in the URL that leaks through logs and `Referer`.
- Expecting CORS to protect you — CORS controls who can read responses, not who can send requests.
- Protecting forms but forgetting a JSON API that also accepts `text/plain` or `application/x-www-form-urlencoded`.

For a deeper breakdown, see the [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).

## FAQ

### Do I need CSRF protection if my API uses a token in the Authorization header?

If the token lives in JavaScript and is added to the header manually, the browser does not attach it automatically, so classic CSRF does not apply. The risk comes back as soon as authentication moves into cookies.

### Does HTTPS protect against CSRF?

No. HTTPS encrypts traffic, but the forged request is sent by the user's own browser over the same secure channel.

### How is CSRF different from XSS?

With XSS, foreign code runs inside your site and can read the page, including the CSRF token. That is why XSS defeats most CSRF defenses, and you need to close both.
