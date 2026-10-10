---
title: Stripe’ni internet-do‘konga qanday integratsiya qilish
description: Stripe Checkout, Payment Element va Payment Links’ni solishtiramiz, xalqaro do‘kon uchun PaymentIntent, webhook, qaytarish va test rejimini ko‘rib chiqamiz.
summary: Ko‘pchilik do‘konlar uchun eng oddiy yo‘l — tayyor to‘lov sahifasi Stripe Checkout; Payment Element o‘z dizayningiz ichida to‘lov uchun kerak, buyurtma statusi esa faqat webhook orqali o‘zgaradi.
---

## Qisqa javob: qaysi variantni tanlash kerak

Stripe’da to‘lov qabul qilishning uchta asosiy usuli bor. Tanlov interfeys ustidan qancha nazorat kerakligiga bog‘liq.

| Variant | Bu nima | Qachon mos keladi |
|---|---|---|
| **Payment Links** | Kodsiz to‘lov havolasi | Bir nechta mahsulot, ijtimoiy tarmoqlar va messenjerlar orqali sotuv |
| **Checkout** | API orqali yaratiladigan Stripe to‘lov sahifasi | Ko‘pchilik internet-do‘konlar |
| **Payment Element** | O‘z dizayningizdagi o‘rnatiladigan forma | To‘lov UX’ini to‘liq nazorat qilish kerak bo‘lsa |

**Checkout** — oqilona boshlanish: Stripe mos to‘lov usullarini o‘zi ko‘rsatadi, 3D Secure va lokalizatsiyani boshqaradi. Payment Element ko‘proq moslashuvchanlik beradi, lekin ko‘proq kod va sinov talab qiladi.

Muhim: Stripe faqat qo‘llab-quvvatlanadigan mamlakatlarda ro‘yxatdan o‘tgan kompaniyalar uchun ishlaydi. Buni ishlab chiqishdan oldin tekshiring.

## Checkout qanday ishlaydi

1. Xaridor «To‘lash» tugmasini bosadi.
2. Serveringiz mahsulotlar, valyuta va qaytish manzillari bilan **Checkout Session** yaratadi.
3. Xaridor Stripe sahifasiga o‘tib to‘laydi.
4. Stripe `checkout.session.completed` webhook’ini yuboradi va siz buyurtmani to‘langan deb belgilaysiz.

```ts
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const session = await stripe.checkout.sessions.create({
  mode: "payment",
  line_items: [{ price: "price_123", quantity: 1 }],
  metadata: { orderId: "A-1042" },
  success_url: "https://shop.example/thanks?session_id={CHECKOUT_SESSION_ID}",
  cancel_url: "https://shop.example/cart",
});
// redirect the customer to session.url
```

Buyurtma ID’sini `metadata`da uzating — shunda webhook buyurtmaga aniq bog‘lanadi.

## Payment Element va PaymentIntent

O‘rnatilgan formada markaziy obyekt — **PaymentIntent**. U summa, valyuta va to‘lov statusini saqlaydi.

- Server PaymentIntent yaratadi va frontend’ga `client_secret` beradi.
- Frontend Payment Element’ni joylashtiradi va to‘lovni tasdiqlaydi.
- Bank 3D Secure talab qilsa, Stripe tekshiruvni o‘zi ko‘rsatadi.
- Yakuniy status `payment_intent.succeeded` yoki `payment_intent.payment_failed` webhook’i orqali keladi.

Summani doim buyurtma ma’lumotlari bo‘yicha **serverda** hisoblang, frontend’dan olmang.

## Webhook’lar: yagona haqiqat manbai

«Rahmat» sahifasi to‘lov isboti emas: foydalanuvchi tabni oldinroq yopishi mumkin. Buyurtma statusi faqat webhook orqali o‘zgaradi.

```ts
const event = stripe.webhooks.constructEvent(
  rawBody,                       // raw request body, not parsed JSON
  req.headers["stripe-signature"],
  process.env.STRIPE_WEBHOOK_SECRET!
);
if (event.type === "checkout.session.completed") {
  // mark order as paid if not already
}
```

Qoidalar:

- imzoni so‘rovning **xom tanasi** bo‘yicha tekshiring;
- hodisalarni **idempotent** qayta ishlang — Stripe bitta hodisani qayta yuborishi mumkin;
- tezda `2xx` bilan javob bering, og‘ir ishni navbatga chiqaring;
- qayta ishlangan hodisalar ID’larini saqlang.

## Pulni qaytarish

Qaytarish API yoki Dashboard orqali PaymentIntent bo‘yicha yaratiladi. U to‘liq yoki qisman bo‘lishi mumkin. Qaytarish hodisasini tinglang va buyurtmani «qaytarilgan» yoki «qisman qaytarilgan» holatiga o‘tkazing. Pul xaridorga darhol qaytmaydi — muddat bankka bog‘liq.

## Test rejimi

- Test kalitlaridan foydalaning — ular jangovar kalitlardan to‘liq ajratilgan.
- `4242 4242 4242 4242` test kartasi istalgan kelajak sana va istalgan CVC bilan muvaffaqiyatli to‘lov beradi; hujjatlarda rad etish va 3D Secure uchun kartalar bor.
- **Stripe CLI** webhook’larni lokal serverga yo‘naltiradi: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.
- Ishga tushirishdan oldin tekshiring: muvaffaqiyatli to‘lov, rad etish, 3D Secure, takroriy webhook, qaytarish.

## Ko‘p uchraydigan xatolar

- Buyurtma statusi success-sahifaga yo‘naltirishda o‘zgaradi.
- So‘rov tanasi imzo tekshiruvidan oldin JSON’ga aylantiriladi — imzo mos kelmaydi.
- Summa frontend’dan keladi va uni almashtirish mumkin.
- Test va jangovar kalitlar muhitlarda chalkashib ketgan.

## FAQ

### Boshlash uchun nima yaxshiroq: Checkout yoki Payment Element?

Checkout. U tezroq ishlab chiqiladi va ko‘pchilik ssenariylarni qamrab oladi. To‘lov o‘z interfeysingiz ichida bo‘lishi kerak bo‘lganda Payment Element’ga o‘tiladi.

### Stripe bilan ishlashda PCI sertifikati kerakmi?

Karta ma’lumotlarini Stripe qayta ishlaydi, shuning uchun sizga talablar ancha yengil. Lekin muvofiqlikni o‘z-o‘zini baholash anketasini to‘ldirish baribir kerak — Stripe qaysi forma kerakligini ko‘rsatadi.

### Bir nechta valyutani qanday qo‘llab-quvvatlash mumkin?

Sessiya yoki PaymentIntent yaratishda valyutani ko‘rsating va narxlarni valyutalar bo‘yicha saqlang. To‘lov usullari to‘plami valyuta va xaridor mamlakatiga bog‘liq.
