---
title: Formalarni qanday loyihalash kerak: UX bo‘yicha eng yaxshi amaliyotlar
description: Veb va mobil formalar uchun UX amaliyotlari: yorliq va pleysholder, maydonlar tartibi, kiritish turlari, tekshirish, majburiy maydonlar va formani qisqartirish.
summary: Qulay forma faqat zarur narsani so‘raydi, har bir maydon ustiga ko‘rinadigan yorliq qo‘yadi, mobil klaviatura uchun to‘g‘ri kiritish turlaridan foydalanadi va xato haqida maydon to‘ldirilgan zahoti, uning yonida va tushunarli tilda xabar beradi.
---

## Asosiy qoidalar

Forma — foydalanuvchi natija uchun o‘z vaqti va ma’lumotlari bilan to‘laydigan joy. U qancha kam kuch talab qilsa, shuncha ko‘p oxirigacha to‘ldiriladi.

- **Faqat zarur narsani so‘rang.** Har bir maydon joriy qadam uchun kerak bo‘lishi lozim.
- **Har bir maydon ustida ko‘rinadigan yorliq**, faqat pleysholder emas.
- **Bitta ustun** va maydonlarning mantiqiy tartibi.
- Telefonda kerakli klaviatura ochilishi uchun **to‘g‘ri kiritish turlari**.
- **Xatolar — darhol, maydon yonida va qanday tuzatish haqida maslahat bilan.**

## Yorliqlar va pleysholderlar

Pleysholder (maydon ichidagi kulrang matn) foydalanuvchi yoza boshlashi bilan yo‘qoladi. Agar u yorliq o‘rnini bossa, odam nima kiritayotganini unutadi, to‘ldirilgan formani tekshirganda esa qaysi maydon qaysi ekanini tushunolmaydi. Bundan tashqari, och kulrang matn ko‘pincha yomon o‘qiladi.

| Yondashuv | Qachon ishlatiladi |
|---|---|
| Maydon ustidagi yorliq | Har doim, bu asos |
| Pleysholder | Faqat format namunasi uchun: «+998 90 123 45 67» |
| Maydon ostidagi maslahat | Talablar uchun: «Kamida 8 ta belgi» |
| Suzuvchi yorliq | Kiritishdan keyin ham ko‘rinib tursa, mumkin |

Maydon ustidagi yorliqlar chapdagilardan qulayroq: ularni ko‘z bilan maydonga bog‘lash osonroq va tor ekranda buzilmaydi.

## Maydonlar tartibi va guruhlash

- Maydonlarni **bitta ustunga** joylashtiring — shunda nigoh to‘g‘ri chiziq bo‘ylab harakatlanadi va hech narsa o‘tkazib yuborilmaydi.
- Tartib — oddiydan murakkabga va odatiydan shaxsiyga: avval ism, keyin aloqa, keyin tafsilotlar.
- Bog‘liq maydonlarni sarlavhalar ostida guruhlang: «Aloqa», «Yetkazib berish manzili», «To‘lov».
- Qisqa bog‘liq maydonlarni (shahar va pochta indeksi, karta amal qilish muddati) bitta qatorga qo‘yish mumkin.
- Uzun formani progress ko‘rsatkichi bilan bosqichlarga bo‘ling.

## Kiritish turlari va avtoto‘ldirish

To‘g‘ri `type`, `inputmode` va `autocomplete` foydalanuvchi vaqtini har qanday vizual usuldan ko‘ra ko‘proq tejaydi.

```html
<label for="email">Email</label>
<input id="email" type="email" autocomplete="email">

<label for="phone">Telefon</label>
<input id="phone" type="tel" autocomplete="tel">

<label for="code">SMS-kod</label>
<input id="code" inputmode="numeric" autocomplete="one-time-code">

<label for="name">Ism</label>
<input id="name" type="text" autocomplete="given-name">
```

- `type="email"` va `type="tel"` telefonda `@` yoki raqamli klaviaturani ochadi.
- `autocomplete` brauzerga saqlangan ma’lumotlarni qo‘yish imkonini beradi.
- Qisqa ro‘yxatlar uchun (5–6 tagacha variant) ochiladigan ro‘yxatdan ko‘ra radiotugmalar yaxshiroq.
- Zarurat bo‘lmasa, telefon yoki sanani bir nechta maydonga bo‘lmang.

`autocomplete` qiymatlarining to‘liq ro‘yxati [MDN hujjatlarida](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) bor.

## Tekshirish (validatsiya)

- **Maydonni foydalanuvchi undan chiqqandan keyin tekshiring**, har bir tugma bosilganda emas — aks holda xato odam hali yozayotganda paydo bo‘ladi.
- Tuzatish boshlangach, qiymat to‘g‘ri bo‘lishi bilan xatoni darhol olib tashlang.
- Xabar — **maydon ostida**, qizil rangda **va** ikonka yoki matn bilan, rangni farqlashda qiynaladigan odamlar ham ko‘rishi uchun.
- Xato matni qanday tuzatishni tushuntiradi: «Noto‘g‘ri format» emas, «Emailni name@example.com ko‘rinishida kiriting».
- Xatolar bilan yuborilganda fokusni birinchi xato maydonga o‘tkazing.
- Formatga bag‘rikeng bo‘ling: telefonni bo‘sh joy, qavs va chiziqchalar bilan qabul qiling va uni o‘zingiz normallashtiring.

## Majburiy maydonlar

Deyarli barcha maydonlar majburiy bo‘lsa, **ixtiyoriylarini** «(ixtiyoriy)» so‘zi bilan belgilang. Majburiylari kam bo‘lsa — ularni belgilang. Izohsiz yolg‘iz yulduzcha hammaga ham tushunarli emas, shuning uchun uni forma boshida izohlang.

## Formani qanday qisqartirish mumkin

Misol: konsultatsiyaga ariza formasi.

| Avval | Keyin |
|---|---|
| Ism, familiya, otasining ismi | Ism |
| Email, telefon, Telegram | Tanlov bo‘yicha bitta aloqa usuli |
| Kompaniya, lavozim, kompaniya hajmi | Qo‘ng‘iroqda aniqlanadi |
| Shahar, mamlakat | Ariza uchun kerak emas |
| Xabar (majburiy) | Xabar (ixtiyoriy) |

Har bir maydon uchun savol bering: u aynan hozir kerakmi? Buni keyinroq bilib olish yoki avtomatik aniqlash mumkinmi?

## FAQ

### Forma to‘ldirilmaguncha yuborish tugmasini nofaol qilish kerakmi?

Yaxshisi yo‘q. Foydalanuvchi tugma nega bosilmayotganini va nimani o‘tkazib yuborganini tushunmaydi. Tugmani faol qoldiring va bosilganda qaysi maydonlarni tuzatish kerakligini ko‘rsating.

### Har bir formaga kapcha kerakmi?

Shart emas. Ko‘rinadigan kapcha qo‘shimcha to‘siq yaratadi. Avval ko‘rinmas himoya usullarini sinab ko‘ring: yashirin tuzoq-maydon, yuborishlar chastotasini cheklash, server tomonidagi tekshiruv.

### Formada nechta maydon bo‘lishi mumkin?

Universal raqam yo‘q. Mo‘ljal — faqat ularsiz keyingi qadamni bajarib bo‘lmaydigan maydonlar. Forma muqarrar ravishda uzun bo‘lsa, uni bosqichlarga bo‘ling va kiritilgan ma’lumotlarni saqlab qo‘ying.
