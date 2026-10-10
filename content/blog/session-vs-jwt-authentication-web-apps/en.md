---
title: "Session vs JWT: How to Implement Login in Web Apps"
description: Cookie sessions vs JWT compared: refresh token flow, where to store tokens, logout and revocation, plus a sensible default architecture for login.
summary: For a typical web app, server-side sessions in an httpOnly cookie are the safe default; JWT with refresh tokens makes sense for mobile clients, multiple services and external APIs.
---

## The short answer

- **Session**: after login, the server creates a record in a store (database, Redis) and gives the browser a random ID in a cookie. On each request, the server looks up the session by that ID.
- **JWT**: the server issues a signed token containing user data and an expiry. Verification uses the signature, with no store lookup.

If you have one website and your own backend, start with **sessions in an httpOnly cookie**. They are simpler, easy to revoke and harder to get wrong.

## Comparison

| | Cookie session | JWT |
|---|---|---|
| Where state lives | On the server | Inside the token |
| Request check | Store lookup | Signature check |
| Logout and revocation | Delete the record | Hard before expiry |
| Mobile apps | Possible, less convenient | Natural fit |
| Multiple services | Needs a shared store | Each verifies the signature |
| Room for mistakes | Lower | Higher: algorithms, expiry, storage |

## How the refresh flow works

The main issue with JWT is that it cannot be "switched off" before it expires. So a pair of tokens is used:

1. **Access token**: short-lived, sent with every request.
2. **Refresh token**: long-lived, stored securely and used only to obtain a new access token.
3. When the access token expires, the client calls `/auth/refresh` and receives a new pair.
4. **Rotation**: every refresh invalidates the old refresh token. If someone tries to reuse a spent refresh token, treat it as theft and revoke the whole chain.

Note that refresh tokens are stored on the server so they can be revoked. In other words, a JWT setup still ends up with server-side state.

## Where to store tokens in the browser

- **httpOnly, Secure cookie**: JavaScript cannot read it, so XSS cannot steal the token directly. You need CSRF protection: `SameSite=Lax` or `Strict` and, for state-changing requests, a CSRF token or Origin check.
- **localStorage**: readable by any script on the page. One XSS bug and the token is gone. Not recommended for long-lived tokens.
- **In-memory**: fine for a short access token, with the refresh token kept in an httpOnly cookie.

```http
Set-Cookie: sid=8f3c...; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=1209600
```

## Logout and revocation

- **Sessions**: delete the record, and the user is logged out on one device or all of them, as you choose.
- **JWT**: delete the refresh token on the server, and the access token lives out its short lifetime. For instant blocking you need a denylist or a per-user token version checked by the server.

Always revoke all sessions on password change, and give users a list of active devices.

## A recommended default architecture

1. Store passwords only as hashes with a slow algorithm (bcrypt, scrypt, Argon2).
2. Web client: server-side session, ID in an `HttpOnly; Secure; SameSite=Lax` cookie.
3. Issue a new session ID after login (protection against session fixation).
4. Rate-limit login attempts.
5. Mobile apps or external integrations: a short-lived access JWT plus a rotating refresh token stored server-side.
6. Check permissions on every request on the server, not just by hiding buttons in the UI.

If you do not want to build it all yourself, use a mature authentication library for your framework or an external identity provider.

## Common mistakes

- JWT in localStorage with no expiry.
- Sensitive data in the JWT payload: it is signed, not encrypted, so anyone can read it.
- Accepting tokens with `alg: none` or without strict algorithm checks.
- No way to log out "from all devices".

## FAQ

### Is JWT faster than sessions?

Signature verification needs no database call, but a session lookup in Redis is usually very fast too. For most projects the difference is negligible compared to reliability and simplicity.

### Can I store a JWT in a cookie?

Yes, and for browsers it is often the best option: an httpOnly cookie keeps the token away from scripts. Just remember CSRF protection.

### What should a React SPA with a separate API use?

If the API is on your domain or a subdomain, cookie sessions work well. JWT makes sense when the same API also serves mobile apps or third-party clients.
