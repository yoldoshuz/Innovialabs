---
title: Tranzaksiya izolyatsiya darajalari: dirty read’dan serializable’gacha
description: Dirty read, takrorlanmaydigan o‘qish, fantomlar va yo‘qolgan yangilanishlar qanday yuzaga keladi, qaysi daraja ularni to‘sadi va SELECT FOR UPDATE nega kerak.
summary: Izolyatsiya darajasi parallel tranzaksiyalar qaysi anomaliyalarni ko‘rishini belgilaydi: Read Committed iflos o‘qishni, Repeatable Read takrorlanmaydigan o‘qishni ham to‘sadi, Serializable esa tranzaksiyalar navbat bilan bajarilgandek ishlaydi; «o‘qi-o‘zgartir-yoz» mantig‘i uchun SELECT FOR UPDATE yoki atomar UPDATE ishlating.
---

## Qisqa javob

Ikki tranzaksiya bir vaqtda bir xil ma’lumot bilan ishlaganda, baza har biri nimani ko‘rishini hal qilishi kerak. Ana shu qaror **izolyatsiya darajasi** deyiladi. Daraja qanchalik yuqori bo‘lsa, anomaliyalar shunchalik kam, lekin kutish yoki qayta bajarish kerak bo‘lgan bekor qilingan tranzaksiyalar ko‘proq.

| Daraja | Dirty read | Takrorlanmaydigan o‘qish | Fantom | Yo‘qolgan yangilanish |
|---|---|---|---|---|
| Read Uncommitted | mumkin | mumkin | mumkin | mumkin |
| Read Committed | yo‘q | mumkin | mumkin | mumkin |
| Repeatable Read | yo‘q | yo‘q | MBBTga bog‘liq | MBBTga bog‘liq |
| Serializable | yo‘q | yo‘q | yo‘q | yo‘q |

Sukut bo‘yicha **PostgreSQL Read Committed**, **MySQL InnoDB esa Repeatable Read** ishlatadi.

## To‘rtta anomaliya

Misollarda ikkita sessiya, A va B, hamda `accounts` jadvali bor.

**Iflos o‘qish (dirty read)**: A tranzaksiyasi B o‘zgartirgan, lekin hali commit qilmagan ma’lumotni o‘qiydi. B rollback qilsa, A hech qachon mavjud bo‘lmagan qiymat asosida qaror qilgan bo‘ladi.

```sql
-- B
BEGIN; UPDATE accounts SET balance = 0 WHERE id = 1;
-- A (MySQL’da Read Uncommitted) balance = 0 ni ko‘radi
-- B
ROLLBACK;
```

**Takrorlanmaydigan o‘qish**: A bitta tranzaksiya ichida qatorni ikki marta o‘qiydi va turli qiymat oladi, chunki orada B o‘zgarishni commit qildi.

**Fantom o‘qish**: A bir xil `WHERE` so‘rovini ikki marta bajaradi va boshqa qatorlar to‘plamini oladi, chunki B mos qatorlarni qo‘shdi yoki o‘chirdi.

**Yo‘qolgan yangilanish (lost update)**: ikkala tranzaksiya bir qiymatni o‘qiydi, ilovada yangisini hisoblaydi va yozadi. Ikkinchi yozuv birinchisini jimgina ustidan yozib yuboradi.

```sql
-- A va B balance = 100 ni o‘qidi
-- A 100 + 50 = 150 yozadi, commit
-- B 100 - 30 = 70 yozadi, commit  -> A’ning +50 i yo‘qoldi
```

## MVCC va darajalar ularni qanday to‘sadi

PostgreSQL va InnoDB **MVCC (ko‘p versiyali boshqaruv)** dan foydalanadi: yangilash qatorning yangi versiyasini yaratadi, o‘quvchilar esa yozuvchilarni kutmasdan **snapshot**ni ko‘radi. Izolyatsiya darajasi snapshot qanchalik tez-tez olinishini belgilaydi.

- **Read Committed**: **har bir so‘rov** uchun yangi snapshot. Commit qilinmagan ma’lumot ko‘rinmaydi, lekin bitta tranzaksiyadagi ikki so‘rov turli holatni ko‘rishi mumkin.
- **Repeatable Read**: **butun tranzaksiya** uchun bitta snapshot. Takroriy o‘qish bir xil natija beradi. PostgreSQL’da bu daraja fantomlarni ham yashiradi, parallel commit qilingan tranzaksiya o‘zgartirgan qatorni yangilashga urinilganda esa yangilanishni yo‘qotish o‘rniga serializatsiya xatosini qaytaradi. InnoDB’da oddiy o‘qish snapshot bo‘yicha boradi, blokirovkali o‘qish va yangilashlar esa oxirgi versiya bilan ishlaydi va fantomlarga qarshi gap-blokirovkalardan foydalanadi.
- **Serializable**: natija qandaydir ketma-ket tartibga mos kelishi shart. PostgreSQL Serializable Snapshot Isolation’dan foydalanadi va **write skew** kabi xavfli holatni sezsa, tranzaksiyani bekor qiladi. MySQL bunga asosan qo‘shimcha blokirovkalar orqali erishadi.
- **Read Uncommitted**: PostgreSQL’da Read Committed kabi ishlaydi, u yerda iflos o‘qish yo‘q.

Asosiy xulosa: Repeatable Read va Serializable’da kodingiz serializatsiya xatosi (SQLSTATE `40001`) bilan tushgan tranzaksiyalarni **qayta bajarishi shart**.

## SELECT FOR UPDATE va atomar yangilashlar

Real hayotdagi ko‘p xatolar — Read Committed darajasida «o‘qi-o‘zgartir-yoz» kodidagi yo‘qolgan yangilanishlar. Uchta amaliy yechim bor.

**1. Atomar UPDATE**, agar mantiq SQL’ga sig‘sa:

```sql
UPDATE accounts SET balance = balance - 30
WHERE id = 1 AND balance >= 30;
```

**2. Pessimistik blokirovka** — `SELECT ... FOR UPDATE` qatorni commit’gacha bloklaydi:

```sql
BEGIN;
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;
-- ilova tekshiradi va hisoblaydi
UPDATE accounts SET balance = 70 WHERE id = 1;
COMMIT;
```

Shu qatorni bloklash yoki yangilashga urinayotgan boshqa tranzaksiyalar kutadi. Variantlar: `FOR UPDATE NOWAIT` darhol xato beradi, `FOR UPDATE SKIP LOCKED` band qatorlarni o‘tkazib yuboradi — vazifalar navbati uchun qulay.

**3. Optimistik blokirovka** — versiya ustuni orqali:

```sql
UPDATE orders SET status = 'paid', version = version + 1
WHERE id = 42 AND version = 7;
-- 0 qator yangilandi -> kimdir oldinroq o‘zgartirgan, qayta o‘qing va takrorlang
```

## Qanday tanlash kerak

- **Read Committed** va atomar yangilashlar yoki `FOR UPDATE` ko‘pchilik veb-ilovalar ehtiyojini yopadi.
- **Repeatable Read** izchil hisobotlar va bitta tranzaksiyadagi ko‘p bosqichli o‘qishlar uchun mos.
- **Serializable** bir nechta qatorga taalluqli murakkab invariantlar uchun (masalan, «navbatchilikda doim kamida bitta shifokor bor»), agar qayta urinish mantig‘i bo‘lsa.
- Tranzaksiyalarni qisqa tuting: uzun tranzaksiyalar blokirovkalar va eski qator versiyalarini uzoqroq ushlab turadi.

## FAQ

### Hamma joyda Serializable yoqib qo‘ysa bo‘lmaydimi?

Odatda yo‘q. Bu eng xavfsiz daraja, lekin raqobat paytida bekor qilinishlar ko‘payadi va hamma joyda qayta urinish kerak bo‘ladi. Uni invariant bir nechta qatorni qamrab olgan va oddiy vositalar yetmagan joyda ishlating.

### SELECT FOR UPDATE oddiy o‘qishni bloklaydimi?

PostgreSQL va InnoDB’da blokirovka bandisiz oddiy `SELECT` kutmaydi: u o‘z snapshot’ini o‘qiydi. Faqat o‘sha qatorlarga boshqa blokirovkali o‘qishlar va yozuvlar kutadi.

### Nega bir xil darajada PostgreSQL va MySQL turlicha ishlaydi?

SQL standarti darajalarni amalga oshirish orqali emas, taqiqlangan anomaliyalar orqali ta’riflaydi. Har bir MBBT ularni o‘zicha amalga oshiradi, shuning uchun hujjatlarni tekshiring, masalan [PostgreSQL tranzaksiya izolyatsiyasi sahifasi](https://www.postgresql.org/docs/current/transaction-iso.html).
