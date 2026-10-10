---
title: SQL oyna funksiyalari: ROW_NUMBER, RANK, LAG va boshqalar
description: SQL oyna funksiyalari amalda: har guruhdagi top-N, yig‘ma jami, oydan-oyga o‘zgarish va PARTITION BY hamda oyna ramkalari bilan dublikatlarni o‘chirish.
summary: Oyna funksiyasi bog‘liq qatorlar to‘plami bo‘yicha qiymat hisoblaydi, lekin GROUP BY’dan farqli ravishda ularni birlashtirmaydi: har bir qator natijada qoladi va raqam, o‘rin, yig‘ma summa yoki qo‘shni qator qiymatini oladi.
---

## Qisqa javob

Oyna funksiyasi `OVER (...)` bilan yoziladi:

```sql
funksiya() OVER (PARTITION BY guruh ORDER BY tartib ramka)
```

- **PARTITION BY** qatorlarni mustaqil guruhlarga bo‘ladi (GROUP BY kabi, lekin birlashtirmasdan).
- **ORDER BY** guruh ichidagi tartibni belgilaydi.
- **Ramka** (`ROWS BETWEEN ...`) joriy qator uchun qaysi qatorlar hisobga olinishini aniqlaydi.

`GROUP BY`dan asosiy farqi: **qatorlar soni o‘zgarmaydi**. Shuning uchun bir qatorda buyurtmaning o‘zini va, masalan, mijoz buyurtmalari orasidagi o‘rnini ko‘rish mumkin. Oyna funksiyalarini PostgreSQL, MySQL 8+, SQL Server, Oracle, SQLite va ClickHouse qo‘llab-quvvatlaydi.

## ROW_NUMBER, RANK va DENSE_RANK

Farq qiymatlar teng bo‘lganda ko‘rinadi:

| Summa | ROW_NUMBER | RANK | DENSE_RANK |
|---|---|---|---|
| 500 | 1 | 1 | 1 |
| 400 | 2 | 2 | 2 |
| 400 | 3 | 2 | 2 |
| 300 | 4 | 4 | 3 |

- **ROW_NUMBER** — har doim noyob raqam, tenglikda tartib ixtiyoriy.
- **RANK** — teng qiymatlar bir o‘rinni bo‘lishadi, keyingi o‘rin tashlab ketiladi.
- **DENSE_RANK** — teng qiymatlar bir o‘rinni bo‘lishadi, bo‘shliqsiz.

## 1-vazifa. Har guruhdagi top-N

Har bir kategoriyadagi eng qimmat uchta mahsulot:

```sql
SELECT *
FROM (
  SELECT p.*,
         ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY price DESC) AS rn
  FROM products p
) t
WHERE rn <= 3;
```

Oyna funksiyasini **o‘sha so‘rovning WHERE qismida ishlatib bo‘lmaydi**: oynalar filtrlashdan keyin hisoblanadi. Shuning uchun ichki so‘rov yoki CTE kerak. Narxlari teng barcha mahsulotlarni ko‘rsatish uchun `ROW_NUMBER` o‘rniga `DENSE_RANK` qo‘llang.

## 2-vazifa. Yig‘ma jami

Kunlar bo‘yicha o‘sib boruvchi tushum:

```sql
SELECT day, revenue,
       SUM(revenue) OVER (
         ORDER BY day
         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS running_total
FROM daily_sales;
```

Ramkani aniq ko‘rsatgan ma’qul. Agar uni tushirib qoldirsangiz, `ORDER BY` bilan `RANGE` ramkasi ishlatiladi va saralash qiymati bir xil qatorlar summaga birdaniga qo‘shiladi — jami «sakrab» ketadi.

7 kunlik sirpanuvchi o‘rtacha — xuddi shu g‘oya, boshqa ramka bilan: `ROWS BETWEEN 6 PRECEDING AND CURRENT ROW`. Bu har bir kun uchun aynan bitta qator bo‘lsa va bo‘shliqlar bo‘lmasa to‘g‘ri ishlaydi.

## 3-vazifa. Oydan-oyga o‘zgarish

**LAG** oldingi qator qiymatini, **LEAD** keyingisini oladi.

```sql
WITH monthly AS (
  SELECT DATE_TRUNC('month', created_at) AS month, SUM(total) AS revenue
  FROM orders
  GROUP BY 1
)
SELECT month, revenue,
       LAG(revenue) OVER (ORDER BY month) AS prev_revenue,
       ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
             / NULLIF(LAG(revenue) OVER (ORDER BY month), 0), 1) AS change_pct
FROM monthly
ORDER BY month;
```

Birinchi oy uchun `LAG` `NULL` qaytaradi — bu normal. `NULLIF` nolga bo‘lishdan himoya qiladi. Agar biror oy ma’lumotlarda bo‘lmasa, `LAG` undan oldingisi bilan solishtiradi — bo‘shliqlarni kalendar bilan to‘ldiring.

## 4-vazifa. Dublikatlarni o‘chirish

Har bir email uchun faqat eng yangi yozuvni qoldirish:

```sql
DELETE FROM users
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at DESC) AS rn
    FROM users
  ) d
  WHERE rn > 1
);
```

Avval ichki `SELECT`ni bajarib, nima o‘chirilishini ko‘ring va zaxira oling. Tozalagandan so‘ng dublikatlar qayta paydo bo‘lmasligi uchun noyob indeks qo‘shing.

## Ko‘p uchraydigan xatolar

- Oyna funksiyasi bo‘yicha filtrni tashqi so‘rov o‘rniga `WHERE`da yozish.
- `PARTITION BY` unutilgan — raqamlash guruh ichida emas, butun jadval bo‘yicha ketadi.
- Yig‘ma summalarda yashirin `RANGE` ramkasi.
- Noaniq `ORDER BY` bilan `ROW_NUMBER` — natija ishga tushirishlar orasida o‘zgarishi mumkin; saralashga `id` qo‘shing.

## FAQ

### Oyna funksiyasi GROUP BY’dan nimasi bilan farq qiladi?

`GROUP BY` qatorlar guruhini bitta qatorga aylantiradi. Oyna funksiyasi guruh bo‘yicha hisoblaydi, lekin barcha asl qatorlarni saqlab, har biriga hisob natijasini qo‘shadi.

### Bitta so‘rovda bir nechta oyna ishlatish mumkinmi?

Ha, har bir funksiyaning o‘z `OVER (...)` qismi bo‘lishi mumkin. Oyna takrorlansa, PostgreSQL va MySQL’da uni bir marta `WINDOW w AS (...)` orqali tavsiflab, `OVER w` deb murojaat qilish mumkin.

### Oyna funksiyalari so‘rovni sekinlashtirmaydimi?

Ular `PARTITION BY` va `ORDER BY` ustunlari bo‘yicha saralashni talab qiladi, bu katta jadvallarda sezilarli. Shu ustunlar bo‘yicha indeks va oyna hisoblanishidan oldin keraksiz qatorlarni filtrlash odatda muammoni hal qiladi.
