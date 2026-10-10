---
title: Marketpleyslarda split-to‘lov: sotuvchilarga pul qanday to‘lanadi
description: Xaridorning bitta to‘lovi sotuvchilar va platforma o‘rtasida qanday bo‘linadi, mablag‘ nega ushlab turiladi, qaytarishlar va yuridik sxema qanday bo‘ladi.
summary: Split-to‘lov — shlyuz bitta to‘lovni qabul qilib, uni qoidalar bo‘yicha sotuvchilar va platforma komissiyasi o‘rtasida taqsimlashi va buyurtma bajarilguncha mablag‘ni ushlab turishi; buning uchun marketpleysni qo‘llab-quvvatlaydigan shlyuz va platforma begona pulni huquqsiz saqlamaydigan shartnoma sxemasi kerak.
---

## Qisqacha: split-to‘lov nima

Xaridor uchta turli sotuvchining mahsulotlari bor bitta savatchani to‘laydi. U **bitta to‘lovni** ko‘radi, ichkarida esa pul taqsimlanadi:

- har bir sotuvchiga — komissiyalar ayirilgan o‘z ulushi;
- platformaga — uning **komissiyasi** (foiz, qat’iy summa yoki ikkalasi);
- shlyuzga — ekvayring komissiyasi.

Asosiy nuqta: sotuvchilarning puli platformaning hisob raqamidan uning daromadi sifatida «o‘tmasligi» kerak. Aks holda platforma rasman begona pulni oladi, bu esa soliq, buxgalteriya va ko‘plab mamlakatlarda to‘lov faoliyatini litsenziyalash bo‘yicha savollar tug‘diradi. Split buni shlyuz darajasida hal qiladi: mablag‘ oluvchilarning hisoblariga taqsimlanadi, platforma esa faqat o‘z ulushini oladi.

## Pul oqimi qanday tuzilgan

Marketpleysdagi buyurtmaning odatiy hayot sikli:

1. **Sotuvchini ulash (onboarding).** Sotuvchi shlyuzda oluvchi sifatida ro‘yxatdan o‘tadi (sub-merchant, connected account): rekvizitlar, hujjatlar, KYC tekshiruvi.
2. **To‘lov.** Xaridor bitta summani to‘laydi. Shlyuz qaysi qism kimga tegishli ekanini qayd etadi.
3. **Xold.** Pul sotuvchiga darhol o‘tmaydi, balki biror hodisagacha ushlab turiladi: jo‘natish, yetkazib berish yoki qaytarish muddati tugashi.
4. **To‘lab berish (payout).** Hodisadan keyin shlyuz sotuvchi ulushini o‘tkazadi — har bir buyurtma bo‘yicha yoki jadval asosida paketlab.
5. **Tuzatishlar.** Qaytarishlar, nizolar va jarimalar sotuvchi balansidan yoki kelgusi to‘lovlardan ushlanadi.

Xold **soddalashtirilgan eskrou** vazifasini bajaradi: xaridor insofsiz sotuvchidan himoyalanadi, platforma esa nizolarni hal qilishga vaqt oladi. Haqiqiy eskrou (mustaqil agent va yuridik kafolatlar bilan) — alohida xizmat, ko‘pchilik marketpleyslarga u kerak emas.

## Taqsimlash modellari

| Model | Qanday ishlaydi | Qachon mos |
|---|---|---|
| To‘lov paytida split | Ulushlar karta yechilganda hisoblanib, belgilanadi | Oddiy buyurtmalar, bir buyurtmada bitta sotuvchi |
| Alohida to‘lov va o‘tkazmalar | Avval platformaga yechiladi, so‘ng sotuvchilarga o‘tkaziladi | Bir nechta sotuvchili savatchalar, moslashuvchan mantiq |
| Sotuvchi balansi + davriy to‘lovlar | Tushumlar ichki balansda yig‘iladi, har N kunda to‘lanadi | Ko‘p mayda buyurtmalar, ushlab qolishlar va jarimalar |

Masalan, Stripe Connect’da «destination charges» ham, «separate charges and transfers» ham bor — bu aynan birinchi ikki model ([Stripe Connect hujjatlari](https://docs.stripe.com/connect)). Boshqa xalqaro provayderlarda (Adyen, PayPal, Mangopay) ham platformalar uchun shunga o‘xshash mahsulotlar mavjud. Mahalliy provayderlarda, jumladan Payme va Click’da, bir nechta oluvchiga to‘lov imkoniyatini to‘g‘ridan-to‘g‘ri aniqlash kerak: shartlar, mavjudlik va shartnoma provayderga hamda sizning ish sxemangizga bog‘liq.

## To‘lov bo‘lingan holda qaytarishlar

Qaytarishlar — eng murakkab qism. Quyidagi savollarga oldindan javob bering:

- **Qisman qaytarish.** Xaridor uchta sotuvchidan birining mahsulotini qaytardi. Qaytarish aynan shu sotuvchi ulushidan yechilishi kerak.
- **Platforma komissiyasi.** Qaytarishda u ham qaytariladimi? Bu biznes qoidasi, uni sotuvchilar uchun ofertada yozib qo‘ying.
- **To‘lab berilgandan keyin qaytarish.** Agar sotuvchi pulni allaqachon olgan bo‘lsa, summani kelgusi to‘lovlardan ushlash yoki unga qarz yozish kerak. **Manfiy balans** mexanizmisiz qaytarishni platforma o‘z pulidan qoplaydi.
- **Ekvayring komissiyasi.** Ko‘p shlyuzlar qaytarishda o‘z komissiyasini qaytarmaydi. Uni kim ko‘tarishini hal qiling.
- **Chargeback’lar.** Xaridor banki ochgan nizo ancha vaqtdan keyin kelishi mumkin. Sotuvchi balansidagi rezerv xavfni kamaytiradi.

Amaliy qoida: bazangizda **leger** yuriting — har bir oluvchi bo‘yicha barcha harakatlar jurnali (hisoblash, komissiya, xold, to‘lov, qaytarish, ushlab qolish). Sotuvchi balansi qayta yoziladigan bitta raqam sifatida saqlanmasligi, balki jurnaldan hisoblanishi kerak.

## Yuridik sxema

Split’ni texnik sozlash bir necha hafta oladi, yuridik tomoni esa uzoqroq cho‘zilishi mumkin. Asosiy variantlar:

- **Platforma — sotuvchilar agenti.** Platforma agentlik shartnomasi bo‘yicha sotuvchilar nomidan to‘lovlarni qabul qiladi va agentlik mukofotini oladi. MDHda keng tarqalgan, lekin hujjat aylanishi va fiskalizatsiyaga ehtiyotkorlik talab qiladi.
- **Pul to‘g‘ridan-to‘g‘ri shlyuz orqali o‘tadi.** Sotuvchi shlyuz bilan (platforma orqali) shartnoma tuzadi, platforma faqat komissiyani oladi. Platformaga regulyator yuki kamroq.
- **Platforma qayta sotuvchi sifatida.** Platforma sotuvchidan sotib olib, xaridorga sotadi. Bu endi split emas, to‘liq soliq yuki bilan oddiy savdo.

Yurist va buxgalter bilan tekshiring: xaridorga chekni kim beradi, qaysi summadan kim soliq to‘laydi, yurisdiksiyangizda uchinchi shaxslar foydasiga mablag‘ qabul qilish uchun litsenziya kerakmi, sotuvchilar bilan dalolatnomalar qanday rasmiylashtiriladi.

## Ko‘p uchraydigan xatolar

- Sotuvchilar pulini shartnomaviy asossiz «vaqtincha» platforma hisobida saqlash.
- To‘lovlarni jadvaldan qo‘lda qilish — xatolar va nizolar ko‘payadi.
- To‘lab berilgandan keyingi qaytarish va manfiy balansni o‘ylab ko‘rmaslik.
- Sotuvchilarni tekshirmaslik (KYC) — shlyuz butun platformani bloklashi mumkin.
- Komissiyalarni kodning turli joylarida yaxlitlash: summalar tiyinlarga farq qiladi va solishtirish imkonsiz bo‘ladi. Summalarni valyutaning eng kichik birligida (tiyin, sent) butun son sifatida saqlang.

## FAQ

### Shlyuz qo‘llab-quvvatlamasa, split qilish mumkinmi?

Texnik jihatdan pulni platforma hisobiga qabul qilib, sotuvchilarga qo‘lda yoki bank API orqali o‘tkazish mumkin. Lekin bunda platforma begona mablag‘ni saqlaydi va buni agentlik shartnomasi hamda buxgalteriya bilan mustahkamlash kerak. O‘sib borayotgan marketpleys uchun to‘lab berish funksiyasi bor shlyuz ishonchliroq.

### Pulni xoldda qancha ushlab turish kerak?

Bu qaytarish siyosatingiz va yetkazib berish muddatlariga bog‘liq. Odatda to‘lov hodisaga bog‘lanadi: xaridor qabul qilganini tasdiqlashi yoki qaytarish muddati tugashi. Juda uzoq xold sotuvchilarni qochiradi, juda qisqasi esa platformani himoyasiz qoldiradi.

### Sotuvchi manfiy balans bilan ketib qolsa-chi?

Buni shartnomada nazarda tuting: kelgusi to‘lovlardan ushlab qolish huquqi, rezerv yoki kafolat depoziti, qarzni undirish. Texnik jihatdan rezerv yordam beradi — har bir to‘lovning keyinroq bo‘shatiladigan bir qismi.
