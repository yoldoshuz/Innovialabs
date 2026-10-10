---
title: Linux’da ilovani systemd servis sifatida qanday ishga tushirish
description: systemd unit faylini yozish: foydalanuvchi, ishchi papka, muhit o‘zgaruvchilari, qayta ishga tushirish siyosati, avtostart va journalctl orqali loglarni o‘qish.
summary: /etc/systemd/system ichida ExecStart, User, WorkingDirectory, EnvironmentFile va Restart=on-failure bilan unit fayl yarating, daemon-reload va enable --now bajaring, loglarni journalctl -u orqali ko‘ring.
---
## Qisqa javob

Ilova fonda ishlashi, server bilan birga ishga tushishi va qulagandan keyin tiklanishi uchun uni **systemd servis** sifatida rasmiylashtiring:

1. `/etc/systemd/system/myapp.service` faylini yarating.
2. Ishga tushirish buyrug‘i, foydalanuvchi, ishchi papka va qayta ishga tushirish siyosatini ko‘rsating.
3. `systemctl daemon-reload` va `systemctl enable --now myapp` bajaring.
4. Loglarni `journalctl -u myapp` orqali o‘qing.

`nohup`, `screen` yoki `&` orqali ishga tushirish qayta yuklashdan keyin saqlanmaydi va qulagan jarayonni qayta ishga tushirmaydi — systemd ikkala vazifani ham hal qiladi.

## Unit fayl

```ini
[Unit]
Description=My web app
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=myapp
Group=myapp
WorkingDirectory=/opt/myapp
EnvironmentFile=/etc/myapp/env
ExecStart=/usr/bin/node /opt/myapp/server.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Asosiy parametrlarni ko‘rib chiqamiz.

## Har bir parametr nimani anglatadi

**[Unit]**

- **Description** — tushunarli nom, `systemctl status`da ko‘rinadi.
- **After / Wants** — tarmoq tayyor bo‘lgandan keyin ishga tushirish. Ilovaga shu serverdagi ma’lumotlar bazasi kerak bo‘lsa, uning servisini `After=`ga qo‘shing.

**[Service]**

- **ExecStart** — **absolyut yo‘llar** bilan to‘liq ishga tushirish buyrug‘i. systemd shell’dagi `PATH`ingizdan foydalanmaydi.
- **User / Group** — root huquqlarisiz alohida tizim foydalanuvchisi. Bunday yaratiladi: `sudo useradd --system --no-create-home myapp`.
- **WorkingDirectory** — ilova nisbiy fayllarni qidiradigan papka.
- **EnvironmentFile** — `KEY=value` qatorlari bo‘lgan fayl. Secret’larni unit faylning o‘zida emas, shu yerda `600` huquqlari bilan saqlang. Bir-ikkita maxfiy bo‘lmagan qiymat uchun `Environment=` yetarli.
- **Restart** — qayta ishga tushirish siyosati.
- **RestartSec** — tez qulash siklini oldini olish uchun qayta ishga tushirishdan oldingi pauza.

**[Install]**

- **WantedBy=multi-user.target** — tizimning oddiy yuklanishida ishga tushirish.

## Qayta ishga tushirish siyosatlari

| Qiymat | Qachon qayta ishga tushiradi |
|---|---|
| `no` | hech qachon |
| `on-failure` | noldan farqli chiqish kodi, signal, timeout |
| `always` | har doim, hatto normal tugagandan keyin ham |

Veb-servislar uchun odatda `on-failure` yoki `always` tanlanadi. Jarayon juda tez-tez qulasa, systemd uni qayta ishga tushirishni to‘xtatadi — buni `[Unit]` bo‘limidagi `StartLimitIntervalSec` va `StartLimitBurst` boshqaradi.

## Servisni boshqarish

```bash
sudo systemctl daemon-reload        # unit fayl har o‘zgarganda
sudo systemctl enable --now myapp   # avtostart + hozir ishga tushirish
sudo systemctl status myapp
sudo systemctl restart myapp
sudo systemctl stop myapp
```

## journalctl orqali loglar

Ilova stdout va stderr’ga yozgan hamma narsa jurnalga tushadi:

```bash
journalctl -u myapp -f                  # real vaqtda kuzatish
journalctl -u myapp -n 100              # oxirgi 100 qator
journalctl -u myapp --since "1 hour ago"
journalctl -u myapp -p err              # faqat xatolar
```

Loglarni stdout’ga yozing — shunda alohida log fayllar va ularning rotatsiyasi kerak bo‘lmaydi.

## Ko‘p uchraydigan xatolar

- **`daemon-reload` unutilgan** — systemd faylning eski versiyasidan foydalanishda davom etadi.
- `ExecStart`dagi **nisbiy yo‘llar** — servis «not found» xatosi bilan tushadi.
- Zaruratsiz **root ostida ishga tushirish**.
- **Secret’lar to‘g‘ridan-to‘g‘ri unit faylda** — uni tizimning istalgan foydalanuvchisi o‘qiy oladi.
- `Type=simple` bo‘lganda **ilova o‘zi fonga o‘tadi** (daemonize) — systemd jarayon tugadi deb hisoblaydi. Ilovani foreground rejimida ishga tushiring.

Parametrlarning to‘liq ro‘yxati — [systemd.service](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html) hujjatlarida.

## FAQ

### systemd nega pm2 yoki supervisor’dan yaxshiroq?

systemd ko‘pchilik distributivlarda allaqachon bor, alohida runtime talab qilmaydi va jurnal hamda tizim yuklanishi bilan integratsiyalashgan. pm2 Node.js’ga xos funksiyalar uchun qulay, lekin serverdagi bir-ikkita servis uchun odatda systemd yetarli.

### Bitta ilovaning bir nechta nusxasini qanday ishga tushirish mumkin?

`myapp@.service` shablon unit’idan va parametrlarda `%i`dan, masalan port uchun, foydalaning. Keyin `myapp@3000` va `myapp@3001`ni alohida servislar sifatida ishga tushiring.

### Servis darhol tushib qolyapti — sababni qayerdan izlash kerak?

`systemctl status myapp` va `journalctl -u myapp -n 50` bajaring. Ko‘pincha sabab — noto‘g‘ri yo‘l, servis foydalanuvchisida huquq yetishmasligi yoki muhit o‘zgaruvchisi yo‘qligi.
