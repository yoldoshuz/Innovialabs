---
title: SQL so‘rovlarini optimallashtirish bo‘yicha chek-list
description: Sekin SQL so‘rovlar uchun amaliy chek-list: EXPLAIN, kerakli ustunlar, sargable shartlar, indekslar, OFFSET’siz sahifalash, paketlar va N+1.
summary: Avval so‘rovni EXPLAIN ANALYZE bilan o‘lchang, keyin faqat kerakli ustunlarni tanlang, indeksdan foydalana oladigan shartlar yozing, OFFSET o‘rniga keyset sahifalashni qo‘llang va N+1 ni paketli so‘rovlar bilan yo‘qoting.
---

## Qisqa javob

Sekin so‘rov deyarli har doim uch narsadan biriga borib taqaladi: baza **juda ko‘p qator o‘qiydi**, **juda ko‘p ma’lumot uzatadi** yoki ilova **juda ko‘p so‘rov yuboradi**. Quyidagi chek-list aynan shu tartibda tuzilgan. Misollar PostgreSQL uchun, lekin g‘oyalar MySQL va boshqa tizimlarga ham mos.

## 0-qadam: taxmin qilmang, o‘lchang

Biror narsani o‘zgartirishdan oldin bajarilish rejasini ko‘ring:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, total FROM orders WHERE customer_id = 42;
```

Rejada nimaga qarash kerak:

- bir nechta qator kutilgan joyda katta jadval bo‘yicha **Seq Scan**;
- kutilgan (`rows=`) va haqiqiy qatorlar soni orasidagi katta farq — statistikani `ANALYZE` bilan yangilash uchun signal;
- vaqtning asosiy qismi sarflanayotgan tugunlar.

Qaysi so‘rovlarni optimallashtirish kerakligini topish uchun `pg_stat_statements` kengaytmasini yoqing — u so‘rovlarni umumiy vaqt bo‘yicha saralaydi. Esda tuting: `EXPLAIN ANALYZE` so‘rovni haqiqatan bajaradi, shuning uchun `UPDATE` va `DELETE` ni tranzaksiya ichida tekshirib, `ROLLBACK` qiling.

## Chek-list

### 1. Faqat kerakli ustunlarni tanlang

`SELECT *` tarmoq orqali ortiqcha ma’lumot tortadi, qoplovchi indekslardan foydalanishga xalaqit beradi va jadvalga og‘ir ustun qo‘shilganda muammo tug‘diradi. Maydonlarni aniq sanab o‘ting.

### 2. Sargable shartlar yozing

**Sargable** — baza indeks orqali bajara oladigan shart. Ustunni funksiya yoki ifoda ichiga o‘rash odatda bunga xalaqit beradi.

| Yomon | Yaxshiroq |
|---|---|
| `WHERE date(created_at) = '2026-01-15'` | `WHERE created_at >= '2026-01-15' AND created_at < '2026-01-16'` |
| `WHERE lower(email) = 'a@b.uz'` | `lower(email)` ifodasi bo‘yicha indeks yoki yozishda normallashtirish |
| `WHERE price * 1.12 > 1000` | `WHERE price > 1000 / 1.12` |
| `WHERE name LIKE '%ov'` | to‘liq matnli qidiruv yoki trigram indeks (`pg_trgm`) |

**Turlar mosligiga** ham e’tibor bering: matnli ustunni son bilan solishtirish turni o‘zgartirishga va indeksdan voz kechishga olib kelishi mumkin.

### 3. Indekslarni tekshiring

- Tez-tez bajariladigan so‘rovlardagi `WHERE`, `JOIN` va `ORDER BY` ustunlarini indekslang.
- **Tarkibli indeksda** tartib muhim: avval tenglik sharti bor ustunlar, keyin diapazon yoki saralash. `(customer_id, created_at)` indeksi «mijozning davr bo‘yicha buyurtmalari» uchun mos.
- **Tashqi kalitlarni** indekslang — PostgreSQL ular uchun indeksni avtomatik yaratmaydi.
- «Har ehtimolga qarshi» indeks qo‘shmang: har biri yozishni sekinlashtiradi va joy egallaydi. Ishlatilmayotganlari `pg_stat_user_indexes` da ko‘rinadi.

### 4. OFFSET’siz sahifalash

`OFFSET 100000 LIMIT 20` bazani yuz ming qatorni o‘qib, tashlab yuborishga majbur qiladi. Sahifa qanchalik uzoq bo‘lsa, shunchalik sekin. **Keyset sahifalash**dan foydalaning — oxirgi ko‘rilgan qiymatdan davom etish:

```sql
SELECT id, created_at, total
FROM orders
WHERE (created_at, id) < ($1, $2)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

Buning uchun `(created_at, id)` indeksi kerak. Kamchiligi — darhol 500-sahifaga sakrab bo‘lmaydi, lekin lentalar va cheksiz aylantirish uchun bu kerak ham emas.

### 5. Ma’lumotlarni paketlab qayta ishlang

- Ko‘p qatorni mingta alohida so‘rov bilan emas, bitta `INSERT ... VALUES (...), (...)` yoki `COPY` orqali qo‘shing.
- Katta `UPDATE` va `DELETE` ni kalit bo‘yicha qismlarga bo‘ling — bloklashlar qisqaroq, replikatsiyaga yuk kamroq bo‘ladi.
- Ilova tarmoq chaqiruvlarini bajarayotganda tranzaksiyani ochiq ushlab turmang.

### 6. N+1 ni yo‘qoting

**N+1** — ilova N ta yozuvdan iborat ro‘yxatni olib, keyin har biri uchun yana bittadan so‘rov yuborishi. Yuzta buyurtma — bir yuz bitta so‘rov. ORM’da bu ko‘pincha sezilmay qoladi.

Yechimlar:

- `JOIN` bilan bitta so‘rov;
- barcha kerakli id’lar uchun `WHERE id = ANY($1)` bilan ikkinchi so‘rov;
- ORM’da bog‘lanishlarni oldindan yuklash (`include`, `select_related`, `prefetch_related` va shunga o‘xshashlar).

N+1 ni ishlab chiqish rejimidagi so‘rovlar logi tez ko‘rsatadi: bitta sahifani ochganda turli id bilan o‘nlab bir xil so‘rov — aynan shu.

### 7. Natijani tekshiring

O‘zgarishdan keyin `EXPLAIN (ANALYZE, BUFFERS)` ni real hajmdagi ma’lumotlarda qayta ishga tushiring. Test bazasidagi yuzta qatorda tez ishlagan so‘rov millionlab qatorda boshqacha ishlashi mumkin.

## Keng tarqalgan xatolar

- Soatiga minglab marta chaqiriladigan so‘rov o‘rniga kuniga bir marta ishlaydiganini optimallashtirish.
- Bo‘sh lokal bazada test qilish.
- Reja indeksni haqiqatan ishlatayotganini tekshirmasdan indeks qo‘shish.
- Sababini tushunmasdan sekin so‘rovlarni kesh bilan yashirish.

## FAQ

### Nega baza men yaratgan indeksni ishlatmayapti?

Odatiy sabablar: shart sargable emas, turlar mos emas, statistika eskirgan yoki so‘rov jadvalning katta qismini qaytaradi va ketma-ket o‘qish haqiqatan arzonroq. Jadvalga `ANALYZE` qilib, `EXPLAIN` ni qayta ishga tushirishdan boshlang.

### Tezlik uchun ORM’dan voz kechish kerakmi?

Yo‘q. ORM ko‘pchilik so‘rovlar uchun qulay. U yaratayotgan SQL’ni ko‘rib boring, bog‘lanishlarni oldindan yuklang va bir nechta og‘ir hisobotlar uchun toza SQL yozing.

### Sekin so‘rovlarni qanchalik tez-tez ko‘rib chiqish kerak?

`pg_stat_statements` yuqorisini muntazam tekshirish qulay, masalan yirik relizlardan keyin yoki ma’lumotlar sezilarli o‘sganda. Yuklama mahsulot bilan birga o‘zgaradi va kechagi tez so‘rov bugun tor joyga aylanishi mumkin.
