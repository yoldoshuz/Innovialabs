---
title: Mobil ilovalarda diplinklar: Universal Links va App Links sozlash
description: URI-sxemalar tasdiqlangan havolalardan nimasi bilan farq qiladi, Universal Links va App Links sozlash, kechiktirilgan diplinklar va havolalarni testlash.
summary: Ishonchli diplinklar uchun domeningizdagi fayl bilan tasdiqlangan oddiy https havolalardan foydalaning: iOS’da Universal Links, Android’da App Links. myapp:// kabi URI-sxemalarni zaxira variant sifatida qoldiring.
---

## Qisqa javob

**Diplink** — ilovaning bosh ekranini emas, aniq joyini ochadigan havola: mahsulot, buyurtma, profil. Buning ikki tubdan farqli usuli bor.

| | URI-sxema (`myapp://`) | Tasdiqlangan havola (`https://`) |
|---|---|---|
| Misol | `myapp://product/42` | `https://example.com/product/42` |
| Ilova o‘rnatilmagan bo‘lsa | Xato yoki hech narsa bo‘lmaydi | Sayt ochiladi |
| Kim ushlab qolishi mumkin | Xuddi shu sxemali istalgan ilova | Faqat domen tasdiqlagan ilova |
| Messenjer va pochtada | Ko‘pincha bosib bo‘lmaydi | Oddiy havola kabi ishlaydi |

Xulosa: asosiy havola — **https**, URI-sxemani esa ichki o‘tishlar va integratsiyalar uchun qoldiring.

## iOS’da Universal Links

1. Xcode’da `applinks:example.com` yozuvi bilan **Associated Domains** capability’sini qo‘shing.
2. `apple-app-site-association` faylini (kengaytmasiz) `https://example.com/.well-known/apple-app-site-association` manziliga joylang.
3. Ilovada kiruvchi URL’ni qayta ishlang va kerakli ekranni oching.

```json
{
  "applinks": {
    "details": [
      {
        "appIDs": ["TEAMID.com.example.app"],
        "components": [{ "/": "/product/*" }]
      }
    ]
  }
}
```

Faylga talablar: **redirektsiz HTTPS**, to‘g‘ri JSON, avtorizatsiyasiz kirish. Apple faylni o‘z CDN’i orqali oladi, shuning uchun o‘zgarishlar darhol qo‘llanilmaydi.

## Android’da App Links

1. `AndroidManifest.xml` faylida `android:autoVerify="true"`, `https` sxemasi va domeningiz bilan intent-filter qo‘shing.
2. `assetlinks.json` faylini `https://example.com/.well-known/assetlinks.json` manziliga joylang.

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.example.app",
    "sha256_cert_fingerprints": ["AA:BB:..."]
  }
}]
```

Ko‘p uchraydigan tuzoq — **sertifikat izi (fingerprint)**. Play App Signing ishlatilsa, faqat upload-kalitingizniki emas, Play Console’dagi imzolash kalitining SHA-256 izi kerak. Aks holda havolalar debug’da ishlaydi, do‘kondagi versiyada esa ishlamaydi.

## Yangi o‘rnatishlar uchun kechiktirilgan diplinklar

**Deferred deep link** — odamda ilova yo‘q holat: u havolani bosadi, do‘konga tushadi, ilovani o‘rnatadi va birinchi ishga tushirishda kerakli ekranga tushadi.

iOS ham, Android ham buni o‘zicha to‘liq hal qilmaydi:

- Android’da parametrlarni **Play Install Referrer API** orqali uzatish mumkin.
- iOS’da to‘g‘ridan-to‘g‘ri mexanizm yo‘q. Odatda atributsiya va diplink xizmatlari (Branch, AppsFlyer, Adjust) yoki bosish va birinchi o‘rnatishni solishtiradigan o‘z backend’ingiz ishlatiladi.

Promo, referal va reklama kampaniyalari uchun kechiktirilgan diplinklar deyarli majburiy: ularsiz foydalanuvchi o‘rnatgandan keyin bosh ekranni ko‘radi va kontekstni yo‘qotadi.

## Qanday testlash kerak

- **iOS simulyatori:** `xcrun simctl openurl booted "https://example.com/product/42"`.
- **Android:** `adb shell am start -a android.intent.action.VIEW -d "https://example.com/product/42"`, verifikatsiya holatini tekshirish uchun esa `adb shell pm get-app-links com.example.app`.
- **Real kanallar.** Havolani foydalanuvchilar keladigan har bir joyda tekshiring:
  - **email** — rassilka servislari havolalarni tracking-redirektga o‘raydi va havola brauzerda ochiladi. Tracking domenini ilovaga bog‘lang yoki diplinklar uchun o‘rashni o‘chiring;
  - **reklama** — reklama tarmoqlari ham redirekt qo‘shadi;
  - **messenjer va ijtimoiy tarmoqlar** — ichki brauzerlar (Instagram, Telegram va boshqalar) ilova o‘rniga saytni ochishi mumkin.

iOS xususiyatlarini hisobga oling: **Safari manzil satriga qo‘yilgan** havola ilovani ochmaydi — faqat bosish ochadi. Xuddi shu domen ichidagi havolaga o‘tish ham brauzerda qoladi.

## Ko‘p uchraydigan xatolar

- Assotsiatsiya fayli redirekt bilan beriladi yoki avtorizatsiya talab qiladi.
- `assetlinks.json`’da noto‘g‘ri sertifikat izi ko‘rsatilgan.
- Ilova ochiladi, lekin yo‘lni qayta ishlamaydi va bosh ekranni ko‘rsatadi.
- Ilovasi yo‘qlar uchun saytda zaxira sahifa yo‘q.

## FAQ

### Universal Links va App Links bo‘lsa, URI-sxema kerakmi?
Shart emas, lekin u o‘z ilovalaringiz orasidagi o‘tishlar, OAuth-redirektlar va ayrim SDK’lar uchun foydali. Ommaviy havolalar uchun https ishlating.

### Hammasi sozlangan bo‘lsa ham, nega havola saytni ochadi?
Ko‘pincha tracking-redirekt, messenjerning ichki brauzeri yoki assotsiatsiya faylining keshi aybdor. Havolani o‘ramlarsiz to‘g‘ridan-to‘g‘ri va domen verifikatsiyasi holatini tekshiring.

### Kechiktirilgan diplinklarni tashqi xizmatlarsiz qilish mumkinmi?
Ha, lekin buning uchun bosish va o‘rnatishni solishtiradigan o‘z backend’ingiz kerak, iOS’da esa bunday solishtirishning aniqligi cheklangan. Marketing kampaniyalari uchun ko‘pincha tayyor xizmatlar tanlanadi.
