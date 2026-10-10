---
title: LLM da temperature va top-p: generatsiya parametrlarini sozlash
description: Temperature va top-p nima qiladi, javoblarni qanday o‘zgartiradi va ma’lumot ajratish, qo‘llab-quvvatlash hamda ijodiy matnlar uchun qaysi sozlamalar mos.
summary: Temperature keyingi tokenni tanlashdagi tasodifiylik darajasini boshqaradi, top-p esa tanlovni eng ehtimolli variantlar bilan cheklaydi. Aniq vazifalar uchun past qiymatlar, ijodiy vazifalar uchun yuqoriroq qiymatlar qo‘ying va odatda faqat bitta parametrni o‘zgartiring.
---
## Qisqacha: bu parametrlar nima qiladi

LLM matnni bittadan **token** (so‘z yoki uning qismi) bilan yaratadi. Har bir qadamda model barcha mumkin bo‘lgan keyingi tokenlar uchun ehtimollikni hisoblaydi va ulardan birini **tanlaydi**. Temperature va top-p aynan shu tanlovni boshqaradi.

- **Temperature** — tanlov qanchalik «dadil» bo‘lishi. Past qiymat: deyarli har doim eng ehtimolli token olinadi. Yuqori qiymat: kamroq ehtimolli variantlarning imkoniyati oshadi.
- **Top-p (nucleus sampling)** — qaysi doiradan tanlash. Model tokenlarni ehtimollik bo‘yicha saralaydi va ularning umumiy ehtimolligi p ga yetguncha faqat eng ehtimollilarini qoldiradi. Qolganlari tashlab yuboriladi.

## Amalda qanday ko‘rinadi

Aytaylik, model «Do‘konimiz ishlaydi…» jumlasini davom ettirmoqda va baholari quyidagicha:

| Token | Ehtimollik |
|---|---|
| har kuni | 0.50 |
| soat | 0.25 |
| dam olish kunlarisiz | 0.15 |
| kecha-kunduz | 0.07 |
| suv ostida | 0.03 |

- **Temperature 0 ga yaqin:** deyarli har doim «har kuni». Javoblar barqaror va oldindan aytib bo‘ladigan.
- **Yuqoriroq temperature:** taqsimot «tekislanadi», «kecha-kunduz» yoki hatto «suv ostida» tez-tez paydo bo‘ladi. Matn xilma-xilroq, lekin g‘alati javoblar xavfi ortadi.
- **Top-p = 0.9:** model «har kuni», «soat», «dam olish kunlarisiz» (jami 0.90) ni oladi va faqat ular orasidan tanlaydi. Kam uchraydigan g‘alati variantlar kesiladi, xilma-xillik esa saqlanadi.

### Bitta so‘rov turli sozlamalar bilan

So‘rov: «Qahvaxona uchun nom o‘ylab top».

- Past temperature: bir necha marta ishga tushirish bir xil yoki juda o‘xshash nomlarni beradi.
- O‘rtacha: variantlar farq qiladi, lekin o‘rinli bo‘lib qoladi.
- Yuqori: kutilmagan va ba’zan ma’nosiz so‘z birikmalari paydo bo‘ladi.

## Vazifalar bo‘yicha tavsiya etilgan sozlamalar

Aniq diapazonlar model va provayderga bog‘liq, shuning uchun boshqalarning misollaridagi raqamlarga emas, mantiqqa tayaning.

| Vazifa | Temperature | Top-p | Nega |
|---|---|---|---|
| Ma’lumot ajratish, klassifikatsiya, JSON | minimal (0 yoki unga yaqin) | standart | Bitta to‘g‘ri va takrorlanadigan javob kerak |
| Qo‘llab-quvvatlash javoblari, RAG | past | standart | Aniqlik va hujjatlarga tayanish xilma-xillikdan muhimroq |
| Xulosa, qayta ifodalash | past yoki o‘rtacha | standart | Ma’nodan chetlashmasdan tabiiy matn kerak |
| Marketing matnlari, g‘oyalar, nomlar | o‘rtacha yoki yuqori | standart yoki biroz pastroq | Variantlar xilma-xilligi qadrlanadi |

Parametrlar bilan API chaqiruvi misoli:

```python
response = client.chat.completions.create(
    model="your-model",
    messages=[{"role": "user", "content": "Matndan sana va summani ajratib ber..."}],
    temperature=0,
)
```

## Keng tarqalgan xatolar

- **Ikkala parametrni birdaniga o‘zgartirish.** Ko‘plab provayderlar hujjatlari temperature yoki top-p dan birini sozlashni maslahat beradi. Shunda natijaga nima ta’sir qilgani aniq bo‘ladi.
- **Temperature 0 da to‘liq determinizm kutish.** Javoblar ancha barqarorlashadi, lekin har safar aynan bir xil natija kafolatlanmaydi.
- **Gallyutsinatsiyalarni temperature bilan davolash.** Past temperature tasodifiylikni kamaytiradi, ammo bilim qo‘shmaydi. To‘qib chiqarilgan faktlarga qarshi RAG, aniq ko‘rsatmalar va javobni tekshirish yordam beradi.
- **Qo‘llab-quvvatlashda «jonlilik» uchun temperature ni oshirish.** Ohangni tasodifiylik bilan emas, prompt bilan bering.
- **Parametrlar qo‘llab-quvvatlanishini tekshirmaslik.** Ba’zi modellar, ayniqsa fikrlash rejimidagilar, bu sozlamalarni e’tiborsiz qoldiradi yoki cheklaydi. Aniq model hujjatlarini ko‘ring.

## Qiymatlarni qanday tanlash

1. Standart qiymatlardan yoki aniq vazifalar uchun past temperature dan boshlang.
2. 20–30 ta odatiy so‘rov to‘plang.
3. Ularni bitta parametrning turli qiymatlari bilan bir necha marta ishga tushiring.
4. Faqat sifatni emas, barqarorlikni ham baholang: javoblar ishga tushirishlar orasida qanchalik farq qiladi.
5. Tanlangan qiymatlarni kodda mustahkamlang va modelni almashtirganda qayta ko‘rib chiqing.

## FAQ

### Nimani tanlash kerak: temperature yoki top-p?

Ko‘pchilik vazifalar uchun temperature yetarli va tushunarliroq. Top-p kam uchraydigan g‘alati variantlarsiz xilma-xillik kerak bo‘lganda foydali. Bitta parametrni o‘zgartiring, ikkinchisini standart holatda qoldiring.

### Nega temperature 0 da ham javoblar ba’zan farq qiladi?

Natijaga provayder tomonidagi hisoblash va so‘rovlarni qayta ishlash xususiyatlari ta’sir qiladi. Javoblar juda o‘xshash bo‘ladi, lekin baytma-bayt mos kelishi kafolatlanmaydi.

### Temperature tezlik yoki narxga ta’sir qiladimi?

Bevosita yo‘q: narx tokenlar soniga bog‘liq. Bilvosita esa yuqori temperature uzunroq javoblar, demak ko‘proq token berishi mumkin.
