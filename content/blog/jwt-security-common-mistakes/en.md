---
title: JWT Security: Common Mistakes and How to Avoid Them
description: Common JWT security mistakes: alg none, algorithm confusion, weak secrets, tokens in localStorage, no expiry or revocation, refresh token rotation, sessions.
summary: JWT is safe only when the server pins the algorithm, uses a strong key, checks expiry, issuer and audience, keeps access tokens short-lived with rotated refresh tokens, and stores them out of reach of JavaScript.
---
## Short answer

A **JSON Web Token** is a signed piece of JSON: `header.payload.signature`. The signature proves the token was issued by you and not changed. That is all. The payload is only Base64URL-encoded, **not encrypted**, and a valid signature says nothing about whether the user has logged out or been blocked.

Most JWT vulnerabilities come from trusting the token header, weak keys and missing lifecycle management. Here are the common mistakes and fixes.

## Mistake 1: "alg: none" and algorithm confusion

The token header contains `alg` — the algorithm used to sign it. If the server reads the algorithm **from the token**, an attacker controls it:

- **alg none** — the attacker removes the signature and sets `"alg": "none"`. A careless library accepts an unsigned token.
- **Algorithm confusion** — the server expects RS256 (private key signs, public key verifies). The attacker switches to HS256 and signs the token with your **public key** used as an HMAC secret. If the library uses the same key for both, the forged token passes.

**Fix**: pin the allowed algorithms on the server and verify issuer and audience.

```ts
import { jwtVerify } from "jose";

const { payload } = await jwtVerify(token, publicKey, {
  algorithms: ["RS256"],
  issuer: "https://auth.example.com",
  audience: "api",
});
```

Use a maintained library and never decode a token without verifying it when making access decisions.

## Mistake 2: weak secrets

With HS256, anyone who has one token can try to guess the secret **offline**, without touching your server. `secret`, `changeme` or a project name will be found quickly.

- Use a long random key, for example 256 bits generated with `openssl rand -base64 32`.
- Keep it in a secrets manager or environment variables, not in the repository.
- Use different keys for different environments.
- If several services need to verify tokens, prefer asymmetric algorithms (RS256, ES256, EdDSA): only the auth service holds the private key.
- Plan **key rotation** with a `kid` header and a JWKS endpoint.

## Mistake 3: sensitive data in the payload

Anyone can decode the payload. Do not put passwords, passport numbers, full addresses or internal secrets in it. Keep only what the API needs: user ID, roles, expiry. If data must be hidden, use encrypted tokens (JWE) or keep the data on the server.

## Mistake 4: storing tokens in localStorage

Anything in `localStorage` is readable by any JavaScript on the page. One **XSS** vulnerability or a compromised third-party script — and tokens are stolen and used from another device.

Safer options:

- Store tokens in an **HttpOnly, Secure, SameSite** cookie, which JavaScript cannot read. Then add CSRF protection for state-changing requests.
- Keep the access token in memory only and get it again through a refresh flow on page load.
- For SPAs, consider the **Backend-for-Frontend** pattern: the browser holds a session cookie, and the BFF holds the tokens.

None of these cures XSS — a script running on your page can still make requests as the user. But it stops simple theft of long-lived tokens.

## Mistake 5: no expiry and no revocation

A token without `exp` is valid forever. A token with a long lifetime cannot be withdrawn after logout, password change or account blocking.

- Always set `exp` and check `exp`, `nbf`, `iss` and `aud`.
- Keep **access tokens short-lived** — minutes rather than days.
- For instant revocation, use a denylist by `jti`, a per-user token version stored in the database, or check critical actions against the server state.

## Mistake 6: refresh tokens without rotation

A refresh token lives long, so it is the most valuable target.

- **Rotate on every use**: each refresh returns a new refresh token and invalidates the old one.
- **Detect reuse**: if an already used refresh token arrives, someone has a copy — revoke the whole token family and require login.
- Store refresh tokens on the server as hashes, tied to a device or session, so users can see and end sessions.
- Never send a refresh token to every API, only to the auth endpoint.

## When sessions are better

JWT shines when several independent services must verify identity without a shared database. For many products classic **server sessions** are simpler and safer:

- One web application on one domain.
- You need instant logout and "end all sessions" buttons.
- Admin panels and internal tools.

A random session ID in an HttpOnly cookie, stored server-side, avoids most of the mistakes above by design.

## FAQ

### Is a JWT encrypted?

A regular signed JWT (JWS) is not. Anyone can read its payload. Encryption requires JWE, which is used much less often and adds complexity.

### How long should an access token live?

It depends on how quickly you need permission changes and logouts to take effect and how often clients can refresh. A common practice is minutes, with refresh tokens handling longer sessions.

### Can I log out a user with JWT?

Deleting the token on the client is not enough — a copy stays valid until it expires. Real logout requires revoking the refresh token on the server and, if needed, a denylist or token version check for access tokens.
