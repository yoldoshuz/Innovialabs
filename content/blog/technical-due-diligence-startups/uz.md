---
title: Texnik due diligence: investorlar startapda nimani tekshiradi
description: Investitsiyadan oldin texnik due diligence nimani tekshiradi: kod, arxitektura, xavfsizlik, IP huquqlari, odamlarga bog‘liqlik va hujjatlar.
summary: Investorlar mahsulot o‘sishga bardosh berishi va unda yashirin xavflar yo‘qligini tekshiradi: kod va arxitektura sifati, xavfsizlik, kodga huquqlarning tozaligi, asosiy odamlarga bog‘liqlik va hujjatlar.
---

## Qisqa javob

Texnik due diligence ikki savolga javob beradi: **mahsulot o‘sishga bardosh beradimi** va **unda bitim qiymatini tushiradigan xavflar yo‘qmi**. Olti soha tekshiriladi: kod, arxitektura, xavfsizlik, intellektual mulk huquqlari, odamlarga bog‘liqlik va hujjatlar. Maqsad mukammal kodni topish emas, balki muammolar qanchalik jiddiy ekani va ularni tuzatish qanchaga tushishini tushunish.

## Nima tekshiriladi

### Kod sifati

- O‘qilishi va yagona uslub, code review mavjudligi.
- Asosiy mantiqqa avtotestlar va ularning CI’da haqiqatan ishga tushishi.
- Texnik qarz: eskirgan bog‘liqliklar, tashlab qo‘yilgan modullar, «vaqtinchalik» yechimlar.
- Git tarixi: muntazam mazmunli commit’lar yoki kamdan-kam ulkan o‘zgarishlar.

### Arxitektura va masshtablanuvchanlik

- Yuklama oshganda tizimni to‘liq qayta yozmasdan bardosh berish mumkinmi.
- Ma’lumotlar bazasi, navbatlar, keshlar, tashqi xizmatlar qanday tuzilgan.
- Yagona ishdan chiqish nuqtalari bormi.
- Infratuzilma qancha turadi va foydalanuvchilar soni bilan qanday o‘sadi.

### Xavfsizlik

- Parollar va maxfiy kalitlar qanday saqlanadi (kodda emas, ochiq ko‘rinishda emas).
- Xodimlarning prodakshn va ma’lumotlarga kirish huquqlari.
- Shaxsiy ma’lumotlarni qayta ishlash va qonun talablariga muvofiqlik.
- Zaxira nusxalar va tekshirilgan tiklash jarayoni.
- Bog‘liqliklardagi ma’lum zaifliklar.

### Intellektual mulk huquqlari

Eng nozik nuqtalardan biri:

- Barcha xodimlar, frilanserlar va pudratchilar kodga bo‘lgan huquqlarini kompaniyaga o‘tkazganmi?
- Qaysi open-source kutubxonalar ishlatiladi va ularning litsenziyalari biznes modelga mosmi?
- Kodning bir qismi asoschi tomonidan kompaniya tashkil topishidan oldin yozilib, huquqlar keyin o‘tkazilmaganmi?

Bu yerdagi bo‘shliq, mahsulot texnik jihatdan a’lo bo‘lsa ham, bitimni to‘xtatib qo‘yishi mumkin.

### Odamlarga bog‘liqlik

- Tizimning asosiy qismlarini necha kishi tushunadi.
- Texnik hammuassis yoki yagona backend dasturchi ketsa nima bo‘ladi.
- Domenlar, bulut, repozitoriylarga kirish kimga tegishli — kompaniyagami yoki shaxslargami.

### Hujjatlar va jarayonlar

- Arxitektura tavsifi va loyihani noldan qanday joylashtirish.
- Reliz jarayoni, monitoring, insidentlarga javob.
- Roadmap va jamoaning texnik qarzni tushunishi.

## Qanday tayyorlanish kerak

| Qadam | Nima qilish kerak |
|---|---|
| Kirish huquqlari | Barcha akkauntlarni korporativga o‘tkazish, shaxsiylarini olib tashlash |
| Huquqlar | Kodning barcha mualliflari bilan shartnoma va huquq o‘tkazish hujjatlarini yig‘ish |
| Litsenziyalar | Bog‘liqliklar ro‘yxatini litsenziyalari bilan tuzish |
| Xavfsizlik | Maxfiy kalitlarni repozitoriydan olib tashlash, zaif paketlarni yangilash |
| Hujjatlar | Arxitektura, deploy va asosiy qarorlarni tavsiflash |
| Texnik qarz | Ma’lum muammolar va ularni hal qilish rejasini halol sanab o‘tish |

## Ko‘p uchraydigan xatolar

- Ma’lum muammolarni yashirish: baribir topiladi, ishonch esa yo‘qoladi.
- Manba kodi yoki bulutni asoschilarning shaxsiy akkauntlarida saqlash.
- Ilk versiyalarni yozgan frilanserlar bilan imzolangan hujjatlarning yo‘qligi.
- Bitimdan oldingi so‘nggi haftada tayyorlanishni boshlash.

## FAQ

### Tekshiruvdan o‘tish uchun mukammal kod kerakmi?

Yo‘q. Investorlar startapda texnik qarz borligini tushunadi. Jamoa uni anglashi hamda xavfsizlik va huquqlarda jiddiy xavflar yo‘qligi muhimroq.

### Texnik due diligence’ni kim o‘tkazadi?

Odatda investor yollagan tashqi texnik ekspertlar yoki maslahatchilar, ba’zan fondning o‘z texnik mutaxassislari. Ular kodga kirish huquqini oladi va jamoa bilan suhbat o‘tkazadi.

### Tekshiruv qancha davom etadi?

Mahsulot hajmi va bitim bosqichiga bog‘liq. Tayyorlangan hujjatlar va kirish huquqlari uni sezilarli tezlashtiradi.
