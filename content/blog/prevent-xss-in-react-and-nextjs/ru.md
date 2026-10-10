---
title: Защита от XSS в приложениях на React и Next.js
description: Где React экранирует данные сам, а где нет: dangerouslySetInnerHTML, ссылки javascript:, рендер Markdown, очистка через DOMPurify и настройка CSP в Next.js.
summary: React экранирует текст в JSX, поэтому XSS в нём возникает в обход этой защиты: через dangerouslySetInnerHTML, опасные URL, Markdown с HTML и прямую работу с DOM. Очищайте HTML через DOMPurify, проверяйте схемы ссылок и включите CSP.
---

## Короткий ответ

React по умолчанию защищает от большинства XSS: всё, что вы выводите в JSX как `{value}`, превращается в текст, а не в HTML. Строка `<script>` отобразится на странице буквами.

Уязвимости появляются там, где разработчик обходит эту защиту. Таких мест немного, и их легко найти поиском по коду.

## Где React экранирует автоматически

- Текст внутри JSX: `<p>{comment}</p>`.
- Значения большинства атрибутов: `<input value={name} />`, `title`, `alt`, `className`.
- Данные, переданные в props и выведенные тем же способом.

Это работает одинаково в клиентских и серверных компонентах Next.js.

## Где React не защищает

### dangerouslySetInnerHTML

Название честное: строка вставляется как HTML без проверки.

```tsx
// уязвимо, если bio пришло от пользователя
<div dangerouslySetInnerHTML={{ __html: user.bio }} />
```

Используйте только с HTML, который вы очистили санитайзером, или с контентом, полностью контролируемым командой.

### Ссылки с javascript:

React экранирует значение `href`, но не проверяет схему URL. Ссылка `javascript:alert(document.cookie)` выполнит код по клику. Свежие версии React предупреждают о таких URL или блокируют их, но полагаться на это не стоит — проверяйте схему сами:

```ts
export function safeUrl(input: string): string {
  try {
    const url = new URL(input, "https://placeholder.local");
    return ["http:", "https:", "mailto:"].includes(url.protocol) ? input : "#";
  } catch {
    return "#";
  }
}
```

Та же проверка нужна для `src` у `iframe`, для `window.location` и редиректов после логина.

### Прямая работа с DOM

`ref.current.innerHTML = ...`, `document.write`, `eval`, `new Function` и сторонние jQuery-плагины работают в обход React и не экранируют ничего.

### Данные внутри script

Если вы вставляете JSON в тег `<script>` (например, JSON-LD для SEO), строка `</script>` внутри данных закроет тег. Экранируйте символ `<`:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  }}
/>
```

### Распаковка пользовательских props

`<div {...userProvidedObject} />` позволяет передать любой атрибут, включая `dangerouslySetInnerHTML` или `href`. Передавайте только явно перечисленные поля.

## Markdown и пользовательский HTML

Рендер Markdown — частый источник XSS, потому что Markdown допускает HTML внутри.

- **react-markdown** по умолчанию не рендерит сырой HTML — это безопасный вариант. Если подключаете `rehype-raw`, добавьте `rehype-sanitize`.
- **marked, markdown-it** и аналоги возвращают строку HTML. Перед `dangerouslySetInnerHTML` её нужно очистить.

```ts
import DOMPurify from "dompurify";

const clean = DOMPurify.sanitize(rawHtml);
```

DOMPurify работает в браузере. Для очистки на сервере используйте его вместе с jsdom или обёртку `isomorphic-dompurify`. Очищайте при выводе, а не только при сохранении: правила санитайзера со временем обновляются.

## Content Security Policy

**CSP** — заголовок, который ограничивает, откуда браузер может загружать и выполнять скрипты. Если XSS всё же проскочит, строгая политика не даст inline-скрипту выполниться.

Базовая строгая политика с nonce:

```text
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-RANDOM' 'strict-dynamic'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'
```

В Next.js заголовки задаются в конфигурации или генерируются на каждый запрос, если нужен nonce. Учтите, что nonce требует динамического рендера страниц. Начните с режима `Content-Security-Policy-Report-Only`, соберите нарушения и только потом включайте блокировку. Подробно директивы описаны на [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP).

## Чек-лист для код-ревью

1. Найдите в проекте `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function` — у каждого должно быть обоснование.
2. Все `href` и `src` из внешних данных проходят проверку схемы.
3. Markdown рендерится без сырого HTML или через санитайзер.
4. Нет распаковки неизвестных объектов в props.
5. Cookie сессии с флагами `HttpOnly`, `Secure`, `SameSite`.
6. Настроен CSP, хотя бы в режиме отчётов.

## FAQ

### Серверные компоненты Next.js защищают от XSS?

Они экранируют текст так же, как обычный React. Но `dangerouslySetInnerHTML` и опасные URL на сервере не менее опасны: HTML всё равно выполняется в браузере.

### Можно ли хранить токены в localStorage?

Любой успешный XSS сможет их прочитать. Для сессий надёжнее cookie с `HttpOnly`: скрипт не получит к ним доступ, хотя по-прежнему сможет отправлять запросы от имени пользователя.

### Достаточно ли одного CSP?

Нет. CSP — второй рубеж. Основная защита — не допускать вставки непроверенного HTML и опасных URL в коде.
