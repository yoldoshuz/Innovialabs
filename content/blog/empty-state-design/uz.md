---
title: Bo‘sh holatlar dizayni: bo‘sh ekranni maslahatga aylantirish
description: Bo‘sh holat turlari — birinchi ishga tushirish, natija yo‘q, xato va tozalangan ekran: har birida nima yozish kerak, matn va maket namunalari bilan.
summary: Bo‘sh holat ekranda nima paydo bo‘lishini, hozir nega bo‘shligini va keyin nima qilish kerakligini bitta aniq amal bilan tushuntirishi kerak; birinchi ishga tushirish, natijasiz qidiruv, xato va tozalangan ekran uchun turli xabarlar kerak.
---

## Bo‘sh holat nima uchun kerak

Bo‘sh ekran — foydalanuvchi nima qilishni bilmay qoladigan lahza. Yaxshi bo‘sh holat uchta savolga javob beradi:

1. **Bu qanday joy?** Bu yerda nima paydo bo‘ladi.
2. **Nega bo‘sh?** Hali ma’lumot yo‘q, hech narsa topilmadi, nimadir buzildi yoki hammasi bajarildi.
3. **Keyin nima?** Bitta aniq amal.

Oddiy formula ko‘p holatlarni qamrab oladi: **sarlavha + bitta gap + asosiy tugma**. Ikonka yoki illyustratsiya — ixtiyoriy.

## To‘rt turi

| Turi | Qachon yuzaga keladi | Nima deyish kerak | Amal |
|---|---|---|---|
| **Birinchi ishga tushirish** | Foydalanuvchi hali hech narsa yaratmagan | Bu yerda nima paydo bo‘lishi va uning foydasi | Birinchi elementni yaratish, import, shablon |
| **Natija yo‘q** | Qidiruv yoki filtrlar hech narsa topmadi | Mos keladigan narsa yo‘qligi va qidiruvni qanday kengaytirish | Filtrlarni tozalash, so‘rovni o‘zgartirish |
| **Xato** | Ma’lumot yuklanmadi, aloqa yo‘q, ruxsat yo‘q | Nima noto‘g‘ri ketgani, oddiy so‘zlar bilan | Qayta urinish, ruxsat so‘rash |
| **Tozalangan** | Foydalanuvchi hammasini bajardi yoki o‘chirdi | Bu odatiy yoki yaxshi holat ekanligi | Ko‘pincha hech narsa yoki yumshoq keyingi qadam |

Ularni aralashtirish — ko‘p uchraydigan xato: ro‘yxatni nolgacha filtrlagan foydalanuvchi «Birinchi loyihangizni yarating» degan yozuvni ko‘rmasligi kerak.

## Birinchi ishga tushirish

Bu foydalanuvchining funksiya haqidagi birinchi taassuroti, shuning uchun ekran deyarli onbording kabi ishlaydi.

```text
[ ikonka ]
Hozircha loyihalar yo‘q
Vazifalar, fayllar va odamlarni bir joyda jamlash uchun loyiha yarating.
[ Loyiha yaratish ]   Fayldan import qilish
```

- Faqat yo‘qlikni emas, **foydani** ko‘rsating.
- **Qisqa yo‘l** taklif qiling: shablon, namunaviy ma’lumotlar yoki import.
- Bitta asosiy tugma, ikkinchi darajali variantlar — havolalar ko‘rinishida.

## Natija yo‘q

```text
«stol chirog‘i» bo‘yicha hech narsa topilmadi
Yozilishini tekshiring yoki umumiyroq so‘z bilan urinib ko‘ring.
[ Filtrlarni tozalash ]
```

- Nima qidirilgani ko‘rinib turishi uchun **so‘rovni takrorlang**.
- **Faol filtrlarni ko‘rsating** va ularni bir bosishda olib tashlash imkonini bering.
- Iloji bo‘lsa, **muqobillarni taklif qiling**: mashhur mahsulotlar, o‘xshash toifalar, to‘g‘rilangan yozilish.

## Xatolar

```text
Buyurtmalarni yuklab bo‘lmadi
Internet aloqasini tekshiring va qayta urinib ko‘ring.
[ Qayta urinish ]
```

- Nima bo‘lganini **oddiy tilda** tushuntiring va foydalanuvchini ayblamang.
- Texnik tafsilotlar va xato kodlari — sarlavhada emas, pastda mayda matnda.
- Ruxsat bo‘lmasa, keyingi qadamni ayting: «Bu papkaga kirish huquqingiz yo‘q» — **Ruxsat so‘rash**.
- Foydalanuvchi boshi berk ko‘chada qolmasligi uchun navigatsiya va sarlavha qismini joyida qoldiring.

## Tozalangan yoki bajarilgan

```text
Hammasi o‘qildi
Yangi xabarlar shu yerda paydo bo‘ladi.
```

- Xotirjam, ijobiy ohang mos keladi, lekin hazillarni haddan oshirmang.
- Amal har doim ham kerak emas. Tabiiy keyingi qadam bo‘lsa, uni yumshoq taklif qiling.

## Maket qoidalari

- Bo‘sh holatni butun ekranga emas, **kontent bo‘lishi kerak bo‘lgan maydon ichida** ko‘rsating. Sarlavha qismi, tablar va filtrlar joyida qoladi.
- Elementlar tartibi: ikonka yoki illyustratsiya (ixtiyoriy, o‘rtacha o‘lchamda) → sarlavha → bir-ikki qator matn → asosiy tugma → ikkinchi darajali havola.
- Illyustratsiya, ayniqsa mobil qurilmalarda, **tugmani ekrandan tashqariga surib chiqarmasligi** kerak.
- **Yuklanish — bo‘shlik emas.** Ma’lumot yuklanayotganda skeleton yoki spinner ko‘rsating. Kontent paydo bo‘lishidan oldin bir soniya miltillagan «Ma’lumot yo‘q» chalg‘itadi.

## Matn qoidalari

- Aniq yozing: «Ma’lumot yo‘q» o‘rniga «Hozircha hisob-fakturalar yo‘q».
- Sabab va keyingi qadamni bir-ikki qisqa gapda bering.
- Tugma matnini fe’l bilan boshlang: «Hisob-faktura yaratish», «Filtrlarni tozalash».
- Xatolarda neytral va foydali ohangni saqlang; o‘ynoqi matnlarni birinchi ishga tushirish va bajarilgan vazifalar uchun qoldiring.

## Ko‘p uchraydigan xatolar

- Izohsiz va amalsiz quruq «Ma’lumot yo‘q».
- Birinchi ishga tushirish va natijasiz qidiruv uchun bir xil xabar.
- Yuklanish vaqtida ko‘rsatilgan bo‘sh holat.
- Ulkan illyustratsiya va mitti yoki umuman yo‘q tugma.
- Boshi berk ko‘chalar: bosadigan narsa ham, qaytadigan joy ham yo‘q.
- Yashirilgan filtrlar, ular tufayli nol natijaga olib kelgan narsani bekor qilib bo‘lmaydi.

## FAQ

### Bo‘sh holatlarda illyustratsiya majburiymi?

Yo‘q. Illyustratsiya birinchi ishga tushirish ekraniga xarakter qo‘shishi mumkin, lekin asosiy ishni sarlavha, matn va tugma bajaradi. Xatolar va natijasiz qidiruvda kichik ikonka yoki umuman uning yo‘qligi ko‘pincha yaxshiroq.

### Bo‘sh holat onbordingdan nimasi bilan farq qiladi?

Onbording — bu oldindan rejalashtirilgan tur yoki qadamlar to‘plami, bo‘sh holat esa aniq bir ekranda kontent bo‘lmaganda kontekstda paydo bo‘ladi. Birinchi ishga tushirishdagi bo‘sh holat yengil onbording vazifasini bajarishi mumkin: u bitta funksiyani aynan foydalanuvchi unga duch kelgan paytda tushuntiradi.

### Dizayn tizimida bo‘sh holatlarni qayerda saqlash kerak?

Ularni har bir tur uchun variantlari bor komponent qiling: birinchi ishga tushirish, natija yo‘q, xato va tozalangan. Shunda barcha ekranlarda yagona tuzilma va matn shablonlari bo‘ladi, dizaynerlar esa ularni maketlarga qo‘shishni unutmaydi.
