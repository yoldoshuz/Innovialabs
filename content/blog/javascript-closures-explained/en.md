---
title: What Are Closures in JavaScript? Explained with Examples
description: A plain explanation of lexical scope and closures in JavaScript: counters, private state, memoization and the classic var-in-a-loop bug.
summary: A closure is a function that remembers the variables from where it was created and keeps access to them even after the outer function has finished running.
---
## What a closure is

A **closure** is a function together with the variables from the environment where it was created. The function "remembers" those variables and can read and change them even after the outer function has returned.

```js
function makeGreeting(name) {
  return function () {
    return `Hello, ${name}!`;
  };
}

const hiAnna = makeGreeting('Anna');
hiAnna(); // "Hello, Anna!"
```

`makeGreeting` finished long ago, yet the inner function still sees `name`. That is a closure.

## Lexical scope

Closures rest on one rule: **a function sees variables based on where it is written in the code, not where it is called**. This is called lexical scope.

```js
const color = 'blue';

function show() {
  console.log(color);
}

function run() {
  const color = 'red';
  show();
}

run(); // "blue"
```

`show` is declared at the top level, so it sees the outer `color`, not the one inside `run`.

Variable lookup walks a chain: first the current function, then the outer one, all the way up to the global scope.

## Practical uses

### A counter

```js
function createCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    get: () => count,
  };
}

const counter = createCounter();
counter.increment();
counter.increment();
counter.get(); // 2
```

Each call to `createCounter` creates **its own** `count`. Two counters never interfere.

### Private state

Nothing outside can reach `count` except through the methods. It is a way to hide data without classes. Modules, React hooks (`useState` relies on closures) and event handlers work in a similar way.

### Memoization

A closure can hold a cache of results:

```js
function memoize(fn) {
  const cache = new Map();
  return (n) => {
    if (cache.has(n)) return cache.get(n);
    const result = fn(n);
    cache.set(n, result);
    return result;
  };
}

const slowSquare = (n) => n * n;
const fastSquare = memoize(slowSquare);
```

`cache` lives inside the closure and persists between calls.

## The classic bug: var in a loop

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 3, 3, 3
```

Why not 0, 1, 2? `var` is **function-scoped**: there is a single `i` for the whole loop. By the time the timers fire, the loop is over and `i` equals 3. All three functions closed over the same variable.

The fix is `let`. It is **block-scoped**, so each iteration gets a fresh `i`:

```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 0, 1, 2
```

## Common mistakes

- **Expecting a copy of the value.** A closure keeps a reference to the variable, not its value at creation time. If the variable changes, the function sees the new value.
- **Stale values in React.** A handler created during one render sees that render's state. This is the "stale closure" behind many `useEffect` and `setInterval` bugs.
- **Memory leaks.** As long as a closure is alive, so are the variables it references. Remove event listeners and timers you no longer need.

## FAQ

### Is every JavaScript function a closure?

Technically yes: every function remembers the environment it was created in. In practice, people say "closure" when a function is used outside that environment and still accesses its variables.

### Do closures slow code down?

Not noticeably in typical tasks. The cost appears when a closure holds on to large objects that the garbage collector would otherwise free.

### How is a closure different from a class?

Both let you keep state alongside methods. A closure gives true privacy and is simpler for small tasks; a class is more convenient with inheritance and many methods. Modern classes also support private fields with `#`.
