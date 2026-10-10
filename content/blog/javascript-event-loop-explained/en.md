---
title: How the JavaScript Event Loop Works: Tasks and Microtasks
description: Understand the call stack, task queue and microtask queue in JavaScript and learn to predict the output order of setTimeout, Promise and async code.
summary: JavaScript runs on one thread: first synchronous code, then every microtask (promises, await), and only then the next task (setTimeout, events).
---
## The short answer

JavaScript runs your code on **a single thread**. The event loop decides what runs next, and it follows one rule:

1. Run the current **task** (macrotask) to completion — for example, the whole script.
2. Run **all microtasks** in the queue, including any added along the way.
3. Give the browser a chance to render.
4. Take the next task and repeat.

The key takeaway: `Promise.then` always runs before `setTimeout(..., 0)` when both are scheduled from the same task.

## Three players: stack, tasks, microtasks

- **Call stack** — while something is on it, nothing else runs.
- **Task queue** — callbacks from `setTimeout`, `setInterval`, DOM events, network responses, `postMessage`.
- **Microtask queue** — `.then/.catch/.finally` callbacks, the continuation of a function after `await`, `queueMicrotask`, `MutationObserver`.

| Source | Queue |
|---|---|
| `setTimeout`, `setInterval` | task |
| click, input, load | task |
| `Promise.then`, `await` | microtask |
| `queueMicrotask` | microtask |

Note that `setTimeout(fn, 0)` does not mean "immediately". It means "no sooner than 0 ms, and only once the stack is empty and microtasks are done".

## Example 1: the basic order

```js
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
```

Output: **1, 4, 3, 2**. Synchronous code goes first (1, 4), then the microtask (3), then the next task (2).

## Example 2: async/await

```js
async function a() {
  console.log('a1');
  await null;
  console.log('a2');
}

console.log('start');
setTimeout(() => console.log('timeout'), 0);
a();
Promise.resolve().then(() => console.log('then'));
console.log('end');
```

Output: **start, a1, end, a2, then, timeout**.

The key point: an async function's body **runs synchronously until the first `await`**. Everything after `await` becomes a microtask. It was queued before the `then` callback, so `a2` prints first.

## Example 3: nested microtasks

```js
setTimeout(() => console.log('t1'), 0);

Promise.resolve().then(() => {
  console.log('p1');
  setTimeout(() => console.log('t2'), 0);
  Promise.resolve().then(() => console.log('p2'));
});
```

Output: **p1, p2, t1, t2**. A microtask added inside a microtask runs in the same cycle — the queue is drained completely. The new `setTimeout` goes to the end of the task queue, after `t1`.

## How to solve these in an interview

1. Write down all **synchronous** output from top to bottom.
2. List what went into **microtasks**, in the order it was queued.
3. List what went into **tasks**.
4. After the synchronous code, run all microtasks, appending new ones to the end.
5. Take tasks one at a time, draining microtasks after each.

## Common mistakes and real-world impact

- **Thinking `await` blocks the thread.** It only pauses the current function; other code keeps running.
- **Endless microtasks.** If a microtask keeps scheduling another one, the browser never reaches rendering and the page freezes.
- **Heavy work on the stack.** A long loop blocks clicks and animations. Split the work into chunks or move it to a Web Worker.
- **Relying on timer precision.** The `setTimeout` delay is a minimum, not a guarantee.

Node.js has its own loop phases and `process.nextTick`, but the "microtasks before the next task" rule holds there too.

## FAQ

### Which runs first: setTimeout(0) or Promise.then?

`Promise.then`. It is a microtask, and all microtasks run before the loop moves on to the next task, which is where the `setTimeout` callback lives.

### Does await block all of JavaScript?

No. `await` pauses only its own async function and returns control to the caller. The rest of the function runs later as a microtask.

### Why does my page freeze even though I use promises?

Promises do not move code to another thread. If a `then` callback does heavy computation or a chain of microtasks never ends, the browser cannot paint a frame. Splitting the work or using a Web Worker helps.
