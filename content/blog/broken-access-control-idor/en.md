---
title: Broken Access Control and IDOR: Finding and Fixing Them
description: How changing an ID in a URL exposes other users’ data, why broken access control tops the OWASP Top 10, and how to build server-side checks and tests.
summary: IDOR happens when a server returns an object by ID without checking that it belongs to the current user. Fix it with server-side authorization on every request, queries scoped to the owner and automated tests proving user B cannot see user A's data.
---

## What IDOR is

**Broken Access Control** is the umbrella term for bugs that let a user do something they have no right to do. **IDOR (Insecure Direct Object Reference)** is its most common form: the server looks up an object by an identifier from the request and returns it without checking whose it is.

The classic example. A user opens their invoice:

```
GET /api/invoices/1042
```

They change the number to `1041` and see someone else's invoice with a name, address and amount. No hacking involved: a regular browser and one digit.

The same works for updates and deletes (`PUT /api/orders/77`), file downloads (`/files/report-883.pdf`), parameters in the request body (`"user_id": 15`) and hidden form fields.

## Why it is the top OWASP risk

Broken access control holds first place (A01) in the OWASP Top 10. The reasons are practical:

- **The framework will not do it for you.** Authentication is one line of config, but the rule "an invoice is visible only to its owner and the company accountant" lives only in your code.
- **The check must be repeated in every endpoint.** Forgetting it once — say, in a CSV export — is enough.
- **Scanners rarely find it:** they do not know which data belongs to whom.
- **The frontend creates a false sense of safety:** there is no "Delete" button in the UI, but the API still accepts the request.

## Types of access control failures

| Type | Example |
|---|---|
| Horizontal escalation | a customer reads another customer's orders |
| Vertical escalation | a regular user calls `/admin/users` |
| Multi-tenancy | an employee of company A sees company B's data |
| Mass assignment | the request body includes `"role": "admin"` and the server saves it |
| Method gaps | `GET` is checked, but `DELETE` on the same resource is not |

## How to fix it

### Scope queries to the owner

Do not "find by ID, then check". Look up only within what the user is allowed to see:

```js
// Bad: returns any invoice
const invoice = await db.invoice.findUnique({ where: { id } });

// Good: search only among the current user's invoices
const invoice = await db.invoice.findFirst({
  where: { id, ownerId: session.userId },
});
if (!invoice) return res.status(404).end();
```

In multi-tenant systems apply the same rule with `tenantId` in **every** query. In PostgreSQL you can add **Row-Level Security** as a safety net at the database level.

### Centralize the rules

Access rules should not be scattered across controllers. Put them in one place — policies, middleware, functions like `can(user, "edit", invoice)`. They become easier to read, review and test.

### Deny by default

A new endpoint without an explicit rule should be closed, not open. Take roles and permissions from the server-side session, not from request parameters or a JWT whose signature you did not verify.

### Do not confuse hiding with protection

- **UUIDs instead of numeric IDs** make guessing harder but do not replace the check: IDs leak through links, emails and logs.
- A missing button in the UI protects nothing.
- Allow only an explicit list of writable fields to close mass assignment.

Returning `404` instead of `403` for other users' objects is a common practice: the attacker does not learn whether the object exists.

## How to find and test it

1. **Two users, one scenario.** Create A and B, perform actions as A, then replay the requests with B's session. Every successful response is a finding.
2. **An access matrix.** A table of "role × endpoint × method" with the expected result. It also becomes the basis for tests.
3. **Automated denial tests.** For each resource, a test that another user gets `404` or `403` on read, update and delete.
4. **Code review.** Look for database queries by ID without an owner or tenant condition.
5. **Logging denials.** A spike of `403`/`404` from one account is a sign of enumeration.

```js
it("user B cannot read user A's invoice", async () => {
  const invoice = await createInvoice(userA);
  const res = await api.as(userB).get(`/api/invoices/${invoice.id}`);
  expect(res.status).toBe(404);
});
```

Detailed guidance: [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

## FAQ

### Do UUIDs prevent IDOR?

Only partly. A UUID is hard to guess, but it can leak through links, emails, logs or another endpoint. A server-side permission check is still mandatory.

### Is a role check in middleware enough?

No. A role answers "can this user work with invoices at all", while IDOR is about a specific object. You need a check that this particular invoice belongs to the user or their company.

### Should I return 403 or 404 for someone else's object?

Usually `404`, so you do not confirm that the object exists. `403` fits when the user knows about the object but lacks the right to a specific action.
