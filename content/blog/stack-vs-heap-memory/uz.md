---
title: Stek va heap: har bir dasturchi bilishi kerak bo‘lgan narsalar
description: Stek va heap qanday ishlaydi, qiymat va havola turlari farqi, stack overflow qayerdan chiqadi va bu unumdorlik uchun nega muhim.
summary: Stek — funksiyaning lokal ma’lumotlari uchun tez xotira bo‘lib, funksiyadan chiqishda o‘zi bo‘shaydi; heap — istalgan muddat yashaydigan ma’lumotlar uchun moslashuvchan xotira, lekin unda joy ajratish qimmatroq.
---
## Qisqacha javob

Dastur ma’lumotlarni ikkita asosiy xotira sohasida saqlaydi:

- **Stek (stack)** — lokal o‘zgaruvchilar va funksiya chaqiruvining xizmat ma’lumotlarini saqlaydi. Joy ajratish va bo‘shatish deyarli tekin: funksiyaga kirishda **kadr (frame)** yaratiladi, chiqishda u butunlay yo‘qoladi.
- **Heap (uyum)** — funksiya chaqiruvidan uzoqroq yashashi kerak bo‘lgan yoki o‘lchami faqat ish vaqtida ma’lum bo‘ladigan ma’lumotlarni saqlaydi. Xotira aniq (`new`, `malloc`) yoki yashirin ajratiladi, bo‘shatish esa qo‘lda, axlat yig‘uvchi yoki egalik qoidalari orqali bo‘ladi.

| | Stek | Heap |
|---|---|---|
| Yashash muddati | Funksiya bajarilayotganda | Ma’lumot kerak ekan |
| Ajratish tezligi | Juda yuqori | Pastroq |
| Hajmi | Cheklangan, OT va sozlamalarga bog‘liq | Ancha katta |
| Kim bo‘shatadi | Chiqishda avtomatik | GC, dasturchi yoki egasi |
| Kirish | Har bir oqimning o‘z steki bor | Barcha oqimlar uchun umumiy |

## Stek qanday ishlaydi

Stek **LIFO** tamoyili bo‘yicha ishlaydi — oxirgi kirgan birinchi chiqadi. `a` funksiyasi `b`’ni chaqirganda `b` kadri `a` kadri ustiga qo‘yiladi. `b` qaytganda uning kadri olib tashlanadi va barcha lokal o‘zgaruvchilari yo‘qoladi.

Shu sababli C’da lokal o‘zgaruvchiga ko‘rsatkichni qaytarib bo‘lmaydi: funksiyadan chiqqandan keyin bu xotira endi boshqaniki.

## Heap qanday ishlaydi

Heap — katta xotira havzasi bo‘lib, allokator undan kerakli o‘lchamdagi bloklarni beradi. Bu moslashuvchan, lekin narxi bor:

- allokator bo‘sh blokni topishi kerak;
- xotira **fragmentatsiyaga** uchrashi mumkin;
- GC’li tillarda har bir ajratish — yig‘uvchi uchun kelajakdagi ish;
- obyektlar xotirada sochilib yotadi, bu **protsessor keshi** uchun yomonroq.

## Qiymat va havola turlari

«Qiymat turlari stekda, havola turlari heap’da» degan mashhur soddalashtirish noaniq. Aniqrog‘i: **qiymat turi ma’lumotning o‘zini, havola turi esa heap’dagi ma’lumot manzilini saqlaydi**. Qiymat qayerda bo‘lishi u qayerda e’lon qilinganiga bog‘liq.

- **Java:** primitivlar (`int`, `double`) — qiymatlar; obyektlar heap’da, o‘zgaruvchi esa havolani saqlaydi. JIT escape analysis orqali heap’da joy ajratishdan qochishi mumkin.
- **C#:** `struct` — qiymat turi, `class` — havola turi. Lekin klass maydonidagi `struct` obyekt bilan birga heap’da yashaydi.
- **Go:** kompilyator qiymatni qayerga joylashtirishni **escape analysis** orqali o‘zi hal qiladi. Agar qiymat funksiyadan «qochsa» (masalan, unga ko‘rsatkich qaytarilsa), u heap’ga tushadi.
- **Python va JavaScript:** deyarli hamma narsa heap’dagi obyekt, joylashuv tafsilotlarini dvijok yashiradi.

Amaliy natija — nusxalashning turlicha semantikasi:

```csharp
struct PointS { public int X; }
class  PointC { public int X; }

var a = new PointS { X = 1 }; var b = a; b.X = 2; // a.X == 1, qiymat nusxalandi
var c = new PointC { X = 1 }; var d = c; d.X = 2; // c.X == 2, havola nusxalandi
```

Go’da kompilyator qarorlarini ko‘rish mumkin:

```bash
go build -gcflags=-m ./...
```

## Stack overflow

Stek cheklangan, shuning uchun juda chuqur rekursiya yoki ulkan lokal massivlar uni to‘ldirib yuboradi. Bu turlicha ko‘rinadi:

- Java — `StackOverflowError`;
- JavaScript — `RangeError: Maximum call stack size exceeded`;
- Python — `RecursionError` (interpretator chuqurlikni oldindan cheklaydi);
- C/C++ — odatda jarayonning favqulodda to‘xtashi.

Qanday tuzatiladi: rekursiyani siklga aylantiring, aniq ma’lumotlar tuzilmasidan (heap’dagi o‘z stekingiz) foydalaning, katta massivlarni lokal o‘zgaruvchilarda saqlamang.

## Bu unumdorlik uchun nega muhim

- **Heap’da kamroq ajratish — GC uchun kamroq ish** va qisqaroq pauzalar.
- Qizg‘in sikllarda har iteratsiyada yangi obyekt yaratish o‘rniga **buferlarni qayta ishlating**.
- **Ixcham ma’lumotlar tezroq**: qiymatlar massivi sochilgan obyektlarga havolalar massividan samaraliroq aylanib chiqiladi.
- **Ko‘r-ko‘rona optimallashtirmang.** Avval profiler, keyin o‘zgarishlar.

## FAQ

### Stek har doim heap’dan tezmi?

Stekda joy ajratish deyarli har doim arzonroq. Ammo allaqachon ajratilgan ma’lumotlarga kirish tezligi xotira sohasiga emas, birinchi navbatda ular protsessor keshida bor-yo‘qligiga bog‘liq.

### Stek hajmini oshirish mumkinmi?

Ha, odatda OT sozlamalari yoki runtime parametrlari orqali, masalan Java’da `-Xss`. Lekin stek rekursiya tufayli to‘lib qolsa, algoritmni o‘zgartirish ishonchliroq yechim.

### Python yoki JavaScript’da stek va heap haqida o‘ylash kerakmi?

Joylashuvni bevosita boshqara olmaysiz, ammo tushunish foydali: keraksiz obyektlar va qisqa muddatli ajratishlar qancha kam bo‘lsa, axlat yig‘uvchiga yuk shuncha kam bo‘ladi.
