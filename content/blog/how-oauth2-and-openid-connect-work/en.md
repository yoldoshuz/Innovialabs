---
title: How OAuth 2.0 and OpenID Connect Work
description: A plain explanation of OAuth 2.0 and OpenID Connect: roles, the authorization code flow with PKCE, access vs ID tokens, scopes and Google sign-in.
summary: OAuth 2.0 gives an app limited access to an API without sharing the user's password, and OpenID Connect adds an ID token on top that tells the app who actually signed in.
---
## The short answer

**OAuth 2.0** is an **authorization** protocol. It answers "what is this app allowed to do on the user's behalf?" The user never hands their password to the app; instead the app receives an **access token** with limited rights.

**OpenID Connect (OIDC)** is a layer on top of OAuth 2.0 for **authentication**. It answers "who is this user?" To do that, OIDC adds an **ID token** — a signed statement about the sign-in.

A "Sign in with Google" button is almost always OIDC.

## The four roles

- **Resource owner** — the user who owns the data.
- **Client** — your application: a website, mobile app or bot.
- **Authorization server** — the server that verifies the user and issues tokens (for example, Google).
- **Resource server** — the API you want to call (for example, the Google Calendar API).

Sometimes one company runs both servers, but logically they are separate roles.

## Authorization code flow with PKCE

This is the main recommended flow for server-rendered sites, SPAs and mobile apps. **PKCE** (Proof Key for Code Exchange) protects against an intercepted authorization code.

1. The app generates a random **code_verifier** and derives a **code_challenge** from it: SHA-256, base64url-encoded.
2. The user is redirected to the authorization server with `client_id`, `redirect_uri`, `scope`, `state` and `code_challenge`.
3. The user signs in and approves the requested access.
4. The server sends the user back to `redirect_uri` with a one-time **code** and the same `state`.
5. The app posts the code together with the `code_verifier` to the token endpoint.
6. The server checks that the verifier matches the challenge and issues tokens.

```http
GET /authorize?response_type=code
  &client_id=my-app
  &redirect_uri=https://app.example.com/callback
  &scope=openid%20email%20profile
  &state=af0ifjsldkj
  &code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM
  &code_challenge_method=S256
```

Even if an attacker grabs the code in step 4, they cannot exchange it without the `code_verifier`. The **state** parameter protects against forged responses (CSRF): the app compares it with the value it stored before the redirect.

The old **implicit flow**, where the token arrived directly in the URL, is no longer recommended. Use the code flow with PKCE.

## Access token vs ID token

| | Access token | ID token |
|---|---|---|
| Audience | The API (resource server) | Your application |
| Purpose | Access resources | Learn who signed in |
| Format | Anything, may be an opaque string | Always a JWT |
| Validation | Done by the API | Signature, `iss`, `aud`, `exp`, `nonce` |

The key rule: **do not treat an access token as proof of login**, and do not send an ID token to APIs as a pass. They are different documents for different recipients.

There is also the **refresh token** — a long-lived token used to get new access tokens without signing in again. Keep it on the server or in the device's secure storage only.

## Scopes

A **scope** is a requested permission. OIDC requires the `openid` scope, usually together with `email` and `profile`. API access uses separate scopes, such as read-only calendar access.

Ask for the **minimum**. The longer the list, the more users abandon the consent screen, and the more damage a leaked token can do.

## Example: Sign in with Google

1. You register the app in the Google console, get a `client_id` and list the allowed `redirect_uri` values.
2. The "Sign in with Google" button sends the user to Google with the scope `openid email profile`.
3. After sign-in, Google returns a code, and your server exchanges it for an ID token and an access token.
4. You validate the ID token and read `sub` — the user's stable identifier at Google — plus the email.
5. You find or create the user in your database by `sub` and start a normal session.

If the app also needs the user's calendar, you add the matching scope. That part is OAuth authorization, not just sign-in.

## Common mistakes

- Identifying users by email instead of `sub`: emails can change.
- Skipping signature and `aud` checks on the ID token.
- Shipping a `client_secret` inside a mobile app or frontend bundle.
- Allowing arbitrary or wildcard `redirect_uri` values.
- Implementing the protocol by hand instead of using a well-tested library.

## FAQ

### What is the difference between OAuth and OpenID Connect?

OAuth 2.0 handles access to resources but does not say who the user is. OpenID Connect adds a standard ID token and a user info endpoint, which makes it suitable for sign-in.

### Do I need PKCE if my app has a backend?

Yes. It is recommended for all clients, including confidential server-side ones. It does not replace the `client_secret`; it adds protection to the code exchange.

### Where should a browser app keep tokens?

The safest option is to keep tokens on the server and give the browser a session cookie with the HttpOnly, Secure and SameSite flags. Tokens in localStorage are readable by any XSS on the page.
