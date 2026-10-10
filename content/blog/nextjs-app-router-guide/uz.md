---
title: Next.js’dagi App Router: layoutlar, marshrutlash va Server Actions
description: Eslatmalar ilovasi misolida Next.js App Router: papkalardan marshrutlar, ichma-ich layoutlar, loading va error, dinamik segmentlar va Server Actions.
summary: App Router’da app/ ichidagi har bir papka URL segmentidir, page, layout, loading va error maxsus fayllari esa sahifa, o‘ram va holatlarni belgilaydi; ma’lumotlar alohida API’siz Server Actions orqali o‘zgaradi.
---
## App Router qanday tuzilgan

`app/` ichidagi har bir papka — manzil segmenti. Nima ko‘rsatilishini **maxsus fayllar** hal qiladi:

| Fayl | Vazifasi |
|---|---|
| `page.tsx` | sahifa mazmuni, marshrutni ochiq qiladi |
| `layout.tsx` | sahifa va barcha ichki marshrutlar uchun o‘ram |
| `loading.tsx` | ma’lumot yuklanayotganda nima ko‘rsatish |
| `error.tsx` | segmentda xato bo‘lganda nima ko‘rsatish |
| `not-found.tsx` | segment uchun 404 sahifasi |

Hammasini birga ko‘rish uchun kichik eslatmalar ilovasini yig‘amiz:

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

## Asosiy va ichki layout

Asosiy layout majburiy va unda `<html>` hamda `<body>` bo‘ladi:

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
```

Ichki layout faqat eslatmalar bo‘limi uchun yon menyu qo‘shadi. Eslatmalar orasida o‘tilganda u **qayta chizilmaydi** va o‘z holatini saqlaydi:

```tsx
// app/notes/layout.tsx
export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid">
      <aside>Eslatmalarim</aside>
      <main>{children}</main>
    </div>
  );
}
```

## Ro‘yxat sahifasi va ma’lumot yuklash

App Router’da komponentlar sukut bo‘yicha **server komponentlari**. Demak, komponentni asinxron qilib, ma’lumotni to‘g‘ridan-to‘g‘ri uning ichida olish mumkin:

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

## Yuklanish va xato holatlari

`loading.tsx` sahifani avtomatik ravishda `Suspense` bilan o‘raydi — ma’lumot yuklanayotganda foydalanuvchi zaglushkani ko‘radi, layout esa allaqachon ekranda:

```tsx
// app/notes/loading.tsx
export default function Loading() {
  return <p>Eslatmalar yuklanmoqda…</p>;
}
```

`error.tsx` **mijoz komponenti** bo‘lishi shart, chunki u qayta urinish funksiyasini qabul qiladi:

```tsx
// app/notes/error.tsx
"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return <button onClick={() => reset()}>Qayta urinish</button>;
}
```

## Dinamik segment va metama’lumot

Kvadrat qavsdagi papka — dinamik parametr. Next.js’ning dolzarb versiyalarida `params` Promise sifatida uzatiladi, shuning uchun uni kutish kerak:

```tsx
// app/notes/[id]/page.tsx
import { notFound } from "next/navigation";
import { getNote } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const note = await getNote(id);
  return { title: note?.title ?? "Eslatma" };
}

export default async function NotePage({ params }: Props) {
  const { id } = await params;
  const note = await getNote(id);
  if (!note) notFound();
  return <article><h1>{note.title}</h1><p>{note.body}</p></article>;
}
```

`generateMetadata` `<title>` va meta-teglarni serverda shakllantiradi — bu SEO uchun muhim. Statik sahifalar uchun `metadata` obyektini eksport qilish kifoya.

## Server Actions: API’siz ma’lumotni o‘zgartirish

Server Action — `"use server"` direktivasi bilan belgilangan asinxron funksiya. Uni to‘g‘ridan-to‘g‘ri formaning `action` atributiga berish mumkin:

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
// app/notes/page.tsx fragmenti
import { addNote } from "@/app/actions";

<form action={addNote}>
  <input name="title" required />
  <button type="submit">Qo‘shish</button>
</form>
```

`revalidatePath` sahifa keshini tozalaydi va yuborilgandan keyin ro‘yxat yangilanadi.

## Keng tarqalgan xatolar

- **Server komponentida hooklar.** `useState` va `useEffect` faqat `"use client"` bor fayllarda ishlaydi.
- **Hamma joyda `"use client"`.** Direktivani butun sahifalarga emas, kichik interaktiv komponentlarga qo‘ying.
- **Forma ma’lumotlariga ishonish.** Server Action — ochiq endpoint: funksiya ichida kiritilgan ma’lumot va foydalanuvchi huquqlarini tekshiring.
- **`revalidatePath` unutilishi.** Ma’lumot saqlangan, lekin sahifa eski keshni ko‘rsatmoqda.

Batafsil — rasmiy hujjatlarda: [nextjs.org/docs/app](https://nextjs.org/docs/app).

## FAQ

### Bitta loyihada App Router va Pages Router’dan foydalanish mumkinmi?

Ha, ular birga ishlay oladi va bu bosqichma-bosqich migratsiya uchun qulay. Faqat bitta marshrut bir vaqtning o‘zida ikkalasida ham yozilmasligi kerak.

### Server Actions bo‘lsa, API kerakmi?

Saytning o‘zidagi formalar va ma’lumot o‘zgarishlari uchun — ko‘pincha yo‘q. Agar ma’lumotlarga mobil ilova, bot yoki tashqi xizmatlar murojaat qilsa, to‘liq API kerak, masalan Route Handlers orqali.

### Layout template’dan nimasi bilan farq qiladi?

Layout ichki sahifalar orasida o‘tilganda holatini saqlaydi, template esa har bir o‘tishda qaytadan yaratiladi. Template kamdan-kam kerak bo‘ladi — masalan, har bir sahifada kirish animatsiyasi uchun.
