---
title: What Are Telegram Stars and How Payments for Digital Goods Work
description: Why Telegram requires Stars for digital goods, how users buy them, how developers withdraw revenue and where regular payment providers still apply in bots.
summary: Telegram Stars are Telegram's in-app currency, required for digital goods and services in bots and Mini Apps; physical goods and offline services are still paid through regular payment providers.
---
## The short answer

**Telegram Stars** are Telegram's in-app currency. Users buy Stars and spend them in bots and Mini Apps: on subscriptions, content access, features and in-game items.

The key rule: **digital goods and services** in bots and Mini Apps are sold **for Stars only**. Regular cards and payment providers are not used for them.

## Why Telegram introduced this rule

Apple and Google require digital purchases inside mobile apps to go through their built-in billing. Bots and Mini Apps run inside the Telegram app, so the same requirement applies to them.

Stars solve this: users buy Stars through a mechanism the app stores allow, and developers accept payment in Stars. That keeps Telegram within App Store and Google Play rules.

## What counts as a digital good

| Digital — Stars only | Physical and offline — regular providers |
|---|---|
| Subscription to private content | Goods with delivery |
| Premium bot features | Salon booking, table reservation |
| In-game currency and items | Tickets and real-world services |
| Generations in an AI bot | Paying an order in a cafe or store |
| Digital files, courses, templates | Repairs, delivery, taxi |

A simple test: if the buyer receives the result **only on a screen**, it is a digital good.

## How users buy Stars

- **Inside Telegram**: on mobile, through App Store or Google Play in-app purchases.
- **Through the official @PremiumBot**.
- **On Fragment** — with TON cryptocurrency.

When a bot shows a Stars invoice and the user is short, Telegram offers to top up the exact amount. The user does not need to set anything up.

## How to accept Stars

Technically this is the same Telegram Payments flow, with currency `XTR` and no payment provider:

```json
{
  "chat_id": 123456789,
  "title": "Pro access",
  "description": "Extended features for 30 days",
  "payload": "pro_30d_user_123456789",
  "currency": "XTR",
  "prices": [{"label": "Pro", "amount": 50}]
}
```

This object goes to `sendInvoice` (or `createInvoiceLink` for a link you can open from a Mini App). Then:

1. The user taps Pay — the bot receives a `pre_checkout_query`.
2. The bot checks the order and confirms it with `answerPreCheckoutQuery` within a few seconds.
3. After payment a message with `successful_payment` arrives — only now grant access.
4. Store the `telegram_payment_charge_id`: you need it for refunds via `refundStarPayment`.

Recurring **subscriptions** in Stars and paid media in channels are supported too.

## How developers get paid

- Stars accumulate on the **bot's balance**.
- They can be **withdrawn through Fragment** as TON — after a holding period Telegram applies to guard against refunds and fraud.
- Stars can also be **spent on advertising** in Telegram Ads.

Telegram may change withdrawal terms, fees and holding periods, so check the current rules in the documentation.

## Where regular payment providers still apply

For physical goods and offline services, classic **Telegram Payments** remain: you connect a provider in @BotFather, get a `provider_token` and issue invoices in regular currency. The list of available providers depends on the country. Another option is taking payment on your own website or in a Mini App through a payment gateway directly, as long as it is not a digital good.

## Common mistakes

- Selling digital access via a card or external link — this breaks platform rules.
- Granting access on `pre_checkout_query` instead of `successful_payment`.
- Not storing the payment ID and having no way to refund.
- Giving buyers no way to contact payment support — Telegram's rules require it.

## FAQ

### Can I accept Stars without my own server?

No. Invoices are issued by the bot, and the bot has to run somewhere to handle `pre_checkout_query` and `successful_payment`. Without that, payments cannot be confirmed.

### Can I refund Stars to a buyer?

Yes, the bot can refund with `refundStarPayment` as long as you stored the payment ID.

### Do I need to register a payment provider for Stars?

No. Stars need no provider: the currency is `XTR`, and `provider_token` is left empty or omitted.
