---
title: Nofollow, sponsored va ugc atributlari: qachon qaysi biri kerak
description: rel="nofollow", "sponsored" va "ugc" nimani anglatadi, Google va Yandex ularni qanday hisobga oladi va reklama, izoh, hamkor havolalariga qaysi biri mos.
summary: sponsored pullik va reklama havolalariga, ugc izoh va forumlardagi havolalarga, nofollow esa siz kafolat bermaydigan boshqa havolalarga qo‘yiladi. Oddiy tahririyat havolalari atributsiz qoldiriladi.
---
## Qisqa javob

Havoladagi `rel` atributi qidiruv tizimiga siz havola berayotgan sahifaga qanday munosabatda ekaningizni bildiradi:

| Atribut | Qachon qo‘yiladi |
|---|---|
| `rel="sponsored"` | Pullik joylashtirishlar, reklama, hamkorlik (affiliate) havolalari |
| `rel="ugc"` | Foydalanuvchilar qoldirgan havolalar: izohlar, forumlar, sharhlar |
| `rel="nofollow"` | Tavsiya qilishni va sayt bilan bog‘lashni istamagan har qanday havola |
| atributsiz | Siz kafolat beradigan oddiy tahririyat havolalari |

Qiymatlarni bo‘sh joy bilan birlashtirish mumkin: `rel="ugc nofollow"`.

## Uchta atribut qayerdan paydo bo‘ldi

Uzoq vaqt faqat `nofollow` bor edi. 2019-yilda Google sayt egalari havola tabiatini aniqroq tasvirlashi uchun `sponsored` va `ugc`’ni qo‘shdi. Shu bilan birga Google uchala atributni ham qat’iy buyruq emas, **maslahat** sifatida qabul qila boshladi: qidiruv tizimi bunday havolani tahlilda yoki yangi sahifalarni topishda hisobga olishi mumkin.

Google uchun `nofollow` hamon reklama uchun ham, izohlar uchun ham maqbul. Yangi qiymatlar shunchaki aniqlik qo‘shadi.

**Yandex** hujjatlarida tarixan `nofollow`’ga tayaniladi. Har bir qidiruv tizimi yangi qiymatlarni qanday talqin qilishiga bog‘liq bo‘lmaslik uchun reklama havolalarini `rel="sponsored nofollow"` kombinatsiyasi bilan belgilash qulay — uni hamma bir xil tushunadi.

## Odatiy vaziyatlar

**Pullik maqola yoki banner.** Pul, mahsulot yoki xizmat evaziga qo‘yilgan har qanday havolada `sponsored` yoki `nofollow` bo‘lishi shart. Busiz qidiruv tizimlari uni reytingni sotib olishga urinish deb hisoblaydi — bu Google’da qo‘lda qo‘llanadigan chora va Yandexda Minusinsk filtriga to‘g‘ri yo‘l.

```html
<a href="https://partner.example/" rel="sponsored nofollow">Hamkor</a>
```

**Hamkorlik dasturi.** Mahsulotlarga referal havolalar ham tijoriy munosabat, ularga `sponsored` mos keladi.

**Izohlar va forum.** Agar foydalanuvchilar havola qoldira olsa, standart holatda `ugc` (yoki `ugc nofollow`) qo‘ying. Bu spamerlarning qiziqishini kamaytiradi va sayt obro‘sini himoya qiladi. Ishonchli doimiy ishtirokchilarning havolalarini vaqt o‘tib atributsiz qoldirish mumkin.

**Maqoladagi manbalarga havolalar.** Agar manbani o‘zingiz tanlagan va tavsiya qilsangiz, atribut kerak emas. Barcha tashqi havolalarga «har ehtimolga qarshi» `nofollow` qo‘yish yomon odat: sayt g‘ayritabiiy ko‘rinadi.

**Ichki havolalar.** O‘z sahifalaringizga nofollow qo‘yilmaydi. Bu bilan sahifalar orasida vaznni taqsimlab bo‘lmaydi, robot esa sayt tuzilishini yomonroq tushunadi. Sahifani indekslash kerak bo‘lmasa, `noindex`’dan foydalaning.

## Bu atributlar nima qilmaydi

- **Sahifani indeksdan yopmaydi.** Sahifaga boshqa havolalar olib borsa, u indeksga tushishi mumkin. Buning uchun `noindex` kerak.
- **Xavfsizlikka aloqasi yo‘q.** `noopener` va `noreferrer` — `rel`’ning boshqa qiymatlari, ular havola yangi oynada ochilganda himoya qiladi va SEO’ga ta’sir qilmaydi.
- **Qabul qiluvchi saytni jazolamaydi.** nofollow havola shunchaki kamroq signal o‘tkazadi yoki umuman o‘tkazmaydi.

## Sayt uchun chek-list

1. Barcha pullik va hamkorlik havolalarini topib, ularga `sponsored` qo‘shing.
2. CMS’ni izoh va sharhlardagi havolalar avtomatik ravishda `ugc` oladigan qilib sozlang.
3. Ichki havolalardan va yaxshi manbalarga olib boradigan tahririyat havolalaridan nofollow’ni olib tashlang.
4. Shablonlarni tekshiring: vidjet va hisoblagichlar ko‘rinmas pullik havolalar qo‘shmasligi kerak.
5. Mualliflar va reklama bo‘limi uchun qoida yozing, shunda yangi materiallar darhol to‘g‘ri belgilanadi.

## FAQ

### nofollow havola biror foyda keltiradimi?

U tashriflar va brend tanilishini olib kelishi mumkin. Reyting uchun Google uni maslahat sifatida ko‘radi, shuning uchun signallar o‘tishi kafolatlanmaydi.

### Pullik havola belgilanmasa nima bo‘ladi?

Qidiruv tizimi buni reytingni sotib olish deb baholashi mumkin. Xavf ikki tomonga ham tegadi: havola bergan saytga ham, havola olib boradigan saytga ham.

### Eski nofollow’larni sponsored va ugc’ga almashtirish kerakmi?

Shart emas: Google nofollow’ni qo‘llab-quvvatlashda davom etmoqda. Yangi qiymatlarni yangi havolalar uchun ishlatish kifoya.
