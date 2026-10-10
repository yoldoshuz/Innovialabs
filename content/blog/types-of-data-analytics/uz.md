---
title: Ma’lumotlar tahlili asoslari: tavsiflovchi, diagnostik, bashoratli
description: Analitikaning to‘rt turi biznes misollarida, metrikalarning asosiy lug‘ati va biznes savolini xulosa hamda aniq harakatga aylantiradigan oddiy jarayon.
summary: Analitika navbat bilan to‘rtta savolga javob beradi: nima bo‘ldi (tavsiflovchi), nega (diagnostik), nima bo‘ladi (bashoratli) va nima qilish kerak (tavsiyaviy). Foydali tahlil ma’lumotlardan emas, aniq biznes savoli va aniq belgilangan metrikadan boshlanadi.
---

## Analitika javob beradigan to‘rt savol

Ma’lumotlar tahlili bitta harakat emas, balki savollar zinapoyasi. Har bir pog‘ona oldingisiga tayanadi:

| Turi | Savol | Biznesdan misol |
|---|---|---|
| **Tavsiflovchi** | Nima bo‘ldi? | O‘tgan oydagi savdo undan oldingi oyga nisbatan tushib ketdi |
| **Diagnostik** | Nega bunday bo‘ldi? | Pasayish buyurtma rasmiylashtirish yangilangandan keyin mobil foydalanuvchilar hisobiga bo‘ldi |
| **Bashoratli** | Ehtimol nima bo‘ladi? | Keyingi chorak uchun hududlar bo‘yicha talab prognozi |
| **Tavsiyaviy** | Nima qilishimiz kerak? | Qaysi tovarni buyurtma qilish va reklama byudjetini qayerga o‘tkazish |

Ko‘pchilik kompaniyalar uchun eng katta foydani sifatli bajarilgan dastlabki ikki pog‘ona beradi. Iflos tavsiflovchi ma’lumotlarga asoslangan prognoz prognoz yo‘qligidan ham yomonroq.

## Tavsiflovchi analitika

Bu hisobotlar: yig‘indilar, o‘rtacha qiymatlar, trendlar va davrlar bo‘yicha taqqoslashlar. Power BI, Metabase yoki Looker Studio kabi BI vositalaridagi dashbordlar asosan tavsiflovchi.

Yaxshi tavsiflovchi analitika **izchil** bo‘ladi: bitta metrika barcha hisobotlarda bir xil hisoblanadi va uning ta’rifini hamma biladi.

## Diagnostik analitika

Bu yerda sabablar izlanadi. Odatiy usullar:

- **Segmentatsiya** — metrikani kanallar, qurilmalar, hududlar, mijoz turlari bo‘yicha ajratish.
- **Drill-down** — umumiy natijadan o‘zgarish aynan sodir bo‘lgan darajagacha tushish.
- **Voronka tahlili** — foydalanuvchilar ketib qoladigan qadamni topish.
- **Kogorta tahlili** — bir davrda kelgan mijozlar guruhlarini taqqoslash.

Asosiy tuzoq — **korrelyatsiyani sababiyat bilan adashtirish**. Birga o‘zgaradigan ikki metrika bir-biriga ta’sir qilishi shart emas. Qaror muhim bo‘lsa, sababni tajriba, masalan A/B-test bilan tasdiqlang.

## Bashoratli analitika

Bashoratli analitika tarixiy ma’lumotlar asosida kelajakni baholaydi: talab prognozi, har bir mijozning ketib qolish ehtimoli, kutilayotgan tushum. Usullar oddiy trend va mavsumiylikdan mashinali o‘qitish modellarigacha bo‘ladi.

Prognoz — bu va’da emas, har doim **noaniqlikka ega oraliq**. U qaysi tarix asosida qurilgan bo‘lsa, shunchalik yaxshi: agar biznes keskin o‘zgargan bo‘lsa, eski ma’lumotlar chalg‘itishi mumkin.

## Tavsiyaviy analitika

Oxirgi pog‘ona harakatlarni tavsiya qiladi: optimal narxlar, ombor qoldiqlari, yetkazib berish yo‘nalishlari, qaysi mijozlarga chegirma berish. U prognozlarni cheklovlar va maqsadlar bilan birlashtiradi. Odatda buning uchun yetuk ma’lumotlar va qaror qabul qilishning aniq qoidalari kerak.

## Metrikalar lug‘ati

- **Metrika** — har qanday o‘lchanadigan qiymat: buyurtmalar, tushum, tashriflar.
- **KPI** — maqsadga bog‘langan asosiy metrika; jamoada ular kam bo‘lishi kerak.
- **O‘lcham (dimension)** — metrika nima bo‘yicha ajratiladi: sana, shahar, kanal.
- **Konversiya** — maqsadli harakatni bajargan foydalanuvchilar ulushi.
- **Ushlab qolish (retention)** va **ketish (churn)** — davr mobaynida qolgan yoki ketgan mijozlar ulushi.
- **O‘rtacha chek (AOV)** — tushumni buyurtmalar soniga bo‘lish.
- **LTV** — mijoz bilan munosabatlarning butun davri davomida undan tushgan daromad.
- **CAC** — bitta yangi mijozga to‘g‘ri keladigan marketing va savdo xarajatlari.
- **DAU / MAU** — kunlik va oylik faol foydalanuvchilar.
- **Ko‘z bo‘yovchi metrika (vanity metric)** — chiroyli ko‘rinadigan, lekin qaror qabul qilishga yordam bermaydigan raqam, masalan faollikni hisobga olmagan umumiy ro‘yxatdan o‘tishlar soni.

## Savoldan xulosagacha: jarayon

1. **Savolni shakllantiring.** «Nega uchinchi chorakda takroriy xaridlar kamaydi?» — ishchi savol; «keling, ma’lumotlarga qaraymiz» — yo‘q.
2. **Metrikani aniq belgilang.** Takroriy xarid deb nima hisoblanadi, qaysi vaqt oralig‘ida, qaysi buyurtmalar chiqarib tashlanadi.
3. CRM, veb-analitika, buxgalteriya, reklama kabinetlaridan **ma’lumotlarni yig‘ing**.
4. **Tozalang**: dublikatlar, test buyurtmalari, bo‘sh qiymatlar, turli vaqt zonalari.
5. **Tahlil qiling**: davrlarni taqqoslang, segmentlang, faqat o‘rtachalarga emas, taqsimotlarga ham qarang.
6. Savolga javob beradigan eng oddiy grafik bilan **vizuallashtiring**.
7. **Xulosa va harakatni shakllantiring**: nimani bildik va nimani o‘zgartiramiz.
8. Harakat **samarasini o‘lchang** va 1-qadamga qayting.

## Ko‘p uchraydigan xatolar

- Aniq savol o‘rniga «hamma narsa haqida» dashborddan boshlash.
- Turli bo‘limlar «bir xil» metrikani turlicha hisoblaydi.
- Chetga chiquvchi qiymatlar va turli mijoz guruhlarini yashiradigan o‘rtachalarga ishonish.
- Juda kichik tanlanmalar bo‘yicha xulosa chiqarish.
- Asosiy hisobotlar ishonchli bo‘lmasdan turib prognoz qurish.

## FAQ

### Kichik biznes analitikaning qaysi turidan boshlashi kerak?

Tavsiflovchidan. Bir nechta asosiy metrikalar — savdo, konversiya, takroriy xaridlar — bo‘yicha aniq ta’riflar bilan ishonchli hisobotlarni yo‘lga qo‘ying. Tushuntirishni xohlaydigan o‘zgarishlarni ko‘rganingizda diagnostika o‘z-o‘zidan paydo bo‘ladi.

### Bashoratli analitika uchun data scientist kerakmi?

Trend va mavsumiylikka asoslangan oddiy prognozlar uchun ko‘pincha malakali tahlilchi va standart vositalar yetarli. Katta miqyosda ketish yoki talab bo‘yicha mashinali o‘qitish modellari odatda maxsus ko‘nikmalar va yaxshi tayyorlangan ma’lumotlarni talab qiladi.

### Metrika KPI dan nimasi bilan farq qiladi?

Har qanday KPI metrika, lekin har qanday metrika KPI emas. KPI — biznes maqsadiga bevosita bog‘langan va taraqqiyotni baholash uchun ishlatiladigan bir nechta metrikalardan biri; qolganlari KPI nega o‘zgarganini tushuntirishga yordam beradi.
