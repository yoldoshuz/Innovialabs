---
title: React’da TypeScript: props, state, event va hook’larni tiplash
description: React uchun tayyor TypeScript patternlari: props va children, useState, event’lar, ref, generic komponentlar va API javoblarini xavfsiz tiplash.
summary: Props’ni type bilan tasvirlang, hook’larda tip chiqarishga ishoning, event tiplarini React’dan oling va API ma’lumotlarini chegarada tekshiring — bu ko‘p holatlar uchun yetarli.
---
## Qisqa javob

TypeScript’dagi React loyihasida deyarli hamma narsa beshta narsaga borib taqaladi: **props**, **state**, **event’lar**, **ref** va **serverdan kelgan ma’lumotlar**. Qoida oddiy: tashqaridan keladigan narsani (props, API) aniq tiplang, qolganini TypeScript o‘zi chiqarsin.

## Props va children

Props’ni oddiy `type` bilan tasvirlang va funksiya argumentini tiplang. `React.FC` majburiy emas — to‘g‘ridan-to‘g‘ri tiplash o‘qishga qulayroq.

```tsx
type ButtonProps = {
  label: string;
  variant?: "primary" | "ghost";
  onClick?: () => void;
  children?: React.ReactNode;
};

export function Button({ label, variant = "primary", onClick, children }: ButtonProps) {
  return <button className={variant} onClick={onClick}>{children ?? label}</button>;
}
```

- **`React.ReactNode`** — har qanday kontent uchun: matn, elementlar, massivlar, `null`.
- **Literal union** (`"primary" | "ghost"`) `string`dan yaxshiroq: muharrir variantlarni taklif qiladi, xatolar darhol ko‘rinadi.
- Native tugmaning barcha atributlarini qabul qilish uchun tipni kengaytiring: `React.ComponentProps<"button"> & { variant?: ... }`.

## State: useState va useReducer

Boshlang‘ich qiymat o‘zi hamma narsani aytsa, tip shart emas: `useState(0)` allaqachon `number`. Qiymat bo‘sh yoki murakkab bo‘lishi mumkin bo‘lsa, tipni aniq ko‘rsating.

```tsx
type User = { id: number; name: string };
const [user, setUser] = useState<User | null>(null);
```

`useReducer` uchun action’larni **discriminated union** sifatida tasvirlang — TypeScript `switch` ichida tipni o‘zi toraytiradi:

```tsx
type Action =
  | { type: "add"; item: string }
  | { type: "remove"; index: number };
```

## Event’lar

Event tiplari React’dan olinadi. Eng ko‘p uchraydiganlari:

| Vaziyat | Tip |
|---|---|
| Maydonga kiritish | `React.ChangeEvent<HTMLInputElement>` |
| Formani yuborish | `React.FormEvent<HTMLFormElement>` |
| Bosish | `React.MouseEvent<HTMLButtonElement>` |
| Klaviatura | `React.KeyboardEvent<HTMLInputElement>` |

Handler JSX ichida yozilsa (`onChange={(e) => ...}`), tip avtomatik chiqariladi. Uni faqat funksiya alohida e’lon qilinganda ko‘rsatish kerak.

## Ref

DOM element uchun element tipini va boshlang‘ich qiymat sifatida `null`ni bering:

```tsx
const inputRef = useRef<HTMLInputElement>(null);
inputRef.current?.focus();
```

DOM bilan bog‘liq bo‘lmagan o‘zgaruvchan qiymat uchun (masalan, taymer id) saqlanadigan qiymat tipini ko‘rsating: `useRef<number | null>(null)`.

## Generic komponentlar

Komponent har qanday ma’lumot bilan ishlasa — ro‘yxatlar, jadvallar, select’lar — uni generic qiling. Shunda element tipi uzatilgan massivdan chiqariladi.

```tsx
type ListProps<T> = {
  items: T[];
  render: (item: T) => React.ReactNode;
};

export function List<T>({ items, render }: ListProps<T>) {
  return <ul>{items.map((item, i) => <li key={i}>{render(item)}</li>)}</ul>;
}
```

## API javoblari

`res.json()` `any` qaytaradi, `as User` kabi keltirish esa hech narsani tekshirmaydi — bu kompilyatorga berilgan va’da, xolos. Ishonchli yo‘l — **ma’lumotni chegarada sxema bilan tekshirish** (masalan, Zod) va tipni undan chiqarish:

```ts
import { z } from "zod";

const UserSchema = z.object({ id: z.number(), name: z.string() });
type User = z.infer<typeof UserSchema>;

const user: User = UserSchema.parse(await res.json());
```

Shunda statik tip va runtime tekshiruv hech qachon bir-biridan ajralib ketmaydi.

## Ko‘p uchraydigan xatolar

- **Qiyin joyda `any`.** Yaxshisi `unknown` va aniq toraytirish.
- **Tiplarni takrorlash.** Ularni chiqaring: `z.infer`, `ReturnType`, `ComponentProps`.
- **Ortiqcha annotatsiyalar.** TypeScript allaqachon biladigan tipni yozmang.
- **Tekshiruv o‘rniga `!`.** Non-null assertion haqiqiy `null`larni yashiradi.
- **O‘chirilgan `strict`.** Usiz TypeScript foydasining yarmi yo‘qoladi.

## FAQ

### React.FC ishlatish kerakmi?

Shart emas. Props’ni funksiya argumentida to‘g‘ridan-to‘g‘ri tiplash qisqaroq va generic komponentlar bilan ham yaxshi ishlaydi, shuning uchun ko‘p jamoalar shu usulni tanlaydi.

### Props uchun type yoki interface?

Ikkalasi ham ishlaydi. `type` union va kesishmalar uchun qulayroq, `interface` esa `extends` orqali kengaytirish uchun. Asosiysi — bitta uslubni tanlab, loyiha bo‘ylab unga amal qilish.

### Maxsus hook’ni qanday tiplash kerak?

Odatda argumentlarni tiplash yetarli, qaytariladigan qiymatni TypeScript o‘zi chiqaradi. Hook kortej qaytarsa, elementlar union tipdagi massivga aylanib ketmasligi uchun `as const` qo‘shing.
