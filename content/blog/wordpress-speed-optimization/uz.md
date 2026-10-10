---
title: WordPress saytni qanday tezlashtirish mumkin: amaliy qo‘llanma
description: WordPress’ni bosqichma-bosqich tezlashtirish: o‘lchash, plaginlar auditi, keshlash, rasmlar, bazani tozalash, yengil mavzu, PHP va obyekt keshi.
summary: Avval tezlikni o‘lchang, keyin ortiqcha plaginlarni olib tashlang, sahifa keshini yoqing, rasmlarni siqing, PHP’ni yangilang, mavzuni yengillashtiring va obyekt keshini ulang — har qadamdan keyin natijani tekshiring.
---

## Qisqa javob

WordPress bitta «sehrli» belgicha bilan emas, to‘g‘ri tartibdagi bir qator qadamlar bilan tezlashadi:

1. Joriy tezlikni o‘lchash.
2. Plaginlar auditini o‘tkazish.
3. Sahifa keshini yoqish.
4. Rasmlarni optimallashtirish.
5. PHP’ni yangilash va hostingni tekshirish.
6. Mavzuni yengillashtirish.
7. Ma’lumotlar bazasini tozalash.
8. Obyekt keshini ulash.

Har qadamdan keyin — qayta o‘lchash. Shunda nima haqiqatan yordam berganini ko‘rasiz.

## 1-qadam. Boshlang‘ich nuqtani o‘lchang

O‘lchovsiz optimallashtirish taxminga aylanadi. Quyidagilardan foydalaning:

- **PageSpeed Insights** — laboratoriya ma’lumotlari va trafik yetarli bo‘lsa, haqiqiy Core Web Vitals ko‘rsatkichlari: LCP, INP, CLS;
- brauzer DevTools’idagi **Network va Performance panellari** — qaysi fayllar yuklanayotgani va chizishni nima to‘sayotgani;
- **Query Monitor plagini** — bazaga sekin so‘rovlar va og‘ir hook’lar.

Bir nechta odatiy sahifani o‘lchang: bosh sahifa, maqola, mahsulot sahifasi. Solishtirish uchun natijalarni yozib qo‘ying.

## 2-qadam. Plaginlar auditi

Har bir plagin har sahifaga skriptlar, uslublar va bazaga so‘rovlar qo‘shishi mumkin. Ro‘yxatni ko‘rib chiqing:

- Ishlatilmaydigan va takrorlanuvchi plaginlarni **o‘chiring**.
- Bitta mayda ishni bajaradigan og‘ir plaginlarni child theme’dagi bir necha qator kod bilan **almashtiring**.
- Plagin o‘z fayllarini kerak bo‘lmagan sahifalarda yuklamayotganini **tekshiring** (masalan, forma faqat kontaktlar sahifasida kerak).

Test nusxada plaginlarni birma-bir o‘chirib, Query Monitor’dagi o‘zgarishlarni kuzating.

## 3-qadam. Sahifa keshi

Keshsiz WordPress har tashrifda PHP va bazaga so‘rovlarni bajaradi. **Sahifa keshi** tayyor HTML’ni saqlab, uni bir zumda beradi.

- Bir vaqtning o‘zida bir nechta emas, bitta keshlash plaginidan foydalaning — ular to‘qnashadi.
- Hosting server keshini taklif qilsa (masalan, nginx yoki LiteSpeed orqali), u odatda plagindan samaraliroq.
- Savat, buyurtmani rasmiylashtirish va shaxsiy kabinetni keshdan chiqarib tashlang.

## 4-qadam. Rasmlar

Rasmlar — sekin LCP’ning keng tarqalgan sababi.

- Kamera originallarini emas, kerakli o‘lchamdagi rasmlarni yuklang.
- **WebP** yoki **AVIF** kabi zamonaviy formatlardan foydalaning.
- Birinchi ekrandan pastdagi rasmlar uchun **dangasa yuklash**ni yoqing, lekin asosiy banner uchun emas.
- Maket siljishlarining (CLS) oldini olish uchun kenglik va balandlikni ko‘rsating.

## 5-qadam. PHP va hosting

- **PHP’ning dolzarb qo‘llab-quvvatlanadigan versiyasiga** o‘ting. Yangi versiyalar tezroq va xavfsizroq. Yangilashdan oldin mavzu va plaginlar mosligini test nusxada tekshiring.
- **OPcache**ni yoqing — u kompilyatsiya qilingan PHP kodini xotirada saqlaydi.
- Agar kesh bilan ham server sekin javob bersa (yuqori TTFB), hosting haddan tashqari yuklangan yoki loyiha tarifdan o‘sib ketgan bo‘lishi mumkin.

## 6-qadam. Yengil mavzu

Ko‘p funksiyali mavzular va vizual konstruktorlar ko‘pincha har sahifaga ko‘p CSS va JavaScript yuklaydi. Variantlar:

- yengil yoki blokli mavzuga o‘tish;
- konstruktorning ishlatilmaydigan modullarini o‘chirish;
- ortiqcha shriftlar va ikonkalarni olib tashlash, faqat kerakli yozuv turlarini ulash.

## 7-qadam. Bazani tozalash

Vaqt o‘tib bazada keraksiz narsalar to‘planadi:

- maqolalar reviziyalari;
- spam va o‘chirilgan izohlar;
- eskirgan **transient**’lar;
- o‘chirilgan plaginlar ma’lumotlari;
- autoload opsiyalari ko‘p bo‘lgan shishib ketgan `wp_options` jadvali.

`wp-config.php` faylida reviziyalar sonini cheklang:

```php
define( 'WP_POST_REVISIONS', 5 );
```

Har qanday tozalashdan oldin bazaning zaxira nusxasini oling.

## 8-qadam. Obyekt keshi

**Obyekt keshi** (Redis yoki Memcached) bazaga so‘rovlar natijalarini so‘rovlar orasida xotirada saqlaydi. Ayniqsa do‘konlar, shaxsiy kabinetlar va to‘liq keshlab bo‘lmaydigan sahifalar uchun foydali. Server tomonidan qo‘llab-quvvatlash va ulovchi plagin talab qiladi.

## Keng tarqalgan xatolar

- Bir vaqtda bir nechta optimallashtirish plaginini o‘rnatish.
- JS’ni agressiv birlashtirish va kechiktirib yuklashni tekshiruvsiz yoqish — bu funksionallikni buzadi.
- Faqat bosh sahifani optimallashtirish.
- Foydalanuvchilarning haqiqiy ko‘rsatkichlariga emas, hisobotdagi bitta raqamga qarash.

## FAQ

### Qaysi qadam eng katta samara beradi?

Ko‘pincha sahifa keshi va plaginlarni qisqartirish, lekin bu saytga bog‘liq. Shuning uchun avval o‘lchab, asosiy tor joyni topish muhim.

### WordPress uchun CDN kerakmi?

Tashrif buyuruvchilar serverdan uzoqda bo‘lsa yoki saytda statik fayllar ko‘p bo‘lsa, CDN yordam beradi. Server yaqinida joylashgan mahalliy auditoriya uchun samara kichik bo‘lishi mumkin.

### Mavzuga tegmasdan saytni tezlashtirsa bo‘ladimi?

Ha, kesh, rasmlar, PHP va plaginlar auditi ko‘pincha sezilarli natija beradi. Ammo mavzuning o‘zi og‘ir bo‘lsa, uni almashtirmasdan chegaraga duch kelasiz.
