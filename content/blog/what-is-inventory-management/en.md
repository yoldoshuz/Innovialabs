---
title: What Is Inventory Management: Methods, Metrics and Tools
description: Stock levels, reorder points, safety stock, turnover, ABC analysis and FIFO explained simply, plus the signs that spreadsheets should give way to software.
summary: Inventory management is deciding how much of each item to hold and when to reorder it, so you don't lose sales to stockouts or tie up cash in excess stock.
---
## The short answer

**Inventory management** is the process that answers three questions for every item:

- **How much do we have** right now, and where.
- **When to reorder** so the shelf doesn't run empty.
- **How much to order** so the warehouse doesn't fill with surplus.

Get it wrong one way and you have a **stockout**: the customer buys from a competitor. Get it wrong the other way and you have **overstock**: cash is frozen in boxes while the product ages or goes out of fashion.

## Key concepts and metrics

**Stock level.** Keep three numbers apart:

- **On hand**: what physically sits in the warehouse.
- **Reserved**: already promised to placed orders.
- **Available**: on hand minus reserved. This is the number your website should show.

**Reorder point**: the stock level at which you place a new order with the supplier.

```text
Reorder point = Average daily sales × Lead time in days + Safety stock
```

**Safety stock**: a buffer in case sales run higher than usual or the supplier is late. A simple starting formula:

```text
Safety stock = Max daily sales × Max lead time
             − Average daily sales × Average lead time
```

**Inventory turnover**: how many times stock is replaced over a period.

```text
Turnover = Cost of goods sold for the period / Average inventory for the period
```

Higher turnover means goods turn into cash faster. Compare it within a category: groceries and furniture have very different norms.

## Methods

**ABC analysis.** Items are grouped by their contribution to revenue or profit:

| Group | What's in it | How to manage |
|---|---|---|
| **A** | A small share of items bringing most of the revenue | Check often, always keep safety stock |
| **B** | Medium contribution | Regular reviews |
| **C** | Many items with little contribution | Minimal stock, candidates for delisting |

Each store sets its own group thresholds. ABC is often paired with **XYZ analysis**, which groups items by how stable their demand is.

**FIFO (First In, First Out).** Goods from older batches ship first. This is critical for anything with an expiry date (food, cosmetics, medicine) and anything that goes out of date. FIFO is also a costing method in accounting.

**Regular stock counts.** Even the best system drifts from reality because of mix-ups, damage and losses. Scheduled counts, especially for group A, restore trust in the numbers.

## When spreadsheets stop working

Excel or Google Sheets are fine at the start. Signs it's time for proper software:

- You sell **across several channels** (website, marketplaces, a physical store) and stock has to stay in sync between them.
- You **sell items you don't have** because the sheet was updated too late.
- **Several people** edit the sheet at once and changes get lost.
- You now have **multiple warehouses** or batches with expiry dates.
- Manual counting and reconciliation eat a noticeable part of the working week.

## Types of tools

- **The inventory module of your store platform**: fine for one channel and a simple range.
- **Accounting and ERP systems** (such as 1C): stock, purchasing, costs and documents in one place.
- **A CRM with a product module**: when sales go through managers and linking orders to customers matters.
- **A WMS**: when the warehouse itself is large and bin locations and picking matter.
- **A custom system**: when your processes are unusual and off-the-shelf tools need heavy customization.

Whatever you pick, the key is **one source of truth** for stock that the website and marketplaces sync with via API.

## FAQ

### How often should I recalculate the reorder point?

Whenever sales or lead times change: in peak season, after switching suppliers, when launching ads. For group A items it's worth reviewing regularly rather than setting it once.

### Do I need FIFO if my products don't expire?

Not always for shipping, but it prevents old batches from getting stuck and losing appeal or relevance over time. For cost accounting, choose the method together with your accountant.

### Can I manage inventory in a CRM without a separate system?

Yes, if the CRM has a product module and your setup is simple: one warehouse, no batches, no complex purchasing. Once you add warehouses or marketplaces, you usually need an accounting system or an integration with one.
