---
title: Mavjud bo‘lmagan tovarni sotmaslik: zaxiralash strategiyalari
description: Savatchada, rasmiylashtirishda yoki to‘lovdan keyin zaxiralash: modelni tanlash, taymautlar, parallel so‘rovlar va kanallar bo‘yicha qoldiqlar.
summary: Ko‘pchilik do‘konlar uchun ishonchli standart variant — tovarni buyurtma rasmiylashtirilayotganda qisqa taymaut bilan zaxiralash, qoldiqni bazada atomar kamaytirish va barcha savdo kanallari uchun yagona qoldiq hisobini yuritish.
---
## Qisqa javob

Mavjud bo‘lmagan tovarni sotish (overselling) ikki xaridor bitta oxirgi donani olganda yoki marketpleys saytda allaqachon sotilgan tovarni ko‘rsatib turganda yuz beradi. Bundan uchta narsa himoya qiladi:

- **Zaxiralash modeli** — dona qaysi paytda boshqalar uchun mavjud bo‘lmay qolishini belgilaydi.
- **Qoldiqlar bilan atomar operatsiyalar** — ikkita parallel so‘rov bitta donani bir vaqtda hisobdan chiqara olmaydi.
- **Yagona qoldiq hisobi** — barcha kanallar bitta joydan o‘qiydi va bitta joyga yozadi.

Ko‘pchilik do‘konlar uchun muvozanatli variant — 10-20 daqiqalik taymaut bilan **rasmiylashtirishda zaxiralash**. Aniq qiymat to‘lovingiz real qancha davom etishiga bog‘liq.

## Uchta zaxiralash modeli

| Model | Tovar qachon ushlab turiladi | Afzalliklari | Kamchiliklari |
|---|---|---|---|
| Savatchada zaxira | Savatchaga qo‘shilganda | Xaridor to‘lovda tovarni yo‘qotmaydi | Tashlab ketilgan savatchalar qoldiqni band qiladi, suiiste’mol qilish oson |
| Rasmiylashtirishda zaxira | Checkout boshlanganda | Muvozanat: tovar faqat jiddiy xaridorlar uchun ushlanadi | Taymautlar va bo‘shatish vazifasi kerak |
| To‘lovdan keyin zaxira | To‘lov tasdiqlanganda | Band qilingan qoldiq yo‘q, mantiq oddiy | Ikki kishi bitta dona uchun to‘lashi mumkin, biriga pul qaytariladi |

**Savatchada zaxira** flesh-chegirmalar va cheklangan partiyalar uchun mos, bu yerda oxirgi qadamda tovarni yo‘qotish qabul qilinmaydi. Qisqa savatcha taymauti va bitta xaridorga miqdor limitidan foydalaning.

**Rasmiylashtirishda zaxira** ko‘pchilik katalog do‘konlariga mos: xaridor manzil kiritib, to‘lov qilayotganda tovar ushlab turiladi.

**To‘lovdan keyin zaxira** katta qoldiqlar, raqamli tovarlar va buyurtma asosida tayyorlanadigan mahsulotlar uchun mos, chunki to‘qnashuvlar kam bo‘ladi. Ammo kamdan-kam uchraydigan ikki marta sotish holati uchun reja baribir kerak: avtomatik pul qaytarish va xaridorga xabar.

## Zaxira taymautlari

Muddatsiz zaxira — qoldiqlarning sekin «oqib ketishi». Har bir zaxiraga quyidagilar kerak:

- **`expires_at` maydoni** — zaxira yaratilganda belgilanadi.
- **Bo‘shatish mexanizmi**: muddati o‘tgan zaxiralarni olib tashlaydigan fon vazifasi yoki qoldiq o‘qilganda «dangasa» tozalash.
- **Uzaytirish qoidalari**: xaridor to‘lov shlyuziga yo‘naltirilsa, zaxirani shlyuz sessiyasidan uzoqroq muddatga uzaytiring.
- **Kechikkan to‘lov qoidasi**: to‘lov tasdig‘i zaxira muddati tugagandan keyin kelsa nima qilinadi. Odatda qayta zaxiralashga urinib ko‘riladi, tovar qolmagan bo‘lsa — pul avtomatik qaytariladi.

Zaxiralarni kamaytirib qo‘yib unutiladigan hisoblagich sifatida emas, alohida yozuvlar sifatida saqlang. Shunda kim nimani ushlab turganini ko‘rasiz va zaxirani aniq olib tashlay olasiz.

## Parallel so‘rovlarni boshqarish

Klassik xato: qoldiqni o‘qish (1 dona qoldi), tekshirish, keyin yozish. Ikkita so‘rov bir vaqtda «1» ni o‘qiydi va ikkalasi ham sotadi. Buni ma’lumotlar bazasi darajasida hal qilish kerak.

Eng oddiy ishonchli usul — **shartli atomar yangilash**:

```sql
UPDATE stock
SET available = available - :qty,
    reserved  = reserved + :qty
WHERE sku = :sku AND available >= :qty;
-- 0 ta qator o‘zgardi = tovar yetarli emas
```

Boshqa variantlar:

- Yozishdan oldin bir nechta tekshiruv kerak bo‘lsa, tranzaksiya ichida **qatorlarni bloklash** (`SELECT ... FOR UPDATE`). Deadlock bo‘lmasligi uchun qatorlarni har doim bir xil tartibda bloklang.
- Versiya ustuni orqali **optimistik bloklash**: versiya o‘zgargan bo‘lsa — qayta urinish.
- Juda yuqori yuklama uchun **Redis’dagi atomar operatsiyalar** (masalan, Lua-skript), baza esa ishonchli ombor bo‘lib qoladi.

Zaxira yaratish va to‘lov kolbeklarini qayta ishlashni **idempotent** qiling. Shlyuzlar vebhuklarni qayta yuboradi va takroriy kolbek qoldiqni ikki marta kamaytirmasligi kerak.

## Bir nechta kanaldagi qoldiqlar

Saytda, oflayn do‘konda va marketpleyslarda sotganingizda har bir kanalda qoldiqlarning sinxronizatsiya kechikishi bilan o‘z nusxasi bo‘ladi. Ular farqlanib ketmasligi uchun:

- **Bitta hisob — haqiqat manbai**: sizning bazangiz, ERP yoki 1C, marketpleys emas.
- **O‘zgarishlarni har bir harakatda yuboring**, sutkada bir marta emas. Marketpleyslarning qoldiqni yangilash API’si va navbatdan foydalaning.
- **Kanallar bo‘yicha xavfsizlik buferini saqlang**: sinxronizatsiyasi sekin kanallarda real qoldiqdan biroz kamroq ko‘rsating.
- **Tanqis tovarni taqsimlang**: kam tovarlar uchun umumiy pul o‘rniga kanallarga qat’iy kvotalar ajrating.
- **Buyurtmalarni tez oling**: marketpleysdagi buyurtma imkon qadar tez sizning hisobingizda zaxira yaratishi kerak.

## Keng tarqalgan xatolar

- Atomar yozuvsiz ilova kodida qoldiqni tekshirish.
- Katalogni asta-sekin «muzlatib» qo‘yadigan muddatsiz zaxiralar.
- Hisobotlarda «savatchadagi» tovarlarni sotilgan deb hisoblash.
- Tez sotiladigan tovarlar uchun marketpleys qoldiqlarini kuniga bir marta sinxronlash.
- Zaxira muddati tugagandan keyin kelgan to‘lov uchun ssenariy yo‘qligi.

## FAQ

### Kichik do‘kon qaysi zaxiralash modelini tanlashi kerak?

Rasmiylashtirishda zaxiralash va real to‘lov vaqtini qoplaydigan taymautdan boshlang. Shunda to‘lov qilayotgan xaridorlarni himoya qilasiz va tashlab ketilgan savatchalarda tovarni muzlatib qo‘ymaysiz.

### Overselling’ning oldini olish uchun bazadagi bitta tranzaksiya yetarlimi?

Har doim emas. Izolyatsiya darajasiga qarab ikki tranzaksiya baribir bir xil qiymatni o‘qishi mumkin. Tekshiruv va yozuv bitta operatsiya bo‘lishi uchun shartli yangilash yoki qatorni aniq bloklashdan foydalaning.

### Marketpleysda allaqachon yo‘q tovar sotilishining oldini qanday olish mumkin?

Yagona qoldiq hisobini haqiqat manbai sifatida yuriting, har bir o‘zgarishda yangilanishlarni yuboring va sinxronizatsiyasi sekin kanallarda xavfsizlik buferini ko‘rsating.
