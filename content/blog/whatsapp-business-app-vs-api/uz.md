---
title: WhatsApp Business va WhatsApp Business API: farqi nimada
description: Bepul WhatsApp Business ilovasi va WhatsApp Business API’ni solishtiramiz: operatorlar, avtomatlashtirish, shablonlar, to‘lov modeli va kimga nima mos.
summary: WhatsApp Business — mijozlarga qo‘lda javob beradigan kichik jamoa uchun bepul ilova; WhatsApp Business API esa ko‘p operatorlar, botlar, CRM integratsiyalari va xabar uchun to‘lanadigan shablon xabarlar uchun o‘z interfeysi bo‘lmagan platforma.
---
## Qisqa javob

**WhatsApp Business** — telefon uchun bepul ilova. Unda mijozlarga o‘zingiz javob berasiz, avtomatlashtirish esa salomlashish, «joyda yo‘qman» xabari va tezkor javoblar bilan cheklangan.

**WhatsApp Business API** (rasmiy nomi — WhatsApp Business Platform) — WhatsApp’ga dasturiy kirish. Uning **o‘z ilovasi yo‘q**: siz uni CRM’ga, operatorlar uchun servisga yoki o‘z botingizga ulaysiz. U mijozlar ko‘p, bir necha kishi javob beradigan va avtomatlashtirish muhim bo‘lgan holda kerak.

## Asosiy parametrlar bo‘yicha solishtirish

| Parametr | WhatsApp Business ilovasi | WhatsApp Business API |
|---|---|---|
| Interfeys | Telefondagi ilova va bog‘langan qurilmalar | O‘zida yo‘q, CRM yoki o‘z tizimingiz kerak |
| Operatorlar | Bir necha qurilmadagi kichik jamoa | Ulangan tizim orqali istalgancha |
| Avtomatlashtirish | Salomlashish, «joyda yo‘qman», tezkor javoblar | Botlar, ssenariylar, integratsiyalar, triggerlar |
| Mijozga birinchi xabar | Qo‘lda yoki tarqatma ro‘yxati bilan | Faqat tasdiqlangan shablon bilan |
| Tarqatmalar | Tarqatma ro‘yxatlari, faqat raqamingizni saqlaganlar oladi | Rozilik bergan mijozlarga shablon xabarlar |
| Narxi | Bepul | Shablon xabarlar uchun to‘lov va provayder xizmatlari |
| Ulash | Ilovani yuklab olish | Meta orqali to‘g‘ridan-to‘g‘ri yoki provayder orqali |

## Bepul ilova nimalarni qila oladi

- **Kompaniya profili**: manzil, ish vaqti, tavsif, sayt.
- Profilning o‘zida tovar va xizmatlar **katalogi**.
- **Salomlashish xabari** va **«joyda yo‘qman» xabari**.
- Odatiy savollar uchun **tezkor javoblar**.
- Chatlarni saralash uchun **belgilar**: «yangi mijoz», «to‘lovni kutmoqda».
- **Tarqatma ro‘yxatlari**, lekin xabarni faqat kontaktlarida raqamingiz bor odamlar oladi.

Bu yozishmani bir-ikki kishi olib boradigan va mijozlarga qo‘lda javob berish mumkin bo‘lgan kichik biznes uchun yetarli.

## API nima beradi

- Bitta raqamda chatlarni taqsimlash bilan **bir vaqtda ko‘p operator**.
- **Chat-botlar**: tez-tez beriladigan savollarga javob, ariza yig‘ish, yozilish, buyurtma holati.
- **Integratsiyalar**: arizalar CRM’ga tushadi, bildirishnomalar hisob tizimidan avtomatik yuboriladi.
- **Shablon xabarlar**: buyurtma tasdig‘i, eslatmalar, kodlar, marketing takliflari.
- Ulangan tizim tomonida **analitika**.

## API’ning asosiy qoidasi: 24 soatlik oyna

Mijoz sizga yozganda **24 soatlik xizmat ko‘rsatish oynasi** ochiladi. Uning ichida istalgan xabar bilan javob berish mumkin. Oyna yopilgan bo‘lsa, mijozga birinchi bo‘lib faqat Meta moderatsiyasidan oldindan o‘tgan **shablon** bilan yozish mumkin. Shablonlar toifalarga bo‘linadi: marketing, xizmat (masalan, buyurtma holati) va autentifikatsiya.

Yana bir talab — mijozning sizdan xabar olishga **roziligi**. Sotib olingan baza bo‘yicha yozish mumkin emas: bu shikoyatlar, raqam sifatining pasayishi va bloklanishga olib keladi.

## API uchun to‘lov qanday ishlaydi

- **Meta shablon xabarlar uchun haq oladi**. Narx shablon toifasi va qabul qiluvchi mamlakatiga bog‘liq.
- Xizmat ko‘rsatish oynasi ichidagi javoblar odatda tariflanmaydi.
- **Provayder** (BSP) orqali ishlasangiz, u kirish va interfeys uchun o‘z haqini oladi.
- Bot va integratsiyalarni ishlab chiqishni alohida hisobga olish kerak.

Meta tariflari o‘zgarib turadi, shuning uchun amaldagi shartlarni [rasmiy hujjatlarda](https://developers.facebook.com/docs/whatsapp/pricing) tekshiring.

## Kimga nima mos

**Ilova** mos keladi, agar:

- mijozlar ko‘p bo‘lmasa va qo‘lda javob bersangiz;
- yozishmada bir-ikki xodim qatnashsa;
- WhatsApp’ni CRM bilan bog‘lash vazifasi bo‘lmasa.

**API** kerak, agar:

- murojaatlar ko‘p va bir necha operator kerak bo‘lsa;
- birinchi liniya uchun bot istasangiz;
- buyurtma va yozilish haqida avtomatik bildirishnomalar kerak bo‘lsa;
- yozishmalar tarixini CRM’da saqlash muhim bo‘lsa.

## Keng tarqalgan xatolar

- **Asosiy shaxsiy raqamni** ko‘chirish shartlarini tekshirmasdan **API’ga o‘tkazish**.
- **API’ni «xuddi o‘sha ilova, faqat yaxshiroq» deb kutish.** CRM yoki o‘z tizimingiz bo‘lmasa, unda ishlab bo‘lmaydi.
- **Roziliksiz marketing tarqatmalarini yuborish.** Raqam tezda cheklovlarga uchraydi.

## FAQ

### Ilovadan boshlab, keyin API’ga o‘tish mumkinmi?

Ha, bu keng tarqalgan yo‘l. O‘tishdan oldin Meta’ning raqamni ko‘chirish bo‘yicha amaldagi qoidalarini tekshiring va operatorlar ishlaydigan tizimni oldindan tanlang.

### API’ni ulash uchun ro‘yxatdan o‘tgan kompaniya kerakmi?

Meta biznes-akkaunti kerak, ayrim cheklovlarni olib tashlash uchun esa kompaniyani tasdiqlash talab etiladi. Hujjatlarga talablar mamlakatga bog‘liq.

### Oddiy WhatsApp Business ilovasida bot qilish mumkinmi?

To‘laqonli botni — yo‘q. Ilovada faqat salomlashish, «joyda yo‘qman» xabari va tezkor javoblar bor. Ssenariylar va integratsiyalar API orqali mavjud.
