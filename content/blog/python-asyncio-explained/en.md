---
title: Python asyncio Explained: async, await and the Event Loop
description: How coroutines, the event loop, tasks and gather work in asyncio, when async speeds code up, when it does not, and how to avoid blocking calls.
summary: asyncio lets one thread handle many I/O operations while they wait for the network or disk; it does not speed up CPU-bound work — use processes for that.
---

## The essence in one paragraph

**asyncio** is a way to run many waiting operations in a single thread. While one request waits for a network response, the **event loop** switches to another. The code does not get faster by itself — it simply stops sitting idle. That is why asyncio wins on **I/O** (HTTP, databases, sockets) and gives nothing for **heavy computation**.

## Key concepts

- **Coroutine** — a function declared with `async def`. Calling it does not run the code; it creates a coroutine object.
- **`await`** — the point where a coroutine says "I am waiting, do something else". Switching happens only at these points.
- **Event loop** — the scheduler that decides which coroutine to resume. Started with `asyncio.run()`.
- **Task** — a coroutine scheduled on the loop to run concurrently with others. Created with `asyncio.create_task()`.
- **`gather`** — runs several coroutines concurrently and waits for all results.

## A minimal example

```python
import asyncio

async def fetch(i: int) -> int:
    await asyncio.sleep(1)  # simulates a network request
    return i

async def main() -> None:
    results = await asyncio.gather(*(fetch(i) for i in range(3)))
    print(results)  # [0, 1, 2]

asyncio.run(main())
```

Three one-second "requests" finish in about one second, not three: all three waits overlap.

## Tasks: start and keep working

```python
async def main() -> None:
    task = asyncio.create_task(fetch(1))
    # do other work here
    result = await task
```

Keep a reference to every task you create and always await it. A task with no references may be garbage-collected before it finishes — the Python documentation warns about this explicitly.

## When async helps and when it does not

| Scenario | Effect of asyncio |
|---|---|
| Many HTTP requests to an API | Significant: waits overlap |
| Telegram bot, web server, websockets | High: many connections on one thread |
| Database queries via an async driver | Yes, if the driver is truly asynchronous |
| Image processing, ML, parsing huge files | None: the CPU is busy, nothing to switch to |
| A single sequential request | None: nothing to wait for in parallel |

For CPU-bound work use **processes** (`ProcessPoolExecutor`, `multiprocessing`) or move computation into separate services and queues.

## The main pitfall: blocking calls

The event loop runs in one thread. If a coroutine calls something **synchronous and slow**, the whole application stalls:

- `time.sleep()` instead of `await asyncio.sleep()`;
- synchronous HTTP clients such as `requests` instead of async ones;
- synchronous database drivers;
- heavy computation directly in a handler.

If you cannot replace a synchronous library, push the call to a separate thread:

```python
data = await asyncio.to_thread(blocking_function, arg)
```

## Other common mistakes

- **Forgetting `await`.** The coroutine never runs, and Python warns "coroutine was never awaited".
- **Unbounded concurrency.** Thousands of simultaneous requests can hit API limits or exhaust connections. Limit them with `asyncio.Semaphore`.
- **Errors in `gather`.** By default the first exception propagates immediately. If you need every result, pass `return_exceptions=True` and check each one.
- **Calling `asyncio.run()` inside a running loop.** Inside coroutines use `await`, not a new loop.

## FAQ

### Is asyncio multithreading?

No. Usually everything runs in one thread, and switching happens only at `await` points. It is **concurrency**, not parallel execution on several cores.

### Should I rewrite an existing project with async?

Only if the bottleneck is waiting on I/O and you need many simultaneous connections. For a typical CRUD app with moderate load the gain may not justify the cost.

### Can I mix sync and async code?

Yes, carefully: offload synchronous calls from coroutines with `asyncio.to_thread`, and start async code from sync code with `asyncio.run` at the entry point.
