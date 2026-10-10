---
title: Telegram Bot API cheklovlari: xabarlar, fayllar va so‘rovlar limiti
description: Telegram Bot API limitlari: yuborish tezligi, fayl hajmi, xabar uzunligi, 429 xatosi va botni bu limitlarga urilmaydigan qilib loyihalash usullari.
summary: Telegram bitta chatga soniyasiga 1 tadan, guruhga daqiqasiga 20 tadan ko‘p bo‘lmagan va jami soniyasiga taxminan 30 ta xabar yuborishni tavsiya qiladi; bot 20 MB gacha fayl yuklab oladi, 50 MB gacha yuklaydi, matn 4096 belgigacha, tezlik oshsa retry_after bilan 429 xatosi keladi.
---
## Asosiy limitlar bitta jadvalda

Telegram yo‘l-yo‘riqlarni rasmiy Bot FAQ va Bot API hujjatlarida e’lon qiladi. Aniq chegaralar o‘zgarishi va yuklamaga bog‘liq bo‘lishi mumkin, shuning uchun ularni kafolat emas, xavfsiz yuqori chegara deb qabul qiling.

| Nima cheklangan | Limit |
|---|---|
| Bitta chatga xabarlar | soniyasiga taxminan 1 ta (qisqa sakrashlarga yo‘l qo‘yiladi) |
| Bitta guruhga xabarlar | daqiqasiga 20 tadan ko‘p emas |
| Ommaviy tarqatish | jami soniyasiga taxminan 30 ta xabar |
| Botning faylni yuklab olishi (`getFile`) | 20 MB gacha |
| Botning faylni yuklashi | 50 MB gacha, rasm — 10 MB gacha |
| Faylni URL orqali yuborish | rasm 5 MB gacha, qolgani 20 MB gacha |
| Xabar matni | 4096 belgi |
| Media izohi (caption) | 1024 belgi |
| `callback_data` | 64 bayt |
| `answerInlineQuery` dagi natijalar | 50 ta |
| Albomdagi media | 2 tadan 10 tagacha |
| Olinmagan yangilanishlarni saqlash | 24 soatgacha |

Tezroq tarqatish uchun Telegram’da `allow_paid_broadcast` parametri orqali Telegram Stars evaziga **pullik tarqatish** bor. Shartlarini amaldagi hujjatlardan tekshiring.

## 429 xatosi va retry_after

Bot limitdan oshganda API **HTTP 429 Too Many Requests** qaytaradi. Javobda `parameters.retry_after` maydoni bo‘ladi — necha soniya kutish kerakligi.

To‘g‘ri munosabat:

1. Shu chatga (agar limit global bo‘lsa, butun navbatga) yuborishni to‘xtatish.
2. Aynan `retry_after` soniya kutish.
3. So‘rovni takrorlash.

Noto‘g‘ri munosabat — darhol siklda qayta urinish. Bu bloklashni uzaytiradi va qattiqroq cheklovlarga olib kelishi mumkin.

```python
import asyncio
from aiogram.exceptions import TelegramRetryAfter

async def safe_send(bot, chat_id, text):
    while True:
        try:
            return await bot.send_message(chat_id, text)
        except TelegramRetryAfter as e:
            await asyncio.sleep(e.retry_after)
```

## Botni limitlarga moslab loyihalash

**Yuborish navbati.** Barcha chiquvchi xabarlar tezligi cheklangan bitta navbatdan o‘tadi: soniyasiga umumiy limit va har bir chat uchun alohida interval. Shunda buyurtmalarning keskin oshishi xatolar to‘lqiniga aylanmaydi.

**Tarqatish — alohida jarayonda.** Ommaviy yuborishni fon vazifasi sifatida ishga tushiring: u pauzalar bilan qismlab ishlasin va jarayonni saqlab borsin. Jarayon yiqilsa, tarqatish takroriy xabarlar bilan boshidan emas, to‘xtagan joyidan davom etadi.

**403 ni qayta ishlash.** Foydalanuvchilar botni bloklaydi. `403 Forbidden` javobi bu odamga endi yozib bo‘lmasligini bildiradi: uni bazada belgilang va keyingi tarqatishlardan chiqaring.

**Uzun matnlar.** Ularni so‘z yoki razmetka o‘rtasidan emas, xatboshi chegaralari bo‘yicha 4096 belgidan kichik qismlarga bo‘ling. Rasm izohi 1024 belgi bilan cheklanganini unutmang.

**Fayllar.** Faylni bir marta yuklagach, uning `file_id` sini saqlang va qayta shu orqali yuboring — bu tezroq va trafikni tejaydi. Standart limitlardan katta fayllar kerak bo‘lsa, o‘zingizning **Local Bot API Server**ingizni ko‘tarish mumkin: u yuklab olish limitini olib tashlaydi va 2000 MB gacha fayl yuklashga ruxsat beradi.

**Yangi xabar o‘rniga tahrirlash.** Jarayon, statuslar va menyularni `editMessageText` orqali yangilang: xabarlar kamroq bo‘lsa, bitta chat limitiga urilish xavfi ham kamroq.

**Xabarlarni o‘chirish.** Guruhlarda bot xabarlarni yuborilganidan keyin faqat 48 soat ichida o‘chira oladi, chatni avtomatik tozalashni shuni hisobga olib rejalashtiring.

## Keng tarqalgan xatolar

- Butun baza bo‘ylab pauzalarsiz va 429 ni hisobga olmasdan oddiy sikl bilan tarqatish.
- Bitta amalga javoban bitta xabar o‘rniga ketma-ket bir nechta xabar yuborish.
- `file_id` o‘rniga bir xil faylni qayta-qayta yuklash.
- `callback_data` da katta ma’lumotlarni saqlash — limit 64 bayt.
- Standart API foydalanuvchining 100 MB lik videosini yuklab oladi deb kutish.

## FAQ

### Nega bot soniyasiga 30 tadan kam xabar yuborsa ham 429 oldi?

Ehtimol, bitta chat yoki guruh limiti ishlagan: bitta foydalanuvchiga ketma-ket bir nechta xabar yoki guruhga daqiqasiga 20 tadan ko‘p xabar. Tezlikni faqat global emas, har bir chat uchun ham cheklang.

### Telegram’dan limitlarni oshirishni so‘rash mumkinmi?

Oddiy limitlar so‘rov bo‘yicha oshirilmaydi. Yuqori tezlikdagi tarqatish uchun Stars evaziga pullik tarqatish, katta fayllar uchun esa o‘zingizning Local Bot API Server’ingiz mavjud.

### Bot yangilanishlarni olmasa nima bo‘ladi?

Telegram olinmagan yangilanishlarni cheklangan vaqt, taxminan bir sutka saqlaydi. Bot bundan uzoqroq ishlamay tursa, hodisalarning bir qismi yo‘qoladi, shuning uchun uning ishlashini kuzatib boring.
