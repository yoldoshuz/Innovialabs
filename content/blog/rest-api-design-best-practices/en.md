---
title: REST API Design Best Practices: Naming, Versioning, Errors
description: Concrete REST API rules for URL naming, pagination, filtering, versioning, a consistent error format and idempotency keys, with good vs bad examples.
summary: A good REST API is predictable: plural nouns in URLs, uniform pagination and filter rules, an explicit version, one error format across all endpoints and idempotency keys for operations that must not be repeated.
---
## The core principle: predictability

A good API is understandable without reading the docs for every endpoint. A developer sees two addresses and can already guess how the third one works. The rules below create that effect.

## URL naming

Rules:

- **Plural nouns**: `/products`, `/orders`.
- **No verbs**: the HTTP method defines the action.
- **kebab-case and lowercase**: `/delivery-zones`, not `/DeliveryZones`.
- **Nesting no deeper than one level**: `/orders/15/items` is fine, `/users/3/orders/15/items/2/reviews` is already heavy.

| Bad | Good |
|---|---|
| `GET /getAllProducts` | `GET /products` |
| `POST /createOrder` | `POST /orders` |
| `POST /deleteUser?id=3` | `DELETE /users/3` |
| `GET /Product_List` | `GET /products` |

For actions that do not fit CRUD, a sub-resource is acceptable: `POST /orders/15/cancel`. What matters is one style across the whole API.

## Pagination

Never return a whole collection: data grows, and one day the response becomes huge.

Two common approaches:

- **Offset**: `GET /products?limit=20&offset=40`. Simple and lets you jump to any page, but slows down on large tables and can "skip" records when new ones are inserted.
- **Cursor**: `GET /products?limit=20&cursor=eyJpZCI6NDJ9`. Stable for feeds and large volumes, but you cannot jump straight to page 10.

The response should include the data and what is needed for the next step:

```json
{
  "data": [{ "id": 41, "name": "Kettle" }],
  "pagination": { "nextCursor": "eyJpZCI6NDJ9", "hasMore": true }
}
```

Set a **maximum limit** on the server so a client cannot request a million records.

## Filtering and sorting

Use query parameters with clear names:

```text
GET /products?category=kitchen&minPrice=100000&sort=-createdAt
```

- Filters are plain parameters named after fields.
- Sorting is a single `sort` parameter; a minus means descending.
- Search is a separate parameter, for example `q`.
- Rejecting an unknown parameter with 400 is better than silently ignoring it.

## Versioning

An API used by external clients will sooner or later change in an incompatible way. A version lets you avoid breaking old clients.

- **In the URL**: `/v1/products` is the most visible and simplest option.
- **In a header**: `Accept: application/vnd.example.v2+json` keeps URLs clean but is harder to debug.

What counts as a breaking change: removing or renaming a field, changing a type, adding a new required request field. Adding a new optional response field usually does not need a new version. Announce deprecation of the old version in advance and give clients time to migrate.

## A consistent error format

All endpoints should return errors the same way. A convenient base is the **Problem Details** standard (RFC 9457):

```json
{
  "type": "https://api.example.com/errors/validation",
  "title": "Validation failed",
  "status": 422,
  "detail": "Field price must be greater than zero",
  "errors": [{ "field": "price", "message": "must be > 0" }]
}
```

Rules:

- Always the correct HTTP code, never 200 with an error inside.
- A machine-readable error type or code so the client can react to it.
- A clear message for the developer.
- No stack traces or SQL queries in the response.

## Idempotency keys

For operations that are dangerous to repeat, such as payments or order creation, the client sends a unique key:

```http
POST /payments
Idempotency-Key: 7f3c2a90-1b4e-4d2a-9c11-5e8f0a6b7d21
```

The server stores the result under that key. If the request arrives again, because of a timeout or a double click, the server returns the stored response instead of creating a second payment.

## Common mistakes

- **Mixed styles in one API**: `camelCase` in some responses, `snake_case` in others.
- **Dates in a local format.** Use ISO 8601 with a time zone.
- **Exposing internal ids and database fields as is.** An API is a contract, not a table dump.
- **No documentation.** An OpenAPI specification solves this and lets you generate clients.

## FAQ

### Should I choose offset or cursor pagination?

Offset suits admin panels and tables with page navigation. Cursor is more reliable for feeds, infinite scroll and large datasets.

### Do I need versioning if only my own frontend uses the API?

If frontend and backend ship together, a URL version may be unnecessary. For mobile apps that users update with a delay, versioning is close to mandatory.

### camelCase or snake_case in JSON?

Both work. What matters is choosing one and following it in every endpoint.
