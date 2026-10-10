---
title: How to Make a Multilingual Telegram Bot (Russian, Uzbek, English)
description: Detect the language from language_code, let users choose, move texts into gettext or Fluent files and localize commands in a multilingual Telegram bot.
summary: Treat language_code only as a hint, offer a language choice right away and store it in the database, keep all texts in gettext or Fluent files, and set command descriptions per language with setMyCommands.
---
## Short answer

A multilingual bot is built from four parts:

1. **Language detection** — on the first `/start`, use the user's `language_code` as the default.
2. **Explicit choice** — immediately offer language buttons and save the choice in the database.
3. **Translation files** — move every text out of the code into gettext (`.po`) or Fluent (`.ftl`).
4. **Localized commands** — set command and bot descriptions separately for each language via the Bot API.

## Step 1. Language from language_code

Every update carries `from.language_code` — the language of the user's Telegram interface: `ru`, `en`, `uz`, sometimes with a region such as `en-GB`. Keep three things in mind:

- the field is **optional** and may be missing;
- it reflects the app language, not the language the person prefers to read: many people in Uzbekistan run Telegram in Russian or English;
- so it is a hint, not a final decision.

Resolution order: **saved choice → language_code if supported → default language**.

## Step 2. Let the user choose

On first launch, show a greeting with inline buttons "Русский", "O‘zbekcha", "English". Write each label in its own language so people find theirs even if the rest of the text is unclear to them. Add a `/language` command and a settings item so the language can be changed at any time.

Store the choice in the database with the user profile, not in process memory, or the bot will "forget" it after a restart. A middleware for aiogram 3:

```python
from aiogram.utils.i18n import I18n, I18nMiddleware

class UserLocaleMiddleware(I18nMiddleware):
    async def get_locale(self, event, data) -> str:
        user = data.get("event_from_user")
        if user is None:
            return self.i18n.default_locale
        saved = await get_saved_locale(user.id)  # read from your DB
        if saved:
            return saved
        code = (user.language_code or "").split("-")[0]
        if code in self.i18n.available_locales:
            return code
        return self.i18n.default_locale

i18n = I18n(path="locales", default_locale="ru", domain="messages")
UserLocaleMiddleware(i18n).setup(dp)
```

Right after the choice, reply in the new language — for example inside `with i18n.use_locale(code):`.

## Step 3. Translation files: gettext or Fluent

| | gettext (.po / .mo) | Fluent (.ftl) |
|---|---|---|
| Format | source string and its translation | key and message |
| Plurals | rules in the .po header, ngettext | CLDR category variants inside the message |
| Tooling | Babel, Poedit, most translation services | fewer tools, easier-to-read files |
| In aiogram | built-in `aiogram.utils.i18n` | via third-party packages |

The gettext cycle with Babel:

```bash
pybabel extract -k _ -k __ -o locales/messages.pot .
pybabel init -i locales/messages.pot -d locales -D messages -l uz
pybabel compile -d locales -D messages
```

After code changes, use `pybabel update` instead of `init`. In Fluent, plurals live inside the message:

```ftl
cart-items = { $count ->
    [one] { $count } item in your cart
   *[other] { $count } items in your cart
}
```

This matters for exactly these three languages: Russian has three plural forms, English two, and in Uzbek the noun does not change after a number ("5 ta mahsulot").

Rules that save time:

- **don't glue sentences from fragments** — use placeholders, word order differs between languages;
- **give translators context**: "Open" in a menu and in an order status may translate differently;
- **don't translate `callback_data`** — it's a technical identifier;
- for reply buttons, compare text with a lazy translation such as `F.text == __("Catalog")`, or better, use inline buttons with `callback_data`.

## Step 4. Localized commands

`setMyCommands` accepts `language_code`. Telegram shows the list for the user's interface language and falls back to the default list if there is none. `setMyName`, `setMyDescription` and `setMyShortDescription` work the same way.

```python
from aiogram.types import BotCommand

COMMANDS = {
    "ru": [BotCommand(command="start", description="Начать"),
           BotCommand(command="language", description="Сменить язык")],
    "uz": [BotCommand(command="start", description="Boshlash"),
           BotCommand(command="language", description="Tilni o‘zgartirish")],
    "en": [BotCommand(command="start", description="Start"),
           BotCommand(command="language", description="Change language")],
}

async def setup_commands(bot):
    await bot.set_my_commands(COMMANDS["en"])  # default list
    for lang, commands in COMMANDS.items():
        await bot.set_my_commands(commands, language_code=lang)
```

If a user picked a bot language different from their app language, set their commands individually with `scope=BotCommandScopeChat(chat_id=...)`.

## Common mistakes

- texts hardcoded in handlers — adding a language turns into a search across the whole codebase;
- buttons not checked in every language — long labels get cut off;
- dates, amounts and phone numbers formatted the same for everyone — use locale-aware formatting, for example with Babel;
- notifications to managers sent in the customer's language instead of the recipient's.

## FAQ

### Do I need to translate the commands themselves?

No. A command is written in Latin letters and is the same for everyone, like `/start`. Only the descriptions shown in the menu are translated.

### gettext or Fluent?

If the bot runs on aiogram and familiar translator tooling matters, choose gettext. If you have many messages with numbers and grammatical cases and want readable files, choose Fluent.

### How do I add a fourth language later?

If texts already live in files, create a new translation file, add a choice button and a command set for that language — handler code stays the same.
