---
title: Expo yoki sof React Native: qaysi yondashuvni tanlash kerak
description: Expo va bare React Native taqqoslanadi: ishlab chiqish tezligi, native modullar, EAS Build va Update, config plugins hamda prebuild qachon haqiqatan kerak.
summary: Ko‘pchilik yangi loyihalar uchun Expo’dan boshlash oqilona: u native kodni taqiqlamaydi, uni development build va config plugins orqali ulaydi. Sof React Native native loyihalarni qo‘lda faol tahrirlasangiz o‘zini oqlaydi.
---

## Qisqa javob

Ilgari tanlov «qulay, lekin cheklangan Expo» va «moslashuvchan, lekin mehnattalab React Native» kabi yangrardi. Hozir bu endi to‘g‘ri emas. Expo **development build**’lar orqali istalgan native modul bilan ishlay oladi, native loyihalarni esa konfiguratsiyadan generatsiya qiladi.

- **Expo** — yangi ilova uchun yaxshi standart tanlov: tez start, tayyor modullar, bulutli build’lar va OTA-yangilanishlar.
- **Bare React Native** — jamoa `ios/` va `android/` papkalarini o‘zi yuritsa, native kodni chuqur o‘zgartirsa yoki React Native’ni mavjud native ilovaga joylashtirsa.

React Native hujjatlarining o‘zi yangi loyihalarni freymvork bilan boshlashni tavsiya qiladi va Expo — asosiy shunday freymvork.

## Bandma-band taqqoslash

| Mezon | Expo (managed + prebuild) | Bare React Native |
|---|---|---|
| Loyihani boshlash | Daqiqalar, Xcode va Android Studio sozlamasiz | Native muhitni sozlash kerak |
| Native modullar | Istalgan, development build orqali | Istalgan, qo‘lda ulanadi |
| Native loyihalar | `app.json` va plaginlardan generatsiya qilinadi | Repozitoriyda saqlanadi va qo‘lda tahrirlanadi |
| RN versiyasini yangilash | SDK yangilanadi, loyihalar qayta yaratiladi | Native fayllardagi o‘zgarishlarni qo‘lda ko‘chirish |
| Build | Bulutda EAS Build yoki lokal | Lokal yoki o‘z CI’ingiz |
| OTA-yangilanishlar | EAS Update tayyor holda | Alohida ulash kerak |

## Expo Go va development build’lar

**Expo Go** — loyihani build’siz ishga tushirish mumkin bo‘lgan do‘kondagi ilova. Prototip uchun qulay, lekin ichida faqat Expo Go’ga kiritilgan native modullar bor.

O‘z native kodiga ega kutubxona kerak bo‘lishi bilan **development build**’ga o‘ting — ilovangizning kerakli modullar bilan o‘z debug-build’i. U bilan ishlash xuddi shunday qulay: tezkor qayta yuklash, debug, lekin endi sizning native kodingiz bilan.

## Config plugins va prebuild

**Prebuild** (`npx expo prebuild`) konfiguratsiyadan `ios/` va `android/` papkalarini generatsiya qiladi. Expo bu yondashuvni **Continuous Native Generation** deb ataydi: native loyihalar — qo‘llab-quvvatlash kerak bo‘lgan manba emas, build natijasi.

Native fayllardagi o‘zgarishlar (Info.plist, AndroidManifest, Gradle) **config plugins** orqali tavsiflanadi:

```json
{
  "expo": {
    "plugins": [
      ["expo-camera", { "cameraPermission": "Kamera QR-kodlarni skanerlash uchun kerak" }]
    ]
  }
}
```

Agar kerakli sozlama tayyor plaginda bo‘lmasa, o‘zingiznikini yozish mumkin — bu prebuild vaqtida native konfiguratsiyani o‘zgartiradigan kichik JavaScript funksiya.

## EAS Build va EAS Update

- **EAS Build** iOS va Android’ni bulutda yig‘adi, sertifikatlar va imzo profillarini boshqaradi. iOS build uchun Mac shart emas.
- **EAS Submit** build’larni App Store Connect va Google Play’ga yuboradi.
- **EAS Update** JavaScript va asset yangilanishlarini do‘konda yangi versiya chiqarmasdan yetkazadi. Muhim: yangilanish faqat xuddi shu **runtime version**’ga ega build bilan mos keladi. Native kod o‘zgargan bo‘lsa, do‘kon orqali yangi build kerak.

```bash
eas build --platform all --profile production
eas update --branch production --message "Fix checkout"
```

OTA-yangilanishlar ilovaning mohiyatini o‘zgartirmasligi kerak — do‘konlar shu yo‘l bilan xatolarni tuzatish va kontentni yangilashga ruxsat beradi, ammo ko‘rikni chetlab o‘tishga emas.

## Prebuild yoki «eject» qachon haqiqatan kerak

**Eject** atamasi eskirgan: uning o‘rniga prebuild ishga tushiriladi va xohishga ko‘ra generatsiya qilingan papkalar commit qilinadi. Buni qilish va native loyihalarni qo‘lda yuritish quyidagi hollarda o‘rinli:

- config plugin bilan ifodalash noqulay bo‘lgan native o‘zgarishlar kerak;
- React Native’ni mavjud iOS/Android ilovaga joylashtiryapsiz;
- jamoada Xcode va Gradle bilan to‘g‘ridan-to‘g‘ri ishlashga odatlangan native dasturchilar bor.

Bare loyihada ham Expo modullari va EAS’dan foydalanish mumkin — bular bir-birini istisno qilmaydi.

## FAQ

### Expo’da istalgan native kutubxonadan foydalanish mumkinmi?
Ha, development build orqali. Cheklov faqat Expo Go’da bor, u yerda native modullar to‘plami qat’iy.

### Bare’dan Expo yondashuviga qaytish mumkinmi?
Mumkin, lekin native loyihalardagi qo‘lda qilingan o‘zgarishlarni config plugins’ga ko‘chirishga to‘g‘ri keladi. Bunday o‘zgarishlar qancha ko‘p bo‘lsa, o‘tish shuncha uzoq davom etadi.

### EAS Update jiddiy xatolarni tuzatish uchun mos keladimi?
Ha, agar xato JavaScript kodi yoki asset’larda bo‘lsa. Native koddagi xatolarni bunday tuzatib bo‘lmaydi — yangi build va do‘kon ko‘rigi kerak.
