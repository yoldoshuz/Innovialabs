---
title: React Hooks Guide: useState, useEffect, useRef and More
description: A practical guide to core React hooks: useState, useEffect, useRef and useMemo, the rules of hooks, dependency arrays, common mistakes and custom hooks.
summary: Hooks are functions that give a component state (useState), side effects (useEffect) and references (useRef); call them only at the top level and list dependencies honestly.
---

## What hooks are and why they matter

**Hooks** are functions that let a function component hold state, react to changes and work with the DOM. They replaced class components and made logic reusable: shared code moves into a **custom hook** instead of being scattered across lifecycle methods.

The core set you need in almost every project:

| Hook | Purpose |
|---|---|
| `useState` | Local state; changing it triggers a re-render |
| `useEffect` | Syncing with the outside world: subscriptions, timers, requests |
| `useRef` | A reference to a DOM node or a value that does not trigger re-renders |
| `useMemo` / `useCallback` | Caching computations and functions between renders |
| `useContext` | Reading a context value without prop drilling |

## useState: component state

```jsx
const [count, setCount] = useState(0);

// When the next value depends on the previous one, pass a function
setCount(prev => prev + 1);
```

Key points:

- **State is immutable.** For objects and arrays create a copy: `setUser({ ...user, name })`, not `user.name = name`.
- **Updates are not immediate.** Right after `setCount`, `count` in the current render still holds the old value.
- **Expensive initial values** should be passed as a function: `useState(() => parse(data))` runs only once.

## useEffect and the dependency array

`useEffect` runs code after rendering. The second argument controls when the effect re-runs:

- no array — after every render;
- `[]` — once after mount;
- `[userId]` — whenever `userId` changes.

```jsx
useEffect(() => {
  const controller = new AbortController();
  fetch(`/api/users/${userId}`, { signal: controller.signal })
    .then(r => r.json())
    .then(setUser)
    .catch(() => {});
  return () => controller.abort(); // cleanup
}, [userId]);
```

The function returned from an effect is the **cleanup**. It runs before the next execution and on unmount. Cancel requests, remove subscriptions and clear timers there.

## Common useEffect mistakes

- **Missing dependencies.** If the effect uses a variable, it belongs in the array. Enable the `react-hooks/exhaustive-deps` ESLint rule to catch this automatically.
- **Infinite loops.** The effect updates state it depends on, or the dependencies include an object recreated on every render.
- **Effects for derived data.** If a value can be computed from props or state, compute it in the component body — no `useEffect`, no extra `useState`.
- **No cleanup.** Subscriptions and intervals without cleanup cause leaks and duplicate handlers.
- **Race conditions.** Without cancellation, a response to an old request can arrive after a newer one and overwrite fresh data.

## useRef: DOM access and values without re-renders

```jsx
const inputRef = useRef(null);
// <input ref={inputRef} />
inputRef.current.focus();
```

You can mutate `ref.current`, and it **does not trigger a re-render**. That makes `useRef` a good fit for a timer id, a previous value or a flag that never needs to appear on screen.

## The rules of hooks

1. Call hooks **only at the top level** of a component — never inside conditions, loops or nested functions. React relies on call order.
2. Call hooks **only from components or other hooks**, not from regular functions.

## Custom hooks

A custom hook is a function whose name starts with `use` and that calls other hooks. It extracts repeated logic:

```jsx
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
```

Every component that calls the hook gets **its own** state — hooks share logic, not data.

## FAQ

### Why does useEffect run twice in development?

In `StrictMode`, React intentionally mounts, unmounts and remounts a component to verify your cleanup works. In production the effect runs once. If the double run breaks something, a cleanup is missing.

### When do I need useMemo and useCallback?

When a computation is genuinely expensive, or when a function is passed to a memoized child or used as an effect dependency. Wrapping everything adds complexity without noticeable benefit.

### Is it fine to fetch data in useEffect?

It works, but you have to handle caching, retries and race conditions yourself. In larger apps, libraries such as TanStack Query or your framework's data-loading tools are more convenient.
