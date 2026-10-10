---
title: Vektor ma’lumotlar bazasi nima va u qachon kerak
description: Vektor bazasi embeddinglar orasidan ma’nosi o‘xshash yozuvlarni tez topadi. SQL’dan farqi va qachon pgvector yetarli ekanini tushuntiramiz.
summary: Vektor ma’lumotlar bazasi embeddinglarni saqlaydi va so‘rovga eng yaqin vektorlarni tez topadi; u semantik qidiruv va RAG uchun kerak, lekin boshida ko‘pincha pgvector kengaytmali PostgreSQL yetarli.
---
## Qisqa javob

**Vektor ma’lumotlar bazasi** — bitta asosiy savolga moslashtirilgan ombor: "qaysi yozuvlar bu so‘rovga **ma’no jihatidan eng yaqin**?". U **embeddinglarni** (yuzlab sonlardan iborat vektorlarni) saqlaydi va millionlab vektorlar orasidan eng yaqin qo‘shnilarni tez topa oladi.

Bu semantik qidiruv, tavsiyalar va **RAG** uchun asos — ya’ni chat-bot sizning bilimlar bazangiz bo‘yicha javob berganda.

## Eng yaqin qo‘shnilarni qidirish

Bu vazifa **nearest neighbor search** deb ataladi: so‘rov vektori berilgan, unga eng yaqin **k** ta vektorni topish kerak (kosinus o‘xshashligi yoki masofa bo‘yicha).

Oddiy usul — so‘rovni har bir vektor bilan solishtirish. Minglab yozuvlar uchun bu normal, millionlab yozuvlar uchun esa sekin.

Shu sababli vektor bazalari **taxminiy qidiruv** (ANN, approximate nearest neighbor) va **HNSW** yoki **IVF** kabi maxsus indekslardan foydalanadi. Ular aniqlikning kichik qismini tezlikdagi katta yutuq uchun qurbon qiladi: natija deyarli har doim bir xil, lekin ancha tez topiladi.

## SQL bazasidan farqi

| | Oddiy SQL bazasi | Vektor bazasi |
|---|---|---|
| Asosiy so‘rov | Aniq moslik va filtrlar: `WHERE price < 100` | O‘xshashlik: "ma’nosi eng yaqinini top" |
| Ma’lumotlar | Satrlar, sonlar, sanalar | Vektorlar va metama’lumotlar |
| Indekslar | B-tree, hash | HNSW, IVF va boshqa ANN indekslar |
| Natija | Aniq | Taxminiy, yaqinlik bo‘yicha saralangan |
| Tranzaksiyalar va bog‘lanishlar | Kuchli tomoni | Odatda kuchsizroq yoki yo‘q |

Muhim: bu relyatsion bazaning **o‘rnini bosmaydi**. Buyurtmalar, foydalanuvchilar va to‘lovlar avvalgidek SQL’da qoladi. Vektor bazasi ma’no bo‘yicha qidiruvni qo‘shadi.

## Qachon pgvector yetarli

**pgvector** — PostgreSQL uchun kengaytma, u `vector` turini va eng yaqin qo‘shnilarni qidirish indekslarini qo‘shadi.

```sql
CREATE EXTENSION vector;

CREATE TABLE docs (
  id bigserial PRIMARY KEY,
  content text,
  embedding vector(1536)
);

SELECT id, content
FROM docs
ORDER BY embedding <=> '[...]'
LIMIT 5;
```

`<=>` operatori kosinus masofasini hisoblaydi. Vektor o‘lchami embedding modelingizga mos kelishi kerak.

**pgvector odatda yetarli, agar:**

- sizda allaqachon PostgreSQL bor va yana bitta servisni qo‘llab-quvvatlashni istamasangiz;
- ma’lumotlar hajmi o‘rtacha, qidiruvga yuklama esa haddan tashqari emas;
- ma’no bo‘yicha qidiruvni oddiy filtrlar va `JOIN` bilan bitta so‘rovda birlashtirish kerak bo‘lsa;
- tranzaksiyalar va yagona zaxira nusxa muhim bo‘lsa.

## Qachon alohida vektor bazasi kerak

- Vektorlar **juda ko‘p** va yuklama yuqori, gorizontal masshtablash muhim.
- Tayyor imkoniyatlar kerak: **gibrid qidiruv**, multitenantlik, boshqariladigan bulut xizmati.
- Jamoa infratuzilmaning yana bitta komponentini qo‘llab-quvvatlashga tayyor.

Mashhur variantlar: Qdrant, Weaviate, Milvus, Pinecone. Tanlovni sharhlar bo‘yicha emas, o‘z ma’lumotlaringizdagi test natijalari bo‘yicha qilgan ma’qul.

## Ko‘p uchraydigan xatolar

- Bir-ikki ming hujjatli prototip uchun **alohida vektor bazasidan boshlash**. Ortiqcha murakkablik.
- **Metama’lumotlarni unutish.** Til, sana yoki kirish huquqlari bo‘yicha filtrlarsiz qidiruv keraksiz natijalarni qaytaradi.
- **Modelni kuzatmaslik.** Embedding modeli almashtirilsa, barcha vektorlarni qayta hisoblash kerak.
- **Sifatni tekshirmaslik.** Agar noto‘g‘ri natija topilsa, indeks tezligi hech narsani anglatmaydi.

## FAQ

### Vektorlarni MySQL yoki MongoDB’da saqlash mumkinmi?

Ko‘plab mashhur bazalar vektor qidiruvini qo‘llab-quvvatlashni qo‘shmoqda. Agar asosiy bazangiz buni uddalasa, undan boshlang va cheklovlarga duch kelgandagina maxsus yechimga o‘ting.

### Vektor bazasi embeddinglarni o‘zi yaratadimi?

Odatda yo‘q: vektorlarni embedding modelidan olasiz va bazaga yozasiz. Ba’zi yechimlar modelni avtomatik chaqira oladi, lekin bu majburiy qism emas, qulaylik.

### AI chat-bot uchun vektor bazasi kerakmi?

Faqat bot sizning hujjatlaringiz bo‘yicha javob bersa (RAG) va ular yetarlicha ko‘p bo‘lsa. Bilimlar bazasisiz bot uchun vektor qidiruvi kerak emas.
