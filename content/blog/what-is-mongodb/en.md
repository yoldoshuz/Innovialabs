---
title: What Is MongoDB and When Should You Use It
description: MongoDB explained simply: documents, collections and BSON, basic CRUD operations, and an honest look at when it fits and when a relational database is safer.
summary: MongoDB is a document NoSQL database that stores data as JSON-like documents in collections without a rigid schema. It is handy for flexible and nested data, while linked financial and accounting data is usually safer in a relational database.
---

## MongoDB in short

**MongoDB** is a popular **document** database. Instead of tables with rows, it stores **documents** — JSON-like objects with nested fields and arrays. It is one of the best-known NoSQL systems.

The main idea: data the application uses together is stored together. A product card with all its attributes, variants and images can be a single document instead of five related tables.

## Documents, collections and BSON

Mapped to relational terms:

| Relational database | MongoDB |
|---------------------|---------|
| Database | Database |
| Table | Collection |
| Row | Document |
| Column | Field |
| Primary key | `_id` field |

A sample document:

```json
{
  "_id": "665f1c2a9b1e8a3f4c2d1a10",
  "name": "City backpack",
  "price": 350000,
  "tags": ["bags", "city"],
  "specs": { "volume": 20, "color": "black" }
}
```

- A **collection** is a group of documents, such as `products`. Documents in it do not have to share the same set of fields.
- **`_id`** is a unique identifier. If you leave it out, MongoDB generates one (of type `ObjectId`).
- **BSON** (Binary JSON) is the binary format MongoDB uses to store documents on disk. It parses faster than text JSON and supports extra types: dates, `ObjectId`, exact decimals with `Decimal128`, binary data.

## Basic CRUD operations

Examples for the `mongosh` shell. Drivers for Node.js, Python and other languages use the same or very similar method names.

```javascript
// Create — insert a document
db.products.insertOne({ name: "Travel mug", price: 120000, tags: ["kitchen"] })

// Read — find documents
db.products.find({ price: { $lt: 200000 } })
db.products.findOne({ name: "Travel mug" })

// Update — change a field
db.products.updateOne(
  { name: "Travel mug" },
  { $set: { price: 110000 } }
)

// Delete — remove a document
db.products.deleteOne({ name: "Travel mug" })
```

Notice that query conditions are documents too. `$lt` means "less than", `$set` means "set this field's value". Do not mix up `updateOne`, which changes individual fields through operators like `$set`, and `replaceOne`, which replaces the whole document — a classic beginner mistake.

Indexes matter in MongoDB just as in SQL: `db.products.createIndex({ price: 1 })` speeds up searches by price.

## Where MongoDB fits well

- **Heterogeneous data.** A catalog where clothing, electronics and furniture have completely different attributes.
- **Nested structures read as a whole:** a user profile with settings, an article made of content blocks.
- **Fast prototyping** while the data structure is still changing.
- **Events, logs, device data** with many records and few relationships.
- **Horizontal scaling** through sharding, when volumes are genuinely large.

## Where a relational database is safer

- **Many relationships between entities.** Customers, orders, products, warehouses and payments constantly reference each other. MongoDB has `$lookup` for joining collections, but SQL with JOINs is more natural here.
- **Money and accounting.** MongoDB supports multi-document transactions, but in relational databases transactions and integrity constraints are the core of the model, with fewer pitfalls.
- **Complex reporting** that groups data across many tables.
- **Strict data rules.** MongoDB can enforce schema validation, but by default it accepts almost any document.

## Common mistakes

- Assuming you do not need a schema. You still have one — your code now maintains it. Turn on validation.
- Copying a relational design: dozens of collections and constant `$lookup` calls.
- Unbounded arrays inside a document, such as every comment on a post. Documents have a size limit, so move that data into a separate collection.
- Forgetting indexes and backups.

## FAQ

### Is MongoDB free?

There is a free Community edition you can self-host, and the MongoDB Atlas cloud service with a free starter tier and paid plans. Check the official documentation for current license and pricing terms.

### Can I use MongoDB alongside PostgreSQL?

Yes, that is common. For example, orders and payments live in PostgreSQL, while a catalog with flexible attributes or an event log lives in MongoDB. Just make sure there is a real reason, since every database needs maintenance.

### Is MongoDB a good fit for mobile apps?

As the server-side database behind a mobile app's backend, yes — especially when the data maps naturally to documents. The app itself usually talks to an API on the server rather than to the database directly.
