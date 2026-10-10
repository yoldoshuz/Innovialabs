---
title: What Is an ORM: Pros, Cons and Popular Examples
description: How object-relational mapping works with Prisma, Django ORM, SQLAlchemy and Hibernate examples, what the N+1 problem is, and when raw SQL is the better choice.
summary: An ORM is a library that lets you work with database tables as objects in code and generates the SQL for you. It speeds up routine development, but you still need to know which queries hit the database, or you will run into the N+1 problem and slow pages.
---

## What an ORM is

**ORM (Object-Relational Mapping)** is a layer between application code and a relational database. You define models — `User`, `Order`, `Product` — and the ORM maps them to tables, turns method calls into SQL and returns results as objects.

Instead of writing `SELECT * FROM users WHERE is_active = true`, you write something like `User.objects.filter(is_active=True)`, and the ORM builds the query, binds parameters and creates the objects.

## Popular ORMs

| ORM | Language | Highlights |
|---|---|---|
| **Prisma** | TypeScript, JavaScript | Schema in a separate file, generated type-safe client, built-in migrations |
| **Django ORM** | Python | Part of Django, with migrations and an admin panel out of the box |
| **SQLAlchemy** | Python | Flexible library: a high-level ORM plus a SQL expression builder |
| **Hibernate** | Java | Implementation of the JPA standard, models defined with `@Entity` annotations |

Here is "active users with their orders" in Prisma:

```ts
const users = await prisma.user.findMany({
  where: { isActive: true },
  include: { orders: true },
});
```

## Pros

- **Development speed.** Routine create, read and update operations take one line.
- **Safety.** Parameters are bound automatically, which protects against SQL injection in normal use.
- **Migrations.** Schema changes live in code and are applied the same way in every environment.
- **Types and autocomplete.** Especially with Prisma and modern SQLAlchemy: typos in field names show up before you run the code.
- **Portability.** Switching from PostgreSQL to MySQL is easier, though in practice it is rarely free.

## Cons

- **Hidden queries.** One line of code can trigger dozens of SQL queries.
- **Suboptimal SQL** for complex reports, window functions and database-specific features.
- **Another abstraction.** To debug performance you still need to understand SQL and indexes.

## The N+1 problem

The best-known ORM trap. You fetch a list of N records in one query, then access a related object inside a loop — and the ORM runs one more query per record. That is N+1 queries instead of one or two.

```python
# Django: 1 query for orders + 1 query per customer
for order in Order.objects.all():
    print(order.customer.name)

# Fixed: orders and customers loaded in one query with a JOIN
for order in Order.objects.select_related("customer"):
    print(order.customer.name)
```

On a local database with ten orders you will not notice. In production, with thousands of rows and network latency, the page starts taking seconds to load.

How different ORMs solve it:

- **Django** — `select_related` for one-to-one and many-to-one relations, `prefetch_related` for one-to-many.
- **SQLAlchemy** — the `selectinload` and `joinedload` loader options.
- **Prisma** — `include` or `select` with related models.
- **Hibernate** — `JOIN FETCH` in a JPQL query, or entity graphs.

The key habit: **turn on SQL logging** in development and check how many queries each page makes.

## When raw SQL is better

- **Reports and analytics**: complex aggregations, window functions, CTEs.
- **Bulk operations**: updating or inserting hundreds of thousands of rows at once.
- **Database-specific features**: full-text search, JSONB operators, upserts with special conditions.
- **Performance-critical queries** where you need full control over the execution plan.

Almost every ORM lets you run raw SQL where needed. A healthy approach: the ORM for the bulk of routine work, SQL for the bottlenecks.

## FAQ

### Do I need to know SQL if I use an ORM?

Yes. An ORM makes queries easier to write but does not remove them. Without SQL it is hard to understand why a page is slow or which indexes to add.

### Which ORM should I pick for a new project?

Usually the one standard for your stack: Prisma or similar for TypeScript, Django ORM for Django projects, SQLAlchemy for other Python services, Hibernate for Java. Pay attention to migration quality and how easy it is to inspect generated queries.

### How do I find N+1 in an existing project?

Enable SQL logging or a profiler such as Django Debug Toolbar and open a slow page. Repeated identical queries that differ only by ID are a clear sign of N+1.
