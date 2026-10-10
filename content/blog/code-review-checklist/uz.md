---
title: "Code review chek-listi: pull requestda nimani tekshirish kerak"
description: Amaliy code review chek-listi: to‘g‘rilik, o‘qiluvchanlik, testlar, xavfsizlik va unumdorlik, shuningdek izohlarni konstruktiv berish va qabul qilish.
summary: Yaxshi review tartib bilan tekshiradi: kod vazifani hal qiladimi, tushunarlimi, testlar bormi, xavfsizlik teshiklari va tor joylar yo‘qmi — izohlar esa insonga emas, kodga yoziladi.
---

## Birinchi navbatda nimani tekshirish kerak

Review — imlo xatolarini qidirish emas. Uning maqsadi — o‘zgarish **vazifani hal qilishi, qolgan qismini buzmasligi va keyingi dasturchiga tushunarli bo‘lishiga** ishonch hosil qilish. Muhimdan maydaga qarab boring:

1. To‘g‘rilik.
2. Arxitektura va o‘qiluvchanlik.
3. Testlar.
4. Xavfsizlik.
5. Unumdorlik.
6. Uslub — buni odamlar emas, linter va formatter tekshirsin.

## Reviewdan oldin: muallifning tayyorgarligi

- PR kichik va bitta vazifa haqida. Katta PR yuzaki tekshiriladi.
- Tavsifda: nima qilingan, nima uchun, qanday tekshirish kerak, vazifaga havola.
- CI yashil: testlar, linter, build.
- Muallif yuborishdan oldin o‘z diffini o‘zi ko‘rib chiqqan.

## Reviewer chek-listi

### To‘g‘rilik

- Kod vazifada tasvirlangan ishni bajaradimi?
- Chegaraviy holatlar ko‘rib chiqilganmi: bo‘sh ro‘yxatlar, `null`, nol va manfiy qiymatlar, juda uzun satrlar?
- Tarmoq, ma’lumotlar bazasi yoki tashqi API xatosida nima bo‘ladi?
- Parallel so‘rovlarda poyga holatlari (race condition) yo‘qmi?
- Baza migratsiyalari orqaga qaytariladiganmi va mavjud ma’lumotlar uchun xavfsizmi?

### O‘qiluvchanlik va tuzilma

- O‘zgaruvchi, funksiya va klass nomlari izohsiz tushunarlimi?
- Ajratish kerak bo‘lgan uzun funksiyalar yo‘qmi?
- Kod mavjud utilitani takrorlamayaptimi?
- O‘zgarish to‘g‘ri qatlamdami (UI, biznes-mantiq, ma’lumotlarga kirish)?
- Izohlar «nima»ni qayta aytmasdan, «nega»ni tushuntiradimi?

### Testlar

- Yangi mantiq va tuzatilgan xato uchun testlar bormi?
- Testlar amalga oshirish tafsilotlarini emas, xatti-harakatni tekshiradimi?
- Kod buzilsa, test yiqiladimi? Doim o‘tadigan test foydasiz.

### Xavfsizlik

- Foydalanuvchi kiritgan ma’lumotlar serverda validatsiya qilinadimi?
- Bazaga so‘rovlar parametrlanganmi, SQL satrlardan yig‘ilmayaptimi?
- Kirish huquqlari tekshiriladimi: foydalanuvchi aynan shu ma’lumotlarni ko‘ra va o‘zgartira oladimi?
- Kod va loglarda sirlar, tokenlar va parollar yo‘qmi?
- Yangi bog‘liqliklar ishonchli manbalardanmi va haqiqatan kerakmi?

### Unumdorlik

- Sikl ichida bazaga so‘rovlar yo‘qmi (N+1 muammosi)?
- Katta tanlovlar uchun sahifalash va kerakli indekslar bormi?
- Og‘ir operatsiyalar foydalanuvchiga javobni bloklamayaptimi?

## Izohlarni qanday yozish kerak

Izoh muallif haqida emas, kod haqida. Taqqoslang:

| Yomon | Yaxshiroq |
|---|---|
| «Bu noto‘g‘ri» | «Bo‘sh ro‘yxatda bu yerda xato chiqadi — tekshiruv qo‘shsak-chi?» |
| «Nega bunday qilding?» | «Tushunishga yordam bering: nega X emas, aynan shu yondashuv?» |
| «Qayta qil» | «Alohida funksiyaga chiqarishni taklif qilaman — testlash osonroq» |

Foydali odatlar:

- Muhimlikni belgilang: **bloker**, **taklif**, **mayda narsa (nit)**. Muallif nima majburiy, nima ixtiyoriy ekanini tushunadi.
- Faqat talabni emas, sababni ham tushuntiring.
- Muvaffaqiyatli yechimlarni ham belgilang — bu ham fikr-mulohaza.
- Muhokama ko‘p xabarga cho‘zilsa, qo‘ng‘iroq qiling.

## Izohlarni qanday qabul qilish kerak

- Sizni emas, kodni review qilishadi. Izoh — malakangizga baho emas.
- Rozi bo‘lmasangiz, e’tiborsiz qoldirmang, dalil keltiring.
- Har bir izohga javob bering: tuzatildi, muhokama qilinmoqda yoki sababi bilan qoldirildi.
- Takrorlanuvchi izohlar — linterga qoida yoki jamoa qo‘llanmasiga band qo‘shish uchun sabab.

## FAQ

### Bitta pull request uchun necha qator maqbul?

Universal raqam yo‘q. Mo‘ljal — reviewer bir o‘tirishda diqqat bilan ko‘rib chiqa oladigan PR. Agar bu imkonsiz bo‘lsa, o‘zgarishni bir nechta ketma-ket PRga bo‘ling.

### Reviewni kim qilishi kerak?

Kamida tizimning tegishli qismini biladigan bitta odam. Ba’zan loyihaning boshqa qismlaridagi hamkasblarni ham jalb qilish foydali — shunda bilim jamoa bo‘ylab tarqaladi.

### Reviewni avtomatik tekshiruvlar bilan almashtirish mumkinmi?

Yo‘q, lekin avtomatika rutinani olib tashlaydi: formatlash, uslub, tiplar, ma’lum zaifliklar. Shunda odamlar vaqtini mantiq, arxitektura va o‘zgarishlar mazmuniga sarflaydi.
