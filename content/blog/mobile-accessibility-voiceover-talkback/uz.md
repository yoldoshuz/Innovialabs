---
title: Mobil ilovalar qulayligi: VoiceOver va TalkBack’ni qo‘llab-quvvatlash
description: Ilovani skrinriderlar uchun qulay qilish: elementlar yorlig‘i, fokus tartibi, dinamik shrift, kontrast, bosish zonalari o‘lchami va real qurilmada tekshirish.
summary: Har bir interaktiv elementning tushunarli yorlig‘i va roli bo‘lsa, fokus mantiqiy tartibda yursa, matn kattalashsa, kontrast yetarli va bosish zonalari katta bo‘lsa, ilova qulay hisoblanadi. Buni real telefonda VoiceOver va TalkBack yoqilgan holda tekshirish kerak.
---

## Qisqa javob

**VoiceOver** (iOS) va **TalkBack** (Android) — o‘rnatilgan skrinriderlar. Ular fokusdagi elementni ovoz bilan aytadi, foydalanuvchi esa svayplar bilan harakatlanadi va elementlarni ikki marta bosib faollashtiradi. Tugmaning yorlig‘i bo‘lmasa, odam «tugma»ni eshitadi va u nima qilishini tushunmaydi.

Minimal talablar to‘plami:
- har bir interaktiv elementda **yorliq** va **rol** bor;
- **fokus tartibi** ekran mantiqiga mos keladi;
- matn **dinamik shrift o‘lchamini** qo‘llab-quvvatlaydi;
- **kontrast** yetarli;
- **bosish zonalari** platforma tavsiya qilganidan kichik emas.

Bu faqat ko‘zi ojizlar uchun foydali emas: ko‘rishi zaif odamlar katta shriftni yoqadi, yorqin quyosh ostida esa kontrast hammaga muhim.

## Yorliqlar va rollar

**Yorliq (label)** element nima ekanini qisqa va «tugma» so‘zisiz tavsiflaydi — rolni skrinriderning o‘zi qo‘shadi.

| Platforma | Yorliq | Rol / sarlavha |
|---|---|---|
| SwiftUI | `.accessibilityLabel("O‘chirish")` | `.accessibilityAddTraits(.isHeader)` |
| UIKit | `accessibilityLabel` | `accessibilityTraits` |
| Jetpack Compose | `contentDescription` / `semantics` | `Modifier.semantics { heading() }` |
| Android View | `android:contentDescription` | `accessibilityHeading` |
| React Native | `accessibilityLabel` | `accessibilityRole` |

Qoidalar:
- Matnsiz ikonka-tugmaga albatta yorliq kerak: «lupa» emas, «Qidiruv».
- Shovqin bo‘lmasligi uchun **dekorativ** rasmlarni skrinriderdan yashiring.
- Holatni aniq uzating: yurakcha rangini o‘zgartirish o‘rniga «Sevimlilar, tanlangan».
- **Maslahat (hint)** — har bir element uchun emas, noaniq amallar uchun.

```swift
Button(action: deleteItem) {
    Image(systemName: "trash")
}
.accessibilityLabel("Buyurtmani o‘chirish")
```

## Fokus tartibi va guruhlash

Skrinrider elementlarni taxminan chapdan o‘ngga, yuqoridan pastga aylanib chiqadi. Muammolar nostandart joylashuvda boshlanadi: absolyut pozitsiyalash, ustma-ust qatlamlar, ko‘plab mayda elementlardan iborat kartochkalar.

- Bog‘liq elementlarni **guruhlang**. Mahsulot kartochkasi uchta alohida to‘xtash emas, bitta fokus bilan — nomi, narxi va mavjudligi ketma-ket — o‘qilishi kerak. SwiftUI’da `.accessibilityElement(children: .combine)`, Compose’da `Modifier.semantics(mergeDescendants = true)`.
- Modal oyna ochilganda fokus unga o‘tishi, yopilganda esa uni chaqirgan elementga qaytishi kerak.
- **Sarlavhalarni** belgilang — skrinrider foydalanuvchilari ular bo‘ylab mundarija kabi harakatlanadi.

## Dinamik shrift va kontrast

- **iOS:** matn uslublaridan (`.body`, `.headline`) yoki masshtablanadigan shriftlardan foydalaning — shunda matn tizimdagi o‘lcham sozlamasiga javob beradi.
- **Android:** matn o‘lchamini dp’da emas, **sp**’da bering.
- Ekranlarni eng katta o‘lchamda tekshiring: matn kesilmasdan keyingi qatorga o‘tishi, konteynerlar esa balandligi bo‘yicha o‘sishi kerak.
- WCAG bo‘yicha oddiy matn **kontrasti** kamida **4.5:1**, yirik matnniki — **3:1**. Rang ma’noning yagona tashuvchisi bo‘lmasligi kerak: maydon xatosini matn bilan ham ko‘rsating.

## Bosish zonalari o‘lchami

- **Apple HIG:** kamida **44×44 pt**.
- **Material Design:** kamida **48×48 dp**.

Ikonka vizual jihatdan kichik bo‘lishi mumkin, lekin bosish zonasi chekinishlar bilan kengaytiriladi. Adashib bosmaslik uchun qo‘shni nishonlar orasida bo‘shliq qoldiring.

## Real qurilmalarda qanday testlash

1. **VoiceOver**’ni (Sozlamalar → Universal kirish) yoki **TalkBack**’ni (Sozlamalar → Maxsus imkoniyatlar) yoqing. Tez yoqishni sozlang — masalan, iPhone’da yon tugmani uch marta bosish.
2. Asosiy ssenariylarni ekranga qaramasdan, **faqat svayplar bilan** o‘ting: ro‘yxatdan o‘tish, qidiruv, to‘lov.
3. Har bir yorliq vizual kontekstsiz tushunarli ekanini tekshiring.
4. Eng katta shrift o‘lchamini yoqing va o‘sha ekranlarni qayta o‘ting.
5. Vositalardan foydalaning: Xcode’dagi **Accessibility Inspector** va Android’dagi **Accessibility Scanner**. Ular yo‘q yorliqlar, mayda nishonlar va zaif kontrastni topadi, lekin qo‘lda tekshirishning o‘rnini bosmaydi.

## FAQ

### Do‘konlarda nashr qilish uchun qulaylik majburiymi?
Umumiy holda do‘konlar ilovani to‘liq bo‘lmagan qulaylik uchun rad etmaydi, lekin ayrim mamlakat va sohalarda qonuniy talablar bor. Har holda bu auditoriyani kengaytiradi.

### Ilova allaqachon tayyor bo‘lsa, nimadan boshlash kerak?
Asosiy ssenariylardan: ularni VoiceOver va TalkBack bilan o‘ting hamda yorliqsiz elementlar, yo‘qolgan fokus va kesilgan matnni tuzating. Bu eng kam vaqtda eng katta natija beradi.

### Avtomatik tekshiruvlar yetarlimi?
Yo‘q. Skanerlar texnik muammolarni topadi, lekin yorliq tushunarlimi va tartib mantiqiymi — buni ayta olmaydi. Skrinrider yoqilgan holda qo‘lda tekshirish kerak.
