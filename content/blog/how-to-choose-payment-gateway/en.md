---
title: How to Choose a Payment Gateway for Your Online Store
description: A checklist for choosing a payment gateway: cards and wallets, fees, payout speed, currencies, API quality, recurring payments, refunds and onboarding documents.
summary: Choose a gateway by how your customers pay, what each payment really costs with all fees included, how fast the money arrives and how well the API handles cancellations, refunds and subscriptions; comparing by headline fee alone is almost always misleading.
---
## The short answer

The right gateway is the one your **customers can and want to pay with**, and the one that lets your server reliably learn the payment result. Check eight criteria:

1. Cards and wallets.
2. Fees.
3. Payout speed.
4. Currencies.
5. API and documentation quality.
6. Recurring payments.
7. Cancellations and refunds.
8. Onboarding requirements.

Stores in Uzbekistan usually connect **Payme** and **Click** together; for selling abroad, an international gateway such as Stripe, if your company meets its requirements.

## 1. Cards and wallets

Start with your audience, not the gateway.

- Which cards do your customers use: local **Uzcard** and **Humo**, or international Visa and Mastercard?
- Do you need wallets and payment from the provider's own app?
- Do installments or QR payments matter for your average order?

If a gateway does not accept the card half your audience uses, the other criteria do not matter.

## 2. Fees

Look at the **full cost of a payment**, not one rate:

- percentage per transaction and any fixed part;
- different rates for different card types;
- setup and monthly fees;
- fees for refunds and disputes;
- currency conversion costs.

Get the pricing in writing and calculate it on your own average order.

## 3. Payout speed

For working capital, what matters is **how many days** it takes for money to reach your bank account and whether there is a minimum payout. Ask how payouts work on weekends and holidays.

## 4. Currencies

- If you only accept local currency, a local gateway is enough.
- If you sell abroad, you need multi-currency support and clear conversion rules.
- Check which currency payouts arrive in and who pays for conversion.

## 5. API and documentation quality

This determines integration time and cost. Good signs:

- detailed documentation with request and response examples;
- a **test environment** with test cards;
- server-side payment notifications (callbacks or webhooks) with a signature or authentication;
- clear error codes;
- ready-made modules for popular CMSs, if you use one;
- responsive developer support.

## 6. Recurring payments

For subscriptions, service plans or one-click repeat purchases, you need **card tokenization** — the gateway stores the card for later charges. Check whether it is supported and on what terms.

## 7. Cancellations and refunds

- Can you cancel a payment via the API or only in the dashboard?
- Are **partial refunds** supported?
- How long until the customer gets the money back?
- How does the gateway notify your server about a refund?

## 8. Onboarding requirements

Gateways usually ask for company or sole proprietor details, bank details and a working site with terms of sale, contacts and a returns policy. International gateways also check the country where the company is registered. Get the document list early: review can take time and is best started in parallel with development.

## Comparison table

| Criterion | What to ask |
|---|---|
| Payment methods | Which cards and wallets are accepted? |
| Cost | Full list of fees on my average order? |
| Payouts | How many days, and is there a minimum? |
| Currencies | Which currencies, who pays for conversion? |
| API | Is there a test environment and signed notifications? |
| Recurring | Is card tokenization available? |
| Refunds | Via API, partial, how long? |
| Onboarding | Which documents, how long is the review? |

## Common mistakes

- Picking the lowest rate without counting refunds and conversion.
- Connecting one gateway when customers are split between two popular apps.
- Not checking how the gateway reports failed payments.
- Starting onboarding after the site is built instead of in parallel.

## FAQ

### Should I connect several gateways?

Often, yes. Customers get used to a specific app, and offering both popular options reduces abandoned carts. Technically it is straightforward if orders and statuses live in your own database rather than in each gateway.

### Can I switch gateways later?

You can, but recurring payments make it harder: saved cards usually cannot be moved between providers, so customers have to enter their card again.

### Do I need PCI DSS certification to accept cards?

If card details are entered on the gateway's page or form, most of the PCI DSS burden is on the gateway and your obligations are minimal. If you collect card numbers on your own server, the requirements become much stricter.
