---
title: What Is Hydration and How to Fix Hydration Errors
description: How server HTML becomes interactive, what hydration costs, why mismatches come from dates, random values and browser APIs, and how to fix them.
summary: Hydration is when React in the browser brings ready server HTML to life by attaching event handlers to it. A hydration error happens when the first browser render differs from the server one, and the fix is to move anything unstable (dates, random values, window) into an effect or a client-only component.
---

## What hydration is

With server rendering (SSR or SSG) the browser receives finished HTML right away: text and images are visible, but buttons do not work yet. Then JavaScript loads, React walks this HTML, builds the same component tree internally and **attaches event handlers** to the existing elements. That process is **hydration**.

The key condition: React expects the first client render to produce **exactly the same output** as the server. If it differs, you get a **hydration error** (hydration mismatch).

## What hydration costs

Hydration is not free:

- the browser has to download, parse and execute JavaScript for every interactive component;
- until it finishes, the page looks ready but may not respond to clicks;
- on weak phones this noticeably hurts responsiveness.

How to reduce the cost:

- **Server Components** (in React and the Next.js App Router) are not hydrated at all — their JavaScript never reaches the browser. Make only the interactive parts client components.
- **Do not put `"use client"` at the top of the tree** — everything below it becomes client-side.
- **Lazy-load** heavy widgets that are not needed immediately (`dynamic()`, `React.lazy`).

## Typical causes of mismatches

| Cause | Why it breaks |
|---|---|
| `new Date()`, `Date.now()` | Server and browser time differ |
| `Math.random()`, generated ids | Different values on each render |
| `window`, `localStorage`, `navigator` | They do not exist on the server, so the code path differs |
| Date and number formatting | Different time zones and locales |
| Invalid HTML nesting | E.g. a `<div>` inside a `<p>` — the browser restructures the markup |
| Browser extensions | They add attributes or elements before React starts |

## How to fix it

**1. Move browser logic into `useEffect`.** Effects do not run on the server, so the first render matches and the value appears right after.

```tsx
"use client";
import { useEffect, useState } from "react";

export function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
  }, []);

  return <span>{time ?? "—"}</span>;
}
```

**2. Use `useId` for identifiers.** It produces the same ids on server and client, unlike `Math.random()`.

**3. Pin the time zone and locale.** Pass them explicitly to `Intl.DateTimeFormat`, or format the date on the server and send a ready string.

**4. Disable SSR for purely client widgets.** Maps, editors and charts that depend on window size can load only in the browser — in Next.js via `dynamic(() => import(...), { ssr: false })` inside a client component.

**5. Fix the markup.** Check for block elements inside `<p>`, nested `<a>` tags, or `<table>` without `<tbody>`.

**6. Use `suppressHydrationWarning` sparingly.** It silences the warning for a single element, such as a timestamp. It is not a fix, but a deliberate exception.

## How to find the source

- Read the full console message: modern React shows a **diff** between the server and client values.
- Open the page in a private window without extensions to rule them out.
- Compare "view page source" (server HTML) with what the inspector shows.
- Look in the failing component for `Date`, `random`, `window` and checks like `typeof window !== "undefined"` directly in render.

## FAQ

### Is a hydration error dangerous if the page looks fine?

Yes. React may re-render part of the tree on the client, causing flicker, lost performance and sometimes a UI that is out of sync with state. Fix these errors instead of ignoring them.

### Why does a `typeof window` check in render not help?

Because it creates the mismatch itself: the condition is false on the server and true in the browser, so the markup differs. Move such checks into `useEffect`.

### Do CSR apps have hydration?

No. With pure client-side rendering the server sends no ready markup; React builds it from scratch, so there is nothing to compare.
