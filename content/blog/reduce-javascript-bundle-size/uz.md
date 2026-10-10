---
title: JavaScript bundle hajmini qanday tahlil qilish va kamaytirish
description: Bundle analyzer, tree shaking, og‘ir kutubxonalarni almashtirish, ortiqcha polifillarni olib tashlash va ishni serverga ko‘chirish, oldin-keyin o‘lchov bilan.
summary: Avval analyzer orqali bundle’dagi eng katta modullarni toping, so‘ng tree shaking, og‘ir bog‘liqliklarni almashtirish, polifillarni toraytirish va ishni serverga ko‘chirishni navbat bilan qo‘llang va har safar oldingi va keyingi hajmni yozib boring.
---

## Qisqa javob

Bundle hajmi taxmin bilan emas, ma’lumotlar asosida kamaytiriladi. Ish sikli:

1. **Bazani yozib olish** — asosiy sahifalarda qancha JS (siqilgan va siqilmagan) yuklanadi.
2. **Eng katta modullarni topish** — bundle analyzer orqali.
3. Ularni quyidagi usullardan biri bilan **olib tashlash yoki almashtirish**.
4. **Qayta o‘lchash** va natijani yozib qo‘yish.

Faqat tarmoqdagi baytlarga qaramang: siqilmagan JS’ni brauzer tahlil qilishi va bajarishi kerak, kuchsiz telefonlarda bu ko‘pincha yuklashdan uzoqroq davom etadi.

## 1-qadam. Bundle’ni tahlil qilish

Bu vositalar treemap chizadi: har bir to‘rtburchak — modul, maydoni — uning hajmi.

| Stek | Vosita |
|---|---|
| webpack | `webpack-bundle-analyzer` |
| Next.js | `@next/bundle-analyzer` |
| Vite / Rollup | `rollup-plugin-visualizer` |
| Source map’li har qanday | `source-map-explorer` |

Next.js uchun misol:

```js
// next.config.js
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
module.exports = withBundleAnalyzer({});
```

Ishga tushirish: `ANALYZE=true npm run build`. Hisobotda nimani qidirish kerak:

- nomutanosib ko‘p joy egallagan bitta kutubxona;
- **dublikatlar** — bitta paketning ikki versiyasi;
- bitta sahifaga kerak, lekin umumiy chunk’ga tushib qolgan kod;
- to‘liq yuklangan lokallar, ikonkalar va ma’lumotlar.

## 2-qadam. Tree shaking

**Tree shaking** — yig‘ish vaqtida ishlatilmayotgan eksportlarni olib tashlash. U quyidagi hollarda ishlaydi:

- kod va bog‘liqliklar CommonJS emas, **ES-modullar** (`import`/`export`) dan foydalanadi;
- importlar nomlangan: butun paket emas, `import { debounce } from "lodash-es"`;
- kutubxonaning `package.json` faylida `sideEffects` to‘g‘ri ko‘rsatilgan.

Tekshirish oddiy: bitta funksiyani import qiling va analyzer’da kutubxonaning qancha qismi bundle’ga tushganini ko‘ring. Agar hammasi tushgan bo‘lsa, tree shaking ishlamayapti.

## 3-qadam. Og‘ir kutubxonalarni almashtirish

Ko‘p uchraydigan nomzodlar va odatiy muqobillar:

- **Sanalar**: lokallari bilan katta kutubxonalar → `date-fns` (modulli import), `dayjs` yoki o‘rnatilgan `Intl.DateTimeFormat`.
- **Utilitalar**: to‘liq `lodash` → `lodash-es`dan alohida funksiyalar yoki massiv va obyektlarning nativ metodlari.
- **Ikonkalar**: butun to‘plamni import qilish → alohida ikonkalarni import qilish yoki SVG sprayt.
- **HTTP-klient**: oddiy so‘rovlar uchun ko‘pincha o‘rnatilgan `fetch` yetarli.
- **Grafiklar va muharrirlar**: almashtirmang, dynamic import orqali **lazy yuklang**.

Yangi bog‘liqlik qo‘shishdan oldin uning hajmini (masalan, bundlephobia’da) va tree shaking’ni qo‘llab-quvvatlashini tekshiring.

## 4-qadam. Ortiqcha polifillar va transpilyatsiya

Agar yig‘ish eski brauzerlarga mo‘ljallangan bo‘lsa, bundle’ga polifillar va hajmli transpilyatsiya qilingan kod tushadi.

- Maqsadli brauzerlarni analitikadagi real auditoriya asosida **browserslist**da aniqlang.
- Polifillarni «har ehtimolga qarshi» to‘liq ulamang — faqat haqiqatan ishlatiladigan va maqsadli brauzerlarda yo‘q funksiyalar uchun.
- Biror bog‘liqlik o‘z polifillarini olib kelmayotganini tekshiring.

## 5-qadam. Ishni serverga ko‘chirish

Eng samarali JS — brauzerga umuman yuborilmaydigan JS.

- **Server rendering va React Server Components**: interaktiv bo‘lmagan komponentlar serverda render qilinadi, ularning kodi va bog‘liqliklari (masalan, Markdown parser) klient bundle’iga tushmaydi.
- Katta ma’lumotlarni formatlash, saralash va filtrlashni serverda bajaring va tayyor natijani yuboring.
- Klientga ortiqcha kod tortmaslik uchun `"use client"`ni komponentlar daraxtida iloji boricha pastroqda saqlang.

## «Oldin va keyin»ni qanday qayd etish

Har bir qadam natijasini bitta jadvalga yozing — shunda nima samara bergani va nima bermagani ko‘rinadi:

| O‘zgarish | Boshlang‘ich JS (gzip/brotli) | Boshlang‘ich JS (siqilmagan) | Lighthouse TBT | INP (field) |
|---|---|---|---|---|
| Baza | — | — | — | — |
| Ikonkalarni tree shaking | — | — | — | — |
| Sana kutubxonasini almashtirish | — | — | — | — |
| Parser’ni serverga ko‘chirish | — | — | — | — |

Uni bir xil sharoitda (bir xil build rejimi, bir xil sahifa, bir xil throttling) o‘z o‘lchovlaringiz bilan to‘ldiring. Hajm qaytadan o‘smasligi uchun CI’ga **budjet** qo‘shing — masalan, `size-limit` yoki Lighthouse CI tekshiruvi.

## Ko‘p uchraydigan xatolar

- Haqiqiy bundle emas, `node_modules` hajmiga qarab optimallashtirish.
- Production o‘rniga dev build’ni o‘lchash.
- Bog‘liqlikni o‘chirib, uning importini umumiy modulda qoldirish.
- Relizdan keyin hajmni kuzatmaslik — bundle asta-sekin yana o‘sadi.

## FAQ

### Bundle’ning qanday hajmi normal hisoblanadi?

Universal raqam yo‘q: hammasi auditoriya, qurilmalar va ilova turiga bog‘liq. Real foydalanuvchilarning Core Web Vitals ko‘rsatkichlariga tayaning va budjetni o‘z bazangizga nisbatan belgilang.

### Qaysi biri muhimroq: siqilgan yoki siqilmagan hajm?

Ikkalasi ham. Siqilgan hajm tarmoq orqali yuklash vaqtiga, siqilmagan hajm esa tahlil va bajarish vaqtiga ta’sir qiladi. Kuchsiz qurilmalar uchun ikkinchisi ko‘pincha muhimroq.

### Code splitting bundle hajmini kamaytiradimi?

U kodni chunk’larga taqsimlab, **boshlang‘ich** JS’ni kamaytiradi, lekin umumiy hajmni emas. Eng yaxshi natija ikkalasini birlashtirishdan keladi: avval ortiqchasini olib tashlang, keyin qolganini bo‘ling.
