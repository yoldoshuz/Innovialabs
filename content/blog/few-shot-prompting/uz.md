---
title: Few-shot prompting: LLM’ni so‘rovdagi misollar bilan o‘rgatish
description: LLM uchun misollarni qanday tanlash, rasmiylashtirish va tartiblash, nechta misol kerakligi va model ularni so‘zma-so‘z ko‘chirmasligi haqida.
summary: Few-shot prompting — bu so‘rovning o‘ziga bir nechta tayyor «kirish → chiqish» juftliklarini qo‘shish: model qayta o‘qitilmasdan ko‘rsatilgan format va mantiqni takrorlaydi. Odatda oddiy va chegaraviy holatlarni qamraydigan 2–5 ta xilma-xil, aniq rasmiylashtirilgan misol yaxshi ishlaydi.
---

## Few-shot nima va qachon kerak

**Few-shot prompting** — vazifani faqat so‘z bilan tushuntirish emas, balki modelga bir nechta misol ko‘rsatish: mana kirish ma’lumoti, mana to‘g‘ri javob. Model qayta o‘qitilmaydi — u bitta so‘rov ichida namunaga moslashadi.

Bu quyidagi hollarda foydali:

- javobning **qat’iy formati** kerak bo‘lsa (belgilar, qisqa iboralar, aniq tuzilma);
- vazifani so‘z bilan tushuntirish qiyin, lekin ko‘rsatish oson bo‘lsa — masalan, mijozga javob ohangi;
- model misollarsiz beqaror bo‘lsa: goh abzats, goh ro‘yxat bilan javob beradi.

Agar vazifa oddiy va ko‘rsatma aniq bo‘lsa, misollar kerak emas — bu **zero-shot**. Shundan boshlang va beqarorlikni ko‘rgandagina misol qo‘shing.

## Misollarni qanday tanlash kerak

Misollar sifati ularning sonidan muhimroq.

- **Xilma-xillik.** Turli kirishlarni qamrang: qisqa va uzun, oddiy va murakkab, turli javob toifalari. Agar barcha misollar bitta sinfga tegishli bo‘lsa, model o‘sha tomonga og‘adi.
- **Chegaraviy holatlar.** To‘g‘ri javob aniq bo‘lmagan kamida bitta misol qo‘shing: aralash sharh, bo‘sh maydon, mavzudan tashqari xabar.
- **Haqiqiylik.** Ideal o‘quv jumlalarini emas, real ma’lumotlarga o‘xshash misollarni oling.
- **Xatosizlik.** Misoldagi xato deyarli albatta javoblarda takrorlanadi. Har bir misolni qo‘lda tekshiring.

## Qanday rasmiylashtirish kerak

Modellar **aniq ajratgichlari** bor misollarni yaxshi tushunadi. Barcha misollar va haqiqiy so‘rov uchun bir xil tuzilmadan foydalaning.

```text
Sharh ohangini aniqla: positive, negative yoki mixed.

<example>
Sharh: Tez yetkazishdi, lekin quti ezilgan edi.
Javob: mixed
</example>

<example>
Sharh: Hammasi a’lo, yana buyurtma beraman.
Javob: positive
</example>

Sharh: {matn}
Javob:
```

Rasmiylashtirish qoidalari:

- barcha misollarda bir xil belgilar («Sharh:», «Javob:»);
- misollar ko‘rsatmadan va haqiqiy kirishdan ajratilgan;
- ko‘rsatma baribir kerak — misollar uni to‘ldiradi, o‘rnini bosmaydi.

## Nechta misol va qaysi tartibda

Universal son yo‘q. Amalda ko‘pincha **2–5 ta misol** yetarli. Ko‘proq misol so‘rovni uzunroq va qimmatroq qiladi, sifat esa sezilarli o‘smasligi mumkin. O‘z ma’lumotlaringizda tekshiring: misol qo‘shdingiz — natijalarni solishtiring.

**Tartib muhim.** Modellar oxirgi misollarga ko‘proq tayanishi mumkin. Shuning uchun:

- sinflarni aralashtiring, bir turdagi uchta misolni ketma-ket qo‘ymang;
- har doim bir xil javob bilan tugatmang;
- misollar ko‘p bo‘lsa, toifalar o‘rtasida muvozanat saqlang.

## Keng tarqalgan xatolar

| Xato | Nima bo‘ladi | Qanday tuzatish |
|---|---|---|
| Misollar juda o‘xshash | Model ularni so‘zma-so‘z ko‘chiradi | Uzunlik, mavzu va iboralarni xilma-xil qiling |
| Sinflar nomutanosib | Javoblar ko‘p uchraydigan sinfga og‘adi | Misollarni muvozanatlang |
| Misollarda aniq tafsilotlar | Model ularni boshqa javoblarga qo‘shadi | Neytral ma’lumotlardan foydalaning |
| Ko‘rsatma yo‘q | Model maqsadni misollardan taxmin qiladi | Qisqa vazifa tavsifini qo‘shing |
| Misollar formati har xil | Javob formati beqaror | Hammasi uchun yagona shablon |

Alohida muammo — **so‘zma-so‘z ko‘chirish**. Agar barcha misollarda javob bir xil ibora bilan boshlansa, model ham shunday boshlaydi. Xilma-xillik kerak bo‘lsa, buni to‘g‘ridan-to‘g‘ri ayting: «Misollar mazmunni emas, formatni ko‘rsatadi — ularning iboralarini takrorlamang».

## Misollar ishlayotganini qanday tekshirish

1. Promptdagi misollardan alohida, to‘g‘ri javoblari bor kichik test to‘plamini yig‘ing.
2. Promptni avval misollarsiz, keyin misollar bilan ishga tushiring.
3. Aniqlik va format barqarorligini solishtiring.
4. Aynan nima yordam berganini bilish uchun bir vaqtda bitta misolni o‘zgartiring.

Agar misollar ko‘payib borsa-yu, sifat o‘smasa, **dinamik tanlash** haqida o‘ylang: har bir so‘rov uchun bazadan eng o‘xshash misollarni tanlash (masalan, vektor qidiruv orqali).

## FAQ

### Few-shot modelni qo‘shimcha o‘qitishdan nimasi bilan farq qiladi?

Few-shot bitta so‘rov ichida ishlaydi va modelni o‘zgartirmaydi. Fine-tuning esa katta ma’lumotlar to‘plamida model vaznlarini o‘zgartiradi. Few-shot bilan boshlash tezroq va arzonroq; fine-tuning yuzlab misollar kerak bo‘lib, ular kontekstga sig‘magandagina mantiqli.

### Few-shot’ni chain-of-thought bilan birga ishlatsa bo‘ladimi?

Ha. Misollarda faqat javobni emas, undan oldingi qisqa mulohazani ham ko‘rsatish mumkin. Shunda model ham xuddi shu uslubda mulohaza yuritadi. Bu bir necha bosqichli vazifalar uchun foydali.

### Model misollardagi ma’lumotlarni takrorlasa nima qilish kerak?

Misollarni xilma-xil qiling, javoblarga tushmasligi kerak bo‘lgan aniq ismlar va raqamlarni olib tashlang hamda ko‘rsatmada misollar faqat formatni ko‘rsatishini aniq yozing.
