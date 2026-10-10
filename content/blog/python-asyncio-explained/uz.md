---
title: Python’da asyncio: async, await va hodisalar sikli
description: asyncio’da korutinlar, hodisalar sikli, tasklar va gather qanday ishlaydi, async qachon tezlashtiradi va bloklovchi chaqiruvlardan qanday qochish kerak.
summary: asyncio bitta oqimga tarmoq yoki diskni kutayotgan ko‘plab kiritish-chiqarish amallarini boshqarish imkonini beradi; CPU hisob-kitoblarini tezlashtirmaydi — u yerda jarayonlar kerak.
---

## Mohiyati bir abzasda

**asyncio** — bitta oqimda ko‘plab kutish amallarini bajarish usuli. Bir so‘rov tarmoqdan javob kutayotganda, **hodisalar sikli** boshqasiga o‘tadi. Kod o‘z-o‘zidan tezlashmaydi — u shunchaki kutishda bekor turishni to‘xtatadi. Shuning uchun asyncio **kiritish-chiqarishda** (HTTP, ma’lumotlar bazalari, soketlar) yutadi va **og‘ir hisob-kitoblarda** hech narsa bermaydi.

## Asosiy tushunchalar

- **Korutin** — `async def` orqali e’lon qilingan funksiya. Uni chaqirish kodni bajarmaydi, balki korutin obyektini yaratadi.
- **`await`** — korutin «men kutyapman, boshqa ish bilan shug‘ullanish mumkin» deydigan nuqta. Almashinuv faqat shunday nuqtalarda bo‘ladi.
- **Hodisalar sikli (event loop)** — qaysi korutinni davom ettirishni hal qiladigan rejalashtiruvchi. `asyncio.run()` orqali ishga tushiriladi.
- **Task** — boshqalar bilan bir vaqtda bajarilishi uchun siklga qo‘yilgan korutin. `asyncio.create_task()` orqali yaratiladi.
- **`gather`** — bir nechta korutinni bir vaqtda ishga tushiradi va barcha natijalarni kutadi.

## Minimal misol

```python
import asyncio

async def fetch(i: int) -> int:
    await asyncio.sleep(1)  # tarmoq so‘rovini imitatsiya qiladi
    return i

async def main() -> None:
    results = await asyncio.gather(*(fetch(i) for i in range(3)))
    print(results)  # [0, 1, 2]

asyncio.run(main())
```

Bir soniyalik uchta «so‘rov» uch emas, taxminan bir soniyada bajariladi: uchala kutish bir vaqtda o‘tadi.

## Tasklar: ishga tushirib, ishni davom ettirish

```python
async def main() -> None:
    task = asyncio.create_task(fetch(1))
    # bu yerda boshqa ish qilish mumkin
    result = await task
```

Yaratilgan taskka havolani saqlang va uni albatta kuting. Havolasi yo‘q task tugashidan oldin axlat yig‘uvchi tomonidan o‘chirilishi mumkin — Python hujjatlari bu haqda to‘g‘ridan-to‘g‘ri ogohlantiradi.

## Async qachon tezlashtiradi va qachon yo‘q

| Ssenariy | asyncio samarasi |
|---|---|
| API’ga ko‘plab HTTP-so‘rovlar | Sezilarli: kutishlar ustma-ust tushadi |
| Telegram-bot, veb-server, websocketlar | Yuqori: bitta oqimda ko‘p ulanish |
| Async-drayver orqali bazaga so‘rovlar | Bor, agar drayver haqiqatan asinxron bo‘lsa |
| Rasmlarni qayta ishlash, ML, katta fayllarni parsing | Yo‘q: CPU band, o‘tadigan joy yo‘q |
| Bitta ketma-ket so‘rov | Yo‘q: parallel kutadigan narsa yo‘q |

CPU-vazifalar uchun **jarayonlardan** (`ProcessPoolExecutor`, `multiprocessing`) foydalaning yoki hisob-kitoblarni alohida servis va navbatlarga chiqaring.

## Asosiy tuzoq: bloklovchi chaqiruvlar

Hodisalar sikli bitta oqimda ishlaydi. Agar korutin ichida **sinxron va uzoq** narsa chaqirilsa, butun ilova to‘xtab qoladi:

- `await asyncio.sleep()` o‘rniga `time.sleep()`;
- asinxron o‘rniga `requests` kabi sinxron HTTP-klientlar;
- sinxron ma’lumotlar bazasi drayverlari;
- to‘g‘ridan-to‘g‘ri handler ichidagi og‘ir hisob-kitoblar.

Agar sinxron kutubxonani almashtirib bo‘lmasa, chaqiruvni alohida oqimga yuboring:

```python
data = await asyncio.to_thread(blocking_function, arg)
```

## Boshqa keng tarqalgan xatolar

- **`await` unutilgan.** Korutin bajarilmaydi, Python «coroutine was never awaited» ogohlantirishini beradi.
- **Cheklanmagan konkurentlik.** Minglab bir vaqtdagi so‘rovlar API limitlariga urilishi yoki ulanishlarni tugatishi mumkin. `asyncio.Semaphore` bilan cheklang.
- **`gather`dagi xatolar.** Standart holatda birinchi istisno darhol uzatiladi. Barcha natijalar kerak bo‘lsa, `return_exceptions=True`dan foydalaning va har birini tekshiring.
- **Ishlayotgan sikl ichida `asyncio.run()` chaqirish.** Korutinlar ichida yangi siklni emas, `await`ni ishlating.

## FAQ

### asyncio — bu ko‘p oqimlilikmi?

Yo‘q. Odatda hammasi bitta oqimda bajariladi, almashinuv esa faqat `await` nuqtalarida bo‘ladi. Bu bir nechta yadroda parallel bajarish emas, **konkurentlik**.

### Mavjud loyihani async’ga qayta yozish kerakmi?

Faqat tor joy kiritish-chiqarishni kutish bo‘lsa va ko‘plab bir vaqtdagi ulanishlarni ushlab turish kerak bo‘lsa. O‘rtacha yuklamali oddiy CRUD-ilova uchun foyda xarajatlarni qoplamasligi mumkin.

### Sinxron va asinxron kodni aralashtirish mumkinmi?

Mumkin, lekin ehtiyotkorlik bilan: korutinlardagi sinxron chaqiruvlarni `asyncio.to_thread` orqali chiqaring, sinxron koddan asinxron kodni esa kirish nuqtasida `asyncio.run` orqali ishga tushiring.
