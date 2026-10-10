---
title: How to Prevent Overselling: Stock Reservation Strategies
description: Reserve-on-cart, on-checkout or on-payment: how to choose a stock reservation model, set timeouts, handle concurrency and sync stock across channels.
summary: For most stores the safest default is to reserve stock at checkout with a short timeout, decrement it atomically in the database, and treat one stock ledger as the single source of truth for every sales channel.
---
## The short answer

Overselling happens when two buyers get the same last unit, or when a marketplace still shows stock you already sold on your site. Three things prevent it:

- **A reservation model** that decides *when* a unit stops being available to others.
- **Atomic stock operations** so two parallel requests can never both succeed for one unit.
- **One stock ledger** that all channels read from and write to.

For most stores, **reserve on checkout** with a 10-20 minute timeout is the balanced choice. The exact timeout depends on how long your payment flow really takes.

## Three reservation models compared

| Model | When stock is held | Pros | Cons |
|---|---|---|---|
| Reserve on cart | Item added to cart | Buyer never loses the item at payment | Abandoned carts lock stock, easy to abuse |
| Reserve on checkout | Buyer starts checkout | Balanced: holds stock only for serious buyers | Needs timeouts and a release job |
| Reserve on payment | Payment confirmed | No locked stock, simplest logic | Two buyers can pay for one unit, you refund one |

**Reserve on cart** fits flash sales and limited drops, where losing the item at the last step is unacceptable. Use short cart timeouts and a per-customer quantity limit.

**Reserve on checkout** fits most catalog stores. Stock is held while the buyer enters address and pays.

**Reserve on payment** fits large stock, digital goods or made-to-order items where the chance of collision is low. You still need a plan for the rare double sale: an automatic refund and an apology message.

## Reservation timeouts

A reservation without an expiry is a slow leak of stock. Every reservation needs:

- **An `expires_at` timestamp**, set when the reservation is created.
- **A release mechanism**: a background job that frees expired reservations, or lazy cleanup when stock is read.
- **Extension rules**: if the buyer is redirected to a payment gateway, extend the hold so it outlives the gateway session.
- **A late-payment rule**: what happens if a payment confirmation arrives after the reservation expired. Usually you try to re-reserve; if stock is gone, you refund automatically.

Keep reservations as separate records, not as a counter you decrement and forget. Then you can see who holds what and release it precisely.

## Concurrency control

The classic bug: read stock (1 left), check it, then write it. Two requests read "1" at the same time and both sell. Fix it at the database level.

**Conditional atomic update** is the simplest reliable option:

```sql
UPDATE stock
SET available = available - :qty,
    reserved  = reserved + :qty
WHERE sku = :sku AND available >= :qty;
-- 0 rows affected = not enough stock
```

Other options:

- **Row locks** (`SELECT ... FOR UPDATE`) inside a transaction, when you need several checks before writing. Lock rows in a consistent order to avoid deadlocks.
- **Optimistic locking** with a version column: retry if the version changed.
- **Atomic operations in Redis** (for example a Lua script) for very high traffic, with the database as the durable record.

Also make reservation and payment callbacks **idempotent**. Gateways retry webhooks, and a repeated callback must not decrement stock twice.

## Multi-channel stock

When you sell on your site, in a physical store and on marketplaces, each channel has its own copy of stock with a sync delay. To keep them consistent:

- **One ledger is the truth**: your database, ERP or 1C, never the marketplace.
- **Push changes on every movement**, not only on a nightly schedule. Use the marketplaces' stock update APIs and queue the updates.
- **Keep a safety buffer per channel**: show slightly less than real stock on channels with slow sync.
- **Allocate stock**: for scarce items, assign fixed quotas to channels instead of sharing one pool.
- **Import orders fast**: marketplace orders should create reservations in your ledger as soon as possible.

## Common mistakes

- Checking stock in application code without an atomic write.
- Reservations with no expiry, slowly freezing the catalog.
- Counting "in cart" items as sold in reports.
- Syncing marketplace stock once a day for fast-moving goods.
- Not handling the payment that arrives after the hold expired.

## FAQ

### Which reservation model should a small store choose?

Start with reserve on checkout and a timeout that covers your real payment time. It protects buyers who are paying without freezing stock in abandoned carts.

### Is a database transaction alone enough to prevent overselling?

Not always. Depending on the isolation level, two transactions can still read the same value. Use a conditional update or an explicit row lock so the check and the write happen as one operation.

### How do I stop marketplaces from selling items I no longer have?

Keep one stock ledger as the source of truth, push updates on every change, and show a safety buffer on channels where sync is slow.
