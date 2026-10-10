---
title: PostgreSQL’da sekin so‘rovlarni topish: EXPLAIN ANALYZE
description: PostgreSQL’da sekin so‘rovlarni pg_stat_statements va log orqali topish, EXPLAIN ANALYZE rejasini o‘qish va real so‘rovni indeks bilan tezlashtirish.
summary: Avval pg_stat_statements yoki log_min_duration_statement orqali eng qimmat so‘rovlarni toping, so‘ng ular uchun EXPLAIN (ANALYZE, BUFFERS) ishga tushirib, vaqt sarflanayotgan tugunni qidiring: ko‘pincha bu katta jadvaldagi Seq Scan yoki ortiqcha saralash bo‘lib, to‘g‘ri indeks bilan hal qilinadi.
---

## Qisqa javob

Sekin so‘rovlar bilan ishlash ikki qadamdan iborat:

1. Bazani haqiqatan qaysi so‘rovlar yuklayotganini **topish**: `pg_stat_statements` va sekin so‘rovlar logi.
2. Aniq so‘rovni **tahlil qilish**: `EXPLAIN (ANALYZE, BUFFERS)` rejaning qaysi tuguni vaqt sarflayotganini ko‘rsatadi va nimani tuzatish kerakligi aniq bo‘ladi.

## 1-qadam. Sekin so‘rovlarni topish

**pg_stat_statements** barcha normallashtirilgan so‘rovlar bo‘yicha statistika yig‘adi. Uni `postgresql.conf`da yoqing, serverni qayta ishga tushiring va kengaytmani yarating:

```sql
-- postgresql.conf: shared_preload_libraries = 'pg_stat_statements'
CREATE EXTENSION pg_stat_statements;

SELECT query, calls, total_exec_time, mean_exec_time, rows
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;
```

**total_exec_time** bo‘yicha saralang: million marta bajariladigan 5 ms’lik so‘rov kamdan-kam ishlaydigan 3 soniyalik so‘rovdan ko‘pincha muhimroq. PostgreSQL’ning eski versiyalarida bu ustunlar `total_time` va `mean_time` deb ataladi.

**Sekin so‘rovlar logi** chegaradan uzoqroq davom etgan har bir so‘rovni yozadi:

```sql
ALTER SYSTEM SET log_min_duration_statement = '500ms';
SELECT pg_reload_conf();
```

**auto_explain** moduli bunday so‘rovlarning rejasini ham logga yozishi mumkin — so‘rov faqat production’da sekin bo‘lganda qulay.

## 2-qadam. Rejani o‘qish

`EXPLAIN` rejani va taxminlarni ko‘rsatadi, `EXPLAIN ANALYZE` esa so‘rovni **haqiqatan bajaradi** va real vaqt hamda qatorlar sonini qo‘shadi. `UPDATE` va `DELETE` uchun uni `BEGIN; ... ROLLBACK;` ichiga oling.

Reja pastdan yuqoriga va ichkaridan tashqariga o‘qiladi. Asosiy tugunlar:

| Tugun | Ma’nosi | Qachon muammo |
|---|---|---|
| **Seq Scan** | butun jadvalni o‘qish | jadval katta, kerakli qatorlar esa bir nechta |
| **Index Scan** | indeks bo‘yicha qidirib, qatorlarni jadvaldan o‘qish | kamdan-kam; juda ko‘p qator qaytsa yomon |
| **Index Only Scan** | barcha ma’lumot indeksdan olinadi | yaxshi natija |
| **Bitmap Heap Scan** | avval indeksdan qator manzillarini yig‘ib, keyin jadvalni o‘qiydi | o‘rtacha tanlovlar uchun normal |
| **Nested Loop** | chapdagi har bir qator uchun o‘ngdan moslarini qidiradi | chapda qator ko‘p va o‘ngda indeks yo‘q |
| **Hash Join** | bir tomondan hash-jadval quradi | hash `work_mem`ga sig‘maydi |
| **Sort** | saralash | `external merge Disk` — saralash diskka tushgan |

Nimaga qarash kerak:

- **actual time** — vaqt qayerda to‘planmoqda;
- taxminiy va haqiqiy **rows** — bir necha barobar farq statistika eskirganini yoki rejalashtiruvchi adashganini bildiradi;
- **Rows Removed by Filter** — behuda o‘qilgan qatorlar;
- **Buffers** — keshdan va diskdan o‘qilgan sahifalar.

## 3-qadam. Real so‘rovni tezlashtirish

«Mening buyurtmalarim» sahifasi sekin ochilmoqda:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, total, created_at
FROM orders
WHERE customer_id = 42
ORDER BY created_at DESC
LIMIT 20;
```

Rejada katta `Rows Removed by Filter` bilan `Seq Scan on orders` va uning ustida `Sort` ko‘rinadi. Baza bitta mijozning buyurtmalarini topish uchun butun jadvalni o‘qiydi, keyin ularni saralaydi.

Yechim — ham filtrlaydigan, ham allaqachon saralangan tarkibli indeks:

```sql
CREATE INDEX CONCURRENTLY idx_orders_customer_created
  ON orders (customer_id, created_at DESC);
ANALYZE orders;
```

`EXPLAIN ANALYZE` qayta ishga tushirilganda `Limit` ostida `Index Scan using idx_orders_customer_created` ko‘rinadi, `Sort` tuguni yo‘qoladi: baza indeksdan aynan kerakli 20 ta qatorni o‘qiydi.

Ustunlar tartibi muhim: avval tenglik shartidagi ustun (`customer_id`), keyin saralash yoki diapazon ustuni.

## Boshqa keng tarqalgan sabablar

- **Eskirgan statistika** — `ANALYZE` bajaring, autovacuum ishlayotganini tekshiring.
- `WHERE`da **ustun ustidagi funksiya**, masalan `lower(email) = ...`, oddiy indeksdan foydalanmaydi — ifoda bo‘yicha indeks kerak.
- Taqqoslashda **turlar mos kelmasligi** indeks ishlatilishiga to‘sqinlik qiladi.
- **ORM’dan N+1 so‘rovlar** — har biri tez, lekin ular minglab; `pg_stat_statements`da juda katta `calls` qiymati bilan ko‘rinadi.
- Muayyan saralash yoki hash uchun **work_mem kam** — rejada ish diskda bajarilayotgani ko‘rinadi.

## FAQ

### EXPLAIN ANALYZE’ni production’da ishga tushirish xavfsizmi?

U so‘rovni haqiqatan bajaradi, shuning uchun og‘ir so‘rov bazani yana yuklaydi, o‘zgartiruvchi so‘rov esa ma’lumotni o‘zgartiradi. `SELECT` uchun bu odatda maqbul, o‘zgartiruvchi so‘rovlarni `ROLLBACK` bilan tranzaksiyaga o‘rang.

### Nega PostgreSQL mening indeksimdan foydalanmayapti?

Ko‘p uchraydigan sabablar: so‘rov jadvalning katta qismini qaytaradi va ketma-ket o‘qish arzonroq, statistika eskirgan, ustunga funksiya qo‘llangan yoki tarkibli indeksdagi ustunlar tartibi shartga mos emas.

### EXPLAIN va EXPLAIN ANALYZE nimasi bilan farq qiladi?

`EXPLAIN` so‘rovni bajarmasdan faqat reja tuzadi va taxminlarni ko‘rsatadi. `EXPLAIN ANALYZE` uni bajaradi va haqiqiy vaqt hamda qatorlar sonini ko‘rsatadi, shuning uchun haqiqiy sababni topish uchun aynan u kerak.
