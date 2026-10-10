---
title: How to Deploy a Telegram Bot on a VPS with a Webhook
description: Deploy a Telegram bot on a VPS step by step: server setup, a domain with HTTPS via nginx and certbot, setWebhook with secret_token, systemd and getWebhookInfo.
summary: A webhook bot needs a public HTTPS address: nginx with a certificate receives Telegram's requests and proxies them to the app, which runs as a systemd service and checks the secret token header.
---
## The short answer

A production setup for a webhook bot looks like this:

1. **Telegram** sends each update as a POST request to your HTTPS address.
2. **nginx** with a Let’s Encrypt certificate receives it and proxies it to a local port.
3. **The bot app** runs as a systemd service, checks the secret header and handles the update.

You need an Ubuntu VPS, a domain or subdomain, and the bot token.

## Step 1. Server

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx python3-venv
sudo adduser --system --group bot
sudo ufw allow OpenSSH
sudo ufw allow "Nginx Full"
sudo ufw enable
```

- The bot runs as a **dedicated user** without root rights.
- Only SSH, 80 and 443 are open. The app port stays local.

Put the code in, say, `/opt/bot`, create a virtual environment there and install dependencies. Keep the token and secret in `/opt/bot/.env`, readable only by the `bot` user.

## Step 2. Domain and HTTPS

Create an A record for `bot.example.com` pointing to the server IP. Then the nginx config:

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

Certbot issues the certificate, adds the 443 block and sets up renewal. Telegram only accepts HTTPS webhooks on ports **443, 80, 88 or 8443**.

## Step 3. The app in webhook mode

An aiogram 3 example with an aiohttp web server:

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

`secret_token` is a string Telegram sends in the **`X-Telegram-Bot-Api-Secret-Token`** header. Requests without the right header are rejected, so nobody can feed your bot fake updates. In grammY, `webhookCallback` does the same with the `secretToken` option.

## Step 4. systemd

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

`Restart=always` brings the bot back after a crash, `enable` after a reboot. Read logs with `journalctl`.

## Step 5. setWebhook with a secret

The secret may only contain Latin letters, digits, `_` and `-`, up to 256 characters. Generate one with `openssl rand -hex 32`.

```bash
curl -s "https://api.telegram.org/bot$BOT_TOKEN/setWebhook" \
  -d "url=https://bot.example.com/webhook" \
  -d "secret_token=$WEBHOOK_SECRET" \
  -d "drop_pending_updates=true"
```

`drop_pending_updates` discards updates that piled up while the bot was down. Leave it out if you need to process them.

## Step 6. getWebhookInfo

```bash
curl -s "https://api.telegram.org/bot$BOT_TOKEN/getWebhookInfo"
```

What to check in the response:

| Field | Meaning |
|---|---|
| `url` | Matches your address |
| `pending_update_count` | Growing means Telegram cannot deliver updates |
| `last_error_message` | Reason for the last failure: certificate, timeout, response code |
| `last_error_date` | When it happened (Unix time) |

## Common mistakes

- **502 Bad Gateway** in `last_error_message`: the app is not running or listens on another port.
- **The bot still runs in polling mode** on another machine. While a webhook is set, `getUpdates` returns a conflict error.
- **Slow work inside the request.** Telegram waits for a response and retries delivery; push heavy tasks to the background and reply quickly.
- **Token in logged URLs.** Do not log full API request addresses.

## FAQ

### Can I skip the domain?

Telegram accepts an IP address with a self-signed certificate uploaded via `setWebhook`, but it is harder to maintain. A domain with Let’s Encrypt is simpler and more reliable.

### Do I need Docker?

Not necessarily. systemd is enough for one bot. Docker helps when the server runs several services or you want the same environment in development and production.

### How do I go back to polling?

Call `deleteWebhook`, and you can start the bot with long polling again.
