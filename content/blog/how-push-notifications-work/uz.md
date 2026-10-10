---
title: iOS va Android’da push-bildirishnomalar qanday ishlaydi
description: Push serverdan ekranga qanday yetib boradi: APNs va Firebase Cloud Messaging, qurilma tokenlari, jim va ko‘rinadigan pushlar, iOS va Android’dagi ruxsatlar.
summary: Serveringiz push’ni telefonga to‘g‘ridan-to‘g‘ri yubormaydi: u xabarni qurilma tokeni bilan platforma xizmatiga — Apple’ning APNs yoki Google’ning Firebase Cloud Messaging xizmatiga — beradi, ular esa qurilmaga yetkazadi. Bildirishnomani ko‘rsatish uchun foydalanuvchi ruxsati kerak.
---

## Asosiysi qisqacha

Push-bildirishnoma vositachi orqali o‘tadi. Ilova serveringiz bilan doimiy ulanishni ushlab turmaydi — bu batareyani tez tugatardi. Buning o‘rniga operatsion tizim platforma xizmati bilan **bitta umumiy ulanish**ni saqlaydi:

- **APNs (Apple Push Notification service)** — iOS, iPadOS, macOS va watchOS uchun;
- **FCM (Firebase Cloud Messaging)** — Android uchun, shuningdek APNs orqali iOS’ga ham yubora oladigan yagona kirish nuqtasi sifatida.

Serveringiz xabarni APNs yoki FCM’ga yuboradi, ular esa uni kerakli qurilmaga yetkazadi.

## Serverdan ekrangacha yo‘l

1. **Ilova ishga tushganda** push tizimida ro‘yxatdan o‘tadi.
2. **Platforma token beradi** — aynan shu qurilmadagi aynan shu ilova o‘rnatmasining noyob manzili.
3. **Ilova tokenni** backend’ga yuboradi, u yerda foydalanuvchi ID’si bilan saqlanadi.
4. **Server xabar tuzadi** va tokenni ko‘rsatib, uni APNs yoki FCM’ga yuboradi.
5. **Xizmat xabarni** qurilma tarmoqqa ulanganda yetkazadi.
6. **OS bildirishnomani ko‘rsatadi** yoki ma’lumotni qayta ishlash uchun ilovani uyg‘otadi.

## Qurilma tokenlari

Token doimiy identifikator emas. U ilova qayta o‘rnatilganda, qurilma zaxira nusxadan tiklanganda yoki platforma qaroriga ko‘ra o‘zgarishi mumkin. Shuning uchun:

- token o‘zgargan bo‘lsa, har bir ishga tushirishda uni serverda yangilang;
- APNs yoki FCM «yaroqsiz» deb qaytargan tokenlarni o‘chiring;
- bitta foydalanuvchi uchun bir nechta token saqlang — odamda telefon ham, planshet ham bo‘lishi mumkin.

## Server push’ni qanday yuboradi

**APNs** uchun server Apple Developer akkauntidagi `.p8` kalit (yoki sertifikat) bilan autentifikatsiyadan o‘tadi va HTTP/2 orqali so‘rov yuboradi. Minimal payload shunday ko‘rinadi:

```json
{
  "aps": {
    "alert": { "title": "Buyurtma yo‘lda", "body": "Kuryer 15 daqiqada yetib keladi" },
    "sound": "default"
  },
  "order_id": "4821"
}
```

**FCM** uchun servis akkauntining OAuth tokeni bilan HTTP v1 API ishlatiladi:

```json
{
  "message": {
    "token": "DEVICE_TOKEN",
    "notification": { "title": "Buyurtma yo‘lda", "body": "Kuryer 15 daqiqada yetib keladi" },
    "data": { "order_id": "4821" }
  }
}
```

Batafsil ma’lumot — rasmiy [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging) hujjatlarida.

## Ko‘rinadigan va jim bildirishnomalar

| Turi | Nima qiladi | Ruxsat kerakmi | Yetkazish kafolati |
|---|---|---|---|
| Ko‘rinadigan | Banner, ovoz, beyj ko‘rsatadi | Ha | Yuqori |
| Jim (silent) | Ilovani fonda uyg‘otadi, hech narsa ko‘rsatmaydi | Yo‘q | Kafolatlanmaydi |

iOS’da **jim pushlar** `content-available: 1` bilan yuboriladi va fon sinxronizatsiyasi uchun ishlatiladi. Tizim ularning chastotasini cheklaydi, batareya kam bo‘lsa yoki foydalanuvchi ilovani majburan yopgan bo‘lsa, kechiktirishi yoki o‘tkazib yuborishi mumkin. Android’da uning analogi — `notification` blokisiz **data-xabarlar**; ularni ilova kodi qayta ishlaydi.

Muhim mantiqni faqat jim pushlarga qurmang: bu «yangilanish kerak» degan ishora, ishonchli kanal emas.

## Ruxsat qoidalari

- **iOS**: bildirishnomalarni ko‘rsatish har doim tizim oynasi orqali foydalanuvchining aniq ruxsatini talab qiladi. **Provisional** rejim ham bor: bildirishnomalar so‘rovsiz, Bildirishnomalar markaziga jimgina keladi, foydalanuvchi esa ularni qoldirish-qoldirmaslikni o‘zi hal qiladi.
- **Android**: tizimning zamonaviy versiyalarida ilova `POST_NOTIFICATIONS` ruxsatini ham so‘rashi kerak. Bundan tashqari, bildirishnomalar **kanallar**ga guruhlanadi va foydalanuvchi har bir kanalni alohida o‘chira oladi.

iOS’dagi tizim oynasi faqat bir marta ko‘rsatiladi. Foydalanuvchi rad etsa, ruxsatni faqat sozlamalar orqali qaytarish mumkin.

## Ruxsatni qanday yo‘qotmaslik

- Birinchi ishga tushirishdayoq kontekstsiz ruxsat so‘ramang.
- Avval o‘z ekraningizda foydasini tushuntiring: «Kuryer yaqinlashganda xabar beramiz».
- Foyda aniq bo‘lgan paytda so‘rang, masalan buyurtma rasmiylashtirilgandan keyin.
- Ilova ichida sozlamalar bering: qaysi mavzular kelsin, qaysilari kelmasin.

## FAQ

### iOS’ga Firebase’siz push yuborsa bo‘ladimi?

Ha. Server to‘g‘ridan-to‘g‘ri APNs bilan ishlay oladi. Ikkala platformaga yagona yuborish nuqtasi kerak bo‘lsa, Firebase qulay.

### Nega bildirishnomalar ba’zan yetib bormaydi?

Ko‘p uchraydigan sabablar: eskirgan token, foydalanuvchi bildirishnomalarni o‘chirgan, quvvat tejash yoki «Bezovta qilmang» rejimi, payload’dagi xato, jim pushlar uchun esa tizim cheklovlari.

### Push-bildirishnomalar uchun server kerakmi?

Shaxsiy bildirishnomalar uchun — ha, tokenlarni saqlash va xabar yuborish kerak. Oddiy ommaviy xabarlar uchun Firebase konsoli yoki tashqi xizmatdan foydalanish mumkin.
