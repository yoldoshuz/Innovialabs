---
title: Goroutines and Channels in Go: Concurrency Guide
description: How to start goroutines, pass data through buffered and unbuffered channels, and use select, WaitGroup and context without goroutine leaks.
summary: A goroutine is a lightweight function started with go, a channel is a safe way to pass it data, and WaitGroup plus context control shutdown so goroutines do not leak.
---

## The short answer: how Go does concurrency

A **goroutine** is a function the Go runtime runs concurrently with the rest of your code. You start it with the `go` keyword, and it is cheap: thousands of goroutines at once are normal.

A **channel** is a typed pipe goroutines use to exchange data. The Go motto: do not communicate by sharing memory; share memory by communicating.

```go
func main() {
    ch := make(chan string)
    go func() {
        ch <- "done"
    }()
    fmt.Println(<-ch)
}
```

Without the read from the channel, `main` would exit before the goroutine and the message would be lost.

## Unbuffered vs buffered channels

| Type | Creation | Behavior |
|---|---|---|
| Unbuffered | `make(chan int)` | A send waits until someone receives. It is a sync point |
| Buffered | `make(chan int, 10)` | A send blocks only when the buffer is full |

Practical rules:

- Use an **unbuffered** channel when it matters that the receiver actually took the value.
- Use a **buffered** one to absorb bursts between a fast producer and a slow consumer. A buffer does not fix a deadlock, it only delays it.
- **The sender closes the channel**, not the receiver. Receiving from a closed channel returns the zero value; sending to one panics.
- `for v := range ch` reads until the channel is closed.

## select: waiting on several events

`select` waits for whichever channel is ready first. The classic use is a timeout:

```go
select {
case res := <-results:
    fmt.Println(res)
case <-time.After(2 * time.Second):
    fmt.Println("timeout")
}
```

A `default` branch makes `select` non-blocking: if no channel is ready, it runs immediately.

## WaitGroup: wait for a group of goroutines

When you do not need a result, only completion, use `sync.WaitGroup`:

```go
var wg sync.WaitGroup
for _, url := range urls {
    wg.Add(1)
    go func(u string) {
        defer wg.Done()
        fetch(u)
    }(url)
}
wg.Wait()
```

Call `Add` **before** starting the goroutine and `Done` via `defer` so it runs even on an early return.

## context: cancellation and deadlines

`context.Context` carries a cancellation signal down the call chain. It is the main tool against stuck goroutines:

```go
func worker(ctx context.Context, jobs <-chan int) {
    for {
        select {
        case <-ctx.Done():
            return
        case j, ok := <-jobs:
            if !ok {
                return
            }
            process(j)
        }
    }
}
```

Create contexts with `context.WithTimeout` or `context.WithCancel`, and always `defer cancel()`.

## How to avoid goroutine leaks

A leak is a goroutine blocked forever that never exits, holding its memory. Common causes:

- **Sending to a channel nobody reads**, for example after the caller timed out. Fix: a buffer of 1, or a `select` with `ctx.Done()`.
- **Reading from a channel nobody will close.** Agree on who owns the channel and who closes it.
- **An endless loop that never checks the context.**
- **A missing `wg.Done()`** — `Wait` blocks forever.

To check: `runtime.NumGoroutine()` in tests or the `pprof` profiler shows whether the goroutine count keeps growing.

## Common mistakes

- **Data races** when several goroutines write to a shared map or slice. Run tests with the `-race` flag.
- **Capturing the loop variable.** Recent Go versions give each iteration its own variable, but in older code pass the value as an argument.
- **Unbounded goroutines**, one per task. For thousands of tasks, use a worker pool with a fixed number of goroutines.

## FAQ

### When should I use a mutex instead of a channel?
To protect shared state such as a counter or a cache, `sync.Mutex` is simpler and clearer. Channels fit better when data flows from one processing stage to the next.

### How many goroutines can I start?
Goroutines are light but not free, and external resources like a database or an API are limited. Cap concurrent operations with a worker pool or a semaphore.

### Do I always have to close a channel?
No. Close it when the receiver needs to know the data has ended, as with `range`. An unused channel is cleaned up by the garbage collector.
