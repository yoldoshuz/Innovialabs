---
title: How to Integrate Click Payments Into a Website
description: How the Click Prepare and Complete flow works, how to verify signatures, test the integration and keep order statuses consistent with payments.
summary: Click calls your server twice — Prepare (validate and reserve the order) and Complete (confirm the payment); your job is to verify the signature, amount and order status and respond idempotently.
---

## The short answer: how Click payments work

For online stores Click uses the **Shop API** flow: the customer goes to the Click payment page, and Click calls your server with two requests.

1. **Prepare** (`action=0`) — Click asks: "Does this order exist, is the amount right, can it be paid?" You check and reply with error code `0` (OK) or a rejection code.
2. **Complete** (`action=1`) — Click reports the result of the charge. If the payment went through, you mark the order as paid. If Click passes an error, you release the reservation.

To start you need a contract with Click and merchant credentials: `service_id`, `merchant_id`, `merchant_user_id` and a **secret key**. You set the Prepare and Complete URLs in the merchant dashboard.

## What the requests contain

Click sends a POST request with form parameters. The key fields:

- `click_trans_id` — transaction ID on Click's side;
- `service_id` — your service;
- `merchant_trans_id` — the order ID in your system (what you passed when creating the payment link);
- `amount` — the amount;
- `action` — 0 for Prepare, 1 for Complete;
- `error`, `error_note` — status on Click's side (important in Complete);
- `sign_time`, `sign_string` — timestamp and signature;
- `merchant_prepare_id` — Complete only: the ID you returned in Prepare.

The response is JSON with `click_trans_id`, `merchant_trans_id`, `merchant_prepare_id` (or `merchant_confirm_id`), `error` and `error_note`.

## Verifying the signature

The signature is an MD5 hash of concatenated fields plus the secret key. The field order is defined in Click's official documentation; for Complete, `merchant_prepare_id` is added to the string. Check the formula against the current docs before going live.

```ts
import { createHash } from "crypto";

function checkSign(p: Record<string, string>, secret: string) {
  const base =
    p.click_trans_id + p.service_id + secret + p.merchant_trans_id +
    (p.action === "1" ? p.merchant_prepare_id : "") +
    p.amount + p.action + p.sign_time;
  const md5 = createHash("md5").update(base).digest("hex");
  return md5 === p.sign_string;
}
```

If the signature does not match, immediately return the signature error code and change nothing in the database.

## Prepare and Complete logic

**In Prepare, check:**

- the signature;
- that the order with `merchant_trans_id` exists;
- that `amount` matches the order total (compare as numbers, not strings);
- that the order is not already paid or cancelled.

Then create a transaction record with status "prepared" and return its ID as `merchant_prepare_id`.

**In Complete, check:**

- the signature and that `merchant_prepare_id` exists;
- the `error` field: if it is negative, Click is reporting a cancellation — mark the transaction as cancelled;
- if `error = 0`, mark the order as paid in **one database transaction** together with the payment record update.

## Keeping order statuses consistent

- **Idempotency.** Click may retry a request. If Complete for this transaction was already processed, return the same response — not an error and not a second credit.
- **Locking.** Update the order with `SELECT ... FOR UPDATE` or an equivalent so two concurrent requests cannot pay the order twice.
- **One payment per order.** If the order is already paid by another method, respond with the matching error code.
- **Fixed amount.** Do not change the order total after Prepare, or Complete will arrive with a mismatch.
- **Logs.** Store every incoming request and your response: this is your main tool for disputed payments.

## Testing

1. Expose the endpoints on a public HTTPS address (a tunnel works for local development).
2. Run the scenarios: successful payment, wrong amount, missing order, repeated Complete, cancellation from Click.
3. Confirm that an invalid signature leaves the database untouched.
4. Make one real payment for a minimal amount before launch.

## Common mistakes

- Checking the signature with the wrong field order.
- Comparing `amount` as strings: `"1000"` and `"1000.00"` are not equal.
- Marking the order as paid already in Prepare.
- Replying with an HTTP error instead of JSON with a code — Click expects a structured response.

## FAQ

### Do I need a separate server for the Click integration?

No. Two HTTPS endpoints in your backend that are reachable from the internet are enough. What matters is a reliable database and request logging.

### What if Complete never arrives?

Keep the order in "awaiting payment" and reconcile payments in the merchant dashboard. Never mark an order as paid just because the user returned to your site.

### Can I accept Click and Payme at the same time?

Yes. Use a shared payments table with a "provider" field and one set of rules for changing order status, so the two methods never conflict.
