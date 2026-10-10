---
title: Database Normalization: 1NF, 2NF, 3NF with Examples
description: A messy orders table taken step by step through 1NF, 2NF and 3NF, with clear rules for each form and when deliberate denormalization is justified.
summary: Normalization means splitting data into tables so that every fact is stored once: 1NF removes lists inside cells, 2NF removes columns that depend on only part of a composite key, 3NF removes columns that depend on other non-key columns; denormalize only deliberately, for measured read performance or reporting.
---

## The short answer

**Normalization** is a way of designing tables so that each fact lives in exactly one place. It prevents three classic problems, called **anomalies**:

- **Update anomaly**: a customer changes their phone, and you have to fix it in dozens of rows, and you miss one.
- **Insert anomaly**: you cannot add a new product until someone orders it.
- **Delete anomaly**: deleting the last order of a customer erases everything you knew about them.

The first three normal forms (1NF, 2NF, 3NF) cover most of what an application database needs.

## The starting point: a spreadsheet

Here is an orders table as it often appears when data comes from Excel:

| order_id | date | customer | phone | city | products |
|---|---|---|---|---|---|
| 101 | 2026-03-01 | Aziz | +998 90 111 | Tashkent | Pen x2, Notebook x1 |
| 102 | 2026-03-02 | Malika | +998 91 222 | Samarkand | Notebook x3 |
| 103 | 2026-03-05 | Aziz | +998 90 111 | Tashkent | Pen x1 |

It looks compact, but you cannot easily count how many pens were sold, and Aziz's phone is stored twice.

## First normal form (1NF)

**Rule:** every cell holds a single atomic value, there are no lists or repeating groups, and each row is identifiable by a key.

The `products` column holds a list, so we give each product its own row:

| order_id | product | qty | price | date | customer | phone | city |
|---|---|---|---|---|---|---|---|
| 101 | Pen | 2 | 5 | 2026-03-01 | Aziz | +998 90 111 | Tashkent |
| 101 | Notebook | 1 | 12 | 2026-03-01 | Aziz | +998 90 111 | Tashkent |
| 102 | Notebook | 3 | 12 | 2026-03-02 | Malika | +998 91 222 | Samarkand |
| 103 | Pen | 1 | 5 | 2026-03-05 | Aziz | +998 90 111 | Tashkent |

The key is now the pair **(order_id, product)**. Queries like "total pens sold" are easy, but duplication got worse.

## Second normal form (2NF)

**Rule:** the table is in 1NF and every non-key column depends on the **whole** key, not part of it. This matters only for composite keys.

Check each column against `(order_id, product)`:

- `qty` depends on both: how many of this product in this order. Stays.
- `date`, `customer`, `phone`, `city` depend only on `order_id`. Move out.
- `price` (catalog price) depends only on `product`. Move out.

Result:

- **orders** (order_id, date, customer, phone, city)
- **products** (product_id, name, price)
- **order_items** (order_id, product_id, qty)

## Third normal form (3NF)

**Rule:** the table is in 2NF and no non-key column depends on another non-key column (no **transitive dependency**).

In `orders`, the key is `order_id`, but `phone` and `city` describe the customer, not the order. They depend on `order_id` only through `customer`. Move them into their own table:

- **customers** (customer_id, name, phone, city)
- **orders** (order_id, customer_id, date)
- **products** (product_id, name, price)
- **order_items** (order_id, product_id, qty)

```sql
CREATE TABLE customers (
  customer_id SERIAL PRIMARY KEY,
  name  TEXT NOT NULL,
  phone TEXT,
  city  TEXT
);

CREATE TABLE orders (
  order_id    SERIAL PRIMARY KEY,
  customer_id INT NOT NULL REFERENCES customers,
  created_at  DATE NOT NULL
);
```

Now Aziz's phone is stored once, products exist before anyone orders them, and deleting an order does not delete a customer.

A handy summary: every non-key column should depend on **the key, the whole key and nothing but the key**.

## Common mistakes

- Storing comma-separated IDs or tags in one text column instead of a link table.
- Copying the customer name into every order "for convenience".
- Creating columns like `phone1`, `phone2`, `phone3`, a repeating group in disguise.
- Over-normalizing: splitting stable, always-used-together data (for example, a city name) into many tiny tables without any benefit.

## When denormalization is justified

**Denormalization** is deliberately storing some data redundantly. It is a tool, not a mistake, when:

- **Reports and analytics** run on a separate warehouse, where wide flat tables or a star schema make queries simpler and faster.
- A **measured** slow query needs an expensive join or count on every page view; a cached counter, such as `comments_count`, can help.
- You need a **historical snapshot**: the price and delivery address at the moment of the order must not change when the catalog or profile changes. Strictly speaking this is a different fact ("price at purchase"), so `order_items.price` is correct design.

Rules for doing it safely: start normalized, denormalize only after measuring, and keep the copies in sync with transactions, triggers or a clear update path.

## FAQ

### Do I need forms beyond 3NF?

For most applications, 3NF is enough. Higher forms such as BCNF and 4NF handle rarer cases with overlapping keys or independent multi-valued facts; it is worth knowing they exist, but you will rarely design for them explicitly.

### Is normalization slower because of all the joins?

Joins on indexed keys are what relational databases are built for, and normalized tables are usually smaller. Performance problems typically come from missing indexes, not from normalization itself.

### Does normalization apply to MongoDB and other NoSQL databases?

The ideas still help, but document databases often embed related data on purpose to read it in one request. The trade-off is the same: faster reads in exchange for keeping duplicate data consistent.
