---
title: amoCRM’da sotuv voronkasini qanday sozlash mumkin
description: amoCRM voronkasi bosqichlarini real jarayondan qurish, maydonlarni sozlash, vazifa va xabarlarni avtomatlashtirish va ariza manbalarini ulash.
summary: amoCRM’dagi voronka real sotuv jarayonidan quriladi: har bir bosqich — mijoz yoki menejerning tekshiriladigan harakati; so‘ng kerakli maydonlar, bosqichlardagi avtomatik vazifa va xabarlar hamda ariza manbalari qo‘shiladi.
---

## Qisqa javob: yaxshi voronka tamoyili

amoCRM’dagi voronka — «hammadagidek» statuslar ro‘yxati emas, balki **mijoz xaridga qanday yetib kelishining aksi**. Har bir bosqich «Bitim bilan nima allaqachon sodir bo‘ldi?» degan savolga javob berishi kerak. Agar menejer bitim qaysi bosqichda ekanini aniq ayta olmasa, bosqichlar noto‘g‘ri o‘ylab topilgan.

Sozlash tartibi:

1. Sotuv jarayonini tasvirlash.
2. Bosqichlarni yaratish.
3. Bitim va kontakt maydonlarini sozlash.
4. Bosqichlarga avtomatlashtirish qo‘shish.
5. Ariza manbalarini ulash.

## 1-qadam. Real jarayondan bosqichlar

Oxirgi bitimlarni olib, ularning yo‘lini kuzating. Xizmatlar uchun odatiy voronka:

| Bosqich | Nimani bildiradi |
|---|---|
| Yangi ariza | Murojaat qabul qilindi, hali hech kim bog‘lanmagan |
| Saralash | Menejer bog‘landi va ehtiyojni tushundi |
| Taklif yuborildi | Mijoz tijorat taklifi yoki hisob-kitobni oldi |
| Muzokaralar | Shartlar muhokama qilinmoqda |
| To‘lov kutilmoqda | Hisob-faktura berildi |

amoCRM’da tizim bosqichlari bor: kiruvchi arizalar uchun **«Saralanmagan»**, oxirida esa **«Muvaffaqiyatli amalga oshirildi»** va **«Yopildi va amalga oshirilmadi»**. Ular o‘chirilmaydi — o‘z bosqichlaringiz ular orasiga qo‘shiladi.

Maslahatlar:

- odatda 5-7 ishchi bosqich yetarli;
- bosqichlarni niyat bo‘yicha emas, sodir bo‘lgan hodisa bo‘yicha nomlang;
- mahsulotlar turlicha sotilsa, bitta uzun ro‘yxat o‘rniga **alohida voronkalar** yarating (masalan, ulgurji va chakana).

## 2-qadam. Maydonlar

Maydonlar menejer ma’lumotni yozishmalardan qidirmasligi va rahbar hisobot tuza olishi uchun kerak.

- **Bitim maydonlari**: xizmat yoki mahsulot, byudjet, rad etish sababi, manba.
- **Kontakt va kompaniya maydonlari**: telefon, messenjer, shahar, yuridik shaxslar uchun STIR.
- **Rad etish sababini** matn emas, ro‘yxat qiling — aks holda uni tahlil qilib bo‘lmaydi.
- «Har ehtimolga qarshi» maydon yaratmang: har bir ortiqcha maydon kartochka to‘ldirilish ehtimolini pasaytiradi.

Ayrim maydonlarni **bosqichga o‘tish uchun majburiy** qilish mumkin — masalan, summasiz bitimni «To‘lov kutilmoqda»ga o‘tkazib bo‘lmaydi.

## 3-qadam. Bosqichlardagi avtomatlashtirish

amoCRM’da avtomatlashtirish to‘g‘ridan-to‘g‘ri voronkada, har bir bosqichda sozlanadi. Odatiy harakatlar:

- Bitim bosqichga tushganda menejerga **vazifa qo‘yish**: «Bir soat ichida bog‘lanish».
- Mijozga messenjer yoki pochta orqali **xabar yuborish**: ariza tasdig‘i, to‘lov eslatmasi.
- **Mas’ulni almashtirish** yoki arizalarni menejerlar o‘rtasida taqsimlash.
- **Salesbot’ni ishga tushirish** — savollar beradigan va maydonlarni to‘ldiradigan dialog ssenariysi.
- Tashqi tizimga, masalan, hisob yoki omborga **webhook yuborish**.

Asosiy muammoni yopadigan ikki-uchta avtomatlashtirishdan boshlang — odatda bu unutilgan arizalar. Murakkab zanjirlarni jamoa ko‘nikkanidan keyin qo‘shing.

## 4-qadam. Ariza manbalari

Har bir ariza manbasi ko‘rsatilgan holda «Saralanmagan»ga avtomatik tushishi kerak:

- **sayt formalari** — amoCRM’ning o‘rnatilgan formalari yoki API orqali;
- **messenjerlar** — Telegram, WhatsApp, Instagram amoCRM marketpleysidagi integratsiyalar orqali;
- **telefoniya** — qo‘ng‘iroqlar bitim yaratadi va kartochkaga yoziladi;
- **pochta** — kiruvchi xatlar bitimlarga bog‘lanadi.

Qaysi reklama sotuv olib kelayotganini ko‘rish uchun saytdan **UTM-teglarni** bitim maydonlariga uzating.

## Ko‘p uchraydigan xatolar

- Bosqichlar bitim hodisalari o‘rniga bo‘limlar nomi bilan atalgan.
- Barcha mahsulotlar o‘nlab bosqichli bitta voronkada.
- Mijozga avtomatik xabarlar matn va yuborish vaqti tekshirilmasdan yuboriladi.
- Bitimni qachon yutqazilgan deb yopish qoidasi yo‘q — voronka «o‘lik» bitimlar bilan to‘lib ketadi.

## FAQ

### amoCRM’da nechta voronka kerak?

Tubdan farq qiladigan sotuv jarayonlaringiz qancha bo‘lsa, shuncha. Mijoz yo‘li bir xil bo‘lsa, bitta voronka va «mahsulot» maydoni yetarli.

### Voronkada bitimlar bor paytda bosqichlarni o‘zgartirish mumkinmi?

Ha, bosqichlarni qayta nomlash, qo‘shish va joyini almashtirish mumkin. Bosqichni o‘chirishdan oldin hisobotlar chalkashmasligi uchun uning bitimlarini ko‘chiring.

### Kerakli integratsiya marketpleysda bo‘lmasa nima qilish kerak?

amoCRM’da ochiq API va webhook’lar bor — ular orqali o‘z saytingiz, hisob tizimi yoki istalgan boshqa servis ulanadi.
