---
title: "Linux’da cron: jadval bo‘yicha vazifalarni to‘g‘ri sozlash"
description: Misollar bilan crontab sintaksisi, muhit va PATH tuzoqlari, chiqishni loglash, parallel ishga tushishdan himoya va muqobil sifatida systemd timers.
summary: Vazifani crontab -e orqali qo‘shing, absolyut yo‘llarni ko‘rsating, chiqishni logga yo‘naltiring va uzoq vazifalarni parallel ishlamasligi uchun flock bilan o‘rang.
---

## Qisqa javob: vazifani qanday qo‘shish mumkin

Jadvalingiz muharririni oching:

```bash
crontab -e
```

Har bir qator — ishga tushish vaqti va buyruq:

```text
*/15 * * * * /usr/bin/php /var/www/app/artisan schedule:run >> /var/log/app-cron.log 2>&1
```

Joriy vazifalarni ko‘rish: `crontab -l`. Cron muammolarining aksariyati sintaksis bilan emas, **muhit** bilan bog‘liq: vazifa terminaldan ishlaydi, lekin jadval bo‘yicha jimgina yiqiladi.

## Jadval sintaksisi

Chapdan o‘ngga beshta maydon:

| Maydon | Qiymatlar |
|---|---|
| Daqiqa | 0-59 |
| Soat | 0-23 |
| Oy kuni | 1-31 |
| Oy | 1-12 |
| Hafta kuni | 0-7 (0 va 7 — yakshanba) |

Misollar:

- `0 3 * * *` — har kuni soat 03:00 da;
- `*/10 * * * *` — har 10 daqiqada;
- `0 9 * * 1-5` — ish kunlari soat 09:00 da;
- `30 2 1 * *` — har oyning 1-sanasida 02:30 da;
- `0 */6 * * *` — har 6 soatda, soat boshida.

Vaqt **server vaqt mintaqasi** bo‘yicha hisoblanadi. Vazifalarni «tunga» qo‘yishdan oldin uni `timedatectl` bilan tekshiring.

Tuzoq: agar oy kuni ham, hafta kuni ham belgilangan bo‘lsa, cron vazifani ikkalasi emas, **istalgan biri** mos kelganda ishga tushiradi.

## Muhit va PATH

Cron buyruqlarni minimal muhitda ishga tushiradi: qisqa `PATH`, boshqa shell (`/bin/sh`), `.bashrc` va `.env` dagi o‘zgaruvchilar yo‘q. Mashhur «command not found» xatosi shundan kelib chiqadi.

Nima qilish kerak:

- dasturlar va fayllarga **absolyut yo‘llarni** ko‘rsating (`node` emas, `/usr/bin/node`); yo‘lni `which node` orqali bilib olish mumkin;
- crontab boshida o‘zgaruvchilarni belgilang:

```text
SHELL=/bin/bash
PATH=/usr/local/bin:/usr/bin:/bin
```

- murakkab mantiqni alohida skriptga yozing, cron’da esa faqat uni chaqiring;
- crontab’dagi `%` belgisi yangi qatorni bildiradi — uni `\%` ko‘rinishida ekranlang (`date +%F` da tez-tez uchraydi).

## Chiqishni loglash

Odatda vazifa chiqishi mahalliy foydalanuvchiga pochta orqali yuboriladi — ko‘pchilik serverlarda bu uning yo‘qolishini anglatadi. Chiqishni aniq yo‘naltiring:

```text
0 3 * * * /opt/scripts/backup.sh >> /var/log/backup.log 2>&1
```

`2>&1` muhim: usiz xatolar (stderr) logga tushmaydi. Bu fayl rotatsiyasini unutmang, aks holda u vaqt o‘tib diskni egallaydi. Cron umuman ishga tushganini tekshirish uchun tizim jurnaliga qarang: `journalctl -u cron` yoki `grep CRON /var/log/syslog` (xizmat nomi distributivga bog‘liq).

## Parallel ishga tushishdan himoya

Agar har 5 daqiqada ishlaydigan vazifa ba’zan 7 daqiqa davom etsa, ishga tushishlar ustma-ust tushadi: ikki marta xatlar, bazadagi poygalar, ortiqcha yuklama. Oddiy yechim — `flock`:

```text
*/5 * * * * /usr/bin/flock -n /tmp/sync.lock /opt/scripts/sync.sh
```

`-n` bayrog‘i shuni anglatadi: oldingi ishga tushish blokirovkani hali ushlab tursa, yangisi shunchaki boshlanmaydi.

## Muqobil sifatida systemd timers

Zamonaviy distributivlarda **systemd timers** dan foydalanish mumkin. Ikki fayl kerak: `.service` (nimani ishga tushirish) va `.timer` (qachon).

```ini
# /etc/systemd/system/backup.timer
[Timer]
OnCalendar=*-*-* 03:00:00
Persistent=true

[Install]
WantedBy=timers.target
```

| | cron | systemd timer |
|---|---|---|
| Sozlash | bitta qator | ikki fayl |
| Loglar | yo‘naltirish kerak | avtomatik journalctl’da |
| O‘tkazib yuborilgan ishga tushishlar | yo‘qoladi | `Persistent=true` bajarib oladi |
| Parallel ishga tushishlar | flock kerak | xizmat ikki marta ishga tushmaydi |
| Resurs cheklovlari | yo‘q | bor (CPU, xotira) |

Bir-ikki oddiy vazifa uchun cron qulayroq. Muhim fon jarayonlari uchun timers ko‘proq nazorat beradi.

## Ko‘p uchraydigan xatolar

- Nisbiy yo‘llar va terminaldagi `PATH` ga umid qilish.
- Chiqish hech qayerga yozilmaydi va nosozliklar haqida hech kim bilmaydi.
- Vazifalar UTC bo‘yicha, kutilgani esa mahalliy vaqt bo‘yicha.
- `/etc/crontab` ni tahrirlab, unda foydalanuvchi nomi uchun qo‘shimcha maydon borligini unutish.

## FAQ

### Nima uchun skript qo‘lda ishlaydi, lekin cron’da ishlamaydi?

Deyarli har doim sabab muhitda: boshqa PATH, o‘zgaruvchilar yo‘q, boshqa ishchi papka. Absolyut yo‘llardan foydalaning, kerakli o‘zgaruvchilarni belgilang va xatoni ko‘rish uchun chiqishni logga yo‘naltiring.

### Vazifani daqiqada bir martadan tez-tez qanday ishga tushirish mumkin?

Cron bir daqiqa aniqlik bilan ishlaydi. Tez-tez ishga tushirish uchun systemd timer yoki o‘z sikliga ega doimiy ishlovchi jarayondan foydalaning.

### crontab -e dan keyin biror narsani qayta ishga tushirish kerakmi?

Yo‘q, fayl saqlangandan so‘ng cron o‘zgarishlarni avtomatik qabul qiladi.
