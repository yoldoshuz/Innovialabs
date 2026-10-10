---
title: Dasturchi portfoliosi: qaysi loyihalarni kiritish va qanday bezash
description: Qaysi pet-loyihalar ish beruvchilarni qiziqtiradi, ularni README, demo va tahlillar bilan qanday taqdim etish va nega tutorial nusxalari sizga zarar qiladi.
summary: Portfolioga tushunarli muammoni hal qiladigan 2–4 ta tugallangan loyiha kerak — har birida README, ishlaydigan demo va qarorlaringiz haqida qisqa tahlil bo‘lsin, o‘nlab tutorial nusxalari emas.
---
## Ish beruvchi portfolioda nimani qidiradi

Portfolio rezyume ochiq qoldirgan savolga javob beradi: **vazifani natijagacha yetkaza olasizmi**. Ish beruvchi loyihalar soniga emas, quyidagilarga qaraydi:

- **tugallanganlik** — loyiha ishlaydi, uni ochib ko‘rish mumkin;
- **mustaqillik** — darsni takrorlash emas, sizning qarorlaringiz ko‘rinadi;
- **kod sifati** — tuzilma, tushunarli nomlar, ortiqcha narsalar yo‘q;
- **tushuntira olish** — nega aynan shunday qilingan.

Odatda **2–4 ta kuchli loyiha** yetarli. Yarim yo‘lda tashlab qo‘yilgan o‘ntadan ko‘ra oxirigacha yetkazilgan uchtasi yaxshiroq.

## Qanday loyihalar taassurot qoldiradi

Yaxshi loyiha tushunarli muammoni hal qiladi va kamida bitta murakkab qismga ega.

| Loyiha turi | Nega ishlaydi |
|---|---|
| Real muammo uchun vosita | Foydalanuvchi va mazmunli talablar bor |
| Tashqi API va xatolarni qayta ishlash bilan loyiha | Real ma’lumotlar bilan ishlashni ko‘rsatadi |
| Avtorizatsiya va ma’lumotlar bazasi bor ilova | To‘liq sikl: interfeysdan saqlashgacha |
| Open source’ga hissa | Begona kodni o‘qish va loyiha qoidalariga amal qilish |
| Tanish biznes yoki tashkilot uchun loyiha | Real foydalanuvchilar va fikr-mulohaza |

Loyihalarni istalgan rolga qarab tanlang. Frontend dasturchi uchun interfeys, moslashuvchanlik va qulaylik muhim. Backend uchun — API arxitekturasi, ma’lumotlar bazasi bilan ishlash, testlar. Ma’lumotlar tahlilchisi uchun — xulosa va vizualizatsiyali tadqiqot.

## Nimadan qochish kerak

- **Tutoriallardan aynan nusxalar**: video bo‘yicha takrorlangan navbatdagi vazifalar ro‘yxati yoki mashhur servis nusxasi ko‘nikmalaringizni ko‘rsatmaydi. Nusxa qilsangiz, o‘zingizning muhim funksiyalaringizni qo‘shing va ularni tasvirlang.
- Tavsifi yo‘q va demosi ishlamaydigan **tugallanmagan loyihalar**.
- **Repozitoriydagi kalitlar va parollar**: bu darhol ko‘zga tashlanadigan qizil bayroq.
- Butun kod bilan **bitta ulkan «initial commit»**.
- Kuchli ishlaringizni ko‘mib yuboradigan **o‘nlab mayda o‘quv repozitoriylari**.

## Loyihani qanday bezash kerak

### README

README — loyihaning vitrinasi. Rekruter kodni ochmasligi mumkin, lekin README’ni o‘qiydi. Minimal tuzilma:

```markdown
## Loyiha nomi

Bitta gap: nima qiladi va kim uchun.

Demo: havola · Skrinshot yoki GIF

## Imkoniyatlar
- Asosiy funksiya 1
- Asosiy funksiya 2

## Stek
React, TypeScript, Node.js, PostgreSQL

## Qanday ishga tushirish
npm install
npm run dev

## Qarorlar va qiyinchiliklar
Nega shu yondashuv tanlangan, nima qiyin bo‘ldi va qanday hal qilindi.
```

### Demo

Ishlaydigan havola asosiy to‘siqni olib tashlaydi: odam natijani bir necha soniyada ko‘radi. Frontend uchun bepul statik hosting yetarli, mobil ilovalar uchun — asosiy ssenariylar videosi yoki GIF. Demo kirishni talab qilsa, README’da test akkaunt bering.

### Loyiha tahlili

Bir-ikki ekranlik qisqa matn — README’da, blogda yoki portfolio saytida:

- qanday muammoni hal qildingiz;
- qanday variantlarni ko‘rib chiqdingiz va nega aynan buni tanladingiz;
- nima noto‘g‘ri ketdi va qanday tuzatdingiz;
- hozir nimani yaxshilagan bo‘lardingiz.

Bunday tahlil ko‘pincha suhbatda muhokama mavzusiga aylanadi va muhandislik fikrlashini kodning o‘zidan yaxshiroq ko‘rsatadi.

## Portfolioni qayerga joylashtirish kerak

- Eng yaxshi repozitoriylari biriktirilgan **GitHub** — dasturchi uchun majburiy.
- Loyiha kartochkalari bilan **oddiy portfolio sayti**: nomi, tavsifi, steki, demo va kodga havolalar.
- Rezyume va LinkedIn’da faqat profilga emas, **aniq loyihalarga havolalar**.

Portfolio sayti murakkab bo‘lishi shart emas. U tez ochilishi, telefonda yaxshi ko‘rinishi va loyihalarga bir bosishda olib borishi muhimroq.

## FAQ

### Portfolioda nechta loyiha bo‘lishi kerak?

Odatda istalgan rolga mos tanlangan 2–4 ta tugallangan loyiha yetarli. Miqdordan ko‘ra sifat va taqdimot muhimroq.

### Kurslardagi o‘quv loyihalarini kiritsa bo‘ladimi?

Agar ularni sezilarli darajada rivojlantirgan bo‘lsangiz va README’da nima asos bo‘lgani, nimani o‘zingiz qo‘shganingiz halol yozilgan bo‘lsa — bo‘ladi. Darsdan o‘zgarishsiz takrorlangan loyihani birinchi o‘ringa chiqarmagan ma’qul.

### Backend dasturchi bo‘lsam, dizayn kerakmi?

Murakkab interfeys shart emas. Tushunarli README, API hujjatlari va imkon bo‘lsa, ishini tekshirishning oddiy usuli — masalan, so‘rovlar to‘plami yoki minimal mijoz — yetarli.
