---
title: Чек-лист HTTP-заголовков безопасности для сайта
description: Все основные HTTP-заголовки безопасности: от какой атаки защищает каждый, рекомендуемые значения, пример для nginx и как проверить сайт за несколько минут.
summary: Несколько заголовков ответа — HSTS, CSP, X-Content-Type-Options, X-Frame-Options или frame-ancestors, Referrer-Policy, Permissions-Policy и флаги Secure для cookies — включают в браузере защиту от понижения до HTTP, clickjacking, MIME sniffing и утечек данных почти бесплатно.
---

## Коротко

Заголовки безопасности — это инструкции, которые сервер отправляет с каждым ответом, чтобы браузер включил дополнительную защиту. Ошибки в коде они не исправляют, но убирают целые классы атак и ограничивают ущерб, если что-то всё же проскочило. Настройка занимает минуты, основная работа — проверить, что ничего не сломалось.

## Чек-лист

| Заголовок | От чего защищает | Рекомендуемое значение |
|---|---|---|
| **Strict-Transport-Security** | Понижение до HTTP, SSL stripping | `max-age=31536000; includeSubDomains` (внедрять постепенно) |
| **Content-Security-Policy** | XSS, внедрённые скрипты, нежелательное встраивание | Под конкретный сайт; минимум `frame-ancestors 'self'; object-src 'none'; base-uri 'self'` |
| **X-Content-Type-Options** | MIME sniffing: загруженный файл воспринимается как скрипт или стиль | `nosniff` |
| **X-Frame-Options** | Clickjacking через ваш сайт в скрытом iframe | `DENY` или `SAMEORIGIN` |
| **Referrer-Policy** | Утечка полных URL с путями и токенами на другие сайты | `strict-origin-when-cross-origin` |
| **Permissions-Policy** | Злоупотребление камерой, микрофоном, геолокацией, в том числе из встроенных iframe | `camera=(), microphone=(), geolocation=()` — разрешайте только то, что используете |
| **Cross-Origin-Opener-Policy** | Доступ чужих окон к вашей странице | `same-origin` (или `same-origin-allow-popups`, если есть OAuth или платёжные всплывающие окна) |

### Пояснения

- **HSTS** работает только по HTTPS, и быстро его не отменить, поэтому max-age увеличивают шагами.
- **CSP** — самый мощный заголовок и самый вероятный источник поломок. Начните с `Content-Security-Policy-Report-Only` и ужесточайте постепенно.
- **X-Frame-Options** — старый механизм; в современных браузерах его заменяет `frame-ancestors` в CSP. Отправлять оба — нормально, так покрываются и старые клиенты.
- **Referrer-Policy**: рекомендуемое значение уже стоит по умолчанию в современных браузерах, но явная настройка защищает от различий между ними и позволяет ужесточить политику на чувствительных страницах (`no-referrer`).
- **Permissions-Policy**: пустой список `()` отключает функцию для вашей страницы и всех фреймов.

## Cookies — тоже заголовки

Каждый `Set-Cookie` для сессии или токена должен содержать:

- **Secure** — отправляется только по HTTPS;
- **HttpOnly** — недоступен JavaScript, поэтому XSS не сможет его прочитать;
- **SameSite=Lax** (или `Strict`) — не отправляется с большинством межсайтовых запросов, что снижает риск CSRF.

## Что убрать и что не использовать

- **Server** с номером версии и **X-Powered-By** — бесплатная инвентаризация для атакующего. В nginx — `server_tokens off`, в большинстве фреймворков есть опция отключить `X-Powered-By`.
- **X-XSS-Protection** — фильтр, которым он управлял, удалён из современных браузеров и сам мог создавать проблемы. Не отправляйте его или ставьте `0`, полагайтесь на CSP.
- **Public-Key-Pins (HPKP)** и **Expect-CT** — устарели. HPKP к тому же мог навсегда заблокировать пользователям доступ к сайту.

## Пример для nginx

Вынесите общие заголовки в один файл и подключайте его в каждом `server` и в каждом `location`, где есть свой `add_header`, — иначе nginx их там не унаследует.

```nginx
# /etc/nginx/snippets/security-headers.conf
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
add_header Cross-Origin-Opener-Policy "same-origin" always;
```

```nginx
server {
    listen 443 ssl;
    server_tokens off;
    include snippets/security-headers.conf;
}
```

Если сайт стоит за CDN или заголовки отдаёт фреймворк, задавайте их в одном месте, чтобы не получить дубли с противоречивыми значениями.

## Как проверить

1. **Командная строка:** `curl -sI https://example.com` выводит заголовки ответа.
2. **DevTools браузера:** вкладка Network → документ → Response Headers. В консоли смотрите нарушения CSP и Permissions-Policy.
3. **Онлайн-сканеры:** Mozilla HTTP Observatory и securityheaders.com ставят оценку и объясняют каждый отсутствующий заголовок.
4. **Проверьте разные типы страниц:** главную, ответ API, статический файл, страницу 404 и редирект. На ошибках и статике заголовки часто теряются.

## FAQ

### Заменяют ли заголовки исправление уязвимостей?

Нет. Это второй слой, который усложняет эксплуатацию и ограничивает ущерб. Проверка входных данных, экранирование вывода и контроль доступа в коде по-прежнему обязательны.

### Какой заголовок вероятнее всего сломает сайт?

Content-Security-Policy, а следом Cross-Origin-Opener-Policy, если вход или оплата работают через всплывающие окна. Сначала проверьте их в режиме report-only или на staging.

### Нужны ли эти заголовки в ответах API?

Да, как минимум HSTS и X-Content-Type-Options. Заголовки про фреймы и разрешения для чистого JSON менее важны, но отдавать один набор везде проще и безвредно.
