---
title: Bot foydalanuvchilariga bloklanmasdan xabar tarqatish
description: Bot bazasiga ommaviy xabarni Telegram limitlariga urilmasdan yuborish: tezlik, navbat, 429 va 403 xatolari, auditoriya segmentlari va yetkazilishni hisoblash.
summary: Ommaviy xabarni tezligi cheklangan navbat orqali yuboring, 429 xatosida aynan retry_after qadar kuting, 403 qaytargan foydalanuvchilarni nofaol deb belgilang, natijani esa har bir xabar holati va havolalar bo‘yicha o‘tishlardan hisoblang.
---
## Qisqa javob

Muammosiz tarqatma — bu `for user in users: send()` sikli emas, balki **tezligi cheklangan navbat**. Nima kerak:

- **Tezlik.** Telegram o‘z FAQ’ida ommaviy bildirishnomalarni taxminan sekundiga 30 xabardan tez yubormaslikni va bitta chatga sekundiga bittadan ortiq xabar yozmaslikni maslahat beradi. Bu chegaradan pastroqda zaxira bilan ishlang.
- **429 xatosi.** Telegram `Too Many Requests` deb javob bersa, `retry_after`da ko‘rsatilgan soniya qadar kuting va qaytadan yuboring.
- **403 xatosi.** Foydalanuvchi botni bloklagan yoki akkauntini o‘chirgan. Uni nofaol deb belgilang va boshqa yozmang.
- **Hisob.** Har bir xabar holat oladi: yuborildi, xato, bloklangan.

Katta hajmlar uchun Telegram’da **pullik tarqatmalar** bor: `allow_paid_broadcast` parametri Telegram Stars evaziga bepul limitdan oshishga imkon beradi. Tafsilotlar va narxlar — Bot API hujjatlarida.

## Yuborishni qanday tashkil qilish

1. Bazada **kampaniya yarating**: matn, tugmalar, segment, boshlanish vaqti.
2. **Qabul qiluvchilar ro‘yxatini tuzing** — har bir foydalanuvchi uchun `pending` holatidagi bitta yozuv.
3. **Worker** (fon jarayoni) yozuvlarni partiyalab oladi va xabarlar orasida pauza bilan yuboradi.
4. **Har bir yuborish natijasi** shu jadvalga yoziladi: `sent`, `blocked`, `failed` va xabar ID’si.
5. **Takrorlash** faqat `pending` va vaqtinchalik xatolar uchun bajariladi. Worker’ni qayta ishga tushirish xabarlarni ikkinchi marta yubormasligi kerak.

Navbat uchun o‘zingizga tanish har qanday vosita mos: Redis, Celery, arq, RabbitMQ yoki qatorlarni bloklaydigan oddiy PostgreSQL jadvali. Muhimi, holat jarayon xotirasida emas, bazada saqlansin.

aiogram 3 dagi minimal mantiq:

```python
import asyncio
from aiogram.exceptions import (
    TelegramForbiddenError,
    TelegramRetryAfter,
    TelegramBadRequest,
)

async def send_one(bot, user_id: int, from_chat_id: int, message_id: int) -> str:
    while True:
        try:
            await bot.copy_message(user_id, from_chat_id, message_id)
            return "sent"
        except TelegramRetryAfter as e:
            await asyncio.sleep(e.retry_after)
        except TelegramForbiddenError:
            return "blocked"
        except TelegramBadRequest:
            return "failed"

async def run_campaign(bot, recipients, from_chat_id, message_id, rate=20):
    for user_id in recipients:
        status = await send_one(bot, user_id, from_chat_id, message_id)
        await save_status(user_id, status)
        await asyncio.sleep(1 / rate)
```

`copyMessage` tarqatmalar uchun qulay: postni xizmat chatida tayyorlaysiz, ko‘rinishini tekshirasiz, bot esa uni «uzatilgan» belgisisiz nusxalaydi.

## Xatolar va ular bilan nima qilish kerak

| Telegram javobi | Sabab | Harakat |
|---|---|---|
| 429 Too Many Requests | Tezlik oshib ketgan | `retry_after` qadar pauza, keyin takrorlash |
| 403 Forbidden | Bot bloklangan, akkaunt o‘chirilgan | `is_active = false` deb belgilash |
| 400 Bad Request | Chat topilmadi, noto‘g‘ri belgilash, tugmadagi buzuq havola | Xatoni yozib qo‘yish, cheksiz takrorlamaslik |
| 5xx, timeout | Vaqtinchalik nosozlik | Kechikish bilan takrorlash, urinishlar sonini cheklash |

Agar 429 doimiy kelayotgan bo‘lsa, bu shunchaki uzoqroq kutish emas, umumiy tezlikni pasaytirish kerakligi haqidagi signal.

## Segmentatsiya

Hammaga hamma narsani yubormang. Segmentlar javobni oshiradi va bloklashlar sonini kamaytiradi:

- **Faollik**: oxirgi oyda botga yozgan, uzoq vaqtdan beri kirmagan.
- **Harakatlar**: ariza qoldirgan, xarid qilgan, rasmiylashtirishni yarmida tashlagan.
- **Manba**: `start` parametrli aniq reklama havolasi orqali kelgan.
- Interfeys yoki botda tanlangan **til**.
- **Rozilik**: foydalanuvchi bot sozlamalarida bildirishnomalarni o‘chirmagan.

Foydalanuvchiga obunadan chiqishning oson yo‘lini bering: tugma yoki buyruq. Bu botni bloklashdan yaxshiroq, chunki bloklangandan keyin aloqani butunlay yo‘qotasiz.

## Natijani qanday o‘lchash

- **Yetkazilish**: barcha qabul qiluvchilar ichida `sent` ulushi, yangi `blocked` soni.
- **O‘tishlar**: UTM belgili havolalar yoki `t.me/bot?start=camp42` kabi deep link, u orqali bot odam qaysi tarqatmadan kelganini tushunadi.
- **Inline tugmalarni bosish**: kampaniya ID’si yozilgan callback.
- **Maqsadli harakatlar**: kampaniya bilan bog‘liq arizalar va to‘lovlar.
- Tarqatmadan keyingi bir necha kun ichidagi **obunadan chiqishlar va bloklashlar**.

Bot API xabar o‘qilganini bildirmaydi, shuning uchun foydalanuvchilar harakatlariga tayaning.

## Ko‘p uchraydigan xatolar

- Tarqatmani buyruq ishlovchisi ichidan yuborish: jarayon to‘xtab qoladi, qayta ishga tushganda ba’zilar xabarni ikki marta oladi.
- Umumiy tezlik cheklagichisiz ko‘plab parallel oqimlarda yuborish.
- 403 ni e’tiborsiz qoldirish: «o‘lik» foydalanuvchilar bazasi o‘sadi va har bir tarqatma ularga vaqt sarflaydi.
- Til va qiziqishlarni hisobga olmasdan butun bazaga bir xil matn.

Limitlar haqida batafsil — [Telegram bot dasturchilari uchun FAQ](https://core.telegram.org/bots/faq)da.

## FAQ

### Bir nechta bot ishga tushirib, tarqatmani tezlashtirish mumkinmi?

Har bir bot faqat o‘z foydalanuvchilariga yoza oladi, shuning uchun bazani botlar o‘rtasida bo‘lish odatda muammoni hal qilmaydi. Umumiy tezlik cheklagichi va kerak bo‘lsa pullik tarqatmalar ishonchliroq.

### Katta bazaga tarqatma qancha vaqt oladi?

Bu baza hajmiga, tanlangan tezlikka va xatolar soniga bog‘liq. Vaqtni oldindan hisoblash oson: qabul qiluvchilar sonini yuborish tezligiga bo‘ling va 429 dan keyingi pauzalar uchun zaxira qo‘shing.

### Bezovta qilmaslik uchun tarqatmani tunda yuborish kerakmi?

Aksincha: auditoriya faol bo‘lgan vaqtni tanlang va vaqt mintaqasini hisobga oling. Tungi bildirishnomalar ko‘proq obunadan chiqish va bloklashlarga olib keladi.
