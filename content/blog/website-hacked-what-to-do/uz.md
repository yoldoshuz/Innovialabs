---
title: Sayt buzib kirildi: bosqichma-bosqich harakat rejasi
description: Sayt buzilganda xotirjam reja: izolyatsiya, dalillarni saqlash, kirish nuqtasini topish, tiklash, parollarni almashtirish va ogohlantirishlarni olish.
summary: Saytingiz buzilgan bo‘lsa, vahimaga tushib hammasini o‘chirmang: avval zararni cheklang va tahlil uchun nusxa oling, so‘ng hujumchi qanday kirganini toping, saytni toza manbadan tiklang, barcha parol va kalitlarni almashtiring, kerak bo‘lsa foydalanuvchilarni xabardor qiling va qidiruv tizimlaridan qayta tekshiruv so‘rang.
---

## Asosiysi: tartib bilan harakat qilish

Buzilish belgilari turlicha: begona saytlarga yo‘naltirish, qidiruvda g‘alati sahifalar, brauzer ogohlantirishi, domeningizdan spam, yangi administratorlar, yuklamaning keskin oshishi. Birinchi istak — tezda hammasini o‘chirib, qayta o‘rnatish. Bu xato: dalillar yo‘qoladi, **hujumchi kirgan teshik esa ochiq qoladi** va sayt yana buziladi.

Harakatlar tartibi:

1. Izolyatsiya qilish.
2. Dalillarni saqlash.
3. Kirish nuqtasini topish.
4. Tozalash va tiklash.
5. Barcha kirish ma’lumotlarini almashtirish.
6. Kerak bo‘lsa, xabardor qilish.
7. Qidiruv tizimlari ogohlantirishlarini olib tashlash.

## 1. Izolyatsiya qilish

Maqsad — tashrif buyuruvchilar va ma’lumotlarga yetkazilayotgan zararni to‘xtatish.

- **Texnik xizmat rejimini** yoqing yoki vaqtincha statik sahifa ko‘rsating.
- Server spam yuborayotgan yoki boshqalarga hujum qilayotgan bo‘lsa, chiquvchi trafikni cheklang yoki provayder paneli orqali serverni tarmoqdan uzing.
- Zarurat bo‘lmasa serverni butunlay o‘chirmang: xotira va vaqtinchalik fayllarda izlar bo‘lishi mumkin.
- Xosting provayderiga xabar bering — unda loglar va vositalar bo‘lishi mumkin.

## 2. Dalillarni saqlash

Har qanday tozalashdan oldin **to‘liq nusxa** oling: sayt fayllari, ma’lumotlar bazasi dampi, veb-server loglari, kirish loglari (SSH, boshqaruv paneli, CMS admin paneli). Server bulutli bo‘lsa, disk snapshotini oling.

Nusxani alohida saqlang va saytni undan tiklamang — u zararlangan. U nima bo‘lganini tushunish va, ehtimol, huquqni muhofaza qilish organlariga murojaat qilish uchun kerak.

## 3. Kirish nuqtasini topish

Bu qadamsiz tiklash befoyda. Qayerdan qidirish kerak:

- **Veb-server loglari** — alohida fayllarga g‘ayrioddiy POST so‘rovlar, yuklangan PHP fayllarga murojaatlar.
- **O‘zgartirilgan fayllar** — toza nusxa yoki CMS’ning asl distributivi bilan solishtiring; yaqinda o‘zgargan fayllarni va yuklamalar papkasidagi PHP’ni qidiring.
- **Hisoblar** — CMS’dagi yangi administratorlar, serverdagi yangi foydalanuvchilar va kalitlar.
- **Eskirgan komponentlar** — ma’lum zaifliklarga ega plagin, mavzu va kutubxonalar.
- **Sizib chiqqan parollar** — ishlamaydigan vaqtda yoki g‘ayrioddiy manzillardan haqiqiy hisoblar bilan kirishlar.

Ko‘p uchraydigan kirish nuqtalari: zaif plagin, o‘g‘irlangan administrator yoki FTP paroli, 2FA’siz ochiq admin panel, ochiq repozitoriydagi kalitlar.

## 4. Tozalash va tiklash

Eng ishonchlisi — **davolash emas, qayta tiklash**:

- Saytni toza serverda yoki toza muhitda joylashtiring.
- Kodni zararlangan serverdan emas, repozitoriydan yoki CMS’ning yangi distributividan oling.
- Bazani **buzilishdan oldin** olingan zaxira nusxadan tiklang. Bunday nusxa bo‘lmasa, uni zararli qo‘shimchalar va ortiqcha foydalanuvchilar bor-yo‘qligini qo‘lda tekshiring.
- Yuklangan fayllarni ular orasida bajariladigan kod yo‘qligiga ishonch hosil qilib ko‘chiring.
- **Kirish nuqtasini yoping**: komponentni yangilang, zaif plaginni o‘chiring, kodni tuzating.
- Qolgan hamma narsani yangilang va fayl o‘zgarishlari monitoringini yoqing.

## 5. Barcha kirish ma’lumotlarini almashtirish

Serverda saqlangan yoki undan foydalanish mumkin bo‘lgan hamma narsani buzilgan deb hisoblang:

- CMS administratorlari, xosting, FTP/SFTP, ma’lumotlar bazasi parollari;
- SSH kalitlari va kirish tokenlari;
- to‘lov tizimlari, pochta servislari, messenjerlarning API kalitlari;
- ilovaning maxfiy kalitlari (masalan, sessiyalarni imzolash uchun) — bu foydalanuvchilarni tizimdan chiqaradi va bu normal holat.

Imkoni bor hamma joyda ikki bosqichli autentifikatsiyani yoqing.

## 6. Kerak bo‘lsa, xabardor qilish

Agar **shaxsiy ma’lumotlar** — ismlar, telefonlar, pochta, parollar, buyurtma ma’lumotlari — sizib chiqqan bo‘lishi mumkin bo‘lsa, sizga taalluqli qonunlar talablarini tekshiring: mamlakatingizning shaxsiy ma’lumotlar to‘g‘risidagi qonunchiligi, Yevropa Ittifoqi aholisi bilan ishlasangiz — nazorat organini xabardor qilish uchun 72 soat muddat belgilagan GDPR. Bu yerda yurist maslahati foydali.

Foydalanuvchilarga nima bo‘lganini, qaysi ma’lumotlar zarar ko‘rganini va ular nima qilishi kerakligini — masalan, parol boshqa saytlarda ham ishlatilgan bo‘lsa, uni almashtirishni — halol aytgan ma’qul.

## 7. Qidiruv tizimlari ogohlantirishlarini olib tashlash

Brauzerlar yoki qidiruv tizimi «sayt xavfli bo‘lishi mumkin» deb ko‘rsatsa:

- **Google Search Console**da xavfsizlik muammolari hisobotini oching, ularni bartaraf eting va tekshiruv so‘rovini yuboring;
- **Yandex Webmaster**da xavfsizlik va qoidabuzarliklar bo‘limini tekshiring va qayta tekshiruv so‘rang;
- spam sahifalarni o‘chiring va sitemap’da ortiqcha manzillar qolmaganini tekshiring.

Tekshiruv biroz vaqt oladi, shuning uchun so‘rovni sayt tozaligiga ishonch hosil qilgandagina yuboring.

## FAQ

### Kechagi zaxira nusxani shunchaki tiklasa bo‘ladimi?

Faqat buzilish undan keyin sodir bo‘lganini aniq bilsangiz va bir vaqtda kirish nuqtasini yopgan bo‘lsangiz. Aks holda siz yo zararlangan versiyani, yo toza, lekin o‘sha zaiflikka ega versiyani tiklaysiz.

### Tovlamachilarga pul to‘lash kerakmi?

To‘lov ma’lumotlar qaytarilishini va ular e’lon qilinmasligini kafolatlamaydi. Qarorni yurist va mutaxassislar bilan birga qabul qilgan ma’qul, bunday ssenariydan ishonchli himoya esa — serverdan alohida saqlanadigan muntazam zaxira nusxalar.

### Sayt yana toza ekanini qanday bilish mumkin?

Begona fayllar va foydalanuvchilar yo‘q, fayllar repozitoriy bilan mos keladi, loglarda shubhali so‘rovlar yo‘q, tashqi skanerlar tahdid topmaydi. Tiklangandan keyin yana bir necha hafta monitoringni davom ettiring.
