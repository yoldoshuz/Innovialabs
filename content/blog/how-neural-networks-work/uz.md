---
title: Neyron tarmoqlar qanday ishlaydi: murakkab matematikasiz tushuntirish
description: Neyronlar, vaznlar, xatoni teskari tarqatish orqali o‘qitish va qayta o‘qitish — oddiy o‘xshatishlar va raqamli kichik misol bilan.
summary: Neyron tarmoq — sozlanadigan vaznli ko‘plab oddiy funksiyalar; o‘qitish javobni to‘g‘risi bilan solishtiradi va xato kamayishi uchun vaznlarni asta-sekin suradi.
---
## Mohiyati ikki xatboshida

**Neyron tarmoq** — kiruvchi sonlarni (piksellar, so‘zlar, narxlar) chiquvchi sonlarga (sinf, keyingi so‘z, prognoz) aylantiruvchi funksiya. Ichida u ko‘plab kichik bloklardan — **neyronlardan** iborat, har birida sozlanadigan sonlar bor: **vaznlar**.

Boshida vaznlar tasodifiy va tarmoq noto‘g‘ri javob beradi. **O‘qitish** — tarmoq to‘g‘ri javobli misollarni ko‘p marta ko‘radigan va har bir xatodan keyin vaznlarni biroz o‘zgartiradigan jarayon. Qoidalarni hech kim qo‘lda yozmaydi: qoidalar vaznlarda «o‘tirib qoladi».

## Bitta neyron nima qiladi

Neyron bir nechta kirishni oladi, har birini o‘z vazniga ko‘paytiradi, qo‘shadi, **siljish** (bias) qo‘shadi va natijani **aktivatsiya funksiyasi** orqali o‘tkazadi — masalan, manfiy qiymatlarni nolga aylantiradigan oddiy chiziqsiz funksiya.

O‘xshatish: siz soyabon olish-olmaslikni hal qilyapsiz. Kirishlar — bulutlilik, prognoz, namlik. Vaznlar — har bir belgiga qanchalik ishonishingiz. Yig‘indi chegaradan yuqori bo‘lsa — soyabon olasiz.

Bitta neyron kam narsa qila oladi. Lekin ularni **qatlamlarga** — kirish, bir nechta yashirin va chiqish qatlamlariga — yig‘sangiz, tarmoq murakkab bog‘liqliklarni ushlay boshlaydi: birinchi qatlamlar oddiy belgilarni sezadi, keyingilari ularni murakkabroqlarga birlashtiradi.

## Tarmoq qanday o‘rganadi: kichik misol

Tarmoq aktivatsiyasiz bitta neyron bo‘lsin: `javob = w × x`. Biz unga aytmasdan, sonni ikki baravar oshirishni o‘rganishini xohlaymiz.

1. Boshlang‘ich vazn `w = 0.5`. Misol: `x = 3`, to‘g‘ri javob `6`.
2. Tarmoq `0.5 × 3 = 1.5` deb javob beradi. Xato: `1.5 − 6 = −4.5`.
3. Vaznni qaysi tomonga o‘zgartirishni hisoblaymiz. Kvadratik xato uchun qiyalik `2 × (−4.5) × 3 = −27`.
4. **O‘qitish qadami** `0.01` bilan qiyalikka qarshi kichik qadam tashlaymiz: `w = 0.5 + 0.27 = 0.77`.
5. Yangi javob: `0.77 × 3 = 2.31` — 6 ga allaqachon yaqinroq.

Buni minglab misollarda takrorlang — `w` 2 ga yaqinlashadi. Haqiqiy tarmoqda millionlab va undan ko‘p vazn bor, **xatoni teskari tarqatish** (backpropagation) esa tarmoq chiqishidan kirishiga qarab harakatlanib, har bir vazn uchun shu «qiyalikni» tez hisoblash usuli.

## Qayta o‘qitish: tarmoq yodlab olganda

**Qayta o‘qitish** (overfitting) — tarmoq o‘quv misollarida a’lo javob beradi, yangilarida esa yomon. Xuddi biletlar javobini yodlab olgan, lekin fanni tushunmagan talaba kabi.

Buni qanday sezish va unga qarshi kurashish:

- **Ajratilgan tanlanma.** Ma’lumotlarning bir qismi o‘qitishda ko‘rsatilmaydi va sifat unda tekshiriladi. O‘qitishda xato kamayib, tekshiruvda o‘ssa — bu qayta o‘qitish.
- **Ko‘proq va xilma-xil ma’lumot.** Yodlash qiyinroq, qonuniyatni tushunish osonroq.
- **Erta to‘xtatish.** Tekshiruvdagi sifat o‘sishdan to‘xtaganda o‘qitishni tugatish.
- **Regulyarizatsiya va dropout.** Tarmoqning tasodifiy detallarga tayanishiga to‘sqinlik qiladigan usullar.
- **Soddaroq model.** Ma’lumot kam bo‘lsa, ulkan tarmoq deyarli albatta qayta o‘qitiladi.

## Biznes uchun nima muhim

- Neyron tarmoq **qoidalarni bilmaydi** — u ma’lumotlarni aks ettiradi. Yomon yoki bir tomonlama ma’lumot yomon model beradi.
- Sifatni o‘qitishda bo‘lgan misollarda emas, **yangi misollarda** tekshirish kerak.
- Tayyor modellar (LLM, tasvirni tanish) ko‘pincha vazifani allaqachon hal qiladi — o‘z modelingizni noldan o‘qitish o‘ylagandan kamroq kerak bo‘ladi.

## FAQ

### Neyron tarmoq inson miyasi kabi o‘ylaydimi?

Yo‘q. Nom biologiyadan olingan, lekin sun’iy neyron — bu ko‘paytirish va qo‘shishdan iborat formula. Miyaga o‘xshashlik ko‘proq metaforik.

### O‘qitish uchun qancha ma’lumot kerak?

Vazifa va modelning murakkabligiga bog‘liq. Ko‘pincha tayyor modelni olib, o‘z misollaringizning kichik to‘plamida qo‘shimcha o‘qitish noldan o‘qitishdan foydaliroq.

### Nega neyron tarmoq natijasini tushuntirish qiyin?

Bilimlar juda ko‘p vaznlarga taqsimlangan va hech bir alohida vazn tushunarli qoidaga mos kelmaydi. Tushuntirish uchun alohida tahlil usullari bor, lekin ular to‘liq shaffoflik bermaydi.
