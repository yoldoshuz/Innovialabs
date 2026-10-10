---
title: .uz domenini qanday ro‘yxatdan o‘tkazish: talablar va tartib
description: .uz domenini ro‘yxatdan o‘tkazish: akkreditatsiyalangan registratorni tanlash, jismoniy va yuridik shaxslar uchun hujjatlar, uzaytirish va rad sabablari.
summary: .uz domeni faqat akkreditatsiyalangan registrator orqali ro‘yxatdan o‘tkaziladi: nom bo‘shligini tekshirasiz, egasi haqidagi aniq ma’lumotlar bilan ariza berasiz, ishlaydigan DNS-serverlarni ko‘rsatasiz, to‘laysiz va keyin o‘z vaqtida uzaytirasiz.
---
## Qisqa javob

Milliy .uz zonasini reyestr boshqaradi, mijozlar bilan esa bevosita **akkreditatsiyalangan registratorlar** ishlaydi. Tartib quyidagicha: registratorni tanlash, nom bo‘shligini tekshirish, egasi haqidagi aniq ma’lumotlar bilan arizani to‘ldirish, DNS-serverlarni ko‘rsatish, to‘lash va faollashtirishni kutish. Keyin esa uzaytirishni unutmaslik.

Akkreditatsiyalangan registratorlar ro‘yxati va zonaning amaldagi qoidalari reyestrning rasmiy sayti — cctld.uz’da e’lon qilinadi. Ro‘yxatdan o‘tkazishdan oldin u bilan solishtiring: talablar yangilanishi mumkin.

## 1-qadam. Akkreditatsiyalangan registratorni tanlang

Domenni tasodifiy vositachi orqali ro‘yxatdan o‘tkazish xavfli: agar u akkreditatsiyadan o‘tmagan bo‘lsa, boshqa registrator xizmatini qayta sotadi va muammo yuzaga kelganda nazoratni tiklash qiyinroq bo‘ladi.

Nimaga qarash kerak:
- registrator reyestr saytidagi **rasmiy ro‘yxatda** bormi;
- qulay boshqaruv paneli: DNS, kontaktlarni o‘zgartirish, uzaytirish;
- avtomatik uzaytirish va muddat haqida bildirishnomalar;
- faqat birinchi ro‘yxatdan o‘tkazish emas, uzaytirish narxi ham;
- kompaniya bo‘lsangiz, shartnoma asosida ishlash imkoniyati.

## 2-qadam. Nomni tekshiring

Nom bo‘shligini reyestr yoki registrator saytidagi WHOIS xizmati orqali tekshiring. Ikkinchi darajali nomlar uchun umumiy qoidalarni hisobga oling: lotin harflari, raqamlar va chiziqcha, boshida va oxirida chiziqchasiz. Ayrim nomlar **band qilib qo‘yilgan** bo‘lishi mumkin — masalan, davlat organlari bilan bog‘liq nomlar. Nom brend uchun kerak bo‘lsa, tovar belgilarini ham oldindan tekshiring.

## 3-qadam. Egasi haqidagi ma’lumotlarni tayyorlang

Domen egasi — reyestrda ko‘rsatilgan shaxs. Bu xodim, veb-studiya yoki tanish emas, balki **siz yoki kompaniyangiz** bo‘lishi kerak.

| Egasi | Odatda nima talab qilinadi |
|---|---|
| Jismoniy shaxs | F.I.Sh., pasport ma’lumotlari, manzil, telefon, elektron pochta |
| Yuridik shaxs | To‘liq nomi, STIR, yuridik manzil, rahbar ma’lumotlari, mas’ul shaxs kontaktlari |
| Yakka tartibdagi tadbirkor | Tadbirkor ma’lumotlari va YaTT ro‘yxatdan o‘tganlik ma’lumotlari |

Hujjatlarning aniq ro‘yxatini registrator zona qoidalariga muvofiq belgilaydi. Ba’zilari imzolangan ariza yoki kompaniyani ro‘yxatdan o‘tkazish hujjatining skan nusxasini so‘raydi. Norezidentlar uchun shartlarni tanlangan registratordan oldindan aniqlang.

## 4-qadam. DNS-serverlarni ko‘rsating

Ro‘yxatdan o‘tkazishda domenga xizmat ko‘rsatadigan **DNS-serverlarni** ko‘rsatish kerak: hosting, registrator yoki alohida DNS-provayder serverlari. Ular ishlayotgan va domeningiz haqida allaqachon «bilishi» muhim — noto‘g‘ri delegatsiya faollashtirishni kechiktirishi mumkin.

Serverlar domen uchun javob berayotganini quyidagi buyruq bilan tekshirish mumkin:

```bash
dig NS example.uz +short
dig @ns1.your-dns-provider.com example.uz SOA
```

## 5-qadam. To‘lang va faollashtirishni kuting

To‘lov va ma’lumotlar tekshirilgandan so‘ng domen faollashtiriladi. DNS o‘zgarishlari tarmoq bo‘ylab bir zumda tarqalmaydi, shuning uchun sayt hamma foydalanuvchilarda darhol ochilmasligi mumkin.

## Uzaytirish

- Domen to‘langan muddatga ro‘yxatdan o‘tkaziladi, so‘ng uni **uzaytirish** kerak.
- **Avtomatik uzaytirishni** yoqing va egasining pochtasini dolzarb holda saqlang: bildirishnomalar o‘sha yerga keladi.
- O‘z vaqtida uzaytirilmasa, domen ishlashdan to‘xtaydi, imtiyozli davr tugagach esa bo‘shab, boshqa birovga o‘tishi mumkin. Aniq muddatlar zona qoidalarida va registratorda ko‘rsatilgan.
- Ayniqsa sayt va pochta biznes uchun muhim bo‘lsa, oldindan uzaytiring.

## Rad etish va kechikishning ko‘p uchraydigan sabablari

- Egasi haqidagi **to‘liq bo‘lmagan yoki noaniq ma’lumotlar**, hujjatlar bilan nomuvofiqlik.
- Kompaniya nomi yoki STIR xato bilan ko‘rsatilgan.
- Nom **band, zaxiralangan** yoki zona qoidalarini buzadi.
- **DNS-serverlar ishlamaydi** yoki ularda domen sozlanmagan.
- Hisob to‘lanmagan yoki to‘lov yetib kelmagan.
- Nom boshqalarning huquqlarini buzadi yoki ruxsat etilmagan so‘zlarni o‘z ichiga oladi.

## FAQ

### .uz domenini boshqa registratorga o‘tkazish mumkinmi?

Ha, zona qoidalarida registratorni almashtirish nazarda tutilgan. Odatda buning uchun domen to‘langan, egasi haqidagi ma’lumotlar dolzarb bo‘lishi va so‘rovni egasining o‘zi tasdiqlashi kerak. Tartibni yangi registratordan aniqlang.

### .uz domeni egasini almashtirsa bo‘ladimi?

Ha, domenga bo‘lgan huquqlarni zona qoidalarida belgilangan tartibda topshirish mumkin. Qoida tariqasida joriy va yangi egasining tasdig‘i talab qilinadi.

### Nega sayt ro‘yxatdan o‘tkazilgandan keyin darhol ochilmaydi?

Ko‘pincha DNS tarqalishi sababli: yozuvlar turli provayderlarda bir vaqtda yangilanmaydi. Shuningdek, DNS-serverlar to‘g‘ri ko‘rsatilganini va ularda sayt uchun kerakli yozuvlar borligini tekshiring.
