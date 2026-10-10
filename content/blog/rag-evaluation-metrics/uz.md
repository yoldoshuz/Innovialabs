---
title: RAG sifat metrikalari: recall, faithfulness va relevantlik
description: RAGni baholash uchun qaysi metrikalar kerak: qidiruv va generatsiya uchun alohida, ularni qanday hisoblash va retrieval yoki LLM buzilayotganini aniqlash.
summary: RAGni ikki qatlamda baholang: qidiruv metrikalari (recall@k, MRR) kerakli kontekst topilganini, generatsiya metrikalari (faithfulness, answer relevance) esa model undan to‘g‘ri foydalanganini ko‘rsatadi. Bunday ajratish muammoni qayerdan izlashni darhol ko‘rsatadi.
---
## Qisqacha: metrikalarni nima uchun ajratish kerak

RAG ikki qismdan iborat: **qidiruv** (retrieval) va **generatsiya** (LLM). Yomon javob ikki xil sababdan paydo bo‘lishi mumkin: kerakli hujjat topilmagan yoki model uni topgan, lekin buzib ko‘rsatgan. «Javob yaxshi/yomon» degan bitta umumiy baho nimani tuzatish kerakligini aytmaydi.

Shuning uchun metrikalar **qatlamlar bo‘yicha** hisoblanadi: avval topilgan kontekst sifati, so‘ng shu kontekstga nisbatan javob sifati.

## Qidiruv metrikalari

Ular uchun test to‘plami kerak: savol va haqiqatan javobni o‘z ichiga olgan hujjatlar (yoki chanklar) ro‘yxati.

| Metrika | Nimani ko‘rsatadi |
|---|---|
| **Recall@k** | Top-k ichida kamida bitta kerakli hujjat bormi |
| **Precision@k** | Top-k ning qancha qismi haqiqatan relevant |
| **MRR** | Birinchi to‘g‘ri hujjat qanchalik yuqorida turibdi |
| **nDCG@k** | Relevantlik darajasini hisobga olgan holda saralash sifati |
| **Context precision** | LLM kontekstiga qancha «shovqin» tushgan |

recall@k va MRR ni hisoblash misoli:

```python
def recall_at_k(retrieved, relevant, k):
    return int(any(doc in relevant for doc in retrieved[:k]))

def reciprocal_rank(retrieved, relevant):
    for i, doc in enumerate(retrieved, start=1):
        if doc in relevant:
            return 1 / i
    return 0.0
```

Butun test to‘plami bo‘yicha o‘rtacha qiymatlar — sizning recall@k va MRR ko‘rsatkichlaringiz.

## Generatsiya metrikalari

Bu yerda model javobi baholanadi:

- **Faithfulness (kontekstga sodiqlik)** — javobdagi barcha da’volar topilgan fragmentlar bilan tasdiqlanadimi. Past qiymat gallyutsinatsiyalarni bildiradi.
- **Answer relevance** — javob qo‘shni savolga emas, aynan berilgan savolga javob beradimi.
- **Correctness** — etalon mavjud bo‘lsa, javob unga mos keladimi.
- **Citation accuracy** — model faktni olgan fragmentlarga havola qiladimi.

## Generatsiya metrikalarini qanday hisoblash kerak

Qo‘lda belgilash ishonchli, lekin qimmat. Amalda **LLM-as-a-judge** ishlatiladi:

1. Javobni alohida da’volarga ajrating.
2. Har biri uchun hakam-modeldan so‘rang: bu kontekst bilan tasdiqlanadimi? Javob — ha yoki yo‘q.
3. Faithfulness = tasdiqlangan da’volar ulushi.

Hakamga ishonish uchun:

- Unga **aniq mezonlar** va 1 dan 10 gacha shkala o‘rniga ikkilik qarorlar bering.
- Uni **odamlar belgilagan kichik tanlanmada** tekshiring va baholar qanchalik mos kelishini ko‘ring.
- **Prompt va modelni o‘zgarmas** saqlang, aks holda turli ishga tushirishlar natijalarini solishtirib bo‘lmaydi.

RAGni baholash uchun tayyor kutubxonalar mavjud, lekin natijalarni to‘g‘ri o‘qish uchun metrikalar mantiqini o‘zingiz tushunishingiz kerak.

## Diagnostika: aynan qayerda nosozlik

| Qidiruv recall | Faithfulness | Ehtimoliy sabab | Nima qilish kerak |
|---|---|---|---|
| Past | Har qanday | Kerakli kontekst topilmayapti | Chanklash, embeddinglar, gibrid qidiruv |
| Yuqori | Past | Model kontekst ustiga o‘ylab topmoqda | Prompt, iqtibos keltirish ko‘rsatmasi, boshqa model |
| Yuqori | Yuqori, lekin javob mavzudan tashqari | Answer relevance past | So‘rovni qayta yozish, prompt |
| Yuqori, lekin context precision past | Tushmoqda | Kontekstda shovqin juda ko‘p | Reranker, kichikroq k |

## Baholash jarayonini qanday qurish kerak

- **Foydalanuvchilarning real savollaridan** test to‘plami yig‘ing, murakkab va javobi yo‘q savollarni ham qo‘shing.
- Tizim halol **«bilmayman»** deyishi kerak bo‘lgan savollarni qo‘shing.
- Baholashni **har bir o‘zgarishda** ishga tushiring: model, prompt, chanklash, qidiruv.
- **Bir vaqtda bitta narsani** o‘zgartiring, aks holda nima ta’sir qilganini tushunmaysiz.
- Yomon misollarni o‘zingiz o‘qing — raqamlar qayerdaligini, misollar esa nima uchunligini ko‘rsatadi.

## FAQ

### Test to‘plamida nechta savol bo‘lishi kerak?

Tez va sifatli belgilay oladigan miqdordan boshlang — kichik to‘plam ham umuman yo‘qligidan yaxshi. Asta-sekin real savollarni, ayniqsa tizim xato qilganlarini qo‘shib boring.

### RAGni etalon javoblarsiz baholash mumkinmi?

Qisman ha. Faithfulness va answer relevance etalonsiz — savol, kontekst va javob bo‘yicha hisoblanadi. Correctness va qidiruv metrikalari esa belgilashni talab qiladi.

### LLM-hakamga qanchalik ishonish mumkin?

U sizning tanlanmangizda odamlar bilan qanchalik mos kelsa, shunchalik. Uning baholarini muntazam ravishda qo‘lda belgilash bilan solishtiring va bir xil modelni tekshiruvsiz ham generator, ham yagona hakam sifatida ishlatmang.
