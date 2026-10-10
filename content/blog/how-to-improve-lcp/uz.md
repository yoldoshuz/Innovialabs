---
title: LCP’ni qanday yaxshilash mumkin: asosiy kontent chizilishini tezlashtirish
description: LCP elementini qanday topish va tezlashtirish: server javobi vaqti, bloklovchi resurslar, rasm ustuvorligi, preload va shriftlar bosqichma-bosqich.
summary: LCP elementini toping, uning to‘rt bosqichidan qaysi biri eng ko‘p vaqt olishini aniqlang va uni bartaraf eting: server javobini tezlashtiring, bloklovchi resurslarni olib tashlang, asosiy rasmga yuqori ustuvorlik bering va uni kechiktirmang.
---
## Qisqacha: LCP nima va uni qanday yaxshilash kerak

**LCP (Largest Contentful Paint)** — brauzer birinchi ekrandagi eng katta ko‘rinadigan elementni chizish uchun ketadigan vaqt: odatda bu asosiy rasm, banner yoki yirik sarlavha. Google tavsiyalariga ko‘ra, tashriflarning ko‘pchiligi uchun **2,5 soniyagacha** yaxshi natija hisoblanadi.

LCP’ni «umuman» emas, aniq nuqtada yaxshilash kerak: avval elementni topish, keyin vaqt qaysi bosqichda yo‘qolayotganini tushunish.

## 1-qadam. LCP elementini toping

- **PageSpeed Insights** LCP elementini va trafik yetarli bo‘lsa, haqiqiy foydalanuvchilarning dala ma’lumotlarini ko‘rsatadi.
- **Chrome DevTools → Performance**: yuklanishni yozib oling, vaqtlar yo‘lagida elementga havolali LCP belgisi paydo bo‘ladi.
- Search Console’dagi **Core Web Vitals** hisoboti muammoli sahifalar guruhlarini ko‘rsatadi.

Mobil versiyani tekshiring: unda LCP elementi ko‘pincha boshqacha, tarmoq va protsessor esa sekinroq.

## 2-qadam. LCP’ni bosqichlarga ajrating

| Bosqich | Nima sodir bo‘ladi | Kechikishning odatiy sababi |
|---|---|---|
| **TTFB** | HTML’ning birinchi baytini kutish | Sekin server, kesh yo‘q, uzoqdagi hosting |
| **Resurs yuklanishining kechikishi** | TTFB’dan rasm yuklana boshlaguncha | Rasm kech aniqlanadi: CSS yoki JS orqali |
| **Yuklanish davomiyligi** | Faylning o‘zini yuklab olish | Og‘ir rasm, mos bo‘lmagan format |
| **Chizishning kechikishi** | Yuklanishdan ko‘rsatilguncha | Bloklovchi CSS/JS, shriftlar, gidratsiya |

Eng ko‘p vaqt olayotgan bosqichni tuzating.

## Server javobini tezlashtiring

- HTML’ni keshlang: statik generatsiya yoki server va CDN darajasidagi kesh.
- Server yoki CDN’ni auditoriyaga yaqinroq joylashtiring.
- Ortiqcha redirektlarni olib tashlang: har biri qo‘shimcha tarmoq aylanishini qo‘shadi.
- Muhim sahifalardagi sekin ma’lumotlar bazasi so‘rovlarini optimallashtiring.

## Bloklovchi resurslarni olib tashlang

- Chizishdan oldin bajarilishi shart bo‘lmagan skriptlarni `defer` yoki `async` bilan ulang.
- Birinchi ekran uchun muhim CSS’ni sahifaga joylang, qolganini keyinroq yuklang.
- Birinchi ekrandan foydalanilmayotgan kutubxonalar va uchinchi tomon vidjetlarini olib tashlang.
- Asosiy kontentni JavaScript ortiga yashirmang: sarlavha yoki rasm faqat skript bajarilgandan keyin chiqsa, LCP oshadi.

## Asosiy rasmga ustuvorlik bering

Eng ko‘p uchraydigan xato — birinchi ekran rasmida `loading="lazy"`. Kechiktirilgan yuklash pastdagi rasmlar uchun kerak, LCP elementiga esa aksincha — yuqori ustuvorlik:

```html
<img src="/hero.avif" width="1200" height="600"
     fetchpriority="high" alt="Tavsif">
```

Agar rasm CSS’da fon sifatida berilgan bo‘lsa, brauzer uni kech aniqlaydi. Uni oddiy `<img>` qiling yoki preload qo‘shing:

```html
<link rel="preload" as="image" href="/hero.avif" fetchpriority="high">
```

Shuningdek:

- **WebP** yoki **AVIF** kabi zamonaviy formatlardan foydalaning;
- `srcset` va `sizes` orqali ekranga mos o‘lchamni bering;
- skript tugaguncha elementni yashirib turadigan paydo bo‘lish animatsiyalaridan qoching.

## Shriftlarni sozlang

Agar LCP elementi matn bo‘lsa, uni veb-shrift yuklanishi kechiktiradi.

- Matn darhol tizim shrifti bilan ko‘rinishi uchun `font-display: swap` dan foydalaning.
- Faqat bir-ikkita asosiy shrift fayli uchun preload qiling.
- Shriftlarni o‘z domeningizda joylashtiring va faqat kerakli belgilar to‘plamlarini ulang.

## Natijani qanday tekshirish kerak

Laboratoriya testlari ta’sirni darhol ko‘rsatadi, lekin Google bahosi so‘nggi haftalardagi haqiqiy foydalanuvchilarning **dala ma’lumotlariga** asoslanadi. Shuning uchun o‘zgarishlardan keyin laboratoriya o‘lchovlarini solishtiring, Search Console’dagi yaxshilanishni esa kechikish bilan kuting.

## FAQ

### Nega PageSpeed Insights’da LCP yaxshi, Search Console’da esa yomon?

Laboratoriya testi — belgilangan sharoitdagi bitta ishga tushirish. Search Console turli qurilma va tarmoqlardagi haqiqiy foydalanuvchilar ma’lumotlarini ko‘rsatadi, ular esa ko‘pincha sekinroq.

### CDN LCP’ni yaxshilashga yordam beradimi?

Ha, agar muammo uzoqdagi auditoriya uchun TTFB yoki fayllarni yuklab olish tezligida bo‘lsa. LCP’ni bloklovchi skriptlar kechiktirsa, CDN’ning o‘zi buni tuzatmaydi.

### Barcha rasmlar uchun preload qilish kerakmi?

Yo‘q. Preload ustuvorlikni oshiradi va ko‘p resurslarni shunday yuklasangiz, ular bir-biri bilan raqobatlasha boshlaydi. Uni faqat LCP elementi uchun qiling.
