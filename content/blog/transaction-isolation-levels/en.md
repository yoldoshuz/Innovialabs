---
title: Transaction Isolation Levels: Dirty Reads to Serializable
description: How dirty reads, non-repeatable reads, phantoms and lost updates happen, which isolation level stops each one, and when to use SELECT FOR UPDATE.
summary: Isolation levels define which anomalies concurrent transactions can see: Read Committed blocks dirty reads, Repeatable Read also blocks non-repeatable reads, and Serializable behaves as if transactions ran one by one; for read-modify-write logic use SELECT FOR UPDATE or an atomic UPDATE.
---

## The short answer

When two transactions touch the same data at the same time, the database has to decide what each one sees. The **isolation level** is that decision. Higher levels prevent more anomalies but cause more waiting or more aborted transactions that you must retry.

| Level | Dirty read | Non-repeatable read | Phantom | Lost update |
|---|---|---|---|---|
| Read Uncommitted | possible | possible | possible | possible |
| Read Committed | no | possible | possible | possible |
| Repeatable Read | no | no | depends on DBMS | depends on DBMS |
| Serializable | no | no | no | no |

Defaults differ: **PostgreSQL uses Read Committed**, **MySQL InnoDB uses Repeatable Read**.

## The four anomalies

Each example uses two sessions, A and B, working on an `accounts` table.

**Dirty read**: A reads data that B has changed but not committed. If B rolls back, A acted on a value that never existed.

```sql
-- B
BEGIN; UPDATE accounts SET balance = 0 WHERE id = 1;
-- A (Read Uncommitted in MySQL) sees balance = 0
-- B
ROLLBACK;
```

**Non-repeatable read**: A reads a row twice inside one transaction and gets different values because B committed an update in between.

**Phantom read**: A runs the same `WHERE` query twice and gets a different set of rows because B inserted or deleted matching rows.

**Lost update**: both transactions read the same value, compute a new one in the application and write it back. The second write silently overwrites the first.

```sql
-- A and B both read balance = 100
-- A writes 100 + 50 = 150, commits
-- B writes 100 - 30 = 70, commits  -> A's +50 is lost
```

## How MVCC and each level prevent them

Both PostgreSQL and InnoDB use **MVCC (multi-version concurrency control)**: an update creates a new row version, and readers see a **snapshot** instead of waiting for writers. The isolation level decides how often that snapshot is taken.

- **Read Committed**: a new snapshot for **every statement**. You never see uncommitted data, but two statements in one transaction can see different committed states.
- **Repeatable Read**: one snapshot for the **whole transaction**. Repeated reads return the same data. In PostgreSQL this level also hides phantoms and, if you try to update a row changed by a concurrent committed transaction, it raises a serialization error instead of losing the update. In InnoDB, plain reads use the snapshot, while locking reads and updates work on the latest version and use gap locks against phantoms.
- **Serializable**: the result must match some serial order. PostgreSQL uses Serializable Snapshot Isolation and aborts a transaction when it detects a dangerous pattern, such as **write skew**. MySQL achieves it mostly through extra locking.
- **Read Uncommitted**: in PostgreSQL it behaves like Read Committed; dirty reads are not possible there.

Key consequence: at Repeatable Read and Serializable, your code **must retry** transactions that fail with a serialization error (SQLSTATE `40001`).

## SELECT FOR UPDATE and atomic updates

Most real bugs are lost updates in read-modify-write code at the default Read Committed level. You have three practical fixes.

**1. Atomic update** when the logic fits in SQL:

```sql
UPDATE accounts SET balance = balance - 30
WHERE id = 1 AND balance >= 30;
```

**2. Pessimistic lock** with `SELECT ... FOR UPDATE`, which locks the row until commit:

```sql
BEGIN;
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;
-- application checks and computes
UPDATE accounts SET balance = 70 WHERE id = 1;
COMMIT;
```

Other transactions trying to lock or update the same row wait. Variants: `FOR UPDATE NOWAIT` fails immediately, `FOR UPDATE SKIP LOCKED` skips locked rows, which is handy for job queues.

**3. Optimistic locking** with a version column:

```sql
UPDATE orders SET status = 'paid', version = version + 1
WHERE id = 42 AND version = 7;
-- 0 rows updated -> someone changed it, reload and retry
```

## How to choose

- **Read Committed** plus atomic updates or `FOR UPDATE` covers most web applications.
- **Repeatable Read** suits consistent reports and multi-step reads within one transaction.
- **Serializable** fits complex invariants across several rows (for example, "at least one doctor on duty"), provided you have retry logic.
- Keep transactions short: long transactions hold locks and old row versions longer.

## FAQ

### Should I just use Serializable everywhere?

Usually not. It is the safest, but it increases aborted transactions under contention and requires retries everywhere. Use it where invariants span multiple rows and simpler tools do not fit.

### Does SELECT FOR UPDATE block normal reads?

In PostgreSQL and InnoDB, plain `SELECT` without a locking clause is not blocked: it reads its snapshot. Only other locking reads and writes on the same rows wait.

### Why do I get different behavior in PostgreSQL and MySQL at the same level?

The SQL standard defines levels by forbidden anomalies, not by implementation. Each engine implements them differently, so check the documentation of your database, for example the [PostgreSQL transaction isolation page](https://www.postgresql.org/docs/current/transaction-iso.html).
