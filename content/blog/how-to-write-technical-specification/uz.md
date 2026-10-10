---
title: Texnik topshiriqni qanday yozish kerak: bosqichma-bosqich qo‘llanma
description: Texnik topshiriqning bosqichma-bosqich jarayoni va shabloni: maqsadlar, foydalanuvchilar, funksional va nofunksional talablar, integratsiyalar va qabul mezonlari.
summary: Yaxshi texnik topshiriq beshta savolga javob beradi: mahsulot nima uchun, kim uchun, nima qiladi, qanday bo‘lishi kerak va ish qabul qilinganini qanday bilamiz. Uni ekranlar ro‘yxatidan emas, foydalanuvchi vazifalaridan kelib chiqib yozing.
---

## Texnik topshiriq nima va u nima uchun kerak

**Texnik topshiriq (TT)** — buyurtmachi va ijrochi aynan nima qilinishi kerakligini qayd etadigan hujjat. U quyidagilar uchun kerak:

- muddat va byudjetning **aniq bahosini** olish;
- pudratchilarni bir xil hajm bo‘yicha solishtirish;
- qabul paytidagi nizolardan qochish: «biz boshqa narsani nazarda tutgan edik».

TT qalin bo‘lishi shart emas. Muhimi — u **bir ma’noli** bo‘lsin: har bir bandni ikkala tomon bir xil tushunsin.

## 1-qadam. Maqsadlar va kontekst

Funksiyalardan emas, biznes vazifasidan boshlang:

- mahsulot qanday muammoni hal qiladi;
- u ishlayotganini qanday bilasiz (masalan, «arizalar CRM ga qo‘lda kiritilmasdan tushadi»);
- nimalar allaqachon bor: sayt, CRM, mijozlar bazasi, brend.

## 2-qadam. Foydalanuvchilar va rollar

Tizimdan kim foydalanishini va har biriga nima kerakligini sanab chiqing:

| Rol | Asosiy vazifalar |
| --- | --- |
| Mijoz | Mahsulot topish, buyurtma berish, to‘lash |
| Menejer | Buyurtmani qayta ishlash, mijoz bilan bog‘lanish |
| Administrator | Katalog, narxlar, kirish huquqlarini boshqarish |

Rollar qanday interfeyslar va ruxsatlar kerakligini darhol ko‘rsatadi.

## 3-qadam. Funksional talablar

Bu — tizim **nima qilishi**. Qulay format — foydalanuvchi hikoyalari:

```text
Mijoz sifatida men buyurtmani Payme yoki Click orqali to‘lamoqchiman,
pulni qo‘lda o‘tkazmaslik uchun.
```

Har bir funksiya uchun ko‘rsating:

- **asosiy ssenariy** — foydalanuvchi qadamlari;
- **istisnolar** — xato, bo‘sh maydon, to‘lov bekor qilinganda nima bo‘ladi;
- **ustuvorlik** — birinchi versiya uchun majburiymi yoki keyinroq bo‘lishi mumkinmi.

Ustuvorliklar MVP ni ajratib olish va byudjetni boshqarishga yordam beradi.

## 4-qadam. Nofunksional talablar

Bu — tizim **qanday bo‘lishi** kerakligi:

- **unumdorlik** — bir vaqtda nechta foydalanuvchi, javobning ruxsat etilgan vaqti;
- **xavfsizlik** — shaxsiy ma’lumotlarni saqlash, rollar, zaxira nusxalar;
- **platformalar** — brauzerlar, iOS/Android, moslashuvchanlik;
- **tillar** — rus, o‘zbek, ingliz;
- **qulaylik (accessibility) va SEO**, agar bu ochiq sayt bo‘lsa.

Aynan shu bandlar ko‘pincha unutiladi, keyin esa qimmat qayta ishlashlarga aylanadi.

## 5-qadam. Integratsiyalar

Har bir tashqi tizimni tavsiflang:

- nomi va vazifasi (CRM, 1C, to‘lov shlyuzi, Telegram);
- **qanday ma’lumotlar** va qaysi tomonga uzatiladi;
- API va hujjatlar bormi, kirish huquqini kim beradi.

Agar hujjatlar bo‘lmasa — shunday deb yozing. Bu halol xavf, ijrochi uni bahoda hisobga oladi.

## 6-qadam. Dizayn va kontent

- Brendbuk, maketlar yoki namunalar bormi.
- Matnlar, foto, mahsulot kartochkalarini kim tayyorlaydi.
- Admin panel kerakmi va unda nima tahrirlanadi.

## 7-qadam. Qabul mezonlari

Har bir asosiy funksiya uchun tekshirsa bo‘ladigan shartni yozing:

- «Muvaffaqiyatli to‘lovdan keyin buyurtma CRM da "Yangi" statusi bilan paydo bo‘ladi».
- «Katalog sahifasi mobil qurilmada gorizontal aylantirishsiz ochiladi».

Agar talabni tekshirib bo‘lmasa, uni qabul ham qilib bo‘lmaydi.

## TT tuzilmasi shabloni

1. Loyiha maqsadlari va konteksti
2. Foydalanuvchilar va rollar
3. Funksional talablar (ustuvorliklar bilan)
4. Nofunksional talablar
5. Integratsiyalar
6. Dizayn va kontent
7. Qabul mezonlari
8. Loyihaga nima kirmaydi
9. Atamalar lug‘ati

**«Nima kirmaydi»** bo‘limi boshqa har qanday bo‘limdan ko‘ra ko‘proq nizoning oldini oladi.

## Ko‘p uchraydigan xatolar

- **Vazifa o‘rniga yechimni tavsiflash** — «tugma qiling» o‘rniga «mijoz oldingi buyurtmani takrorlashi kerak».
- **Noaniq so‘zlar** — o‘lchab bo‘ladigan mezonlarsiz «tez», «qulay», «zamonaviy».
- **Ustuvorliklar yo‘q** — hammasi «majburiy» va byudjet shishib ketadi.
- **TT bir marta yoziladi** — qarorlar o‘zgarganda uni yangilab borish kerak.

## FAQ

### Ijrochi men uchun TT yozib bera oladimi?

Ha, ko‘p jamoalar buni tahlil bosqichida qiladi. Ammo maqsadlar, rollar va biznes-qoidalarni faqat siz bilasiz, shuning uchun ishtirokingiz shart, yakuniy hujjatni esa diqqat bilan o‘qib, kelishib olish kerak.

### TT qanchalik batafsil bo‘lishi kerak?

Ikki xil pudratchi uni bir xil tushunadigan darajada batafsil. Har bir tugmaning dizayni kerak emas, ammo ssenariylar, istisnolar va qabul mezonlari kerak.

### Jarayonda talablar o‘zgarsa nima qilish kerak?

Bu normal holat. O‘zgarishlarni hujjatda qayd eting, ularning muddat va byudjetga ta’sirini baholang va ish boshlanishidan oldin kelishib oling. Moslashuvchan metodologiyalar aynan shunday ishlaydi — hujjatdan voz kechish orqali emas, boshqariladigan o‘zgarishlar orqali.
