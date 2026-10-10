---
title: Xesh-jadvallar qanday ishlaydi: xeshlash, kolliziyalar, qidiruv
description: Xesh-funksiyalar, bucket’lar, zanjirlar va ochiq adreslash, to‘lish koeffitsienti va kengayish hamda Python, JS va Java’dagi dict, Map va HashMap tuzilishi.
summary: Xesh-jadval xesh-funksiya yordamida kalitni massiv katagining raqamiga aylantiradi, shuning uchun qidiruv, qo‘shish va o‘chirish o‘rtacha doimiy vaqt oladi, kolliziyalar esa zanjirlar yoki ochiq adreslash bilan hal qilinadi.
---
## Mohiyati bir xatboshida

Xesh-jadval — bu kataklar massivi (**bucket**’lar) va kalitni songa aylantiruvchi **xesh-funksiya**. Shu sondan katak indeksi olinadi, masalan massiv o‘lchamiga bo‘lishdagi qoldiq orqali. Qiymatni topish uchun barcha elementlarni ko‘rib chiqish shart emas: xeshni hisobladingiz — darhol kerakli katakka borasiz. Shuning uchun amallar o‘rtacha **O(1)** vaqt oladi.

## Xesh-funksiya

Jadval uchun yaxshi xesh-funksiya:

- **deterministik** bo‘lishi kerak — bir xil kalit har doim bir xil xesh beradi;
- kalitlarni kataklar bo‘ylab **teng taqsimlashi** kerak;
- **tez hisoblanishi** kerak.

Bundan muhim qoida kelib chiqadi: **agar ikki kalit teng bo‘lsa, ularning xeshlari ham mos kelishi shart**. Shuning uchun Java’da `equals` qayta aniqlanganda `hashCode` ham qayta aniqlanishi kerak, Python’da esa `list` kabi o‘zgaruvchan obyektlarni lug‘at kaliti sifatida ishlatib bo‘lmaydi — ularning tarkibi o‘zgarishi va xesh noto‘g‘ri bo‘lib qolishi mumkin.

Jadvallar uchun xesh-funksiyalar kriptografik bo‘lishi shart emas. Parollar va imzolar uchun boshqa algoritmlar ishlatiladi.

## Kolliziyalar

Kataklar mumkin bo‘lgan kalitlardan kam, shuning uchun ikki xil kalit ba’zan bitta katakka tushadi. Bu **kolliziya** deb ataladi va uni hal qilishning ikki asosiy usuli bor.

| Yondashuv | Qanday ishlaydi | Afzalliklari | Kamchiliklari |
|---|---|---|---|
| Zanjirlar (chaining) | Katakda shu indeksdagi barcha elementlar ro‘yxati saqlanadi | Oddiy, yuqori to‘lishga bardoshli | Tugunlar uchun qo‘shimcha xotira, kesh uchun noqulay |
| Ochiq adreslash | Katak band bo‘lsa, qoida bo‘yicha keyingi bo‘sh katak qidiriladi | Ma’lumotlar ixcham, kesh hisobiga tezroq | O‘chirish murakkab, yuqori to‘lishda sekinlashadi |

Ochiq adreslashda o‘chirilgan elementni shunchaki yo‘q qilib bo‘lmaydi — aks holda qidiruv bo‘sh joyda to‘xtaydi va undan keyin joylashgan kalitlarni topa olmaydi. Shuning uchun maxsus «o‘chirilgan» belgisi qo‘yiladi.

## To‘lish koeffitsienti va kengayish

**Load factor** — elementlar sonining kataklar soniga nisbati. U qancha yuqori bo‘lsa, kolliziyalar shuncha ko‘p va amallar sekinroq. Koeffitsient chegaradan oshganda jadval **kengayadi**: kattaroq massiv yaratiladi va barcha elementlar qaytadan taqsimlanadi.

Bitta kengayish O(n) turadi, lekin kamdan-kam sodir bo‘ladi, shuning uchun bitta amalga hisoblaganda qo‘shish O(1) bo‘lib qoladi — bu **amortizatsiyalangan** murakkablik deyiladi. Elementlar soni oldindan ma’lum bo‘lsa, ko‘p tillar boshlang‘ich sig‘imni belgilab, ortiqcha qayta qurishlardan qochishga imkon beradi.

## Mashhur tillarda qanday tuzilgan

**Python `dict` va `set`.** Ochiq adreslashdan foydalanadi. Python 3.7 dan boshlab lug‘at kalitlarning qo‘shilish tartibini kafolatli saqlaydi. Kalitlar xeshlanadigan bo‘lishi kerak: satrlar, sonlar, o‘zgarmas qiymatlardan iborat kortejlar.

**JavaScript `Map` va `Set`.** Spetsifikatsiya qo‘shilish tartibini saqlashni talab qiladi, dvijoklar esa ularni xesh-jadvallarda amalga oshiradi. Oddiy obyektdan farqli o‘laroq, `Map` istalgan turdagi kalitlarni qabul qiladi va obyektlarni tarkibi bo‘yicha emas, havola bo‘yicha solishtiradi.

```javascript
const m = new Map();
const key = { id: 1 };
m.set(key, "a");
m.get({ id: 1 }); // undefined: boshqa obyekt
m.get(key);       // "a"
```

**Java `HashMap`.** Zanjirlardan foydalanadi. Standart to‘lish koeffitsienti — 0,75. Agar bitta katakdagi zanjir juda uzun bo‘lib ketsa, eng yomon holat maqbul qolishi uchun u muvozanatli daraxtga aylantiriladi. Tartib kafolatlanmaydi — qo‘shilish tartibi uchun `LinkedHashMap`, kalit bo‘yicha saralash uchun `TreeMap` bor.

## O(1) qachon O(n) ga aylanadi

- Ko‘p kalitlarni bitta katakka yuboradigan yomon xesh-funksiya.
- Hujumchi tomonidan atayin tanlangan kalitlar (kolliziyalarga hujum). Shuning uchun ba’zi tillar satrlarni xeshlashga tasodifiylik qo‘shadi.
- Qo‘shilgandan keyin kalitni o‘zgartirish: element eski katakda qoladi va «yo‘qoladi».

## Keng tarqalgan xatolar

- O‘zgaruvchan obyektni kalit sifatida ishlatish.
- Til kafolatlamagan tartibga tayanish.
- Obyektlar tengligini qayta aniqlab, xeshni unutish.
- Oraliq bo‘yicha so‘rovlar kerak bo‘lgan ma’lumotlarni xesh-jadvalda saqlash — buning uchun daraxt yaxshiroq.

## FAQ

### Nega xesh-jadvalda qidiruv ro‘yxatdagidan tezroq?

Ro‘yxatda kalitni moslik topilguncha har bir element bilan solishtirish kerak. Xesh-jadvalda xesh darhol kerakli katakni ko‘rsatadi va faqat undagi elementlar bilan solishtirish qoladi — odatda bitta yoki ikkita.

### Xesh-jadval qidiruv daraxtidan nimasi bilan farq qiladi?

Xesh-jadval aniq kalit bo‘yicha qidiruvda o‘rtacha tezroq, lekin kalitlarni saralangan holda saqlamaydi. Daraxt O(log n) beradi, ammo tartib, minimum, maksimum va oraliqlarni qo‘llab-quvvatlaydi.

### Jadval o‘lchamini o‘zim tanlashim kerakmi?

Odatda yo‘q: standart implementatsiyalar avtomatik kengayadi. Elementlar juda ko‘p bo‘lishini oldindan bilsangiz, boshlang‘ich sig‘imni belgilash mantiqli.
