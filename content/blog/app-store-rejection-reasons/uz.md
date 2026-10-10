---
title: App Store va Google Play rad etishining asosiy sabablari va yechimlari
description: Crash, to‘liq bo‘lmagan ma’lumot, demo-akkauntsiz kirish, do‘kondan tashqari to‘lov, maxfiylik va minimal funksionallik: qanday tuzatish va e’tiroz bildirish.
summary: Ko‘p rad etishlar crash, demo-kirish yo‘qligi, noto‘g‘ri to‘lov oqimi, maxfiylik muammolari va juda sodda funksionallik sababli bo‘ladi; deyarli hammasini yuborishdan oldingi chek-list oldini oladi, qolganini ko‘rib chiquvchiga aniq va xushmuomala javob hal qiladi.
---

## Qisqacha: ilovalar nega rad etiladi

Rad etish deyarli hech qachon tasodifiy bo‘lmaydi. Apple ham, Google ham bir xil sabablar guruhi bo‘yicha rad etadi:

- ilova ko‘rib chiquvchida **ishdan chiqadi yoki ishlamaydi**;
- ko‘rib chiquvchi **kira olmaydi** yoki asosiy funksiyani ko‘ra olmaydi;
- raqamli tovarlar **ichki xaridlarni chetlab** sotiladi;
- **maxfiylik**: siyosat yo‘q, ma’lumotlar deklaratsiyasi noto‘g‘ri, ortiqcha ruxsatlar;
- ilova **juda sodda** yoki saytni takrorlaydi;
- **metama’lumotlar** ilova mazmuniga mos emas.

Rad etish xatida doim qoida bandi ko‘rsatiladi. Kodni qayta yozishdan emas, shu banddan boshlang.

## Sabablar va yechimlar

| Sabab | Qanday tuzatish |
|---|---|
| Ishga tushganda crash yoki qotish | Reliz buildini toza qurilmada va so‘nggi OS’da sinang, crash-hisobotlarni ulang |
| Plaseholderlar, «tez orada», buzuq havolalar | Tugallanmagan ekranlarni olib tashlang yoki feature flag ortiga yashiring |
| Ko‘rib chiquvchi uchun kirish yo‘q | Ma’lumotlari bor ishlaydigan demo-akkaunt bering; Google Play’da App access bo‘limini to‘ldiring |
| Raqamli kontent do‘kondan tashqari sotiladi | Obunalar va raqamli tovarlar uchun StoreKit va Google Play Billing’dan foydalaning |
| Maxfiylik siyosati yo‘q yoki bo‘sh | To‘planadigan ma’lumotlar, maqsadlar va kontaktlar yozilgan sahifani e’lon qiling |
| Deklaratsiyalar haqiqatga mos emas | App Privacy va Data safety’ni loyihadagi barcha SDK’lar bilan solishtiring |
| Akkauntni o‘chirib bo‘lmaydi | Ilovada ro‘yxatdan o‘tish bo‘lsa, akkauntni ilova ichida o‘chirish imkonini qo‘shing |
| Minimal funksionallik | Saytda yo‘q qiymat qo‘shing: oflayn rejim, push, nativ funksiyalar |
| Skrinshotlar va tavsif boshqa narsa haqida | Haqiqiy ekranlarni ko‘rsating, begona brendlar va va’dalarsiz |

## Apple xususiyatlari

- **Guideline 2.1 (App Completeness)** — eng ko‘p uchraydigan guruh: crash, xatolar, demo-kirish yo‘qligi. Yuborishdan oldin buildni TestFlight orqali tekshiring.
- **Guideline 4.2 (Minimum Functionality)** — o‘z qiymatiga ega bo‘lmagan sayt-o‘ram.
- **Guideline 3.1.1 (In-App Purchase)** — raqamli funksiya yoki kontentni ochish ichki xaridlar orqali bo‘lishi kerak. Jismoniy tovarlar va real hayotdagi xizmatlar odatiy usullarda to‘lanadi.
- **Guideline 4.8 (Login Services)** — agar kirish faqat uchinchi tomon ijtimoiy tarmoqlari orqali bo‘lsa, Apple maxfiylikni himoya qiluvchi qo‘shimcha variantni, masalan Sign in with Apple’ni talab qilishi mumkin.
- **Guideline 5.1.1** — ma’lumot to‘plash: asoslangan ruxsat so‘rovlari, `Info.plist`’dagi tushunarli matnlar, akkauntni o‘chirish.

## Google Play xususiyatlari

- **Data safety** — Play Console’dagi forma ilova va SDK’lar xatti-harakatiga mos bo‘lishi shart.
- **Ruxsatlar** — SMS, qo‘ng‘iroqlar jurnali, fondagi geolokatsiya va barcha fayllarga kirish alohida asoslashni talab qiladi va faqat muayyan ssenariylarga mos keladi.
- **Target API level** — Google yangi ilovalar va yangilanishlar uchun minimal maqsadli API darajasini muntazam oshiradi.
- **Payments** — raqamli tovarlar uchun Google Play Billing amal qiladi.
- **Chalg‘ituvchi xatti-harakat** — yashirin funksiyalar, soxta tugmalar, tavsifga mos kelmaslik.

## Qanday javob berish va e’tiroz bildirish

1. Faqat ko‘rib chiquvchi xatini emas, **qoida bandini to‘liq o‘qing**.
2. Agar ko‘rib chiquvchi adashgan bo‘lsa, **Resolution Center**’da (App Store Connect) yoki Play Console’dagi **apellyatsiya** orqali javob bering: qisqa, faktlar bilan, skrinshot yoki video ilova qilib.
3. Demo-kirish yoki izoh kerak bo‘lsa, **uni izohlarga qo‘shing** va buildni qayta yuboring.
4. Apple qaroriga rozi bo‘lmasangiz, rasmiy apellyatsiya uchun **App Review Board** bor.
5. Hissiyotga berilib bahslashmang va o‘zgarishsiz buildni qayta yubormang.

## Yuborishdan oldingi chek-list

- Reliz buildi haqiqiy qurilmada sinalgan.
- Demo-akkaunt ishlaydi va muddati tugamaydi.
- Maxfiylik siyosati ochiladi va dolzarb.
- Deklaratsiyalar barcha SDK’larni hisobga oladi.
- So‘raladigan har bir ruxsat haqiqatan ishlatiladi.
- Raqamli xaridlar do‘kon orqali o‘tadi.
- Akkauntni o‘chirish ilova ichida mavjud.

## FAQ

### Rad etilgandan keyin ilovani necha marta yuborish mumkin?

Qat’iy cheklov yo‘q, ammo tuzatishsiz qayta yuborish jarayonni sekinlashtiradi. Sababni tuzating, o‘zgarishlarni izohlarda tushuntiring va shundan keyingina qayta yuboring.

### Google allaqachon e’lon qilingan ilovani o‘chirib tashlashi mumkinmi?

Ha. Ilova qoidalarni buzsa, Google yangilanishni rad etishi, ilovani to‘xtatishi yoki o‘chirishi, takroriy buzilishlarda esa dasturchi akkauntini cheklashi mumkin. Play Console bildirishnomalarini kuzatib boring.

### Obuna uchun ichki xaridlardan foydalanish shartmi?

Ilova ichidagi raqamli kontent va funksiyalar uchun, odatda, ha. Jismoniy tovarlar va real xizmatlar uchun — yo‘q. Ayrim kategoriyalar va hududlar bo‘yicha qoidalar o‘zgarib turadi, shuning uchun ikkala do‘konning joriy qoidalarini tekshiring.
