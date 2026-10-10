---
title: How to Integrate 1C With an Online Store: Products, Stock, Orders
description: Which data to sync between 1C and your online store, in which direction and how often, how to handle prices and variants, and how to monitor it.
summary: 1C stays the master system for products, prices and stock while the store sends orders back; the exchange runs on a schedule or events and every step is logged and checked.
---

## How the integration works in short

Integrating 1C with an online store means a regular data exchange with clear rules. **1C is the source of truth** for the catalog, prices and stock. **The store is the source of orders** and customer data. Data flows both ways, but every field has exactly one "owner" that is allowed to change it.

The most common mistake is letting people edit the same field both in 1C and in the store admin. On the next exchange, someone's changes will be lost.

## What to sync and in which direction

| Data | Direction | Note |
|---|---|---|
| Products, SKUs, attributes | 1C → store | Descriptions and photos often live in the store |
| Prices (retail, promo, price types) | 1C → store | Decide which price type is published |
| Stock by warehouse | 1C → store | Sum it up or show per warehouse |
| Orders | store → 1C | With items, delivery and payment |
| Order statuses | 1C → store | So customers see the current status |
| Customers | store → 1C | Only what accounting needs |

Also decide where **content** lives: SEO texts, photos, filters. It is usually easier to manage them in the store and take only accounting data from 1C.

## Exchange methods

- **The standard CommerceML protocol** — an XML file exchange supported by many CMSs and standard 1C configurations. Quick to start, but limited flexibility.
- **HTTP services or OData in 1C** — the store or an intermediate service calls 1C through an API. More flexible and suited to frequent updates.
- **Middleware** — a separate application that pulls data from 1C, transforms it and pushes it to the store and marketplaces. Useful when you sell through several channels.

## Exchange frequency

- **Catalog and descriptions** — once a day or on change is enough.
- **Prices** — several times a day or on event if promotions change often.
- **Stock** — as often as possible: every few minutes or on event. This decides whether you sell an item you do not have.
- **Orders** — right after checkout or with minimal delay.

Run a full catalog export rarely, and during the day send only the **changes** (the delta). This reduces the load on 1C and speeds up the exchange.

## Prices and product variants

Variants (size, color) in 1C are usually stored as **product characteristics**. In the store they should become one product with variants, not a dozen separate cards.

Practical rules:

- Link products by a **stable identifier** (the GUID from 1C), not by name or SKU, which can change.
- Price and stock belong to a specific variant.
- Agree on what happens to a product with no price or zero stock: hide it, show "on request" or "out of stock".

## Testing and monitoring

Before launch, test the scenarios on a copy of the 1C database:

1. A new product appears in the store with the right price and variants.
2. Price and stock changes reach the store within the expected time.
3. An order from the store is created in 1C with correct items, total and delivery.
4. A status change in 1C shows up in the store.
5. The exchange survives errors: a product without a price, a deleted item, a lost connection.

After launch you need **monitoring**: a log of every exchange, the time of the last successful sync and an alert to the person in charge on failure. If stock has not updated for longer than a set threshold, someone should know before customers do.

## Common mistakes

- No single identifier — duplicate products after every export.
- A full catalog export every 15 minutes — both 1C and the store slow down.
- Orders fail to reach 1C and nobody notices because there are no logs.
- The 1C configuration is heavily customized, but the integration was built for the standard one.

## FAQ

### Will a standard exchange module work for my CMS?

If you run a standard 1C configuration, a simple catalog and one warehouse, often yes. With custom changes, several warehouses or marketplaces, you usually need extra development or a separate service.

### Can stock be updated in real time?

You can get close by sending changes from 1C on event. But stability matters more: a reliable exchange every few minutes beats "real time" that breaks regularly.

### What if an order fails to export to 1C?

The order should stay in the store with an error status and go into a retry queue. The person in charge gets an alert and can resend it manually.
