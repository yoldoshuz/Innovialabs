---
title: WordPress sayt uchun hostingni qanday tanlash kerak
description: WordPress uchun hosting tanlashda nimaga qarash kerak: PHP va ma’lumotlar bazasi versiyalari, managed yoki oddiy hosting, keshlash, staging va zaxira nusxalar.
summary: WordPress hostingi PHP hamda MySQL yoki MariaDB ning dolzarb versiyalarini qo‘llab-quvvatlashi, sahifa va obyekt keshini, staging nusxani va serverdan tashqarida saqlanadigan avtomatik zaxira nusxalarni berishi kerak. Managed WordPress xizmat ko‘rsatishga vaqtni tejaydi, oddiy hosting yoki VPS esa ko‘proq nazorat beradi.
---

## Qisqa javob

Yaxshi WordPress hosting beshta mezon bo‘yicha tekshiriladi:

1. Almashtirish imkoniyati bilan **PHP va ma’lumotlar bazasining dolzarb versiyalari**.
2. Faqat plagin orqali emas, **server darajasida keshlash**.
3. **Staging** — yangilanishlarni tekshirish uchun sayt nusxasi.
4. Serverdan tashqarida saqlanadigan va oson tiklanadigan **avtomatik zaxira nusxalar**.
5. Faqat panelga bog‘lanib qolmaslik uchun **SSH va WP-CLI ga kirish**.

Hosting turi — managed WordPress, oddiy shared yoki VPS — qancha xizmat ko‘rsatishni o‘z zimmangizga olishga tayyor ekaningizga qarab tanlanadi.

## Texnik talablar

WordPress **PHP** da va **MySQL** yoki **MariaDB** bazasida ishlaydi hamda HTTPS ni qo‘llab-quvvatlashni talab qiladi. Tavsiya etilgan versiyalar o‘zgarib turadi, shuning uchun rasmiy [WordPress talablari](https://wordpress.org/about/requirements/) sahifasini tekshiring va PHP versiyasini o‘zingiz almashtira oladigan hostingni tanlang.

Yana nimalarga qarash kerak:

- **PHP kengaytmalari**: mysqli, curl, mbstring, xml, zip, intl, shuningdek tasvirlarga ishlov berish uchun imagick yoki gd.
- **PHP limitlari**: memory_limit, max_execution_time, upload_max_filesize. Og‘ir plaginlar, sahifa konstruktorlari va internet-do‘konlar ko‘proq xotira talab qiladi.
- **OPcache** — kompilyatsiya qilingan PHP-kod keshi, yoqilgan bo‘lishi kerak.
- **PHP-jarayonlar soni (workers)**: sayt bir vaqtda nechta keshlanmagan so‘rovga ishlov bera olishini belgilaydi.

Joriy konfiguratsiyani admin panelda tekshirish mumkin: Asboblar → Sayt salomatligi.

## Managed WordPress, shared yoki VPS

| | Shared-hosting | Managed WordPress | VPS |
|---|---|---|---|
| Serverga kim xizmat ko‘rsatadi | Provayder | Provayder, WordPress ga moslab | Siz |
| Keshlash | Tarifga bog‘liq | Odatda o‘rnatilgan | O‘zingiz sozlaysiz |
| Staging va zaxira nusxalar | Har doim emas | Odatda bir klikda | O‘zingiz sozlaysiz |
| Cheklovlar | Qo‘shnilar bilan umumiy resurslar | Ba’zan ayrim plaginlar taqiqlangan | Faqat server resurslari |
| Kim uchun mos | Vizitka va kichik bloglar | O‘z administratori yo‘q biznes-saytlar va do‘konlar | Nostandart talablar va jamoasi bor loyihalar |

## Keshlash

Keshsiz WordPress har bir so‘rovda PHP ni bajaradi va bazaga murojaat qiladi. Keshlash darajalari:

- **Sahifa keshi** — tayyor HTML PHP ishga tushirilmasdan beriladi. Eng yaxshisi server darajasida: Nginx FastCGI cache, Varnish yoki o‘z plaginiga ega LiteSpeed.
- **Obyekt keshi** — Redis yoki Memcached bazaga so‘rovlar natijalarini saqlaydi. Ayniqsa sahifa keshi cheklangan ishlaydigan do‘konlar va shaxsiy kabinetli saytlar uchun foydali.
- **OPcache** — PHP ning o‘zini bajarishni tezlashtiradi.
- **CDN** — rasmlar, CSS va JS ni foydalanuvchiga eng yaqin serverlardan tarqatadi.

Tarifingizda bu darajalardan qaysilari mavjudligini provayderdan aniqlang.

## Staging va zaxira nusxalar

**Staging** yadro, mavzu va plaginlarni avval nusxada yangilash, keyingina o‘zgarishlarni ishchi saytga o‘tkazish imkonini beradi. Muhim nozik jihat: bazani staging dan production ga o‘tkazish shu vaqt ichida paydo bo‘lgan yangi buyurtmalar, izohlar va arizalarni ustidan yozib yuboradi. Do‘konlar uchun faqat fayllarni o‘tkazing yoki tanlab sinxronlash vositalaridan foydalaning.

Zaxira nusxalarga talablar:

- avtomatik, kamida har kuni;
- **asosiy serverdan tashqarida** saqlash;
- aniq saqlash muddati;
- bir necha klikda tiklash;
- tiklashni muntazam sinab ko‘rish.

Hostingga bog‘liq bo‘lmagan o‘z nusxangizni ham saqlang. WP-CLI bilan bu bir necha buyruq orqali bajariladi:

```bash
wp core version
wp plugin list --update=available
wp db export backup.sql
wp search-replace 'https://staging.example.com' 'https://example.com' --dry-run
```

## Ko‘p uchraydigan xatolar

- Zaxira nusxalar va PHP versiyasini tekshirmasdan eng arzon tarifni tanlash.
- Haddan tashqari yuklangan shared-serverda faqat keshlash plaginiga tayanish.
- Plaginlarni to‘g‘ridan-to‘g‘ri ishchi saytda yangilash.
- Saytning yagona nusxasini o‘sha provayderning o‘zida saqlash.
- Xatlarni SMTP yoki tranzaksion xizmat o‘rniga serverning PHP-funksiyasi orqali yuborish — ular spamga ko‘proq tushadi.

## FAQ

### Kichik saytga managed WordPress kerakmi?

Shart emas. Vizitka yoki blog uchun dolzarb PHP, zaxira nusxalar va SSL ga ega yaxshi shared-hosting yetarli. Managed sayt daromad keltirganda va yangilanishlar, xavfsizlik hamda unumdorlikni kuzatadigan odam bo‘lmaganda o‘zini oqlaydi.

### O‘zbekistondagi auditoriya uchun WordPress saytni qayerda joylashtirish kerak?

Foydalanuvchilarga yaqinroq joyda — bu kechikishni kamaytiradi. Agar sayt shaxsiy ma’lumotlarni, masalan ism va telefonli arizalarni yig‘sa, ularni O‘zbekistondagi serverlarda saqlash talabini hisobga oling.

### Joriy hosting uddalay olmayotganini qanday bilish mumkin?

Belgilar: keshlangan sahifalarda ham server sekin javob beradi, tashrif buyuruvchilar ko‘payganda 502 va 503 xatolari chiqadi, resurs limitlari oshib ketgani haqida xabarlar keladi. Avval keshlash va og‘ir plaginlarni tekshiring, yordam bermasa, ko‘proq resursli tarif yoki hosting turiga o‘ting.
