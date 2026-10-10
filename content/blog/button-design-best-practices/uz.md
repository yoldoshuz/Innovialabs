---
title: Interfeysda tugmalar dizayni: o‘lchamlar, holatlar va matnlar
description: Tugmalarni loyihalash: asosiy va ikkinchi darajali amallar ierarxiyasi, barcha interaktiv holatlar, qulay o‘lchamlar va natijani tushuntiruvchi matnlar.
summary: Yaxshi tugma o‘z ahamiyatini ierarxiya orqali ko‘rsatadi, har bir holatda (hover, fokus, bosish, faol emas, yuklanish) sezilarli javob beradi, bosish uchun yetarlicha katta va natijani bildiruvchi fe’l bilan yozilgan bo‘ladi.
---

## Yaxshi tugma nimalardan iborat

Tugmaning bitta vazifasi bor: amal mavjudligini ko‘rsatish va bosilgandan keyin nima bo‘lishini tushuntirish. Buning uchun to‘rtta narsa kerak:

- **Ierarxiya** — eng muhim amal ajralib turadi, qolganlari orqa planga o‘tadi.
- **Holatlar** — tugma kursor olib kelinganda, klaviatura fokusida, bosilganda va kutishda sezilarli o‘zgaradi.
- **O‘lcham** — sichqoncha yoki barmoq bilan tushish oson.
- **Matn** — natijani nomlovchi qisqa fe’lli ibora.

Bularning birortasi yetishmasa, foydalanuvchi ikkilanadi, noto‘g‘ri tugmani bosadi yoki ikki marta bosadi.

## Ierarxiya: asosiy, ikkinchi va uchinchi darajali

| Daraja | Ko‘rinishi | Qachon ishlatiladi |
|---|---|---|
| **Primary** | Brend rangida to‘ldirilgan, eng yuqori kontrast | Ekrandagi asosiy amal: «To‘lash», «Loyiha yaratish» |
| **Secondary** | Chegara chizig‘i yoki och fon | Muqobil amallar: «Qoralamani saqlash», «Oldindan ko‘rish» |
| **Tertiary** | Faqat matn, konteynersiz | Past ustuvorlikdagi amallar: «O‘tkazib yuborish», «Batafsil» |
| **Destructive** | Qizil yoki boshqa ogohlantiruvchi rang | O‘chirish va qaytarib bo‘lmaydigan amallar |

Ierarxiyani tushunarli saqlaydigan qoidalar:

- **Har bir ekran yoki blokda bitta asosiy tugma.** Hammasi asosiy bo‘lsa, hech biri asosiy emas.
- **Doimiy tartib.** Dialoglarda asosiy amal qayerda turishini tanlang va butun mahsulotda takrorlang. Native ilovalarda platforma qoidalariga amal qiling.
- **«Bekor qilish» «O‘chirish» bilan bir xil vaznga ega bo‘lmasin.** Xavfsiz variant xavfli variantga o‘xshamasligi kerak, qaytarib bo‘lmaydigan amallar uchun esa tasdiqlash yoki ortga qaytarish kerak.

## Har bir tugmaga kerak bo‘lgan holatlar

| Holat | Nima o‘zgaradi | Nimaga e’tibor berish kerak |
|---|---|---|
| **Default** | Asosiy uslub | — |
| **Hover** | Fon biroz to‘qroq yoki ochroq | Faqat desktop uchun: sensorli ekranda hover yo‘q |
| **Focus** | Yaqqol ko‘rinadigan chegara | Outline ni o‘rniga hech narsa qo‘ymasdan olib tashlamang |
| **Pressed** | To‘qroq tus yoki biroz kichrayish | Bosilganini darhol tasdiqlaydi |
| **Disabled** | Pasaytirilgan kontrast | Foydalanuvchi sababini tushunishi kerak |
| **Loading** | Spinner, «Saqlanmoqda…» kabi matn | Kenglikni o‘zgartirmang va qayta bosishni bloklang |

Izohsiz kulrang **faol bo‘lmagan** tugma asabga tegadi: nima yetishmayotgani noma’lum. Ko‘pincha tugmani faol qoldirib, bosilgandan keyin validatsiya xatolarini ko‘rsatish yoki yoniga qisqa izoh qo‘yish yaxshiroq.

Fokus va yuklanish uchun minimal CSS asosi:

```css
.btn:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.btn[aria-busy="true"] {
  pointer-events: none;
  opacity: 0.8;
}
```

## O‘lchamlar

- **Bosish zonalari.** Apple kamida 44×44 pt, Material Design esa 48×48 dp tavsiya qiladi. Ko‘rinadigan tugma kichikroq bo‘lishi mumkin, agar bosish maydoni uning atrofida kengaytirilgan bo‘lsa.
- **O‘lchamlar shkalasi.** Dizayn tizimida ikki-uchta o‘lcham (small, medium, large) belgilang va har bir ekran uchun yangi balandlik o‘ylab topmasdan faqat ularni ishlating.
- **Ichki chekinishlar.** Gorizontal chekinish vertikaldan katta, matn chetlarga yopishmaydi.
- **Tugmalar orasidagi masofa.** Barmoq qo‘shni tugmaga tegmasligi uchun yetarli bo‘lsin.
- **Kenglik.** To‘liq kenglikdagi tugma mobil formadagi asosiy amal uchun yaxshi ishlaydi. Keng desktop ekranda uni butun maket bo‘ylab cho‘zmang.

## Matnlarni qanday yozish kerak

- **Fe’l bilan boshlang:** «Hisobni yuborish», shunchaki «Hisob» emas.
- **Mexanikani emas, natijani nomlang:** «Hisobotni yuklab olish» «Yuborish» yoki «OK» dan tushunarliroq.
- **Dialoglarda aniq bo‘ling:** «Ha» va «Yo‘q» o‘rniga «Loyihani o‘chirish» va «Loyihani qoldirish».
- **Qisqa yozing:** odatda bir-uch so‘z.
- **Keyingi qadam bilan mos kelsin:** tugmada «To‘lovga o‘tish» yozilgan bo‘lsa, keyingi ekran to‘lov bo‘lishi kerak.
- **Bitta registr uslubi.** Oddiy registr KATTA HARFLARDAN osonroq o‘qiladi.
- **Ikonka-tugmalarga nom kerak.** Qulay imzo (`aria-label`) va iloji bo‘lsa tooltip qo‘shing.

## Ko‘p uchraydigan xatolar

- Bitta ekranda bir nechta asosiy tugma raqobatlashadi.
- Havolalar tugma kabi bezatilgan va aksincha. **Tugma amalni bajaradi**, **havola esa** boshqa sahifaga olib boradi.
- Fokus chegarasi «chiroyli emas» deb olib tashlangan.
- Chegarasi shunchalik xira «arvoh» tugmalar, ular ko‘rinmay qoladi. WCAG boshqaruv elementining vizual chegaralari uchun kamida 3:1, oddiy matn uchun 4,5:1 kontrast talab qiladi.
- Spinner paydo bo‘lganda tugma kengligi o‘zgaradi va maket sakraydi.
- Amal oqibatlarini yashiradigan umumiy matnlar.

## FAQ

### Formalarda tugmani faol bo‘lmagan holatga keltirish kerakmi?

Ehtiyotkorlik bilan. Faol bo‘lmagan tugma bloklash sababini yashiradi. Qisqa formalarda uni faol qoldirib, bosilgandan keyin nimani tuzatish kerakligini ajratib ko‘rsatish odatda yaxshiroq. Agar baribir bloklasangiz, nima yetishmayotgani haqida izoh bering.

### Tugma havoladan nimasi bilan farq qiladi?

Tugma joriy sahifada amalni ishga tushiradi: saqlaydi, yuboradi, dialogni ochadi. Havola esa boshqa sahifa yoki manzilga o‘tkazadi. To‘g‘ri element klaviatura va ekran o‘quvchi dasturlar foydalanuvchilari uchun muhim, hatto tashqi ko‘rinishi o‘xshash bo‘lsa ham.

### Dizayn tizimiga nechta tugma o‘lchami kerak?

Ko‘pchilik mahsulotlarga ikki-uchta o‘lcham yetadi. Variantlar ko‘payishi interfeysni nomuvofiq qiladi va qo‘llab-quvvatlashni qiyinlashtiradi, shuning uchun yangi o‘lchamni faqat mavjudlari aniq mos kelmaganda qo‘shing.
