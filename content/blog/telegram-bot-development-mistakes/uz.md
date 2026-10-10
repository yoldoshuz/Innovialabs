---
title: Telegram-bot yaratishdagi ko‘p uchraydigan xatolar va ularning yechimi
description: Telegram-botlardagi UX, texnik va biznes xatolari: boshi berk menyular, yo‘qolgan holat, koddagi token, admin panel yo‘qligi va ularni tuzatish.
summary: Botlardagi muammolarning aksariyati — boshi berk menyular, jarayon xotirasidagi holat, koddagi token, xatolarni qayta ishlash va admin panelning yo‘qligi; ular har bir ekrandagi «Orqaga» tugmasi, holatlar uchun Redis yoki baza, muhit o‘zgaruvchilaridagi sirlar, umumiy xato ishlovchisi va oddiy boshqaruv paneli bilan hal qilinadi.
---
## Qisqa javob

Botlardagi xatolar uch guruhga bo‘linadi:

- **UX** — foydalanuvchi qotib qoladi, keyin nima qilishni tushunmaydi yoki tugma javobini kutadi;
- **texnik** — bot ma’lumotni yo‘qotadi, limitlardan yiqiladi yoki tokenini oshkor qiladi;
- **biznes** — egasi dasturchisiz hech narsani o‘zgartira olmaydi va natijalarni ko‘rmaydi.

Quyida eng ko‘p uchraydigan xatolar va ularni tuzatish usullari.

## UX xatolari

| Xato | Qanday tuzatish kerak |
|---|---|
| Boshi berk menyular: bo‘limdan qaytib bo‘lmaydi | har bir ekranda «Orqaga» va «Menyuga» tugmalari, `/start` doim bosh ekranga qaytaradi |
| Bot kutilmagan matn yoki stikerga jim | maslahat va asosiy harakat tugmalari bilan umumiy «tushunmadim» ishlovchisi |
| Bosilgandan keyin tugma «aylanib» turadi | matnsiz bo‘lsa ham doim `answerCallbackQuery` ni chaqiring |
| Har bir bosish yangi xabar yuboradi | navigatsiya uchun joriy xabarni `editMessageText` orqali tahrirlang |
| Anketadan chiqib bo‘lmaydi | ssenariyning istalgan qadamida «Bekor qilish» tugmasi va `/cancel` buyrug‘i |
| Juda uzun matnlar | qisqa xabarlar, bir ekranga bitta harakat, tafsilotlar — tugma orqali |

## Texnik xatolar

**Holat xotirada.** Anketa qadamlari va savat operativ xotirada saqlansa, deploy yoki nosozlikdan keyin foydalanuvchilar hammasini qaytadan boshlaydi. Holatni Redis yoki bazada saqlang:

```python
import os
from aiogram import Dispatcher
from aiogram.fsm.storage.redis import RedisStorage

storage = RedisStorage.from_url(os.environ["REDIS_URL"])
dp = Dispatcher(storage=storage)
```

**Token kod ichida.** Repozitoriydagi token kodni ko‘rgan har kimga bot ustidan to‘liq nazorat beradi. Uni muhit o‘zgaruvchilarida yoki sirlar menejerida saqlang, `.env` ni esa `.gitignore` ga qo‘shing. Token oshkor bo‘lsa, BotFather’da `/revoke` buyrug‘i bilan uni qayta chiqaring.

**Polling’da botning ikki nusxasi.** Bir vaqtda `getUpdates` ni chaqirayotgan ikki jarayon ziddiyat xatosini oladi va update’larni yo‘qotadi. Production’da webhook’dan foydalaning yoki yagona nusxani kafolatlang. Webhook va `getUpdates` bir vaqtda ishlamaydi.

**Xatolar va limitlarni qayta ishlash yo‘q.** Bitta istisno ssenariyni jimgina buzmasligi kerak. Umumiy ishlovchini ulang, yuborishda esa `429` (`retry_after` ni kuting) va `403` (foydalanuvchi botni bloklagan) javoblarini hisobga oling:

```python
from aiogram.types import ErrorEvent

@dp.errors()
async def on_error(event: ErrorEvent):
    logger.exception("Update failed: %s", event.update.update_id, exc_info=event.exception)
```

**Asinxron botda bloklovchi kod.** Handler ichidagi sinxron baza drayveri yoki og‘ir hisob-kitob barcha foydalanuvchilarni sekinlashtiradi. Asinxron drayverlardan foydalaning, uzoq vazifalarni navbatga chiqaring.

**Takroriy qayta ishlash.** Nosozliklarda Telegram update’ni qayta yuborishi mumkin. Pul va buyurtmalar bilan bog‘liq amallarni **idempotent** qiling — bu to‘lov yoki ariza allaqachon qayta ishlanganini tekshiring.

**Loglar va ogohlantirishlar yo‘q.** Loglarni foydalanuvchi va update ID’si bilan yozing, jiddiy xatolarni esa xizmat chatiga yuboring.

## Biznes xatolari

- **Admin panel yo‘q.** Narx, matnni o‘zgartirish yoki xabar tarqatish uchun har safar dasturchi kerak. Minimum: matnlar va katalogni tahrirlash, segmentlar bo‘yicha tarqatish, arizalarni eksport qilish, oddiy statistika, xodimlar uchun rollar.
- **Tirik odam bilan aloqa yo‘q.** Murakkab savol menyuga borib taqaladi. Ish chatiga yoki CRM’ga uzatuvchi «Menejerga yozish» tugmasini qo‘shing.
- **Analitika yo‘q.** «Kirdi — tanladi — to‘ladi» hodisalarisiz bot ishlayaptimi yoki yo‘qmi, tushunib bo‘lmaydi. Asosiy harakatlarni birinchi kundan yozib boring.
- **Qoidalarsiz shaxsiy ma’lumotlar.** Bot telefon va manzillarni yig‘sa, foydalanuvchi roziligi, ma’lumotlarni qayta ishlash siyosati va xodimlar uchun cheklangan kirish kerak.

## Ishga tushirishdan oldingi chek-list

- har bir ekranda orqaga qaytish yo‘li bor;
- holatlar qayta ishga tushishdan keyin saqlanadi;
- token va kalitlar repozitoriyga tushmaydi;
- umumiy xato ishlovchisi va ogohlantirishlar bor;
- egasi matnlarni o‘zi o‘zgartira oladi va xabar tarqata oladi;
- asosiy harakatlar analitikaga yoziladi.

## FAQ

### Production uchun polling yoki webhook?

Kichik bot uchun bitta serverdagi polling yaxshi ishlaydi. Bir nechta nusxa va bulutli infratuzilmada webhook qulayroq, lekin u HTTPS-manzil talab qiladi.

### Token ochiq repozitoriyga tushib qolgan bo‘lsa nima qilish kerak?

Darhol BotFather’da tokenni qayta chiqaring, uni muhit o‘zgaruvchilarida yangilang va repozitoriy tarixidan o‘chiring. Qayta chiqarilgandan keyin eski token ishlashni to‘xtatadi.

### Kichik botga admin panel kerakmi?

Ha, hech bo‘lmaganda minimal: asosiy matnlarni tahrirlash va arizalarni eksport qilish. Aks holda har bir mayda o‘zgarish dasturchi uchun vazifaga aylanadi.
