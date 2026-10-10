---
title: Insidentlar tahlili va blameless postmortem: amaliy qo‘llanma
description: Nosozlik paytidagi rollar va kommunikatsiya, postmortem shabloni, asosiy sabablarni topish va vazifalarni aybdor qidirmasdan oxiriga yetkazish.
summary: Insident paytida mas’ul shaxsni tayinlang va avval servisni tiklang, so‘ng aybdor qidirmasdan tahlil o‘tkazing, tizimli sabablarni toping va har bir vazifani bajarilguncha nazorat qiling.
---

## Asosiysi qisqacha

Insidentlar bilan ishlashning yaxshi jarayoni ikki qismdan iborat:

1. **Nosozlik paytida** — ideal yechim qidirmasdan, servisni tez tiklash. Bunda aniq rollar va yagona kommunikatsiya kanali yordam beradi.
2. **Nosozlikdan keyin** — **blameless postmortem**: aybdor odamni emas, tizim va jarayonlardagi zaif joylarni qidiradigan tahlil.

Nega aybdor qidirmasdan? Agar xato uchun jazolansa, odamlar tafsilotlarni yashiradi va jamoa tizim haqiqatda qanday ishlashi haqidagi eng qimmatli ma’lumotni yo‘qotadi.

## Insident paytidagi rollar

Kichik jamoada ham rollarni ajratgan ma’qul, aks holda hamma bir narsani tuzatadi va biznes bilan hech kim gaplashmaydi.

| Rol | Vazifa |
|---|---|
| **Incident Commander** | Ishni muvofiqlashtiradi, qaror qabul qiladi, o‘zi tuzatmaydi |
| **Ops / texnik lider** | Diagnostika qiladi va tuzatishlarni qo‘llaydi |
| **Communications** | Mijozlar, qo‘llab-quvvatlash va rahbariyat uchun holatni yangilaydi |
| **Scribe** | Xronologiyani yuritadi: nima sezildi, nima qilindi, qachon |

Kichik jamoada bir kishi bir nechta rolni bajarishi mumkin, lekin Incident Commander aniq tayinlanishi shart.

## Nosozlik paytidagi kommunikatsiya

- Insident uchun **alohida kanal** oching va muhokamani faqat shu yerda olib boring.
- **Jiddiylik darajasini** va kim boshqarayotganini e’lon qiling.
- Yangilik bo‘lmasa ham, tushunarli oraliqlarda **muntazam yangilanishlar** e’lon qiling.
- Tashqi holatni sodda tilda yozing: nima ishlamayapti, kimga ta’sir qiladi, keyingi yangilanish qachon.
- Ustuvorlik — **oqibatlarni yumshatish**: relizni orqaga qaytarish, trafikni boshqa joyga o‘tkazish, funksiyani o‘chirish. Asosiy sabab keyin qidiriladi.

## Postmortem shabloni

Tafsilotlar yodda turganida, odatda bir necha ish kuni ichida tahlil o‘tkazing.

```markdown
## Qisqacha tavsif
Nima bo‘ldi, kimga ta’sir qildi, qancha davom etdi.

## Ta’sir
Zarar ko‘rgan foydalanuvchilar, funksiyalar, buzilgan SLO’lar.

## Xronologiya
Vaqt — hodisa — kim nima qildi.

## Asosiy sabablar va yordam bergan omillar

## Nima yaxshi ishladi

## Nima noto‘g‘ri ketdi va qayerda omadimiz keldi

## Action items
Vazifa — egasi — muddat — tiketga havola.
```

## Asosiy sabablarni qanday topish kerak

- **5 Whys** — jarayon yoki tizimga yetib borguningizcha bir necha marta «nega?» deb so‘rang. «Muhandis xato qildi» degan joyda to‘xtash — yomon tahlil belgisi.
- **Bir nechta yordam bergan omillarni** qidiring: murakkab nosozliklarning sababi kamdan-kam bitta bo‘ladi.
- «Kim buni qildi?» o‘rniga «**tizim bunga qanday yo‘l qo‘ydi?**» deb so‘rang.
- **Trigger**ni (nosozlikni nima boshlab yubordi) **sabablardan** (nega bu mumkin bo‘ldi va nega oldinroq aniqlanmadi) ajrating.

## Action items’ni oxiriga qanday yetkazish kerak

Bajarilgan vazifalarsiz postmortem — shunchaki matn. Vazifalar yo‘qolmasligi uchun:

- Har bir vazifaning **bitta egasi va muddati** bo‘lsin.
- Vazifalar hujjatda qolib ketmasdan, **odatiy trekerga** kiritilsin.
- Aniq yozing: «monitoringni yaxshilash» emas, «to‘lov xatolari ulushi bo‘yicha alert qo‘shish».
- Vazifalarni **tezkor** (shu hafta) va **tizimli** (rejalashtirishni talab qiladigan) turlarga ajrating.
- Postmortemlardan qolgan ochiq vazifalar holatini jamoa uchrashuvlarida muntazam tekshiring.

## Ko‘p uchraydigan xatolar

- Sabablar o‘rniga aybdorni qidirish.
- Faqat yirik avariyalarni tahlil qilish — kichik insidentlarni tahlil qilish arzonroq, saboqlar esa bir xil.
- Hech kim bajarishga ulgurmaydigan juda ko‘p action items.
- Hech kim o‘qimaydigan postmortem: xulosalarni butun jamoa bilan ulashing.

## FAQ

### Qaysi insidentlar uchun postmortem kerak?

Kamida foydalanuvchilarga ta’sir qilgan yoki SLO’ni buzganlari uchun, shuningdek nosozlikdan zo‘rg‘a qochib qolingan holatlar uchun. Har safar qaytadan hal qilmaslik uchun mezonlarni oldindan yozib qo‘ygan ma’qul.

### Agar xatoni haqiqatan odam qilgan bo‘lsa, blameless nimani anglatadi?

Bu odam jazolanmasligini, savol esa kengroq qo‘yilishini anglatadi: nega jarayon xatoning production’ga tushishiga yo‘l qo‘ydi va nega tekshiruvlar uni aniqlamadi. Jarayonni tuzatish takrorlanishdan jazodan ko‘ra yaxshiroq himoya qiladi.

### Postmortemni kim yozishi kerak?

Odatda insident ishtirokchisi, ko‘pincha Incident Commander, nosozlik ustida ishlagan barchaning ishtirokida. Yakuniy tahlil har kim xronologiyani to‘ldirishi mumkin bo‘lgan uchrashuvda o‘tkaziladi.
