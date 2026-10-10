---
title: Nega mobil ilovaga muntazam yangilanishlar kerak
description: iOS va Android’ning har yilgi relizlari, Google Play’ning target SDK talablari, eskirgan API va kutubxonalar: yangilanmagan ilovaga nima bo‘ladi.
summary: Mobil platformalar har yili o‘zgaradi: Apple va Google yangi OS versiyalarini chiqaradi, yig‘malarga talablarni kuchaytiradi va eski API’larni o‘chiradi, shuning uchun yangilanmagan ilova asta-sekin nosozlanadi, tuzatishlarni nashr qilish imkoniyatini yo‘qotadi va Google Play’da vaqt o‘tib yangi foydalanuvchilar uchun mavjud bo‘lmay qoladi.
---

## Qisqacha: nega ilovani «qilib, unutib» bo‘lmaydi

Sayt yillar davomida o‘zgarishsiz ishlashi mumkin. Mobil ilova — yo‘q, chunki u doimiy o‘zgarib turadigan begona ekotizimlar ichida yashaydi:

- **Apple va Google yiliga bir marta iOS va Android’ning yirik versiyalarini chiqaradi** — maxfiylik, ruxsatlar va ilovalar xatti-harakatining yangi qoidalari bilan.
- **Ilovalar do‘konlari yig‘malarga minimal talablarni oshiradi**: SDK, vositalar va kutubxonalar versiyalari.
- **Uchinchi tomon servislari** — to‘lovlar, xaritalar, analitika, avtorizatsiya — o‘z SDK’larini yangilaydi va eski versiyalarni o‘chiradi.

Muntazam yangilanishlarsiz ilova bir kunda buzilmaydi, balki asta-sekin yomonlashadi.

## iOS va Android’ning yillik sikli

Ikkala platforma ham yillik ritmda yashaydi: avval e’lon va dasturchilar uchun beta-versiyalar, keyin ommaviy reliz. Har bir yangi versiya:

- ruxsatlar ishlashini o‘zgartirishi mumkin — masalan, bir paytlar Android bildirishnomalarni ko‘rsatish uchun alohida ruxsat talab qila boshlagan;
- fon ishini, geolokatsiya yoki fayllarga kirishni cheklashi mumkin;
- tizim interfeys elementlari va imo-ishoralarni o‘zgartirishi mumkin;
- yangi ekran o‘lchamlari va qurilmalarni qo‘shishi mumkin.

Dasturchilar uchun beta-versiyalar mavjud ekan, foydalanuvchilar telefonlarini yangilashidan oldin muammolarni tuzatish uchun ilovani ularda tekshirib ko‘ring.

## Google Play’ning target SDK talablari

**targetSdk** — ilova rasman yig‘ilgan va testlangan Android versiyasi. Google har yili talablarni oshiradi:

- **yangi ilovalar va yangilanishlar** yetarlicha yangi API darajasiga mo‘ljallangan bo‘lishi kerak — taxminan Android’ning so‘nggi yirik versiyasidan bir yil ichida; muddat odatda yoz oxiriga to‘g‘ri keladi;
- target SDK bo‘yicha ancha orqada qolgan **mavjud ilovalar** Android’ning yangiroq versiyalaridagi qurilmalarda **yangi foydalanuvchilar uchun mavjud bo‘lmay qoladi**.

targetSdk’ni oshirish — konfiguratsiyadagi raqamni almashtirishdan ko‘proq narsa: u bilan birga yangi xatti-harakat qoidalari yoqiladi va kodning bir qismini qayta ishlashga to‘g‘ri keladi. Amaldagi muddatlar [Google Play hujjatlarida](https://developer.android.com/google/play/requirements/target-sdk) e’lon qilinadi.

## Apple talablari

- App Store Connect’ga yuklanadigan **yangi yig‘malar** Xcode va SDK’ning dolzarb versiyasi bilan yig‘ilishi kerak — Apple bu minimumni vaqti-vaqti bilan oshirib boradi.
- **Eskirgan texnologiyalar** vaqt o‘tib taqiqlanadi: ular ishlatilgan yig‘malar tekshiruvdan o‘tmaydi.
- **Maxfiylikka yangi talablar** muntazam paydo bo‘ladi va ham sizning kodingizga, ham ichki kutubxonalarga tegishli.
- Apple uzoq vaqt yangilanmagan va dolzarb qurilmalarda normal ishlamay qolgan ilovalarni dasturchini oldindan ogohlantirib, App Store’dan olib tashlashi mumkin.

## Eskirgan API va kutubxonalar

Ilova deyarli har doim o‘nlab uchinchi tomon kutubxonalaridan iborat. Vaqt o‘tishi bilan:

- ularda faqat yangi versiyalarda yopiladigan **zaifliklar** topiladi;
- yetkazib beruvchilar **SDK’ning eski versiyalarini o‘chiradi** — to‘lovlar, xaritalar, ijtimoiy tarmoqlar orqali kirish, do‘kon xaridlari kutubxonalari;
- eski versiyalar yangi vositalar bilan **yig‘ilmay** qoladi;
- **Flutter, React Native** va nativ vositalar eski kod bilan mos kelmaydigan versiyalarni chiqaradi.

Yangilanishlar qanchalik uzoq kechiktirilsa, shunchalik ko‘p o‘zgarish to‘planadi va bir martalik «katta ta’mir» shunchalik qimmatga tushadi.

## Yangilanmagan ilova bilan nima bo‘ladi

1. **Dastlabki oylar** — hammasi ishlaydi, lekin yangi qurilmalarda mayda muammolar to‘planadi.
2. **Yangi OS versiyasi chiqqandan keyin** — nosozliklar paydo bo‘ladi, maket buziladi, ayrim funksiyalar ishlamay qoladi.
3. **Do‘konning navbatdagi muddatidan keyin** — loyiha yangi talablarga yangilanmaguncha, hatto shoshilinch tuzatishni ham chiqarib bo‘lmaydi.
4. **Keyinroq** — Google Play’da ilova yangi qurilmalardagi yangi foydalanuvchilar uchun yo‘qoladi, App Store’da olib tashlanish xavfi ortadi, sharhlar va reyting tushadi.

## Qo‘llab-quvvatlashni qanday tashkil qilish kerak

- Bog‘liqliklarni biror narsa buzilganda emas, **jadval bo‘yicha** yangilang, masalan har chorakda.
- Har yozda ilovani **iOS va Android beta-versiyalarida** testlang.
- Do‘konlar **muddatlari kalendarini** yuriting: target SDK, Xcode’ning minimal versiyalari, uchinchi tomon SDK’lari muddatlari.
- **Nosozliklar monitoringini** sozlang va har bir OS relizidan keyin sharhlarni kuzatib boring.
- Qo‘llab-quvvatlashni kutilmagan xarajat sifatida emas, darhol **mahsulot byudjetiga** kiriting.

## FAQ

### Yangilanishlarni qanchalik tez-tez chiqarish kerak?

Qat’iy qoida yo‘q, lekin texnik yangilanishlarni yiliga kamida bir necha marta, albatta iOS va Android’ning yangi versiyalari chiqqandan keyin va do‘konlar muddatlaridan oldin chiqarish kerak. Mahsulot yangilanishlari — funksiyalar rivojlanishiga qarab.

### Ilovani bir yil yangilamasa nima bo‘ladi?

Ehtimol, u hali ko‘pchilik foydalanuvchilarda ishlaydi, lekin loyiha do‘konlar talablaridan orqada qoladi. Birinchi shoshilinch tuzatish katta ishga aylanadi: vositalar, kutubxonalar va target SDK’ni yangilash, keyin hammasini qayta testlash.

### Faqat bitta platformani yangilasa bo‘ladimi?

Texnik jihatdan ha, lekin talablar ikkalasida ham bor. Agar ilova ham App Store’da, ham Google Play’da nashr etilgan bo‘lsa, ikkala versiyani qo‘llab-quvvatlash kerak, aks holda auditoriyalardan biri nosozliklarga duch keladi.
