---
title: Dinamik dasturlash: DP masalalarini qanday tanish va yechish
description: DP masalalari uchun takrorlanadigan usul: holat, o‘tish, bazaviy holat. Memoizatsiya va tabulyatsiya, ryukzak va eng uzun umumiy qism-ketma-ketlik.
summary: Dinamik dasturlash masala optimal tuzilmali kesishuvchi qism-masalalarga bo‘linganda qo‘llaniladi; yechim «holat — o‘tish — bazaviy holat» sxemasi bo‘yicha quriladi va qism-masalalar javoblari qayta hisoblanmasligi uchun saqlanadi.
---
## Masala qachon DP bo‘ladi

**Dinamik dasturlash (DP)** — masalalarni qism-masalalarga bo‘lib, ularning javoblarini saqlab yechish usuli. U ikki shart bajarilganda mos keladi:

- **Kesishuvchi qism-masalalar** — sodda rekursiya bir narsani ko‘p marta yechadi.
- **Optimal tuzilma** — optimal javob qism-masalalarning optimal javoblaridan yig‘iladi.

Shartdagi belgilar: «minimal narx», «maksimal yig‘indi», «nechta usul», «mumkinmi», shuningdek «elementlarni shunday tanlangki…» kabi cheklovlar. Agar barcha variantlarni ko‘rib chiqish eksponensial, lekin turli qism-masalalar kam bo‘lsa, bu deyarli aniq DP.

## Uch qadamli usul

1. **Holat.** Qism-masalani nima tavsiflaydi? Odatda bir-ikkita indeks: «birinchi i ta buyum», «i va j uzunlikdagi prefikslar», «w sig‘im». So‘z bilan ifodalang: `dp[i][w]` — birinchi i ta buyum va w sig‘im uchun eng yaxshi natija.
2. **O‘tish.** Holatni kichikroqlari orqali qanday ifodalash mumkin? Oxirgi qadamdagi tanlovlarni sanab chiqing (olish / olmaslik, belgilar mos keldi / yo‘q) va eng yaxshisini oling.
3. **Bazaviy holat.** Eng kichik holatlar uchun javoblar: bo‘sh prefiks, nol sig‘im.

Shundan keyin **hisoblash tartibini** (bog‘liqliklar tayyor bo‘lishi uchun) va **javob qayerda turishini** aniqlang.

## Memoizatsiya va tabulyatsiya

| | Memoizatsiya (top-down) | Tabulyatsiya (bottom-up) |
|---|---|---|
| Qanday yoziladi | Rekursiya + kesh | Jadval bo‘ylab sikllar |
| Nimani hisoblaydi | Faqat kerakli holatlarni | Barcha holatlarni |
| Xavf | Chuqur rekursiya | Tartibni o‘ylash kerak |
| Xotirani tejash | Qiyinroq | Ko‘pincha bitta qatorga keltirish oson |

Fibonachchi sonlari misolida:

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib_memo(n):
    if n < 2:
        return n
    return fib_memo(n - 1) + fib_memo(n - 2)

def fib_tab(n):
    if n < 2:
        return n
    prev, cur = 0, 1
    for _ in range(n - 1):
        prev, cur = cur, prev + cur
    return cur
```

Memoizatsiyadan boshlash qulay — u rekursiv formuladan to‘g‘ridan-to‘g‘ri kelib chiqadi. Rekursiya chuqurligi katta bo‘lsa yoki xotira muhim bo‘lsa, tabulyatsiyani tanlang.

## Ryukzak masalasi (0/1 knapsack)

Og‘irligi va qiymati bor buyumlar hamda W sig‘imli ryukzak berilgan. Har bir buyumni ko‘pi bilan bir marta olish mumkin. Umumiy qiymatni maksimallashtirish kerak.

- **Holat:** `dp[w]` — shu paytgacha ko‘rilgan buyumlar bilan w sig‘imdagi maksimal qiymat.
- **O‘tish:** buyum uchun (og‘irligi `wt`, qiymati `val`) — `dp[w] = max(dp[w], dp[w - wt] + val)`.
- **Baza:** barcha w uchun `dp[w] = 0` — buyumsiz qiymat nol.

```python
def knapsack(weights, values, W):
    dp = [0] * (W + 1)
    for wt, val in zip(weights, values):
        for w in range(W, wt - 1, -1):  # iterate backwards
            dp[w] = max(dp[w], dp[w - wt] + val)
    return dp[W]
```

Sig‘imni **oxiridan** aylanib chiqish muhim: shunda har bir buyum faqat bir marta ishlatiladi. Boshidan yurilsa, buyumlar cheksiz takrorlanadigan variant hosil bo‘ladi. Murakkablik — vaqt bo‘yicha O(n·W), xotira bo‘yicha O(W).

## Eng uzun umumiy qism-ketma-ketlik (LCS)

A va B satrlar berilgan. Ikkalasida ham bir xil tartibda (ketma-ket bo‘lishi shart emas) uchraydigan eng uzun belgilar ketma-ketligi uzunligini topish kerak.

- **Holat:** `dp[i][j]` — A ning birinchi i ta va B ning birinchi j ta belgisi uchun LCS uzunligi.
- **O‘tish:** agar `A[i-1] == B[j-1]` bo‘lsa, `dp[i][j] = dp[i-1][j-1] + 1`; aks holda `max(dp[i-1][j], dp[i][j-1])`.
- **Baza:** `dp[0][j] = dp[i][0] = 0`.

```python
def lcs(a, b):
    n, m = len(a), len(b)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[n][m]
```

Murakkablik — O(n·m). Qism-ketma-ketlikning o‘zini `dp[n][m]` dan orqaga yurib tiklash mumkin. Fayllarni solishtirish vositalari (diff) va tahrirlash masofasi ham shu g‘oyaga asoslangan.

## Ko‘p uchraydigan xatolar

- **Noaniq holat.** `dp[i]` ni bitta gap bilan tavsiflay olmasangiz, o‘tish chalkash bo‘ladi.
- **To‘liq bo‘lmagan o‘tish** — tanlovlardan biri unutilgan.
- **Noto‘g‘ri aylanib chiqish tartibi** — qiymat hisoblanishidan oldin o‘qiladi.
- **Indekslar siljishi** satr va n + 1 o‘lchamli jadval o‘rtasida.
- **DP o‘rniga ochko‘zlik** — mahalliy eng yaxshi tanlov har doim ham global optimumni bermaydi.

## FAQ

### DP «bo‘l va hukmronlik qil» dan nimasi bilan farq qiladi?

«Bo‘l va hukmronlik qil» da qism-masalalar mustaqil, masalan birlashtirish saralashidagi massiv yarmlari kabi. DP da ular kesishadi, shuning uchun javoblarini saqlash foydali.

### Masala yechilmasa, nimadan boshlash kerak?

Barcha variantlarni ko‘rib chiquvchi rekursiya yozing va chaqiruvlar orasida qaysi parametrlar o‘zgarishini belgilang — bu sizning holatingiz. Keyin kesh qo‘shing.

### Jadvalli DP da xotirani qanday kamaytirish mumkin?

Agar `dp[i]` qatori faqat `dp[i-1]` ga bog‘liq bo‘lsa, ikkita qator yoki ryukzak masalasidagidek to‘g‘ri yo‘nalishda aylanib chiqiladigan bitta qatorni saqlang.
