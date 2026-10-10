---
title: Figma Dev Mode orqali dizaynni dasturchilarga topshirish
description: Figma faylini topshirishga tayyorlash — nomlash, holatlar, chekinishlar, eksport va izohlar — hamda dasturchilar Dev Mode da maketni qanday o‘rganadi.
summary: Yaxshi topshirish Dev Mode dan oldin boshlanadi: qatlam va komponentlarni nomlang, maketni auto layout va o‘zgaruvchilarda yig‘ing, barcha holatlarni chizing, eksport uchun assetlarni belgilang va xatti-harakatni izohlang; shunda dasturchilar tayyor seksiyalarni Dev Mode da ochib, o‘lcham, chekinish, token va izohlarni darhol ko‘radi.
---

## Dev Mode orqali topshirish qanday ishlaydi

**Dev Mode** — Figma ning dasturchilar uchun alohida rejimi. Unda tahrirlash vositalari o‘rniga inspektor paneli bor: o‘lchamlar, chekinishlar, tipografiya, ranglar, kod parchalari va assetlar. Dizayner tayyor qismlarni **Ready for dev** deb belgilaydi, dasturchi ularni ochib, kerakli hamma narsani oladi.

Lekin Dev Mode faqat faylda bor narsani ko‘rsatadi. Agar qatlamlar «Frame 2481» deb nomlangan, chekinishlar tasodifiy va holatlar yo‘q bo‘lsa, dasturchilar baribir qayta so‘rashga majbur bo‘ladi. Shuning uchun yaxshi topshirishning asosiy qismi — **faylni tayyorlash**.

Dev Mode ga kirish Figma tarifi va jamoadagi o‘rin turiga bog‘liq ekanini hisobga oling.

## Faylni tayyorlash: chek-list

### 1. Tuzilma

- Jarayondagi ish, tayyor ekranlar va arxiv uchun alohida sahifalar.
- Bitta ssenariy ekranlari **seksiyalarga** guruhlangan — aynan ularni tayyor deb belgilaysiz.
- Freymlar ekran va holat bo‘yicha nomlangan: `Checkout / Payment / Error`.

### 2. Nomlash

- Muhim qatlamlarda «Rectangle 12» kabi nomlar yo‘q.
- Komponentlar va variant xossalari koddagidek nomlangan:

```text
Button
  variant = primary | secondary | tertiary
  size    = sm | md | lg
  state   = default | hover | focus | disabled | loading
```

Nomlar mos kelsa, dasturchi maketni mavjud komponentlar bilan darhol bog‘laydi.

### 3. Chekinishlar va joylashuv

- **Auto layout** da yig‘ing: shunda padding va gap piksellardagi masofadan taxmin qilinmasdan, aniq qiymat sifatida o‘qiladi.
- **Chekinishlar shkalasidan** foydalaning (masalan, 4, 8, 12, 16, 24, 32) va 13 yoki 27 kabi tasodifiy qiymatlardan qoching.
- Elementlar qanday cho‘zilishi tushunarli bo‘lishi uchun o‘lcham qoidalarini (fill, hug, fixed) belgilang.
- Agar joylashuv mobil va desktop versiyalar orasida o‘zgarsa, asosiy **breakpointlarni** ko‘rsating.

### 4. Tokenlar

Ranglar, tipografiya, burchak radiuslari va chekinishlar uchun **o‘zgaruvchilar va stillardan** foydalaning. Shunda Dev Mode da dasturchi quruq hex emas, `color/text/primary` kabi token nomini ko‘radi va kodda ham shu tokendan foydalana oladi.

### 5. Holatlar

Komponentlar uchun: default, hover, focus, pressed, disabled, loading.
Ekranlar uchun: bo‘sh, yuklanish, xato, muvaffaqiyat, uzun matn, validatsiya xabarlari, ruxsat yo‘q. Yetishmayotgan holatlar — u yoqdan-bu yoqqa savollarning eng ko‘p uchraydigan sababi.

### 6. Eksport

- Ikonkalar, logotiplar va rasmlarni kerakli formatda **eksport qilinadigan** deb belgilang: ikonkalar va vektor grafika uchun SVG, fotosuratlar uchun kerakli masshtablarda rastr formatlar.
- Eksport qilinadigan qatlamlarga tushunarli nom bering — ular fayl nomlariga aylanadi.
- Yashirin va ishlatilmaydigan qatlamlarni eksport guruhlaridan olib tashlang.

### 7. Izohlar (annotatsiyalar)

Statik freymda ko‘rinmaydigan narsalarni yozib qo‘ying:

- o‘zaro ta’sirlar va o‘tishlar;
- animatsiyalar davomiyligi va egri chiziqlari;
- validatsiya qoidalari va cheklovlar (maksimal uzunlik, ruxsat etilgan formatlar);
- foydalanish imkoniyati: fokus tartibi, ikonka-tugmalar uchun yozuvlar, alt-matnlar;
- chekka holatlar: juda uzun nom yoki nol element bo‘lsa nima bo‘ladi.

Dev Mode elementlarga biriktirilgan izoh va o‘lchovlarni qo‘llab-quvvatlaydi, shuning uchun eslatmalar o‘zi tasvirlagan narsa yonida qoladi.

## Dasturchilar Dev Mode da qanday ishlaydi

1. **Faylni ochib, Dev Mode ga o‘tadi**, so‘ng Ready for dev holatidagi seksiyalarni filtrlaydi.
2. **Elementni tanlaydi** — inspektor paneli o‘lcham, padding, gap, tipografiya va token nomlari bilan ranglarni ko‘rsatadi.
3. Bitta element tanlangan holda kursorni qo‘shni elementlarga olib borib, **masofalarni o‘lchaydi**.
4. **Kod parchalarini** ma’lumotnoma sifatida o‘qiydi. Ular qiymatlarni ko‘rsatadi, lekin haqiqiy kod tuzilmasi sizning komponentlaringiz va kelishuvlaringizga mos bo‘lishi kerak — ularni ko‘r-ko‘rona nusxalamang.
5. Paneldagi eksport bo‘limidan **assetlarni yuklab oladi**.
6. **Izohlar** va sharhlar oqimini o‘qiydi.
7. Seksiya «tayyor» deb belgilangandan keyin nima tahrirlanganini ko‘rish uchun **o‘zgarishlarni solishtirishdan** foydalanadi.

## Ko‘p uchraydigan xatolar

- Seksiya tayyor deb belgilangan, keyin esa jimgina o‘zgartirilgan.
- Kutubxonaga endi mos kelmaydigan, uzib qo‘yilgan komponent nusxalari.
- Chekinishlar shkalasidan tashqaridagi qiymatlar va palitradan tashqaridagi hex ranglar.
- Faqat «baxtli yo‘l» chizilgan, xatolar va bo‘sh holatlarsiz.
- Ekranning bir nechta eskirgan versiyasi belgisiz yonma-yon turibdi.

## FAQ

### Dev Mode yaratgan kodni nusxalash mumkinmi?

Uni production kod sifatida emas, qiymatlar bo‘yicha ma’lumotnoma sifatida ishlating. Yaratilgan parchalar komponentlaringiz tuzilmasi, nomlash va freymvork kelishuvlarini bilmaydi. Foydali qismi — tokenlar va aniq raqamlar.

### Dizaynni Dev Mode siz topshirish mumkinmi?

Ha. Auto layout, o‘zgaruvchilar, holatlar va izohlarga ega yaxshi tuzilgan fayl hamda qisqa matnli texnik topshiriq avvalgidek ishlaydi. Dev Mode esa ko‘zdan kechirishni tezlashtiradi va eslatmalar hamda holatlarni bir joyda saqlaydi.

### Seksiyalarni Ready for dev deb kim belgilashi kerak?

Ko‘rib chiqishdan keyin ekran uchun mas’ul dizayner. Jamoada «tayyor» degani «barqaror» ekanini kelishib oling: keyingi har qanday o‘zgarish haqida xabar berish kerak, o‘zgarishlarni solishtirish esa dasturchilarga aynan nima siljiganini tekshirishga yordam beradi.
