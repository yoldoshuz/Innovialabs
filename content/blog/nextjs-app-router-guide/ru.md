---
title: App Router в Next.js: лейауты, маршрутизация и Server Actions
description: App Router в Next.js на примере приложения заметок: маршруты из папок, вложенные лейауты, loading и error, динамические сегменты и Server Actions.
summary: В App Router каждая папка в app/ — это сегмент URL, а специальные файлы page, layout, loading и error задают страницу, обёртку и состояния; данные меняются через Server Actions без отдельного API.
---
## Как устроен App Router

Каждая папка внутри `app/` — это сегмент адреса. Что именно показать, решают **специальные файлы**:

| Файл | Назначение |
|---|---|
| `page.tsx` | содержимое страницы, делает маршрут доступным |
| `layout.tsx` | обёртка для страницы и всех вложенных маршрутов |
| `loading.tsx` | что показать, пока грузятся данные |
| `error.tsx` | что показать при ошибке в сегменте |
| `not-found.tsx` | страница 404 для сегмента |

Соберём небольшое приложение заметок, чтобы увидеть всё вместе:

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

## Корневой и вложенный лейаут

Корневой лейаут обязателен и содержит `<html>` и `<body>`:

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
```

Вложенный лейаут добавляет боковое меню только для раздела заметок. При переходе между заметками он **не перерисовывается** и сохраняет своё состояние:

```tsx
// app/notes/layout.tsx
export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid">
      <aside>Мои заметки</aside>
      <main>{children}</main>
    </div>
  );
}
```

## Страница со списком и загрузка данных

По умолчанию компоненты в App Router — **серверные**. Значит, можно сделать компонент асинхронным и получить данные прямо в нём:

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

## Состояния загрузки и ошибки

`loading.tsx` автоматически оборачивает страницу в `Suspense` — пока данные грузятся, пользователь видит заглушку, а лейаут уже на экране:

```tsx
// app/notes/loading.tsx
export default function Loading() {
  return <p>Загружаем заметки…</p>;
}
```

`error.tsx` должен быть **клиентским компонентом**, потому что принимает функцию для повторной попытки:

```tsx
// app/notes/error.tsx
"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return <button onClick={() => reset()}>Попробовать снова</button>;
}
```

## Динамический сегмент и метаданные

Папка в квадратных скобках — динамический параметр. В актуальных версиях Next.js `params` передаётся как Promise, поэтому его нужно дождаться:

```tsx
// app/notes/[id]/page.tsx
import { notFound } from "next/navigation";
import { getNote } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const note = await getNote(id);
  return { title: note?.title ?? "Заметка" };
}

export default async function NotePage({ params }: Props) {
  const { id } = await params;
  const note = await getNote(id);
  if (!note) notFound();
  return <article><h1>{note.title}</h1><p>{note.body}</p></article>;
}
```

`generateMetadata` формирует `<title>` и мета-теги на сервере — это важно для SEO. Для статичных страниц достаточно экспортировать объект `metadata`.

## Server Actions: изменение данных без API

Server Action — это асинхронная функция с директивой `"use server"`. Её можно передать прямо в `action` формы:

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
// фрагмент app/notes/page.tsx
import { addNote } from "@/app/actions";

<form action={addNote}>
  <input name="title" required />
  <button type="submit">Добавить</button>
</form>
```

`revalidatePath` сбрасывает кэш страницы, и список обновляется после отправки.

## Частые ошибки

- **Хуки в серверном компоненте.** `useState` и `useEffect` работают только в файлах с `"use client"`.
- **`"use client"` на всём подряд.** Ставьте директиву на маленькие интерактивные компоненты, а не на целые страницы.
- **Доверие к данным из формы.** Server Action — публичный эндпоинт: проверяйте ввод и права пользователя внутри функции.
- **Забытый `revalidatePath`.** Данные сохранились, но страница показывает старый кэш.

Подробности — в официальной документации: [nextjs.org/docs/app](https://nextjs.org/docs/app).

## FAQ

### Можно ли использовать App Router и Pages Router в одном проекте?

Да, они могут сосуществовать, что удобно для постепенной миграции. Но один и тот же маршрут не должен быть описан в обоих одновременно.

### Нужен ли API, если есть Server Actions?

Для форм и изменений данных внутри самого сайта — часто нет. Если к данным обращаются мобильное приложение, бот или внешние сервисы, нужен полноценный API, например через Route Handlers.

### Чем layout отличается от template?

Layout сохраняет состояние при переходах между дочерними страницами, а template создаётся заново при каждом переходе. Template нужен редко — например, для анимации входа на каждой странице.
