---
title: TypeScriptda type yoki interface: qachon qaysi birini ishlatish
description: TypeScriptda type va interface o‘rtasidagi real farqlar: e’lonlarning birlashishi, union, extends va kesishmalar, xato xabarlari va jamoa uchun qoida.
summary: Obyekt shaklini tasvirlashda type va interface deyarli bir-birining o‘rnini bosadi. extends va e’lonlarni birlashtirish muhim bo‘lsa — interface, union, kortejlar va hisoblanadigan tiplar uchun — type. Eng muhimi — jamoada bitta qoidaga kelishish.
---

## Qisqa javob

Oddiy obyekt uchun deyarli farq yo‘q:

```typescript
type UserT = { id: number; name: string };
interface UserI { id: number; name: string }
```

Ikkala variant funksiyalarda, klasslarda va komponent propslarida bir xil ishlaydi. Farqlar to‘rt joyda namoyon bo‘ladi: **e’lonlarning birlashishi**, **union va boshqa obyekt bo‘lmagan tiplar**, **extends va kesishmalar** hamda **xato xabarlari**.

## 1-farq: e’lonlarning birlashishi

Bir xil nomli ikkita `interface` avtomatik birlashadi:

```typescript
interface Config { apiUrl: string }
interface Config { timeout: number }

const c: Config = { apiUrl: "/api", timeout: 5000 }; // ikkala maydon majburiy
```

`type` bilan bunday qilib bo‘lmaydi — qayta e’lon `Duplicate identifier` xatosini beradi.

Qachon foydali: **begona tiplarni kengaytirish** — masalan, global `Window` ga yoki kutubxona tiplariga maydon qo‘shish. Qachon zararli: turli fayllarda nomlarning tasodifan mos kelishi tipni jimgina o‘zgartiradi.

## 2-farq: union va obyekt bo‘lmagan tiplar

`interface` faqat obyekt shaklini tasvirlaydi. `type` qolgan hamma narsani qila oladi:

```typescript
type Status = "idle" | "loading" | "error";
type Id = string | number;
type Point = [number, number];
type Handler = (event: MouseEvent) => void;
type ReadonlyUser = Readonly<UserT>;
type Result =
  | { ok: true; data: string }
  | { ok: false; error: string };
```

Union tiplar, kortejlar, mapped va conditional types — `type` hududi.

## 3-farq: extends va kesishmalar

Merosni ikki usulda yozish mumkin:

```typescript
interface Base { id: number }
interface Admin extends Base { role: "admin" }

type BaseT = { id: number };
type AdminT = BaseT & { role: "admin" };
```

Farq **xususiyatlar ziddiyatida** ko‘rinadi:

```typescript
interface A { value: string }
interface B extends A { value: number }
// Darhol xato: Interface 'B' incorrectly extends interface 'A'

type C = { value: string } & { value: number };
// Xato yo‘q, lekin value tipi never — muammo keyinroq chiqadi
```

`extends` moslikni e’lon paytida tekshiradi, `&` kesishmasi esa jimgina imkonsiz tip yaratadi. Bundan tashqari, TypeScript hujjatlarida kompilyator `interface extends` ierarxiyalarini katta kesishmalarga qaraganda samaraliroq qayta ishlashi qayd etilgan.

## 4-farq: xato xabarlari

Maslahatlar va xatolarda `interface` odatda **nomi bilan** ko‘rsatiladi, kesishmalar va utilitalardan yig‘ilgan murakkab `type` esa uzun tuzilmaga ochilib ketishi mumkin. Katta loyihada bu xatolarning o‘qilishiga sezilarli ta’sir qiladi. Bu printsipial farq emas, lekin obyektlar uchun `interface` foydasiga yoqimli nuqta.

## Ikkalasi nima qila oladi

- Obyektlar, metodlar, ixtiyoriy va `readonly` maydonlarni tasvirlash.
- Klasslarning `implements` qismida ishlatilish (agar `type` union emas, obyektni tasvirlasa).
- `interface` `type` ni kengaytira oladi, `type` esa `interface` bilan kesisha oladi.
- Generiklarni qo‘llab-quvvatlash: `interface Box<T> { value: T }` va `type Box<T> = { value: T }`.

## Taqqoslash jadvali

| Imkoniyat | type | interface |
|---|---|---|
| Obyekt shakli | Ha | Ha |
| Union, kortejlar, primitivlar | Ha | Yo‘q |
| Mapped / conditional types | Ha | Yo‘q |
| E’lonlarning birlashishi | Yo‘q | Ha |
| Merosda ziddiyatni tekshirish | Yo‘q (`&` `never` beradi) | Ha (`extends`) |
| Xatolarda nomi ko‘rinishi | Har doim emas | Odatda ha |

## Jamoa uchun oddiy qoida

Rioya qilish oson bo‘lgan ishchi variant:

1. **`interface`** — obyekt shakllari uchun: ma’lumot modellari, komponent propslari, API kontraktlari, kutubxonaning ommaviy tiplari.
2. **`type`** — union, kortejlar, funksiyalar va utilitalardan (`Pick`, `Omit`, `Partial`) yig‘ilgan hamma narsa uchun.
3. **Meros** — imkon bo‘lsa, `&` emas, `extends` orqali.
4. **E’lonlarni birlashtirish** — faqat ongli ravishda, tashqi tiplarni kengaytirish uchun.

«Hamma joyda `type`, `interface` faqat tashqi tiplarni kengaytirish uchun» degan muqobil ham normal. Muhimi — bittasini tanlab, linter bilan mustahkamlash: **typescript-eslint** da `consistent-type-definitions` qoidasi bor.

## FAQ

### Ilova unumdorligida farq bormi?

Yo‘q. Tiplar kompilyatsiyada olib tashlanadi va kodning ishlashiga ta’sir qilmaydi. Farq faqat juda katta loyihalarda tiplarni tekshirish tezligida bo‘lishi mumkin.

### Bitta loyihada type va interface ni aralashtirsa bo‘ladimi?

Ha, bu normal: har birining o‘z roli bor. Muammoni aralashtirish emas, qachon qaysi birini ishlatish haqida qoidaning yo‘qligi keltirib chiqaradi.

### React komponent propslari uchun qaysi birini tanlash kerak?

Ikkalasi ham mos. Jamoada «obyektlar — interface orqali» qoidasi bo‘lsa, unga amal qiling; propslar union yoki utilitalardan yig‘ilsa — `type`.
