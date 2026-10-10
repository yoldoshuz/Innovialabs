---
title: "CORS Explained: Why the Error Happens and How to Fix It"
description: Why the browser blocks requests to another domain, how preflight and CORS headers work, and how to configure the server correctly without unsafe hacks.
summary: A CORS error comes from the browser, not the server, and it is fixed on the server, which must explicitly allow your origin with the right headers instead of disabling protection.
---

## Why the CORS error happens

Browsers follow the **same-origin policy**: JavaScript on a page can freely read responses only from its own **origin**, the combination of protocol, domain and port. `https://site.com` and `https://api.site.com` are different origins, and so are `http://localhost:3000` and `http://localhost:8080`.

**CORS** (Cross-Origin Resource Sharing) is how a server tells the browser: "This origin may read my responses". If the required header is missing, the browser blocks the response and logs an error.

Important: the request often **does reach the server** and runs. The browser just does not hand the result to your code. That is why Postman and curl work: they have no CORS.

## Simple requests and preflight

Some requests are sent right away: `GET`, `HEAD` or `POST` with "simple" headers and types such as `application/x-www-form-urlencoded`.

For everything else, such as `PUT`, `DELETE`, a `POST` with `Content-Type: application/json` or an `Authorization` header, the browser first sends a **preflight**: an `OPTIONS` request asking for permission.

```http
OPTIONS /orders HTTP/1.1
Origin: https://site.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: content-type, authorization
```

The server must reply with a successful status and permissive headers. Only then is the actual request sent.

## Which headers you need

| Header | Purpose |
|---|---|
| `Access-Control-Allow-Origin` | Which origin may read the response |
| `Access-Control-Allow-Methods` | Allowed methods (for preflight) |
| `Access-Control-Allow-Headers` | Allowed request headers |
| `Access-Control-Allow-Credentials` | Whether cookies may be sent |
| `Access-Control-Max-Age` | How long to cache the preflight response |
| `Vary: Origin` | So caches do not serve one origin's response to another |

## The correct fix

Configure the server with an **allowlist** of origins. An Express example:

```js
import express from "express";
import cors from "cors";

const app = express();
const allowed = ["https://site.com", "https://admin.site.com"];

app.use(cors({
  origin: (origin, cb) => cb(null, !origin || allowed.includes(origin)),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
```

If CORS is handled in nginx, make sure `OPTIONS` requests get a response with the headers instead of reaching an app that returns 404 or 401.

## Cookies and credentials

For the browser to send cookies to another origin, both sides must agree:

- on the client, `fetch(url, { credentials: "include" })`;
- on the server, `Access-Control-Allow-Credentials: true` and a **specific** origin in `Access-Control-Allow-Origin`.

The browser rejects `*` combined with credentials. Cookies for cross-site requests also need `SameSite=None; Secure`.

## Unsafe "solutions"

- **Reflecting any Origin** together with credentials. Any website could then send requests on behalf of a logged-in user.
- **`*` for a private API**. Acceptable only for public data without authentication.
- **Browser extensions and flags** that disable CORS. It works only for you; your users still see the error.
- **Third-party public proxies**. Your data passes through someone else's server.

A good alternative is a **single origin**: serve the frontend and API from one domain via a reverse proxy or your bundler's dev proxy. Then you do not need CORS at all.

## How to diagnose

1. Open the Network tab and find the `OPTIONS` request.
2. Check its status: it must be successful, not 404, 401 or 500.
3. Compare the request `Origin` with `Access-Control-Allow-Origin`: they must match exactly, including protocol and port.
4. Check whether headers disappear on errors: many servers skip CORS headers on 4xx and 5xx responses, so the real error looks like a CORS one.

## FAQ

### Why does it work in Postman but not in the browser?

CORS is a browser rule. Postman and server-side requests do not enforce it, so they see the response while the browser hides it from the script.

### Can I fix CORS on the frontend only?

No. Permission comes from the server. On the frontend you can only remove the need for CORS by proxying requests through your own origin.

### Does CORS protect my API from attacks?

No, it is not an authorization mechanism. It limits reading responses in the browser but does not stop requests from other programs. Your API still needs authentication and permission checks.
