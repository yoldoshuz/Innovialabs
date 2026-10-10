---
title: JavaScript Promises and async/await: A Practical Guide
description: From callbacks to promises to async/await: error handling, Promise.all, allSettled and race, and running requests in parallel vs sequentially.
summary: A promise is an object holding a future result and async/await is cleaner syntax on top of it; run independent requests in parallel with Promise.all and catch errors with try/catch.
---
## The essentials

A **promise** is an object representing the result of an asynchronous operation: it either fulfills with a value or rejects with an error. **async/await** is syntax on top of promises that lets you write asynchronous code as if it were synchronous.

Three rules cover most cases:

- catch errors with `try/catch` around `await`;
- run independent operations **in parallel** with `Promise.all`;
- do not forget `await` — otherwise you get a promise instead of data.

## From callbacks to promises

Asynchronous code used to rely on callbacks, and nesting grew fast:

```js
getUser(id, (err, user) => {
  if (err) return handle(err);
  getOrders(user.id, (err, orders) => {
    if (err) return handle(err);
    render(orders);
  });
});
```

Promises turn this into a flat chain with a single error handler:

```js
getUser(id)
  .then((user) => getOrders(user.id))
  .then((orders) => render(orders))
  .catch(handle);
```

## async/await: same code, easier to read

```js
async function showOrders(id) {
  try {
    const user = await getUser(id);
    const orders = await getOrders(user.id);
    render(orders);
  } catch (err) {
    handle(err);
  } finally {
    hideLoader();
  }
}
```

Remember: **an async function always returns a promise**. Even `return 5` inside it gives you `Promise<5>`.

If the server responds with an error status such as 404, `fetch` does not reject — check `response.ok` yourself:

```js
const res = await fetch('/api/items');
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const items = await res.json();
```

## Parallel or sequential

A common mistake is awaiting independent requests one after another:

```js
// sequential: the second request starts only after the first finishes
const user = await getUser(id);
const news = await getNews();
```

If the requests do not depend on each other, start them together:

```js
const [user, news] = await Promise.all([getUser(id), getNews()]);
```

Go sequential only when the next step needs the previous result.

## Promise.all, allSettled, race, any

| Method | Settles when | Use it when |
|---|---|---|
| `Promise.all` | all fulfill, or the first rejects | every result is required |
| `Promise.allSettled` | all have settled | you need both successes and failures |
| `Promise.race` | the first one settles, either way | timeouts |
| `Promise.any` | the first one fulfills | several mirrors of one resource |

A timeout with `race`:

```js
const timeout = (ms) =>
  new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms));

const data = await Promise.race([fetchData(), timeout(5000)]);
```

To actually cancel a `fetch`, use `AbortController` — `race` only stops waiting, the request keeps running.

## Common mistakes

- **`await` inside `forEach`.** `forEach` does not wait for promises. Use `for...of` for sequential work or `Promise.all` with `map` for parallel work.
- **A missing `await`.** The variable holds a promise and the error becomes unhandled.
- **An empty `catch`.** A swallowed error is the worst kind of bug. At least log it.
- **Too many parallel requests.** `Promise.all` over a thousand items can overload an API. Process in batches.
- **Mixing styles.** Within one function, pick either `then` or `await`.

```js
// wrong
items.forEach(async (item) => await save(item));

// parallel
await Promise.all(items.map((item) => save(item)));

// sequential
for (const item of items) {
  await save(item);
}
```

## FAQ

### Which is better: then or async/await?

They behave the same; async/await is simply easier to read, especially with conditions and loops. `then` is handy for short chains and in places where `await` is not available.

### What happens if one promise in Promise.all rejects?

`Promise.all` rejects immediately with that error, and you do not get the other results. If you need every outcome regardless of failures, use `Promise.allSettled`.

### Can I use await outside an async function?

ES modules support top-level await, so you can use it at the top level of a module. Inside regular functions, `await` only works in `async` ones.
