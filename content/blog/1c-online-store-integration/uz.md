---
title: 1C va internet-do‘kon integratsiyasi: tovarlar, qoldiq, buyurtmalar
description: 1C va sayt o‘rtasida qaysi ma’lumotlarni, qaysi yo‘nalishda va qanchalik tez-tez almashish, narx va variantlar bilan ishlash hamda almashinuvni nazorat qilish.
summary: Tovarlar, narxlar va qoldiqlar uchun asosiy tizim 1C bo‘lib qoladi, sayt esa unga buyurtmalarni yuboradi; almashinuv jadval yoki hodisa bo‘yicha ishlaydi va har bir bosqich loglanadi.
---

## Integratsiya qisqacha qanday ishlaydi

1C ni internet-do‘kon bilan integratsiya qilish — aniq qoidalar asosidagi muntazam ma’lumot almashinuvi. **1C — haqiqat manbai**: katalog, narxlar va qoldiqlar shu yerda. **Sayt — buyurtmalar manbai** va xaridorlar ma’lumotlari. Ma’lumotlar ikki tomonga yuradi, lekin har bir maydonning faqat bitta «egasi» bo‘ladi.

Eng ko‘p uchraydigan xato — bitta maydonni ham 1C da, ham sayt admin panelida tahrirlashga ruxsat berish. Keyingi almashinuvda kimningdir o‘zgarishlari albatta yo‘qoladi.

## Nimani va qaysi yo‘nalishda sinxronlash kerak

| Ma’lumot | Yo‘nalish | Izoh |
|---|---|---|
| Nomenklatura, artikullar, xususiyatlar | 1C → sayt | Tavsif va rasmlar ko‘pincha saytda yuritiladi |
| Narxlar (chakana, aksiya, narx turlari) | 1C → sayt | Qaysi narx turi chiqishini tanlang |
| Omborlar bo‘yicha qoldiq | 1C → sayt | Jamlab yoki ombor bo‘yicha ko‘rsatish mumkin |
| Buyurtmalar | sayt → 1C | Tovarlar, yetkazish va to‘lov bilan |
| Buyurtma statuslari | 1C → sayt | Xaridor joriy statusni ko‘rishi uchun |
| Mijozlar | sayt → 1C | Faqat hisob uchun keraklisi |

**Kontent** qayerda yashashini ham alohida hal qiling: SEO matnlar, rasmlar, filtrlar. Odatda ularni saytda yuritish, 1C dan esa faqat hisob ma’lumotlarini olish qulayroq.

## Almashinuv usullari

- **Standart CommerceML protokoli** — XML fayllar orqali almashinuv, ko‘plab CMS va 1C ning tipik konfiguratsiyalari uni qo‘llab-quvvatlaydi. Tez boshlanadi, lekin moslashuvchanligi cheklangan.
- **1C dagi HTTP-servislar yoki OData** — sayt yoki oraliq servis 1C ga API orqali murojaat qiladi. Moslashuvchanroq, tez-tez yangilanishlar uchun mos.
- **Oraliq servis (middleware)** — 1C dan ma’lumot olib, uni o‘zgartiradigan va sayt hamda marketpleyslarga yuboradigan alohida ilova. Savdo kanallari bir nechta bo‘lsa foydali.

## Almashinuv chastotasi

- **Katalog va tavsiflar** — kuniga bir marta yoki o‘zgarganda yetarli.
- **Narxlar** — aksiyalar tez-tez o‘zgarsa, kuniga bir necha marta yoki hodisa bo‘yicha.
- **Qoldiqlar** — iloji boricha tez-tez: har bir necha daqiqada yoki hodisa bo‘yicha. Yo‘q tovarni sotib qo‘ymaslik shunga bog‘liq.
- **Buyurtmalar** — rasmiylashtirilgandan so‘ng darhol yoki minimal kechikish bilan.

Katalogni to‘liq yuklashni kamdan-kam qiling, kun davomida esa faqat **o‘zgarishlarni** (deltani) yuboring. Bu 1C ga yuklamani kamaytiradi va almashinuvni tezlashtiradi.

## Narxlar va tovar variantlari

Variantlar (o‘lcham, rang) 1C da odatda **nomenklatura xususiyatlari** sifatida saqlanadi. Saytda bu o‘nlab alohida kartochka emas, variantli bitta tovar bo‘lishi kerak.

Amaliy qoidalar:

- Tovarlarni nom yoki artikul bo‘yicha emas, **barqaror identifikator** (1C dagi GUID) bo‘yicha bog‘lang — nom va artikul o‘zgarishi mumkin.
- Narx va qoldiq aniq variantga bog‘lanadi.
- Narxi yo‘q yoki qoldig‘i nol bo‘lgan tovar bilan nima qilishni kelishib oling: yashirish, «buyurtma asosida» yoki «mavjud emas» deb ko‘rsatish.

## Testlash va monitoring

Ishga tushirishdan oldin 1C bazasining nusxasida ssenariylarni tekshiring:

1. Yangi tovar saytda to‘g‘ri narx va variantlar bilan paydo bo‘ladi.
2. Narx va qoldiq o‘zgarishi saytga kutilgan vaqtda yetib boradi.
3. Saytdagi buyurtma 1C da to‘g‘ri tovarlar, summa va yetkazish bilan yaratiladi.
4. 1C dagi status o‘zgarishi saytda aks etadi.
5. Almashinuv xatolarga bardosh beradi: narxsiz tovar, o‘chirilgan pozitsiya, aloqa uzilishi.

Ishga tushirgandan keyin **monitoring** kerak: har bir almashinuv jurnali, oxirgi muvaffaqiyatli sinxronlash vaqti, nosozlikda mas’ul shaxsga bildirishnoma. Qoldiqlar belgilangan muddatdan uzoq yangilanmasa, bu haqda xaridorlardan oldin kimdir bilishi kerak.

## Ko‘p uchraydigan xatolar

- Yagona identifikator yo‘q — har yuklashdan keyin tovarlar dublikati.
- Har 15 daqiqada katalogni to‘liq yuklash — 1C ham, sayt ham sekinlashadi.
- Buyurtmalar 1C ga yetib bormaydi va loglar bo‘lmagani uchun buni hech kim sezmaydi.
- 1C konfiguratsiyasi kuchli o‘zgartirilgan, integratsiya esa tipik konfiguratsiyaga qarab qilingan.

## FAQ

### Mening CMS uchun standart almashinuv moduli yaraydimi?

1C konfiguratsiyasi tipik, katalog oddiy va ombor bitta bo‘lsa — ko‘pincha ha. Nostandart o‘zgarishlar, bir nechta ombor yoki marketpleyslar bo‘lsa, odatda qo‘shimcha ishlab chiqish yoki alohida servis kerak bo‘ladi.

### Qoldiqlarni real vaqtda yangilash mumkinmi?

1C dan o‘zgarishlarni hodisa bo‘yicha yuborib, bunga yaqinlashish mumkin. Lekin barqarorlik muhimroq: har bir necha daqiqada ishonchli almashinuv muntazam buziladigan «real vaqt»dan yaxshiroq.

### Buyurtma 1C ga yuklanmasa nima qilish kerak?

Buyurtma saytda xato statusi bilan qolishi va qayta yuborish navbatiga tushishi kerak. Mas’ul shaxs bildirishnoma oladi va uni qo‘lda qayta yuborishi mumkin.
