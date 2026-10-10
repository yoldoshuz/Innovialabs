---
title: Tonallik tahlili nima va uni sharhlarga qanday qo‘llash mumkin
description: Tonallik va aspektli tahlil nima, LLM’lar kinoya va aralash tillarni qanday tushunadi hamda mijozlar sharhlarini mahsulot qarorlariga qanday aylantirish.
summary: Tonallik tahlili sharh ijobiy, salbiy yoki neytral ekanini avtomatik aniqlaydi, aspektli tahlil esa aynan nima maqtalayotgani yoki tanqid qilinayotganini ko‘rsatadi. Natijalar mavzular bo‘yicha guruhlanib, jamoa uchun aniq vazifalarga aylanganda foyda paydo bo‘ladi.
---

## Qisqa javob

**Tonallik tahlili** (sentiment analysis) — matnning hissiy ohangini avtomatik aniqlash: ijobiy, salbiy yoki neytral. U minglab xabarlarni qo‘lda o‘qimaslik uchun sharhlar, qo‘llab-quvvatlash murojaatlari, izohlar va so‘rovnomalarga qo‘llaniladi.

Lekin «sharh salbiy» degan bitta baho kam narsa beradi. Ancha foydaliroq — **aspektli tahlil** (aspect-based sentiment analysis): u sharhni mavzularga ajratib, har birini alohida baholaydi.

## Umumiy tonallik va aspektli tahlil

Sharh misoli: «Yetkazib berish tez bo‘ldi, lekin kuryer qo‘pollik qildi, ilova esa doim yopilib qoladi».

| Yondashuv | Natija |
|---|---|
| Umumiy tonallik | Salbiy |
| Aspektli tahlil | Yetkazib berish — ijobiy, kuryer — salbiy, ilova — salbiy |

Birinchisi mijoz norozi ekanini aytadi. Ikkinchisi — **aynan nimani tuzatish kerakligini** va nima allaqachon ishlayotganini.

## LLM’lar murakkab holatlarni qanday hal qiladi

Klassik modellar lug‘atlar va shablonlar asosida ishlab, ko‘p xato qilardi. Katta til modellari kontekstni ancha yaxshi tushunadi:

- **Kinoya.** «Zo‘r, uchinchi marta buyurtmani bir hafta kutyapman» — matnda «zo‘r» so‘zi bo‘lsa ham, LLM odatda salbiyni taniydi. Lekin har doim emas: kontekstsiz qisqa kinoyali iboralar qiyinligicha qoladi.
- **Aralash tillar.** O‘zbekistondagi sharhlarda ko‘pincha rus tili, lotin va kirill yozuvidagi o‘zbek tili, inglizcha atamalar aralashib ketadi. Zamonaviy LLM’lar bunday matnlarni har bir til uchun alohida modelsiz qayta ishlaydi.
- **Jargon va imlo xatolari.** Kontekst xatolar bo‘lsa ham ma’noni tushunishga yordam beradi.
- **Yashirin salbiy.** «Xullas, umuman olganda yomon emas» — model buni ijobiy emas, vazmin baho sifatida belgilashi mumkin.

Cheklovlar ham bor: natija so‘rov qanday tuzilganiga bog‘liq, katta hajmlarda esa narx muhim. Shuning uchun model javoblaridan tanlanmani muntazam qo‘lda tekshirib turing.

## Qanday joriy qilish: bosqichma-bosqich

1. **Manbalarni yig‘ing.** Marketpleyslardagi sharhlar, Google va Yandex Xaritalar, Telegram’dagi xabarlar, CRM’dagi murojaatlar.
2. **Biznesingiz uchun aspektlar ro‘yxatini aniqlang**: masalan, narx, sifat, yetkazib berish, qo‘llab-quvvatlash, ilova.
3. **Modelga qat’iy javob formatli so‘rov yozing**, natijani jadvalga saqlash mumkin bo‘lsin.
4. **Tanlanmada tekshiring.** Bir necha o‘nlab sharhni qo‘lda belgilab, model javoblari bilan solishtiring.
5. **Avtomatlashtiring.** Yangi sharhlar darhol tahlil qilinib, dashboard yoki CRM’ga tushadi.

Ma’lumotlar bazasiga saqlash qulay bo‘lgan tuzilmali javob misoli:

```json
{
  "overall": "negative",
  "aspects": [
    {"aspect": "delivery", "sentiment": "positive"},
    {"aspect": "courier", "sentiment": "negative"},
    {"aspect": "app", "sentiment": "negative", "issue": "crashes"}
  ]
}
```

## Natijalarni qarorlarga qanday aylantirish

- **Bir lahzalik holatga emas, dinamikaga qarang.** Kuryerlik xizmatini almashtirgandan keyin «yetkazib berish» bo‘yicha salbiy o‘syaptimi — mana shu muhim.
- **Muammolarni saralang** — chastota va ta’sir bo‘yicha: nima ko‘proq tilga olinadi va nima salbiy bilan kuchliroq bog‘liq.
- **Mas’ullarni belgilang.** Ilova bo‘yicha salbiy — dasturchilarga, kuryerlar bo‘yicha — logistikaga.
- **Tanqidiy sharhlarga tez javob bering.** Kuchli salbiy sharh kelganda bildirishnoma sozlang.
- **Natijani tekshiring.** Tuzatishdan keyin shu aspekt bo‘yicha tonallik o‘zgarganini kuzating.

## Ko‘p uchraydigan xatolar

- Aspektlarsiz bitta umumiy baho bilan cheklanish.
- Model sifatini o‘z ma’lumotlaringizda tekshirmaslik.
- Hech kim o‘qimaydigan va vazifalarga olib kelmaydigan hisobot tuzish.

## FAQ

### Tahlil ma’noli bo‘lishi uchun qancha sharh kerak?

Aniq chegara yo‘q. Sharhlar kam bo‘lsa, ularni qo‘lda o‘qish osonroq. Oqim barqaror bo‘lib, mavzular va vaqt bo‘yicha tendensiyalarni ko‘rmoqchi bo‘lsangiz, avtomatlashtirish o‘zini oqlaydi.

### O‘z modelimni o‘qitishim kerakmi?

Ko‘pchilik vazifalar uchun yo‘q: yaxshi tuzilgan so‘rov va aspektlar ro‘yxatiga ega LLM yetarli sifat beradi. O‘z modeli juda katta hajmlarda yoki o‘ziga xos terminologiyada ma’noga ega.

### Ovozli murojaatlarni tahlil qilish mumkinmi?

Ha, agar avval nutqni tanib olish yordamida ovozni matnga aylantirib, keyin xuddi shu tonallik tahlilini qo‘llasangiz.
