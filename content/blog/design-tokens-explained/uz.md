---
title: Dizayn-tokenlar: ular nima va qanday tuziladi
description: Dizayn-tokenlar nima, primitiv, semantik va komponent tokenlar qanday farq qiladi, ularni qanday nomlash va Figma bilan kod o‘rtasida qanday sinxronlash haqida.
summary: Dizayn-tokenlar — bitta manbada saqlanadigan va Figma’da ham, kodda ham ishlatiladigan nomlangan dizayn qiymatlari (ranglar, chekinishlar, shriftlar); ular uch qatlamda quriladi — primitivlar, semantika va komponentlar — shunda mavzu yoki rebrending yuzlab ekranlarni emas, bir nechta havolani tahrirlash bilan o‘zgaradi.
---

## Qisqacha javob

**Dizayn-token** — dizayn qiymatining nomi: `#1F2937` o‘rniga `color.text.primary`, `16px` o‘rniga `space.4`. Tokenlar yagona haqiqat manbasida saqlanadi va Figma o‘zgaruvchilari, CSS o‘zgaruvchilari, iOS va Android resurslariga aylantiriladi.

Bu nima uchun kerak:

- **Bir xillik.** Dizayner va dasturchi bir xil nomlardan foydalanadi.
- **Mavzular.** Yorug‘ va qorong‘i mavzu — bir xil semantik tokenlarning turli qiymatlari.
- **Boshqariladigan o‘zgarishlar.** Brendning yangi rangi bir joyda o‘zgartiriladi va butun mahsulotga tarqaladi.

## Tokenlarning uch qatlami

| Qatlam | Nimani saqlaydi | Misol | Kim ishlatadi |
|---|---|---|---|
| **Primitiv** (base, core) | Palitra va shkalalarning xom qiymatlari | `color.blue.600 = #2563EB` | Faqat boshqa tokenlar |
| **Semantik** (alias) | Qiymatning vazifasi | `color.action.primary → color.blue.600` | Interfeysdagi dizaynerlar va dasturchilar |
| **Komponent** | Aniq komponent qiymatlari | `button.primary.bg → color.action.primary` | Kod va komponentlar kutubxonasi |

Asosiy tamoyil: **interfeys primitivlarga emas, semantikaga havola qiladi**. Agar tugma to‘g‘ridan-to‘g‘ri `blue.600` ni ishlatsa, qorong‘i mavzu yoki rebrendingda uni qo‘lda qidirib, o‘zgartirishga to‘g‘ri keladi.

Komponent qatlami majburiy emas. U komponent umumiy semantikadan farq qilishi kerak bo‘lgan katta tizimlarda foydali. Kichik mahsulotlarga ko‘pincha ikki qatlam yetarli.

## Tokenlarni qanday nomlash

Yaxshi nom umumiydan xususiyga qarab yo‘l kabi o‘qiladi. Keng tarqalgan sxema:

```text
{kategoriya}.{xususiyat}.{rol}.{variant}.{holat}

color.bg.surface
color.bg.surface.raised
color.text.secondary
color.border.danger
button.primary.bg.hover
space.inset.md
radius.control
```

Tartibsizlikdan qutqaradigan qoidalar:

- **Ko‘rinishiga qarab emas, vazifasiga qarab nomlang.** `color.red-text` emas, `color.text.danger`. Qizil to‘q qizilga aylanishi mumkin, vazifa esa qoladi.
- Butun tizimda **segmentlarning yagona tartibi**.
- **Oldindan aytsa bo‘ladigan shkalalar.** O‘lchamlar uchun `sm/md/lg` yoki raqamli shkala, lekin aralashmasi emas.
- **Holatlar oxirida:** `hover`, `pressed`, `disabled`, `focus`.
- **Nomda qiymat bo‘lmasin.** Qiymat 20 ga o‘zgarganda `space.16` buziladi.

## Format va misol

Tokenlarni JSON’da saqlash qulay. Keng tarqalgan kelishuv — W3C Design Tokens Community Group formati: unda har bir tokenda `$value` va `$type` bor, havolalar esa jingalak qavslarda yoziladi:

```json
{
  "color": {
    "blue": {
      "400": { "$type": "color", "$value": "#60A5FA" },
      "600": { "$type": "color", "$value": "#2563EB" }
    },
    "action": {
      "primary": { "$type": "color", "$value": "{color.blue.600}" }
    }
  }
}
```

Yig‘ishdan keyin bu, masalan, mavzulari bor CSS o‘zgaruvchilariga aylanadi:

```css
:root {
  --color-blue-400: #60a5fa;
  --color-blue-600: #2563eb;
  --color-action-primary: var(--color-blue-600);
}

[data-theme="dark"] {
  --color-action-primary: var(--color-blue-400);
}
```

Komponentlar faqat `--color-action-primary` dan foydalanadi, mavzu esa bitta atribut bilan almashadi.

## Figma va kod o‘rtasida sinxronlash

Odatiy zanjir:

1. **Figma’da** tokenlar **Variables** sifatida yashaydi: primitivlar kolleksiyasi va yorug‘ hamda qorong‘i mavzu uchun rejimlarga (modes) ega semantika kolleksiyasi. Semantik o‘zgaruvchilar primitivlarga aliaslar orqali havola qiladi.
2. JSON’ga **eksport** — tarifingiz va jarayoningizga qarab plagin (masalan, Tokens Studio) yoki Figma API orqali.
3. **Repozitoriy** JSON’ni haqiqat manbasi sifatida saqlaydi. O‘zgarishlar kod kabi pull request orqali o‘tadi.
4. **Yig‘ish** — Style Dictionary kabi vosita JSON’ni CSS o‘zgaruvchilari, Tailwind konfiguratsiyasi, iOS va Android resurslariga aylantiradi.
5. **CI** yig‘ish muvaffaqiyatli o‘tishini va kodda tokenlardan tashqari «xom» rang qiymatlari yo‘qligini tekshiradi.

Asosiy qaror — **haqiqat manbasi qayerda**. Agar Figma’da tahrirlansa, kod eksportni oladi. Agar repozitoriyda tahrirlansa — Figma undan sinxronlanadi. Ikki tomonlama qo‘lda tahrirlash deyarli har doim nomuvofiqlikka olib keladi.

## Ko‘p uchraydigan xatolar

- Primitivlarni to‘g‘ridan-to‘g‘ri komponentlarda ishlatish.
- Hech kim qo‘llamaydigan «har ehtimolga qarshi» yuzlab semantik tokenlar.
- Figma va kodda bir narsaning turli nomlari.
- Qorong‘i mavzuni semantikaning yangi qiymatlari o‘rniga alohida primitivlar to‘plami sifatida qurish.
- Qaysi token nima uchunligi haqida hujjatning yo‘qligi.

## FAQ

### Mahsulotga dizayn-tokenlar qachondan kerak bo‘ladi?

Ikkinchi mavzu, ikkinchi platforma mijozi yoki interfeys ustida bir vaqtda ishlaydigan bir necha kishi paydo bo‘lishi bilan. Bitta kichik sayt uchun tushunarli nomli CSS o‘zgaruvchilari yetarli — bu allaqachon tokenlar sari birinchi qadam.

### Tokenlar Figma uslublaridan (styles) nimasi bilan farq qiladi?

Uslublar maketlar uchun tayyor xususiyatlar to‘plamini tasvirlaydi. Tokenlar esa Figma’dan tashqarida yashaydigan va kodda ishlatiladigan nomlangan qiymatlar. Figma Variables tokenlarga yaqinroq: ularda aliaslar va rejimlar bor, ularni eksport qilish qulay.

### Komponent tokenlar qatlami kerakmi?

Har doim emas. U komponentlar kutubxonasi katta bo‘lib, komponentlarga o‘z sozlamalari kerak bo‘lganda, masalan white-label mahsulotlarda o‘zini oqlaydi. Boshqa hollarda komponentlar to‘g‘ridan-to‘g‘ri semantik tokenlarga havola qilishi mumkin.
