---
title: Veb va interfeys dizayni uchun tipografiya asoslari
description: O‘lchamlar shkalasi, qatorlar oralig‘i, qator uzunligi, qalinlik va trekking: sayt va ilovalarda o‘qiladigan matn uchun amaliy boshlang‘ich qiymatlar.
summary: Ekran tipografiyasi bir nechta qarorga tayanadi: asosiy matn 16px va undan katta, qatorlar oralig‘i taxminan 1,4–1,6, qator uzunligi 45–75 belgi atrofida, cheklangan o‘lchamlar shkalasi va ikki-uch qalinlik. Shular to‘g‘ri sozlansa, interfeys bezaksiz ham yaxshi o‘qiladi.
---

## Interfeysda tipografiya nima

Tipografiya — chiroyli shrift tanlash emas. Bu **o‘lcham, oraliqlar, qator uzunligi va qalinlik** bo‘yicha qoidalar to‘plami bo‘lib, ular tufayli matn osongina o‘qiladi va ko‘z bilan tez ko‘rib chiqiladi. Ekranda interfeysning deyarli hammasi matndan iborat: tugmalar, yozuvlar, xatolar, navigatsiya.

Yaxshi tomoni shundaki, bir nechta asosiy qiymat ko‘pchilik vazifalarni yopadi. Sinalgan sozlamalardan boshlang, keyin real kontentni real qurilmalarda ko‘rib, moslashtiring.

## Boshlang‘ich qiymatlar

| Parametr | Ekran uchun boshlang‘ich nuqta |
|---|---|
| Asosiy matn | 16px, uzun o‘qish uchun ko‘pincha 17–18px |
| Kichik matn (izohlar, maslahatlar) | 13–14px, lekin asosiy o‘qish uchun emas |
| Asosiy matnda qatorlar oralig‘i | 1,4–1,6 |
| Sarlavhalarda qatorlar oralig‘i | 1,1–1,25 |
| Qator uzunligi | taxminan 45–75 belgi |
| Abzaslar orasidagi masofa | taxminan bir qator balandligi |
| Qalinliklar soni | 2–3 (masalan, regular, medium, bold) |

Bu qonun emas, yo‘nalish. Kichik harflari baland shrift bir xil o‘lchamda kattaroq ko‘rinadi, tor shriftga esa biroz kattaroq o‘lcham kerak bo‘lishi mumkin.

## O‘lchamlar shkalasi

**Tipografik shkala** — har bir element uchun yangi raqam tanlash o‘rniga hamma joyda qayta ishlatiladigan qat’iy o‘lchamlar to‘plami. U ierarxiyani izchil saqlaydi va dizayn-tizimni boshqarishni osonlashtiradi.

Keng tarqalgan usul — modulli shkala: har bir pog‘ona oldingisini koeffitsiyentga, masalan 1,2 yoki 1,25 ga ko‘paytirishdan hosil bo‘ladi. 16px asos va 1,25 koeffitsiyentda taxminan 16, 20, 25, 31, 39, 49 chiqadi. Butun piksellarga yaxlitlang va 5–7 pog‘ona qoldiring: o‘lchamlar bundan ko‘p bo‘lsa, ierarxiya odatda noaniq bo‘ladi.

CSS’da shkala bir marta — o‘zgaruvchilar yoki tokenlar orqali beriladi:

```css
:root {
  --text-sm: 0.875rem;  /* 14px */
  --text-base: 1rem;    /* 16px */
  --text-lg: 1.25rem;   /* 20px */
  --text-xl: 1.5625rem; /* 25px */
  --text-2xl: 1.9375rem;/* 31px */
}
body { font-size: var(--text-base); line-height: 1.5; }
```

`rem` birliklari matnga foydalanuvchi brauzeridagi shrift o‘lchami sozlamalarini hisobga olish imkonini beradi.

## Qatorlar oralig‘i va qator uzunligi

**Qatorlar oralig‘i** ko‘zga keyingi qator boshiga qaytishga yordam beradi. Juda zich bo‘lsa, qatorlar bir-biriga yopishadi, juda keng bo‘lsa, abzas tarqalib ketadi. Asosiy matnga sarlavhalarga qaraganda ko‘proq havo kerak: 1,5 oraliqli katta sarlavha uzilgandek ko‘rinadi.

**Qator uzunligi** keng desktop maketlarida ko‘pincha e’tibordan chetda qoladi. 1400px kenglikdagi matn charchatadi. Konteynerni cheklang, masalan `max-width: 65ch` — shunda kenglik shriftning belgilar soniga bog‘lanadi.

## Qalinlik va trekking

- **Qalinliklar** ierarxiya yaratadi. Qalin — sarlavha va urg‘ular uchun, oddiy — o‘qish uchun. Ingichka qalinliklar (100–300) kichik o‘lchamda kontrastni yo‘qotadi va yomon o‘qiladi.
- **Trekking** (harflar orasidagi masofa) asosiy matnda odatda standart holicha qoldiriladi. Katta sarlavhalarga ozgina manfiy trekking yarashadi, bosh harfli kichik yozuvlarga esa biroz musbat trekking kerak.
- **Kontrast** o‘lchamdan kam ahamiyatli emas. Oq fonda och kulrang matn maketda chiroyli ko‘rinadi, lekin real foydalanuvchilarga qiyinchilik tug‘diradi. Kontrastni WCAG talablari bo‘yicha tekshiring.

## Ko‘p uchraydigan xatolar

1. **Juda ko‘p o‘lcham va qalinlik.** Har bir yangi qiymat ierarxiyani zaiflashtiradi.
2. **Mobil qurilmada asosiy matn 16px dan kichik.** Kattalashtirishga to‘g‘ri keladi, ba’zi mobil brauzerlarda esa kiritish maydonidagi kichik matn avtomatik zumni ishga tushiradi.
3. **Katta ekranning butun kengligidagi abzaslar.**
4. **Uzun matnni markazga tekislash.** Markazlash qisqa sarlavhalarga mos, abzaslarga emas.
5. **Ierarxiya faqat o‘lcham orqali.** Qalinlik, rang va oraliqlar ham xuddi shunday kuchli vosita.
6. **Hamma joyda qat’iy `px`,** foydalanuvchi sozlamalarini hisobga olmasdan.

## Tipografiyani qanday tekshirish kerak

- Sahifani telefon va noutbukda oching va abzasni shunchaki ko‘rib chiqmasdan, to‘liq o‘qing.
- Brauzer masshtabini 200% ga oshiring va hech narsa buzilmasligi, ustma-ust tushmasligiga ishonch hosil qiling.
- Ko‘zingizni qisib qarang: sarlavha, kichik sarlavha va matn ierarxiyasi ko‘rinib turishi kerak.
- Uzun so‘zlar va boshqa tillarga tarjimalarni ham o‘z ichiga olgan real kontentda sinab ko‘ring.

## FAQ

### Sayt uchun shriftning minimal o‘lchami qancha?

Asosiy matn uchun ishonchli minimum — desktopda ham, mobil qurilmada ham 16px. Kichikroq o‘lchamlar izohlar va metama’lumotlar kabi ikkinchi darajali elementlar uchun maqbul, lekin o‘qilishi kerak bo‘lgan abzaslar uchun emas.

### Bitta interfeysda nechta shrift ishlatish kerak?

Odatda bir-ikkita oila. Ko‘pchilik mahsulotlar uchun bir nechta qalinlikka ega bitta yaxshi ishlangan oila yetarli; ikkinchi shrift sarlavhalar yoki brend urg‘ulari uchun qo‘shiladi.

### Qatorlar oralig‘ini pikselda yoki son bilan berish kerakmi?

Birliksiz son bilan, masalan 1.5. Bunday qiymat har bir elementning shrift o‘lchami bilan birga masshtablanadi, qat’iy piksellarni esa o‘lcham har o‘zgarganda qayta hisoblash kerak bo‘ladi.
