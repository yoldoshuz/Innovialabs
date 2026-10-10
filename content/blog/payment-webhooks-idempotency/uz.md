---
title: To‘lov vebxuklarini ishonchli qayta ishlash: idempotentlik va takrorlar
description: To‘lov vebxuklari imzosini tekshirish, handlerni idempotent qilish, dublikat va tartibsiz hodisalarga chidash hamda buyurtma holatlarini solishtirish.
summary: Ishonchli vebxuk handleri imzoni tekshiradi, har bir hodisani noyob ID bo‘yicha saqlaydi, buyurtma statusini faqat ruxsat etilgan o‘tishlar bilan o‘zgartiradi va provayder API’si bilan muntazam solishtiradi.
---
## Asosiy qoida

To‘lov provayderi **bitta hodisani bir necha marta, kechikib yoki noto‘g‘ri tartibda yuborishi mumkin**. Bu odatiy holat: muvaffaqiyatli javob olmasa, u qayta yuboradi. Shuning uchun handler quyidagicha bo‘lishi kerak:

- **tekshiriladigan** — faqat to‘g‘ri imzoli so‘rovlarni qabul qiladi;
- **idempotent** — o‘sha hodisani qayta ishlash hech narsani o‘zgartirmaydi;
- **tartibga chidamli** — eski hodisa yangiroq statusni ustidan yozmaydi;
- **solishtiriladigan** — buyurtma holatini provayder API’si orqali tekshirish mumkin.

## 1-qadam. Imzoni tekshirish

Provayderlar odatda vebxukni imzolaydi: so‘rov tanasidan umumiy sir bilan HMAC, imzo sarlavha yoki parametrlarda. Har birining o‘z sxemasi bor (Stripe, Payme, Click va boshqalar buni hujjatlarida yozadi), lekin tamoyillar umumiy:

- imzoni JSON’ni parse qilishdan oldin, **xom so‘rov tanasi** bo‘yicha tekshiring;
- imzolarni doimiy vaqtli funksiya bilan solishtiring;
- provayder vaqt belgisini yuborsa, juda eski so‘rovlarni rad eting;
- sirni kodda emas, muhit o‘zgaruvchilarida saqlang.

```ts
import crypto from "node:crypto";

export function isValidSignature(rawBody: string, signature: string, secret: string) {
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
```

## 2-qadam. Hodisalar jadvali orqali idempotentlik

Har bir hodisaning noyob identifikatori bor. Uni biznes-logikadan oldin **noyob kalitli** jadvalga saqlang. Agar qo‘shish dublikat sababli muvaffaqiyatsiz bo‘lsa — hodisa allaqachon qayta ishlangan, muvaffaqiyat bilan javob bering.

```sql
CREATE TABLE payment_events (
  provider     text NOT NULL,
  event_id     text NOT NULL,
  payload      jsonb NOT NULL,
  processed_at timestamptz,
  PRIMARY KEY (provider, event_id)
);
```

Muhim: hodisani yozish va buyurtmani o‘zgartirish **bitta tranzaksiyada** bo‘lishi kerak. Aks holda hodisani yozib, xatoga uchrab, buyurtmani hech qachon yangilamaslik mumkin.

## 3-qadam. Tez javob va navbat

Provayder javobni cheklangan vaqt kutadi. Yuklama ostida ishlaydigan sxema:

1. Imzoni tekshirish.
2. Hodisani saqlash.
3. Darhol muvaffaqiyatli HTTP-javob qaytarish.
4. Hodisani takrorlashli fon navbatida qayta ishlash.

Handler ichida xat yubormang, CRM’ni chaqirmang va hujjat shakllantirmang — har qanday sekin operatsiya taymaut va qayta yuborishga olib keladi.

## 4-qadam. Tartibsiz hodisalar

«To‘lov tasdiqlandi» hodisasi «to‘lov yaratildi»dan oldin, «qaytarish» esa siz to‘lovni qayta ishlashingizdan oldin kelishi mumkin. Yechim — aniq o‘tishlarga ega buyurtma **holatlar mashinasi**:

| Joriy status | Ruxsat etilgan o‘tishlar |
|---|---|
| pending | paid, failed, cancelled |
| paid | refunded, partially_refunded |
| failed | paid (qayta urinish) |
| refunded | — |

Agar hodisa ruxsat etilmagan o‘tishni taklif qilsa (masalan, `refunded`dan qaytadan `paid`ga), uni qo‘llamang, tahlil uchun logga yozing. Qo‘shimcha ravishda provayder hodisasi vaqtini buyurtmaning oxirgi o‘zgarish vaqti bilan solishtirish mumkin.

## 5-qadam. Solishtirish va o‘zini tiklash

Vebxuk umuman kelmasligi mumkin: tarmoq nosozligi, sizning tomondagi xato, deploydan keyin noto‘g‘ri URL. Shuning uchun **solishtirish** kerak:

- davriy vazifa `pending` holatida uzoq turgan buyurtmalarni topadi;
- ular uchun provayder API’si orqali to‘lov statusi so‘raladi;
- nomuvofiqliklar avtomatik tuzatiladi yoki qo‘lda tekshirish navbatiga tushadi.

Shunday qilib vebxuk yagona haqiqat manbai emas, balki yangilanishning tez yo‘liga aylanadi.

## Ko‘p uchraydigan xatolar

- Imzoni tekshirishdan oldin JSON’ni parse qilish, natijada imzo mos kelmaydi.
- Dublikatga xato bilan javob berish — provayder qayta-qayta yuboraveradi.
- Vebxukdagi summaga buyurtma summasi bilan solishtirmasdan ishonish.
- Xom so‘rov tanasi bilan loglar yo‘qligi — keyin hodisani tahlil qilib bo‘lmaydi.
- Faqat «baxtli yo‘l»ni dublikat va teskari tartibsiz test qilish.

## FAQ

### Takroriy vebxukka qaysi HTTP-kod qaytariladi?

Muvaffaqiyatli kod (odatda 200). Hodisa allaqachon qayta ishlangan, xato esa provayderni takrorlashda davom etishga majbur qiladi. Javobga aniq talablarni aniq provayder hujjatlaridan ko‘ring.

### Navbatsiz ishlash mumkinmi?

Kichik hajmda — ha, agar qayta ishlash tez va tranzaksion bo‘lsa. Xatlar, CRM yoki buxgalteriya bilan integratsiyalar paydo bo‘lishi bilan takrorlashli navbat yo‘qolgan yangilanishlar xavfini sezilarli kamaytiradi.

### Dublikatlarni qayta ishlashni qanday test qilish mumkin?

Bitta hodisani ketma-ket va parallel ravishda bir necha marta yuboring, so‘ng hodisalarni teskari tartibda yuboring. Buyurtma statusi va summalar to‘g‘ri qolishi, hodisalar jadvalida esa har bir ID uchun bitta yozuv bo‘lishi kerak.
