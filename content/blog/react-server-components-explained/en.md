---
title: React Server Components Explained: How They Work and Why
description: React Server Components explained: the server/client boundary, the use client directive, prop serialization rules, data fetching patterns and common pitfalls.
summary: Server Components run only on the server and never ship to the browser bundle; interactive parts go into Client Components marked "use client", and only serializable data crosses between them.
---
## What Server Components are

**React Server Components (RSC)** are components that run only on the server. Their code is never sent to the browser: the client receives the finished render result in a special format, and React merges it into the page.

What you gain:

- **less JavaScript in the browser** — heavy libraries (a Markdown parser, date formatting, a database SDK) stay on the server;
- **data next to its source** — a component can query the database or an internal API directly;
- **secrets stay safe** — keys and tokens never end up in the client bundle.

Important: RSC is not the same as classic SSR. SSR turns components into HTML for the first paint, but all their code is still downloaded to the browser afterwards. Server Components are not downloaded at all.

## The server/client boundary and "use client"

In frameworks that support RSC (for example, the Next.js App Router), components are **server by default**. To make a component a client one, you add a directive at the top of the file:

```tsx
"use client";

import { useState } from "react";

export function LikeButton() {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)}>{liked ? "♥" : "♡"}</button>;
}
```

Key rules:

- `"use client"` marks an **entry point** to the client: this file and everything it imports ends up in the bundle.
- Client Components can use state, effects, event handlers and browser APIs.
- A Server Component can render a Client Component. **The reverse — importing a Server Component into a Client Component — is not allowed.**
- But you can pass a Server Component into a Client Component through `children` or another prop:

```tsx
// a Server Component
<Tabs>
  <ProductDescription id={id} />
</Tabs>
```

Here `Tabs` is a client component, while `ProductDescription` stays on the server.

## Serialization rules

Anything a Server Component passes to a Client Component through props must be **serializable**.

| Allowed | Not allowed |
|---|---|
| strings, numbers, booleans, null | plain functions and handlers |
| plain objects and arrays | class instances |
| Date, Map, Set | symbols not created via Symbol.for |
| JSX (Server Components as children) | objects with circular references |
| Promises | database connections, sockets |
| Server Actions (functions with "use server") | |

A frequent mistake is passing `onClick` from a Server Component. The fix: move the handler inside the Client Component or use a Server Action.

## Data fetching

A Server Component can be async:

```tsx
export default async function OrdersPage() {
  const orders = await db.order.findMany({ take: 20 });
  return <OrdersTable orders={orders} />;
}
```

Practical patterns:

- **Fetch data where it is needed**, not in one root component. Identical requests within a render can be deduplicated with React's `cache`.
- **Run independent requests in parallel** with `Promise.all`, otherwise you get a waterfall of sequential waits.
- **Use Suspense** so a slow part does not block the whole page: fast blocks appear immediately, slow ones stream in when ready.
- **For mutations**, use Server Actions rather than fetching your own API.

## Common pitfalls

- **`"use client"` in the root layout.** The whole tree becomes client-side and the benefit of RSC disappears. Keep client components small and at the leaves.
- **Importing server code into a client file.** The database library lands in the bundle or the build fails. The `server-only` package helps catch this at build time.
- **Expecting a Server Component to re-render on a click.** It renders per request, not from browser state. To update it you need navigation, `router.refresh()` or revalidation.
- **Passing too much data in props.** Everything sent to a client component is visible in the server response. Do not hand over whole database records with internal fields.
- **Using context in Server Components.** `createContext` and providers only work on the client.

## FAQ

### Can I use Server Components without Next.js?

RSC needs support from the bundler and the server, so in practice it is used through a framework. Next.js is the most common option, but support is appearing in other tools as well.

### Do Server Components replace an API?

For reading data inside a single web app, often yes. If a mobile app or external services need the same data, you still need an API.

### How do I know where "use client" is needed?

If a component needs state, effects, event handlers or browser APIs, it is a client component. Everything else is better left on the server by default.
