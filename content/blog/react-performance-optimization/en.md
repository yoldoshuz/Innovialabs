---
title: React Performance Optimization: memo, useMemo and Re-renders
description: How to find unnecessary re-renders with the Profiler, when memo and useMemo help or hurt, why list virtualization matters and what React Compiler does.
summary: Measure in the React Profiler first, fix the cause of unnecessary re-renders through component structure, and only then add memo, useMemo and virtualization where they actually help.
---

## The short answer

A re-render on its own is not a problem: React is built for frequent rendering. The problem is when **expensive** components re-render **for no reason** and users notice. The order is always the same: **measure → find the cause → fix the structure → memoize selectively**.

## Why a component re-renders

A component renders again when:

- its state changes;
- its parent re-renders (even if the props are the same);
- a context value it reads changes.

The second point is the main source of wasted renders. A large component holding state at the top of the tree drags everything below it along.

## How to find unnecessary re-renders

1. Install **React Developer Tools** and open the **Profiler** tab.
2. Enable recording of why each component rendered in the settings.
3. Record the slow interaction: typing in a field, opening a list, switching a filter.
4. Read the flamegraph: which components rendered, how long they took and why.

Test a production build, and throttle the CPU in browser DevTools if needed: React is slower in development mode, which distorts the picture.

## Structure first, memoization second

Many problems go away without `memo`:

- **Move state down.** If a search field updates state, keep it in a small `SearchInput` component, not in the whole page.
- **Pass heavy parts as children.** Elements created outside and passed as `children` do not re-render when the wrapper's state changes.
- **Split contexts.** Frequently changing data should not share a context with rarely changing data.
- **Do not define components inside components.** Such a component is recreated on every render and loses its state.

## memo, useMemo and useCallback

| Tool | What it does | When it helps |
|---|---|---|
| `React.memo` | Skips rendering if props have not changed | A heavy component often receives the same props |
| `useMemo` | Caches a computed value | An expensive computation or an object for a memoized child |
| `useCallback` | Caches a function | A function passed to a memoized child or used as an effect dependency |

```jsx
const Row = memo(function Row({ item, onSelect }) {
  return <li onClick={() => onSelect(item.id)}>{item.name}</li>;
});

function List({ items }) {
  const [selected, setSelected] = useState(null);
  const handleSelect = useCallback((id) => setSelected(id), []);
  return items.map((item) => (
    <Row key={item.id} item={item} onSelect={handleSelect} />
  ));
}
```

Without `useCallback`, `handleSelect` would be recreated on every render and `memo` on `Row` would never kick in.

## When memoization hurts

- **Comparing props costs time too.** For lightweight components it can cost more than the render itself.
- **Code gets more complex**, and the risk of dependency-array bugs grows.
- **Memoization breaks silently:** pass a new `style={{...}}` object or an inline arrow function and `memo` stops working.

Add memoization only where the Profiler showed a real problem.

## Virtualizing long lists

If thousands of rows are on screen, the issue is not re-renders but the number of DOM nodes. **Virtualization** renders only the visible items plus a small buffer. Libraries such as TanStack Virtual or react-window do this. Alternatives are pagination or loading more on scroll.

## React Compiler

**React Compiler** is a build-time tool from the React team that memoizes components and values automatically. It removes most manual `memo`, `useMemo` and `useCallback`, but it expects your code to follow the rules of React: pure components and no mutation of props or state. Before enabling it, check compatibility with your React version and framework in the official documentation.

## Other common causes of slowness

- Heavy bundles — use code splitting and `lazy`.
- Synchronous work on every keystroke — `useDeferredValue` and `useTransition` help.
- Large uncompressed images and animations that trigger layout recalculation.

## FAQ

### Should I wrap every component in memo?

No. It adds complexity and the cost of comparing props. Memoize components that the Profiler shows are expensive to render and often receive the same props.

### If I use React Compiler, do I still need useMemo and useCallback?

In most cases the compiler handles it. Manual memoization may remain for specific cases, for example when a value is an effect dependency and exact behavior matters.

### Why is the app slower in development mode?

The development build includes extra checks and warnings, and StrictMode runs some code twice. Judge performance on a production build.
