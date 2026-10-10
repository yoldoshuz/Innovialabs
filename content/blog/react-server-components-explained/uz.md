---
title: React Server Components: qanday ishlaydi va nima uchun kerak
description: React Server Components tahlili: server/mijoz chegarasi, use client direktivasi, props seriyalash qoidalari, ma’lumot yuklash usullari va odatiy xatolar.
summary: Server Components faqat serverda bajariladi va brauzer JavaScript bandliga tushmaydi; interaktiv qismlar "use client" bilan Client Components’ga chiqariladi, ular orasida esa faqat seriyalanadigan ma’lumotlar uzatiladi.
---
## Server Components nima

**React Server Components (RSC)** — faqat serverda bajariladigan komponentlar. Ularning kodi brauzerga yuborilmaydi: mijoz maxsus formatdagi tayyor render natijasini oladi, React esa uni sahifaga joylaydi.

Bu nima beradi:

- **brauzerda kamroq JavaScript** — og‘ir kutubxonalar (Markdown parser, sanalarni formatlash, ma’lumotlar bazasi SDK’si) serverda qoladi;
- **ma’lumot manbaga yaqin** — komponent to‘g‘ridan-to‘g‘ri bazaga yoki ichki API’ga murojaat qila oladi;
- **maxfiy ma’lumotlar xavfsiz** — kalitlar va tokenlar mijoz bandliga tushmaydi.

Muhim: RSC klassik SSR bilan bir xil emas. SSR komponentlarni birinchi ko‘rinish uchun HTML’ga aylantiradi, lekin keyin ularning butun kodi baribir brauzerga yuklanadi. Server Components esa brauzerga umuman yuklanmaydi.

## Server/mijoz chegarasi va "use client"

RSC’ni qo‘llab-quvvatlaydigan freymvorklarda (masalan, Next.js App Router) komponentlar **sukut bo‘yicha serverda** ishlaydi. Komponentni mijozga aylantirish uchun fayl boshiga direktiva qo‘yiladi:

```tsx
"use client";

import { useState } from "react";

export function LikeButton() {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)}>{liked ? "♥" : "♡"}</button>;
}
```

Asosiy qoidalar:

- `"use client"` mijozga **kirish nuqtasini** belgilaydi: bu fayl va u import qiladigan hamma narsa bandlga tushadi.
- Mijoz komponentlarida holat, effektlar, hodisa ishlovchilari va brauzer API’lari mavjud.
- Server komponenti mijoz komponentini render qila oladi. **Teskarisi — server komponentini mijoz komponenti ichiga import qilish — mumkin emas.**
- Lekin server komponentini mijoz komponentiga `children` yoki boshqa prop orqali uzatish mumkin:

```tsx
// server komponenti
<Tabs>
  <ProductDescription id={id} />
</Tabs>
```

Bu yerda `Tabs` — mijoz komponenti, `ProductDescription` esa serverda qoladi.

## Seriyalash qoidalari

Server komponenti mijoz komponentiga props orqali uzatadigan hamma narsa **seriyalanadigan** bo‘lishi kerak.

| Uzatish mumkin | Uzatish mumkin emas |
|---|---|
| satrlar, sonlar, boolean, null | oddiy funksiyalar va ishlovchilar |
| oddiy obyektlar va massivlar | klass nusxalari |
| Date, Map, Set | Symbol.for orqali yaratilmagan simvollar |
| JSX (children sifatida server komponentlari) | siklik havolali obyektlar |
| Promise | bazaga ulanishlar, soketlar |
| Server Actions ("use server" bilan funksiyalar) | |

Keng tarqalgan xato — server komponentidan `onClick` uzatish. Yechim: ishlovchini mijoz komponenti ichiga ko‘chirish yoki Server Action’dan foydalanish.

## Ma’lumot yuklash

Server komponenti asinxron bo‘lishi mumkin:

```tsx
export default async function OrdersPage() {
  const orders = await db.order.findMany({ take: 20 });
  return <OrdersTable orders={orders} />;
}
```

Amaliy usullar:

- **Ma’lumotni kerak bo‘lgan joyda yuklang**, bitta asosiy komponentda emas. Bir render doirasidagi bir xil so‘rovlarni React’ning `cache` funksiyasi bilan takrorlanmas qilish mumkin.
- **Mustaqil so‘rovlarni parallel ishga tushiring** — `Promise.all` orqali, aks holda ketma-ket kutishlar «sharsharasi» hosil bo‘ladi.
- **Suspense’dan foydalaning** — sekin qism butun sahifani to‘xtatib qo‘ymasin: tez bloklar darhol, sekinlari esa tayyor bo‘lganda ko‘rinadi.
- **Ma’lumotni o‘zgartirish uchun** — o‘z API’ingizga fetch emas, Server Actions.

## Odatiy xatolar

- **Asosiy layoutda `"use client"`.** Butun daraxt mijozga aylanadi va RSC foydasi yo‘qoladi. Mijoz komponentlarini kichik va daraxtning «barglarida» saqlang.
- **Server kodini mijoz fayliga import qilish.** Baza kutubxonasi bandlga tushadi yoki build yiqiladi. `server-only` paketi buni build bosqichida aniqlashga yordam beradi.
- **Server komponenti bosishdan qayta render bo‘lishini kutish.** U brauzerdagi holatdan emas, so‘rov bo‘yicha render qilinadi. Yangilash uchun navigatsiya, `router.refresh()` yoki revalidatsiya kerak.
- **Props’da ortiqcha ma’lumot uzatish.** Mijoz komponentiga ketadigan hamma narsa server javobida ko‘rinadi. Ichki maydonlari bor butun baza yozuvlarini bermang.
- **Server komponentlarida kontekstdan foydalanish.** `createContext` va provayderlar faqat mijozda ishlaydi.

## FAQ

### Server Components’dan Next.js’siz foydalanish mumkinmi?

RSC yig‘uvchi va server tomonidan qo‘llab-quvvatlashni talab qiladi, shuning uchun amalda ular freymvork orqali ishlatiladi. Next.js — eng keng tarqalgan variant, ammo qo‘llab-quvvatlash boshqa vositalarda ham paydo bo‘lmoqda.

### Server Components API o‘rnini bosadimi?

Bitta veb-ilova ichida ma’lumot o‘qish uchun — ko‘pincha ha. Agar xuddi shu ma’lumot mobil ilova yoki tashqi xizmatlarga kerak bo‘lsa, API baribir zarur.

### "use client" qayerda kerakligini qanday bilish mumkin?

Agar komponentga holat, effektlar, hodisa ishlovchilari yoki brauzer API’lari kerak bo‘lsa — u mijoz komponenti. Qolgan hammasini sukut bo‘yicha serverda qoldirgan ma’qul.
