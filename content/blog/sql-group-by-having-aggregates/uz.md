---
title: SQL’da GROUP BY, HAVING va agregat funksiyalar
description: SQL’da COUNT, SUM, AVG, MIN va MAX bilan savdo hisobotlarini tuzish, WHERE va HAVING farqi, sanalar bo‘yicha guruhlash va ko‘p uchraydigan xatolar.
summary: GROUP BY qatorlarni guruhlarga yig‘adi, agregat funksiyalar har bir guruh uchun bitta qiymat hisoblaydi, WHERE qatorlarni guruhlashdan oldin, HAVING esa tayyor guruhlarni filtrlaydi.
---

## Qisqa javob

- **GROUP BY** bir xil qiymatli qatorlarni guruhlarga birlashtiradi.
- **Agregat funksiyalar** (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`) har bir guruh uchun bitta qiymat qaytaradi.
- **WHERE** qatorlarni guruhlashdan oldin olib tashlaydi.
- **HAVING** guruhlarni hisoblangandan keyin olib tashlaydi.

```sql
SELECT city, COUNT(*) AS orders, SUM(total) AS revenue
FROM orders
WHERE status = 'paid'
GROUP BY city
HAVING SUM(total) > 1000000
ORDER BY revenue DESC;
```

Bu shunday o‘qiladi: to‘langan buyurtmalarni olish, shahar bo‘yicha guruhlash, soni va tushumni hisoblash, tushumi milliondan oshgan shaharlarni qoldirish.

## Savdo misolida beshta agregat funksiya

`orders(id, customer_id, city, total, status, created_at)` jadvali.

```sql
SELECT
  COUNT(*)                     AS orders_count,
  COUNT(DISTINCT customer_id)  AS customers,
  SUM(total)                   AS revenue,
  AVG(total)                   AS avg_check,
  MIN(total)                   AS min_order,
  MAX(total)                   AS max_order
FROM orders
WHERE status = 'paid';
```

`GROUP BY`siz butun tanlov bitta guruh hisoblanadi va umumiy raqamlar bilan bitta qator olasiz. `GROUP BY city` qo‘shsangiz, har bir shahar uchun shunday qator chiqadi.

Muhim jihatlar:

- `COUNT(*)` barcha qatorlarni sanaydi, `COUNT(column)` esa faqat qiymati **NULL bo‘lmagan** qatorlarni.
- `SUM`, `AVG`, `MIN`, `MAX` **NULL’ni hisobga olmaydi**. Bo‘shliqlari bor ustun bo‘yicha `AVG` faqat to‘ldirilgan qiymatlar o‘rtachasini hisoblaydi.
- Bo‘sh to‘plam bo‘yicha `SUM` 0 emas, `NULL` qaytaradi. `COALESCE(SUM(total), 0)` ishlating.

## WHERE yoki HAVING

| | WHERE | HAVING |
|---|---|---|
| Qachon ishlaydi | guruhlashdan oldin | guruhlashdan keyin |
| Nimani filtrlaydi | alohida qatorlar | guruhlar |
| Agregatlar mumkinmi | yo‘q | ha |

Qoida: agar shart alohida qatorga tegishli bo‘lsa (status, sana, shahar), uni **WHERE**ga yozing — shunda baza kamroq ma’lumotni qayta ishlaydi. **HAVING**da faqat agregatlar bo‘yicha shartlarni qoldiring.

```sql
-- 2026-yilda 3 va undan ko‘p to‘langan buyurtma qilgan mijozlar
SELECT customer_id, COUNT(*) AS orders
FROM orders
WHERE status = 'paid'
  AND created_at >= '2026-01-01' AND created_at < '2027-01-01'
GROUP BY customer_id
HAVING COUNT(*) >= 3;
```

## Sanalar bo‘yicha guruhlash

Oylik hisobot — eng ko‘p uchraydigan vazifa. Sanani davr boshiga keltirish kerak:

```sql
-- PostgreSQL
SELECT DATE_TRUNC('month', created_at) AS month, SUM(total) AS revenue
FROM orders
WHERE status = 'paid'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month;

-- MySQL
SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, SUM(total) AS revenue
FROM orders
WHERE status = 'paid'
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY month;
```

E’tibor bering: qaysidir oyda savdo bo‘lmagan bo‘lsa, natijada u oy **umuman chiqmaydi**. Nollarni ko‘rsatish uchun natijani kalendar bilan `LEFT JOIN` orqali bog‘lang (PostgreSQL’da `generate_series` yoki alohida sanalar jadvali).

Vaqt mintaqasini ham kuzating: agar vaqtlar UTC’da saqlansa, Toshkent vaqti bilan 01:00 dagi buyurtma oldingi kunga tushib qolishi mumkin.

## Ko‘p uchraydigan xatolar

- **SELECT’dagi ustun GROUP BY’da yo‘q va agregatlanmagan.** PostgreSQL xato beradi, `ONLY_FULL_GROUP_BY` rejimisiz MySQL esa guruhdan tasodifiy qiymat qaytaradi.
- **WHERE’da agregat** — `WHERE SUM(total) > 100` ishlamaydi, `HAVING` kerak.
- **JOIN’dan keyin ikki marta sanash.** Buyurtmalarni pozitsiyalar bilan bog‘lasangiz, har bir buyurtma summasi undagi pozitsiyalar soncha takrorlanadi. Avval agregatlang, keyin bog‘lang yoki pozitsiyalar bo‘yicha `SUM` hisoblang.
- **Butun sonli bo‘lish.** PostgreSQL’da butun sonlar bo‘yicha `AVG` kasr qaytaradi, lekin butun sonli `SUM(a) / COUNT(*)` kasr qismini tashlab yuborishi mumkin.
- **HAVING’da alias.** MySQL `HAVING revenue > 100`ga ruxsat beradi, PostgreSQL — yo‘q: `SUM(total)` ifodasini takrorlang.

## FAQ

### HAVING’ni GROUP BY’siz ishlatish mumkinmi?

Ha. Bunda butun tanlov bitta guruh hisoblanadi va `HAVING` shu yagona qatorni qaytarish-qaytarmaslikni hal qiladi. Amalda bu kam uchraydi.

### Nega COUNT(column) COUNT(*)dan kam?

`COUNT(column)` shu ustun qiymati `NULL` bo‘lgan qatorlarni sanamaydi. Qatorlar soni uchun `COUNT(*)`, to‘ldirilgan qiymatlar soni uchun `COUNT(column)` ishlating.

### Bir nechta ustun bo‘yicha qanday guruhlash mumkin?

Ularni vergul bilan sanab o‘ting: `GROUP BY city, DATE_TRUNC('month', created_at)`. Har bir noyob qiymatlar kombinatsiyasi, masalan «shahar va oy», uchun alohida guruh hosil bo‘ladi.
