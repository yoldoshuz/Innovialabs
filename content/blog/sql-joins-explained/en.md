---
title: SQL JOINs Explained: INNER, LEFT, RIGHT and FULL
description: INNER, LEFT, RIGHT and FULL JOIN shown on two small tables with result sets, plus duplicate rows, self joins and joining three or more tables.
summary: A JOIN combines rows from two tables by a matching condition: INNER keeps only matches, LEFT keeps every row of the left table, RIGHT keeps every row of the right table, and FULL keeps everything from both, filling the gaps with NULL.
---

## The short answer

A **JOIN** puts rows from two tables side by side when a condition is true, usually when a foreign key equals a primary key. The join type decides what happens to rows that have **no match**:

| Join | Rows without a match |
|---|---|
| `INNER JOIN` | Dropped from both sides |
| `LEFT JOIN` | Kept from the left table, right columns are `NULL` |
| `RIGHT JOIN` | Kept from the right table, left columns are `NULL` |
| `FULL JOIN` | Kept from both sides |

## Two small tables

**customers**

| id | name |
|---|---|
| 1 | Aziz |
| 2 | Malika |
| 3 | Bobur |

**orders**

| id | customer_id | total |
|---|---|---|
| 101 | 1 | 50 |
| 102 | 1 | 30 |
| 103 | 2 | 20 |
| 104 | NULL | 15 |

Bobur has no orders. Order 104 is a guest order with no customer.

## INNER JOIN

```sql
SELECT c.name, o.id AS order_id, o.total
FROM customers c
INNER JOIN orders o ON o.customer_id = c.id;
```

| name | order_id | total |
|---|---|---|
| Aziz | 101 | 50 |
| Aziz | 102 | 30 |
| Malika | 103 | 20 |

Only pairs that match. Bobur and order 104 disappear. Plain `JOIN` means `INNER JOIN`.

## LEFT JOIN

```sql
SELECT c.name, o.id AS order_id, o.total
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id;
```

| name | order_id | total |
|---|---|---|
| Aziz | 101 | 50 |
| Aziz | 102 | 30 |
| Malika | 103 | 20 |
| Bobur | NULL | NULL |

Every customer is present. This is the go-to join for "all X, with Y if it exists" and for finding rows without a pair:

```sql
-- customers who never ordered
SELECT c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;
```

## RIGHT JOIN

```sql
SELECT c.name, o.id AS order_id, o.total
FROM customers c
RIGHT JOIN orders o ON o.customer_id = c.id;
```

| name | order_id | total |
|---|---|---|
| Aziz | 101 | 50 |
| Aziz | 102 | 30 |
| Malika | 103 | 20 |
| NULL | 104 | 15 |

Every order is present. A RIGHT JOIN is a LEFT JOIN with the tables swapped, so many teams write only LEFT JOINs for readability.

## FULL JOIN

```sql
SELECT c.name, o.id AS order_id, o.total
FROM customers c
FULL JOIN orders o ON o.customer_id = c.id;
```

| name | order_id | total |
|---|---|---|
| Aziz | 101 | 50 |
| Aziz | 102 | 30 |
| Malika | 103 | 20 |
| Bobur | NULL | NULL |
| NULL | 104 | 15 |

Everything from both sides. Useful for comparing two lists, for example reconciling payments with invoices. MySQL does not support `FULL JOIN`; combine a LEFT and a RIGHT JOIN with `UNION` instead.

## Duplicate rows: why sums grow

Aziz appears twice above because he has two orders. That is correct, but it becomes a trap when you join **two one-to-many tables** at once:

```sql
-- wrong: orders x payments multiply each other
SELECT c.name, SUM(o.total)
FROM customers c
JOIN orders o   ON o.customer_id = c.id
JOIN payments p ON p.customer_id = c.id
GROUP BY c.name;
```

If Aziz has 2 orders and 3 payments, each order row is repeated 3 times and the sum is inflated. Fix it by aggregating each table separately first:

```sql
SELECT c.name, o.orders_total, p.paid_total
FROM customers c
LEFT JOIN (SELECT customer_id, SUM(total)  AS orders_total FROM orders   GROUP BY customer_id) o ON o.customer_id = c.id
LEFT JOIN (SELECT customer_id, SUM(amount) AS paid_total   FROM payments GROUP BY customer_id) p ON p.customer_id = c.id;
```

If you see `DISTINCT` added just to hide duplicates, check the join conditions first.

## Self join

A table joined to itself, with two aliases. Classic case: employees and their managers in one table.

```sql
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON m.id = e.manager_id;
```

LEFT JOIN keeps the top manager, whose `manager_id` is `NULL`.

## Joining three or more tables

Joins are applied one after another, each adding a table to the result:

```sql
SELECT o.id, c.name, p.title, oi.qty
FROM orders o
JOIN customers   c  ON c.id = o.customer_id
JOIN order_items oi ON oi.order_id = o.id
JOIN products    p  ON p.id = oi.product_id;
```

Tips: give every table a short alias, write each `ON` condition next to its table, and index the foreign key columns used in joins.

## Common mistakes

- **Filtering the right table in WHERE** after a LEFT JOIN: `WHERE o.total > 10` removes the `NULL` rows and silently turns it into an INNER JOIN. Put the condition into `ON` instead.
- **Forgetting the ON condition** or using the wrong column, which produces a huge cross product.
- **Comparing with NULL using `=`**: `NULL = NULL` is not true, so rows with `NULL` keys never match.

## FAQ

### Is there a performance difference between INNER and LEFT JOIN?

Sometimes the optimizer has more freedom with INNER JOIN, but the main factor is indexes on the join columns. Choose the join type by the result you need, not by speed.

### What is a CROSS JOIN?

It returns every combination of rows from both tables, with no condition. Three customers and four orders give twelve rows. It is useful for generating combinations, such as every product for every date, and dangerous when written by accident.

### Should I put conditions in ON or in WHERE?

For INNER JOIN the result is the same. For LEFT, RIGHT and FULL JOIN it differs: conditions in `ON` decide which rows match, while conditions in `WHERE` filter the final result and can remove the rows with `NULL`.
