---
title: How to Accept Payments in a Telegram Bot via Payme and Click
description: Two ways to take Payme and Click payments in a Telegram bot: the native Telegram invoice or a redirect link, plus pre-checkout checks and order confirmation.
summary: Either connect Payme or Click as a payment provider in BotFather and send invoices right in the chat, or send a payment link and confirm the order from the gateway callback; in both cases an order counts as paid only after server-side confirmation.
---
## The short answer

There are two ways to accept payments in a bot through Uzbek payment gateways:

- **Native Telegram invoice.** You connect Payme or Click as a payment provider in BotFather, the bot sends an invoice, and the customer pays without leaving the chat.
- **Payment link (redirect).** The bot creates an order on your side, builds a link to the Payme or Click payment page and waits for the gateway to call your server back.

One important restriction: **digital goods and services inside Telegram** (subscriptions, content access, in-game items) must be sold for Telegram Stars under Telegram's rules. Payme and Click fit physical goods, delivery, service bookings and other offline scenarios.

## Comparing the two approaches

| Criterion | Telegram invoice | Payment link |
|---|---|---|
| Where the customer pays | Inside Telegram | On the gateway's page |
| What you connect | A provider in BotFather | A merchant account and the gateway API |
| Who confirms payment | Telegram sends `successful_payment` | The gateway calls your server |
| Flexibility | Limited to the invoice format | Full control over logic and receipts |
| Effort | Lower | Higher: you need a callback endpoint |

The invoice is smoother for customers and faster to launch. Redirect makes sense when payments already work on your website, when the site and the bot should share one order flow, or when the invoice format does not fit.

## Option 1: invoice via a provider

1. In BotFather, open your bot, go to **Payments**, choose Payme or Click and complete the setup. Start in test mode.
2. Get the **provider token** and keep it in environment variables, not in code.
3. Send the invoice with `sendInvoice`. The amount goes **in the smallest currency unit**: for `UZS` that means tiyin, so multiply the sum amount by 100.
4. Answer the `pre_checkout_query`. This is your last chance to decline: out of stock, price changed, order cancelled. Answer quickly, or Telegram cancels the payment.
5. Wait for the message with `successful_payment` and only then mark the order as paid.

A minimal aiogram 3 example:

```python
from aiogram import Bot, F, Router
from aiogram.types import LabeledPrice, Message, PreCheckoutQuery

router = Router()

@router.message(F.text == "/buy")
async def buy(message: Message, bot: Bot):
    await bot.send_invoice(
        chat_id=message.chat.id,
        title="Order #1024",
        description="Delivery within Tashkent",
        payload="order:1024",
        provider_token=PROVIDER_TOKEN,
        currency="UZS",
        prices=[LabeledPrice(label="Item", amount=15000000)],  # 150,000 UZS
    )

@router.pre_checkout_query()
async def pre_checkout(query: PreCheckoutQuery):
    ok = await order_is_valid(query.invoice_payload, query.total_amount)
    await query.answer(ok=ok, error_message=None if ok else "This order is no longer available")

@router.message(F.successful_payment)
async def paid(message: Message):
    sp = message.successful_payment
    await mark_paid(sp.invoice_payload, sp.provider_payment_charge_id)
```

Put your database order ID in `payload`, not product details: you will use it to find the order at every later step.

## Option 2: payment link

1. The bot creates an order in your database with the status "awaiting payment".
2. The server builds a payment page link with the order ID and amount following the gateway's rules and sends it as a button.
3. The customer pays on the Payme or Click side.
4. The gateway calls your server: **Payme** uses its Merchant API with methods such as `CheckPerformTransaction`, `CreateTransaction` and `PerformTransaction`, while **Click** sends Prepare and Complete requests.
5. The server verifies the request signature or authorization, the amount and the order status, then the bot tells the customer the payment went through.

Watch the amount units: gateways differ (tiyin or sum), so check their documentation.

## Confirming the order: what to check

- **Amount and currency** in the confirmation match the order in your database.
- **Idempotency**: a repeated callback or message never creates a second payment. Store the transaction ID and check it.
- **Order status** changes only on the server. A customer's "I paid" button is not proof of payment.
- **Cancellations and refunds** are handled: Payme has a dedicated method for cancelling a transaction.
- **Manager notification** goes out after confirmation, not after the customer taps "Pay".

## Common mistakes

- Passing sums instead of tiyin to `sendInvoice`, so the customer sees an invoice a hundred times smaller.
- Slow logic in the `pre_checkout_query` handler, causing payments to time out.
- Selling digital access via Payme or Click inside Telegram, which breaks platform rules.
- A test token in production, or a live token committed to the repository.

More detail is in the [Telegram payments documentation](https://core.telegram.org/bots/payments).

## FAQ

### Do I need a contract with Payme or Click to use Telegram invoices?

Yes. Connecting a provider in BotFather links the bot to your merchant account, so the legal paperwork and business verification happen with the payment gateway itself.

### Can I use both methods at once?

Yes. For example, invoices for quick purchases in the chat and links for orders that can also be placed on the website. Just make sure both paths write to the same orders table.

### Why can't I treat an order as paid after answering pre_checkout_query?

Because it is only a check before the charge. The money may still not be captured, so only `successful_payment` or the gateway callback confirms the payment.
