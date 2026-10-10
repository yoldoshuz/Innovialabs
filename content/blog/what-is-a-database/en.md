---
title: What Is a Database and How Does It Work
description: A plain-language guide to databases: tables, rows, DBMS, queries and storage explained with online store and CRM examples, plus the main database families.
summary: A database is an organized store of information, and a DBMS is the software that saves it to disk, finds what you ask for quickly and keeps the data consistent when many users work with it at once.
---

## The short answer

A **database** is an organized collection of information stored so that it is easy to find, change and protect. Customer lists, product catalogs, order history — almost every application keeps this kind of data in a database.

Two terms are worth separating:

- **Database** — the data itself and its structure.
- **DBMS** (database management system) — the software that manages the data: PostgreSQL, MySQL, MongoDB, Redis and others.

An application does not read files on disk directly. It sends the DBMS a **query** — "find all orders from this customer in May" — and gets a ready answer back.

## Why not just a spreadsheet

A spreadsheet works while the data is small and one person edits it. Problems start when:

- hundreds of users place orders and change stock levels at the same time;
- there are millions of records and answers are needed in a fraction of a second;
- you cannot allow a payment to go through while the order fails to be created;
- access must be restricted: a sales manager sees their own deals, an accountant sees invoices.

A DBMS exists to solve exactly these problems: **concurrent access**, **fast lookup**, **integrity** and **permissions**.

## Tables, rows and columns

The most common type is the **relational** database. Data lives in tables that look like spreadsheet sheets but follow strict rules.

Take an online store:

| id | name | email | city |
|----|------|-------|------|
| 1 | Aliya | aliya@example.com | Tashkent |
| 2 | Bobur | bobur@example.com | Samarkand |

- A **table** (`customers`) describes one type of object — customers.
- A **row** (record) is one specific customer.
- A **column** (field) is one property: name, email, city. Each column has a type: number, text, date.
- A **primary key** (`id`) is a unique identifier that points to exactly one row.

Orders sit in a separate `orders` table, and each order has a `customer_id` field that refers to a customer. That is a **relationship** between tables. Customer details are stored once instead of being copied into every order.

A CRM follows the same logic: `contacts`, `deals` and `tasks` tables linked by keys.

## How a query works

Relational databases are queried with **SQL**:

```sql
SELECT name, email
FROM customers
WHERE city = 'Tashkent';
```

What happens inside:

1. The DBMS parses the query and checks that the table and columns exist.
2. The **query planner** picks the fastest way to run it: scan the whole table or use an index.
3. Data is read from memory or disk, filtered and returned to the application.

An **index** works like the index at the back of a book: instead of reading every row, the DBMS jumps straight to the matching ones. Without indexes, large tables become slow.

## How data is stored and protected

- Data lives in files on disk, and frequently used parts are cached in RAM.
- Changes are first written to a **log** (write-ahead log), so the database can recover after a power failure.
- A **transaction** groups several actions into one: "charge the card and create the order" either completes fully or not at all.
- **Backups** and **replication** (a copy of the database on another server) protect against losing a disk or a server.

## The main database families

| Family | How it stores data | Examples | Good fit |
|--------|-------------------|----------|----------|
| Relational (SQL) | Tables with relationships | PostgreSQL, MySQL | Orders, payments, CRM, most business systems |
| Document | JSON-like documents | MongoDB | Flexible structure, catalogs, content |
| Key-value | Key → value pairs | Redis | Cache, sessions, queues |
| Columnar | Data stored by column | ClickHouse | Analytics over large volumes |
| Graph | Nodes and edges | Neo4j | Social networks, recommendations |
| Search | Inverted index | Elasticsearch | Full-text search |

Most projects start with a single relational database and add others only when a specific need appears — Redis for caching, for example.

## Common beginner mistakes

- Putting everything into one huge table with duplicated data.
- Skipping types and constraints, so a "date" field ends up holding random text.
- Setting up backups only after the first data loss.
- Choosing a trendy database instead of the one that fits the task.

## FAQ

### What is the difference between a database and a DBMS?

The database is the data and its structure. The DBMS is the program that stores it, runs queries and enforces integrity. In everyday speech people often call PostgreSQL "a database", and that is fine.

### Do I need to know SQL to use a database?

App users do not — they work through an interface. Developers, analysts and anyone building reports benefit a lot from basic SQL, since it is the common language of most databases.

### Which database should a small project use?

For a website, online store or CRM, one relational database such as PostgreSQL or MySQL is usually enough. Add other types when a concrete need appears, not in advance.
