---
title: Как включить сжатие Gzip и Brotli в Nginx
description: Как работает сжатие ответов, настройка gzip и brotli в Nginx с разумными уровнями и MIME-типами, предсжатые файлы и проверка через curl.
summary: Gzip включается встроенными директивами gzip on и gzip_types, Brotli требует модуля ngx_brotli; сжимайте текстовые форматы на среднем уровне, статику сжимайте заранее, а результат проверяйте по заголовку Content-Encoding.
---
## Как работает сжатие

Браузер в каждом запросе сообщает, какие алгоритмы понимает: `Accept-Encoding: gzip, deflate, br`. Сервер выбирает подходящий, сжимает ответ и помечает его заголовком `Content-Encoding`. Браузер распаковывает данные сам.

Сильнее всего выигрывают **текстовые форматы**: HTML, CSS, JavaScript, JSON, SVG. Обычно **Brotli** сжимает текст плотнее, чем gzip, а **gzip** поддерживается вообще всеми клиентами. Поэтому разумно включить оба: Brotli для современных браузеров, gzip как запасной вариант.

## Настройка gzip

Gzip встроен в Nginx. Добавьте в блок `http`:

```nginx
gzip on;
gzip_comp_level 5;
gzip_min_length 256;
gzip_vary on;
gzip_proxied any;
gzip_types
    text/plain
    text/css
    text/xml
    application/javascript
    application/json
    application/xml
    image/svg+xml;
```

Что здесь важно:

- **gzip_comp_level** — от 1 до 9. Выше уровень — больше CPU при небольшом выигрыше в размере. Для сжатия на лету обычно выбирают средние значения.
- **gzip_min_length** — очень маленькие ответы сжимать бессмысленно.
- **gzip_vary** — добавляет `Vary: Accept-Encoding`, чтобы CDN и прокси не отдали сжатую версию клиенту, который её не понимает.
- **gzip_proxied any** — сжимать ответы и для запросов, пришедших через прокси или CDN.
- **text/html** в `gzip_types` указывать не нужно: он сжимается всегда.

## Настройка Brotli

Brotli не входит в стандартную сборку Nginx. Нужен модуль **ngx_brotli**: в части дистрибутивов он есть в виде пакета, иначе его собирают как динамический модуль под вашу версию Nginx. После установки модули подключают в начале `nginx.conf`:

```nginx
load_module modules/ngx_http_brotli_filter_module.so;
load_module modules/ngx_http_brotli_static_module.so;
```

И в блоке `http`:

```nginx
brotli on;
brotli_comp_level 5;
brotli_types
    text/plain
    text/css
    text/xml
    application/javascript
    application/json
    application/xml
    image/svg+xml;
```

Если клиент поддерживает оба алгоритма, сработает Brotli; если только gzip — gzip.

## Что не нужно сжимать

JPEG, PNG, WebP, AVIF, MP4, WOFF2 и архивы уже сжаты. Повторное сжатие тратит CPU и почти не уменьшает размер. Поэтому указывайте типы явно, а не сжимайте всё подряд.

## Предсжатые файлы

Для статики (JS и CSS после сборки) выгоднее сжать файлы заранее с максимальным уровнем, а Nginx будет лишь отдавать готовое:

```bash
gzip -k -9 dist/assets/*.js dist/assets/*.css
brotli -q 11 dist/assets/*.js dist/assets/*.css
```

Рядом с `app.js` появятся `app.js.gz` и `app.js.br`. Включите их отдачу:

```nginx
gzip_static on;
brotli_static on;
```

Nginx проверит, есть ли файл с нужным расширением, и отдаст его без сжатия на лету. `gzip_static` требует модуля `ngx_http_gzip_static_module`; есть ли он в вашей сборке, покажет `nginx -V`.

## Как проверить

1. `sudo nginx -t` и `sudo systemctl reload nginx`.
2. Запрос с нужным заголовком:

```bash
curl -s -o /dev/null -D - -H "Accept-Encoding: br" https://example.com/assets/app.js
curl -s -o /dev/null -D - -H "Accept-Encoding: gzip" https://example.com/assets/app.js
```

В ответе ищите `content-encoding: br` или `content-encoding: gzip`.

3. В DevTools браузера на вкладке Network включите колонку Content-Encoding и сравните переданный и фактический размер файлов.

## Частые ошибки

- **Нет нужного MIME-типа.** Например, API отдаёт `application/json`, а его нет в `gzip_types`.
- **Модуль Brotli не загружен.** Директива `brotli` без модуля даёт ошибку при `nginx -t`.
- **Максимальный уровень на лету.** Нагружает CPU на каждом запросе; максимум оставьте для предсжатой статики.
- **Двойное сжатие.** Если backend уже сжимает ответ, а сверху есть CDN, проверьте, на каком уровне это происходит, и оставьте один.

## FAQ

### Что лучше: gzip или Brotli?

Brotli обычно даёт файлы меньше, особенно на статике с высоким уровнем сжатия. Но включать стоит оба: gzip нужен для клиентов и инструментов без поддержки Brotli.

### Влияет ли сжатие на скорость сайта и SEO?

Сжатие уменьшает объём передаваемых данных, поэтому страницы и скрипты загружаются быстрее, особенно на мобильном интернете. Это помогает метрикам загрузки, которые учитывают поисковые системы.

### Нужно ли сжатие, если перед сайтом стоит CDN?

Многие CDN умеют сжимать сами. Тем не менее полезно включить сжатие и на Nginx с `gzip_vary on`, чтобы CDN получал уже сжатый контент и правильно кешировал разные версии.
