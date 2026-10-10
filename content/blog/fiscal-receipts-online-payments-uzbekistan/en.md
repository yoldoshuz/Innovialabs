---
title: Fiscal Receipts and IKPU Codes for Online Payments in Uzbekistan
description: Why online payments in Uzbekistan need IKPU product codes and fiscal data, how this data travels through payment systems and how to prepare your catalog.
summary: For online payments in Uzbekistan every order line must carry fiscal data such as the IKPU code, package code, VAT rate and price, so these fields have to live in your store catalog before you integrate payments.
---

## The short answer

When a customer pays online, a **fiscal receipt** is generated and the tax authority can see exactly what was sold. For the receipt to be valid, the store sends for each order line an **IKPU code** (the national product and service identification code, MXIK in Uzbek), a **package code** (unit of measure), the **VAT rate**, quantity and price. This data goes through the payment system together with the payment or right after it. If your catalog does not hold it, you cannot finish the payment integration.

## What IKPU is and why it exists

**IKPU** is a code from the single national catalog of goods and services maintained by the tax service. It states unambiguously what a receipt line is: not "Blue T-shirt M" but a specific product group with a clear tax treatment.

Why it matters:

- the tax authority receives structured sales data;
- the buyer gets a receipt they can verify;
- the store confirms revenue and applies VAT and exemptions correctly.

Each IKPU code has **package codes** attached: the units in which the product is sold (piece, kilogram, pack and so on). You choose them from the reference list for that specific IKPU.

## How the data flows through the payment system

The general pattern is similar across providers; field names and timing differ.

1. The store creates an order and knows the cart contents.
2. When creating the payment, or when the payment system asks for it, the store sends the **receipt details**: a list of lines with fiscal fields.
3. The payment system processes the payment and submits the data for fiscalization.
4. The buyer receives a fiscal receipt, usually as a link or inside the payment app.

Here is how a single line might look (field names are illustrative; take the exact format from your provider's documentation):

```json
{
  "title": "Cotton T-shirt, size M",
  "price": 15000000,
  "count": 1,
  "ikpu": "00000000000000000",
  "package_code": "0000000",
  "vat_percent": 12
}
```

Watch out for typical traps:

- some providers expect amounts **in tiyin**, not in sum;
- the total of receipt lines must match the payment amount, including delivery and discounts;
- **delivery** is a separate service with its own IKPU code, not part of the product;
- marketplaces and commission sales may need the TIN or PINFL of the actual supplier of each line.

## How to prepare your catalog

The real work is in the data, not in the integration code. Steps:

1. **Export the list of products and services** with their current categories.
2. **Find the IKPU** for each product group in the official catalog. Working by category is faster than going item by item.
3. **Choose a package code** for each IKPU.
4. **Confirm the VAT rate** and any exemptions with your accountant.
5. **Add the fields to the product card** in your CMS or accounting system so new products cannot be published without them.
6. **Create separate items** for delivery, packaging and other services that appear on the receipt.

| Field | Where to store it | Who owns it |
| --- | --- | --- |
| IKPU | Product card or category | Accountant, content manager |
| Package code | Product card | Content manager |
| VAT rate | Product card or settings | Accountant |
| Supplier TIN/PINFL | Supplier record | Partner manager |

If products are managed in 1C or another accounting system, keep the fiscal fields there and sync them to the website rather than maintaining them in two places.

## Common mistakes

- One "universal" IKPU for the whole catalog: the receipt goes through, but the data is wrong.
- A discount is not spread across lines, so the receipt total does not match the payment.
- Delivery is missing from the receipt.
- New products are added without fiscal fields and payments for them fail.
- Refunds are not tested, although a refund also needs a correct receipt.

## FAQ

### Where do I find the IKPU code for a product?

In the official national catalog of goods and services run by the tax service. You can search by product name or group. If you are unsure, agree the code with your accountant.

### Who issues the fiscal receipt, the store or the payment system?

It depends on the integration setup. Often the payment system handles fiscalization, but the store still supplies the line items. The exact split of responsibility is described in the provider's documentation and contract.

### What if the cart changes after payment?

If an order is partly cancelled or changed, issue a partial refund with correct line details. Do not retroactively edit receipt lines that were already submitted.
