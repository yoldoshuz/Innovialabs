---
title: Rasmlar uchun SEO: alt, fayl nomlari, formatlar va siqish
description: Alt matnini yozish, fayllarni nomlash, WebP va AVIF tanlash, moslashuvchan rasmlar va lazy loading — rasmlar saytni tezlashtirishi va trafik keltirishi uchun.
summary: Optimallashtirilgan rasm — bu tushunarli alt, ma’noli fayl nomi, zamonaviy format, ekranga mos o‘lcham va birinchi ekrandan pastdagi hamma narsa uchun dangasa yuklash.
---
## Avvalo nima muhim

Rasmlar SEO’ga ikki yo‘l bilan ta’sir qiladi. Birinchisi — **tushunish**: qidiruv tizimi rasmni inson kabi «ko‘rmaydi» va alt, fayl nomi hamda atrofdagi matnga tayanadi. Ikkinchisi — **tezlik**: og‘ir rasmlar ko‘pincha sekin yuklanish va Core Web Vitals, ayniqsa LCP ko‘rsatkichlari yomonligining asosiy sababi bo‘ladi.

Minimal to‘plam: ma’noli **alt**, tushunarli **fayl nomi**, **WebP yoki AVIF** formati, **ekranga mos o‘lchamlar** va birinchi ekrandan pastdagi rasmlar uchun **lazy loading**.

## Alt’ni qanday yozish kerak

Alt — skrinriderlar va qidiruv tizimlari uchun rasmning matnli o‘rinbosari. Rasmni ko‘ra olmaydigan odamga nima degan bo‘lsangiz, shuni yozing.

| Yomon | Yaxshi |
|---|---|
| `alt="image1"` | `alt="Kuryer buyurtmani podyezd oldida xaridorga topshirmoqda"` |
| `alt="divan sotib olish arzon divan divan"` | `alt="Yog‘och oyoqli kulrang uch o‘rinli divan"` |
| alt yo‘q | Faqat bezak elementlari uchun `alt=""` |

- **Aniq va qisqa:** odatda bitta gap yetarli.
- **Kalit so‘z — faqat u rasmni tabiiy tasvirlasa.**
- **«Rasm…» deb boshlamang** — skrinrider bu rasm ekanini o‘zi aytadi.
- **Bezak rasmlariga** bo‘sh `alt=""` bering, shunda ular o‘tkazib yuboriladi.

## Fayl nomlari

- `IMG_4821.jpg` hech narsa demaydi. `kulrang-uch-orinli-divan.webp` esa aytadi.
- Lotin harflari, kichik harflar va bo‘shliq o‘rniga defisdan foydalaning.
- Allaqachon indeksatsiya qilingan rasmlar nomini zaruratsiz o‘zgartirmang.

## Formatlar

| Format | Qachon ishlatish kerak |
|---|---|
| **AVIF** | Minimal hajm muhim bo‘lganda fotosuratlar va murakkab rasmlar |
| **WebP** | Keng qo‘llab-quvvatlanadigan universal tanlov |
| **JPEG** | Fotosuratlar uchun zaxira variant |
| **PNG** | WebP mos kelmasa, skrinshotlar va shaffof grafika |
| **SVG** | Logotiplar, ikonkalar, oddiy vektor grafika |

Zamonaviy formatni `<picture>` orqali zaxira varianti bilan bering:

```html
<picture>
  <source srcset="/img/sofa.avif" type="image/avif" />
  <source srcset="/img/sofa.webp" type="image/webp" />
  <img src="/img/sofa.jpg" alt="Kulrang uch o‘rinli divan" width="1200" height="800" />
</picture>
```

## O‘lcham va moslashuvchanlik

Asosiy xato — 400 pikselli blokda ko‘rsatish uchun eni bir necha ming pikselli rasmni yuklash. Brauzer mos faylni o‘zi tanlashi uchun `srcset` va `sizes`dan foydalaning:

```html
<img
  src="/img/sofa-800.webp"
  srcset="/img/sofa-400.webp 400w, /img/sofa-800.webp 800w, /img/sofa-1600.webp 1600w"
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Kulrang uch o‘rinli divan"
  width="800" height="533" />
```

- Har doim **width va height** ko‘rsating — bu sahifa joylashuvi siljishidan (CLS) himoya qiladi.
- Fayllarni nashrdan oldin siqing; sifatni natijalarni solishtirib, ko‘z bilan tanlang.

## Lazy loading va birinchi ekran

- Birinchi ekrandan pastdagi rasmlarga `loading="lazy"` qo‘shing.
- **Birinchi ekrandagi asosiy rasmni dangasa yuklamang** — bu LCP’ni sekinlashtiradi. Aksincha, unga `fetchpriority="high"` berish mumkin.
- Ko‘plab freymvorklar, masalan `Image` komponentli Next.js, bu ishning bir qismini o‘z zimmasiga oladi, lekin alt va ustuvorliklarni baribir siz belgilaysiz.

## Rasmlar bo‘yicha qidiruvdan trafik

- Rasmni tegishli matn va izoh yoniga joylashtiring.
- **Noyob rasmlardan** foydalaning: tovarlarning o‘z fotosuratlari va sxemalar stok rasmlardan qimmatliroq.
- Muhim rasmlarni sitemap’ga qo‘shing yoki ular skanerlash uchun ochiq va robots.txt’da yopilmaganiga ishonch hosil qiling.
- Rasmni tovar yoki maqolaning tuzilgan ma’lumotlarida ko‘rsating.

## Ko‘p uchraydigan xatolar

- Rasmlar faqat skript orqali yuklanadi va robot ularni topa olmaydi.
- Matn HTML o‘rniga rasmga «tikib» qo‘yilgan.
- Sahifadagi barcha rasmlarda bir xil alt.
- Hero-rasmda lazy loading.

## FAQ

### Har bir rasmga alt kerakmi?

Atribut har doim kerak, lekin mazmun faqat axborot beruvchi rasmlarda. Bezak rasmlari uchun skrinriderlar ularni o‘tkazib yuborishi uchun `alt=""` qoldiring.

### Qaysi biri yaxshiroq: WebP yoki AVIF?

AVIF odatda bir xil sifatda kichikroq hajm beradi, WebP esa tezroq kodlanadi va kengroq qo‘llab-quvvatlanadi. Ishonchli variant — ikkalasini ham `<picture>` orqali zaxira JPEG bilan berish.

### Rasm ostidagi izoh SEO’ga ta’sir qiladimi?

Izoh va atrofdagi matn qidiruv tizimiga rasm kontekstini tushunishga yordam beradi. Bu odamlar uchun ham foydali, shuning uchun muhim illyustratsiyalarga izoh yozing.
