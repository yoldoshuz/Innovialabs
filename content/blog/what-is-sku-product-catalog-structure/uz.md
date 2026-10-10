---
title: SKU nima va mahsulot katalogi tuzilmasini qanday to‘g‘ri qurish kerak
description: SKU nima, mahsulot variatsiyadan nimasi bilan farq qiladi, filtrlar, qoldiq hisobi va marketpleyslarga eksport qo‘lda ishsiz ishlashi uchun atributlar va kategoriyalarni qanday tuzish kerak.
summary: SKU — bu alohida hisobga olinadigan aniq birlikning, masalan ma’lum rang va o‘lchamdagi futbolkaning noyob kodi; katalog mahsulot, uning SKU-variatsiyalari, atributlar va kategoriyalardan quriladi va filtrlar, qoldiqlar hamda eksportlar shu tuzilmaga bog‘liq.
---
## Qisqa javob: SKU nima

**SKU** (Stock Keeping Unit, ombor hisobi birligi) — do‘kon omborda alohida sanash va sotish kerak bo‘lgan har bir narsaga beradigan ichki noyob kod.

Misol: «Basic» futbolkasi — bu **mahsulot**. Oq rangli M o‘lchamdagi futbolka — bu **SKU**. Qora rangli L o‘lchamdagisi — boshqa SKU. Ularning tavsifi va model rasmlari umumiy, lekin qoldig‘i, ba’zan narxi ham alohida.

SKU ni boshqa kodlar bilan adashtirmang:

- **Shtrix-kod (EAN, UPC)** — ishlab chiqaruvchining global kodi, barcha sotuvchilarda bir xil.
- **Ishlab chiqaruvchi artikuli** — brend katalogidagi kod.
- **SKU** — sizning shaxsiy kodingiz, uning formatini o‘zingiz belgilaysiz.

## Katalog nimalardan iborat

Ishonchli katalog tuzilmasi to‘rtta asosga tayanadi:

| Tushuncha | Bu nima | Misol |
|---|---|---|
| **Kategoriya** | Katalog daraxtidagi bo‘lim | Kiyim → Futbolkalar |
| **Mahsulot (model)** | Tavsifli umumiy kartochka | Basic futbolkasi |
| **Variatsiya (SKU)** | Parametrlarning aniq kombinatsiyasi | Basic, oq, M |
| **Atribut** | Qiymatga ega xususiyat | Rang: oq, Material: paxta |

Atributlar ikki xil bo‘ladi:

- **Variativ atributlar** alohida SKU larni hosil qiladi: rang, o‘lcham, xotira hajmi.
- **Tavsifiy atributlar** barcha variatsiyalar uchun umumiy: material, ishlab chiqarilgan mamlakat, brend.

Bu rollarni chalkashtirsangiz, yoki yuzlab takroriy kartochkalar paydo bo‘ladi, yoki o‘lchamlar bo‘yicha qoldiqni alohida sanab bo‘lmaydigan bitta mahsulot qoladi.

## SKU formatini qanday tanlash kerak

Yaxshi SKU odam uchun o‘qiladigan va vaqt o‘tishi bilan buzilmaydigan bo‘ladi:

- **Faqat lotin harflari, raqamlar va chiziqcha.** Bo‘sh joylar, kirill harflari va maxsus belgilar eksport va Excel da muammo tug‘diradi.
- **Qismlarning qat’iy tartibi**: kategoriya — model — rang — o‘lcham.
- **Narx, sana va yetkazib beruvchisiz.** Bu ma’lumotlar o‘zgaradi, kod esa o‘zgarmasligi kerak.
- **Bitta SKU ni boshqa mahsulot uchun qayta ishlatmang**, eskisi sotuvdan olingan bo‘lsa ham.

```text
TSH-BASIC-WHT-M
TSH-BASIC-BLK-L
```

## To‘g‘ri tuzilma ishni qanday yengillashtiradi

**Filtrlar.** «Rang» yoki «O‘lcham» filtri qiymatlar mahsulot nomidagi matn sifatida emas, ma’lumotnomadan olingan atribut sifatida saqlanganda ishlaydi. Filtr uchun «Oq», «oq» va «White» — uchta turli qiymat.

**Qoldiqlar hisobi.** Qoldiqlar SKU bo‘yicha yuritiladi. Variatsiyalar ajratilmagan bo‘lsa, ombor 40 ta futbolka borligini biladi, lekin ulardan nechtasi M o‘lchamda ekanini bilmaydi — natijada do‘kon mavjud bo‘lmagan mahsulotni sotadi.

**Marketpleyslarga eksport.** Uzum, Wildberries, Ozon va Amazon o‘z kategoriyalari bo‘yicha majburiy xususiyatlarni to‘ldirishni va variatsiyalarni bitta kartochkaga bog‘lashni talab qiladi. Atributlaringiz allaqachon tuzilgan bo‘lsa, eksport sizning maydonlaringizni maydonchaning maydonlari bilan moslashtirishga keladi. Xususiyatlar tavsif matnida yashiringan bo‘lsa, har bir kartochkani qo‘lda to‘ldirishga to‘g‘ri keladi.

**Integratsiyalar.** CRM, 1C, ombor va sayt ma’lumotlarni SKU orqali almashadi. Yagona kod — tizimlar bir xil mahsulot haqida gap ketayotganini tushunadigan kalit.

## Ko‘p uchraydigan xatolar

- **Juda chuqur kategoriyalar daraxti.** Xaridor va filtrlar uchun darajalar kam bo‘lgani yaxshi, qolganini atributlar hal qiladi.
- **Xususiyatlarni nomga yozish**: «Futbolka oq M paxta».
- **Ma’lumotnomasiz erkin kiritish** — takrorlar va xatolar paydo bo‘ladi.
- **Bitta mahsulotni bir nechta kartochkada** variatsiyali bitta kartochka o‘rniga.
- **Har yangilanishda SKU ni almashtirish** — qoldiqlar, buyurtmalar va marketpleyslar bilan bog‘lanish uziladi.

## Katalogni ishga tushirishdan oldingi chek-list

1. Kategoriyalar ro‘yxatini va har biri uchun atributlar to‘plamini tuzing.
2. Qaysi atributlar variativ, qaysilari tavsifiy ekanini belgilang.
3. Qiymatlar ma’lumotnomalarini yarating: ranglar, o‘lchamlar, brendlar.
4. SKU formati va uni berish qoidalarini tasdiqlang.
5. Mahsulot joylashtirmoqchi bo‘lgan marketpleyslar talablarini tekshiring va yetishmayotgan maydonlarni oldindan qo‘shing.

## FAQ

### SKU shtrix-kod bilan mos kelishi shartmi?

Yo‘q. Shtrix-kodni ishlab chiqaruvchi yoki markirovka tizimi beradi, SKU esa sizning ichki kodingiz. Ikkala maydonni variatsiya kartochkasida saqlab, ularni bog‘lab qo‘yish qulay.

### Mahsulotning variatsiyalari bo‘lmasa, SKU kerakmi?

Ha. Bunday holda mahsulotda bitta SKU bo‘ladi. Bu qoldiqlar, buyurtmalar va integratsiyalarga yagona yondashuvni saqlaydi.

### Ishga tushirilgandan keyin katalog tuzilmasini o‘zgartirish mumkinmi?

Mumkin, lekin bu filtrlar, sahifa URL lari, qoldiqlar va marketpleyslar bilan bog‘lanishlarga ta’sir qiladi. Shuning uchun o‘zgarishni migratsiya sifatida tayyorlang: eski va yangi maydonlarni moslashtiring va almashtirishdan oldin eksportlarni tekshiring.
