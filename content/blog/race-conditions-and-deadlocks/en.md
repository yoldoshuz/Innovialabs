---
title: Race Conditions and Deadlocks: Causes and How to Prevent Them
description: How race conditions and deadlocks appear, how to reproduce them in code and fix them with locks, atomic operations, lock ordering and message queues.
summary: A race condition happens when threads change shared data without synchronization; a deadlock happens when threads wait on each other's resources in a cycle. Fix them with synchronization, a consistent lock order and less shared mutable state.
---
## The short answer

A **race condition** is when the result depends on the order in which threads or processes touch shared data. The code passes tests and breaks under load.

A **deadlock** is when threads wait for each other forever: the first holds resource A and waits for B, the second holds B and waits for A. The program does not crash, it just hangs.

Both bugs are hard to reproduce, so it pays to understand them up front instead of hunting them in production.

## Reproducing a race

A "read, modify, write" sequence is not atomic. Between the read and the write another thread can update the value, and its change is lost.

```python
import threading

balance = 0

def deposit(n):
    global balance
    for _ in range(n):
        current = balance      # read
        balance = current + 1  # write

threads = [threading.Thread(target=deposit, args=(100_000,)) for _ in range(4)]
for t in threads: t.start()
for t in threads: t.join()
print(balance)  # may be less than 400000
```

Real systems hit the same problem with stock levels, balances and counters: two requests both read "1 item left" and both place an order.

## How to fix a race

- **Lock (mutex).** Only one thread runs the critical section at a time.

```python
lock = threading.Lock()

def deposit(n):
    global balance
    for _ in range(n):
        with lock:
            balance += 1
```

- **Atomic operations.** For simple counters use `AtomicInteger` in Java or the `sync/atomic` package in Go. They are faster than a mutex but cover only a single variable.
- **Atomicity in the database.** Instead of reading in code and writing back, put the condition into the query itself:

```sql
UPDATE products SET stock = stock - 1
WHERE id = 42 AND stock > 0;
```

If zero rows were affected, the item is out of stock. For more complex logic use transactions and `SELECT ... FOR UPDATE`.

- **Message passing.** One thread owns the data, others send it tasks through a queue (`queue.Queue`, Go channels, actors). No shared mutable state, no race.

## Reproducing a deadlock

```python
import threading, time

a, b = threading.Lock(), threading.Lock()

def worker1():
    with a:
        time.sleep(0.1)
        with b: pass

def worker2():
    with b:
        time.sleep(0.1)
        with a: pass

threading.Thread(target=worker1).start()
threading.Thread(target=worker2).start()  # the program hangs
```

## How to avoid deadlocks

1. **Consistent lock order.** If every thread takes locks strictly as A then B, a waiting cycle is impossible. Order by resource id: when transferring between accounts, lock the account with the smaller id first.
2. **Timeouts.** `lock.acquire(timeout=1)` lets a thread back off, release what it holds and retry.
3. **Small critical sections.** Never hold a lock during network calls, I/O or calls into someone else's code.
4. **One lock instead of several**, if performance allows.
5. **Queues and immutable data** remove the problem at the architecture level.

Databases deadlock too: the DBMS detects it and rolls back one of the transactions. Your code must be able to retry it.

## How to detect them

| Tool | What it finds |
|---|---|
| `go test -race`, `go run -race` | data races in Go |
| ThreadSanitizer (`-fsanitize=thread`) | races in C/C++ and Rust |
| Thread dumps (`jstack`, `py-spy dump`) | exactly where threads are stuck |
| Database logs | transaction deadlocks |
| Load tests | races that only show with parallel requests |

Common mistakes: testing behavior with a single request, assuming `+=` is atomic, holding a lock during an HTTP call, and catching a deadlock error without retrying.

## FAQ

### Python has the GIL, so there are no races, right?

There are. The GIL protects the interpreter's internals, but a thread can be switched out between reading and writing your variable. Races also happen between processes and between database requests.

### Locks or queues: which should I choose?

For a small section with a shared counter, a lock or an atomic operation is enough. When there is a lot of shared state and more threads, queues with a single data owner are usually easier to maintain.

### Do tests find these bugs?

Regular unit tests rarely do. You need race detectors, load tests with parallel requests, and code review that asks: "what happens if two threads run this at the same time?"
