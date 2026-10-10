---
title: Как развернуть Telegram-бота на VPS с webhook
description: Пошаговый деплой Telegram-бота на VPS: подготовка сервера, домен и HTTPS через nginx и certbot, setWebhook с secret_token, systemd и проверка getWebhookInfo.
summary: Боту на webhook нужен публичный HTTPS-адрес: nginx с сертификатом принимает запросы от Telegram и проксирует их в приложение, которое работает как systemd-сервис и проверяет заголовок с секретным токеном.
---
## Короткий ответ

Схема продакшена для бота на webhook выглядит так:

1. **Telegram** отправляет каждый апдейт POST-запросом на ваш HTTPS-адрес.
2. **nginx** с сертификатом Let’s Encrypt принимает запрос и проксирует его на локальный порт.
3. **Приложение бота** работает как сервис systemd, проверяет секретный заголовок и обрабатывает апдейт.

Понадобятся VPS с Ubuntu, домен (или поддомен) и токен бота.

## Шаг 1. Сервер

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx python3-venv
sudo adduser --system --group bot
sudo ufw allow OpenSSH
sudo ufw allow "Nginx Full"
sudo ufw enable
```

- Бот запускается от **отдельного пользователя** без прав root.
- Наружу открыты только SSH, 80 и 443. Порт приложения остаётся доступен лишь локально.

Код разместите, например, в `/opt/bot`, создайте там виртуальное окружение и установите зависимости. Токен и секрет храните в `/opt/bot/.env` с правами только для пользователя `bot`.

## Шаг 2. Домен и HTTPS

Создайте A-запись `bot.example.com`, указывающую на IP сервера. Затем конфиг nginx:

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

Certbot выпустит сертификат, добавит блок для 443 и настроит автопродление. Telegram принимает webhook только по HTTPS и только на портах **443, 80, 88 или 8443**.

## Шаг 3. Приложение в режиме webhook

Пример на aiogram 3 с веб-сервером aiohttp:

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

`secret_token` — строка, которую Telegram присылает в заголовке **`X-Telegram-Bot-Api-Secret-Token`**. Запросы без правильного заголовка отклоняются, и посторонний не сможет подсунуть боту фальшивые апдейты. В grammY то же самое делает `webhookCallback` с опцией `secretToken`.

## Шаг 4. systemd

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

`Restart=always` поднимет бота после сбоя, `enable` — после перезагрузки сервера. Логи смотрите через `journalctl`.

## Шаг 5. setWebhook с секретом

Секрет может содержать только латинские буквы, цифры, `_` и `-`, длиной до 256 символов. Сгенерировать его можно командой `openssl rand -hex 32`.

```bash
curl -s "https://api.telegram.org/bot$BOT_TOKEN/setWebhook" \
  -d "url=https://bot.example.com/webhook" \
  -d "secret_token=$WEBHOOK_SECRET" \
  -d "drop_pending_updates=true"
```

`drop_pending_updates` отбрасывает апдейты, накопившиеся, пока бот не работал. Уберите параметр, если их важно обработать.

## Шаг 6. getWebhookInfo

```bash
curl -s "https://api.telegram.org/bot$BOT_TOKEN/getWebhookInfo"
```

Что смотреть в ответе:

| Поле | Что значит |
|---|---|
| `url` | Адрес совпадает с вашим |
| `pending_update_count` | Растёт — Telegram не может доставить апдейты |
| `last_error_message` | Причина последней ошибки: сертификат, таймаут, код ответа |
| `last_error_date` | Когда она случилась (Unix time) |

## Частые ошибки

- **502 Bad Gateway** в `last_error_message` — приложение не запущено или слушает другой порт.
- **Бот ещё работает в режиме polling** на другой машине. Пока задан webhook, `getUpdates` возвращает ошибку конфликта.
- **Долгая обработка внутри запроса.** Telegram ждёт ответа и повторяет доставку; тяжёлые задачи отправляйте в фон и отвечайте быстро.
- **Токен в URL логов.** Не логируйте полные адреса запросов к API.

## FAQ

### Можно ли обойтись без домена?

Telegram допускает IP-адрес с самоподписанным сертификатом, загруженным через `setWebhook`, но это сложнее в поддержке. С доменом и Let’s Encrypt настройка проще и надёжнее.

### Нужен ли Docker?

Не обязательно. systemd хватает для одного бота. Docker удобен, когда на сервере несколько сервисов или нужна одинаковая среда на разработке и в продакшене.

### Как вернуться на polling?

Вызовите `deleteWebhook`, после чего снова можно запускать бота с long polling.
