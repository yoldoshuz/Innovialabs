---
title: PCI DSS: kartadan to‘lov qabul qiluvchi biznes nimani bilishi kerak
description: Biznes uchun PCI DSS: muvofiqlik darajalari, SAQ turlari, to‘lov sahifasi va tokenizatsiya talablarni qanday qisqartiradi, qaysi xatolardan qochish kerak.
summary: PCI DSS — karta ma’lumotlari bilan ishlovchi har bir biznes uchun xalqaro to‘lov tizimlarining xavfsizlik standarti; unga eng oson muvofiq bo‘lish yo‘li — provayderning to‘lov sahifasi yoki tokenizatsiya orqali karta raqamlarini umuman o‘z serverlaringizga kiritmaslik.
---
## Qisqa javob

**PCI DSS** (Payment Card Industry Data Security Standard) — Visa, Mastercard va boshqa xalqaro to‘lov tizimlarining xavfsizlik talablari to‘plami. U karta ma’lumotlarini saqlaydigan, qayta ishlaydigan yoki uzatadigan har qanday biznesga, hajmidan qat’i nazar, tegishli.

Ish hajmi bitta narsaga bog‘liq: **karta ma’lumotlari tizimlaringizga qanchalik yaqin keladi**. Agar xaridor kartani to‘lov provayderi sahifasida kiritsa va siz faqat token yoki to‘lov holatini olsangiz, majburiyatlar qisqa so‘rovnomaga tushadi. Agar karta raqamlari serverlaringiz orqali o‘tsa, sizga yuzlab talablar, auditlar va skanerlashlar yuklanadi.

## Muvofiqlik darajalari

To‘lov tizimlari merchantlarni yillik tranzaksiyalar soniga qarab darajalarga ajratadi. Chegaralar har bir tizimda o‘zgacha, darajangizni esa ekvayer bank yoki to‘lov provayderi belgilaydi. Misol uchun Visa tasnifi:

| Daraja | Yiliga tranzaksiyalar | Qanday tasdiqlanadi |
|---|---|---|
| 1 | 6 milliondan ortiq | QSA tomonidan joyida audit, Report on Compliance |
| 2 | 1 milliondan 6 milliongacha | O‘z-o‘zini baholash so‘rovnomasi (SAQ) |
| 3 | E-commerce’da 20 mingdan 1 milliongacha | SAQ |
| 4 | E-commerce’da 20 mingdan kam | SAQ |

Kichik va o‘rta biznes deyarli har doim 3- yoki 4-darajaga tushadi. Ular uchun muvofiqlik — har yili kerakli turdagi **SAQ**, imzolangan **Attestation of Compliance (AOC)** va ayrim SAQ turlari uchun sertifikatlangan vendor (ASV) tomonidan har chorakda tashqi zaifliklarni skanerlash.

## SAQ turlari: sizniki qaysi

SAQ turi biznes hajmiga emas, to‘lovni qabul qilish usuliga bog‘liq.

- **SAQ A** — to‘lov sahifasi to‘liq PCI sertifikatiga ega provayderda joylashgan internet-do‘kon (redirect yoki iframe). Eng qisqa so‘rovnoma.
- **SAQ A-EP** — saytingiz karta ma’lumotlarini olmaydi, lekin to‘lov sahifasini boshqaradi: masalan, sizning JavaScript formani chizadi va ma’lumotni to‘g‘ridan-to‘g‘ri provayderga yuboradi. Talablar sezilarli darajada ko‘proq.
- **SAQ B / B-IP** — avtonom terminallarga ega oflayn savdo nuqtalari.
- **SAQ C-VT** — xodimlar kartani provayderning virtual terminaliga qo‘lda kiritadi.
- **SAQ P2PE** — sertifikatlangan point-to-point encryption yechimidagi terminallar.
- **SAQ D** — qolgan hamma holatlar, jumladan karta ma’lumotlari serverlaringizga yetib boradigan har qanday sxema. Amalda — to‘liq standart.

SAQ A — bir necha o‘nlab savol, SAQ D esa tarmoq, serverlar, loglar va ishlab chiqish jarayoni bo‘yicha yuzlab nazorat choralari.

## Nega to‘lov sahifasi va tokenizatsiya scope’ni qisqartiradi

**Scope** — karta ma’lumotlarini saqlaydigan, qayta ishlaydigan yoki uzatadigan barcha tizimlar va ularga ulangan hamma narsa. Scope’dagi tizimlar qancha kam bo‘lsa, himoya qilish va isbotlash shuncha oson.

- **Provayderning to‘lov sahifasi.** Stripe Checkout, Payme yoki Click to‘lov sahifalari: xaridor kartani provayder sahifasida yoki uning iframe’ida kiritadi, siz esa to‘lov holatini olasiz. Serverlaringiz karta raqamini ko‘rmaydi.
- **Tokenizatsiya.** Provayderning frontend komponenti (Stripe Elements, kartani bog‘lash formasi) kartani to‘g‘ridan-to‘g‘ri provayderga yuboradi va **token** qaytaradi. Backend faqat tokenni saqlaydi va u orqali pul yechadi; shu provayderdagi akkauntingizdan tashqarida token foydasiz.
- **Takroriy to‘lovlar** ham xuddi shunday: siz kartani emas, tokenni saqlaysiz.

Rasman PCI DSS xalqaro to‘lov tizimlarining standarti. Uzcard va Humo kabi milliy kartalar uchun qoidalarni protsessing markazlari va provayder bilan shartnoma belgilaydi, lekin tamoyil bir xil: karta ma’lumotlarini o‘z tizimlaringizga kiritmang.

## Karta ma’lumotlarini serverlaringizga tortib kiradigan xatolar

- **Kartani backend’ingizga yuboradigan o‘z to‘lov formangiz**, backend esa uni provayder API’siga uzatadi. Hech narsa saqlanmasa ham, ma’lumot siz orqali o‘tdi — bu SAQ D.
- **So‘rov tanasini loglash.** Debug loglar, API shlyuzlar va xatolik trekerlari karta raqamlarini sezdirmasdan yozib oladi. To‘lov marshrutlarida maydonlarni maskalang yoki tanani loglashni o‘chiring.
- **CVV/CVC’ni saqlash.** Xavfsizlik kodini avtorizatsiyadan keyin hech qanday ko‘rinishda, hatto shifrlangan holda ham saqlab bo‘lmaydi.
- **To‘lov sahifasidagi uchinchi tomon skriptlari.** Analitika, chat-vidjetlar va sessiyalarni yozib oluvchi vositalar forma maydonlarini o‘qishi mumkin. To‘lov sahifasini minimal saqlang va undagi har bir skriptni nazorat qiling.
- **Qo‘llab-quvvatlash kanallari orqali kartalar.** Mijozlar karta suratini Telegram’ga yuboradi, menejerlar telefonda aytilgan raqamni yozib oladi va ma’lumot yozishmalar hamda CRM’da qolib ketadi.
- **«Qulaylik uchun» to‘liq karta raqamlari** — qaytarish yoki takroriy buyurtma uchun token va provayderning qaytarish API’si o‘rniga.
- **To‘lovdan oldingi sahifani unutish.** SAQ A bo‘lsa ham: saytingiz buzilsa, hujumchi redirect yoki iframe’ni soxta formaga almashtirishi mumkin.

## Chek-list

1. Darajangiz va SAQ turini ekvayer yoki provayderdan aniqlang.
2. SAQ A’ga tushish uchun to‘lov sahifasi, iframe yoki tokenizatsiyadan foydalaning.
3. Loglar, bazalar, bekaplar va CRM’dan karta raqamlarini qidirib, o‘chiring.
4. Saytning o‘zini himoya qiling: HTTPS, yangilanishlar, administratorlar uchun 2FA, to‘lov sahifasida minimal skriptlar.
5. Provayderdan uning o‘z AOC hujjatini so‘rang.
6. SAQ’ni har yili va to‘lov jarayoni o‘zgarganda takrorlang.

Standart va SAQ shakllari rasmiy [PCI SSC hujjatlar kutubxonasida](https://www.pcisecuritystandards.org/document_library/).

## FAQ

### Kichik internet-do‘konga PCI DSS kerakmi?

Ha, standart aylanmadan qat’i nazar kartalarni qabul qiladigan hammaga tegishli. Provayderning to‘lov sahifasi bilan muvofiqlik odatda SAQ A — qisqa yillik so‘rovnomaga tushadi.

### Karta raqamlari shifrlangan bo‘lsa, ularni saqlash mumkinmi?

Standart karta raqamini o‘qib bo‘lmaydigan ko‘rinishda saqlashga ruxsat beradi, lekin unda shifrlash, kalitlarni boshqarish va butun atrofdagi infratuzilma scope’ga kiradi. CVV’ni hech qachon saqlab bo‘lmaydi. Provayder tokenlari xuddi shu vazifani bunday ortiqcha yuksiz hal qiladi.

### PCI DSS’ga e’tibor bermasak nima bo‘ladi?

Oqibatlarni to‘lov tizimlari va ekvayer shartnoma orqali belgilaydi: jarimalar, yuqoriroq komissiyalar yoki kartalarni qabul qilishning to‘xtatilishi. Karta ma’lumotlari sizib chiqqandan keyin tergov xarajatlari va firibgarlik zararlari ham sizning zimmangizga tushishi mumkin.
