---
title: OCR nima va bugun matnni tanib olish qanday ishlaydi
description: Klassik OCR va zamonaviy sun’iy intellekt asosida hujjatlarni tushunish: farqi nimada, tanib olish aniqligiga nima ta’sir qiladi va biznesda qayerda qo‘llanadi.
summary: OCR matnli rasmni tahrirlanadigan matnga aylantiradi. Klassik OCR shunchaki belgilarni o‘qiydi, zamonaviy AI modellar esa hujjat tuzilishini tushunib, kerakli maydonlarni — raqam, sana, summani — darhol ajratib oladi.
---

## OCR nima

**OCR** (Optical Character Recognition, belgilarni optik tanib olish) — matnli rasmni mashina o‘qiy oladigan matnga aylantiradigan texnologiya. Shartnoma skani, chek surati, matn qatlamisiz PDF — OCR’dan keyin matnni qidirish, nusxalash va dastur orqali qayta ishlash mumkin.

Bugun OCR deganda ko‘pincha kengroq vazifa — **hujjatlarni tushunish** (document understanding) nazarda tutiladi: shunchaki harflarni o‘qish emas, balki hisob-fakturada raqam, sana va yakuniy summa qayerdaligini anglash.

## Klassik OCR va AI yondashuvi

### Klassik OCR

Zanjir bo‘yicha ishlaydi:

1. **Dastlabki ishlov**: qiyalikni tekislash, shovqinni olib tashlash, oq-qora rangga o‘tkazish.
2. **Matnni topish**: rasmdagi qatorlar va so‘zlarni aniqlash.
3. **Belgilarni tanish**: rasm bo‘laklarini harflarga aylantirish.
4. **Yakuniy ishlov**: lug‘at bo‘yicha tuzatish.

Natija — yaxlit matn, ba’zan koordinatalar bilan. Undan aniq maydonlarni olish uchun shablon yoki qoidalar kerak: «summa Jami so‘zining o‘ng tomonida».

### Zamonaviy AI yondashuvi

Neyrotarmoq modellari, jumladan multimodal LLM’lar, hujjatga yaxlit qaraydi: matn, joylashuv, jadvallar, muhrlar. Ularga «hisob raqami, sana va summani JSON ko‘rinishida ajratib ber» deyish mumkin va har bir shakl uchun shablonsiz tuzilgan natija olinadi.

| Mezon | Klassik OCR | AI asosida hujjatlarni tushunish |
|---|---|---|
| Natija | Matn | Matn + tuzilma + kerakli maydonlar |
| Yangi formatlar | Yangi shablonlar kerak | Ko‘pincha sozlashsiz ishlaydi |
| Qo‘lyozma | Zaif | Sezilarli yaxshiroq, lekin mukammal emas |
| Tezlik va narx | Tez va arzon | Hujjat boshiga qimmatroq |
| Oldindan bilish | Yuqori | Xatolar va «o‘ylab topish» bo‘lishi mumkin |
| Internetsiz ishlash | Oson | Lokal modellar bilan mumkin |

Amalda ular ko‘pincha **birgalikda** ishlatiladi: OCR dvigateli koordinatali matn beradi, til modeli esa maydonlarni ajratib, tekshiradi.

## Aniqlikka nima ta’sir qiladi

- **Skan sifati**: aniqlik, tiniqlik, yorug‘lik. Soyali xira surat — xatolarning asosiy manbai.
- **Qiyalik va perspektiva**: burchak ostida olingan hujjat suratini tekislash kerak.
- **Shrift va bosma**: mayda, xira yoki matritsali shrift yomonroq tanib olinadi.
- **Maket**: ko‘p ustunli matn, chegarasiz jadvallar, matn ustidagi muhrlar vazifani murakkablashtiradi.
- **Til va alifbo**: kirill va lotinning aralashishi, maxsus belgilar (masalan, o‘zbek tilidagi o‘ va g‘) modelda qo‘llab-quvvatlanishi kerak.
- **Qo‘lyozma matn**: eng murakkab toifa.

Aniqlikni oshirishning oddiy usullari: foydalanuvchilar uchun suratga qo‘yiladigan talablar, yuklashda tiniqlikni avtomatik tekshirish, iloji bo‘lsa surat o‘rniga PDF qabul qilish.

## Biznesda OCR qayerda qo‘llanadi

- **Buxgalteriya**: hisob-fakturalar, yuk xatlari, dalolatnomalar — hisob tizimiga avtomatik kiritish.
- **Mijozlarni ro‘yxatga olish**: hujjat surati bo‘yicha anketani to‘ldirish.
- **Cheklar va xarajatlar**: xizmat safari va xaridlarni hisobga olish.
- **Logistika**: yuk xatlari, bojxona deklaratsiyalari.
- **Arxivlar**: qog‘oz hujjatlarni qidiriladigan bazaga aylantirish.
- **Chat-botlar**: foydalanuvchi surat yuboradi, bot ma’lumotlarni ajratib oladi.

## Kutilmagan muammolarsiz qanday joriy qilish kerak

1. Turli sifatdagi 50–100 ta real hujjat yig‘ing.
2. Qaysi maydonlar kerakligini va qanday xato maqbul ekanini belgilang.
3. 2–3 ta yechimni demo misollarda emas, aynan shu to‘plamda solishtiring.
4. **Tekshiruvlar** qo‘shing: qatorlar yig‘indisi jami summaga teng, STIR kerakli uzunlikda, sana maqbul oraliqda.
5. Shubhali hujjatlarni tasdiqlash uchun xodimga yuboring.

## Tipik xatolar

- Yechimni mukammal skanlarda baholash.
- Tanib olingan summalarni tekshiruvsiz hisobga kiritish.
- Hujjatlardagi shaxsiy ma’lumotlarni himoya qilishni unutish.

## FAQ

### Hujjatlar doim bir xil shaklda bo‘lsa, AI kerakmi?

Shart emas. Bir turdagi sifatli hujjatlar uchun shablonli klassik OCR ko‘pincha yetarli, arzonroq va oldindan bilinadigan bo‘ladi.

### OCR qo‘lyozmani taniy oladimi?

Zamonaviy modellar toza husnixatni eski tizimlarga qaraganda ancha yaxshi taniydi, lekin aniqlik hali ham bosma matnnikidan past. Muhim ma’lumotlar inson tekshiruvini talab qiladi.

### Hujjatlarni bulutga yubormasdan qayta ishlash mumkinmi?

Ha. O‘z serveringizda ishlaydigan OCR dvigatellari va ochiq modellar mavjud. Bu shaxsiy yoki maxfiy ma’lumotli hujjatlar uchun dolzarb.
