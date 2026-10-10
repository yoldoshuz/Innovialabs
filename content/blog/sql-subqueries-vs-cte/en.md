---
title: SQL Subqueries vs CTE: How to Write Readable Queries
description: How subqueries differ from CTEs and WITH clauses, when to use each, how recursive CTEs walk category trees or org charts, and what matters for performance.
summary: A subquery suits a short check inside a condition, a CTE (WITH) suits multi-step logic you want to read top to bottom, and a recursive CTE is the standard way to walk a hierarchy; in modern databases their speed is usually the same.
---

## The short answer

- A **subquery** is a query inside another query: in `WHERE`, `SELECT` or `FROM`. Good when the logic fits on one line.
- A **CTE** (Common Table Expression, `WITH`) is a named intermediate result placed before the main query. Good when there are several steps to read in order.
- A **recursive CTE** (`WITH RECURSIVE`) handles trees and graphs: categories, org charts, referral chains.

The choice is mainly about **readability**. Performance is the same in most cases; the exceptions are covered below.

## Kinds of subqueries

```sql
-- Scalar: a single value
SELECT name, price, price - (SELECT AVG(price) FROM products) AS diff
FROM products;

-- In a condition: EXISTS / IN
SELECT c.*
FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);

-- Derived table in FROM
SELECT city, avg_total
FROM (SELECT city, AVG(total) AS avg_total FROM orders GROUP BY city) t
WHERE avg_total > 500;
```

A **correlated subquery** references the outer query (like `o.customer_id = c.id` above) and logically runs once per row. The planner often rewrites it as a join, but not always.

## The same report with a CTE

Task: customers whose spending this year is above the average across all customers.

With nested subqueries:

```sql
SELECT customer_id, spent
FROM (SELECT customer_id, SUM(total) AS spent
      FROM orders WHERE created_at >= '2026-01-01'
      GROUP BY customer_id) s
WHERE spent > (SELECT AVG(spent) FROM
      (SELECT SUM(total) AS spent FROM orders
       WHERE created_at >= '2026-01-01' GROUP BY customer_id) x);
```

With a CTE:

```sql
WITH spending AS (
  SELECT customer_id, SUM(total) AS spent
  FROM orders
  WHERE created_at >= '2026-01-01'
  GROUP BY customer_id
),
avg_spending AS (
  SELECT AVG(spent) AS avg_spent FROM spending
)
SELECT s.customer_id, s.spent
FROM spending s, avg_spending a
WHERE s.spent > a.avg_spent;
```

The logic is written **once**, the steps have names, and the query reads top to bottom. You can debug each CTE separately by running it as a plain `SELECT`.

## Recursive CTE: hierarchies

Table `categories(id, parent_id, name)`. Get "Electronics" with all nested subcategories and their depth:

```sql
WITH RECURSIVE tree AS (
  SELECT id, parent_id, name, 1 AS depth
  FROM categories
  WHERE id = 10                      -- root
  UNION ALL
  SELECT c.id, c.parent_id, c.name, t.depth + 1
  FROM categories c
  JOIN tree t ON c.parent_id = t.id  -- children of rows found so far
  WHERE t.depth < 20                 -- guard against cycles
)
SELECT * FROM tree ORDER BY depth, name;
```

How it works: the first part (the **anchor**) finds the root; the second (the **recursive** part) adds the children of rows already found, step by step, until no new rows appear. The same pattern builds an "employee, manager, manager's manager" chain.

If the data can contain a cycle (A points to B, B points to A), the query never ends without a depth limit. MySQL also enforces a `cte_max_recursion_depth` limit.

## Performance

- In **PostgreSQL 12+**, a plain CTE referenced once is inlined into the main query and optimized like a subquery. You can control this explicitly with `WITH x AS MATERIALIZED (...)` or `NOT MATERIALIZED`.
- Older PostgreSQL versions always materialized CTEs, which could stop outer conditions from using indexes.
- **Materialization helps** when a heavy CTE is referenced several times.
- **NOT IN with a subquery is risky**: if the subquery returns even one `NULL`, the result is empty. Use `NOT EXISTS`.
- A correlated subquery in `SELECT` over a large table may run row by row — check the plan with `EXPLAIN`.

## How to choose

| Situation | Use |
|---|---|
| Simple "are there related rows" check | `EXISTS` |
| One value to compare against | scalar subquery |
| Three or more logical steps | CTE |
| One intermediate result used twice | CTE |
| Tree, graph, chain | recursive CTE |

## FAQ

### Is a CTE slower than a subquery?

In modern PostgreSQL, MySQL 8+ and SQL Server, usually not: the optimizer treats them the same way. Differences appear when materialization is forced, so compare plans with `EXPLAIN`.

### Can I use a CTE with UPDATE and DELETE?

Yes, in PostgreSQL, SQL Server and MySQL 8+ you can put `WITH` before `UPDATE` and `DELETE`. In PostgreSQL a CTE can itself contain `INSERT`, `UPDATE` or `DELETE` with `RETURNING`.

### For hierarchies, recursive CTE or a stored path?

A recursive CTE needs no schema changes and suits most trees. If the tree is deep and read very often, consider a materialized path column or the `ltree` extension in PostgreSQL.
