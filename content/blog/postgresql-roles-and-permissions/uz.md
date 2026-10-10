---
title: PostgreSQL da foydalanuvchilar, rollar va kirish huquqlari
description: PostgreSQL da ilova, tahlilchilar va adminlar uchun alohida rollarni sozlash: GRANT, default privileges, BI uchun faqat o‘qish foydalanuvchisi va RLS asoslari.
summary: PostgreSQL da to‘g‘ri huquqlar sxemasi — kirish huquqisiz guruh rollari (egasi, ilova, analitika) va ularga a’zo alohida loginlar; huquqlar GRANT va ALTER DEFAULT PRIVILEGES orqali beriladi, BI faqat o‘qiydi, qatorlarni ajratishni esa Row-Level Security ta’minlaydi.
---

## Qisqa javob

Ilovani `postgres` superfoydalanuvchisi ostida ishlatmang. Ishchi sxema:

- **app_owner** — sxema va jadvallar egasi, migratsiyalar shu rol ostida bajariladi.
- **app_rw** — ma’lumotlarni o‘qish va yozish, tuzilmani o‘zgartirish huquqisiz. Ilova shu rol ostida ishlaydi.
- **analytics_ro** — faqat o‘qish, tahlilchilar va BI uchun.
- **Adminlar** — umumiy parol emas, shaxsiy hisob yozuvlari.

PostgreSQL da foydalanuvchi va guruh — bir narsa: **rol**. `LOGIN` li rol — foydalanuvchi, `LOGIN` siz rol — huquqlar guruhi.

## 1-qadam. Guruh rollari va sxema yaratamiz

```sql
REVOKE ALL ON DATABASE shop FROM PUBLIC;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;

CREATE ROLE app_owner NOLOGIN;
CREATE ROLE app_rw NOLOGIN;
CREATE ROLE analytics_ro NOLOGIN;

CREATE SCHEMA app AUTHORIZATION app_owner;
```

Birinchi ikki qator standart holatda hammada (`PUBLIC`) bo‘lgan huquqlarni olib tashlaydi. PostgreSQL ning yangi versiyalarida `public` sxemasida obyekt yaratish hammaga allaqachon taqiqlangan, lekin aniq buyruq zarar qilmaydi.

## 2-qadam. GRANT orqali huquq beramiz

```sql
GRANT CONNECT ON DATABASE shop TO app_owner, app_rw, analytics_ro;
GRANT USAGE ON SCHEMA app TO app_rw, analytics_ro;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA app TO app_rw;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA app TO app_rw;

GRANT SELECT ON ALL TABLES IN SCHEMA app TO analytics_ro;
```

Muhim: `ON ALL TABLES` **faqat mavjud** jadvallarga taalluqli. Kelajakdagi jadvallar uchun keyingi qadam kerak.

## 3-qadam. Yangi jadvallar uchun default privileges

```sql
ALTER DEFAULT PRIVILEGES FOR ROLE app_owner IN SCHEMA app
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_rw;
ALTER DEFAULT PRIVILEGES FOR ROLE app_owner IN SCHEMA app
  GRANT USAGE, SELECT ON SEQUENCES TO app_rw;
ALTER DEFAULT PRIVILEGES FOR ROLE app_owner IN SCHEMA app
  GRANT SELECT ON TABLES TO analytics_ro;
```

Asosiy tuzoq: default privileges faqat **ko‘rsatilgan rol** (`FOR ROLE app_owner`) yaratgan obyektlarga ta’sir qiladi. Agar migratsiyalar `migrator` logini ostida bajarilsa va u jadvallarni o‘z nomidan yaratsa, qoidalar qo‘llanmaydi. Yechim — migratsiyalarni `SET ROLE app_owner;` bilan boshlash.

## 4-qadam. Loginlar yaratamiz

```sql
CREATE ROLE migrator  LOGIN PASSWORD 'change-me' IN ROLE app_owner;
CREATE ROLE app_user  LOGIN PASSWORD 'change-me' IN ROLE app_rw;
CREATE ROLE bi_reader LOGIN PASSWORD 'change-me' IN ROLE analytics_ro;
```

Parollarni tasodifiy yarating va maxfiy kalitlar menejerida saqlang. Shunda xodim ketganda yoki ma’lumot sizib chiqqanda huquqlarga tegmasdan bitta loginni o‘chirish kifoya.

## BI uchun faqat o‘qish foydalanuvchisi

`analytics_ro` huquqlari yozishga allaqachon ruxsat bermaydi. Og‘ir so‘rovlardan himoya qo‘shing:

```sql
ALTER ROLE bi_reader SET default_transaction_read_only = on;
ALTER ROLE bi_reader SET statement_timeout = '60s';
ALTER ROLE bi_reader CONNECTION LIMIT 5;
```

- `default_transaction_read_only` — qo‘shimcha himoya, lekin huquqlar o‘rnini bosmaydi: foydalanuvchi uni o‘zi o‘chira oladi.
- **Maxfiy ma’lumotlarni** (telefonlar, pasport ma’lumotlari) butun jadval holida bermang. Faqat kerakli ustunlardan iborat view lar bilan alohida `reporting` sxemasini yarating va BI ga faqat unga kirish huquqini bering.
- Imkon bo‘lsa, BI ni asosiy bazaga emas, **replikaga** ulang.

Tezkor sozlash uchun o‘rnatilgan `pg_read_all_data` roli bor (PostgreSQL 14+), lekin u **barcha** jadvallarni, jumladan maxfiylarini ham o‘qishga ochadi.

## Row-Level Security asoslari

**RLS** rol qaysi qatorlarni ko‘rishini cheklaydi. Odatiy holat — bitta jadvalda bir nechta mijoz ma’lumotlari saqlanadigan SaaS:

```sql
ALTER TABLE app.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON app.orders
  FOR ALL TO app_rw
  USING (tenant_id = nullif(current_setting('app.tenant_id', true), '')::bigint)
  WITH CHECK (tenant_id = nullif(current_setting('app.tenant_id', true), '')::bigint);
```

Ilova har bir tranzaksiya boshida mijozni belgilaydi:

```sql
SELECT set_config('app.tenant_id', '42', true);
```

Nimani yodda tutish kerak:

- Qiymat berilmagan bo‘lsa, siyosat bo‘sh natija qaytaradi — bu xavfsiz standart xatti-harakat.
- Mos siyosati bo‘lmagan rol RLS yoqilgan jadvalda **birorta ham qatorni** ko‘rmaydi — tahlilchilarga o‘z siyosati kerak.
- Jadval egasi va superfoydalanuvchilar RLS ni chetlab o‘tadi. Kerak bo‘lsa, ega uchun `FORCE ROW LEVEL SECURITY` ni yoqing.

## Adminlar va tekshiruv

- Har bir admin uchun shaxsiy rol, superhuquqlar kerak bo‘lmasa, `SUPERUSER` o‘rniga `CREATEROLE` va `CREATEDB` bilan.
- `pg_hba.conf` da `scram-sha-256` orqali kirish, faqat kerakli manzillardan.
- psql da tekshirish: `\du` — rollar, `\dp app.*` — jadvallarga huquqlar, `\ddp` — default privileges.

## FAQ

### Nega ilova yangi jadvalda «permission denied» oladi?

Deyarli har doim jadvalni default privileges sozlangan rol emas, boshqa rol yaratgan. Jadval egasini `\dt app.*` orqali tekshiring va migratsiyalarni `SET ROLE app_owner` dan keyin bajaring.

### USER ning ROLE dan farqi nimada?

Prinsipial farq yo‘q: `CREATE USER` — bu standart holatda `LOGIN` atributli `CREATE ROLE`. Kirish huquqisiz rollarni guruh sifatida, loginlarni esa ularning a’zolari sifatida ishlating.

### Filtrlash kodda bo‘lsa, RLS kerakmi?

RLS — himoyaning ikkinchi qatlami: kodda `WHERE tenant_id = ...` sharti unutilgan taqdirda ham ishlaydi. Turli mijozlar ma’lumotlari bitta bazada saqlanadigan tizimlar uchun bu o‘zini oqlaydigan sug‘urta.
