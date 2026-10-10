---
title: MySQL ma’lumotlar bazasini qanday zaxiralash va tiklash mumkin
description: Bosqichma-bosqich: mysqldump bilan InnoDB izchil snapshotli zaxira, dampni tiklash, jadval bo‘yicha zaxira, tashqi saqlash va XtraBackup qachon kerakligi.
summary: Ko‘pchilik bazalar uchun --single-transaction bilan mysqldump, uni jadval bo‘yicha ishga tushirish va nusxani boshqa joyda saqlash yetarli; katta bazalar va tez tiklash uchun Percona XtraBackup’dan foydalaning.
---

## Qisqa javob

MySQL’ning mantiqiy zaxirasi bitta buyruq bilan olinadi:

```bash
mysqldump --single-transaction --routines --triggers --events \
  -u backup -p shop > shop_$(date +%F).sql
```

Tiklash ham bitta buyruq:

```bash
mysql -u root -p shop < shop_2026-10-10.sql
```

Lekin zaxira faqat **avtomatik olinsa**, **baza serveridan boshqa joyda saqlansa** va **muntazam tiklab tekshirilsa** haqiqiy hisoblanadi.

## --single-transaction nega muhim

Bu flagsiz mysqldump jadvallarni birin-ketin o‘qiydi, ilova esa bu vaqtda ma’lumot yozishda davom etadi. Natijada buyurtma dampga tushadi, uning pozitsiyalari esa tushmay qolishi mumkin.

`--single-transaction` REPEATABLE READ izolyatsiyasi bilan tranzaksiya ochadi va barcha jadvallar **bir vaqt nuqtasidagi yagona snapshot** sifatida o‘qiladi. Jadvallar bloklanmaydi, sayt ishlashda davom etadi.

Muhim izohlar:

- Bu faqat **InnoDB** uchun ishlaydi. MyISAM jadvallari izchil saqlanmaydi.
- Damp vaqtida DDL (`ALTER TABLE`, `TRUNCATE`) bajarmang — snapshot buzilishi mumkin.
- Barcha bazalar uchun `--all-databases`, bir nechtasi uchun `--databases db1 db2` ishlating.

Foydali flaglar:

| Flag | Vazifasi |
|---|---|
| `--routines` | saqlangan protsedura va funksiyalar |
| `--triggers` | triggerlar (odatda sukut bo‘yicha yoqilgan) |
| `--events` | rejalashtirilgan eventlar |
| `--source-data=2` yoki `--master-data=2` | binlog pozitsiyasi izoh sifatida, aniq vaqtga tiklash uchun kerak |
| `--hex-blob` | binar ustunlarni xavfsiz eksport qilish |

## Dampni qanday tiklash kerak

1. Bo‘sh baza yarating: `CREATE DATABASE shop_restore;`
2. Dampni yuklang: `mysql -u root -p shop_restore < shop.sql`
3. Asosiy jadvallardagi qatorlar sonini tekshiring va ilovaning nusxasini shu bazaga ulang.

Siqilgan damp uchun: `gunzip < shop.sql.gz | mysql -u root -p shop_restore`.

Avval **alohida bazaga** tiklang, ishlayotgan baza ustiga emas. Shunda ma’lumotlarni solishtira olasiz va hali butun qolgan narsani yo‘qotmaysiz.

## Jadval bo‘yicha zaxiralash

Minimal huquqli alohida foydalanuvchi yarating (`SELECT`, `SHOW VIEW`, `TRIGGER`, `LOCK TABLES`, `EVENT`, `PROCESS`) va parolni buyruq qatorida emas, 600 huquqli `~/.my.cnf` faylida saqlang.

Har kuni soat 03:00 da siqilgan zaxira uchun cron vazifasi:

```bash
0 3 * * * mysqldump --single-transaction --routines --events shop | gzip > /backup/shop_$(date +\%F).sql.gz
```

Eski fayllarni tozalashni qo‘shing, masalan `find /backup -name '*.sql.gz' -mtime +14 -delete`, va vazifa xato bilan tugasa ogohlantirish yuboring.

## Serverdan tashqarida saqlash

Xuddi shu diskdagi zaxira disk ishdan chiqsa, server buzib kirilsa yoki o‘chirilsa yordam bermaydi. **3-2-1 qoidasi**ga amal qiling: uchta nusxa, ikki xil tashuvchida, bittasi boshqa joyda.

- Damplarni `rclone` yoki `aws s3 cp` orqali S3-mos obyekt xotirasiga yuboring.
- Hujumchi nusxalarni o‘chira olmasligi uchun versiyalash yoki object lock’ni yoqing.
- Agar dampda shaxsiy ma’lumotlar bo‘lsa, yuborishdan oldin shifrlang.

## Percona XtraBackup qachon kerak

mysqldump SQL fayl yaratadi va tiklashda u buyruqma-buyruq bajariladi. Katta bazalarda bu sekin, chunki barcha indekslar qaytadan quriladi.

**Percona XtraBackup** **fizik zaxira** oladi: server ishlab turgan holda InnoDB ma’lumot fayllarini nusxalaydi. Uni quyidagi hollarda tanlang:

- baza katta va dampni tiklash juda uzoq davom etadi;
- inkremental zaxiralar kerak;
- yangi replikani tez ko‘tarish kerak.

Cheklovlar: XtraBackup versiyasi MySQL versiyasiga mos bo‘lishi kerak, fizik nusxa esa faqat mos server versiyasiga tiklanadi. Versiyalar orasida ko‘chirish yoki alohida jadvallarni tiklash uchun mysqldump qulayroq.

## Ko‘p uchraydigan xatolar

- `--single-transaction` yo‘q — ma’lumotlar izchil emas.
- Parol buyruq qatorida, jarayonlar ro‘yxatida ko‘rinadi.
- Zaxiralar hech qachon tekshirilmagan; avariya paytida damp bo‘sh yoki kesilgan bo‘lib chiqadi.
- Binary log o‘chirilgan — faqat zaxira vaqtiga tiklash mumkin, nosozlikdan bir daqiqa oldingi holatga emas.

## FAQ

### mysqldump zaxira vaqtida bazani bloklaydimi?

InnoDB jadvallari uchun `--single-transaction` bilan — yo‘q, yozish davom etadi. Ammo damp disk va protsessorga yuk beradi, shuning uchun uni trafik kam vaqtda yoki replikadan ishga tushiring.

### Zaxirani qanchalik tez-tez olish kerak?

Biznes qancha ma’lumotni yo‘qotishga tayyorligidan kelib chiqing. Agar javob bir soat yoki undan kam bo‘lsa, tungi damp yetarli emas: aniq vaqtga tiklash uchun binary log yoki tezroq zaxiralar kerak.

### Zaxira ishlayotganini qanday bilsa bo‘ladi?

Uni muntazam ravishda alohida serverga tiklang, asosiy jadvallardagi qatorlar sonini solishtiring va nusxada ilovani ishga tushiring. Tekshirilgan tiklash faylning mavjudligidan ko‘ra ko‘proq kafolat beradi.
