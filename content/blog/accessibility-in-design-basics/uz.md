---
title: Dizayndagi foydalanish qulayligi: har bir dizayner uchun asoslar
description: WCAG dizayner nigohida: matn kontrasti, shrift o‘lchami, fokus holatlari, faqat rangga tayanmaslik, muqobil matn va maketda o‘qilishi qulay joylashuv.
summary: Qulay (accessible) dizayn — ko‘rishi zaif, ranglarni ajratishda qiynaladigan, sichqonchasiz yoki skrinrider bilan ishlaydigan odamlar ham foydalana oladigan interfeys. Dizayner uchun asos: yetarli kontrast, o‘qiladigan matn, ko‘rinadigan fokus, faqat rangda emas ma’no, alt-matnlar va tushunarli tuzilma.
---

## Accessibility nima va dizaynerning bunga aloqasi

**Accessibility (a11y)** — interfeysning turli imkoniyatlarga ega odamlar foydalana olishi xususiyati: ko‘rishi zaif, rang idroki buzilgan, harakat cheklangan, skrinrider yoki faqat klaviatura bilan ishlaydiganlar. Bunga yorqin quyosh ostida telefondan foydalanayotgan yoki bir qo‘li band odam ham kiradi.

Asosiy standart — W3C’ning **WCAG** (Web Content Accessibility Guidelines) hujjati. Unda uchta daraja bor: A, AA va AAA. Ko‘pchilik mahsulotlar uchun mo‘ljal — **AA**. Ko‘p talablar maketdayoq belgilanadi, keyin kodda tuzatish qimmatroq. Standartning to‘liq matni [W3C WAI](https://www.w3.org/WAI/standards-guidelines/wcag/) saytida.

## Kontrast

Maketlarda eng ko‘p uchraydigan muammo: oq fondagi och kulrang matn nafis ko‘rinadi, lekin yomon o‘qiladi.

| Nimani tekshiramiz | WCAG AA bo‘yicha minimum |
|---|---|
| Oddiy matn | **4.5:1** |
| Yirik matn (24px dan oddiy yoki 18.66px dan qalin) | **3:1** |
| Ikonkalar, maydon chegaralari, boshqaruv elementlari | Qo‘shni rangga nisbatan **3:1** |

Amalda:

- Kontrastni ish jarayonida Figma plaginida yoki istalgan onlayn kalkulyatorda tekshiring.
- Maydondagi pleysxolder ham matn: u ko‘pincha tekshiruvdan o‘tmaydi.
- Fotosurat ustidagi matnni qoraytiruvchi qatlam ustiga qo‘ying.
- Yorug‘ va qorong‘i mavzuni ham tekshiring.

## Matn o‘lchami va o‘qilishi

- Vebda asosiy matnni mayda qilmang: **16px** — keng tarqalgan va oqilona boshlang‘ich nuqta.
- Abzatslar uchun qatorlar oralig‘i shrift o‘lchamining taxminan **1.4-1.6** baravari.
- Ko‘z keyingi qatorga o‘tishda adashmasligi uchun qator kengligini cheklang.
- KATTA HARFLARDAGI uzun abzatslardan va kenglik bo‘yicha tekislashdan qoching — u bo‘shliq «daryolari»ni hosil qiladi.
- Maket **matnni 200% gacha kattalashtirishga** bardosh berishi kerak: matnli bloklar balandligini qotirib qo‘ymang.

## Fokus holatlari

Klaviaturadan foydalanadigan odamlar sahifada Tab tugmasi bilan harakatlanadi. Ular qayerda turganini ko‘rishi kerak.

- Har bir interaktiv element uchun **focus holatini** chizing: tugmalar, havolalar, maydonlar, chekbokslar, kartochkalar.
- Fokus sezilarli bo‘lsin: elementdan biroz uzoqlashtirilgan kontrast rangli chegara fonning yengil o‘zgarishidan yaxshiroq ishlaydi.
- Hech qachon dasturchilardan muqobil taklif qilmay turib «bu ko‘k ramkani olib tashlang» deb so‘ramang.
- **Fokus tartibini** o‘ylab chiqing: u vizual o‘qish tartibiga mos kelishi kerak.

## Faqat rang bilan emas

Rang idrokining buzilishi ko‘p uchraydi, ayniqsa erkaklarda, yorqin ekran yoki yomon yorug‘likda esa ranglarni har kim adashtirishi mumkin. Shuning uchun ma’noni faqat rang bilan berib bo‘lmaydi.

- **Maydondagi xato:** faqat qizil chegara emas, balki ikonka va «Email kiriting» matni ham.
- **Grafiklar:** chiziqlar rangdan tashqari markerlar, shtrixlash yoki yozuvlar bilan farqlanadi.
- **Matndagi havolalar:** tagiga chizish yoki rangdan boshqa aniq belgi.
- **Statuslar:** «To‘langan» va «Xato» — faqat yashil va qizil nuqta emas, matn yoki ikonka bilan.

Tezkor tekshiruv: maketni kulrang tuslarga o‘tkazing. Barcha muhim narsalar tushunarli qolishi kerak.

## Muqobil matn

Skrinrider rasm o‘rniga **alt-matnni** o‘qiydi. Rasm ekranda nima uchun turganini dizayner biladi, shuning uchun uni eng yaxshi u yoza oladi.

- Ma’lumot beruvchi rasm: tashqi ko‘rinishni emas, ma’noni tasvirlang. «Grafik» emas, «Ikkinchi chorakda sotuvlar o‘sdi».
- Dekorativ rasm: spetsifikatsiyada dekorativ deb belgilang, unga bo‘sh alt kerak.
- Yozuvsiz ikonka-tugma: matnli belgi kerak, masalan «Yopish».

## Tushunarli tuzilma

- Aniq **sarlavhalar iyerarxiyasi**: bitta asosiy sarlavha, keyin darajalar tartib bilan.
- Maydon nomlari **maydon ustida**, kiritishda yo‘qoladigan pleysxolderning o‘zi emas.
- **Bosish zonalari o‘lchami**: WCAG 2.2 AA darajasida kamida 24×24 CSS-piksel, mobil uchun esa kattaroq bo‘lgani yaxshi.
- Tushunarli matnli havola va tugmalar: «Batafsil» emas, «Tariflar haqida batafsil».

## FAQ

### Accessibility faqat foydalanuvchilar orasida nogironligi bor odamlar bo‘lsa kerakmi?

Yo‘q. Kontrast, yirik matn va tushunarli xatolar hammaga yordam beradi: keksalarga, ko‘chada telefondan o‘qiyotganlarga va shoshayotganlarga. Imkoniyati cheklangan odamlar esa deyarli har qanday auditoriyada bor, shunchaki ular doim ko‘zga tashlanmaydi.

### Mahsulot allaqachon tayyor bo‘lsa, nimadan boshlash kerak?

Eng ommaviy muammolardan: matn kontrastini, fokus ko‘rinishini va formalardagi xato xabarlarini tekshiring. Bu kam xarajat bilan sezilarli natija beradi.

### Qulay dizayn interfeysni zerikarli qilib qo‘ymaydimi?

Yo‘q. Cheklovlar uslubga emas, kontrast va tuzilmaga tegishli. Yetarli kontrastli tuslar tanlansa, yorqin palitra va ifodali tipografika WCAG bilan bemalol mos keladi.
