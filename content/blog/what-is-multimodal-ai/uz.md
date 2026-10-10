---
title: Multimodal sun’iy intellekt nima: ko‘radigan va eshitadigan modellar
description: Bitta model matn, tasvir va audioni birgalikda qanday tushunadi va qaysi vazifalarni hal qiladi: skrinshotlar, grafiklar, hujjat fotolari va ovozli xabarlar.
summary: Multimodal model faqat matnni emas, balki tasvir yoki tovushni ham qabul qiladi va ular haqida bitta kontekstda fikr yuritadi. Bu bitta so‘rov bilan skrinshot, grafik yoki hujjat fotosini o‘qish imkonini beradi.
---
## Qisqacha: «multimodal» nimani anglatadi

**Modallik** — ma’lumot turi: matn, tasvir, audio, video. **Multimodal model** bir vaqtning o‘zida bir nechta modallik bilan ishlay oladi. Siz hisob-faktura fotosini yuborib, «summa va sanani ajratib ber» deb yozasiz — model rasmni ko‘radi va matnli so‘rovni bitta murojaatda tushunadi.

Avval buning uchun bir nechta tizim zanjiri kerak edi: matn uchun OCR, obyektlarni tanish uchun alohida model, nutq uchun ASR va bularning barchasini bog‘laydigan qoidalar. Multimodal LLM ushbu vazifalarning ko‘pini bitta model bilan yopadi.

## Ichkarida qanday ishlaydi

Soddalashtirilgan sxema:

1. **Har bir modallik uchun enkoder.** Tasvir kichik bo‘laklarga (patchlarga), audio qisqa segmentlarga bo‘linadi. Har bir bo‘lak sonlar vektoriga aylanadi.
2. **Umumiy fazo.** Bu vektorlar model matn tokenlarini ifodalaydigan formatga proyeksiya qilinadi.
3. **Til modeli.** So‘ng LLM «tasvir tokenlari» va matn tokenlarini birgalikda qayta ishlaydi va javob yaratadi.

Shu sababli model tasvirni shunchaki tasvirlabgina qolmay, u haqida **fikr yurita** oladi: ikki grafikni solishtirish, interfeys skrinshotidagi xatoni topish, sxemani tushuntirish.

## Amaliy vazifalar

| Vazifa | Nima beramiz | Nima olamiz |
|---|---|---|
| Hujjatlarni o‘qish | Hisob-faktura, yuk xati yoki blanka fotosi | JSON dagi maydonlar: summa, sana, STIR, pozitsiyalar |
| Skrinshotlar | Xato yoki interfeys skrinshoti | Muammo izohi, tuzatish qadamlari |
| Grafik va jadvallar | Hisobotdagi diagramma tasviri | Xulosalar, trendlar, jadval ko‘rinishidagi ma’lumot |
| Tovar fotolari | Vitrina yoki ombordan surat | Tavsif, kategoriya, holatni tekshirish |
| Ovoz | Mijozning audioxabari | Transkripsiya, murojaat mazmuni, ohang |
| Qo‘lyozma qaydlar | Uchrashuvdan keyingi doska fotosi | Tuzilgan vazifalar ro‘yxati |

### Misol: hujjat fotosidan ma’lumot ajratish

Modelga so‘rov quyidagicha bo‘lishi mumkin:

```text
Tasvirda yuk xati. Quyidagi maydonlar bilan JSON qaytar:
supplier, date (YYYY-MM-DD), total, items[{name, qty, price}].
Agar maydon ko‘rinmasa, null qo‘y. Qiymatlarni o‘ylab topma.
```

Asosiy jihatlar: aniq javob sxemasi, sana formati va taxmin qilishni ochiq taqiqlash.

## Multimodallik qayerda yutadi va qayerda yo‘q

**Yutadi:**

- qattiq OCR shablonlari buziladigan turli formatdagi hujjatlarda;
- faqat belgilarni tanish emas, kontekstni tushunish kerak bo‘lgan vazifalarda;
- tezkor prototiplarda: alohida model o‘qitish shart emas.

**Yutqazadi yoki ehtiyotkorlik talab qiladi:**

- real vaqtdagi videooqim — ixtisoslashgan CV modellari tezroq;
- juda mayda matn va sifatsiz foto — model raqamlarda adashishi mumkin;
- bir xil hujjatlarning katta hajmi — so‘rovlar narxi klassik pipeline dan yuqori bo‘lishi mumkin.

## Kutilmagan holatlarsiz qanday joriy qilish

- **Raqamlarni tekshiring.** Summa va sanalarni nazorat qoidalari bilan solishtiring: pozitsiyalar yig‘indisi jami summaga teng, sana ruxsat etilgan oraliqda.
- **Tuzilgan javob talab qiling** (JSON) va uni kod bilan validatsiya qiling.
- **Kirishni yaxshilang:** kesish, burish va yetarli o‘lcham natijaga sezilarli ta’sir qiladi.
- **Inson nazoratini saqlang** — ishonchlilik past yoki bahsli holatlar uchun.
- **Ma’lumotlarni hisobga oling:** hujjat fotolarida ko‘pincha shaxsiy ma’lumotlar bo‘ladi, shuning uchun ular qayerda va qanday qayta ishlanishini oldindan hal qiling.

## FAQ

### Multimodal model OCR ni almashtiradimi?

Ko‘p vazifalarda — ha, ayniqsa hujjatlar xilma-xil bo‘lib, tuzilmani tushunish kerak bo‘lsa. Lekin bir xil blankalarning katta oqimi uchun shablonli klassik OCR arzonroq va oldindan aytib bo‘ladigan bo‘lishi mumkin. Ko‘pincha ular birgalikda ishlatiladi.

### Bunday modellar videoni tushunadimi?

Ba’zi modellar video yoki kadrlar to‘plamini qabul qilib, nima sodir bo‘layotganini tasvirlay oladi. Kameralarni real vaqtda uzluksiz tahlil qilish uchun odatda ixtisoslashgan kompyuter ko‘rishi modellari ishlatiladi.

### Model fotodan o‘qigan raqamlarga ishonsa bo‘ladimi?

Faqat tekshiruv bilan. Model xira raqamni noto‘g‘ri o‘qib, uni ishonch bilan qaytarishi mumkin. Kod tomonida tekshiruvlar va muhim hujjatlar uchun qo‘lda ko‘rib chiqishni qo‘shing.
