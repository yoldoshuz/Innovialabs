---
title: IT-loyihaning qoplanishini (ROI) qanday hisoblash mumkin
description: IT-loyiha uchun ROI formulasi, tejash va daromad o‘sishini to‘liq egalik qiymati bilan solishtirish, hisob-kitob misoli va qoplanish muddati.
summary: ROI = (foyda − xarajat) / xarajat × 100%, bunda foyda — tanlangan davrdagi tejash va qo‘shimcha daromad, xarajat — qo‘llab-quvvatlashni ham o‘z ichiga olgan to‘liq egalik qiymati; qoplanish muddati to‘plangan foyda sarmoyani qachon qoplashini ko‘rsatadi.
---
## ROI formulasi

**ROI (return on investment)** har bir sarflangan pul birligiga qancha qaytishini ko‘rsatadi:

```text
ROI = (Foyda − Xarajat) / Xarajat × 100%
```

Ikkala qiymat ham **bir xil davr uchun** hisoblanadi — odatda 2-3 yil, chunki dasturiy ta’minot darhol o‘zini oqlamaydi. Ikkinchi asosiy ko‘rsatkich — **qoplanish muddati**: to‘plangan foyda sarmoyaga necha oyda tenglashadi.

## 1-qadam. To‘liq xarajatlarni hisoblang

Ko‘p uchraydigan xato — faqat dasturlash narxini hisobga olish. **TCO (total cost of ownership)**ni hisoblang:

- dasturlash: tahlil, dizayn, kod yozish, testlash;
- infratuzilma: serverlar, bulut, domenlar, uchinchi tomon API’lari;
- foydalaniladigan xizmatlar litsenziya va obunalari;
- ishga tushirilgandan keyingi qo‘llab-quvvatlash va takomillashtirish;
- joriy etish: xodimlarni o‘qitish, ma’lumotlarni ko‘chirish;
- jamoangizning vazifa qo‘yish va qabul qilishga sarflagan vaqti.

## 2-qadam. Foydani baholang

Foyda ikki xil bo‘ladi.

**Tejash:**

- avtomatlashtirish bo‘shatadigan xodim soatlari (soatlar × soat narxi);
- kamroq xatolar va ular bilan bog‘liq yo‘qotishlar;
- eski tizimlar va obunalardan voz kechish.

**Daromad o‘sishi:**

- yangi kanal (sayt, bot, ilova) orqali yangi sotuvlar;
- yuqoriroq konversiya yoki o‘rtacha chek;
- CRM va xabarnomalar hisobiga ko‘proq takroriy xaridlar.

**Ehtiyotkorlik bilan** baholang va hozirgi raqamlaringizga tayaning: qancha ariza yo‘qoladi, rutinaga qancha vaqt ketadi. Har bir taxminni yozib qo‘ying — ularga qaytishga to‘g‘ri keladi.

## 3-qadam. Hisob-kitob misoli

Shartli birliklardagi (sh.b.) shartli misol — kompaniya arizalarni qayta ishlashni avtomatlashtiruvchi CRM joriy etadi. Davr — 3 yil.

| Modda | Summa |
|---|---|
| Dasturlash va joriy etish (bir martalik) | 100 sh.b. |
| Qo‘llab-quvvatlash va infratuzilma | yiliga 20 sh.b. |
| Menejerlar vaqtini tejash | yiliga 60 sh.b. |
| Kamroq yo‘qotilgan arizalardan qo‘shimcha foyda | yiliga 20 sh.b. |

3 yillik xarajat: 100 + 20 × 3 = **160 sh.b.**
3 yillik foyda: (60 + 20) × 3 = **240 sh.b.**

ROI = (240 − 160) / 160 × 100% = **50%**

E’tibor bering: sotuvdan keladigan foyda sifatida butun tushumni emas, **sof foydani** hisoblang — aks holda ROI oshirib ko‘rsatiladi.

## 4-qadam. Qoplanish muddati

Oylik sof foyda: (80 − 20) / 12 = 5 sh.b.
Qoplanish muddati: 100 / 5 = **20 oy**.

Foyda kamdan-kam hollarda birinchi kundan paydo bo‘lishini unutmang: dasturlash va joriy etish davrida u nolga teng. Shuning uchun loyiha boshidan hisoblangan real qoplanish muddati uzoqroq bo‘ladi.

## Baholashni qanday ishonchliroq qilish mumkin

- **Uchta stsenariy hisoblang** — pessimistik, asosiy, optimistik.
- **MVP bilan boshlang**: asosiy gipotezani arzonroq tekshiring va raqamlarni real ma’lumotlarda aniqlashtiring.
- **Metrikalarni ishga tushirishdan oldin qayd eting**, keyin solishtirish uchun.
- **Nomoddiy ta’sirlarni** alohida hisobga oling: mijozlar qulayligi, ma’lumotlar shaffofligi, aniq odamlarga qaramlikning kamayishi. Ularni pulga aylantirish qiyin, lekin ular qarorga ta’sir qiladi.

## Ko‘p uchraydigan xatolar

- Faqat dasturlashni hisobga olib, qo‘llab-quvvatlashni unutish.
- Foyda o‘rniga tushumni hisoblash.
- Juda qisqa davr olish — dasturiy ta’minot kamdan-kam bir necha oyda o‘zini oqlaydi.
- Ishga tushirilgandan keyin hisobni tekshirmaslik.

## FAQ

### Qanday ROI yaxshi hisoblanadi?

Universal me’yor yo‘q. Loyiha ROI’sini muqobillar bilan solishtiring: xuddi shu pulni boshqa joyga sarflash yoki qo‘lda bajariladigan jarayonlar o‘sishda davom etsa, hech narsa qilmaslik narxi bilan.

### Foydani pulda baholash qiyin bo‘lsa-chi?

Bilvosita metrikalarni toping: arizani qayta ishlash vaqti, xatolar soni, takroriy mijozlar ulushi. Ularni soat narxi yoki mijozdan o‘rtacha foyda orqali pulga aylantiring, taxminlarni esa yozib qo‘ying.

### Inflyatsiya va pulning vaqt qiymatini hisobga olish kerakmi?

Yirik va uzoq loyihalar uchun — ha, diskontlash (NPV) orqali. 2-3 yillik kichik loyihalar uchun odatda oddiy ROI va qoplanish muddati yetarli.
