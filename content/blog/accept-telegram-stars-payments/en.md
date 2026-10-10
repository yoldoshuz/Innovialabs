---
title: How to Accept Telegram Stars in a Bot or Mini App
description: A practical guide to Telegram Stars: XTR invoices, handling pre_checkout_query and successful_payment, issuing refunds and delivering digital goods reliably.
summary: The bot issues an invoice in XTR with no payment provider, approves the pre_checkout_query and delivers the goods only after successful_payment, storing telegram_payment_charge_id for idempotency and refunds via refundStarPayment.
---
## The short answer

**Telegram Stars** are Telegram's in-app currency that bots and Mini Apps use to sell digital goods and services. The flow:

1. The bot creates an invoice in the **`XTR`** currency. No payment provider is involved, and `provider_token` stays empty.
2. The user confirms, the bot receives a **`pre_checkout_query`** and answers yes or no.
3. Once the charge goes through, a message with **`successful_payment`** arrives. Only then do you deliver the goods.
4. If needed, you refund with **`refundStarPayment`**.

## When Stars are required

Under Telegram's rules, digital goods and services consumed inside Telegram are sold for Stars: content subscriptions, premium bot features, in-game items, access to materials. Physical goods and offline services are still paid through regular payment providers.

## Invoice in a bot

The price is a single line item: for `XTR`, `prices` must contain exactly one element, and the amount is in whole Stars.

```python
from aiogram import Bot, F, Router
from aiogram.types import LabeledPrice, Message, PreCheckoutQuery

router = Router()

@router.message(F.text == "/premium")
async def sell(message: Message):
    order_id = await create_order(message.from_user.id, product="premium_30d")
    await message.answer_invoice(
        title="Premium for 30 days",
        description="Extended bot features",
        payload=f"order:{order_id}",
        currency="XTR",
        prices=[LabeledPrice(label="Premium", amount=100)],
    )

@router.pre_checkout_query()
async def pre_checkout(query: PreCheckoutQuery):
    ok = await order_is_open(query.invoice_payload)
    await query.answer(ok=ok, error_message=None if ok else "This order is no longer available")

@router.message(F.successful_payment)
async def paid(message: Message):
    sp = message.successful_payment
    await deliver_once(
        payload=sp.invoice_payload,
        charge_id=sp.telegram_payment_charge_id,
        user_id=message.from_user.id,
    )
```

## Payments in a Mini App

In a Mini App, the invoice opens without sending a chat message:

1. Your server calls **`createInvoiceLink`** with the same parameters (`currency="XTR"`, one price, `payload` with the order ID) and returns the link to the frontend.
2. The frontend calls `Telegram.WebApp.openInvoice(url, callback)`.
3. The callback receives a status: `paid`, `cancelled`, `failed` or `pending`.

The callback status is for the UI only: show a "Thank you" screen or bring the button back. **Never deliver goods based on it.** The source of truth is the `successful_payment` update your bot receives on the server. After payment, the Mini App simply asks the server for the current order status.

## Delivering goods reliably

The most common problem is goods delivered twice or not at all. To prevent that:

- **Create the order before the invoice** and put its ID in `payload`. Do not store price or contents in `payload`; they are easy to mix up.
- **Store `telegram_payment_charge_id`** with a unique index. A repeated update with the same ID is simply ignored.
- **Deliver inside a transaction**: marking the order paid and granting access must succeed together or not at all.
- **Check everything in `pre_checkout_query`** that could block delivery: the order is not already paid, the item is available, the user is not banned. Answer fast, or the payment is cancelled.
- **Make delivery retryable**: if sending the goods fails, the job should rerun without creating a new payment.

## Refunds

`refundStarPayment` takes `user_id` and `telegram_payment_charge_id` and returns the Stars to the user. Practical rules:

- Before refunding, revoke the access you granted and mark the order as refunded.
- A payment cannot be refunded twice, so check the order status on your side.
- Describe your refund policy in the bot and provide a clear command for payment questions. Telegram expects bots that take payments to respond to users about them (usually via a `/paysupport` command).

For reconciliation, use `getStarTransactions`: it returns the bot's incoming and outgoing transactions, which makes it easy to spot mismatches with your database.

## Common mistakes

- Several items in `prices` for `XTR`: Telegram returns an error.
- Delivering goods in the `pre_checkout_query` handler or from the Mini App callback.
- No uniqueness constraint on `telegram_payment_charge_id`.
- Testing only in production. Use the Telegram test server to rehearse the flows.

Details are in the [Telegram Stars payments documentation](https://core.telegram.org/bots/payments-stars).

## FAQ

### Can I sell physical goods for Stars?

Stars are meant for digital goods and services. For delivery, offline services and physical goods, connect a regular payment provider.

### Can I sell a subscription for Stars?

Yes. `createInvoiceLink` supports recurring payments through the `subscription_period` parameter. Each renewal arrives as a new `successful_payment` and must be handled just like the first one.

### How do I withdraw earned Stars?

The bot owner can withdraw accumulated Stars via Fragment or spend them on Telegram ads. Telegram sets the withdrawal terms, so check the current documentation.
