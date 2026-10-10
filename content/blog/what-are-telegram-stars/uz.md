---
title: Telegram Stars nima va raqamli tovarlar uchun to‘lov qanday ishlaydi
description: Nega Telegram raqamli tovarlar uchun Stars talab qiladi, ular qanday sotib olinadi, tushum qanday chiqariladi va oddiy provayderlar qayerda kerak.
summary: Telegram Stars — Telegramning ichki valyutasi bo‘lib, botlar va Mini App lardagi raqamli tovar va xizmatlar faqat u bilan to‘lanadi; jismoniy tovarlar va oflayn xizmatlar esa hamon oddiy to‘lov provayderlari orqali qabul qilinadi.
---
## Qisqa javob

**Telegram Stars** — Telegramning ichki valyutasi. Foydalanuvchi yulduzlarni sotib oladi, keyin ularni botlar va Mini App larda sarflaydi: obunalar, kontentga kirish, funksiyalar va o‘yin ichidagi buyumlarga.

Asosiy qoida: botlar va Mini App lardagi **raqamli tovar va xizmatlar** **faqat Stars evaziga** sotiladi. Oddiy kartalar va to‘lov provayderlari ular uchun ishlatilmaydi.

## Nega Telegram bu qoidani joriy qildi

Apple va Google mobil ilovalar ichidagi raqamli xaridlar ularning o‘rnatilgan to‘lov tizimi orqali o‘tishini talab qiladi. Botlar va Mini App lar Telegram ilovasi ichida ishlaydi, shuning uchun ularga ham shu talab tegishli.

Stars bu muammoni hal qiladi: foydalanuvchi yulduzlarni ilovalar do‘koni ruxsat bergan usulda sotib oladi, dasturchilar esa to‘lovni yulduzlarda qabul qiladi. Shu tarzda Telegram App Store va Google Play qoidalari doirasida qoladi.

## Raqamli tovar nima hisoblanadi

| Raqamli — faqat Stars | Jismoniy va oflayn — oddiy provayderlar |
|---|---|
| Yopiq kontentga obuna | Yetkazib beriladigan tovarlar |
| Botning premium funksiyalari | Ustaga yozilish, stol bron qilish |
| O‘yin ichidagi valyuta va buyumlar | Real hayotdagi chiptalar va xizmatlar |
| AI-botdagi generatsiyalar | Kafe yoki do‘kondagi buyurtma uchun to‘lov |
| Raqamli fayllar, kurslar, shablonlar | Ta’mirlash, yetkazib berish, taksi |

Oddiy test: agar xaridor natijani **faqat ekranda** olsa — bu raqamli tovar.

## Foydalanuvchi yulduzlarni qanday sotib oladi

- **Telegramning o‘zida**: telefonda — App Store yoki Google Play ichki xaridlari orqali.
- **Rasmiy @PremiumBot orqali**.
- **Fragment platformasida** — TON kriptovalyutasi evaziga.

Botda Stars dagi hisob paydo bo‘lib, yulduzlar yetmasa, Telegram kerakli miqdorni sotib olishni o‘zi taklif qiladi. Foydalanuvchi hech narsani sozlashi shart emas.

## Stars da to‘lovni qanday qabul qilish kerak

Texnik jihatdan bu o‘sha Telegram Payments, faqat `XTR` valyutasi bilan va to‘lov provayderisiz:

```json
{
  "chat_id": 123456789,
  "title": "Pro-kirish",
  "description": "30 kunlik kengaytirilgan funksiyalar",
  "payload": "pro_30d_user_123456789",
  "currency": "XTR",
  "prices": [{"label": "Pro", "amount": 50}]
}
```

Bu obyekt `sendInvoice` metodiga yuboriladi (yoki Mini App dan ochish mumkin bo‘lgan havola uchun `createInvoiceLink` ga). Keyin:

1. Foydalanuvchi «To‘lash»ni bosadi — bot `pre_checkout_query` oladi.
2. Bot buyurtmani tekshiradi va bir necha soniya ichida `answerPreCheckoutQuery` orqali tasdiqlaydi.
3. To‘lovdan keyin `successful_payment` xabari keladi — faqat endi kirish huquqini bering.
4. `telegram_payment_charge_id` ni saqlang: u `refundStarPayment` orqali qaytarish uchun kerak.

Yulduzlardagi avtomatik uzaytiriladigan **obunalar** va kanallardagi pullik kontent ham qo‘llab-quvvatlanadi.

## Dasturchi pulni qanday oladi

- Yulduzlar **bot balansida** to‘planadi.
- Ularni **Fragment orqali** TON kriptovalyutasida **chiqarish** mumkin — Telegram qaytarishlar va firibgarlikdan himoyalanish uchun belgilagan ushlab turish muddatidan keyin.
- Yulduzlarni Telegram Ads da **reklamaga sarflash** ham mumkin.

Chiqarish shartlari, komissiyalar va ushlab turish muddatlarini Telegram o‘zgartirishi mumkin, shuning uchun hujjatlardagi amaldagi qoidalarni tekshiring.

## Oddiy to‘lov provayderlari qayerda ishlaydi

Jismoniy tovarlar va oflayn xizmatlar uchun klassik **Telegram Payments** saqlanib qoladi: @BotFather da provayderni ulaysiz, `provider_token` olasiz va oddiy valyutada hisob chiqarasiz. Mavjud provayderlar ro‘yxati mamlakatga bog‘liq. Muqobil variant — agar bu raqamli tovar bo‘lmasa, to‘lovni o‘z saytingizda yoki Mini App da to‘lov tizimi orqali to‘g‘ridan-to‘g‘ri qabul qilish.

## Ko‘p uchraydigan xatolar

- Raqamli kirishni karta yoki tashqi havola orqali sotish — platforma qoidalarini buzish.
- Kirish huquqini `successful_payment` bo‘yicha emas, `pre_checkout_query` bo‘yicha berish.
- To‘lov identifikatorini saqlamaslik va qaytarish imkoniyatiga ega bo‘lmaslik.
- Xaridorga to‘lov bo‘yicha qo‘llab-quvvatlash bilan bog‘lanish imkonini bermaslik — Telegram qoidalari buni talab qiladi.

## FAQ

### O‘z serverimsiz Stars qabul qilsam bo‘ladimi?

Yo‘q. Hisoblarni bot chiqaradi, u esa qayerdadir ishlab, `pre_checkout_query` va `successful_payment` ni qayta ishlashi kerak. Busiz to‘lovni tasdiqlab bo‘lmaydi.

### Yulduzlarni xaridorga qaytarish mumkinmi?

Ha, agar to‘lov identifikatori saqlangan bo‘lsa, bot `refundStarPayment` metodi bilan qaytarishni amalga oshira oladi.

### Stars uchun to‘lov provayderini ro‘yxatdan o‘tkazish kerakmi?

Yo‘q. Stars uchun provayder kerak emas: valyuta `XTR`, `provider_token` maydoni esa bo‘sh qoldiriladi yoki umuman uzatilmaydi.
