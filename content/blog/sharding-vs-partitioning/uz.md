---
title: Sharding va partitioning: katta jadvallarni qanday masshtablash
description: Partitioning jadvalni bitta baza ichida bo‘ladi, sharding esa ma’lumotlarni serverlarga taqsimlaydi. Range, list, hash va sharding qachon kerakligini ko‘ramiz.
summary: Partitioning katta jadvalni bitta server ichida qismlarga bo‘ladi, sharding esa ma’lumotlarni shard kaliti bo‘yicha bir nechta serverga tarqatadi; partitioningdan boshlang va faqat bitta server haqiqatan yetmay qolganda sharding qiling.
---

## Qisqa javob

**Partitioning** bitta mantiqiy jadvalni **o‘sha serverning o‘zida** bir nechta jismoniy jadvalga bo‘ladi. Ilova bitta baza bilan ishlaydi, PostgreSQL esa qatorlarni kerakli bo‘limga o‘zi joylaydi.

**Sharding** ma’lumotlarni **bir nechta mustaqil serverga** taqsimlaydi. Har bir shard qatorlarning bir qismini saqlaydi, u **shard kaliti** bo‘yicha tanlanadi. Ilova yoki proksi qatlam har bir qator qayerda ekanini bilishi kerak.

Partitioning «jadval juda katta, unga xizmat ko‘rsatish qiyin» muammosini hal qiladi. Sharding esa «bitta mashina yozish hajmi yoki ma’lumot hajmiga bardosh bermayapti» muammosini hal qiladi. Ikkinchisi ancha kam uchraydi va ancha qimmatga tushadi.

## PostgreSQL’da partitioning

PostgreSQL’da uchta strategiyali deklarativ partitioning bor.

| Strategiya | Qatorlar qanday bo‘linadi | Odatiy qo‘llanish |
|---|---|---|
| **Range** | Qiymat oraliqlari bo‘yicha, masalan sanalar | Loglar, hodisalar, oylar bo‘yicha buyurtmalar |
| **List** | Aniq qiymatlar ro‘yxati bo‘yicha | Hudud, mamlakat, mijoz turi |
| **Hash** | Ustun hashi N ga bo‘lingandagi qoldiq bo‘yicha | Tabiiy oraliq yo‘q bo‘lganda teng taqsimlash |

Eng ko‘p uchraydigan holat — vaqt bo‘yicha range:

```sql
CREATE TABLE events (
  id         bigint GENERATED ALWAYS AS IDENTITY,
  created_at timestamptz NOT NULL,
  payload    jsonb,
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

CREATE TABLE events_2026_10 PARTITION OF events
  FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');
```

List va hash shunga o‘xshaydi:

```sql
CREATE TABLE customers (...) PARTITION BY LIST (region);
CREATE TABLE customers_uz PARTITION OF customers FOR VALUES IN ('uz');

CREATE TABLE sessions (...) PARTITION BY HASH (user_id);
CREATE TABLE sessions_p0 PARTITION OF sessions
  FOR VALUES WITH (MODULUS 4, REMAINDER 0);
```

Amalda nima beradi:

- **Partition pruning**: partition kaliti bo‘yicha filtrli so‘rov faqat kerakli bo‘limlarni o‘qiydi.
- **Arzon o‘chirish**: jadvalni shishiradigan ulkan `DELETE` o‘rniga `DETACH PARTITION` va `DROP TABLE`.
- **Indekslar kichikroq**, VACUUM va qayta indekslash tezroq.

Muhim cheklovlar: primary key va unique cheklovlar partition kalitini o‘z ichiga olishi kerak, bu kalit bo‘yicha filtrsiz so‘rovlar esa baribir barcha bo‘limlarga tegadi.

## Gorizontal sharding

Shardingda har bir server ma’lumotlarning bir qismini saqlaydi. Asosiy qaror — **shard kaliti**:

- **Yaxshi kalit**: deyarli har bir so‘rovda bor, yuklamani teng taqsimlaydi, kam o‘zgaradi. Masalan, B2B SaaS’da `tenant_id`, oddiy ilovada `user_id`.
- **Yomon kalit**: noyob qiymatlari kam (mamlakat), notekis (bitta juda katta mijoz) yoki yozish uchun vaqt (barcha yangi qatorlar oxirgi shardga tushadi).

Kalitni shardga moslash usullari:

- **Hash bo‘yicha**: teng taqsimot, lekin ko‘p virtual bucket ishlatilmasa, shard qo‘shganda ma’lumotlarni ko‘chirish kerak bo‘ladi.
- **Oraliq bo‘yicha**: oddiy, lekin «issiq nuqtalar» paydo bo‘lishi oson.
- **Ma’lumotnoma (lookup jadval)**: moslashuvchan, lekin qo‘shimcha qidiruv xizmati kerak.

PostgreSQL uchun Citus yoki MySQL uchun Vitess kabi vositalar marshrutlashni o‘z zimmasiga oladi, ammo dizayn cheklovlari yo‘qolmaydi.

## Shardlararo so‘rovlar: haqiqiy narx

Ma’lumotlar tarqatilgach, bir nechta shardga tegadigan hamma narsa murakkablashadi:

- **JOIN** uchun bog‘liq jadvallar bir xil kalit bo‘yicha joylashtirilishi yoki natijalar ilovada birlashtirilishi kerak.
- **Agregatsiyalar** (`COUNT`, `SUM`, hisobotlar) barcha shardlarga yuboriladi va natijalar jamlanadi.
- **Tranzaksiyalar** shardlar orasida ikki bosqichli commit yoki saga patternini talab qiladi, nosozlik ssenariylari ko‘payadi.
- **Unikallik va ketma-ketliklar** sukut bo‘yicha global bo‘lmay qoladi.

Shuning uchun sharding’dan keyin analitika odatda alohida ma’lumotlar omboriga chiqariladi.

## Qachon bu erta

Partitioning erta, agar:

- Jadval xotiraga bemalol sig‘sa va to‘g‘ri indekslar bilan so‘rovlar tez bo‘lsa.
- Ko‘pchilik so‘rovlar tabiiy partition kaliti bo‘yicha filtrlanmasa.

Sharding erta, agar siz hali sinab ko‘rmagan bo‘lsangiz:

- So‘rov va indekslarni optimallashtirish, ulanishlar puli.
- Vertikal masshtablash va o‘qish uchun replikalar.
- Partitioning va eski ma’lumotlarni arxivlash.
- Analitikani asosiy bazadan chiqarish.

Mantiqiy tartib: **optimallashtirish, serverni kattalashtirish, replika qo‘shish, partitioning, keyin sharding**.

## Ko‘p uchraydigan xatolar

- Shard kalitini kelajakdagi hisobotlarni o‘ylamay, faqat bugungi so‘rovlarga qarab tanlash.
- Minglab mayda bo‘limlar yaratish — rejalashtiruvchi sekinlashadi.
- Kelgusi bo‘limlarni oldindan yaratishni unutish, natijada yangi oy boshida yozuvlar xato beradi.
- Aslida indeks yo‘qligidan sekin ishlayotgan so‘rovlarni sharding bilan «tuzatish».

## FAQ

### Partitioning va shardingni birga ishlatish mumkinmi?

Ha. Keng tarqalgan sxema: mijoz yoki foydalanuvchi bo‘yicha sharding, har bir shard ichidagi katta jadvallarni esa vaqt bo‘yicha partitioning. Partitioningdan boshlang, shardingni faqat haqiqiy ehtiyoj bo‘lganda qo‘shing.

### Partitioning barcha so‘rovlarni tezlashtiradimi?

Yo‘q. U partition kaliti bo‘yicha filtrli so‘rovlarga yordam beradi va xizmat ko‘rsatishni soddalashtiradi. Bunday filtrsiz so‘rovlar ko‘proq jadvalga tegani uchun biroz sekinlashishi ham mumkin.

### Bitta server yetmay qolganini qanday bilish mumkin?

Optimallashtirish, serverni kattalashtirish va o‘qishni replikalarga chiqarishdan keyin ham saqlanib qolgan yozish to‘yinishi, xotira chegarasi yoki replikatsiya kechikishiga qarang. Agar cheklov haqiqiy bo‘lsa, sharding mantiqiy keyingi qadam bo‘ladi.
