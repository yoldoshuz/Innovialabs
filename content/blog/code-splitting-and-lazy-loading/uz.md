---
title: JavaScript ilovalarida code splitting va lazy loading
description: Code splitting qanday ishlaydi: dynamic import, React va Next.js’da marshrut va komponentlar bo‘yicha bo‘lish, prefetch strategiyalari va natijani o‘lchash.
summary: Code splitting bundle’ni faqat kerak bo‘lganda yuklanadigan qismlarga bo‘ladi: marshrutlar alohida, og‘ir komponentlar dynamic import orqali, prefetch esa ehtimoliy keyingi qadamlarni oldindan yuklaydi.
---

## Bu nima va nima uchun kerak

**Code splitting** — JavaScript bundle’ni bir nechta faylga (chunk’larga) bo‘lish. Bitta katta skript o‘rniga foydalanuvchi avval faqat joriy sahifa kodini oladi, qolgani esa kerak bo‘lganda yuklanadi. Buni **lazy loading** (kechiktirilgan yuklash) deyiladi.

Natija: boshida kamroq JavaScript, tezroq tahlil va bajarilish, sahifaning yaxshiroq javob berishi. Narxi — keyinroq qo‘shimcha tarmoq so‘rovlari, shuning uchun o‘ylab bo‘lish kerak.

## Asos: dynamic import

Hammasi `import()` ustiga qurilgan — modulni asinxron yuklaydigan va Promise qaytaradigan funksiya. Yig‘uvchilar (webpack, Vite, Turbopack, Rollup) bunday chaqiruvni ko‘rib, modulni avtomatik ravishda alohida chunk’ga chiqaradi.

```js
button.addEventListener("click", async () => {
  const { exportToPdf } = await import("./export-pdf.js");
  exportToPdf(data);
});
```

PDF’ga eksport kodi asosiy bundle’ga tushmaydi va faqat bosilganda yuklanadi.

## Marshrutlar bo‘yicha bo‘lish

Eng foydali daraja: bosh sahifadagi foydalanuvchi shaxsiy kabinet kodini yuklamasligi kerak.

- **Next.js** buni avtomatik qiladi: `app/` yoki `pages/` ichidagi har bir sahifa alohida kirish nuqtasi. Hech narsani sozlash shart emas.
- **Router bilan React** (masalan, React Router) — sahifalarni `React.lazy`ga o‘rang:

```jsx
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("./pages/Dashboard"));

export function App() {
  return (
    <Suspense fallback={<div>Yuklanmoqda…</div>}>
      <Dashboard />
    </Suspense>
  );
}
```

## Komponentlar bo‘yicha bo‘lish

Sahifa ichida og‘ir va darhol kerak bo‘lmagan narsalarni ajrating:

- bosilganda ochiladigan modal oynalar va formalar;
- grafiklar, xaritalar, matn muharrirlari, videopleyerlar;
- birinchi ekrandan pastdagi bloklar.

Next.js’da buning uchun `next/dynamic` bor:

```jsx
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("@/components/chart"), {
  loading: () => <p>Grafik yuklanmoqda…</p>,
  ssr: false,
});
```

`ssr: false` faqat brauzerda ishlaydigan (`window`dan foydalanadigan) komponentlar uchun kerak. App Router’da uni faqat klient komponentlarida qo‘llash mumkinligini hisobga oling — o‘z versiyangiz hujjatlarini tekshiring.

**Mayda narsalarni bo‘lmang.** Alohida chunk’dagi tugma yoki ikonka foydasiz qo‘shimcha so‘rov beradi.

## Prefetching: kechikishni yo‘qotish

Lazy loading kod kerak bo‘lgan paytda pauza qo‘shadi. Prefetch uni oldindan, fonda yuklaydi.

| Strategiya | Qachon yuklash | Nima uchun mos |
|---|---|---|
| **Havola viewport’ga kirganda** | Havola ekranda ko‘rinadi | Sahifalar orasida navigatsiya (production’da `next/link` standart holatda shunday qiladi) |
| **Hover / fokusda** | Foydalanuvchi kursorni olib keldi | Og‘ir modallar, menyular |
| **Bo‘sh vaqtda** | Brauzer band emas (`requestIdleCallback`) | Ssenariydagi ehtimoliy keyingi qadam |
| **Prefetch’siz** | Faqat harakat bo‘yicha | Kam ishlatiladigan funksiyalar, admin vositalari |

Hover’da prefetch misoli:

```js
const loadEditor = () => import("./editor");
button.addEventListener("mouseenter", loadEditor, { once: true });
button.addEventListener("click", async () => (await loadEditor()).open());
```

Xuddi shu modul uchun takroriy `import()` uni qayta yuklamaydi — keshdagi modul ishlatiladi.

## Natijani qanday o‘lchash kerak

1. **O‘zgarishlardan oldin** bazani yozib oling: boshlang‘ich JS hajmi (bundle analyzer), Lighthouse, LCP va INP.
2. DevTools’dagi **Network** panelini tekshiring: yangi chunk’lar faqat kerakli harakatda paydo bo‘lishi kerak.
3. **Coverage** paneli yuklangan JS’ning qanchasi boshida haqiqatan bajarilishini ko‘rsatadi.
4. Relizdan keyin field metrikalarini solishtiring — laboratoriya natijasi real qurilmalarni aks ettirmasligi mumkin.

## Ko‘p uchraydigan xatolar

- Juda ko‘p mayda chunk’lar — tarmoq xarajatlari yutuqni yeb qo‘yadi.
- Birinchi ekranda ko‘rinadigan narsani lazy yuklash — foydalanuvchi kontent o‘rniga zaglushkani ko‘radi.
- `fallback` va chunk yuklanish xatolarini qayta ishlash yo‘q (masalan, yangi deploy’dan keyin eski chunk’lar yo‘qolishi mumkin).
- Og‘ir umumiy kutubxona umumiy modulda statik import qilinib, baribir asosiy bundle’ga tushadi.

## FAQ

### Next.js’da code splitting’ni qo‘lda sozlash kerakmi?

Sahifalar bo‘yicha bo‘lishni Next.js o‘zi bajaradi. Qo‘lda faqat sahifalar ichidagi og‘ir komponentlarni `next/dynamic` yoki `import()` orqali ajratish kerak.

### React.lazy va next/dynamic o‘rtasida qanday farq bor?

Ikkalasi ham dynamic import’ga asoslangan. `next/dynamic` qo‘shimcha ravishda Next.js server rendering bilan integratsiyalashgan va `loading`, `ssr` kabi opsiyalarni beradi.

### Lazy loading SEO’ni yomonlashtirmaydimi?

Agar faqat interaktiv va ikkinchi darajali qismlarni lazy yuklasangiz, yo‘q. Qidiruv uchun muhim asosiy kontent darhol, yaxshisi serverda render qilinishi kerak.
