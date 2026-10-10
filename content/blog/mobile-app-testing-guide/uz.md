---
title: Mobil ilovani test qilish: qo‘lda, avtotestlar va qurilma fermalari
description: Mobil ilovalarni test qilish: unit, UI va end-to-end testlar, Espresso, XCTest, Detox va Maestro, emulyatorlar, haqiqiy qurilmalar va bulutli fermalar.
summary: Ishonchli sxema — ko‘p tezkor unit testlar, kamroq UI komponent testlari va bir nechta end-to-end ssenariylar, ustiga relizdan oldin qo‘lda tekshirish. Emulyatorlar kundalik ishlab chiqish uchun mos, haqiqiy qurilmalar va bulutli fermalar esa mijozlaringiz ishlatadigan qurilmalarda tekshirish uchun.
---

## Qisqa javob: testlar piramidasi

Mobil ilova uch darajada tekshiriladi:

- **Unit testlar** — ko‘p, tezkor, interfeyssiz mantiqni tekshiradi.
- **UI komponent testlari** (Flutter’da widget testlar) — kamroq, ekran va elementlarni tekshiradi.
- **End-to-end (E2E)** — oz, asosiy ssenariylarni to‘liq tekshiradi: kirish, to‘lov, buyurtma berish.

Avtotestlar ustida **qo‘lda test qilish** qoladi: yangi funksiyalarni o‘rganish va relizdan oldingi regressiya.

## Test darajalari

| Daraja | Nimani tekshiradi | Tezlik | Qachon ishga tushirish |
|---|---|---|---|
| Unit | Biznes mantiq, hisob-kitoblar, ma’lumotlarni o‘zgartirish | Soniyalar | Har bir commit’da |
| UI komponentlar / widget | Ekran chizilishi, bosishlarga javob, holatlar | Tez | Har bir pull request’da |
| E2E | Ishga tushirishdan natijagacha ssenariy, tarmoq va navigatsiya bilan | Sekin | Pull request’da yoki tunda |

Daraja qancha yuqori bo‘lsa, testni qo‘llab-quvvatlash shuncha qimmat va u shuncha tez-tez **beqaror** (flaky) bo‘ladi. Shuning uchun asosiy mantiqni pastdan tekshiring, E2Eni eng muhim yo‘llar uchun qoldiring.

## Vositalar

| Vosita | Platforma | Nima uchun |
|---|---|---|
| **XCTest / XCUITest** | iOS | Unit va UI testlar, Xcode’ga o‘rnatilgan |
| **Espresso** | Android | Ilova jarayoni ichidagi UI testlar, asosiy oqim bilan sinxronlanadi |
| **flutter_test, integration_test** | Flutter | Unit, widget va integratsion testlar |
| **Detox** | React Native | «Kulrang quti» tamoyilidagi E2E: ilova bo‘shashini kutadi |
| **Maestro** | iOS, Android, kross-platforma | YAML’dagi E2E ssenariylar, kodni chuqur bilmasdan tez boshlash |
| **Appium** | iOS, Android | WebDriver orqali kross-platforma E2E |

Maestro ssenariysi misoli:

```yaml
appId: com.example.app
---
- launchApp
- tapOn: "Kirish"
- inputText: "test@example.com"
- tapOn: "Davom etish"
- assertVisible: "Bosh sahifa"
```

## Qo‘lda test qilish

Avtotestlar insonni to‘liq almashtirmaydi. Qo‘lda tekshirish kerak:

- **yangi funksiyalarni** — ssenariylar hali o‘rnashmagan paytda tadqiqiy test;
- **vizual mayda narsalarni**: shriftlar, chekinishlar, qorong‘i mavzu, turli ekran o‘lchamlari;
- **uzilishlarni**: kiruvchi qo‘ng‘iroq, ilovani yig‘ish, tarmoq yo‘qolishi, ruxsatlarni rad etish;
- relizdan oldin **chek-list bo‘yicha regressiyani**.

Yig‘malarni testerlarga tarqatish uchun iOS’da **TestFlight**, Google Play Console’da **ichki testlash** (internal testing) dan foydalaning.

## Emulyatorlar yoki haqiqiy qurilmalar

| | Emulyator va simulyatorlar | Haqiqiy qurilmalar |
|---|---|---|
| Narx | Bepul | Sotib olish yoki ijaraga olish kerak |
| Ishga tushirish | Tez, CI uchun qulay | Sozlash sekinroq |
| Aniqlik | Haqiqiy unumdorlik, kamera, sensorlarni takrorlamaydi | Haqiqiy xatti-harakat, ishlab chiqaruvchi qobiqlari |
| Qachon ishlatish | Kundalik ishlab chiqish, unit va UI testlar | Relizdan oldingi tekshiruv, unumdorlik, apparat |

Haqiqiy Android qurilmalarda tekshirish ayniqsa muhim: ishlab chiqaruvchi qobiqlari fon vazifalari, bildirishnomalar va quvvatni tejash bilan turlicha ishlaydi.

## Bulutli qurilma fermalari

Telefonlar parkini sotib olish qimmat bo‘lsa, fermalardan foydalaning: **Firebase Test Lab**, **AWS Device Farm**, **BrowserStack**, **Sauce Labs**. Ular testlaringizni bulutdagi haqiqiy qurilmalarda ishga tushiradi va loglar, video hamda skrinshotlarni qaytaradi.

Qurilmalar to‘plamini qanday tanlash kerak:

- Analitikadan foydalanuvchilaringiz orasida **eng mashhur modellar va OT versiyalarini** oling.
- **Qo‘llab-quvvatlanadigan minimal OT versiyasini** qo‘shing.
- **Kichik ekranli** va xotirasi kam **arzon qurilmani** kiriting.

## Ko‘p uchraydigan xatolar

- Holatni kutish o‘rniga qat’iy pauzalar (`sleep`) — beqaror testlarning asosiy manbai.
- Tarmoq xatolari va bo‘sh ma’lumotlarsiz faqat «baxtli yo‘l»ni test qilish.
- Ilovani faqat dasturchining telefonida tekshirish.
- E2Eni CI’da emas, qo‘lda ishga tushirish: ular tezda unutiladi.

## FAQ

### Testlar umuman bo‘lmasa, qaysilaridan boshlash kerak?

Eng xavfli mantiq uchun unit testlardan: narx hisob-kitoblari, avtorizatsiya, ma’lumotlar bilan ishlash. Keyin asosiy ssenariy uchun bir-ikkita E2E qo‘shing, masalan kirish va buyurtma berish.

### Qo‘lda test qilmasdan ishlash mumkinmi?

To‘liq — kamdan-kam. Avtotestlar regressiyalarni yaxshi ushlaydi, lekin vizual muammolar, noqulaylik va aniq qurilmalardagi kutilmagan xatti-harakatni inson yaxshiroq sezadi.

### React Native uchun Maestro yoki Detox?

Detox React Native bilan chuqurroq integratsiyalangan va ilova ishini tugatishini kuta oladi. Maestro o‘rganish uchun osonroq va har qanday ilovaga mos. Tanlov testlarni kim yozishiga va bir nechta platforma uchun yagona vosita qanchalik muhimligiga bog‘liq.
