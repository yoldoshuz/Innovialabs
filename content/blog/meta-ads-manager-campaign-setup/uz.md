---
title: Meta Ads Manager orqali Instagram va Facebook’da reklama berish
description: Meta Ads Manager orqali Instagram va Facebook reklamasi: biznes-portfolio, maqsadlar, e’lonlar guruhlari, joylashuvlar, byudjet, kreativlar va piksel.
summary: Avval reklama akkaunti, sahifa, Instagram va piksel bilan biznes-portfolio yarating, so‘ng Ads Manager’da kampaniya maqsadini tanlang, e’lonlar guruhida auditoriya, joylashuvlar va byudjetni sozlang, kerakli formatlardagi kreativlarni yuklang va ularni Meta reklama qoidalariga muvofiqligini tekshiring.
---
## Qisqacha

Meta’da reklama ikki bosqichda ishga tushiriladi: **infratuzilmani tayyorlash** va Ads Manager’da **kampaniyani yig‘ish**.

1. Biznes-portfolio: Facebook sahifasi, Instagram akkaunti, reklama akkaunti, to‘lov usuli.
2. Saytdagi piksel va hodisalar — agar maqsad sayt bilan bog‘liq bo‘lsa.
3. Kampaniya: maqsad.
4. E’lonlar guruhi: konversiya joyi, auditoriya, joylashuvlar, byudjet va jadval.
5. E’lon: kreativ, matnlar, havola, tugma.
6. Moderatsiya va o‘rganish davri.

Instagram’dagi post ostidagi «Reklama qilish» (Boost) tugmasi reklamani tezroq ishga tushiradi, lekin sozlamalari ancha kam. Arizalar va sotuvlar uchun Ads Manager’dan foydalaning.

## Biznes-portfolio

**Biznes-portfolio** (avvalgi Business Manager) — Meta Business Suite’da kompaniya aktivlarini boshqarish markazi.

- **Facebook sahifasini** qo‘shing va **Instagram professional akkauntini** ulang.
- **Reklama akkauntini** yarating. Valyuta va vaqt mintaqasini keyin o‘zgartirish qiyin, diqqat bilan tanlang.
- **To‘lov usulini** qo‘shing.
- Xodimlar va pudratchilarga umumiy login orqali emas, rollar orqali kirish bering. **Ikki bosqichli autentifikatsiyani** yoqing — u buzib kirish va bloklanishlardan himoya qiladi.

## Piksel va hodisalar

Reklama saytga olib borsa, u yerdagi harakatlar haqida ma’lumotsiz Meta ko‘rsatishlarni optimallashtira olmaydi.

- Events Manager’da **piksel** (ma’lumotlar to‘plami) yarating va uni saytga o‘rnating.
- **Standart hodisalarni** sozlang: `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`, `Lead`, `CompleteRegistration`, `Contact`.
- **Conversions API**’ni ulang — hodisalarni serverdan yuborish. Brauzer skriptlarni bloklaganda u pikselni to‘ldiradi.
- Biznes-portfolio sozlamalarida **domenni tasdiqlang**.

Forma muvaffaqiyatli yuborilgandan keyingi ariza hodisasi misoli:

```javascript
fbq('track', 'Lead', { content_name: 'contact_form' });
```

## Kampaniya maqsadi

| Maqsad | Qachon tanlash kerak |
|---|---|
| Taniqlilik | Maksimal qamrov va eslab qolish kerak |
| Trafik | Saytga yoki profilga o‘tishlar kerak |
| Jalb qilish | Xabarlar, video ko‘rishlar, reaksiyalar |
| Lidlar | Tezkor formalar, sayt yoki messenjerlar orqali arizalar |
| Ilovani targ‘ib qilish | O‘rnatishlar va ilova ichidagi harakatlar |
| Sotuvlar | Saytdagi xaridlar va boshqa qimmatli harakatlar |

Maqsadni biznesga haqiqatan kerak bo‘lgan harakatga qarab tanlang. Tizim aynan siz so‘ragan narsani optimallashtiradi: «Trafik» maqsadi xarid qiluvchilarni emas, klik qiluvchilarni olib keladi.

## E’lonlar guruhi

- **Konversiya joyi:** sayt, messenjerlar, tezkor forma, qo‘ng‘iroqlar.
- **Auditoriya.** Geo, yosh va qiziqishlarni qo‘lda belgilash yoki Advantage+ auditoriyasini yoqish mumkin, unda sozlamalaringiz ishora bo‘lib qoladi. Retargeting uchun maxsus auditoriyalardan foydalaning: sayt tashrifchilari, profil bilan muloqot qilganlar, mijozlar ro‘yxatlari.
- **Joylashuvlar.** Advantage+ joylashuvlari ko‘rsatishlarni Facebook, Instagram, Messenger va Audience Network bo‘ylab taqsimlaydi. Kreativlar hamma formatga tayyor bo‘lmasa, qo‘lda tanlash o‘rinli.
- **Byudjet.** Kampaniya darajasidagi byudjet tizimga pulni guruhlar o‘rtasida qayta taqsimlash imkonini beradi; guruh darajasidagi byudjet ko‘proq qo‘lda nazorat beradi. Kunlik byudjet doimiy reklama uchun, butun muddatga byudjet esa tugash sanasi bor aksiyalar uchun qulay.

## Kreativlar

- Joylashuvlar uchun formatlarni tayyorlang: lentalar uchun **1:1 yoki 4:5**, Stories va Reels uchun **9:16**.
- Muhim elementlarni vertikal kadr markaziga yaqin joylashtiring: chetlarini interfeys yopadi.
- Videoning birinchi soniyalari nima haqida ekanini tushuntirishi va ovozsiz ham ishlashi kerak.
- Natijalarni analitikada ko‘rish uchun havolaga **UTM-belgilar** qo‘shing.
- Bitta guruhda bir nechta kreativ variantini ishga tushiring — tizim eng yaxshilarini o‘zi topadi.

## Moderatsiya: rad etishning ko‘p uchraydigan sabablari

- **Shaxsiy xususiyatlarga murojaat:** «Ortiqcha vazndan aziyat chekasizmi?» Fikrni inson haqidagi taxminlar orqali emas, mahsulot orqali ifodalang.
- Salomatlik va tashqi ko‘rinish mavzusidagi **«oldin va keyin» suratlari** hamda real bo‘lmagan va’dalar.
- **Maxsus kategoriyalar:** kreditlar va moliyaviy xizmatlar, vakansiyalar, uy-joy, ijtimoiy va siyosiy mavzular uchun kategoriyani belgilash majburiy.
- **Cheklangan tovarlar:** alkogol, BFQ (biologik faol qo‘shimchalar), qimor o‘yinlari va shunga o‘xshashlar alohida qoidalar va ruxsatnomalarni talab qiladi.
- **Qo‘nish sahifasining mos kelmasligi:** buzuq havola, boshqa taklif, ishlamaydigan sayt.
- **Begona savdo belgilari**, o‘zgartirilgan Instagram va Facebook logotiplari.

## O‘rganish davri

Ishga tushirilgandan keyin e’lonlar guruhi **o‘rganish bosqichidan** o‘tadi. Meta qo‘llanmasiga ko‘ra, undan chiqish uchun bir hafta ichida taxminan 50 ta optimallashtirish hodisasi kerak. Muhim tahrirlar — byudjet, auditoriya, kreativ — o‘rganishni qayta boshlaydi, shuning uchun sozlamalarni to‘plab o‘zgartiring.

## FAQ

### E’lon nega rad etildi va nima qilish kerak?

Sabab Ads Manager’da va akkaunt sifati bo‘limida ko‘rsatiladi. E’lonni tuzating yoki qaror noto‘g‘ri deb hisoblasangiz, qayta tekshiruv so‘rovini yuboring. Tez-tez rad etilish akkauntni cheklashi mumkin, shuning uchun matnlarni oldindan tekshiring.

### Qanday byudjetdan boshlash kerak?

Universal summa yo‘q. Byudjet guruh optimallashtirish hodisalarini yig‘ishiga yetishi kerak. Hodisalar kam bo‘lsa, tez-tez sodir bo‘ladigan hodisani tanlang yoki guruhlarni birlashtiring.

### Instagram’da reklama uchun sayt kerakmi?

Yo‘q. Odamlarni profilga, Direct’ga, WhatsApp’ga yoki tezkor formaga yo‘naltirish mumkin. Saytdagi xaridlar va boshqa harakatlarga optimallashtirmoqchi bo‘lsangiz, pikselli sayt kerak bo‘ladi.
