---
title: SQL’da ichki so‘rovlar va CTE: o‘qiladigan so‘rov yozish
description: Ichki so‘rovlar CTE va WITH’dan nimasi bilan farq qiladi, qachon qaysi biri kerak, rekursiv CTE bilan kategoriyalar daraxtini aylanish va unumdorlik jihatlari.
summary: Ichki so‘rov shart ichidagi qisqa tekshiruv uchun, CTE (WITH) yuqoridan pastga o‘qiladigan ko‘p bosqichli mantiq uchun, rekursiv CTE esa ierarxiyani aylanishning standart usuli; zamonaviy bazalarda tezligi odatda bir xil.
---

## Qisqa javob

- **Ichki so‘rov** (subquery) — boshqa so‘rov ichidagi so‘rov: `WHERE`, `SELECT` yoki `FROM`da. Mantiq bir qatorga sig‘sa qulay.
- **CTE** (Common Table Expression, `WITH`) — asosiy so‘rovdan oldin keladigan nomlangan oraliq natija. Bosqichlar bir nechta bo‘lib, ularni tartib bilan o‘qish kerak bo‘lsa qulay.
- **Rekursiv CTE** (`WITH RECURSIVE`) — daraxt va graflar uchun: kategoriyalar, tashkiliy tuzilma, referal zanjirlari.

Tanlov avvalo **o‘qilishi** haqida. Unumdorlik ko‘p hollarda bir xil, istisnolar quyida ko‘rib chiqilgan.

## Ichki so‘rov turlari

```sql
-- Skalyar: bitta qiymat
SELECT name, price, price - (SELECT AVG(price) FROM products) AS diff
FROM products;

-- Shartda: EXISTS / IN
SELECT c.*
FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);

-- FROM’dagi hosila jadval
SELECT city, avg_total
FROM (SELECT city, AVG(total) AS avg_total FROM orders GROUP BY city) t
WHERE avg_total > 500;
```

**Korrelyatsiyalangan ichki so‘rov** tashqi so‘rovga murojaat qiladi (yuqoridagi `o.customer_id = c.id` kabi) va mantiqan har bir qator uchun bajariladi. Rejalashtiruvchi uni ko‘pincha JOIN’ga aylantiradi, lekin har doim emas.

## O‘sha hisobot CTE orqali

Vazifa: yil davomidagi xaridlari barcha mijozlar o‘rtachasidan yuqori bo‘lgan mijozlar.

Ichma-ich so‘rovlar bilan:

```sql
SELECT customer_id, spent
FROM (SELECT customer_id, SUM(total) AS spent
      FROM orders WHERE created_at >= '2026-01-01'
      GROUP BY customer_id) s
WHERE spent > (SELECT AVG(spent) FROM
      (SELECT SUM(total) AS spent FROM orders
       WHERE created_at >= '2026-01-01' GROUP BY customer_id) x);
```

CTE orqali:

```sql
WITH spending AS (
  SELECT customer_id, SUM(total) AS spent
  FROM orders
  WHERE created_at >= '2026-01-01'
  GROUP BY customer_id
),
avg_spending AS (
  SELECT AVG(spent) AS avg_spent FROM spending
)
SELECT s.customer_id, s.spent
FROM spending s, avg_spending a
WHERE s.spent > a.avg_spent;
```

Mantiq **bir marta** yozilgan, bosqichlar nomlangan, so‘rov yuqoridan pastga o‘qiladi. Har bir CTE’ni oddiy `SELECT` sifatida ishga tushirib, alohida tekshirish mumkin.

## Rekursiv CTE: ierarxiya

`categories(id, parent_id, name)` jadvali. «Elektronika» kategoriyasini barcha ichki kategoriyalari va ichma-ichlik darajasi bilan olish kerak:

```sql
WITH RECURSIVE tree AS (
  SELECT id, parent_id, name, 1 AS depth
  FROM categories
  WHERE id = 10                      -- ildiz
  UNION ALL
  SELECT c.id, c.parent_id, c.name, t.depth + 1
  FROM categories c
  JOIN tree t ON c.parent_id = t.id  -- topilganlarning bolalari
  WHERE t.depth < 20                 -- aylanib qolishdan himoya
)
SELECT * FROM tree ORDER BY depth, name;
```

Qanday ishlaydi: birinchi qism (**langar**) ildizni topadi, ikkinchi qism (**rekursiv**) har qadamda allaqachon topilgan qatorlarning bolalarini qo‘shadi, toki yangi qatorlar chiqmay qolguncha. «Xodim — rahbar — uning rahbari» zanjiri ham xuddi shunday quriladi.

Agar ma’lumotlarda sikl bo‘lishi mumkin bo‘lsa (A B’ga, B A’ga ishora qiladi), chuqurlik cheklovisiz so‘rov tugamaydi. MySQL’da qo‘shimcha ravishda `cte_max_recursion_depth` cheklovi bor.

## Unumdorlik

- **PostgreSQL 12+**da bir marta ishlatiladigan oddiy CTE asosiy so‘rovga joylashtiriladi va ichki so‘rov kabi optimallashtiriladi. Buni aniq boshqarish mumkin: `WITH x AS MATERIALIZED (...)` yoki `NOT MATERIALIZED`.
- PostgreSQL’ning eski versiyalarida CTE har doim materiallashtirilgan — bu tashqi shartlarning indeksdan foydalanishiga xalaqit bergan.
- Og‘ir CTE so‘rovda bir necha marta ishlatilsa, **materiallashtirish foydali**.
- **Ichki so‘rov bilan NOT IN xavfli**: ichki so‘rov bitta bo‘lsa ham `NULL` qaytarsa, natija bo‘sh bo‘ladi. `NOT EXISTS` ishlating.
- Katta jadvalda `SELECT` ichidagi korrelyatsiyalangan ichki so‘rov qatorma-qator bajarilishi mumkin — rejani `EXPLAIN` bilan tekshiring.

## Qanday tanlash kerak

| Vaziyat | Nima ishlatish kerak |
|---|---|
| «Bog‘liq qatorlar bormi» degan oddiy tekshiruv | `EXISTS` |
| Taqqoslash uchun bitta qiymat | skalyar ichki so‘rov |
| Uch va undan ko‘p mantiqiy bosqich | CTE |
| Bitta oraliq natija ikki marta kerak | CTE |
| Daraxt, graf, zanjir | rekursiv CTE |

## FAQ

### CTE ichki so‘rovdan sekinroqmi?

Zamonaviy PostgreSQL, MySQL 8+ va SQL Server’da odatda yo‘q: optimallashtiruvchi ularni bir xil qayta ishlaydi. Farq majburiy materiallashtirishda paydo bo‘ladi — bunda rejalarni `EXPLAIN` bilan solishtiring.

### CTE’ni UPDATE va DELETE bilan ishlatish mumkinmi?

Ha, PostgreSQL, SQL Server va MySQL 8+da `WITH`ni `UPDATE` va `DELETE` oldidan qo‘yish mumkin. PostgreSQL’da CTE’ning o‘zi ham `RETURNING` bilan `INSERT`, `UPDATE` yoki `DELETE`ni o‘z ichiga olishi mumkin.

### Ierarxiya uchun nima yaxshi: rekursiv CTE yoki yo‘lni saqlash?

Rekursiv CTE sxemani o‘zgartirishni talab qilmaydi va ko‘pchilik daraxtlarga mos keladi. Agar daraxt chuqur bo‘lib, juda tez-tez o‘qilsa, yo‘lni saqlovchi ustun (materialized path) yoki PostgreSQL’dagi `ltree` kengaytmasini ko‘rib chiqing.
