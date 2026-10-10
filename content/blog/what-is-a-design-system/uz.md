---
title: Dizayn-tizim nima va u mahsulotga nima uchun kerak
description: Dizayn-tizim tokenlar, komponentlar, qoidalar va hujjatlarni dizayn va kodda birlashtiradi. UI-kitdan farqi va jamoaga qachon kerak bo‘lishi haqida.
summary: Dizayn-tizim — umumiy dizayn qarorlari to‘plami: tokenlar, maket va koddagi qayta ishlatiladigan komponentlar, qo‘llash qoidalari va hujjatlar. U bir xil interfeyslarni tezroq yig‘ishga yordam beradi va interfeys ustida bir necha kishi yoki mahsulot ishlaganda o‘zini oqlaydi.
---
## Qisqa javob

**Dizayn-tizim** — mahsulot interfeysi qanday qurilishi haqidagi yagona haqiqat manbai. Unga bazaviy qiymatlar (ranglar, bo‘shliqlar, shriftlar), ulardan yig‘ilgan tayyor komponentlar (tugmalar, maydonlar, kartochkalar), ulardan foydalanish qoidalari va hujjatlar kiradi. Muhimi, u **ham dizayn vositasida, ham kodda** yashaydi va ikkala tomon sinxron saqlanadi.

Usiz har bir dizayner va dasturchi mayda qarorlarni o‘zi qabul qiladi va bir yildan keyin mahsulotda o‘nlab kulrang tuslari hamda bir-biridan biroz farq qiladigan bir necha tugma paydo bo‘ladi.

## Dizayn-tizim nimalardan iborat

**1. Dizayn-tokenlar.** Bazaviy qarorlar saqlanadigan nomlangan qiymatlar: `color-primary`, `space-4`, `radius-md`, `font-size-body`. Tokenlar platformaga bog‘lanmagan, shuning uchun bir xil qiymatlarni CSS, iOS va Android’ga berish mumkin.

```css
:root {
  --color-primary: #7c3aed;
  --color-text: #1a1033;
  --space-4: 16px;
  --radius-md: 8px;
}
```

Yaxshi tizimlarda ikki qatlam bo‘ladi: **bazaviy tokenlar** (`violet-600`) va ularga havola qiluvchi **semantik tokenlar** (`color-action-primary`). Shunda mavzuni almashtirish — barcha komponentlarni qidirish emas, balki semantik tokenlarni qayta bog‘lash.

**2. Komponentlar.** Tokenlardan yig‘ilgan qayta ishlatiladigan interfeys qismlari: tugmalar, maydonlar, chekbokslar, modal oynalar, jadvallar, navigatsiya. Har bir komponentning variantlari (asosiy, ikkinchi darajali), o‘lchamlari va holatlari (hover, focus, disabled, error, loading) bor.

**3. Qoidalar (gaydlaynlar).** Qachon modal oyna, qachon alohida sahifa ishlatish, ekranda nechta asosiy tugma bo‘lishi mumkin, xato matnlarini qanday yozish, foydalanish imkoniyati talablari — kontrast, ko‘rinadigan fokus.

**4. Hujjatlar.** Bularning barchasi misollar, «mumkin / mumkin emas» holatlari va kod parchalari bilan tasvirlangan joy. Hujjatlarsiz tizim faqat mualliflarning boshida mavjud bo‘ladi.

**5. Jarayon va mas’uliyat.** Yangi komponentlarni kim qo‘shadi, o‘zgarishlar qanday taklif qilinadi va versiyalanadi, jamoalar yangilanishlar haqida qanday biladi. Bu qism ko‘zga tashlanmaydi, lekin tizim yashab qolishini aynan u hal qiladi.

## Dizayn-tizim, UI-kit va stayl-gayd

| | Stayl-gayd | UI-kit | Dizayn-tizim |
|---|---|---|---|
| Bu nima | Vizual qoidalar: ranglar, shriftlar, logotipdan foydalanish | Dizayn faylidagi tayyor interfeys elementlari to‘plami | Tokenlar, dizayn va koddagi komponentlar, qoidalar, hujjatlar, jarayon |
| Qayerda yashaydi | Hujjat yoki PDF | Dizayn vositasi | Dizayn vositasi, repozitoriy, hujjatlar sayti |
| Qaysi savolga javob beradi | «Brendimiz qanday ko‘rinadi?» | «Maketga qaysi elementlarni olish mumkin?» | «Istalgan ekranni qanday bir xil yig‘ish kerak?» |
| Kim qo‘llab-quvvatlaydi | Kamdan-kam yangilanadi | Dizaynerlar | Dizaynerlar va dasturchilar birgalikda |

UI-kit va stayl-gayd dizayn-tizimning muqobili emas, balki uning **qismlari**.

## Jamoaga u qachon haqiqatan kerak

Vaqt kelganining belgilari:

- Bitta mahsulot ustida bir necha dizayner yoki frontend dasturchi ishlaydi.
- Bir-biriga yaqin his qilinishi kerak bo‘lgan bir nechta mahsulot yoki platforma (veb, mobil ilova, admin panel) bor.
- Bitta komponent turli joylarda turlicha amalga oshirilgan.
- Oddiy ekranlar uzoq tayyorlanadi, chunki har bir element noldan chiziladi.
- Rebrending yoki qorong‘i mavzu rejalashtirilgan.

Qachon erta:

- Bitta dizayner va bitta dasturchi MVP qilmoqda. Kichik UI-kit va tokenlar fayli yetarli.
- Mahsulot yo‘nalishi har bir necha haftada o‘zgarmoqda. Barqaror bo‘lmagan patternlarni standartlashtirish noto‘g‘rilarini mustahkamlash demakdir.

## Qanday boshlash va oshirib yubormaslik

1. Mavjud ekranlarni **audit qiling**: haqiqatan ishlatilayotgan barcha tugmalar, ranglar, shriftlar va bo‘shliqlarni yig‘ing.
2. Rang, tipografika, bo‘shliqlar, burchak radiuslari va soyalar uchun **tokenlarni belgilang**.
3. **Eng ko‘p ishlatiladigan komponentlarni yarating**: tugma, kiritish maydoni, ochiladigan ro‘yxat, kartochka, modal oyna.
4. Ularni dizayn faylidagi nomlar bilan **kodda takrorlang**.
5. Har bir komponentga **qisqa hujjat yozing**: vazifasi, variantlari, holatlari, «mumkin / mumkin emas» misollari.
6. **Ehtiyojga qarab o‘sing**: komponentlarni «har ehtimolga qarshi» emas, haqiqiy ekranlarga kerak bo‘lganda qo‘shing.

## Ko‘p uchraydigan xatolar

- Mahsulot ekranlari paydo bo‘lishidan oldin ulkan kutubxona qurish.
- Komponentlarni faqat dizayn vositasida saqlash, kod esa maketlardan uzoqlashib ketadi.
- Tokenlarni vazifasi bo‘yicha emas, tashqi ko‘rinishi bo‘yicha nomlash (`purple-button`).
- Mas’ul tayinlamaslik — tizim asta-sekin eskiradi.

## FAQ

### Dizayn-tizimni noldan qurish shartmi?

Shart emas. Ko‘p jamoalar tayyor ochiq komponentlar kutubxonasini olib, tokenlar va komponentlarni o‘z brendiga moslashtiradi. Bu vaqtni tejaydi, lekin o‘z qoidalaringiz va hujjatlaringiz baribir kerak.

### Dizayn-tizim brendbukdan nimasi bilan farq qiladi?

Brendbuk brendni to‘liq tasvirlaydi: logotip, ranglar, muloqot ohangi, bosma va reklamada qo‘llanilishi. Dizayn-tizim raqamli interfeyslarga qaratilgan va koddagi ishlaydigan komponentlarni o‘z ichiga oladi.

### Dizayn-tizim uchun kim javob beradi?

Odatda dizaynerlar va frontend dasturchilardan iborat kichik guruh — alohida jamoa yoki ajratilgan vaqtga ega odamlar. Asosiysi, mas’uliyat aniq bo‘lishi va o‘zgarishlar kelishilgan jarayon orqali o‘tishi.
