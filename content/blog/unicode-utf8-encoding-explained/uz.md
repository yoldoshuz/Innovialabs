---
title: Unicode va UTF-8: kodirovkalar qanday ishlaydi va matn nega buziladi
description: Unicode kod nuqtalari nima, UTF-8 belgilarni baytlarda qanday saqlaydi, Windows-1251 farqi va kod hamda fayllarda kirill va o‘, g‘ harflarini qanday tuzatish.
summary: Unicode har bir belgiga raqam beradi, UTF-8 esa bu raqamni 1–4 baytga aylantiradi. Matn baytlar bir kodirovkada yozilib, boshqasida o‘qilganda buziladi — shuning uchun hamma joyda UTF-8 ni aniq ko‘rsating.
---
## Qisqacha: buzilgan matn qayerdan paydo bo‘ladi

Kompyuter harflarni emas, baytlarni saqlaydi. **Kodirovka** — baytlarni belgilarga aylantirish qoidasi. Agar matn bir kodirovkada saqlanib, boshqasida ochilsa, ruscha «Привет» o‘rniga «РџСЂРёРІРµС‚» ko‘rinadi. Bu **mojibake** deb ataladi.

Yechim deyarli har doim bitta: **hamma joyda UTF-8 dan foydalaning** va o‘qish hamda yozishda kodirovkani aniq ko‘rsating.

## Unicode, kod nuqtalari va UTF-8

- **Unicode** — har bir belgi o‘z raqamiga, ya’ni **kod nuqtasiga** ega bo‘lgan katta jadval. Kirillcha «А» — `U+0410`, lotincha `a` — `U+0061`, o‘ dagi ‘ belgisi — `U+2018`.
- **UTF-8** — kod nuqtasini baytlar bilan yozish usuli. Lotin harflari 1 bayt, kirill harflari 2 bayt, ko‘plab tinish belgilari va simvollar 3 bayt, emoji 4 bayt egallaydi.

| Belgi | Kod nuqtasi | UTF-8 baytlari |
|---|---|---|
| `a` | U+0061 | `61` |
| `А` (kirill) | U+0410 | `D0 90` |
| `‘` | U+2018 | `E2 80 98` |

**Windows-1251** — kirill uchun eski bir baytli kodirovka. Unda «А» bitta `C0` bayti. U hali ham eski tizimlardan eksportlarda, Excel CSV fayllarida va eskirgan bazalarda uchraydi.

## Buzilish qanday yuz beradi

«П» harfini olaylik: UTF-8 da bu `D0 9F` baytlari. Faylni Windows-1251 deb hisoblaydigan dastur ikkita alohida belgini ko‘radi: `D0` — «Р», `9F` — «џ». Buzilgan so‘z boshidagi «Рџ» shundan.

Teskari holat: Windows-1251 dagi fayl UTF-8 sifatida ochilgan. Bu baytlar to‘g‘ri ketma-ketlik hosil qilmaydi va matn o‘rniga `�` belgilari chiqadi.

## Amalda qanday tuzatish kerak

**Fayllarni aniq kodirovka bilan o‘qing va yozing:**

```python
with open("data.csv", encoding="utf-8") as f:
    text = f.read()
```

**Eski fayllarni konvertatsiya qiling:**

```bash
iconv -f WINDOWS-1251 -t UTF-8 old.csv > new.csv
```

**Allaqachon buzilgan satrni tuzating**, agar u qanday buzilganini bilsangiz:

```python
broken = "РџСЂРёРІРµС‚"
fixed = broken.encode("cp1251").decode("utf-8")  # "Привет"
```

**Har bir qatlamni tekshiring:**

- HTML: `<meta charset="utf-8">` va `Content-Type: text/html; charset=utf-8` sarlavhasi.
- MySQL: `utf8` emas, `utf8mb4` kodirovkasi — `utf8` ko‘pi bilan 3 bayt saqlaydi va emojini qabul qilmaydi.
- PostgreSQL: `UTF8` kodirovkadagi baza.
- Excel uchun CSV: BOM bilan UTF-8 da saqlang (Python’da `encoding="utf-8-sig"`), aks holda Excel kirillni noto‘g‘ri ochishi mumkin.
- Kod muharriri va Git: fayllar UTF-8 da.

## O‘zbekcha o‘ va g‘: alohida tuzoq

o‘, g‘ dagi va ma’lumot kabi so‘zlardagi belgini turli simvollar bilan terish mumkin: `'` (U+0027), `` ` `` (U+0060), `‘` (U+2018), `’` (U+2019), `ʻ` (U+02BB). Ular tashqi ko‘rinishda o‘xshash, lekin kompyuter uchun turli belgilar. Oqibatlari:

- «o‘zbek» bo‘yicha qidiruv boshqa belgi bilan yozilgan variantni topmaydi;
- ma’lumotnomalar, mijozlar va manzillarda dublikatlar;
- bitta so‘z uchun turli URL va slug’lar.

Nima qilish kerak: loyiha uchun bitta variantni tanlang va saqlashda **kiritilgan ma’lumotni normallashtiring** — boshqa variantlarni tanlanganiga almashtiring. Qidiruv uchun qo‘shimcha normallashtirilgan maydon saqlang.

Yana bir nozik jihat — satr uzunligi. `"o‘"` — 2 ta kod nuqtasi, lekin UTF-8 da 4 bayt. Agar bazadagi maydon belgilar emas, baytlar bilan cheklangan bo‘lsa, matn belgi o‘rtasida kesilib qolishi mumkin.

## Unicode normallashtirish

Ba’zi harflarni ikki usulda yozish mumkin: «й» — bitta kod nuqtasi yoki «и» va qo‘shiladigan belgi. Ko‘rinishi bir xil, lekin satrlarni solishtirish `False` beradi. Matnni bitta shaklga keltiring:

```python
import unicodedata
clean = unicodedata.normalize("NFC", text)
```

## FAQ

### Yangi loyihada Windows-1251 kerak bo‘ladimi?

Yo‘q. Yangi kod, bazalar va API uchun UTF-8 dan foydalaning. Windows-1251 faqat eski ma’lumotlarni o‘qish va boshqa narsani bilmaydigan tizimlar bilan integratsiya uchun kerak — kirishda konvertatsiya qiling.

### Nega Excel CSV dagi kirillni buzadi?

BOM bo‘lmasa, Excel faylni UTF-8 da emas, tizim kodirovkasida o‘qishi mumkin. CSV ni BOM bilan UTF-8 da saqlang yoki kodirovkani aniq tanlab ma’lumot importidan foydalaning.

### o‘ va g‘ uchun qaysi belgi to‘g‘ri?

Rasmiy lotin alifbosida ‘ va ’ belgilari ishlatiladi, Unicode’da esa alohida ʻ modifikator harfi ham bor. Dasturchi uchun asosiysi — bitta variantni tanlash va barcha ma’lumotlarni bir xil normallashtirish.
