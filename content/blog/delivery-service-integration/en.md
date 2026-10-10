---
title: How to Integrate Delivery Services Into an Online Store
description: Delivery integration explained: shipping cost at checkout, creating shipments via API, tracking status sync, pickup points and handling multiple carriers.
summary: Delivery integration means four connected processes through the carrier's API: price and time estimates at checkout, automatic shipment creation after payment, status sync into the order and pickup point selection, plus a shared adapter layer in your code when you work with several carriers.
---
## The short answer

A complete carrier integration covers four tasks:

1. **Quoting** the delivery cost and time right in checkout.
2. **Creating the shipment** via API after payment, with no manual entry in the carrier's dashboard.
3. **Syncing statuses** so the store and the buyer know where the parcel is.
4. **Pickup points**: choosing one on a map and passing its code to the carrier.

With several carriers, you put an **adapter layer** between the store and their APIs so the rest of the system works with one format.

## Shipping cost at checkout

Buyers must see delivery price and time before paying. Ways to calculate it:

- **Via the carrier's API** in real time: most accurate, accounts for weight, dimensions and address.
- **From your own rate table**: faster and independent of a third-party API, but the table needs maintenance.
- **Hybrid**: the table acts as a fallback if the API does not respond in time.

What accurate quotes require:

- **weight and dimensions** for every product in the catalog;
- packing rules: several items in one box or in separate ones;
- the origin warehouse, if you have more than one;
- a normalized address or coordinates for the recipient.

Cache quotes for a short period and set a timeout on the request. Checkout should never hang because the carrier is slow.

## Creating shipments via API

After payment (or after confirming a cash-on-delivery order), the store sends the carrier a request: recipient, address or pickup point, contents, weight, declared value and the cash-on-delivery amount.

Good practice:

- a **job queue** instead of a synchronous call, so the request is retried later if the carrier's API is down;
- **idempotency**, so a retry does not create a second shipment;
- storing the **tracking number** and printing labels from your admin panel;
- a clear error for the manager if the carrier rejects the request.

## Status sync

There are two ways to receive statuses:

- **Webhooks**: the carrier sends an event whenever the status changes. Fast and efficient.
- **Polling**: the store requests statuses of active shipments on a schedule. Use it when webhooks are not available.

Every carrier names statuses differently, so you **map them to internal ones**: "Created", "Handed over", "In transit", "At pickup point", "Delivered", "Returned". Each status change triggers actions: notifying the buyer, closing the order, starting the return process.

## Pickup points

- Load the list of points from the carrier's API and **refresh it regularly**, since points open and close.
- In checkout, show points **on a map and as a list** with search, address and opening hours.
- Store the carrier's **pickup point ID** in the order, not only the address as text.
- Respect point limits: maximum weight and size, whether cash on delivery is accepted.

## Multiple carriers

To keep a new carrier from turning into a store rewrite, define a shared interface and implement it once per carrier:

```typescript
interface CarrierAdapter {
  quote(order: ShipmentDraft): Promise<Quote[]>;
  createShipment(order: ShipmentDraft): Promise<{ trackingNumber: string }>;
  getStatus(trackingNumber: string): Promise<ShipmentStatus>;
  listPickupPoints(city: string): Promise<PickupPoint[]>;
}
```

Checkout then requests options from all connected carriers in parallel and shows one combined list, while selection rules (cheapest, fastest, preferred for a region) live in a single place.

The alternative is a **shipping aggregator**: one integration gives access to several carriers. It is faster to launch, but it adds an intermediary and a dependency on its pricing and API.

## Common mistakes

- The catalog lacks weight and dimensions, so quotes are wrong.
- Creating shipments by hand with hundreds of orders a day.
- No timeout on quotes, so checkout hangs together with the carrier's API.
- Statuses are not synced and support answers "where is my order" manually.
- Returns through the carrier are not reflected in inventory.

## FAQ

### Which carrier should I integrate first?

The one that covers most of your orders by geography and format (courier or pickup points). Add the others through the same adapter once the first integration runs reliably.

### What if a carrier has no API?

Export orders in the file format the carrier accepts, import tracking numbers back manually and quote from your own rate table. Treat this as temporary: as volume grows, switch to a carrier with an API or an aggregator.

### Should tracking be shown on the store's website?

Preferably yes. An order page with status and tracking number, plus email or Telegram notifications, noticeably reduces support requests.
