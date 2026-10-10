---
title: Simmetrik va asimmetrik shifrlash oddiy so‘zlar bilan
description: AES, RSA va ECC kundalik misollarda: shifrlash turlari farqi, raqamli imzo, xeshlash va shifrlash farqi hamda ular qayerda ishlatilishi.
summary: Simmetrik shifrlashda bitta kalit ma’lumotni ham qulflaydi, ham ochadi — bu tez, lekin kalitni qandaydir xavfsiz yetkazish kerak. Asimmetrik shifrlashda kalitlar jufti bor: shifrlash yoki imzoni tekshirish uchun ochiq kalit, shifrdan chiqarish yoki imzolash uchun yopiq kalit. Amalda ular birlashtiriladi: asimmetriya kalit bo‘yicha kelishishga yordam beradi, simmetriya esa ma’lumotlarning o‘zini shifrlaydi.
---

## Qisqa javob

**Simmetrik shifrlash** — bitta kalitli seyf. Kim yopgan bo‘lsa, o‘sha kalit bilan ochadi va kirish huquqi bor har bir kishida kalit nusxasi bo‘lishi kerak. Eng keng tarqalgan algoritm — **AES**.

**Asimmetrik shifrlash** — tirqishli pochta qutisi. Manzilni bilgan har kim xat tashlay oladi (shifrlaydi) — bu **ochiq kalit**. Xatni faqat quti kalitining egasi oladi — bu **yopiq kalit**. Mashhur algoritmlar — **RSA** va **ECC** (elliptik egri chiziqlar kriptografiyasi).

## Taqqoslash

| | Simmetrik (AES) | Asimmetrik (RSA, ECC) |
|---|---|---|
| Kalitlar | Bitta umumiy sir | Juftlik: ochiq va yopiq |
| Tezlik | Juda tez, katta hajmlar uchun mos | Sezilarli sekinroq, kichik ma’lumotlar uchun ishlatiladi |
| Asosiy qiyinchilik | Kalitni qanday xavfsiz yetkazish | Ochiq kalit kerakli odamga tegishli ekaniga qanday ishonch hosil qilish |
| Odatiy qo‘llanilishi | Trafik, disklar, fayllar, bazalarni shifrlash | Kalit almashish, raqamli imzolar, sertifikatlar |

Teng mustahkamlikda ECC kalitlari RSA’nikidan qisqaroq, shuning uchun elliptik egri chiziqlar hozir ko‘pincha yangi tizimlar va mobil qurilmalar uchun tanlanadi.

## Nega ular birga ishlatiladi

Simmetrik shifrlash tez, lekin savolga tiralib qoladi: kanal tinglanayotgan bo‘lsa, kalitni suhbatdoshga qanday berish kerak? Asimmetrik shifrlash bu masalani hal qiladi, ammo video yoki katta fayllarni shifrlash uchun juda sekin.

Shuning uchun deyarli hamma joyda **gibrid sxema** ishlaydi:

1. Asimmetrik kriptografiya yordamida tomonlar umumiy sir bo‘yicha xavfsiz kelishib oladi.
2. Undan **seans uchun simmetrik kalit** olinadi.
3. Keyingi barcha ma’lumotlar tez simmetrik algoritm bilan shifrlanadi.

## Raqamli imzo

Asimmetrik kalitlar «teskari» ham ishlay oladi. Ega ma’lumotlarni yopiq kalit bilan **imzolaydi**, har kim esa imzoni ochiq kalit bilan **tekshira oladi**.

O‘xshatish — noyob uzuk bilan bosilgan sur’ich muhri: uni faqat uzuk egasi qo‘ya oladi, tanishi esa har kimning qo‘lidan keladi. Imzo ikki narsani isbotlaydi:

- **mualliflik** — ma’lumotlarni yopiq kalit egasi imzolagan;
- **yaxlitlik** — imzolangandan keyin ma’lumotlarda birorta bit ham o‘zgarmagan.

Imzolar sayt sertifikatlarida, dastur va ilovalar yangilanishlarida, elektron hujjat aylanishida, Git’dagi kommitlarda qo‘llaniladi.

## Xeshlash — bu shifrlash emas

**Xesh-funksiya** (masalan, SHA-256) istalgan ma’lumotni qat’iy uzunlikdagi qisqa «barmoq izi»ga aylantiradi. Bu go‘sht maydalagichga o‘xshaydi: qiymadan go‘sht bo‘lagini qayta yig‘ib bo‘lmaydi.

| | Shifrlash | Xeshlash |
|---|---|---|
| Qaytariluvchanlik | Kalitni bilib shifrdan chiqarish mumkin | Qaytarib bo‘lmaydi |
| Kalit | Kerak | Kerak emas |
| Nima uchun | Ma’lumotni yashirish va keyin o‘qish | Yaxlitlikni tekshirish yoki asl nusxani saqlamasdan solishtirish |

Foydalanuvchi parollarini **shifrlash emas, xeshlash** kerak: saytga parolni bilish shart emas, xesh mos kelishini tekshirish kifoya. Parollar uchun «tuz» qo‘shiladigan maxsus sekin algoritmlar — **Argon2**, **bcrypt**, **scrypt** ishlatiladi, SHA-256 yoki eskirgan MD5 kabi tezlari emas.

## Bular har kuni qayerda ishlaydi

- **HTTPS.** Brauzer sayt sertifikatini raqamli imzo orqali tekshiradi, so‘ng tomonlar asimmetrik kalit almashinuvi (odatda elliptik egri chiziqlarda) yordamida seans kaliti bo‘yicha kelishadi, keyin esa trafik simmetrik — masalan, AES bilan shifrlanadi.
- **Uchdan uchgacha shifrlangan messenjerlar.** Suhbatdoshlarning qurilmalari ochiq kalitlar almashadi va umumiy sirlarni hosil qiladi, xabarlarning o‘zi esa simmetrik shifrlanadi. Bitta kalit sizib chiqsa butun yozishma ochilib qolmasligi uchun kalitlar muntazam yangilanadi.
- **Ma’lumotlarni saqlash.** Noutbuk va telefonlarda disklarni, zaxira nusxalarni va bazadagi maydonlarni shifrlash — bu AES yoki uning analoglari. Bu yerda asosiy savol — kalitni ma’lumotlar yonida yotmasligi uchun qayerda saqlash.
- **SSH va kalit orqali kirish.** Server yopiq kalitni uzatishni talab qilmasdan, u sizda borligini tekshiradi.

## Tez-tez uchraydigan xatolar

- Tekshirilgan kutubxonalar o‘rniga o‘z shifrlash algoritmini o‘ylab topish.
- Shifrlash kalitlarini kodda yoki shifrlangan ma’lumotlar yonida saqlash.
- Parollarni qaytariladigan tarzda shifrlash yoki ularni tuzsiz tez algoritm bilan xeshlash.
- Kodlashni (Base64) shifrlash bilan adashtirish: Base64 hech narsani yashirmaydi.

## FAQ

### Qaysi shifrlash ishonchliroq — simmetrikmi yoki asimmetrikmi?

To‘g‘ri algoritm va kalit uzunligida ikkalasi ham ishonchli. Ular turli vazifalarni hal qiladi, shuning uchun biri «o‘rniga» tanlanmaydi, birga ishlatiladi.

### Kvant kompyuterlari shifrlashga tahdid soladimi?

Yetarlicha kuchli kvant kompyuteri nazariy jihatdan RSA va ECC’ni buza oladi. Shuning uchun postkvant algoritmlar ishlab chiqilmoqda va joriy etilmoqda. Uzun kalitli AES kabi simmetrik shifrlar bu tahdidga ancha chidamli hisoblanadi.

### Parol xeshini shifrdan chiqarish mumkinmi?

Yo‘q, xesh qaytarilmaydi. Lekin zaif parollar xeshlarni solishtirib, tanlash yo‘li bilan topiladi. Shuning uchun tuzli sekin xeshlash algoritmlari va uzun noyob parollar muhim.
