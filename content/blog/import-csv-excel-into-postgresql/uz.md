---
title: CSV va Excel fayllarini PostgreSQL’ga qanday import qilish
description: CSV va Excel fayllarini COPY, \copy, DBeaver va Python orqali PostgreSQL’ga yuklash: kodirovka, ajratgichlar, sanalar, dublikatlar va tekshiruv.
summary: Faylni avval COPY, \copy, DBeaver yoki Python bilan matnli ustunlardan iborat staging jadvaliga yuklang, keyin turlarni o‘zgartiring, dublikatlarni olib tashlang va faqat tekshirilgan qatorlarni asosiy jadvalga o‘tkazing.
---

## Qisqa javob

Har qanday vosita uchun bitta ishonchli tartib bor:

1. Faylni o‘z holicha barcha ustunlari `text` bo‘lgan staging jadvaliga **yuklash**.
2. Turlar, sanalar va formatlarni SQL bilan **o‘zgartirish**.
3. Dublikatlarni ajratib, ma’lumotni asosiy jadvalga **ko‘chirish**.
4. Natijani **tekshirish**: qatorlar soni, bo‘sh qiymatlar, summalar.

Shunda fayldagi bitta xato qator butun importni to‘xtatmaydi, yomon ma’lumot esa ishchi jadvallarga tushmaydi.

## Qaysi vositani tanlash

| Usul | Qachon mos |
|---|---|
| `COPY` | Fayl baza serverida turibdi, tezlik va katta hajm kerak |
| psql’dagi `\copy` | Fayl sizning kompyuteringizda, baza esa masofada |
| DBeaver | Buyruq qatorisiz bir martalik yuklash, ustunlarni vizual moslashtirish |
| Python (pandas) | Bir nechta varaqli Excel, murakkab tozalash, muntazam avtomatik import |

## Staging jadvalini tayyorlash

```sql
CREATE TABLE staging_clients (
  name    text,
  phone   text,
  city    text,
  created text
);
```

Matnli ustunlar hamma narsani qabul qiladi: «12.03.2026», «n/a», bo‘sh joylar. Ular bilan SQL’da ishlash qulayroq.

## COPY va \copy

`COPY` faylni PostgreSQL **serverida** o‘qiydi. Buning uchun superuser huquqi yoki `pg_read_server_files` roli kerak.

```sql
COPY staging_clients (name, phone, city, created)
FROM '/var/lib/postgresql/import/clients.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ';', ENCODING 'WIN1251');
```

`\copy` — psql mijozining buyrug‘i: fayl **sizning kompyuteringizda** o‘qiladi va serverga uzatiladi. Buyruq bitta qatorda yoziladi:

```text
\copy staging_clients (name, phone, city, created) FROM 'clients.csv' WITH (FORMAT csv, HEADER true, DELIMITER ';', ENCODING 'WIN1251')
```

Asosiy parametrlar:

- **DELIMITER** — rus yoki o‘zbek lokalidagi Excel CSV’ni ko‘pincha vergul emas, nuqtali vergul bilan saqlaydi.
- **ENCODING** — Excel va 1C’dan eski eksportlar `WIN1251` da bo‘lishi mumkin. Kirill harflari o‘rniga tushunarsiz belgilar chiqsa, muammo kodirovkada. Yaxshisi darhol «CSV UTF-8» sifatida saqlang.
- **HEADER** — sarlavha qatorini o‘tkazib yuborish.

## DBeaver

Faylni bir marta va konsolsiz yuklash kerak bo‘lganda qulay:

1. Staging jadvaliga o‘ng tugma → **Import Data** → CSV.
2. Import sozlamalarida kodirovka, ajratgich va sana formatini ko‘rsating.
3. Fayl va jadval ustunlarining mosligini tekshiring.
4. Importni ishga tushiring va xatolar logini ko‘ring.

Excel faylini oldin CSV sifatida saqlang yoki Python’dan foydalaning.

## Python va Excel

Excel uchun pandas eng qulay: u `.xlsx` varaqlarini to‘g‘ridan-to‘g‘ri o‘qiydi (`openpyxl` paketi kerak).

```python
import pandas as pd
from sqlalchemy import create_engine

df = pd.read_excel("clients.xlsx", sheet_name="Mijozlar", dtype=str)
df.columns = ["name", "phone", "city", "created"]

engine = create_engine("postgresql+psycopg://user:password@localhost:5432/shop")
df.to_sql("staging_clients", engine, if_exists="append", index=False, chunksize=1000)
```

`dtype=str` muhim: busiz telefon raqamlari songa aylanadi, boshidagi nollar yo‘qoladi, uzun raqamlar esa eksponensial ko‘rinishga o‘tishi mumkin. Baza parolini kodda emas, muhit o‘zgaruvchilarida saqlang.

## Sanalar, formatlar va dublikatlar

Ma’lumotni bitta so‘rov bilan o‘zgartirib, ko‘chiring:

```sql
INSERT INTO clients (name, phone, city, created_at)
SELECT DISTINCT ON (phone_clean)
       trim(name),
       phone_clean,
       nullif(trim(city), ''),
       to_date(created, 'DD.MM.YYYY')
FROM (
  SELECT *, regexp_replace(phone, '\D', '', 'g') AS phone_clean
  FROM staging_clients
) s
WHERE phone_clean <> ''
ORDER BY phone_clean
ON CONFLICT (phone) DO NOTHING;
```

Bu yerda nima bo‘ladi:

- aniq formatli `to_date` kun va oyni adashtirib yuborishga yo‘l qo‘ymaydi;
- telefonlar faqat raqamlarga keltiriladi, shunda «+998 90 123-45-67» va «998901234567» bitta raqam hisoblanadi;
- `DISTINCT ON` fayl ichidagi dublikatlarni, `ON CONFLICT` esa bazada allaqachon bor yozuvlarni o‘tkazib yuboradi (`phone` bo‘yicha unikal indeks kerak).

## Importdan keyingi tekshiruv

- Fayl, staging va asosiy jadvaldagi **qatorlar sonini** solishtiring. Farq dublikatlar va rad etilgan qatorlar bilan izohlanishi kerak.
- Majburiy maydonlardagi **NULL** larni sanang.
- **Summa va diapazonlarni** tekshiring: kelajakdagi sanalar yo‘q, manfiy summalar yo‘q.
- Bir nechta tasodifiy qatorni ko‘z bilan ko‘rib chiqing.

Tekshiruvdan muvaffaqiyatli o‘tgach, staging’ni `TRUNCATE` bilan tozalang.

## FAQ

### COPY va \copy nimasi bilan farq qiladi?

`COPY` serverda bajariladi va faylni server diskidan o‘qiydi, shuning uchun maxsus huquq talab qiladi. `\copy` ni kompyuteringizdagi psql bajaradi va ma’lumotni serverga yuboradi — masofadagi baza uchun odatiy tanlov.

### Import bitta qatorda to‘xtab qolsa nima qilish kerak?

Ma’lumotni matnli ustunli staging jadvaliga yuklang: shunda turni o‘zgartirishda xato chiqmaydi. Keyin muammoli qatorlarni so‘rov bilan toping, masalan shablonga mos kelmaydigan sanalarni, va ularni tuzatish yoki tashlab yuborishni hal qiling.

### Muntazam importni qanday sozlash mumkin?

Qadamlarni Python yoki SQL skriptiga jamlang, uni jadval bo‘yicha ishga tushiring (cron, vazifalar rejalashtiruvchisi yoki orkestrator) va har safar yuklangan hamda rad etilgan qatorlar sonini logga yozing.
