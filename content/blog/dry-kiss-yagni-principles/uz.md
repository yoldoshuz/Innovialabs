---
title: "DRY, KISS va YAGNI: dasturlash tamoyillari oddiy tilda"
description: DRY, KISS va YAGNI nimani anglatadi, kodda qanday ko‘rinadi, ko‘r-ko‘rona DRY nega noto‘g‘ri abstraksiya yaratadi va uch tamoyil bir-birini qanday muvozanatlaydi.
summary: DRY — bitta bilim bitta joyda, KISS — eng oddiy ishlaydigan yechim, YAGNI — hozircha kerak bo‘lmagan narsani yozmaslik; ularni alohida emas, birga qo‘llash kerak.
---

## Uch tamoyil qisqacha

- **DRY (Don’t Repeat Yourself)** — tizim haqidagi har bir bilim bitta joyda yashashi kerak. Gap bir xil qatorlar haqida emas, qoidalar va qarorlar haqida.
- **KISS (Keep It Simple, Stupid)** — ishlaydigan eng oddiy yechimni tanlang. Oddiy kodni o‘qish, testlash va o‘zgartirish osonroq.
- **YAGNI (You Aren’t Gonna Need It)** — funksionallikni haqiqatan kerak bo‘lmaguncha «kelajak uchun» yozmang.

Uchalasi ham bitta dushman — ortiqcha murakkablik bilan kurashadi, lekin turli tomondan.

## DRY misolda

«Ma’lum summadan yuqori buyurtmaga bepul yetkazib berish» qoidasi savatda, mijozga xatda va admin panelda uchraydi. Agar summa uch joyda yozilgan bo‘lsa, shart o‘zgarganda bir joy albatta unutiladi.

```js
// qoida uchun bitta joy
export const FREE_SHIPPING_THRESHOLD = 500_000;

export function hasFreeShipping(total) {
  return total >= FREE_SHIPPING_THRESHOLD;
}
```

Endi savat, xat va admin panel bitta funksiyani chaqiradi.

## DRY qachon zarar keltiradi

Xavf — **faqat tashqi ko‘rinishi o‘xshash** kodni birlashtirish. Ikki validatsiya funksiyasi — ro‘yxatdan o‘tish va buyurtma rasmiylashtirish uchun — bugun bir xil maydonlarni tekshiradi. Siz umumiy `validateUser()` yaratasiz. Bir oydan keyin buyurtma uchun manzil kerak bo‘ladi, ro‘yxatdan o‘tish uchun esa yo‘q. Flag paydo bo‘ladi. Keyin ikkinchisi. Funksiya shartlar bilan to‘lib boradi va har bir tahrir ikkala ssenariyni buzish xavfini tug‘diradi.

Bu **noto‘g‘ri abstraksiya** deb ataladi. Belgilari:

- umumiy funksiyada boolean parametrlar soni o‘sib boradi;
- ichida kim chaqirayotganiga qarab ko‘plab `if` bor;
- bitta joy uchun o‘zgartirish qolgan barcha joylarni tekshirishni talab qiladi.

Amaliy qoida: uchinchi o‘xshash holatni ko‘rmaguningizcha va bu haqiqatan bitta bilim ekanini tushunmaguningizcha takrorlanishga yo‘l qo‘ying. Agar abstraksiya allaqachon noto‘g‘ri bo‘lsa, nusxalarni qaytarib, kodni qayta ajratishdan qo‘rqmang.

## KISS amalda

- Agar jamoa tezroq o‘qisa, oddiy sikl beshta hiyla-nayrangli operatsiya zanjiridan tushunarliroq.
- Alohida servis, navbat yoki keshni «yirik kompaniyalar shunday qiladi» deb emas, aniq muammo bo‘lganda qo‘shing.
- Tushunarli o‘zgaruvchi nomi ko‘pincha izohning o‘rnini bosadi.

Soddalik — primitivlik emas. Oddiy yechim ko‘proq o‘ylashni talab qilishi mumkin, lekin kamroq harakatlanuvchi qismlar qoldiradi.

## YAGNI amalda

Odatiy buzilishlar:

- birorta ham plagini yo‘q ilova uchun universal plaginlar tizimi;
- bitta ishlatilayotganda bir nechta ma’lumotlar bazasini qo‘llab-quvvatlash;
- hech kim hech qachon o‘zgartirmagan parametrlar uchun sozlamalar.

Har bir shunday «zaxira» hozir vaqt oladi va keyin xalaqit beradi: uni qo‘llab-quvvatlash, testlash va aylanib o‘tish kerak. Ehtiyoj paydo bo‘lganda siz real talablarni bilasiz va aniqroq qilasiz.

YAGNI yaxshi tuzilmani bekor qilmaydi: toza, testlar bilan qoplangan kodni vaqti kelganda kengaytirish oson.

## Tamoyillar bir-birini qanday muvozanatlaydi

| Vaziyat | Tamoyil nima maslahat beradi |
|---|---|
| Bitta biznes qoidasi uch joyda | DRY: bitta joyga chiqarish |
| Umumiy funksiya flaglar bilan to‘lgan | KISS: qaytadan oddiylarga ajratish |
| «O‘sish uchun» abstraksiya qilgisi keladi | YAGNI: real ehtiyojni kutish |
| Oddiy yechim kodni takrorlaydi | Baholash: bu bitta bilimmi |

DRY murakkab abstraksiyaga undasa, KISS va YAGNI uni ushlab turadi. KISS bitta qoidani nusxalashga aylansa, DRY nomuvofiqlik narxini eslatadi.

## FAQ

### Har qanday takrorlanish DRY ning buzilishimi?

Yo‘q. DRY matnga emas, bilimga tegishli. Turli sabablarga ko‘ra o‘zgaradigan ikki bir xil fragmentni alohida qoldirgan ma’qul.

### YAGNI puxta o‘ylangan arxitekturaga zid emasmi?

Yo‘q. YAGNI keraksiz funksionallikni yozishni taqiqlaydi, o‘ylashni emas. Yaxshi tuzilma va testlar aynan kerakli narsani keyinroq og‘riqsiz qo‘shish imkonini beradi.

### Loyihada hammasi murakkab bo‘lsa, nimadan boshlash kerak?

Eng ko‘p o‘zgartiriladigan joyni toping va uni soddalashtiring: ishlatilmaydigan opsiyalarni olib tashlang, ortiqcha yuklangan funksiyalarni ajrating, takrorlanuvchi qoidalarni bitta joyga yig‘ing.
