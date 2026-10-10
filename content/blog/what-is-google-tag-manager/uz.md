---
title: Google Tag Manager nima va u marketologga nima uchun kerak
description: GTM’dagi teglar, triggerlar, o‘zgaruvchilar va dataLayer hamda analitika va piksellarni GTM orqali ulash nega sayt kodini tahrirlashdan tez va xavfsizroq.
summary: Google Tag Manager — marketolog sayt kodini o‘zgartirmasdan analitika hisoblagichlari va reklama piksellarini ulaydigan bepul konteyner. Dasturchi GTM’ni bir marta o‘rnatadi va hodisalarni dataLayer’ga uzatadi, keyin teglar interfeysda sozlanadi, tekshiriladi va orqaga qaytariladi.
---

## Qisqa javob

**Google Tag Manager (GTM)** — **teglarni** boshqarish uchun Google’ning bepul vositasi: analitika kodlari, reklama piksellari va boshqa servislar. Har bir kodni saytga qo‘yish o‘rniga dasturchi GTM konteynerini **bir marta** o‘rnatadi, qolgan hammasi esa veb-interfeysda sozlanadi.

Bu nima beradi:

- yangi piksel yoki maqsad sayt relizisiz bir necha daqiqada ulanadi;
- o‘zgarishlarni nashr qilishdan oldin oldindan ko‘rish rejimida tekshirish mumkin;
- har bir nashrning versiyasi bor va xatoni bitta harakat bilan orqaga qaytarish mumkin.

## GTM nimalardan iborat

| Element | Bu nima | Misol |
|---|---|---|
| **Teg** | Bajarilishi kerak bo‘lgan kod | GA4 hodisasi, Meta Pixel, Yandex Metrika hisoblagichi |
| **Trigger** | Tegni qachon bajarish sharti | Har qanday sahifani ko‘rish, tugmani bosish, formani yuborish, maxsus hodisa |
| **O‘zgaruvchi** | Tegga qo‘yiladigan yoki shartda ishlatiladigan qiymat | Sahifa URL’i, tugma matni, dataLayer’dan buyurtma summasi |

Mantiq oddiy: **teg trigger bajarilganda ishga tushadi va o‘zgaruvchilar qiymatlaridan foydalanadi**.

## dataLayer nima

**dataLayer** — sahifadagi massiv bo‘lib, u orqali sayt GTM’ga nima sodir bo‘lganini xabar qiladi va ma’lumotlarni uzatadi. Dasturchi kodga hodisa yuborishni qo‘shadi, marketolog esa GTM’da uni qaysi servislarga uzatishni hal qiladi.

Misol: forma muvaffaqiyatli yuborilgandan keyin sayt quyidagini bajaradi:

```js
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'lead_submit',
  form_name: 'contact'
});
```

Keyin GTM’da:

1. `lead_submit` nomli «Maxsus hodisa» turidagi **trigger**.
2. `form_name` uchun ma’lumotlar qatlami **o‘zgaruvchisi**.
3. **Teglar**: GA4 hodisasi, Meta Pixel uchun Lead hodisasi, Metrikadagi maqsad — barchasi bitta triggerda.

Dasturchilardan bitta hodisa — marketologda xohlagancha servis. Bu tugmalarning CSS klasslari bo‘yicha kliklarni kuzatishdan ishonchliroq: dizayn o‘zgaradi, hodisa esa qoladi.

## Nega bu kodni tahrirlashdan tezroq va xavfsizroq

- **Tezlik.** Bitta piksel uchun dasturchi va relizni kutish shart emas.
- **Oldindan ko‘rish.** Preview rejimi (Tag Assistant) har bir qadamda qaysi teglar ishlaganini va dataLayer’da qanday ma’lumotlar bo‘lganini ko‘rsatadi.
- **Versiyalar va orqaga qaytarish.** Har bir nashr saqlanadi, muvaffaqiyatsizini oldingi versiyaga qaytarish mumkin.
- **Ish maydonlari.** Bir necha kishi o‘zgarishlarni parallel tayyorlashi va bir-biriga xalaqit bermasligi mumkin.
- **Tartib.** Barcha teglar bir joyda ko‘rinadi — saytda nima o‘rnatilganini tushunish va ortiqchasini olib tashlash osonroq.
- **Kirish huquqlari.** Ba’zilarga tahrirlashga, nashr qilishga esa faqat mas’ul shaxsga ruxsat berish mumkin.

## Qanday boshlash kerak

1. tagmanager.google.com’da akkaunt va «Veb» turidagi konteyner yarating.
2. Dasturchidan GTM kodining ikki qismini qo‘yishni so‘rang: `<head>` ichiga va `<body>` ochilgandan keyin darhol.
3. Dublikatlar bo‘lmasligi uchun GTM’ga ko‘chirayotgan piksel va hisoblagichlarni sayt kodidan olib tashlang.
4. Dasturchilar bilan dataLayer uchun hodisalar ro‘yxatini kelishib oling: ariza, ro‘yxatdan o‘tish, summa va valyutali xarid.
5. Teglarni sozlang, Preview’da tekshiring va versiyaning tushunarli tavsifi bilan nashr qiling.

## Ko‘p uchraydigan xatolar va xavflar

- **Dublikatlar.** Bitta piksel ham kodda, ham GTM’da turibdi — konversiyalar ikki marta hisoblanadi.
- **Teglar juda ko‘p.** Har bir skript yuklanishni sekinlashtiradi. Foydalanilmaydiganlarini muntazam o‘chiring.
- **Keng kirish.** GTM saytda har qanday JavaScript’ni bajara oladi, shuning uchun nashr qilish huquqi cheklangan doiradagi odamlarda bo‘lishi kerak.
- Oldindan ko‘rish rejimida **tekshirmasdan nashr qilish**.
- Teglarga keraksiz **shaxsiy ma’lumotlarni yig‘ish**, masalan URL yoki hodisa parametrlarida ochiq ko‘rinishdagi email.

## FAQ

### GTM o‘zi biror narsani o‘lchaydimi?

Yo‘q. GTM — boshqa servislar kodini yetkazish va ishga tushirish usuli xolos. Ma’lumotlarni GA4, Metrika va reklama platformalari yig‘adi va ko‘rsatadi.

### GTM bo‘lsa, dasturchi kerakmi?

Konteynerni dastlabki o‘rnatish va hodisalarni dataLayer’ga uzatish uchun — ha, bu sayt tomonidagi ish. Teglarni keyinchalik ulash va o‘zgartirishni marketolog odatda o‘zi bajaradi.

### Server GTM nima?

Bu serveringizda yoki bulutda ishlaydigan alohida konteyner. Brauzer ma’lumotlarni unga yuboradi, server esa ularni analitika va reklama tizimlariga uzatadi. Shunda saytda skriptlar kamroq va ma’lumotlar ustidan nazorat ko‘proq bo‘ladi, lekin sozlash va hosting uchun to‘lov kerak.
