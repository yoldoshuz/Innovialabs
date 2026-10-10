---
title: Baza sxemasini to‘xtovsiz o‘zgartirish: expand and contract patterni
description: Katta PostgreSQL jadvalida ustun nomini o‘zgartirish, NOT NULL qo‘shish va indeks qurishni productionni bloklamasdan bajarish: expand and contract patterni.
summary: Ishlayotgan sxemani bitta buzuvchi qadamda o‘zgartirmang: avval kengaytiring (eskisi yonida yangi tuzilmalar qo‘shing), ma’lumot va kodni asta-sekin ko‘chiring, keyin qisqartiring — eski qismni hech kim ishlatmay qolganda o‘chiring.
---

## Qisqa javob

Sxemani o‘zgartirish ikki sababga ko‘ra to‘xtab qolishga olib keladi: o‘zgarish paytida so‘rovlarni to‘xtatadigan **blokirovkalar** va yangi sxemaning hali ishlab turgan ilova kodi bilan **mos kelmasligi**. **Expand and contract** patterni ikkalasini ham hal qiladi:

1. **Expand (kengaytirish)**: hech narsani o‘chirmasdan yangi ustun, jadval yoki indeks qo‘shasiz. Eski va yangi kod ham ishlaydi.
2. **Ko‘chirish**: ikkala tuzilmaga yozadigan kodni deploy qilasiz, eski ma’lumotlarni qismlab to‘ldirasiz, o‘qishni almashtirasiz.
3. **Contract (qisqartirish)**: eski tuzilmani hech bir kod ishlatmay qolganda uni o‘chirasiz.

Har bir qadam — alohida, kichik va orqaga qaytariladigan deploy.

## Nolinchi qoida: blokirovka navbatidan himoya

PostgreSQL’da ko‘pchilik `ALTER TABLE` buyruqlari `ACCESS EXCLUSIVE` blokirovkasini talab qiladi. O‘zgarishning o‘zi bir zumda bo‘lsa ham, u joriy tranzaksiyalar tugashini kutadi, **barcha yangi so‘rovlar esa uning ortidan navbatga turadi**. Bitta uzun hisobot jadvalni hamma uchun muzlatib qo‘yishi mumkin.

Migratsiya sessiyasida doim qisqa blokirovka taymautini belgilang va muvaffaqiyatsizlikda qayta urining:

```sql
SET lock_timeout = '3s';
SET statement_timeout = '15min';
ALTER TABLE orders ADD COLUMN note text;
```

Blokirovka o‘z vaqtida olinmasa, migratsiya servisni yiqitmasdan, toza xato bilan tugaydi.

## Ustun nomini o‘zgartirish

`ALTER TABLE ... RENAME COLUMN` bir zumda bajariladi, lekin eski kodning barcha ishlayotgan nusxalarini buzadi. Buni bosqichma-bosqich qiling. Misol: `name` ustuni `full_name` ga aylanadi.

1. **Expand**: `ALTER TABLE users ADD COLUMN full_name text;`
2. **Ikki tomonlama yozish**: ikkala ustunga yozadigan kodni (yoki `name` ni `full_name` ga ko‘chiradigan trigger) deploy qiling.
3. **Backfill**ni uzun tranzaksiya va replika kechikishidan qochish uchun kichik qismlarda bajaring:

```sql
UPDATE users SET full_name = name
WHERE id IN (
  SELECT id FROM users
  WHERE full_name IS NULL
  LIMIT 5000
);
-- 0 qator yangilanmaguncha takrorlang
```

4. **O‘qishni** `full_name` ga o‘tkazing, keyin `name` ga yozishni to‘xtating.
5. **Contract**: `ALTER TABLE users DROP COLUMN name;` — keyingi relizlardan birida.

## NOT NULL ustun qo‘shish

Zamonaviy PostgreSQL versiyalarida nullable ustun yoki o‘zgarmas default qiymatli ustun qo‘shish jadvalni qayta yozmaydi — faqat metama’lumot o‘zgaradi. Xavfli qismi — mavjud ustunda `NOT NULL` ni yoqish: oddiy `SET NOT NULL` butun jadvalni eksklyuziv blokirovka ostida skanerlaydi.

Xavfsiz ketma-ketlik:

```sql
-- 1. Cheklovsiz qo‘shamiz
ALTER TABLE orders ADD COLUMN currency text;

-- 2. Kod maydonni doim to‘ldiradi, eski qatorlarni qismlab to‘ldiramiz

-- 3. Tekshirilmagan CHECK qo‘shamiz (tez)
ALTER TABLE orders ADD CONSTRAINT orders_currency_nn
  CHECK (currency IS NOT NULL) NOT VALID;

-- 4. Yozishni bloklamasdan tekshiramiz
ALTER TABLE orders VALIDATE CONSTRAINT orders_currency_nn;

-- 5. Ixtiyoriy: haqiqiy NOT NULL ga aylantiramiz (yangi PostgreSQL
--    versiyalari tekshirilgan CHECK’dan foydalanib, skanerlamaydi)
ALTER TABLE orders ALTER COLUMN currency SET NOT NULL;
ALTER TABLE orders DROP CONSTRAINT orders_currency_nn;
```

Xuddi shu `NOT VALID`, keyin `VALIDATE` usuli foreign key’lar uchun ham ishlaydi.

## Indeksni bloklamasdan qurish

Oddiy `CREATE INDEX` tugaguncha jadvalga yozishni bloklaydi. Katta jadvalda bu uzoq davom etishi mumkin. Buning o‘rniga:

```sql
CREATE INDEX CONCURRENTLY idx_orders_customer
  ON orders (customer_id);
```

Bilish kerak bo‘lgan narsalar:

- Buyruq **tranzaksiya ichida ishlamaydi**, shuning uchun ko‘p migratsiya vositalariga tranzaksiya o‘ramini o‘chiradigan maxsus bayroq kerak.
- U sekinroq va jadvaldan ikki marta o‘tadi.
- Xato bo‘lsa, **INVALID indeks** qoladi. Uni `DROP INDEX CONCURRENTLY` bilan o‘chirib, qayta urining.
- O‘chirish va qayta qurish uchun `DROP INDEX CONCURRENTLY` va `REINDEX CONCURRENTLY` bor.

MySQL InnoDB’da ko‘p amallar online DDL’ni qo‘llab-quvvatlaydi (`ALGORITHM=INPLACE, LOCK=NONE`), gh-ost yoki pt-online-schema-change kabi vositalar esa jadvalni fonda qayta quradi.

## Migratsiyadan oldin tekshiruv ro‘yxati

- O‘zgarish hozir productionda turgan kod bilan **orqaga mos**mi?
- Qaysi buyruqlar eksklyuziv blokirovka oladi yoki jadvalni qayta yozadi? Aynan shu `ALTER` shakli uchun hujjatni tekshiring.
- `lock_timeout` belgilanganmi va qayta urinish bormi?
- Backfill qismlab, pauzalar bilan va replika kechikishini kuzatib bajariladimi?
- Har bir qadamni alohida orqaga qaytarish mumkinmi?
- Migratsiyani production hajmidagi ma’lumot nusxasida sinab ko‘rdingizmi?

## Ko‘p uchraydigan xatolar

- Ustun turini joyida o‘zgartirish (`ALTER COLUMN TYPE`) — ko‘pincha bu butun jadvalni qayta yozadi. Yangi ustun va backfill yaxshiroq.
- Eski nusxalar hali ishlayotgan paytda, kod ustunni ishlatishni to‘xtatgan relizning o‘zida uni o‘chirish.
- Backfill uchun bitta ulkan `UPDATE`: jadval shishadi, replikalar orqada qoladi.
- ORM ustunlar ro‘yxatini keshlab, o‘chirishdan keyin xato berishi mumkinligini unutish.

## FAQ

### Kichik jadvallar uchun ham expand and contract kerakmi?

Kichik jadvallarda to‘g‘ridan-to‘g‘ri o‘zgarish odatda bir zumda o‘tadi. Lekin moslik muammosi qoladi: deploy paytida eski kod hali ishlayotgan bo‘lsa, ustun nomini o‘zgartirish yoki o‘chirish baribir so‘rovlarni buzadi.

### Contract qadamidan oldin qancha kutish kerak?

Barcha nusxalar yangi kodga o‘tmaguncha va orqaga qaytish kerak bo‘lmasligiga ishonch hosil qilmaguningizcha. Amalda ko‘p jamoalar contract’ni keyingi reliz siklida bajaradi.

### Migratsiya vositalari buni avtomatik qila oladimi?

Ba’zilari xavfli amallar haqida ogohlantiradi yoki ularni xavfsiz bajaradi, lekin hech biri ilovangizning mosligini bilmaydi. Bosqichli reja baribir sizning vazifangiz. [PostgreSQL ALTER TABLE hujjatida](https://www.postgresql.org/docs/current/sql-altertable.html) har bir shakl uchun blokirovka darajasi ko‘rsatilgan.
