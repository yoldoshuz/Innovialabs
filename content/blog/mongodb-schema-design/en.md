---
title: MongoDB Schema Design: Embedding vs Referencing
description: How to model users, products and orders in MongoDB: when to embed, when to reference, how to avoid unbounded arrays and which indexes to plan.
summary: Embed data that is read together and bounded in size, reference data that is shared, large or grows without limit, and design the schema around your most frequent queries.
---

## The rule in one paragraph

In MongoDB you design the schema around **how the application reads and writes data**, not around abstract entities. **Embed** a piece of data inside a document when it is read together with its parent, belongs only to that parent and stays small. **Reference** it by `_id` when it is shared between many documents, changes independently, is large, or can grow without a limit.

## Embedding vs referencing at a glance

| Question | Embed | Reference |
|---|---|---|
| Read together with the parent? | Almost always | Often separately |
| Owned by one parent? | Yes | Shared by many |
| Size bounded? | Small, fixed upper limit | Grows over time |
| Changes independently? | Rarely | Often |
| Needs a snapshot at a point in time? | Yes, embed a copy | — |

Keep in mind the hard document size limit (16 MB). Long before you hit it, large documents make every read and update slower.

## Modeling users, products and orders

### Users

Addresses and notification settings are few and always read with the profile — embed them.

```javascript
{
  _id: ObjectId("..."),
  email: "user@example.com",
  name: "Aziza",
  addresses: [
    { label: "home", city: "Tashkent", street: "..." }
  ],
  settings: { language: "uz", notifications: true }
}
```

Orders are **not** embedded in the user: their number grows forever.

### Products

A product is shared by many orders and carts, so it lives in its own collection. Attributes that vary by category fit naturally into a nested object.

```javascript
{
  _id: ObjectId("..."),
  sku: "TSHIRT-001",
  title: "T-shirt",
  price: 120000,
  categoryId: ObjectId("..."),
  attributes: { size: ["S", "M", "L"], color: "black" },
  stock: 42
}
```

### Orders

An order references the user, but **embeds a snapshot** of line items: name and price at the moment of purchase. If the product price changes tomorrow, the old order must not change.

```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  status: "paid",
  createdAt: ISODate("..."),
  items: [
    { productId: ObjectId("..."), title: "T-shirt", price: 120000, qty: 2 }
  ],
  total: 240000,
  shipping: { city: "Tashkent", street: "..." }
}
```

This is the **extended reference** pattern: keep the `_id` for linking and copy the few fields you need for display.

## Avoid unbounded arrays

An array that grows without a limit — all comments on a post, all events of a device, all orders of a user — is the most common MongoDB design mistake. It leads to huge documents, slow updates and a risk of hitting the size limit.

What to do instead:

- **Separate collection with a reference to the parent**: `comments` with a `postId` field and an index on it.
- **Subset pattern**: embed only the latest few items (for example, recent reviews) and keep the full list in a separate collection.
- **Bucket pattern** for time series: group events into one document per device per hour or day.

## Plan indexes for access patterns

Write down your main queries first, then create indexes for them.

```javascript
db.orders.createIndex({ userId: 1, createdAt: -1 })  // user's order history
db.orders.createIndex({ status: 1, createdAt: -1 })  // admin list by status
db.products.createIndex({ sku: 1 }, { unique: true })
db.users.createIndex({ email: 1 }, { unique: true })
```

Practical rules:

- In compound indexes follow the **ESR** order: fields filtered by Equality, then Sort, then Range.
- Indexes on array fields (multikey) work, but large arrays make them heavy.
- Check queries with `explain("executionStats")`: you want `IXSCAN`, not `COLLSCAN`.
- Every index slows down writes and uses memory, so remove unused ones.

## Common mistakes

- Copying a relational schema one-to-one and then emulating joins with many `$lookup` stages.
- Embedding shared data (like the full product) everywhere and then updating thousands of copies.
- Storing money as floating-point numbers instead of integers in minimal units or `Decimal128`.
- Skipping schema validation; MongoDB supports `$jsonSchema` validators for collections.

## FAQ

### Does MongoDB support joins?

Yes, through the `$lookup` aggregation stage. It is fine for occasional queries, but if most of your reads need joins, the data is probably relational and a SQL database may fit better.

### When is duplicating data acceptable?

When the duplicated fields rarely change or must be frozen in time, like product name and price inside an order. Plan how you will update copies if the source changes.

### Should every relation be a reference to stay flexible?

No. Referencing everything turns each screen into several queries. Start from the queries the app runs most often and embed where it removes extra reads safely.
