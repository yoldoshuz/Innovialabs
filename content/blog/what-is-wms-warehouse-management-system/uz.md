---
title: WMS nima: omborni boshqarish tizimi oddiy tilda
description: WMS tovarni qabul qilish, joylashtirish, yig‘ish, qadoqlash va jo‘natish orqali qanday olib boradi, shtrix-kodlar va manzilli saqlash nima uchun kerak va WMS ERP dan qanday farq qiladi.
summary: WMS — omborning jismoniy ishini boshqaradigan tizim: xodimlarga tovarni qayerga qo‘yish va qayerdan olishni aytadi va har bir yacheykadagi qoldiqni biladi, ERP esa faqat omborda jami qancha tovar borligini biladi.
---
## Qisqa javob: WMS nima

**WMS** (Warehouse Management System) — **ombor ichidagi operatsiyalarni** boshqaradigan dastur. U nafaqat qancha tovar borligini, balki **aynan qayerda yotganini** ham biladi — qaysi yacheykada, qaysi stellajda — va xodimlarga keyin nima qilish kerakligini aytadi.

Omborchi tovarni xotirasiga tayanib qidirmaydi: ma’lumot yig‘ish terminali (TSD) yoki mobil ilova ekranida u topshiriqni ko‘radi — «A-03-02-1 yacheykasidan 2 dona olish», — shtrix-kodni skanerlaydi va keyingi qadamga o‘tadi. Tizim to‘g‘ri tovar olinganini darhol tekshiradi.

## Tovarning ombor orqali yo‘li

**1. Qabul qilish (receiving).** Tovar yetkazib beruvchidan keladi. Xodim shtrix-kodlarni skanerlaydi, WMS miqdorni yetkazib beruvchiga berilgan buyurtma bilan solishtiradi va tafovut hamda yaroqsizlikni qayd etadi.

**2. Joylashtirish (putaway).** WMS bo‘sh joy, o‘lchamlar, aylanuvchanlik va saqlash qoidalarini hisobga olib, tovarni qaysi yacheykaga qo‘yishni maslahat beradi. Tez sotiladigan tovarlar — yig‘ish zonasiga yaqinroq.

**3. Yig‘ish (picking).** Buyurtma kelgach, tizim yig‘ish topshirig‘ini shakllantiradi va ombor bo‘ylab marshrut tuzadi. Turli strategiyalar bor:

- **Donali** — bitta yig‘uvchi bitta buyurtmani yig‘adi.
- **Paketli (batch)** — bir aylanishda bir nechta buyurtma.
- **Zonali** — har bir yig‘uvchi o‘z zonasi uchun javob beradi, buyurtma keyingisiga uzatiladi.

**4. Qadoqlash (packing).** Xodim yig‘ilgan tovarlarni skanerlaydi, WMS to‘liqligini tekshiradi, idishni tanlaydi va yorliqni chop etadi.

**5. Jo‘natish (shipping).** Posilkalar yetkazib berish xizmatlari yoki marshrutlar bo‘yicha taqsimlanadi, hujjatlar shakllantiriladi, buyurtma holati do‘kon va xaridorga uzatiladi.

## Shtrix-kodlar va manzilli saqlash

**Shtrix-kodlar** — WMS ning asosi. Hamma narsa skanerlanadi: tovar, yacheyka, quti, paleta, buyurtma. Har bir harakat skan bilan tasdiqlanadi, shuning uchun xatolar mijoz shikoyat qilganda emas, joyida aniqlanadi.

**Manzilli saqlash** — har bir yacheykaning o‘z kodi bor. Keng tarqalgan sxema:

```text
A-03-02-1
│  │  │  └─ javondagi yacheyka
│  │  └──── yarus (javon)
│  └─────── stellaj
└────────── ombor zonasi
```

Bunday manzillash ikki narsani beradi:

- Tovarni «biriktirilgan» joyda emas, bo‘sh joy bor istalgan yerda saqlash mumkin — bu maydonni tejaydi.
- Yangi xodim deyarli tajribali xodim kabi aniq ishlaydi, chunki uni xotira emas, tizim boshqaradi.

## WMS ERP dagi ombor hisobidan nimasi bilan farq qiladi

| | ERP / 1C dagi hisob | WMS |
|---|---|---|
| **Qaysi savolga javob beradi** | Omborda qancha tovar bor | Har bir birlik qayerda yotibdi |
| **Batafsillik darajasi** | Butun ombor | Zona, stellaj, yacheyka |
| **Asosiy foydalanuvchilar** | Buxgalteriya, xaridlar, menejerlar | Omborchilar, yig‘uvchilar, ombor boshlig‘i |
| **Xodimlar uchun topshiriqlar** | Yo‘q | Qabul, joylashtirish, yig‘ish topshiriqlari |
| **Uskunalar** | Kompyuter | TSD, skanerlar, yorliq printerlari |

Amalda ular **birgalikda** ishlaydi: ERP buyurtmalar, narxlar va buxgalteriya qoldiqlarini saqlaydi, WMS jismoniy operatsiyalarni bajaradi va ERP ga tasdiqlangan ma’lumotlarni qaytaradi.

## Omborga WMS qachon kerak

- **Yig‘ishdagi xatolar** ko‘paymoqda: noto‘g‘ri tovar, yetishmaslik.
- Tovar **«yo‘qoladi»** — hisob bo‘yicha bor, lekin topib bo‘lmaydi.
- Buyurtmani yig‘ish, ayniqsa qizg‘in kunlarda, juda uzoq vaqt oladi.
- «Nima qayerda yotganini biladigan» bir nechta tajribali omborchiga qattiq bog‘liqsiz.
- **Partiyalar, yaroqlilik muddatlari yoki seriya raqamlarini** hisobga olish kerak.

Kuniga o‘nlab buyurtma bilan ishlaydigan kichik ombor uchun WMS ortiqcha bo‘lishi mumkin — hisob moduli va javonlarning puxta markirovkasi yetarli.

## FAQ

### WMS ni ma’lumot yig‘ish terminallarisiz joriy qilish mumkinmi?

Ko‘plab tizimlar kamera skaneri bor smartfonlarda yoki ulangan Bluetooth skanerlar bilan ishlaydi. Katta hajmlar uchun professional TSD lar odatda qulayroq va ishonchliroq.

### Fulfilment orqali ishlasam, WMS kerakmi?

Ombor va yig‘ishni fulfilment operatori yuritsa, WMS uning tomonida bo‘ladi. Siz uchun uning tizimi do‘koningiz bilan qoldiqlar va buyurtma holatlarini API orqali almashishi muhim.

### WMS internet-do‘kon va marketpleyslar bilan qanday bog‘lanadi?

Integratsiya orqali: buyurtmalar yig‘ish uchun WMS ga tushadi, qaytib esa holatlar, trek-raqamlar va dolzarb qoldiqlar ketadi. Kalit sifatida odatda SKU xizmat qiladi.
