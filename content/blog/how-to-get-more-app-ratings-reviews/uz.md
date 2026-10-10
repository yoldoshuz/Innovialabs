---
title: Do‘kon qoidalarini buzmasdan ilovaga ko‘proq baho va sharh olish
description: iOS va Android’dagi nativ baholash API’lari, bahoni so‘rash vaqti, sharhlarga javob berish, rag‘batlantirilgan sharhlar taqiqi va past reytingni tiklash.
summary: Bahoni faqat nativ API’lar orqali (iOS’da StoreKit, Android’da In-App Review) foydalanuvchi muvaffaqiyatli harakatdan so‘ng so‘rang, sharhlarga javob bering va shikoyat qilingan narsani tuzating. Baho uchun mukofot berish va norozi foydalanuvchilarni saralash ikkala do‘kon qoidalarida ham taqiqlangan.
---

## Asosiy qoida

Ko‘proq bahoni uch narsa beradi: ilova ichidagi **nativ baholash so‘rovi**, uni ko‘rsatish uchun **to‘g‘ri vaqt** va sharhlar chiqqandan keyin **ular bilan ishlash**. Baholarni sotib olish yoki saralashga o‘xshagan har qanday narsa App Store va Google Play qoidalarini buzadi va sharhlar o‘chirilishi yoki ilovaga nisbatan choralar ko‘rilishiga olib kelishi mumkin.

## Nativ API’lar: StoreKit va In-App Review

**iOS.** Apple baho so‘rashni tizim API’si orqali qilishni talab qiladi — StoreKit’dagi `requestReview` (SwiftUI’da `@Environment(\.requestReview)`). App Store’da baho so‘raydigan o‘z oynalaringizni ko‘rsatish qoidalarga zid. Oynani ko‘rsatish-ko‘rsatmaslikni tizim o‘zi hal qiladi va bitta foydalanuvchiga yil davomida ko‘rsatish sonini cheklaydi. Shuning uchun API chaqiruvi — kafolat emas, iltimos.

**Android.** Google Play In-App Review API baholash kartochkasini ilova ustida ko‘rsatadi, foydalanuvchi do‘konga o‘tmaydi. Sxema quyidagicha:

```kotlin
val manager = ReviewManagerFactory.create(context)
manager.requestReviewFlow().addOnCompleteListener { task ->
    if (task.isSuccessful) {
        manager.launchReviewFlow(activity, task.result)
    }
}
```

API’ning ko‘rsatish kvotasi bor va u foydalanuvchi baho qo‘yganini aytmaydi. Shuning uchun uni «Baholang» tugmasiga bog‘lamang — bosilganda hech narsa chiqmasligi mumkin. Sozlamalardagi tugma uchun ilovaning do‘kondagi sahifasini ochgan ma’qul.

**Flutter va React Native** xuddi shu tizim mexanizmlaridan plaginlar orqali foydalanadi, masalan `in_app_review`.

## Qachon so‘rash kerak

Vaqt so‘zlardan muhimroq. Ishga tushirishda emas, **ijobiy tajribadan** keyin so‘rang:

- buyurtma yetkazildi, to‘lov o‘tdi, vazifa bajarildi;
- foydalanuvchi bir necha marta qaytdi va asosiy ssenariyni o‘tdi;
- daraja, mashg‘ulot yoki dars tugadi.

Nimalardan qochish kerak:

- birinchi ishga tushirishda yoki o‘rnatishdan so‘ng darhol so‘rash;
- vazifa o‘rtasida, masalan to‘lov ekranida so‘rash;
- xato, qulash yoki uzoq yuklanishdan keyin darhol so‘rash;
- tez-tez takrorlash — tizim cheklovlari baribir ortiqchasini kesib tashlaydi.

Oddiy mantiq: muvaffaqiyatli harakatlar va sessiyalarni sanang, chegara belgilang va joriy sessiyada xato bo‘lgan bo‘lsa, so‘rovni ko‘rsatmang.

## Nimalar taqiqlangan

- **Baho uchun rag‘batlantirish**: bonuslar, chegirmalar, o‘yin valyutasi yoki sharh evaziga funksiyalarni ochish.
- **Norozilarni saralash** (review gating): avval «Ilova sizga yoqdimi?» deb so‘rab, faqat «ha» deganlarni do‘konga yuborish. Google baholash kartochkasini ko‘rsatishdan oldin savol berishni, jumladan fikr haqidagi savollarni ham to‘g‘ridan-to‘g‘ri taqiqlaydi. Apple tizim API’sidan foydalanishni talab qiladi.
- **Sun’iy ko‘paytirish**: sotib olingan sharhlar, xodimlar va tanishlardan iltimos bilan olingan sharhlar, baho almashish xizmatlari.
- **Matnda bosim**: «5 yulduz qo‘ying», baho qo‘yilmasa funksiya ochilmaydi degan ishoralar.

Ilova ichida fikr-mulohaza yig‘moqchi bo‘lsangiz, baho so‘rovi bilan bog‘lanmagan alohida «Muammo haqida xabar berish» shaklini qiling.

## Sharhlarga javob berish

App Store Connect ham, Google Play Console ham sharhlarga javob berish imkonini beradi. Bu reytingga bilvosita ta’sir qiladi: muammo hal bo‘lgach, foydalanuvchi bahosini o‘zgartirishi mumkin.

- Salbiy sharhlarga tez va mazmunli javob bering, shablon uzrlarsiz.
- Muammo tuzatilgan bo‘lsa, qaysi versiyada ekanini yozing.
- Bahslashmang va bahoni o‘zgartirish evaziga hech narsa taklif qilmang.
- Takrorlanuvchi shikoyatlarni bekloga yig‘ing — bu bepul foydalanuvchi tadqiqoti.

## Past reytingni qanday tiklash

1. **Sababni toping.** Oxirgi sharhlarni mavzular bo‘yicha guruhlang: qulashlar, to‘lov, aniq bir funksiya, reklama.
2. **Asosiy muammoni tuzating** va barqarorlikni crash-free ko‘rsatkichi orqali tekshiring.
3. **Yangilanish chiqaring** va zarar ko‘rganlarga muammo hal bo‘lganini yozing.
4. **Do‘kon mexanizmlaridan foydalaning.** App Store Connect’da yangi versiya chiqarishda umumiy reytingni nolga tushirish mumkin — buni faqat versiya haqiqatan yaxshiroq bo‘lganda qiling. Google Play’da yaqindagi baholar eskilaridan ko‘proq hisobga olinadi, shuning uchun yaxshilanishlar vaqt o‘tib aks etadi.
5. **Ijobiy lahzalardan keyin** nativ API orqali baho so‘rashga qayting.

## FAQ

### Baho so‘rashdan oldin «Ilova sizga yoqdimi?» deb so‘rasa bo‘ladimi?

Agar javobga qarab baho so‘rovini ko‘rsatish yoki ko‘rsatmaslikni hal qilsangiz, yo‘q. Bu sharhlarni saralash va u taqiqlangan. Taassurotlar haqida alohida, do‘kondagi baho bilan bog‘lamasdan so‘rash mumkin.

### iOS’da tizim baholash oynasi nega chiqmayapti?

Tizim ko‘rsatish chastotasini cheklaydi va oynani umuman ko‘rsatmasligi mumkin. Dasturlash yig‘malarida oyna doim chiqadi, lekin bahoni yuborib bo‘lmaydi, TestFlight’da esa u umuman ko‘rinmaydi.

### Yomon sharhni o‘chirib tashlash mumkinmi?

Yo‘q. Faqat do‘kon qoidalarini buzadigan sharhlar, masalan spam yoki haqoratlar ustidan shikoyat qilish mumkin. Qolganlari faqat mahsulot ustida ishlash va javoblar orqali tuzatiladi.
