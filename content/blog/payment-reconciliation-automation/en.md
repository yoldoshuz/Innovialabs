---
title: How to Automate Payment Reconciliation in E-commerce
description: How to match orders, gateway reports and bank settlements, handle fees, refunds and partial payments, and flag discrepancies automatically.
summary: Automated reconciliation links three sources — orders, gateway reports and bank statements — by shared identifiers, accounts for fees and refunds, and sends only real discrepancies to a review queue.
---
## What reconciliation is and why automate it

**Payment reconciliation** is checking that every paid order was really paid, the money reached your account in the expected amount, and all fees and refunds are accounted for.

Manually it is done in spreadsheets: export orders, the gateway report and the bank statement, then compare rows. With few orders that's tolerable. As volume grows, manual reconciliation falls behind, errors pile up and discrepancies surface weeks later.

Automation solves three tasks: it **matches records**, **calculates expected amounts** and **shows only exceptions**.

## Three data sources

| Source | What it contains | Key fields |
|---|---|---|
| Your system (orders) | What the customer should have paid | Order ID, amount, status, date |
| Gateway report | Which transactions went through | Transaction ID, order ID, amount, fee, status |
| Bank statement | What was actually credited | Credited amount, date, reference, payout ID |

The difficulty is that the links differ. Orders and transactions are often one-to-one, while the bank credits **a single amount** for a batch of transactions over a period, minus fees.

## How to build the process

1. **Collect data automatically.** Orders from your database, transactions via API or a scheduled gateway report export, statements via bank API or file import.
2. **Normalize.** Consistent date formats and time zones, amounts in minor currency units (integers), unified statuses.
3. **Match orders to transactions.** By the order ID you pass to the gateway when creating a payment. This is the main key — without it reconciliation turns into guessing by amount and time.
4. **Group transactions into payouts.** If the gateway provides a settlement/payout ID, group by it. If not, group by settlement date according to your contract terms.
5. **Calculate the expected credit.** Transaction total − fees − refunds ± adjustments.
6. **Compare with the statement.** Match — payout closed. No match — exception.

## Fees, refunds and partial payments

- **Fees.** Take them from the gateway report rather than computing from your tariff: the actual fee may depend on card type, payment method or contract terms. Your own calculation is useful as a check.
- **Refunds.** These are separate operations with their own IDs and dates. A refund may reduce a payout in another period — link it to the original transaction, not to a date.
- **Partial payments.** One order, several transactions. Compare the sum of all successful transactions for the order with its total.
- **Partial refunds.** Store the refunded amount, not just a "refunded" flag.
- **Currency and rounding.** Use integers in minor units to avoid cent-level mismatches caused by floating-point numbers.

## Discrepancies to flag automatically

- Order is paid in your system, but there is no transaction.
- Transaction exists, but the order is missing or cancelled.
- Transaction amount differs from the order total.
- Transaction succeeded but didn't land in the expected payout.
- Bank credit doesn't match the expected payout amount.
- Gateway shows a refund, but the order is still "paid" in your system.

Give each type a **rule and a tolerance**. For example, a rounding difference closes automatically, while an order amount mismatch goes to accounting.

## Handling exceptions

- A separate queue or section in your CRM/admin panel listing discrepancies.
- Each exception has a type, linked records, difference amount, owner and status.
- A daily summary: how much was reconciled, how many exceptions are open, the oldest ones.
- A history of resolutions, so recurring cases become new rules.

## Common mistakes

- Not passing the order ID to the gateway — then matching by amount.
- Storing amounts as floats.
- Reconciling orders with the gateway but never checking the bank.
- Ignoring time zones: a transaction near midnight lands in the "wrong" day.
- Treating reconciliation as a one-off export instead of a recurring process.

## FAQ

### How often should reconciliation run?

Matching orders and transactions works well daily or more often, while bank reconciliation follows the gateway's payout schedule. Regularity matters most, so discrepancies are found while they're still easy to investigate.

### Can reconciliation be done in 1C or a CRM?

Yes, if the system can import gateway reports and statements and link them to orders. Often the matching logic lives in a separate service, and 1C or the CRM receives the finished result.

### What if the gateway has no reporting API?

Automate file imports: scheduled exports, scheduled uploads, format validation. It's less convenient than an API but still removes manual row-by-row comparison.
