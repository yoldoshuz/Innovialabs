---
title: Database Deadlocks: Why They Happen and How to Fix Them
description: How row and table locks cause deadlocks, how to read deadlock logs in PostgreSQL and MySQL, and how consistent lock order and retries fix them.
summary: A deadlock happens when two transactions each hold a lock the other needs, so the database kills one of them; you fix it by acquiring locks in the same order everywhere, keeping transactions short, and retrying the transaction that was rolled back.
---

## The short answer

A **deadlock** is a cycle: transaction A holds a lock and waits for B, while B holds a lock and waits for A. Neither can proceed. PostgreSQL and MySQL detect the cycle, **abort one transaction** with an error and let the other continue.

Deadlocks are not data corruption. They are a signal that your code takes locks in an inconsistent order. The cure is ordering, short transactions and a retry for the victim.

## How locks create a cycle

The classic case is two transfers between the same accounts in opposite directions:

```sql
-- Session A                         -- Session B
BEGIN;                                BEGIN;
UPDATE accounts SET balance = balance - 10 WHERE id = 1;
                                      UPDATE accounts SET balance = balance - 10 WHERE id = 2;
UPDATE accounts SET balance = balance + 10 WHERE id = 2;  -- waits for B
                                      UPDATE accounts SET balance = balance + 10 WHERE id = 1;  -- waits for A: deadlock
```

Other frequent sources:

- **Batch updates in random order**: two jobs update overlapping sets of rows without `ORDER BY`.
- **Lock upgrades**: both transactions take a shared lock (`FOR SHARE`, or implicitly through a foreign key check) and then try to update the same row.
- **Foreign keys**: inserting child rows locks the parent row in shared mode, which conflicts with updates of that parent.
- **MySQL gap and next-key locks**: under Repeatable Read, InnoDB locks ranges between index records, so concurrent inserts into the same range can deadlock even with different keys.
- **Missing indexes in MySQL**: InnoDB locks the rows it scans, so an `UPDATE` without a suitable index locks far more rows than it changes.
- **Mixing table and row locks**: explicit `LOCK TABLE` or DDL in one transaction while another holds row locks.

## Reading the deadlock log in PostgreSQL

PostgreSQL waits for `deadlock_timeout` before checking for a cycle, then raises SQLSTATE `40P01`:

```text
ERROR:  deadlock detected
DETAIL:  Process 4121 waits for ShareLock on transaction 9812; blocked by process 4135.
         Process 4135 waits for ShareLock on transaction 9811; blocked by process 4121.
HINT:  See server log for query details.
CONTEXT:  while updating tuple (0,7) in relation "accounts"
```

How to read it: two processes, each waiting for the other's transaction to finish. The server log contains the exact statements of both processes. Enable `log_lock_waits = on` to also see long waits that did not become deadlocks.

## Reading the deadlock log in MySQL

InnoDB detects deadlocks immediately and returns error 1213:

```text
ERROR 1213 (40001): Deadlock found when trying to get lock; try restarting transaction
```

Run `SHOW ENGINE INNODB STATUS` and find the **LATEST DETECTED DEADLOCK** section. For each transaction it shows the last statement, **HOLDS THE LOCK(S)** and **WAITING FOR THIS LOCK TO BE GRANTED**, including the index and lock type (`lock_mode X`, `locks gap before rec`, `insert intention`). The final line says which transaction was rolled back. Only the latest deadlock is kept there; set `innodb_print_all_deadlocks = ON` to write every deadlock to the error log.

## How to fix deadlocks

**1. Lock in a consistent order.** If every code path locks rows by ascending ID, no cycle can form:

```sql
BEGIN;
SELECT id FROM accounts WHERE id IN (1, 2) ORDER BY id FOR UPDATE;
UPDATE accounts SET balance = balance - 10 WHERE id = 1;
UPDATE accounts SET balance = balance + 10 WHERE id = 2;
COMMIT;
```

The same applies to tables: if a transaction touches `orders` and `payments`, always touch them in the same order.

**2. Take the strongest lock first.** Use `FOR UPDATE` right away instead of reading with a shared lock and upgrading later.

**3. Keep transactions short.** No network calls, user input or heavy computation while holding locks.

**4. Split big batches** into smaller chunks sorted by primary key.

**5. Add proper indexes**, especially in MySQL, so statements lock only the rows they need.

**6. Retry the victim.** Even with good design, deadlocks can still happen under load. Retry the **whole transaction**, not the single statement, with a small randomized backoff:

```python
for attempt in range(3):
    try:
        with conn.transaction():
            transfer(conn, from_id, to_id, amount)
        break
    except DeadlockDetected:
        if attempt == 2:
            raise
        time.sleep(random.uniform(0.05, 0.2) * (attempt + 1))
```

Make sure the transaction is safe to repeat: no emails sent or external APIs called inside it.

## Deadlock or just a long wait?

A plain lock wait is not a deadlock: one transaction simply waits for another to finish. It shows up as slow queries, not errors. Use `lock_timeout` in PostgreSQL or `innodb_lock_wait_timeout` in MySQL to cap such waits, and look at `pg_locks` with `pg_stat_activity` to see who is blocking whom.

## FAQ

### Can I disable deadlock detection?

You should not rely on that. Without detection, transactions in a cycle would wait until a timeout, holding locks and blocking others. Detection plus retries is the safer default.

### Does a higher isolation level prevent deadlocks?

No. Higher levels can add more locks or serialization failures. Deadlocks are prevented by lock order and transaction design, not by the isolation level.

### How many deadlocks are acceptable?

Occasional deadlocks that are retried successfully are normal under concurrency. A steady or growing number in the logs means a specific code path takes locks in inconsistent order and should be fixed.
