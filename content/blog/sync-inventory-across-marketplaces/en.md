---
title: How to Sync Inventory Across Marketplaces and Your Own Store
description: A single source of stock truth, marketplace APIs, update intervals, safety buffers and choosing between a ready-made tool and a custom integration.
summary: Keep stock in one system and let every channel receive the available quantity with a small buffer from it; a sale in any channel immediately reduces the shared stock.
---

## The core rule: one source of truth

If you sell on your website and several marketplaces, stock must be stored **in one place**: your accounting system, WMS, CRM or a dedicated sync service. Channels do not keep their own stock — they only receive the **available-to-sell quantity** from the center and report sales back.

The flow is simple:

1. An order arrives from any channel.
2. The central system reserves the item and reduces stock.
3. The new available quantity is pushed to all other channels.

When stock is edited by hand in every seller dashboard, sooner or later the same item gets sold twice.

## What available stock means

Physical stock in the warehouse and what you can sell are different numbers.

**Available to sell = on hand − reserved for orders − safety buffer**

- **Reserved** — items in placed but not yet shipped orders.
- **Buffer** — a small amount you do not show to channels. It covers the gap between a sale and the stock update in other channels.

You can set the buffer in different ways: a fixed quantity, a rule like "show zero if fewer than N remain", or a separate quota per channel. The buffer matters most for fast-moving items with low stock.

## How marketplace APIs work

Major marketplaces offer APIs to update stock and fetch orders. Common points to plan for:

- **Rate limits** — you cannot send an unlimited number of single-item updates. Group updates into batches.
- **Fulfillment models** — when you ship from your own warehouse, you manage stock yourself; when the goods sit in the marketplace's warehouse, the platform manages that stock and syncing works differently.
- **Product mapping** — each platform has its own listing ID. You need a mapping table "your SKU ↔ platform ID".
- **Fetching orders** — via webhooks or regular API polling.

Before building, read each platform's documentation: rules and limits differ and change over time.

## Update intervals

| Event | How often |
|---|---|
| New order in any channel | Immediately or within minutes |
| Cancellation or return | Immediately, stock goes back |
| Goods received at warehouse | After receiving is posted |
| Full stock reconciliation | Daily or more often |

Event-driven updates give you speed, while a **regular full reconciliation** fixes whatever slipped through: a failed request, a manual edit, an outage on the platform side.

## Ready-made tool or custom integration

**Multichannel commerce services** fit when:

- your marketplaces are popular and supported by the service;
- your accounting system is standard;
- you need quick setup without development.

**A custom integration** makes sense when:

- you run a customized 1C or an in-house system;
- you need your own rules for reserves, quotas and channel priorities;
- some platforms are not supported by off-the-shelf tools;
- order volume is high and you need control over the logic.

## Common mistakes

- Stock is edited manually in marketplace dashboards.
- No SKU mapping table — updates land on the wrong listings.
- Cancellations do not return items to stock.
- API errors are not logged, and a listing shows the wrong quantity for weeks.
- No buffer on items with only a few units left.

## FAQ

### Do I need a buffer if updates are almost instant?

Usually yes, at least for low-stock items. There is always a delay between an order in one channel and the update in another, and platforms do not apply changes instantly.

### How should I handle goods stored in a marketplace's warehouse?

The platform manages that stock. Track it separately: pull the data from the API for reporting, but do not mix it with the stock in your own warehouse that you share across channels.

### Where do I start if everything is in spreadsheets now?

First choose the system that will be the source of truth and clean up your SKUs. Only then connect channels one by one, starting with the one that brings the most orders.
