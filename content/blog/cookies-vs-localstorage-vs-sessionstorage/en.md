---
title: Cookies vs localStorage vs sessionStorage: Where to Store Data
description: Comparing cookies, localStorage and sessionStorage: lifetime, size limits, server access, security flags and what must never be stored in the browser.
summary: Cookies travel to the server with every request and suit sessions with HttpOnly and Secure flags; localStorage keeps non-secret settings long-term, sessionStorage until the tab closes.
---

## The short answer

- **Cookies** are for data the server needs, above all the session identifier. Protect them with the `HttpOnly`, `Secure` and `SameSite` flags.
- **localStorage** is for non-secret data that should survive closing the browser: theme, language, a form draft.
- **sessionStorage** is for temporary state of a single tab: a wizard step, filters for the current session.

Secrets — passwords, payment data, long-lived tokens — never go into localStorage or sessionStorage.

## Comparison

| | Cookies | localStorage | sessionStorage |
|---|---|---|---|
| Lifetime | until `Expires`/`Max-Age` or end of browser session | until removed | while the tab is open |
| Size | about 4 KB per cookie | usually several MB per origin | usually several MB per origin |
| Sent to server | automatically with every request | no | no |
| JS access | yes, unless `HttpOnly` | yes | yes |
| Scope | domain and path | origin | origin + specific tab |
| API | `document.cookie`, `Set-Cookie` header | synchronous `getItem`/`setItem` | synchronous `getItem`/`setItem` |

Exact Web Storage limits depend on the browser, so do not design right up to them.

## Cookies: when the server needs the data

A cookie is set by the server via a header or by a script via `document.cookie`. The browser attaches it to matching requests automatically.

```http
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400
```

What the flags mean:

- **HttpOnly** — the cookie is not accessible from JavaScript. If a malicious script is injected into the site (XSS), it cannot read it.
- **Secure** — sent only over HTTPS.
- **SameSite** — limits sending on cross-site requests and reduces **CSRF** risk. `Lax` is a sensible default, `Strict` is stricter, and `None` requires `Secure` and is meant for third-party scenarios.
- **Max-Age / Expires** — lifetime. Without them, the cookie lasts until the browser closes.

The downside of cookies is that they add weight to every request. Do not store large data in them.

## localStorage: long-lived non-secret data

```js
localStorage.setItem("theme", "dark");
const theme = localStorage.getItem("theme"); // "dark"
```

It stores only strings, so objects are serialized with `JSON.stringify` and parsed with `JSON.parse`. Data is shared across all tabs of the same origin, and the `storage` event lets you sync tabs.

Keep in mind:

- The API is **synchronous** — large writes can make the interface stutter.
- In private mode or with storage blocked, access may throw, so wrap calls in `try/catch`.
- Any script on the page, including third-party ones, can read localStorage.

## sessionStorage: state of a single tab

Same API, but data lives only in the current tab. A reload keeps it; closing the tab clears it. Two tabs of the same site cannot see each other's sessionStorage.

It suits multi-step forms, temporary filters and scroll position in a list.

## What must never be stored on the client

- **Passwords** — in any form.
- **Bank card data** and other payment details.
- **Long-lived access tokens and refresh tokens** in localStorage/sessionStorage: XSS will steal them. An `HttpOnly` cookie is safer for sessions.
- **API keys with server privileges** — anything that reaches the browser can be seen by the user.
- **Personal data** the interface can do without.
- **Permissions and roles as the source of truth.** The client can tamper with them; checks always belong on the server.

## How to choose

1. Does the server need it on every request? — **cookie**.
2. Is it secret? — only an **HttpOnly cookie**, or keep it on the server entirely.
3. Must it survive closing the browser? — **localStorage**.
4. Needed only in this tab? — **sessionStorage**.
5. Lots of structured data or files? — **IndexedDB**.

## Common mistakes

- Storing a JWT in localStorage "because the tutorial did".
- Cookies without `Secure` and `SameSite` in production.
- Reading localStorage without `try/catch` and without a default value.
- Keeping large objects in cookies that bloat every request.

Flag details are in the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies).

## FAQ

### Can I store a JWT in localStorage?

Technically yes, but an XSS vulnerability will expose the token. For sessions, an HttpOnly cookie with `Secure` and `SameSite`, plus CSRF protection, is safer.

### Can the server see localStorage?

No. localStorage and sessionStorage exist only in the browser. For the server to get a value, you have to send it explicitly in a request.

### How is sessionStorage different from a cookie without an expiry?

A session cookie lasts until the browser closes, is shared across all tabs and is sent to the server. sessionStorage is tied to one tab and is never sent to the server.
