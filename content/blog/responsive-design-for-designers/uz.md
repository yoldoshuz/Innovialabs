---
title: Dizaynerlar uchun adaptiv dizayn: breakpointlar va setkalar
description: Mobile-first nima, qaysi breakpointlardan boshlash, setkalar qanday qayta quriladi va adaptiv maketni dasturchilarga yo‘qotishsiz qanday topshirish haqida.
summary: Avval mobil versiyani loyihalang, kontent buziladigan joylarda 3-4 ta breakpoint belgilang, har bir diapazon uchun setka va bloklar xatti-harakatini yozing, Figma’da esa maketlarni auto layout’da quring — shunda dasturchi rasmlarni emas, qoidalarni ko‘radi.
---

## Qisqacha javob

**Adaptiv dizayn** — uchta alohida maket emas, balki qoidalar to‘plami: ekran kengligi o‘zgarganda interfeys qanday o‘zgaradi. Dasturchi aynan qoidalarni amalga oshiradi, shuning uchun sizning vazifangiz har bir mumkin bo‘lgan kenglikni chizish emas, qoidalarni tasvirlash.

Asosiy yondashuv:

1. **Mobil versiya**dan boshlash.
2. **Breakpointlar**ni aniqlash — joylashuv qayta quriladigan kengliklar.
3. Har bir diapazon uchun **setka** va bloklar xatti-harakatini belgilash.
4. Buni auto layout’dagi komponentlar va qisqa izohlar ko‘rinishida topshirish.

## Nega mobile-first

**Mobile-first** — avval eng tor ekranda nima muhimligini hal qilish, keyin joy va tafsilotlarni qo‘shish.

- Tor ekran **kontent ustuvorligini** belgilashga majbur qiladi: foydalanuvchi birinchi nimani ko‘radi.
- Kengayganda ustun qo‘shish torayganda ortiqchani olib tashlashdan osonroq.
- CSS’da bu tabiiy tartib: mobil uchun asosiy uslublar, keyin `min-width` media so‘rovlar.

Mobile-first desktop ikkinchi darajali degani emas. Bu auditoriya ustuvorligi emas, fikrlash tartibi. Kompyuterda ishlanadigan ichki tizimlar uchun ba’zan desktopdan boshlash mantiqiyroq — lekin shunda ham ekran qanday torayishini tekshirib ko‘ring.

## Qaysi breakpointlarni olish kerak

Universal breakpointlar yo‘q. Qurilmalar har qanday kenglikda bo‘ladi, shuning uchun aniq telefon modellariga emas, **kontentingiz buziladigan nuqtalarga** tayaning. Qulay boshlang‘ich shkala:

| Diapazon | Kenglik | Odatiy setka |
|---|---|---|
| Mobil | 640 px gacha | 4 ustun, 16-20 px chetlar |
| Planshet | 640-1024 px | 8 ustun, 24-32 px chetlar |
| Noutbuk | 1024-1440 px | 12 ustun |
| Keng ekran | 1440 px dan | 12 ustun, cheklangan kontent kengligi |

Agar jamoa Tailwind yoki boshqa freymvorkdan foydalansa, o‘z shkalangizni o‘ylab topishdan ko‘ra uning breakpointlarini olish osonroq: dasturchi ularni qayta belgilashiga to‘g‘ri kelmaydi.

Keng ekranlar uchun **konteynerning maksimal kengligi**ni belgilang. Monitor bo‘ylab cho‘zilgan matn qatori yomon o‘qiladi.

## Joylashuv qanday qayta quriladi

Maketning o‘zida nomlab qo‘yishga arziydigan asosiy patternlar:

- **Ustunlarni ustma-ust qo‘yish.** Qatordagi uchta kartochka mobilda bitta ustunga aylanadi.
- **Tartibni o‘zgartirish.** Desktopda rasm chapda, mobilda sarlavha ostida.
- **Yashirish va yig‘ish.** Yon panel chiqib keluvchi menyuga, filtrlar alohida ekranga aylanadi.
- **Gorizontal aylantirish.** Kartochkalar yoki tablar qatori ko‘chirilmasdan yon tomonga suriladi.
- **Zichlikni o‘zgartirish.** Jadval mobilda kartochkalar ro‘yxatiga aylanadi.

**Tipografiya**ni alohida o‘ylang: desktopdagi 64 px sarlavha telefonga sig‘maydi. Har bir diapazon uchun o‘lchamlarni belgilang yoki jamoa `clamp()` ishlatsa, silliq masshtablashni tasvirlang.

## Maketni dasturchilarga qanday topshirish

Eng ko‘p uchraydigan muammo — ular orasida nima bo‘lishi tushuntirilmagan uchta kenglikdagi maketlar. Nima yordam beradi:

- **Figma’dagi auto layout va constraints.** Freymni cho‘zing — maket buzilsa, kodda ham xuddi shunday buziladi.
- Qayta chizilgan nusxalar emas, breakpointlar uchun **variantli komponentlar**.
- **Asosiy kengliklar**: minimal (masalan, 360 px), har bir breakpoint va keng ekran.
- **Xatti-harakat izohlari**: «768 dan pastda ustunlar ustma-ust tushadi», «kontentning maksimal kengligi 1200».
- Chekinishlar tizim bo‘yicha o‘zgarishi uchun tasodifiy qiymatlar o‘rniga **chekinish tokenlari**.
- **Mobil holatlar**: ochiq menyu, forma ustidagi klaviatura, uzun matnlar.

Yaxshi tekshiruv — maketni yakunlashdan oldin dasturchiga ko‘rsatib, breakpointlar orasida nima tushunarsizligini so‘rash.

## Ko‘p uchraydigan xatolar

- Faqat 375 va 1440 px uchun loyihalab, planshet va tor noutbuklarni unutish.
- Muhim kontentni qayta tartiblash o‘rniga mobilda yashirish.
- Bosiladigan elementlarni barmoq uchun juda kichik qilish.
- Bloklarga qat’iy balandlik berish — tarjima yoki shrift kattalashganda matn tashqariga chiqadi.
- Gorizontal holat va kesikli ekranlarni hisobga olmaslik.

## FAQ

### Nechta maket chizish kerak: barcha breakpointlar uchunmi yoki faqat mobil va desktop?

Asosiy ekranlar uchun — barcha asosiy diapazonlar. Oddiy sahifalar uchun, agar komponentlarning ular orasidagi xatti-harakati qoidalar bilan tasvirlangan va auto layout’da yig‘ilgan bo‘lsa, mobil va desktop yetarli.

### Adaptive va responsive dizayn bir narsami?

Qat’iy aytganda, adaptive yondashuv oldindan belgilangan joylashuvlar o‘rtasida almashadi, responsive esa silliq cho‘ziladi. Amalda ko‘pchilik mahsulotlar ikkalasini birlashtiradi: diapazon ichida silliq joylashuv va breakpointlarda tuzilma o‘zgarishi.

### Mobil maketni qaysi minimal kenglikdan boshlash kerak?

Odatda 360 yoki 375 px dan, keyin 320 px da hech narsa buzilmasligini tekshiring. Aniq raqamdan ko‘ra, eng tor ekranlarda gorizontal aylantirish paydo bo‘lmasligi muhimroq.
