---
title: TypeScript’da generic’lar: qayta ishlatiladigan kod yozish
description: TypeScript generic’lari bosqichma-bosqich: oddiy funksiyadan cheklovlar, standart turlar va utility turlargacha, API javob o‘ramasi misolida.
summary: Generic — bu tur-parametr bo‘lib, bitta funksiya yoki tur aniq tiplashtirishni yo‘qotmasdan va any’ga o‘tmasdan turli ma’lumotlar bilan ishlashiga imkon beradi.
---
## Generic’lar nima uchun kerak

**Generic** — bu tur uchun parametr. Funksiya qiymatlarni qabul qilganidek, generic turlarni qabul qiladi. Kodni bir marta yozib, uni turli ma’lumotlar bilan ishlatasiz va aniq maslahatlar hamda tekshiruvlar saqlanib qoladi.

Generic’larsiz ikkita yomon variant bor: har bir tur uchun funksiyani takrorlash yoki `any` ishlatib, tiplashtirishni yo‘qotish.

```ts
function first(items: any[]): any {
  return items[0];
}

const x = first([1, 2, 3]); // any — TypeScript endi hech narsani tekshirmaydi
```

Generic bilan tur saqlanadi:

```ts
function first<T>(items: T[]): T | undefined {
  return items[0];
}

const n = first([1, 2, 3]);      // number | undefined
const s = first(['a', 'b']);     // string | undefined
```

`T` argumentdan avtomatik aniqlanadi, odatda uni qo‘lda yozish shart emas.

## Generic turlar va interfeyslar

Eng ko‘p uchraydigan amaliy misol — API javobi o‘ramasi:

```ts
interface ApiResponse<T> {
  data: T;
  error: string | null;
}

interface User {
  id: string;
  name: string;
}

async function getJson<T>(url: string): Promise<ApiResponse<T>> {
  const res = await fetch(url);
  if (!res.ok) return { data: null as T, error: `HTTP ${res.status}` };
  return { data: (await res.json()) as T, error: null };
}

const result = await getJson<User[]>('/api/users');
result.data[0].name; // string, avtoto‘ldirish ishlaydi
```

Bu yerda `T` aniq ko‘rsatilgan, chunki TypeScript server nima qaytarishini bila olmaydi. Yodda tuting: bu tekshiruv emas, **kompilyatorga va’da**. Muhim joylarda tashqi ma’lumotlar uchun runtime validatsiyani qo‘shing (masalan, sxema orqali).

## Cheklovlar: extends

Ba’zan turda ma’lum maydon bo‘lishi kerak. Buning uchun `extends` orqali **cheklov** bor:

```ts
function byId<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find((item) => item.id === id);
}
```

Funksiya `id: string` maydoni bor har qanday obyektlar massivini qabul qiladi va qisqartirilgan emas, o‘sha turni qaytaradi.

`keyof` bilan cheklov obyekt maydonini xavfsiz olish imkonini beradi:

```ts
function pick<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: '1', name: 'Anna', age: 30 };
pick(user, 'name'); // string
pick(user, 'email'); // kompilyatsiya xatosi
```

## Standart turlar

Funksiya parametrlari kabi generic’larda ham standart qiymatlar bo‘ladi:

```ts
interface Paginated<T = unknown> {
  items: T[];
  page: number;
  total: number;
}

const a: Paginated = { items: [], page: 1, total: 0 };        // T = unknown
const b: Paginated<User> = { items: [], page: 1, total: 0 };  // T = User
```

## O‘rnatilgan utility turlar

TypeScript’da kundalik vazifalarning ko‘pini yopadigan tayyor generic turlar bor:

| Utility | Nima qiladi |
|---|---|
| `Partial<T>` | barcha maydonlarni ixtiyoriy qiladi — yangilash formalari uchun qulay |
| `Required<T>` | barcha maydonlarni majburiy qiladi |
| `Pick<T, K>` | faqat tanlangan maydonlarni qoldiradi |
| `Omit<T, K>` | tanlangan maydonlarni olib tashlaydi |
| `Record<K, V>` | `K` kalitli va `V` qiymatli obyekt |
| `ReturnType<F>` | funksiya natijasining turi |
| `Awaited<T>` | `await`’dan keyin olinadigan tur |

```ts
type UserUpdate = Partial<Omit<User, 'id'>>;
// { name?: string }
```

To‘liq ro‘yxat [rasmiy hujjatlarda](https://www.typescriptlang.org/docs/handbook/utility-types.html) bor.

## Ko‘p uchraydigan xatolar

- **Generic uchun generic.** Agar `T` signaturada faqat bir marta uchrasa, u kerak emas bo‘lsa kerak — oddiy tur yetarli.
- **Juda ko‘p parametr.** `<T, U, V, W>`’ni o‘qish qiyin. Agar ularsiz bo‘lmasa, `TData`, `TError` kabi mazmunli nomlar bering.
- **Tekshiruv o‘rniga kast.** `as T` ma’lumotlardagi xatolarni yashiradi. Tashqi ma’lumotlar validatsiyani talab qiladi.
- **Unutilgan cheklov.** `extends`’siz `T` maydonlariga murojaat qilib bo‘lmaydi — kompilyator ular borligini bilmaydi.

## FAQ

### Generic any’dan nimasi bilan farq qiladi?

`any` tur tekshiruvini o‘chiradi. Generic aniq turni saqlaydi va kirishni chiqish bilan bog‘laydi: nima berilsa, o‘sha olinadi, barcha maslahat va tekshiruvlar bilan.

### Turni burchak qavslarda qachon aniq ko‘rsatish kerak?

TypeScript uni o‘zi aniqlay olmaganda: API so‘rovlarida, `new Map<string, User>()` kabi bo‘sh to‘plamlarni yaratishda yoki aniqlangan tur juda keng chiqqanda.

### React komponentlarida generic’lardan foydalansa bo‘ladimi?

Ha. Masalan, ro‘yxat komponenti `items: T[]` va `renderItem: (item: T) => ReactNode` qabul qilishi mumkin, shunda render ichidagi element turi aniq bo‘ladi.
