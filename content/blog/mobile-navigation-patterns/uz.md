---
title: Mobil ilovada navigatsiya: tab bar, burger menyu va boshqalar
description: Tab bar, burger menyu, yuqori tablar va imo-ishoralarni solishtiramiz: kuchli va zaif tomonlari hamda ilova tuzilmasiga qarab navigatsiya tanlash qoidalari.
summary: Ilovada tez-tez almashtiriladigan 3–5 ta asosiy bo‘lim bo‘lsa, pastki tab bar kerak; kam ishlatiladigan bandlar menyu yoki «Profil» tabiga o‘tadi, yuqori tablar bo‘lim ichidagi kontentni ajratadi, imo-ishoralar esa faqat tezlashtiruvchi vosita.
---

## Qisqa javob

Navigatsiya foydalanuvchilar ilovaning har bir qismiga qanchalik tez-tez kirishiga mos bo‘lishi kerak:

- **Muntazam ishlatiladigan 3–5 ta asosiy bo‘lim** — **pastki tab bar**.
- **Ko‘p ikkinchi darajali bandlar** (sozlamalar, yordam, hujjatlar) — **menyu**: chiqib keluvchi panel, «Yana» yoki «Profil» tabi.
- **Bitta bo‘lim ichida bir nechta ko‘rinish** («Hammasi / O‘qilmagan», «Hafta / Oy») — **yuqori tablar** yoki segmentli almashtirgich.
- **Imo-ishoralar** — faqat ko‘rinadigan elementlar ustidagi tezlashtiruvchi, yagona yo‘l emas.

Ko‘pchilik muvaffaqiyatli ilovalar bularni birlashtiradi: asosiy bo‘limlar uchun tab bar, har birining ichida «Orqaga» tugmali stek navigatsiya va qolgan hamma narsa uchun menyu.

## Pastki tab bar

**Afzalliklari:**

- Doim ko‘rinib turadi: foydalanuvchi qayerda ekanini va yana nimalar borligini ko‘radi.
- Bo‘limni bir marta bosish bilan almashtirish mumkin.
- Ekran pastida, bosh barmoq oson yetadigan joyda.

**Kamchiliklari:**

- Faqat 3–5 ta band sig‘adi.
- Har bir ekranda vertikal joy egallaydi.

**Qoidalar:**

- **Ikonka va qisqa yozuv** ishlating: faqat ikonkalar ko‘pincha noaniq tushuniladi.
- Faol tabni aniq ajratib ko‘rsating.
- Tablar — bu **bo‘limlar, amallar emas**. «Chiqish» yoki «Ulashish» u yerda turmasligi kerak. Agar kontent yaratish mahsulotning mohiyati bo‘lsa, markazdagi «Yaratish» tugmasi joiz istisno.
- Har bir tabning holatini saqlang: foydalanuvchi katalog ichiga kirib, savatchaga o‘tib, qaytsa, o‘sha joyga tushishi kerak.
- Kontekstga qarab tablar to‘plamini o‘zgartirmang.

## Burger menyu va chiqib keluvchi panel

**Afzalliklari:** ko‘p bandni sig‘diradi va ekranni toza qoldiradi.

**Kamchiliklari:**

- Bandlar yashirin, shuning uchun ulardan kamroq foydalaniladi — ko‘rinmagan narsa unutiladi.
- Har bir almashtirish qo‘shimcha bosishni talab qiladi.
- Ikonka odatda yuqori burchakda, katta telefonda bir qo‘l bilan yetish qiyin.

**Qachon mos keladi:** ikkinchi darajali bandlar (sozlamalar, qo‘llab-quvvatlash, huquqiy sahifalar), foydalanuvchi asosan bir joyda turib kam almashtiradigan ilovalar (masalan, pochta papkalari), katta tuzilmali saytlarning mobil versiyalari.

## Yuqori tablar

**Afzalliklari:** bir darajadagi bog‘liq ko‘rinishlar orasida tez almashish, ko‘pincha svayp bilan.

**Kamchiliklari:** yuqorida joylashgan, shuning uchun yetish qiyinroq; bandlar ko‘p bo‘lsa, aylantirish kerak va bir qismi yashirinadi; gorizontal svayplar ekrandagi boshqa imo-ishoralar bilan to‘qnashishi mumkin.

**Qoidalar:** ularni asosiy navigatsiya o‘rniga emas, bo‘lim **ichida** ishlating. Bo‘limlar uchun pastki tab bar va bo‘lim ichidagi ko‘rinishlar uchun yuqori tablar — odatiy sxema.

## Imo-ishoralar

Orqaga svayp, tablar orasida svayp, yangilash uchun tortish, o‘chirish uchun qatorni surish — imo-ishoralar tez, lekin **ko‘rinmas**. Foydalanuvchi ularni kimdir ko‘rsatmaguncha bilmaydi. Ular tizim imo-ishoralari bilan ham to‘qnashishi mumkin: iOS ham, Android ham ortga qaytish uchun ekran chetidan svaypni ishlatadi.

Qoida oddiy: har bir imo-ishora **ko‘rinadigan boshqaruv elementini takrorlashi** kerak. Surib o‘chirish yaxshi, agar element menyusi orqali ham o‘chirish mumkin bo‘lsa.

## Solishtirish

| Pattern | Bandlar | Ko‘rinish | Katta telefonda yetish | Eng mos |
|---|---|---|---|---|
| Pastki tab bar | 3–5 | Doim ko‘rinadi | Oson | Asosiy bo‘limlar |
| Burger / panel | Ko‘p | Yashirin | Qiyin (yuqori burchak) | Ikkinchi darajali bandlar |
| Yuqori tablar | 2–5, aylantirish bilan ko‘proq | Bo‘lim ichida ko‘rinadi | Qiyinroq | Bo‘lim ichidagi ko‘rinishlar |
| Imo-ishoralar | — | Ko‘rinmas | Har xil | Tajribali foydalanuvchilar uchun tezlashtirish |

Ular bilan birga boshqa patternlardan ham foydalanasiz: **stek navigatsiya** («Orqaga» tugmasi bilan ichkariga o‘tish), qisqa vazifalar uchun **bottom sheet**, katta kataloglar uchun **qidiruv orqali navigatsiya** va planshetlar hamda keng ekranlarda **navigation rail**.

## Ilovangiz uchun qanday tanlash kerak

1. **Barcha bo‘limlarni yozib chiqing** va har biri qanchalik tez-tez ishlatilishini baholang: analitika, intervyular yoki hech bo‘lmaganda halol taxmin asosida.
2. Tab bar uchun **eng ko‘p ishlatiladigan 3–5 tasini** tanlang.
3. **Qolganini** «Profil» / «Yana» tabiga yoki chiqib keluvchi panelga o‘tkazing.
4. **Katta bo‘limlarni** yuqori tablar yoki segmentli almashtirgich bilan ajrating.
5. **Imo-ishoralarni** faqat tezlashtiruvchi sifatida qo‘shing.
6. **Bosiladigan prototipda sinang:** «buyurtmalar tarixini toping» kabi vazifalar bering va birinchi urinishda topishlarini kuzating.

## Ko‘p uchraydigan xatolar

- Tab bar va burger menyu bir xil bandlarni takrorlaydi.
- Yozuvsiz ikonkalar.
- Tab barda amallar bo‘limlar bilan aralashib ketgan.
- Foydalanuvchi qayerda ekanini yo‘qotadigan chuqur ierarxiya.
- Muhim funksiyalarga faqat imo-ishora orqali kirish mumkin.

## FAQ

### Burger menyu har doim yomonmi?

Yo‘q. U tez-tez ishlatiladigan asosiy bo‘limlar uchun yomon tanlov, chunki ularni yashiradi. Ikkinchi darajali bandlar yoki juda katta tuzilmali ilovalar uchun chiqib keluvchi panel oqilona va tanish yechim.

### Asosiy bo‘limlar beshtadan ko‘p bo‘lsa-chi?

Avval tuzilmani qayta ko‘rib chiqing: ba’zi bo‘limlarni ko‘pincha birlashtirish yoki boshqalarning ichiga ko‘chirish mumkin. Agar bo‘lmasa, tab barda to‘rtta eng muhimini qoldiring, beshinchisini esa qolganlari joylashgan «Yana» yoki «Profil» tabiga aylantiring.

### Aylantirishda tab barni yashirish kerakmi?

Kontentga ko‘proq joy berish uchun mumkin, lekin foydalanuvchi yuqoriga aylantirishi bilan u darhol paydo bo‘lishi kerak. Bo‘limlar tez-tez almashtiriladigan ekranlarda uni doim ko‘rinib turishi oddiyroq va tushunarliroq.
