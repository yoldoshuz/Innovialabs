---
title: Telegram-botni VPS’ga webhook bilan joylashtirish
description: Telegram-botni VPS’ga bosqichma-bosqich deploy qilish: server, nginx va certbot orqali domen va HTTPS, secret_token bilan setWebhook, systemd va getWebhookInfo.
summary: Webhook’dagi botga ommaviy HTTPS-manzil kerak: sertifikatli nginx Telegram so‘rovlarini qabul qilib, ularni ilovaga uzatadi, ilova esa systemd-servis sifatida ishlaydi va maxfiy token sarlavhasini tekshiradi.
---
## Qisqa javob

Webhook’dagi bot uchun production sxemasi quyidagicha:

1. **Telegram** har bir update’ni HTTPS-manzilingizga POST-so‘rov bilan yuboradi.
2. Let’s Encrypt sertifikatli **nginx** so‘rovni qabul qilib, lokal portga uzatadi.
3. **Bot ilovasi** systemd-servis sifatida ishlaydi, maxfiy sarlavhani tekshiradi va update’ni qayta ishlaydi.

Ubuntu’li VPS, domen (yoki subdomen) va bot tokeni kerak bo‘ladi.

## 1-qadam. Server

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx python3-venv
sudo adduser --system --group bot
sudo ufw allow OpenSSH
sudo ufw allow "Nginx Full"
sudo ufw enable
```

- Bot root huquqlarisiz **alohida foydalanuvchi** nomidan ishga tushadi.
- Tashqariga faqat SSH, 80 va 443 ochiq. Ilova porti faqat lokal holda qoladi.

Kodni, masalan, `/opt/bot` ga joylang, u yerda virtual muhit yarating va bog‘liqliklarni o‘rnating. Token va maxfiy kalitni faqat `bot` foydalanuvchisi o‘qiy oladigan `/opt/bot/.env` faylida saqlang.

## 2-qadam. Domen va HTTPS

Server IP’siga yo‘naltirilgan `bot.example.com` uchun A-yozuv yarating. Keyin nginx konfiguratsiyasi:

```nginx
# /etc/nginx/sites-available/bot
server {
    listen 80;
    server_name bot.example.com;

    location /webhook {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/bot /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d bot.example.com
```

Certbot sertifikat chiqaradi, 443 uchun blok qo‘shadi va avtomatik yangilashni sozlaydi. Telegram webhook’ni faqat HTTPS orqali va faqat **443, 80, 88 yoki 8443** portlarida qabul qiladi.

## 3-qadam. Ilova webhook rejimida

aiohttp veb-serveri bilan aiogram 3 misoli:

```python
import os
from aiohttp import web
from aiogram import Bot, Dispatcher
from aiogram.webhook.aiohttp_server import SimpleRequestHandler, setup_application
from handlers import router

bot = Bot(token=os.environ["BOT_TOKEN"])
dp = Dispatcher()
dp.include_router(router)

app = web.Application()
SimpleRequestHandler(
    dispatcher=dp, bot=bot, secret_token=os.environ["WEBHOOK_SECRET"]
).register(app, path="/webhook")
setup_application(app, dp, bot=bot)

web.run_app(app, host="127.0.0.1", port=8080)
```

`secret_token` — Telegram **`X-Telegram-Bot-Api-Secret-Token`** sarlavhasida yuboradigan satr. To‘g‘ri sarlavhasiz so‘rovlar rad etiladi va begona odam botga soxta update’larni yubora olmaydi. grammY’da xuddi shu ishni `secretToken` opsiyali `webhookCallback` bajaradi.

## 4-qadam. systemd

```ini
# /etc/systemd/system/bot.service
[Unit]
Description=Telegram bot
After=network-online.target
Wants=network-online.target

[Service]
User=bot
WorkingDirectory=/opt/bot
EnvironmentFile=/opt/bot/.env
ExecStart=/opt/bot/.venv/bin/python main.py
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now bot
journalctl -u bot -f
```

`Restart=always` botni nosozlikdan keyin, `enable` esa server qayta yuklangandan keyin ko‘taradi. Loglarni `journalctl` orqali ko‘ring.

## 5-qadam. Maxfiy kalit bilan setWebhook

Maxfiy kalit faqat lotin harflari, raqamlar, `_` va `-` dan iborat bo‘lishi mumkin, uzunligi 256 belgigacha. Uni `openssl rand -hex 32` buyrug‘i bilan yaratish mumkin.

```bash
curl -s "https://api.telegram.org/bot$BOT_TOKEN/setWebhook" \
  -d "url=https://bot.example.com/webhook" \
  -d "secret_token=$WEBHOOK_SECRET" \
  -d "drop_pending_updates=true"
```

`drop_pending_updates` bot ishlamagan paytda yig‘ilib qolgan update’larni tashlab yuboradi. Ularni qayta ishlash muhim bo‘lsa, parametrni olib tashlang.

## 6-qadam. getWebhookInfo

```bash
curl -s "https://api.telegram.org/bot$BOT_TOKEN/getWebhookInfo"
```

Javobda nimaga qarash kerak:

| Maydon | Ma’nosi |
|---|---|
| `url` | Manzil sizniki bilan mos keladi |
| `pending_update_count` | O‘sib borsa, Telegram update’larni yetkaza olmayapti |
| `last_error_message` | Oxirgi xato sababi: sertifikat, taymaut, javob kodi |
| `last_error_date` | Qachon sodir bo‘lgani (Unix time) |

## Ko‘p uchraydigan xatolar

- `last_error_message` da **502 Bad Gateway** — ilova ishga tushmagan yoki boshqa portni tinglayapti.
- **Bot boshqa mashinada hali ham polling rejimida ishlayapti.** Webhook o‘rnatilgan paytda `getUpdates` konflikt xatosini qaytaradi.
- **So‘rov ichida uzoq ishlov berish.** Telegram javob kutadi va yetkazishni takrorlaydi; og‘ir vazifalarni fonga yuboring va tez javob qaytaring.
- **Token loglardagi URL’da.** API so‘rovlarining to‘liq manzillarini log qilmang.

## FAQ

### Domensiz ishlasa bo‘ladimi?

Telegram `setWebhook` orqali yuklangan o‘z-o‘zidan imzolangan sertifikatli IP-manzilni qabul qiladi, lekin uni qo‘llab-quvvatlash qiyinroq. Domen va Let’s Encrypt bilan sozlash oddiyroq va ishonchliroq.

### Docker kerakmi?

Shart emas. Bitta bot uchun systemd yetarli. Serverda bir nechta servis bo‘lsa yoki ishlab chiqish va production’da bir xil muhit kerak bo‘lsa, Docker qulay.

### Polling’ga qanday qaytish mumkin?

`deleteWebhook` ni chaqiring, shundan keyin botni yana long polling bilan ishga tushirish mumkin.
