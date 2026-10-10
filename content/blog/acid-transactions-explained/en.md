---
title: Database Transactions and ACID Explained Simply
description: A money transfer example that explains atomicity, consistency, isolation and durability, plus how BEGIN, COMMIT and ROLLBACK work in real code.
summary: A transaction groups several database operations into one all-or-nothing unit; ACID means it either fully happens or not at all (atomicity), keeps data valid (consistency), does not get confused by parallel transactions (isolation) and survives a crash once committed (durability).
---

## The short answer

A **transaction** is a group of database operations that must succeed or fail together. The classic example is a money transfer: take 100 from Alice, add 100 to Bob. If the server crashes between those two steps, the money must not disappear.

**ACID** is the set of four guarantees that make this safe:

| Letter | Property | In the transfer example |
|---|---|---|
| A | Atomicity | Both updates happen, or neither does |
| C | Consistency | Balance never goes below zero if a rule forbids it |
| I | Isolation | A parallel transfer does not see half-finished data |
| D | Durability | After "success", the transfer survives a power cut |

## The transfer in SQL

```sql
BEGIN;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;  -- Alice
UPDATE accounts SET balance = balance + 100 WHERE id = 2;  -- Bob

COMMIT;
```

- `BEGIN` (or `START TRANSACTION`) opens the transaction.
- `COMMIT` makes all changes permanent and visible to others.
- `ROLLBACK` cancels everything done since `BEGIN`.

If anything goes wrong in the middle, you run `ROLLBACK` and the database returns to the state before the transfer.

## Atomicity: all or nothing

The database tracks every change inside a transaction. If the transaction is rolled back, or the connection drops before `COMMIT`, those changes are discarded. There is no state where Alice has lost 100 and Bob has not received it.

## Consistency: rules always hold

Consistency means a transaction moves the database from one valid state to another. "Valid" is defined by your **constraints**:

```sql
ALTER TABLE accounts
  ADD CONSTRAINT balance_not_negative CHECK (balance >= 0);
```

If Alice has only 50, the first `UPDATE` violates the check, the statement fails, and the transaction cannot be committed. Foreign keys, `NOT NULL` and `UNIQUE` work the same way. The database enforces the rules you declare; business rules you do not declare stay your application's job.

## Isolation: parallel transactions do not collide

Real systems run many transactions at once. Without isolation, two transfers from Alice could both read a balance of 100, both subtract 100 and leave the account in a wrong state.

Databases offer **isolation levels**, from weaker and faster to stricter:

| Level | What it prevents |
|---|---|
| Read Uncommitted | Almost nothing; may read uncommitted data |
| Read Committed | **Dirty reads**: you only see committed data |
| Repeatable Read | Also **non-repeatable reads**: a row you read does not change under you |
| Serializable | Also **phantoms**: the result is as if transactions ran one by one |

Defaults differ: PostgreSQL uses Read Committed, MySQL with InnoDB uses Repeatable Read. Exact behavior at each level also differs between databases, so check the documentation of yours.

For a transfer under Read Committed, lock the rows you are going to change:

```sql
BEGIN;
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;
-- check the balance in the application, then:
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

`FOR UPDATE` makes a second transfer from the same account wait until the first one finishes.

## Durability: committed means saved

When `COMMIT` returns success, the change is written to a durable log on disk (in PostgreSQL, the **write-ahead log**; in InnoDB, the **redo log**). After a crash the database replays the log and restores committed data. Durability protects against a server restart, not against losing the disk itself, which is what backups and replicas are for.

## Transactions in application code

Most drivers and ORMs wrap this pattern for you. The idea is the same everywhere:

```python
with conn:                      # opens a transaction
    with conn.cursor() as cur:
        cur.execute("UPDATE accounts SET balance = balance - %s WHERE id = %s", (100, 1))
        cur.execute("UPDATE accounts SET balance = balance + %s WHERE id = %s", (100, 2))
# commit on success, rollback on exception
```

## Common mistakes

- **Autocommit surprise**: without an explicit transaction, each statement commits on its own, so a failure between two updates leaves half a transfer.
- **Long transactions**: holding a transaction open while waiting for a user or an external API keeps locks and blocks others.
- **Calling external services inside a transaction**: a rollback cannot undo a sent SMS or payment request.
- **Ignoring retries**: under Serializable or on deadlocks the database may abort a transaction on purpose; the application should retry it.

## FAQ

### Do NoSQL databases support ACID transactions?

Many do to some extent. MongoDB, for example, supports multi-document transactions, and Redis has its own `MULTI`/`EXEC` mechanism with different guarantees. Check exactly what your database promises before relying on it for money or stock.

### Should I always use the Serializable level?

Not necessarily. It gives the strongest guarantees but causes more conflicts and retries. Many applications work well with Read Committed plus explicit row locks for critical operations like balance changes.

### What happens to a transaction if the application crashes before COMMIT?

The database notices the connection is gone and rolls the transaction back. None of its changes become visible.
