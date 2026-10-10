---
title: Ilovada maxfiy ma’lumotlarni saqlash: Keychain va Android Keystore
description: Mobil ilovada token va kalitlarni qayerda saqlash, nega SharedPreferences va AsyncStorage maxfiy ma’lumot uchun xavfli, biometriya va pinning asoslari.
summary: Token va kalitlarni SharedPreferences, UserDefaults yoki AsyncStorage’da emas, iOS Keychain’da va Android Keystore himoyasi ostida saqlang. Biometriyani «ha/yo‘q» tekshiruviga emas, kriptografik kalitga bog‘lang va yodda tuting: ilova ichiga joylangan sir — sir emas.
---

## Maxfiy ma’lumotlarni qayerga qo‘yish kerak

Qisqa javob:

- **iOS** — **Keychain**’ga. Bu kirish sozlamalariga ega tizimli shifrlangan ombor.
- **Android** — ma’lumotlar **Android Keystore**’dagi kalit bilan shifrlanadi. Kalitning o‘zi himoyalangan muhitdan (TEE yoki qurilmada bo‘lsa, alohida StrongBox chipi) chiqmaydi, shifrlangan ma’lumot esa fayl yoki bazada turadi.
- **Kross-platforma** — o‘ramlar orqali: `flutter_secure_storage`, `react-native-keychain`, `expo-secure-store`. Ular ichkarida o‘sha Keychain va Keystore’dan foydalanadi.

```dart
const storage = FlutterSecureStorage();
await storage.write(key: "refresh_token", value: token);
final saved = await storage.read(key: "refresh_token");
```

## Nega SharedPreferences va AsyncStorage yaramaydi

`SharedPreferences`, `UserDefaults` va `AsyncStorage` — ilova papkasidagi oddiy fayllar, **shifrlashsiz**. Ularni boshqa ilovalardan OT qum qutisi (sandbox) himoya qiladi, ammo bu kam:

- root yoki jailbreak qilingan qurilmada fayllar to‘g‘ridan-to‘g‘ri o‘qiladi;
- aniq istisno qilinmasa, ma’lumotlar qurilmaning **zaxira nusxalariga** tushishi mumkin;
- debug va yomon himoyalangan yig‘ilmalarda tarkibni olish oson;
- jarayoningiz ichidagi zararli kod (masalan, buzilgan kutubxona) hammasini ko‘radi.

Bu omborlar sozlamalar uchun mos: mavzu, til, «onboarding o‘tildi» belgisi. Token va kalitlar uchun emas.

## Aynan nimani va qanday saqlash kerak

| Ma’lumot | Tavsiya |
|---|---|
| Access token | Qisqa muddatli; xotirada yoki himoyalangan omborda |
| Refresh token | Keychain / Keystore, akkauntdan chiqishda o‘chiriladi |
| Lokal bazani shifrlash kaliti | Qurilmada generatsiya qilinadi, Keychain / Keystore’da saqlanadi |
| Foydalanuvchi paroli | Umuman saqlanmaydi, tokenga almashtiriladi |
| Server API siri | Ilovaga qo‘yilmaydi — backend’da turadi |

Oxirgi qator muhim: binar faylga joylangan hamma narsani dekompilyatsiya orqali chiqarib olish mumkin. Pullik yoki maxfiy amallarga ruxsat beradigan uchinchi tomon kalitlari serverda turishi, ilova esa backend’ingiz orqali ishlashi kerak.

## Keychain’dagi kirish sozlamalari

Keychain elementida kirish atributi bor:

- `WhenUnlocked` — faqat qurilma qulfdan chiqarilganda ochiq;
- `AfterFirstUnlock` — yoqilgandan keyingi birinchi qulfdan chiqarishdan so‘ng ochiq, fon vazifalari uchun kerak;
- `ThisDeviceOnly` variantlari zaxira nusxa orqali boshqa qurilmaga o‘tmaydi.

Tokenlar uchun odatda fon ishini buzmaydigan eng qat’iy variant tanlanadi. Hisobga oling: iOS’da Keychain elementlari **ilova o‘chirilgandan keyin ham saqlanib qolishi** mumkin, shuning uchun birinchi ishga tushishda buni tekshirib, eski ma’lumotlarni tozalang.

## Biometriya: noto‘g‘ri va to‘g‘ri

**Noto‘g‘ri:** Face ID yoki barmoq izini chaqirish, `true` olish va shundan keyin tokenni oddiy ombordan o‘qish. Buzilgan qurilmada bu natijani soxtalashtirish mumkin.

**To‘g‘ri:** biometriyaga kalitning o‘zini bog‘lash.

- **iOS** — access control (`biometryCurrentSet`) bilan Keychain elementi: tizim ma’lumotni faqat muvaffaqiyatli biometriyadan keyin beradi.
- **Android** — `setUserAuthenticationRequired(true)` bilan Keystore kaliti va `CryptoObject` bilan `BiometricPrompt`: shifrni ochish faqat tasdiqlangandan keyin mumkin.

`biometryCurrentSet` yangi barmoq izi yoki yuz qo‘shilganda kalitni yaroqsiz qiladi — bu kimdir o‘z biometriyasini qo‘shib olgan holatdan himoya qiladi.

## Certificate pinning asoslari

Pinning — server qurilma ishonadigan istalgan sertifikatni emas, balki **aniq kalit yoki sertifikatni** ko‘rsatganini tekshirish. U soxta ildiz sertifikati orqali trafikni tutib olishdan himoya qiladi.

Pinning xavfli bo‘lib qolmasligi uchun qoidalar:

- butun sertifikatni emas, **ochiq kalit xeshini** biriktiring;
- doim **zaxira pin** saqlang — rotatsiyadan keyin ishlatiladigan kalit;
- yangilashni rejalashtiring: sertifikat almashsa-yu, ilova faqat eski pinni bilsa, u barcha foydalanuvchilarda ishlamay qoladi.

Android’da pinning Network Security Config’da belgilanadi:

```xml
<network-security-config>
  <domain-config>
    <domain includeSubdomains="true">api.example.com</domain>
    <pin-set expiration="2027-01-01">
      <pin digest="SHA-256">PRIMARY_KEY_HASH_BASE64=</pin>
      <pin digest="SHA-256">BACKUP_KEY_HASH_BASE64=</pin>
    </pin-set>
  </domain-config>
</network-security-config>
```

iOS’da — Info.plist’dagi `NSPinnedDomains` kaliti yoki `URLSession` delegatidagi tekshiruv orqali.

## Ko‘p uchraydigan xatolar

- Tokenlar `AsyncStorage`’da — «vaqtincha, keyin ko‘chiramiz».
- Sirlar yig‘ilmaga tushib qoladigan `.env` faylida.
- Tokenlar konsol loglarida yoki analitika tizimlarida.
- Akkauntdan chiqishda ombor tozalanmaydi.
- Zaxira kalitsiz pinning.

## FAQ

### Keychain va Keystore to‘liq himoya uchun yetarlimi?

Yo‘q, bu faqat bitta qatlam. Qisqa muddatli tokenlar, serverda sessiyalarni bekor qilish, hamma joyda HTTPS va backend’da huquqlarni tekshirish ham kerak. Himoyalangan ombor qurilmadan ma’lumot o‘g‘irlanishi xavfini kamaytiradi, lekin server xavfsizligini almashtirmaydi.

### API kalitini obfuskatsiya bilan yashirish mumkinmi?

Obfuskatsiya chiqarib olishni qiyinlashtiradi, ammo imkonsiz qilmaydi. Kalit qimmatli amallarga ruxsat bersa, uning joyi serverda.

### Har bir ilovaga pinning kerakmi?

Har doim emas. U moliyaviy, tibbiy va boshqa sezgir ilovalar uchun o‘zini oqlaydi. Boshqalariga ko‘pincha standart TLS tekshiruvi yetarli, rotatsiya jarayonisiz pinning esa foydadan ko‘ra ko‘proq xavf tug‘diradi.
