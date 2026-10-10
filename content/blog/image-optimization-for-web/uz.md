---
title: Rasmlarni optimallashtirish: WebP, AVIF, srcset va lazy loading
description: Rasm formatini tanlash, siqish, srcset va sizes, lazy loading, maket siljishisiz o‘lchamlar va image CDN qachon kerakligi haqida amaliy qo‘llanma.
summary: WebP yoki AVIF bering, srcset va sizes orqali o‘lchamni ekranga moslang, faqat birinchi ekrandan pastda lazy loading qiling, doim width va height ko‘rsating va buni yig‘ish yoki image CDN bilan avtomatlashtiring.
---

## Bir daqiqada asosiysi

Rasmlar ko‘pincha sahifaning eng og‘ir qismi bo‘ladi va tez-tez LCP elementi hisoblanadi. Optimallashtirish to‘rt narsaga borib taqaladi:

1. **To‘g‘ri format** — og‘ir JPEG/PNG o‘rniga WebP yoki AVIF.
2. **To‘g‘ri o‘lcham** — brauzer asl faylni emas, ekran kengligiga mos rasmni yuklaydi.
3. **To‘g‘ri vaqt** — birinchi ekrandan pastdagi narsalar keyinroq yuklanadi.
4. **Ajratilgan joy** — yuklanish paytida sahifa sakramasligi uchun.

## Formatni qanday tanlash kerak

| Format | Qachon ishlatish | Nozik jihatlar |
|---|---|---|
| **AVIF** | Vazn eng muhim bo‘lgan fotolar va murakkab rasmlar | Kodlash sekinroq; fallback qoldiring |
| **WebP** | Fotolar va shaffof grafika uchun universal tanlov | Zamonaviy brauzerlarda keng qo‘llab-quvvatlanadi |
| **JPEG** | Fotolar uchun fallback | Progressive va o‘rtacha sifatdan foydalaning |
| **PNG** | Aniqlik muhim bo‘lgan mayda matnli skrinshotlar | Fotolar uchun odatda juda og‘ir |
| **SVG** | Ikonkalar, logotiplar, oddiy illyustratsiyalar | SVGO bilan optimallashtiring, ichiga rastr joylamang |

Bir nechta formatni `<picture>` orqali berish mumkin — brauzer qo‘llab-quvvatlaydigan birinchisini oladi:

```html
<picture>
  <source srcset="/img/hero.avif" type="image/avif">
  <source srcset="/img/hero.webp" type="image/webp">
  <img src="/img/hero.jpg" alt="Tavsif" width="1200" height="630">
</picture>
```

## Siqish

- Fotolar uchun yo‘qotishli siqish deyarli doim maqbul. Sifatni hamma uchun bitta raqam bilan emas, real misollarda ko‘z bilan tanlang.
- Metama’lumotlarni (EXIF) o‘chiring — sahifa uchun ular foydasiz.
- Kameradan olingan «xom» suratlarni tayyor resurs sifatida joylamang — ularni yig‘ish jarayoni yoki Squoosh, sharp, imagemin kabi vositalardan o‘tkazing.

## Moslashuvchan rasmlar: srcset va sizes

`srcset` turli kenglikdagi rasm variantlarini sanab o‘tadi, `sizes` esa brauzerga rasm ekranda qancha joy egallashini aytadi. Brauzer piksel zichligini hisobga olib mos faylni o‘zi tanlaydi.

```html
<img
  src="/img/card-800.webp"
  srcset="/img/card-400.webp 400w, /img/card-800.webp 800w, /img/card-1600.webp 1600w"
  sizes="(max-width: 768px) 100vw, 33vw"
  alt="Kartochka tavsifi"
  width="800" height="600">
```

Ko‘p uchraydigan xato — `sizes`ni ko‘rsatmaslik: shunda brauzer rasm butun ekran kengligini egallaydi deb hisoblaydi va eng katta variantni yuklaydi.

## Lazy loading

- `loading="lazy"` atributi rasmlar ko‘rinadigan hududga yaqinlashmaguncha yuklanishni kechiktiradi. Buning uchun JavaScript kerak emas.
- Uni birinchi ekrandagi rasmlarga, ayniqsa LCP rasmiga **qo‘ymang** — bu chizishni sekinlashtiradi.
- Asosiy rasm uchun aksincha `fetchpriority="high"` qo‘shish mumkin.
- `decoding="async"` dekodlash asosiy oqimni to‘smasligiga yordam beradi.

## O‘lchamlar va CLS

Agar `<img>`da `width` va `height` bo‘lmasa, brauzer fayl yuklanmaguncha proporsiyalarni bilmaydi va pastdagi kontent «sakraydi». Bu **CLS** metrikasini yomonlashtiradi.

- Doim `width` va `height`ni (haqiqiy proporsiyalar) ko‘rsating, CSS’da esa moslashuvchanlik uchun `height: auto`.
- Fon rasmli konteynerlar uchun `aspect-ratio`dan foydalaning.

## Image CDN va freymvorklar

Har bir rasm uchun variantlarni qo‘lda tayyorlash noqulay, shuning uchun odatda bu avtomatlashtiriladi:

- **Image CDN** — URL parametrlari bo‘yicha o‘lcham, format va sifatni darhol o‘zgartiradigan va natijani keshlaydigan servis yoki o‘z proksingiz.
- **Freymvork komponentlari** — masalan, Next.js’dagi `next/image` `srcset` yaratadi, zamonaviy formatlarni beradi va standart holatda lazy loading’ni yoqadi.

Tanlashda quyidagilarga qarang: AVIF/WebP qo‘llab-quvvatlanishi, `Accept` sarlavhasi bo‘yicha formatni avtomatik aniqlash, keshlash va trafik narxi.

## Chek-list

- [ ] Fotolar WebP/AVIF’da, fallback bilan.
- [ ] `srcset` va to‘g‘ri `sizes`.
- [ ] `loading="lazy"` faqat birinchi ekrandan pastda.
- [ ] Barcha rasmlarda `width`/`height` yoki `aspect-ratio`.
- [ ] Kontent rasmlari uchun mazmunli `alt`, bezak rasmlari uchun bo‘sh `alt=""`.
- [ ] Metama’lumotlar o‘chirilgan, SVG’lar optimallashtirilgan.

## FAQ

### WebP yoki AVIF — qaysi birini tanlash kerak?

Vositalar imkon bersa, ikkalasini ham `<picture>` yoki image CDN orqali bering: AVIF odatda yengilroq, WebP esa ishonchli zaxira. Agar bitta format kerak bo‘lsa, WebP bilan ishlash osonroq.

### Lazy loading uchun JS kutubxona kerakmi?

Ko‘p hollarda yo‘q: nativ `loading="lazy"` yetarli. Kutubxonalar faqat maxsus holatlarda, masalan murakkab paydo bo‘lish effektlari uchun kerak.

### Rasmlarni optimallashtirish SEO’ga ta’sir qiladimi?

Ha, bilvosita: u tezlik va Core Web Vitals’ni yaxshilaydi. Bundan tashqari, tushunarli fayl nomlari va `alt` rasmlar bo‘yicha qidiruvda yordam beradi.
