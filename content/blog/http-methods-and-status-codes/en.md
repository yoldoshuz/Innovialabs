---
title: HTTP Methods and Status Codes Every Developer Should Know
description: GET, POST, PUT, PATCH and DELETE, idempotency and the key 2xx, 3xx, 4xx and 5xx codes: which method to use and which code to return when.
summary: The method says what to do with a resource and the status code says how it ended; GET, PUT and DELETE are idempotent, POST is not, and client errors (4xx) must be clearly separated from server errors (5xx).
---
## The point in two sentences

An **HTTP method** describes the client's intent: read, create, update or delete. A **status code** reports the result. When both are chosen correctly, clients, proxies, caches and monitoring understand what happened without reading the response body.

## The five main methods

| Method | Purpose | Safe | Idempotent |
|---|---|---|---|
| GET | Retrieve a resource | Yes | Yes |
| POST | Create a resource or trigger an action | No | No |
| PUT | Replace a resource entirely | No | Yes |
| PATCH | Update part of a resource | No | Not guaranteed |
| DELETE | Delete a resource | No | Yes |

- A **safe** method changes nothing on the server. Never use GET to delete or modify data: crawlers and browsers may call it on their own.
- **PUT** expects the full resource. Fields you did not send are treated as removed or reset.
- **PATCH** sends only the changes, for example a new product price.

## Idempotency in plain words

A method is **idempotent** if repeating the same request gives the same final result as the first one.

- `DELETE /orders/7` twice: the order is deleted, the state is the same.
- `PUT /products/42` with the same body twice: the product ends up in the same state.
- `POST /orders` twice: two orders.

This matters when the network fails: if no response arrived, an idempotent request can be safely retried. Retrying POST is risky, for example a double charge. The fix is an **idempotency key**: the client sends a unique header, and the server will not perform the same operation twice.

## 2xx codes: success

- **200 OK** — the request succeeded, the body contains data.
- **201 Created** — a resource was created. Good practice is to return it with a `Location` header pointing to it.
- **202 Accepted** — the request was accepted and will be processed later (for example, report generation).
- **204 No Content** — success with no body. Common for DELETE.

## 3xx codes: redirection

- **301 Moved Permanently** — the address changed for good. Important for SEO when pages move.
- **302 Found** — a temporary redirect.
- **304 Not Modified** — the client's cached copy is current, data is not sent again.
- **307 / 308** — temporary and permanent redirects that keep the method and request body.

## 4xx codes: client-side errors

- **400 Bad Request** — malformed request: broken JSON, wrong format.
- **401 Unauthorized** — the client is not authenticated: no token or it has expired.
- **403 Forbidden** — the client is known but lacks permissions.
- **404 Not Found** — the resource does not exist.
- **405 Method Not Allowed** — the method is not supported for this address.
- **409 Conflict** — a state conflict: the email is already taken, the version is outdated.
- **422 Unprocessable Content** — the syntax is fine, but the data failed validation.
- **429 Too Many Requests** — the rate limit was exceeded.

## 5xx codes: server-side errors

- **500 Internal Server Error** — an unexpected error in the code.
- **502 Bad Gateway** — a proxy got an invalid response from the upstream server.
- **503 Service Unavailable** — the service is temporarily down: overload or maintenance.
- **504 Gateway Timeout** — the upstream server did not respond in time.

Rule: if the client can fix the request itself, it is 4xx. If the server is at fault, it is 5xx. Monitoring usually alerts on a rise in 5xx.

## Common mistakes

- **Returning 200 with `"error": true` in the body.** Clients, caches and monitoring treat the request as successful.
- **Confusing 401 and 403.** 401 means "who are you?", 403 means "we know who you are, but no".
- **Returning 500 for invalid input.** A validation error is 400 or 422, not a server failure.
- **Changing data via GET.** A link like `/delete?id=5` can fire from browser prefetching.

## FAQ

### When should I use PUT and when PATCH?

PUT when the client sends the whole resource and wants to replace it. PATCH when one or a few fields change. In practice PATCH is more common.

### Which code should I return if a resource exists but must stay hidden?

Many APIs return 404 instead of 403 so they do not reveal that the resource exists. It is an acceptable practice for private data.

### Where can I find the full list of codes?

In the MDN HTTP reference and the HTTP specification, which describe every standard code and its exact meaning.
