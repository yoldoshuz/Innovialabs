---
title: PostgreSQL’ni vaqt nuqtasiga tiklash (PITR) WAL orqali
description: pgBackRest yoki WAL-G bilan bazaviy backup va WAL arxivlashni sozlash, PostgreSQL’ni tasodifiy DELETE’dan oldingi soniyaga tiklash va jarayonni sinash.
summary: PITR bazaviy backup’ni tiklaydi va arxivlangan WAL fayllarni tanlangan lahzagacha qayta ijro etadi, shu bois bazani xato DELETE’dan bir soniya oldingi holatga qaytarish mumkin; buning uchun uzluksiz WAL arxivlash va muntazam tiklash sinovlari kerak.
---

## Qisqa javob

PostgreSQL har bir o‘zgarishni ma’lumot fayllariga qo‘llashdan oldin **oldindan yozish jurnali (WAL)** ga yozadi. Agar sizda:

1. **bazaviy backup** (ma’lumotlar katalogining jismoniy nusxasi) va
2. shu backup’dan keyin yaratilgan barcha **WAL segmentlari**

bo‘lsa, backup’ni tiklab, WAL’ni istalgan lahzagacha qayta ijro etish mumkin. Bu **vaqt nuqtasiga tiklash (PITR)** deyiladi. Har kecha olinadigan `pg_dump` buni qila olmaydi: u faqat dump olingan paytga qaytaradi.

`archive_command` uchun skriptlarni qo‘lda yozish ishonchsiz, shuning uchun odatda **pgBackRest** yoki **WAL-G** ishlatiladi. Ikkalasi ham siqish, saqlash muddati (retention), parallellik va lokal repozitoriy yoki S3 kabi obyekt omborlari bilan ishlashni o‘z zimmasiga oladi.

## pgBackRest’ni sozlash

PostgreSQL konfiguratsiyasi (`postgresql.conf`):

```ini
wal_level = replica
archive_mode = on
archive_command = 'pgbackrest --stanza=main archive-push %p'
```

`archive_mode` uchun qayta ishga tushirish kerak. Keyin pgBackRest konfigi (`/etc/pgbackrest/pgbackrest.conf`):

```ini
[global]
repo1-path=/var/lib/pgbackrest
repo1-retention-full=2

[main]
pg1-path=/var/lib/postgresql/data
```

Ishga tushiring, tekshiring va birinchi to‘liq backup’ni oling:

```bash
pgbackrest --stanza=main stanza-create
pgbackrest --stanza=main check
pgbackrest --stanza=main --type=full backup
```

Backup’larni cron yoki systemd timer orqali jadval bo‘yicha ishga tushiring, masalan haftada bir to‘liq va har kuni differensial (`--type=diff`). Repozitoriyni **boshqa mashinada yoki obyekt omborida** saqlang: o‘sha diskdagi backup server bilan birga yo‘qoladi.

## Muqobil variant: WAL-G

WAL-G muhit o‘zgaruvchilari (ombor prefiksi, kirish kalitlari, siqish) orqali sozlanadi va bulutli omborlar bilan yaxshi ishlaydi:

```ini
archive_command = 'wal-g wal-push %p'
```

```bash
wal-g backup-push "$PGDATA"
```

Tanlov asosan ekspluatatsiyaga bog‘liq: pgBackRest’da yaxlitlikni tekshirish imkoniyatlari boy va lokal repozitoriy rejimi bor, WAL-G yengil va bulutga yo‘naltirilgan. PITR’ni ikkalasi ham qo‘llab-quvvatlaydi.

## Tasodifiy o‘chirishdan keyin tiklash

Aytaylik, kimdir soat 14:30 atrofida `WHERE` siz `DELETE FROM orders` bajardi.

**1. Maqsadli vaqtni aniqlang.** Tranzaksiyani topish uchun ilova loglari, PostgreSQL logi (agar `log_statement` buni yozsa) yoki `pg_waldump` dan foydalaning. O‘chirishdan **bevosita oldingi** lahzani tanlang. Agar tranzaksiya ID yoki LSN ma’lum bo‘lsa, `recovery_target_xid` yoki `recovery_target_lsn` aniqroq bo‘ladi.

**2. Alohida serverga tiklash afzal.** Shunda yo‘qolgan qatorlarni 14:30 dan keyin bo‘lgan boshqa barcha o‘zgarishlarni bekor qilmasdan productionga qaytarish mumkin.

**3. pgBackRest orqali tiklash:**

```bash
sudo systemctl stop postgresql
pgbackrest --stanza=main --delta \
  --type=time "--target=2026-10-10 14:29:00+05" \
  --target-action=promote restore
sudo systemctl start postgresql
```

pgBackRest tiklash parametrlarini o‘zi yozadi. WAL-G’da backup’ni yuklab olib, ularni qo‘lda belgilaysiz:

```bash
wal-g backup-fetch "$PGDATA" LATEST
touch "$PGDATA/recovery.signal"
```

```ini
restore_command = 'wal-g wal-fetch %f %p'
recovery_target_time = '2026-10-10 14:29:00+05'
recovery_target_action = 'promote'
```

**4. Natijani** biror joyga ko‘chirishdan oldin **tekshiring**: qatorlar soni, hodisadan oldingi oxirgi yozuvlar, ilovaning smoke-testlari. Lahza noto‘g‘ri tanlangan bo‘lsa, boshqa maqsad bilan qayta tiklang.

Tiklashdan keyin PostgreSQL **yangi vaqt chizig‘ini (timeline)** boshlaydi. Tez orada yangi to‘liq backup oling.

## Jarayonni qanday sinash kerak

Hech qachon tiklanmagan backup — bu backup emas, umid. Tekshiruvni odatga aylantiring:

- Faqat hodisa paytida emas, jadval bo‘yicha alohida serverga tiklang.
- `pgbackrest check` ni ishga tushiring yoki muvaffaqiyatsiz arxivlash urinishlari uchun `pg_stat_archiver` ni kuzating.
- Arxivlash kechikishi yoki xatosi uchun alert sozlang: arxivlanmagan WAL bilan to‘lgan disk asosiy serverni to‘xtatib qo‘yishi mumkin.
- Tiklash qancha vaqt olishini o‘lchang. Bu sizning haqiqiy tiklash vaqtingiz va u ma’lumot hajmi hamda qayta ijro etiladigan WAL miqdori bilan o‘sadi.
- Aniq buyruqlar bilan qisqa runbook yozing, shunda stress paytida tiklash nusxa ko‘chirib qo‘yishga aylanadi.

## Ko‘p uchraydigan xatolar

- Backup’larni baza bilan bir serverda yoki diskda saqlash.
- Arxivlashni yoqib, uning muvaffaqiyatli ishlayotganini hech qachon tekshirmaslik.
- Xatolar odatda sezilgan davrni qamramaydigan juda qisqa retention.
- To‘g‘ridan-to‘g‘ri production ustiga tiklab, hodisadan keyingi qonuniy o‘zgarishlarni yo‘qotish.
- Maqsadli vaqtda vaqt mintaqasini unutish.

## FAQ

### Backup uchun pg_dump yetarlimi?

U mantiqiy nusxalar, ko‘chishlar va kichik bazalar uchun foydali, lekin faqat dump olingan paytga tiklaydi. Istalgan nuqtaga tiklash uchun bazaviy backup’lar va WAL arxivlash kerak.

### Replikalar backup’ning o‘rnini bosadimi?

Yo‘q. Replikatsiya xatolarni ham darhol ko‘chiradi: asosiy serverdagi `DELETE` replikalarda deyarli shu zahoti qayta bajariladi. Kechiktirilgan replikalar biroz yordam beradi, ammo ishonchli vosita — arxivdan PITR.

### Qancha orqaga tiklash mumkin?

Undan keyin uzluksiz arxivlangan WAL zanjiri mavjud bo‘lgan eng eski bazaviy backup’gacha. Bu oynani retention sozlamalari belgilaydi. Batafsil — [PostgreSQL uzluksiz arxivlash hujjatida](https://www.postgresql.org/docs/current/continuous-archiving.html).
