---
title: Kotlin Coroutines: A Practical Introduction
description: Suspend functions, launch vs async, dispatchers, structured concurrency and cancellation in Kotlin, explained with network call examples.
summary: Kotlin coroutines let you write async code sequentially: suspend functions do not block threads, launch and async start work inside a scope, and cancellation flows down the hierarchy.
---

## What coroutines are and why you want them

A **coroutine** is a computation that can suspend and resume later without blocking a thread. In Kotlin this lets you write network and database code as plain sequential code, without callbacks:

```kotlin
suspend fun loadProfile(id: String): Profile {
    val user = api.getUser(id)       // suspends, thread is free
    val orders = api.getOrders(id)
    return Profile(user, orders)
}
```

Coroutines come from the **kotlinx.coroutines** library. On Android the main thread does not freeze, and the UI stays responsive.

## Suspend functions

The `suspend` modifier means the function may pause. You can call it only from another suspend function or from a coroutine.

What matters:

- `suspend` **does not** move work to the background by itself. Heavy work still has to run on a suitable dispatcher.
- A good suspend function is **main-safe**: it can be called from the main thread because it switches context itself.

```kotlin
suspend fun readFile(path: String): String =
    withContext(Dispatchers.IO) {
        File(path).readText()
    }
```

## launch vs async

| | `launch` | `async` |
|---|---|---|
| Returns | `Job` | `Deferred<T>` |
| Result | Not needed | Obtained via `await()` |
| Use it for | Fire and forget: save, send | Parallel calls that return data |

Loading two resources in parallel:

```kotlin
suspend fun loadScreen(id: String) = coroutineScope {
    val user = async { api.getUser(id) }
    val orders = async { api.getOrders(id) }
    Screen(user.await(), orders.await())
}
```

If one call fails, the other is cancelled and the error reaches the caller.

## Dispatchers: where code runs

- **Dispatchers.Main** — the UI thread (Android, desktop).
- **Dispatchers.IO** — network, files, databases: blocking I/O.
- **Dispatchers.Default** — CPU-heavy work: parsing, sorting, image processing.

Switch with `withContext` rather than launching new coroutines. Many networking libraries, such as Retrofit, expose suspend functions themselves, so their calls do not need wrapping in `Dispatchers.IO`.

## Structured concurrency

Every coroutine starts inside a **CoroutineScope**, and this is the core principle:

- A parent waits for all its children.
- A failing child cancels the parent and its siblings.
- Cancelling a scope cancels everything inside it.

On Android, use the built-in scopes: `viewModelScope` in a ViewModel and `lifecycleScope` in Activities and Fragments. They are cancelled with the component, so requests stop when the screen closes.

```kotlin
class ProfileViewModel : ViewModel() {
    fun load(id: String) {
        viewModelScope.launch {
            try {
                _state.value = UiState.Data(repo.loadProfile(id))
            } catch (e: IOException) {
                _state.value = UiState.Error
            }
        }
    }
}
```

**Avoid `GlobalScope`**: its coroutines are not tied to any lifecycle and leak easily.

## Cancellation

Cancellation is **cooperative**: your code has to take part.

- All suspend functions in kotlinx.coroutines (`delay`, `withContext` and others) check for cancellation.
- In long loops, call `ensureActive()` or check `isActive`.
- Do not swallow `CancellationException` in a generic `catch (e: Exception)` — rethrow it.
- Release resources in `finally`; if that requires a suspend call, wrap it in `withContext(NonCancellable)`.

A timeout on a network call:

```kotlin
val result = withTimeoutOrNull(5_000) { api.getUser(id) }
```

## Common mistakes

- **runBlocking in production code** blocks the thread — it belongs in `main` and tests.
- **Launching coroutines without a scope** or in `GlobalScope`.
- **Heavy computation on Dispatchers.Main**, which makes the UI stutter.
- **async without await**: the error may get lost or surface unexpectedly.

## FAQ

### Are coroutines threads?
No. Coroutines run on threads, but one coroutine can resume on a different thread after suspending. Thousands of coroutines can run on a small thread pool.

### How do coroutines compare to RxJava?
Coroutines give you a sequential code style and are built into the language and Jetpack. For data streams, coroutines offer Flow. RxJava is still common in existing projects.

### How do I test coroutine code?
Use `kotlinx-coroutines-test` and its `runTest` function: it skips delays using virtual time, so tests run fast.
