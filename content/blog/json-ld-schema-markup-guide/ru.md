---
title: Как добавить микроразметку JSON-LD на сайт
description: Готовые примеры JSON-LD для Organization, LocalBusiness, Product, Article, FAQ и Breadcrumb и проверка разметки инструментами Google и Schema.org.
summary: JSON-LD — это блок script type="application/ld+json" со словарем Schema.org, который описывает страницу для поисковиков; добавьте подходящий тип, заполните его реальными данными и проверьте валидатором.
---
## Коротко: что такое JSON-LD и куда его вставлять

**JSON-LD** — формат структурированных данных, который рекомендует Google. Это JSON-объект со словарем **Schema.org** внутри тега `<script type="application/ld+json">`. Его можно разместить в `<head>` или `<body>` — на отображение страницы он не влияет.

Разметка помогает поисковикам точно понять, что на странице: компания, товар, статья. За счет этого страница может получить **расширенный сниппет** — цену, рейтинг, хлебные крошки. Гарантии показа нет: решение принимает поисковик.

Главное правило: **разметка должна совпадать с видимым контентом**. Нельзя размечать цену, отзывы или вопросы, которых нет на странице.

## Organization — для главной страницы

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Example Studio",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "sameAs": ["https://t.me/example"]
}
```

## LocalBusiness — если есть офис или точка

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Example Studio",
  "telephone": "+998 00 000 00 00",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "ул. Примерная, 1",
    "addressLocality": "Ташкент",
    "addressCountry": "UZ"
  },
  "openingHours": "Mo-Fr 09:00-18:00"
}
```

Используйте более точный подтип, если он есть: `Restaurant`, `Dentist`, `Store`.

## Product — для карточки товара

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Беспроводные наушники X1",
  "image": "https://example.com/x1.jpg",
  "sku": "X1-BLK",
  "offers": {
    "@type": "Offer",
    "price": "0.00",
    "priceCurrency": "UZS",
    "availability": "https://schema.org/InStock"
  }
}
```

Подставляйте цену и наличие из базы данных, чтобы разметка не расходилась с витриной.

## Article — для статей блога

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Как улучшить LCP",
  "datePublished": "2026-01-15",
  "dateModified": "2026-02-01",
  "author": { "@type": "Organization", "name": "Example Studio" },
  "image": "https://example.com/cover.jpg"
}
```

## FAQPage — для блока вопросов

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Сколько длится доставка?",
    "acceptedAnswer": { "@type": "Answer", "text": "От одного до трех дней." }
  }]
}
```

Google показывает FAQ-сниппеты лишь для ограниченного круга авторитетных сайтов, но разметка остается валидной и помогает машинам понимать структуру страницы.

## BreadcrumbList — хлебные крошки

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Блог", "item": "https://example.com/blog" },
    { "@type": "ListItem", "position": 2, "name": "SEO", "item": "https://example.com/blog/seo" }
  ]
}
```

## Как проверить разметку

1. **Rich Results Test** от Google — показывает, на какие расширенные результаты претендует страница и какие поля обязательны.
2. **Schema Markup Validator** (validator.schema.org) — проверяет синтаксис по всему словарю Schema.org, включая типы, которые Google не использует.
3. После публикации смотрите отчеты об улучшениях в Google Search Console — там видны ошибки на всем сайте.

## Частые ошибки

- Разметка генерируется статично и устаревает: цена изменилась, а в JSON-LD осталась старая.
- Ошибки синтаксиса JSON: лишняя запятая ломает весь блок.
- Относительные ссылки вместо абсолютных в `url`, `image`, `logo`.
- Одинаковая разметка Product на всех страницах каталога.

## FAQ

### Можно ли несколько блоков JSON-LD на одной странице?

Да. Например, Organization, BreadcrumbList и Article могут соседствовать. Их можно оставить отдельными скриптами или объединить в массив `@graph`.

### Влияет ли микроразметка на позиции напрямую?

Сама по себе — нет. Она помогает поисковику понять страницу и может дать расширенный сниппет, который делает результат заметнее.

### Что лучше: JSON-LD или Microdata?

Оба формата поддерживаются, но JSON-LD проще поддерживать: он не смешивается с HTML-версткой и легко генерируется из данных.
