---
title: Hosting nima va u qanday ishlaydi
description: Hosting haqida sodda tushuntirish: sayt jismonan qayerda turadi, provayder nima beradi va tashrif buyuruvchining so‘rovi saytga qanday yetib boradi.
summary: Hosting — bu doimo internetga ulangan serverda joy va resurslarni ijaraga olish: sayt fayllari o‘sha yerda saqlanadi va har bir tashrif buyuruvchiga o‘sha yerdan uzatiladi.
---
## Qisqa javob

Sayt — bu fayllar, dastur kodi va odatda ma’lumotlar bazasi to‘plami. Uni dunyoning istalgan joyidan ochish uchun bu fayllar **kechayu kunduz ishlaydigan, tezkor internetga ulangan va doimiy manzilga ega** kompyuterda turishi kerak. Bunday kompyuter **server** deb ataladi, uning resurslarini taqdim etish xizmati esa **hosting** deyiladi.

Serverni o‘z ofisingizda saqlash mumkin, lekin bu noqulay: zaxira elektr ta’minoti, sovutish, barqaror aloqa kanali va bularning barchasiga qaraydigan mutaxassis kerak bo‘ladi. Shuning uchun kompaniyalar resurslarni **hosting provayderdan** ijaraga oladi, provayder esa serverlarini **data-markazlarda** joylashtiradi.

## Sayt jismonan qayerda turadi

Data-markaz — bu server stoykalari, sovutish tizimlari, zaxira generatorlar va turli operatorlardan bir nechta aloqa kanallari bo‘lgan bino. Saytingiz tarifga qarab bitta server resurslarining bir qismini, butun serverni yoki bir nechta serverni egallaydi.

Data-markaz joylashuvi ikki sababga ko‘ra muhim:

- **Tezlik.** Server auditoriyaga qanchalik yaqin bo‘lsa, sahifalar shunchalik tez ochiladi.
- **Qonunchilik.** Ayrim davlatlarda, jumladan O‘zbekistonda, fuqarolarning shaxsiy ma’lumotlarini mamlakat hududida saqlash talabi bor. Agar sayt bunday ma’lumotlarni yig‘sa, buni hosting tanlashda hisobga oling.

## Hosting provayder nima beradi

| Resurs | Amalda nimani anglatadi |
|---|---|
| **Protsessor va xotira (CPU, RAM)** | Sayt bir vaqtda sekinlashmasdan nechta so‘rovni qayta ishlay oladi |
| **Disk** | Fayllar, rasmlar, ma’lumotlar bazasi va zaxira nusxalar uchun joy |
| **Trafik va kanal** | Tashrif buyuruvchilarga qancha ma’lumot va qanday tezlikda uzatish mumkin |
| **IP-manzil** | Domen bog‘lanadigan serverning tarmoq manzili |
| **Boshqaruv paneli** | Fayllar, bazalar, pochta va SSL bilan ishlash uchun interfeys |
| **Zaxira nusxalash** | Nosozlikdan keyin saytni tiklash mumkin bo‘lgan muntazam nusxalar |
| **Qo‘llab-quvvatlash** | Nosozliklarda yordam, ba’zan serverni to‘liq boshqarish |

Har bir tarifda hammasi bo‘lavermaydi. Ayniqsa zaxira nusxalar va qo‘llab-quvvatlash ko‘pincha pullik qo‘shimcha bo‘ladi yoki arzon tariflarda umuman bo‘lmaydi.

## So‘rov saytga qanday yetib boradi

1. Foydalanuvchi brauzerga `example.uz` kabi manzilni kiritadi.
2. Brauzer **DNS** ga murojaat qiladi — bu domen nomini server IP-manziliga aylantiradigan tizim.
3. IP-manzilni olgach, brauzer server bilan ulanish o‘rnatadi. Saytda **SSL-sertifikat** bo‘lsa, ulanish shifrlanadi (HTTPS).
4. Serverda **veb-server** dasturi ishlaydi, masalan Nginx yoki Apache. U so‘rovni qabul qiladi va nima qaytarishni hal qiladi: tayyor faylmi yoki ilova natijasimi.
5. Dinamik saytda ilova (PHP, Node.js, Python va hokazo) ma’lumotlar bazasiga murojaat qiladi, sahifani yig‘adi va veb-serverga beradi.
6. Javob brauzerga qaytadi va brauzer sahifani chizadi.

Butun jarayon odatda soniyaning bir qismini oladi. Agar biror bosqichda xato bo‘lsa — DNS noto‘g‘ri joyga yo‘naltirsa, sertifikat muddati tugagan bo‘lsa yoki server ortiqcha yuklangan bo‘lsa — foydalanuvchi xatolikni ko‘radi.

## Domen va hosting — alohida xizmatlar

Ko‘p uchraydigan chalkashlik: **domen** — saytning nomi, **hosting** — sayt ishlaydigan joy. Ikkalasini bitta kompaniyadan olish mumkin, lekin bular ikki xil xizmat. Domenni o‘z kompaniyangiz nomiga ro‘yxatdan o‘tkazing va kirish ma’lumotlarini o‘zingizda saqlang. Shunda DNS yozuvlarini o‘zgartirib, hostingni istalgan vaqtda almashtirishingiz mumkin.

## Hostingning asosiy turlari

- **Virtual (shared) hosting** — bitta serverda ko‘plab saytlar. Arzon va oddiy, lekin resurslar umumiy.
- **VPS** — kafolatlangan resurslar va to‘liq kirish huquqiga ega virtual server.
- **Ajratilgan server** — faqat siz uchun butun jismoniy server.
- **Bulutli hosting va platformalar** — yuklamaga qarab kengayadigan resurslar, ko‘pincha haqiqiy foydalanish uchun to‘lov bilan.

## Tanlashda nimaga e’tibor berish kerak

- **Loyiha talablari:** dasturlash tili, ma’lumotlar bazasi, kutilayotgan yuklama.
- **Data-markaz joylashuvi** va ma’lumotlarni saqlash bo‘yicha qonun talablari.
- **Zaxira nusxalar:** qanchalik tez-tez olinadi, qayerda saqlanadi, qanchalik tez tiklanadi.
- **Qo‘llab-quvvatlash:** javob berish vaqti va muloqot tili.
- **Kengaytirish:** ko‘chmasdan resurslarni oshirish mumkinmi.
- **Narx shaffofligi:** faqat birinchi davr emas, uzaytirish narxi ham.

## FAQ

### Saytni o‘z kompyuterimda joylashtirsam bo‘ladimi?

Texnik jihatdan ha, lekin kompyuter uzluksiz ishlashi, statik IP va himoyalangan ulanishga ega bo‘lishi kerak. Ishchi sayt uchun bu ishonchsiz: elektr yoki internet uzilishi saytni ishdan chiqaradi.

### Sayt konstruktorda yaratilgan bo‘lsa, hosting kerakmi?

Konstruktorlar odatda hostingni obunaga qo‘shib beradi, shuning uchun uni alohida sotib olish shart emas. Biroq bunday saytni boshqa provayderga ko‘chirish odatda imkonsiz.

### Hosting uzaytirilmasa, saytga nima bo‘ladi?

Provayder saytni to‘xtatib qo‘yadi va ma’lum muddatdan keyin ma’lumotlarni o‘chirishi mumkin. Muddatlar shartnomaga bog‘liq, shuning uchun avtomatik uzaytirishni yoqing va o‘z zaxira nusxalaringizni saqlang.
