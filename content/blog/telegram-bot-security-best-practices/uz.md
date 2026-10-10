---
title: Telegram-bot xavfsizligi: tokenlar, webhook va kirish nazorati
description: Telegram-botni production’da qanday himoya qilish: tokenni saqlash va bekor qilish, webhook tekshiruvi, admin huquqlari, kiritma va callback data validatsiyasi.
summary: Tokenni parol kabi saqlang, har bir webhook so‘rovini maxfiy sarlavha orqali tekshiring, huquqlarni serverda user_id bo‘yicha solishtiring va har qanday kiritmani, jumladan callback data’ni ishonchsiz deb hisoblang.
---
## Qisqa javob

Telegram-bot — bu istalgan odam murojaat qila oladigan ochiq kirish nuqtasi. Ko‘pchilik insidentlar beshta joyda yuz beradi:

- **Token** sizib chiqadi va botni boshqa odam boshqaradi.
- **Webhook** Telegram’dan kelmagan so‘rovlarni ham qabul qiladi.
- **Admin buyruqlari** haqiqiy tekshiruv o‘rniga username yoki yashirin tugma bilan himoyalangan.
- **Kiritma va callback data** go‘yo ularni botning o‘zi yaratgandek ishonchli hisoblanadi.
- **Foydalanuvchi ma’lumotlari** keragidan uzoqroq va kengroq saqlanadi.

Shu besh nuqtani yoping — bot ko‘pchilikdan yaxshiroq himoyalangan bo‘ladi.

## Token: saqlash, sizib chiqish va bekor qilish

Token bot ustidan to‘liq nazorat beradi: update’larni o‘qish, xabar yuborish, webhook’ni almashtirish. Unga ma’lumotlar bazasi paroli kabi munosabatda bo‘ling.

- Uni repozitoriyda emas, muhit o‘zgaruvchilarida yoki secrets manager’da saqlang. `.env` faylini `.gitignore` ga qo‘shing va Git-xostingda maxfiy ma’lumotlarni skanerlashni yoqing.
- **Loglarni** kuzating: Bot API URL’larida token bor (`/bot<token>/sendMessage`). Uni HTTP-klientning debug-loglari, xatolik trekerlari va proksi loglari saqlab qolishi mumkin.
- Ishlab chiqish va production uchun **alohida botlar** ishlating, shunda noutbukdagi test token real foydalanuvchilarga yetib bormaydi.

Agar token sizib chiqsa, uni @BotFather’da bekor qiling (`/revoke` buyrug‘i yoki bot sozlamalari). Eski token darhol ishlamay qoladi. So‘ng yangi tokenni deploy qiling, webhook’ni yangi maxfiy kalit bilan qayta o‘rnating va token ochiq bo‘lgan vaqtda bot nimalar yuborganini tekshiring.

## Webhook: so‘rov Telegram’dan kelganiga ishonch hosil qiling

Webhook URL — oddiy HTTPS-endpoint. Agar uni topib olishsa yoki u sizib chiqsa, istalgan odam soxta update yuborishi mumkin, masalan «to‘lov» yoki «admin»dan xabar.

`setWebhook` chaqirilganda `secret_token` ni uzating. Telegram uni har bir so‘rovga `X-Telegram-Bot-Api-Secret-Token` sarlavhasida qo‘shadi, serveringiz esa qiymati mos kelmagan hamma narsani rad etadi.

```python
import hmac

def is_from_telegram(headers: dict, expected: str) -> bool:
    received = headers.get("X-Telegram-Bot-Api-Secret-Token", "")
    return hmac.compare_digest(received, expected)
```

Yana nima qilish kerak:

- `/webhook` o‘rniga topish qiyin bo‘lgan yo‘l ishlating, lekin faqat shunga tayanmang.
- Tez javob bering, og‘ir ishni navbatga chiqaring, shunda sekin so‘rovlar qayta yetkazishlarga aylanmaydi.
- Telegram IP-diapazonlari bo‘yicha filtr — qo‘shimcha qatlam; diapazonlar o‘zgarishi mumkin, shuning uchun asosiy tekshiruv maxfiy sarlavha bo‘lib qoladi.

Parametrlar tafsilotlari — [setWebhook hujjatlarida](https://core.telegram.org/bots/api#setwebhook).

## Admin funksiyalariga kirish nazorati

Ko‘p uchraydigan xatolar: `username` bo‘yicha tekshirish (uni o‘zgartirish yoki boshqa odam egallashi mumkin), tugma yashirilgan, lekin buyruq ochiq qolgan, xabar kelgan chatga ishonish.

To‘g‘ri yo‘l:

- **user_id** ni konfig yoki bazadagi ruxsat etilganlar ro‘yxati bilan solishtiring — faqat «kirish» buyrug‘ida emas, har bir admin handler’ida.
- Tekshiruvni bitta joyda saqlang: butun admin router’iga qo‘llanadigan filtr yoki middleware.
- Guruhlarda huquqlarni abadiy keshlamang, joriy holatni `getChatMember` orqali so‘rang. **Anonim adminlarni** unutmang: ularning xabarlari guruh nomidan keladi va `from_user` — haqiqiy odam emas.
- Admin harakatlarini log qiling: kim, nima va qachon qilgan.

## Kiritma va callback data validatsiyasi

Foydalanuvchi yuboradigan hamma narsa ishonchsiz: matn, fayllar, kontaktlar, geolokatsiya. Ishlatishdan oldin uzunlik, format va diapazonlarni tekshiring.

- SQL uchun faqat parametrlangan so‘rovlar, satrlarni qo‘shib yasash yo‘q.
- Foydalanuvchi matnini `parse_mode` HTML yoki MarkdownV2 bilan yuborishdan oldin ekranlang, aks holda belgilash buziladi yoki soxta havola paydo bo‘ladi.
- Fayllarning turi va hajmini qayta ishlashdan oldin tekshiring; yuklab olingan fayllarni ishga tushirmang.
- Har bir foydalanuvchi uchun so‘rovlar chastotasini cheklang, shunda bitta akkaunt botni yoki pullik tashqi API’ni ortiqcha yuklay olmaydi.

**Callback data** alohida e’tibor talab qiladi. Bu klient orqali o‘tadigan 64 baytgacha ma’lumot, shuning uchun uni soxtalashtirish mumkin deb hisoblash xavfsizroq. `order:delete:1542` tugmasi 1542-buyurtma aynan shu foydalanuvchiga tegishli ekanini isbotlamaydi.

- Har bir callback’da serverda obyekt foydalanuvchiga tegishli ekanini va amal uning joriy holatida ruxsat etilganini tekshiring.
- Muhim amallar uchun kontekstni serverda saqlang, callback’ga esa faqat tasodifiy qisqa identifikator qo‘ying.
- Amallarni idempotent qiling: qayta bosish pulni ikki marta yechmasligi yoki yozuvni ikki marta yaratmasligi kerak.

## Foydalanuvchi ma’lumotlarini saqlash

- **Minimumni** yig‘ing: user_id yetarli bo‘lsa, telefon raqamini so‘ramang.
- Saqlash muddatlarini belgilang: eski FSM holatlari, loglar va dialog tarixini o‘chiring. Redis’da TTL qo‘ying.
- Redis va bazani internetdan yoping, parollar va shifrlangan zaxira nusxalardan foydalaning.
- Shaxsiy ma’lumotlar va tokenlarni loglarga yozmang.
- Mahalliy shaxsiy ma’lumotlar qonunchiligini tekshiring: bir qator mamlakatlarda, jumladan O‘zbekiston va Rossiyada ma’lumotlarni lokalizatsiya qilish talablari bor.

## FAQ

### Maxfiy sarlavhasiz faqat maxfiy webhook URL yetarlimi?

Yo‘q. URL’lar loglar, proksi va sozlamalar skrinshotlari orqali sizib chiqadi. Maxfiy sarlavha bir necha daqiqada qo‘shiladi va oddiy qoida beradi: sarlavha yo‘q — qayta ishlash yo‘q.

### Callback aynan mening tugmamdan kelganiga ishonsa bo‘ladimi?

Yo‘q deb hisoblagan ma’qul. Klientdan kelgan har qanday qiymat tekshirilishi kerak bo‘lgan kiritmadir. Ma’lumotni o‘zgartiradigan har bir amal uchun obyekt egasi va holatini serverda solishtiring.

### Token sizib chiqsa, birinchi navbatda nima qilish kerak?

Uni @BotFather’da bekor qilish, yangi tokenni deploy qilish, webhook’ni yangi maxfiy kalit bilan qayta o‘rnatish va sizib chiqish manbasini topish: repozitoriy, loglar yoki yozishmalar.
