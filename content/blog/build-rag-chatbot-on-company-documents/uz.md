---
title: Kompaniya hujjatlari bo‘yicha RAG chat-botini qanday yaratish mumkin
description: Ichki hujjatlar bo‘yicha RAG-bot bosqichma-bosqich: yuklash, chunklarga bo‘lish, embeddinglar, qidiruv, manbali javoblar va kirish huquqlari.
summary: RAG-bot hujjatlaringizdan savolga mos parchalarni topib, LLMga beradi, model esa faqat shular asosida javob berib, manbani ko‘rsatadi. Sifat toza ma’lumotlar, to‘g‘ri bo‘lish va qidiruv bosqichidagi kirish nazoratiga bog‘liq.
---

## Qisqacha qanday ishlaydi

**RAG (Retrieval-Augmented Generation)** — til modeli "xotiradan" emas, balki hujjatlaringizdan topilgan parchalar asosida javob beradigan yondashuv. Bot sizning ma’lumotlaringizda o‘qitilmaydi: hujjatlar alohida indeksda saqlanadi va har bir savolda tizim undan eng mos bir nechta bo‘lakni oladi.

Jarayon ikki qismdan iborat:

- **Indekslash** (bir marta va yangilanishlarda): hujjatlarni yuklash → matnni ajratish → chunklarga bo‘lish → embeddinglar → vektor omboriga yozish.
- **Javob** (har bir savolga): savol embeddingi → o‘xshash chunklarni qidirish → topilgan kontekst bilan prompt → manbali LLM javobi.

## Minimal stek

Birinchi ishchi versiya uchun murakkab framework shart emas:

| Qatlam | Variant |
|---|---|
| Matnni ajratish | PDF/DOCX parser, skanlar uchun OCR |
| Embeddinglar | API-model yoki ochiq ko‘p tilli model |
| Ombor | PostgreSQL + pgvector yoki Qdrant |
| LLM | ko‘rsatmalarga yaxshi amal qiladigan istalgan model |
| Interfeys | veb-vidjet yoki Telegram-bot |

## 1-qadam. Hujjatlarni yuklash va tozalash

Javoblar sifati manbalar sifatidan yuqori bo‘lmaydi. Indekslashdan oldin:

- dublikatlar va reglamentlarning eskirgan versiyalarini olib tashlang;
- matnni sarlavhalar va jadvallarni saqlagan holda ajrating;
- har bir hujjat uchun **metama’lumotlarni** saqlang: nomi, bo‘limi, sanasi, havolasi, bo‘lim yoki kirish guruhi.

Metama’lumotlar javobdagi havolalar va filtrlash uchun kerak bo‘ladi.

## 2-qadam. Chunklarga bo‘lish

Hujjat alohida o‘qilganda tushunarli bo‘ladigan bo‘laklarga kesiladi. Yaxshi boshlang‘ich nuqta — tuzilma bo‘yicha (sarlavhalar, bandlar) bo‘lish, uzun bo‘limlarni esa kichik ustma-ustlik bilan rekursiv bo‘lish. Har bir chunkka bo‘lim sarlavhasini qo‘shish foydali: "Ta’til → Rasmiylashtirish tartibi" oddiy abzasdan yaxshiroq topiladi.

## 3-qadam. Embeddinglar va indeks

Embedding modeli har bir chunkni vektorga aylantiradi. Muhim jihatlar:

- savollar va hujjatlar **bitta model** bilan kodlanadi;
- xodimlar rus va o‘zbek tillarida yozsa, modelni ikkala tilda tekshiring;
- modelni almashtirsangiz, indeksni qayta hisoblashga to‘g‘ri keladi.

## 4-qadam. Qidiruv

Asosiy variant — eng yaqin top-k chunkni topish. Natijani sezilarli yaxshilaydigan narsalar:

- **gibrid qidiruv**: vektorli + to‘liq matnli, shunda artikullar, buyruq raqamlari va aniq atamalar ham topiladi;
- **reranker**: alohida model nomzodlarni dolzarblik bo‘yicha qayta saralaydi;
- **metama’lumotlar bo‘yicha filtr**: bo‘lim, hujjat turi, amal qilish muddati.

## 5-qadam. Manba ko‘rsatiladigan prompt

Modelga o‘ylab topishni aniq taqiqlash kerak. Tuzilma namunasi:

```text
Faqat quyidagi parchalar asosida javob ber.
Agar parchalarda javob bo‘lmasa, ma’lumot topilmaganini ayt.
Har bir fikrdan keyin kvadrat qavsda manba raqamini ko‘rsat.

[1] Ta’tillar to‘g‘risidagi nizom, 3.2-band: ...
[2] Ish tartibi haqidagi buyruq: ...

Savol: ...
```

Interfeysda raqamlar hujjatlarga havolaga aylanadi — foydalanuvchi javobni tekshira oladi.

## 6-qadam. Kirish nazorati

Eng ko‘p uchraydigan xato — bot hammaga hamma narsa haqida javob beradigan umumiy indeks. Huquqlar promptda emas, **qidiruv bosqichida** tekshirilishi kerak:

- har bir chunkda kirish guruhlari maydoni bor;
- so‘rovda filtrga joriy foydalanuvchining guruhlari qo‘yiladi;
- foydalanuvchiga ruxsat berilmagan chunklar model kontekstiga umuman tushmaydi.

Promptdagi "maxfiy narsani oshkor qilma" degan iltimos himoya emas.

## Ko‘p uchraydigan xatolar

- Qoralamalar va eskirgan versiyalar bilan birga hamma narsani indekslash.
- Juda katta chunklar: kontekstga ortiqcha narsa tushadi.
- Test savollari to‘plami yo‘q, shuning uchun yaxshilanishlar "ko‘z bilan" baholanadi.
- Hujjatlar o‘zgarganda indeksni yangilash jarayoni yo‘q.

## Sifatni qanday tekshirish kerak

Xodimlarning 30–50 ta haqiqiy savolini to‘g‘ri javoblar va manbalar bilan yig‘ing. Ikki narsani alohida tekshiring: **qidiruv kerakli parchani topdimi** va **model u asosida to‘g‘ri javob berdimi**. Shunda nimani tuzatish kerakligini — qidiruvnimi yoki promptnimi — bilasiz.

## FAQ

### Modelni hujjatlarimizda qo‘shimcha o‘qitish kerakmi?
Hujjatlar bo‘yicha javoblar uchun odatda yo‘q. RAGni yangilash osonroq: hujjat o‘zgardi — uni qayta indeksladingiz, qayta o‘qitish shart emas.

### Hammasini kompaniya ichida joylashtirish mumkinmi?
Ha. Ochiq embedding modellari va LLMlarni o‘z serverlaringizda, vektor omborini esa o‘z infratuzilmangizda ishga tushirish mumkin. Uskunaga talablarni hisobga oling.

### Bot noaniq javob bersa nima qilish kerak?
Avval kerakli parcha kontekstga tushganini tekshiring. Tushmagan bo‘lsa — bo‘lish va qidiruvni yaxshilang; tushgan bo‘lsa — promptni aniqlashtiring.
