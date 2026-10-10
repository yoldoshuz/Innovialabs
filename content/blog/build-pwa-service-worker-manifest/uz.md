---
title: Saytni PWA ga aylantirish: manifest va service worker
description: Saytni PWA ga bosqichma-bosqich aylantiramiz: web app manifest, ikonkalar, service worker, keshlash strategiyalari, oflayn sahifa va tekshiruv.
summary: Sayt PWA bo‘lishi uchun uch narsa kerak: HTTPS, nom va ikonkalar yozilgan manifest fayli hamda resurslarni keshlab, internet yo‘qda oflayn sahifani ko‘rsatadigan service worker.
---
## Sayt PWA bo‘lishi uchun nima kerak

**PWA (Progressive Web App)** — brauzer ilova kabi o‘rnata oladigan oddiy sayt: ish stolidagi ikonka, alohida oyna va internetsiz ishlash imkoniyati bilan. Texnik jihatdan uch qism kerak:

- **HTTPS** — service worker faqat himoyalangan ulanishda ishlaydi (ishlab chiqishda `localhost` istisno).
- **Web app manifest** — nom, ikonkalar va ishga tushirish parametrlari yozilgan JSON fayl.
- **Service worker** — tarmoq so‘rovlarini ushlab, keshni boshqaradigan skript.

Quyida har bir qadam tartib bilan.

## 1-qadam. Manifest va ikonkalar

Sayt ildizida `manifest.webmanifest` faylini yarating:

```json
{
  "name": "Mening servisim",
  "short_name": "Servis",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#7c3aed",
  "icons": [
    { "src": "/icons/192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

Uni `<head>` ga ulang:

```html
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#7c3aed">
<link rel="apple-touch-icon" href="/icons/192.png">
```

Muhim jihatlar:

- **192 va 512 px ikonkalar** — Chrome’da o‘rnatish uchun minimal to‘plam.
- **Maskable ikonka** — chetlarida zaxira joy bor, Android uni logotipni kesmasdan doira yoki yumaloq kvadrat shakliga keltira oladi.
- **display: standalone** — ilova manzil satrisiz ochiladi.
- **start_url** service worker ta’sir doirasi ichida bo‘lishi kerak.

## 2-qadam. Service worker’ni ro‘yxatdan o‘tkazish

`sw.js` faylini ildizga joylang: standart bo‘yicha service worker ta’sir doirasi u joylashgan papka bilan cheklanadi. Sahifada ro‘yxatdan o‘tkazish:

```js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
```

Asosiy sahifa yuklanishiga xalaqit bermasligi uchun `load` hodisasidan keyin ro‘yxatdan o‘tkazing.

## 3-qadam. Keshlash strategiyalari

Strategiya resurs turiga qarab tanlanadi:

| Strategiya | Qanday ishlaydi | Nimaga mos |
|---|---|---|
| **Cache first** | Avval kesh, keshda bo‘lmasa — tarmoq | Shriftlar, ikonkalar, nomida xesh bor fayllar |
| **Network first** | Avval tarmoq, internet bo‘lmasa — kesh | HTML sahifalar, yangi bo‘lishi kerak ma’lumotlar |
| **Stale-while-revalidate** | Keshni darhol beradi, fonda yangilaydi | Avatarlar, muhim bo‘lmagan API javoblari |
| **Network only** | Faqat tarmoq | To‘lov, avtorizatsiya, POST so‘rovlar |

## 4-qadam. Oflayn sahifa

Minimal ishlaydigan service worker: o‘rnatishda oflayn sahifani keshlaymiz, navigatsiya uchun zaxira variant bilan network first ishlatamiz.

```js
const CACHE = 'app-v1';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll([OFFLINE_URL]))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
  }
});
```

`offline.html` mustaqil bo‘lishi kerak: stillar fayl ichida, tashqi bog‘liqliklarsiz.

Katta loyihalarda hammasini qo‘lda yozish o‘rniga **Workbox** kutubxonasidan foydalanish qulay — u strategiyalar va kesh versiyalashni tayyor modullar sifatida beradi.

## 5-qadam. O‘rnatishni tekshirish

- Chrome DevTools → **Application** bo‘limini oching: **Manifest** manifest xatolarini, **Service workers** esa worker holatini ko‘rsatadi.
- Shu bo‘limda **Offline** rejimini yoqib, oflayn sahifa ochilishini tekshiring.
- **Lighthouse** auditini ishga tushiring — PWA uchun nima yetishmayotganini ko‘rsatadi.
- Haqiqiy telefonda sinab ko‘ring: Android va iOS turlicha ishlaydi, iOS’da o‘rnatish «Ulashish» → «Bosh ekranga» menyusi orqali bo‘ladi.

## Ko‘p uchraydigan xatolar

- **sw.js ichki papkada** — worker boshqa sahifalarni nazorat qilmaydi.
- **Kesh versiyasi yo‘q** — foydalanuvchilar uzoq vaqt eski fayllarni ko‘radi. Har relizda kesh nomini o‘zgartiring va eskilarini `activate` da o‘chiring.
- **HTML sahifalar cache first bilan keshlanadi** — saytning yangi versiyalari foydalanuvchilarga yetib bormaydi.
- **Shaxsiy ma’lumotli javoblar keshlanadi** — umumiy qurilmada bu ma’lumot sizib chiqishi.
- **Server `sw.js` ni uzoq keshlaydi** — uni `Cache-Control: no-cache` bilan bering.

## FAQ

### PWA albatta oflayn ishlashi shartmi?

To‘liq oflayn ishlash shart emas, lekin oddiy oflayn sahifa ham tajribani sezilarli yaxshilaydi: foydalanuvchi brauzer xatosi o‘rniga tushunarli xabarni ko‘radi.

### PWA ni ilovalar do‘konlariga joylash mumkinmi?

Google Play’ga — ha, Trusted Web Activity orqali. App Store’da yo‘l murakkabroq: odatda Apple qoidalariga mos native o‘ram kerak bo‘ladi.

### PWA mobil ilovani almashtiradimi?

Kataloglar, shaxsiy kabinetlar va kontent servislari uchun ko‘pincha ha. Qurilma funksiyalariga chuqur kirish yoki fonda ishlash kerak bo‘lsa, native ilova ishonchliroq.
