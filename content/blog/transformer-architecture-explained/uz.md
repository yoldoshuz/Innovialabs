---
title: Transformer arxitekturasi: diqqat mexanizmi oddiy so‘zlar bilan
description: Self-attention nima, enkoder dekoderdan nimasi bilan farq qiladi va nega transformerlar RNN o‘rnini egalladi — sxemalar bilan formulasiz tushuntirish.
summary: Transformer butun matnni birdaniga qayta ishlaydi va har bir so‘z uchun diqqat orqali qaysi so‘zlarga tayanishni hal qiladi; u RNN’dan tezroq o‘qitiladi va kontekstni yaxshiroq ushlaydi.
---
## Qisqacha asosiy narsa

**Transformer** — zamonaviy til modellari qurilgan neyron tarmoq arxitekturasi. Uning asosiy g‘oyasi — **diqqat mexanizmi** (attention): har bir so‘zni qayta ishlashda model matndagi boshqa barcha so‘zlarga qaraydi va hozir qaysilari muhimligini hal qiladi.

Misol: «Mushuk stolga sakramadi, chunki **u** charchagan edi». «U» stol emas, mushuk ekanini tushunish uchun model bu so‘zlarni bog‘lashi kerak. Diqqat bu bog‘liqlikni oradagi so‘zlar sonidan qat’i nazar to‘g‘ridan-to‘g‘ri o‘rnatadi.

## Self-attention qanday ishlaydi

Matn avval **tokenlarga** (so‘zlar yoki ularning qismlari) bo‘linadi, har biri vektorga — ma’noni tasvirlovchi sonlar to‘plamiga aylanadi. Keyin har bir token uchun uchta vektor hisoblanadi:

- **Query (so‘rov)** — «men nimani qidiryapman?»
- **Key (kalit)** — «men nimani taklif qila olaman?»
- **Value (qiymat)** — «qanday ma’lumot uzataman».

Kutubxona o‘xshatishi: siz so‘rov bilan kelasiz, uni javonlardagi yorliqlar (kalitlar) bilan solishtirasiz va eng mos kelgan javonlarning mazmunini (qiymatlarni) moslik darajasiga qarab aralashtirib olasiz.

```text
"u" --query--> har bir so‘zning key’i bilan solishtirish
               Mushuk  stolga  sakramadi  chunki  ...  charchagan
diqqat vazni:  yuqori  o‘rta   past       past         o‘rta
natija: "u"ning yangi ko‘rinishi = shu vaznlar bilan value’lar aralashmasi
```

Bunday «diqqat boshlari» bir nechta va har biri o‘z narsasini sezishni o‘rganadi: biri grammatik bog‘lanishlarni, boshqasi ma’no bog‘lanishlarini va hokazo. Bu **multi-head attention** deb ataladi. Diqqat qatlamlari ko‘p, ular ketma-ket joylashgan va matnni tushunish qatlamdan qatlamga chuqurlashadi.

Diqqatning o‘zi so‘zlar tartibini bilmagani uchun vektorlarga **pozitsion ma’lumot** — token qayerda turgani haqidagi ma’lumot qo‘shiladi.

## Enkoder va dekoder

Dastlabki transformer ikki qismdan iborat edi:

| Qism | Nima qiladi | Qo‘llanish misollari |
|---|---|---|
| **Enkoder** | Butun matnni o‘qiydi va uni tushunadi; har bir so‘z qolganlarini ko‘radi | Tasniflash, qidiruv, embedding’lar |
| **Dekoder** | Matnni bittadan token qilib yaratadi; faqat oldingi tokenlarni ko‘radi | Chat-botlar, matn va kod generatsiyasi |
| **Enkoder + dekoder** | Kirishni tushunadi va chiqishni yaratadi | Mashina tarjimasi, qisqacha mazmun |

Ommabop chat-modellarning aksariyati — **faqat dekoder**: ular yozilgan hamma narsaga tayanib, keyingi tokenni qayta-qayta bashorat qiladi.

## Nega transformerlar RNN o‘rnini egalladi

**RNN** (rekurrent tarmoqlar) matnni bittadan so‘z o‘qib, «xotirani» qadamdan qadamga uzatardi. Bunda muammolar bor edi:

- **Sekin o‘qitish.** Qadamlar qat’iy ketma-ket bajarilardi va GPU’da samarali parallellashtirib bo‘lmasdi.
- **Qisqa xotira.** Uzun matn boshidagi ma’lumot asta-sekin yo‘qolardi.

Transformer barcha tokenlarni **parallel** qayta ishlaydi va istalgan ikki so‘zni diqqat orqali **to‘g‘ridan-to‘g‘ri** bog‘laydi. Bu modellarni ulkan hajmdagi ma’lumotlarda o‘qitish va uzoq kontekstni yaxshiroq ushlash imkonini berdi.

Narxi — diqqat har bir tokenni har biri bilan solishtiradi, shuning uchun xarajatlar matn uzunligi bilan tez o‘sadi. Shu sababli modellarda **kontekst oynasi** cheklovi bor, tadqiqotchilar esa tejamkorroq diqqat variantlarini izlamoqda.

## Amalda bu nima beradi

- Modelda nega **kontekst limiti** borligi va uzun so‘rovlar nega qimmatroq ekani tushunarli bo‘ladi.
- Model nega faqat joriy kontekstdagi narsani «eslashi» tushunarli: so‘rovlar orasida uning o‘z xotirasi yo‘q.
- Hujjatlar bo‘yicha qidiruvda ko‘pincha enkoder-modellar (embedding’lar), javoblar uchun esa dekoderlar ishlatiladi. RAG shunday tuzilgan.

## FAQ

### LLM’dan foydalanish uchun transformer matematikasini tushunish kerakmi?

Yo‘q. API orqali modellar bilan ishlash uchun tokenlar, kontekst oynasi va model keyingi tokenni bashorat qilishini tushunish yetarli. Matematika modellarning o‘zini ishlab chiqishda kerak.

### Transformerlar faqat matn uchun ishlatiladimi?

Yo‘q. Xuddi shu diqqat g‘oyasi tasvirlar, ovoz va kodga qo‘llanadi: ma’lumot token-bo‘laklarga bo‘linadi va shunga o‘xshash tarzda qayta ishlanadi.

### Nega model ba’zan uzun suhbat boshini «unutadi»?

Suhbat kontekst oynasidan uzun bo‘lsa, eski xabarlar kesiladi yoki siqiladi. Oyna ichida ham model ayrim detallarga kamroq diqqat qaratishi mumkin, shuning uchun muhim narsani takrorlagan ma’qul.
