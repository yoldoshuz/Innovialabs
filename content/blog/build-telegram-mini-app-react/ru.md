---
title: Как сделать Telegram Mini App на React
description: Создаём Telegram Mini App на React и Vite: SDK Telegram Web Apps, цвета из theme params, MainButton, BackButton и тестирование внутри Telegram.
summary: Mini App на React — обычное веб-приложение по HTTPS, которое подключает скрипт telegram-web-app.js, берёт цвета из themeParams, управляет нативными MainButton и BackButton через window.Telegram.WebApp и открывается из бота.
---
## Короткий ответ

**Telegram Mini App** — это веб-приложение, которое Telegram открывает внутри себя по кнопке бота. Технически это обычный React-проект, к которому подключён SDK `telegram-web-app.js`. Через объект `window.Telegram.WebApp` приложение получает:

- **themeParams** — цвета текущей темы пользователя;
- **MainButton** и **BackButton** — нативные кнопки Telegram;
- **initData** — подписанные данные о пользователе, которые нужно проверять на сервере.

## Шаг 1. Проект и SDK

```bash
npm create vite@latest my-mini-app -- --template react-ts
cd my-mini-app
npm install
```

В `index.html` подключите SDK **до** вашего бандла:

```html
<head>
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
</head>
```

Для TypeScript добавьте минимальное объявление или установите пакет с типами для Telegram Web Apps. Ниже используется короткая обёртка:

```ts
// src/tg.ts
export const tg = (window as any).Telegram?.WebApp;
```

В `main.tsx` сообщите Telegram, что приложение готово, и разверните его на всю высоту:

```ts
import { tg } from "./tg";

tg?.ready();
tg?.expand();
```

`ready()` убирает индикатор загрузки. Вызывайте его как можно раньше.

## Шаг 2. Тема

SDK сам выставляет CSS-переменные вида `--tg-theme-bg-color`, `--tg-theme-text-color`, `--tg-theme-button-color`. Проще всего строить стили на них:

```css
body {
  background: var(--tg-theme-bg-color, #fff);
  color: var(--tg-theme-text-color, #000);
}
.card {
  background: var(--tg-theme-secondary-bg-color, #f2f2f2);
}
.hint {
  color: var(--tg-theme-hint-color, #888);
}
```

Если цвета нужны в JS, они лежат в `tg.themeParams`, а светлая или тёмная схема — в `tg.colorScheme`. При смене темы приходит событие `themeChanged`: подпишитесь через `tg.onEvent("themeChanged", handler)`. Запасные значения в `var(..., #fff)` нужны, чтобы страница выглядела нормально и в обычном браузере.

## Шаг 3. MainButton

**MainButton** — большая кнопка внизу экрана, нативная для Telegram. Удобно обернуть её в хук:

```tsx
import { useEffect } from "react";
import { tg } from "./tg";

export function useMainButton(text: string, onClick: () => void, visible = true) {
  useEffect(() => {
    const btn = tg?.MainButton;
    if (!btn) return;
    btn.setText(text);
    btn.onClick(onClick);
    visible ? btn.show() : btn.hide();
    return () => {
      btn.offClick(onClick);
      btn.hide();
    };
  }, [text, onClick, visible]);
}
```

Главное здесь — **`offClick` в очистке эффекта**. Без него при каждом рендере добавляется новый обработчик, и одно нажатие вызывает несколько заказов. Для долгих операций есть `btn.showProgress()` и `btn.hideProgress()`, а `btn.disable()` блокирует повторные нажатия.

## Шаг 4. BackButton и роутинг

**BackButton** появляется в шапке Mini App. Связывать её стоит с роутером, например react-router:

```tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { tg } from "./tg";

export function useBackButton() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const back = tg?.BackButton;
    if (!back) return;
    const goBack = () => navigate(-1);
    if (pathname === "/") back.hide();
    else back.show();
    back.onClick(goBack);
    return () => back.offClick(goBack);
  }, [pathname, navigate]);
}
```

На главном экране кнопка скрыта: там пользователь закрывает приложение системной кнопкой.

## Шаг 5. Тестирование внутри Telegram

1. **HTTPS-адрес.** Telegram открывает только HTTPS. Для разработки запустите `npm run dev` и пробросьте порт через туннель (ngrok, Cloudflare Tunnel и подобные). Если Vite блокирует чужой хост, добавьте его в `server.allowedHosts`.
2. **Привязка к боту.** В @BotFather настройте Mini App или кнопку меню бота и укажите адрес туннеля. Другой вариант — inline-кнопка с полем `web_app`.
3. **Отладка.** Проще всего начать с Telegram Web или Desktop: там доступны инструменты разработчика браузера. Для мобильных клиентов в документации Telegram описано, как включить отладку WebView.
4. **Тестовая среда.** У Telegram есть отдельный тестовый сервер, чтобы не трогать продакшен-бота.

## Частые ошибки

- **Доверие к `initDataUnsafe` на сервере.** Это данные без проверки. Отправляйте на бэкенд строку `tg.initData` и проверяйте её подпись токеном бота.
- **Жёстко заданные цвета** — в тёмной теме интерфейс становится нечитаемым.
- **Обработчики MainButton без `offClick`** — повторные действия.
- **Нет проверки на запуск вне Telegram**: `tg` равен `undefined`, и приложение падает.

## FAQ

### Нужен ли отдельный бэкенд?

Для статичной витрины — нет. Как только появляются заказы, оплата или личные данные, нужен сервер, который проверяет `initData` и хранит данные.

### Можно ли использовать Next.js вместо Vite?

Да, подойдёт любой фреймворк. Учитывайте только, что SDK работает в браузере, поэтому обращения к `window.Telegram` должны выполняться на клиенте.

### Есть ли готовые React-обёртки над SDK?

Есть библиотеки от сообщества с хуками и компонентами. Они удобны, но прямой доступ к `window.Telegram.WebApp` проще для понимания и не зависит от сторонних обновлений.
