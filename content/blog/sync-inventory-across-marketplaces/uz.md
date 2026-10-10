---
title: Marketpleyslar va o‘z do‘koningiz o‘rtasida qoldiqni sinxronlash
description: Qoldiqlar uchun yagona manba, marketpleys API lari, yangilash oraliqlari, bufer va tayyor servis yoki o‘z integratsiyangiz o‘rtasida tanlov.
summary: Qoldiq bitta tizimda saqlanadi, barcha kanallar undan kichik bufer bilan mavjud miqdorni oladi; istalgan kanaldagi sotuv umumiy qoldiqni darhol kamaytiradi.
---

## Asosiy tamoyil: yagona haqiqat manbai

Agar siz saytda va bir nechta marketpleysda sotsangiz, qoldiq **bitta joyda** saqlanishi kerak: hisob tizimi, WMS, CRM yoki alohida sinxronlash servisida. Kanallar o‘z qoldig‘ini yuritmaydi — ular markazdan faqat **sotish uchun mavjud miqdorni** oladi va sotuvlar haqida xabar beradi.

Sxema oddiy:

1. Buyurtma istalgan kanaldan keladi.
2. Markaziy tizim tovarni rezerv qiladi va qoldiqni kamaytiradi.
3. Yangi mavjud miqdor boshqa barcha kanallarga yuboriladi.

Qoldiqlar har bir shaxsiy kabinetda qo‘lda tahrirlansa, ertami-kechmi bitta tovar ikki marta sotiladi.

## Mavjud qoldiq nima

Ombordagi jismoniy qoldiq va sotish mumkin bo‘lgan miqdor — turli sonlar.

**Sotish uchun mavjud = omborda − buyurtmalar uchun rezerv − sug‘urta bufer**

- **Rezerv** — rasmiylashtirilgan, lekin hali jo‘natilmagan buyurtmalardagi tovarlar.
- **Bufer** — kanallarga ko‘rsatilmaydigan kichik zaxira. U bir kanaldagi sotuv va boshqa kanallarda qoldiq yangilanishi orasidagi uzilishni yopadi.

Buferni turlicha belgilash mumkin: qat’iy miqdor, «N tadan kam qolsa nol ko‘rsatish» qoidasi yoki har bir kanal uchun alohida kvota. Qoldig‘i kam, tez sotiladigan tovarlar uchun bufer eng foydali.

## Marketpleys API lari qanday ishlaydi

Yirik marketpleyslar qoldiqni yangilash va buyurtmalarni olish uchun API beradi. Hisobga olish kerak bo‘lgan umumiy jihatlar:

- **So‘rovlar limitlari** — har bir tovar bo‘yicha cheksiz alohida yangilash yuborib bo‘lmaydi. Yangilanishlar paketlarga guruhlanadi.
- **Ombor bilan ishlash modellari** — o‘z omboringizdan sotsangiz, qoldiqni o‘zingiz boshqarasiz; tovar marketpleys omborida bo‘lsa, u yerdagi qoldiqni platforma boshqaradi va sinxronlash boshqacha bo‘ladi.
- **Tovarlarni moslashtirish** — har bir platformada kartochkaning o‘z identifikatori bor. «Sizning SKU ↔ platformadagi ID» bog‘lanish jadvali kerak.
- **Buyurtmalarni olish** — vebhuklar yoki API ni muntazam so‘rash orqali.

Ishlab chiqishdan oldin har bir platforma hujjatlarini o‘rganing: qoidalar va limitlar farq qiladi va o‘zgarib turadi.

## Yangilash oraliqlari

| Hodisa | Qanchalik tez-tez |
|---|---|
| Istalgan kanalda yangi buyurtma | Darhol yoki bir necha daqiqada |
| Bekor qilish yoki qaytarish | Darhol, qoldiq qaytadi |
| Omborga kirim | Kirim rasmiylashtirilgandan keyin |
| Barcha qoldiqlarni solishtirish | Kuniga bir marta yoki tez-tez |

Hodisa bo‘yicha yangilanishlar tezlik beradi, **muntazam to‘liq solishtirish** esa yo‘qolgan narsalarni tuzatadi: muvaffaqiyatsiz so‘rov, qo‘lda tahrir, platforma tomonidagi nosozlik.

## Tayyor servis yoki o‘z integratsiyangiz

**Ko‘p kanalli savdo uchun tayyor servislar** quyidagi hollarda mos:

- marketpleyslaringiz mashhur va servis ularni qo‘llab-quvvatlaydi;
- hisob tizimi standart;
- ishlab chiqishsiz tez sozlash kerak.

**O‘z integratsiyangiz** quyidagi hollarda o‘zini oqlaydi:

- hisob o‘zgartirilgan 1C yoki o‘zingiz yozgan tizimda yuritiladi;
- rezerv, kvota va kanal ustuvorliklari uchun o‘z qoidalaringiz kerak;
- tayyor servislar qo‘llab-quvvatlamaydigan platformalar bor;
- buyurtmalar hajmi katta va mantiqni nazorat qilish muhim.

## Ko‘p uchraydigan xatolar

- Qoldiqlar marketpleys kabinetlarida qo‘lda tahrirlanadi.
- SKU moslik jadvali yo‘q — yangilanishlar noto‘g‘ri kartochkalarga tushadi.
- Bekor qilingan buyurtmalar tovarni qoldiqqa qaytarmaydi.
- API xatolari loglanmaydi va kartochka haftalab noto‘g‘ri miqdorni ko‘rsatadi.
- Bir necha dona qolgan tovarlarda bufer yo‘q.

## FAQ

### Yangilanish deyarli darhol bo‘lsa, bufer kerakmi?

Odatda ha, hech bo‘lmasa qoldig‘i kam tovarlar uchun. Bir kanaldagi buyurtma va boshqasidagi yangilanish o‘rtasida doim kechikish bor, platformalar ham o‘zgarishlarni darhol qo‘llamaydi.

### Marketpleys omboridagi tovarlar bilan qanday ishlash kerak?

Ularning qoldig‘ini platformaning o‘zi yuritadi. Ularni alohida hisobga oling: hisobot uchun ma’lumotni API dan oling, lekin kanallar o‘rtasida bo‘linadigan o‘z omboringiz qoldig‘i bilan aralashtirmang.

### Hozir hammasi jadvallarda yuritilsa, nimadan boshlash kerak?

Avval haqiqat manbai bo‘ladigan tizimni tanlang va SKU larni tartibga keltiring. Shundan keyingina kanallarni birma-bir ulang, eng ko‘p buyurtma keladiganidan boshlab.
