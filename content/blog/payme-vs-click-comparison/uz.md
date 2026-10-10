---
title: Payme yoki Click: sayt uchun qaysi to‘lov tizimini tanlash kerak
description: Sayt uchun Payme va Click ni solishtiramiz: ulanish talablari, komissiyalar, kartalar, API, to‘lovlar va qamrov, hamda nega do‘konlar ikkalasini ulaydi.
summary: Payme va Click bitta vazifani bajaradi — Uzcard va Humo kartalari hamda o‘z ilovalaridan to‘lov qabul qilish; ular asosan API tuzilishi va xaridorlaringiz odatlari bilan farq qiladi, shuning uchun ko‘pchilik do‘konlarga ikkala tizimni ulash foydaliroq.
---
## Qisqa javob

**Payme** va **Click** — O‘zbekistonda onlayn to‘lov qabul qilish uchun eng mashhur ikki to‘lov tizimi. Ikkalasi ham milliy **Uzcard** va **Humo** kartalarini qabul qiladi, ikkalasining ham odamlar deyarli hamma narsa uchun to‘laydigan mashhur mobil ilovalari bor va ikkalasi ham do‘konga saytda to‘lov uchun API beradi.

Xaridor uchun jiddiy farq deyarli yo‘q: u o‘rgangan usulda to‘laydi. Shuning uchun savol odatda «qaysi biri yaxshi» emas, balki «qaysi biridan boshlash» bo‘ladi — va ko‘pincha javob «ikkalasini ulash».

## Asosiy parametrlar bo‘yicha taqqoslash

| Parametr | Payme | Click |
|---|---|---|
| Kim ulanishi mumkin | O‘zbekistonda ro‘yxatdan o‘tgan yuridik shaxslar va YaTT | O‘zbekistonda ro‘yxatdan o‘tgan yuridik shaxslar va YaTT |
| Kartalar | Uzcard, Humo; boshqa kartalarni amaldagi shartlardan aniqlang | Uzcard, Humo; boshqa kartalarni amaldagi shartlardan aniqlang |
| Xaridor qanday to‘laydi | Payme to‘lov sahifasi yoki Payme ilovasi | Click to‘lov sahifasi yoki Click ilovasi |
| Do‘kon uchun asosiy API | Merchant API: Payme serveringizni JSON-RPC protokoli orqali chaqiradi | SHOP API: Click serveringizga Prepare va Complete so‘rovlarini yuboradi |
| Summa birligi | Tiyin (so‘mdagi summa × 100) | So‘m |
| Takroriy to‘lovlar | Kartalarni tokenizatsiya qilish uchun alohida API | Karta tokenlari bilan ishlash uchun alohida API |
| Komissiya va to‘lovlar | Shartnoma bo‘yicha | Shartnoma bo‘yicha |

## Ulanish talablari

Ikkala tizimda ham to‘plam o‘xshash:

- **yuridik shaxs yoki YaTT** va O‘zbekiston bankidagi hisob raqami;
- tovarlar va narxlar tavsifi, kontaktlar, ommaviy oferta, yetkazib berish va qaytarish shartlari bo‘lgan **ishlab turgan sayt** yoki ilova;
- biznes kabineti yoki to‘lov tizimi menejeri orqali **ariza va shartnoma**;
- jangovar rejimga o‘tishdan oldin **texnik integratsiya** va testlash.

Hujjatlarning aniq ro‘yxati o‘zgarib turadi, shuning uchun ulanish paytidagi talablarni tekshiring.

## Komissiyalar va to‘lovlar

To‘lovlarni qabul qilish komissiyasi **shartnomada** belgilanadi va faoliyat turi, aylanma va siz kelishgan shartlarga bog‘liq. Ommaviy tariflar, agar e’lon qilingan bo‘lsa, yakuniy raqam emas, balki boshlang‘ich nuqta.

Pul kompaniyaning **hisob raqamiga** komissiya chegirilib, shartnomadagi jadval bo‘yicha tushadi. Solishtirishda ikkala tizimdan bir xil narsalarni so‘rang: sizning biznes turingiz uchun stavka, pul tushish muddati, qaytarish shartlari va qo‘shimcha to‘lovlar bor-yo‘qligi.

## API lar qanday tuzilgan

Ikkala tizim ham o‘xshash sxemada ishlaydi: xaridor ularning tomonida to‘laydi, to‘lov tizimi esa buyurtmani tekshirish va to‘lovni tasdiqlash uchun **serveringizga o‘zi murojaat qiladi**.

**Payme Merchant API.** Serveringiz Payme chaqiradigan metodlar to‘plamini amalga oshiradi: to‘lov imkoniyatini tekshirish (`CheckPerformTransaction`), yaratish (`CreateTransaction`), o‘tkazish (`PerformTransaction`), bekor qilish (`CancelTransaction`), holatni tekshirish (`CheckTransaction`) va ko‘chirma (`GetStatement`). So‘rovlar merchant kaliti bilan avtorizatsiya qilinadi. Metodlar ko‘proq, lekin bekor qilish va solishtirish ssenariylari aniq yozilgan.

**Click SHOP API.** Serveringiz ikkita so‘rovni qabul qiladi: **Prepare** (buyurtma va summani tekshirish) va **Complete** (to‘lovni yoki uning bekor qilinishini qayd etish). Har bir so‘rov imzolangan va imzoni maxfiy kalit bilan tekshirish kerak. Sxema qisqaroq va boshlash uchun soddaroq.

Ikkala integratsiya uchun umumiy qoidalar:

- har bir kiruvchi so‘rovning **imzosi yoki avtorizatsiyasini** tekshiring;
- **summa va buyurtma holatini** bazangiz bilan solishtiring;
- qayta ishlashni **idempotent** qiling: takroriy so‘rov ikkinchi to‘lovni yaratmasligi kerak;
- **summa birliklarini** adashtirmang: Payme da tiyin va Click da so‘m — xatolarning keng tarqalgan sababi.

Batafsil ma’lumot rasmiy [Payme](https://developer.help.paycom.uz) va [Click](https://docs.click.uz) hujjatlarida.

## Foydalanuvchilar qamrovi

Ikkala tizimning ham auditoriyasi katta va ko‘p xaridorlarning aniq odati bor: kimdir pul va kartalarini Payme da, kimdir Click da saqlaydi. Agar checkout da odatiy usul bo‘lmasa, odamlarning bir qismi xaridni yakunlamaydi. Aynan sizning mijozlaringiz orasida qaysi biri mashhurroq ekanini ishga tushirgandan keyin o‘z statistikangiz eng yaxshi ko‘rsatadi.

## Nega do‘konlar ikkalasini ulaydi

- **Konversiya**: xaridor tanish tugmani ko‘radi va tezroq to‘laydi.
- **Zaxira**: bir tizimda texnik ishlar yoki nosozlik bo‘lsa, to‘lovlar ikkinchisi orqali davom etadi.
- **Kam qo‘shimcha xarajat**: to‘g‘ri arxitekturada ikkala integratsiya bitta buyurtmalar va to‘lovlar jadvaliga yozadi, faqat callback ni qayta ishlash qatlami farq qiladi.

Odatiy tartib: avval bitta tizim, buyurtma va to‘lovlarning umumiy modeli, keyin ikkinchisi alohida adapter sifatida.

## FAQ

### Payme va Click ni yuridik shaxssiz ulash mumkinmi?

Saytda to‘lov qabul qilish uchun ro‘yxatdan o‘tgan biznes kerak: hisob raqamiga ega yuridik shaxs yoki YaTT. To‘lov tizimi shartnomani aynan u bilan tuzadi.

### Qaysi tizimni birinchi ulash kerak?

Rasmiylashtirishdan tezroq o‘ta oladiganingizni yoki mijozlaringizning ko‘pchiligi foydalanadiganini. Texnik jihatdan Click dan boshlash osonroq, lekin arxitekturani ikkinchi tizimni qayta ishlamasdan qo‘shish mumkin bo‘ladigan qilib quring.

### Har bir tizim uchun alohida checkout qilish kerakmi?

Yo‘q. To‘lov sahifasida ikkita tugma, serverda esa umumiy buyurtma mantig‘i va har bir tizim uchun bittadan callback ishlovchisi yetarli.
