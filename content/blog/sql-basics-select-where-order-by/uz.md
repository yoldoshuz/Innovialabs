---
title: SQL asoslari: SELECT, WHERE, ORDER BY va LIMIT
description: Buyurtmalar jadvali misolida birinchi SQL so‘rovlar: tanlash, filtrlash, saralash, LIKE, IN, NULL bilan ishlash va yangi boshlovchilarning odatiy xatolari.
summary: O‘qish uchun deyarli har qanday so‘rov SELECT ustunlar FROM jadval WHERE shart ORDER BY saralash LIMIT soni shaklida tuziladi. Shu besh qismni hamda LIKE, IN va IS NULLni o‘zlashtirsangiz, bazadan kerakli ma’lumotlarning aksariyatini ola olasiz.
---

## Birinchi so‘rov formulasi

SQLda ma’lumot o‘qish so‘rovi deyarli har doim bir xil qismlardan qat’iy tartibda yig‘iladi:

```sql
SELECT ustunlar
FROM jadval
WHERE shart
ORDER BY saralash
LIMIT soni;
```

- **SELECT** — qaysi ustunlarni ko‘rsatish.
- **FROM** — qaysi jadvaldan.
- **WHERE** — qaysi qatorlarni qoldirish.
- **ORDER BY** — qanday saralash.
- **LIMIT** — nechta qator qaytarish.

Faqat `SELECT` va `FROM` majburiy, qolganlari kerak bo‘lganda qo‘shiladi. Qismlar tartibini o‘zgartirib bo‘lmaydi.

## O‘quv jadvali orders

Quyidagi barcha misollar shunday buyurtmalar jadvali uchun:

| id | customer | city | status | total | created_at |
|----|----------|------|--------|-------|------------|
| 1 | Aliya | Toshkent | paid | 450000 | 2026-03-01 |
| 2 | Bobur | Samarqand | new | 120000 | 2026-03-02 |
| 3 | Dilnoza | Toshkent | cancelled | 89000 | 2026-03-02 |
| 4 | Yevgeniy | Buxoro | paid | 1200000 | 2026-03-03 |
| 5 | Aliya | Toshkent | new | NULL | 2026-03-04 |

## SELECT: ustunlarni tanlaymiz

```sql
SELECT customer, total FROM orders;
```

`SELECT *` barcha ustunlarni qaytaradi. Jadvalni o‘rganish uchun qulay, lekin ilova kodida ustunlarni aniq sanab o‘tgan ma’qul: so‘rov tezroq ishlaydi va jadvalga yangi maydonlar qo‘shilsa buzilmaydi.

## WHERE: qatorlarni filtrlaymiz

```sql
SELECT id, customer, total
FROM orders
WHERE status = 'paid' AND total > 300000;
```

Asosiy operatorlar:

- taqqoslash: `=`, `<>` (teng emas), `>`, `<`, `>=`, `<=`;
- mantiq: `AND`, `OR`, `NOT`;
- oraliq: `total BETWEEN 100000 AND 500000` (chegaralar kiradi).

`AND` va `OR`ni aralashtirsangiz, qavs qo‘ying — `AND` oldinroq bajariladi:

```sql
WHERE city = 'Toshkent' AND (status = 'new' OR status = 'paid')
```

## IN va LIKE

**IN** `OR` zanjirini almashtiradi:

```sql
SELECT * FROM orders WHERE city IN ('Toshkent', 'Buxoro');
```

**LIKE** shablon bo‘yicha qidiradi: `%` — istalgan sondagi belgilar, `_` — aynan bitta belgi.

```sql
SELECT * FROM orders WHERE customer LIKE 'Al%';
```

E’tibor bering: PostgreSQLda `LIKE` registrga sezgir (registrni hisobga olmasdan qidirish uchun `ILIKE` bor), MySQLda esa bu satrlarni taqqoslash sozlamalariga bog‘liq. `%` bilan boshlanadigan shablon odatda oddiy indeksdan foydalana olmaydi va katta jadvallarda sekin ishlaydi.

## NULL: alohida mavzu

**NULL** «qiymat noma’lum» degani, nol ham, bo‘sh satr ham emas. 5-buyurtmada summa hali hisoblanmagan.

```sql
-- noto‘g‘ri: birorta ham qator qaytarmaydi
SELECT * FROM orders WHERE total = NULL;

-- to‘g‘ri
SELECT * FROM orders WHERE total IS NULL;
SELECT * FROM orders WHERE total IS NOT NULL;
```

NULL bilan har qanday taqqoslash «noma’lum» natija beradi, shuning uchun qator filtrdan o‘tmaydi. Shu sababli `WHERE total < 100000` ham 5-buyurtmani ko‘rsatmaydi. Standart qiymat qo‘yish kerak bo‘lsa, `COALESCE(total, 0)` dan foydalaning.

## ORDER BY va LIMIT

```sql
SELECT customer, total, created_at
FROM orders
WHERE status <> 'cancelled'
ORDER BY total DESC, created_at ASC
LIMIT 3;
```

- `ASC` — o‘sish tartibida (standart), `DESC` — kamayish tartibida.
- Bir nechta ustun bo‘yicha saralash mumkin: avval birinchisi, teng bo‘lsa — ikkinchisi bo‘yicha.
- Saralashda NULL qayerga tushishi MBBTga bog‘liq. PostgreSQLda buni aniq belgilash mumkin: `NULLS LAST`.
- `LIMIT` PostgreSQL, MySQL va SQLiteda ishlaydi. SQL Serverda uning o‘rniga `TOP` yoki `OFFSET ... FETCH` ishlatiladi.

`ORDER BY` bo‘lmasa, qatorlar tartibi kafolatlanmaydi, shuning uchun saralashsiz `LIMIT` har safar turli qatorlarni qaytarishi mumkin.

## Yangi boshlovchilarning keng tarqalgan xatolari

- **Matn uchun qo‘shtirnoq.** Satrlar bittalik qo‘shtirnoqda yoziladi: `'paid'`. Standart SQLda qo‘shtirnoq ustun nomlarini bildiradi.
- **`IS NULL` o‘rniga `= NULL`.**
- `AND` va `OR`ni birga ishlatganda **unutilgan qavslar**.
- **Ichida NULL bor ro‘yxat bilan `NOT IN`** — bunday so‘rov birorta ham qator qaytarmaydi.
- **`ORDER BY`siz `LIMIT`** — «birinchi 10 ta» tasodifiy bo‘lib chiqadi.
- **Ishchi bazada sinov so‘rovlari.** O‘rganayotganda nusxa bilan ishlang.

## FAQ

### SQL kalit so‘zlarida registr muhimmi?

Yo‘q, `select` va `SELECT` bir xil ishlaydi. Kalit so‘zlarni jadval va ustun nomlaridan oson ajratish uchun katta harflarda yozish qabul qilingan.

### SQLni qayerda mashq qilish mumkin?

PostgreSQL yoki SQLiteni kompyuteringizga o‘rnating va o‘zingizning kichik jadvalingizni, masalan buyurtmalar jadvalini yarating. So‘rovlarni to‘g‘ridan-to‘g‘ri brauzerda bajaradigan onlayn qumdonlar ham mos keladi.

### Natijalar sahifasini, masalan ikkinchi o‘ntalikni qanday olish mumkin?

`LIMIT`ni `OFFSET` bilan birga ishlating: `ORDER BY id LIMIT 10 OFFSET 10`. Juda katta jadvallarda katta `OFFSET` qiymatlari sekin ishlaydi, shunda kalit bo‘yicha sahifalash qo‘llanadi: `WHERE id > oxirgi_id ORDER BY id LIMIT 10`.
