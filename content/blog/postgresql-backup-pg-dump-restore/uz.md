---
title: PostgreSQL zaxira nusxasi: pg_dump va pg_restore
description: PostgreSQL ni pg_dump orqali zaxiralash: damp formatlari, siqish, yangi serverda tiklash, cron bilan avtomatlashtirish, saqlash muddati va tiklashni tekshirish.
summary: Dampni pg_dump orqali custom formatda (-Fc) oling — u siqilgan va pg_restore bilan moslashuvchan tiklanadi; rollarni esa pg_dumpall --globals-only orqali alohida saqlang. Zaxiralashni cron bilan avtomatlashtiring, bir nechta nusxani, jumladan bittasini serverdan tashqarida saqlang va tiklash haqiqatan ishlashini muntazam tekshiring.
---

## Qisqacha

- **pg_dump** bitta bazaning **mantiqiy nusxasini** yaratadi: damp boshlangan paytdagi sxema va ma’lumotlarning izchil surati.
- **Custom format** (`-Fc`) — standart holatda eng yaxshi tanlov: siqilgan, **pg_restore** bilan tiklanadi, alohida jadvallarni tiklash va parallel ishlash imkonini beradi.
- Rollar va klaster darajasidagi boshqa obyektlar baza dampiga kirmaydi — ularni `pg_dumpall --globals-only` orqali saqlang.
- Zaxira nusxa faqat uni kamida bir marta **muvaffaqiyatli tiklagan** bo‘lsangiz, zaxira nusxa hisoblanadi.

## Damp formatlari

| Format | Bayroq | Nima bilan tiklanadi | Qachon ishlatish kerak |
|---|---|---|---|
| Plain SQL | `-Fp` (standart) | `psql` | Kichik bazalar, o‘qiladigan natija, qo‘lda tahrirlash |
| Custom | `-Fc` | `pg_restore` | Standart tanlov: siqish, tanlab va parallel tiklash |
| Directory | `-Fd` | `pg_restore` | Katta bazalar: `-j` orqali parallel damp |
| Tar | `-Ft` | `pg_restore` | Kamdan-kam kerak bo‘ladi |

```bash
# Custom format, standart holatda siqilgan
pg_dump -Fc -d appdb -f appdb.dump

# 4 ta parallel oqimda directory format
pg_dump -Fd -j 4 -d appdb -f appdb_dir

# gzip bilan siqilgan plain SQL
pg_dump -d appdb | gzip > appdb.sql.gz

# Butun klaster uchun rollar va jadval maydonlari
pg_dumpall --globals-only -f globals.sql
```

Custom va directory formatlari uchun siqish darajasi `-Z` bayrog‘i bilan o‘zgartiriladi.

## Yangi serverda tiklash

1. PostgreSQL ning **xuddi shu yoki yangiroq** asosiy versiyasini o‘rnating. Yangiroq serverdan olingan dampni eskirog‘iga tiklash kafolatlanmaydi.
2. Rollarni tiklang: `psql -U postgres -f globals.sql`. Rol allaqachon mavjudligi haqidagi xatolar (masalan, `postgres`) — bu normal holat.
3. Bo‘sh baza yarating va dampni tiklang:

```bash
createdb -O appuser appdb
pg_restore -d appdb -j 4 appdb.dump
```

Plain SQL dampi uchun:

```bash
gunzip -c appdb.sql.gz | psql -d appdb
```

`pg_restore` ning foydali opsiyalari:

- `--no-owner` — yangi serverdagi rollar boshqacha bo‘lsa; obyektlar tiklashni bajarayotgan foydalanuvchiga tegishli bo‘ladi.
- `-t table_name` — bitta jadvalni tiklash.
- `--list` — tiklamasdan arxiv tarkibini ko‘rsatish.

Damp olinayotgan server bilan bir xil yoki undan yangiroq versiyadagi `pg_dump` dan foydalaning.

## cron bilan avtomatlashtirish

`postgres` foydalanuvchisiga tegishli papka tayyorlang:

```bash
sudo mkdir -p /var/backups/postgres
sudo chown postgres:postgres /var/backups/postgres
```

`/usr/local/bin/pg-backup.sh` skripti:

```bash
#!/usr/bin/env bash
set -euo pipefail

DB="appdb"
DIR="/var/backups/postgres"
FILE="$DIR/${DB}_$(date +%F_%H-%M).dump"

pg_dump -Fc -d "$DB" -f "$FILE.tmp"
mv "$FILE.tmp" "$FILE"

find "$DIR" -name "${DB}_*.dump" -mtime +14 -delete
```

Uni bajariladigan qiling (`chmod +x`) va `postgres` foydalanuvchisining crontab iga qo‘shing (`sudo crontab -u postgres -e`):

```text
30 2 * * * /usr/local/bin/pg-backup.sh >> /var/backups/postgres/backup.log 2>&1
```

`postgres` nomidan ishga tushirish lokal peer-autentifikatsiyadan foydalanadi, shuning uchun skriptda parol saqlanmaydi. Parol bilan ulanish kerak bo‘lsa, `600` huquqli `~/.pgpass` faylidan foydalaning. Avval vaqtinchalik `.tmp` faylga yozish muvaffaqiyatsiz damp tayyor damp kabi ko‘rinmasligini ta’minlaydi.

## Saqlash va rotatsiya

- Qancha ma’lumotni yo‘qotishga tayyor ekaningizni aniqlang — dampni **qanchalik tez-tez** olish shunga bog‘liq.
- **Bir nechta avlodni** saqlang: masalan, bir-ikki hafta uchun kunlik va bir necha oy uchun haftalik damplar.
- **3-2-1 qoidasiga** amal qiling: uchta nusxa, ikki xil turdagi tashuvchida, ulardan biri maydonchadan tashqarida. O‘sha serverdagi zaxira nusxa server bilan birga yo‘q bo‘ladi.
- Infratuzilmangizdan tashqarida saqlanadigan damplarni shifrlang: ularda barcha ma’lumotlaringiz bor.
- Vazifa muvaffaqiyatsiz tugasa yoki yangi fayl paydo bo‘lmasa, **ogohlantirishlarni** sozlang.

## Tiklashni tekshirish

Tekshirilmagan zaxira nusxa — bu zaxira emas, umid. Muntazam ravishda:

1. Oxirgi dampni alohida test serveriga yoki alohida bazaga tiklang.
2. Asosiy jadvallardagi qatorlar sonini va ilova tiklangan ma’lumotlarda ishga tushishini tekshiring.
3. Tiklash vaqtini o‘lchang — bu sizning ishga qaytishning haqiqiy vaqti.

## pg_dump ning cheklovlari

Damp — bu surat: undan keyin kiritilgan o‘zgarishlar tiklashda yo‘qoladi. Katta bazalar va aniq vaqt nuqtasiga tiklash uchun **WAL arxivlash** bilan fizik zaxira nusxalardan foydalaning (`pg_basebackup` yoki pgBackRest kabi vositalar). Batafsil ma’lumot [PostgreSQL zaxiralash hujjatlarida](https://www.postgresql.org/docs/current/backup.html).

## FAQ

### pg_dump bazani bloklaydimi?

Yo‘q, odatiy o‘qish va yozishlar davom etadi. Lekin u jadvallarda yengil bloklarni ushlab turadi, shuning uchun `ALTER TABLE` kabi sxema o‘zgarishlari damp tugashini kutadi. Zaxiralashni sokin soatlarga rejalashtiring.

### Zaxira nusxalarni qanchalik tez-tez olish kerak?

Qancha ma’lumotni yo‘qotishga tayyor bo‘lsangiz, shunga qarab. Bir kunlik buyurtmalarni yo‘qotish mumkin bo‘lmasa, kunlik damplar yetarli emas — WAL arxivlash yoki tez-tez olinadigan damplarni qo‘shing.

### Faqat bitta jadvalni tiklash mumkinmi?

Ha, custom yoki directory formatidan: `pg_restore -d appdb -t orders appdb.dump`. Tashqi kalitlarni hisobga oling va jadval boshqalar bilan bog‘liq bo‘lsa, avval uni test bazasiga tiklang.
