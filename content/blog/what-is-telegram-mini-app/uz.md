---
title: Telegram Mini App nima va u qanday ishlaydi
description: Mini App — Telegram ichida ochiladigan veb-ilova. U qayerdan ishga tushadi, qaysi nativ imkoniyatlarni oladi va foydalanuvchini qanday avtorizatsiya qiladi.
summary: Telegram Mini App — bot tugmasi yoki havolasi orqali Telegram ichida ochiladigan oddiy HTML, CSS va JavaScript sayt bo‘lib, alohida ro‘yxatdan o‘tishsiz foydalanuvchi ma’lumotlari, Telegram mavzusi, tugmalari va to‘lovlaridan foydalanadi.
---
## Qisqa javob

**Telegram Mini App** (avval Web App deb atalgan) — Telegram chat ustida o‘zining ichki oynasida ochadigan veb-ilova. Texnik jihatdan bu sayt: uni istalgan frontend stekda yozasiz, HTTPS manzilga joylaysiz va botga bog‘laysiz.

Oddiy saytdan farqi shundaki, Mini App:

- bir bosishda ochiladi, brauzerga o‘tish shart emas;
- uni kim ochganini darhol biladi — login va parolsiz;
- Telegram mavzusiga moslashadi, uning tugmalari, tebranishi va to‘lovlaridan foydalanadi.

Mini App doim botga bog‘liq: bot — kirish nuqtasi va xabarlar kanali, ilova esa to‘liq interfeys.

## Ichkarida qanday ishlaydi

1. Foydalanuvchi tugma yoki havolani bosadi.
2. Telegram URL manzilingizni ichki WebView da ochadi.
3. Sahifada rasmiy `telegram-web-app.js` skripti ulanadi va `window.Telegram.WebApp` obyekti paydo bo‘ladi.
4. Telegram ilovaga **initData** ni uzatadi — foydalanuvchi ma’lumotlari va imzo.
5. Serveringiz imzoni bot tokeni yordamida tekshiradi va ma’lumotlarga faqat tekshiruvdan keyin ishonadi.

```html
<script src="https://telegram.org/js/telegram-web-app.js"></script>
<script>
  const tg = window.Telegram.WebApp;
  tg.ready();
  // tg.initData ni imzoni tekshirish uchun serverga yuboramiz
</script>
```

Muhim: klientdagi `initDataUnsafe` ismni ko‘rsatish uchun qulay, lekin avtorizatsiya uchun doim serverda `initData` ni tekshiring.

## Mini App qayerdan ishga tushadi

| Kirish nuqtasi | Ko‘rinishi | Qachon qulay |
|---|---|---|
| **Menyu tugmasi** | Bot chatida kiritish maydonining chap tomonidagi tugma | Asosiy kirish: do‘kon, shaxsiy kabinet |
| **Inline-tugma** | Bot xabari ostidagi tugma | Kontekstli amal: «Buyurtma berish», «Vaqt tanlash» |
| **Klaviatura tugmasi** | Oddiy klaviatura o‘rnidagi tugma | Ma’lumotni chatga qaytarish kerak bo‘lganda |
| **To‘g‘ridan-to‘g‘ri havola** | `t.me/bot_nomi/ilova_nomi` ko‘rinishidagi havola | Reklama, QR-kod, kanaldagi post |
| **Bot profilidagi tugma** | Profildagi «Ilovani ochish» | Botda asosiy ilova sozlangan bo‘lsa |

To‘g‘ridan-to‘g‘ri havola kerakli bo‘limni ochish yoki o‘tish manbasini hisobga olish uchun `startapp` parametrini uzata oladi.

## Qanday nativ imkoniyatlar mavjud

- **Foydalanuvchi ma’lumotlari**: id, ism, til, username — ro‘yxatdan o‘tish formasisiz.
- **Mavzu**: joriy Telegram mavzusi ranglari, shunda ilova yorug‘ va qorong‘i rejimda «o‘zinikidek» ko‘rinadi.
- **Tizim tugmalari**: ekran pastidagi asosiy tugma, «Orqaga» tugmasi, sozlamalar tugmasi.
- **Taktil javob**: bosish va xatolarda tebranish.
- **Bulutli xotira**: Telegram saqlaydigan foydalanuvchining kichik ma’lumotlari.
- **To‘lovlar**: hisob-fakturani to‘g‘ridan-to‘g‘ri ilovadan ochish, jumladan Telegram Stars da.
- **Foydalanuvchiga so‘rovlar**: kontaktni ulashish, botga yozishga ruxsat berish, QR-kodni skanerlash.
- **To‘liq ekran rejimi, geolokatsiya, biometriya** — klientlarning amaldagi versiyalarida.

Imkoniyatlar to‘plami foydalanuvchidagi Telegram versiyasiga bog‘liq, shuning uchun funksiyani chaqirishdan oldin `isVersionAtLeast` orqali qo‘llab-quvvatlanishini tekshiring.

## Qachon Mini App tugmali botdan yaxshiroq

- Ko‘p tovarlar, filtrlar, rasmlar bo‘lsa.
- Bir nechta maydon va tekshiruvli formalar kerak bo‘lsa.
- Shaxsiy kabinet, buyurtmalar tarixi, savat bo‘lsa.
- Faqat matn emas, brend dizayni muhim bo‘lsa.

Agar ssenariy uchta savol va javobdan iborat bo‘lsa, oddiy bot yetarli: uni tezroq yaratish va qo‘llab-quvvatlash osonroq.

## Ko‘p uchraydigan xatolar

- Serverda imzoni tekshirmasdan foydalanuvchi ma’lumotlariga ishonish.
- Interfeysni kompyuterga moslab qilish: ko‘pchilik Mini App ni telefonda ochadi.
- Telegram mavzusini e’tiborsiz qoldirish — qorong‘i rejimdagi oq ekran begona ko‘rinadi.
- «Orqaga» tugmasi va ilova ichidagi navigatsiyani unutish.

## FAQ

### Mini App uchun alohida server kerakmi?

Frontend uchun HTTPS hosting va odatda initData ni tekshirish, baza va to‘lovlar bilan ishlash uchun backend kerak. Bu bot ishlayotgan server bilan bir xil bo‘lishi mumkin.

### Mavjud saytni Mini App ga aylantirsa bo‘ladimi?

Texnik jihatdan bot sozlamalarida uning manzilini ko‘rsatish kifoya. Lekin odatda saytni moslashtirish kerak: mobil maket, Telegram mavzusi, login o‘rniga initData orqali kirish.

### Mini App kompyuterda ishlaydimi?

Ha, Telegramning desktop va veb versiyalarida ham Mini App ochiladi, lekin ba’zi funksiyalar, masalan biometriya yoki tebranish, u yerda mavjud bo‘lmasligi mumkin.
