---
title: OCR va AI yordamida hisob-faktura va cheklarni avtomatlashtirish
description: Hisob-faktura yoki chek skanidan buxgalteriya tizimidagi tuzilgan maydonlargacha konveyer qurish: validatsiya, ishonch chegaralari va qo‘lda tekshiruv.
summary: Hujjatlar konveyeri faylni qabul qilish, OCR, AI yordamida maydonlarni ajratish, qoidalar bilan tekshirish va buxgalteriya tizimiga yuklashdan iborat; tizim ishonchi komil bo‘lmagan hamma narsa qo‘lda tekshiruvga ketadi.
---

## Avtomatlashtirish qisqacha qanday ishlaydi

Hisob-faktura va cheklarni avtomatik qayta ishlash — besh bosqichli konveyer:

1. Hujjatni **qabul qilish**: pochta, messenjer, yuklash, skaner.
2. **OCR** — rasm yoki PDFni matnga aylantirish.
3. **Maydonlarni ajratish** — AI yetkazib beruvchi, STIR, sana, raqam, summalar, QQS va pozitsiyalarni topadi.
4. **Validatsiya** — qoidalar ma’lumotlar ishonchli va mos kelishini tekshiradi.
5. Buxgalteriya tizimiga **yuklash** yoki biror narsa noto‘g‘ri bo‘lsa — **qo‘lda tekshiruv**.

Asosiy g‘oya: mashina odatiy ishni bajaradi, odam esa faqat shubhali hujjatlarga qaraydi.

## 1–2-bosqich. Qabul qilish va OCR

Hujjatlar turli ko‘rinishda keladi: matn qatlamli PDF, telefon rasmlari, sifatsiz skanlar.

- PDFda **matn qatlami** bo‘lsa, OCR kerak emas — matn to‘g‘ridan-to‘g‘ri, tanib olish xatolarisiz ajratiladi.
- Rasm va skanlar uchun **dastlabki ishlov** foydali: tekislash, kesish, kontrastni oshirish.
- Natija yonida **asl faylni** saqlang — u tekshiruv va audit uchun kerak.
- Dublikatlarni fayl xeshi va «yetkazib beruvchi + raqam + sana» birikmasi bo‘yicha ajrating.

## 3-bosqich. Maydonlarni ajratish

Bu yerda LLM va multimodal modellar yaxshi ishlaydi: ular har bir yetkazib beruvchi uchun shablonsiz ham hujjat tuzilishini tushunadi.

Model matn yoki rasmni oladi va qat’iy belgilangan JSON qaytaradi:

```json
{
  "supplier_name": "Namuna MChJ",
  "supplier_tax_id": "123456789",
  "invoice_number": "45",
  "invoice_date": "2026-03-14",
  "currency": "UZS",
  "total": 1500000,
  "vat": 0,
  "lines": [
    {"name": "Xizmat", "qty": 1, "price": 1500000}
  ]
}
```

Qat’iy sxemani talab qiling va **uni dasturiy tekshiring**: sxemadan o‘tmagan javob keyingi bosqichga o‘tmaydi.

## 4-bosqich. Qoidalar bilan validatsiya

AI raqamda xato qilishi mumkin, shuning uchun ajratishdan keyin oddiy deterministik tekshiruvlar ishlaydi:

- **pozitsiyalar summasi** jami summaga teng (yaxlitlash uchun ruxsat bilan);
- **QQS** stavka va bazaga mos keladi;
- **STIR** to‘g‘ri formatda, yetkazib beruvchi ma’lumotnomada bor;
- **sana** kelajakda emas va juda eski emas;
- **valyuta** ko‘rsatilgan va ruxsat etilgan;
- shu yetkazib beruvchidan shu raqamli hujjat hali o‘tkazilmagan.

Bu qoidalar arzon, tushunarli va tanib olish xatolarining katta qismini ushlaydi.

## Ishonch chegaralari va qo‘lda tekshiruv

Har bir hujjatga holat beriladi:

| Vaziyat | Nima bo‘ladi |
|---|---|
| Barcha qoidalar o‘tdi, ishonch yuqori | Avtomatik yuklash |
| Qoidalar o‘tdi, lekin ayrim maydonlarda ishonch past | Faqat shu maydonlar qo‘lda tekshiriladi |
| Qoida o‘tmadi | Hujjat to‘liq qo‘lda tekshiriladi |
| Hujjat tanilmadi | Yuboruvchiga qaytarish yoki qo‘lda kiritish |

Ishonch darajasini OCR dvigatelidan, modeldan olish yoki bilvosita belgilar asosida qurish mumkin: maydon ma’lumotnoma bilan mos keldimi, summalar to‘g‘ri chiqdimi.

Chegaralarni **ehtiyotkor** boshlang: avvaliga deyarli hamma narsa odamdan o‘tadi. Xatolar statistikasi to‘plangan sari chegaralar yumshatiladi.

Tekshiruv interfeysi **asl hujjatni maydonlar yonida** ko‘rsatishi va muammoli joylarni ajratib ko‘rsatishi kerak. Operator tuzatishlarini saqlang — bu promptlar va qoidalarni yaxshilash uchun material.

## 5-bosqich. Buxgalteriya tizimiga yuklash

- Integratsiya tizimga qarab API, fayl almashinuvi yoki oraliq baza orqali amalga oshiriladi.
- Yetkazib beruvchilar va xarajat moddalarini buxgalteriya tizimining **ma’lumotnomalari** bilan moslang.
- **Jurnal** yuriting: kim va qachon yukladi, nimani o‘zgartirdi, qachon yuklandi.
- Shaxsiy va moliyaviy ma’lumotlarni cheklangan kirish bilan saqlang.

## Ko‘p uchraydigan xatolar

- Summalarni tekshirmasdan model natijasiga ishonish.
- Asl fayllar va tahrirlar tarixini saqlamaslik.
- Birinchi kundanoq avtomatik o‘tkazish uchun qattiq bo‘lmagan, tavakkal chegaralarni qo‘yish.
- Dublikatlarni e’tiborsiz qoldirish — ikki marta yuborilgan bitta hisob ikki marta o‘tkaziladi.

## FAQ

### Har bir yetkazib beruvchi uchun shablon sozlash kerakmi?

Odatda yo‘q. Zamonaviy modellar turli ko‘rinishdagi hujjatlardan shablonsiz maydonlarni ajratadi. Shablon yoki qo‘shimcha qoidalar nostandart hujjatli eng ko‘p uchraydigan bir nechta yetkazib beruvchi uchun mantiqli.

### Tizim xira chek rasmlarini uddalay oladimi?

Qisman. Dastlabki ishlov yordam beradi, ammo kuchli xiralik yoki yorug‘lik tushganda ma’lumotlar yo‘qoladi. Bunday hujjatlar qo‘lda tekshiruvga ketishi yoki qayta suratga olish iltimosi bilan qaytarilishi kerak.

### Jarayondan odamni butunlay olib tashlash mumkinmi?

Oddiy va takrorlanuvchi hujjatlar uchun qo‘l mehnati ulushi vaqt o‘tishi bilan kamayadi. Lekin tanlab nazorat qilish va istisnolarni qayta ishlash, ayniqsa moliyaviy ma’lumotlar uchun, har doim kerak.
