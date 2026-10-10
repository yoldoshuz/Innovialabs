---
title: Redis amalda: kesh, sessiyalar, navbatlar va so‘rov limitlari
description: Kod bilan amaliy Redis patternlari: TTL bilan cache-aside, sessiyalar, oddiy navbatlar, pub/sub, reytinglar, so‘rovlarni cheklash va siqib chiqarish siyosati.
summary: Redis — tez va qisqa muddatli ma’lumotlar uchun xotiradagi ombor: TTL bilan kesh, sessiyalar, yengil navbatlar, pub/sub, reytinglar va so‘rov limitlari, haqiqat manbai esa asosiy bazada qoladi.
---

## Redis nima uchun yaxshi

**Redis** ma’lumotlarni operativ xotirada saqlaydi va mikro- yoki millisekundlarda javob beradi. Shuning uchun u juda tez-tez o‘qiladigan, qisqa yashaydigan yoki tez hisoblanishi kerak bo‘lgan ma’lumotlar uchun ideal. U asosiy bazaning o‘rnini bosmaydi: Redis’dagi ma’lumotlarning ko‘pchiligini yo‘qotish va qayta tiklash mumkin bo‘lgan ma’lumot deb hisoblang.

Quyidagi misollar — `redis-cli` buyruqlari; Node.js, Python, Go va PHP uchun klient kutubxonalari xuddi shu buyruqlarni beradi.

## TTL bilan cache-aside

Ilova avval keshga qaraydi, topilmasa bazadan o‘qiydi va natijani yashash muddati bilan saqlaydi.

```python
import json

def get_product(product_id):
    key = f"product:{product_id}"
    cached = redis.get(key)
    if cached:
        return json.loads(cached)
    product = db.fetch_product(product_id)
    redis.set(key, json.dumps(product), ex=300)  # TTL 5 daqiqa
    return product

def update_product(product_id, data):
    db.update_product(product_id, data)
    redis.delete(f"product:{product_id}")  # invalidatsiya
```

Xatolardan saqlaydigan qoidalar:

- **Doim TTL belgilang** — invalidatsiya ishlamasa ham eskirgan ma’lumot o‘chib ketadi.
- **Yangilashda kalitni o‘chiring**, koddagi turli joylardan yangi qiymat yozmang.
- TTL’ga kichik tasodifiy farq qo‘shing, shunda minglab kalitlar bir vaqtda muddati tugamaydi.

## Sessiyalarni saqlash

Sessiyalar Redis’ga juda mos: ular kichik, har bir so‘rovda o‘qiladi va muddati tugashi kerak.

```bash
SET session:9f2c... '{"userId":42,"role":"admin"}' EX 86400
GET session:9f2c...
EXPIRE session:9f2c... 86400   # faollikda muddatni uzaytirish
DEL session:9f2c...            # akkauntdan chiqish
```

Ko‘pchilik veb-freymvorklarda Redis uchun tayyor sessiya adapteri bor. Bir nechta ilova serveri umumiy sessiyalardan foydalanadi va loyihani gorizontal masshtablash mumkin bo‘ladi.

## Oddiy navbatlar

Ro‘yxat oddiy vazifalar navbati sifatida ishlaydi: prodyuserlar vazifa qo‘shadi, vorkerlar ularni kutadi.

```bash
LPUSH queue:emails '{"to":"user@example.com","template":"welcome"}'
BRPOP queue:emails 0   # vorker vazifa paydo bo‘lishini kutadi
```

Zaif tomoni: vorker vazifani olgandan keyin ishdan chiqsa, vazifa yo‘qoladi. Ishonchli qayta ishlash uchun iste’molchi guruhlari bilan **Redis Streams** (`XADD`, `XREADGROUP`, `XACK`) yoki Redis ustidagi sinalgan kutubxonadan — BullMQ, Sidekiq, Celery — foydalaning.

## Pub/sub

Pub/sub xabarlarni ayni paytda obuna bo‘lgan hammaga yuboradi.

```bash
SUBSCRIBE orders:new
PUBLISH orders:new '{"orderId":1001}'
```

Xabarlar **saqlanmaydi**: oflayn bo‘lgan obunachi ularni o‘tkazib yuboradi. Pub/sub jonli bildirishnomalar va serverlar orasida keshni invalidatsiya qilish uchun mos, yetkazib berish muhim bo‘lsa — Streams.

## Reytinglar

Sorted set elementlarni ballar bo‘yicha tartiblangan holda saqlaydi.

```bash
ZINCRBY leaderboard:weekly 50 user:42
ZREVRANGE leaderboard:weekly 0 9 WITHSCORES   # top-10
ZREVRANK leaderboard:weekly user:42           # foydalanuvchi o‘rni
```

## So‘rovlarni cheklash

Qat’iy oynali hisoblagich — eng oddiy limiter: kalit bo‘yicha bir daqiqadagi so‘rovlarni sanaymiz.

```python
import time

def allow(user_id, limit=60):
    key = f"rate:{user_id}:{int(time.time() // 60)}"
    count = redis.incr(key)
    if count == 1:
        redis.expire(key, 60)
    return count <= limit
```

Qat’iy oyna chegaralarda keskin sakrashlarga yo‘l qo‘yadi. Tekisroq limit uchun sorted set’dagi sirpanuvchi oyna yoki Lua skriptidagi token bucket’dan foydalaning — shunda tekshirish va yangilash atomar bajariladi.

## Siqib chiqarish siyosatlari

Redis `maxmemory`’ga yetganda xatti-harakatni `maxmemory-policy` sozlamasi belgilaydi.

| Siyosat | Xatti-harakat | Qachon ishlatiladi |
|---|---|---|
| `noeviction` | To‘lganda yozishni rad etadi | Navbatlar, yo‘qotib bo‘lmaydigan ma’lumotlar |
| `allkeys-lru` | Uzoq vaqt ishlatilmagan kalitlarni o‘chiradi | Sof kesh |
| `allkeys-lfu` | Kam ishlatiladigan kalitlarni o‘chiradi | Barqaror «issiq» kalitli kesh |
| `volatile-lru` | Faqat TTL’li kalitlarni o‘chiradi | Kesh va doimiy ma’lumotlar aralashmasi |
| `volatile-ttl` | Muddati tez tugaydigan kalitlarni o‘chiradi | Ma’noli TTL’li aralash yuklama |

Keng tarqalgan yondashuv — **alohida Redis nusxalari**: kesh uchun (`allkeys-lru`) hamda navbatlar yoki sessiyalar uchun (`noeviction`, persistentlik yoqilgan).

## FAQ

### Redis ma’lumotlarni yo‘qotishi mumkinmi?

Ha, persistentlik o‘chirilgan bo‘lsa yoki snapshotlar orasida. Redis’da RDB snapshotlari va AOF jurnali bor — ma’lumot muhim joyda ularni yoqing, lekin haqiqat manbaini baribir asosiy bazada saqlang.

### Redis’ga qancha xotira kerak?

Kalitlar soni, qiymatlar hajmi va ma’lumot tuzilmalariga bog‘liq. Real ma’lumotlarda `INFO memory` va `MEMORY USAGE key` orqali o‘lchang hamda cho‘qqilar va fonda saqlash uchun zaxira qoldiring.

### Kichik loyihaga Redis kerakmi?

Boshida ko‘pincha yo‘q. Takrorlanuvchi sekin so‘rovlarni ko‘rganingizda, bir nechta serverda umumiy sessiyalar, so‘rov limitlari yoki fon vazifalari kerak bo‘lganda qo‘shing.
