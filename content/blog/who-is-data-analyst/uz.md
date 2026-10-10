---
title: Ma’lumotlar tahlilchisi kim: vazifalar, ko‘nikmalar va istiqbollar
description: Ma’lumotlar tahlilchisi amalda nima qiladi, data scientist va BI-dasturchidan farqi, qanday ko‘nikmalar kerak va qaysi sohalar ularni yollaydi.
summary: Ma’lumotlar tahlilchisi xom ma’lumotlarni biznes savollariga javobga aylantiradi: ma’lumotlarni yig‘adi, tozalaydi, metrikalarni hisoblaydi va ulardan qanday xulosa chiqishini tushuntiradi. Asosiy vositalari — SQL, jadvallar, vizualizatsiya va biznesni tushunish, murakkab mashinaviy o‘qitish modellari emas.
---

## Qisqacha: ma’lumotlar tahlilchisi kim

**Ma’lumotlar tahlilchisi** (data analyst) kompaniyaga sezgi emas, faktlar asosida qaror qabul qilishga yordam beradi. U ma’lumotlarni bazalar, CRM, analitika tizimlari va jadvallardan oladi, tartibga keltiradi, ko‘rsatkichlarni hisoblaydi va «nega hududda savdo tushdi», «qaysi kanal eng sodiq mijozlarni olib keladi» yoki «yangi funksiya ish berdimi» kabi savollarga javob beradi.

Uning ishining asosiy natijasi — jadval yoki grafik emas, balki kimdir qaror qabul qila oladigan **tushunarli xulosa**.

## Tahlilchi amalda nima qiladi

1. **Savolni aniqlashtiradi.** Vazifalar ko‘pincha noaniq keladi: «tushumga bir qarab chiq». Tahlilchi ularni aniq gipotezalar va metrikalarga aylantiradi.
2. **Ma’lumot yig‘adi.** SQL so‘rovlar yozadi, turli manbalardan ma’lumot oladi va ularni birlashtiradi.
3. **Ma’lumotni tozalaydi.** Dublikatlarni olib tashlaydi, bo‘sh qiymatlar bilan ishlaydi, raqamlar bir-biriga mos kelishini tekshiradi.
4. **Tahlil qiladi.** Metrikalarni hisoblaydi, segmentlarni solishtiradi, qonuniyatlarni izlaydi, kerak bo‘lsa statistik ahamiyatlilikni tekshiradi.
5. **Vizualizatsiya qiladi va tushuntiradi.** Dashboard yoki hisobot tayyorlaydi va xulosani oddiy tilda ifodalaydi.

Ma’lumot yig‘ish va tozalash ko‘pincha tahlilning o‘zidan ko‘proq vaqt oladi — bunga tayyor bo‘lish kerak.

## Ma’lumotlar tahlilchisi, data scientist va BI-dasturchi

| Rol | Asosiy fokus | Odatiy vositalar |
|---|---|---|
| Ma’lumotlar tahlilchisi | biznes savollariga javob, metrikalar, xulosalar | SQL, Excel/Google Sheets, BI-tizimlar, Python |
| Data scientist | bashorat qiluvchi modellar, mashinaviy o‘qitish | Python, statistika, ML-kutubxonalar |
| BI-dasturchi | hisobot infratuzilmasi, dashboard’lar, ma’lumot vitrinalari | SQL, BI-platformalar, ETL-vositalar |

Chegaralar noaniq va kompaniyaga bog‘liq; kichik jamoalarda bitta odam uchala rolni bajarishi mumkin. Umuman olganda: tahlilchi **nima bo‘layotganini tushuntiradi**, data scientist **bashorat qiluvchi modellar quradi**, BI-dasturchi esa **hisobotlar ishonchli va avtomatik shakllanishini ta’minlaydi**.

## Tahlilchining ko‘nikmalari

**Texnik:**

- **SQL** — eng muhim ko‘nikma. Tanlovlar, JOIN, guruhlash, oyna funksiyalari.
- **Jadvallar** — pivot jadvallar, formulalar, tezkor hisob-kitoblar.
- **BI-vositalar** — Power BI, Looker Studio, Tableau, Metabase yoki o‘xshashlari.
- **Python** — jadvallar yetmay qolganda ma’lumotlarni qayta ishlash uchun pandas.
- **Statistika** — o‘rtacha va mediana, taqsimotlar, A/B testlar, korrelyatsiya va uning sababiy bog‘liqlikdan farqi.

Tahlilchining odatiy so‘rovi:

```sql
SELECT
  DATE_TRUNC('month', created_at) AS month,
  COUNT(*) AS orders,
  SUM(amount) AS revenue
FROM orders
WHERE status = 'paid'
GROUP BY 1
ORDER BY 1;
```

**Texnik bo‘lmagan:**

- biznes va uning metrikalarini tushunish (tushum, konversiya, mijozlarni ushlab qolish);
- aniqlashtiruvchi savollar bera olish;
- xulosalarni texnik bilimi bo‘lmagan odamlarga aniq tushuntirish;
- ma’lumotlarga tanqidiy qarash: raqamlar shubhali ko‘ringanda buni payqash.

## Tahlilchilar qayerda ishlaydi

Tahlilchilar ma’lumot to‘planadigan va qarorlar qabul qilinadigan har bir joyda kerak: **e-commerce va chakana savdo**, **banklar va fintech**, **telekom**, **marketing va reklama agentliklari**, **logistika**, **IT-mahsulotlar va startaplar**, **davlat sektori**. Yirik kompaniyalarda rol ko‘pincha mahsulot, marketing yoki moliyaviy tahlilchiga bo‘linadi.

## Qanday boshlash kerak

- SQL’ni faqat o‘quv masalalarida emas, real ma’lumotlar to‘plamlarida o‘rganing.
- Bitta BI-vositada dashboard qurishni o‘rganing.
- Portfolio uchun 2–3 ta loyiha tayyorlang: savol, ma’lumot, tahlil, xulosa.
- Natijani bir necha jumlada tushuntirishni mashq qiling.

Yangi boshlovchilarning keng tarqalgan xatosi — SQL va asosiy statistikani o‘zlashtirmay turib, darhol mashinaviy o‘qitishga o‘tish. Tahlilchi uchun bu teskari tartib.

## FAQ

### Ma’lumotlar tahlilchisi dasturlashni bilishi kerakmi?

SQL majburiy. Python juda foydali va vakansiyalarda tez-tez talab qilinadi, lekin boshida ko‘p vazifalarni SQL, jadvallar va BI-vositalar bilan hal qilish mumkin.

### Boshqa kasbdan tahlilga o‘tish mumkinmi?

Ha, bu IT ga kirishning eng qulay yo‘llaridan biri. Moliya, marketing yoki savdodagi tajriba yordam beradi: siz biznes kontekstini allaqachon tushunasiz, faqat vositalarni qo‘shish qoladi.

### Ma’lumotlar tahlilchisi biznes-tahlilchidan nimasi bilan farq qiladi?

Ma’lumotlar tahlilchisi raqamlar va metrikalar bilan ishlaydi. Biznes-tahlilchi ko‘proq jarayonlar va tizimlarga qo‘yiladigan talablarni tavsiflaydi. Rollar kesishadi, lekin fokusi har xil.
