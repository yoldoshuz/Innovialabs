---
title: Ilova o‘rnatilishlari atributsiyasi: MMP, SKAdNetwork va maxfiylik
description: O‘rnatishlar atributsiyasi qanday ishlaydi, ATT va SKAdNetwork nimani o‘zgartirdi, Android’da nima bo‘lyapti va ilovangiz uchun MMP qanday tanlanadi.
summary: Atributsiya o‘rnatishni unga olib kelgan reklama bilan bog‘laydi. Android’da buning uchun hali ham reklama ID va Install Referrer bor, iOS’da esa ATT orqali rozilik bo‘lmasa, SKAdNetwork’ning umumlashtirilgan va kechiktirilgan statistikasi qoladi. MMP bu manbalarni bitta hisobotga birlashtiradi.
---

## Atributsiya nima va u qanday ishlaydi

**O‘rnatishlar atributsiyasi** bitta savolga javob beradi: ilovani o‘rnatib, ochgan foydalanuvchini qaysi reklama olib keldi. Usiz qaysi kampaniyalar o‘zini oqlayotganini tushunib bo‘lmaydi.

Klassik sxema:

1. Foydalanuvchi reklamani ko‘radi yoki bosadi. Reklama tarmog‘i yoki **MMP** (mobile measurement partner) bu aloqani qayd etadi.
2. Foydalanuvchi ilovani do‘kondan o‘rnatadi.
3. Birinchi ishga tushirishda MMP SDK’si qurilma va o‘rnatish haqidagi ma’lumotlarni yuboradi.
4. MMP o‘rnatishni aloqa bilan solishtiradi va uni manbaga bog‘laydi — odatda atributsiya oynasi ichida **oxirgi klik** modeli bo‘yicha.

Solishtirish usullari:

- **Reklama identifikatori** — iOS’da IDFA, Android’da GAID. Aniq, lekin foydalanuvchi roziligiga bog‘liq.
- **Google Play Install Referrer** — Google Play ilovaga o‘rnatish qaysi havola orqali kelganini uzatadi. Google Play’dan o‘rnatishlar uchun aniq usul.
- **SKAdNetwork / AdAttributionKit** — Apple’ning foydalanuvchi identifikatorlarisiz umumlashtirilgan atributsiyasi.
- **O‘zini o‘zi atributsiya qiluvchi tarmoqlar** (Meta, Google Ads va boshqalar) o‘rnatish o‘zlariniki ekanini MMP’ga o‘zlari xabar qiladi.

## App Tracking Transparency

iOS’da IDFA’ga kirish faqat foydalanuvchi ATT tizim oynasida kuzatishga ruxsat bergan bo‘lsagina mumkin. Rozilik bo‘lmasa, IDFA nollar bilan qaytadi.

```swift
import AppTrackingTransparency

ATTrackingManager.requestTrackingAuthorization { status in
    // .authorized bo‘lsa IDFA mavjud, aks holda yo‘q
}
```

Nimalar muhim:

- `Info.plist`’da maqsadni halol tushuntiruvchi `NSUserTrackingUsageDescription` matni bo‘lishi kerak;
- so‘rovni birinchi ekranda emas, foydalanuvchi ilova qadrini tushungandan keyin ko‘rsating. Tizim oynasidan oldin o‘z tushuntirish ekraningizni qo‘shish mumkin, lekin bosim va aldovsiz;
- **fingerprinting** — qurilmani IP, model va boshqa belgilar orqali aniqlash — ATT javobidan qat’i nazar Apple tomonidan taqiqlangan.

Foydalanuvchilarning katta qismi rad etadi, shuning uchun iOS’da o‘lchashning asosi SKAdNetwork bo‘ladi.

## SKAdNetwork

**SKAdNetwork (SKAN)** — Apple mexanizmi bo‘lib, unda atributsiyani tizimning o‘zi bajaradi, reklama tarmog‘i esa shaxsiylashtirilmagan hisobot — **postback** oladi.

Qanday tuzilgan:

- `Info.plist`’dagi `SKAdNetworkItems`’da siz ishlaydigan reklama tarmoqlarining identifikatorlari sanaladi;
- o‘rnatishdan keyin ilova **conversion value**’ni yangilaydi — foydalanuvchi harakatlarini kodlovchi son: ro‘yxatdan o‘tish, xarid, daromad oralig‘i;
- postback kechikish bilan va aniq foydalanuvchi haqidagi ma’lumotlarsiz keladi;
- SKAN 4’da o‘rnatishdan keyingi turli oynalar uchun uchtagacha postback, aniq (fine) va qo‘pol (coarse: low, medium, high) qiymatlar bor;
- tafsilotlar darajasi **crowd anonymity**’ga bog‘liq: o‘rnatishlar kam bo‘lsa, kampaniya haqida kamroq ma’lumot olasiz.

Odatda conversion value’ni MMP SDK’si siz uning kabinetida sozlagan sxema bo‘yicha belgilaydi. Asosiy ish — **sxemani loyihalash**: dastlabki kunlardagi qaysi hodisalar foydalanuvchi qiymatini eng yaxshi bashorat qiladi.

Apple shuningdek SKAdNetwork bilan birga ishlaydigan yangiroq freymvork — **AdAttributionKit**’ni rivojlantirmoqda. Apple hujjatlarini kuzatib boring.

## Android: reklama ID va Privacy Sandbox

- **GAID** hozircha mavjud, lekin foydalanuvchi sozlamalarda reklama ID’sini o‘chirib tashlashi mumkin — shunda ilova nollarni oladi.
- Android 13 va undan yuqoriga mo‘ljallangan ilovalar reklama ID’sidan foydalansa, `com.google.android.gms.permission.AD_ID` ruxsatini e’lon qilishi kerak.
- **Install Referrer** reklama ID’siga bog‘liq bo‘lmagan holda ishlaydi.
- **Android’dagi Privacy Sandbox** — Google’ning reklama ID orqali kuzatish o‘rnini bosishi kerak bo‘lgan Attribution Reporting kabi API’lar bilan tashabbusi. Uning muddatlari va holati bir necha bor o‘zgargan, shuning uchun dolzarb hujjatlarni va MMP’ingiz nimani qo‘llab-quvvatlashini tekshiring.

## MMP’ni qanday tanlash

Taniqli provayderlar orasida AppsFlyer, Adjust, Singular, Branch, Kochava bor. Yandex’dagi reklama va MDH auditoriyasi uchun ko‘pincha **AppMetrica** ko‘rib chiqiladi, unda ham o‘rnatishlar atributsiyasi mavjud.

| Mezon | Nimani tekshirish |
|---|---|
| Integratsiyalar | Aynan sizning reklama tarmoqlaringizni, jumladan mahalliylarini qo‘llab-quvvatlash |
| SKAN | Conversion value sxemasi va hisobotlarni sozlash qulayligi |
| Xom ma’lumotlar | Hodisalarni o‘z omboringiz yoki BI’ga eksport qilish |
| Frauddan himoya | Botlar va o‘rnatishlarni o‘g‘irlashni filtrlash |
| Diplinklar | Kechiktirilgan diplinklar va onbording havolalari |
| Narx | Atributsiyalangan o‘rnatish uchun, hodisa uchun yoki qat’iy to‘lov |
| SDK | Hajmi, ishga tushishga ta’siri, do‘konlarning maxfiylik talablariga mosligi |

## Ko‘p uchraydigan xatolar

- MMP ma’lumotlari App Store Connect va Play Console bilan mos kelishini kutish: hisoblash usullari turlicha.
- Conversion value sxemasini sozlamaslik va bo‘sh SKAN hisobotlarini olish.
- Qonun talab qiladigan joyda rozilik olinmasdan ma’lumot yig‘ishni yoqish.
- App Store maxfiylik bo‘limida va Google Play’dagi Data safety’da kuzatishni ko‘rsatmaslik.

## FAQ

### Reklama faqat bitta kanal orqali bo‘lsa, MMP kerakmi?

Har doim ham emas. Bitta tarmoqda reklama qilsangiz, boshlanishda uning o‘z analitikasi va SKAN hisobotlari yetarli bo‘lishi mumkin. Kanallar bir nechta bo‘lib, ularni bitta tizimda solishtirish kerak bo‘lganda MMP zarur bo‘ladi.

### Qurilmani boshqa ma’lumotlar orqali aniqlab, ATT’ni chetlab o‘tsa bo‘ladimi?

Yo‘q. Apple fingerprinting’ni to‘g‘ridan-to‘g‘ri taqiqlaydi va bu ilovaning rad etilishi yoki o‘chirilishiga olib kelishi mumkin.

### SKAdNetwork ma’lumotlari nega kechikib keladi?

Kechikish va umumlashtirish mexanizmga ataylab kiritilgan — postback orqali aniq foydalanuvchini va uning harakatlari vaqtini aniqlab bo‘lmasligi uchun.
