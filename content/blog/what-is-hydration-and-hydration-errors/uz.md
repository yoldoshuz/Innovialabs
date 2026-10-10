---
title: Gidratatsiya nima va gidratatsiya xatolarini qanday tuzatish
description: Server HTML’i qanday interaktiv bo‘ladi, gidratatsiya narxi, sanalar, random va brauzer API’lari sabab nomuvofiqliklar hamda ularni tuzatish usullari.
summary: Gidratatsiya — bu brauzerdagi React tayyor server HTML’ini «jonlantirib», unga hodisa ishlovchilarini ulashi. Gidratatsiya xatosi brauzerdagi birinchi render serverdagidan farq qilganda yuzaga keladi va beqaror narsalarni (sanalar, tasodifiy qiymatlar, window) effekt yoki klient komponentiga ko‘chirish bilan tuzatiladi.
---

## Gidratatsiya nima

Server rendering’da (SSR yoki SSG) brauzer darhol tayyor HTML oladi: matn va rasmlar ko‘rinadi, lekin tugmalar hali ishlamaydi. Keyin JavaScript yuklanadi, React bu HTML bo‘ylab o‘tadi, o‘zida xuddi shunday komponentlar daraxtini quradi va mavjud elementlarga **hodisa ishlovchilarini ulaydi**. Bu jarayon **gidratatsiya** deyiladi.

Asosiy shart: React klientdagi birinchi render serverdagi bilan **aynan bir xil natija** berishini kutadi. Natija farq qilsa, **gidratatsiya xatosi** (hydration mismatch) yuzaga keladi.

## Gidratatsiya qanchaga tushadi

Gidratatsiya tekin emas:

- brauzer barcha interaktiv komponentlarning JavaScript’ini yuklab olishi, tahlil qilishi va bajarishi kerak;
- u tugamaguncha sahifa tayyor ko‘rinadi, lekin bosishlarga javob bermasligi mumkin;
- kuchsiz telefonlarda bu sezilarli darajada sekinlashtiradi.

Narxni qanday kamaytirish mumkin:

- **Server Components** (React va Next.js App Router’da) umuman gidratatsiya qilinmaydi — ularning JavaScript’i brauzerga tushmaydi. Faqat interaktiv qismlarni klient komponenti qiling.
- **`"use client"`’ni daraxt tepasiga qo‘ymang** — undan pastdagi hamma narsa klientga aylanadi.
- Darhol kerak bo‘lmagan og‘ir vidjetlarni **dangasa yuklang** (`dynamic()`, `React.lazy`).

## Nomuvofiqlikning odatiy sabablari

| Sabab | Nega buziladi |
|---|---|
| `new Date()`, `Date.now()` | Server va brauzerdagi vaqt har xil |
| `Math.random()`, id generatsiyasi | Har renderda turli qiymatlar |
| `window`, `localStorage`, `navigator` | Serverda ular yo‘q, kod tarmog‘i farq qiladi |
| Sana va sonlarni formatlash | Turli vaqt zonalari va lokallar |
| Noto‘g‘ri HTML joylashuvi | Masalan, `<p>` ichida `<div>` — brauzer belgilashni qayta quradi |
| Brauzer kengaytmalari | React ishga tushishidan oldin atribut yoki element qo‘shadi |

## Qanday tuzatish kerak

**1. Brauzer mantiqini `useEffect`’ga ko‘chiring.** Effektlar serverda bajarilmaydi, shuning uchun birinchi render mos keladi, qiymat esa darhol keyin paydo bo‘ladi.

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

**2. Identifikatorlar uchun `useId`’dan foydalaning.** U `Math.random()`’dan farqli ravishda serverda ham, klientda ham bir xil id beradi.

**3. Vaqt zonasi va lokalni qat’iy belgilang.** Ularni `Intl.DateTimeFormat`’ga aniq uzating yoki sanani serverda formatlab, tayyor satrni yuboring.

**4. Faqat klient vidjetlari uchun SSR’ni o‘chiring.** Xaritalar, muharrirlar va oyna o‘lchamiga bog‘liq grafiklarni faqat brauzerda yuklash mumkin — Next.js’da klient komponenti ichida `dynamic(() => import(...), { ssr: false })` orqali.

**5. Belgilashni tuzating.** `<p>` ichida blok elementlar, ichma-ich `<a>` yoki `<tbody>`siz `<table>` yo‘qligini tekshiring.

**6. `suppressHydrationWarning` — faqat nuqtaviy.** Atribut bitta element uchun ogohlantirishni o‘chiradi, masalan vaqt belgisi uchun. Bu tuzatish emas, ongli istisno.

## Xato manbaini qanday topish

- Konsoldagi xabarni to‘liq o‘qing: zamonaviy React server va klient qiymatlari o‘rtasidagi **diff**’ni ko‘rsatadi.
- Kengaytmalar ta’sirini istisno qilish uchun sahifani ularsiz inkognito rejimida oching.
- «Sahifa manba kodi»ni (server HTML) inspektorda ko‘rinayotgan narsa bilan solishtiring.
- Muammoli komponentda `Date`, `random`, `window` va to‘g‘ridan-to‘g‘ri render ichidagi `typeof window !== "undefined"` kabi shartlarni qidiring.

## FAQ

### Sahifa normal ko‘rinsa, gidratatsiya xatosi xavflimi?

Ha. React daraxtning bir qismini klientda qayta chizishi mumkin, bu miltillash, unumdorlik yo‘qotilishi va ba’zan interfeys holat bilan mos kelmasligiga olib keladi. Bunday xatolarni e’tiborsiz qoldirmay, tuzatish kerak.

### Nega render ichidagi `typeof window` tekshiruvi yordam bermaydi?

Chunki u nomuvofiqlikni o‘zi yaratadi: serverda shart yolg‘on, brauzerda rost bo‘ladi va belgilash har xil chiqadi. Bunday tekshiruvni `useEffect`’ga ko‘chirish kerak.

### CSR ilovalarida gidratatsiya bormi?

Yo‘q. Sof klient rendering’da server tayyor belgilash bermaydi, React uni noldan quradi, shuning uchun solishtiradigan narsa yo‘q.
