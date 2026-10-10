---
title: Payme vs Click: Which Payment System to Choose for Your Website
description: Payme and Click compared for websites: connection requirements, fees, cards, API style, payouts and reach in Uzbekistan, plus why many stores connect both.
summary: Payme and Click do the same job — accepting Uzcard and Humo cards and payments from their own apps — and differ mainly in API design and your customers' habits, so most stores are better off connecting both.
---
## The short answer

**Payme** and **Click** are the two best-known payment systems in Uzbekistan for accepting online payments. Both accept the national **Uzcard** and **Humo** cards, both have popular mobile apps that people use to pay for almost everything, and both give stores an API for website checkout.

For the buyer there is little real difference: they pay with what they are used to. So the question is usually not "which is better" but "which first", and most often the answer is "both".

## Comparison by key criteria

| Criterion | Payme | Click |
|---|---|---|
| Who can connect | Companies and sole proprietors registered in Uzbekistan | Companies and sole proprietors registered in Uzbekistan |
| Cards | Uzcard, Humo; check current terms for other cards | Uzcard, Humo; check current terms for other cards |
| How the buyer pays | Payme payment page or the Payme app | Click payment page or the Click app |
| Main API for stores | Merchant API: Payme calls your server using JSON-RPC | SHOP API: Click sends Prepare and Complete requests to your server |
| Amount units | Tiyin (amount in sum × 100) | Sum |
| Recurring payments | Separate API for card tokenization | Separate API for card tokens |
| Fees and payouts | Per contract | Per contract |

## Connection requirements

Both systems ask for a similar set:

- a **company or sole proprietor** with a bank account in Uzbekistan;
- a **working website** or app with product descriptions and prices, contacts, a public offer and delivery and return terms;
- an **application and contract** through the business portal or a sales manager;
- **technical integration** and testing before switching to production.

The exact list of documents changes, so check the requirements at the time you apply.

## Fees and payouts

The processing fee is set in the **contract** and depends on your business type, volume and the terms you negotiate. Public rates, where published, are a starting point, not the final number.

Money is paid to the company's **bank account** minus the fee, on the schedule in the contract. When comparing, ask both providers the same things: the rate for your business type, payout timing, refund terms and whether there are any extra charges.

## How the APIs work

Both follow a similar pattern: the buyer pays on the provider's side, and the provider **calls your server** to check the order and confirm the payment.

**Payme Merchant API.** Your server implements methods that Payme calls: checking whether payment is possible (`CheckPerformTransaction`), creating (`CreateTransaction`), performing (`PerformTransaction`), cancelling (`CancelTransaction`), checking status (`CheckTransaction`) and a statement (`GetStatement`). Requests are authorized with the merchant key. There are more methods, but cancellation and reconciliation are spelled out clearly.

**Click SHOP API.** Your server receives two requests: **Prepare** (validate the order and amount) and **Complete** (record the payment or its cancellation). Each request is signed, and you must verify the signature with your secret key. The flow is shorter and easier to start with.

Rules that apply to both:

- verify the **signature or authorization** of every incoming request;
- check the **amount and order status** against your database;
- make processing **idempotent** so a repeated request never creates a second payment;
- watch the **amount units**: tiyin for Payme and sum for Click is a classic source of bugs.

Details are in the official [Payme](https://developer.help.paycom.uz) and [Click](https://docs.click.uz) documentation.

## User reach

Both systems have a large audience, and many buyers have a clear habit: some keep their money and cards in Payme, others in Click. If the familiar option is missing at checkout, some people will not finish the purchase. Which one is more popular among your customers is best shown by your own data after launch.

## Why stores connect both

- **Conversion**: buyers see a familiar button and pay faster.
- **Redundancy**: if one provider has maintenance or an outage, payments keep flowing through the other.
- **Low extra effort**: with the right architecture both integrations write to one orders and payments table, and only the callback handling layer differs.

The usual order: one provider first, a shared model for orders and payments, then the second provider as a separate adapter.

## FAQ

### Can I connect Payme and Click without a registered business?

Accepting payments on a website requires a registered business: a company or sole proprietor with a bank account. The payment provider signs the contract with that entity.

### Which provider should I connect first?

The one where onboarding is faster for you, or the one most of your customers use. Click is technically simpler to start with, but design your architecture so the second provider can be added without rework.

### Do I need a separate checkout for each provider?

No. Two buttons on the payment page are enough, with shared order logic on the server and one callback handler per provider.
