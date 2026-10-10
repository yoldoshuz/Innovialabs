---
title: SQL’da JOIN: INNER, LEFT, RIGHT va FULL misollarda
description: INNER, LEFT, RIGHT va FULL JOIN ikkita kichik jadvalda natijalari bilan, shuningdek takroriy qatorlar, self join va uch va undan ortiq jadvalni birlashtirish.
summary: JOIN ikki jadval qatorlarini moslik sharti bo‘yicha birlashtiradi: INNER faqat mosliklarni, LEFT chap jadvalning barcha qatorlarini, RIGHT o‘ng jadvalning barcha qatorlarini, FULL esa ikkalasidan hammasini qoldiradi va bo‘shliqlarni NULL bilan to‘ldiradi.
---

## Qisqacha javob

**JOIN** shart bajarilganda — odatda tashqi kalit birlamchi kalitga teng bo‘lganda — ikki jadval qatorlarini yonma-yon qo‘yadi. JOIN turi **jufti yo‘q** qatorlar bilan nima qilishni hal qiladi:

| JOIN | Mosligi yo‘q qatorlar |
|---|---|
| `INNER JOIN` | Ikkala tomondan tashlab yuboriladi |
| `LEFT JOIN` | Chap jadvaldan qoladi, o‘ng jadval ustunlari `NULL` |
| `RIGHT JOIN` | O‘ng jadvaldan qoladi, chap jadval ustunlari `NULL` |
| `FULL JOIN` | Ikkala tomondan qoladi |

## Ikkita kichik jadval

**customers**

| id | name |
|---|---|
| 1 | Aziz |
| 2 | Malika |
| 3 | Bobur |

**orders**

| id | customer_id | total |
|---|---|---|
| 101 | 1 | 50 |
| 102 | 1 | 30 |
| 103 | 2 | 20 |
| 104 | NULL | 15 |

Boburning buyurtmalari yo‘q. 104-buyurtma — mehmon buyurtmasi, mijozsiz.

## INNER JOIN

```sql
SELECT c.name, o.id AS order_id, o.total
FROM customers c
INNER JOIN orders o ON o.customer_id = c.id;
```

| name | order_id | total |
|---|---|---|
| Aziz | 101 | 50 |
| Aziz | 102 | 30 |
| Malika | 103 | 20 |

Faqat mos kelgan juftliklar. Bobur va 104-buyurtma tushib qoladi. Oddiy `JOIN` — bu `INNER JOIN`.

## LEFT JOIN

```sql
SELECT c.name, o.id AS order_id, o.total
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id;
```

| name | order_id | total |
|---|---|---|
| Aziz | 101 | 50 |
| Aziz | 102 | 30 |
| Malika | 103 | 20 |
| Bobur | NULL | NULL |

Barcha mijozlar joyida. Bu «barcha X va agar bo‘lsa Y» turidagi vazifalar hamda jufti yo‘q qatorlarni topish uchun asosiy JOIN:

```sql
-- hech qachon buyurtma bermagan mijozlar
SELECT c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;
```

## RIGHT JOIN

```sql
SELECT c.name, o.id AS order_id, o.total
FROM customers c
RIGHT JOIN orders o ON o.customer_id = c.id;
```

| name | order_id | total |
|---|---|---|
| Aziz | 101 | 50 |
| Aziz | 102 | 30 |
| Malika | 103 | 20 |
| NULL | 104 | 15 |

Barcha buyurtmalar joyida. RIGHT JOIN — jadvallari almashtirilgan LEFT JOIN, shuning uchun ko‘p jamoalar o‘qilishi uchun faqat LEFT yozadi.

## FULL JOIN

```sql
SELECT c.name, o.id AS order_id, o.total
FROM customers c
FULL JOIN orders o ON o.customer_id = c.id;
```

| name | order_id | total |
|---|---|---|
| Aziz | 101 | 50 |
| Aziz | 102 | 30 |
| Malika | 103 | 20 |
| Bobur | NULL | NULL |
| NULL | 104 | 15 |

Ikkala tomondan hammasi. Ikki ro‘yxatni solishtirish uchun foydali, masalan to‘lovlarni hisob-fakturalar bilan solishtirishda. MySQL `FULL JOIN`ni qo‘llab-quvvatlamaydi — u yerda LEFT va RIGHT JOIN `UNION` orqali birlashtiriladi.

## Takroriy qatorlar: summalar nega o‘sadi

Yuqorida Aziz ikki marta uchraydi, chunki uning ikkita buyurtmasi bor. Bu to‘g‘ri, lekin bir vaqtda **ikkita «birga-ko‘p» jadvalni** ulaganingizda tuzoqqa aylanadi:

```sql
-- noto‘g‘ri: buyurtmalar va to‘lovlar bir-biriga ko‘payadi
SELECT c.name, SUM(o.total)
FROM customers c
JOIN orders o   ON o.customer_id = c.id
JOIN payments p ON p.customer_id = c.id
GROUP BY c.name;
```

Agar Azizda 2 ta buyurtma va 3 ta to‘lov bo‘lsa, har bir buyurtma qatori 3 marta takrorlanadi va summa oshib ketadi. Yechim — avval har bir jadvalni alohida agregatsiya qilish:

```sql
SELECT c.name, o.orders_total, p.paid_total
FROM customers c
LEFT JOIN (SELECT customer_id, SUM(total)  AS orders_total FROM orders   GROUP BY customer_id) o ON o.customer_id = c.id
LEFT JOIN (SELECT customer_id, SUM(amount) AS paid_total   FROM payments GROUP BY customer_id) p ON p.customer_id = c.id;
```

Agar `DISTINCT` faqat takrorlarni yashirish uchun qo‘shilgan bo‘lsa, avval birlashtirish shartlarini tekshiring.

## Self join

Jadval ikki xil taxallus bilan o‘zi bilan birlashtiriladi. Klassik misol — bitta jadvaldagi xodimlar va ularning rahbarlari:

```sql
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON m.id = e.manager_id;
```

LEFT JOIN `manager_id` qiymati `NULL` bo‘lgan bosh rahbarni ham saqlab qoladi.

## Uch va undan ortiq jadvalni birlashtirish

JOIN’lar navbat bilan qo‘llanadi, har biri natijaga yana bitta jadval qo‘shadi:

```sql
SELECT o.id, c.name, p.title, oi.qty
FROM orders o
JOIN customers   c  ON c.id = o.customer_id
JOIN order_items oi ON oi.order_id = o.id
JOIN products    p  ON p.id = oi.product_id;
```

Maslahatlar: har bir jadvalga qisqa taxallus bering, `ON` shartini o‘z jadvali yonida yozing va birlashtirishda ishlatiladigan tashqi kalit ustunlarini indekslang.

## Ko‘p uchraydigan xatolar

- LEFT JOIN’dan keyin **o‘ng jadval bo‘yicha WHERE’da filtrlash**: `WHERE o.total > 10` `NULL` qatorlarni olib tashlaydi va so‘rovni sezdirmay INNER JOIN’ga aylantiradi. Bunday shartni `ON`ga o‘tkazing.
- **Unutilgan ON sharti** yoki noto‘g‘ri ustun — natijada ulkan dekart ko‘paytmasi.
- **NULL bilan `=` orqali solishtirish**: `NULL = NULL` rost emas, shuning uchun kalitida `NULL` bo‘lgan qatorlar hech qachon mos kelmaydi.

## FAQ

### INNER va LEFT JOIN o‘rtasida tezlik farqi bormi?

Ba’zan optimizatorda INNER JOIN bilan ko‘proq erkinlik bo‘ladi, lekin asosiy omil — birlashtirish ustunlaridagi indekslar. JOIN turini tezlikka qarab emas, kerakli natijaga qarab tanlang.

### CROSS JOIN nima?

U ikki jadval qatorlarining barcha kombinatsiyalarini shartsiz qaytaradi. Uchta mijoz va to‘rtta buyurtma o‘n ikkita qator beradi. Kombinatsiyalar yaratish uchun foydali, masalan har bir sana uchun har bir mahsulot, lekin tasodifan yozilsa xavfli.

### Shartlarni ON’ga yozish kerakmi yoki WHERE’ga?

INNER JOIN uchun natija bir xil. LEFT, RIGHT va FULL JOIN uchun farq qiladi: `ON`dagi shartlar qaysi qatorlar mos kelishini belgilaydi, `WHERE`dagi shartlar esa yakuniy natijani filtrlaydi va `NULL`li qatorlarni olib tashlashi mumkin.
