---
title: "RAG uchun hujjatlarni chunklarga bo‘lish: strategiyalar va o‘lchamlar"
description: Qat’iy, rekursiv, semantik va tuzilmaviy bo‘lish: chunk o‘lchami va ustma-ustlikni qanday tanlash, jadvallar va PDF bilan nima qilish kerak.
summary: Chunk o‘z-o‘zidan tushunarli bo‘lishi va bitta fikrni o‘z ichiga olishi kerak. Ko‘p hollarda hujjat tuzilmasi bo‘yicha bo‘lish, uzun bo‘limlarni kichik ustma-ustlik bilan rekursiv bo‘lish yaxshi ishlaydi, o‘lcham esa test savollarida tanlanadi.
---

## Qisqa javob

RAG tizimida model butun hujjatni emas, faqat topilgan **chunklarni** — matn bo‘laklarini ko‘radi. Agar chunk fikr o‘rtasida kesilgan bo‘lsa yoki uchta mavzuni aralashtirsa, qidiruv noto‘g‘ri narsani topadi, model esa noaniq javob beradi.

Ko‘pchilik korporativ hujjatlar uchun amaliy boshlang‘ich nuqta:

- **tuzilma bo‘yicha** bo‘lish — sarlavhalar, bo‘limlar, bandlar;
- uzun bo‘limlarni **rekursiv** bo‘lish — abzaslar, keyin gaplar bo‘yicha;
- qo‘shni chunklar orasida **kichik ustma-ustlik** qo‘shish;
- har bir chunkka **sarlavhalar yo‘li** va metama’lumotlarni biriktirish.

Aniq o‘lchamni boshqalarning tavsiyasi bo‘yicha emas, o‘z ma’lumotlaringizda tanlang.

## To‘rtta strategiya

| Strategiya | Qanday ishlaydi | Afzalliklari | Kamchiliklari |
|---|---|---|---|
| Qat’iy | Har N tokendan keyin kesadi | Oddiy va oldindan aytib bo‘ladigan | Gaplar va jadvallarni uzadi |
| Rekursiv | Ajratgichlar bo‘yicha: abzas → qator → gap | Tabiiy chegaralarni saqlaydi | Ma’noviy tuzilmani bilmaydi |
| Semantik | Qo‘shni gaplar ma’nosi o‘zgargan joyda chegara qo‘yadi | Bog‘langan chunklar | Qimmatroq, bo‘lishda embeddinglar kerak |
| Tuzilmaviy | Belgilashdan foydalanadi: Markdown/HTML sarlavhalari, bandlar | Reglament va hujjatlar uchun eng yaxshi chegaralar | Yaxshi parser kerak |

Amalda ular birlashtiriladi: avval tuzilma, keyin juda uzun bo‘limlar ichida rekursiv bo‘lish.

## Chunk o‘lchami javoblarga qanday ta’sir qiladi

**Kichik chunklar:**
- tor savol bo‘yicha aniqroq topiladi;
- lekin kontekstni yo‘qotadi: "muddat 10 kun" — nimaning muddati ekani aytilmagan.

**Katta chunklar:**
- ko‘proq kontekst beradi;
- lekin embeddingni xiralashtiradi: vektor bir vaqtda bir nechta mavzuni tasvirlaydi, qidiruv yomonroq saralaydi;
- model kontekst oynasini egallaydi va shovqin qo‘shadi.

Murosali usullar:

- **Sarlavhalar bilan boyitish**: chunk boshiga "Hujjat → Bo‘lim → Kichik bo‘lim" qo‘shiladi, kichik bo‘lak tushunarli bo‘ladi.
- **Small-to-big**: kichik chunklar bo‘yicha qidirasiz, modelga esa butun ota-bo‘limni berasiz.
- **Ustma-ustlik**: chegaradagi fikr yo‘qolmasligi uchun oldingi chunkdan bir nechta gap. Juda katta ustma-ustlik natijalarda dublikatlar ko‘paytiradi.

## Jadvallar

Yarmidan kesilgan jadval foydasiz: ustun sarlavhalarisiz qatorlarni o‘qib bo‘lmaydi. Nima qilish kerak:

- jadval o‘rtacha o‘lchamga sig‘sa, uni uzmang;
- katta jadvallarni qatorlar bo‘yicha bo‘ling, har bir chunkda **sarlavhani takrorlang**;
- ma’lumotnomalar uchun qatorni matnga aylantiring: "Tarif: Bazaviy; Muddat: 12 oy; Shart: ...";
- jadvalni so‘zlar oqimi sifatida emas, Markdown yoki HTML ko‘rinishida saqlang.

## PDF va skanlar

PDF — matn uchun emas, chop etish uchun format. Odatiy muammolar: har bir chunkda kolontitullar, aralashib ketgan ustunlar, so‘z ko‘chirishlari, qatorlar to‘plamiga aylangan jadvallar.

Cheklist:

- **sahifa tuzilmasini** (sarlavhalar, ustunlar, jadvallar) taniydigan parserdan foydalaning;
- kolontitullar va sahifa raqamlarini olib tashlang;
- ko‘chirilgan so‘zlar va sahifa chegarasida uzilgan abzaslarni birlashtiring;
- skanlar uchun OCR, keyin tanlab qo‘lda tekshirish;
- sahifa raqamini metama’lumotlarda saqlang — javobda havola uchun kerak bo‘ladi.

## Parametrlarni qanday tanlash kerak

1. Haqiqiy savollarni yig‘ing va javob hujjatlarning qayerida ekanini belgilang.
2. Bo‘lishning 2–3 variantini tayyorlang (turli o‘lcham, ustma-ustlik, strategiya).
3. Har biri uchun kerakli parcha top-k natijalarga tushishini o‘lchang.
4. Variantni tanlang, keyin yakuniy javoblar sifatini tekshiring.

Bir vaqtda bitta parametrni o‘zgartiring — aks holda nima ish berganini bilmaysiz.

## Ko‘p uchraydigan xatolar

- Barcha hujjat turlari uchun bitta o‘lcham: shartnomalar, FAQ va yo‘riqnomalar turlicha yondashuv talab qiladi.
- Metama’lumotsiz chunklar — na manbaga havola berib, na filtrlab bo‘ladi.
- PDFning tozalanmagan "xom" matnini indekslash.
- Test savollari to‘plamisiz parametrlarni tanlash.

## FAQ

### Boshlash uchun qanday chunk o‘lchamini tanlash kerak?
Tuzilmaviy bo‘lish va o‘rtacha uzunlikdagi bo‘laklardan boshlang — taxminan bitta ma’noviy band yoki bir-ikki abzas. Keyin o‘z savollaringizda kichikroq va kattaroq variant bilan solishtiring.

### Semantik bo‘lish kerakmi?
Shart emas. Hujjatlarda aniq tuzilma bo‘lsa, tuzilmaviy va rekursiv bo‘lish ko‘pincha arzonroq narxda shunga yaqin natija beradi. Semantik bo‘lish sarlavhasiz uzun matnlar uchun foydali.

### Strategiyani o‘zgartirganda hammasini qayta indekslash kerakmi?
Ha. Bo‘lish o‘zgarsa, chunklar o‘zgaradi, demak ularning embeddinglarini qayta hisoblash kerak.
