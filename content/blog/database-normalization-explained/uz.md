---
title: Ma’lumotlar bazasini normallashtirish: 1NF, 2NF, 3NF misollarda
description: Tartibsiz buyurtmalar jadvalini 1NF, 2NF va 3NF orqali bosqichma-bosqich o‘tkazamiz: har bir shakl qoidalari va ongli denormallashtirish qachon o‘rinli.
summary: Normallashtirish — ma’lumotlarni har bir fakt bir marta saqlanadigan qilib jadvallarga bo‘lish: 1NF katakdagi ro‘yxatlarni, 2NF tarkibli kalitning bir qismiga bog‘liq ustunlarni, 3NF boshqa kalit bo‘lmagan ustunlarga bog‘liq ustunlarni yo‘qotadi; denormallashtirishni faqat ongli ravishda, o‘lchangan o‘qish tezligi yoki hisobotlar uchun qiling.
---

## Qisqacha javob

**Normallashtirish** — jadvallarni har bir fakt aynan bitta joyda saqlanadigan qilib loyihalash usuli. U uchta klassik muammodan — **anomaliyalardan** himoya qiladi:

- **Yangilash anomaliyasi**: mijoz telefonini o‘zgartirdi va uni o‘nlab qatorlarda tuzatish kerak — bittasini albatta unutasiz.
- **Qo‘shish anomaliyasi**: kimdir buyurtma qilmaguncha yangi mahsulotni qo‘sha olmaysiz.
- **O‘chirish anomaliyasi**: mijozning oxirgi buyurtmasini o‘chirdingiz — u haqidagi barcha ma’lumot yo‘qoldi.

Dastlabki uchta normal shakl (1NF, 2NF, 3NF) ilova bazasiga kerak bo‘ladigan deyarli hamma narsani qamrab oladi.

## Boshlang‘ich nuqta: Excel’dan olingan jadval

Elektron jadvaldan ko‘chirilgan buyurtmalar jadvali ko‘pincha shunday ko‘rinadi:

| order_id | date | customer | phone | city | products |
|---|---|---|---|---|---|
| 101 | 2026-03-01 | Aziz | +998 90 111 | Toshkent | Ruchka x2, Daftar x1 |
| 102 | 2026-03-02 | Malika | +998 91 222 | Samarqand | Daftar x3 |
| 103 | 2026-03-05 | Aziz | +998 90 111 | Toshkent | Ruchka x1 |

Ixcham ko‘rinadi, lekin nechta ruchka sotilganini hisoblash noqulay, Azizning telefoni esa ikki marta saqlangan.

## Birinchi normal shakl (1NF)

**Qoida:** har bir katakda bitta atomar qiymat, ro‘yxatlar va takrorlanuvchi guruhlar yo‘q, har bir qator kalit orqali aniqlanadi.

`products` ustunida ro‘yxat bor — har bir mahsulotga alohida qator beramiz:

| order_id | product | qty | price | date | customer | phone | city |
|---|---|---|---|---|---|---|---|
| 101 | Ruchka | 2 | 5 | 2026-03-01 | Aziz | +998 90 111 | Toshkent |
| 101 | Daftar | 1 | 12 | 2026-03-01 | Aziz | +998 90 111 | Toshkent |
| 102 | Daftar | 3 | 12 | 2026-03-02 | Malika | +998 91 222 | Samarqand |
| 103 | Ruchka | 1 | 5 | 2026-03-05 | Aziz | +998 90 111 | Toshkent |

Endi kalit — **(order_id, product)** jufti. «Nechta ruchka sotildi» kabi so‘rovlar oson bo‘ldi, lekin takrorlanish ko‘paydi.

## Ikkinchi normal shakl (2NF)

**Qoida:** jadval 1NF’da va har bir kalit bo‘lmagan ustun kalitning bir qismiga emas, **butun** kalitga bog‘liq. Bu faqat tarkibli kalitlar uchun muhim.

Ustunlarni `(order_id, product)` bo‘yicha tekshiramiz:

- `qty` ikkalasiga bog‘liq: shu buyurtmada shu mahsulotdan nechta. Qoladi.
- `date`, `customer`, `phone`, `city` faqat `order_id`ga bog‘liq. Chiqaramiz.
- `price` (katalog narxi) faqat `product`ga bog‘liq. Chiqaramiz.

Natija:

- **orders** (order_id, date, customer, phone, city)
- **products** (product_id, name, price)
- **order_items** (order_id, product_id, qty)

## Uchinchi normal shakl (3NF)

**Qoida:** jadval 2NF’da va hech bir kalit bo‘lmagan ustun boshqa kalit bo‘lmagan ustunga bog‘liq emas (**tranzitiv bog‘liqlik** yo‘q).

`orders`da kalit — `order_id`, lekin `phone` va `city` buyurtmani emas, mijozni tavsiflaydi. Ular `order_id`ga faqat `customer` orqali bog‘liq. Mijozni alohida jadvalga chiqaramiz:

- **customers** (customer_id, name, phone, city)
- **orders** (order_id, customer_id, date)
- **products** (product_id, name, price)
- **order_items** (order_id, product_id, qty)

```sql
CREATE TABLE customers (
  customer_id SERIAL PRIMARY KEY,
  name  TEXT NOT NULL,
  phone TEXT,
  city  TEXT
);

CREATE TABLE orders (
  order_id    SERIAL PRIMARY KEY,
  customer_id INT NOT NULL REFERENCES customers,
  created_at  DATE NOT NULL
);
```

Endi Azizning telefoni bir marta saqlanadi, mahsulotlar birinchi buyurtmagacha ham mavjud, buyurtmani o‘chirish esa mijozni o‘chirmaydi.

Qulay formula: har bir kalit bo‘lmagan ustun **kalitga, butun kalitga va faqat kalitga** bog‘liq bo‘lishi kerak.

## Ko‘p uchraydigan xatolar

- ID yoki teglarni bog‘lovchi jadval o‘rniga bitta matnli ustunda vergul bilan saqlash.
- Mijoz ismini «qulaylik uchun» har bir buyurtmaga nusxalash.
- `phone1`, `phone2`, `phone3` ustunlarini ochish — bu ham takrorlanuvchi guruh.
- Haddan tashqari normallashtirish: barqaror va doim birga ishlatiladigan ma’lumotlarni foydasiz ko‘plab mayda jadvallarga bo‘lish.

## Denormallashtirish qachon o‘rinli

**Denormallashtirish** — ma’lumotlarning bir qismini ongli ravishda ortiqcha saqlash. Bu xato emas, quyidagi hollarda vosita:

- **Hisobot va tahlil** alohida omborda ishlaydi, u yerda keng tekis jadvallar yoki «yulduz» sxemasi so‘rovlarni soddalashtiradi va tezlashtiradi.
- **O‘lchangan** sekin so‘rov har bir sahifa ko‘rilganda og‘ir JOIN yoki sanashni bajaradi; `comments_count` kabi keshlangan hisoblagich yordam beradi.
- **Tarixiy surat** kerak: buyurtma paytidagi narx va yetkazish manzili katalog yoki profil o‘zgarganda o‘zgarmasligi kerak. Aslida bu boshqa fakt («xarid narxi»), shuning uchun `order_items.price` — to‘g‘ri dizayn.

Xavfsiz denormallashtirish qoidalari: normallashtirilgan sxemadan boshlang, faqat o‘lchovlardan keyin denormallashtiring va nusxalarni tranzaksiyalar, triggerlar yoki aniq yangilash yo‘li bilan mos holatda saqlang.

## FAQ

### 3NF’dan yuqori shakllar kerakmi?

Ko‘pchilik ilovalar uchun 3NF yetarli. BCNF va 4NF kabi yuqoriroq shakllar kesishuvchi kalitlar yoki mustaqil ko‘p qiymatli faktlar bilan bog‘liq kamdan-kam holatlarni hal qiladi; ular haqida bilish foydali, ammo ularni ataylab loyihalash kam uchraydi.

### Ko‘p JOIN tufayli normallashtirish sekinroq emasmi?

Indekslangan kalitlar bo‘yicha birlashtirish — relyatsion bazalar aynan shu uchun yaratilgan, normallashtirilgan jadvallar esa odatda kichikroq. Tezlik muammolari ko‘pincha normallashtirishdan emas, indekslar yo‘qligidan kelib chiqadi.

### Normallashtirish MongoDB va boshqa NoSQL bazalariga tegishlimi?

G‘oyalar foydali bo‘lib qoladi, lekin hujjatli bazalar bog‘liq ma’lumotlarni bitta so‘rovda o‘qish uchun ko‘pincha ataylab ichiga joylaydi. Murosa o‘sha: tezroq o‘qish evaziga takroriy ma’lumotlarni mos holatda saqlash zarurati.
