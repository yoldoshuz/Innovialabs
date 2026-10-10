---
title: What Is a Telegram Mini App and How It Works
description: A Mini App is a web app that opens inside Telegram. Learn where it launches from, which native features it gets and how it signs the user in.
summary: A Telegram Mini App is a regular HTML, CSS and JavaScript website that opens inside Telegram from a bot's button or link and gets the user's identity, theme, buttons and payments without a separate sign-up.
---
## The short answer

A **Telegram Mini App** (formerly Web App) is a web application that Telegram opens in a built-in window on top of the chat. Technically it is a website: you build it with any frontend stack, host it at an HTTPS address and attach it to a bot.

What sets it apart from a normal website is that a Mini App:

- opens in one tap, without leaving for a browser;
- knows who opened it right away — no login or password;
- adapts to the Telegram theme and uses its buttons, haptics and payments.

A Mini App is always tied to a bot: the bot is the entry point and the messaging channel, the app is the full interface.

## How it works under the hood

1. The user taps a button or a link.
2. Telegram opens your URL in a built-in WebView.
3. The page loads the official `telegram-web-app.js` script, which exposes `window.Telegram.WebApp`.
4. Telegram passes **initData** to the app — user data plus a signature.
5. Your server verifies the signature with the bot token and trusts the data only after that check.

```html
<script src="https://telegram.org/js/telegram-web-app.js"></script>
<script>
  const tg = window.Telegram.WebApp;
  tg.ready();
  // send tg.initData to the server to verify the signature
</script>
```

Important: `initDataUnsafe` on the client is fine for showing a name, but for authentication always verify `initData` on the server.

## Where a Mini App launches from

| Launch point | What it looks like | Best for |
|---|---|---|
| **Menu button** | A button left of the input field in the bot chat | Main entry: store, personal account |
| **Inline button** | A button under a bot message | Contextual action: "Place order", "Pick a time" |
| **Keyboard button** | A button replacing the regular keyboard | When data must be sent back into the chat |
| **Direct link** | A link like `t.me/bot_username/app_name` | Ads, QR codes, channel posts |
| **Bot profile button** | "Open app" in the bot profile | When the bot has a main app configured |

A direct link can carry a `startapp` parameter to open a specific section or track where the visit came from.

## Native features it gets

- **User data**: id, name, language, username — no sign-up form.
- **Theme**: the current Telegram theme colors, so the app looks native in light and dark mode.
- **System buttons**: the main button at the bottom, a Back button, a Settings button.
- **Haptic feedback**: vibration on taps and errors.
- **Cloud storage**: small per-user data stored by Telegram.
- **Payments**: opening an invoice right from the app, including in Telegram Stars.
- **User prompts**: share contact, allow the bot to message, scan a QR code.
- **Fullscreen, location, biometrics** — in current client versions.

The available set depends on the user's Telegram version, so check support with `isVersionAtLeast` before calling a feature.

## When a Mini App beats a button bot

- Many products, filters and photos.
- Forms with several fields and validation.
- A personal account, order history, a cart.
- Branded design matters, not just text.

If the scenario is three questions and an answer, a regular bot is enough: faster to build and easier to maintain.

## Common mistakes

- Trusting user data without verifying the signature on the server.
- Designing for desktop: most people open Mini Apps on a phone.
- Ignoring the Telegram theme — a white screen in dark mode looks out of place.
- Forgetting the Back button and in-app navigation.

## FAQ

### Do I need a separate server for a Mini App?

You need HTTPS hosting for the frontend and usually a backend to verify initData and handle the database and payments. It can be the same server that runs the bot.

### Can I turn my existing website into a Mini App?

Technically you just set its address in the bot settings. In practice the site usually needs adapting: mobile layout, Telegram theme, sign-in through initData instead of a login form.

### Do Mini Apps work on desktop?

Yes, Mini Apps open in Telegram's desktop and web clients too, but some features, such as biometrics or haptics, may be unavailable there.
