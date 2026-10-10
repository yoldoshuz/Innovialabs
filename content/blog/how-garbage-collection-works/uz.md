---
title: Java, Go va JavaScript’da axlat yig‘ish qanday ishlaydi
description: Havolalarni sanash, mark-and-sweep va avlodlar: Java, Go va JavaScript’da GC qanday ishlaydi, xotira oqishi nega baribir yuz beradi va uni qanday topish mumkin.
summary: Axlat yig‘uvchi dastur havolalar orqali endi yetib bora olmaydigan obyektlarni bo‘shatadi; oqish esa keraksiz obyekt hali ham yetib boriladigan bo‘lsa, masalan keshda yoki obunada qolsa, yuz beradi.
---
## Qisqacha javob

**Garbage collector (GC)** dastur endi ishlatmayotgan xotirani avtomatik bo‘shatadi. Asosiy tushuncha — **yetib borish mumkinligi** (reachability): obyekt **ildizlardan** (lokal o‘zgaruvchilar, stek, global va statik maydonlar) havolalar zanjiri orqali yetib borish mumkin ekan, u tirik hisoblanadi. Yetib borib bo‘lmaydigan hamma narsa — axlat.

Amaliy xulosa: GC obyekt sizga «endi kerak emasligini» bilmaydi. U faqat obyektga hech kim havola qilmayotganini biladi. Shuning uchun GC’li tillarda xotira oqishi odatiy holat.

## Uchta asosiy yondashuv

### Havolalarni sanash (reference counting)

Har bir obyektda havolalar hisoblagichi bor. U nolga tushganda obyekt darhol bo‘shatiladi.

- **Afzalligi:** xotira oldindan aytib bo‘ladigan tarzda va darhol bo‘shaydi.
- **Kamchiligi:** siklik havolalar (A B’ga, B A’ga ishora qiladi) hech qachon nolga tushmaydi. Shu sababli CPython alohida sikl yig‘uvchidan foydalanadi, Swift’da (ARC) esa dasturchi sikllarni `weak` orqali uzadi.

Java, Go va V8 havolalarni sanashni asosiy mexanizm sifatida ishlatmaydi.

### Mark-and-sweep

1. **Mark** — ildizlardan boshlab obyektlar grafi aylanib chiqiladi va yetib boriladigan hamma narsa belgilanadi.
2. **Sweep** — belgilanmagan obyektlar bo‘shatiladi.

Bu yerda sikllar muammo emas: agar siklga ildizlardan yetib borib bo‘lmasa, u butunlay yig‘ib olinadi. Ko‘pincha **compaction** ham qo‘shiladi — fragmentatsiyani yo‘qotish uchun tirik obyektlar zichlanadi.

### Avlodlar (generational GC)

Asosiy kuzatuv: **ko‘pchilik obyektlar yoshligida o‘ladi**. Shuning uchun heap yosh va keksa avlodga bo‘linadi. Yosh avlod tez-tez va arzon yig‘iladi (odatda tirik qolganlarni nusxalash orqali), keksa avlod — kamroq. Bir necha yig‘ishdan omon qolgan obyekt keksa avlodga o‘tkaziladi.

## Uchta runtime’da qanday qilingan

| | Java (HotSpot) | Go | JavaScript (V8) |
|---|---|---|---|
| Asos | Avlodlar + mark/compact | Parallel tri-color mark-and-sweep | Avlodlar + mark-sweep-compact |
| Avlodlar | Ha | Yo‘q | Ha |
| Obyektlarni ko‘chiradi | Ha | Yo‘q | Ha |
| Sozlash | Yig‘uvchini tanlash, heap o‘lchami | `GOGC`, `GOMEMLIMIT` | V8 flaglari, kam o‘zgartiriladi |

**Java.** JVM’da bir nechta yig‘uvchi bor: G1 (zamonaviy JDK’larda standart), past kechikishli ZGC va Shenandoah, shuningdek Parallel va Serial. Tanlov — pauzalar, o‘tkazuvchanlik va xotira sarfi o‘rtasidagi murosa.

**Go.** Yig‘uvchi parallel ishlaydi: dastur bilan bir vaqtda ishlab, qisqa pauzalar qiladi. Avlodlar ham, ko‘chirish ham yo‘q. Buning o‘rniga kompilyator **escape analysis** yordamida ko‘p qiymatlarni stekda joylashtiradi va ular GC’ga umuman yuk bo‘lmaydi. Yig‘ish chastotasini `GOGC`, yumshoq xotira limitini `GOMEMLIMIT` belgilaydi.

**JavaScript (V8).** Yosh avlod tez nusxalovchi yig‘uvchi (Scavenger) bilan, keksa avlod esa mark-sweep-compact bilan yig‘iladi, ishning katta qismi bosqichma-bosqich va fon oqimlarida bajariladi. Boshqa dvijoklar tafsilotlarda farq qiladi, ammo avlodlar g‘oyasi keng tarqalgan.

## Oqishlar baribir qanday yuz beradi

GC’li tilda oqish — bu **keraksiz, lekin hali yetib boriladigan** obyekt. Odatiy sabablar:

- **Java:** chiqarib tashlash mexanizmisiz statik kolleksiyalar va keshlar, o‘chirilmagan listener’lar va obunalar, thread pool’lardagi `ThreadLocal` qiymatlar.
- **Go:** kanalda abadiy bloklangan goroutine’lar, ulkan asosiy massivni ushlab turgan kichik slice, faqat o‘sib boradigan map’lar.
- **JavaScript:** unutilgan `addEventListener` va `setInterval`, katta ma’lumotlarni ushlab qolgan closure’lar, hali qayerdadir saqlanayotgan ajratilgan DOM tugunlari.

Umumiy qonuniyat: **uzoq yashaydigan hamma narsa (global tuzilmalar, singleton’lar, keshlar) cheklov yoki aniq tozalashga ega bo‘lishi kerak**.

## Oqishni qanday topish mumkin

1. **O‘sishni tasdiqlang.** Barqaror yuklama ostida GC’dan keyingi xotira soatdan soatga o‘sib borsa — bu xavotirli belgi. Bitta cho‘qqi esa — yo‘q.
2. **Ma’lum vaqt oralig‘ida heap’ning ikkita snapshot’ini oling** va qaysi obyektlar ko‘payganini solishtiring.
3. **Ushlab turuvchi yo‘lni toping** — ildizdan «ortiqcha» obyektgacha bo‘lgan havolalar zanjiri. Aynan u xotirani kim ushlab turganini ko‘rsatadi.

Vositalar:

- **Java:** `jcmd <pid> GC.heap_dump`, Eclipse MAT yoki VisualVM’da tahlil, Java Flight Recorder.
- **Go:** heap profili uchun `net/http/pprof` va `go tool pprof`, osilib qolganlarni topish uchun goroutine profili.
- **JavaScript:** Chrome DevTools’dagi Memory bo‘limi (heap snapshot’lar va solishtirish), Node.js uchun `node --inspect`.

```go
import _ "net/http/pprof" // HTTP serveringizga /debug/pprof/ qo‘shadi
```

## FAQ

### Axlat yig‘ishni qo‘lda ishga tushirish mumkinmi?

Texnik jihatdan ha (`System.gc()`, `runtime.GC()`), lekin production’da bu deyarli hech qachon muammoni hal qilmaydi. Xotira o‘sayotgan bo‘lsa, yig‘ishni majburlash o‘rniga ushlab turuvchi havolalarni qidiring.

### Nega jarayon yig‘ishdan keyin xotirani OT’ga qaytarmaydi?

Runtime’lar ko‘pincha bo‘shagan xotirani kelgusi ajratishlar uchun o‘zida qoldiradi. Faqat jarayon RSS’iga emas, GC’dan keyingi tirik heap hajmiga qarang.

### Java’da qaysi yig‘uvchini tanlash kerak?

Standart yig‘uvchidan boshlang. O‘lchovlar GC pauzalari kechikish talablaringizni buzayotganini ko‘rsatgandagina past kechikishli yig‘uvchiga o‘ting.
