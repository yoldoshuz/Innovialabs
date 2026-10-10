---
title: Ko‘p tilli sayt SEO: papkalar, subdomenlar yoki alohida domenlar
description: Sayt til versiyalari uchun uchta URL tuzilmasini solishtiramiz: papkalar, subdomenlar va alohida domenlar. Afzalliklar, kamchiliklar va til almashtirgich.
summary: Ko‘pchilik saytlar uchun eng yaxshi tanlov — papkalar (/ru/, /en/, /uz/): ular bitta domen obro‘sini bo‘lishadi va qo‘llab-quvvatlash oson. Alohida domenlar har bir mamlakat amalda alohida biznes bo‘lganda o‘rinli.
---
## Qisqa javob

Ikkilanayotgan bo‘lsangiz, **papkalarni** tanlang: `site.com/ru/`, `site.com/en/`, `site.com/uz/`. Barcha til versiyalari bitta domenda joylashadi, istalgan versiyaga qo‘yilgan havolalar butun saytni kuchaytiradi, texnik qo‘llab-quvvatlash esa sodda bo‘lib qoladi.

**Subdomenlar** (`en.site.com`) va **alohida domenlar** (`site.uz`, `site.de`) maxsus holatlarda o‘rinli: turli jamoalar, turli infratuzilma, turli yuridik shaxslar yoki milliy domen orqali mahalliylikni ko‘rsatish zarurati kuchli bo‘lsa.

## Uch variant taqqoslovda

| Mezon | Papkalar `/en/` | Subdomenlar `en.` | Domenlar `site.de` |
|---|---|---|---|
| Domen obro‘si | Umumiy | Qisman alohida | To‘liq alohida |
| Mamlakat signali | hreflang va kontent orqali | hreflang va kontent orqali | Kuchli (ccTLD) |
| Qo‘llab-quvvatlash narxi | Past | O‘rtacha | Yuqori |
| Alohida infratuzilma | Qiyin | Oson | Oson |
| Yangi versiyani ishga tushirish | Tez | O‘rtacha | Sekin |

### Papkalar

- **Afzalliklari:** bitta domen havolalar va ishonchni to‘playdi, bitta analitika, bitta sertifikat, bitta deploy.
- **Kamchiliklari:** versiyalarni turli serverlarga ajratish qiyinroq; umumiy konfiguratsiyadagi xato barcha tillarga ta’sir qiladi.

### Subdomenlar

- **Afzalliklari:** versiyalarni turli hosting va CMS’da saqlash mumkin, ularni turli jamoalar yuritganda qulay.
- **Kamchiliklari:** qidiruv tizimlari subdomenlarni alohida sayt sifatida qabul qilishi mumkin, har biri obro‘ni alohida yig‘ishi kerak bo‘ladi.

### Alohida domenlar (ccTLD)

- **Afzalliklari:** qidiruv tizimlari uchun ham, odamlar uchun ham «bu sayt shu mamlakat uchun» degan eng aniq signal.
- **Kamchiliklari:** har bir domen noldan targ‘ib qilinadi, kontent va havolalarga ko‘proq byudjet kerak, ba’zi milliy domenlar mahalliy yuridik shaxs yoki vakilni talab qiladi.

## Til va mamlakat — bir narsa emas

Ko‘p uchraydigan chalkashlik: rus tilidagi sayt albatta Rossiyaga mo‘ljallangan emas. Rusiyzabon auditoriya O‘zbekistonda, Qozog‘istonda va boshqa mamlakatlarda ham bor. Shuning uchun avval nimani nishonga olayotganingizni hal qiling:

- **Faqat til** — `/ru/`, `/en/`, `/uz/` va til kodlari bilan hreflang (`ru`, `en`, `uz`) yetarli.
- **Til + mamlakat** — masalan, turli narxlar yoki yetkazib berish shartlari. Unda `/ru-uz/`, `/ru-kz/` kabi tuzilma va mintaqali hreflang (`ru-UZ`, `ru-KZ`) kerak.

Kontenti bir xil bo‘lsa, mintaqaviy versiyalar yaratmang: bu foydasiz dublikatlarni ko‘paytiradi, xolos.

## Tuzilmadan qat’i nazar majburiy narsalar

- **Bitta til — bitta URL.** Sahifa tilini manzilni o‘zgartirmasdan cookie yoki `Accept-Language` sarlavhasi bo‘yicha almashtirmang: qidiruv roboti faqat bitta versiyani ko‘radi.
- **hreflang** har bir sahifada uning barcha tarjimalariga va o‘ziga havola bilan.
- **To‘liq tarjima** — faqat asosiy matn emas, sarlavhalar, menyu, `title`, `description`, rasmlardagi alt ham.
- **Kanonik URL** asosiy versiyaga emas, sahifaning o‘ziga, o‘z tilida ishora qiladi.
- **`lang` atributi** `<html>` tegida sahifa tiliga mos keladi.

## Til almashtirgich: to‘g‘ri qilish

- **Skript emas, havolalar.** Almashtirgich bosh sahifaga emas, xuddi shu sahifaning boshqa tildagi versiyasiga olib boradigan oddiy `<a href>` bo‘lishi kerak.
- **Til nomlari o‘z tilida:** «Русский», «English», «O‘zbekcha». Bayroqlar yomon tanlov: bayroq tilni emas, mamlakatni bildiradi.
- **Majburiy redirektsiz.** Banner orqali «Sahifaning sizning tilingizdagi versiyasi bor» deb taklif qilish mumkin, lekin avtomatik yo‘naltirmang: bu odamlarga ham, robotlarga ham xalaqit beradi.
- **Tanlovni eslab qoling.** Foydalanuvchi tilni o‘zi tanlagan bo‘lsa, keyingi tashriflarda buni hurmat qiling.

## Ko‘p uchraydigan xatolar

- Tahrirsiz avtomatik tarjima — sahifalar sifatsiz ko‘rinadi va yomon konvertatsiya qiladi.
- Bitta sahifada aralash tillar: menyu inglizcha, matn ruscha.
- Almashtirgich mos sahifa o‘rniga bosh sahifaga olib boradi.
- Til versiyasi indeksatsiyadan yopilgan yoki sitemap’da yo‘q.
- Eski manzillardan 301-redirektlarsiz URL tuzilmasini o‘zgartirish.

## FAQ

### Asosiy tilni prefikssiz, qolganlarini papkalarda qoldirsa bo‘ladimi?

Ha, asosiy til uchun `site.com/`, qolganlari uchun `site.com/en/` sxemasi ishlaydi. Ammo barcha tillar uchun yagona ko‘rinish (`/ru/`, `/en/`, `/uz/`) qo‘llab-quvvatlashda osonroq va foydalanuvchilar uchun mantiqiyroq.

### Sayt allaqachon papkalarda ishlayotgan bo‘lsa, alohida domenlarga o‘tish kerakmi?

Odatda yo‘q. Ko‘chish redirektlarni talab qiladi va vaqtincha trafikni xavf ostiga qo‘yadi. Alohida domenni faqat shu mamlakatdagi biznes haqiqatan mustaqil bo‘lganda ko‘rib chiqing.

### Tuzilma noto‘g‘ri tanlangan bo‘lsa, hreflang yordam beradimi?

hreflang qidiruv tizimiga kerakli versiyani ko‘rsatishga yordam beradi, lekin zaif tuzilmani tuzatmaydi: dublikatlar, chala tarjima yoki URL o‘zgarmasdan tilni almashtirish shundayligicha qoladi.
