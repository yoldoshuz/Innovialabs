---
title: PostgreSQL’da to‘liq matnli qidiruv: Elasticsearch kerakmi
description: PostgreSQL’da tsvector, tsquery, GIN indekslar va xatolar uchun pg_trgm bilan qidiruvni qanday qurish va alohida qidiruv tizimi qachon haqiqatan o‘zini oqlaydi.
summary: Ko‘pchilik saytlarga PostgreSQL yetadi: GIN indeksli tsvector so‘zlar bo‘yicha relevant qidiruv beradi, pg_trgm xatolarni kechiradi, Elasticsearch esa faqat yuqori yuklama, murakkab reyting yoki boy fasetli qidiruvda o‘zini oqlaydi.
---

## Qisqa javob

Boshida Elasticsearch, ehtimol, **kerak emas**. PostgreSQL’da o‘rnatilgan to‘liq matnli qidiruv bor: u matnni normallashtirilgan so‘zlarga ajratadi (**tsvector**), ularni so‘rov bilan solishtiradi (**tsquery**), natijalarni reytinglaydi va **GIN indeks** tufayli tez ishlaydi. **pg_trgm** kengaytmasi xatolar va so‘z qismlari uchun noaniq solishtirishni qo‘shadi. Ular birgalikda ko‘pchilik kataloglar, bloglar, bilimlar bazalari va admin panellarni sinxronlash kerak bo‘lgan ikkinchi tizimsiz yopadi.

## 1-qadam. Qidiruv uchun ustun

Generatsiya qilinadigan ustun qidiruv vektorini avtomatik yangilaydi. Og‘irliklar sarlavhadagi mosliklarni matndagidan yuqoriga ko‘taradi.

```sql
ALTER TABLE articles
ADD COLUMN search tsvector
GENERATED ALWAYS AS (
  setweight(to_tsvector('russian', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('russian', coalesce(body, '')), 'B')
) STORED;

CREATE INDEX articles_search_idx ON articles USING GIN (search);
```

`'russian'` — stemming bilan o‘rnatilgan konfiguratsiya: «статьи» «статья»ni topadi. Ingliz tili uchun — `'english'`.

**O‘zbek tili** uchun o‘rnatilgan konfiguratsiya yo‘q. `'simple'` (stemmingsiz kichik harflar) dan foydalaning va apostrof variantlarini olib tashlang, shunda o‘zbek, o‘zbek va ozbek mos keladi:

```sql
to_tsvector('simple', regexp_replace(coalesce(title_uz, ''), '[‘’ʻʼ`'']', '', 'g'))
```

Xuddi shu normallashtirishni foydalanuvchi so‘roviga ham qo‘llang.

## 2-qadam. So‘rov va reyting

`websearch_to_tsquery` foydalanuvchilar haqiqatda kiritadigan narsani tushunadi: oddiy so‘zlar, qo‘shtirnoqdagi iboralar va so‘zni chiqarib tashlash uchun `-`.

```sql
SELECT id, title,
       ts_rank(search, q) AS rank,
       ts_headline('russian', body, q, 'MaxFragments=2') AS snippet
FROM articles,
     websearch_to_tsquery('russian', 'настройка сервера') AS q
WHERE search @@ q
ORDER BY rank DESC
LIMIT 20;
```

- `@@` mos qatorlarni tanlaydi va GIN indeksdan foydalanadi.
- `ts_rank` og‘irliklarni hisobga olib relevantlik bo‘yicha saralaydi.
- `ts_headline` so‘zlar ajratib ko‘rsatilgan parcha yaratadi. U nisbatan qimmat, shuning uchun uni faqat ko‘rsatiladigan qatorlar uchun chaqiring.

Prefiks bo‘yicha qidiruv uchun, masalan yozish paytidagi takliflarda, `to_tsquery('russian', 'настр:*')` dan foydalaning.

## 3-qadam. pg_trgm orqali xatolar va qisman mosliklar

To‘liq matnli qidiruv butun normallashtirilgan so‘zlarni solishtiradi, shuning uchun «postgers» «postgres»ni topmaydi. Trigrammalar uch harfli bo‘laklarni solishtirib, buni hal qiladi.

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX articles_title_trgm_idx ON articles USING GIN (title gin_trgm_ops);

SELECT id, title, similarity(title, 'postgers') AS sim
FROM articles
WHERE title % 'postgers'
ORDER BY sim DESC
LIMIT 10;
```

- `%` o‘xshashlik chegarasidan (`pg_trgm.similarity_threshold`) yuqori qatorlarni qaytaradi.
- Xuddi shu indeks `ILIKE '%matn%'` so‘rovlarini tezlashtiradi.
- Uzun maydonlar uchun `word_similarity` va `<%` operatori so‘rovni matnning eng o‘xshash qismi bilan solishtiradi.

Keng tarqalgan bog‘lam: avval to‘liq matnli qidiruv, hech narsa topilmasa — «Balki siz buni nazarda tutgandirsiz» maslahati bilan sarlavhalar bo‘yicha trigramma qidiruvi.

## Ko‘p uchraydigan xatolar

- `WHERE` ichida mos indekssiz `to_tsvector` chaqirish — har bir so‘rov to‘liq ko‘rib chiqishga aylanadi.
- Indekslash va so‘rovda turli qidiruv konfiguratsiyalari.
- Katta jadvallarda trigramma indekssiz `ILIKE '%so‘z%'`.
- Unutilgan `coalesce`: bitta `NULL` maydon butun birlashtirilgan vektorni `NULL`ga aylantiradi.

## Alohida qidiruv tizimi qachon o‘zini oqlaydi

| Vazifa | PostgreSQL | Elasticsearch yoki OpenSearch |
|---|---|---|
| Stemming bilan so‘zlar bo‘yicha qidiruv | Ha | Ha |
| Xatolarga chidamlilik | pg_trgm | O‘rnatilgan, moslashuvchan |
| Reyting | `ts_rank`, oddiyroq | BM25 relevantligi, boostlar, function score |
| Katta ma’lumotlarda ko‘p maydonli fasetlar | Mumkin, lekin og‘ir | Kuchli tomoni |
| Yuqori yuklamada avtoto‘ldirish | Mumkin | Maxsus maydon turlari |
| Sinonimlar, ko‘p tillar | Lug‘atlar, ko‘proq qo‘l mehnati | Boy analizatorlar zanjiri |
| Ekspluatatsiya narxi | Qo‘shimcha hech narsa | Alohida klaster va sinxronlash |

Qidiruv **mahsulotning asosiy funksiyasiga** aylanganda alohida tizimga o‘ting: ko‘p filtrli katta katalog, talabchan relevantlik sozlamalari yoki asosiy bazani yuklay boshlagan qidiruv so‘rovlari. Ungacha PostgreSQL arxitekturani sodda saqlaydi.

## FAQ

### PostgreSQL qidiruvi bitta jadvalda rus va o‘zbek tillari uchun ishlaydimi?

Ha. Har bir til uchun o‘z konfiguratsiyasi bilan alohida tsvector ustuni (yoki ifoda bo‘yicha alohida indeks) saqlang va ustunni foydalanuvchi interfeysi tiliga qarab tanlang.

### Jadval qanchalik katta bo‘lishi mumkin?

Yagona chegara yo‘q: hammasi matn hajmi, server va so‘rovlar xususiyatiga bog‘liq. Real ma’lumotlarda `EXPLAIN ANALYZE` orqali so‘rov vaqtini kuzating va indekslar hamda sozlash maqbul kechikishni ushlab turolmay qolganda qidiruv tizimini ko‘rib chiqing.

### Keyinroq Elasticsearch’ga o‘tish mumkinmi?

Ha. Koddagi qidiruvni alohida funksiya yoki servis ortida saqlang — shunda amalga oshirishni almashtirish ilovaning qolgan qismiga ta’sir qilmaydi.
