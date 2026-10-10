---
title: Common Database Design Mistakes and How to Avoid Them
description: Lists in one column, missing constraints, floats for money, messy names and time zones: the most common database schema mistakes and how to fix them.
summary: Most data problems start in the schema: keep one value per cell, enforce constraints in the database, use numeric for money, consistent names, timestamps and timestamptz for time.
---

## The short answer: the mistakes that show up most

A database schema outlives almost all the code around it. A bug in a function takes an hour to fix; a bug in the schema takes a migration and often a cleanup of data that has already piled up. The most frequent problems are:

- **lists stored in one column** instead of a separate table;
- **no constraints** — validation lives only in application code;
- **floats for money**;
- **inconsistent naming** of tables and columns;
- **no timestamps** like `created_at` and `updated_at`;
- **time stored without a time zone**.

Below is each one with a fix, using PostgreSQL. The principles are the same in MySQL and other databases; only the syntax differs.

## Mistake 1: a list of values in one column

A column like `tags = 'vip,wholesale,tashkent'` feels convenient until you need every customer tagged "wholesale", a count of them, or a renamed tag. Substring search is slow and wrong: "sale" also matches "wholesale".

**Fix:** move the values into a junction table (a many-to-many relationship).

```sql
CREATE TABLE tags (
  id   bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL UNIQUE
);

CREATE TABLE customer_tags (
  customer_id bigint NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  tag_id      bigint NOT NULL REFERENCES tags(id),
  PRIMARY KEY (customer_id, tag_id)
);
```

Arrays and JSONB in PostgreSQL are fine for data that is read as a whole and rarely filtered. If you search, join or count by a value, it needs a table.

## Mistake 2: no constraints in the database

"The backend validates it" holds until the first import script, a second service or a manual `UPDATE`. Then you get orders without a customer, negative quantities and duplicate emails.

**Put these in the schema:**

- `NOT NULL` for required fields;
- `FOREIGN KEY` for relationships between tables;
- `UNIQUE` for natural keys (email, contract number, tax ID);
- `CHECK` for simple rules: `CHECK (quantity > 0)`.

Constraints are the last line of defence, and they apply equally to every client of the database.

## Mistake 3: floats for money

`float` and `double` store numbers approximately in binary. `0.1 + 0.2` is not exactly `0.3`, and across thousands of operations the cents drift away from the accounting figures.

**Fix:**

- use `numeric(14, 2)` (or `decimal`) with explicit precision;
- or store amounts in minor units (cents, tiyin) as `bigint`;
- store the **currency** next to the amount if you have more than one: `amount numeric(14,2), currency char(3)`.

## Mistake 4: messy naming

`Users`, `order_item`, `tblProducts`, columns called `dt` and `date2` — a year later nobody remembers what lives where. Bad names slow down every query and every new developer.

**Simple rules:**

| Rule | Example |
|---|---|
| One style, usually snake_case | `order_items`, `created_at` |
| Plural table names (or singular everywhere) | `customers`, `orders` |
| Foreign key = table + `_id` | `customer_id` |
| Readable booleans | `is_active`, `has_discount` |
| No abbreviations or type prefixes | not `tbl_`, not `cst_nm` |

The specific style matters less than using **the same one** across the whole database.

## Mistake 5: no created_at and updated_at

Without creation and update times you cannot answer basic questions: when did this customer appear, what changed yesterday, which rows should the next incremental export to analytics pick up.

```sql
created_at timestamptz NOT NULL DEFAULT now(),
updated_at timestamptz NOT NULL DEFAULT now()
```

Update `updated_at` in the application or with a trigger. For important entities (money, order statuses) keep a separate **change history table**.

## Mistake 6: time without a time zone

The server runs in one zone, users are in Tashkent and Moscow, and an integration sends UTC. A `timestamp without time zone` value does not know which zone it belongs to, so "daily" reports start shifting by several hours.

**Fix:**

- store moments in time as `timestamptz` — PostgreSQL normalises them to UTC;
- convert to local time on output: `created_at AT TIME ZONE 'Asia/Tashkent'`;
- use `date` for dates without a time (birthdays, document dates).

## How to avoid these mistakes in new projects

1. Draw an **ER diagram** before writing code and review it with someone who knows the business process.
2. Bring the schema to at least **third normal form** and denormalise deliberately.
3. Change the schema only through **migrations** in the repository, never by hand on the server.
4. Add a review checklist: constraints, types, names, timestamps.

## FAQ

### Can schema mistakes be fixed in a live system?

Yes, step by step: add the new structure, copy and verify the data, switch the code, then drop the old parts. In PostgreSQL you can add constraints to large tables as `NOT VALID` and check existing rows later with `VALIDATE CONSTRAINT`.

### Should I use UUIDs or integer ids?

Both work. `bigint` ids are more compact and faster in indexes; UUIDs help when ids are generated outside the database or must not be guessable. Pick one approach and stick with it.

### Is storing JSON in a relational database a mistake?

Not when the data is genuinely flexible: settings, raw responses from an external API, attributes with varying structure. It becomes a mistake when you keep in JSON the fields you constantly filter, join and aggregate on.
