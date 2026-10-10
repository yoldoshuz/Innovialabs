---
title: O‘zbek va rus hujjatlari uchun OCR: lotin, kirill va aralash matn
description: O‘zbek lotin, kirill va aralash yozuvdagi hujjatlar uchun OCR tanlash: klassik dvijoklar, vision LLM, adolatli test va aniqlikni oshirish usullari.
summary: Universal g‘olib yo‘q: o‘zingizning 50–100 ta real hujjatingizni 2–3 ta dvijok va vision LLM orqali o‘tkazing, belgi va maydon xatolarini o‘lchang va hujjat turingizga mos yechimni tanlang.
---

## Qisqa javob

O‘zbek va rus tilidagi hujjatlar uchun uch turdagi yechim bor: **klassik OCR dvijoklari** (Tesseract, ABBYY), **bulutli servislar** (Google Cloud Vision, Azure Document Intelligence, AWS Textract) va **vision LLM** (rasmni «o‘qib», darhol tuzilgan natija qaytaradigan modellar). Qaysi biri yaxshiroq ekani hujjatlaringizga bog‘liq, shuning uchun tanlov faqat o‘z namunangizda test orqali qilinadi.

Mintaqaning asosiy qiyinchiligi — **aralash yozuvlar**: o‘ va g‘ harflari bor o‘zbek lotin yozuvi, ў, қ, ғ, ҳ bor o‘zbek kirill yozuvi va bitta sahifadagi rus matni. Bitta tilga sozlangan dvijok o‘xshash harflarni ko‘pincha adashtiradi.

## Yondashuvlar farqi

| Yondashuv | Kuchli tomonlari | Zaif tomonlari |
|---|---|---|
| Tesseract | Bepul, lokal ishlaydi, `uzb` va `uzb_cyrl` modellari bor | Skan sifatiga sezgir, jadvallarni yomon tushunadi |
| Tijoriy OCR | Sahifa tuzilishi, jadvallar, barqarorlik | Narx, ma’lumotlar bulutga chiqishi mumkin |
| Vision LLM | Kontekstni tushunadi, maydonlarni JSON’ga ajratadi | Yo‘q matnni «o‘ylab topishi» mumkin; katta hajmda qimmatroq |

Vision LLM’ning muhim jihati: model **gallyutsinatsiya** qilishi mumkin — shartnoma raqamini «ishonarli» raqamga «tuzatishi» yoki yetishmayotgan so‘zni qo‘shib qo‘yishi. Summalar, STIR va sanalar uchun bu juda muhim.

## Adolatli testni qanday o‘tkazish kerak

1. **Namuna yig‘ing**: turli xil 50–100 ta real hujjat — skanlar, telefon rasmlari, PDF, muhrlar, qo‘lda yozilgan belgilar.
2. **Etalon tayyorlang**: matn yoki asosiy maydonlarni qo‘lda yozib chiqing. Etalonsiz taqqoslash «go‘yo yaxshiroq»ga aylanadi.
3. **Metrikalarni tanlang**: yaxlit matn uchun **CER** (belgilar bo‘yicha xato ulushi), rekvizitlar uchun **maydon aniqligi** (qiymat to‘liq mos keldimi).
4. **Natijalarni yozuv bo‘yicha ajrating**: lotin, kirill, aralash sahifalar. O‘rtacha qiymat muammolarni yashiradi.
5. **Maxsus belgilarni alohida tekshiring**: o‘, g‘, apostrof ’, ў, қ, ғ, ҳ. Ko‘p uchraydigan xato — o‘ ni o' ga almashtirish yoki apostrofni yo‘qotish.

Tesseract’da bir nechta tilni birga ko‘rsatish mumkin:

```bash
tesseract scan.png out -l uzb+uzb_cyrl+rus
```

## Aniqlikni qanday oshirish mumkin

- **Rasmga dastlabki ishlov berish**: qiyshiqlikni to‘g‘rilash, chetlarni kesish, kontrastni oshirish, skanlar uchun taxminan 300 dpi.
- **Bloklar bo‘yicha yozuvni aniqlash**: aralash sahifada avval har bir bo‘lak yozuvini aniqlang, keyin mos model bilan taning.
- **Belgilarni normallashtirish**: apostrofning turli variantlarini (', `, ‘, ’) bazaga saqlashdan oldin bitta standartga keltiring.
- **Maydonlarni validatsiya qilish**: STIR, sana, summa formatlari va nazorat raqamlarini tekshiring. Xatoni inson emas, qoida ushlasin.
- **OCR + LLM gibridi**: klassik OCR matn beradi, LLM uni maydonlarga ajratadi. Bu sof vision LLM’ga nisbatan o‘ylab topilgan qiymatlar xavfini kamaytiradi.
- **Human-in-the-loop**: ishonch darajasi past hujjatlarni operator tekshiruviga yuboring.

## Ko‘p uchraydigan xatolar

- Ideal PDF’larda test qilib, ishda qiyshiq rasmlar olish.
- Bitta hujjat demosi asosida tanlash.
- Moliyaviy maydonlarda vision LLM’ga tekshiruvsiz ishonish.
- Matnni turli apostroflar bilan saqlash — keyin qidiruv yozuvlarning yarmini topmaydi.
- Skanlarni tashqi servisga yuborishda shaxsiy ma’lumotlarni saqlash talablarini e’tiborsiz qoldirish.

## FAQ

### Faqat vision LLM bilan ishlash mumkinmi?

Bir martalik vazifalar va tuzilmagan hujjatlar uchun ko‘pincha ha. Rekvizitlarni oqim bilan qayta ishlashda OCR, LLM va validatsiya birikmasi ishonchliroq, chunki model noto‘g‘ri qiymatni ishonch bilan qaytarishi mumkin.

### Bitta sahifada lotin va kirill bo‘lsa, qanday taniladi?

Bir nechta til modelini bir vaqtda ulang yoki sahifani bloklarga bo‘lib, har biri uchun yozuvni aniqlang. Natijani aralash sahifalarda albatta alohida o‘lchang.

### Test uchun nechta hujjat kerak?

Agar namuna real sharoitni — skan sifati, rasmlar, muhrlar va qo‘lda yozilgan belgilarni aks ettirsa, har bir hujjat turi uchun bir necha o‘nta hujjat yetarli.
