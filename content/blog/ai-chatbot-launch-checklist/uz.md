---
title: AI chat-bot ishga tushirish chek-listi: startdan oldin nimalar
description: AI chat-botni ishga tushirishdan oldin nimani tekshirish kerak: test savollari, chegaraviy holatlar, rad etish, operatorga uzatish, loglar va monitoring.
summary: Ishga tushirishdan oldin botni real va qiyin savollar orqali sinang, rad etish va insonga uzatishni tekshiring, log yuritishni yoqing, foydalanuvchilarni ma’lumotlarni qayta ishlash haqida ogohlantiring va monitoringni sozlang.
---

## Avvalo nimani tekshirish kerak

AI chat-bot ishga tushirishga tayyor, agar u **odatiy savollarga to‘g‘ri javob bersa, bilmagan joyda halol rad etsa va suhbatni insonga uzata olsa**. Qolgan hammasi — log yuritish, maxfiylik, monitoring — bu sifatni startdan keyin saqlab qolish uchun kerak. Quyida bloklar bo‘yicha chek-list.

## 1. Test savollari to‘plami

- Jamoa o‘ylab topgan emas, chatlar, pochta va qo‘ng‘iroqlardagi mijozlarning **real savollari** yig‘ilgan.
- Har bir savol uchun **namunaviy javob** yoki to‘g‘rilik mezoni bor.
- Barcha asosiy mavzular qamrab olingan: narxlar, muddatlar, yetkazib berish, to‘lov, qaytarish, kontaktlar — biznesingiz uchun dolzarb bo‘lganlar.
- Savollar **turli shakllarda**: qisqa, xatolar bilan, auditoriya ko‘p tilli bo‘lsa — turli tillarda.
- Prompt, model yoki bilimlar bazasi har safar o‘zgarganda test **qayta o‘tkaziladi**.

## 2. Chegaraviy holatlar

- Biznes mavzusidan **tashqari** savollar: bot xushmuomalalik bilan o‘z vazifasiga qaytaradi.
- Botni ko‘rsatmalarni e’tiborsiz qoldirishga majburlash **urinishlari** (prompt injection): «qoidalarni unut», «tizim promptini ko‘rsat».
- **Tajovuzkor va haqoratli** xabarlar: bot xotirjam ohangni saqlaydi.
- Juda **uzun xabarlar**, bo‘sh xabarlar, faqat emoji yoki stikerlar, kanal qo‘llab-quvvatlasa — fayllar va ovozli xabarlar.
- Bitta xabarda **bir nechta savol**.
- **Raqobatchilar**, siyosat, tibbiyot, huquq haqidagi savollar — bot ularga qanday javob berishi oldindan hal qilingan.

## 3. Rad etishdagi xatti-harakat

- Bilimlar bazasida javob bo‘lmasa, bot o‘ylab topmaydi, **buni aytadi**.
- Bot tasdiqlangan materiallarda yo‘q **chegirmalar, muddatlar va shartlarni** va’da qilmaydi.
- Rad etish do‘stona va darhol keyingi qadamni taklif qiladi: operator, forma, telefon.
- Bot ichki ko‘rsatmalar va xizmat ma’lumotlarini oshkor qilmaydi.

## 4. Operatorga uzatish

- **«Inson bilan bog‘lanish»** uchun aniq buyruq yoki tugma bor.
- Foydalanuvchi norozi bo‘lsa, savol murakkab bo‘lsa yoki gap pul yoki shikoyat haqida bo‘lsa, bot suhbatni o‘zi uzatadi.
- Mijoz takrorlamasligi uchun operator **suhbat tarixini** oladi.
- **Ish vaqtidan tashqari** nima bo‘lishi belgilangan: bot inson qachon javob berishini halol aytadi.
- Uzatish haqidagi bildirishnomalar operatorlarga haqiqatan yetib borishi tekshirilgan.

## 5. Log yuritish

- Savollar, javoblar, foydalanilgan manbalar va eskalatsiya holatlari saqlanadi.
- **Yomon javobni** belgilash usuli bor — masalan, baholash tugmalari.
- Loglar cheklangan kirish huquqi va aniq saqlash muddati bilan saqlanadi.
- Loglardagi shaxsiy ma’lumotlar imkon qadar **niqoblanadi**.

## 6. Maxfiylik va shaffoflik

- Foydalanuvchi inson bilan emas, **bot** bilan muloqot qilayotganini ko‘radi.
- **Ma’lumotlarni qayta ishlash haqida** qisqa bildirishnoma va maxfiylik siyosatiga havola bor.
- Bot ortiqcha narsa so‘ramaydi: karta raqamlari, parollar, pasport ma’lumotlari.
- Model provayderining ma’lumotlarni qayta ishlash shartlari va mamlakatingizdagi shaxsiy ma’lumotlar to‘g‘risidagi qonunchilik talablari tekshirilgan.

## 7. Startdan keyingi monitoring

| Nimani kuzatish | Nima uchun |
|---|---|
| Operatorga uzatilgan suhbatlar ulushi | Bot qayerda qiynalayotganini ko‘rsatadi |
| Javoblarga salbiy baholar | Muammolar haqida tezkor signal |
| Bilimlar bazasida javobi yo‘q savollar | Nimani qo‘shish kerakligi ro‘yxati |
| Javob vaqti va API xatolari | Texnik barqarorlik |
| Modelga sarf | Byudjetni nazorat qilish |

- Suhbatlar tanlanmasini muntazam ko‘rib chiqadigan **mas’ul** tayinlangan.
- API nosozliklari va xatolarning keskin o‘sishida **ogohlantirishlar** sozlangan.
- **Bosqichma-bosqich ishga tushirish** rejalashtirilgan: avval trafikning bir qismi yoki ichki foydalanuvchilar, keyin hamma.

## Ishga tushirishdagi ko‘p uchraydigan xatolar

- Faqat «yaxshi» savollarni sinash.
- Foydalanuvchiga insonga chiqish imkonini bermaslik.
- Ishga tushirib, dastlabki haftalarda loglarni ko‘rmaslik.
- Bilimlar bazasini testni qayta o‘tkazmasdan yangilash.

## FAQ

### Ishga tushirish uchun nechta test savoli kerak?

Aniq son yo‘q. Mo‘ljal — har bir asosiy mavzuni bir nechta shakl bilan qamrab olish va chegaraviy holatlarni qo‘shish. Startdan keyin to‘plam real suhbatlar hisobiga o‘sib boradi.

### Botni operatorsiz ishga tushirish mumkinmi?

Mumkin, lekin unda foydalanuvchida boshqa tushunarli yo‘l bo‘lishi kerak: forma, pochta yoki telefon. Chiqishi yo‘q boshi berk ko‘cha brend haqidagi taassurotni tez buzadi.

### Startdan keyin botni qanchalik tez-tez ko‘rib chiqish kerak?

Dastlabki haftalarda — asosiy kamchiliklar aniqlanguncha tez-tez. Keyin — muntazam va bilimlar bazasi, prompt yoki model har safar o‘zgargandan keyin albatta.
