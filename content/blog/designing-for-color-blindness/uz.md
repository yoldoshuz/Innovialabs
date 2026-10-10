---
title: Daltonizmni hisobga olgan dizayn: amaliy usullar
description: Rang ko‘rish buzilishlari turlari, simulyatsiya vositalari hamda grafiklar va interfeys holatlarini o‘qiladigan qiladigan ikonka, pattern va yozuv usullari.
summary: Ma’noni faqat rang bilan yetkazmang: uni ikonka, matn, shakl yoki pattern bilan takrorlang va ranglar yorqinlik bo‘yicha farq qilishini ta’minlang. Maketlarni protanopiya, deyteranopiya va tritanopiya simulyatorlarida hamda kulrang tusda tekshiring.
---

## Qisqa javob

Asosiy qoida — **rang ma’noning yagona tashuvchisi bo‘lmasligi kerak**. Bu WCAG’da to‘g‘ridan-to‘g‘ri yozilgan (1.4.1 Use of Color mezoni). Agar «xato» holati «muvaffaqiyat»dan faqat qizil va yashil rang bilan farq qilsa, foydalanuvchilarning bir qismi ularni ajrata olmaydi. Ikkinchi kanal qo‘shing — ikonka, matn, shakl, pattern yoki joylashuv — va interfeys hamma uchun tushunarli bo‘ladi.

## Rang ko‘rish buzilishlari turlari

| Tur | Nima sodir bo‘ladi | Nimalar adashtiriladi |
|---|---|---|
| Protanopiya / protanomaliya | «qizil» kolbachalar yo‘q yoki zaif | qizil, yashil, jigarrang; qizil to‘qroq ko‘rinadi |
| Deyteranopiya / deyteranomaliya | «yashil» kolbachalar yo‘q yoki zaif | qizil va yashil, zaytun va to‘q sariq tuslar |
| Tritanopiya / tritanomaliya | «ko‘k» kolbachalar yo‘q yoki zaif | ko‘k va yashil, sariq va pushti |
| Monoxromaziya | rang deyarli yoki umuman sezilmaydi | hamma narsa faqat yorqinlik bo‘yicha farqlanadi |

Qizil-yashil buzilishlar boshqalariga qaraganda ko‘proq uchraydi, erkaklarda esa ayollarga nisbatan sezilarli darajada ko‘p. Shuning uchun «qizil — yashil» juftligi interfeysdagi eng xavfli juftlik.

## Simulyatsiya vositalari

- **Chrome DevTools** — Rendering yorlig‘i, Emulate vision deficiencies bandi: jonli sahifani tekshirish.
- **Figma plaginlari** — daltonizm turlarini to‘g‘ridan-to‘g‘ri maketda simulyatsiya qilish.
- **OT filtrlari** — macOS va Windows’dagi rang filtrlari, jumladan kulrang rejim.
- **Grayscale testi** — ekranni oq-qoraga o‘tkazing. Holatlar farqlanmay qolsa, siz faqat rang tusiga tayanyapsiz.

Simulyatsiya — taxminiy model, muayyan insonning ko‘rishining aniq nusxasi emas. Mahsulot muhim bo‘lsa (tibbiyot, moliya, transport), uni haqiqiy foydalanuvchilar bilan test qilish bilan to‘ldiring.

## Interfeys holatlari uchun usullar

- **Xato va muvaffaqiyat**: maydon yonida ikonka (xoch, belgi) va xabar matni, faqat qizil ramka emas.
- **Matndagi havolalar**: faqat rang emas, tagiga chizish yoki boshqa qalinlik.
- **Majburiy maydonlar**: aniq yozuv yoki izohi berilgan belgi.
- **Toggle va tablar**: faol holatni rang tusi bilan emas, shakl, qalinlik yoki joylashuv bilan ko‘rsating.
- **Kontrast**: WCAG 1.4.11 bo‘yicha muhim matn bo‘lmagan elementlar (maydon chegaralari, ikonkalar) fonga nisbatan kamida 3:1 kontrastga ega bo‘lishi kerak.

## Grafiklar uchun usullar

Grafiklar eng zaif joy, chunki seriyalar ko‘pincha faqat rang bilan kodlanadi.

1. Alohida legenda o‘rniga chiziq va ustunlar yonida **to‘g‘ridan-to‘g‘ri yozuvlar**.
2. **Turli markerlar va chiziq turlari**: doira, kvadrat, uchburchak; yaxlit, punktir, shtrix-punktir.
3. Seriyalar ikki-uchtadan ko‘p bo‘lsa, maydon va ustunlar uchun **patternlar va shtrixlar**.
4. **Yorqinlikdagi farq**: palitradagi qo‘shni ranglar faqat tus bilan emas, yorqinlik bilan ham farq qilishi kerak.
5. **Sinalgan palitralar**: yorqinligi bir tekis o‘zgaradigan ketma-ket palitralar (masalan, viridis oilasi) va daltoniklar uchun ishlab chiqilgan kategorial palitralar (masalan, Okabe–Ito).
6. Muqobil o‘qish usuli sifatida **hover’da ajratib ko‘rsatish** va grafik yonida ma’lumotlar jadvali.

«Yomon — o‘rtacha — yaxshi» shkalalari uchun qizil-yashil o‘rniga, masalan, to‘q sariq-ko‘k shkaladan foydalaning.

## Dasturlashga topshirishdan oldingi chek-list

- [ ] Har bir holat kulrang tusda tushunarli.
- [ ] Hech qayerda ikkinchi belgisiz «qizil/yashil» juftligi yo‘q.
- [ ] Havolalar faqat rang bilan farqlanmaydi.
- [ ] Grafik seriyalari yozilgan yoki turli markerlarga ega.
- [ ] Maketlar uchta asosiy tur simulyatsiyasidan o‘tkazilgan.
- [ ] Matn va muhim elementlar kontrasti tekshirilgan.

## FAQ

### Qizil va yashildan voz kechish kerakmi?

Yo‘q. Ular odatiy signallar va ularni ishlatish mumkin. Muhimi, yonida doim ikkinchi belgi — ikonka, matn yoki shakl bo‘lsin va ranglar yorqinlik bo‘yicha sezilarli farq qilsin.

### Maketni bitta simulyatorda tekshirish yetarlimi?

Bazaviy tekshiruv uchun — ha, agar barcha asosiy turlar va grayscale’dan o‘tkazsangiz. Lekin simulyatorlar taxminiy natija beradi, shuning uchun muhim ssenariylarda rang ko‘rishi buzilgan odamlar bilan test qilish foydali.

### Bir-biridan yomon ajraladigan brend ranglari bilan nima qilish kerak?

Ularni aksentlar va brend elementlari uchun qoldiring, funksional holatlar va grafiklar uchun esa dizayn tizimida alohida qulay palitra yarating.
