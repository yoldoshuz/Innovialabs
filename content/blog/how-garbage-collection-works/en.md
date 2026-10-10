---
title: How Garbage Collection Works in Java, Go and JavaScript
description: Reference counting, mark-and-sweep and generations: how GC works in Java, Go and JavaScript, why memory leaks still happen and how to find them.
summary: A garbage collector frees objects the program can no longer reach through references; leaks happen when an unneeded object is still reachable, for example from a cache or a subscription.
---
## The short answer

A **garbage collector (GC)** automatically frees memory the program no longer uses. The key word is **reachability**: an object is alive as long as it can be reached through a chain of references from the **roots** (local variables, the stack, global and static fields). Everything unreachable is garbage.

The practical takeaway: a GC does not know you "no longer need" an object. It only knows nothing references it. That is why memory leaks are common in garbage-collected languages.

## Three core approaches

### Reference counting

Every object keeps a count of references to it. When the count reaches zero, the object is freed immediately.

- **Pro:** memory is released predictably and right away.
- **Con:** cyclic references (A points to B, B points to A) never drop to zero. CPython adds a separate cycle collector for this, and in Swift (ARC) developers break cycles with `weak`.

Java, Go and V8 do not use reference counting as their main mechanism.

### Mark-and-sweep

1. **Mark** — walk the object graph from the roots and mark everything reachable.
2. **Sweep** — free everything that is not marked.

Cycles are not a problem: if a cycle cannot be reached from the roots, the whole thing is collected. Many collectors add **compaction**, moving live objects together to avoid fragmentation.

### Generational GC

The observation behind it: **most objects die young**. The heap is split into a young and an old generation. The young one is collected often and cheaply (usually by copying survivors), the old one less often. An object that survives several collections is promoted to the old generation.

## How the three runtimes do it

| | Java (HotSpot) | Go | JavaScript (V8) |
|---|---|---|---|
| Basis | Generations + mark/compact | Concurrent tri-color mark-and-sweep | Generations + mark-sweep-compact |
| Generational | Yes | No | Yes |
| Moves objects | Yes | No | Yes |
| Tuning | Collector choice, heap sizes | `GOGC`, `GOMEMLIMIT` | V8 flags, rarely touched |

**Java.** The JVM ships several collectors: G1 (the default in modern JDKs), the low-latency ZGC and Shenandoah, plus Parallel and Serial. Choosing one is a trade-off between pause times, throughput and memory footprint.

**Go.** The collector is concurrent: it runs alongside your program with short pauses. There are no generations and no moving. Instead, the compiler uses **escape analysis** to keep many values on the stack, where they never touch the GC. `GOGC` controls how often collection runs, and `GOMEMLIMIT` sets a soft memory limit.

**JavaScript (V8).** The young generation is collected by a fast copying collector (the Scavenger), the old one by mark-sweep-compact, with much of the work done incrementally and on background threads. Other engines differ in detail, but the generational idea is widespread.

## How leaks still happen

A leak in a GC language is an object that is **unneeded but still reachable**. Typical causes:

- **Java:** static collections and caches without eviction, listeners and subscriptions never removed, `ThreadLocal` values in thread pools.
- **Go:** goroutines blocked forever on a channel, a small slice that keeps a huge backing array alive, maps that only grow.
- **JavaScript:** forgotten `addEventListener` and `setInterval` calls, closures capturing large data, detached DOM nodes still referenced somewhere.

The common pattern: **anything long-lived (globals, singletons, caches) needs a bound or explicit cleanup**.

## How to find a leak

1. **Confirm the growth.** Memory measured after collections keeps climbing under steady load — that is a warning sign. A spike alone is not.
2. **Take two heap snapshots** some time apart and compare which objects increased.
3. **Find the retaining path** — the chain of references from a root to the unwanted object. It tells you who is holding the memory.

Tools:

- **Java:** `jcmd <pid> GC.heap_dump`, analysis in Eclipse MAT or VisualVM, Java Flight Recorder.
- **Go:** `net/http/pprof` with `go tool pprof` for the heap profile, the goroutine profile to find stuck goroutines.
- **JavaScript:** the Memory tab in Chrome DevTools (heap snapshots and comparison), `node --inspect` for Node.js.

```go
import _ "net/http/pprof" // adds /debug/pprof/ to your HTTP server
```

## FAQ

### Can I trigger garbage collection manually?

Technically yes (`System.gc()`, `runtime.GC()`), but in production it almost never fixes anything. If memory keeps growing, look for retaining references instead of forcing collections.

### Why doesn't the process return memory to the OS after a collection?

Runtimes often keep freed memory for future allocations. Watch the live heap size after GC, not only the process RSS.

### Which Java collector should I pick?

Start with the default. Switch to a low-latency collector only when measurements show GC pauses break your latency requirements.
