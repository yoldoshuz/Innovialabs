---
title: Mobile-first indeksatsiya: bu nima va saytni qanday tayyorlash kerak
description: Google saytning mobil versiyasini indekslaydi. Desktop bilan qanday farqlar reytingga zarar qilishini va saytni chek-list bo‘yicha tekshirishni ko‘ramiz.
summary: Mobile-first indeksatsiyada qidiruv tizimi saytni mobil versiyasi bo‘yicha baholaydi, shuning uchun mobilda yo‘q narsa — matn, belgilash, rasmlar — reyting uchun amalda mavjud emas.
---
## Mobile-first indeksatsiya nima

**Mobile-first indeksatsiya** — Google saytni smartfon qanday ko‘rsa, xuddi shunday skanerlashi va indekslashidir. Asosiy robot — **Googlebot Smartphone**, indeksga aynan sahifaning mobil versiyasi tushadi va reytingda ishtirok etadi.

Bu alohida «mobil indeks» emas. Indeks bitta, faqat uning ma’lumot manbai mobil versiya. Agar sahifa telefonda kompyuterdagidan kambag‘alroq bo‘lsa, qidiruv aynan shu kambag‘al versiyani ko‘radi — hatto desktop foydalanuvchilari uchun ham.

## Amalda nima uchun muhim

Ko‘p saytlar tarixan «kompyuter uchun» yaratilgan, mobil versiya esa soddalashtirilgan: bloklar olib tashlangan, matnlar qisqartirilgan, belgilash o‘chirilgan. Mobile-first yondashuvda bunday soddalashtirishlar SEO ga to‘g‘ridan-to‘g‘ri zarba beradi.

Asosiy tamoyil — **kontent pariteti**: mobil va desktop versiyalarda bir xil asosiy mazmun bo‘lishi kerak.

## Paritetdagi tipik muammolar

- **Qisqartirilgan kontent.** Mahsulot tavsiflari, sharhlar, FAQ yoki xususiyatlar jadvali faqat desktopda ko‘rinadi. Agar ular mobil HTML da umuman bo‘lmasa, indeksda ham yo‘q.
- **Harakatdan keyin yuklanadigan kontent.** Matn faqat bosish yoki svaypdan keyin yuklansa, robot uni katta ehtimol bilan ko‘rmaydi: u tugmalarni bosmaydi va karusellarni varaqlamaydi. Akkordeon va tablar mumkin, agar ularning mazmuni HTML da allaqachon bo‘lsa.
- **Yo‘qolgan mikrobelgilash.** Structured data (Product, FAQ, BreadcrumbList va h.k.) desktopda bor, lekin mobil shablonda chiqarilmaydi.
- **Turli meta teglar.** Title, description va meta robots mos kelishi kerak. Mobil shablondagi tasodifiy `noindex` — keng tarqalgan va og‘riqli xato.
- **Noto‘g‘ri lazy loading.** Nostandart skriptlar orqali faqat aylantirganda yuklanadigan rasmlar va bloklar indeksga tushmasligi mumkin. Mahalliy `loading="lazy"` yoki IntersectionObserver ishonchliroq.
- **Alt siz rasmlar** yoki faqat mobil versiyada past sifatli rasmlar.
- **Bloklangan resurslar.** Mobil versiya uchun CSS, JS yoki rasmlar robots.txt da yopilgan va robot sahifani to‘g‘ri chiza olmaydi.

## Saytni qanday tayyorlash: chek-list

1. **Adaptiv dizaynga o‘ting**, agar sayt hali ham alohida mobil subdomendan (m.example.com) foydalansa. Barcha qurilmalar uchun bitta URL va bitta HTML — paritetni kafolatlashning eng oddiy yo‘li.
2. **HTML ni solishtiring**: asosiy sahifalarning mobil va desktop versiyalaridagi H1–H3 sarlavhalar, asosiy matn, havolalar, rasmlar.
3. **Mikrobelgilashni tekshiring** mobil versiyada Rich Results Test vositasi orqali.
4. **Sahifani robot ko‘zi bilan oching.** Google Search Console dagi URL tekshirish vositasi Googlebot Smartphone chizgan HTML va skrinshotni ko‘rsatadi.
5. **Ichki havolalarni tekshiring.** Agar mobil menyu muhim bo‘limlarni HTML dan chiqarib tashlasa, bu sahifalar qiyinroq topiladi va kamroq havola vaznini oladi.
6. **Tezlikni kuzating.** Mobil foydalanuvchilar ko‘pincha sekin tarmoqda bo‘ladi, Core Web Vitals ham mobil ma’lumotlar bo‘yicha baholanadi.

## Agar sizda alohida mobil versiya bo‘lsa

Agar hozircha adaptiv dizaynga o‘tishning iloji bo‘lmasa, alohida versiya asosiysi bilan bog‘langan bo‘lishi kerak:

```html
<!-- desktop sahifada -->
<link rel="alternate" media="only screen and (max-width: 640px)" href="https://m.example.com/page">

<!-- mobil sahifada -->
<link rel="canonical" href="https://www.example.com/page">
```

Bundan tashqari, mobil subdomen xuddi shu kontent, belgilash va meta teglarni berishi, uning resurslari esa bloklanmasligi kerak.

## FAQ

### Sayt adaptiv dizaynga ega bo‘lsa, biror narsa qilish kerakmi?

Odatda kichik ekranlarda muhim bloklar HTML dan olib tashlanmasligini va lazy loading to‘g‘ri ishlashini tekshirish yetarli. Barcha qurilmalar uchun HTML bitta bo‘lsa, paritet muammolarining aksariyati yo‘qoladi.

### Yig‘ilgan akkordeon va tablardagi kontent indekslanadimi?

Ha, agar matn HTML da allaqachon mavjud bo‘lib, faqat vizual yig‘ilgan bo‘lsa. Muammo kontent serverdan faqat bosishdan keyin yuklanganda paydo bo‘ladi.

### Mobile-first indeksatsiya desktop qidiruvidagi pozitsiyalarga ta’sir qiladimi?

Ha. Indeks umumiy, shuning uchun sahifa mobil va desktop qidiruvida ham mobil versiya ma’lumotlari bo‘yicha reytinglanadi.
