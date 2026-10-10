---
title: Rastr va vektor grafika: formatlar va qo‘llanilishi
description: Rastr vektordan nimasi bilan farq qiladi, PNG, JPG, WebP, SVG, PDF va AI masshtablashda qanday ishlaydi, logotip, foto, ikonka va bosma uchun qaysi format mos.
summary: Rastr tasvirni piksellar to‘ri sifatida saqlaydi va fotolar uchun mos, vektor esa uni formulalar bilan ta’riflaydi va sifatini yo‘qotmay masshtablanadi, shuning uchun logotip va ikonkalar vektorda, fotolar esa JPG yoki WebP’da bo‘ladi.
---

## Qisqacha: farqi nimada

**Rastr tasvir** — har biri o‘z rangiga ega piksellar to‘ri. Telefondagi foto, skrinshot, skanlar — bularning barchasi rastr. Rastrning ruxsati qat’iy: rasmni piksellar soni imkon berganidan ko‘proq kattalashtirsangiz, u xira yoki «zinapoya» shaklida bo‘lib qoladi.

**Vektor tasvir** — shakllar ta’rifi: nuqtalar, chiziqlar, egri chiziqlar, to‘ldirishlar. Kompyuter ularni har safar kerakli o‘lchamda qayta chizadi, shuning uchun vektor **sifatini yo‘qotmasdan masshtablanadi** — 16 pikselli ikonkadan bino ustidagi bannergacha.

Oddiy qoida: **chizilgan hamma narsa (logotiplar, ikonkalar, oddiy shakllardagi illyustratsiyalar) — vektorda; suratga olingan hamma narsa (fotolar) — rastrda.**

## Yondashuvlarni solishtirish

| | Rastr | Vektor |
|---|---|---|
| Nimadan iborat | Piksellar | Shakllar va egri chiziqlar |
| Masshtablash | Kattalashtirilganda sifat yo‘qoladi | Har qanday o‘lchamda yo‘qotishsiz |
| Fayl hajmi | Ruxsat bilan birga o‘sadi | Rasm murakkabligiga bog‘liq |
| Fotolar | Juda mos | Mos emas |
| Logotip, ikonkalar | Faqat aniq o‘lchamga eksport sifatida | Juda mos |
| Tahrirlash | Piksellarni o‘zgartirish | Shakl, rang, chiziqlarni o‘zgartirish |

## Formatlar va ularni qachon ishlatish

### Rastr formatlar

- **JPG (JPEG)** — yo‘qotishli siqish, shaffoflik yo‘q. Fotolar uchun yaxshi: fayllar kichik, suratlardagi yo‘qotishlar deyarli sezilmaydi. Matn, logotip va aniq chetli grafika uchun yomon — artefaktlar paydo bo‘ladi.
- **PNG** — yo‘qotishsiz siqish, shaffoflikni qo‘llab-quvvatlaydi. Skrinshotlar, interfeys grafikasi va aniq chetlar muhim bo‘lgan tasvirlar uchun mos. Fotolar uchun fayllar JPG’ga qaraganda ancha og‘ir chiqadi.
- **WebP** — veb uchun zamonaviy format: yo‘qotishli va yo‘qotishsiz siqish, shaffoflik va animatsiyani qo‘llab-quvvatlaydi. Odatda o‘xshash sifatda JPG va PNG’dan kichikroq fayl beradi. Zamonaviy brauzerlar uni qo‘llab-quvvatlaydi.

### Vektor va aralash formatlar

- **SVG** — veb uchun vektor format, aslida shakllar ta’rifi yozilgan matnli fayl. Saytdagi logotip va ikonkalar uchun ideal: har qanday ekranda aniq, CSS orqali rang berish va animatsiya qilish mumkin.
- **PDF** — vektor va rastrni ham saqlay oladigan universal hujjat formati. Maketlarni bosmaxonaga topshirish va taqdimotlar uchun standart.
- **AI** — Adobe Illustrator’ning ishchi formati. Bu nashr uchun format emas, **manba fayl**: logotip barcha qatlamlari bilan unda saqlanadi, keyin tahrirlanadi va kerakli formatlarga eksport qilinadi.

## Qaysi formatni tanlash: shpargalka

| Vazifa | Format |
|---|---|
| Saytdagi logotip | SVG |
| Bosma uchun logotip | PDF (vektor) yoki bosmaxona uchun AI/EPS manba |
| Ijtimoiy tarmoq va messenjerlar uchun logotip | Kerakli o‘lchamdagi PNG |
| Interfeysdagi ikonkalar | SVG |
| Saytdagi fotolar | WebP, kerak bo‘lsa zaxira sifatida JPG |
| Matnli skrinshot | PNG yoki yo‘qotishsiz WebP |
| Fotolarni chop etish | Yuqori ruxsatli rastr — talablarni bosmaxonadan aniqlang |
| Brend manbalarini saqlash | AI, SVG, PDF |

## Fayl hajmi va sayt tezligi

Og‘ir rasmlar — sahifalar sekin yuklanishining keng tarqalgan sababi. Nima yordam beradi:

- **rasmni ko‘rsatilganidan kattaroq yuklamang** — 400 pikselli kartochkadagi bir necha ming pikselli foto trafikni behuda sarflaydi;
- **fotolarni siqing** — WebP yoki JPG’da maqbul sifat bilan;
- **logotip va ikonkalar uchun** PNG o‘rniga **SVG ishlating**;
- **SVG’ni optimallashtiring** — muharrirlardan eksport ko‘pincha ortiqcha metama’lumotlarni o‘z ichiga oladi;
- `srcset` va `sizes` atributlari orqali turli ekranlarga turli o‘lchamlarni bering.

```html
<img
  src="photo-800.webp"
  srcset="photo-400.webp 400w, photo-800.webp 800w, photo-1600.webp 1600w"
  sizes="(max-width: 600px) 100vw, 50vw"
  alt="Foto tavsifi"
  loading="lazy"
>
```

## Ko‘p uchraydigan xatolar

- Logotip faqat oq fonli JPG’da — uni rangli fonga qo‘yib bo‘lmaydi.
- Kichik rastr logotipni avtomatik trassirovka orqali vektorga «o‘tkazish» va mukammal natija kutish.
- Fotolarni PNG’da saqlash — fayllar ko‘rinarli foydasiz bir necha barobar og‘irlashadi.
- «Masshtablanuvchanlik» uchun fotoni vektorlashtirish.
- Manba fayllarning yo‘qligi: kompaniyada faqat messenjerdan olingan rasm bor.

## FAQ

### Rastr logotipni vektorga aylantirsa bo‘ladimi?

Bo‘ladi, lekin sifatli natija odatda uni vektor muharririda qo‘lda qayta chizishni talab qiladi. Avtomatik trassirovka oddiy shakllar uchun yaraydi, murakkab detallarda esa ko‘pincha notekis konturlar beradi.

### Sayt uchun nima yaxshi: WebP yoki JPG?

Ko‘p hollarda WebP: o‘xshash sifatda fayl odatda kichikroq. JPG esa juda eski dasturlar bilan moslik kerak bo‘lganda ishonchli universal variant bo‘lib qoladi.

### Dizaynerdan logotipning qaysi fayllarini olish kerak?

Kamida: vektor manba (AI yoki shunga o‘xshash), sayt uchun SVG, bosma uchun PDF va bir necha o‘lchamdagi shaffof fonli PNG. Rangli, qora va oq versiyalarda bo‘lgani ma’qul.
