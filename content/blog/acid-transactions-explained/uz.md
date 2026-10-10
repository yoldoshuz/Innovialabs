---
title: Ma’lumotlar bazasida tranzaksiyalar va ACID oddiy tilda
description: Pul o‘tkazmasi misolida atomarlik, izchillik, izolyatsiya va barqarorlikni, shuningdek BEGIN, COMMIT va ROLLBACK real kodda qanday ishlashini ko‘rib chiqamiz.
summary: Tranzaksiya bazadagi bir nechta amalni «hammasi yoki hech biri» tamoyilidagi yagona birlikka birlashtiradi; ACID uning to‘liq bajarilishi yoki umuman bajarilmasligini (atomarlik), ma’lumotlarni to‘g‘ri saqlashini (izchillik), parallel tranzaksiyalar bilan aralashmasligini (izolyatsiya) va qayd etilgach nosozlikdan omon qolishini (barqarorlik) anglatadi.
---

## Qisqacha javob

**Tranzaksiya** — birga bajarilishi yoki birga bajarilmasligi kerak bo‘lgan bazadagi amallar guruhi. Klassik misol — pul o‘tkazmasi: Alisherdan 100 yechib, Boburga 100 qo‘shish. Agar server shu ikki qadam orasida ishdan chiqsa, pul yo‘qolib qolmasligi kerak.

**ACID** — buni xavfsiz qiladigan to‘rtta kafolat:

| Harf | Xususiyat | O‘tkazma misolida |
|---|---|---|
| A | Atomarlik (Atomicity) | Ikkala yangilanish bajariladi yoki hech biri |
| C | Izchillik (Consistency) | Qoida taqiqlasa, balans minusga tushmaydi |
| I | Izolyatsiya (Isolation) | Parallel o‘tkazma chala ma’lumotni ko‘rmaydi |
| D | Barqarorlik (Durability) | «Muvaffaqiyatli»dan keyin o‘tkazma tok o‘chishidan ham omon qoladi |

## O‘tkazma SQL’da

```sql
BEGIN;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;  -- Alisher
UPDATE accounts SET balance = balance + 100 WHERE id = 2;  -- Bobur

COMMIT;
```

- `BEGIN` (yoki `START TRANSACTION`) tranzaksiyani ochadi.
- `COMMIT` barcha o‘zgarishlarni qayd etadi va boshqalarga ko‘rinadigan qiladi.
- `ROLLBACK` `BEGIN`dan keyin qilingan hamma narsani bekor qiladi.

Agar o‘rtada biror narsa noto‘g‘ri ketsa, `ROLLBACK` bajariladi va baza o‘tkazmadan oldingi holatga qaytadi.

## Atomarlik: hammasi yoki hech narsa

Baza tranzaksiya ichidagi har bir o‘zgarishni kuzatib boradi. Tranzaksiya bekor qilinsa yoki ulanish `COMMIT`gacha uzilsa, o‘zgarishlar tashlab yuboriladi. Alisherdan 100 yechilgan-u, Bobur uni olmagan holat bo‘lmaydi.

## Izchillik: qoidalar doim bajariladi

Izchillik tranzaksiya bazani bir to‘g‘ri holatdan boshqa to‘g‘ri holatga o‘tkazishini anglatadi. «To‘g‘rilik»ni sizning **cheklovlaringiz** belgilaydi:

```sql
ALTER TABLE accounts
  ADD CONSTRAINT balance_not_negative CHECK (balance >= 0);
```

Agar Alisherda faqat 50 bo‘lsa, birinchi `UPDATE` tekshiruvni buzadi, operator xato bilan tugaydi va tranzaksiyani qayd etib bo‘lmaydi. Tashqi kalitlar, `NOT NULL` va `UNIQUE` ham shunday ishlaydi. Baza siz e’lon qilgan qoidalarni kuzatadi; e’lon qilinmagan biznes qoidalari ilovaning vazifasi bo‘lib qoladi.

## Izolyatsiya: parallel tranzaksiyalar bir-biriga xalaqit bermaydi

Real tizimda bir vaqtda ko‘plab tranzaksiyalar bajariladi. Izolyatsiyasiz Alisher hisobidan ikkita o‘tkazma ikkalasi ham balansni 100 deb o‘qishi, ikkalasi ham 100 dan yechishi va hisobni noto‘g‘ri holatda qoldirishi mumkin edi.

Bazalar **izolyatsiya darajalarini** taklif qiladi — kuchsiz va tezdan qat’iyroqqacha:

| Daraja | Nimadan himoya qiladi |
|---|---|
| Read Uncommitted | Deyarli hech narsadan; qayd etilmagan ma’lumotni o‘qish mumkin |
| Read Committed | **Iflos o‘qish**dan: faqat qayd etilgan ma’lumot ko‘rinadi |
| Repeatable Read | **Takrorlanmas o‘qish**dan ham: o‘qilgan qator ishlayotganingizda o‘zgarmaydi |
| Serializable | **Fantomlar**dan ham: natija xuddi tranzaksiyalar navbat bilan bajarilgandek |

Standart qiymatlar farq qiladi: PostgreSQL’da — Read Committed, InnoDB bilan MySQL’da — Repeatable Read. Har bir darajadagi aniq xatti-harakat ham MBBTlar orasida farqlanadi, shuning uchun o‘z bazangiz hujjatlarini tekshiring.

Read Committed darajasidagi o‘tkazma uchun o‘zgartiradigan qatorlaringizni bloklang:

```sql
BEGIN;
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;
-- balansni ilovada tekshiramiz, keyin:
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

`FOR UPDATE` xuddi shu hisobdan ikkinchi o‘tkazmani birinchisi tugaguncha kutishga majbur qiladi.

## Barqarorlik: qayd etildi — demak saqlandi

`COMMIT` muvaffaqiyat qaytarganda o‘zgarish diskdagi ishonchli jurnalga yozilgan bo‘ladi (PostgreSQL’da bu **WAL**, write-ahead log, InnoDB’da — **redo log**). Nosozlikdan keyin baza jurnalni qayta o‘ynaydi va qayd etilgan ma’lumotlarni tiklaydi. Barqarorlik server qayta ishga tushishidan himoya qiladi, lekin diskning o‘zi yo‘qolishidan emas — buning uchun bekaplar va replikalar kerak.

## Ilova kodidagi tranzaksiyalar

Ko‘pchilik drayverlar va ORM’lar bu shablonni siz uchun o‘rab beradi. G‘oya hamma joyda bir xil:

```python
with conn:                      # tranzaksiyani ochadi
    with conn.cursor() as cur:
        cur.execute("UPDATE accounts SET balance = balance - %s WHERE id = %s", (100, 1))
        cur.execute("UPDATE accounts SET balance = balance + %s WHERE id = %s", (100, 2))
# muvaffaqiyatda commit, istisnoda rollback
```

## Ko‘p uchraydigan xatolar

- **Kutilmagan autocommit**: aniq tranzaksiyasiz har bir operator o‘zi qayd etiladi va ikki yangilanish orasidagi nosozlik yarim o‘tkazmani qoldiradi.
- **Uzoq tranzaksiyalar**: foydalanuvchi yoki tashqi API’ni kutib tranzaksiyani ochiq ushlab turish bloklarni ushlab, boshqalarni sekinlashtiradi.
- **Tranzaksiya ichida tashqi servislarni chaqirish**: bekor qilish yuborilgan SMS yoki to‘lov so‘rovini qaytarmaydi.
- **Qayta urinishlarning yo‘qligi**: Serializable darajasida yoki o‘zaro bloklanishda (deadlock) baza tranzaksiyani ataylab to‘xtatishi mumkin — ilova uni qayta bajarishi kerak.

## FAQ

### NoSQL bazalar ACID tranzaksiyalarini qo‘llab-quvvatlaydimi?

Ko‘pchiligi u yoki bu darajada. Masalan, MongoDB bir nechta hujjat ustida tranzaksiyalarni qo‘llab-quvvatlaydi, Redis’da esa boshqa kafolatlarga ega o‘z `MULTI`/`EXEC` mexanizmi bor. Bazaga pul yoki qoldiqlarni ishonib topshirishdan oldin u aynan nimani va’da qilishini tekshiring.

### Har doim Serializable darajasidan foydalanish kerakmi?

Shart emas. U eng kuchli kafolatlarni beradi, lekin ko‘proq ziddiyat va qayta urinishlarga olib keladi. Ko‘p ilovalar uchun Read Committed va balansni o‘zgartirish kabi muhim amallar uchun qatorlarni aniq bloklash yetarli.

### Ilova COMMIT’gacha ishdan chiqsa, tranzaksiya nima bo‘ladi?

Baza ulanish yo‘qolganini sezadi va tranzaksiyani bekor qiladi. Uning hech bir o‘zgarishi ko‘rinmaydi.
