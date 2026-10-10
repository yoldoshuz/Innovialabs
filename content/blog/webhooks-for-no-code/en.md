---
title: What Is a Webhook and How to Use It in No-Code Tools
description: Webhooks in plain terms: how they differ from polling, how to catch them in Zapier, Make and n8n, what a payload looks like, and how to test and secure the URL.
summary: A webhook is an address that an app sends data to the moment something happens, instead of you repeatedly asking it whether anything is new; in no-code you get that address from Zapier, Make or n8n and paste it into the source app's settings.
---
## Webhooks in plain terms

A **webhook** is an HTTP request an app sends to your address when something happens: a form is submitted, an order is paid, a deal changes status.

Compare two approaches:

- **Polling** — every few minutes you ask the app, "Any new leads?" Most of the time the answer is no, and the reaction is delayed.
- **Webhook** — the app tells you, "Here is a new lead." The reaction is near-instant and there are no wasted checks.

| | Polling | Webhook |
|---|---|---|
| Who starts it | Your automation | The source app |
| Speed | Delayed by the interval | Almost immediate |
| Empty requests | Many | None |
| What you need | API access | A public URL to receive data |

## What a payload looks like

A webhook usually arrives as a **POST request** with a JSON body, called the **payload**:

```json
{
  "event": "form.submitted",
  "created_at": "2026-05-12T09:30:00Z",
  "data": {
    "name": "Alisher",
    "phone": "+998901234567",
    "source": "landing"
  }
}
```

**Headers** matter too: they often carry the event type, a signature or a token for verifying the sender. Look up the exact payload structure in each app's webhook documentation.

## Catching a webhook in Zapier, Make and n8n

**Zapier**

1. Create a Zap with the **Webhooks by Zapier** trigger → *Catch Hook*.
2. Copy the URL it gives you into the source app's settings.
3. Send a test event and click *Test trigger* — Zapier shows the fields it received.

Webhooks by Zapier is not available on every plan.

**Make**

1. Add a **Webhooks** → *Custom webhook* module and create a new webhook.
2. Copy its address into the source app.
3. Send a test event and Make detects the data structure automatically. If the fields change later, use *Redetermine data structure*.

**n8n**

1. Add a **Webhook** node and choose the method (usually POST).
2. The node has two addresses: the **Test URL** works while you have clicked *Listen for test event*, and the **Production URL** works once the workflow is activated.
3. A common mistake is leaving the test address in the source app. Swap it for the production one after activation.

## How to test

- **Start with a real event** from the app: hand-made test data may have a different structure.
- If the app is not ready yet, send a request yourself with Postman or `curl`:

```bash
curl -X POST "https://example.com/webhook/abc123" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","phone":"+998900000000"}'
```

- Check **edge cases**: empty fields, long text, non-Latin characters.
- See how the app handles failures: many **resend** a webhook if they do not get a success response. That means one event can arrive twice, so build in a duplicate check.

## How to secure a webhook URL

A webhook URL is effectively an open door: anyone who knows it can send data to it.

- **Do not expose the address** in frontend code, screenshots or public documents.
- **Check a secret.** Many apps let you set a token that arrives in a header. The n8n Webhook node has built-in authentication (Header, Basic, JWT); in Zapier and Make you can check it with a filter on the header or a field.
- **Verify the signature (HMAC)** if the app sends one: it proves the request came from that app and was not altered.
- **Drop junk:** discard requests missing required fields.
- **Rotate the address** if it leaks, and update it in the source app.

## FAQ

### Do I need a server to receive webhooks?

No. Zapier, Make and n8n Cloud give you a ready public address. You only need your own server if you self-host n8n or a custom handler.

### Why is my webhook not firing?

Most often the source app has the wrong or the test address, the workflow is not turned on, or the app expects a fast success response and marks delivery as failed. Check the delivery log in the source app — many apps keep one.

### Can a no-code tool send a webhook?

Yes. All three platforms can send HTTP requests: the Webhooks by Zapier action in Zapier, the HTTP module in Make and the HTTP Request node in n8n.
