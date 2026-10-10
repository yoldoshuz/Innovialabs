---
title: Figma’da Auto Layout: amaliy qo‘llanma
description: Figma Auto Layout’da yo‘nalish, gap, padding, Hug, Fill va Fixed o‘lchamlari, ichma-ichlik va ko‘chirish — tugma, kartochka va moslashuvchan ro‘yxat misolida.
summary: Auto Layout freymni berilgan yo‘nalish, bo‘shliqlar va o‘lcham qoidalari bo‘yicha ichidagilarni o‘zi joylashtiradigan konteynerga aylantiradi. Hug, Fill, Fixed va ichma-ichlikni o‘zlashtirsangiz, matn va ekran kengligiga o‘zi moslashadigan tugma, kartochka va ro‘yxatlarga ega bo‘lasiz.
---

## Auto Layout nima

**Auto Layout** — Figma’dagi freym xususiyati bo‘lib, unda ichki elementlar avtomatik ravishda qatorga yoki ustunga, belgilangan bo‘shliqlar bilan joylashadi. Matnni o‘zgartiring, element qo‘shing yoki freymni cho‘zing — joylashuv o‘zi yangilanadi. Mantiqan bu CSS’dagi flexbox’ga yaqin, shuning uchun bunday maketlarni dasturchilarga topshirish osonroq.

Auto Layout qo‘shish: elementlar yoki freymni belgilang va **Shift + A** ni bosing.

## Asosiy sozlamalar

| Sozlama | Nima qiladi |
|---|---|
| **Direction** | Vertikal, gorizontal yoki ko‘chirish bilan (Wrap) |
| **Gap** | Elementlar orasidagi masofa; Auto rejimi ularni butun kenglik bo‘ylab taqsimlaydi |
| **Padding** | Freym chetlaridan ichki bo‘shliqlar, umumiy yoki har bir tomon uchun |
| **Alignment** | Elementlar freym ichida qanday tekislanadi |
| **Resizing** | Freym va elementlar kenglik va balandlik bo‘yicha o‘zini qanday tutadi |

## Hug, Fill va Fixed

Ko‘pchilik aynan shu yerda qoqiladi.

- **Hug contents** — o‘lcham ichidagiga qarab. Matn uzunroq bo‘lsa, tugma kengayadi.
- **Fill container** — element ota Auto Layout’dagi barcha bo‘sh joyni egallaydi. Kiritish maydoni forma kengligi bo‘ylab cho‘ziladi.
- **Fixed** — pikselda qat’iy o‘lcham, na ichidagiga, na otaga bog‘liq.

Qoida: **tashqi** konteynerlar odatda Fixed yoki Fill, **ichki** elementlar esa Hug yoki Fill. Moslashuvchanlik uchun **min width va max width** bering, shunda kartochka o‘qib bo‘lmas darajada qisqarmaydi va cheksiz cho‘zilmaydi.

## 1-qadam: tugma

1. «Ariza yuborish» matnli qatlamini yarating.
2. Uni belgilab **Shift + A** ni bosing. Matn Auto Layout’li freym ichiga tushadi.
3. Yo‘nalish — **gorizontal**, padding — masalan, vertikal 12 va gorizontal 24.
4. Fon, burchak radiusi va matn chap tomoniga ikonka qo‘shing. Ikonka va matn orasidagi gap — 8.
5. Freym kengligi va balandligi — **Hug**.

Tekshiring: matnni uzunrog‘iga almashtiring — tugma kengayadi, bo‘shliqlar saqlanadi. To‘liq kenglikdagi tugma kerak bo‘lsa, ota konteyner ichida kenglikni **Fill** ga o‘zgartiring va ichidagini markazga tekislang.

## 2-qadam: kartochka

1. Elementlarni yig‘ing: rasm, sarlavha, tavsif va 1-qadamdagi tugma.
2. Hammasini belgilab **Shift + A** ni bosing, yo‘nalish — **vertikal**, gap 16, padding 24.
3. Kartochka kengligi — **Fixed** (masalan, 320), balandligi — **Hug**.
4. Rasm, sarlavha va tavsifga **Fill** kenglik bering, ular kartochka kengligi bo‘ylab cho‘ziladi. Matnli qatlamlarga Hug balandlik bering, shunda uzun tavsif kartochkani shunchaki kattalashtiradi.
5. Sarlavha va tavsif odatda tugmadan ko‘ra bir-biriga yaqinroq turadi. Ularni gap 8 bo‘lgan **ichki** Auto Layout’ga o‘rang — yaqinlik tamoyili shunday ishlaydi.

**Ichma-ichlik** — Auto Layout’ning asosiy kuchi: murakkab ekran har biri o‘z bo‘shliqlariga ega oddiy konteynerlardan yig‘iladi.

## 3-qadam: ko‘chirishli moslashuvchan ro‘yxat

1. Bir nechta kartochka yarating va ularni Auto Layout’ga birlashtiring.
2. Direction’da **Wrap** ni tanlang: kenglik tugaganda elementlar yangi qatorga o‘tadi.
3. Konteyner kengligi — **Fixed** yoki **Fill**, toki nimaga nisbatan ko‘chirish aniq bo‘lsin.
4. Gorizontal gap’ni va alohida qatorlar orasidagi masofani bering.
5. Kartochkalarga **Fill** kenglik va **min width** (masalan, 280) bering. Endi konteyner torayganda kartochkalar avval minimumgacha qisqaradi, keyin keyingi qatorga o‘tadi.

Konteynerni sichqoncha bilan cho‘zing: keng ekranda qatorda kartochkalar ko‘proq, torida — bitta. Bu allaqachon moslashuvchan setkaning prototipi.

## Ko‘p uchraydigan xatolar

- **Hug tugma ichida qat’iy kenglikdagi matn** — tugma kattalashmaydi. Tugmalardagi matnli qatlamlarga Hug qo‘ying.
- **Otasi Hug bo‘lgan elementda Fill** — ziddiyat yuzaga keladi va Figma xatti-harakatni almashtiradi. Kamida bitta darajada kenglik aniq bo‘lishi kerak.
- **Bo‘shliqlarni probel yoki bo‘sh to‘rtburchaklar bilan berish** — gap va padding’dan foydalaning.
- **Ustida «osilib» turishi kerak bo‘lgan element** (ikonkadagi bildirishnoma belgisi) joylashuvni buzadi. Unga **Absolute position** ni yoqing.

## FAQ

### Auto Layout Constraints’dan nimasi bilan farq qiladi?

Constraints elementni oddiy freym chetlariga bog‘laydi va o‘lcham o‘zgarganda xatti-harakatni belgilaydi. Auto Layout esa elementlarning bir-biriga nisbatan joylashuvini boshqaradi. Amalda asosiy tuzilma Auto Layout’da quriladi, Constraints esa Absolute position’li elementlar va oddiy freymlar uchun kerak.

### Butun maketni Auto Layout’da qilish kerakmi?

Barcha takrorlanadigan va o‘zgaradigan qismlar uchun bu maqsadga muvofiq: tugmalar, kartochkalar, ro‘yxatlar, formalar, navigatsiya. Illyustratsiyalar va erkin kompozitsiyalar uchun shart emas.

### Auto Layout dasturchilarga qanday yordam beradi?

Gap, padding va o‘lcham rejimlari to‘g‘ridan-to‘g‘ri flexbox xususiyatlariga mos keladi, shuning uchun dasturchi inspeksiya rejimida har bir elementning koordinatalarini emas, tushunarli bo‘shliq qiymatlarini ko‘radi.
