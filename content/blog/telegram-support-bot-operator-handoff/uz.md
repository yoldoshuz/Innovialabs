---
title: Telegram’da operatorga uzatadigan qo‘llab-quvvatlash boti
description: Telegram’da qo‘llab-quvvatlash boti: FAQ ssenariylari, murojaat yaratish, dialogni xodimlar guruhiga yoki helpdesk’ka uzatish va javobni mijozga yetkazish.
summary: Bot avval odatiy savollarni FAQ orqali yopadi, javob topilmasa, murojaat yaratadi va yozishmani har bir mijoz uchun alohida mavzu ochilgan xodimlar guruhiga yoki helpdesk’ka uzatadi; operator javobini bot mijozga nusxalaydi, shuning uchun mijoz faqat bot bilan muloqot qiladi.
---
## Qisqa javob

Operatorli qo‘llab-quvvatlash boti uch qatlamda ishlaydi:

1. **O‘z-o‘ziga xizmat.** Tugmalardagi FAQ odatiy savollarni odam ishtirokisiz yopadi.
2. **Murojaat.** Javob bo‘lmasa, bot tiket yaratadi: raqam, toifa, tavsif, kontakt.
3. **Operator.** Yozishma xodimlar guruhiga yoki helpdesk’ka ketadi, operator javobini bot mijozga yetkazadi.

Mijoz doim faqat bot bilan muloqot qiladi. Xodimlarning shaxsiy akkauntlari ko‘rinmaydi, butun tarix esa bir joyda saqlanadi.

## 1-qatlam. FAQ ssenariylari

- O‘ylab topilgan emas, qo‘llab-quvvatlash yozishmalaridagi **haqiqiy tez-tez beriladigan savollarni** yig‘ing.
- Ularni tugmalardagi 4-6 bo‘limga guruhlang: to‘lov, yetkazib berish, akkaunt, qaytarish.
- Javob **yakuniy** bo‘lishi kerak: yo‘riqnoma, havola yoki harakat. Javobdan keyin «Yordam berdi» va «Operator kerak» tugmalari.
- **«Operator bilan bog‘lanish»** tugmasi har qanday qadamda mavjud. Uni yashirsangiz, odamlar boshqa kanallarga yoza boshlaydi.
- Erkin matnni kalit so‘zlar yoki bilimlar bazasi bo‘yicha qidiruv orqali FAQ bilan moslashtirish mumkin, lekin moslik ishonchsiz bo‘lsa, darhol operatorni taklif qilgan yaxshi.

## 2-qatlam. Murojaat yaratish

Odamga uzatishdan oldin bot operator savollardan boshlamasligi uchun minimal ma’lumot yig‘adi:

- **toifa** (tugmalar orqali);
- muammoning matnli **tavsifi**, skrinshot bilan ham bo‘lishi mumkin;
- toifa uchun kerak bo‘lsa, **buyurtma yoki akkaunt raqami**;
- mijoz aniqlanmagan bo‘lsa, **kontakt**.

Bot bazada yozuv yaratadi: tiket ID’si, mijozning Telegram ID’si, holat (`open`, `in_progress`, `waiting_customer`, `closed`), biriktirilgan operator, yaratilgan vaqt. Mijozga darhol murojaat raqami va ish vaqtida javob muddati haqida halol kutish yuboriladi.

## 3-qatlam. Operatorga yo‘naltirish

| Variant | Qanday ishlaydi | Qachon mos |
|---|---|---|
| Mavzuli guruh | Mavzular yoqilgan superguruh, har bir mijozga alohida mavzu | Kichik jamoa, to‘g‘ridan-to‘g‘ri Telegram’da ishlash |
| Reply’li guruh | Bot xabarni uzatadi, operator reply bilan javob beradi | Juda oddiy oqim |
| Helpdesk | Tiketlar qo‘llab-quvvatlash tizimida API orqali yaratiladi, javoblar webhook bilan keladi | SLA, hisobotlar, bir nechta kanal kerak |

**Mavzuli guruh** — boshlash uchun eng qulay variant. Bot superguruhga mavzularni boshqarish huquqi bilan administrator sifatida qo‘shiladi, har bir murojaat uchun mavzu yaratadi va mijoz xabarlarini u yerga nusxalaydi. Operator mavzuga yozadi, bot javobni mijozga nusxalaydi.

```python
from aiogram import Bot, F, Router
from aiogram.types import Message

router = Router()

@router.message(F.chat.type == "private")
async def from_customer(message: Message, bot: Bot):
    ticket = await tickets.get_open(message.from_user.id)
    if ticket is None:
        ticket = await tickets.create(message.from_user.id)
        topic = await bot.create_forum_topic(
            chat_id=STAFF_CHAT_ID,
            name=f"#{ticket.id} {message.from_user.full_name}",
        )
        ticket = await tickets.attach_thread(ticket.id, topic.message_thread_id)
    await message.copy_to(STAFF_CHAT_ID, message_thread_id=ticket.thread_id)

@router.message(F.chat.id == STAFF_CHAT_ID, F.message_thread_id, ~F.forum_topic_created)
async def from_operator(message: Message):
    ticket = await tickets.by_thread(message.message_thread_id)
    if ticket and not (message.text or "").startswith("/"):
        await message.copy_to(ticket.user_id)
```

Nega uzatish emas, `copyMessage`: nusxa muallifni ko‘rsatmaydi, shuning uchun mijoz operator ismini ko‘rmaydi, xodimlar esa xabarni ortiqcha belgilarsiz oladi.

Mavzudagi `/close` kabi xizmat buyruqlarini bot mijozga yubormaydi, balki tiket holatini o‘zgartiradi va mavzuni yopadi.

## Javobni qaytarish va yopish

- Operator javobi mijozga bot nomidan keladi. Xohlasangiz, bot «Qo‘llab-quvvatlash operatori» kabi imzo qo‘shadi.
- Operator tiketni yopganda bot bu haqda mijozga xabar beradi va tugmalar bilan yordamni baholashni taklif qiladi.
- Mijoz yopilgandan keyin yozsa, yangi murojaat yaratiladi yoki eskisi qayta ochiladi — bu qoidani oldindan belgilang.
- Belgilangan muddatdan uzoq mijoz javobisiz qolgan murojaatlar xabarnoma bilan avtomatik yopiladi.

## Ko‘p uchraydigan xatolar

- Bot guruhda administrator huquqisiz: maxfiylik rejimi tufayli u operatorlar xabarlarini ko‘rmaydi.
- Barcha mijozlar uchun bitta umumiy lenta: javoblar boshqa odamga ketib qoladi.
- Ishdan tashqari rejim yo‘q: mijoz tunda javob kutadi va qo‘llab-quvvatlash ertalab ishlashini bilmaydi.
- «Mavzu — mijoz» bog‘lanishini faqat jarayon xotirasida saqlash: qayta ishga tushirilgandan keyin javoblar yo‘qoladi.
- Operatorlarga ilovalarni turi va hajmini tekshirmasdan yuborish.

Guruhlardagi mavzular haqida batafsil — [Bot API hujjatlarida](https://core.telegram.org/bots/api#createforumtopic).

## FAQ

### Bunday guruhda nechta operator ishlashi mumkin?

Cheklov ko‘proq tashkiliy: jamoa barcha murojaatlarni ko‘ra olayotgan ekan, mavzuli guruh qulay. Biriktirish, navbatlar va SLA hisobotlari kerak bo‘lganda API orqali helpdesk’ka o‘ting.

### Birinchi liniyaga sun’iy intellektni ulash mumkinmi?

Mumkin: model bilimlar bazasi asosida javob beradi, ishonchsiz bo‘lsa yoki mijoz so‘rasa, dialogni operatorga uzatadi. Javoblar faqat kompaniyaning tekshirilgan materiallariga tayanishi muhim.

### Mijoz unga qaysi xodim javob berganini ko‘radimi?

Yo‘q, agar bot xabarlarni nusxalasa. Mijoz faqat botni ko‘radi, xizmat uchun kerak bo‘lsa, operator ismini imzo sifatida qo‘shish mumkin.
