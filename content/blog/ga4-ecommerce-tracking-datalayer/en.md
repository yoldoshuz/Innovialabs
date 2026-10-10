---
title: GA4 E-commerce Tracking with dataLayer: Full Setup Guide
description: How to set up GA4 e-commerce through dataLayer and GTM: recommended events from view_item to purchase, item parameters, refunds and revenue validation.
summary: Your site pushes GA4 recommended events (view_item, add_to_cart, begin_checkout, purchase and others) with an items array to the dataLayer, and GTM forwards them to GA4 with a single tag. What matters most is a consistent item structure across events, a unique transaction_id and regular revenue checks against your backend.
---

## How it works

GA4 builds e-commerce reports only from **recommended events** with fixed names and parameters. The flow:

1. On a user action, the site code calls `dataLayer.push` with an event and an `ecommerce` object.
2. A Google Tag Manager trigger catches the event.
3. A GA4 event tag sends it along with the e-commerce data.

Developers own the dataLayer, marketers own GTM and reports. Agree on the structure up front and write it down in a spec.

## Which events you need

| Stage | Event | When to send |
|---|---|---|
| Catalog | `view_item_list` | a product list is shown |
| | `select_item` | a product in a list is clicked |
| Product page | `view_item` | a product page is opened |
| Cart | `add_to_cart`, `remove_from_cart` | an item is added or removed |
| | `view_cart` | the cart is opened |
| Checkout | `begin_checkout` | checkout starts |
| | `add_shipping_info` | a shipping method is chosen |
| | `add_payment_info` | a payment method is chosen |
| Purchase | `purchase` | an order is successfully created |
| Refund | `refund` | an order is fully or partially refunded |

There are also `view_promotion` and `select_promotion` for banners, and `add_to_wishlist`. The minimum for a working funnel: `view_item`, `add_to_cart`, `begin_checkout`, `purchase`.

## Item and event parameters

Every event carries an `items` array. Each item requires **`item_id` or `item_name`**; the rest is optional but recommended:

- `item_id`, `item_name`: SKU and name, identical across all events;
- `price`: unit price as a **number**, not a string;
- `quantity`;
- `item_brand`, `item_category` … `item_category5`, `item_variant`;
- `item_list_id`, `item_list_name`, `index`: which list the item appeared in and at what position;
- `discount`, `coupon`.

At the event level: `currency` in ISO 4217 format (for example `UZS` or `USD`) and `value`. Without `currency`, revenue is not recorded. `purchase` requires a **`transaction_id`**; `tax`, `shipping` and `coupon` are optional.

## dataLayer example

Clear the `ecommerce` object before every e-commerce event; otherwise data from the previous event can carry over to the next one.

```javascript
window.dataLayer = window.dataLayer || [];
dataLayer.push({ ecommerce: null });
dataLayer.push({
  event: 'purchase',
  ecommerce: {
    transaction_id: 'ORD-10452',
    currency: 'UZS',
    value: 450000,
    shipping: 30000,
    items: [{
      item_id: 'SKU-201',
      item_name: 'Travel mug',
      item_category: 'Kitchen',
      price: 150000,
      quantity: 3
    }]
  }
});
```

Decide in advance whether `value` includes shipping and tax, and apply the rule the same way everywhere.

## GTM setup

1. Create a **Custom Event** trigger with a regex such as `view_item|add_to_cart|begin_checkout|purchase|refund`.
2. Create a **Google Analytics: GA4 Event** tag with the event name `{{Event}}`.
3. In the tag's advanced settings, enable **Send Ecommerce data** with **Data Layer** as the source.
4. Attach the trigger and publish the container after testing.

One tag covers all events as long as the dataLayer follows Google's recommended structure.

## Refunds

- **Full refund**: a `refund` event with the original order's `transaction_id`, `currency` and `value`.
- **Partial refund**: the same plus an `items` array with the refunded items and quantities.

Refunds usually happen in an admin panel or CRM, not in the buyer's browser. So they are easier to send server-side via the **Measurement Protocol** or upload through data import rather than through the dataLayer.

## How to validate the data

- **GTM Preview**: the event fired and the Data Layer tab shows the correct structure.
- **GA4 DebugView**: the event arrived with its parameters and items.
- **Backend reconciliation**: weekly, compare order count and revenue in GA4 with your database. Small gaps are normal (blockers, declined cookies); large gaps point to a bug.

Common mistakes:

- **Duplicate `purchase`** events when the thank-you page reloads. Send the event once, for example using a server-side flag.
- **Price as a string**, or with spaces and a currency symbol.
- **Different `item_id`** on the product page and in the purchase, which splits product reports.
- **Missing `currency`**, so revenue shows as zero.
- An external payment gateway breaks the session: add its domain to the unwanted referrals list.

## FAQ

### Can I set up GA4 e-commerce without GTM?

Yes, with `gtag('event', 'purchase', {...})` directly in the site code, using the same parameters. GTM is more convenient when there are many tags and marketers need to change them without a release.

### Do I need to send every recommended event?

No. Start with the key funnel steps and `purchase`, then add lists and promotions if you will actually analyze that data.

### Why is GA4 revenue lower than in the CRM?

Some users block analytics or decline cookies, and some orders are placed by phone or cancelled. If the gap is large and growing, check for duplicates, currency and whether `purchase` fires for every payment method.
