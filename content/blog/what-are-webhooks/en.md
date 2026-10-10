---
title: What Are Webhooks and How They Differ from APIs
description: A webhook is an HTTP request a service sends you when an event happens. Learn push vs pull, signature checks, retries and idempotency in practice.
summary: A webhook is a callback: an external service sends an HTTP request to your URL when something happens, instead of you repeatedly asking it through an API.
---

## Webhooks in plain words

With an **API**, you ask: "Are there any new payments?". With a **webhook**, the service tells you: "A payment arrived, here is the data".

Technically, a webhook is a regular HTTP request (usually a `POST` with JSON) that an external system sends to a URL you registered in advance, at the moment an event occurs. You do not poll the service; you wait for a notification.

## Push vs pull

| | Pull (polling an API) | Push (webhook) |
|---|---|---|
| Who starts it | Your application | The external service |
| Delay | Depends on polling frequency | Almost right after the event |
| Load | Many empty requests | A request only when something happens |
| What you need | An API client | A public HTTPS endpoint |

In practice they are combined: the webhook tells you that something happened, and you call the API for details.

## Where webhooks are used

- **Payment providers**: a payment succeeded, was cancelled or refunded. The store updates the order status without a manager.
- **CRM systems**: a deal was created or moved to another stage, and the data flows to a messenger, warehouse or analytics.
- **Telegram bots**: in webhook mode, Telegram pushes every new message to your server.
- **Git hosting**: a push to the repository triggers a build and deployment.

## How to receive webhooks correctly

### 1. Verify authenticity

Your endpoint is public, so anyone can send a request to it. Providers usually sign the request body with a secret key (often HMAC), and you verify the signature.

```js
import crypto from "node:crypto";

function isValid(rawBody, signature, secret) {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
```

The signature is computed over the **raw request body**, not the parsed JSON. Check the exact algorithm and header in your provider's documentation.

### 2. Respond fast

The provider waits for a response only for a limited time. The right pattern: verify the signature, store the event, return `200` immediately and hand heavy processing to a queue.

### 3. Expect retries

If your server did not respond or returned an error, most services resend the webhook. The same event can therefore arrive several times.

### 4. Make processing idempotent

**Idempotency** means processing the same event again does not change the result. Events usually carry a unique ID: store it and skip events you have already handled.

- An order must not be marked as paid twice.
- A customer must not get two identical emails.
- Stock must not be deducted twice.

### 5. Do not rely on order

Events can arrive in a different order than they happened. Compare by timestamp or object version, and when in doubt, fetch the current state through the API.

## Common mistakes

- No signature check, so anyone can "confirm" a payment.
- Slow processing inside the request, so the provider treats delivery as failed and retries.
- No duplicate protection, leading to double charges and notifications.
- No log of incoming events, so failures are impossible to investigate.
- An endpoint without HTTPS.

## FAQ

### Can I use only an API and skip webhooks?

Yes, by polling the service periodically. But polling adds delay and extra requests, and with API rate limits it can become a problem. For real-time events, webhooks are more convenient.

### How do I test webhooks locally?

Use the provider's test mode and a tunnel that gives your local server a temporary public address. Many services also let you resend an event manually from their dashboard.

### What if a webhook never arrives?

Rely on the provider's retries and keep a backup reconciliation job that periodically checks statuses through the API in case something was missed.
