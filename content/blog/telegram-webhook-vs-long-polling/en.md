---
title: Webhook vs Long Polling for Telegram Bots: Which to Use
description: Webhook vs long polling for Telegram bots: setup, hosting requirements, latency and reliability compared, plus simple rules for when each method fits best.
summary: Long polling is simpler: the bot pulls updates itself and needs no domain or SSL, which suits development and small bots; a webhook needs an HTTPS endpoint but fits production, scaling and serverless better.
---
## The short answer

Telegram delivers events (**updates**) to a bot in two ways, and only one can be active at a time.

- **Long polling** — the bot asks Telegram via `getUpdates`: "anything new?" The request stays open until an event appears or a timeout passes, then the bot immediately sends the next one.
- **Webhook** — you give Telegram your HTTPS address once via `setWebhook`, and from then on Telegram POSTs every update to it.

Put simply: with polling the bot makes the call, with a webhook it waits for the call.

## Comparison

| | Long polling | Webhook |
|---|---|---|
| Setup | Run the script and it works | Needs a domain, HTTPS and a `setWebhook` call |
| Hosting | Any machine with internet access, even behind NAT | A public address reachable from the internet |
| SSL certificate | Not needed | Required (self-signed works if you upload it to Telegram) |
| Ports | Any | Only 443, 80, 88 or 8443 |
| Latency | Near-instant | Near-instant |
| Always-on process | Required, the bot holds a connection | Optional, works with serverless |
| Multiple bot instances | No: a second `getUpdates` gets a 409 error | Yes, behind a load balancer |
| Local debugging | Easy | Needs a tunnel or a test server |

In practice there is almost no speed difference: with long polling the response returns as soon as an event appears.

## How reliability works

**Long polling.** If the bot crashes, updates pile up on Telegram's side and are fetched after a restart. They are kept only for a limited time, so long downtime means lost events. Pass the `offset` correctly, or updates will be delivered again.

**Webhook.** If your server returns an error or does not respond, Telegram retries, but gives up after a number of failed attempts. You can see the state in `getWebhookInfo`: the count of pending updates and the last error message.

Two rules for webhooks:

- **respond fast** — return 200 right away and push heavy work to a queue;
- **verify the sender** — pass a `secret_token` to `setWebhook`, and Telegram will send it in the `X-Telegram-Bot-Api-Secret-Token` header. Reject requests without it.

## Setting up a webhook

```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -d "url=https://example.com/telegram/webhook" \
  -d "secret_token=long_random_string" \
  -d "drop_pending_updates=true"
```

Check the state:

```bash
curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"
```

To return to polling, call `deleteWebhook`: while a webhook is set, `getUpdates` returns an error.

## When to choose which

**Long polling fits when:**

- you develop and test the bot locally;
- the bot is small and runs as a single instance;
- the server has no public address or domain;
- you want the simplest possible launch.

**A webhook fits when:**

- the bot is in production and you already have a domain with HTTPS;
- you need several bot instances under load;
- the bot runs on a serverless platform or alongside a web app;
- you would rather not keep an always-on process.

A common setup: polling locally, webhook on the server. Libraries like aiogram support both modes, and switching usually takes a few lines.

## Common mistakes

- Running two polling instances — they "steal" updates from each other and hit 409 errors.
- Doing long processing before answering the webhook — Telegram treats it as a failure and resends the update.
- Skipping `secret_token` and accepting requests from anyone.
- Moving servers without updating the webhook address.

## FAQ

### Which method is faster?

Users will not notice a difference. Both deliver an update almost right after the event; the choice depends on infrastructure, not speed.

### Can I use both at once?

No. While a webhook is set, `getUpdates` does not work. Delete the webhook first to switch to polling.

### Is polling fine for production?

Yes, if the bot runs as a single instance on a stable server. Many bots live like that for years. A webhook becomes necessary when you need scaling or serverless.
