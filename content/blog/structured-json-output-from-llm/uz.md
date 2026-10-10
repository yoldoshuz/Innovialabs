---
title: LLM’dan barqaror JSON javobni qanday olish mumkin
description: Prompt, JSON mode yoki sxema bo‘yicha javob: LLM’dan JSON olish usullarini solishtiramiz, validatsiya, qayta so‘rov va parsing xatolarini ko‘rib chiqamiz.
summary: Eng ishonchli usul — model va API qo‘llab-quvvatlasa, JSON-sxema bilan cheklangan javob (structured outputs); JSON mode faqat to‘g‘ri sintaksisni kafolatlaydi, promptdagi ko‘rsatmaning o‘zi esa hech narsani kafolatlamaydi. Har qanday holatda javobni kodda sxema bo‘yicha tekshiring va xato bo‘lsa so‘rovni takrorlang.
---

## JSON olishning uchta usuli

LLM javobini odam emas, kod o‘qiganda oldindan bashorat qilinadigan JSON kerak. Ishonchlilikning uchta darajasi bor:

| Usul | Nimani kafolatlaydi | Xavflar |
|---|---|---|
| **Faqat prompt** | Hech narsani: model ko‘rsatmaga amal qilishga harakat qiladi | Ortiqcha matn, markdown o‘rami, tushib qolgan maydonlar |
| **JSON mode** | Sintaktik jihatdan to‘g‘ri JSON | Maydonlar va turlar kutilganiga mos kelmasligi mumkin |
| **Sxema bo‘yicha javob** (structured outputs) | JSON berilgan sxemaga mos keladi | Barcha modellar va barcha sxema konstruksiyalari qo‘llab-quvvatlanmaydi |

Tanlov oddiy: API sxema bo‘yicha javobni qo‘llab-quvvatlasa — undan foydalaning. Bo‘lmasa — JSON mode va qat’iy validatsiya. Bularsiz prompt faqat prototip uchun yaraydi.

Yana bir variant — **tool calling** (function calling): siz parametrlar sxemasi bilan «vosita»ni tasvirlaysiz, model esa argumentlarni tuzilma ko‘rinishida qaytaradi. Ko‘pchilik undan aynan JSON olish usuli sifatida foydalanadi.

## JSON uchun promptni qanday yozish

JSON mode bilan ham prompt muhim — model maydonlar ma’nosini tushunishi kerak.

- **Aniq sxemani** yoki namunaviy obyektni ko‘rsating.
- Har bir maydon nimani anglatishi va qaysi qiymatlar ruxsat etilganini tasvirlang.
- Ma’lumot bo‘lmasa nima qilishni ayting: `null`, bo‘sh massiv yoki maxsus qiymat.
- Izohlarsiz va markdown’siz **faqat JSON** qaytarishni so‘rang.

```text
Arizadan ma’lumotlarni ajratib ol. Izohsiz faqat JSON qaytar:
{
  "name": string,
  "phone": string | null,
  "service": "web" | "mobile" | "bot" | "other",
  "budget_mentioned": boolean
}
Agar maydon matnda ko‘rsatilmagan bo‘lsa — null qo‘y.
```

## Validatsiya: javobni doim tekshiring

To‘g‘ri sintaksis hali to‘g‘ri ma’lumot degani emas. Javobni kodda sxema bo‘yicha tekshiring — masalan, Python’da Pydantic yoki TypeScript’da Zod yordamida.

```python
from typing import Literal, Optional
from pydantic import BaseModel, ValidationError

class Lead(BaseModel):
    name: str
    phone: Optional[str]
    service: Literal["web", "mobile", "bot", "other"]
    budget_mentioned: bool

def parse_lead(raw: str) -> Lead | None:
    try:
        return Lead.model_validate_json(raw)
    except ValidationError:
        return None
```

Koddagi sxema yagona haqiqat manbai bo‘lib xizmat qiladi: API so‘rovi uchun JSON Schema’ni ham undan generatsiya qilish mumkin.

## Xato bo‘lganda qayta so‘rov

Yaxshi sozlangan holatda ham ba’zi javoblar tekshiruvdan o‘tmaydi. Ishlaydigan pattern:

1. So‘rov yuborish, javob olish.
2. Validatsiya qilish.
3. Xato bo‘lsa — **validatsiya xatosi matnini qo‘shib** so‘rovni takrorlash: «Javob tekshiruvdan o‘tmadi: service maydonida ruxsat etilmagan qiymat. Tuzat va faqat JSON qaytar».
4. Urinishlar sonini cheklash (odatda bir-ikkita yetarli).
5. Baribir chiqmasa — logga yozish va tushunarli xato qaytarish yoki qo‘lda ishlov berishga yuborish.

Cheksiz takrorlamang va JSON’ni regulyar ifodalar bilan «tuzatmang» — bu muammoni yashiradi.

## Parsingdagi keng tarqalgan xatolar

- **Markdown o‘rami.** Model JSON’ni uchtalik qo‘shtirnoqli kod bloki ichida qaytaradi. Yechim: sxema bo‘yicha javob yoki JSON mode; oxirgi chora sifatida — parsingdan oldin o‘ramni ehtiyotkorlik bilan olib tashlash.
- **JSON’dan oldin yoki keyin matn.** Obyektdan oldin «Mana natija:». Yechim: promptda aniq taqiq va validatsiya.
- **Kesilgan javob.** Token limiti obyekt o‘rtasida tugagan. Yechim: limitni oshirish, API javobida generatsiya to‘xtash sababini tekshirish.
- **Noto‘g‘ri turlar.** `true` o‘rniga `"true"`, son satr ko‘rinishida. Yechim: sxema va validatsiya, kerak bo‘lsa — kod tomonida turlarni o‘zgartirish.
- **O‘ylab topilgan qiymatlar.** Model matnda yo‘q maydonni to‘ldiradi. Yechim: `null`ga ruxsat bering va taxmin qilish mumkin emasligini aniq ayting.
- **Juda murakkab sxema.** Chuqur ichma-ichlik va o‘nlab maydonlar xato xavfini oshiradi. Yechim: soddalashtirish yoki bir necha so‘rovga bo‘lish.

## FAQ

### API sxemaga moslikni kafolatlasa, validatsiya kerakmi?

Ha, hech bo‘lmaganda minimal. Kafolat ma’noga emas, tuzilmaga tegishli: qiymat rasman ruxsat etilgan, lekin baribir noto‘g‘ri bo‘lishi mumkin. Bundan tashqari, tekshiruv API tomonidagi o‘zgarishlar va kesilgan javoblardan himoya qiladi.

### Qaysi biri yaxshiroq: JSON mode yoki tool calling?

Agar shunchaki tuzilmali javob kerak bo‘lsa — sxema bo‘yicha javob yoki JSON mode soddaroq. Tool calling model o‘zi harakatni chaqirish-chaqirmaslikni va qaysi birini tanlashi kerak bo‘lganda qulay.

### Modeldan mulohaza yuritishni so‘rab, baribir JSON olsa bo‘ladimi?

Ha. Sxemaga javob maydonlaridan oldin mulohaza uchun maydon qo‘shing, kodda esa faqat kerakli maydonlardan foydalaning. Tartib muhim: mulohaza natijadan oldin kelishi kerak.
