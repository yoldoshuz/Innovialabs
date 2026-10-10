---
title: Aptaym va SLA nima: 99,9% va 99,99% o‘rtasidagi farq
description: Aptaym foizlarini oy va yil davomidagi haqiqiy to‘xtash daqiqalariga aylantiramiz, SLA nimani kafolatlashi va kompensatsiya qanday ishlashini tushuntiramiz.
summary: 99,9% aptaym oyiga 43 daqiqagacha to‘xtashni anglatadi, 99,99% esa taxminan 4 daqiqani. SLA shu darajani va’da qiladi, lekin buzilganda odatda yo‘qotishlaringiz emas, keyingi hisobga chegirma qoplanadi.
---

## Qisqa javob

**Aptaym** — xizmat ishlab turgan vaqt ulushi. **SLA** (Service Level Agreement) — shartnomaning provayder ma’lum aptaymni va’da qiladigan va va’da bajarilmasa nima bo‘lishini tavsiflaydigan qismi.

Har bir qo‘shimcha «to‘qqiz» ruxsat etilgan to‘xtash vaqtini taxminan o‘n barobar qisqartiradi:

| Aptaym | Oyiga to‘xtash (30 kun) | Yiliga to‘xtash |
|---|---|---|
| 99% | 7 soat 12 daq | 3 kun 15 soat 36 daq |
| 99,5% | 3 soat 36 daq | 1 kun 19 soat 48 daq |
| 99,9% | 43 daq 12 s | 8 soat 45 daq |
| 99,95% | 21 daq 36 s | 4 soat 22 daq |
| 99,99% | 4 daq 19 s | 52 daq 34 s |
| 99,999% | 26 s | 5 daq 15 s |

Hisob oddiy: to‘xtash ulushini davrdagi daqiqalar soniga ko‘paytiring. 99,9% uchun bu oydagi 43 200 daqiqaning 0,1 foizi, ya’ni 43,2 daqiqa.

## Amalda 99,9% va 99,99% nimani anglatadi

- **99,9%** — xizmat oyiga 43 daqiqagacha ishlamasligi mumkin, masalan, tunda bitta nosozlik. Ko‘pchilik korporativ saytlar, lendinglar va ichki tizimlar uchun bu me’yoriy daraja.
- **99,99%** — oyiga atigi 4 daqiqa atrofida. Bu vaqt ichida odam nima bo‘lganini tushunishga ham ulgurmaydi. Bunday daraja zaxira tizimlarga avtomatik o‘tishni, bir nechta mavjudlik zonalarini va navbatchi jamoani talab qiladi.

Har bir keyingi «to‘qqiz» sezilarli darajada qimmatroq: ortiqcha infratuzilma, monitoring, tiklashning sinalgan tartiblari kerak. Shuning uchun savol «nechta to‘qqiz istaymiz» emas, balki **biznesingiz uchun bir soatlik to‘xtash qancha turadi**.

## SLA aslida nimani kafolatlaydi

SLA’ni o‘qiyotganda tafsilotlarga e’tibor bering:

- **Nima to‘xtash hisoblanadi.** To‘liq ishlamaslikmi? Xatolar ulushi chegaradan oshishimi? Sekin javoblar odatda hisobga olinmaydi.
- **Qanday o‘lchanadi.** To‘xtashni kim qayd etadi — provayder yoki siz, foiz qaysi davr uchun hisoblanadi.
- **Istisnolar.** Rejali ishlar, fors-major, siz tomondagi muammolar, beta-funksiyalar odatda kafolatga kirmaydi.
- **Shartlar.** Ayrim SLA’lar faqat ma’lum arxitekturada amal qiladi, masalan, resurslar bir nechta mavjudlik zonasida joylashtirilgan bo‘lsa.

## Kompensatsiya qanday ishlaydi

Ko‘pchilik uchun bu eng katta hafsala pirligi: SLA sug‘urta emas.

- Kompensatsiya odatda pul emas, **kreditlar** — kelgusi hisoblarga chegirma sifatida beriladi.
- Kredit miqdori **aynan shu xizmatning** oylik narxidan foiz bo‘lib, aptaym qanchalik tushganiga bog‘liq.
- U deyarli har doim xizmatning oylik narxi bilan cheklangan.
- Uni belgilangan muddatda **o‘zingiz so‘rashingiz** va dalil ilova qilishingiz kerak.
- **Boy berilgan tushum, mijozlar jarimalari va obro‘ yo‘qotishlari qoplanmaydi.**

Agar bir soatlik to‘xtash sizga hosting uchun oylik hisobdan bir necha barobar qimmatga tushsa, ishonchlilikni shartnoma emas, arxitektura orqali ta’minlash kerak.

## Butun tizim aptaymi uning qismlarinikidan past

Sayt bir nechta xizmatga bog‘liq bo‘lsa, ularning mavjudligi o‘zaro ko‘paytiriladi. 99,9% li server va 99,9% li ma’lumotlar bazasi, ikkalasisiz sayt ishlamasa, birgalikda taxminan 99,8% beradi — bu oyiga 86 daqiqa atrofida mumkin bo‘lgan to‘xtash. Ketma-ket bog‘liqliklar qancha ko‘p bo‘lsa, yakuniy raqam shuncha past.

## Amalda nima qilish kerak

1. Bir soatlik to‘xtash qancha turishini baholang: yo‘qotilgan buyurtmalar, qo‘llab-quvvatlashga qo‘ng‘iroqlar, obro‘.
2. Shu bahoga asoslanib maqsadli aptaymni tanlang.
3. Haqiqiy holatni ko‘rish va kompensatsiya so‘rash uchun dalilga ega bo‘lish maqsadida **tashqi monitoring** xizmatini ulang.
4. O‘zini oqlaydigan joylarda yagona nosozlik nuqtalarini yo‘qoting: baza replikasi, ilovaning ikkinchi nusxasi, alohida zona.
5. Zaxira nusxalardan tiklash haqiqatan ishlashini muntazam tekshirib turing.

## FAQ

### SLA va SLO o‘rtasida qanday farq bor?

**SLA** — provayder uchun oqibatlari bor tashqi majburiyat. **SLO** — jamoaning ichki maqsadi, odatda SLA’dan qat’iyroq bo‘ladi, shunda shartnoma buzilishigacha zaxira qoladi.

### Rejali ishlar to‘xtash vaqtiga kiradimi?

Odatda yo‘q, agar provayder ular haqida SLA’da tavsiflangan tartibda oldindan ogohlantirgan bo‘lsa. Shuning uchun bunday ishlar qanday va qancha oldin e’lon qilinishini o‘qib chiqish muhim.

### Kichik saytga 99,99% aptaym kerakmi?

Ko‘pincha yo‘q. Korporativ sayt yoki lending uchun ishonchli hosting, monitoring va zaxira nusxalar yetarli. Yuqori talablar to‘lovlar, onlayn xizmatlar va har bir daqiqalik to‘xtash to‘g‘ridan-to‘g‘ri pulga tushadigan tizimlar uchun o‘rinli.
