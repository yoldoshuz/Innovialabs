---
title: AI, mashinali o‘qitish va chuqur o‘qitish: farqi nimada
description: Sun’iy intellekt, mashinali o‘qitish va chuqur o‘qitish o‘rtasidagi farqning sodda tushuntirishi: ichma-ich sxema, misollar va LLM’ning o‘rni.
summary: Bular ichma-ich tushunchalar: sun’iy intellekt — butun soha, mashinali o‘qitish — qoidalar ma’lumotlardan olinadigan qismi, chuqur o‘qitish esa ko‘p qatlamli neyron tarmoqlarga asoslangan ML qismi; LLM’lar chuqur o‘qitishga kiradi.
---
## Qisqa javob: bu matryoshka

Uchta atama bir-biri bilan raqobatlashmaydi, balki bir-birining ichiga joylashadi:

```text
Sun’iy intellekt (AI)
└── Mashinali o‘qitish (ML)
    └── Chuqur o‘qitish (Deep Learning)
        └── Katta til modellari (LLM) va boshqa generativ modellar
```

- **Sun’iy intellekt** — «intellekt» talab qiladigan vazifalarni bajaradigan har qanday tizim: tanish, qaror qabul qilish, rejalashtirish, tilni tushunish.
- **Mashinali o‘qitish** — AI qurish usuli, bunda qoidalar qo‘lda yozilmaydi, **model ma’lumotlardan o‘rganadi**.
- **Chuqur o‘qitish** — xom ma’lumotlarda kerakli belgilarni o‘zi topadigan **ko‘p qatlamli neyron tarmoqlarga** asoslangan mashinali o‘qitish turi.

Har qanday chuqur o‘qitish — mashinali o‘qitish, har qanday mashinali o‘qitish esa AI. Teskarisi to‘g‘ri emas.

## Sun’iy intellekt: butun soha

AI — soyabon atama. Unga hech kim hech narsani «o‘qitmagan» juda oddiy tizimlar ham kiradi.

**Misol:** «yetkazib berish» kalit so‘zini ko‘rganda oldindan yozilgan matn bilan javob beradigan bot. Butun mantiqni dasturchi «agar — unda» qoidalari bilan belgilagan. Bu keng ma’noda AI, lekin mashinali o‘qitish emas.

Bunday **ekspert tizimlar** va qoidalarga asoslangan tizimlar mantiq shaffof va kam o‘zgaradigan joylarda hamon foydali: arizalarni chek-list bo‘yicha tekshirish, murojaatlarni oddiy yo‘naltirish.

## Mashinali o‘qitish: ma’lumotlardan qoidalar

Mashinali o‘qitishda siz modelga to‘g‘ri javoblari bilan **misollar** berasiz, u esa qonuniyatlarni o‘zi topadi.

**Misol:** arizalarni skoring qilish. Qoidalarni qo‘lda o‘ylab topish o‘rniga model tarix asosida o‘qitiladi: o‘tmishda qaysi mijozlar to‘lagan, qaysilari yo‘q. Keyin u yangi arizalarni baholaydi.

Klassik ML’ning odatiy vazifalari:

- talab va savdoni prognozlash;
- firibgarlik tranzaksiyalarini aniqlash;
- mijozlarni segmentlash;
- mahsulot tavsiyalari.

Bu yerda ko‘pincha **jadval ma’lumotlari** bilan ishlanadi, muhim belgilarni (mijoz yoshi, chek summasi, xaridlar chastotasi) odamlar tanlaydi. Algoritmlar — chiziqli modellar, qaror daraxtlari, gradient boosting.

## Chuqur o‘qitish: xom ma’lumotlardagi neyron tarmoqlar

Chuqur o‘qitish **ko‘p qatlamli neyron tarmoqlardan** foydalanadi. Asosiy farq — model belgilarni «xom» ma’lumotlardan o‘zi ajratib oladi: piksellar, tovush, matn.

**Misol:** fotosuratda mahsulotni tanish. «Krossovka» qanday ko‘rinishini tasvirlash shart emas — tarmoq ko‘plab belgilangan rasmlarda o‘qiydi va konturlar, shakllar va detallarni o‘zi ajratadi.

Chuqur o‘qitish ayniqsa kuchli bo‘lgan joylar:

- rasmlar va video (tanish, hujjatlarni OCR qilish);
- nutq (qo‘ng‘iroqlarni matnga o‘girish, ovoz sintezi);
- matn (tarjima, tahlil, generatsiya).

Buning narxi — **katta hajmdagi ma’lumotlar** va **hisoblash resurslariga** (ko‘pincha GPU) ehtiyoj, shuningdek kamroq shaffoflik: tarmoq nega bunday qaror qabul qilganini tushuntirish qiyinroq.

## LLM bu yerda qayerda

**Katta til modellari** (ChatGPT, Claude, Gemini va boshqalar) — bu chuqur o‘qitish: matnlarda o‘qitilgan Transformer arxitekturasidagi ulkan neyron tarmoqlar. Ular **generativ AI**’ga ham kiradi — yangi kontent yaratadigan modellarga.

Biznes uchun muhim xulosa: avval har bir vazifa uchun alohida model o‘qitilardi, LLM esa noldan o‘qitmasdan, prompt yordamida turli vazifalarga yo‘naltirish mumkin bo‘lgan **universal** model.

## Bitta jadvalda taqqoslash

| | Qoidalarga asoslangan AI | Klassik ML | Chuqur o‘qitish |
|---|---|---|---|
| Mantiq qayerdan | Odam yozadi | Ma’lumotlardan | Ma’lumotlardan |
| Belgilar | Odam belgilaydi | Ko‘pincha odam tanlaydi | Model o‘zi topadi |
| Ma’lumotlar | O‘qitish uchun kerak emas | O‘rtacha hajm, ko‘pincha jadvallar | Katta hajm, matn, tovush, rasmlar |
| Shaffoflik | Yuqori | O‘rtacha | Past |
| Misol | Kalit so‘zli bot | Savdo prognozi | Fotoni tanish, LLM |

## Vazifa uchun yondashuvni qanday tanlash kerak

- Mantiq oddiy va barqaror — **qoidalar** arzonroq va ishonchliroq.
- Jadvallarda tarix bor va prognoz kerak — **klassik ML**.
- Matn, rasm, nutq bilan ishlash — **chuqur o‘qitish**, ko‘pincha tayyor modellar yoki API orqali LLM.

Koddagi uchta shart yetarli bo‘lgan joyda neyron tarmoq olishning hojati yo‘q.

## FAQ

### Neyron tarmoq va AI bir narsami?

Yo‘q. Neyron tarmoq — mashinali o‘qitish ichidagi vositalardan biri. AI kengroq va neyron tarmoqsiz tizimlarni, masalan, qoidalarga asoslanganlarini ham o‘z ichiga oladi.

### ChatGPT mashinali o‘qitishmi?

Ha. ChatGPT katta til modelida ishlaydi, bu esa chuqur o‘qitish, ya’ni mashinali o‘qitish va umuman AI’ning xususiy holati.

### AI’dan foydalanish uchun biznesga data scientist kerakmi?

Tayyor modellarni API orqali qo‘llash uchun ko‘pincha ularni integratsiya qila oladigan dasturchilar yetarli. Ma’lumotlar bo‘yicha mutaxassis o‘z ma’lumotlaringizda o‘z modellaringizni o‘qitganingizda kerak bo‘ladi.
