---
title: What Is a WMS: Warehouse Management System Explained
description: How a WMS moves goods through receiving, putaway, picking, packing and shipping, why barcodes and bin locations matter, and how a WMS differs from ERP stock tracking.
summary: A WMS runs the physical work of a warehouse: it tells staff where to put goods and where to pick them from and knows the stock in every bin, while an ERP only knows how much stock the warehouse holds overall.
---
## The short answer

A **WMS** (Warehouse Management System) is software that runs **operations inside the warehouse**. It knows not only how much stock there is but **exactly where it sits** (which bin, which rack) and tells staff what to do next.

A warehouse worker doesn't search from memory. On a handheld scanner or a mobile app they see a task like "pick 2 units from bin A-03-02-1", scan the barcode and move to the next step. The system immediately checks that the right item was picked.

## The path of goods through a warehouse

**1. Receiving.** Goods arrive from a supplier. Staff scan barcodes, and the WMS checks quantities against the purchase order and records discrepancies and damage.

**2. Putaway.** The WMS suggests which bin to store the goods in, based on free space, dimensions, turnover and storage rules. Fast movers go closer to the picking area.

**3. Picking.** When an order comes in, the system creates a pick task and plans a route through the warehouse. Common strategies:

- **Single-order picking**: one picker collects one order.
- **Batch picking**: several orders in one walk.
- **Zone picking**: each picker covers their own zone and the order is handed along.

**4. Packing.** Staff scan the picked items, the WMS checks the order is complete, suggests a box size and prints the label.

**5. Shipping.** Parcels are sorted by carrier or route, documents are generated, and the order status goes back to the store and the customer.

## Barcodes and bin locations

**Barcodes** are the foundation of a WMS. Everything gets scanned: items, bins, boxes, pallets, orders. Every movement is confirmed by a scan, so mistakes are caught on the spot, not when a customer complains.

**Bin locations** (location addressing) give every storage spot a code. A common scheme:

```text
A-03-02-1
│  │  │  └─ position on the shelf
│  │  └──── level (shelf)
│  └─────── rack
└────────── warehouse zone
```

This addressing gives you two things:

- Items can be stored wherever there's room rather than in a fixed spot, which saves space.
- A new hire works almost as accurately as a veteran, because the system guides them, not memory.

## How a WMS differs from stock tracking in an ERP

| | ERP / 1C stock tracking | WMS |
|---|---|---|
| **Answers** | How much is in the warehouse | Where every unit is |
| **Level of detail** | Whole warehouse | Zone, rack, bin |
| **Main users** | Accounting, purchasing, managers | Warehouse staff, pickers, warehouse manager |
| **Tasks for staff** | None | Receiving, putaway and picking tasks |
| **Hardware** | Desktop computer | Handheld scanners, label printers |

In practice they work **together**: the ERP holds orders, prices and book stock, while the WMS carries out the physical operations and sends confirmed data back to the ERP.

## When a warehouse needs a WMS

- **Picking errors** keep growing: wrong items, missing items.
- Stock **goes missing**: it's in the records but nobody can find it.
- Picking an order takes too long, especially on peak days.
- You depend heavily on a few experienced workers who "know where everything is".
- You need to track **batches, expiry dates or serial numbers**.

For a small warehouse handling a dozen orders a day, a WMS may be overkill. A stock module and clearly labeled shelves can be enough.

## FAQ

### Can I run a WMS without dedicated handheld scanners?

Many systems run on smartphones using the camera or a paired Bluetooth scanner. For high volumes, professional handhelds are usually more convenient and durable.

### Do I need a WMS if I use a fulfillment provider?

If a fulfillment provider runs the warehouse and picking, the WMS is on their side. What matters to you is that their system exchanges stock and order statuses with your store via API.

### How does a WMS connect to an online store and marketplaces?

Through an integration: orders flow into the WMS for picking, and statuses, tracking numbers and current stock flow back. The SKU is usually the shared key.
