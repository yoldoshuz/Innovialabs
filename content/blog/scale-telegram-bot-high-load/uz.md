---
title: Telegram botni yuqori yuklamaga qanday moslashtirish mumkin
description: Yuqori yuklama uchun Telegram bot arxitekturasi: webhook va vazifalar navbati, Redis da holat, idempotent ishlov berish, gorizontal masshtablash va limitlar.
summary: Yangilanishlarni webhook orqali qabul qilib, darhol navbatga qo‘ying, ularni holati Redis da saqlanadigan stateless workerlar bilan qayta ishlang, update_id bo‘yicha takrorlardan himoyalaning, chiquvchi xabarlarni esa umumiy rate limiter orqali o‘tkazing.
---
## Arxitektura bir xatboshida

Yuklama ostidagi bot — bitta jarayon emas, balki konveyer:

1. **Webhook qabul qiluvchi** yangilanishni (update) oladi, maxfiy kalitni tekshiradi va navbatga qo‘yadi. Telegram ga javob darhol qaytadi.
2. **Vazifalar navbati** (Redis Streams, RabbitMQ, Kafka, Celery, arq va h.k.) cho‘qqi yuklamalarni buferlaydi.
3. O‘z holatiga ega bo‘lmagan **workerlar** yangilanishlarni qayta ishlaydi. Ularni kerakli miqdorda ishga tushirish mumkin.
4. **Redis** FSM holatlari, kesh, bloklashlar va limit hisoblagichlarini saqlaydi.
5. **Jo‘natuvchi** chiquvchi xabarlarni Telegram limitlarini hisobga olib yuboradi.

## Nega long polling emas, webhook

**Long polling** (`getUpdates`) ni gorizontal masshtablab bo‘lmaydi: bir vaqtda faqat bitta iste’molchi yangilanishlarni olishi mumkin, ikkinchisi konflikt xatosini oladi. Yuqori yuklama uchun **webhook** kerak:

- Telegram yangilanishlarni o‘zi HTTPS manzilga yuboradi;
- balanslovchi ortida bir nechta qabul qiluvchi qo‘yish mumkin;
- `setWebhook` dagi `max_connections` parametri Telegram dan keladigan parallel ulanishlar sonini cheklaydi;
- `setWebhook` dagi `secret_token` `X-Telegram-Bot-Api-Secret-Token` sarlavhasini tekshirib, begona so‘rovlarni rad etish imkonini beradi.

Qabul qiluvchi **tez javob berishi** kerak. Agar ishlov berish so‘rov ichida bo‘lib, sekinlashsa, Telegram navbat to‘playdi va yetkazishni takrorlaydi, foydalanuvchilar esa kechikishni ko‘radi.

## Chat ichidagi yangilanishlar tartibi

Parallel ishlov berish tartibni buzadi: foydalanuvchining ikkinchi xabari birinchisidan oldin qayta ishlanishi va FSM noto‘g‘ri holatga o‘tishi mumkin.

Yechimlar:

- **`chat_id` bo‘yicha partitsiyalash**: bitta chatning yangilanishlari doim bitta partitsiya yoki navbatga tushadi va ketma-ket qayta ishlanadi;
- ishlov berish vaqtida Redis da **chat bo‘yicha bloklash**;
- turli chatlar esa parallel qayta ishlanadi.

## Idempotentlik

Yangilanish ikki marta kelishi mumkin: Telegram xato yoki taymautda yetkazishni takrorlaydi, navbat esa worker yiqilgandan keyin vazifani qaytaradi. Himoya:

```python
# update_id ni qayta ishlangan deb belgilaymiz; kalit bir sutka yashaydi
is_new = await redis.set(f"upd:{update.update_id}", 1, nx=True, ex=86400)
if not is_new:
    return  # dubl, o‘tkazib yuboramiz
```

Ammo worker ishlov berish o‘rtasida yiqilsa, bu yetarli emas. Shuning uchun **yon ta’sirlarni** ham idempotent qiling:

- buyurtma yaratish — unikal kalit bilan (`update_id` yoki `callback_query.id`);
- balansdan yechish — operatsiya hali o‘tkazilmaganini tekshiradigan tranzaksiyada;
- xabar yuborish — qayta urinishdan oldin «allaqachon yuborilgan» yozuvi bilan.

## Holat Redis da

Agar FSM jarayon xotirasida saqlansa, ikkinchi worker bu haqda bilmaydi. Barcha holatni tashqariga chiqaring:

- **FSM va dialog ma’lumotlari** — Redis da (aiogram da bu `RedisStorage`), tashlab ketilgan dialoglar uchun TTL bilan;
- **uzoq muddatli ma’lumotlar** (foydalanuvchilar, buyurtmalar) — asosiy bazada;
- **ma’lumotnomalar keshi** — har bir xabarda bazaga murojaat qilmaslik uchun Redis da.

Shunda istalgan worker istalgan yangilanishni qayta ishlay oladi, qayta ishga tushirish esa hech narsani yo‘qotmaydi.

## Gorizontal masshtablash

- Qabul qiluvchilar va workerlar — **stateless konteynerlar**, navbat uzunligi yoki CPU bo‘yicha masshtablanadi.
- Turli vazifa turlari uchun alohida navbatlar: **interaktiv** (foydalanuvchilarga javoblar) va **fon** (rassilkalar, hisobotlar, fayllarni qayta ishlash). Rassilka javoblarni sekinlashtirmasligi kerak.
- Og‘ir operatsiyalar (PDF yaratish, sun’iy intellekt chaqiruvlari, media) — taymautli alohida worker pulida.
- Ko‘pincha botdan oldin ma’lumotlar bazasi tor joyga aylanadi: ulanishlar puli, indekslar, o‘qish uchun replikalar.

## Chiquvchi xabarlarga Telegram limitlari

Telegram yuborish chastotasini cheklaydi. Rasmiy FAQ dagi mo‘ljallar: bitta chatga soniyasiga bittadan ko‘p bo‘lmagan xabar, guruhga daqiqasiga 20 tadan ko‘p bo‘lmagan xabar va ommaviy rassilkada soniyasiga taxminan 30 ta xabar. Limitlar o‘zgarishi mumkin, shuning uchun hujjatlarni tekshirib turing.

Amalda nima qilish kerak:

- Redis da **umumiy rate limiter** (token bucket) — workerlar ko‘p bo‘lganda har biridagi lokal hisoblagich ishlamaydi;
- bir vaqtda **chat bo‘yicha** va **global** limit;
- `429` javobida `retry_after` ni o‘qing va vazifani darhol takrorlamasdan, keyinga suring;
- rassilkalarni progressni saqlaydigan navbat orqali yuriting, shunda nosozlikdan keyin boshidan emas, to‘xtagan joydan davom etasiz;
- juda katta rassilkalar uchun Telegram da Stars bilan to‘lanadigan `allow_paid_broadcast` rejimi bor.

## Kuzatuvchanlik

- `getWebhookInfo`: kechikishlarda birinchi qaraladigan narsa — `pending_update_count` va `last_error_message`.
- Metrikalar: navbat uzunligi, ishlov berish vaqti, xatolar ulushi, `429` javoblar soni.
- Bitta yangilanishni butun tizim bo‘ylab kuzatish uchun `update_id` va `chat_id` bilan loglar.

## FAQ

### Navbatga qachon o‘tish kerak?

Yangilanishga ishlov berish sezilarli vaqt olsa, tashqi chaqiruvlar (to‘lov, sun’iy intellekt, CRM) paydo bo‘lsa yoki rassilkalar kerak bo‘lsa. Bot oddiy va bir zumda javob bersa, webhook va bir nechta jarayon yetarli.

### Long polling bilan botning bir nechta nusxasini ishga tushirish mumkinmi?

Yo‘q. `getUpdates` orqali bir vaqtda faqat bitta jarayon yangilanish olishi mumkin. Bir nechta nusxa uchun webhook ga o‘ting.

### Server ishlamay qolsa nima bo‘ladi?

Telegram yetkazilmagan yangilanishlarni cheklangan vaqt saqlaydi va webhook ga yetkazishni takrorlaydi. Tiklangandan keyin ular keladi, shuning uchun idempotentlik va yangilanishlar yangiligini tekshirish ayniqsa muhim.
