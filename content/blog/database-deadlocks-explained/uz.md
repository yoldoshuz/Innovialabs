---
title: Bazadagi o‘zaro blokirovkalar (deadlock): sabablari va yechimlari
description: Qator va jadval blokirovkalari qanday qilib deadlock’ga olib keladi, PostgreSQL va MySQL’da deadlock loglarini qanday o‘qish va ularni qanday bartaraf etish.
summary: Deadlock ikki tranzaksiya bir-biriga kerak bo‘lgan blokirovkalarni ushlab turganda yuzaga keladi va baza ulardan birini bekor qiladi; yechim — blokirovkalarni hamma joyda bir xil tartibda olish, tranzaksiyalarni qisqa tutish va bekor qilingan tranzaksiyani qayta bajarish.
---

## Qisqa javob

**O‘zaro blokirovka (deadlock)** — bu sikl: A tranzaksiyasi blokirovkani ushlab, B ni kutadi, B esa blokirovkani ushlab, A ni kutadi. Hech biri davom eta olmaydi. PostgreSQL va MySQL siklni aniqlaydi, **bitta tranzaksiyani** xato bilan **bekor qiladi** va ikkinchisiga tugashga imkon beradi.

Deadlock — ma’lumotlarning buzilishi emas. Bu kod blokirovkalarni nomuvofiq tartibda olayotganidan darak. Davosi — tartib, qisqa tranzaksiyalar va «qurbon» uchun qayta urinish.

## Blokirovkalar qanday qilib sikl hosil qiladi

Klassik holat — bir xil hisoblar o‘rtasida qarama-qarshi yo‘nalishdagi ikki o‘tkazma:

```sql
-- A sessiyasi                       -- B sessiyasi
BEGIN;                                BEGIN;
UPDATE accounts SET balance = balance - 10 WHERE id = 1;
                                      UPDATE accounts SET balance = balance - 10 WHERE id = 2;
UPDATE accounts SET balance = balance + 10 WHERE id = 2;  -- B ni kutadi
                                      UPDATE accounts SET balance = balance + 10 WHERE id = 1;  -- A ni kutadi: deadlock
```

Boshqa ko‘p uchraydigan manbalar:

- **Tasodifiy tartibdagi paketli yangilashlar**: ikki vazifa `ORDER BY` siz bir-biriga kesishgan qatorlar to‘plamini yangilaydi.
- **Blokirovkani kuchaytirish**: ikkala tranzaksiya umumiy blokirovka oladi (`FOR SHARE` yoki foreign key tekshiruvida yashirin tarzda), keyin bir xil qatorni yangilashga urinadi.
- **Foreign key’lar**: bola qatorlarni qo‘shish ota qatorni umumiy rejimda bloklaydi, bu esa o‘sha ota qatorni yangilash bilan to‘qnashadi.
- **MySQL’dagi gap va next-key blokirovkalar**: Repeatable Read’da InnoDB indeks yozuvlari orasidagi oraliqlarni bloklaydi, shuning uchun bir oraliqqa parallel qo‘shishlar hatto turli kalitlar bilan ham deadlock berishi mumkin.
- **MySQL’da indeks yo‘qligi**: InnoDB skanerlangan qatorlarni bloklaydi, mos indekssiz `UPDATE` o‘zgartirganidan ancha ko‘p qatorni bloklaydi.
- **Jadval va qator blokirovkalarini aralashtirish**: bir tranzaksiyada aniq `LOCK TABLE` yoki DDL, boshqasi esa qator blokirovkalarini ushlab turgan paytda.

## PostgreSQL’da deadlock logini o‘qish

PostgreSQL `deadlock_timeout` davomida kutadi, keyin siklni tekshiradi va SQLSTATE `40P01` ni qaytaradi:

```text
ERROR:  deadlock detected
DETAIL:  Process 4121 waits for ShareLock on transaction 9812; blocked by process 4135.
         Process 4135 waits for ShareLock on transaction 9811; blocked by process 4121.
HINT:  See server log for query details.
CONTEXT:  while updating tuple (0,7) in relation "accounts"
```

Qanday o‘qish kerak: ikki jarayon, har biri ikkinchisining tranzaksiyasi tugashini kutyapti. Server logida ikkala jarayonning aniq so‘rovlari bor. Deadlock’ga aylanmagan uzoq kutishlarni ham ko‘rish uchun `log_lock_waits = on` ni yoqing.

## MySQL’da deadlock logini o‘qish

InnoDB deadlock’ni darhol aniqlaydi va 1213 xatosini qaytaradi:

```text
ERROR 1213 (40001): Deadlock found when trying to get lock; try restarting transaction
```

`SHOW ENGINE INNODB STATUS` ni bajaring va **LATEST DETECTED DEADLOCK** bo‘limini toping. Har bir tranzaksiya uchun u yerda oxirgi so‘rov, **HOLDS THE LOCK(S)** va **WAITING FOR THIS LOCK TO BE GRANTED** indeks va blokirovka turi bilan (`lock_mode X`, `locks gap before rec`, `insert intention`) ko‘rsatiladi. Oxirgi qatorda qaysi tranzaksiya bekor qilingani yoziladi. U yerda faqat oxirgi holat saqlanadi; barcha deadlock’larni xatolar logiga yozish uchun `innodb_print_all_deadlocks = ON` ni belgilang.

## Deadlock’ni qanday bartaraf etish

**1. Bir xil tartibda bloklang.** Agar kodning har bir tarmog‘i qatorlarni ID o‘sish tartibida bloklasa, sikl hosil bo‘lmaydi:

```sql
BEGIN;
SELECT id FROM accounts WHERE id IN (1, 2) ORDER BY id FOR UPDATE;
UPDATE accounts SET balance = balance - 10 WHERE id = 1;
UPDATE accounts SET balance = balance + 10 WHERE id = 2;
COMMIT;
```

Jadvallar uchun ham shunday: tranzaksiya `orders` va `payments` ga tegsa, doim bir xil tartibda tegsin.

**2. Eng kuchli blokirovkani darhol oling.** Umumiy blokirovka bilan o‘qib, keyin uni kuchaytirish o‘rniga boshidanoq `FOR UPDATE` ishlating.

**3. Tranzaksiyalarni qisqa tuting.** Blokirovkalar ushlab turilganda tarmoq chaqiruvlari, foydalanuvchini kutish yoki og‘ir hisob-kitoblar bo‘lmasin.

**4. Katta paketlarni** primary key bo‘yicha saralangan kichik qismlarga bo‘ling.

**5. Kerakli indekslarni qo‘shing**, ayniqsa MySQL’da, shunda so‘rovlar faqat kerakli qatorlarni bloklaydi.

**6. Bekor qilingan tranzaksiyani qayta bajaring.** Yaxshi dizaynda ham yuklama ostida deadlock bo‘lishi mumkin. Alohida so‘rovni emas, **butun tranzaksiyani** kichik tasodifiy pauza bilan qayta bajaring:

```python
for attempt in range(3):
    try:
        with conn.transaction():
            transfer(conn, from_id, to_id, amount)
        break
    except DeadlockDetected:
        if attempt == 2:
            raise
        time.sleep(random.uniform(0.05, 0.2) * (attempt + 1))
```

Tranzaksiyani qayta bajarish xavfsiz ekaniga ishonch hosil qiling: ichida xat yuborilmasin va tashqi API chaqirilmasin.

## Deadlock yoki shunchaki uzoq kutish?

Oddiy blokirovka kutishi deadlock emas: bir tranzaksiya shunchaki boshqasi tugashini kutadi. Bu xato sifatida emas, sekin so‘rovlar sifatida namoyon bo‘ladi. Bunday kutishlarni PostgreSQL’da `lock_timeout` yoki MySQL’da `innodb_lock_wait_timeout` bilan cheklang, kim kimni bloklayotganini esa `pg_locks` va `pg_stat_activity` orqali ko‘ring.

## FAQ

### Deadlock aniqlashni o‘chirib qo‘ysa bo‘ladimi?

Bunga tayanmaslik kerak. Aniqlashsiz sikldagi tranzaksiyalar taymautgacha kutib, blokirovkalarni ushlab va boshqalarga xalaqit berib turardi. Aniqlash va qayta urinishlar — xavfsizroq standart variant.

### Yuqoriroq izolyatsiya darajasi deadlock’ning oldini oladimi?

Yo‘q. Yuqori darajalar qo‘shimcha blokirovkalar yoki serializatsiya xatolarini keltirib chiqarishi mumkin. Deadlock’ning oldini izolyatsiya darajasi emas, blokirovkalar tartibi va tranzaksiyalar tuzilishi oladi.

### Qancha deadlock bo‘lishi normal?

Muvaffaqiyatli qayta bajariladigan kamdan-kam deadlock’lar parallel ishlashning odatiy qismi. Loglarda doimiy yoki o‘sib borayotgan son esa kodning muayyan tarmog‘i blokirovkalarni nomuvofiq tartibda olayotganini bildiradi va uni tuzatish kerak.
