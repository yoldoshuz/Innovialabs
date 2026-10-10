---
title: JavaScript saytlar uchun SEO: React va Next.js’da SSR, SSG va CSR
description: Googlebot va Yandex JavaScript’ni qanday qayta ishlaydi, SEO uchun SSR, SSG va CSR farqi, gidratsiya muammolari va bot nimani ko‘rishini tekshirish.
summary: SEO uchun eng ishonchli yo‘l — SSR yoki SSG orqali kontentli tayyor HTML berish. Sahifa brauzerda yig‘iladigan CSR qidiruv tizimini JS’ni render qilishga majbur qiladi, bu sekinroq va har doim ham ishlamaydi.
---

## Qisqacha: qaysi renderingni tanlash kerak

Agar sahifa qidiruvda chiqishi kerak bo‘lsa, uning **asosiy kontenti, havolalari va meta-teglari server HTML javobida bo‘lishi kerak**. Buni SSR (serverda rendering) va SSG (yig‘ish vaqtida statik sahifalar generatsiyasi) beradi. CSR, ya’ni server bo‘sh qobiq berib, kontentni brauzerda JavaScript yig‘adigan usul shaxsiy kabinetlar va admin panellar uchun mos, ammo ochiq sahifalar uchun xavfli.

## Qidiruv tizimlari JavaScript’ni qanday qayta ishlaydi

**Googlebot** avval HTML’ni oladi, keyin sahifani rendering navbatiga qo‘yadi va JavaScript’ni zamonaviy Chromium’da bajaradi. Skanerlash va rendering orasida vaqt o‘tishi mumkin, ba’zi resurslar esa taymaut yoki robots.txt’dagi taqiqlar sababli yuklanmasligi mumkin.

**Yandex** ham JavaScript’ni render qila oladi, ammo asosiy kontent uchun bunga tayanish xavfliroq. Ikkala qidiruv tizimi uchun xavfsiz strategiya bitta: muhim narsa darhol HTML’da bo‘lsin.

Botlar odatda nima qilmaydi:

- kontent yuklash uchun tugmalarni bosmaydi va sahifani aylantirmaydi;
- `href`siz `onClick` orqali qilingan havolalarga o‘tmaydi;
- faqat foydalanuvchi harakatidan keyin paydo bo‘ladigan kontentni ko‘rmaydi.

## Strategiyalarni solishtirish

| Strategiya | HTML qayerda shakllanadi | SEO | Qachon mos |
|---|---|---|---|
| SSG | Yig‘ish vaqtida | A’lo | Blog, lendinglar, hujjatlar |
| ISR / revalidatsiya | Yig‘ishda va davriy | A’lo | Har soniya o‘zgarmaydigan kataloglar |
| SSR | Har so‘rovda serverda | A’lo | Shaxsiy yoki tez-tez o‘zgaradigan ma’lumotlar |
| CSR | Brauzerda | Xavfli | Yopiq bo‘limlar, dashbordlar |

Next.js’da sahifalar sukut bo‘yicha serverda render qilinadi, klient komponentlari esa brauzerda gidratsiya qilinadi. API tafsilotlari versiyalar orasida o‘zgaradi, shuning uchun o‘z versiyangizning rasmiy hujjatlariga tayaning.

## Gidratsiya muammolari

**Gidratsiya** — React brauzerda serverdan kelgan HTML’ni «jonlantirishi». Agar server va brauzerdagi razmetka farq qilsa, gidratsiya xatosi yuzaga keladi: React o‘sha qismni qayta chizishi, foydalanuvchi esa miltillashni ko‘rishi mumkin.

Odatiy sabablar:

- render vaqtida `Date.now()`, `Math.random()` yoki `window` ishlatish;
- lokal yoki vaqt mintaqasiga qarab server va klientda turli kontent;
- noto‘g‘ri HTML ichma-ichligi, masalan `<p>` ichida `<div>`.

```tsx
"use client";
import { useEffect, useState } from "react";

export function LocalTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => setTime(new Date().toLocaleTimeString()), []);
  return <span>{time ?? ""}</span>;
}
```

Brauzerga bog‘liq qiymatlarni render paytida emas, komponent o‘rnatilgandan keyin hisoblang.

## Bot nimani ko‘rishini qanday tekshirish

1. **Sahifaning manba kodi** (DevTools emas): matn, havolalar, title va description bormi.
2. Terminaldan **curl** — JavaScript’siz HTML’ni tez tekshirish.
3. **Google Search Console’da URL tekshiruvi**: render qilingan HTML va skrinshot.
4. **Yandex Vebmaster**: server javobini tekshirish va sahifalarning indeksdagi holati.
5. Brauzerda JavaScript’ni o‘chirib, nima qolganini ko‘ring.

```bash
curl -s https://example.uz/catalog | grep -i "<title>"
```

## Ko‘p uchraydigan xatolar

- Meta-teglar va canonical faqat klientda qo‘shiladi.
- Haqiqiy `<a href>`siz navigatsiya.
- Alohida URL’li sahifalarsiz cheksiz aylantirish.
- JS va CSS fayllar robots.txt’da yopilgan.
- Server mavjud bo‘lmagan sahifalar uchun 200 kodini qaytaradi, «404» ni esa JavaScript chizadi.

## FAQ

### SEO uchun albatta Next.js’ga o‘tish kerakmi?

Yo‘q. Muhimi natija: server javobida kontentli tayyor HTML. Uni turli vositalar bilan olish mumkin, jumladan mavjud SPA uchun prerendering bilan.

### Internet-do‘kon uchun CSR mos keladimi?

Katalog va mahsulot kartochkalari uchun yomon tanlov, chunki ular indekslanishi kerak. CSR savat, shaxsiy kabinet va boshqa yopiq bo‘limlarda o‘rinli.

### Google JavaScript orqali yuklangan kontentni indekslaganini qanday bilaman?

Search Console’da URL tekshiruvini oching va render qilingan HTML’ni ko‘ring. Agar kerakli matn u yerda bo‘lmasa, qidiruv tizimi uni ko‘rmagan.
