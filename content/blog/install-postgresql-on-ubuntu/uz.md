---
title: Ubuntu da PostgreSQL ni qanday o‘rnatish va sozlash
description: Ubuntu da PostgreSQL ni bosqichma-bosqich sozlash: o‘rnatish, ilova uchun foydalanuvchi va baza, xavfsiz masofaviy kirish va kichik VPS xotirasini sozlash.
summary: PostgreSQL ni Ubuntu repozitoriylaridan apt orqali o‘rnating, ilova uchun alohida rol va baza yarating, listen_addresses va pg_hba.conf orqali masofaviy kirishni faqat aniq IP-manzillar uchun oching hamda shared_buffers, work_mem va ulanishlar sonini VPS xotirasiga moslang.
---

## Qisqa yo‘l

Yangi Ubuntu serverida butun jarayon bir necha daqiqa oladi:

1. `apt` orqali `postgresql` paketini o‘rnatish.
2. Ilova uchun rol va ma’lumotlar bazasini yaratish.
3. Agar ilova boshqa serverda bo‘lsa — masofaviy kirishni faqat uning IP-manzili uchun ruxsat berish.
4. Bir nechta xotira parametrlarini to‘g‘rilash va qayta ishga tushirish.

## 1-qadam. PostgreSQL ni o‘rnatish

```bash
sudo apt update
sudo apt install -y postgresql
sudo systemctl status postgresql
```

Servis darhol ishga tushadi va avtoyuklanishga qo‘shiladi. Ubuntu sinovdan o‘tgan versiyani taqdim etadi; yangiroq asosiy versiya kerak bo‘lsa, [PostgreSQL yuklab olish sahifasida](https://www.postgresql.org/download/linux/ubuntu/) tasvirlangan rasmiy apt-repozitoriydan foydalaning.

Konfiguratsiya `/etc/postgresql/<versiya>/main/` da joylashgan. Aniq yo‘llarni shunday bilish mumkin:

```bash
sudo -u postgres psql -c "SHOW config_file;"
sudo -u postgres psql -c "SHOW hba_file;"
```

## 2-qadam. Foydalanuvchi va ma’lumotlar bazasi

O‘rnatishda `postgres` nomli tizim foydalanuvchisi va baza superfoydalanuvchisi yaratiladi. Lokal holatda u **peer-autentifikatsiya** orqali — Linux foydalanuvchi nomining mos kelishi bo‘yicha, parolsiz kiradi. Undan faqat administratsiya uchun foydalaning, hech qachon ilova sozlamalarida emas.

```bash
sudo -u postgres psql
```

```sql
CREATE ROLE appuser WITH LOGIN PASSWORD 'use-a-long-random-password';
CREATE DATABASE appdb OWNER appuser;
\q
```

Endi ilova `appdb` ga `appuser` sifatida ulanadi va o‘z jadvallariga egalik qiladi. Turli ilovalar uchun turli rollar yarating, hisobotlar uchun esa kerak bo‘lsa faqat o‘qish huquqiga ega alohida rol qo‘shing.

## 3-qadam. Masofaviy kirish

Standart holatda PostgreSQL faqat `localhost` ni tinglaydi. Ilova o‘sha serverda ishlasa, bu qadamni o‘tkazib yuboring — bu eng xavfsiz sxema.

**postgresql.conf** — qaysi tarmoq interfeyslarini tinglash:

```ini
listen_addresses = 'localhost,10.0.0.5'   # yoki barcha interfeyslar uchun '*'
```

**pg_hba.conf** — kimga ulanishga ruxsat berilgan. Faqat ilova serveri uchun qator qo‘shing:

```text
# TYPE  DATABASE  USER     ADDRESS           METHOD
host    appdb     appuser  203.0.113.10/32   scram-sha-256
```

So‘ng servisni qayta ishga tushiring (`listen_addresses` o‘zgarishi restart talab qiladi, faqat `pg_hba.conf` uchun reload yetarli) va faervolda portni faqat shu IP uchun oching:

```bash
sudo systemctl restart postgresql
sudo ufw allow from 203.0.113.10 to any port 5432 proto tcp
```

Ilova serveridan tekshirish:

```bash
psql "host=SERVER_IP dbname=appdb user=appuser"
```

**Xavfsizlik qoidalari:**

- Hech qachon `0.0.0.0/0` va `trust` ni birga ishlatmang — bu ochiq baza.
- 5432-portni internetga chiqarish o‘rniga serverlar o‘rtasida **xususiy tarmoq** yoki **SSH-tunnel** afzal.
- Eskirgan `md5` emas, `scram-sha-256` dan foydalaning. Agar parol boshqa usul faol bo‘lganda o‘rnatilgan bo‘lsa, uni qayta o‘rnating.

## 4-qadam. Kichik VPS uchun xotirani asosiy sozlash

Standart sozlamalar juda ehtiyotkor. Faqat PostgreSQL ishlaydigan **2 GB RAM** li server uchun keng tarqalgan boshlang‘ich nuqta:

```sql
ALTER SYSTEM SET shared_buffers = '512MB';
ALTER SYSTEM SET effective_cache_size = '1536MB';
ALTER SYSTEM SET work_mem = '8MB';
ALTER SYSTEM SET maintenance_work_mem = '128MB';
ALTER SYSTEM SET max_connections = 50;
ALTER SYSTEM SET random_page_cost = 1.1;
```

`ALTER SYSTEM` qiymatlarni `postgresql.conf` ustidan ustunlik qiladigan `postgresql.auto.conf` ga yozadi. Shundan keyin servisni qayta ishga tushiring: `shared_buffers` va `max_connections` faqat restartda o‘zgaradi.

| Parametr | Nima qiladi | Mo‘ljal |
|---|---|---|
| `shared_buffers` | PostgreSQL ning o‘z ma’lumotlar keshi | RAM ning taxminan to‘rtdan biri |
| `effective_cache_size` | Rejalashtiruvchiga OT bilan birga umumiy kesh haqida ishora | RAM ning yarmidan to‘rtdan uch qismigacha |
| `work_mem` | Bitta saralash yoki xesh-amal uchun xotira | Kichik: har bir ulanishdagi har bir amalga sarflanadi |
| `maintenance_work_mem` | VACUUM va indeks yaratish uchun xotira | work_mem dan kattaroq |
| `max_connections` | Ulanishlar limiti | Mo‘tadil, PgBouncer kabi pulerdan foydalaning |
| `random_page_cost` | Diskdan tasodifiy o‘qish narxi | SSD da pastroq |

Serverda ilova ham ishlasa, qiymatlarni kamaytiring. Nima qo‘llanganini `SHOW shared_buffers;` buyrug‘i bilan tekshirish mumkin.

## Ko‘p uchraydigan xatolar

- Ilovani `postgres` foydalanuvchisi nomidan ulash.
- 5432-portni butun internetga «vaqtincha» ochish.
- Katta `work_mem` qo‘yish — ko‘plab parallel so‘rovlar butun xotirani yeb qo‘yadi.
- Zaxira nusxalarni unutish: o‘rnatishdan so‘ng darhol `pg_dump` yoki fizik zaxiralashni sozlang.

## FAQ

### Balki PostgreSQL ni Docker da o‘rnatgan ma’qulmi?

Docker ishlab chiqish va barcha muhitlarda bir xil versiyalar uchun qulay. Bitta production-VPS da mahalliy o‘rnatishni yangilash va sozlash osonroq. Docker ni tanlasangiz, ma’lumotlarni volume da saqlang va zaxira nusxalarni xuddi shunday rejalashtiring.

### Nega ulanish «no pg_hba.conf entry» xatosi bilan tushadi?

Server mavjud, lekin `pg_hba.conf` da baza, foydalanuvchi va mijoz IP-manzilining bu kombinatsiyasi uchun qator yo‘q. Shu IP uchun aniq qator qo‘shing va `sudo systemctl reload postgresql` ni bajaring.

### Xotira sozlamalari to‘g‘ri tanlanganini qanday bilish mumkin?

Serverni real yuklama ostida kuzating: bo‘sh xotira, swap ishlatilishi, sekin so‘rovlar. Server swap ga o‘ta boshlasa, `shared_buffers`, `work_mem` yoki ulanishlar sonini kamaytiring. Sozlash bir martalik formula emas, takroriy jarayon.
