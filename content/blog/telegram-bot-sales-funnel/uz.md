---
title: Telegram-botda savdo voronkasini qanday qurish mumkin
description: Telegram-botdagi savdo voronkasi: birinchi aloqadan qayta xaridgacha bosqichlar, chuqur havolalar, segmentatsiya, eslatma xabarlari va konversiyani hisoblash.
summary: Mijoz yo‘lini /start dan qayta xaridgacha bosqichlarga bo‘ling, manbani chuqur havola bilan belgilang, tugmali savollar bilan segmentlang, to‘xtab qolganlarni qisqa eslatmalar bilan qaytaring va konversiyani hisoblash uchun har bir bosqichni hodisa sifatida yozing.
---
## Qisqa javob

Botdagi voronka — bosqichlar zanjiri bo‘lib, har bir qadamda bot **bitta tushunarli harakatni** taklif qiladi:

1. manba belgisi bor chuqur havola orqali kirish;
2. birinchi foyda — tanlov, hisob-kitob, sovg‘a;
3. saralash — tugmalar bilan ikki-uchta savol;
4. segmentga mos taklif;
5. ariza yoki to‘lov;
6. to‘xtab qolganlar uchun eslatma xabarlari;
7. qayta xarid va tavsiyalar.

Har bir bosqich bazaga **hodisa** sifatida yoziladi — shunda odamlar qayerda ketayotganini ko‘rasiz.

## Voronka xaritasi

| Bosqich | Bot nima qiladi | Hodisa |
|---|---|---|
| Kirish | belgili `/start` ni qabul qiladi | `start` |
| Foyda | va’da qilingan materialni beradi | `lead_magnet` |
| Saralash | tugmalar bilan savol beradi | `qualified` |
| Taklif | mahsulot yoki tarifni ko‘rsatadi | `offer_viewed` |
| To‘lov | hisob yuboradi yoki menejerga uzatadi | `checkout`, `paid` |
| Qayta xarid | eslatadi, bonus beradi | `repeat` |

## Chuqur havolalar: odam qayerdan keldi

`https://t.me/your_bot?start=ig_reels_oct` ko‘rinishidagi havola botni ochadi, «Start» bosilganda esa bot `/start ig_reels_oct` buyrug‘ini oladi. Parametr — lotin harflari, raqamlar, `_` va `-` dan iborat 64 belgigacha. Har bir kanal uchun alohida havola yarating: stories, bloger, sayt, varaqa.

```python
from aiogram.filters import CommandStart, CommandObject

@router.message(CommandStart(deep_link=True))
async def start_with_source(message: Message, command: CommandObject):
    source = command.args  # masalan "ig_reels_oct"
    await save_first_source(message.from_user.id, source)  # faqat hali saqlanmagan bo‘lsa
    await track(message.from_user.id, "start", source)
    await message.answer("Salom! Bir daqiqada mos variantni tanlaymizmi?", reply_markup=start_kb)
```

**Birinchi manbani** alohida saqlang — aks holda boshqa havola orqali qayta kirish mijozning kelib chiqishini qayta yozib yuboradi. Saytdan belgini xuddi shu havolada, UTM parametrlarini qisqa kodga aylantirib uzatish mumkin.

## Segmentatsiya

Faqat taklifni o‘zgartiradigan narsani so‘rang: nima qiziqtiradi, kim uchun, hajm yoki byudjet qancha, qaysi shaharga yetkazish kerak. Har bir savol — erkin matn emas, tugmalar. Javoblarni foydalanuvchi **teglari** sifatida saqlang: ular bo‘yicha bot taklifni, siz esa xabar tarqatish auditoriyasini tanlaysiz.

## Eslatma xabarlari

Agar odam biror bosqichda to‘xtab qolsa, belgilangan vaqtdan keyin bot bitta harakat bilan o‘zini eslatadi: «Rasmiylashtirish», «Menejerga savol berish», «Hozir emas». Qoidalar:

- faqat botni ishga tushirgan va uni bloklamaganlarga yozish mumkin; `403` xatosi bloklanganini bildiradi — foydalanuvchini nofaol deb belgilang;
- bir bosqichga bir-ikkita eslatma, keyin tanaffus;
- har bir eslatmada «Eslatma yubormang» tugmasi;
- vazifalarni bazada saqlang va xotiradagi taymer bilan emas, rejalashtiruvchi bilan ishga tushiring — shunda ular qayta ishga tushganda yo‘qolmaydi;
- Telegram’ning yuborish tezligi limitlariga rioya qiling va `429` javobida `retry_after` dagi vaqtni kuting.

## To‘lov va qayta xarid

To‘lovni to‘g‘ridan-to‘g‘ri botda to‘lov provayderi bilan Telegram Payments orqali, raqamli tovarlarni Telegram Stars orqali qabul qilish yoki saytdagi to‘lov havolasini berish mumkin. Xariddan keyin voronka tugamaydi:

- buyurtmani tasdiqlang va statuslarni yuborib turing;
- biroz vaqtdan keyin baho so‘rang;
- mahsulot odatda tugaydigan paytda qayta xarid haqida eslating;
- kim kimni olib kelganini ko‘rish uchun `?start=ref_12345` ko‘rinishidagi referal havolani bering.

## Konversiyani hisoblash

Bitta hodisalar jadvali yetarli:

```sql
CREATE TABLE funnel_events (
  id         BIGSERIAL PRIMARY KEY,
  user_id    BIGINT NOT NULL,
  event      TEXT NOT NULL,
  source     TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

SELECT source, event, COUNT(DISTINCT user_id) AS users
FROM funnel_events
GROUP BY source, event
ORDER BY source, event;
```

Qo‘shni bosqichlardagi foydalanuvchilar sonini bir-biriga bo‘lsangiz, qadam konversiyasi chiqadi, `source` bo‘yicha taqsimot esa qaysi kanal shunchaki obunachi emas, xaridor olib kelayotganini ko‘rsatadi.

## Ko‘p uchraydigan xatolar

- **birinchi xabardayoq sotish** — foyda va savollarsiz odam ketib qoladi;
- **barcha kanallar uchun bitta havola** — nima ishlayotganini tushunib bo‘lmaydi;
- **obunani bekor qilish imkoni yo‘q eslatmalar** — bloklashlar ko‘payadi;
- **menejerga uzatish yo‘q** — murakkab savol menyuda boshi berk ko‘chaga kirib qoladi.

## FAQ

### Voronkada nechta bosqich bo‘lishi kerak?

Xarid qarori uchun qancha kerak bo‘lsa, shuncha. Agar bosqich taklifni o‘zgartirmasa va to‘lovga yaqinlashtirmasa, uni olib tashlash mumkin.

### Botning barcha foydalanuvchilariga xabar tarqatish mumkinmi?

Ha, botni ishga tushirgan va uni bloklamaganlarga. Ammo segmentlar bo‘yicha tarqatish yaxshiroq ishlaydi va kamroq bloklashga olib keladi.

### Qaysi bosqich cho‘kayotganini qanday bilish mumkin?

Qo‘shni bosqichlardagi foydalanuvchilar sonini manbalar kesimida solishtiring. Bir vaqtda bitta elementni — matn, tugma yoki tartibni — o‘zgartiring va qadam konversiyasi qanday o‘zgarishini kuzating.
