---
title: CSR, SSR, SSG va ISR: rendering strategiyalari oddiy tilda
description: CSR, SSR, SSG va ISR tezlik, SEO, server narxi va ma’lumot yangiligi bo‘yicha qanday farq qiladi va blog, do‘kon yoki dashboard uchun qaysi biri mos.
summary: Farq HTML qayerda va qachon yig‘ilishida: brauzerda (CSR), har so‘rovda serverda (SSR), build paytida bir marta (SSG) yoki davriy yangilanish bilan build paytida (ISR). Kontent saytlariga SSG va ISR, shaxsiy sahifalarga SSR, yopiq panellarga CSR mos.
---

## Bir daqiqada asosiysi

Har qanday sahifa oxir-oqibat HTML’ga aylanadi. Rendering strategiyalari ikki savolga javob beradi: bu HTML **qayerda** va **qachon** yig‘iladi.

- **CSR (Client-Side Rendering)** — brauzerda, JavaScript yuklangandan keyin.
- **SSR (Server-Side Rendering)** — serverda, har bir so‘rovda.
- **SSG (Static Site Generation)** — serverda, loyiha build qilinganda bir marta.
- **ISR (Incremental Static Regeneration)** — SSG kabi, lekin sahifalar butun saytni qayta yig‘masdan taymer yoki hodisa bo‘yicha yangilanadi.

Next.js va Nuxt kabi zamonaviy freymvorklar bitta saytda strategiyalarni **aralashtirish** imkonini beradi: har bir sahifa o‘zinikini oladi.

## Bu qanday ko‘rinadi

```text
CSR:  Brauzer -> bo‘sh HTML + JS -> JS API’ga so‘rov yuboradi -> sahifa ko‘rinadi
SSR:  Brauzer -> server ma’lumot bilan HTML yig‘adi -> tayyor sahifa
SSG:  Build -> CDN’da tayyor HTML fayllar -> brauzer ularni darhol oladi
ISR:  SSG kabi, lekin N soniyadan yoki hodisadan keyin sahifa
      fonda jimgina qayta yig‘iladi
```

## Har bir strategiya batafsil

**CSR.** Server deyarli bo‘sh sahifa va JavaScript bundle beradi, qolganini brauzer bajaradi. Afzalliklari: oddiy hosting, ilova ichida silliq o‘tishlar. Kamchiliklari: birinchi ko‘rinish sekinroq, ayniqsa kuchsiz telefonlarda, qidiruv tizimlariga kontentni ko‘rish qiyinroq.

**SSR.** Server har bir so‘rovda ma’lumot oladi va tayyor HTML qaytaradi. Afzalliklari: kontent darhol ko‘rinadi, ma’lumot doim yangi, SEO uchun yaxshi. Kamchiliklari: ishlab turgan server kerak, yuklama trafik bilan o‘sadi, sekin API butun sahifani sekinlashtiradi.

**SSG.** Barcha sahifalar oldindan yig‘iladi va fayl sifatida saqlanadi. Afzalliklari: maksimal tezlik, minimal narx, yuqori ishonchlilik. Kamchiliklari: kontentni yangilash uchun qayta build kerak; minglab sahifalarda build uzoq davom etadi.

**ISR.** Murosa: sahifa statik sifatida beriladi, lekin vaqti-vaqti bilan yoki signal bo‘yicha yangilanadi. Afzalliklari: statik tezligi va yetarlicha yangi ma’lumot. Kamchiliklari: foydalanuvchilar qisqa vaqt eski versiyani ko‘rishi mumkin; bu rejimni qo‘llab-quvvatlaydigan platforma kerak.

## Taqqoslash

| | CSR | SSR | SSG | ISR |
|---|---|---|---|---|
| Birinchi ko‘rinish tezligi | Pastroq | Yaxshi | Eng yaxshi | Eng yaxshi |
| SEO | Kuchsizroq | A’lo | A’lo | A’lo |
| Server yuklamasi | Minimal | Yuqori | Minimal | Past |
| Ma’lumot yangiligi | Doim yangi | Doim yangi | Qayta build’gacha | Kechikish bilan |
| Shaxsiylashtirish | Ha | Ha | Yo‘q | Yo‘q |

## Loyihangiz uchun nimani tanlash kerak

- **Blog, hujjatlar, landing** — SSG. Kontent CMS orqali tahrirlansa — butun saytni qayta yig‘maslik uchun ISR.
- **Internet-do‘kon** — katalog va mahsulot sahifalari ISR orqali (tez va indekslanadi), savat va buyurtma rasmiylashtirish — SSR yoki CSR, chunki ular shaxsiy.
- **Yangiliklar sayti** — qisqa interval yoki nashr paytida revalidatsiya bilan ISR.
- **Shaxsiy kabinet, dashboard, admin panel** — CSR yoki SSR. Bu yerda SEO kerak emas, sahifalar login ortida, ma’lumot esa har kimda o‘ziniki.
- **Qidiruv va filtrlar sahifasi** — natijalar indekslanishi kerak bo‘lsa SSR, aks holda CSR.

## Keng tarqalgan xatolar

- **Ommaviy saytni to‘liq CSR’da qilish.** Kontent kech paydo bo‘ladi, qidiruvda targ‘ib qilish qiyinlashadi.
- **Hamma narsa uchun SSR.** O‘zgarmaydigan sahifalar har so‘rovda qayta render qilinadi — serverga ortiqcha xarajat.
- **Statikada shaxsiy ma’lumotlar.** Keshlangan sahifa bir foydalanuvchiga boshqasining ma’lumotini ko‘rsatishi mumkin.
- **Butun sayt uchun bitta strategiya.** Zamonaviy freymvorklarning kuchi — aralashtirishda.

## FAQ

### SEO uchun qaysi strategiya eng yaxshi?

SSR, SSG va ISR bir xil darajada yaxshi: qidiruv tizimi tayyor HTML oladi. CSR ham indekslanishi mumkin, lekin odatda ishonchliligi va tezligi pastroq.

### Bitta loyihada bir nechta strategiyadan foydalansa bo‘ladimi?

Ha, ko‘pincha aynan shunday qilish kerak. Masalan, bosh sahifa va blog — statik, katalog — ISR, shaxsiy kabinet — SSR yoki CSR.

### ISR bu kesh bilan bir xilmi?

Mohiyatan bu tayyor sahifalarning boshqariladigan keshi: freymvork yig‘ilgan HTML’ni saqlaydi va uni qachon yangilashni o‘zi hal qiladi. Oddiy keshdan farqi — yangilanish fonda bo‘ladi va foydalanuvchi kutmaydi.
