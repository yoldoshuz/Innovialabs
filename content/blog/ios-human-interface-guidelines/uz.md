---
title: Apple Human Interface Guidelines: ilova jamoasi uchun asosiylari
description: Apple HIG bo‘yicha qisqa sharh: navigatsiya, tab bar, tipografika, bosish zonalari, safe area va iOS foydalanuvchilari kutadigan tizim imo-ishoralari.
summary: HIG — iOS ilova qanday ko‘rinishi va ishlashi haqidagi Apple’ning rasmiy qoidalari; amalda eng muhimi tab bar va «Orqaga» tugmasi bilan odatiy navigatsiya, Dynamic Type, kamida 44×44 pt bosish zonalari, safe area’ga rioya qilish va tizim imo-ishoralarini egallab olmaslik.
---

## Qisqacha: HIG nima va u nima uchun kerak

**Human Interface Guidelines (HIG)** — iPhone, iPad va boshqa qurilmalar uchun ilovalar dizayni bo‘yicha Apple’ning rasmiy qo‘llanmasi. Bu qonun emas, tamoyillar to‘plami, lekin iOS foydalanuvchilari unga shunchalik o‘rganib qolganki, har qanday chetga chiqish «ilova qandaydir g‘alati» degan tuyg‘u beradi.

Ikki hujjatni farqlash muhim:

- **HIG** interfeys qanday ko‘rinishi va ishlashini tasvirlaydi.
- **App Review Guidelines** — ilovani App Store’ga qabul qilish yoki rad etish qoidalari.

Ekspertlar HIG’ning har bir bandini tekshirmaydi, lekin noqulay, buzilgan yoki platformaga xos bo‘lmagan interfeys rad etilish xavfini oshiradi. Rasmiy versiya [developer.apple.com](https://developer.apple.com/design/human-interface-guidelines) saytida.

## Navigatsiya: uchta asosiy model

- **Ierarxik** — ekranlar ichkariga ochiladi, tepada sarlavha va «Orqaga» tugmasi bilan **navigation bar**. «Sozlamalar» va «Pochta» shunday ishlaydi.
- **Tekis** — bir nechta teng huquqli bo‘lim, ular **tab bar** orqali almashtiriladi.
- **Modal** — joriy ekran ustida alohida vazifa (eslatma yaratish, to‘lov) «Bekor qilish» va «Tayyor» tugmalari bilan **sheet** ko‘rinishida.

Ko‘pchilik ilovalar uchalasini birlashtiradi: bo‘limlar uchun tab bar, bo‘lim ichida ierarxiya, qisqa vazifalar uchun modal oynalar.

## Tab bar

- **Ekranning pastida** joylashadi va ilovaning asosiy bo‘limlariga olib boradi.
- Yorliqlar sonini kam saqlang: iPhone’da ortiqcha yorliqlarni tizim «Yana» bo‘limiga olib o‘tadi, bu esa noqulay.
- Yorliqlar **harakatlar uchun emas, navigatsiya uchun**. Shaklni ochadigan «Yaratish» yorlig‘i kutilganga zid.
- Har bir yorliqda ikonka va qisqa yozuv. Apple’ning tizim ikonkalari kutubxonasi — **SF Symbols**’dan foydalanish qulay.
- Tab bar’ni sababsiz yashirmang: foydalanuvchi istalgan paytda boshqa bo‘limga o‘ta olishi kerak.

## Tipografika

- Tizim shrifti — **SF Pro**. O‘z brend shriftingiz ham mumkin, agar u kichik o‘lchamlarda yaxshi o‘qilsa.
- **Dynamic Type**’ni qo‘llab-quvvatlang — bu tizimdagi matn o‘lchami sozlamasi. Qat’iy o‘lchamlar o‘rniga matn uslublaridan (Large Title, Headline, Body, Caption) foydalaning, shunda interfeys o‘zi masshtablanadi.
- Ekranlarni eng katta matn o‘lchamida tekshiring: hech narsa kesilmasligi va bir-birining ustiga chiqmasligi kerak.
- Asosiy matn uchun juda ingichka shriftlardan qoching.

## Bosish zonalari

HIG bo‘yicha bosish maydonining minimal o‘lchami — **44×44 pt**. Ikonka kichikroq bo‘lishi mumkin, lekin bosishga javob beradigan zona — yo‘q. Qo‘shni tugmalar orasida xato bosmaslik uchun yetarli joy qoldiring.

## Safe area va turli ekranlar

Zamonaviy iPhone’larda yumaloq burchaklar, tepada kesik yoki Dynamic Island va pastda **«Uy» indikatori** bor. **Safe area** — kontent hech narsa bilan yopilmasligi kafolatlangan hudud.

- Fon va rasmlar ekran chetlarigacha cho‘zilishi mumkin.
- Matn, tugmalar va kiritish maydonlari safe area ichida qolishi kerak.
- Maketni kichik va katta iPhone’da, ilova universal bo‘lsa — iPad’da va gorizontal holatda ham tekshiring.

SwiftUI’da safe area sukut bo‘yicha hisobga olinadi, uni faqat fon uchun o‘chirish kerak:

```swift
ZStack {
    Color("Background").ignoresSafeArea()
    ContentView()
}
```

## Tizim imo-ishoralari

iOS foydalanuvchilari buzib bo‘lmaydigan imo-ishoralarga tayanadi:

- **chap chetdan surish** — ierarxiya bo‘yicha orqaga;
- **pastdan yuqoriga surish** — bosh ekranga chiqish va ilovalarni almashtirish;
- **yuqori burchaklardan pastga surish** — Boshqaruv markazi va bildirishnomalar.

O‘z imo-ishoralaringiz va interaktiv elementlarni tizimnikilar bilan to‘qnashadigan ekran chetlariga joylashtirmang. Ilova ichida kutiladigan patternlar — yangilash uchun pastga tortish, ro‘yxat qatorida harakatlar uchun surish, kontekst menyusi uchun uzoq bosish.

## App Store’da ko‘pincha rad etilishga nima sabab bo‘ladi

- Nosozliklar, vaqtinchalik kontent, ishlamaydigan havolalar va «bo‘sh» ekranlar.
- Mohiyatan o‘z qiymatiga ega bo‘lmagan sayt o‘ramidan iborat ilova.
- Kamera, geolokatsiya yoki kontaktlarga ruxsatni nima uchun kerakligini tushuntirmasdan so‘rash.
- Ilova ichida **akkauntni o‘chirish** imkoniyatisiz ro‘yxatdan o‘tish.
- Faqat uchinchi tomon ijtimoiy tarmoqlari orqali kirish, maxfiylikni himoya qiluvchi teng variantsiz, masalan **Sign in with Apple**.

## Jamoalarning ko‘p uchraydigan xatolari

- Android interfeysini aynan ko‘chirish: «gamburger» menyu, suzuvchi harakat tugmasi, Material uslubidagi «Orqaga» strelkasi.
- Tungi rejim va Dynamic Type’ni e’tiborsiz qoldirish.
- Bosish zonasini hisobga olmay, «maketdagidek» mayda tugmalar qilish.
- Birinchi ishga tushirishda barcha ruxsatlarni birdaniga so‘rash.

## FAQ

### HIG’ga qat’iy amal qilish shartmi?

Yo‘q, ilovaning o‘z vizual uslubi bo‘lishi mumkin. Lekin asosiy narsalar — navigatsiya, imo-ishoralar, bosish zonalari o‘lchami, safe area, matn o‘lchamini qo‘llab-quvvatlash — saqlangani ma’qul: foydalanuvchilar ularga o‘rgangan, ekspertlar esa ular yo‘qligini sezadi.

### iOS va Android uchun bitta dizayn qilsa bo‘ladimi?

Umumiy brend uslubi — ha: ranglar, illyustratsiyalar, shriftlar, ekranlar mantig‘i. Lekin navigatsiya, tizim elementlari va imo-ishoralarni har bir platformaga moslashtirgan yaxshi, aks holda auditoriyalardan biri o‘zini noqulay his qiladi.

### HIG App Review Guidelines’dan nimasi bilan farq qiladi?

HIG — interfeys dizayni va xatti-harakati bo‘yicha tavsiyalar. App Review Guidelines — App Store’da nashr qilish qoidalari, ularni buzish rad etilishga olib keladi. Ikkala hujjatni ham ko‘rib chiqishga yuborishdan oldin emas, dizayn boshlanishidan oldin o‘qib chiqing.
