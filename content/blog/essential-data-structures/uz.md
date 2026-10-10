---
title: Har bir dasturchi bilishi kerak bo‘lgan ma’lumotlar tuzilmalari
description: Massivlar, ro‘yxatlar, stek, navbat, xesh-jadvallar, to‘plamlar, daraxtlar, uyumlar va graflar: amallar narxi va to‘g‘ri tuzilmani tanlash qoidasi.
summary: Ma’lumotlar tuzilmasi asosiy amalga qarab tanlanadi: indeks bo‘yicha murojaat — massiv, kalit bo‘yicha qidiruv — xesh-jadval, tartib va oraliqlar — daraxt, «eng muhim element» — uyum, obyektlar orasidagi bog‘lanishlar — graf.
---
## Tanlashning asosiy qoidasi

Ma’lumotlar tuzilmasi — bu ma’lumotlarni xotirada shunday joylashtirish usuliki, **eng ko‘p bajariladigan amal arzon** bo‘lsin. Avval kodingiz nimani ko‘proq qilishini aniqlang: indeks bo‘yicha o‘qiydimi, kalit bo‘yicha qidiradimi, oxiriga qo‘shadimi, eng kichik elementni oladimi yoki bog‘lanishlar bo‘ylab yuradimi. Tanlov shunga bog‘liq.

## Amallar narxi jadvali

Baholar odatiy implementatsiya va o‘rtacha holat uchun berilgan.

| Tuzilma | Murojaat | Qidiruv | Qo‘shish | O‘chirish |
|---|---|---|---|---|
| Massiv (dinamik) | O(1) | O(n) | oxiriga O(1), o‘rtaga O(n) | O(n) |
| Bog‘langan ro‘yxat | O(n) | O(n) | tugun ma’lum bo‘lsa O(1) | tugun ma’lum bo‘lsa O(1) |
| Stek | cho‘qqiga O(1) | — | O(1) | O(1) |
| Navbat | boshiga O(1) | — | O(1) | O(1) |
| Xesh-jadval | — | O(1) | O(1) | O(1) |
| Muvozanatli qidiruv daraxti | — | O(log n) | O(log n) | O(log n) |
| Uyum (heap) | minimumga O(1) | O(n) | O(log n) | minimum uchun O(log n) |

## Massiv

Elementlar xotirada ketma-ket joylashadi, shuning uchun indeks bo‘yicha murojaat bir zumda bajariladi, protsessor keshi tufayli aylanib chiqish ham tez. O‘rtaga qo‘shish keyingi barcha elementlarni surishni talab qiladi. **Standart tanlov sifatida ishlating** — ko‘pchilik ro‘yxatlar uchun bu eng yaxshi variant.

## Bog‘langan ro‘yxat

Har bir tugun qiymat va keyingi tugunga havolani saqlaydi. Tugunga havola bo‘lsa, qo‘shish va o‘chirish arzon, lekin indeks bo‘yicha murojaat uchun boshidan yurish kerak. Amalda kam kerak bo‘ladi: masalan, LRU-kesh ichida yoki o‘rtadan tez-tez o‘chiriladigan navbatlarda.

## Stek va navbat

- **Stek (LIFO)** — oxirgi kirgan birinchi chiqadi. «Bekor qilish» tarixi, qavslarni tekshirish, chuqurlik bo‘yicha qidiruv, funksiyalar chaqiruvlari steki.
- **Navbat (FIFO)** — birinchi kirgan birinchi chiqadi. Vazifalarni tartib bilan qayta ishlash, kenglik bo‘yicha qidiruv, xabarlar buferlari.

Python’da navbat uchun `collections.deque` ishlating. JavaScript’da `push`/`pop` bilan massiv stek sifatida ishlaydi, katta navbatlar uchun esa alohida implementatsiya yaxshiroq, chunki `shift` elementlarni suradi.

## Xesh-jadval va to‘plam

**Xesh-jadval** «kalit — qiymat» juftlarini saqlaydi va qiymatni kalit bo‘yicha o‘rtacha doimiy vaqtda topadi. Bu Python’da `dict`, JavaScript’da `Map` va obyektlar, Java’da `HashMap`. **To‘plam** (set) — qiymatsiz xesh-jadval: «element bormi» degan tez tekshiruv va dublikatlarni olib tashlash.

Odatiy usul: ichma-ich qidiruv siklini oldindan qurilgan lug‘at bilan almashtirish — kvadratik algoritm chiziqli bo‘lib qoladi.

## Daraxtlar

Daraxt — bitta ildizga ega tugunlar ierarxiyasi. **Ikkilik qidiruv daraxti** elementlarni tartibli saqlaydi: chapda kichiklar, o‘ngda kattalar. Muvozanatli holatda qidiruv, qo‘shish va o‘chirish O(log n) vaqt oladi, bundan tashqari elementlarni tartib bilan olish va oraliqlarni qidirish mumkin. Daraxtlar asosida ma’lumotlar bazasi indekslari (B-daraxtlar), DOM va fayl tizimlari qurilgan.

## Uyum

Uyum (heap) eng kichik (yoki eng katta) elementni tez beradi va yangilarini tez qabul qiladi. Bu **ustuvorlik navbati**ning asosi: vazifalar rejalashtiruvchilari, Deykstra algoritmi, top-K elementlarni tanlash. Python’da `heapq` moduli, Java’da `PriorityQueue`.

## Graf

Graf obyektlar va ular orasidagi bog‘lanishlarni tasvirlaydi: yo‘llar, ijtimoiy tarmoqdagi do‘stlar, paketlar bog‘liqliklari. Odatda qo‘shnilik ro‘yxati sifatida saqlanadi — «cho‘qqi — qo‘shnilar ro‘yxati» lug‘ati. Asosiy algoritmlar: kenglik va chuqurlik bo‘yicha aylanish, eng qisqa yo‘llar, topologik saralash.

## Tanlash bo‘yicha qisqa yo‘riqnoma

- Tartibli ro‘yxat va raqam bo‘yicha murojaat kerak — **massiv**.
- Kalit bo‘yicha tez topish yoki dublikatlarni olib tashlash — **xesh-jadval / to‘plam**.
- Kelish tartibida qayta ishlash — **navbat**; teskari tartibda — **stek**.
- Har doim eng shoshilinch element kerak — **uyum**.
- Tartib, oraliqlar, «keyingi kattaroq» kerak — **qidiruv daraxti**.
- Ma’lumotlar — bu bog‘lanishlar — **graf**.

## Keng tarqalgan xatolar

- Bir marta lug‘at qurish mumkin bo‘lganda massivda sikl ichida qidirish.
- «Qo‘shish O(1)» deb bog‘langan ro‘yxatni tanlash, holbuki joyni avval O(n) vaqtda topish kerak.
- Xesh-jadval kalitlarni saralangan holda saqlaydi deb o‘ylash.
- Haqiqiy tor joy qayerdaligini o‘lchamasdan turib tuzilmani optimallashtirish.

## FAQ

### Bu tuzilmalarni o‘zim yozishim kerakmi?

Ish kodida deyarli hech qachon: standart kutubxonalar sinovdan o‘tgan implementatsiyalarni beradi. Lekin to‘g‘risini tanlash va unumdorlikni oldindan bilish uchun ularning ichki tuzilishini tushunish kerak.

### Amalda O(1) va O(log n) nimani anglatadi?

Bu ma’lumotlar ko‘payganda vaqt qanday o‘sishini baholash. O(1) — vaqt hajmga bog‘liq emas, O(log n) — juda sekin o‘sadi, O(n) — elementlar soniga proporsional. Konstantalar va protsessor keshi ham ta’sir qiladi, shuning uchun kichik hajmlarda farq sezilmasligi mumkin.

### O‘rganishni nimadan boshlash kerak?

Massiv, xesh-jadval va navbatdan — ular kundalik vazifalarning ko‘pchiligini qamrab oladi. Keyin daraxtlar va uyumlar, so‘ng graflar.
