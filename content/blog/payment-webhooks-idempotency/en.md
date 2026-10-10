---
title: Handling Payment Webhooks Reliably: Idempotency and Retries
description: How to verify payment webhook signatures, make handlers idempotent, survive duplicate and out-of-order events, and reconcile order states.
summary: A reliable webhook handler verifies the signature, stores each event by its unique ID, changes order status only through allowed transitions and regularly reconciles with the provider API.
---
## The core rule

A payment provider **may send the same event several times, late or out of order**. This is expected: it retries whenever it doesn't receive a successful response. So your handler must be:

- **verified** — accept only requests with a valid signature;
- **idempotent** — processing the same event again changes nothing;
- **order-tolerant** — an old event never overwrites a newer status;
- **reconcilable** — order state can be checked against the provider API.

## Step 1. Verify the signature

Providers usually sign webhooks: an HMAC of the request body with a shared secret, passed in a header or parameter. Each provider has its own scheme (Stripe, Payme, Click and others document theirs), but the principles are shared:

- verify against the **raw request body**, before parsing JSON;
- compare signatures with a constant-time function;
- reject requests that are too old if the provider sends a timestamp;
- keep the secret in environment variables, not in code.

```ts
import crypto from "node:crypto";

export function isValidSignature(rawBody: string, signature: string, secret: string) {
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
```

## Step 2. Idempotency with an events table

Every event has a unique identifier. Store it in a table with a **unique key** before running business logic. If the insert fails as a duplicate, the event was already handled — respond with success.

```sql
CREATE TABLE payment_events (
  provider     text NOT NULL,
  event_id     text NOT NULL,
  payload      jsonb NOT NULL,
  processed_at timestamptz,
  PRIMARY KEY (provider, event_id)
);
```

Important: inserting the event and updating the order must happen **in one transaction**. Otherwise you can record the event, crash, and never update the order.

## Step 3. Respond fast, process in a queue

The provider waits for a response only for a limited time. A pattern that holds up under load:

1. Verify the signature.
2. Store the event.
3. Return a successful HTTP response immediately.
4. Process the event in a background queue with retries.

Don't send emails, call the CRM or generate documents synchronously in the handler — any slow operation causes a timeout and a retry.

## Step 4. Out-of-order events

"Payment succeeded" may arrive before "payment created", and "refund" before you processed the payment. The fix is an order **state machine** with explicit transitions:

| Current status | Allowed transitions |
|---|---|
| pending | paid, failed, cancelled |
| paid | refunded, partially_refunded |
| failed | paid (retry) |
| refunded | — |

If an event proposes a forbidden transition (for example from `refunded` back to `paid`), don't apply it — log it for review. You can also compare the provider's event time with the order's last update time.

## Step 5. Reconciliation and self-healing

A webhook may never arrive: a network failure, a bug on your side, a wrong URL after a deploy. That's why you need **reconciliation**:

- a scheduled job finds orders stuck in `pending` for too long;
- it requests the payment status from the provider API;
- mismatches are fixed automatically or sent to a manual review queue.

The webhook becomes the fast path for updates, not the only source of truth.

## Common mistakes

- Parsing JSON before verifying the signature, so the signature never matches.
- Returning an error for a duplicate — the provider keeps retrying.
- Trusting the amount in the webhook without comparing it to the order total.
- No logs of the raw request body, making incidents impossible to investigate.
- Testing only the happy path, without duplicates or reversed order.

## FAQ

### Which HTTP status should a duplicate webhook get?

A success status (usually 200). The event is already processed, and an error only makes the provider keep retrying. Check the exact response requirements in your provider's documentation.

### Can I skip the queue?

At small volume, yes — if processing is fast and transactional. Once emails, CRM or accounting integrations appear, a queue with retries noticeably reduces the risk of lost updates.

### How do I test duplicate handling?

Send the same event several times in a row and in parallel, then send events in reverse order. Order status and amounts must stay correct, and the events table must hold one row per ID.
