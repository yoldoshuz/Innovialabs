---
title: Ko‘p tilli sayt qanday qilinadi: i18n amalda
description: i18n amalda: URL strategiyasi, tarjima fayllari, tilni aniqlash, ko‘plik shakllari, sana va son formatlari — rus, o‘zbek va ingliz tillari misolida.
summary: Ko‘p tilli sayt to‘rtta qarorga tayanadi: har bir til uchun alohida URL, kalitlar bo‘yicha fayllardagi tarjimalar, majburiy redirektsiz yumshoq til aniqlash va son, sana hamda ko‘plikni Intl orqali formatlash.
---

## Qisqa javob

**i18n** (internatsionalizatsiya) — saytni bir nechta tilda ishlashga tayyorlash, **l10n** (lokalizatsiya) esa tarjimalarning o‘zi va moslashtirish. Keyin loyihani qayta qilmaslik uchun birinchi kundan boshlab quyidagilarni ko‘zda tuting:

1. Har bir til uchun **alohida URL**.
2. **Matnlar tarjima fayllarida**, kodda emas.
3. Majburiy redirektlarsiz **tilni aniqlash**.
4. Son, sana va ko‘plik shakllarini til qoidalari bo‘yicha **formatlash**.

Quyidagi misol — rus, ingliz va o‘zbek tillaridagi sayt, bunda o‘zbek tili lotin va kirill yozuvida bo‘ladi.

## URL strategiyasi

| Variant | Misol | Afzalliklari | Kamchiliklari |
|---|---|---|---|
| Papkalar | `site.uz/ru/`, `site.uz/en/` | Oddiy, bitta domen, umumiy SEO vazni | — |
| Subdomenlar | `ru.site.uz` | Serverlarga ajratish mumkin | Sozlash murakkabroq |
| Turli domenlar | `site.uz`, `site.com` | Mamlakat uchun kuchli signal | Qimmat va murakkab |
| Parametr | `?lang=ru` | — | Qidiruv uchun yomon |

Ko‘pchilik loyihalar uchun eng yaxshi tanlov — **papkalar**. O‘zbek tili uchun lotin yozuviga `/uz/`, kirill yozuviga `/uz-cyrl/` ishlatish mumkin. Versiyalarni belgilashda `hreflang` orqali `ru`, `en`, `uz-Latn`, `uz-Cyrl` kodlari bilan bog‘lang va `x-default` qo‘shing.

## Tarjima fayllari

Satrlarni kalitlar bo‘yicha JSON’da, har bir til uchun alohida faylda saqlang:

```json
{
  "nav": { "services": "Xizmatlar", "contacts": "Kontaktlar" },
  "form": { "submit": "Ariza yuborish" }
}
```

Amaliy qoidalar:

- **Bitta manba til** — haqiqat manbai, qolganlari undan tarjima qilinadi.
- **Kalitlar ma’no bo‘yicha** (`form.submit`), matn bo‘yicha emas.
- **Iboralarni bo‘laklardan yopishtirmang**: tillarda so‘z tartibi turlicha. O‘rniga qo‘yishlardan foydalaning: `"Salom, {name}"`.
- **CI’da tushib qolganlarni tekshirish**: agar kalit fayllardan birida bo‘lmasa, yig‘ish bu haqda xabar berishi kerak.

O‘zbek kirill yozuvini lotindan transliteratsiya orqali olish mumkin, lekin natijani albatta o‘qib chiqing: avtomatika o‘zlashma so‘zlar va apostroflarda xato qiladi.

## Tilni aniqlash

- **Bosh manzil** `/` da `Accept-Language` sarlavhasini ko‘rib, mos versiyaga yo‘naltirish mumkin.
- `/en/...` kabi **aniq manzillardan yo‘naltirmang**: foydalanuvchi ham, qidiruv roboti ham aynan so‘ragan sahifasini olishi kerak.
- **Foydalanuvchi tanlovini** cookie’da saqlang va keyingi tashriflarda hurmat qiling.
- Til almashtirgich bosh sahifaga emas, boshqa tildagi **o‘sha sahifaga** olib borishi kerak.

## Ko‘plik shakllari

Ingliz va o‘zbek tillarida otlarning ikki shakli bor, rus tilida esa ko‘proq: «1 товар», «3 товара», «5 товаров». Shartlarni qo‘lda yozmang — `Intl.PluralRules` dan foydalaning:

```ts
const rules = new Intl.PluralRules("ru");
const forms: Record<string, string> = {
  one: "товар", few: "товара", many: "товаров", other: "товара",
};

const label = (n: number) => `${n} ${forms[rules.select(n)]}`;
label(1);  // "1 товар"
label(3);  // "3 товара"
label(11); // "11 товаров"
```

i18next yoki next-intl kabi kutubxonalar xuddi shu ishni ICU MessageFormat orqali bajaradi.

## Sanalar, sonlar va valyutalar

```ts
new Intl.NumberFormat("ru").format(1234567.5); // "1 234 567,5"
new Intl.NumberFormat("en").format(1234567.5); // "1,234,567.5"
new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date());
```

Qo‘lda formatlamang: minglik ajratkichlar, o‘nlik vergul va kun bilan oyning tartibi farq qiladi. `uz-Latn` va `uz-Cyrl` qo‘llab-quvvatlanishi ishga tushirish muhitiga bog‘liq, shuning uchun natijani serverda va brauzerlarda tekshiring, kerak bo‘lsa o‘z formatingizni belgilang.

## Ko‘p uchraydigan xatolar

- Almashtirgichda til nomlari o‘rniga mamlakat bayroqlari.
- Interfeys tarjima qilingan, lekin **meta-teglar**, alt-matnlar va xatlar tarjima qilinmagan.
- Barcha til versiyalarida bir xil `title`.
- Uzun so‘zlarda maket buziladi: nemis va o‘zbek matnlari rus yoki ingliz matnidan sezilarli uzunroq bo‘lishi mumkin.

## FAQ

### Mashina tarjimasidan foydalanish mumkinmi?

Qoralama sifatida — ha, lekin ona tilida so‘zlashuvchi tekshirmasdan nashr qilish xavfli: ishonch ham, sahifalarning qidiruvdagi sifati ham zarar ko‘radi.

### O‘zbek lotin va kirill yozuvi uchun alohida sahifalar kerakmi?

Agar auditoriya ikkala yozuvda o‘qisa — ha, va ular o‘z URL va `hreflang`iga ega to‘liq versiyalar bo‘lishi kerak. Agar deyarli hamma lotinda o‘qisa, undan boshlang.

### Sahifa URL’larini tarjima qilish kerakmi?

Tarjima qilingan slug’lar foydalanuvchilar uchun qulay, lekin marshrutlashni murakkablashtiradi. Oddiy murosa — barcha tillar uchun umumiy lotin slug.
