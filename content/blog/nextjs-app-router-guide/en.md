---
title: Next.js App Router Guide: Layouts, Routing and Server Actions
description: Hands-on Next.js App Router with a small notes app: folder routes, nested layouts, loading and error states, dynamic segments, metadata and Server Actions.
summary: In the App Router every folder in app/ is a URL segment, and the special files page, layout, loading and error define the page, its wrapper and its states; data changes go through Server Actions without a separate API.
---
## How the App Router works

Every folder inside `app/` is a URL segment. What gets shown is decided by **special files**:

| File | Purpose |
|---|---|
| `page.tsx` | the page content; makes the route public |
| `layout.tsx` | a wrapper for the page and all nested routes |
| `loading.tsx` | what to show while data loads |
| `error.tsx` | what to show when the segment throws |
| `not-found.tsx` | the 404 page for the segment |

Let's build a small notes app to see it all together:

```text
app/
  layout.tsx
  page.tsx
  notes/
    layout.tsx
    page.tsx
    loading.tsx
    error.tsx
    [id]/page.tsx
  actions.ts
```

## Root and nested layouts

The root layout is required and contains `<html>` and `<body>`:

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

A nested layout adds a sidebar only for the notes section. When you move between notes it **does not re-render** and keeps its state:

```tsx
// app/notes/layout.tsx
export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid">
      <aside>My notes</aside>
      <main>{children}</main>
    </div>
  );
}
```

## A list page and data fetching

By default, components in the App Router are **Server Components**. That means the component can be async and fetch data directly:

```tsx
// app/notes/page.tsx
import Link from "next/link";
import { getNotes } from "@/lib/db";

export default async function NotesPage() {
  const notes = await getNotes();
  return (
    <ul>
      {notes.map((n) => (
        <li key={n.id}><Link href={`/notes/${n.id}`}>{n.title}</Link></li>
      ))}
    </ul>
  );
}
```

## Loading and error states

`loading.tsx` automatically wraps the page in `Suspense`: while data loads, the user sees a placeholder and the layout is already on screen:

```tsx
// app/notes/loading.tsx
export default function Loading() {
  return <p>Loading notes…</p>;
}
```

`error.tsx` must be a **Client Component** because it receives a retry function:

```tsx
// app/notes/error.tsx
"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return <button onClick={() => reset()}>Try again</button>;
}
```

## Dynamic segments and metadata

A folder in square brackets is a dynamic parameter. In current versions of Next.js `params` is passed as a Promise, so you await it:

```tsx
// app/notes/[id]/page.tsx
import { notFound } from "next/navigation";
import { getNote } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const note = await getNote(id);
  return { title: note?.title ?? "Note" };
}

export default async function NotePage({ params }: Props) {
  const { id } = await params;
  const note = await getNote(id);
  if (!note) notFound();
  return <article><h1>{note.title}</h1><p>{note.body}</p></article>;
}
```

`generateMetadata` builds the `<title>` and meta tags on the server, which matters for SEO. For static pages, exporting a `metadata` object is enough.

## Server Actions: changing data without an API

A Server Action is an async function marked with `"use server"`. You can pass it straight to a form's `action`:

```ts
// app/actions.ts
"use server";
import { revalidatePath } from "next/cache";
import { createNote } from "@/lib/db";

export async function addNote(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  await createNote(title);
  revalidatePath("/notes");
}
```

```tsx
// part of app/notes/page.tsx
import { addNote } from "@/app/actions";

<form action={addNote}>
  <input name="title" required />
  <button type="submit">Add</button>
</form>
```

`revalidatePath` clears the page cache, so the list refreshes after submit.

## Common mistakes

- **Hooks in a Server Component.** `useState` and `useEffect` only work in files with `"use client"`.
- **`"use client"` everywhere.** Put the directive on small interactive components, not whole pages.
- **Trusting form data.** A Server Action is a public endpoint: validate input and check permissions inside the function.
- **Forgetting `revalidatePath`.** The data is saved, but the page still shows the old cache.

Details are in the official docs: [nextjs.org/docs/app](https://nextjs.org/docs/app).

## FAQ

### Can the App Router and Pages Router live in one project?

Yes, they can coexist, which helps with gradual migration. Just do not define the same route in both at once.

### Do I need an API if I have Server Actions?

For forms and data changes within the site itself, often not. If a mobile app, a bot or external services read the data, you need a proper API, for example through Route Handlers.

### What is the difference between layout and template?

A layout keeps its state when you navigate between child pages, while a template is recreated on every navigation. Templates are rarely needed — for example, for an enter animation on each page.
