---
title: PostgreSQL’da oqimli replikatsiyani qanday sozlash
description: PostgreSQL oqimli replikatsiyasini bosqichma-bosqich sozlash: primary va standby, replikatsiya slotlari, kechikish monitoringi, replikadan o‘qish va failover.
summary: Primary’da replikatsiyaga ruxsat bering, rol va slot yarating, standby’ni pg_basebackup -R bilan tayyorlang, kechikishni pg_stat_replication’da kuzating, almashtirishni esa pg_promote yoki Patroni yordamida avtomatik bajaring.
---

## Qisqa javob

**Oqimli replikatsiya** oldindan yozish jurnalini (WAL) asosiy serverdan (**primary**) bir yoki bir nechta **standby** serverga deyarli real vaqtda uzatadi. Standby’dan o‘qish uchun va avariya bo‘lganda tayyor zaxira sifatida foydalanish mumkin.

Sozlash tartibi:

1. Primary’da replikatsiya ulanishlariga ruxsat berish.
2. Rol va **replikatsiya slotini** yaratish.
3. Ma’lumotlarni `pg_basebackup` orqali standby’ga nusxalash.
4. Standby’ni ishga tushirib, kechikishni tekshirish.
5. O‘qishni yo‘naltirish va **failover** ssenariysini o‘ylab chiqish.

Muhim: replikatsiya — zaxira nusxa emas. Xato bilan bajarilgan `DELETE` bir zumda barcha replikalarga yetib boradi, shuning uchun point-in-time recovery imkoniyatli bekaplar baribir kerak.

## 1-qadam. Primary’ni sozlash

`postgresql.conf` faylida:

```ini
listen_addresses = '*'
wal_level = replica
max_wal_senders = 10
max_replication_slots = 10
```

Zamonaviy versiyalarda `wal_level = replica` standart qiymat, lekin uni tekshirib qo‘ygan ma’qul. `listen_addresses` va `wal_level` o‘zgarishi qayta ishga tushirishni talab qiladi.

Replikatsiya uchun rol va slot yarating:

```sql
CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD 'murakkab_parol';
SELECT pg_create_physical_replication_slot('standby1');
```

`pg_hba.conf` da ulanishga faqat replika manzilidan ruxsat bering:

```text
host  replication  replicator  10.0.0.12/32  scram-sha-256
```

`pg_hba.conf` ni tahrirlagandan keyin `SELECT pg_reload_conf();` yetarli.

## 2-qadam. Standby’ni tayyorlash

Replika serverida PostgreSQL’ni to‘xtating va ma’lumotlar katalogini bo‘shating. Keyin primary’dan ma’lumotlarni nusxalang:

```bash
pg_basebackup -h 10.0.0.11 -U replicator \
  -D /var/lib/postgresql/data \
  -X stream -S standby1 -R -P
```

- `-X stream` — nusxalash davomida WAL’ni uzatish;
- `-S standby1` — yaratilgan slotdan foydalanish;
- `-R` — `standby.signal` faylini yaratish va `primary_conninfo` ni `postgresql.auto.conf` ga yozish.

`postgresql.auto.conf` da `primary_slot_name = 'standby1'` borligini tekshirib, serverni ishga tushiring. `hot_standby = on` parametri (standart) replikadan o‘qishga ruxsat beradi.

## Slotlar nima uchun kerak va ularning xavfi

**Replikatsiya sloti** primary’ni standby WAL’ni olmaguncha uni saqlashga majbur qiladi. Slotsiz uzoq vaqt o‘chiq turgan replika qaytarib bo‘lmaydigan darajada orqada qolib, yangi nusxani talab qilishi mumkin.

Teskari tomoni: replika butunlay o‘chirilgan, sloti esa qolgan bo‘lsa, WAL primary’da disk to‘lguncha yig‘ilaveradi. Shuning uchun:

- ishdan chiqarilgan replikalar slotlarini o‘chiring: `SELECT pg_drop_replication_slot('standby1');`;
- hajmni `max_slot_wal_keep_size` bilan cheklang (zamonaviy versiyalarda mavjud);
- har bir slot ushlab turgan WAL hajmini kuzating.

## 3-qadam. Kechikish monitoringi

Primary’da:

```sql
SELECT client_addr, state, replay_lag,
       pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn) AS lag_bytes
FROM pg_stat_replication;

SELECT slot_name, active,
       pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn) AS retained_bytes
FROM pg_replication_slots;
```

Standby’da — oxirgi qo‘llangan tranzaksiyadan beri o‘tgan vaqt:

```sql
SELECT now() - pg_last_xact_replay_timestamp() AS replay_delay;
```

Bu ko‘rsatkich primary’da yozuvlar bo‘lmaganda ham o‘sadi, shuning uchun uni `lag_bytes` bilan birga baholang. Metrikalarni monitoring tizimiga chiqaring (masalan, postgres_exporter bilan Prometheus) va kechikish, nofaol slotlar hamda replika uzilishi uchun alertlar sozlang.

## 4-qadam. Replikalardan o‘qish

Replikalar hisobotlar, analitika va og‘ir so‘rovlarni primary’dan oladi. Yo‘naltirish variantlari:

- **ilovada** — ikkita ulanish puli: yozish primary’ga, o‘qish replikaga;
- **libpq orqali** — ulanish satrida bir nechta xost va `target_session_attrs` parametri (yozish uchun `read-write`, yangi versiyalarda `read-only` yoki `prefer-standby`);
- **proksi orqali** — HAProxy yoki Pgpool-II.

**Asinxronlik**ni unutmang: hozirgina yozilgan ma’lumot replikada hali paydo bo‘lmagan bo‘lishi mumkin. «O‘z o‘zgarishlarini» o‘qishni (masalan, formani saqlagandan so‘ng darhol) primary’ga yo‘naltiring. Avariyada oxirgi tranzaksiyalarni yo‘qotish mumkin bo‘lmasa, yozish kechikishi evaziga `synchronous_standby_names` orqali sinxron replikatsiyani ko‘rib chiqing.

## 5-qadam. Failover

### Qo‘lda

1. Primary haqiqatan ishlamayotganiga ishonch hosil qiling va u ikkinchi primary bo‘lib qaytmasligi uchun **uni izolyatsiya qiling** (split-brain).
2. Standby’da `SELECT pg_promote();` yoki `pg_ctl promote` ni bajaring.
3. Ilovani o‘tkazing: DNS, virtual IP yoki ulanish satri.
4. Eski primary’ni faqat replika sifatida qaytaring — `pg_rewind` yoki yangi `pg_basebackup` orqali.

### Patroni bilan

**Patroni** klasterni avtomatik boshqaradi: lider haqidagi ma’lumotni DCS’da (etcd, Consul yoki ZooKeeper) saqlaydi, tugunlar holatini kuzatadi va avariyada eng yaxshi replikani primary qiladi. Klaster oldiga odatda HAProxy qo‘yiladi, u Patroni REST API’ni (`/primary` va `/replica` endpointlari) tekshirib, trafikni kerakli tugunga yo‘naltiradi.

Foydali buyruqlar:

```bash
patronictl -c /etc/patroni.yml list
patronictl -c /etc/patroni.yml switchover
```

Rejali `switchover` ni test stendida muntazam tekshirib turing — hech qachon ishga tushirilmagan failover’ni ishlaydi deb hisoblab bo‘lmaydi. Batafsil ma’lumot [PostgreSQL hujjatlarida](https://www.postgresql.org/docs/current/warm-standby.html).

## FAQ

### Nechta replika kerak?

Barqarorlik uchun kamida bitta. Patroni bilan avtomatik failover uchun odatda uchta PostgreSQL tuguni va kvorum bo‘lishi uchun uch tugunli DCS klasteri olinadi. O‘qish yuklamasi oshgani sari qo‘shimcha replikalar qo‘shiladi.

### PostgreSQL’ning turli versiyalari o‘rtasida replikatsiya qilsa bo‘ladimi?

Yo‘q, fizik oqimli replikatsiya bir xil asosiy versiya va platformani talab qiladi. Versiyalar o‘rtasida ko‘chirish uchun mantiqiy replikatsiya yoki `pg_upgrade` ishlatiladi.

### Replika zaxira nusxani almashtiradimi?

Yo‘q. Replika server ishdan chiqishidan himoya qiladi, ma’lumotlardagi xatolardan emas — ular bir zumda replikatsiya qilinadi. Vaqtning istalgan nuqtasiga tiklash imkoniyatli alohida bekaplar baribir kerak.
