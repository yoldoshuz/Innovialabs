---
title: Kompilyatsiya va interpretatsiya: kod qanday bajariladi
description: Kompilyator, interpretator, bayt-kod va JIT nima — C, Python, Java va JavaScript misolida, hamda bu tezlik, ko‘chirish va deployga qanday ta’sir qiladi.
summary: Kompilyator kodni ishga tushirishdan oldin mashina buyruqlariga o‘giradi, interpretator uni bajarish jarayonida ishlaydi, zamonaviy tillarning aksariyati esa bayt-kod va JIT orqali ikkalasini birlashtiradi — shuning uchun yorliqdan ko‘ra aniq implementatsiyani tushunish muhimroq.
---

## Qisqacha: farq nimada

Protsessor faqat **mashina kodini** tushunadi. Qolgan hamma narsani tarjima qilish kerak, savol faqat — *qachon*.

- **Kompilyatsiya** — butun dasturni **ishga tushirishdan oldin** mashina kodiga o‘girish. Natijada tayyor bajariladigan fayl hosil bo‘ladi.
- **Interpretatsiya** — interpretator dasturi kodni o‘qiydi va uni **ishga tushirish vaqtida**, qadamma-qadam bajaradi.

Muhim izoh: kompilyatsiya yoki interpretatsiya qilinadigan narsa — til emas, balki **uning implementatsiyasi**. Python’ning ham interpretatori, ham kompilyatorlari bor; JavaScript’da — interpretatorlar va JIT. Lekin har bir tilning asosiy, odatiy bajarilish usuli bor — gap shu haqda.

## Misollarda to‘rtta model

### C: klassik kompilyatsiya

```bash
gcc main.c -o app   # mashina kodiga kompilyatsiya
./app               # kompilyatorsiz ishga tushirish
```

Kompilyator butun dasturni ko‘radi, uni optimallashtiradi va aniq platforma (OT + protsessor arxitekturasi) uchun binar fayl chiqaradi. ARM’dagi Linux va x86’dagi Windows uchun alohida yig‘malar kerak.

### Python: bayt-kod va interpretator

```bash
python main.py
```

Standart implementatsiya **CPython** avval manba kodini **bayt-kodga** (o‘sha `.pyc` fayllar) kompilyatsiya qiladi, keyin virtual mashina uni buyruqma-buyruq interpretatsiya qiladi. Serverda ishga tushirish uchun kerakli versiyadagi Python va bog‘liqliklar o‘rnatilgan bo‘lishi kerak.

### Java: bayt-kod + JIT

```bash
javac Main.java   # manba -> .class bayt-kod
java Main         # JVM bayt-kodni bajaradi
```

Java bayt-kodi protsessorga bog‘lanmagan: bitta `.class` yoki `.jar` JVM o‘rnatilgan har qanday tizimda ishlaydi. JVM ichida kod avval interpretatsiya qilinadi, tez-tez bajariladigan «issiq» qismlarni esa **JIT-kompilyator** dastur ishlayotgan paytda mashina kodiga o‘giradi.

### JavaScript: JIT’li dvigatel

Brauzer yoki Node.js manba matnini oladi. Dvigatel (masalan, V8) uni tahlil qiladi, interpretator orqali bajarishni boshlaydi va parallel ravishda ma’lumot tiplari bo‘yicha kuzatuvlarga tayanib, tez-tez ishlatiladigan funksiyalarni JIT-kompilyatsiya qiladi.

## Yondashuvlarni taqqoslash

| | Ahead-of-time (C, Go, Rust) | Bayt-kod + interpretator (CPython) | Bayt-kod/manba + JIT (Java, C#, JS) |
|---|---|---|---|
| Qachon tarjima qilinadi | ishga tushirishdan oldin | ishga tushganda, qadamma-qadam | ishga tushganda, issiq kod — mashina kodiga |
| Dastur starti | tez | tez | «qizish» tufayli sekinroq bo‘lishi mumkin |
| Eng yuqori tezlik | yuqori | odatda pastroq | qizishdan keyin yuqori |
| Ko‘chirish | har platforma uchun yig‘ma | interpretator kerak | runtime kerak (JVM, .NET, dvigatel) |
| Nimani deploy qilish | bitta binar fayl | manba + interpretator + bog‘liqliklar | artefakt + runtime |

## Amalda bu nimani anglatadi

**Tezlik.** Hisoblash talab qiladigan og‘ir vazifalarda kompilyatsiya qilinadigan va JIT tillar odatda tezroq. Lekin oddiy veb-servisda tor joy ko‘pincha til emas, balki ma’lumotlar bazasi, tarmoq va algoritmlar bo‘ladi. Avval o‘lchang, keyin tanlang.

**Ishlab chiqish tezligi.** Interpretatsiya qilinadigan tillar «o‘zgartirdim — ishga tushirdim» siklini tez qiladi va qulay REPL beradi. Kompilyatsiya ba’zi xatolarni oldinroq ushlaydi, lekin yig‘ish bosqichini qo‘shadi.

**Ko‘chirish.** C yoki Go binar faylini har bir maqsadli platforma uchun yig‘ish kerak. Java yoki .NET bayt-kodi ko‘chma, lekin runtime talab qiladi.

**Deploy.** Bitta statik binar faylni minimal Docker-obrazga joylash oson. Python va Node.js uchun obrazga interpretator va bog‘liqliklarni qo‘shish, ularning versiyalarini qat’iy belgilash muhim.

## Keng tarqalgan noto‘g‘ri tasavvurlar

- **«Interpretatsiya qilinadigan — demak sekin».** Zamonaviy JavaScript va JVM JIT dvigatellari juda tez; Python esa ko‘pincha C’da yozilgan tezkor kutubxonalarni chaqiradi.
- **«Kompilyatsiya qilinadigan — demak xatosiz».** Kompilyator sintaksis va (tiplashtirilgan tillarda) tip xatolarini ushlaydi, lekin mantiqiy xatolarni emas.
- **«Til abadiy u yoki bu».** Chegara xira: Java va C# uchun AOT-kompilyatsiya, Python uchun JIT (masalan, PyPy), brauzer uchun WebAssembly mavjud.

## FAQ

### Python kompilyatsiya qilinadimi yoki interpretatsiya?

Standart CPython kodni bayt-kodga kompilyatsiya qiladi, keyin uni virtual mashina interpretatsiya qiladi. Shuning uchun uni odatda interpretatsiya qilinadigan til deyishadi, garchi kompilyatsiya bosqichi bo‘lsa ham.

### JIT oddiy so‘zlar bilan nima?

Bu «ish jarayonida» kompilyatsiya: runtime qaysi kod eng ko‘p bajarilishini kuzatadi va takroriy chaqiruvlarni tezlashtirish uchun aynan shu kodni dastur ishlayotganda mashina kodiga o‘giradi.

### Bu tanlov loyihani qo‘llab-quvvatlash narxiga ta’sir qiladimi?

Bilvosita. Bajarilish modelidan ko‘ra ekotizimning yetukligi, dasturchilar mavjudligi va infratuzilmangizda deploy qilish qulayligi muhimroq.
