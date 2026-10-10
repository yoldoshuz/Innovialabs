---
title: Как настроить Nginx как reverse proxy
description: Пошаговая настройка Nginx как reverse proxy: proxy_pass к backend, правильные заголовки, WebSocket, таймауты, буферизация и проверка конфигурации.
summary: Nginx становится reverse proxy через директиву proxy_pass в блоке location; к ней добавляют заголовки Host и X-Forwarded-*, поддержку WebSocket и подходящие таймауты, а затем проверяют конфиг через nginx -t.
---
## Минимальная рабочая конфигурация

Reverse proxy принимает запросы от клиентов и передаёт их приложению, которое слушает локальный порт (Node.js, Python, Go и т. п.). В Nginx за это отвечает **proxy_pass**. Минимальный блок для приложения на порту 3000:

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Приложение при этом слушает только `127.0.0.1`, а наружу открыт лишь Nginx. Это даёт единую точку для HTTPS, сжатия, лимитов и логов.

## Зачем нужны заголовки

Без них приложение видит каждый запрос как пришедший от Nginx с адреса 127.0.0.1.

- **Host** — исходный домен. Нужен для генерации ссылок, мультидоменных приложений и проверки CORS.
- **X-Real-IP** и **X-Forwarded-For** — реальный IP клиента. Важны для логов, rate limiting и антифрода.
- **X-Forwarded-Proto** — был ли исходный запрос по HTTPS. Без него приложение может строить ссылки на `http://` или уходить в бесконечный редирект.

Во фреймворке обычно нужно явно включить доверие к прокси (например, `trust proxy` в Express), иначе эти заголовки игнорируются.

## Поддержка WebSocket

WebSocket начинается с HTTP-запроса с заголовком `Upgrade`. Nginx по умолчанию его не передаёт, поэтому соединение не устанавливается. Решение — map в блоке `http` и два заголовка в `location`:

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

server {
    location /ws/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        proxy_read_timeout 1h;
    }
}
```

Увеличенный **proxy_read_timeout** нужен, чтобы Nginx не закрывал тихие соединения. Альтернатива — ping/pong со стороны приложения.

## Таймауты и размер запроса

| Директива | Что регулирует |
|---|---|
| `proxy_connect_timeout` | Ожидание соединения с backend |
| `proxy_send_timeout` | Паузы при отправке запроса в backend |
| `proxy_read_timeout` | Паузы при чтении ответа от backend |
| `client_max_body_size` | Максимальный размер тела запроса |

Если долгие отчёты или экспорты падают с **504 Gateway Timeout**, увеличьте `proxy_read_timeout` для конкретного location, а не глобально. Ошибка **413 Request Entity Too Large** при загрузке файлов лечится через `client_max_body_size`.

## Буферизация

По умолчанию Nginx буферизует ответ backend: быстро забирает его, освобождает приложение и сам отдаёт данные медленному клиенту. Это хорошо для обычных страниц и API.

Для потоковых ответов — **Server-Sent Events**, стриминга ответов LLM, длинных выгрузок — буферизацию отключают, иначе клиент получит данные пачкой в конце:

```nginx
location /api/stream {
    proxy_pass http://127.0.0.1:3000;
    proxy_buffering off;
    proxy_cache off;
}
```

## Слеш в proxy_pass

Частая ловушка. Если в `proxy_pass` указан путь (даже просто `/`), Nginx заменяет совпавшую часть location:

- `location /api/ { proxy_pass http://127.0.0.1:3000; }` — запрос `/api/users` уйдёт как `/api/users`.
- `location /api/ { proxy_pass http://127.0.0.1:3000/; }` — уйдёт как `/users`.

Выберите вариант под маршруты приложения и проверьте его явно.

## Проверка конфигурации

1. `sudo nginx -t` — проверка синтаксиса до применения.
2. `sudo systemctl reload nginx` — применение без обрыва текущих соединений.
3. `curl -I http://example.com` — ответ и заголовки.
4. При ошибках **502 Bad Gateway** смотрите `/var/log/nginx/error.log`: обычно приложение не запущено или слушает другой порт.

## FAQ

### Чем 502 отличается от 504?

502 означает, что Nginx не смог получить корректный ответ от backend: приложение не запущено, упало или порт указан неверно. 504 — backend доступен, но не ответил за отведённое время.

### Нужно ли настраивать HTTPS в самом приложении?

Обычно нет. TLS завершается на Nginx, а до приложения внутри сервера запрос идёт по HTTP. Главное — передавать `X-Forwarded-Proto`, чтобы приложение знало об исходном HTTPS.

### Как проксировать на несколько экземпляров приложения?

Опишите их в блоке `upstream` и укажите его имя в `proxy_pass`. Nginx будет распределять запросы между серверами, по умолчанию по очереди.
