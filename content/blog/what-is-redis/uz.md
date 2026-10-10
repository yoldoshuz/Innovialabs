---
title: Redis nima va u nega shunchalik tez
description: Redis oddiy tilda: xotiradagi kalit-qiymat modeli, ma’lumotlar tuzilmalari, diskka saqlash variantlari, RAMda saqlash cheklovlari va odatiy vazifalar.
summary: Redis — barcha ma’lumotlarni operativ xotirada saqlaydigan kalit-qiymat ombori, shuning uchun u juda tez javob beradi. Undan muhim ma’lumotlar uchun yagona baza sifatida emas, kesh, sessiyalar, navbatlar, hisoblagichlar va reytinglar uchun foydalaniladi.
---

## Redis haqida qisqacha

**Redis** — hamma narsani **operativ xotirada** saqlaydigan **kalit-qiymat** formatidagi ma’lumotlar ombori. Siz qiymatni kalit ostida saqlaysiz, masalan `session:42`, keyin uni shu kalit bo‘yicha bir zumda olasiz.

Odatda Redis asosiy bazani almashtirmaydi, uning yonida ishlaydi: PostgreSQL yoki MySQL ishonchli ma’lumotlarni saqlaydi, Redis esa tez-tez so‘raladigan yoki juda tez ishlashi kerak bo‘lgan narsalarni tezlashtiradi.

## Redis nega shunchalik tez

- **Ma’lumotlar xotirada.** RAMdan o‘qish diskdan o‘qishdan bir necha tartib tezroq. Bu asosiy sabab.
- **Oddiy amallar.** Murakkab so‘rov rejalashtiruvchisi va JOIN yo‘q: buyruq ma’lumot qayerdaligini aniq biladi, aksariyat amallarning murakkabligi oldindan ma’lum.
- **Buyruqlarni bir oqimda bajarish.** Buyruqlar navbat bilan bajariladi, shuning uchun bloklashlar kerak emas va har bir buyruq atomar. Tarmoq kiritish-chiqarishi esa har bir mijozni kutmasdan samarali qayta ishlanadi.
- **Yengil protokol** va tuzilmalarning optimallashtirilgan ichki ko‘rinishi.

Bir oqimlilikning teskari tomoni: bitta sekin buyruq, masalan `KEYS *` orqali barcha kalitlarni ko‘rib chiqish, qolgan barcha mijozlarni kutishga majbur qiladi.

## Ma’lumotlar tuzilmalari

Redisdagi qiymat faqat satr emas. Aynan shu uni universal vositaga aylantiradi.

| Tur | Nima u | Odatiy vazifa |
|-----|--------|---------------|
| Strings | Satr yoki son | Sahifa keshi, ko‘rishlar hisoblagichi |
| Hashes | Kalit ichidagi maydonlar to‘plami | Foydalanuvchi profili, savat |
| Lists | Tartiblangan ro‘yxat | Oddiy vazifalar navbati, hodisalar lentasi |
| Sets | Noyob qiymatlar to‘plami | Noyob tashrifchilar, teglar |
| Sorted sets | Sonli reytingli to‘plam | Liderlar jadvali, top mahsulotlar |

Misol uchun bir nechta buyruq:

```bash
SET page:home "<html>..." EX 300   # 5 daqiqalik kesh
GET page:home
INCR views:article:15              # atomar hisoblagich
HSET user:42 name "Aliya" city "Tashkent"
LPUSH queue:emails "order-1001"
SADD visitors:2026-03-01 "user:42"
ZADD leaderboard 1500 "player:7"
ZRANGE leaderboard 0 -1 WITHSCORES
```

**`EX`** parametri kalitning yashash vaqtini (TTL) belgilaydi: muddati tugagach Redis kalitni o‘zi o‘chiradi. Kesh va sessiyalar uchun bu asosiy mexanizm.

## Diskka saqlash

Redis xotirada ishlasa ham, qayta ishga tushishdan omon qolish uchun ma’lumotlarni saqlay oladi:

- **RDB (suratlar).** Vaqti-vaqti bilan butun bazani faylga saqlaydi. Ixcham va tez tiklanadi, lekin nosozlikda oxirgi suratdan keyingi o‘zgarishlar yo‘qoladi.
- **AOF (buyruqlar jurnali).** Har bir o‘zgartirish amalini yozib boradi. Yo‘qotish kamroq, diskka yozish chastotasini sozlash mumkin, ammo fayl kattaroq.
- **RDB va AOF birga** — ma’lumotlarni saqlash kerak bo‘lganda keng tarqalgan tanlov.
- **Saqlashsiz** — har doim asosiy bazadan tiklash mumkin bo‘lgan sof kesh uchun.

## RAMda saqlash cheklovlari

- **Hajm.** Barcha ma’lumotlar server xotirasiga sig‘ishi kerak, xotira esa diskdan qimmatroq.
- **To‘lib qolish.** `maxmemory` limitiga yetilganda Redis tanlangan **siqib chiqarish siyosati** bo‘yicha ish tutadi: masalan, uzoq vaqt ishlatilmagan kalitlarni o‘chiradi yoki yozishni rad etadi. Kesh uchun bu normal, muhim ma’lumotlar uchun esa xavfli.
- **Ma’lumot yo‘qotish xavfi.** Diskka saqlash bilan ham nosozlikda sozlamalarga qarab oxirgi o‘zgarishlar yo‘qolishi mumkin.
- **Murakkab so‘rovlar yo‘q.** Redis «Toshkentdagi 30 yoshdan katta barcha foydalanuvchilar»ni SQL kabi qidira olmaydi.

## Odatiy ssenariylar

- Baza va API javoblarini keshlash.
- Foydalanuvchi sessiyalari va tokenlar.
- So‘rovlar chastotasini cheklash (rate limiting).
- Fon vazifalari navbatlari.
- Hisoblagichlar, reytinglar, onlayn holatlar.
- Servislar o‘rtasida oddiy bildirishnomalar uchun Pub/Sub.

## Keng tarqalgan xatolar

- Muhim ma’lumotlarning yagona nusxasini saqlash sozlanmagan Redisda ushlash.
- Kesh kalitlariga TTL bermaslik — xotira asta-sekin to‘lib boradi.
- Ishchi serverda `SCAN` o‘rniga `KEYS *` ishlatish.
- Redisni parolsiz va tarmoq cheklovlarisiz internetga ochiq qoldirish.

## FAQ

### Redisdan asosiy ma’lumotlar bazasi sifatida foydalanish mumkinmi?

Texnik jihatdan mumkin, lekin aksariyat loyihalar uchun bu xavfli: hajm xotira bilan cheklangan, murakkab so‘rovlar yo‘q, ishonchlilik esa saqlash sozlamalariga bog‘liq. Odatda Redis relyatsion bazani to‘ldiradi.

### Redis Memcacheddan nimasi bilan farq qiladi?

Ikkalasi ham kesh uchun tezkor xotiradagi omborlar. Memcached soddaroq va faqat satrlar bilan ishlaydi. Redis turli ma’lumotlar tuzilmalari, diskka saqlash, replikatsiya va Pub/Subni qo‘llab-quvvatlaydi, shuning uchun kengroq qo‘llanadi.

### Redisga qancha xotira kerak?

Kalitlar soni va qiymatlar hajmiga bog‘liq. Ma’lumotlar hajmini baholang, xizmat tuzilmalari va o‘sish uchun zaxira qo‘shing, so‘ng `maxmemory` va siqib chiqarish siyosatini sozlang. Haqiqiy sarfni `INFO memory` buyrug‘i bilan kuzatish qulay.
