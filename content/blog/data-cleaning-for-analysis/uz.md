---
title: Ma’lumotlarni tozalash: tahlilga qanday tayyorlash kerak
description: Dublikatlarni tozalash, bo‘sh qiymatlar, telefon, sana va valyuta formatlarini bir xillashtirish hamda chetga chiquvchi qiymatlar — SQL va pandas misollari.
summary: Ma’lumotlarni tozalash — bu qadamlar ketma-ketligi: dublikatlarni topib olib tashlash, bo‘sh qiymatlar bilan nima qilishni hal qilish, formatlarni bir xillashtirish, chetga chiquvchi qiymatlarni belgilash va barcha qoidalarni hujjatlashtirish.
---

## Qisqa javob

Iflos ma’lumotlar ustidagi tahlil ishonchli ko‘rinadigan, lekin noto‘g‘ri xulosalar beradi. Tahlildan oldin besh qadamdan o‘ting:

1. **Dublikatlar** — topish va qaysi yozuvni qoldirishni hal qilish.
2. **Bo‘sh qiymatlar** — sababini tushunish va strategiya tanlash.
3. **Formatlar** — sana, telefon, summa va ma’lumotnomalarni bir ko‘rinishga keltirish.
4. **Chetga chiquvchi qiymatlar** — ko‘r-ko‘rona o‘chirish emas, topib belgilash.
5. **Tekshiruv va hujjatlashtirish** — tozalashni takrorlash uchun qoidalarni yozib qo‘yish.

Asosiy tamoyil: **dastlabki ma’lumotlarga tegmaymiz**. Tozalash yangi jadval yoki yangi DataFrame’ga yoziladi, har bir qoida esa kodda turadi.

## 1-qadam. Dublikatlar

Dublikatlar takroriy importlar, formadagi ikki marta bosish yoki ikki CRM’ni birlashtirishdan paydo bo‘ladi. Avval bitta obyekt nima ekanini aniqlang: mijoz — bu bitta telefonmi? Bitta STIRmi? «Ism + telefon» juftligimi?

SQL’da dublikatlarni oyna funksiyasi bilan belgilab, eng yangi yozuvni qoldirish qulay:

```sql
SELECT *
FROM (
  SELECT *,
         row_number() OVER (PARTITION BY phone ORDER BY updated_at DESC) AS rn
  FROM customers
) t
WHERE rn = 1;
```

pandas’da xuddi shu:

```python
df = df.sort_values("updated_at").drop_duplicates(subset=["phone"], keep="last")
```

Muhim: dublikatlarni formatlarni normallashtirgandan **keyin** solishtiring, aks holda «+998 90 123 45 67» va «901234567» ikki xil mijoz bo‘lib qoladi. Amalda 1 va 3-qadamlar ko‘pincha o‘rin almashadi.

## 2-qadam. Bo‘sh qiymatlar

Avval ko‘lamni hisoblang:

```sql
SELECT count(*) - count(email) AS no_email,
       count(*) - count(city)  AS no_city
FROM customers;
```

```python
df.isna().sum()
```

Keyin har bir ustun uchun strategiya tanlang:

| Vaziyat | Nima qilish kerak |
|---|---|
| Majburiy maydon bo‘sh (id, buyurtma sanasi) | Qatorni tahlildan chiqarib, sababini yozib qo‘yish |
| Ma’lumotnoma maydoni (shahar, manba) | «Ko‘rsatilmagan» qiymati bilan to‘ldirish |
| Bo‘sh degani nol bo‘lgan son maydoni | Faqat haqiqatan shunday bo‘lsa, nol bilan to‘ldirish |
| Nol va «ma’lumot yo‘q» farq qiladigan son maydoni | Bo‘sh qoldirish |

Bo‘shliqlarni «chiroyli» ko‘rinsin deb o‘rtacha qiymat bilan to‘ldirmang: bu taqsimotni va xulosalarni buzadi.

## 3-qadam. Yagona formatlar

**Telefonlar.** Faqat raqamlarni qoldirib, bitta ko‘rinishga keltiring, masalan plyussiz xalqaro formatga:

```python
df["phone"] = df["phone"].str.replace(r"\D", "", regex=True)
short = df["phone"].str.len() == 9
df.loc[short, "phone"] = "998" + df.loc[short, "phone"]
```

**Summalar.** «1 250 000,50 so‘m» kabi satrlar bo‘shliqlar va valyuta yozuvlari olib tashlangandan keyingina songa aylanadi:

```python
df["amount"] = pd.to_numeric(
    df["amount"].str.replace(r"[^\d,.\-]", "", regex=True).str.replace(",", "."),
    errors="coerce",
)
```

Bu kod o‘nlik ajratgich vergul bo‘lgan formatga mo‘ljallangan. Manbalar turli format ishlatsa, har birini alohida qayta ishlang.

**Valyutalar.** So‘m va dollarni bitta ustunda qo‘shmang. `amount` va `currency` ni alohida saqlang, qayta hisoblash uchun esa kurslar jadvalidagi **operatsiya sanasidagi** kursdan foydalaning.

**Sanalar.** 03.04 tasodifan 4-martga aylanib qolmasligi uchun formatni aniq ko‘rsating:

```python
df["order_date"] = pd.to_datetime(df["order_date"], format="%d.%m.%Y", errors="coerce")
```

**Matnli ma’lumotnomalar.** «Toshkent», «Toshkent sh.», «Tashkent» — bitta shahar. Bo‘shliqlarni olib tashlang, registrni bir xillashtiring va qolgan variantlar uchun moslik jadvalini tuzing.

## 4-qadam. Chetga chiquvchi qiymatlar

Chetga chiquvchi qiymat har doim ham xato emas. Katta ulgurji buyurtma — haqiqiy, odatdagidan ming barobar katta buyurtma esa yozuvdagi xato bo‘lishi mumkin. Shuning uchun ular **belgilanadi**, qaror esa biznesni biladigan odam bilan birga qabul qilinadi.

Oddiy usul — kvartillararo kenglik:

```python
q1, q3 = df["amount"].quantile([0.25, 0.75])
iqr = q3 - q1
df["is_outlier"] = ~df["amount"].between(q1 - 1.5 * iqr, q3 + 1.5 * iqr)
```

SQL’da chegaralarni `percentile_cont(0.25) WITHIN GROUP (ORDER BY amount)` orqali olish mumkin.

**Mantiqiy** cheklovlarni ham tekshiring: kelajakdagi sanalar, manfiy miqdorlar, bir yuz yigirma yoshdan katta yosh.

## 5-qadam. Tekshiruv va hujjatlashtirish

- Tozalashdan oldin va keyin qatorlar soni hamda asosiy summalarni solishtiring.
- Qoidalarni yozib qo‘ying: qaysi dublikatlar o‘chirildi, bo‘shliqlar nima bilan to‘ldirildi, qaysi qiymatlar chiqarildi.
- Tozalashni Excel’dagi qo‘lda tuzatishlar emas, skript sifatida rasmiylashtiring — shunda uni yangi ma’lumotlarda qayta ishga tushirish mumkin.

## FAQ

### Tozalash uchun nima yaxshiroq: SQL yoki pandas?

Ma’lumotlar allaqachon bazada va ular ko‘p bo‘lsa, SQL qulay. Bir martalik fayllar, murakkab o‘zgartirishlar va tadqiqot uchun pandas qulayroq. Ko‘pincha birgalikda ishlatiladi: dag‘al tozalash SQL’da, batafsil ish Python’da.

### Bo‘sh qiymatli qatorlarni shunchaki o‘chirsa bo‘ladimi?

Ular kam va tasodifiy bo‘lsa, ha. Agar bo‘shliqlar tizimli bo‘lsa, masalan bitta manba yoki bitta davrdan kelsa, o‘chirish natijani buzadi. Avval ular qayerdan kelayotganini tekshiring.

### Iflos ma’lumotlarni qanday kamaytirish mumkin?

Sababni manbada tuzating: telefonlar uchun kiritish niqoblari, erkin matn o‘rniga ochiladigan ro‘yxatlar, bazadagi cheklovlar va import paytidagi tekshiruvlar.
