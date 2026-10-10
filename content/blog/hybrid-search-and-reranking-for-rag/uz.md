---
title: Gibrid qidiruv va reranking: RAG sifatini qanday oshirish mumkin
description: BM25 va vektor qidiruvni birlashtirish, reciprocal rank fusion, cross-encoder reranker va so‘rovlarni qayta yozish orqali RAG kerakli kontekstni topishi.
summary: Gibrid qidiruv so‘zlarning aniq mosligini (BM25) va ma’no yaqinligini (vektorlar) birlashtiradi, reranker nomzodlarni aniqroq saralaydi, so‘rovni qayta yozish esa noaniq savollarni qutqaradi. Har bir qadamni faqat o‘z test to‘plamingizda o‘lchagandan keyin yoqing.
---
## Qisqacha: RAGga gibrid qidiruv nima uchun kerak

RAG tizimining javobi topilgan hujjatlardan yaxshiroq bo‘la olmaydi. Sof vektor qidiruv ma’noni yaxshi ushlaydi, lekin **aniq atamalarda** adashadi: artikullar, xato kodlari, familiyalar, kam uchraydigan qisqartmalar. Klassik **BM25** aniq mosliklarni topadi, ammo sinonimlar va qayta ifodalashni tushunmaydi.

Gibrid qidiruv ikkala usulni ishga tushiradi va natijalarni birlashtiradi. So‘ng **reranker** har bir «so‘rov — hujjat» juftligini diqqat bilan baholab, LLMga eng yaxshilarini tanlaydi.

## Konveyer qanday tuzilgan

1. **So‘rovni qayta yozish** (ixtiyoriy) — LLM so‘rovni aniqlashtiradi yoki kengaytiradi.
2. **Ikki qidiruv parallel** — BM25 va vektor qidiruv, har biri top nomzodlarni qaytaradi.
3. **Ro‘yxatlarni birlashtirish** — masalan, reciprocal rank fusion orqali.
4. **Reranking** — cross-encoder birlashgan ro‘yxatni qayta saralaydi.
5. **Kontekstni tanlash** — eng yaxshi bir nechta fragment promptga yuboriladi.

## BM25 va vektor qidiruv

| Mezon | BM25 | Vektor qidiruv |
|---|---|---|
| Aniq atamalar, kodlar, ismlar | Kuchli tomoni | Ko‘pincha adashadi |
| Sinonimlar va qayta ifodalash | Zaif | Kuchli tomoni |
| Qayta o‘qitmasdan yangi so‘zlar | Darhol ishlaydi | Embedding modeliga bog‘liq |
| Tushuntirish mumkinligi | Yuqori | Past |

Ular turli so‘rovlarda xato qiladi, shuning uchun birgalikda nomzodlarning to‘liqroq to‘plamini beradi.

## Reciprocal rank fusion

BM25 baholari va kosinus yaqinligi turli shkalalarda, ularni to‘g‘ridan-to‘g‘ri qo‘shish noto‘g‘ri. **RRF** faqat hujjatlarning ro‘yxatlardagi o‘rnidan foydalanadi:

```python
def rrf(rankings, k=60):
    scores = {}
    for ranking in rankings:
        for rank, doc_id in enumerate(ranking, start=1):
            scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + rank)
    return sorted(scores, key=scores.get, reverse=True)
```

Ikkala ro‘yxatda ham yuqorida turgan hujjat tepaga ko‘tariladi. `k` parametri birinchi o‘rinlar ta’sirini yumshatadi; 60 — keng tarqalgan boshlang‘ich qiymat. Muqobil variant — normallashtirilgan baholarning vaznli yig‘indisi, lekin vaznlarni tanlashga to‘g‘ri keladi.

## Cross-encoder reranker

Bi-encoder (oddiy embeddinglar) so‘rov va hujjatni **alohida** kodlaydi — bu tez, lekin qo‘pol. **Cross-encoder** so‘rov va hujjatni **birga** oladi va ularning mosligini ancha aniqroq, ammo sekinroq baholaydi.

Shuning uchun sxema shunday: arzon qidiruv bir necha o‘nta nomzodni tanlaydi, reranker ulardan eng yaxshilarini oladi. Rerankerga qancha ko‘p nomzod bersangiz, kerakli hujjatni topish ehtimoli shuncha yuqori va kechikish ham shuncha katta — muvozanatni o‘lchovlar bilan toping.

## So‘rovlarni qayta yozish

Foydalanuvchilar qisqa, xatolar bilan va oldingi xabarlarga ishora qilib yozadi. Yordam beradi:

- **Dialog tarixini hisobga olib qayta ifodalash** — «narxi qancha?» to‘liq savolga aylanadi.
- **Multi-query** — LLM so‘rovning bir nechta variantini yaratadi, natijalar RRF orqali birlashtiriladi.
- **HyDE** — LLM faraziy javob yozadi va qidiruv uning embeddingi bo‘yicha olib boriladi.

Har bir usul qo‘shimcha LLM chaqiruvini, ya’ni kechikish va xarajatni qo‘shadi.

## Yutuqni qanday o‘lchash kerak

Boshqalarning raqamlariga ishonmang — o‘z ma’lumotlaringizda tekshiring:

- To‘g‘ri hujjatlar belgilangan real savollardan **test to‘plami** yig‘ing.
- **recall@k** (kerakli hujjat top-k ichida bormi) va **MRR** yoki **nDCG** (qanchalik yuqorida) ni hisoblang.
- Konfiguratsiyalarni birma-bir solishtiring: faqat vektorlar, gibrid, gibrid + reranker.
- Har bir qadamning **kechikishi** va narxini alohida o‘lchang.

## Ko‘p uchraydigan xatolar

- BM25 va kosinus yaqinligining xom baholarini qo‘shish.
- Rerankerga juda kam nomzod berish — unda tanlashga hech narsa qolmaydi.
- Hammasini o‘lchovsiz birdaniga joriy qilish va aynan nima yordam berganini bilmaslik.
- Chanklarga bo‘lish sifatini e’tiborsiz qoldirish — hech bir reranker yomon fragmentlarni qutqarmaydi.

## FAQ

### Gibrid qidiruv bor bo‘lsa, reranker kerakmi?

Har doim emas. Agar recall@k yuqori, lekin to‘g‘ri hujjat ko‘pincha birinchi o‘rinlarda bo‘lmasa, reranker odatda yordam beradi. Agar kerakli hujjat nomzodlar orasida umuman bo‘lmasa, qidiruv va chanklardan boshlang.

### Gibrid qidiruvni bitta bazada qilish mumkinmi?

Ha, ko‘plab vektor bazalar va qidiruv tizimlari to‘liq matnli va vektor qidiruvni bir vaqtda qo‘llab-quvvatlaydi. Bu infratuzilmani soddalashtiradi, lekin birlashtirish mantiqini baribir tekshirib ko‘ring.

### Reranker kechikishni qanchalik oshiradi?

Model, nomzodlar soni va uskunaga bog‘liq. O‘z ma’lumotlaringizda o‘lchang va javob vaqti maqbul chegarada qolishi uchun nomzodlar sonini cheklang.
