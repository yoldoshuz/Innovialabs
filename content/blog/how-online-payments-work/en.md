---
title: How Online Payments Work: Gateway, Acquirer and Processor
description: Follow a card payment from the Pay button to money in your account: every participant, authorization, capture, settlement, fees and refunds in plain language.
summary: A payment travels from the store through the gateway, the acquirer and processor and the card network to the buyer's bank, which approves it and holds the amount; later the money is captured, settled between banks and paid to the store minus fees.
---
## The short answer

When a buyer clicks "Pay", **authorization** happens within seconds: the buyer's bank checks the card and balance and puts a hold on the amount. But the store does not have the money yet. It arrives later, after **capture**, **clearing** and **settlement**, and minus fees.

To understand delays, fees and payment statuses, you need to know who is involved.

## Who takes part in a payment

| Participant | Role |
|---|---|
| **Buyer** (cardholder) | Enters card details and confirms the payment |
| **Store** (merchant) | Creates the order and starts the payment |
| **Payment gateway** | Securely accepts card data and forwards the request. Gives the store an API and a hosted payment page |
| **Acquirer** | The store's bank: accepts card payments on its behalf and pays out to its account |
| **Processor** | The technical center that routes and processes transactions. Often owned by or contracted to the acquirer |
| **Card network** | Visa, Mastercard and, in Uzbekistan, the national Uzcard and Humo systems. They connect acquirers and issuers and set the rules |
| **Issuer** | The buyer's bank that issued the card. Approves or declines the transaction |

In practice, one company may play several roles. A payment service can be both gateway and aggregator, and a bank can be both acquirer and processor.

## The payment step by step

1. **Checkout.** The buyer clicks "Pay". The store's server creates the order and a payment request with the amount and order ID.
2. **Card entry.** The buyer enters the card on the gateway's hosted page or secure form. Card data should not pass through the store's server — this greatly reduces security requirements under PCI DSS.
3. **Authentication.** The issuer checks that the cardholder is paying, using **3-D Secure** or a one-time SMS code.
4. **Authorization.** The request goes gateway → acquirer/processor → card network → issuer. The issuer checks the card, limits and balance, approves and **places a hold** on the amount. The response travels back the same way.
5. **Store notification.** The gateway reports the result to the store's server via a callback (webhook). The order counts as paid only after this server-side confirmation, not when the buyer lands on the "Thank you" page.
6. **Capture.** The store confirms that the held amount should be charged. Often this happens automatically right after authorization (single-step payment). In a two-step flow the store captures later, for example after confirming stock.
7. **Clearing and settlement.** The card network reconciles transactions for the period, the issuer transfers the funds, and the acquirer pays the store **minus fees** on the schedule in the contract.

## Where the fees come from

- **Interchange** — the share that goes to the buyer's bank.
- **Network fees** — for using the card network.
- **Acquirer markup** — the acquirer's income for its service.
- **Gateway or payment service fee**, if that is a separate company.

Stores usually see one combined rate as a percentage of the payment (often called MDR) or a "percentage plus fixed amount" tariff. Actual values depend on the country, card types, business category, volume and contract, so compare offers using your own numbers.

## Void, refund and chargeback

- **Void (reversal)** — before capture: the hold is released and the money never actually moved. Usually the fastest and cheapest option.
- **Refund** — after capture: the store sends the money back. How long it takes to reach the card depends on the banks. The fee on the original payment is often not returned.
- **Chargeback** — a dispute the buyer opens through their bank, for example over goods never received. The money can be pulled from the store, which must defend itself with evidence.

## Common integration mistakes

- Marking an order as paid on redirect instead of the server callback.
- Not verifying the callback signature and the amount sent by the payment provider.
- Non-idempotent handling, so a repeated callback creates a second payment.
- Storing card data without need and without PCI DSS compliance.
- Using two-step payments and forgetting to capture — holds expire and the money never arrives.

## FAQ

### What is the difference between a gateway and an acquirer?

The gateway is the technical pipe and the interface for the store. The acquirer is the bank that legally accepts payments on the store's behalf and pays out to it. Without an acquirer, a gateway cannot get money into your account.

### Why does the money not arrive right after payment?

Authorization only places a hold. The real movement of money happens during clearing and settlement between banks, and the acquirer pays the store on the schedule in its contract.

### Which is better: a void or a refund?

If the goods have not shipped and the payment is not captured yet, voiding the authorization is faster and usually free of extra cost. After capture, a refund is the only option.
