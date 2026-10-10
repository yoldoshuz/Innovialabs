---
title: Eslab qolish oson bo‘lgan ishonchli parolni qanday tuzish
description: Parollar qanday buziladi, nega uzunlik maxsus belgilardan muhimroq, eslab qolinadigan parol iborasini qanday tuzish va nega parolni takrorlash eng katta xavf.
summary: Ishonchli parol ayyorona emas, balki uzun va tasodifiy bo‘ladi: eslab qolishingiz kerak bo‘lgan bir nechta parol uchun 4–6 ta tasodifiy so‘zdan iborat ibora ishlating, har joyda noyob parol qo‘ying, qolganini parol menejeriga topshiring.
---
## Qisqa javob

Ishonchli parol — **uzun, tasodifiy va faqat bir joyda ishlatiladigan** parol. Bunga erishishning eng oson yo‘li — **parol iborasi**, ya’ni bir nechta tasodifiy so‘z, masalan `lantern-cactus-violin-harbor-pepper`. Uni eslab qolish va terish oson, topish esa `P@ssw0rd2024!` ga qaraganda ancha qiyin.

## Parollar aslida qanday buziladi

Parollarni qo‘lda deyarli hech kim taxmin qilmaydi. Avtomatik usullar ishlatiladi:

- **To‘liq saralash (brute force)** — barcha mumkin bo‘lgan kombinatsiyalarni tekshirish. Uzun parollarga qarshi foydasiz, qisqalariga qarshi tez.
- **Lug‘at hujumi** — haqiqiy so‘zlar, ismlar, sizib chiqqan parollar va ularning odatiy variantlarini sinash. Buzish dasturlari **qoidalar** qo‘llaydi: birinchi harfni katta qilish, `a` o‘rniga `@`, oxiriga yil yoki `!` qo‘shish. Shuning uchun `Summer2024!` unda «hamma narsa bor» bo‘lsa ham tez buziladi.
- **Credential stuffing** — eski sizib chiqishlardagi «pochta + parol» juftliklarini boshqa servislarda sinash. Hech narsani buzish shart emas: parol takrorlangan bo‘lsa, hujumchi shunchaki kiradi.
- **Oflayn tanlash** — servis buzilib, parol xeshlari sizib chiqqanda, variantlar kirish urinishlariga cheklovsiz o‘z uskunasida tekshiriladi. Zaif parollar aynan shu yerda eng tez taslim bo‘ladi.

## Nega uzunlik murakkablikdan muhimroq

Har bir qo‘shimcha belgi hujumchi tekshirishi kerak bo‘lgan kombinatsiyalar sonini ko‘paytiradi. Uzunlik bu sonni bir-ikki yangi belgi turini qo‘shishdan ko‘ra ancha tez oshiradi.

Buni oddiy matematika ko‘rsatadi:

| Parol turi | Kombinatsiyalar soni |
|---|---|
| Butun klaviaturadan 8 ta tasodifiy belgi | taxminan 6,6 × 10^15 |
| 7776 so‘zli ro‘yxatdan 4 ta tasodifiy so‘z | taxminan 3,7 × 10^15 |
| 7776 so‘zli ro‘yxatdan 6 ta tasodifiy so‘z | taxminan 2,2 × 10^23 |

To‘rtta tasodifiy so‘z sakkizta tasodifiy belgi bilan deyarli bir xil chidamli, lekin ularni eslab qolish beqiyos oson. Olti so‘z esa ancha kuchliroq. Asosiy so‘z — **tasodifiy**: o‘zingiz o‘ylab topgan ibora, mashhur iqtibos yoki qo‘shiq satri hujumchilar lug‘atida bor.

## Parol iborasini qanday tuzish

1. **4–6 ta so‘zni tasodifiy tanlang** — so‘zlar ro‘yxati bo‘yicha zar tashlang (Diceware usuli) yoki parol menejeridagi generatordan foydalaning. So‘zlarni o‘zingiz tanlamang: odamlar oldindan bashorat qilinadigan so‘zlarni tanlaydi.
2. Ularni ajratuvchi bilan ulang: chiziqcha, bo‘sh joy yoki nuqta.
3. Agar sayt raqam yoki katta harf talab qilsa, ularni bitta eslab qolinadigan qoida bo‘yicha qo‘shing, masalan `Lantern-cactus-violin-harbor-7`.
4. So‘zlardan qisqa tasvir hosil qiling — kaktus ustidagi fonar bandargohda skripka chalmoqda. Bir necha marta kiritgandan keyin ibora yodda qoladi.

So‘zlarni o‘zbek tilida ham olish mumkin — asosiysi, ular tasodifiy tanlangan bo‘lsin.

## Parolni takrorlash — eng katta xavf

O‘nta saytda ishlatilgan mukammal parol shu o‘ntaning eng zaifi qanchalik himoyalangan bo‘lsa, shunchalik himoyalangan. Bittasi sizib chiqsa, credential stuffing qolganlarini ochadi. Shuning uchun:

- **Har bir akkauntning o‘z paroli bor.** «Muhim bo‘lmagan» saytlar uchun ham istisno yo‘q — aynan ular ko‘proq sizib chiqadi.
- Faqat bir nechta iborani eslab qoling: **parol menejeri** master-paroli, asosiy pochta va qurilmaga kirish paroli.
- Qolgan barcha parollarni menejer yaratsin va saqlasin — siz ko‘rishingiz shart bo‘lmagan 16 va undan ortiq belgili tasodifiy satrlar.
- Pochta, bank va messenjerlar uchun **ikki bosqichli autentifikatsiyani** yoqing, shunda faqat parolning sizib chiqishi yetarli bo‘lmaydi.

## Ko‘p uchraydigan xatolar

- Shaxsiy ma’lumotlar: ismlar, tug‘ilgan sanalar, telefon raqamlari, uy hayvonlarining ismlari.
- Klaviatura yo‘llari: `qwerty`, `1q2w3e4r`.
- Majburiy yangilashda bitta raqamni o‘zgartirish: `Password1` → `Password2`.
- Parollarni telefondagi eslatmada yoki jadvalda saqlash.
- Parollarni chatlarda va pochta orqali yuborish.

NIST’ning amaldagi tavsiyalari ham parollarni sababsiz muntazam almashtirishga majburlamaslikni maslahat beradi: parolni sizib chiqish belgilari bo‘lganda almashtirish kerak.

## FAQ

### Parol qancha uzun bo‘lishi kerak?

Eslab qoladigan parollar uchun kamida to‘rtta tasodifiy so‘z, menejer master-paroli uchun besh-oltita. Menejerda yaratilgan parollar uchun yaxshi standart variant — 16 va undan ortiq tasodifiy belgi.

### Parolim sizib chiqqanini qanday bilaman?

Pochtangizni Have I Been Pwned kabi sizib chiqishlar haqida xabar beruvchi servisda tekshiring va parol menejeri yoki brauzerda sizib chiqish haqidagi ogohlantirishlarni yoqing. Akkaunt sizib chiqishda ko‘rinsa, shu parolni va u takrorlangan barcha joylarni almashtiring.

### Parollarni brauzerda saqlash xavfsizmi?

Zamonaviy brauzerlarning o‘rnatilgan menejerlari parollarni takrorlash yoki eslatmalarda saqlashdan ancha yaxshi. Brauzer profilini kuchli akkaunt paroli va 2FA bilan himoyalang. Alohida parol menejeri esa kirish ma’lumotlarini qulay ulashish imkonini beradi va turli brauzerlarda ishlaydi.
