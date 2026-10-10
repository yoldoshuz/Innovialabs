---
title: A/B-test nima va saytda nimalarni sinab ko‘rish mumkin
description: A/B-test qanday tuzilgan: nazorat va variant, saytning qaysi elementlarini sinash kerak, xulosada qanday adashmaslik va trafik qachon juda kam bo‘ladi.
summary: A/B-test — trafik tasodifiy ravishda sahifaning joriy versiyasi (nazorat) va o‘zgartirilgan versiyasi (variant) o‘rtasida bo‘linadigan tajriba; so‘ngra oldindan tanlangan bitta metrika bo‘yicha qaysi versiya yaxshiroq ishlashi va farq tasodifiy emasligi tekshiriladi.
---
## Qisqa javob

**A/B-test** — o‘zgarishni majlisda bahslashish o‘rniga haqiqiy foydalanuvchilarda tekshirish usuli. Tashrif buyuruvchilar tasodifiy ravishda ikki guruhga bo‘linadi:

- **A — nazorat**: sahifaning joriy versiyasini ko‘radi;
- **B — variant**: bitta o‘zgarishi bor versiyani ko‘radi.

Ikkala guruh ham saytga bir vaqtda, bir xil manbalardan keladi. Agar B guruhida konversiya sezilarli darajada yuqori bo‘lsa va farq statistik jihatdan ahamiyatli bo‘lsa, o‘zgarish hamma uchun joriy etiladi.

«O‘zgartirdik va nima bo‘lganini ko‘ramiz» yondashuvidan asosiy farqi: ketma-ket solishtirishda natijaga mavsum, reklama, yangiliklar, raqobatchilar ta’sir qiladi. A/B-testda bu omillar ikkala guruhga bir xil ta’sir ko‘rsatadi.

## Testni qanday o‘tkazish: bosqichma-bosqich

1. **Gipotezani shakllantiring.** «Tugmani yashil qilaylik» emas, balki «agar narxni birinchi ekranda ko‘rsatsak, ko‘proq odam formagacha yetadi, chunki qo‘ng‘iroqlarda ko‘pincha narx haqida so‘rashadi».
2. **Bitta asosiy metrikani tanlang.** Masalan, ariza yuborish. Yordamchi metrikalarga qarang, lekin qarorni asosiysi bo‘yicha qabul qiling.
3. **Kerakli tanlov hajmini hisoblang.** Tanlov hajmi kalkulyatorlari joriy konversiya va siz sezmoqchi bo‘lgan effekt asosida qancha tashrif buyuruvchi kerakligini ko‘rsatadi.
4. **Ishga tushiring va tegmang.** Jarayonda shartlarni o‘zgartirmang va variant oldinga chiqishi bilan testni to‘xtatmang.
5. **To‘liq haftalik sikllarni o‘tkazing.** Ish kunlari va dam olish kunlaridagi xulq ko‘pincha farq qiladi.
6. **Natijani chiqaring va xulosani yozib qo‘ying** — g‘olib bo‘lmasa ham. Bu ham bilim.

## Nimalarni sinash kerak

| Element | O‘zgarishlar misollari |
|---|---|
| **Taklif (offer)** | aynan nima taklif qilyapsiz: bepul konsultatsiya, narx hisob-kitobi, demo |
| **Sarlavha** | foyda, muammo yoki muddatlarga urg‘u |
| **Formalar** | maydonlar soni, tartibi, telefon majburiyligi, ko‘p bosqichli forma |
| **Narxlar va tariflar** | tariflar tartibi, qaysi biri ajratilgan, sukut bo‘yicha oylik yoki yillik to‘lov |
| **Harakatga chaqiruv** | tugma matni, joylashuvi, ekrandagi tugmalar soni |
| **Ishonch** | sharhlar, kafolatlar, forma yonida e’tirozlarga javoblar |
| **Sahifa tuzilishi** | bloklar tartibi, sahifa uzunligi |

Eng kuchli effektni odatda **mazmun** o‘zgarishlari beradi — taklif, narx, forma. Tugma rangi va shrifti kamdan-kam sezilarli o‘zgarish beradi, lekin ularni sinashga ham xuddi shuncha trafik ketadi.

Narxlar bilan tajriba qilishda ehtiyot bo‘ling: bir xil narsa uchun turli odamlarga turli narx ko‘rsatish noetik bo‘lishi va ayrim hollarda qonun yoki platforma qoidalariga zid kelishi mumkin. Ko‘pincha narxning o‘zi emas, uning taqdim etilishi sinaladi.

## Trafik juda kam bo‘lsa

A/B-test hajm talab qiladi. Agar oyiga bir necha o‘nlab konversiya bo‘lsa, kichik yaxshilanishni sinovchi test juda uzoq davom etishi va ishonchli javob bermasligi mumkin.

Sinashga hali erta ekanining belgilari:

- tanlov kalkulyatori bir necha oylik muddatni ko‘rsatadi;
- maqsadli harakatlar haftasiga bir nechtagina;
- reklama kampaniyalari tufayli trafik keskin o‘zgarib turadi.

Buning o‘rniga nima qilish kerak:

- **katta o‘zgarishlarni sinang** — yangi taklif yoki boshqacha sahifa tuzilishi sezilarliroq farq beradi, uni ushlash osonroq;
- **voronka boshiga yaqinroq mikrokonversiyani o‘lchang**, masalan, formaga o‘tishni, bu murosa ekanini tushungan holda;
- **sifat tadqiqotlarini o‘tkazing** — sessiya yozuvlari, issiqlik xaritalari, mijozlar bilan intervyu, bir necha kishida yuzabiliti-testlar;
- **aniq yaxshilanishlarni testsiz joriy qiling** — buzilgan formani yoki sekin yuklanishni tuzatish uchun tajriba bilan isbotlash shart emas.

## Keng tarqalgan xatolar

- **Birinchi ustunlikda testni to‘xtatish.** Kichik raqamlarda yetakchi doimo almashib turadi.
- **Bir nechta narsani birdaniga o‘zgartirish** va nima ishlaganini tushunmaslik. Kombinatsiyalarni bir vaqtda sinash uchun multivariant testlar bor, lekin ularga yanada ko‘proq trafik kerak.
- **Oraliq natijalarga qarab yurish va testdan keyin qulay metrikani tanlash.**
- **Texnik tomonni tekshirmaslik:** variant sekinroq yuklanadi, miltillaydi yoki mobil qurilmada buziladi.
- **Trafik manbalarini hisobga olmaslik**, agar bir guruhga tasodifan ko‘proq reklama tashriflari tushgan bo‘lsa.

## FAQ

### A/B-test qancha davom etishi kerak?

Oldindan hisoblangan tanlovni yig‘ish uchun qancha kerak bo‘lsa, shuncha va turli kunlarni qamrab olish uchun kamida bir-ikki to‘liq hafta. Muddatni ishga tushirishdan oldin belgilang, jarayonda emas.

### Ikkitadan ortiq variantni sinash mumkinmi?

Ha, bu A/B/n-test. Lekin har bir yangi guruh trafikni bo‘ladi, shuning uchun ishonchli natija uchun ko‘proq tashrif buyuruvchi va vaqt kerak bo‘ladi.

### Testlarni nima bilan o‘tkazish mumkin?

Maxsus tajriba platformalari, sayt konstruktorlaridagi funksiyalar yoki event’larni analitikaga yuboradigan o‘z trafik bo‘lish kodingiz mos keladi. Muhimi — bo‘linish tasodifiy bo‘lsin va foydalanuvchi har doim bir xil versiyani ko‘rsin.
