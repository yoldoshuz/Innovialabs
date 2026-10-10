---
title: Как разместить статический сайт на AWS S3 и CloudFront
description: Настраиваем приватный бакет S3, политику доступа, дистрибуцию CloudFront с HTTPS и своим доменом, а также разбираем, из чего складывается стоимость хостинга.
summary: Файлы сайта лежат в закрытом бакете S3, CloudFront раздаёт их по HTTPS через Origin Access Control, сертификат бесплатно выпускает ACM в регионе us-east-1, а DNS домена указывает на CloudFront. Платите вы только за фактическое хранение, запросы и трафик.
---
## Коротко: как устроена схема

- **S3** хранит файлы сайта. Бакет остаётся **закрытым** для интернета.
- **CloudFront** — CDN AWS. Он забирает файлы из бакета через **Origin Access Control (OAC)** и отдаёт посетителям по HTTPS.
- **ACM** (AWS Certificate Manager) бесплатно выпускает SSL-сертификат для вашего домена.
- **DNS** (Route 53 или ваш провайдер) направляет домен на CloudFront.

Схема подходит для любого статического сайта: лендинга, документации, сборки на Astro, Hugo или Next.js со статическим экспортом.

## Шаг 1. Создайте бакет и загрузите файлы

1. В консоли S3 создайте бакет, например `example-com-site`, в удобном регионе.
2. Оставьте включённым **Block all public access**. Режим «Static website hosting» включать не нужно: CloudFront будет обращаться к бакету напрямую через API.
3. Загрузите собранный сайт через AWS CLI:

```bash
aws s3 sync ./out s3://example-com-site --delete
```

## Шаг 2. Выпустите сертификат в ACM

Для CloudFront сертификат должен быть выпущен в регионе **us-east-1 (N. Virginia)**, независимо от того, где лежит бакет. Запросите публичный сертификат для `example.com` и `www.example.com`, выберите проверку через DNS и добавьте предложенные CNAME-записи. Через некоторое время статус сменится на «Issued».

## Шаг 3. Создайте дистрибуцию CloudFront

- **Origin** — ваш бакет (именно REST-эндпоинт бакета, а не website-эндпоинт).
- **Origin access** — Origin access control settings, создайте новый OAC.
- **Viewer protocol policy** — Redirect HTTP to HTTPS.
- **Alternate domain names** — `example.com` и `www.example.com`.
- **Custom SSL certificate** — сертификат из шага 2.
- **Default root object** — `index.html`.

После создания CloudFront покажет готовую политику для бакета.

## Шаг 4. Политика доступа к бакету

Политика разрешает читать файлы только вашей дистрибуции. Вставьте её в **Permissions → Bucket policy**, подставив свои значения:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontRead",
      "Effect": "Allow",
      "Principal": { "Service": "cloudfront.amazonaws.com" },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::example-com-site/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::111122223333:distribution/EDFDVBD6EXAMPLE"
        }
      }
    }
  ]
}
```

## Шаг 5. Подключите домен

- **Route 53**: создайте A-запись типа **Alias** на дистрибуцию — так работает и корневой домен.
- **Другой DNS-провайдер**: для `www` — CNAME на адрес вида `d1234abcd.cloudfront.net`. Корневой домен через CNAME подключить нельзя, нужна поддержка ALIAS/ANAME или CNAME flattening (например, у Cloudflare), либо редирект с корня на `www`.

## Подпапки и одностраничные приложения

REST-эндпоинт S3 не превращает `/about/` в `/about/index.html` сам. Решение — небольшая **CloudFront Function** на событии viewer request:

```js
function handler(event) {
  var request = event.request;
  var uri = request.uri;
  var last = uri.split("/").pop();
  if (uri.charAt(uri.length - 1) === "/") {
    request.uri = uri + "index.html";
  } else if (last.indexOf(".") === -1) {
    request.uri = uri + "/index.html";
  }
  return request;
}
```

Для SPA (React, Vue без SSR) настройте **Custom error responses**: ошибки 403 и 404 отдают `/index.html` с кодом 200. Без права `s3:ListBucket` отсутствующий файл возвращает именно 403.

## Обновление сайта

```bash
aws s3 sync ./out s3://example-com-site --delete
aws cloudfront create-invalidation --distribution-id EDFDVBD6EXAMPLE --paths "/*"
```

Лучше давать файлам сборки имена с хэшем и долгий срок кэширования, а инвалидировать только HTML.

## Сколько это стоит

Конкретные тарифы зависят от региона и меняются, поэтому важнее понимать, из чего складывается счёт:

- **хранение в S3** — для обычного сайта объём мал, и эта статья почти незаметна;
- **трафик и HTTPS-запросы CloudFront** — основная часть счёта, растёт с посещаемостью;
- **запросы CloudFront к S3** при промахах кэша (сам трафик из S3 в CloudFront не тарифицируется);
- **инвалидации** сверх бесплатного объёма;
- **Route 53** — ежемесячная плата за зону и запросы, если DNS у AWS.

Сертификаты ACM для CloudFront бесплатны, а у CloudFront есть бесплатный уровень. Для небольшого сайта счёт обычно скромный, но обязательно настройте **AWS Budgets** с уведомлением.

## Частые ошибки

- Сертификат выпущен не в us-east-1 — CloudFront его не видит.
- Website-эндпоинт бакета указан как origin вместе с OAC — так не работает.
- Ошибка `AccessDenied`: неверный `SourceArn` в политике или не задан Default root object.
- Бакет сделали публичным «на всякий случай» — файлы доступны в обход CloudFront.
- Забыли инвалидацию после деплоя, и посетители видят старую версию.

## FAQ

### Можно ли обойтись без CloudFront?

Режим Static website hosting в S3 работает и без него, но только по HTTP и требует публичного бакета. Для сайта со своим доменом и HTTPS CloudFront нужен.

### Можно ли так разместить сайт на Next.js?

Только если он собирается в статический экспорт (`output: "export"`). Серверный рендеринг, API-маршруты и middleware требуют вычислительной среды: Lambda, контейнера или платформы вроде Amplify.

### Это дешевле, чем Vercel или Netlify?

Зависит от трафика и тарифа. AWS даёт больше контроля и оплату строго по потреблению, но требует больше настройки. Для небольшого сайта обе схемы обходятся недорого.
