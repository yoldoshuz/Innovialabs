---
title: Dizayn patternlari nima va ular nima uchun kerak
description: Dizayn patternlari haqida sodda tushuntirish: uchta klassik guruh, mavjud kodda patternni qanday tanish va patternlar qachon ortiqcha murakkablikka aylanadi.
summary: Dizayn patterni — koddagi takrorlanuvchi muammoni yechishning sinalgan sxemasi, tayyor kutubxona emas. U jamoaga umumiy til beradi, lekin haqiqiy muammosiz qo‘llansa, zarar keltiradi.
---

## Qisqacha: pattern nima

**Dizayn patterni** (design pattern) — kod arxitekturasidagi takrorlanuvchi masalaning tipik yechimi tavsifi. Bu nusxa olinadigan kod ham, kutubxona ham emas, balki g‘oya: qanday obyektlar kerak, ular qanday bog‘langan va kim nimaga javob beradi.

Tushuncha 1994-yilda chiqqan «Design Patterns» kitobidan keyin keng tarqaldi. Uning to‘rt muallifini ko‘pincha «To‘rtlar to‘dasi» (Gang of Four, GoF) deb atashadi. Ular obyektga yo‘naltirilgan tillar uchun 23 ta patternni tasvirlagan. Shundan beri boshqalari ham paydo bo‘ldi: arxitektura patternlari, taqsimlangan tizimlar va frontend uchun patternlar.

Patternlarning asosiy qiymati:

- **Umumiy lug‘at.** «Bu yerda Strategy» degan ibora besh daqiqalik tushuntirishni almashtiradi.
- **Sinalgan murosalar.** Yechimning afzallik va kamchiliklarini oldindan bilasiz.
- **Bashorat qilinuvchanlik.** Yangi dasturchi tanish tuzilmani ko‘rsa, kodni tezroq tushunadi.

## Uchta klassik guruh

| Guruh | Qaysi masalani yechadi | Misollar |
|---|---|---|
| **Yaratuvchi** (creational) | Obyektlarni aniq klasslarga bog‘lanmasdan qanday yaratish | Factory Method, Abstract Factory, Builder, Singleton |
| **Tuzilmaviy** (structural) | Obyekt va klasslarni kattaroq tuzilmalarga qanday yig‘ish | Adapter, Decorator, Facade, Proxy, Composite |
| **Xulq-atvor** (behavioral) | Obyektlar qanday o‘zaro ishlaydi va vazifalarni bo‘lishadi | Strategy, Observer, Command, State, Iterator |

Oddiy maslahat: savol «qanday yaratish» bo‘lsa — yaratuvchilarga, «qanday ulash» bo‘lsa — tuzilmaviylarga, «kim nima qiladi va qachon» bo‘lsa — xulq-atvor patternlariga qarang.

## Mavjud kodda patternni qanday tanish mumkin

Patternlar ko‘pincha kodda aniq nomsiz yashaydi. E’tibor berish kerak bo‘lgan belgilar:

- **Klass va funksiya nomlari**: `PaymentFactory`, `LoggerAdapter`, `OrderBuilder`, `onChange`, `subscribe` — deyarli to‘g‘ridan-to‘g‘ri ishora.
- **Bir nechta almashtiriladigan realizatsiyasi bor interfeys** — katta ehtimol bilan Strategy.
- **Hodisalarga obuna bo‘lish va xabarnoma tarqatish** — Observer. Uni `addEventListener` da, Node.js dagi EventEmitter da va ko‘plab state-menejerlarda uchratasiz.
- **Asl obyektni o‘zgartirmasdan xulq qo‘shadigan o‘ram** — Decorator. Veb-freymvorklardagi middleware ham shunga o‘xshash ishlaydi.
- **Murakkab quyi tizimni bir nechta oddiy metod ortiga yashiradigan klass** — Facade.
- **Begona API ni sizga kerakli formatga o‘giradigan obyekt** — Adapter.

Freymvorklarning o‘zi ham patternlar asosida qurilgan. Ularni tushunsangiz, hujjatlar va manba kodni tezroq o‘qiysiz.

## Ortiqcha murakkablashtirish xavfi

Patternlar — aniq muammolar uchun dori. «Har ehtimolga qarshi» qo‘llanilsa, hech kimga kerak bo‘lmagan qatlamlar qo‘shiladi. Tipik belgilar:

- Faqat bitta turdagi obyekt yaratadigan fabrika.
- Bitta realizatsiyasi bor va ikkinchisi rejalashtirilmagan interfeys.
- Yigirma qatorlik vazifa uchun besh fayl va uch daraja abstraksiya.
- Kodni test qilishni qiyinlashtiradigan, niqoblangan global o‘zgaruvchiga aylangan Singleton.

Yaxshi qoida: **avval oddiy yechim yozing, patternni esa haqiqiy muammo paydo bo‘lganda kiriting** — takrorlanish, turlar bo‘yicha o‘sib borayotgan `if/else`, test yozishdagi qiyinchilik. Bu «kitob bo‘yicha to‘g‘ri arxitektura»dan ko‘ra KISS va YAGNI tamoyillariga yaqinroq.

## Patternlarni o‘rganishni qanday boshlash kerak

1. Eng ko‘p uchraydigan 5–6 tasidan boshlang: Strategy, Observer, Factory, Adapter, Decorator, Facade.
2. Har biri uchun bir jumlada **qaysi muammoni yechishini** ifodalang, diagrammasi qanday ko‘rinishini emas.
3. Bu patternni o‘zingiz ishlayotgan kodda toping: freymvork, kutubxona yoki o‘z loyihangizda.
4. Kichik bir qismni pattern bilan va patternsiz refaktoring qilib, o‘qilishini solishtiring.
5. Tilni hisobga oling: funksiyalar birinchi darajali qiymat bo‘lgan tillarda ko‘p patternlar funksiya uzatishga borib taqaladi.

## FAQ

### GoF ning barcha 23 ta patternini bilish shartmi?

Yo‘q. Amalda ularning kichikroq qismi muntazam ishlatiladi. Har bir pattern qaysi muammoni yechishini tushunish barcha diagrammalarni yodlashdan muhimroq.

### Patternlar faqat OOP uchun dolzarbmi?

Klassik patternlar OOP uchun tasvirlangan, ammo g‘oyalar funksional uslubga ham o‘tadi. U yerda ular ko‘pincha soddaroq ko‘rinadi: Strategy — shunchaki argument sifatida uzatilgan funksiya.

### Pattern bu yerda ortiqcha ekanini qanday bilish mumkin?

Agar u bo‘lmasa kod qisqaroq, tushunarliroq bo‘lsa va uni test qilish hamda o‘zgartirish xuddi shunday oson bo‘lsa, pattern kerak emas. Uni aniq takrorlanuvchi muammoni ko‘rganingizda kiriting.
