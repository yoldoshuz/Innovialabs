---
title: Dasturiy ta’minotni qo‘llab-quvvatlash shartnomasida SLA nima
description: SLA nimani o‘z ichiga oladi: javob va hal qilish vaqti, jiddiylik darajalari, uptime va jarimalar. Shartnomada e’tibor berish kerak bo‘lgan iboralar ham bor.
summary: SLA — shartnomaning pudratchi muammolarga qanchalik tez javob berishi, ularni qaysi muddatda bartaraf etishi va tizimning qanday ishlash darajasini kafolatlashi o‘lchanadigan qilib yozilgan qismi. Raqam va ta’riflarsiz SLA bo‘sh va’daga aylanadi.
---

## Qisqacha: SLA nima

**SLA (Service Level Agreement, xizmat darajasi to‘g‘risidagi kelishuv)** — shartnoma bo‘limi yoki alohida ilova bo‘lib, unda pudratchi qo‘llab-quvvatlash bo‘yicha *o‘lchanadigan* majburiyatlarni belgilaydi: qanchalik tez javob beradi, qanchalik tez tuzatadi, tizim qancha vaqt ishlashi kerak va va’dalar buzilsa nima bo‘ladi.

Yaxshi SLA to‘rtta savolga javob beradi:

- **Nima** intsident hisoblanadi va u qanchalik jiddiy.
- **Qachon** pudratchi javob berishi va muammoni bartaraf etishi shart.
- Bajarilish **qanday** o‘lchanadi.
- Buzilganda **nima** bo‘ladi.

## Javob vaqti va hal qilish vaqti

Bu ikki xil ko‘rsatkich va ular tez-tez adashtiriladi.

- **Javob vaqti (response time)** — murojaatingizdan mutaxassis vazifani ishga olganini tasdiqlaguncha o‘tgan vaqt. Robotning avtomatik javobi odatda hisobga olinmaydi.
- **Hal qilish vaqti (resolution time)** — muammo bartaraf etilguncha yoki vaqtinchalik aylanma yechim (workaround) ishga tushirilguncha o‘tgan vaqt.

Hal qilish muddatisiz «15 daqiqada javob beramiz» va’dasi kam narsani kafolatlaydi: tez javob berib, bir hafta tuzatish mumkin.

## Jiddiylik darajalari

Muddatlar muammo qanchalik jiddiyligiga bog‘liq. Odatda uch-to‘rt daraja ajratiladi:

| Daraja | Ma’nosi | Misol |
|---|---|---|
| Kritik | Tizim ishlamayapti yoki asosiy jarayon to‘xtagan | Buyurtma yoki to‘lovlar qabul qilinmayapti |
| Yuqori | Muhim funksiya xato bilan ishlaydi, aylanma yo‘l yo‘q | Buxgalteriya uchun hisobotlar shakllanmayapti |
| O‘rta | Muammo bor, lekin ishlash mumkin | Bitta bo‘lim sekin yuklanadi |
| Past | Mayda kamchiliklar va istaklar | Interfeysdagi imlo xatosi |

**Darajani kim belgilashi** muhim. Mezonlar shartnomada yozilgani, bahsli holatlar esa bir tomonning xohishiga ko‘ra emas, tushunarli qoida bo‘yicha hal qilingani yaxshi.

## Uptime: tizimning ishlash darajasi

**Uptime** — tizim ishlayotgan vaqt ulushi. SLA’da u ma’lum davr, odatda bir oy uchun foizda ko‘rsatiladi. «To‘qqizlar» qancha ko‘p bo‘lsa, ruxsat etilgan to‘xtash vaqti shuncha kam, infratuzilma va navbatchilik esa shuncha qimmat.

Nimaga qarash kerak:

- **Ishlash darajasi qanday hisoblanadi** va uni kim o‘lchaydi — tashqi monitoring yoki pudratchining loglari.
- **Nima istisno qilinadi**: rejali ishlar, xosting yoki uchinchi tomon xizmatidagi nosozliklar, buyurtmachi tomonidagi muammolar.
- **Rejali ishlar oynalari**: qachon o‘tkaziladi va sizni qancha oldin ogohlantirishadi.

## Qo‘llab-quvvatlash soatlari

Muddatlar qaysi vaqtda amal qilishini aniqlang: kecha-kunduz, faqat ish soatlarida yoki «kritik — 24/7, qolganlari — ish vaqtida» sxemasida. Va qaysi vaqt mintaqasida. Ish kuni rejimidagi «4 soat» muddati javob faqat ertasi kuni ertalab kelishini anglatishi mumkin.

## Jarimalar va kompensatsiyalar

Odatda bu **servis kreditlari** — har bir buzilish yoki erishilmagan uptime uchun keyingi qo‘llab-quvvatlash davriga chegirma. Tekshiring:

- kompensatsiyaning **yuqori chegarasi** bormi;
- buyurtmachi buzilish haqida **o‘zi xabar berishi** kerakmi va qaysi muddatda;
- **tizimli buzilish** nima hisoblanadi va u shartnomani bekor qilish huquqini beradimi.

## Izlash kerak bo‘lgan iboralar namunalari

Yaxshi iboralar aniq bo‘ladi:

- «Javob vaqti murojaat arizalar tizimida ro‘yxatga olingan paytdan mas’ul mutaxassis tayinlangunga qadar hisoblanadi».
- «Kritik darajadagi intsidentlar uchun qo‘llab-quvvatlash kecha-kunduz, dam olish va bayram kunlarini ham o‘z ichiga olgan holda ko‘rsatiladi».
- «Ishlash darajasi kamida daqiqada bir marta tekshiruvchi tashqi monitoring ma’lumotlari bo‘yicha hisoblanadi».
- «Ijrochi rejali ishlar haqida Buyurtmachini kamida [N] ish kuni oldin xabardor qiladi».

Xavotirli iboralar noaniq bo‘ladi: «oqilona muddatlarda», «imkon qadar», «tezkor», «barcha sa’y-harakatlarni qilamiz».

## Ko‘p uchraydigan xatolar

- Jiddiylik darajalari belgilanmagan SLA’ni qabul qilish.
- Murojaat kanallarini ko‘rsatmaslik: hammasi buzilsa, kechasi qayerga yozish kerak.
- Hisobotni nazarda tutmaslik — arizalar va ishlash darajasi bo‘yicha oylik hisobot.
- Kritik bo‘lmagan tizim uchun maksimal ko‘rsatkichlarni talab qilib, ortiqcha to‘lash.

## FAQ

### SLA oddiy qo‘llab-quvvatlash shartnomasidan nimasi bilan farq qiladi?

Oddiy shartnoma pudratchi tizimni qo‘llab-quvvatlashini tavsiflaydi. SLA bunga o‘lchanadigan muddatlar, ko‘rsatkichlar va ular buzilishining oqibatlarini qo‘shadi — ya’ni tekshirish mumkin bo‘lgan narsalarni.

### Qanday uptime tanlash kerak?

Biznes uchun to‘xtab qolish narxiga qarang. Agar bir soatlik ishlamaslik qimmatga tushsa, yuqori ko‘rsatkichlar o‘zini oqlaydi. Agar tizim ichki va kritik bo‘lmasa, yumshoqroq shartlarga rozi bo‘lib, tejash oqilona.

### SLA’ga yangi funksiyalarni ishlab chiqish kiradimi?

Odatda yo‘q. SLA intsidentlar va barqaror ishlashga tegishli. Yangi funksiyalar va qo‘shimcha ishlar, qoida tariqasida, alohida — soatbay yoki alohida buyurtma sifatida rasmiylashtiriladi.
