---
title: 1C nima va uni internet-do‘kon bilan nega integratsiya qilish kerak
description: 1C mahsulotlari hisob va savdoda nima qiladi, ularda qanday ma’lumotlar saqlanadi va 1C do‘kon bilan sinxronlangach qaysi qo‘l mehnati va xatolar yo‘qoladi.
summary: 1C — tovarlar, narxlar, qoldiqlar, kontragentlar va savdo hujjatlari saqlanadigan hisob tizimi; uni do‘kon bilan integratsiya qilish ma’lumotlarni qo‘lda ko‘chirishdan va omborda yo‘q tovarni sotish kabi xatolardan xalos qiladi.
---
## Qisqa javob

**1C** — **1C:Предприятие** platformasidagi hisob dasturlari oilasi. Platforma — bu dvigatel, uning ustida esa turli vazifalar uchun **konfiguratsiyalar** ishlaydi:

- **Buxgalteriya** — buxgalteriya va soliq hisobi, hisobotlar;
- **Savdoni boshqarish** — xaridlar, sotuvlar, omborlar, narxlar, o‘zaro hisob-kitoblar;
- **Chakana savdo** — do‘konlar, kassalar, chakana sotuvlar;
- **ERP va kompleks avtomatlashtirish** — savdo, ishlab chiqarish, moliya va xodimlar bitta bazada.

Ko‘plab konfiguratsiyalar muayyan davlat qonunchiligiga moslashtirilgan, shuning uchun har bir davlatda o‘z versiyalari ishlatiladi, jumladan O‘zbekistonda ham. Internet-do‘kon uchun 1C odatda tovarlar, narxlar va qoldiqlar bo‘yicha **haqiqat manbai** hisoblanadi.

## 1Cda qanday ma’lumotlar saqlanadi

| Ma’lumot | Do‘kon uchun ahamiyati |
|---|---|
| **Nomenklatura** | Tovarlar ro‘yxati, artikullar, xususiyatlar, o‘lchov birliklari |
| **Narxlar** | Chakana, ulgurji, aksiya narx turlari |
| **Qoldiqlar** | Har bir ombordagi miqdor, rezervlar |
| **Kontragentlar** | Xaridorlar va yetkazib beruvchilar, yuridik shaxs rekvizitlari |
| **Buyurtmalar va hujjatlar** | Mijoz buyurtmalari, sotuv hujjatlari, hisob-fakturalar, qaytarishlar |
| **To‘lovlar** | Pul tushumlari va ularning buyurtmalarga bog‘lanishi |

Do‘kon vitrina, savat va buyurtmani rasmiylashtirish uchun javob beradi. 1C esa aslida nima borligi, qancha turishi va nima sotilganini hisobga oladi.

## Integratsiyasiz nima bo‘ladi

Do‘kon va 1C alohida yashasa, ma’lumotlar qo‘lda ko‘chiriladi. Odatiy oqibatlar:

- **Yo‘q tovarni sotish.** Saytdagi qoldiqlar ertalab yangilangan, tushga borib tovar chakana do‘kon orqali sotilib ketgan.
- **Narxlardagi tafovutlar.** Narx 1Cda o‘zgargan, saytda esa eskisi qolgan.
- **Buyurtmalarni ikki marta kiritish.** Menejer saytdagi buyurtmani 1Cga qayta yozadi va artikul yoki miqdorda xato qiladi.
- **Jo‘natishning kechikishi.** Ombor buyurtma haqida faqat uni kimdir qo‘lda kiritgandan keyin biladi.
- **Noaniq hisobotlar.** Sayt sotuvlarini ajratish va tahlil qilish qiyin.

Tovar va buyurtmalar qancha ko‘p bo‘lsa, qo‘lda ko‘chirish shuncha qimmatga tushadi.

## Sinxronlash nima beradi

**1Cdan saytga:**

- katalog va tovar xususiyatlari;
- dolzarb narxlar va turli xaridor guruhlari uchun narx turlari;
- omborlar bo‘yicha qoldiqlar — sayt «mavjud» yoki «buyurtma asosida» deb ko‘rsatadi.

**Saytdan 1Cga:**

- tarkibi, narxi va xaridor ma’lumotlari bilan yangi buyurtmalar;
- to‘lov statuslari;
- yangi kontragentlar.

**Qaytib saytga:** buyurtma statuslari (yig‘ildi, jo‘natildi, yetkazildi), xaridor ularni shaxsiy kabinetda ko‘rishi yoki bildirishnoma olishi uchun.

## Almashinuv odatda qanday tashkil etiladi

- **CommerceML** — 1C va saytlar o‘rtasidagi XML almashinuv formati. Ko‘plab CMS va tipik konfiguratsiyalar uni tayyor holda qo‘llab-quvvatlaydi.
- **1Cdagi HTTP-servislar va OData** — 1C o‘zi REST orqali ma’lumot beradi va qabul qiladi, bu maxsus ishlab chiqilgan do‘konlar uchun qulay.
- **Oraliq servis** — 1Cdan ma’lumotlarni olib, kerakli ko‘rinishga keltiradigan va do‘kon, marketpleyslar hamda CRMga uzatadigan alohida ilova.

Almashinuv chastotasi vazifaga bog‘liq: katalogni kamroq yangilash mumkin, qoldiqlar va buyurtmalar esa imkon qadar tez-tez sinxronlanishi kerak.

## Tipik xatolar

- **Tovarning yagona identifikatori yo‘q.** Umumiy kalitsiz (artikul yoki GUID) yozuvlar takrorlana boshlaydi.
- **Kim asosiy ekani noaniq.** Har bir ma’lumot turi qayerda tahrirlanishini oldindan hal qiling: narxlar — faqat 1Cda, tavsiflar — faqat saytda va hokazo.
- **Nosozliklarni qayta ishlash yo‘q.** Almashinuv xatolarni log qilishi va muvaffaqiyatsiz urinishlarni takrorlashi kerak, aks holda buyurtmalar jimgina yo‘qoladi.
- **Hamma narsani sinxronlash.** Faqat do‘konga haqiqatan kerak bo‘lgan ma’lumotlarni uzating.

## FAQ

### Tovarlar kam bo‘lsa ham integratsiya kerakmi?

Katalog kichik va buyurtmalar kam bo‘lsa, bir muddat qo‘lda almashinuv bilan ishlash mumkin. Bir nechta savdo kanali paydo bo‘lishi yoki qoldiqlarda xatolar boshlanishi bilan integratsiya tejalgan vaqt va bekor qilinmagan buyurtmalar hisobiga o‘zini oqlaydi.

### 1Cni istalgan platformadagi do‘kon bilan integratsiya qilish mumkinmi?

Odatda ha. Mashhur CMS’lar uchun CommerceML bo‘yicha tayyor modullar bor, maxsus do‘konlar uchun esa almashinuv API orqali qilinadi. Murakkablik 1C konfiguratsiyangizdagi o‘zgartirishlarga bog‘liq.

### Bunday sxema marketpleyslar uchun ham mos keladimi?

Ha. 1C qoldiqlar va narxlar manbai bo‘lib qoladi, ma’lumotlar esa do‘kon va marketpleyslarga bir vaqtda uzatiladi — bu bitta tovarni ikki marta sotish xavfini kamaytiradi.
