---
title: 'How the Browser Event Loop Works: Tasks, Microtasks, Rendering'
description: The event loop without mystery: call stack, task and microtask queues, requestAnimationFrame, where rendering happens and puzzles that explain UI freezes.
summary: The browser takes one task, runs it to completion, drains the whole microtask queue and only then may paint a frame; while your code runs, the page neither repaints nor responds to clicks.
---

## The short answer

A page has one main thread. It runs JavaScript, handles events and paints. The **event loop** is the cycle that decides what happens next:

1. Take **one task** from a queue and run it to completion.
2. Run **all microtasks**, including any queued along the way.
3. If a frame is due, run **requestAnimationFrame** callbacks, recalculate style and layout, and **paint**.
4. Repeat.

The main rule follows: **while your code runs, the browser neither paints nor handles clicks**.

## The call stack

When a function is called, it is pushed onto the **call stack**; when it returns, it is popped. The event loop picks the next task only when the stack is **empty**. A long synchronous function keeps the stack busy, and everything else waits.

## Tasks and microtasks

| | Tasks | Microtasks |
|---|---|---|
| Sources | `setTimeout`, `setInterval`, user events, network callbacks, `MessageChannel` | `Promise.then/catch/finally`, `await`, `queueMicrotask`, `MutationObserver` |
| How many per turn | One | The whole queue |
| Rendering in between | Possible | Not possible |

## Puzzle 1: output order

```js
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
```

Result: `1, 4, 3, 2`.

- `1` and `4` are synchronous code in the current task.
- `3` is a microtask: it runs right after the current task finishes.
- `2` is a new task: it waits for the next loop turn. `setTimeout(fn, 0)` means "no sooner than", not "immediately".

## Puzzle 2: why the spinner never spins

```js
button.addEventListener("click", () => {
  spinner.hidden = false;
  heavyCalculation(); // several seconds of synchronous work
  spinner.hidden = true;
});
```

The spinner never appears. The DOM changes, but **painting** happens only after the handler finishes, and by then the spinner is hidden again. The page is frozen the whole time.

## Puzzle 3: microtasks can freeze too

```js
function loop() {
  Promise.resolve().then(loop);
}
loop();
```

Each microtask queues another, and the microtask queue is drained **to the end**. The browser never reaches rendering, so the tab hangs just like with `while (true)`. With `setTimeout(loop, 0)` the tab stays alive: between tasks there is a chance to paint.

## Where requestAnimationFrame fits

`requestAnimationFrame(callback)` runs the function **right before the next frame is painted**. That is why animations and frame-aligned measurements belong there, not in `setTimeout`:

- rAF callbacks are synchronised with the display refresh rate;
- in a background tab they are usually paused and cost nothing;
- style changes from several rAF callbacks land in the same frame.

## How not to freeze the UI

- **Split long work into chunks** and yield between them, using `setTimeout` or `scheduler.yield()` where supported. That gives the browser time to handle clicks and paint.
- **Move heavy computation to a Web Worker.** A worker runs on a separate thread and talks to the main thread via messages.
- **Do not interleave layout reads and writes** in a loop: reading `offsetHeight` after a style change forces a synchronous layout.
- **Update the UI before heavy work** if you need to show an indicator: show it, wait for a frame, then start computing.

```js
async function run() {
  spinner.hidden = false;
  await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
  heavyCalculation();
  spinner.hidden = true;
}
```

Waiting for rAF and then a `setTimeout` ensures the frame with the spinner gets painted. The UI still freezes during the calculation, though: only a Web Worker or chunking truly solves that.

## How to see it

The **Performance** panel in DevTools shows tasks on the main thread. Tasks longer than about 50 ms are flagged as **long tasks**: they are what makes the interface unresponsive and hurts INP.

## FAQ

### Is async/await a task or a microtask?

The continuation after `await` runs as a microtask. So `await` alone does not let the browser paint: if you need to yield to rendering, wait for a task or a frame explicitly.

### Why does setTimeout(fn, 0) not fire immediately?

It queues a new task, which runs only after the current task and all microtasks. Browsers may also increase the delay for nested timers and background tabs.

### Is the Node.js event loop the same?

The idea is shared, one event queue plus microtasks, but the loop phases differ and there is no rendering. Timer and `setImmediate` behaviour in Node.js is worth studying separately.
