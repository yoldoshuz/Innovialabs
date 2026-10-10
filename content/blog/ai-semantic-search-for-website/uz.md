---
title: Sayt yoki ilovaga aqlli semantik qidiruvni qanday qo‘shish mumkin
description: Embeddinglarga asoslangan qidiruv natijalarni ma’no bo‘yicha qanday topadi, xatolar va turli tillar bilan qanday ishlaydi va uni filtrlar bilan qanday birlashtirish.
summary: Semantik qidiruv matnlar va so‘rovlarni embedding vektorlarga aylantirib, ma’no jihatidan eng yaqinlarini topadi; u oddiy so‘z bo‘yicha qidiruv hamda narx, toifa va mavjudlik filtrlari bilan birga eng yaxshi ishlaydi.
---
## Qisqa javob

Oddiy qidiruv **so‘zlar mosligini** qidiradi: «yugurish uchun oyoq kiyim» so‘roviga u «marafon krossovkalari»ni topmasligi mumkin. Semantik qidiruv **ma’no mosligini** qidiradi. Har bir hujjat va har bir so‘rov **embedding**ga aylanadi — ma’nosi yaqin matnlar yonma-yon joylashadigan sonlar vektori. Qidiruv «qaysi vektorlar so‘rov vektoriga eng yaqin» degan savolga aylanadi.

## Bu qanday ishlaydi

1. **Ma’lumotlarni tayyorlash.** Tovarlar, maqolalar yoki qo‘llab-quvvatlash javoblarini oling. Uzun matnlarni ma’noli bloklar bo‘yicha bo‘laklarga (chunks) bo‘ling.
2. **Embeddinglar.** Har bir bo‘lakni embedding modelidan o‘tkazing — API orqali bulutli yoki o‘z serveringizdagi ochiq model.
3. **Saqlash.** Vektorlarni vektor qidiruvini qo‘llab-quvvatlaydigan omborga joylang: PostgreSQL uchun pgvector kengaytmasi, Qdrant, Elasticsearch/OpenSearch va o‘xshashlar.
4. **So‘rov.** Foydalanuvchi so‘rovi o‘sha model bilan vektorga aylanadi, ombor eng yaqin bo‘laklarni qaytaradi.
5. **Natija.** Natijalar ro‘yxat ko‘rinishida ko‘rsatiladi yoki o‘z so‘zlari bilan javob kerak bo‘lsa, LLM’ga uzatiladi (bu allaqachon RAG).

## Semantika nima beradi

- **Sinonimlar va qayta ifodalash.** «Noutbuk yoqilmayapti» so‘rovi «Kompyuter ishga tushmaydi» maqolasini topadi.
- **Imlo xatolari.** Embedding modellari so‘z bo‘laklari bilan ishlaydi, shuning uchun kichik xatolar ko‘pincha qidiruvni buzmaydi.
- **Turli tillar.** Ko‘p tilli modellar «телефон», «phone» va «telefon»ni yonma-yon joylashtiradi. O‘zbekiston uchun bu muhim: foydalanuvchilar rus, lotin va kirill yozuvidagi o‘zbek tilini aralash yozadi.
- **Tavsif-so‘rovlar.** «Qizga belgilangan byudjetdagi sovg‘a» — so‘z bo‘yicha qidiruv deyarli uddalay olmaydigan narsa.

## Semantika qayerda adashadi

- **Aniq kodlar va artikullar.** «iPhone 15 Pro 256» so‘rovi «o‘xshash telefonlar»ni emas, aynan shu modelni topishi kerak.
- Model ko‘rmagan **noyob nomlar va brendlar**.
- **Inkorlar.** «Shakarsiz» va «shakarli» yaqin joylashib qolishi mumkin.

Shuning uchun amalda **gibrid qidiruv** ishlatiladi: oddiy to‘liq matnli qidiruv (BM25) va vektor qidiruv parallel ishlaydi, natijalar esa, masalan, Reciprocal Rank Fusion usuli bilan birlashtiriladi.

## Filtrlar bilan qanday birlashtirish

Foydalanuvchi «qulay krossovka» istaydi, lekin faqat **mavjud, 42-o‘lcham va ma’lum narxgacha**. Filtrlar vektor qidiruv bilan birga ishlashi kerak:

- **Oldindan filtrlash** — avval filtrlarga mos yozuvlarni tanlaysiz, keyin ular orasidan eng yaqinlarini qidirasiz. Aniqroq, ko‘pchilik vektor omborlari buni qo‘llab-quvvatlaydi.
- **Keyin filtrlash** — avval N ta eng yaqinni topasiz, keyin ortiqchasini olib tashlaysiz. Soddaroq, lekin qattiq filtrlarda ro‘yxat bo‘sh qolishi mumkin.

Filtr va vektor yaqinligi bitta so‘rovdagi pgvector misoli:

```sql
SELECT id, title, price
FROM products
WHERE category = 'shoes'
  AND in_stock = true
  AND price <= 500000
ORDER BY embedding <=> $1   -- $1: so‘rov vektori, <=> — kosinus masofa
LIMIT 20;
```

## Joriy etishning bosqichma-bosqich rejasi

1. Qidiruv loglaridan **real so‘rovlarni** yig‘ing, ayniqsa natijasi bo‘sh bo‘lganlarini.
2. Tillaringizni qo‘llab-quvvatlaydigan embedding modelini tanlang va uni shu so‘rovlarda sinang.
3. Gibrid qidiruvni eskisi yonida ishga tushiring va natijalarni solishtiring.
4. Filtrlarni va kerak bo‘lsa **reranker**ni qo‘shing — top natijalarni aniqroq qayta saralaydigan model.
5. **Qayta indekslashni** sozlang: yangi va o‘zgargan tovarlar embeddinglarni avtomatik olishi kerak.
6. Metrikalarni kuzating: bo‘sh natijalar ulushi, natijalarga bosishlar, savatga o‘tishlar.

## Ko‘p uchraydigan xatolar

- To‘liq matnli qidiruvni olib tashlab, faqat vektorlarni qoldirish.
- Hujjatlarni juda katta yoki juda kichik bo‘laklarga bo‘lish — aniqlik yo‘qoladi.
- Embedding modelini almashtirib, eski vektorlarni qayta hisoblamaslik: turli modellar vektorlari mos kelmaydi.
- Sifatni o‘z ma’lumotlaringiz va tillaringizda tekshirmaslik.

## FAQ

### Semantik qidiruv uchun alohida vektor bazasi kerakmi?

Shart emas. Agar sizda allaqachon PostgreSQL bo‘lsa va ma’lumotlar unchalik ko‘p bo‘lmasa, ko‘pincha pgvector kengaytmasi yetarli. Alohida vektor ombori katta hajm va yuqori yuklamada o‘rinli.

### Semantik qidiruv RAG’li chat-botdan nimasi bilan farq qiladi?

Semantik qidiruv topilgan hujjatlar ro‘yxatini qaytaradi. RAG esa shu hujjatlarni olib, javob tuzishi uchun til modeliga uzatadi. Qidiruv — asos, RAG — uning ustidagi qatlam.

### Bu o‘zbek tilida ishlaydimi?

Bu embedding modeliga bog‘liq. Ko‘p tilli modellar o‘zbek tilini turli darajada qo‘llab-quvvatlaydi, shuning uchun tanlangan modelni foydalanuvchilaringizning real so‘rovlarida albatta sinab ko‘ring.
