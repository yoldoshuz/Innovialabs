---
title: Firebase Cloud Messaging orqali push-bildirishnomalarni sozlash
description: Android va iOS uchun FCM sozlash: APNs kaliti, tokenlarni saqlash, HTTP v1 orqali serverdan yuborish, topiklar va yetkazishni tekshirish.
summary: Firebase’ni Android va iOS ilovalariga ulang, APNs kalitini yuklang, qurilmalarning FCM tokenlarini serverda saqlang va xabarlarni Firebase Admin SDK orqali yuboring; topiklar qiziqishlar bo‘yicha tarqatish uchun, konsoldan test yuborish esa yetkazishni tez tekshirish uchun qulay.
---

## Qisqacha: FCM qanday ishlaydi

**Firebase Cloud Messaging (FCM)** — Android, iOS va vebga push-bildirishnomalarni yetkazuvchi bepul Google xizmati. Sxemasi oddiy:

1. Ilova FCM’dan **qurilma tokenini** oladi.
2. Ilova tokenni **sizning serveringizga** yuboradi.
3. Server FCM’dan xabarni token yoki **topik** bo‘yicha yetkazishni so‘raydi.
4. Android’da FCM o‘zi yetkazadi, iOS’da esa Apple’ning **APNs** xizmati orqali.

## 1-qadam. Firebase loyihasi va Android

1. Firebase Console’da loyiha yarating.
2. Loyihangizdagi bilan bir xil **package name** bilan Android ilova qo‘shing.
3. `google-services.json` faylini yuklab oling va `app` moduliga joylang.
4. Google Services Gradle plaginini va `firebase-messaging` bog‘liqligini ulang.
5. Android 13’dan boshlab ilova ishlayotganda **POST_NOTIFICATIONS** ruxsatini so‘rash kerak.

Token va xabarlarni qabul qiluvchi servis:

```kotlin
class PushService : FirebaseMessagingService() {
    override fun onNewToken(token: String) {
        // tokenni serveringizga yuboring
    }

    override fun onMessageReceived(message: RemoteMessage) {
        // ilova ochiq paytdagi xabarlarni qayta ishlash
    }
}
```

Servisni `AndroidManifest.xml`’da `com.google.firebase.MESSAGING_EVENT` intent-filter bilan ro‘yxatdan o‘tkazing.

## 2-qadam. iOS va APNs kaliti

1. Firebase’ga **Bundle ID**’ngiz bilan iOS ilova qo‘shing, `GoogleService-Info.plist`’ni yuklab oling.
2. Apple Developer’da **APNs Authentication Key** (`.p8` fayl) yarating. Uni saqlab qo‘ying — qayta yuklab bo‘lmaydi.
3. Firebase’da **Project settings → Cloud Messaging → Apple app configuration** bo‘limida kalitni yuklang, **Key ID** va **Team ID**’ni kiriting.
4. Xcode’da **Push Notifications** capability’ni va **Background Modes → Remote notifications**’ni yoqing.
5. Kodda foydalanuvchidan ruxsat so‘rang va masofaviy bildirishnomalar uchun ro‘yxatdan o‘ting; Firebase SDK APNs tokenini FCM tokeni bilan bog‘laydi.

Bitta `.p8` kalit jamoaning barcha ilovalari va ikkala APNs muhiti uchun ishlaydi, uzaytirib turish kerak bo‘lgan eski sertifikatlardan farqli ravishda.

## 3-qadam. Tokenlar bilan ishlash

- Tokenni serverda **foydalanuvchi ID**’si, platforma va yangilangan sana bilan birga saqlang.
- `onNewToken` yoki uning iOS’dagi muqobili chaqirilganda tokenni yangilang.
- Bitta foydalanuvchida **bir nechta qurilma** bo‘lishi mumkin — tokenlar ro‘yxatini saqlang.
- FCM qurilma ro‘yxatdan o‘tmaganligi haqida xato qaytargan tokenlarni o‘chiring.
- Akkauntdan chiqishda tokenni foydalanuvchidan ajrating.

## 4-qadam. Serverdan yuborish

**FCM HTTP v1 API**’dan foydalaning — eski legacy API o‘chirilgan. Eng osoni — xizmat akkaunti bilan Firebase Admin SDK:

```js
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

initializeApp({ credential: applicationDefault() });

await getMessaging().send({
  token: deviceToken,
  notification: { title: "Buyurtma jo‘natildi", body: "Yetkazib berishni ilovada kuzating" },
  data: { screen: "order", orderId: "1042" },
});
```

- **notification** — sarlavha va matn, tizim ularni o‘zi ko‘rsatadi.
- **data** — mantiq uchun o‘z kalitlaringiz, masalan, o‘tiladigan ekran.

Xizmat akkaunti kalitini repozitoriyada yoki ilovada emas, server sirlarida saqlang.

## 5-qadam. Topiklar

Topik — unga obuna bo‘lgan hammaga tokenlarni saqlamasdan yuboriladigan tarqatma:

- mijoz `subscribeToTopic("news")` ni chaqiradi;
- server `token` o‘rniga `topic: "news"` bilan xabar yuboradi.

Topiklar ommaviy kategoriyalar (yangiliklar, aksiyalar) uchun qulay. Shaxsiy bildirishnomalar uchun tokenlardan foydalaning.

## 6-qadam. Yetkazishni tekshirish

1. Qurilma tokenini loglardan nusxalang.
2. Firebase Console’da **Messaging**’ni oching, bildirishnoma yarating va tokenni qo‘yib **Send test message**’ni bosing.
3. Uch holatni tekshiring: ilova ochiq, fonda va yopiq.
4. iOS’ni haqiqiy qurilmada tekshiring.

Xabar kelmasa: bildirishnomalar ruxsatini, yuklangan APNs kalitini, Bundle ID va package name mosligini hamda Android’dagi quvvatni tejash rejimini tekshiring.

## FAQ

### Nega Android’ga bildirishnomalar keladi-yu, iOS’ga kelmaydi?

Ko‘pincha APNs kaliti yuklanmagan, Key ID yoki Team ID noto‘g‘ri, Push Notifications capability yoqilmagan yoki foydalanuvchi ruxsat bermagan. Shu bandlarni ketma-ket tekshiring.

### Push uchun o‘z serverim kerakmi?

Oddiy ommaviy tarqatma uchun Firebase konsoli yetarli. Buyurtma, xabar, to‘lov kabi shaxsiy va triggerli bildirishnomalar uchun tokenlarni saqlaydigan va API orqali xabar yuboradigan backend kerak.

### Notification xabar data xabardan nimasi bilan farq qiladi?

Ilova fonda bo‘lganda notification’ni tizim o‘zi ko‘rsatadi. Data esa faqat sizning ma’lumotlaringizni olib keladi va ular bilan nima qilishni ilova hal qiladi. Ko‘pincha ikkala maydon birga ishlatiladi.
