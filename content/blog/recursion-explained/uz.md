---
title: Rekursiya: bazaviy holat, chaqiruvlar steki va misollar
description: Rekursiv fikrlash: faktorial, daraxtni aylanib chiqish va o‘rin almashtirishlar, chaqiruvlar steki, stack overflow sababi va dum rekursiyasi nima.
summary: Rekursiya — masalani kichikroq qism-masala uchun o‘zini chaqirish orqali yechadigan funksiya; unga chaqiruvlar to‘xtaydigan bazaviy holat kerak, aks holda chaqiruvlar steki to‘lib ketadi.
---
## Rekursiya nima

**Rekursiv funksiya** xuddi shu masalaning kichikroq ko‘rinishini yechish uchun o‘zini o‘zi chaqiradi. Har qanday to‘g‘ri rekursiyada ikki qism bor:

- **Bazaviy holat** — javobi darhol ma’lum bo‘lgan eng oddiy kirish. Chaqiruvlar shu yerda to‘xtaydi.
- **Rekursiv qadam** — masalani kichikroq masalaga keltirish va funksiyani unga chaqirish.

Bazaviy holat bo‘lmasa yoki qadam unga yaqinlashtirmasa, funksiya o‘zini cheksiz chaqiradi.

## Rekursiv qanday fikrlash kerak

Qulay usul — **funksiyaga «ishonish»**. Barcha chaqiruvlarni xayolan ochib chiqishga urinmang. O‘zingizdan so‘rang:

1. Eng oddiy kirish qaysi va uning javobi nima?
2. Agar funksiya n − 1 o‘lchamli (yoki yarmi, yoki qism-daraxt) masalani allaqachon yecha olsa, n uchun javobni qanday olaman?
3. Har bir chaqiruv bazaviy holatga aniq yaqinlashadimi?

## 1-misol: faktorial

n! = n × (n − 1)!, 0! = 1.

```python
def factorial(n):
    if n == 0:          # base case
        return 1
    return n * factorial(n - 1)  # recursive step
```

## Chaqiruvlar steki ko‘rgazmali

Har bir funksiya chaqiruvi **chaqiruvlar stekiga** o‘z kadrini qo‘yadi: argumentlar, lokal o‘zgaruvchilar va qaytish joyi. `factorial(3)` uchun:

```text
factorial(3)  3 * factorial(2) ni kutadi
  factorial(2)  2 * factorial(1) ni kutadi
    factorial(1)  1 * factorial(0) ni kutadi
      factorial(0)  1 qaytaradi
    factorial(1)  1 qaytaradi
  factorial(2)  2 qaytaradi
factorial(3)  6 qaytaradi
```

Avval stek bazaviy holatgacha o‘sadi, keyin orqaga yechiladi va har bir kadr o‘z ko‘paytmasini tugatadi.

## 2-misol: daraxtni aylanib chiqish

Daraxtlar tabiatan rekursiv: tugunning bolalari bor, ular o‘zi ham daraxt. Shu sababli bu yerda rekursiya sikllardan tabiiyroq.

```python
def tree_sum(node):
    if node is None:
        return 0
    return node.value + sum(tree_sum(child) for child in node.children)
```

Fayl tizimi, DOM daraxti, ichma-ich izohlar va menyular ham shu tarzda aylanib chiqiladi.

## 3-misol: o‘rin almashtirishlar

Masala: ro‘yxatning barcha o‘rin almashtirishlarini chiqarish. Rekursiv fikr: birinchi elementni barcha usullar bilan tanlaymiz, qolganini rekursiv almashtiramiz.

```python
def permutations(items):
    if len(items) <= 1:
        return [items]
    result = []
    for i, first in enumerate(items):
        rest = items[:i] + items[i + 1:]
        for perm in permutations(rest):
            result.append([first] + perm)
    return result
```

Bu **orqaga qaytish bilan ko‘rib chiqish (backtracking)** misoli: sudoku, farzinlar masalasi va kombinatsiyalar generatsiyasi ham shu g‘oyalar bilan yechiladi.

## Stekning to‘lib ketishi

Chaqiruvlar steki cheklangan. Rekursiya juda chuqur bo‘lsa, dastur **stack overflow** xatosi bilan to‘xtaydi (Python’da — `RecursionError`).

Sabablar:

- **Bazaviy holat yo‘q** yoki unga yetib bo‘lmaydi, masalan `factorial(-1)`.
- **Juda katta chuqurlik** — minglab va millionlab darajali rekursiya, masalan uzun bog‘langan ro‘yxatni aylanib chiqish.

Nima qilish kerak:

- Kirish ma’lumotlari va bazaviy holatni tekshirish.
- Algoritmni **sikl** yoki aniq stek (vazifalarni o‘zingiz qo‘yadigan ro‘yxat) bilan qayta yozish.
- Chuqurlik O(n) emas, O(log n) bo‘lishi uchun «ikkiga bo‘lish» yondashuvidan foydalanish.

## Dum rekursiyasi (tail recursion)

Rekursiv chaqiruv funksiyaning oxirgi amali bo‘lsa va natija o‘zgarishsiz qaytarilsa, rekursiya **dum rekursiyasi** deyiladi:

```python
def factorial_tail(n, acc=1):
    if n == 0:
        return acc
    return factorial_tail(n - 1, acc * n)
```

Ba’zi kompilyator va tillar (Scheme, ko‘plab funksional tillar) bunday chaqiruvni siklga aylantiradi va stek o‘smaydi. **Python va ko‘pchilik JavaScript dvigatellari buni qilmaydi**, shuning uchun ularda dum shakli to‘lib ketishdan qutqarmaydi — sikl kerak.

## Rekursiya yoki sikl

| Vaziyat | Yaxshiroq tanlov |
|---|---|
| Daraxtlar, graflar, ichma-ich tuzilmalar | Rekursiya |
| Variantlarni ko‘rib chiqish (backtracking) | Rekursiya |
| Ro‘yxat bo‘ylab oddiy o‘tish | Sikl |
| Juda katta chuqurlik | Sikl yoki aniq stek |

## FAQ

### Rekursiya sikldan sekinmi?

Odatda biroz sekin, chunki har bir chaqiruv stekda kadr yaratadi. Lekin daraxtlar va backtracking uchun kod ancha tushunarli bo‘ladi, tezlikdagi farq esa kamdan-kam hal qiluvchi.

### Rekursiv funksiyani qanday tuzatish mumkin?

Bazaviy holatni eng kichik kirishda, keyin bir qadam kattaroq kirishda tekshiring. Argumentlarni chaqiruv chuqurligiga qarab chekinish bilan chiqarish juda yordam beradi.

### Nega rekursiya ba’zan juda uzoq ishlaydi?

U ko‘pincha bir xil qism-masalalarni ko‘p marta yechadi, masalan Fibonachchi sonlarini sodda hisoblashda. Bu memoizatsiya — hisoblangan natijalarni saqlash bilan hal qilinadi.
