---
title: How to Connect the WhatsApp Cloud API: Templates and Webhooks
description: Connect the WhatsApp Cloud API step by step: Meta app setup, phone number verification, templates and approval, the 24-hour window, webhooks and pricing logic.
summary: Create a Meta app, add and verify your number, get a permanent token, get templates approved and set up a webhook; you can message customers first only with templates, and free-form messages work for 24 hours after their message.
---
## Short answer

The WhatsApp Cloud API is Meta's official API hosted on Meta's servers, so you don't run any WhatsApp server yourself. Connecting it takes six steps:

1. a Meta for Developers app with the WhatsApp product;
2. verification of your own number;
3. a permanent system user token;
4. message templates and their approval;
5. a webhook for incoming messages and statuses;
6. understanding the 24-hour window and pricing.

## Step 1. The Meta app

- Sign up at Meta for Developers and create a business-type app.
- Add the **WhatsApp** product and connect your company's business portfolio (formerly Business Manager).
- The API setup page gives you a **test number** and a temporary token. Add your phone as a recipient and send the first test message.

The temporary token expires quickly. For production, create a **system user** in business settings, give it access to the app and the WhatsApp account, and generate a permanent token with the `whatsapp_business_messaging` and `whatsapp_business_management` permissions. Keep the token on the server only.

## Step 2. Your own number

- The number must receive an SMS or call with a verification code.
- A number already used in the WhatsApp app usually has to be freed first. Check the documentation for the current connection options.
- The **display name** is reviewed and must match your brand.
- **Business verification** raises the limits on how many customers you can message first.

Note the **Phone Number ID** and **WABA ID** — every request needs them.

## Step 3. Message templates

A template is pre-approved text a business can use to start a conversation. Categories:

| Category | Used for |
|---|---|
| Marketing | promotions, new products, abandoned cart reminders |
| Utility | order status, bookings, invoices, account changes |
| Authentication | one-time login codes |

A template has a header (text or media), a body with variables `{{1}}`, `{{2}}`, a footer and buttons. Every language is a separate version of the template. Review is usually fast; statuses are approved, rejected or paused.

Common rejection reasons: marketing copy filed under Utility, a variable at the very start or end of the text, missing sample values for variables, vague meaning.

Sending an approved template:

```bash
curl -X POST "https://graph.facebook.com/<API_VERSION>/<PHONE_NUMBER_ID>/messages" \
  -H "Authorization: Bearer $WA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "998901234567",
    "type": "template",
    "template": {
      "name": "order_ready",
      "language": { "code": "en" },
      "components": [
        { "type": "body", "parameters": [ { "type": "text", "text": "1024" } ] }
      ]
    }
  }'
```

## Step 4. The 24-hour window

When a customer messages you, a **24-hour customer service window** opens. Inside it you can send anything: text, media, buttons, lists. Every new customer message extends the window. Outside it, only approved templates can be sent.

In practice: reply fast, and turn reminders and notifications that go outside the window into templates in advance.

## Step 5. Webhooks

A webhook is an HTTPS address on your server where Meta sends incoming messages and delivery statuses. First, Meta verifies the address with a GET request:

```js
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  if (mode === "subscribe" && token === process.env.WA_VERIFY_TOKEN) {
    return res.status(200).send(req.query["hub.challenge"]);
  }
  res.sendStatus(403);
});
```

After that, events arrive as POST requests. Subscribe to the `messages` field in the webhook settings. Key points:

- verify the **X-Hub-Signature-256** header — an HMAC-SHA256 of the request body with your app secret;
- respond `200` immediately and move processing to a queue;
- **deduplicate** events by message ID: Meta resends them after failures;
- track the `sent`, `delivered`, `read` and `failed` statuses — `failed` includes an error code.

## Step 6. How pricing works

Meta used to bill per **24-hour conversation** by category. Since mid-2025 the model has changed: you pay for **delivered template messages**, and the rate depends on the template category and the recipient's country. Replies inside the customer service window are free, and so are utility templates sent inside an open window. Meta updates these rules from time to time, so check the official pricing page before budgeting.

What drives the cost: the share of marketing templates, your customers' countries, how often you send, and whether you manage to reply inside the window. Details are in the [Cloud API documentation](https://developers.facebook.com/docs/whatsapp/cloud-api).

## FAQ

### Can I message a customer first?

Yes, but only with an approved template and only to people who agreed to receive WhatsApp messages from you.

### Do I need a provider (BSP)?

No, the Cloud API is available directly. Providers help if you need a ready inbox for operators, a bot builder or support, but they are optional.

### Why wasn't my message delivered?

Look for the `failed` status and its error code in the webhook. Common causes: free-form text sent outside the 24-hour window, a paused template, a number without WhatsApp, or a hit limit.
