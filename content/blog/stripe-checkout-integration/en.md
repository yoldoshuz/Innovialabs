---
title: How to Integrate Stripe Into an Online Store
description: Compare Stripe Checkout, Payment Element and Payment Links, then set up PaymentIntents, webhooks, refunds and test mode for an international store.
summary: For most stores Stripe Checkout, a hosted payment page, is the simplest choice; Payment Element is for payments inside your own design, and order status should only change on a webhook.
---

## The short answer: which option to choose

Stripe offers three main ways to accept payments. The choice depends on how much control you need over the interface.

| Option | What it is | When it fits |
|---|---|---|
| **Payment Links** | A no-code payment link | A few products, sales via social media and messengers |
| **Checkout** | Stripe-hosted payment page created via API | Most online stores |
| **Payment Element** | Embeddable form in your own design | You need full control of the payment UX |

**Checkout** is a sensible start: Stripe shows suitable payment methods, handles 3D Secure and localization. Payment Element gives more flexibility but needs more code and testing.

Important: Stripe only works for companies registered in supported countries. Check this before development starts.

## How Checkout works

1. The customer clicks "Pay".
2. Your server creates a **Checkout Session** with items, currency and return URLs.
3. The customer goes to the Stripe page and pays.
4. Stripe sends the `checkout.session.completed` webhook, and you mark the order as paid.

```ts
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const session = await stripe.checkout.sessions.create({
  mode: "payment",
  line_items: [{ price: "price_123", quantity: 1 }],
  metadata: { orderId: "A-1042" },
  success_url: "https://shop.example/thanks?session_id={CHECKOUT_SESSION_ID}",
  cancel_url: "https://shop.example/cart",
});
// redirect the customer to session.url
```

Pass the order ID in `metadata` so the webhook maps to the order unambiguously.

## Payment Element and PaymentIntent

With an embedded form the central object is the **PaymentIntent**. It holds the amount, currency and payment status.

- The server creates a PaymentIntent and returns its `client_secret` to the frontend.
- The frontend mounts Payment Element and confirms the payment.
- If the bank requires 3D Secure, Stripe shows the challenge itself.
- The final status arrives via the `payment_intent.succeeded` or `payment_intent.payment_failed` webhook.

Always calculate the amount **on the server** from the order data, never take it from the frontend.

## Webhooks: the single source of truth

A "Thank you" page is not proof of payment: the user may close the tab first. The order changes status only on a webhook.

```ts
const event = stripe.webhooks.constructEvent(
  rawBody,                       // raw request body, not parsed JSON
  req.headers["stripe-signature"],
  process.env.STRIPE_WEBHOOK_SECRET!
);
if (event.type === "checkout.session.completed") {
  // mark order as paid if not already
}
```

Rules:

- verify the signature against the **raw body** of the request;
- process events **idempotently** — Stripe may deliver the same event again;
- respond `2xx` quickly and move heavy work to a queue;
- store the IDs of processed events.

## Refunds

A refund is created via the API or in the Dashboard against a PaymentIntent. It can be full or partial. Listen for the refund event and update the order to "refunded" or "partially refunded". Keep in mind that money does not reach the customer instantly — timing depends on their bank.

## Test mode

- Use test keys — they are fully isolated from live ones.
- Test card `4242 4242 4242 4242` with any future date and any CVC gives a successful payment; the docs list cards for declines and 3D Secure.
- **Stripe CLI** forwards webhooks to your local server: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.
- Before launch check: success, decline, 3D Secure, a repeated webhook, a refund.

## Common mistakes

- Order status changes on the redirect to the success page.
- The request body is parsed as JSON before signature verification, so the signature fails.
- The amount comes from the frontend and can be tampered with.
- Test and live keys are mixed up between environments.

## FAQ

### Which is better to start with: Checkout or Payment Element?

Checkout. It is faster to build and covers most scenarios. Teams move to Payment Element when payment must live inside their own interface.

### Do I need PCI certification with Stripe?

Stripe handles the card data, so your requirements are much lighter. You still need to complete a compliance self-assessment — Stripe indicates which form applies.

### How do I support multiple currencies?

Set the currency when creating the session or PaymentIntent and store prices per currency. The available payment methods depend on the currency and the customer's country.
