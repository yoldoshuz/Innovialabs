---
title: AI’ga yuborishdan oldin shaxsiy ma’lumotlarni qanday anonimlashtirish
description: AI so‘rovidan oldin shaxsiy ma’lumotlarni topish va yashirish: niqoblash, psevdonimlashtirish, qayta identifikatsiya riski va O‘zbekiston talablari.
summary: AI’ga yuborishdan oldin shaxsiy ma’lumotlarni (ism, telefon, pasport, manzil) toping, ularni niqob yoki psevdonim bilan almashtiring, moslik jadvalini o‘zingizda saqlang va O‘zbekistondagi ma’lumotlarni lokalizatsiya qilish talablarini hisobga oling.
---
## Qisqa javob

Anonimlashtirish — matn tashqi AI xizmatiga yetib borishidan **oldin** insonni tanib olish mumkin bo‘lgan ma’lumotlarni almashtirish yoki o‘chirish. Ishchi sxema: shaxsiy ma’lumotlarni **topish** → ularni belgilar yoki psevdonimlar bilan **almashtirish** → so‘rovni yuborish → kerak bo‘lsa, javobga haqiqiy qiymatlarni o‘z tomoningizda **qaytarish**.

## Qaysi ma’lumotlar shaxsiy hisoblanadi

**PII** (personally identifiable information) odatda quyidagilarni o‘z ichiga oladi:

- F.I.Sh., tug‘ilgan sana, surat;
- telefon raqami, email, manzil;
- pasport ma’lumotlari, JShShIR, STIR;
- karta va hisob raqamlari;
- tibbiy ma’lumotlar, daromad haqidagi ma’lumotlar;
- bilvosita belgilar: kichik kompaniyadagi lavozim, kam uchraydigan tashxis, aniq ish joyi.

Bilvosita belgilarning xavfi shundaki, alohida olganda ular hech narsani oshkor qilmaydi, birgalikda esa aniq bir insonga ishora qiladi.

## 1-qadam. Aniqlash

Bir nechta qatlamdan foydalaning:

- **Regular expressions** — formatli ma’lumotlar uchun: telefonlar, email, hujjat va karta raqamlari.
- **NER modellari** (nomlangan obyektlarni aniqlash) — ismlar, manzillar, tashkilotlar uchun. Rus va o‘zbek tillaridagi sifatni alohida tekshirish kerak.
- **Lug‘atlar** — mijozlaringiz, xodimlaringiz, kontragentlaringiz ro‘yxati.
- **Tuzilgan maydonlar** — ma’lumotlar CRM’dan kelsa, ortiqcha maydonlarni umuman yubormaslik osonroq.

```python
import re

PHONE = re.compile(r"\+?998[\s-]?\d{2}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}")
EMAIL = re.compile(r"[\w.+-]+@[\w-]+\.[\w.]+")

def mask(text: str) -> str:
    text = PHONE.sub("[PHONE]", text)
    return EMAIL.sub("[EMAIL]", text)
```

## 2-qadam. Usulni tanlash

| Usul | Nima qiladi | Qachon mos keladi |
|---|---|---|
| **O‘chirish** | qiymatni butunlay olib tashlaydi | ma’lumot vazifa uchun kerak emas |
| **Niqoblash** | `[PHONE]`, `[NAME]` | AI uchun faqat ma’lumot turi muhim |
| **Psevdonimlashtirish** | «Mijoz_1», «Mijoz_2» | matnda odamlarni farqlash muhim |
| **Umumlashtirish** | «35 yosh» → «30–40 yosh» | aniq qiymatlarsiz analitika kerak |
| **Sintetik ma’lumotlar** | ishonarli to‘qima qiymatlar | testlar va o‘qitish |

Psevdonimlashtirishda **moslik jadvali** faqat sizning serveringizda saqlanadi. AI «Mijoz_1»ni ko‘radi, tizimingiz esa javobdan keyin haqiqiy ismni qo‘yadi.

## Qayta identifikatsiya riski

Ismsiz ham insonni tanib olish mumkin:

- belgilarning **birikmasi** orqali: tuman, yosh, kasb, voqea sanasi;
- mijoz o‘zi haqida tafsilotlarni aytgan **erkin matn** orqali;
- **noyob voqealar** orqali — kam uchraydigan bitim, mashhur hodisa;
- psevdonimlar barcha so‘rovlarda **bir xil** bo‘lsa va ularni solishtirish mumkin bo‘lsa.

Riskni kamaytiring: minimal maydonlarni yuboring, aniq qiymatlarni umumlashtiring, so‘rovlar o‘rtasida bog‘liqlik kerak bo‘lmasa, sessiyalar orasida psevdonimlarni almashtiring.

## O‘zbekistondagi talablar

O‘zbekistonda **«Shaxsga doir ma’lumotlar to‘g‘risida»gi Qonun** amal qiladi. U, jumladan, axborot texnologiyalari yordamida qayta ishlanadigan O‘zbekiston fuqarolarining shaxsiy ma’lumotlari mamlakat hududida jismonan joylashgan bazalarda saqlanishini talab qiladi. Amaliy xulosalar:

- dastlabki shaxsiy ma’lumotlarni O‘zbekistondagi serverlarda saqlang;
- tashqi AI xizmatlariga faqat anonimlashtirilgan matnni yuboring;
- sub’ektdan qayta ishlashga rozilik oling va maqsadlarni qayd eting;
- AI provayderining shartnomasi va ma’lumotlarni saqlash siyosatini tekshiring.

Aniq sxemani yurist bilan kelishib oling: talablar va ularning talqini o‘zgarib turadi.

## Ko‘p uchraydigan xatolar

- Faqat regular expressions’ga tayanish — ular ism va manzillarni o‘tkazib yuboradi.
- Moslik jadvalini so‘rov bilan birga AI’ga yuborish.
- Niqoblashdan oldin dastlabki ma’lumotlarni loglarga yozish.
- Anonimlashtirishni haqiqiy namunalarda tekshirmaslik.

## FAQ

### Faqat ismni olib tashlash yetarlimi?

Yo‘q. Telefon, manzil, hujjat raqami va bilvosita belgilar birikmasi ham insonni tanib olishga imkon beradi. Ma’lumotlarning barcha toifalarini qidirish kerak.

### Anonimlashtirish o‘rniga lokal modeldan foydalansa bo‘ladimi?

O‘zbekistondagi serverlaringizda joylashtirilgan model ma’lumotlarni uchinchi tomonga uzatish masalasini olib tashlaydi, lekin kirish, loglash va rozilik qoidalari baribir amal qiladi.

### Niqoblash AI javobi sifatini buzadimi?

Belgilar tushunarli va izchil bo‘lsa, odatda yo‘q. Ko‘pchilik vazifalar uchun AI’ga haqiqiy ism va raqamlar emas, matnning ma’nosi muhim.
