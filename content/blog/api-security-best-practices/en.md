---
title: API Security Best Practices: A Developer Checklist
description: An API security checklist mapped to the OWASP API Top 10: authentication, object-level authorization, validation, rate limits, errors, CORS and logs.
summary: Secure an API by authenticating every request, checking on the server that the user may access each specific object and field, validating input against strict schemas, limiting request volume and logging security events.
---
## Short answer

Most serious API vulnerabilities are not exotic. The API simply trusts the client too much: it returns an object because the ID was valid, saves every field that came in the request body, or allows unlimited requests. The **OWASP API Security Top 10** collects these patterns. Use the checklist below during development and code review.

## The OWASP API Top 10 in one table

| Risk | What goes wrong | What to do |
|---|---|---|
| **API1 Broken Object Level Authorization** | User changes `/orders/123` to `/orders/124` and sees someone else's order | Check ownership of every object on the server |
| **API2 Broken Authentication** | Weak tokens, no brute force protection, tokens that never expire | Use proven libraries, short-lived tokens, rate-limit logins |
| **API3 Broken Object Property Level Authorization** | API returns too many fields or lets users set `role` or `balance` | Explicit response and input schemas |
| **API4 Unrestricted Resource Consumption** | No limits on requests, page size, file size | Rate limits, pagination caps, timeouts |
| **API5 Broken Function Level Authorization** | Regular user calls an admin endpoint | Role checks on every endpoint, deny by default |
| **API6 Unrestricted Access to Sensitive Business Flows** | Bots buy out stock or spam sign-ups | Business-level limits and bot protection |
| **API7 Server Side Request Forgery** | API fetches a user-supplied URL and reaches internal services | Allowlist destinations, block internal addresses |
| **API8 Security Misconfiguration** | Verbose errors, open CORS, missing TLS | Hardened defaults, reviewed configs |
| **API9 Improper Inventory Management** | Old `/v1` or test endpoints still live | Keep an inventory, retire old versions |
| **API10 Unsafe Consumption of APIs** | Blind trust in data from third-party APIs | Validate external data like user input |

## Authentication

- Every endpoint requires authentication unless it is **explicitly** public.
- Use standard mechanisms (OAuth 2.0 / OpenID Connect, sessions, well-configured JWT) and maintained libraries — do not invent your own token format.
- Access tokens are short-lived; refresh and revocation are thought through.
- Login, password reset and OTP endpoints have strict rate limits.
- API keys for server-to-server access are scoped, rotated and never shipped inside mobile or frontend code.

## Object-level authorization

This is the most common critical API flaw. The rule: **never load an object by ID alone** — always include who is asking.

```ts
app.get("/api/orders/:id", requireAuth, async (req, res) => {
  const order = await db.order.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  });
  if (!order) return res.status(404).json({ error: "Not found" });
  res.json(order);
});
```

Random UUIDs instead of sequential IDs make guessing harder, but they **do not replace** this check.

## Input validation and mass assignment

- Validate every request body, query and header against a **strict schema**: types, lengths, formats, allowed values.
- Reject unknown fields instead of silently saving them. Otherwise a user can send `"role": "admin"` with their profile update.
- Map input to the database explicitly; do not pass `req.body` straight into an ORM update.
- Response schemas list exactly which fields go out — do not serialize whole database records.

```ts
const UpdateProfile = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().max(20).optional(),
}).strict();

const data = UpdateProfile.parse(req.body);
```

## Rate limits and resource limits

- Limits per user, per API key and per IP, with stricter ones for expensive or sensitive endpoints.
- Maximum page size, request body size, upload size and query complexity (for GraphQL — depth and cost limits).
- Timeouts on database queries and outgoing requests.
- Return `429 Too Many Requests` so legitimate clients can back off.

## Error messages

- Clients get a short message and an error ID; details go to logs.
- No stack traces, SQL fragments or internal hostnames in responses.
- Do not reveal whether an email exists on login or password reset.
- Use the same response for "not found" and "not yours" to avoid confirming that an object exists.

## CORS

- Allow only the origins that actually need browser access, not `*` for authenticated APIs.
- Never reflect any incoming `Origin` together with `Access-Control-Allow-Credentials: true`.
- Remember: CORS controls **browsers only**. It does not protect the API from scripts, servers or curl.

## Logging and inventory

- Log authentication failures, authorization denials, validation errors and rate-limit hits with user ID and request ID.
- Never log passwords, tokens or full personal data.
- Set alerts for unusual patterns, such as one user requesting thousands of different object IDs.
- Keep an up-to-date list of API versions, environments and endpoints; shut down what is no longer used.

## FAQ

### Is an API key enough for authentication?

For server-to-server integrations with a trusted partner it can be, if the key is scoped, rotated and sent only over HTTPS. For end users, a key embedded in an app is not a secret — use user authentication instead.

### Does GraphQL need different protection?

The same principles apply, plus specific limits: query depth and cost, batching limits and authorization on every resolver, not only at the entry point. Consider disabling introspection in production if your API is not public.

### Is a gateway or WAF enough?

A gateway helps with authentication, rate limits and logging, but it cannot know whether order 124 belongs to this user. Object-level and field-level authorization must live in the application code.
