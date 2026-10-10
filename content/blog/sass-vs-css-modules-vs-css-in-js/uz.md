---
title: Sass, CSS Modules yoki CSS-in-JS: ilovaga qanday stil berish
description: Sass, CSS Modules va CSS-in-JS’ni izolyatsiya, unumdorlik, qulaylik va SSR bilan moslik bo‘yicha taqqoslaymiz va loyiha turiga qarab tanlov matritsasi.
summary: Sass — CSS’ni qulay yozish uchun preprotsessor, CSS Modules klasslarni fayl darajasida izolyatsiya qiladi, CSS-in-JS esa stillarni JavaScript’da yozadi. SSR’li aksariyat React ilovalari uchun ishonchli tanlov — CSS Modules (Sass bilan ham bo‘ladi) yoki runtime’siz CSS-in-JS.
---
## Har bir yondashuv qisqacha

- **Sass (SCSS)** — preprotsessor. O‘zgaruvchilar, ichma-ichlik, miksinlar va funksiyalar qo‘shadi, natijada oddiy CSS hosil bo‘ladi. O‘zi stillarni **izolyatsiya qilmaydi**: klasslar global bo‘lib qoladi.
- **CSS Modules** — oddiy `.css` yoki `.scss` fayllar, ularda yig‘uvchi klass nomlarini noyob qiladi. Stillar **fayl darajasida izolyatsiya qilinadi**, natija esa statik CSS.
- **CSS-in-JS** — stillar JavaScript’da komponent yonida yoziladi. Ikki yo‘nalish bor: **runtime** (stillar render paytida brauzerda yaratiladi) va **zero-runtime** (stillar yig‘ish paytida CSS fayllarga chiqariladi).

Bu yondashuvlarni birlashtirish mumkin: Sass ko‘pincha CSS Modules ichida ishlatiladi.

## Asosiy mezonlar bo‘yicha taqqoslash

| Mezon | Sass (global) | CSS Modules | Runtime CSS-in-JS | Zero-runtime CSS-in-JS |
|---|---|---|---|---|
| Izolyatsiya | qo‘lda, BEM orqali | avtomatik | avtomatik | avtomatik |
| Brauzerda | faqat CSS | faqat CSS | JS stillarni yaratadi | faqat CSS |
| Props’ga bog‘liq stillar | klasslar va CSS o‘zgaruvchilari orqali | klasslar va CSS o‘zgaruvchilari orqali | to‘g‘ridan-to‘g‘ri | cheklangan, o‘zgaruvchilar orqali |
| SSR va server komponentlari | muammosiz | muammosiz | sozlash kerak, cheklovlar bor | odatda muammosiz |
| Tiplashtirish | yo‘q | generatsiya qilish mumkin | bor | bor |
| Kirish chegarasi | past | past | o‘rta | o‘rta |

## Stillar izolyatsiyasi

Katta CSS’ning asosiy muammosi — **nomlar to‘qnashuvi**: bir komponentdagi `.title` klassi boshqasini buzadi. Yechimlar:

- **Sass + BEM metodologiyasi**: `.card__title--active` kabi nomlash kelishuvi. Ishlaydi, lekin jamoa intizomiga tayanadi.
- **CSS Modules**: `styles.title` avtomatik ravishda noyob nomga aylanadi. Kelishuvlarsiz to‘qnashuvlar istisno qilinadi.
- **CSS-in-JS**: stillar komponentga bog‘langan, global qoidalar alohida aniq yoziladi.

## Unumdorlik

- **Statik CSS** (Sass, CSS Modules, zero-runtime) brauzer tomonidan JS’dan alohida yuklanadi va keshlanadi, render paytida hisob-kitob talab qilmaydi.
- **Runtime CSS-in-JS** JS-bandl hajmini oshiradi va har bir renderda ish bajaradi: stillarni seriyalaydi va hujjatga qo‘shadi. Oddiy sahifalarda bu sezilmaydi, tez-tez qayta chiziladigan murakkab interfeyslarda sezilishi mumkin.

Yuklanish tezligi va Core Web Vitals muhim bo‘lsa, **tayyor CSS** beradigan yondashuvlarni afzal ko‘ring.

## SSR va server komponentlari

Server rendering va server komponentlari bor zamonaviy React framework’larida runtime CSS-in-JS stillarni serverda yig‘ish uchun qo‘shimcha sozlashni talab qiladi, server komponentlarida esa bunday kutubxonalar odatda ishlamaydi. Tanlashdan oldin framework va kutubxona hujjatlarini tekshiring. CSS Modules va Sass’ni aksariyat framework’lar tayyor holda qo‘llab-quvvatlaydi.

## Ishlab chiqish qulayligi (DX)

- **Sass** ko‘pchilik frontend dasturchilarga tanish, lekin global nomlar maydoni ehtiyotkorlikni talab qiladi.
- **CSS Modules** — o‘sha CSS, faqat obyekt sifatida import qilinadi. Kamchiligi: dinamik stillarni klasslar kombinatsiyasi yoki CSS o‘zgaruvchilari orqali qilish kerak.
- **CSS-in-JS** stillar holat va props’ga kuchli bog‘liq bo‘lganda qulay va TypeScript bilan yaxshi tiplashtiriladi. Kamchiligi — mantiq va stillar bitta faylda aralashadi, bu hammaga ham yoqavermaydi.

## Tanlov matritsasi

| Loyiha turi | Tavsiya |
|---|---|
| Framework’siz lending yoki ko‘p sahifali sayt | Sass + BEM |
| SSR’li React/Next.js ilova | CSS Modules (Sass bilan ham bo‘ladi) yoki zero-runtime CSS-in-JS |
| SSR’siz, mavzu dinamikasi boy SPA | CSS-in-JS, runtime ham maqbul |
| Bir nechta mahsulot uchun dizayn-tizim | zero-runtime CSS-in-JS yoki tokenlar uchun CSS Modules + CSS o‘zgaruvchilari |
| Global CSS’dagi legacy loyiha | komponentma-komponent CSS Modules’ga bosqichma-bosqich o‘tish |

Alohida variant — Tailwind CSS kabi utility-first framework’lar: bu o‘z klasslaringizni yozmaslik hisobiga izolyatsiyani hal qiladigan boshqa yondashuv.

## Ko‘p uchraydigan xatolar

- Bitta loyihada qoidalarsiz **uchala yondashuvni aralashtirish** — stillarni topish qiyinlashadi.
- **CSS o‘zgaruvchisi bilan yozsa bo‘ladigan narsani runtime’da hisoblash**: mavzu ranglari, oraliqlar, o‘lchamlar.
- **Tokenlarni** (ranglar, shriftlar, oraliqlar) bir joyga chiqarmaslik — har qanday yondashuvda ular markazlashgan bo‘lishi kerak.

## FAQ

### CSS’da o‘zgaruvchilar va ichma-ichlik bo‘lsa, Sass kerakmi?

Tobora kamroq. Nativ CSS o‘zgaruvchilari va ichma-ichlik vazifalarning katta qismini yopadi. Sass miksinlar, funksiyalar va sikllar uchun, shuningdek u allaqachon ishlatilayotgan loyihalarda foydali bo‘lib qoladi.

### CSS Modules’ni Sass bilan birga ishlatsa bo‘ladimi?

Ha, bu keng tarqalgan juftlik: `component.module.scss` fayli klasslar izolyatsiyasini ham, Sass imkoniyatlarini ham beradi. Aksariyat yig‘uvchilar buni minimal sozlash bilan qo‘llab-quvvatlaydi.

### Runtime CSS-in-JS eskirganmi?

Yo‘q, lekin server rendering va server komponentlari bor loyihalarda uning o‘rnini tobora runtime’siz yondashuvlar egallamoqda. Mijoz tomonidagi SPA’larda u hamon ishlaydigan variant.
