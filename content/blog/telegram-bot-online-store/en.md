---
title: How to Launch an Online Store Inside a Telegram Bot
description: Catalog, cart, checkout, payment and order statuses in a Telegram bot: how to build the store step by step and when to move the storefront into a Mini App.
summary: A bot store is a catalog of categories and product cards, a cart kept in a database, a short checkout, payment via Telegram Payments or a payment provider link, and status notifications; once you need search and filters, move the storefront into a Mini App.
---
## The short answer

An online store inside a Telegram bot has five parts:

1. **Catalog**: categories, subcategories and product cards with a photo, price and an "Add to cart" button.
2. **Cart** stored on your server, not in the chat history.
3. **Checkout**: contact, address or pickup, payment method, in a few steps.
4. **Payment**: Telegram's built-in payments, a payment provider link, or cash on delivery.
5. **Order statuses** that the bot sends to the customer automatically.

While the range is small and choices are simple, chat buttons work well. Once shoppers need search, filters and comparison, move the storefront into a **Mini App** and keep the bot for notifications.

## Catalog: don't bury people in buttons

- Keep **no more than two levels**: category → product. Deep menu trees get people lost.
- Show products **one card at a time** with "‹ Back" and "Next ›" buttons, or as a list with **pagination**.
- Edit the same message while browsing instead of sending new ones, so the chat stays clean.
- Put **short IDs** into buttons, not product names: inline button data (callback_data) is limited to 64 bytes.
- After the first upload, reuse photos by their **file_id** so cards load faster.

## Cart and checkout

Store the cart **in a database** keyed by user ID. It then survives bot restarts, and you can remind people about abandoned carts.

Keep checkout short:

- **Phone number** via a "Share contact" button, no manual typing.
- **Delivery** chosen with buttons: courier, pickup, pickup point. Address as text or a shared location.
- **Order review**: one summary message with items, total and delivery, plus "Confirm" and "Edit" buttons.

Before payment, **re-check stock and price** on the server: an item may have sold out while the customer was choosing.

## Payment: three options

| Option | How it works | When it fits |
|---|---|---|
| Telegram Payments | The bot sends an invoice, payment happens inside Telegram via a connected provider | Physical goods, if a provider for your country and currency is listed in BotFather |
| Telegram Stars | Invoice in Telegram's internal currency | Digital goods and services inside Telegram, where Telegram requires Stars |
| Provider link | The bot sends a payment link from a local provider, the result arrives at your server | When the provider you need is not available in Telegram Payments |

With built-in payments the order of events matters. After the user taps "Pay", the bot receives a **pre_checkout_query** and must quickly approve or reject it; this is your last chance to check stock. Treat the order as paid only after the **successful_payment** message. Current rules are in the [Telegram Payments documentation](https://core.telegram.org/bots/payments).

## Order statuses and notifications

Define a clear status chain and message the customer at every transition:

- **New** → **Paid** (or "Pay on delivery")
- **Packing** → **Shipped** → **Delivered**
- **Cancelled**, with the reason and refund details

Managers usually prefer new orders in a **separate staff chat** with buttons to change the status. If you already run a CRM or accounting system, the bot should write orders there instead of keeping a second database.

## When to switch to a Mini App

Signs that chat menus are holding you back:

- the range is large enough that **search and filters** are a must;
- products have **variants**: size, color, configuration;
- shoppers need to **compare** items or see many photos;
- cart and checkout have turned into a long chain of messages.

A Mini App opens from the bot's menu button and looks like a mobile site inside Telegram. The bot stays: it sends confirmations, statuses and reminders.

## Common mistakes

- Keeping the cart only in conversation state, so it disappears after a restart.
- Marking an order as paid when a button is tapped instead of on payment confirmation.
- Giving customers no way to reach a human.
- Sending every product card as a new message and turning the chat into a feed.

## FAQ

### Do I need a website to sell through a bot?

No, a bot can be a standalone sales channel. You do need a server, a database and an admin panel or CRM to manage products and orders.

### Can I accept local bank cards?

Yes, if you connect a provider that accepts them: through Telegram Payments when it is listed in BotFather, or through a payment link hosted by the provider.

### Should I start with a bot or a Mini App?

With a small range, start with a bot: it is the faster way to test demand. You can add a Mini App to the same bot later without moving customers anywhere.
