---
title: Ma’lumotlar tahlilchisi roadmap’i: qanday tahlilchi bo‘lish mumkin
description: Bo‘lajak ma’lumotlar tahlilchisi uchun reja: Excel, SQL, statistika, vizualizatsiya va Python, hamda ochiq ma’lumotlarga asoslangan portfolio keyslari.
summary: Ma’lumotlar tahlilchisi bo‘lish uchun Excel → SQL → statistika → vizualizatsiya → Python yo‘lini bosib o‘ting va ochiq ma’lumotlarda aniq biznes-savollarga javob beradigan 3-4 ta keysdan portfolio yig‘ing.
---

## Besh qadamlik reja

Ma’lumotlar tahlilchisi ma’lumotlarni **biznes savollariga javoblarga** aylantiradi: savdo nega tushdi, qaysi mijozlar ketmoqda, qaysi kampaniya natija berdi. Vositalarni shu tartibda o‘zlashtirish qulay:

1. **Excel yoki Google Sheets.**
2. **SQL.**
3. **Statistika.**
4. **Vizualizatsiya va BI.**
5. **Tahlil uchun Python.**

Har bir keyingi qadam oldingisini kengaytiradi: bitta varaqdagi jadvallardan ma’lumotlar bazalari, xulosalar va avtomatlashtirishgacha.

## 1-qadam. Elektron jadvallar

- Formulalar, nisbiy va mutlaq havolalar.
- Qidiruv funksiyalari (`XLOOKUP` yoki `VLOOKUP`), `IF`, `SUMIFS`, `COUNTIFS`.
- **Yig‘ma jadvallar** (pivot) va filtrlar.
- Ma’lumotlarni tozalash: dublikatlar, bo‘sh qiymatlar, turli sana formatlari.

**Nazorat nuqtasi:** savdo bo‘yicha xom eksportni olib, qisqa vaqtda oylar, toifalar va hududlar bo‘yicha yig‘ma hisobot tuzasiz.

## 2-qadam. SQL

SQL — tahlilchining asosiy ish vositasi.

- `SELECT`, `WHERE`, `ORDER BY`, agregat funksiyalar, `GROUP BY` va `HAVING`.
- Turli `JOIN`lar va qatorlar qachon takrorlanishini tushunish.
- Ichki so‘rovlar va **CTE**.
- **Oyna funksiyalari** (window functions): reyting, o‘sib boruvchi yig‘indi, o‘tgan davr bilan solishtirish.

```sql
WITH monthly AS (
  SELECT DATE_TRUNC('month', order_date) AS month,
         SUM(amount) AS revenue
  FROM orders
  GROUP BY 1
)
SELECT month,
       revenue,
       revenue - LAG(revenue) OVER (ORDER BY month) AS diff
FROM monthly
ORDER BY month;
```

**Nazorat nuqtasi:** join va oyna funksiyalariga oid masalalarni ishonch bilan yechasiz va natijani sog‘lom fikr bilan tekshirasiz.

## 3-qadam. Statistika

- O‘rtacha qiymat, mediana, tarqoqlik, chetga chiquvchi qiymatlar.
- Taqsimotlar va tanlanmalar.
- **Korrelyatsiya va sababiyat**: nega biri ikkinchisini isbotlamaydi.
- **A/B-testlar** asoslari: gipoteza, statistik ahamiyatlilik, tanlanma hajmi.

**Nazorat nuqtasi:** o‘rtacha chek nega aldashi mumkinligini va qachon mediana yaxshiroq ekanini tushuntira olasiz.

## 4-qadam. Vizualizatsiya

- Savolga mos grafik tanlash: dinamika, solishtirish, ulush, taqsimot.
- **BI vositalari**: Power BI, Tableau, Looker Studio yoki o‘xshashlari.
- Dashboard’lar: o‘nlab grafiklar o‘rniga bir nechta asosiy metrika.
- **Storytelling**: avval xulosa, keyin dalillar, so‘ng tavsiya.

**Nazorat nuqtasi:** texnik ma’lumoti bo‘lmagan odam dashboard’ingizning asosiy xulosasini bir daqiqada tushunadi.

## 5-qadam. Python

- Til asoslari va Jupyter Notebook.
- Ma’lumotlarni yuklash, tozalash va guruhlash uchun **pandas**.
- Grafiklar uchun **matplotlib** yoki **seaborn**.
- Takrorlanadigan hisobotlarni avtomatlashtirish.

```python
import pandas as pd

df = pd.read_csv("orders.csv", parse_dates=["order_date"])
monthly = df.groupby(df["order_date"].dt.to_period("M"))["amount"].sum()
print(monthly.tail())
```

## Portfolio uchun keys g‘oyalari

Ochiq ma’lumotlardan foydalaning: davlat ochiq ma’lumotlar portallari, Kaggle, shahar transporti yoki ob-havo bo‘yicha ochiq datasetlar.

| Keys | Savol | Ko‘nikmalar |
|---|---|---|
| Internet-do‘kon savdosi | Qaysi toifalar o‘smoqda va nega | SQL, yig‘ma jadvallar, dashboard |
| Mijozlar ketishi | Qaysi belgilar mijozlar ketishi bilan bog‘liq | Python, statistika |
| Shahar transporti | Eng yuqori yuklama qachon va qayerda | Vizualizatsiya, sanalar bilan ishlash |
| A/B-test | Variantlar o‘rtasida ahamiyatli farq bormi | Statistika, talqin qilish |

Har bir keys uchun qisqa hisobot yozing: **savol, ma’lumotlar, usul, xulosa, cheklovlar, tavsiya**.

## Ko‘p uchraydigan xatolar

- Python’ni SQL’dan oldin o‘rganib, oddiy so‘rovlarda qoqilish.
- Hech qanday savolga javob bermaydigan chiroyli grafiklar yasash.
- Bitta korrelyatsiyaga qarab sabablar haqida xulosa chiqarish.
- Ma’lumotlarni bo‘sh qiymatlar va dublikatlarga tekshirmaslik.

## FAQ

### Tahlilchi bo‘lish uchun oliy matematik ma’lumot kerakmi?

Shart emas. Ishonchli asosiy statistika, mantiqiy fikrlash va aniqlik kerak. Matematik bilim yordam beradi, lekin real ma’lumotlar bilan amaliyotni almashtirmaydi.

### Birinchi ish uchun nima muhimroq: SQL yoki Python?

Boshlang‘ich darajadagi ko‘pchilik lavozimlar uchun SQL muhimroq, chunki u bilan har kuni ishlaysiz. Python imkoniyatlarni ancha kengaytiradi, lekin odatda ikkinchi o‘rinda turadi.

### Ma’lumotlar tahlilchisi data scientist’dan nimasi bilan farq qiladi?

Tahlilchi nima sodir bo‘lgani va nega degan savollarga javob beradi hamda qaror qabul qilishga yordam beradi. Data scientist ko‘proq bashorat qiluvchi modellar quradi va mashinali o‘qitish bilan chuqurroq ishlaydi.
