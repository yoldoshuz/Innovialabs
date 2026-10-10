---
title: 3D Secure nima va u buyurtma rasmiylashtirishga qanday ta’sir qiladi
description: 3D Secure va 3DS2 karta egasini qanday tasdiqlashi, firibgarlik javobgarligini bankka o‘tkazishi va halol xaridorlar tekshiruvdan qanday sezdirmay o‘tishi.
summary: 3D Secure — kartani chiqargan bankning to‘lovni haqiqiy karta egasi qilayotganini tasdiqlovchi qo‘shimcha tekshiruvi; u firibgarlik javobgarligini do‘kondan bankka o‘tkazadi, 3DS2 da esa ko‘pchilik xaridorlar uni ortiqcha qadamsiz o‘tadi.
---
## Qisqa javob

**3D Secure (3DS)** — kartani chiqargan bank onlayn to‘lovni kartaning haqiqiy egasi amalga oshirayotganini tasdiqlashi uchun protokol. Karta tizimlari uni turlicha ataydi — Visa Secure, Mastercard Identity Check va boshqalar, — lekin mohiyat bitta: to‘lovni ma’qullashdan oldin emitent bank xaridorni tekshirishi mumkin.

Do‘kon uchun bu ikki narsa beradi:

- **Kamroq firibgarlik.** O‘g‘irlangan karta rekvizitlarining o‘zi to‘lov uchun yetarli emas.
- **Javobgarlikning o‘tishi (liability shift).** Agar to‘lov 3DS autentifikatsiyasidan o‘tgan bo‘lsa-yu, keyin firibgarlik bo‘lib chiqsa, chargeback xarajatlarini odatda do‘kon emas, emitent bank ko‘taradi.

Buning narxi — to‘lov paytida qo‘shimcha qadam bo‘lishi mumkinligi. U konversiyani pasaytiradimi yoki yo‘qmi, asosan 3DS versiyasiga va qanchalik to‘g‘ri joriy qilinganiga bog‘liq.

## Tekshiruvda kimlar ishtirok etadi

Protokol nomi uchta «domen»dan kelib chiqqan:

- **Ekvayer domeni** — do‘kon, uning to‘lov provayderi va autentifikatsiyani boshlovchi **3DS Server**. Odatda uni to‘lov shlyuzi taqdim etadi, o‘zingiz yozishingiz shart emas.
- **O‘zaro ishlash domeni** — so‘rovni kerakli bankka yo‘naltiruvchi karta tizimining **Directory Server**i.
- **Emitent domeni** — xaridorga ishonish yoki ishonmaslikni hal qiluvchi bankning **ACS (Access Control Server)**i.

## 3DS1 va 3DS2: farqi nimada

Birinchi versiya xaridorni deyarli har doim parol yoki SMS-kod kiritish uchun bank sahifasiga yo‘naltirardi. Bu sahifalar telefonda ko‘pincha noqulay edi va odamlar to‘lovni tashlab ketardi.

**3DS2 (EMV 3-D Secure)** mantiqni o‘zgartirdi:

- Do‘kon bankka **ancha ko‘proq kontekst** yuboradi: qurilma ma’lumotlari, to‘lovchi va yetkazib berish manzili, email, telefon, xaridlar tarixi.
- Bank shu ma’lumotlar asosida **xavfni baholaydi**.
- Xavf past bo‘lsa, to‘lov **frictionless** ssenariy bo‘yicha o‘tadi — xaridor hech qanday qo‘shimcha qadam ko‘rmaydi.
- Xavf yuqoriroq bo‘lsa, bank **challenge** ishga tushiradi: bir martalik kod, bank ilovasida tasdiqlash yoki biometriya.
- **Mobil SDK**lar bor: tekshiruv noqulay veb-yo‘naltirish orqali emas, ilovaning ichida ko‘rsatiladi.

| | 3DS1 | 3DS2 |
|---|---|---|
| Qo‘shimcha qadam | Deyarli har doim | Faqat xavf yuqori bo‘lganda |
| Bankka ma’lumot | Minimal | Buyurtma va qurilma haqida batafsil |
| Mobil ilovalar | Veb-yo‘naltirish | Nativ SDK |
| Tasdiqlash usullari | Parol, SMS | Kod, bank ilovasi, biometriya |

## To‘lovlar qayerda yo‘qoladi

Konversiyani tekshiruvning o‘zi emas, joriy qilish tafsilotlari pasaytiradi:

- SMS-kod kechikadi yoki umuman kelmaydi, sessiya muddati tugaydi.
- Tekshiruv oynasi buzilgan iframe’da yoki xaridor sezmaydigan yangi tabda ochiladi.
- Do‘kon minimal ma’lumot yuboradi va bank deyarli hammani challenge’ga jo‘natadi.
- Muvaffaqiyatsiz tekshiruvdan keyin keyingi qadam haqida hech qanday maslahatsiz noaniq «to‘lov xatosi» ko‘rsatiladi.

## Ortiqcha qadamlarni qanday kamaytirish mumkin

1. **3DS2 ni qo‘llab-quvvatlaydigan shlyuzni ulang** va uni eski versiya bilan moslik rejimida emas, to‘liq yoqing.
2. **Barcha mavjud ma’lumotlarni yuboring**: email, telefon, to‘lovchi va yetkazib berish manzili. Kontekst qancha ko‘p bo‘lsa, shuncha ko‘p to‘lov challenge’siz o‘tadi.
3. Nativ ilovalarda WebView o‘rniga **mobil SDK’dan foydalaning**.
4. **Qadam haqida ogohlantiring**: «Bankingiz to‘lovni tasdiqlashni so‘rashi mumkin» degan qisqa jumla kutilmaganlikni yo‘qotadi.
5. **Rad etishlarni tushunarli ko‘rsating**: imkon bo‘lsa sababini ayting, qayta urinish yoki boshqa kartani tanlashni taklif qiling.
6. **Metrikalarni alohida hisoblang**: frictionless to‘lovlar ulushi, challenge muvaffaqiyati, tekshiruv bosqichida chiqib ketishlar, emitent banklar kesimidagi natijalar.
7. Ishga tushirishdan oldin **barcha ssenariylarni provayderning test kartalarida tekshiring**.

Ba’zi mintaqalarda regulyator mijozni qat’iy autentifikatsiya qilishni talab qiladi va **istisnolarni** belgilaydi — masalan, kichik summalar yoki do‘kon tashabbusi bilan muntazam yechib olinadigan to‘lovlar uchun. Ularni so‘rash mumkinmi, bu mintaqa va to‘lov provayderiga bog‘liq.

## Mahalliy kartalar va 3DS

3DS — xalqaro karta tizimlarining mexanizmi. O‘zbekistonda **Uzcard** va **Humo** kartalari bilan Payme, Click va shunga o‘xshash servislar orqali to‘lovlar, qoida tariqasida, o‘zining bir martalik SMS-kodi bilan tasdiqlanadi. Agar siz Visa va Mastercard’ni ham qabul qilsangiz — masalan, Stripe yoki xalqaro ekvayer orqali, — bu to‘lovlarga 3DS qo‘llaniladi.

## FAQ

### Konversiyani oshirish uchun 3D Secure’ni o‘chirib qo‘ysa bo‘ladimi?

Ba’zan texnik jihatdan mumkin, lekin unda firibgarlik bo‘yicha chargeback’lar sizning zimmangizda qoladi, ko‘p banklar esa autentifikatsiyasiz to‘lovlarni baribir rad etadi. Ko‘pchilik xaridorlar challenge’siz o‘tishi uchun 3DS2 ni to‘liq ma’lumotlar bilan to‘g‘ri joriy qilish oqilonaroq.

### Javobgarlikning o‘tishi har qanday chargeback’dan himoya qiladimi?

Yo‘q. U faqat firibgarlik haqidagi nizolarga taalluqli — «bu to‘lovni men qilmaganman». Yetkazib berilmaganlik, tovar sifati yoki pulni qaytarish bo‘yicha nizolarni 3DS qoplamaydi.

### O‘z 3DS Server’ingizni ishlab chiqish kerakmi?

Deyarli hech qachon. To‘lov shlyuzlari 3DS ni xizmatning bir qismi sifatida taqdim etadi. Sizning vazifangiz — uni to‘g‘ri integratsiya qilish, ma’lumotlarni yuborish va interfeysda barcha natijalarni to‘g‘ri ko‘rsatish.
