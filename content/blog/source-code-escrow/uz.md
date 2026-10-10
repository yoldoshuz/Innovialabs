---
title: Manba kodi escrow: dasturiy ta’minot xaridorini himoyalash
description: Source code escrow qanday ishlaydi: shartnoma tomonlari, kodni berish shartlari, depozitni tekshirish va escrow qachon o‘zini oqlashi haqida.
summary: Source code escrow — kod mustaqil agentda saqlanadigan va ishlab chiquvchi majburiyatlarini bajarmay qo‘ysa xaridorga beriladigan shartnoma. U muhim tizimlar uchun foydali, lekin faqat depozit muntazam tekshirilsa.
---

## Source code escrow nima

**Source code escrow** — ishlab chiquvchi (litsenziar), xaridor (litsenziat) va mustaqil **escrow-agent** o‘rtasidagi uch tomonlama shartnoma. Ishlab chiquvchi agentga manba kodi, hujjatlar va yig‘ish yo‘riqnomasini topshiradi. Xaridor kodni oldindan kelishilgan hodisa — **berish sharti (release trigger)** — yuz bermaguncha ko‘rmaydi. Shunda agent depozitni xaridorga beradi va u tizimni o‘zi qo‘llab-quvvatlay oladi.

Escrow aniq muammoni hal qiladi: siz biznesingiz bog‘liq bo‘lgan dasturga litsenziya sotib oldingiz, ammo kod yetkazib beruvchiga tegishli. Agar yetkazib beruvchi yo‘qolsa, kodsiz xatoni tuzatish yoki tizimni ko‘chirish imkonsiz.

## Shartnoma qanday tuzilgan

Odatiy sxema:

1. Tomonlar agent bilan shartnoma imzolaydi va depozit tarkibini belgilaydi.
2. Ishlab chiquvchi birinchi depozitni yuklaydi va uni jadval bo‘yicha, masalan har bir relizdan keyin yangilab boradi.
3. Agent materiallarni saqlaydi va kerak bo‘lganda tekshiradi.
4. Shart yuz berganda xaridor ariza beradi, ishlab chiquvchi belgilangan muddatda e’tiroz bildirishi mumkin.
5. E’tiroz bo‘lmasa yoki u xaridor foydasiga hal qilinsa, agent depozitni beradi.

Berilgan koddan odatda **faqat sotib olingan tizimni qo‘llab-quvvatlash** uchun foydalanish mumkin, qayta sotish uchun emas. Bu shartnomada qayd etiladi.

## Odatiy berish shartlari

- Ishlab chiquvchining **bankrotligi yoki tugatilishi**.
- Mahsulotni **qo‘llab-quvvatlashning to‘xtatilishi** yoki SLA majburiyatlaridan voz kechish.
- Qo‘llab-quvvatlash shartnomasining kelishilgan muddatda bartaraf etilmagan **jiddiy buzilishi**.
- **Egasining almashishi**, shundan keyin mahsulot rivojlanmay qolishi.

Shartlar tekshiriladigan bo‘lishi kerak. «Yetkazib beruvchi yomon ishlayapti» — bahsli shart. «Kritik xato xabardan keyin N kun ichida tuzatilmadi» — aniq shart.

## Depozitni tekshirish — eng muhim qism

Escrowning eng ko‘p uchraydigan muammosi — foydalanib bo‘lmaydigan depozit: eskirgan kod, bog‘liqliklar yo‘q, yig‘ish yo‘riqnomasi yo‘q. Shuning uchun shartnomada **verifikatsiya** ko‘zda tutilishi kerak:

| Tekshiruv darajasi | Nima tekshiriladi |
|---|---|
| Asosiy | Fayllar o‘qiladi, buzilmagan, ro‘yxati bor |
| To‘liqlik | Barcha kod, yig‘ish skriptlari, BD sxemalari va hujjatlar bor |
| Yig‘ish | Agent yoki ekspert loyihani yo‘riqnoma bo‘yicha yig‘adi |
| Funksional | Yig‘ilgan tizim ishga tushadi va produksiondagidek ishlaydi |

Tekshiruv qanchalik chuqur bo‘lsa, shunchalik qimmat, ammo faqat yig‘ish va ishga tushirish depozit yaroqliligini haqiqatan isbotlaydi.

## Depozitga nimalarni kiritish kerak

- barcha komponentlarning manba kodi, ichki kutubxonalar ham;
- yig‘ish va deploy skriptlari, CI/CD konfiguratsiyalari;
- uchinchi tomon bog‘liqliklari va ularning versiyalari ro‘yxati;
- ma’lumotlar bazasi sxemalari va migratsiyalar;
- noldan joylashtirish yo‘riqnomasi;
- asosiy arxitektura hujjatlari.

Produksion sirlar va parollar depozitga qo‘yilmaydi — ularni qanday qayta yaratish tasvirlanadi.

## Escrow qachon o‘zini oqlaydi, qachon yo‘q

**O‘zini oqlaydi**, agar:

- tizim operatsiyalar uchun muhim va uning to‘xtashi qimmatga tushsa;
- yetkazib beruvchi kichik yoki yangi bo‘lsa;
- tizimni almashtirish ko‘p vaqt olsa;
- shartnoma bo‘yicha kod sizga tegishli bo‘lmasa.

**Kerak emas**, agar:

- kod shartnoma bo‘yicha baribir sizga o‘tsa (masalan, huquqlar o‘tkaziladigan buyurtma asosidagi ishlab chiqish);
- mahsulotni osongina almashtirish mumkin bo‘lsa;
- bu SaaS bo‘lsa — infratuzilma va ma’lumotlarsiz kod kam foyda beradi, ma’lumotlarni eksport qilish huquqi va uzluksizlik rejasi muhimroq.

## Ko‘p uchraydigan xatolar

- Shartnomani imzolab, depozitni hech qachon yangilamaslik.
- Yig‘ish tekshiruvini o‘tkazmaslik.
- Osongina bahslashiladigan noaniq berish shartlari.
- Kodni qo‘llab-quvvatlay oladigan odamlar kerak bo‘lishini hisobga olmaslik.

## FAQ

### Escrow kodga egalik qilishdan nimasi bilan farq qiladi?

Huquqlar o‘tkazilganda kod birinchi kundan sizniki. Escrowda kod ishlab chiquvchida qoladi, siz uni faqat kelishilgan hodisalar yuz berganda va cheklangan foydalanish huquqlari bilan olasiz.

### Escrow SaaS uchun mos keladimi?

Qisman. SaaS uchun kod depozitini ma’lumotlaringizni muntazam eksport qilish va infratuzilma tavsifi bilan birlashtirgan ma’qul, aks holda xizmatni o‘zingiz tiklashingiz qiyin bo‘ladi.

### Escrow uchun kim to‘laydi?

Bu kelishuv masalasi. Ko‘pincha xaridor to‘laydi, chunki escrow uning manfaatlarini himoya qiladi, lekin xarajatlarni bo‘lishish yoki litsenziya narxiga kiritish mumkin.
