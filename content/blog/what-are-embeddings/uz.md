---
title: Embedding nima va mashina matn ma’nosini qanday tushunadi
description: Embedding matnni sonlar ro‘yxatiga aylantiradi, ma’nosi yaqin iboralar bir-biriga yaqin joylashadi. Misollar bilan tushuntiramiz va qo‘llanilishini ko‘rsatamiz.
summary: Embedding — matn yoki rasmning sonli ko‘rinishi bo‘lgan vektor, unda ma’nosi o‘xshash obyektlar bir-biriga yaqin joylashadi; aqlli qidiruv, tavsiyalar va klasterlash shunga asoslanadi.
---
## Qisqa javob

**Embedding** — matn, rasm yoki mahsulotni **vektorga** aylantirish usuli: yuzlab yoki minglab sonlardan iborat ro‘yxat. Model bu sonlarni shunday tanlaydiki, **ma’nosi o‘xshash** obyektlar **o‘xshash vektorlar** oladi.

Kompyuter so‘zlarni inson kabi "tushunmaydi". Lekin sonlarni solishtirishni juda yaxshi uddalaydi. Embeddinglar ma’noni solishtirish oddiy matematikaga aylanadigan tilga o‘giradi.

## Intuitsiya: ma’nolar xaritasi

Har bir iboraning koordinatalari bor xaritani tasavvur qiling. Bunday xaritada:

- "Tovarni qanday qaytaraman?" va "Qaytarishni rasmiylashtirmoqchiman" **yonma-yon** turadi, garchi umumiy so‘zlar deyarli yo‘q bo‘lsa ham.
- "Tovarni qanday qaytaraman?" va "Palov retsepti" bir-biridan **uzoqda**.

Oddiy xaritada ikki o‘lcham bor, embeddinglarda — yuzlab. Lekin g‘oya bir xil: **masofa = ma’nodagi farq**.

Kalit so‘zlar bo‘yicha qidiruvdan asosiy ustunlik shu: embeddinglar **sinonimlar, qayta ifodalangan jumlalar va hatto boshqa tildagi matnni** topadi, agar model ko‘p tilli bo‘lsa.

## O‘xshashlik qanday o‘lchanadi

Ko‘pincha **kosinus o‘xshashligi** (cosine similarity) ishlatiladi: vektorlar qanchalik bir yo‘nalishga qaragan. Qiymat 1 ga qancha yaqin bo‘lsa, ma’nolar shuncha yaqin.

```python
import numpy as np

def cosine(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
```

Vektorlarning o‘zi embedding modeli API’si orqali yoki o‘z serveringizda ishlaydigan ochiq model orqali olinadi.

## Amaliyotda qayerda qo‘llaniladi

| Vazifa | Qanday ishlaydi |
|---|---|
| **Semantik qidiruv** | So‘rov va hujjatlar vektorga aylanadi, eng yaqinlari chiqariladi |
| **Chat-botlar uchun RAG** | Bilimlar bazasidan mos qismlar topiladi va javob uchun LLM’ga beriladi |
| **Tavsiyalar** | Vektorlar yaqinligi bo‘yicha "o‘xshash mahsulotlar" va "o‘xshash maqolalar" |
| **Klasterlash** | Sharhlar, murojaatlar yoki arizalar mavzular bo‘yicha avtomatik guruhlanadi |
| **Dublikatlarni topish** | Deyarli bir xil mahsulot kartochkalari yoki takroriy murojaatlar aniqlanadi |
| **Klassifikatsiya** | Matn toifasi namunalarga yaqinligi bo‘yicha aniqlanadi |

## Joriy qilish qadamlari

1. **Embedding modelini tanlang.** U sizning tillaringizni qo‘llab-quvvatlashini tekshiring — o‘zbek va rus tillari uchun bu juda muhim.
2. **Ma’lumotlarni tayyorlang.** Uzun hujjatlar ma’noga ko‘ra bo‘laklarga (chunks) bo‘linadi: xatboshilar, bo‘limlar.
3. **Barcha bo‘laklar uchun vektorlarni hisoblang** va ularni asl matn bilan birga saqlang.
4. **Saqlang va qidiring.** Kichik hajm uchun xotiradagi massiv yetarli, katta hajm uchun — vektor bazasi yoki PostgreSQL kengaytmasi.
5. **Sifatni tekshiring** foydalanuvchilarning real so‘rovlarida.

## Ko‘p uchraydigan xatolar

- **Turli modellar vektorlarini aralashtirish.** Ikki model vektorlari mos kelmaydi: modelni almashtirsangiz, hammasini qayta hisoblang.
- **Juda katta bo‘laklar.** Ma’no "xiralashadi", qidiruv aniq javobni yomonroq topadi.
- **Juda kichik bo‘laklar.** Kontekst yo‘qoladi.
- **Kalit so‘zlardan voz kechish.** Artikullar, kodlar va nomlarni oddiy qidiruv bilan izlash yaxshiroq. Ko‘pincha eng yaxshi natijani **gibrid qidiruv** beradi: embeddinglar va kalit so‘zlar birga.
- **Baholash yo‘q.** Test so‘rovlar to‘plamisiz yaxshilanish bo‘ldimi yoki yo‘qmi, tushunib bo‘lmaydi.

## FAQ

### Embedding va LLM bir narsami?

Yo‘q. LLM matn yaratadi, embedding modeli esa faqat matnni vektorga aylantiradi. Bular alohida modellar, garchi ko‘pincha birga ishlatilsa ham, masalan RAG’da.

### Embeddinglar uchun vektor bazasi kerakmi?

Har doim emas. Bir necha ming hujjat uchun oddiy saqlash va hammasini solishtirib chiqish yetarli. Vektor bazasi ma’lumot ko‘p bo‘lganda va qidiruv tezligi muhim bo‘lganda kerak.

### Embeddinglar o‘zbek tilini tushunadimi?

Modelga bog‘liq. Ko‘p tilli modellar o‘zbek tili bilan ishlaydi, lekin sifatni ishga tushirishdan oldin o‘z ma’lumotlaringizda tekshirib ko‘rgan ma’qul.
