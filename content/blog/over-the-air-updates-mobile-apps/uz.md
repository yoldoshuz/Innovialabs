---
title: OTA-yangilanishlar: do‘kondagi relizsiz tuzatishlarni chiqarish
description: OTA-yangilanishlar qanday ishlaydi: Expo Updates, CodePush muqobillari, Flutter uchun Shorebird, do‘kon qoidalari, orqaga qaytarish va majburiy yangilash.
summary: OTA-yangilanishlar yangi JavaScript yoki Dart kodini do‘kon tekshiruvisiz yetkazadi, lekin nativ qismni o‘zgartirmaydi. React Native uchun asosiy variant — Expo Updates, Flutter uchun — Shorebird; versiyalar mosligi, bosqichma-bosqich chiqarish, orqaga qaytarish va majburiy yangilash ekrani albatta kerak.
---

## «Havo orqali» nimani yangilash mumkin

Kross-platforma ilova ikki qatlamdan iborat:

- **nativ qobiq** — kompilyatsiya qilingan kod, SDK’lar, ruxsatlar, ikonka, `Info.plist` va `AndroidManifest.xml`;
- **ilova kodi** — React Native’dagi JavaScript-bandl yoki Flutter’dagi Dart kodi va resurslar.

OTA-yangilanish faqat ikkinchi qatlamni almashtiradi. Mantiqdagi xatoni, matnni, ekran maketini tuzatish mumkin. Yangi nativ SDK, kamera ruxsatini qo‘shish yoki React Native versiyasini yangilash mumkin emas — buning uchun do‘kon orqali oddiy reliz kerak.

## Do‘kon qoidalari

**Apple.** App Review qoidalari (2.5.2-bo‘lim) funksionallikni o‘zgartiradigan bajariladigan kodni yuklab olishni taqiqlaydi. Apple Developer Program litsenziya shartnomasi interpretatsiya qilinadigan kod, masalan JavaScript uchun istisno qiladi — agar yangilanish ilovaning asosiy maqsadini o‘zgartirmasa, boshqa kod uchun do‘kon yaratmasa va tekshiruvni chetlab o‘tmasa. OTA-yechimlar aynan shu istisnoga tayanadi.

**Google Play.** Siyosat bajariladigan kodni (dex, JAR, `.so`) Google Play’dan boshqa manbadan yuklab olishni taqiqlaydi, lekin Android API’ga bilvosita kirishga ega virtual mashina yoki interpretatorda bajariladigan kodga bu taalluqli emas.

Amaliy xulosa: **tuzatishlar va kichik yaxshilanishlar — ha, tekshiruvni chetlab o‘tadigan yirik yangi funksiyalar — yo‘q**. Jiddiy o‘zgarishlarni do‘kon orqali chiqaring.

## Vositalarni taqqoslash

| | Expo Updates (EAS Update) | CodePush muqobillari | Shorebird |
|---|---|---|---|
| Platforma | React Native (Expo va `expo-updates` bilan bare-loyihalar) | React Native | Flutter |
| Nimani yangilaydi | JS-bandl va resurslar | JS-bandl va resurslar | Dart kodi |
| Moslik | `runtimeVersion` | Binar faylning maqsadli versiyasi | Patch aniq relizga bog‘langan |
| Hosting | Expo bulut yoki protokol bo‘yicha o‘z serveringiz | O‘z serveringiz yoki uchinchi tomon xizmati | Shorebird bulut |

**CodePush** uzoq vaqt React Native uchun standart edi, lekin u Microsoft App Center ichida ishlardi, App Center esa yopilgan. Hozirgi variantlar: EAS Update’ga o‘tish, mos self-hosted server ko‘tarish yoki uchinchi tomon yechimini tanlash. Yangi loyihalarda ko‘pincha EAS Update tanlanadi.

**Shorebird** — Flutter uchun code push. Relizni `shorebird release` orqali, tuzatishlarni esa `shorebird patch` orqali chiqarasiz:

```bash
shorebird release android
shorebird patch android
```

Expo’da yangilanishni nashr qilish — bitta buyruq:

```bash
eas update --channel production --message "Fix checkout crash"
```

## Versiyalar mosligi — asosiy qoida

Eng xavfli xato — foydalanuvchida o‘rnatilgan versiyada yo‘q bo‘lgan nativ modulni chaqiradigan JS-bandlni yuborish. Natija — ishga tushishda crash.

Expo’da buni **runtimeVersion** hal qiladi: yangilanishni faqat ishlash muhiti versiyasi mos keladigan yig‘ilmalar oladi.

```json
{
  "expo": {
    "runtimeVersion": { "policy": "appVersion" }
  }
}
```

Qoida oddiy: **nativ qatlam o‘zgardimi — runtimeVersion o‘zgaradi va do‘konga yangi reliz chiqadi**.

## Orqaga qaytarish strategiyalari

- **Bosqichma-bosqich chiqarish.** Yangilanishni foydalanuvchilarning bir qismiga bering, crash va xatolarni kuzating, keyin kengaytiring.
- **Tezkor orqaga qaytarish.** Oldingi barqaror yangilanishni qayta nashr qilish yoki konsolda patch’ni bekor qilish imkoniyatini saqlang. Jarayonni insident paytida emas, oldindan sinab ko‘ring.
- **O‘rnatilgan himoya.** OTA-kutubxonalar yangilanish ishga tushmasa, yig‘ilmaga joylangan bandlga qaytishi mumkin. Bu mexanizmni o‘chirmang.
- **Monitoring.** Crash yig‘ish tizimida yangilanish identifikatorini belgilang — shunda aynan qaysi yangilanish ilovani buzgani ko‘rinadi.
- **Alohida kanallar.** Testerlar uchun `staging`, hamma uchun `production`.

## Majburiy yangilash ekrani

Agar tuzatish nativ o‘zgarishlarni talab qilsa, OTA yordam bermaydi — foydalanuvchilarni do‘kon orqali yangilashga undash kerak.

1. Serverda yoki remote config’da **qo‘llab-quvvatlanadigan minimal versiya** saqlanadi.
2. Ishga tushishda ilova uni o‘z versiyasi bilan solishtiradi.
3. Versiya pastroq bo‘lsa, do‘konga o‘tish tugmasi bilan ekran ko‘rsatiladi. Yumshoq variantni yopish mumkin, qat’iysini — yo‘q.

Android’da immediate va flexible rejimlariga ega **In-App Updates API** bor. iOS’da bunday API yo‘q — foydalanuvchini App Store’dagi ilova sahifasiga yo‘naltiring.

Qat’iy bloklashni faqat haqiqiy zarurat bo‘lganda ishlating: API mos kelmasligi, zaiflik yoki huquqiy talablar.

## FAQ

### Apple OTA sababli ilovani rad etishi mumkinmi?

OTA’ni tuzatishlar uchun ishlatish — keng tarqalgan amaliyot. Xavf yangilanishlar ilova maqsadini o‘zgartirsa yoki tekshiruvni chetlab o‘tib yirik funksionallik qo‘shsa paydo bo‘ladi.

### Foydalanuvchilar OTA-yangilanishni qanchalik tez oladi?

Odatda yangilanish fonda yuklanadi va keyingi ishga tushishda qo‘llanadi. Buni sozlash mumkin: ishga tushishda tekshirib, darhol qo‘llash ham mumkin, lekin bu ishga tushish vaqtini uzaytiradi.

### Do‘kondagi relizlarni butunlay OTA bilan almashtirsa bo‘ladimi?

Yo‘q. Nativ bog‘liqliklar, ruxsatlar, freymvorkning yangi versiyalari va do‘kon talablari baribir muntazam relizlarni talab qiladi. OTA — ular orasidagi tezkor tuzatishlar uchun vosita.
