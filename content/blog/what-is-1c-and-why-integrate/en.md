---
title: What Is 1C and Why Integrate It With Your Online Store
description: What 1C products do in accounting and trade, what data they hold, and which manual work and errors disappear once 1C is synced with your online store.
summary: 1C is an accounting and trade system that holds products, prices, stock, counterparties and sales documents; integrating it with your store removes manual data entry and errors like selling items that are out of stock.
---
## The short answer

**1C** is a family of business accounting software built on the **1C:Enterprise** platform. The platform is the engine, and **configurations** for different jobs run on top of it:

- **Accounting** — bookkeeping, tax accounting and reporting;
- **Trade Management** — purchasing, sales, warehouses, pricing, settlements;
- **Retail** — shops, cash registers, retail sales;
- **ERP and integrated automation** — trade, manufacturing, finance and HR in one database.

Many configurations are adapted to the legislation of a specific country, so different countries use their own versions. It is widely used across the CIS, including Uzbekistan. For an online store, 1C is usually the **source of truth** for products, prices and stock.

## What data lives in 1C

| Data | What it means for the store |
|---|---|
| **Item catalogue** | Products, SKUs, attributes, units of measure |
| **Prices** | Retail, wholesale and promotional price types |
| **Stock** | Quantity per warehouse, reservations |
| **Counterparties** | Customers and suppliers, company details |
| **Orders and documents** | Customer orders, sales documents, invoices, returns |
| **Payments** | Incoming money and its link to orders |

The store handles the storefront, cart and checkout. 1C keeps track of what you actually have, what it costs and what has been sold.

## What happens without integration

When the store and 1C live separately, data is moved by hand. Typical consequences:

- **Selling items you do not have.** Website stock was updated in the morning, but the item sold in a physical shop by afternoon.
- **Price mismatches.** A price changed in 1C while the old one stayed on the site.
- **Double order entry.** A manager retypes a web order into 1C and gets the SKU or quantity wrong.
- **Shipping delays.** The warehouse learns about an order only after someone enters it manually.
- **Murky reporting.** Online sales are hard to separate and analyse.

The more products and orders you have, the more manual transfer costs you.

## What synchronisation gives you

**From 1C to the site:**

- catalogue and product attributes;
- current prices and price types for different customer groups;
- stock per warehouse, so the site shows "in stock" or "on order".

**From the site to 1C:**

- new orders with items, prices and customer data;
- payment statuses;
- new counterparties.

**Back to the site:** order statuses (picked, shipped, delivered) so customers see them in their account or get notifications.

## How the exchange usually works

- **CommerceML** — an XML exchange format between 1C and websites. Many CMSs and standard configurations support it out of the box.
- **HTTP services and OData in 1C** — 1C itself serves and receives data over REST, convenient for custom-built stores.
- **Middleware** — a separate service that pulls data from 1C, transforms it and pushes it to the store, marketplaces and CRM.

Exchange frequency depends on the task: the catalogue can update less often, while stock and orders should sync as often as practical.

## Common mistakes

- **No shared product identifier.** Without a common key (SKU or GUID), records start duplicating.
- **Unclear ownership.** Decide upfront where each data type is edited: prices only in 1C, descriptions only on the site, and so on.
- **No failure handling.** The exchange must log errors and retry failed attempts, or orders get lost silently.
- **Syncing everything.** Transfer only what the store actually needs.

## FAQ

### Do I need integration if I have few products?

With a small catalogue and rare orders you can manage with manual exchange for a while. Once you add more sales channels or start getting stock errors, integration pays back through saved time and fewer cancelled orders.

### Can 1C integrate with a store on any platform?

Generally yes. Popular CMSs have ready CommerceML modules, and custom stores exchange data via API. The complexity depends on how customised your 1C configuration is.

### Does the same approach work for marketplaces?

Yes. 1C stays the source of stock and prices, and data goes to the store and marketplaces at the same time, which reduces the risk of selling one item twice.
