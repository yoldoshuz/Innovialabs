---
title: LLM kontekst oynasi: limitlar, uzun hujjatlar va yechimlar
description: Til modelining kontekst oynasi nima, u to‘lib ketganda nima bo‘ladi, lost in the middle effekti va uzun hujjatlar bilan qanday ishlash kerak.
summary: Kontekst oynasi — model bitta so‘rovda ko‘radigan tokenlardagi matn hajmi; sig‘magan narsa model uchun mavjud emas, shuning uchun uzun hujjatlar qisqartirish, bo‘laklash yoki RAG orqali qayta ishlanadi.
---
## Kontekst oynasi nima

**Kontekst oynasi** — model bitta so‘rovda qayta ishlaydigan, tokenlarda o‘lchanadigan maksimal matn hajmi. Unga hammasi birga kiradi:

- tizim ko‘rsatmasi;
- suhbat tarixi;
- biriktirilgan hujjatlar va vositalar natijalari;
- model yaratadigan javob.

Model o‘tgan suhbatlarni o‘zi eslab qolmaydi. Har bir so‘rov — toza varaq, chatning «xotirasi» esa faqat ilova tarixni oyna ichida qayta yuborgani uchun mavjud.

## To‘lib ketganda nima bo‘ladi

Bu ilova qanday qurilganiga bog‘liq:

- so‘rov oynadan uzun bo‘lsa, **API xato qaytaradi**;
- **ilova eski xabarlarni kesib tashlaydi** va model suhbat boshini «unutadi»;
- generatsiya uchun joy qolmasa, **javob uzilib qoladi**.

Ikkinchi holat xavfli: xato yo‘q, lekin model suhbat boshidagi muhim shartlarni ko‘rmasdan ishonch bilan javob beradi.

## Lost in the middle effekti

Hujjat sig‘gan bo‘lsa ham, model uning barcha qismlariga bir xil e’tibor beradi degani emas. Tadqiqotlar **lost in the middle** effektini tasvirlaydi: modellar uzun kontekstning boshi va oxiridagi ma’lumotdan o‘rtasidagiga qaraganda ishonchliroq foydalanadi.

Bundan kelib chiqadiki:

- **asosiy ko‘rsatmani boshiga** qo‘ying yoki oxirida takrorlang;
- foydalanuvchi savolini hujjatdan oldin emas, **undan keyin** joylashtiring;
- kontekstga «har ehtimolga qarshi» ortiqcha narsa qo‘shmang — shovqin keraklisini topishga xalaqit beradi.

Zamonaviy modellar uzun kontekst bilan avvalgilardan yaxshiroq ishlaydi, ammo sifatni baribir o‘z ma’lumotlaringizda tekshirish kerak.

## Uzun hujjatlar bilan qanday ishlash kerak

| Yondashuv | Qanday ishlaydi | Qachon mos keladi |
|---|---|---|
| Shunchaki katta oyna | Butun hujjat bitta so‘rovda | Bitta hujjatni bir martalik tahlil qilish |
| Bo‘laklash (chunking) | Hujjat qismlarga bo‘linadi, har biri alohida ishlanadi | Tarjima, ma’lumot ajratish, qismma-qism tekshirish |
| Map-reduce xulosa | Avval qismlar xulosasi, keyin xulosalar xulosasi | Juda uzun matnlarni qisqartirish |
| Siljuvchi xulosa | Suhbatning eski qismi qisqa bayon bilan almashtiriladi | Uzun chatlar, qo‘llab-quvvatlash assistentlari |
| RAG | Bazadan faqat tegishli bo‘laklar olinadi | Katta bilimlar bazasi bo‘yicha savollar |

## Yondashuvni qanday tanlash kerak

1. **Bitta hujjat, bir martalik vazifa** — oynaga sig‘sa, butunligicha yuboring.
2. **Ko‘p hujjat yoki bilimlar bazasi** — **RAG** kerak: qidiruv bir nechta mos bo‘lakni tanlaydi va model ular asosida javob beradi.
3. **Uzun suhbat** — oxirgi xabarlarni so‘zma-so‘z saqlang, eskilarini xulosaga siqing.
4. **Qismma-qism vazifa** (tarjima, belgilash) — chegaralarda ma’no yo‘qolmasligi uchun kichik ustma-ust tushish bilan bo‘laklarga ajrating.

## Ko‘p uchraydigan xatolar

- **Katta oyna hamma narsani hal qiladi deb o‘ylash.** Uzun kontekst qimmatroq, sekinroq va tafsilotlarga e’tiborni kafolatlamaydi.
- **Hujjatni gap yoki jadval o‘rtasida kesish.** Bo‘lim va xatboshilar bo‘yicha bo‘ling.
- **Tilni hisobga olmaslik.** Rus va o‘zbek matni ingliz tilidagidan ko‘proq token oladi va oyna tezroq to‘ladi.
- **Javob uchun joy qoldirmaslik.** Generatsiya uchun tokenlarni oldindan ajrating.

## FAQ

### Model o‘tgan chatda yozganlarimni eslaydimi?

Yo‘q, agar ilova bu ma’lumotni maxsus uzatmasa. Chat xizmatlaridagi «xotira» funksiyalari ham shu tarzda ishlaydi: saqlangan faktlar yangi so‘rov kontekstiga qo‘shiladi.

### Oyna juda katta bo‘lsa, RAG endi kerak emasmi?

Ko‘p hollarda kerak. RAG arzonroq va tezroq, hech qaysi oynaga sig‘maydigan bazalar bilan ishlash imkonini beradi va javob manbalariga havola ko‘rsatadi.

### Kontekst to‘lib ketganini qanday bilish mumkin?

Belgilari: model suhbat boshidagi shartlarni unutadi, o‘ziga zid gapiradi yoki javob uziladi. So‘rovlardagi tokenlar sonini loglang — shunda muammoni foydalanuvchilardan oldin ko‘rasiz.
