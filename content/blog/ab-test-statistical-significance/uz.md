---
title: A/B-test statistikasi: ahamiyatlilik, tanlov hajmi va oraliq kuzatish
description: P-value, test quvvati, minimal aniqlanadigan effekt, oraliq kuzatish muammosi, ko‘p taqqoslashlar va bayes yondashuvi haqida oddiy tilda.
summary: Ishonchli A/B-test oldindan rejalashtiriladi: asosiy metrika va aniqlash kerak bo‘lgan eng kichik effekt tanlanadi, ular asosida tanlov hajmi hisoblanadi. Keyin test birinchi «ahamiyatli» natijada to‘xtatilmasdan shu hajmgacha davom etadi — aks holda soxta g‘alabalar ahamiyatlilik darajasi va’da qilganidan ancha ko‘p bo‘ladi.
---

## Bir daqiqada asosiysi

A/B-testlardagi xatolarning aksariyati formulalarda emas, jarayonda. To‘g‘ri tartib:

1. Gipotezani yozing va **bitta asosiy metrikani** tanlang.
2. **Minimal aniqlanadigan effektni** (MDE) belgilang — variantni joriy qilishga arziydigan eng kichik o‘zgarish.
3. MDE, ahamiyatlilik darajasi va quvvat bo‘yicha **tanlov hajmini** hisoblang.
4. Testni ishga tushiring va tanlov to‘lmaguncha qaror qabul qilmang (yoki ketma-ket usuldan foydalaning).
5. Ma’lumotlar sifatini tekshiring, shundan keyingina natijani o‘qing.

## P-value aslida nimani bildiradi

**P-value** — *agar variantlar aslida farq qilmasa*, kuzatilgandan kam bo‘lmagan farqni ko‘rish ehtimoli. Bu B ning A dan yaxshi ekanligi ehtimoli ham, xato ehtimoli ham emas.

Odatda **ahamiyatlilik darajasi α = 0,05** qilib belgilanadi: p-value undan past bo‘lsa, natija ahamiyatli deyiladi. Bu shuni anglatadiki, real effekt bo‘lmaganda ham taxminan har yigirma testdan birida soxta «g‘alaba» olasiz. Bu **birinchi tur xatosi** deyiladi.

## Quvvat va MDE

**Quvvat** — effekt haqiqatan mavjud va MDE dan kichik bo‘lmasa, uni aniqlash ehtimoli. Odatiy mo‘ljal — 80%. Qolgan 20% — **ikkinchi tur xatosi**: effekt bor edi, test uni sezmadi.

MDE, quvvat va tanlov hajmi o‘zaro bog‘liq:

| Nima xohlaysiz | Narxi |
|---|---|
| Kichikroq effektlarni ushlash | Kattaroq tanlov |
| Yuqoriroq quvvat | Kattaroq tanlov |
| Qat’iyroq α | Kattaroq tanlov |
| Yuqoriroq bazaviy konversiya | Bir xil nisbiy effektda kichikroq tanlov |

Konversiya metrikalari uchun taxminiy qoida bor (α = 0,05, quvvat 80%): har bir guruhga taxminan `16 × p × (1 − p) / δ²` foydalanuvchi kerak, bu yerda `p` — bazaviy konversiya, `δ` — mutlaq farq. Konversiya 5% bo‘lib, uning 6% gacha o‘sishini sezmoqchi bo‘lsangiz, bu har bir guruhga taxminan 7 600 kishi. Aniq hisob uchun kalkulyator yoki kutubxonadan foydalaning.

```python
from statsmodels.stats.power import NormalIndPower
from statsmodels.stats.proportion import proportion_effectsize

effect = proportion_effectsize(0.06, 0.05)
n = NormalIndPower().solve_power(effect_size=effect, alpha=0.05, power=0.8)
print(round(n))  # har bir guruhdagi foydalanuvchilar
```

Agar oqilona MDE uchun trafik yetmasa, test javob bermaydi. Dadilroq o‘zgarishlarni yoki voronkaning yuqoriroq qismidagi metrikalarni test qiling.

## Oraliq kuzatish muammosi

**Oraliq kuzatish** (peeking) — natijaga har kuni qarab, p-value 0,05 dan pastga tushishi bilan testni to‘xtatish. Test boshida tasodifiy tebranishlar katta, ko‘p marta tekshirilganda esa kamida bir marta soxta ahamiyatlilikni ko‘rish ehtimoli e’lon qilingan 5% dan ancha oshib ketadi.

Bunga qanday yondashish:

- **Qat’iy gorizont**: qaror faqat hisoblangan tanlov to‘lgandan keyin. Nosozliklarni ushlash uchun qarash mumkin, xulosa uchun emas.
- **Ketma-ket testlash**: oldindan belgilangan tekshiruv nuqtalari va tuzatilgan chegarali usullar (group sequential, alpha spending) yoki «doim valid» p-value’lar. Ko‘plab eksperiment platformalari ularni qo‘llab-quvvatlaydi.
- **To‘liq haftalar**: ish kunlari va dam olish kunlaridagi xulq farq qiladi, shuning uchun davomiylik haftaga karrali bo‘lsin.

## Ko‘p taqqoslashlar

Qancha ko‘p variant, metrika va segmentni tekshirsangiz, tasodifan «ahamiyatli» narsa topish ehtimoli shuncha yuqori. α = 0,05 bilan o‘nta metrika — deyarli kafolatlangan bitta soxta topilma.

- Oldindan **bitta asosiy metrikani** belgilang, qolganlari — yordamchi va himoya metrikalari.
- Bir nechta variant uchun tuzatishlarni qo‘llang: **Bonferroni** (α taqqoslashlar soniga bo‘linadi — oddiy, lekin konservativ), **Holm** yoki **Benjamini — Hochberg** (soxta kashfiyotlar ulushini nazorat qiladi).
- Segmentlardagi topilmalarni («iOS’dagi Safari’da o‘sdi») natija emas, yangi test uchun gipoteza deb hisoblang.

## Bayes va chastotali yondashuvlar

| | Chastotali | Bayes |
|---|---|---|
| Javob | p-value va ishonch oralig‘i | «B ning A dan yaxshi bo‘lish ehtimoli» va kutilgan yo‘qotishlar |
| Boshlang‘ich farazlar | apriori ma’lumot yo‘q | apriori taqsimotni berish kerak |
| Talqin | kamroq intuitiv | biznes savoliga yaqinroq |
| Oraliq kuzatish | xato nazoratini buzadi | to‘xtash qoidasi baribir kerak |

Bayes yondashuvini jamoaga tushuntirish osonroq, lekin u intizomni bekor qilmaydi: ehtimol chegaradan oshishi bilan testni to‘xtatsangiz, xatolar ham ko‘payadi. Yondashuv tanlovi oldindan qayd etilgan rejadan kamroq muhim.

## Natijani o‘qishdan oldingi tekshiruvlar

- **SRM (sample ratio mismatch)**: 50/50 bo‘lgan bo‘lsangiz-u, guruhlar sezilarli notekis chiqsa, split yoki treking buzilgan — natijaga ishonib bo‘lmaydi.
- Ikkala guruhda bir xil hodisalar va filtrlar.
- Bir xil sahifalarda izolyatsiyasiz parallel testlar yo‘q.
- Yangilik effekti hisobga olingan: dastlabki kunlardagi sakrash ko‘pincha so‘nadi.

## FAQ

### Natija aniq bo‘lsa, testni erta to‘xtatsa bo‘ladimi?

Faqat boshidanoq erta to‘xtatish qoidasi bilan ketma-ket usuldan foydalangan bo‘lsangiz. Klassik testda erta to‘xtatish soxta g‘alabalar ulushini oshiradi.

### Test «ahamiyatli emas» chiqsa nima qilish kerak?

Bu variantlar bir xil ekanligining isboti emas, faqat MDE o‘lchamidagi effekt aniqlanmaganini bildiradi. Ishonch oralig‘iga qarang: agar u tor va nolga yaqin bo‘lsa, katta effekt bo‘lmasa kerak.

### Kichik saytga A/B-test kerakmi?

Agar trafik hatto katta MDE uchun ham yetmasa, sifat usullari foydaliroq: yuzabiliti-testlar, sessiya yozuvlari, so‘rovnomalar. Bunday saytlarda faqat dadil o‘zgarishlar test qilinadi.
