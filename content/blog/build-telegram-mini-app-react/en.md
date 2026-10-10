---
title: How to Build a Telegram Mini App with React
description: Build a Telegram Mini App with React and Vite: add the Telegram Web Apps SDK, use theme params, wire up MainButton and BackButton, and test it inside Telegram.
summary: A React Mini App is a regular HTTPS web app that loads telegram-web-app.js, takes colors from themeParams, drives the native MainButton and BackButton through window.Telegram.WebApp and opens from a bot.
---
## The short answer

A **Telegram Mini App** is a web app that Telegram opens inside itself from a bot button. Technically it is an ordinary React project with the `telegram-web-app.js` SDK attached. Through the `window.Telegram.WebApp` object the app gets:

- **themeParams**: the colors of the user's current theme;
- **MainButton** and **BackButton**: native Telegram buttons;
- **initData**: signed user data that must be verified on your server.

## Step 1. Project and SDK

```bash
npm create vite@latest my-mini-app -- --template react-ts
cd my-mini-app
npm install
```

In `index.html`, load the SDK **before** your bundle:

```html
<head>
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
</head>
```

For TypeScript, add a minimal declaration or install a typings package for Telegram Web Apps. The examples below use a short wrapper:

```ts
// src/tg.ts
export const tg = (window as any).Telegram?.WebApp;
```

In `main.tsx`, tell Telegram the app is ready and expand it to full height:

```ts
import { tg } from "./tg";

tg?.ready();
tg?.expand();
```

`ready()` hides the loading indicator. Call it as early as possible.

## Step 2. Theme

The SDK sets CSS variables such as `--tg-theme-bg-color`, `--tg-theme-text-color` and `--tg-theme-button-color`. The simplest approach is to build your styles on them:

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

If you need colors in JS, they are in `tg.themeParams`, and the light or dark scheme is in `tg.colorScheme`. When the theme changes you get a `themeChanged` event; subscribe with `tg.onEvent("themeChanged", handler)`. The fallbacks in `var(..., #fff)` keep the page readable in a regular browser.

## Step 3. MainButton

**MainButton** is the large native button at the bottom of the screen. A hook keeps it tidy:

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

The key part is **`offClick` in the effect cleanup**. Without it every render adds another handler, and one tap can create several orders. For long operations use `btn.showProgress()` and `btn.hideProgress()`; `btn.disable()` blocks repeated taps.

## Step 4. BackButton and routing

**BackButton** appears in the Mini App header. Tie it to your router, for example react-router:

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

On the home screen the button is hidden: there the user closes the app with the system control.

## Step 5. Testing inside Telegram

1. **HTTPS address.** Telegram only opens HTTPS. In development, run `npm run dev` and expose the port through a tunnel (ngrok, Cloudflare Tunnel and similar). If Vite blocks the external host, add it to `server.allowedHosts`.
2. **Link it to the bot.** In @BotFather, set up the Mini App or the bot's menu button with the tunnel URL. Alternatively, send an inline button with a `web_app` field.
3. **Debugging.** Telegram Web or Desktop is the easiest start, since browser developer tools are available there. For mobile clients, Telegram's documentation explains how to enable WebView debugging.
4. **Test environment.** Telegram has a separate test server so you do not touch your production bot.

## Common mistakes

- **Trusting `initDataUnsafe` on the server.** It is unverified. Send the `tg.initData` string to your backend and check its signature with the bot token.
- **Hardcoded colors**, which make the UI unreadable in dark mode.
- **MainButton handlers without `offClick`**, which cause duplicate actions.
- **No check for running outside Telegram**: `tg` is `undefined` and the app crashes.

## FAQ

### Do I need a separate backend?

Not for a static showcase. Once you have orders, payments or personal data, you need a server that verifies `initData` and stores the data.

### Can I use Next.js instead of Vite?

Yes, any framework works. Just remember the SDK runs in the browser, so access to `window.Telegram` must happen on the client.

### Are there ready-made React wrappers for the SDK?

There are community libraries with hooks and components. They are convenient, but direct access to `window.Telegram.WebApp` is easier to understand and does not depend on third-party updates.
