---
title: Data Fetching and Caching in Next.js: A Practical Deep Dive
description: How Next.js handles fetch caching, time- and tag-based revalidation, static vs dynamic rendering, Suspense streaming and debugging stale data.
summary: In Next.js you decide what gets cached and for how long: refresh data on a timer or by tag after a change, and stream dynamic parts with Suspense. Stale data almost always means a page or request was cached when you did not expect it.
---

## The short version: how Next.js loads and stores data

In the App Router, data is loaded directly in **Server Components**: a component can be `async` and call `fetch`, an ORM or any SDK. Next.js adds several cache layers on top, and they decide whether users see fresh data.

Important: default behavior **has changed between major versions** of Next.js. In some versions `fetch` was cached automatically, in others it was not, and newer versions introduced the `"use cache"` directive. Check the documentation for your exact version and set caching behavior **explicitly** in code.

## Three questions to ask about every request

1. **Can this data be shared between users?** A product catalog — yes. A specific person's cart — no.
2. **How stale can it be?** Exchange rates — minutes. A blog post — hours, or until it is edited.
3. **What should invalidate the cache?** A timer or a specific event: publishing, a payment, a price change.

Your answers define the strategy.

## Time-based revalidation

Use it when data changes regularly but you do not know exactly when.

```tsx
export default async function Prices() {
  const res = await fetch("https://api.example.com/prices", {
    next: { revalidate: 300 },
  });
  const prices = await res.json();
  return <PriceTable data={prices} />;
}
```

This follows **stale-while-revalidate**: for 300 seconds the cache is served; after that, the first request still gets the old version while a new one is prepared in the background. So one visitor may see data slightly older than the interval — that is expected.

## Tag-based revalidation

Use it when you know exactly **when** data changed: an admin saved a post, a CRM webhook arrived.

```tsx
// Fetching
const res = await fetch("https://api.example.com/posts", {
  next: { tags: ["posts"] },
});

// Server Action after saving
"use server";
import { revalidateTag } from "next/cache";

export async function savePost(data: FormData) {
  await db.post.update(/* ... */);
  revalidateTag("posts", "max");
}
```

In recent versions `revalidateTag` takes a second argument — a cache profile; older versions accept only the tag. There is also `revalidatePath("/blog")`, which clears a specific route. Tags are more convenient: one tag can cover dozens of requests across pages.

## Static vs dynamic rendering

- **Static** — the page is built at build time or on revalidation and served from cache. Fast and cheap.
- **Dynamic** — the page is rendered on every request. Needed when the response depends on the user.

A page becomes dynamic if you use `cookies()`, `headers()`, `searchParams` or an uncached request (`cache: "no-store"`). A common trap: one `cookies()` call in a layout makes the **entire** nested section dynamic.

| Situation | Choice |
|---|---|
| Landing page, docs | Static |
| Blog edited in a CMS | Static + tags |
| Catalog with prices from an API | Static + time revalidation |
| User account, cart | Dynamic |

## Streaming with Suspense

If a page has one slow block, do not make the whole page wait for it. Wrap it in `Suspense` — the rest arrives immediately and the slow part streams in.

```tsx
import { Suspense } from "react";

export default function Dashboard() {
  return (
    <>
      <Header />
      <Suspense fallback={<Skeleton />}>
        <SlowReport />
      </Suspense>
    </>
  );
}
```

A `loading.tsx` file in a route folder does the same for the whole page. Tip: run independent requests **in parallel** with `Promise.all`, not as a chain of `await`s, or you get a waterfall of delays.

## Debugging stale data

- **Check whether the page is static.** The `next build` output shows the type of each route.
- **Test in production mode.** Caching behaves differently in `next dev`, so many bugs only show after `next build && next start`.
- **Make sure the tag matches** in fetching and revalidation — a typo fails silently.
- **Remember the client router.** After a mutation, revalidate on the server or call `router.refresh()`, otherwise the client may show the previous result.
- **Consider your CDN.** A CDN with its own rules can keep an old response regardless of Next.js.
- **Log it.** A temporary `console.log` in a Server Component shows whether it actually re-ran.

## Common mistakes

- Caching personal data in a shared cache — you risk showing someone else's data.
- `no-store` everywhere "just in case" — the site becomes slow and expensive.
- Sequential `await`s instead of parallel loading.
- Relying on defaults instead of explicit settings.

## FAQ

### Should I cache queries to my own database?

Yes, if the data is shared and does not change every second. For non-`fetch` calls, use your Next.js version's function caching tools and invalidate them with tags after changes.

### Why does everything update in dev but not in production?

Development mode barely caches results so edits show instantly. Production enables full caching, so test your strategy on a production build.

### Time-based or tag-based revalidation?

If you control when data changes, use tags: fresh data without extra requests. If data comes from an external source without notifications, use a time interval.
