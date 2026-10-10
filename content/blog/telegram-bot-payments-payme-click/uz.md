---
title: Telegram-botda Payme va Click orqali to‘lov qabul qilish
description: Botda Payme va Click orqali to‘lov olishning ikki yo‘li: Telegram ichki hisob-fakturasi va to‘lov havolasi. Qadamlar, tekshiruvlar va buyurtmani tasdiqlash.
summary: Ikki yo‘l bor: Payme yoki Click’ni BotFather’da provayder sifatida ulab, hisobni to‘g‘ridan-to‘g‘ri chatda yuborish yoki to‘lov havolasini yuborib, buyurtmani to‘lov tizimining callback’i orqali tasdiqlash; ikkala holatda ham buyurtma faqat server tasdig‘idan keyin to‘langan hisoblanadi.
---
## Qisqa javob

Botda O‘zbekiston to‘lov tizimlari orqali pul qabul qilishning ikki usuli bor:

- **Telegram ichki hisob-fakturasi (invoice).** Payme yoki Click’ni BotFather’da to‘lov provayderi sifatida ulaysiz, bot hisob yuboradi, mijoz chatdan chiqmasdan to‘laydi.
- **To‘lov havolasi (redirect).** Bot o‘zingizda buyurtma yaratadi, Payme yoki Click to‘lov sahifasiga havola tuzadi va to‘lov tizimi serveringizga callback yuborishini kutadi.

Muhim cheklov: **Telegram ichidagi raqamli tovar va xizmatlar** (obunalar, kontentga kirish, o‘yin ichidagi bonuslar) Telegram qoidalariga ko‘ra Telegram Stars evaziga sotiladi. Payme va Click jismoniy tovarlar, yetkazib berish, xizmatlarga yozilish va boshqa oflayn ssenariylar uchun mos.

## Ikki yondashuvni solishtirish

| Mezon | Telegram invoice | To‘lov havolasi |
|---|---|---|
| Mijoz qayerda to‘laydi | Telegram oynasida | To‘lov tizimi sahifasida |
| Nimani ulash kerak | BotFather’da provayder | Merchant akkaunt va to‘lov tizimi API’si |
| To‘lovni kim tasdiqlaydi | Telegram `successful_payment` yuboradi | To‘lov tizimi serveringizga murojaat qiladi |
| Moslashuvchanlik | Invoice formati bilan cheklangan | Mantiq va cheklar ustidan to‘liq nazorat |
| Murakkablik | Pastroq | Yuqoriroq: callback uchun alohida endpoint kerak |

Invoice mijoz uchun qulayroq va tezroq ishga tushadi. Redirect’ni saytda to‘lov allaqachon ulangan bo‘lsa, sayt va bot uchun buyurtmalar mantig‘i umumiy bo‘lishi kerak bo‘lsa yoki invoice formati to‘g‘ri kelmasa tanlashadi.

## 1-variant: provayder orqali invoice

1. BotFather’da botni oching, **Payments** bo‘limida Payme yoki Click’ni tanlang va ulash jarayonidan o‘ting. Avval test rejimidan boshlang.
2. **Provider token** oling va uni kodda emas, muhit o‘zgaruvchilarida saqlang.
3. Hisobni `sendInvoice` metodi bilan yuboring. Summa **valyutaning eng kichik birligida** beriladi: `UZS` uchun bu tiyin, ya’ni so‘mdagi summani 100 ga ko‘paytiramiz.
4. `pre_checkout_query`ga javob bering. Bu rad etishning oxirgi imkoniyati: tovar tugagan, narx o‘zgargan, buyurtma bekor qilingan. Tez javob berish kerak, aks holda Telegram to‘lovni bekor qiladi.
5. `successful_payment` xabarini kuting va faqat shundan keyin buyurtmani to‘langan deb belgilang.

aiogram 3 dagi minimal misol:

```python
from aiogram import Bot, F, Router
from aiogram.types import LabeledPrice, Message, PreCheckoutQuery

router = Router()

@router.message(F.text == "/buy")
async def buy(message: Message, bot: Bot):
    await bot.send_invoice(
        chat_id=message.chat.id,
        title="Buyurtma #1024",
        description="Toshkent bo‘ylab yetkazib berish",
        payload="order:1024",
        provider_token=PROVIDER_TOKEN,
        currency="UZS",
        prices=[LabeledPrice(label="Tovar", amount=15000000)],  # 150 000 so‘m
    )

@router.pre_checkout_query()
async def pre_checkout(query: PreCheckoutQuery):
    ok = await order_is_valid(query.invoice_payload, query.total_amount)
    await query.answer(ok=ok, error_message=None if ok else "Buyurtma endi mavjud emas")

@router.message(F.successful_payment)
async def paid(message: Message):
    sp = message.successful_payment
    await mark_paid(sp.invoice_payload, sp.provider_payment_charge_id)
```

`payload`ga tovar haqidagi ma’lumotni emas, bazangizdagi buyurtma ID’sini yozing: keyingi barcha qadamlarda buyurtmani aynan shu orqali topasiz.

## 2-variant: to‘lov havolasi

1. Bot bazada «to‘lov kutilmoqda» holatidagi buyurtma yaratadi.
2. Server to‘lov tizimi qoidalariga ko‘ra buyurtma ID’si va summasi bilan to‘lov sahifasiga havola tuzadi va uni tugma ko‘rinishida yuboradi.
3. Mijoz Payme yoki Click tomonida to‘laydi.
4. To‘lov tizimi serveringizga murojaat qiladi: **Payme**’da bu `CheckPerformTransaction`, `CreateTransaction`, `PerformTransaction` kabi metodlarga ega Merchant API, **Click**’da esa Prepare va Complete so‘rovlari.
5. Server so‘rov imzosi yoki avtorizatsiyasini, summani va buyurtma holatini tekshiradi, so‘ng bot mijozga to‘lov o‘tganini yozadi.

Summa birliklariga e’tibor bering: tizimlarda ular farq qiladi (tiyin yoki so‘m), buni ularning hujjatlaridan tekshiring.

## Buyurtmani tasdiqlash: nimalarni tekshirish kerak

- Tasdiqdagi **summa va valyuta** bazadagi buyurtma bilan mos keladi.
- **Idempotentlik**: takroriy callback yoki takroriy xabar ikkinchi to‘lovni yaratmaydi. Tranzaksiya ID’sini saqlang va tekshiring.
- **Buyurtma holati** faqat serverda o‘zgaradi. Mijozning «To‘ladim» tugmasi to‘lov isboti emas.
- **Bekor qilish va qaytarish** ishlanadi: Payme’da tranzaksiyani bekor qilish uchun alohida metod bor.
- **Menejerga xabar** mijoz «To‘lash»ni bosgandan keyin emas, tasdiqdan keyin yuboriladi.

## Ko‘p uchraydigan xatolar

- `sendInvoice`ga tiyin o‘rniga so‘m berish: mijoz yuz baravar kichik hisobni ko‘radi.
- `pre_checkout_query` ishlovchisida uzoq mantiq: to‘lov vaqt tugashi sababli bekor bo‘ladi.
- Telegram ichida raqamli kirishni Payme yoki Click orqali sotish, bu platforma qoidalariga zid.
- Prodakshnda test token yoki repozitoriyda jangovar token.

Batafsil ma’lumot — [Telegram hujjatlarida](https://core.telegram.org/bots/payments).

## FAQ

### Telegram invoice orqali to‘lov uchun Payme yoki Click bilan shartnoma kerakmi?

Ha. BotFather’da provayderni ulash botni sizning merchant akkauntingizga bog‘laydi, shuning uchun yuridik rasmiylashtirish va biznesni tekshirish to‘lov tizimining o‘zida o‘tadi.

### Ikkala usuldan bir vaqtda foydalanish mumkinmi?

Mumkin. Masalan, chatdagi tezkor xaridlar uchun invoice, saytda ham rasmiylashtiriladigan buyurtmalar uchun esa havola. Asosiysi, ikkala yo‘l ham bitta buyurtmalar jadvaliga yozsin.

### Nega pre_checkout_query’ga javobdan keyin buyurtmani to‘langan deb hisoblab bo‘lmaydi?

Chunki bu faqat yechib olishdan oldingi tekshiruv. Pul yechilmasligi mumkin, shuning uchun to‘lov faktini faqat `successful_payment` yoki to‘lov tizimi callback’i tasdiqlaydi.
