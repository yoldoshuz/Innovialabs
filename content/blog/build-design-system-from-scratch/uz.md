---
title: Dizayn tizimini noldan qanday yaratish kerak
description: Dizayn tizimini yaratish rejasi: interfeys auditi, asoslar va tokenlar, bazaviy komponentlar, hujjatlar, rivojlantirish qoidalari va jamoaga joriy etish.
summary: Dizayn tizimi bosqichma-bosqich quriladi: mavjud interfeys auditi, asoslar (rang, tipografika, oraliq tokenlari), bazaviy komponentlar, hujjatlar va o‘zgarishlar uchun aniq qoidalar. Jamoa ishiga joriy etilmasa, eng yaxshi kutubxona ham o‘lik faylga aylanadi.
---

## Qisqa javob

Dizayn tizimi — bu Figma’dagi tugmalar kutubxonasi emas, balki dizayn va dasturlash o‘rtasidagi kelishuv: umumiy **tokenlar**, maketda ham, kodda ham mavjud **komponentlar**, **hujjatlar** va bularning barchasini o‘zgartirish **jarayoni**. Ishni komponent chizishdan emas, mavjud holatni audit qilishdan va tizim hal qilishi kerak bo‘lgan bitta real vazifani tanlashdan boshlang.

Ishchi ketma-ketlik:

1. Interfeys auditi.
2. Asoslar (foundations) va tokenlar.
3. Bazaviy komponentlar.
4. Hujjatlar.
5. Governance — o‘zgarishlarni kim va qanday qabul qiladi.
6. Mahsulot va jamoaga joriy etish.

## 1-qadam. Interfeys auditi

Barcha ekranlar skrinshotlarini bitta faylga yig‘ing va elementlarni turlarga ajrating: tugmalar, maydonlar, sarlavhalar, ranglar, soyalar, ikonkalar. Odatda mahsulotda bir nechta «ko‘k» rang va bir-ikki pikselga farq qiladigan o‘nlab tugma borligi darhol ko‘rinadi.

Natijada nimani qayd etish kerak:

- qaysi elementlar eng ko‘p takrorlanadi — ular tizimga birinchi bo‘lib kiradi;
- qaysi farqlar tasodifiy, qaysilari kontekst bilan asoslangan;
- kodda qaysi komponentlar allaqachon bor va qaysi freymvorkda.

## 2-qadam. Asoslar va tokenlar

**Foundations** — qolgan hamma narsa quriladigan bazaviy qarorlar: rang, tipografika, setka, oraliqlar, radiuslar, soyalar, animatsiya. Ularni ikki qatlamli **dizayn tokenlari** sifatida saqlash qulay:

- **primitivlar** — xom qiymatlar (`violet-600`, `space-4`);
- **semantik tokenlar** — ma’no (`color-bg-primary`, `color-text-danger`, `space-inset-md`).

Komponentlar faqat semantik qatlamga murojaat qiladi. Shunda qorong‘i mavzu yoki yangi brend qayta chizish emas, qiymatlarni almashtirish bo‘ladi.

```json
{
  "color": {
    "violet": { "600": { "value": "#7C3AED" } },
    "bg": { "primary": { "value": "{color.violet.600}" } }
  }
}
```

## 3-qadam. Bazaviy komponentlar

Auditdagi eng ko‘p uchraydigan 10–15 ta elementdan boshlang: tugma, kiritish maydoni, checkbox, select, havola, status belgisi, kartochka, modal oyna, bildirishnoma. Har biri uchun quyidagilarni tavsiflang:

- **variantlar** (primary, secondary, ghost) va **o‘lchamlar**;
- **holatlar**: default, hover, focus, active, disabled, loading, error;
- uzun matn, ikonka bilan va mobil qurilmada qanday ko‘rinishi;
- foydalanish qulayligi talablari: kontrast, ko‘rinadigan fokus, klaviatura bilan ishlash.

Figma’dagi va koddagi komponent bir xil nom va xususiyatlarga ega bo‘lishi kerak. Aks holda dizaynerlar va dasturchilar turli tillarda gaplashadi.

## 4-qadam. Hujjatlar

Hujjatlar faqat «qanday ko‘rinadi» emas, «qachon ishlatiladi» degan savolga javob beradi. Har bir komponent uchun minimum: vazifasi, to‘g‘ri va noto‘g‘ri qo‘llash misollari, xususiyatlar, holatlar, foydalanish qulayligi talablari va kodga havola. Kod uchun Storybook va Figma yoki ichki saytdagi qoidalar sahifasi yaxshi ishlaydi.

## 5-qadam. Governance

Tizim o‘zgarishlar jarayoni aniq bo‘lgandagina yashaydi. Quyidagilarni belgilang:

- **egasi** — tizim uchun javobgar inson yoki kichik jamoa;
- yangi komponent yoki tuzatishni **qanday taklif qilish** (so‘rov shabloni);
- qabul qilish **mezonlari**: pattern bir nechta joyda ishlatiladimi;
- mahsulotlar ongli ravishda yangilanishi uchun **versiyalash** va changelog.

## 6-qadam. Joriy etish

Eng yaxshi usul — bitta real ekran yoki bitta yangi funksiyani tizim komponentlari bilan qayta qurib, ish tezlashganini ko‘rsatish. Qolganini «katta portlash» bilan emas, asta-sekin o‘tkazing. Dasturchilarning fikrini tinglang: komponentning noqulay API’si tizimni yomon dizayndan ham tezroq o‘ldiradi.

## Tipik xatolar

| Xato | Uning o‘rniga |
|---|---|
| Komponentlarni «kelajak uchun» chizish | Faqat mahsulotda takrorlanayotganini olish |
| Ranglarni semantikasiz saqlash | Semantik tokenlar qatlamini kiritish |
| Tizimni faqat Figma’da yuritish | Birinchi kundan kod bilan sinxronlash |
| Egasi yo‘q | Mas’ul shaxs va o‘zgarishlar jarayonini belgilash |
| Faqat tashqi ko‘rinishni hujjatlash | Ssenariylar va taqiqlarni yozish |

## FAQ

### Mahsulotga dizayn tizimi qachon haqiqatan kerak bo‘ladi?

Interfeys ustida bir-ikkitadan ko‘p dizayner yoki bir nechta dasturchilar jamoasi ishlaganda va bir xil elementlar bir-biridan farqlana boshlaganda. Kichik landing uchun UI-kit va uslublar to‘plami yetarli.

### O‘zimiznikini yaratish o‘rniga tayyor tizimni olsa bo‘ladimi?

Ha, ochiq komponentlar kutubxonalari yaxshi asos. Lekin brendingiz va mahsulotingiz uchun tokenlar, qoidalar va hujjatlarni baribir o‘zingiz tayyorlashingiz kerak.

### Yaratish qancha vaqt oladi?

Mahsulotlar va platformalar soniga, audit hajmiga va kodda komponentlar bor-yo‘qligiga bog‘liq. Asoslar va bazaviy komponentlar bilan birinchi versiyani rejalashtirib, keyin tizimni iteratsiyalar bilan rivojlantirish oqilona.
