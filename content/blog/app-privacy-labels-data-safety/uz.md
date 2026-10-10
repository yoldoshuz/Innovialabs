---
title: App Store Privacy-belgilari va Google Play Data Safety qo‘llanmasi
description: App Store va Google Play’da qaysi ma’lumotlarni e’lon qilish kerak, tashqi SDK’lar javoblarga qanday ta’sir qiladi, privacy manifest va akkauntni o‘chirish.
summary: Ikkala anketada ilova va uning barcha SDK’lari qaysi ma’lumotlarni, nima uchun yig‘ishini va uchinchi shaxslarga uzatilishini ko‘rsatasiz. Javoblar ilovaning real xatti-harakati va maxfiylik siyosatiga mos kelishi kerak, aks holda do‘kon yangilanishni rad etishi yoki ilovani olib tashlashi mumkin.
---

## Qisqa javob: bu qanday anketalar

- App Store Connect’dagi **App Privacy** (privacy-belgilar, «nutrition labels») — App Store’dagi ilova sahifasidagi blok bo‘lib, qaysi ma’lumotlar yig‘ilishi va ular foydalanuvchi shaxsi bilan bog‘liqligini ko‘rsatadi.
- Google Play Console’dagi **Data Safety** — Google Play sahifasidagi shunga o‘xshash bo‘lim: qaysi ma’lumotlar yig‘iladi, qaysilari uzatiladi, shifrlanadimi va ularni o‘chirish mumkinmi.

Anketalarni dasturchi to‘ldiradi va aniqlik uchun javobgarlik ham unda. Do‘konlar javoblarni ilovaning xatti-harakati bilan, foydalanuvchilar va jurnalistlar esa real trafik bilan solishtiradi.

## Nimani e’lon qilish kerak

Ikkala anketa ham **ma’lumot turlari** va ulardan foydalanish **maqsadlari** haqida so‘raydi.

| Ma’lumot turi | Misollar |
|---|---|
| Kontaktlar | Ism, email, telefon, manzil |
| Identifikatorlar | Foydalanuvchi ID’si, qurilmaning reklama ID’si |
| Joylashuv | Aniq yoki taxminiy |
| Moliya | To‘lov ma’lumotlari, xaridlar tarixi |
| Foydalanuvchi kontenti | Foto, xabarlar, fayllar |
| Foydalanish | Bosishlar, ekranlarni ko‘rish, qidiruv |
| Diagnostika | Crash’lar, unumdorlik |

Maqsadlar: ilova funksionalligi, analitika, shaxsiylashtirish, reklama, firibgarlikning oldini olish va boshqalar.

Atamalardagi asosiy farqlar:
- **Apple** ma’lumotlar shaxs bilan bog‘liqmi (**linked to user**) va **treking** uchun — reklama maqsadida boshqa kompaniyalar ma’lumotlari bilan birlashtirish uchun ishlatiladimi, deb so‘raydi. Treking bo‘lsa, **App Tracking Transparency** so‘rovi kerak.
- **Google** **yig‘ish** (collection) va uchinchi shaxslarga **uzatish**ni (sharing) ajratadi. Sizning nomingizdan ishlaydigan xizmat ko‘rsatuvchiga uzatish odatda sharing hisoblanmaydi — Play ma’lumotnomasidagi ta’riflarni tekshiring.

## SDK’lar javoblarga qanday ta’sir qiladi

Anketa tashqi kodni ham qo‘shib, **butun ilovani** tavsiflaydi. Analitika, crash-hisobotlar, reklama, ijtimoiy tarmoqlar orqali kirish, to‘lov SDK’lari — o‘z kodingiz hech narsa yubormasa ham, bularning barchasi ma’lumot yig‘adi.

Harakatlar tartibi:
1. Bog‘liqliklardagi barcha SDK’lar ro‘yxatini tuzing.
2. Har biri uchun hujjatlarda App Store va Google Play uchun ma’lumotlar bo‘limini toping — yirik yetkazib beruvchilar uni e’lon qiladi.
3. Sozlamalarni hisobga oling: reklama ID’si yoki IP yig‘ishni o‘chirish javoblarni o‘zgartiradi.
4. Hujjatlar noaniq bo‘lsa, real trafikni proksi orqali tekshiring.

## iOS’da privacy manifest

**Privacy manifest** (`PrivacyInfo.xcprivacy`) — ilova va SDK ichidagi fayl bo‘lib, unda yig‘iladigan ma’lumotlar, treking domenlari va ayrim tizim API’laridan foydalanish sabablari (**required reason APIs**, masalan UserDefaults yoki fayl vaqt belgilari) tavsiflanadi.

- Apple ro‘yxatidagi keng tarqalgan tashqi SDK’lar o‘z manifesti va imzosi bilan yetkazilishi kerak.
- Xcode arxivdagi barcha manifestlar bo‘yicha **privacy report** tuza oladi — belgilarni to‘ldirish uchun qulay asos.
- Required reason APIs uchun kerakli sabablar bo‘lmasa, App Store Connect ogohlantirish yuboradi yoki yuklashni rad etadi.

## Akkauntni o‘chirish

Agar ilovada **akkaunt yaratish** mumkin bo‘lsa, ikkala platforma ham uni **o‘chirish** imkonini talab qiladi:
- **Apple** — o‘chirish faqat qo‘llab-quvvatlash xizmatiga xat orqali emas, ilovaning o‘zidan boshlanishi kerak.
- **Google Play** — ilova ichida o‘chirish yo‘li va ilovani o‘rnatmasdan o‘chirishni so‘rash mumkin bo‘lgan **veb-havola** kerak. Havola Data Safety’da ko‘rsatiladi.

O‘chirish shunchaki deaktivatsiya emas, ma’lumotlarni o‘chirish demakdir. Agar ma’lumotlarning bir qismini qonun bo‘yicha saqlash shart bo‘lsa, buni ko‘rsating.

## Noto‘g‘ri javoblar nimaga olib keladi

- Anketa tuzatilmaguncha yangilanishning rad etilishi.
- Deklaratsiyani belgilangan muddatda tuzatish talabi.
- Ilovaning nashrdan olib tashlanishi, takroriy buzilishlarda esa dasturchi akkauntiga nisbatan choralar.
- Nomuvofiqliklar tashqaridan topilsa, foydalanuvchilar ishonchini yo‘qotish.

Har safar SDK yoki ma’lumotlar bilan ishlaydigan yangi funksiya qo‘shganda anketalarni qayta ko‘rib chiqing.

## FAQ

### Ilova hech narsa yig‘masa ham anketalarni to‘ldirish kerakmi?
Ha. Ikkala do‘konda buni ko‘rsatish mumkin, lekin bo‘limni baribir to‘ldirish kerak. Undan oldin SDK’larni tekshiring — «hech narsa yig‘maydi» holati o‘ylagandan kamroq uchraydi.

### Crash-hisobotlar ma’lumot yig‘ish hisoblanadimi?
Odatda ha — agar ular qurilmadan serverga ketsa, bu diagnostika ma’lumotlari. Ularni do‘kon ta’riflariga ko‘ra «analitika» yoki «funksionallik» maqsadi bilan ko‘rsating.

### Privacy-belgilarni qanchalik tez-tez yangilash kerak?
Ma’lumot yig‘ish har o‘zgarganda: yangi SDK, yangi funksiya, analitika yetkazib beruvchisini almashtirish. Anketani tekshirishni reliz chek-listining bandiga aylantirish qulay.
