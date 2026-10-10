---
title: Mobil ilovani bir nechta tilga qanday lokalizatsiya qilish
description: iOS, Android va Flutter’da satr resurslari, ko‘plik shakllari, o‘zbek lotin va kirill yozuvi, RTL asoslari, ilova ichida tilni almashtirish va do‘kon sahifasi.
summary: Birinchi kundanoq barcha matnlarni platforma satr resurslariga chiqaring, ko‘plik shakllari hamda sana va sonlarni formatlashda tizim qoidalaridan foydalaning, o‘zbek tilini lotin va kirillda qanday qo‘llab-quvvatlashni oldindan hal qiling va faqat interfeysni emas, do‘kondagi sahifani ham lokalizatsiya qiling.
---

## Asosiysi qisqacha

Lokalizatsiya — loyiha oxirida tayyor ilovani tarjima qilish emas, balki arxitektura qarori. Agar birinchi kundan **barcha matnlar resurslarda** tursa, sana, son va valyutalar esa **lokalga qarab** formatlansa, yangi til qo‘shish ekranlarni qayta qilish emas, tarjimon ishi bo‘lib qoladi.

## Satrlarni qayerda saqlash

| Platforma | Format | Ko‘plik shakllari |
|---|---|---|
| iOS | String Catalog (`.xcstrings`); eski loyihalarda `Localizable.strings` | String Catalog ichida; avval `.stringsdict` |
| Android | `res/values-<til>/strings.xml` | Shu faylning o‘zidagi `<plurals>` |
| Flutter | ARB fayllar va `flutter gen-l10n` | ARB’da ICU sintaksisi |
| React Native | `i18next` kabi kutubxona orqali JSON | Kutubxona qoidalari |

Barcha platformalar uchun umumiy qoidalar:

- Kalit matnni emas, ma’noni bildiradi: `button_text_1` emas, `checkout_pay_button`.
- Iboralarni bo‘laklardan yopishtirmang: tillarda so‘z tartibi turlicha. Pleysxolderlardan foydalaning: «%1$s buyurtma yetkazildi».
- Tarjimon uchun izoh qo‘shing: satr qayerda ko‘rinadi va unda qancha joy bor.
- Matnni rasmlar ichida saqlamang.

## Ko‘plik shakllari

Rus tilida sondan keyingi otning uchta shakli bor, ingliz tilida ikkita. O‘zbek tilida esa son bilan kelgan ot birlikda qoladi: «5 ta mahsulot». Shuning uchun `if (n == 1)` kabi mantiq yozib bo‘lmaydi — tizim qoidalaridan foydalaning.

Android:

```xml
<plurals name="items_count">
    <item quantity="one">%d ta mahsulot</item>
    <item quantity="other">%d ta mahsulot</item>
</plurals>
```

Flutter (ARB):

```json
{
  "itemsCount": "{count, plural, one{{count} ta mahsulot} other{{count} ta mahsulot}}",
  "@itemsCount": {
    "placeholders": { "count": { "type": "int" } }
  }
}
```

Har bir til fayli faqat o‘sha tilga kerakli kategoriyalarni sanaydi: masalan, rus tili `one`, `few`, `many` va `other`’dan foydalanadi.

## O‘zbek tili: lotin va kirill

Rasmiy yozuv — lotin, lekin auditoriyaning bir qismi, ayniqsa katta yoshdagilar, kirillga o‘rgangan. Ikkala versiya kerakmi — oldindan hal qiling.

- **Lokal kodlari**: `uz` (standart bo‘yicha lotin) va kirill uchun `uz-Cyrl`. Android’da kirill uchun papka — `values-b+uz+Cyrl`, Flutter’da — `app_uz_Cyrl.arb` kabi fayl.
- **Apostroflar**: lotin yozuvida `o‘`, `g‘` va `’` (tutuq belgisi) to‘g‘ri hisoblanadi, oddiy apostrof emas. Oddiy apostrof qidiruvni buzadi va beparvo ko‘rinadi.
- **Avtomatik transliteratsiya** o‘zlashma so‘zlarda xato beradi. Kirill versiyasini baribir o‘qib chiqish kerak.
- **Tizim komponentlari**: hamma freymvorklarda ham ichki dialoglar va kalendarlar uchun `uz-Cyrl` tarjimalari bo‘lmaydi. Ularning o‘rniga nima chiqishini tekshiring.
- **Satr uzunligi**: o‘zbek va rus matnlari odatda inglizchadan uzunroq. Tugmalarni zaxira joy bilan loyihalang.

## RTL asoslari

Agar rejada arab, fors yoki ivrit tili bo‘lsa, interfeys o‘ngdan chapga aks eta olishi kerak:

- left/right o‘rniga **leading/trailing** va **start/end**’dan foydalaning;
- Android’da `android:supportsRtl="true"`’ni yoqing, Flutter’da `EdgeInsetsDirectional`’dan foydalaning;
- yo‘nalishli ikonkalarni (orqaga strelkalari) aks ettiring, lekin logotiplar va media tugmalarini emas;
- maketni psevdotillarda tekshiring: Xcode’da Right-to-Left va Double-Length Pseudolanguage bor, Android’da — psevdolokallar.

## Ilova ichida tilni almashtirish

- **Android**: Android 13 dan boshlab har bir ilova uchun tizimda til tanlash imkoniyati bor. `AppCompatDelegate.setApplicationLocales()` orqali eski versiyalarda ham tilni o‘zgartirish mumkin. Tillarni `locales_config`’da sanab o‘ting.
- **iOS**: foydalanuvchi ilova tilini tizim Sozlamalarida tanlaydi, ilovadan esa shu ekranni ochish mumkin. Qayta ishga tushirmasdan ishlaydigan o‘z almashtirgichingiz satrlarni o‘zingiz yuklashingizni talab qiladi va ko‘pincha xatolarga sabab bo‘ladi.
- **Flutter**: `MaterialApp`’ning `locale` qiymatini o‘zgartiring va tanlovni lokal saqlang.

Standart tilni geolokatsiyadan emas, tizimdan oling: O‘zbekistonda ko‘pchilik telefonidan rus tilidagi interfeys bilan foydalanadi.

## Do‘kon sahifasini lokalizatsiya qilish

- Nom, sarlavha, tavsif, kalit so‘zlar va **skrinshotlarni** tarjima qiling — aynan skrinshotlar birinchi ko‘rinadi.
- Kalit so‘zlarni so‘zma-so‘z tarjima qilmang, har bir tilda odamlar qanday qidirishiga qarab tanlang.
- App Store va Google Play’da sahifalar uchun tillar to‘plami turlicha. Kerakli til bo‘lmasa, asosiy fikrni skrinshotlardagi yozuvlar orqali yetkazing.
- Sahifa tillari ilova haqiqatan qo‘llab-quvvatlaydigan tillarga mos kelishini tekshiring.

## FAQ

### O‘zbekistonda nechta tilni qo‘llab-quvvatlash kerak?

Ko‘pincha o‘zbek (lotin) va rus tili, chet elliklar va xalqaro auditoriya uchun esa ingliz tili. Kirill yozuvini auditoriyangiz uchun muhim bo‘lsa qo‘shing.

### Mashina tarjimasidan foydalansa bo‘ladimi?

Qoralama sifatida — ha, ayniqsa uzun matnlar uchun. Lekin interfeys, tugmalar va do‘kondagi matnlarni til egasi ekranlar kontekstida o‘qib chiqishi kerak.

### Backend javoblarini ham lokalizatsiya qilish kerakmi?

Ha, agar server matn qaytarsa: xatolar, bildirishnomalar, xatlar. Tilni `Accept-Language` sarlavhasida uzating yoki xato kodlarini qaytarib, matnni ilovada tanlang.
