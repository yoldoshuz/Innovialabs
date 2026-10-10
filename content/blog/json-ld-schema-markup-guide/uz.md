---
title: Saytga JSON-LD mikrobelgilashni qanday qo‘shish kerak
description: Organization, LocalBusiness, Product, Article, FAQ va Breadcrumb uchun tayyor JSON-LD misollari hamda belgilashni Google va Schema.org vositalari bilan tekshirish.
summary: JSON-LD — bu Schema.org lug‘ati bilan sahifani qidiruv tizimlari uchun tasvirlaydigan script type="application/ld+json" bloki; mos turni qo‘shing, haqiqiy ma’lumotlar bilan to‘ldiring va validatorda tekshiring.
---
## Qisqacha: JSON-LD nima va uni qayerga qo‘yish kerak

**JSON-LD** — Google tavsiya qiladigan tuzilgan ma’lumotlar formati. Bu `<script type="application/ld+json">` tegi ichidagi **Schema.org** lug‘atidan foydalanadigan JSON obyekt. Uni `<head>` yoki `<body>` ichiga joylash mumkin — sahifaning ko‘rinishiga ta’sir qilmaydi.

Belgilash qidiruv tizimlariga sahifada nima borligini aniq tushunishga yordam beradi: kompaniya, mahsulot yoki maqola. Buning evaziga sahifa narx, reyting yoki «non ushoqlari» bilan **kengaytirilgan snippet** olishi mumkin. Kafolat yo‘q: qarorni qidiruv tizimi qabul qiladi.

Asosiy qoida: **belgilash ko‘rinadigan kontentga mos bo‘lishi kerak**. Sahifada yo‘q narx, sharh yoki savollarni belgilamang.

## Organization — bosh sahifa uchun

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Example Studio",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "sameAs": ["https://t.me/example"]
}
```

## LocalBusiness — ofis yoki do‘kon bo‘lsa

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Example Studio",
  "telephone": "+998 00 000 00 00",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Namuna ko‘chasi, 1",
    "addressLocality": "Toshkent",
    "addressCountry": "UZ"
  },
  "openingHours": "Mo-Fr 09:00-18:00"
}
```

Aniqroq kichik tur mavjud bo‘lsa, undan foydalaning: `Restaurant`, `Dentist`, `Store`.

## Product — mahsulot kartochkasi uchun

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "X1 simsiz quloqchinlari",
  "image": "https://example.com/x1.jpg",
  "sku": "X1-BLK",
  "offers": {
    "@type": "Offer",
    "price": "0.00",
    "priceCurrency": "UZS",
    "availability": "https://schema.org/InStock"
  }
}
```

Belgilash vitrinadan farq qilmasligi uchun narx va mavjudlikni ma’lumotlar bazasidan oling.

## Article — blog maqolalari uchun

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "LCP’ni qanday yaxshilash mumkin",
  "datePublished": "2026-01-15",
  "dateModified": "2026-02-01",
  "author": { "@type": "Organization", "name": "Example Studio" },
  "image": "https://example.com/cover.jpg"
}
```

## FAQPage — savollar bloki uchun

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Yetkazib berish qancha davom etadi?",
    "acceptedAnswer": { "@type": "Answer", "text": "Bir kundan uch kungacha." }
  }]
}
```

Google FAQ snippetlarini faqat cheklangan nufuzli saytlar uchun ko‘rsatadi, lekin belgilash yaroqli bo‘lib qoladi va mashinalarga sahifa tuzilishini tushunishga yordam beradi.

## BreadcrumbList — «non ushoqlari»

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Blog", "item": "https://example.com/blog" },
    { "@type": "ListItem", "position": 2, "name": "SEO", "item": "https://example.com/blog/seo" }
  ]
}
```

## Belgilashni qanday tekshirish kerak

1. Google’ning **Rich Results Test** vositasi sahifa qaysi kengaytirilgan natijalarga da’vogar ekanini va qaysi maydonlar majburiyligini ko‘rsatadi.
2. **Schema Markup Validator** (validator.schema.org) sintaksisni butun Schema.org lug‘ati bo‘yicha, jumladan Google ishlatmaydigan turlar bilan ham tekshiradi.
3. E’lon qilingandan keyin Google Search Console’dagi yaxshilanishlar hisobotlarini kuzating — u yerda butun saytdagi xatolar ko‘rinadi.

## Ko‘p uchraydigan xatolar

- Statik belgilash eskiradi: narx o‘zgargan, JSON-LD’da esa eskisi qolgan.
- JSON sintaksis xatolari: ortiqcha vergul butun blokni buzadi.
- `url`, `image`, `logo` maydonlarida absolyut o‘rniga nisbiy havolalar.
- Katalogning barcha sahifalarida bir xil Product belgilashi.

## FAQ

### Bitta sahifada bir nechta JSON-LD bloki bo‘lishi mumkinmi?

Ha. Organization, BreadcrumbList va Article yonma-yon tura oladi. Ularni alohida skriptlar sifatida qoldirish yoki `@graph` massiviga birlashtirish mumkin.

### Mikrobelgilash pozitsiyalarga bevosita ta’sir qiladimi?

O‘z-o‘zidan yo‘q. U qidiruv tizimiga sahifani tushunishga yordam beradi va natijani ko‘zga tashlanadigan qiladigan kengaytirilgan snippet berishi mumkin.

### Qaysi biri yaxshiroq: JSON-LD yoki Microdata?

Ikkalasi ham qo‘llab-quvvatlanadi, lekin JSON-LD’ni yuritish osonroq: u HTML maketidan alohida turadi va ma’lumotlardan oson generatsiya qilinadi.
