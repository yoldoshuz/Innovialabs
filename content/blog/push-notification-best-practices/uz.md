---
title: Push-bildirishnomalar: o‘chirilmasligi uchun qanday yozish va yuborish
description: Ruxsatni qachon so‘rash, segmentlash, vaqt va chastotani tanlash, matnni shaxsiylashtirish, deep link orqali yo‘naltirish va o‘chirishlarni o‘lchash.
summary: Ruxsatni foyda aniq bo‘lgan paytda so‘rang, faqat muayyan segmentga foydali narsani uning mahalliy vaqtida va me’yorida yuboring, deep link orqali kerakli ekranga olib boring hamda faqat ochilishlarni emas, o‘chirishlarni ham kuzating.
---

## Qisqacha: asosiy tamoyil

Foydalanuvchi push’ni bildirishnomalar **unga tegishli bo‘lmasa**, **noqulay vaqtda** yoki **juda tez-tez** kelsa o‘chiradi. Har bir xabar oddiy testdan o‘tishi kerak: «Odam uni aynan hozir olganidan xursand bo‘ladimi?»

O‘chirish deyarli qaytarib bo‘lmaydigan harakat: foydalanuvchi ruxsatni faqat sozlamalarda qo‘lda qaytara oladi va buni kamdan-kam qiladi.

## Ruxsatni qachon so‘rash

- **Birinchi ekranda emas.** O‘rnatilgandan keyin kontekstsiz so‘rovni ko‘pincha rad etishadi.
- **Qiymat paytida**: buyurtmadan keyin («Kuryer yo‘lga chiqqanda xabar beramiz»), mahsulotga obuna bo‘lganda, qabulga yozilganda.
- **Yumshoq so‘rov (pre-permission)**: avval foydani tushuntiruvchi o‘z ekraningiz, rozilik bo‘lsagina tizim dialogi. iOS’da tizim dialogi bir marta ko‘rsatiladi, shuning uchun uni asrang.
- **iOS’da provisional authorization**: bildirishnomalar bildirishnomalar markaziga jimgina keladi, foydalanuvchi ularni qoldirish yoki o‘chirishni o‘zi hal qiladi.
- Android 13+ da **POST_NOTIFICATIONS** ruxsati ham alohida so‘raladi.

## Segmentatsiya

Hammaga bitta tarqatma — o‘chirishlarga eng tez yo‘l. Auditoriyani quyidagilar bo‘yicha bo‘ling:

- **xatti-harakat**: yangi, faol, «uxlab qolgan», savatni tashlab ketgan;
- **qiziqishlar**: kategoriyalar, shahar, til;
- **bosqich**: onbordingdan o‘tgan-o‘tmagan, xarid qilgan-qilmagan.

**Tranzaksion** (buyurtma holati, to‘lov, xabar) va **marketing** bildirishnomalarini ajrating. Birinchisini deyarli doim kutishadi, ikkinchisida ehtiyotkorlik kerak.

## Vaqt va chastota

- Server vaqti emas, **foydalanuvchining mahalliy vaqti** bo‘yicha yuboring.
- **Tinch soatlar** belgilang — tunda marketing push’lari bo‘lmasligi kerak.
- Barcha marketing kampaniyalari uchun birgalikda foydalanuvchiga kunlik va haftalik **chastota limitini** kiriting.
- Kontekstni hisobga oling: tashlab ketilgan savat haqidagi eslatma bir oydan keyin emas, bir necha soatdan keyin foydali.

## Matn va shaxsiylashtirish

- **Sarlavha — mohiyat**: nima bo‘ldi yoki odam nima oladi.
- Umumiy so‘zlar o‘rniga aniqlik: «Buyurtmangiz kuryerga topshirildi» «Sizga yangilik bor!» dan yaxshiroq.
- Shaxsiylashtirish faqat ism emas, balki **dolzarblik**: sevimlilardagi mahsulot, shahar, interfeys tili.
- Katta harflar, klikbeyt va soxta shoshilinchliksiz.
- Foydalanuvchi interfeysi tilida yozing.

## Deep linking

Push bosh sahifani emas, **aniq ekranni** ochishi kerak:

- yo‘lni `data` maydonida uzating, masalan `screen: order, id: 1042`;
- foydalanuvchi **avtorizatsiyadan o‘tmagan** holatni qayta ishlang: avval kirish, keyin kerakli ekranga o‘tish;
- obyekt o‘chirilgan yoki mavjud bo‘lmasa, bo‘sh ekran emas, tushunarli xabar ko‘rsating.

## Android’dagi kanallar

«Buyurtmalar», «Xabarlar», «Aksiyalar» kabi alohida **notification channels** yarating. Shunda foydalanuvchi barcha bildirishnomalarni emas, faqat aksiyalarni o‘chiradi.

## Nimani o‘lchash kerak

| Metrika | Nimani ko‘rsatadi |
|---|---|
| Opt-in rate | Bildirishnomalarga ruxsat bergan foydalanuvchilar ulushi |
| Delivery rate | Qancha xabar haqiqatan yetkazildi |
| Open rate | Yetkazilganlardan ochilganlar ulushi |
| Opt-out rate | Kampaniyadan keyin qancha odam bildirishnomalarni o‘chirdi |
| Konversiya | Ochilgandan keyingi maqsadli harakat: xarid, ilovaga qaytish |

Ruxsat holatini har bir ishga tushirishda kodda tekshirish mumkin — shunda tarqatma xizmati hisobotlarida ko‘rinmaydigan o‘chirishlarni ko‘rasiz. Matn va vaqtni auditoriyaning bir qismida **A/B-testlar** bilan sinang.

## Ko‘p uchraydigan xatolar

- Tizim ruxsat so‘rovi birinchi ekranda.
- Barcha foydalanuvchilarga bir xil tarqatma.
- Push kerakli ekranga emas, bosh sahifaga olib boradi.
- Marketing tunda yoki server vaqti bo‘yicha yuboriladi.
- Faqat ochilishlarga qarab, o‘chirishlar o‘sishini sezmaslik.

## FAQ

### Haftasiga nechta push me’yorda?

Universal raqam yo‘q. Qiymat va ma’lumotlarga tayaning: kampaniyalardan keyin o‘chirishlar ulushi o‘ssa, chastotani kamaytirish kerak. Tranzaksion bildirishnomalar odatda limitga kirmaydi.

### Push orqali reklama qilsa bo‘ladimi?

Ha, rozilik bilan. App Store qoidalari foydalanuvchining aniq roziligisiz push’ni reklama uchun ishlatishni taqiqlaydi, ilovada esa bunday xabarlardan voz kechish imkoni bo‘lishi kerak.

### Foydalanuvchi bildirishnomalarni allaqachon o‘chirgan bo‘lsa-chi?

Ilovada u nimani yo‘qotayotganini ko‘rsating, masalan sozlamalarda yoki push foydali bo‘ladigan voqeadan keyin, va tizim sozlamalariga o‘tish tugmasini bering. Bu haqda doimiy eslatib turmang.
