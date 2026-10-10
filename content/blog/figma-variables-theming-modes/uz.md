---
title: Figma’da mavzular va brendlar uchun o‘zgaruvchilar va rejimlar
description: Figma’da yorug‘ va qorong‘i mavzu hamda bir nechta brend uchun rang, son va satr o‘zgaruvchilarini rejimlar bilan sozlash va komponentlarga bog‘lash.
summary: Figma o‘zgaruvchilari rang, son, satr va mantiqiy qiymatlarni saqlaydi, rejimlar esa har bir o‘zgaruvchiga bir nechta qiymat beradi. Primitivlar, brendlar va mavzularni alohida kolleksiyalarga ajrating, komponentlarni faqat semantik o‘zgaruvchilarga bog‘lang — shunda mavzu yoki brendni almashtirish bitta rejimni o‘zgartirishga aylanadi.
---

## Qisqa javob

Figma’dagi **o‘zgaruvchi** (variable) — qatlam xususiyatiga bog‘lash mumkin bo‘lgan nomli qiymat. O‘zgaruvchilar **kolleksiyalarga** birlashadi, kolleksiyada esa **rejimlar** (modes) bo‘lishi mumkin: bitta `bg/surface` o‘zgaruvchisi Light rejimida oq, Dark rejimida deyarli qora rangni saqlaydi. Freymda rejimni almashtirsangiz, ichidagi barcha elementlar yangilanadi.

O‘zgaruvchi turlari:

| Tur | Nimani saqlaydi | Nimaga bog‘lanadi |
|---|---|---|
| Color | rang | to‘ldirish, chegara, matn rangi, effektlar |
| Number | son | kenglik, balandlik, padding, gap, radius, chegara qalinligi, shrift o‘lchami |
| String | matn | matn qatlami mazmuni, shrift oilasi va qalinligi |
| Boolean | true/false | qatlam ko‘rinishi, variantlarning mantiqiy xususiyatlari |

## Kolleksiyalar tuzilmasi

Eng ko‘p uchraydigan xato — hamma narsani bitta kolleksiyaga solish. Mavzular va multibrend uchun barqaror sxema uch darajadan iborat:

1. **Primitives** — rejimlarsiz palitra: `violet/600`, `gray/50`, `space/4`. Dizaynerlar ularni to‘g‘ridan-to‘g‘ri ishlatmasligi uchun nashrdan yashiriladi.
2. **Brand** — har bir brend uchun rejim (Brand A, Brand B). `brand/primary` kabi o‘zgaruvchilar turli primitivlarga alias orqali murojaat qiladi.
3. **Theme** — Light va Dark rejimlari. `bg/surface`, `text/primary`, `action/primary` kabi semantik o‘zgaruvchilar Brand yoki Primitives’ga murojaat qiladi.

Komponentlar **faqat semantik darajaga** bog‘lanadi. Shunda brend va mavzu mustaqil almashadi: freymda Brand B + Dark tanlash mumkin.

## Bosqichma-bosqich sozlash

1. Variables panelini oching va Primitives kolleksiyasini yarating. Guruhlar uchun slesh ishlating: `violet/100`, `violet/600`.
2. Brand kolleksiyasini yarating va har bir brend uchun rejim qo‘shing. Har bir qiymat uchun hex-kod emas, primitivga alias tanlang.
3. Light va Dark rejimli Theme kolleksiyasini yarating va semantik o‘zgaruvchilarni aliaslar bilan to‘ldiring.
4. Sonlar uchun alohida kolleksiya oching, masalan Default va Compact rejimli Density — shunda oraliqlar va radiuslar birga o‘zgaradi.
5. Satr o‘zgaruvchilari lokalizatsiyada foydali: RU, EN, UZ rejimlari interfeys uzun so‘zlarga bardosh berishini ko‘rsatadi.
6. **Scoping**ni sozlang — o‘zgaruvchi qayerda ko‘rinishini cheklang. Matn rangi fon to‘ldirish uchun, spacing esa radius uchun taklif qilinmasligi kerak.
7. Web, iOS va Android uchun **code syntax** kiriting, shunda dasturchi Dev Mode’da koddagi token nomini ko‘radi.

## Komponentlarga bog‘lash

- Qatlamni tanlang va xususiyat yonidagi o‘zgaruvchi ikonkasini bosing: to‘ldirish, padding, gap, radius.
- Matnda faqat rangni emas, o‘lcham, qatorlar oralig‘i va qalinlikni ham bog‘lang.
- Mantiqiy o‘zgaruvchilarni komponent xususiyatlari, masalan ikonkani ko‘rsatish bilan bog‘lash qulay.
- Rejim o‘ng paneldagi rejimlar bloki orqali freym, seksiya yoki sahifa darajasida beriladi. Ichki nusxalar odatda ota-elementning rejimini meros oladi, lekin uni lokal o‘zgartirish mumkin.

Tekshirish: bitta ekranni yig‘ing, nusxa oling va rejimlarni almashtiring. Qayerdadir «noto‘g‘ri» rang qolsa, demak u yerda o‘zgaruvchi o‘rniga qattiq hex yozilgan.

## Tipik xatolar

- **Komponentlar primitivlarga bog‘langan.** Qorong‘i mavzu uchun qo‘lda qayta bo‘yash kerak bo‘ladi.
- **Nomlar vazifaga emas, rangga qarab.** Brend binafsha rangga o‘tganda `blue-button` buziladi.
- **Holatlar uchun tokenlar yo‘q.** Hover, pressed va disabled alohida semantik o‘zgaruvchi bo‘lishi kerak.
- **Unutilgan effektlar va chegaralar.** Soyalar va ajratgichlarga ham qorong‘i mavzu uchun qiymat kerak.
- **Kod bilan nomuvofiqlik.** Figma’dagi o‘zgaruvchilar va koddagi tokenlar nomi mos kelishi kerak.

## FAQ

### O‘zgaruvchilar uslublardan nimasi bilan farq qiladi?

Uslub xususiyatlar to‘plamini (masalan, soya yoki gradient) saqlaydi, o‘zgaruvchi esa rejim va aliaslarni qo‘llab-quvvatlaydigan bitta qiymatni. Amalda ularni birga ishlatishadi: imkon bo‘lgan joyda uslublar o‘zgaruvchilardan yig‘iladi.

### Nechta rejim yaratish mumkin?

Cheklov Figma tarifiga bog‘liq. Brendlar ko‘p bo‘lsa, tarifingiz cheklovlarini oldindan tekshiring va kolleksiyalar tuzilmasini shunga moslang.

### O‘zgaruvchilarni dasturchilarga qanday uzatish mumkin?

Dasturchilar bog‘langan o‘zgaruvchilar va ularning code syntax’ini Dev Mode’da ko‘radi. Kod tokenlariga avtomatik eksport plaginlar yoki Figma API orqali qilinadi — usul tarifingiz va frontend yig‘ilishiga bog‘liq.
