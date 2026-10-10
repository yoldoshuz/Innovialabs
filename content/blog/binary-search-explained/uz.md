---
title: Binar qidiruv: qanday ishlaydi va qanday amalga oshiriladi
description: Binar qidiruv g‘oyasi, iterativ va rekursiv kod, bittaga adashish xatolari, birinchi uchrashuvni topish va javob bo‘yicha binar qidiruv.
summary: Binar qidiruv saralangan ma’lumotlarda elementni har qadamda diapazonning yarmini tashlab O(log n) da topadi; asosiysi — bittaga adashmaslik uchun chegaralar va sikl shartini aniq belgilash.
---
## Bir daqiqada g‘oya

Binar qidiruv faqat **saralangan** ma’lumotlarda ishlaydi. Barcha elementlarni ko‘rib chiqish o‘rniga diapazon o‘rtasiga qaraymiz:

- o‘rtadagi element qidirilayotganga teng bo‘lsa — topildi;
- kichik bo‘lsa — qidirilayotgan o‘ngda, chap yarmini tashlaymiz;
- katta bo‘lsa — chapda, o‘ng yarmini tashlaymiz.

Har qadam diapazonni ikkiga bo‘ladi, shuning uchun murakkablik — **O(log n)**. Million element uchun bu million emas, taxminan yigirmata solishtirish.

## Iterativ amalga oshirish

**Yopiq interval** `[lo, hi]` ishlatamiz: ikkala chegara ham qidiruvga kiradi.

```python
def binary_search(a, target):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if a[mid] == target:
            return mid
        if a[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
```

Muhim tafsilotlar:

- Shart `lo <= hi`, chunki `lo == hi` bo‘lganda yana bitta nomzod qoladi.
- Siljish `mid + 1` va `mid - 1`, chunki `mid` allaqachon tekshirilgan.
- `(lo + hi) // 2` o‘rniga `lo + (hi - lo) // 2` qat’iy o‘lchamli butun sonli tillarda (Java, C++) to‘lib ketishdan himoya qiladi. Python’da shart emas, lekin odat foydali.

## Rekursiv amalga oshirish

```python
def binary_search_rec(a, target, lo, hi):
    if lo > hi:
        return -1
    mid = lo + (hi - lo) // 2
    if a[mid] == target:
        return mid
    if a[mid] < target:
        return binary_search_rec(a, target, mid + 1, hi)
    return binary_search_rec(a, target, lo, mid - 1)
```

Mantiq o‘sha, lekin har qadam — yangi chaqiruv. Rekursiya chuqurligi atigi O(log n), shuning uchun stek to‘lib ketmaydi. Shunday bo‘lsa-da, iterativ versiyani odatda tuzatish osonroq va u stek xotirasini sarflamaydi.

## Bittaga adashish xatolari

Binar qidiruvdagi xatolarning ko‘pi — **off-by-one**. Ulardan qochish uchun bitta kelishuvni tanlang va unga amal qiling:

| Kelishuv | Boshlanish | Sikl sharti | O‘ngga siljish | Chapga siljish |
|---|---|---|---|---|
| Yopiq `[lo, hi]` | `hi = n - 1` | `lo <= hi` | `lo = mid + 1` | `hi = mid - 1` |
| Yarim ochiq `[lo, hi)` | `hi = n` | `lo < hi` | `lo = mid + 1` | `hi = mid` |

Odatiy muammolar:

- **Cheksiz sikl**: `lo < hi` bilan `lo = mid` aralashtirilgan. Diapazon torayishdan to‘xtaydi.
- **Element o‘tkazib yuborilgan**: yopiq intervalda `lo < hi` yozilgan.
- **Massivdan chiqib ketish**: `hi = n` bo‘lib, `a[hi]` ga murojaat qilinadi.

Kodni bo‘sh massivda, bitta elementli massivda, qidirilayotgan boshida, oxirida va mavjud bo‘lmagan qiymatda tekshiring.

## Birinchi uchrashuvni topish

Massivda takrorlar bo‘lsa, oddiy versiya istalgan mosini qaytaradi. **Birinchisini** (lower bound) topish uchun moslik topilganda to‘xtamay, chapga harakatni davom ettiramiz:

```python
def lower_bound(a, target):
    lo, hi = 0, len(a)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if a[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    return lo  # first index where a[i] >= target
```

Agar `lo < len(a)` va `a[lo] == target` bo‘lsa, bu birinchi uchrashuv. Xuddi shunday **upper bound** (`a[mid] <= target` sharti) oxirgi uchrashuvdan keyingi indeksni beradi. Uchrashuvlar soni — ularning farqi. Python’da buning uchun `bisect` moduli, C++ da `std::lower_bound` va `std::upper_bound` bor.

## Javob bo‘yicha binar qidiruv

Bu usul faqat massivlar uchun emas. Agar javob diapazondagi son bo‘lsa va «x mos keladimi» tekshiruvi **monoton** bo‘lsa (qaysidir nuqtagacha hammasi «yo‘q», keyin «ha»), javobning o‘zini binar qidirish mumkin.

Misol: posilkalarni D kunda yetkazish uchun minimal yuk ko‘tarish quvvati.

1. Pastki chegara — eng og‘ir posilka, yuqori chegara — hammasining yig‘indisi.
2. `can(capacity)` funksiyasi D kun yetarli ekanini ochko‘z (greedy) usulda tekshiradi.
3. `can` «ha» qaytaradigan eng kichik qiymat o‘sha lower bound shabloni bilan topiladi.

Shu yo‘l bilan butun sonli kvadrat ildiz, minimal vaqt va eng kichik masofani maksimallashtirish masalalari yechiladi.

## FAQ

### Saralanmagan massivda binar qidiruvdan foydalansa bo‘ladimi?

Yo‘q, natija noto‘g‘ri bo‘ladi. Avval ma’lumotlarni saralang (O(n log n)) yoki bir martalik qidiruv uchun chiziqli ko‘rib chiqishdan foydalaning.

### Iterativ yoki rekursiv — qaysini tanlash kerak?

Odatda iterativni: u stek sarflamaydi va tuzatish osonroq. Rekursiv versiya g‘oyani tushunish uchun foydali.

### Masalani javob bo‘yicha binar qidiruv bilan yechish mumkinligini qanday bilaman?

Monotonlikni qidiring: agar shart x uchun bajarilsa, u barcha katta (yoki barcha kichik) qiymatlar uchun ham bajariladi. Unda chegarani binar qidiruv bilan topish mumkin.
