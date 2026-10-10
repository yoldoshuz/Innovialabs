---
title: System design intervyu: qanday tayyorlanish va javob tuzish
description: System design intervyusi uchun javob rejasi: talablar, yuklama baholari, komponentlar, murosalar hamda middle va senior uchun tayyorgarlik rejasi.
summary: System design intervyusida «to‘g‘ri» sxema emas, fikrlash jarayoni baholanadi: talablarni aniqlashtirish, taxminiy hisoblar, tushunarli arxitektura va murosalarni halol tahlil qilish. Bitta freymvork bo‘yicha tayyorlaning va uni odatiy masalalarda ovoz chiqarib mashq qiling.
---

## Aslida nima tekshiriladi

System design intervyusi — noaniqlik sharoitida tizimni qanday loyihalashingiz haqidagi suhbat. Yagona to‘g‘ri javob yo‘q. Intervyu oluvchi quyidagilarni qila olishingizni ko‘radi:

- **vazifani aniqlashtirish**, darhol chizishga kirishmaslik;
- **masshtab haqida fikrlash** — taxminiy hisoblar orqali;
- **arxitekturani yig‘ish** — tushunarli komponentlardan;
- **murosalarni aytish** va nima uchun aynan shu variantni tanlaganingizni tushuntirish;
- **muloqot qilish**: maslahatlarni tinglash va yechimni o‘zgartirish.

Middle nomzod uchun odatda ishonchli bazaviy arxitektura yetarli. Senior’dan chuqurlik kutiladi: nosozliklarga chidamlilik, ma’lumotlar izchilligi, tor joylar va tizim evolyutsiyasi.

## Besh qadamli javob freymvorki

Har bir intervyuda bir xil tuzilmadan foydalaning. U adashib qolmaslikka yordam beradi va intervyu oluvchiga tizimli fikrlashingizni ko‘rsatadi.

**1. Talablar.** Ularni funksional (tizim nima qiladi) va nofunksional (kechikish, mavjudlik, izchillik, masshtab) qismlarga ajrating. Vazifaga nima kirmasligini aniq belgilang.

**2. Baholar.** Kattaliklar tartibini hisoblang: soniyadagi so‘rovlar, ma’lumotlar hajmi, o‘qish va yozish nisbati. Aniqlik muhim emas — raqamlardan xulosa chiqarishingiz muhim. Qulay yaxlitlash: bir sutkada taxminan 100 ming soniya bor.

```text
Taxmin: sutkasiga 10 mln so‘rov
10 000 000 / 100 000 ≈ o‘rtacha soniyasiga 100 so‘rov
Pik yuklamani zaxira bilan oling, masalan o‘rtachadan 3–5 baravar
```

**3. Yuqori darajadagi sxema.** Mijoz, balanslovchi, servislar, omborlar, kesh, navbatlar. So‘rovning asosiy yo‘lini va asosiy operatsiyalar API’sini tushuntiring.

**4. Chuqurlashish.** Eng murakkab bir-ikki qismni tanlab, batafsil tahlil qiling: ma’lumotlar sxemasi, sharding, keshlash, nosozliklarni qayta ishlash. Ko‘pincha intervyu oluvchining o‘zi qayerni qazish kerakligini ko‘rsatadi.

**5. Murosalar va rivojlanish.** Yechimning zaif joylarini, yuklama oshganda birinchi nima buzilishini va keyin nima qo‘shishingizni ayting: monitoring, replikatsiya, rate limiting.

## Tushuntira olish kerak bo‘lgan murosalar

| Tanlov | Qachon mos | Narxi |
|---|---|---|
| SQL baza | Bog‘langan ma’lumotlar, tranzaksiyalar | Gorizontal masshtablash qiyinroq |
| NoSQL ombor | Kalit bo‘yicha oddiy so‘rovlar, katta hajm | Kafolatlar va so‘rov moslashuvchanligi zaifroq |
| Kesh | Bir xil ma’lumotni ko‘p o‘qish | Invalidatsiya va eskirgan ma’lumot |
| Xabarlar navbati | Og‘ir yoki kechiktirilgan vazifalar | Debug qiyinroq, yakuniy izchillik |
| Replikatsiya | O‘qishni masshtablash va chidamlilik | Replikatsiya kechikishi |

Jadvalni yod olish emas, har bir tanlovni birinchi qadamdagi talablar bilan bog‘lash muhim.

## Tayyorgarlik rejasi

Intervyudan oldingi bir kechaga emas, bir necha haftalik muntazam mashqqa mo‘ljallang.

1. **Asoslarni takrorlang**: HTTP, ma’lumotlar bazalari va indekslar, keshlash, navbatlar, balanslash, CAP va izchillik modellari.
2. **Odatiy masalalarni tahlil qiling**: havola qisqartiruvchi, yangiliklar lentasi, chat, fayl yuklash, rate limiter, bildirishnomalar tizimi.
3. **Taymer bilan ovoz chiqarib yeching.** Freymvorkning har bir qadamini yoningizda intervyu oluvchi bordek gapiring.
4. **Sinov intervyulari o‘tkazing** hamkasb bilan. Sxemani emas, tuzilma va tushuntirish aniqligini baholashni so‘rang.
5. **Tajribangiz bilan bog‘lang.** O‘zingiz qurgan tizimlar va qayta ko‘rib chiqishga to‘g‘ri kelgan qarorlar haqida bir-ikki hikoya tayyorlang.

## Keng tarqalgan xatolar

- Talablarni aniqlashtirmasdan chizishni boshlash.
- Sxemani sababsiz moda texnologiyalar bilan to‘ldirish.
- O‘ylayotganda jim turish: intervyu oluvchi fikrlash jarayonini baholaydi.
- Intervyu oluvchi muammoni ko‘rsatganda yechimni yaxshilash o‘rniga uni himoya qilish.

## FAQ

### Har bir qadamga qancha vaqt ajratish kerak?

Taxminan: talablar va baholarga bir necha daqiqa, asosiy vaqt — sxema va chuqurlashishga, oxirgi daqiqalar — murosalarga. Vaqtni kuzatib boring va intervyu oluvchidan keyin qayerga yurishni so‘rang.

### Aniq bulut servislarini bilish shartmi?

Foydali, lekin shart emas. Umumiy komponentlar bilan ishlash yetarli: obyekt ombori, navbat, kesh. Agar aniq servisni tilga olsangiz, nima uchun mosligini tushuntiring.

### Vazifaning bir qismini qanday yechishni bilmasam-chi?

Buni to‘g‘ridan-to‘g‘ri ayting, oqilona taxmin taklif qiling va davom eting. Halol mulohaza ishonchli, lekin noto‘g‘ri gapdan ko‘ra qadrliroq.
