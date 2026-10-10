---
title: Sun’iy intellekt yordamida murojaatlarni tasniflash va yo‘naltirish
description: Sun’iy intellekt yordamida murojaatlarni mavzu, shoshilinchlik va til bo‘yicha avtomatik belgilash, kerakli jamoaga yo‘naltirish va xatolarni o‘lchash.
summary: Model murojaatni o‘qib, mavzu, shoshilinchlik va tilni qat’iy formatda qaytaradi, qoidalar esa shu teglar bo‘yicha uni kerakli navbatga yuboradi; xatolar operator tuzatishlari orqali kuzatiladi.
---

## Bu qanday ishlaydi

Murojaatlarni AI bilan tasniflash — kiruvchi xabar va qo‘llab-quvvatlash navbati o‘rtasidagi qadam. Model xat, chat yoki ariza matnini o‘qib, **teglar** qo‘yadi: mavzu, shoshilinchlik, til. So‘ngra **yo‘naltirish qoidalari** shu teglar bo‘yicha murojaatni kerakli jamoaga yuboradi.

Ikki qismni ajratib turing:

- **Tasniflash** — model vazifasi: murojaat nima haqida ekanini tushunish.
- **Yo‘naltirish** — oddiy biznes-mantiq: bunday teglarga ega murojaat qayerga borishi kerak.

Shunda jamoalar tuzilmasini modelni qayta o‘qitmasdan, modelni esa qoidalarni qayta yozmasdan o‘zgartirasiz.

## 1-qadam. Teglarni tavsiflang

Qisqa va aniq ro‘yxatdan boshlang.

- **Mavzu**: to‘lov, yetkazib berish, texnik nosozlik, qaytarish, akkauntga kirish, boshqa.
- **Shoshilinchlik**: kritik (to‘lov ishlamayapti, ma’lumotlar sizib chiqishi), yuqori, oddiy.
- **Til**: o‘zbek, rus, ingliz — shu tilda gaplashadigan operatorga yuborish uchun.

Yaxshi sxema qoidalari:

- Har bir kategoriyaning **ta’rifi va 2–3 ta misoli** bor.
- Kategoriyalar bir-biriga kesishmaydi. Operator o‘zi ikkilansa, model ham xato qiladi.
- **«Boshqa»** kategoriyasi majburiy — model murojaatni mos kelmaydigan mavzuga zo‘rlab tiqmasligi kerak.

## 2-qadam. Yondashuvni tanlang

| Yondashuv | Qachon mos keladi |
|---|---|
| Ko‘rsatma va misollar bilan LLM | Tez start, belgilangan ma’lumotlar kam, kategoriyalar tez-tez o‘zgaradi |
| O‘qitilgan klassifikator | Belgilangan tarix ko‘p, past narx va yuqori tezlik kerak |
| Kalit so‘zlar va qoidalar | Aniq holatlar: buyurtma raqami, «qaytarish» so‘zi |

Amalda ko‘pincha birlashtiriladi: aniq holatlar uchun qoidalar, qolgani uchun LLM.

## 3-qadam. Qat’iy javob oling

Modeldan belgilangan maydonlar va ruxsat etilgan qiymatlar bilan **JSON** qaytarishini so‘rang. Ko‘plab API’lar structured output’ni qo‘llab-quvvatlaydi — undan foydalaning.

```json
{
  "topic": "payment",
  "urgency": "high",
  "language": "uz",
  "confidence": "low"
}
```

Javobni kodda tekshiring: qiymat ro‘yxatda bo‘lmasa, «boshqa» qo‘ying va umumiy navbatga yuboring.

## 4-qadam. Yo‘naltirishni sozlang

- Mavzu → jamoa: to‘lov → moliya, nosozlik → ikkinchi liniya texnik yordami.
- Shoshilinchlik → helpdesk tizimidagi ustuvorlik va SLA.
- Til → kerakli tilni biladigan operator.
- **Past ishonch** → qo‘lda belgilash uchun umumiy navbat.

**«Maslahat»** rejimidan boshlang: model teglarni taklif qiladi, operator tasdiqlaydi. Aniqlik qoniqarli bo‘lgach, ayrim kategoriyalar uchun avtomatik yo‘naltirishni yoqing.

## 5-qadam. Xatolarni o‘lchang

O‘lchovsiz tizim yordam beryaptimi-yo‘qmi, bilmaysiz.

- Qo‘lda belgilangan real murojaatlardan **test to‘plami** yig‘ing va prompt yoki model har o‘zgarganda uni ishga tushiring.
- Operator murojaatni **qayta tayinlagan** yoki **tegni o‘zgartirgan** har bir holatni loglang. Bular production’dagi tasniflash xatolaridir.
- Metrikalarni **har bir kategoriya bo‘yicha** alohida kuzating: umumiy aniqlik kritik murojaatlar yo‘qolayotganini yashirishi mumkin.
- **Xatolar matritsasini** tuzing: model qaysi mavzularni chalkashtiradi. Bu ko‘pincha kategoriya ta’riflarini qayta yozish kerakligini bildiradi.
- **O‘tkazib yuborilgan kritik** murojaatlarga alohida e’tibor bering — bu eng qimmat xato.

## Ko‘p uchraydigan xatolar

- Chegaralari noaniq juda ko‘p kategoriyalar.
- «Boshqa» kategoriyasi va qo‘lda ishlash navbati yo‘qligi.
- Maslahat bosqichisiz darhol to‘liq avtomatlashtirish.
- Mijozlarning shaxsiy ma’lumotlarini qayta ishlash shartlarini tekshirmasdan tashqi servisga yuborish.
- Sifatni bir nechta misolga qarab «ko‘z bilan» baholash.

## FAQ

### Boshlash uchun qancha ma’lumot kerak?

LLM bilan kategoriya tavsiflari va bir nechta misoldan boshlash mumkin. Sifatni halol baholash uchun baribir qo‘lda belgilangan real murojaatlar to‘plamini yig‘ing.

### AI aralash tillardagi xabarlarni tushuna oladimi?

Zamonaviy LLM’lar odatda aralash matnlarni, jumladan lotin va kirill yozuvidagi o‘zbek tilini tushunadi. Til tegiga tayanishdan oldin buni test to‘plamingizda tekshiring.

### Model kritik murojaatda xato qilsa nima qilish kerak?

Himoya qatlamini qo‘shing: kritik holatlar uchun har doim ustuvorlikni oshiradigan kalit so‘zlar va o‘tkazib yuborilgan holatlarni muntazam tahlil qilish.
