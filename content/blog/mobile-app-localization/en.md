---
title: How to Localize a Mobile App into Multiple Languages
description: String resources on iOS, Android and Flutter, plurals, Uzbek Latin and Cyrillic, RTL basics, switching language inside the app and localizing store listings.
summary: Move every text into platform string resources from day one, rely on system plural and date and number formatting rules, decide early how to support Uzbek in Latin and Cyrillic, and localize your store listing as well as the interface.
---

## The essentials

Localization is not translating a finished app at the end of a project; it is an architectural decision. If **every text lives in resources** from day one and dates, numbers and currencies are formatted **per locale**, adding a language becomes a translator's job, not a redesign.

## Where to keep strings

| Platform | Format | Plurals |
|---|---|---|
| iOS | String Catalog (`.xcstrings`); `Localizable.strings` in older projects | Inside the String Catalog; previously `.stringsdict` |
| Android | `res/values-<lang>/strings.xml` | `<plurals>` in the same file |
| Flutter | ARB files and `flutter gen-l10n` | ICU syntax in ARB |
| React Native | JSON via a library such as `i18next` | The library's rules |

Rules that apply everywhere:

- Keys describe meaning, not text: `checkout_pay_button`, not `button_text_1`.
- Do not build sentences from fragments: word order differs between languages. Use placeholders: "Order %1$s has been delivered".
- Add a translator comment: where the string appears and how much room it has.
- Do not put text in images.

## Plurals

Russian nouns after a number take three forms: "1 товар", "2 товара", "5 товаров". English has two. In Uzbek the noun stays singular after a numeral: "5 ta mahsulot". So never write `if (n == 1)` logic — use system rules.

Android:

```xml
<plurals name="items_count">
    <item quantity="one">%d item</item>
    <item quantity="other">%d items</item>
</plurals>
```

Flutter (ARB):

```json
{
  "itemsCount": "{count, plural, one{{count} item} other{{count} items}}",
  "@itemsCount": {
    "placeholders": { "count": { "type": "int" } }
  }
}
```

Each language file lists only the categories that language needs; Russian, for example, uses `one`, `few`, `many` and `other`.

## Uzbek: Latin and Cyrillic

The official script is Latin, but part of the audience, especially older users, is used to Cyrillic. Decide early whether you need both.

- **Locale codes**: `uz` (Latin by default) and `uz-Cyrl` for Cyrillic. On Android the Cyrillic folder is `values-b+uz+Cyrl`; in Flutter, a file like `app_uz_Cyrl.arb`.
- **Apostrophes**: correct Latin spelling uses `o‘`, `g‘` and `’` (tutuq belgisi), not a plain `'`. A plain apostrophe breaks search and looks careless.
- **Automatic transliteration** makes mistakes on loanwords. The Cyrillic version still needs proofreading.
- **System components**: not every framework ships translations of built-in dialogs and date pickers for `uz-Cyrl`. Check what appears instead.
- **String length**: Uzbek and Russian texts are usually longer than English. Design buttons with room to spare.

## RTL basics

If Arabic, Persian or Hebrew are on the roadmap, the interface must mirror right to left:

- use **leading/trailing** and **start/end** instead of left/right;
- on Android set `android:supportsRtl="true"`; in Flutter use `EdgeInsetsDirectional`;
- mirror directional icons (back arrows) but not logos or media controls;
- test layouts with pseudo-languages: Xcode offers Right-to-Left and Double-Length Pseudolanguage, Android has pseudolocales.

## Switching language inside the app

- **Android**: since Android 13 the system offers a per-app language setting. `AppCompatDelegate.setApplicationLocales()` lets you change language on older versions too. List the languages in `locales_config`.
- **iOS**: users choose the app's language in the system Settings app, and you can open that screen from the app. A custom switcher without restart needs your own string loading and is a frequent source of bugs.
- **Flutter**: change the `locale` of `MaterialApp` and persist the choice locally.

Take the default language from the system, not from location: many people in Uzbekistan use their phones in Russian.

## Localizing the store listing

- Translate the name, subtitle, description, keywords and **screenshots** — screenshots are what people see first.
- Research keywords for how people search in each language instead of translating them literally.
- The App Store and Google Play support different sets of listing languages. If a language is missing, carry the key message in screenshot captions.
- Make sure listing languages match the languages the app actually supports.

## FAQ

### How many languages should an app support in Uzbekistan?

Most often Uzbek (Latin) and Russian, plus English for foreigners and international users. Add Cyrillic if your audience needs it.

### Can I use machine translation?

As a draft, yes, especially for long texts. But the interface, buttons and store copy should be proofread by a native speaker in the context of the screens.

### Do backend responses need localization?

Yes, if the server returns text: errors, notifications, emails. Pass the language in the `Accept-Language` header, or return error codes and pick the text in the app.
