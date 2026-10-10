---
title: Dasturiy ta’minotni qo‘llab-quvvatlash: modellar va narx
description: Abonent, soatbay va tiket bo‘yicha qo‘llab-quvvatlash: har bir model nimani qamraydi, narx nimaga bog‘liq va kerakli hajmni qanday tanlash mumkin.
summary: Biznes har kuni bog‘liq bo‘lgan mahsulotga abonent model, notekis o‘zgarishlarga soatbay to‘lov, kam uchraydigan mayda so‘rovlarga tiket bo‘yicha to‘lov mos. Hajm o‘zgarishlar chastotasi va to‘xtab qolish narxiga qarab tanlanadi.
---

## Qaysi qo‘llab-quvvatlash modelini tanlash kerak

Uchta asosiy model bor: **abonent (retainer)**, **soatbay** va **tiket bo‘yicha**. Qisqa javob:

- mahsulot har kuni daromad keltiradi va to‘xtab qolish qimmatga tushadi — SLA bilan **abonent** modelni oling;
- o‘zgarishlar to‘lqin-to‘lqin bo‘ladi, qolgan vaqtda tizim barqaror — **soatbay** to‘lov mos;
- so‘rovlar kam va bir xil — **tiket uchun to‘lov** yetarli.

Ko‘p kompaniyalar ularni birlashtiradi: monitoring va avariyalar uchun kichik abonement hamda katta yaxshilanishlar uchun soatbay to‘lov.

## Qo‘llab-quvvatlash va kuzatib borish farqi

Bu tushunchalar ko‘pincha aralashtiriladi, shartnoma esa aynan shu farqqa bog‘liq.

- **Qo‘llab-quvvatlash (support)** — muammolarga reaksiya: xatolar, nosozliklar, foydalanuvchi savollari, avariyadan keyin tiklash.
- **Kuzatib borish (maintenance)** — rejali ish: kutubxonalar va serverlarni yangilash, xavfsizlik patchlari, zaxira nusxalar, monitoring, kichik yaxshilanishlar.

Agar shartnomada faqat support bo‘lsa, tizim asta-sekin eskiradi: kutubxonalar yangilanmaydi, sertifikatlar muddati tugaydi, zaifliklar to‘planadi.

## Modellarni taqqoslash

| Model | Qanday to‘lanadi | Afzalliklari | Kamchiliklari |
|---|---|---|---|
| Abonent | Soatlar paketi yoki mas’uliyat doirasi uchun oylik qat’iy summa | Kafolatlangan reaksiya vaqti, jamoa tizimni biladi | Tinch oylarda ham to‘laysiz |
| Soatbay | Haqiqatda ishlangan soatlar uchun | Faqat bajarilgan ish uchun to‘laysiz | Tezlik kafolati yo‘q, pudratchi band bo‘lishi mumkin |
| Tiket bo‘yicha | So‘rov turi uchun qat’iy narx | Vazifa narxi oldindan ma’lum | Nostandart vazifalarni tasniflash qiyin |

## Narx nimaga bog‘liq

Tayyor raqamlar o‘rniga narxni o‘zgartiradigan omillarga qarang:

- **Reaksiya vaqti va ish soatlari.** Kecha-kunduz bir soat ichida reaksiya ish vaqtidagi xizmatdan sezilarli qimmat.
- **Tizimning murakkabligi va yoshi.** Hujjat va testlarsiz eski kod har bir tuzatishga ko‘proq vaqt talab qiladi.
- **Integratsiyalar soni.** To‘lov tizimlari, 1C, CRM, tashqi API — har biri sizga bog‘liq bo‘lmagan holda buzilishi mumkin.
- **Xavfsizlik va ma’lumotlarga talablar.** Shaxsiy va to‘lov ma’lumotlari jarayonlarga talabni oshiradi.
- **Infratuzilma kimga tegishli.** Agar pudratchi serverlar uchun ham javob bersa, ish hajmi oshadi.

## Kerakli hajmni qanday aniqlash mumkin

1. **Tarixni hisoblang.** So‘nggi oylarda qancha so‘rov va o‘zgarish bo‘ldi? Qaysilari shoshilinch edi?
2. **To‘xtab qolish narxini baholang.** Sayt yoki CRM ishlamasa, bir soatda nimani yo‘qotasiz? Bu kerakli SLA ni belgilaydi.
3. **Shoshilinch va rejali ishlarni ajrating.** Avariyalar — abonementga, rivojlantirish — alohida byudjetga.
4. **Sinov davridan boshlang.** Ikki-uch oydan keyin paket yetarlimi yoki yo‘qmi, aniq bo‘ladi.
5. **Hajmni qayta ko‘rib chiqing.** Ishlatilmagan soatlar yoki doimiy oshib ketish — shartnomani tuzatish uchun signal.

## Shartnomada nimalarni yozish kerak

- **SLA**: har bir muhimlik darajasi uchun reaksiya va hal qilish vaqti.
- **Insidentlar tasnifi**: nima kritik, nima rejali vazifa.
- **Nima kiradi va nima kirmaydi**, paketdan tashqari ishlar qanday to‘lanadi.
- **Ishlatilmagan soatlar taqdiri**: kuyib ketadimi yoki keyingi oyga o‘tadimi.
- **Kirish huquqlari va topshirish**: barcha parollar, repozitoriylar va hujjatlar sizda qolishi kerak.
- **Hisobot**: bajarilgan ishlar va sarflangan soatlarning oylik ro‘yxati.

## Ko‘p uchraydigan xatolar

- Umuman shartnoma tuzmaslik va avariya paytida dasturchi qidirish.
- Faqat kunduzi ishlatiladigan ichki tizim uchun 24/7 SLA sotib olish.
- Support va rivojlantirishni bitta byudjetda aralashtirish, natijada yangi funksiyalar avariyalar vaqtini yeb qo‘yadi.
- Hisobot talab qilmaslik va nima uchun to‘layotganingizni bilmaslik.

## FAQ

### Mahsulotni uni ishlab chiqmagan boshqa jamoa qo‘llab-quvvatlay oladimi?

Ha, lekin topshirish bosqichi kerak: kod auditi, hujjatlar, kirish huquqlari va infratuzilma. Loyiha qanchalik yaxshi hujjatlashtirilgan bo‘lsa, yangi jamoa shunchalik tez samarali ishlay boshlaydi.

### Tizim xatosiz ishlasa ham qo‘llab-quvvatlash kerakmi?

Ha, hech bo‘lmaganda maintenance formatida. Xavfsizlik yangilanishlari, sertifikatlarni uzaytirish, zaxira nusxalar va monitoring har qanday ishlayotgan tizimga, hatto barqaror tizimga ham kerak.

### Qaysi biri foydaliroq: abonement yoki soatbay?

Bu ishlarning muntazamligi va to‘xtab qolish narxiga bog‘liq. Agar so‘rovlar har oy bo‘lsa va to‘xtab qolish kritik bo‘lsa, abonement odatda qulayroq. Ishlar kam bo‘lsa, soatbay to‘lov adolatliroq.
