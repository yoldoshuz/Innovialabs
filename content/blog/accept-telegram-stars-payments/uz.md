---
title: Bot yoki Mini App’da Telegram Stars qabul qilish
description: Telegram Stars’ni qadamma-qadam qabul qilish: XTR invoice, pre_checkout_query va successful_payment, pulni qaytarish va raqamli tovarni ishonchli berish.
summary: Bot to‘lov provayderisiz XTR valyutasida invoice yaratadi, pre_checkout_query’ni tasdiqlaydi va tovarni faqat successful_payment’dan keyin beradi, idempotentlik va refundStarPayment orqali qaytarish uchun telegram_payment_charge_id’ni saqlaydi.
---
## Qisqa javob

**Telegram Stars** — Telegram’ning ichki valyutasi, botlar va Mini App’lar u orqali raqamli tovar va xizmatlarni sotadi. Ishlash sxemasi:

1. Bot **`XTR`** valyutasida invoice yaratadi. To‘lov provayderi kerak emas, `provider_token` maydoni bo‘sh qoladi.
2. Foydalanuvchi to‘lovni tasdiqlaydi, bot **`pre_checkout_query`** oladi va «mumkin» yoki «mumkin emas» deb javob beradi.
3. Pul yechilgach, **`successful_payment`** xabari keladi. Tovarni faqat shu paytda berasiz.
4. Kerak bo‘lsa, **`refundStarPayment`** metodi bilan pulni qaytarasiz.

## Stars qayerda majburiy

Telegram qoidalariga ko‘ra Telegram ichida iste’mol qilinadigan raqamli tovar va xizmatlar Stars evaziga sotiladi: kontentga obunalar, botning premium funksiyalari, o‘yin ichidagi buyumlar, materiallarga kirish. Jismoniy tovarlar va oflayn xizmatlar avvalgidek oddiy to‘lov provayderlari orqali to‘lanadi.

## Botdagi invoice

Narx bitta pozitsiya bilan beriladi: `XTR` uchun `prices`da aynan bitta element bo‘ladi, summa esa butun yulduzlarda ko‘rsatiladi.

```python
from aiogram import Bot, F, Router
from aiogram.types import LabeledPrice, Message, PreCheckoutQuery

router = Router()

@router.message(F.text == "/premium")
async def sell(message: Message):
    order_id = await create_order(message.from_user.id, product="premium_30d")
    await message.answer_invoice(
        title="30 kunlik premium",
        description="Botning kengaytirilgan funksiyalari",
        payload=f"order:{order_id}",
        currency="XTR",
        prices=[LabeledPrice(label="Premium", amount=100)],
    )

@router.pre_checkout_query()
async def pre_checkout(query: PreCheckoutQuery):
    ok = await order_is_open(query.invoice_payload)
    await query.answer(ok=ok, error_message=None if ok else "Buyurtma endi mavjud emas")

@router.message(F.successful_payment)
async def paid(message: Message):
    sp = message.successful_payment
    await deliver_once(
        payload=sp.invoice_payload,
        charge_id=sp.telegram_payment_charge_id,
        user_id=message.from_user.id,
    )
```

## Mini App’da to‘lov

Mini App’da invoice chatga xabar yubormasdan ochiladi:

1. Server xuddi shu parametrlar bilan (`currency="XTR"`, bitta narx, buyurtma ID’si yozilgan `payload`) **`createInvoiceLink`** ni chaqiradi va havolani frontendga beradi.
2. Frontend `Telegram.WebApp.openInvoice(url, callback)` ni chaqiradi.
3. Callback holatni oladi: `paid`, `cancelled`, `failed` yoki `pending`.

Callback’dagi holat faqat interfeys uchun kerak: «Rahmat» ekranini ko‘rsatish yoki tugmani qaytarish. **Unga qarab tovar berish mumkin emas.** Haqiqat manbai — bot serverda oladigan `successful_payment` yangilanishi. To‘lovdan keyin Mini App shunchaki serverdan buyurtmaning joriy holatini so‘raydi.

## Tovarni ishonchli berish

Eng ko‘p uchraydigan muammo — tovar ikki marta berilgan yoki umuman berilmagan. Buning oldini olish uchun:

- **Buyurtmani invoice’dan oldin yarating** va uning ID’sini `payload`ga yozing. `payload`da narx yoki tarkibni saqlamang, ularni adashtirish oson.
- **`telegram_payment_charge_id`ni** unikal indeks bilan saqlang. Xuddi shu ID bilan kelgan takroriy yangilanish shunchaki e’tiborsiz qoldiriladi.
- **Tovarni tranzaksiya ichida bering**: «to‘langan» belgisi va kirish huquqini berish birga o‘tishi yoki umuman o‘tmasligi kerak.
- **`pre_checkout_query`da** tovar berishga xalaqit beradigan hamma narsani tekshiring: buyurtma avval to‘lanmagan, tovar bor, foydalanuvchi bloklanmagan. Tez javob bering, aks holda to‘lov bekor bo‘ladi.
- **Berish jarayonini qayta ishga tushiriladigan qiling**: tovar bilan xabar yuborish muvaffaqiyatsiz bo‘lsa, vazifa yangi to‘lov yaratmasdan qayta ishlashi kerak.

## Pulni qaytarish

`refundStarPayment` metodi `user_id` va `telegram_payment_charge_id`ni qabul qiladi va yulduzlarni foydalanuvchiga qaytaradi. Amaliy qoidalar:

- Qaytarishdan oldin berilgan kirish huquqini bekor qiling va buyurtmani «qaytarilgan» deb belgilang.
- Bitta to‘lov bo‘yicha ikki marta qaytarib bo‘lmaydi, shuning uchun buyurtma holatini o‘zingizda tekshiring.
- Botda qaytarish qoidalarini tushuntiring va to‘lov bo‘yicha savollar uchun aniq buyruq bering. Telegram to‘lov qabul qiluvchi botdan foydalanuvchilarning shu boradagi murojaatlariga javob berishini kutadi (odatda buning uchun `/paysupport` buyrug‘i qilinadi).

Solishtirish uchun `getStarTransactions`dan foydalaning: metod botning kiruvchi va chiquvchi operatsiyalari tarixini qaytaradi, u orqali bazangiz bilan nomuvofiqliklarni topish qulay.

## Ko‘p uchraydigan xatolar

- `XTR` uchun `prices`da bir nechta pozitsiya: Telegram xato qaytaradi.
- Tovarni `pre_checkout_query` ishlovchisida yoki Mini App callback’i bo‘yicha berish.
- `telegram_payment_charge_id` bo‘yicha unikallik yo‘qligi.
- Faqat jangovar muhitda test qilish. Ssenariylarni tekshirish uchun Telegram test serveridan foydalaning.

Batafsil — [Stars orqali to‘lovlar haqidagi Telegram hujjatlarida](https://core.telegram.org/bots/payments-stars).

## FAQ

### Stars evaziga jismoniy tovar sotish mumkinmi?

Stars raqamli tovar va xizmatlar uchun mo‘ljallangan. Yetkazib berish, oflayn xizmatlar va jismoniy tovarlar uchun oddiy to‘lov provayderi ulanadi.

### Stars evaziga obuna sotish mumkinmi?

Ha. `createInvoiceLink` `subscription_period` parametri orqali davriy to‘lovni qo‘llab-quvvatlaydi. Har bir uzaytirish yangi `successful_payment` sifatida keladi va uni birinchi to‘lov kabi ishlash kerak.

### Ishlab topilgan yulduzlarni qanday yechib olish mumkin?

Bot egasi to‘plangan Stars’ni Fragment orqali yechib olishi yoki Telegram’dagi reklamaga sarflashi mumkin. Yechib olish shartlarini Telegram belgilaydi, ularni dolzarb hujjatlardan tekshirish kerak.
