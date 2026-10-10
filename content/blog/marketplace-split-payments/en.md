---
title: Split Payments for Marketplaces: How Payouts to Sellers Work
description: How one customer payment is divided between sellers and the platform, why funds are held, how refunds work across splits and what legal setup you need.
summary: A split payment lets a gateway accept one charge and distribute it by rules between sellers and the platform fee, holding funds until the order is fulfilled; it requires a gateway with marketplace support and a legal setup where the platform does not hold other people's money without the right to.
---

## The short answer

A customer pays for one cart containing items from three sellers. They see **one payment**, but behind it the money is divided:

- each seller gets their share minus fees;
- the platform keeps its **commission** (a percentage, a fixed fee or both);
- the gateway takes its processing fee.

The key point: seller money should not pass through the platform's bank account as platform revenue. Otherwise the platform formally receives other people's funds, which raises tax, accounting and licensing questions. A split solves this at the gateway level: funds go to each recipient's account and the platform receives only its share.

## How the money flows

A typical marketplace order lifecycle:

1. **Seller onboarding.** The seller is registered with the gateway as a recipient (sub-merchant, connected account): bank details, documents, KYC checks.
2. **Payment.** The customer pays one amount. The gateway records which part belongs to whom.
3. **Hold.** The money is not released to the seller immediately but held until an event: shipment, delivery, or the end of the return window.
4. **Payout.** After the event the gateway transfers the seller's share, per order or in batches on a schedule.
5. **Adjustments.** Refunds, disputes and penalties are deducted from the seller's balance or future payouts.

A hold acts as a **lightweight escrow**: the buyer is protected and the platform gets time to resolve disputes. True escrow with an independent agent is a separate service most marketplaces do not need.

## Distribution models

| Model | How it works | Best for |
|---|---|---|
| Split at charge time | Shares are calculated and fixed when the card is charged | Simple orders, one seller per order |
| Separate charge and transfers | Charge goes to the platform first, then transfers to sellers | Multi-seller carts, flexible logic |
| Seller balance + scheduled payouts | Earnings accumulate in an internal balance, paid out every N days | Many small orders, holdbacks and penalties |

Stripe Connect, for example, offers both "destination charges" and "separate charges and transfers", which match the first two models ([Stripe Connect docs](https://docs.stripe.com/connect)). Adyen, PayPal and Mangopay have similar platform products. For local providers, including Payme and Click in Uzbekistan, check multi-recipient payouts directly with the provider: terms, availability and the contract depend on the provider and your business model.

## Refunds when a payment is split

Refunds are the hardest part. Answer these questions up front:

- **Partial refund.** The customer returns one seller's item out of three. The refund must come out of that seller's share only.
- **Platform commission.** Is it refunded too? This is a business rule; put it in the seller agreement.
- **Refund after payout.** If the seller has already been paid, recover the amount from future payouts or invoice the seller. Without a **negative balance** mechanism the platform pays for the refund itself.
- **Processing fee.** Many gateways keep their fee on refunds. Decide who absorbs it.
- **Chargebacks.** A dispute from the customer's bank can arrive long after the order. A reserve on the seller's balance reduces the risk.

Practical rule: keep a **ledger** in your database, a journal of every movement per recipient (earning, fee, hold, payout, refund, deduction). A seller's balance should be derived from the ledger, not stored as a single number that gets overwritten.

## The legal setup

The legal side often takes longer than the technical one. The main options:

- **Platform as the sellers' agent.** The platform collects payments on behalf of sellers under an agency agreement and earns an agency fee. Common in the CIS, but requires careful paperwork and fiscal receipts.
- **Funds go directly through the gateway.** The seller contracts with the gateway (via the platform), and the platform only receives its fee. Less regulatory burden on the platform.
- **Platform as reseller.** The platform buys from the seller and sells to the customer. This is no longer a split but ordinary retail with full tax implications.

Check with a lawyer and accountant: who issues the receipt to the customer, who pays tax on which amount, whether accepting funds on behalf of third parties requires a license in your jurisdiction, and how settlement documents with sellers are issued.

## Common mistakes

- Keeping seller money in the platform's account "temporarily" with no contractual basis.
- Paying sellers manually from a spreadsheet, which multiplies errors and disputes.
- Not planning for refunds after payout and negative balances.
- Skipping seller KYC, which can get the whole platform blocked by the gateway.
- Rounding commissions in different places in the code, so totals drift by cents and reconciliation breaks. Store amounts as integers in minor currency units (cents, tiyin).

## FAQ

### Can I split payments without gateway support?

You can collect funds into the platform's account and pay sellers manually or via a bank API, but then the platform holds other people's money, which needs an agency agreement and proper accounting. For a growing marketplace a gateway with built-in payouts is more reliable.

### How long should funds be held?

It depends on your return policy and delivery times. Payouts are usually tied to an event: the customer confirming receipt or the return window closing. Holding too long drives sellers away; too short leaves the platform unprotected.

### What if a seller leaves with a negative balance?

Cover this in the contract: the right to deduct from future payouts, a reserve or security deposit, and debt recovery. Technically a rolling reserve helps: a portion of each payout that is released later.
