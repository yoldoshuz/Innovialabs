---
title: Ma’lumotlar bazasidagi indekslar: so‘rovlarni qanday tezlashtiradi
description: B-tree indekslar qanday ishlaydi, tarkibli va unikal indekslar qachon kerak, ustunlar tartibi nega muhim, yozishdagi narxi va ishlatilishini tekshirish.
summary: Indeks — odatda B-daraxt ko‘rinishidagi alohida saralangan tuzilma bo‘lib, baza butun jadvalni o‘qimasdan kerakli qatorlarga darhol o‘tadi; u o‘qishni tezlashtiradi, lekin har bir qo‘shish, yangilash va o‘chirishni sekinlashtiradi, shuning uchun indekslar «har ehtimolga qarshi» emas, real so‘rovlar uchun yaratiladi.
---

## Qisqacha javob

Indekssiz `WHERE email = 'a@b.com'` kabi so‘rov bazani jadvaldagi barcha qatorlarni o‘qishga majbur qiladi — bu **ketma-ket skanerlash** (Seq Scan). **Indeks** — bir yoki bir nechta ustun qiymatlari qatorlarga ko‘rsatkichlar bilan birga saralangan holda saqlanadigan qo‘shimcha tuzilma. Baza indeks bo‘yicha qidiradi, bir necha qadamda kerakli ko‘rsatkichlarni topadi va faqat o‘sha qatorlarni o‘qiydi.

Murosa oddiy: **o‘qish tezroq, yozish sekinroq va diskda ko‘proq joy**.

## B-tree indeks qanday tuzilgan

Ko‘pchilik relyatsion bazalar (PostgreSQL, MySQL, SQL Server) standart holatda **B-daraxt**dan foydalanadi. Darajalarga bo‘lingan telefon ma’lumotnomasini tasavvur qiling:

- **ildiz** sahifa: «A–K chapga, L–Z o‘ngga»;
- **oraliq** sahifalar diapazonni toraytiradi;
- **barg** sahifalar saralangan qiymatlar va jadval qatorlariga ko‘rsatkichlarni saqlaydi.

Daraxt muvozanatli va keng, shuning uchun juda katta jadvalda ham istalgan qiymatgacha bir necha sahifa o‘qish kifoya. Barglar saralangan va o‘zaro bog‘langan, shu sababli B-tree faqat tenglikda emas, boshqa hollarda ham yordam beradi:

- `=` va `IN`;
- diapazonlar: `>`, `<`, `BETWEEN`;
- prefiks bo‘yicha qidiruv: `LIKE 'abc%'` (lekin `LIKE '%abc'` emas);
- indekslangan ustunlar bo‘yicha `ORDER BY` — ko‘pincha alohida saralashsiz.

## Indekslarni yaratish

```sql
-- bitta ustun
CREATE INDEX idx_orders_customer ON orders (customer_id);

-- unikal: yaxlitlik qoidasi ham
CREATE UNIQUE INDEX idx_users_email ON users (email);

-- tarkibli: bir nechta ustun
CREATE INDEX idx_orders_customer_date ON orders (customer_id, created_at);
```

**Unikal indeks** qidiruvni tezlashtiradi va dublikatlar yo‘qligini kafolatlaydi. Birlamchi kalit va `UNIQUE` cheklovi bunday indeksni avtomatik yaratadi.

## Tarkibli indekslar va ustunlar tartibi

Tarkibli indeks avval birinchi ustun bo‘yicha, so‘ng birinchi ustunning har bir qiymati ichida ikkinchi ustun bo‘yicha saralanadi — familiya, keyin ism bo‘yicha saralangan ma’lumotnoma kabi.

`(customer_id, created_at)` indeksi uchun:

| So‘rovdagi shart | Indeks yaxshi ishlaydimi? |
|---|---|
| `customer_id = 5` | Ha |
| `customer_id = 5 AND created_at > '2026-01-01'` | Ha, ideal |
| `customer_id = 5 ORDER BY created_at` | Ha, qo‘shimcha saralashsiz |
| faqat `created_at > '2026-01-01'` | Odatda yo‘q |

Qoida: **avval tenglik bilan solishtiriladigan ustunlar, keyin diapazon yoki saralash ustuni**. `(a, b)` indeksi faqat `a` bo‘yicha so‘rovlarni ham qamrab oladi, shuning uchun `a` uchun alohida indeks odatda ortiqcha.

## Yozishdagi narxi

Har bir indeks qator qo‘shilganda, indekslangan ustun o‘zgarganda va qator o‘chirilganda yangilanishi kerak. Indekslar ko‘p bo‘lsa:

- `INSERT`, `UPDATE` va `DELETE` sekinlashadi;
- disk va kesh uchun xotirada ko‘proq joy ketadi;
- bekap va tiklash uzoqroq davom etadi.

Asosan o‘qiladigan katalog uchun bu foydali almashuv. Doimiy yozuvlar oqimi bo‘lgan jadval — hodisalar, loglar — uchun esa har bir ortiqcha indeks o‘zini oqlashi kerak.

## Indeks ishlatilayotganini qanday bilish mumkin

Bazadan so‘rov rejasini so‘rang. PostgreSQL’da:

```sql
EXPLAIN ANALYZE
SELECT * FROM orders WHERE customer_id = 5;
```

Nimaga e’tibor berish kerak:

- **Index Scan** yoki **Index Only Scan** — indeks ishlatilmoqda.
- **Bitmap Index Scan** — ko‘plab mos qatorlarni yig‘ish uchun indeks ishlatilmoqda.
- **Seq Scan** — butun jadval o‘qilmoqda.

Seq Scan har doim ham muammo emas. Kichik jadvalda yoki so‘rov qatorlarning katta qismini qaytarganda hammasini o‘qish arzonroq va rejalashtiruvchi buni ongli ravishda tanlaydi. MySQL’da `EXPLAIN` ishlating va `key` ustuniga qarang.

## Indeks nega e’tiborsiz qoladi

- Ustunga funksiya qo‘llangan: `WHERE LOWER(email) = ...` uchun `LOWER(email)` bo‘yicha indeks kerak.
- Turlar mos emas, masalan matnli ustun son bilan solishtirilmoqda.
- Boshida belgi bor shablon: `LIKE '%term'`.
- So‘rov tarkibli indeksning birinchi ustunini ishlatmaydi.
- Statistika eskirgan — uni `ANALYZE` yangilaydi.

## Amaliy chek-list

1. Avval sekin so‘rovlarni toping (slow query log, `pg_stat_statements` yoki APM).
2. Shu so‘rovlarning `WHERE`, `JOIN` va `ORDER BY` qismidagi ustunlarni indekslang.
3. Birlashtirishda ishlatiladigan tashqi kalit ustunlarini indekslang.
4. Rejani oldin va keyin solishtiring.
5. Ishlatilmayotgan va takrorlanuvchi indekslarni vaqti-vaqti bilan o‘chirib turing.

## FAQ

### Har ehtimolga qarshi har bir ustunni indekslash kerakmi?

Yo‘q. Har bir indeks yozishni sekinlashtiradi va joy egallaydi, ularning ko‘pi esa umuman ishlatilmaydi. Indekslarni aniq sekin yoki tez-tez bajariladigan so‘rovlar uchun yarating va natijani `EXPLAIN` bilan tekshiring.

### Birlamchi kalitga alohida indeks kerakmi?

Yo‘q. Birlamchi kalit e’lon qilinganda unikal indeks avtomatik yaratiladi. `UNIQUE` cheklovlari uchun ham shunday.

### Indeks bor, lekin so‘rov nega sekin?

So‘rov juda ko‘p qator qaytarayotgan, ustunga funksiya qo‘llayotgan, tarkibli indeksning birinchi ustunini o‘tkazib yuborayotgan yoki eskirgan statistikaga tayanayotgan bo‘lishi mumkin. Haqiqiy rejani `EXPLAIN ANALYZE` orqali ko‘ring.
