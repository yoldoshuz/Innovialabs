---
title: Saralash algoritmlari: pufakcha, birlashtirish, tezkor va boshqalar
description: Pufakcha, qo‘yish, birlashtirish, tezkor va piramida saralash qanday ishlaydi, murakkablik, barqarorlik va o‘rnatilgan sort nimadan foydalanadi.
summary: Oddiy saralashlar (pufakcha, qo‘yish) O(n²) da ishlaydi va kichik massivlarga mos, birlashtirish, tezkor va piramida saralash esa O(n log n); real kodda deyarli har doim tilning o‘rnatilgan sort funksiyasi eng yaxshi tanlov.
---
## Qisqa javob

Saralash — elementlarni kalit bo‘yicha tartiblash. Algoritmlar uchta xususiyat bilan farqlanadi:

- **Vaqt murakkabligi** — elementlar soni n oshganda ishlash vaqti qanday o‘sadi.
- **Xotira** — qo‘shimcha massiv kerakmi yoki hammasi joyida (in-place) bajariladimi.
- **Barqarorlik (stability)** — teng elementlar dastlabki tartibini saqlaydimi.

O‘rganish uchun har bir algoritmni tushunish foydali. Ishda esa deyarli har doim tilingizdagi o‘rnatilgan `sort` yetarli.

## Pufakcha saralash (bubble sort)

Massiv bo‘ylab yurib, noto‘g‘ri turgan qo‘shni elementlarni almashtiramiz. Har bir o‘tishdan keyin eng katta element oxiriga «suzib chiqadi».

1. `a[0]` va `a[1]` ni solishtirish, kerak bo‘lsa almashtirish.
2. `a[1]` va `a[2]` ni solishtirish va shunday oxirigacha.
3. Bitta ham almashtirish bo‘lmagan o‘tishgacha takrorlash.

Murakkablik — **O(n²)**, barqaror. Amalda deyarli ishlatilmaydi: bu o‘quv misoli.

## Qo‘yish orqali saralash (insertion sort)

Elementlarni birma-bir olib, allaqachon saralangan chap qismdagi to‘g‘ri joyga qo‘yamiz — qo‘ldagi kartalarni tartiblagandek.

```python
def insertion_sort(a):
    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
    return a
```

Eng yomon holatda **O(n²)**, lekin deyarli saralangan ma’lumotlarda **O(n)** ga yaqin. Barqaror va joyida ishlaydi. Shu sababli gibrid algoritmlar ichida kichik bo‘laklar uchun qo‘llaniladi.

## Tanlash orqali saralash (selection sort)

Har qadamda saralanmagan qismdagi minimumni topib, boshiga qo‘yamiz. Har doim **O(n²)** solishtirish, lekin almashtirishlar kam. Odatiy ko‘rinishida **barqaror emas**.

## Birlashtirish orqali saralash (merge sort)

«Bo‘l va hukmronlik qil» tamoyili:

1. Massivni ikkiga bo‘lamiz.
2. Har bir yarmini rekursiv saralaymiz.
3. Ikki saralangan yarmini birinchi elementlarini solishtirib birlashtiramiz.

Har doim **O(n log n)**, barqaror. Kamchiligi — qo‘shimcha **O(n)** xotira kerak. Bog‘langan ro‘yxatlar va xotiraga sig‘maydigan katta fayllarni tashqi saralash uchun qulay.

## Tezkor saralash (quicksort)

1. **Tayanch element (pivot)** tanlanadi.
2. Elementlar qayta joylanadi: kichiklari chapga, kattalari o‘ngga.
3. Ikkala qism rekursiv saralanadi.

O‘rtacha **O(n log n)** va xotira bilan samarali ishlagani uchun amalda juda tez. Eng yomon holat — **O(n²)**, agar pivot doim chetki qiymat bo‘lib chiqsa (masalan, saralangan massivda birinchi element tanlanganda). Tasodifiy pivot yoki uchtasining medianasi bu muammoni hal qiladi. Barqaror emas.

## Piramida saralash (heapsort)

Massivdan ikkilik uyum (heap) quriladi, keyin maksimum qayta-qayta olinadi. Kafolatlangan **O(n log n)**, joyida ishlaydi, lekin barqaror emas va amalda odatda quicksort’dan sekinroq.

## Taqqoslash

| Algoritm | O‘rtacha | Eng yomon | Qo‘shimcha xotira | Barqaror |
|---|---|---|---|---|
| Pufakcha | O(n²) | O(n²) | O(1) | Ha |
| Qo‘yish | O(n²) | O(n²) | O(1) | Ha |
| Tanlash | O(n²) | O(n²) | O(1) | Yo‘q |
| Birlashtirish | O(n log n) | O(n log n) | O(n) | Ha |
| Tezkor | O(n log n) | O(n²) | O(log n) | Yo‘q |
| Piramida | O(n log n) | O(n log n) | O(1) | Yo‘q |

## O‘rnatilgan saralashlar nimadan foydalanadi

Standart kutubxonalar **gibrid** algoritmlarni qo‘llaydi:

- **Timsort** — birlashtirish va qo‘yish saralashi, allaqachon tartiblangan qismlarni topa oladi. Python’da va Java’da obyektlarni saralashda ishlatiladi. Barqaror.
- **Introsort** — quicksort sifatida boshlanadi, rekursiya juda chuqurlashsa heapsort’ga o‘tadi, kichik bo‘laklarni qo‘yish orqali tugatadi. C++ dagi `std::sort` uchun xos.
- JavaScript’da spetsifikatsiya `Array.prototype.sort` barqaror bo‘lishini talab qiladi; dvigatellar odatda Timsort ishlatadi.

## Ko‘p uchraydigan xatolar

- **Production uchun o‘z saralashingizni yozish** — o‘rnatilgani deyarli har doim tezroq va sinovdan o‘tgan.
- **Bir nechta maydon bo‘yicha saralashda barqarorlikni unutish.**
- **Noto‘g‘ri komparator**: JavaScript’da `[10, 9, 1].sort()` elementlarni satr sifatida solishtiradi. `sort((a, b) => a - b)` kerak.

## FAQ

### Eng tez saralash qaysi?

Universal g‘olib yo‘q. O‘rtacha holatda quicksort hamda Timsort va introsort kabi gibridlar eng yaxshi natija beradi, shuning uchun standart kutubxonalar ularni ishlatadi.

### Sekin bo‘lsa, pufakcha saralashni nega o‘rganish kerak?

U solishtirish, almashtirish va murakkablikni baholashni o‘rgatadi. Bu murakkabroq algoritmlarga o‘tish uchun o‘quv bosqichi, ish quroli emas.

### Saralashning barqarorligi qachon muhim?

Bir nechta kalit bo‘yicha ketma-ket saralaganda, masalan avval ism, keyin shahar bo‘yicha. Barqaror saralash bir shahar ichida ismlar tartibini saqlab qoladi.
