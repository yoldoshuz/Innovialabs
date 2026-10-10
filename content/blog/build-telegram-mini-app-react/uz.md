---
title: React’da Telegram Mini App yaratish
description: React va Vite’da Telegram Mini App: Web Apps SDK’ni ulash, theme params ranglari, MainButton va BackButton’ni sozlash hamda Telegram’da sinash.
summary: React’dagi Mini App — HTTPS orqali ishlaydigan oddiy veb-ilova: u telegram-web-app.js skriptini ulaydi, ranglarni themeParams’dan oladi, window.Telegram.WebApp orqali nativ MainButton va BackButton’ni boshqaradi va botdan ochiladi.
---
## Qisqa javob

**Telegram Mini App** — Telegram bot tugmasi orqali o‘z ichida ochadigan veb-ilova. Texnik jihatdan bu `telegram-web-app.js` SDK ulangan oddiy React-loyiha. `window.Telegram.WebApp` obyekti orqali ilova quyidagilarni oladi:

- **themeParams** — foydalanuvchining joriy mavzusi ranglari;
- **MainButton** va **BackButton** — Telegram’ning nativ tugmalari;
- **initData** — serverda tekshirilishi kerak bo‘lgan, imzolangan foydalanuvchi ma’lumotlari.

## 1-qadam. Loyiha va SDK

```bash
npm create vite@latest my-mini-app -- --template react-ts
cd my-mini-app
npm install
```

`index.html` da SDK’ni bandlingizdan **oldin** ulang:

```html
<head>
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
</head>
```

TypeScript uchun minimal e’lon qo‘shing yoki Telegram Web Apps turlari paketini o‘rnating. Quyidagi misollarda qisqa o‘ram ishlatiladi:

```ts
// src/tg.ts
export const tg = (window as any).Telegram?.WebApp;
```

`main.tsx` da Telegram’ga ilova tayyorligini bildiring va uni to‘liq balandlikka yoying:

```ts
import { tg } from "./tg";

tg?.ready();
tg?.expand();
```

`ready()` yuklanish belgisini olib tashlaydi. Uni iloji boricha erta chaqiring.

## 2-qadam. Mavzu

SDK o‘zi `--tg-theme-bg-color`, `--tg-theme-text-color`, `--tg-theme-button-color` kabi CSS-o‘zgaruvchilarni o‘rnatadi. Eng oson yo‘li — uslublarni shular asosida qurish:

```css
body {
  background: var(--tg-theme-bg-color, #fff);
  color: var(--tg-theme-text-color, #000);
}
.card {
  background: var(--tg-theme-secondary-bg-color, #f2f2f2);
}
.hint {
  color: var(--tg-theme-hint-color, #888);
}
```

Ranglar JS’da kerak bo‘lsa, ular `tg.themeParams` da, yorug‘ yoki qorong‘i sxema esa `tg.colorScheme` da. Mavzu o‘zgarganda `themeChanged` hodisasi keladi: `tg.onEvent("themeChanged", handler)` orqali obuna bo‘ling. `var(..., #fff)` dagi zaxira qiymatlar sahifa oddiy brauzerda ham yaxshi ko‘rinishi uchun kerak.

## 3-qadam. MainButton

**MainButton** — ekran pastidagi katta, Telegram uchun nativ tugma. Uni hook’ga o‘rash qulay:

```tsx
import { useEffect } from "react";
import { tg } from "./tg";

export function useMainButton(text: string, onClick: () => void, visible = true) {
  useEffect(() => {
    const btn = tg?.MainButton;
    if (!btn) return;
    btn.setText(text);
    btn.onClick(onClick);
    visible ? btn.show() : btn.hide();
    return () => {
      btn.offClick(onClick);
      btn.hide();
    };
  }, [text, onClick, visible]);
}
```

Bu yerda asosiysi — **effekt tozalanishidagi `offClick`**. Usiz har bir renderda yangi handler qo‘shiladi va bitta bosish bir nechta buyurtma yaratishi mumkin. Uzoq amallar uchun `btn.showProgress()` va `btn.hideProgress()` bor, `btn.disable()` esa takroriy bosishlarni bloklaydi.

## 4-qadam. BackButton va routing

**BackButton** Mini App sarlavhasida paydo bo‘ladi. Uni router bilan, masalan react-router bilan bog‘lash kerak:

```tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { tg } from "./tg";

export function useBackButton() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const back = tg?.BackButton;
    if (!back) return;
    const goBack = () => navigate(-1);
    if (pathname === "/") back.hide();
    else back.show();
    back.onClick(goBack);
    return () => back.offClick(goBack);
  }, [pathname, navigate]);
}
```

Bosh ekranda tugma yashirin: u yerda foydalanuvchi ilovani tizim tugmasi bilan yopadi.

## 5-qadam. Telegram ichida sinash

1. **HTTPS-manzil.** Telegram faqat HTTPS’ni ochadi. Ishlab chiqishda `npm run dev` ni ishga tushiring va portni tunnel (ngrok, Cloudflare Tunnel va shu kabilar) orqali tashqariga chiqaring. Vite begona hostni bloklasa, uni `server.allowedHosts` ga qo‘shing.
2. **Botga bog‘lash.** @BotFather’da Mini App yoki bot menyu tugmasini sozlang va tunnel manzilini ko‘rsating. Boshqa variant — `web_app` maydonli inline-tugma.
3. **Debugging.** Telegram Web yoki Desktop’dan boshlash eng oson: u yerda brauzerning dasturchi vositalari mavjud. Mobil klientlar uchun WebView debugging’ni qanday yoqish Telegram hujjatlarida yozilgan.
4. **Test muhiti.** Production-botga tegmaslik uchun Telegram’da alohida test serveri bor.

## Ko‘p uchraydigan xatolar

- **Serverda `initDataUnsafe` ga ishonish.** Bu tekshirilmagan ma’lumot. Backend’ga `tg.initData` satrini yuboring va uning imzosini bot tokeni bilan tekshiring.
- **Qat’iy belgilangan ranglar** — qorong‘i mavzuda interfeysni o‘qib bo‘lmaydi.
- **`offClick` siz MainButton handlerlari** — takroriy amallar.
- **Telegram tashqarisida ishga tushishni tekshirmaslik**: `tg` `undefined` bo‘ladi va ilova ishdan chiqadi.

## FAQ

### Alohida backend kerakmi?

Statik vitrina uchun — yo‘q. Buyurtmalar, to‘lov yoki shaxsiy ma’lumotlar paydo bo‘lishi bilan `initData` ni tekshiradigan va ma’lumotlarni saqlaydigan server kerak bo‘ladi.

### Vite o‘rniga Next.js ishlatsa bo‘ladimi?

Ha, istalgan freymvork mos keladi. Faqat SDK brauzerda ishlashini hisobga oling, shuning uchun `window.Telegram` ga murojaatlar klient tomonida bajarilishi kerak.

### SDK uchun tayyor React-o‘ramlar bormi?

Hamjamiyat yaratgan hook va komponentli kutubxonalar bor. Ular qulay, lekin `window.Telegram.WebApp` ga to‘g‘ridan-to‘g‘ri murojaat tushunish uchun oddiyroq va uchinchi tomon yangilanishlariga bog‘liq emas.
