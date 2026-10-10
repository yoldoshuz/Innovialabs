---
title: How to Integrate Payme Into a Website: Developer Guide
description: Integrating the Payme Merchant API: cashbox registration, JSON-RPC methods, transaction states, the sandbox, request handling and the most common integration errors.
summary: Payme calls your server over JSON-RPC: you implement six Merchant API methods, check authorization and the amount in tiyin, store transactions with states 1, 2, -1 and -2, and pass every sandbox scenario before switching to the live key.
---
## The short answer

Payme integration works "in reverse": your site does not poll Payme — **Payme calls your endpoint** to ask whether a payment can be accepted, create a transaction, perform it and cancel it if needed. You need to:

1. Register as a merchant and create a cashbox.
2. Implement the **Merchant API** methods on your server.
3. Send the customer to the Payme checkout page with the order reference.
4. Pass the sandbox tests and switch to the live key.

## Merchant registration

- Register your business in the Payme Business dashboard and sign the agreement.
- Create a **cashbox** for the site. You get a cashbox ID (merchant ID), a **test key** and a **live key**.
- In the cashbox settings, set your endpoint URL and the account field Payme uses to find an order, for example `order_id`.

Keep keys in environment variables, never in the repository.

## How Payme calls your server

Every call is a JSON-RPC 2.0 POST request with an `Authorization: Basic ...` header that encodes `Paycom:<cashbox key>`. Always respond with HTTP 200 and put any error in the response body.

```ts
function isPaymeAuthorized(header: string | null, key: string): boolean {
  if (!header?.startsWith("Basic ")) return false;
  const decoded = Buffer.from(header.slice(6), "base64").toString();
  const sep = decoded.indexOf(":");
  return decoded.slice(0, sep) === "Paycom" && decoded.slice(sep + 1) === key;
}
```

On failed authorization, return error `-32504`.

## Merchant API methods

| Method | What your server does |
|---|---|
| `CheckPerformTransaction` | Checks the order exists, is unpaid and the amount matches |
| `CreateTransaction` | Creates a transaction in state 1, or returns the existing one with the same `id` |
| `PerformTransaction` | Performs it: state 2, order is paid |
| `CancelTransaction` | Cancels it: state -1 or -2 |
| `CheckTransaction` | Returns the current state and event times |
| `GetStatement` | Returns transactions for a period, for reconciliation |

Amounts arrive **in tiyin**, times in milliseconds.

## Transaction states

- **1** — created, waiting to be performed.
- **2** — performed, money charged, the order can be fulfilled.
- **-1** — cancelled before being performed.
- **-2** — cancelled after being performed (refund).

Store in your table: the Payme transaction ID, order ID, amount, state, `create_time`, `perform_time`, `cancel_time` and the cancellation reason. Every method response is built from these fields.

## Key handling rules

- **Idempotency.** A repeated `CreateTransaction` or `PerformTransaction` with the same `id` must return the same result, not create a new record.
- **One order, one active transaction.** If an order already has a transaction in state 1, reject a new one with a different `id` using an error from the account range.
- **Timeout.** A transaction not performed within the time set in the documentation gets cancelled, and `PerformTransaction` on it returns an error.
- **Cancelling after performing** is allowed only if your business process permits a refund. If the goods can no longer be returned, respond with the "cannot cancel" error.
- **Fiscal data.** If your cashbox requires fiscalization, pass receipt items with IKPU codes in the documented format.

## Checkout link

The customer is sent to the Payme checkout page. The link encodes the cashbox ID, the account field and the amount in tiyin, plus an optional return URL. Note: the customer returning to your site **does not confirm payment**. The order becomes "paid" only in `PerformTransaction`.

## Testing in the sandbox

Payme provides a sandbox where you enter your endpoint URL and test key and run scenarios: wrong authorization, nonexistent order, wrong amount, create, perform, cancel before and after performing, repeated calls. Switch to the live key only once every scenario passes.

The full specification is in the [Payme developer documentation](https://developer.help.paycom.uz/).

## Typical integration errors

- Amount in sum instead of tiyin: the amount check fails on every order.
- Responding with HTTP 401 or 500 instead of HTTP 200 with an error object.
- Creating a new record on a repeated `CreateTransaction` instead of returning the existing one.
- Marking the order paid on `CreateTransaction` instead of `PerformTransaction`.
- Time in seconds instead of milliseconds.
- The test key left in production after launch.

## FAQ

### Can I check payment status without a callback from Payme?

In the Merchant API model, Payme's calls to your server are the source of truth. For reconciliation, use your own transaction table and the `GetStatement` method, which Payme also calls on your side.

### What if Payme calls a method for an already cancelled order?

Respond based on the state stored in your database: for `CheckTransaction`, return the current state; for `PerformTransaction` on a cancelled transaction, return the "operation not possible" error.

### Do I need a separate endpoint for each method?

No. All methods arrive at one URL, and you pick the handler by the `method` field in the request body.
