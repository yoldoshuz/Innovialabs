---
title: A/B-testni to‘g‘ri o‘tkazish: gipotezadan xulosagacha
description: A/B-testni to‘g‘ri o‘tkazish: gipoteza, asosiy metrika, tanlanma hajmi va davomiylikni hisoblash, vosita tanlash va natijani hujjatlashtirish.
summary: To‘g‘ri A/B-test ishga tushirishdan oldin tanlangan gipoteza va bitta asosiy metrikadan boshlanadi. So‘ng tanlanma hajmini oldindan hisoblaysiz, testni muddatidan oldin to‘xtatmaysiz va natijani, hatto salbiy bo‘lsa ham, eksperimentlar jurnaliga yozib qo‘yasiz.
---
## Qisqa javob

**A/B-test** — trafik tasodifiy ravishda A (joriy) va B (o‘zgartirilgan) versiyalar o‘rtasida bo‘linadigan, so‘ng oldindan tanlangan metrika solishtiriladigan eksperiment. Xulosa ishonchli bo‘lishi uchun barcha muhim narsalar **ishga tushirishdan oldin** hal qilinadi: gipoteza, asosiy metrika, tanlanma hajmi va davomiylik.

## 1-qadam. Gipoteza

Yaxshi gipoteza ma’lumotlarga tayanadi va tekshirib bo‘ladi. Format:

> Agar biz **[o‘zgarish]** qilsak, **[metrika]** o‘zgaradi, chunki **[ma’lumotlardagi sabab]**.

Misol: «Agar ariza formasini ikki maydongacha qisqartirsak, arizaga konversiya oshadi, chunki Vebvizorda odamlar formani uchinchi maydonda tashlab ketayotgani ko‘rinadi».

Gipoteza manbalari: voronka analitikasi, bosishlar xaritalari, sessiya yozuvlari, qo‘llab-quvvatlash murojaatlari, mijozlar bilan suhbatlar. Yomon gipoteza — «yashil tugmani sinab ko‘raylik, balki ishlab qolar».

## 2-qadam. Asosiy va himoya metrikalari

- **Asosiy metrika** bitta bo‘ladi. B versiya yutdimi yoki yo‘qmi — shu hal qiladi. Odatda bu maqsadli harakatga konversiya: ariza, xarid, ro‘yxatdan o‘tish.
- **Himoya metrikalari** (guardrail) hech narsa buzilmaganini kuzatadi: o‘rtacha chek, qaytarishlar ulushi, lidlar sifati, sahifa tezligi.

Agar o‘nta metrikani kuzatib, «o‘sgan»ini tanlasangiz, tasodifiy shovqin deyarli albatta yolg‘on g‘alaba beradi.

## 3-qadam. Tanlanma hajmi va davomiylik

Tanlanma hajmi to‘rtta parametrga bog‘liq:

| Parametr | Ma’nosi | Odatiy tanlov |
|---|---|---|
| **Bazaviy konversiya** | A versiyaning joriy ko‘rsatkichi | Analitikadan olinadi |
| **MDE** | Siz sezmoqchi bo‘lgan minimal ta’sir | O‘zingiz hal qilasiz: biznes uchun qanday o‘sish ahamiyatli |
| **Ahamiyatlilik darajasi** | Yolg‘on g‘alabaning ruxsat etilgan xavfi | Ko‘pincha 5% |
| **Quvvat** | Ta’sir mavjud bo‘lsa, uni sezish ehtimoli | Ko‘pincha 80% |

Shu standart qiymatlar uchun bitta guruhga taxminiy formula mavjud:

```text
n ≈ 16 × p × (1 − p) / δ²
```

bu yerda `p` — bazaviy konversiya, `δ` — sezmoqchi bo‘lgan mutlaq farq. Masalan, konversiya 4% bo‘lsa va uning 5% gacha o‘sishini sezmoqchi bo‘lsangiz (δ = 0,01), har bir versiyaga taxminan 6–7 ming tashrifchi kerak bo‘ladi. Aniq hisob uchun tanlanma hajmi kalkulyatori yoki test vositasidan foydalaning.

**Davomiylik** = barcha guruhlar tanlanmasi ÷ testdagi kunlik trafik, **butun haftalargacha** yuqoriga yaxlitlanadi. Ish kunlari va dam olish kunlarida xulq-atvor farq qiladi, shuning uchun bir haftadan qisqa test deyarli har doim buzilgan bo‘ladi.

Hisob-kitobga ko‘ra test ko‘p oy davom etsa, trafik yetarli emas: kattaroq ta’sir kutilayotgan dadilroq o‘zgarishlarni sinang yoki sifat usullaridan — yuzabiliti-testlar va suhbatlardan foydalaning.

## 4-qadam. Vositalar

| Variant | Qachon mos keladi |
|---|---|
| **Varioqub** (Yandex Metrika ekotizimi) | Metrika allaqachon o‘rnatilgan saytlar |
| **A/B-test xizmatlari** (VWO, Optimizely, AB Tasty va boshqalar) | Dasturlashsiz marketing testlari, vizual muharrir |
| **Feature flags** (GrowthBook, LaunchDarkly, o‘z yechimlari) | Mahsulot va mobil ilovalardagi testlar, server mantiqi |
| **Reklama kabinetlarining ichki eksperimentlari** | Google Ads, Meta, Direktda e’lonlar, strategiyalar, qo‘nish sahifalarini solishtirish |

Mijoz tomonidagi vizual muharrirlar **miltillash**ga sabab bo‘lishi mumkin: tashrifchi bir lahzaga A versiyani, so‘ng B ni ko‘radi. Muhim sahifalar uchun trafikni server tomonida bo‘lish ishonchliroq.

## 5-qadam. Ishga tushirish va nazorat

- Taqsimot tasodifiy va **doimiy**: bitta tashrifchi har doim bitta versiyani ko‘radi.
- **SRM** ni (sample ratio mismatch) tekshiring: agar 50/50 bo‘lsangiz-u, guruhlarda tashrifchilar soni sezilarli farq qilsa, bo‘lish buzilgan va natijalarga ishonib bo‘lmaydi.
- **Ko‘z tashlab to‘xtatmang.** Farq «ahamiyatli bo‘lgan» paytda testni to‘xtatish yolg‘on g‘alaba xavfini keskin oshiradi. Hisoblangan tanlanmani kuting yoki buni hisobga oladigan ketma-ket tahlilli vositadan foydalaning.
- Test o‘rtasida versiyalar, reklama va byudjetlarni o‘zgartirmang.

## 6-qadam. Xulosa va hujjatlashtirish

Uchta natija bo‘lishi mumkin: B yaxshiroq, B yomonroq yoki farq aniqlanmadi. Oxirgisi ham natija: o‘zgarish sezilarli hajmdagi ta’sir bermadi.

**Eksperimentlar jurnalini** yuriting — har bir test uchun jadval qatori yoki sahifa:

- gipoteza va uning ortidagi ma’lumotlar;
- versiyalar skrinshotlari;
- asosiy va himoya metrikalari;
- sanalar, tanlanma, taqsimot;
- ishonch oralig‘i bilan natija;
- qaror va keyin nimani tekshirish kerakligi.

Jurnal muvaffaqiyatsiz testlarni takrorlashdan saqlaydi va jamoadagi yangi odamlarga yordam beradi.

## FAQ

### Bir vaqtning o‘zida bir nechta o‘zgarishni sinash mumkinmi?

Bitta B versiyada mumkin, lekin unda har bir o‘zgarishning emas, butun to‘plamning ta’sirini bilib olasiz. Ularni alohida baholash uchun ko‘p omilli test kerak, unga esa ancha ko‘p trafik talab qilinadi.

### Natija ahamiyatsiz bo‘lsa nima qilish kerak?

Ta’sir belgilangan MDE dan kichik yoki umuman yo‘q ekanini qabul qiling. Ahamiyatlilikka «yetkazish» umidida testni cheksiz uzaytirmang — kuchliroq gipoteza tuzgan ma’qul.

### A/B-test o‘rniga «oldin va keyin» solishtiruvi to‘g‘ri keladimi?

Faqat taxminiy baho sifatida. «Oldin va keyin» natijasiga mavsum, reklama kampaniyalari va raqobatchilar harakatlari ta’sir qiladi, A/B-test esa versiyalarni bir xil sharoitda solishtiradi.
