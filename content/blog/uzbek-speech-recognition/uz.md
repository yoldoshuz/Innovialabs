---
title: O‘zbek nutqini tanish: variantlar, aniqlik va yashirin muammolar
description: O‘zbek tili uchun qanday ASR yechimlari bor, ular rus-o‘zbek aralash nutqi va shevalarni qanday tushunadi, real qo‘ng‘iroqlarda sifatni qanday o‘lchash kerak.
summary: O‘zbek nutqini bulutli API’lar, ochiq modellar va mahalliy provayderlar taniydi; tanlovni o‘z qo‘ng‘iroq yozuvlaringizdagi WER bo‘yicha qiling va rus-o‘zbek aralash nutqini alohida tekshiring.
---

## Qisqa javob

O‘zbek tili uchun uch guruh yechim mavjud:

- **Yirik platformalarning bulutli API’lari** — Google Speech-to-Text, Azure Speech va o‘zbek tili qo‘llab-quvvatlanadigan boshqa servislar.
- **Ochiq modellar** — masalan, OpenAI Whisper va wav2vec2/MMS oilasidagi ko‘p tilli modellar. Ularni o‘z serveringizda ishga tushirish va qayta o‘qitish mumkin.
- **Mahalliy provayderlar** — o‘zbek tiliga ixtisoslashgan va modellarni mahalliy ma’lumotlarda o‘qitadigan kompaniyalar.

Hech qaysi yechimni tavsif bo‘yicha tanlamang. Sifat yozuvlaringizga kuchli bog‘liq: telefon liniyasi, shovqin, talaffuz, tillar aralashuvi. Faqat real ma’lumotlardagi test hal qiladi.

## Asosiy yashirin muammolar

**Code-switching.** O‘zbekistonda suhbatdoshlar bitta gap ichida o‘zbek va rus tillari orasida doim almashadi. Bitta tilga qotirilgan model ikkinchi til so‘zlarini buzadi yoki «tarjima» qilib yuboradi.

**Ikki yozuv.** Model matnni lotin, kirill yoki aralash holda chiqarishi mumkin. Bu qidiruv va tahlilni buzadi — maqsadli yozuvni kelishib oling va natijani normallashtiring.

**Shevalar va so‘zlashuv nutqi.** Toshkent, Farg‘ona va Xorazm nutqi sezilarli farq qiladi. Diktor o‘qishida o‘qitilgan modellar jonli suhbatni yomonroq tushunadi.

**Telefon ovozi.** Siqilgan 8 kHz yozuvlar studiya ovozidan juda farq qiladi. Podkastlarda emas, aynan qo‘ng‘iroqlarda test qiling.

**Ismlar, brendlar, raqamlar.** Mahsulot nomlari, manzillar va summalarda ASR eng ko‘p xato qiladi, biznes uchun esa aynan ular eng muhim.

## Sifatni qanday o‘lchash kerak

1. **1–3 soatlik real qo‘ng‘iroqlarni tanlang** — turli operatorlar, mijozlar, hududlar va shovqin darajasi bilan.
2. **Etalon transkripsiyani qo‘lda tayyorlang** — yagona qoidalar bilan: qaysi yozuv, raqamlar qanday yoziladi, eshitilmagan joylar qanday belgilanadi.
3. **Har bir nomzod uchun WER’ni hisoblang** (word error rate — so‘zlar bo‘yicha xato ulushi).
4. **Natijani segmentlarga ajrating**: sof o‘zbekcha, sof ruscha, aralash, shovqinli yozuvlar.
5. **Biznes obyektlarini alohida tekshiring**: mahsulot nomlari, summalar, buyurtma raqamlari to‘g‘ri tanildimi.

WER’ni hisoblashdan oldin etalon va gipotezani bir xil normallashtiring — registr, tinish belgilari, apostroflar:

```python
import re

def normalize(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[ʻʼ`'‘’]", "’", text)
    text = re.sub(r"[^\w\s’]", " ", text)
    return " ".join(text.split())
```

WER’ning o‘zini tayyor kutubxona, masalan `jiwer` bilan hisoblash mumkin.

## Natijani qanday yaxshilash mumkin

- **Lug‘at maslahatlari** (phrase hints, custom vocabulary) — API qo‘llab-quvvatlasa, mahsulot nomlaringizni qo‘shing.
- **Kanallarni ajratish**: ATS operator va mijozni alohida kanallarga yozsa, ularni alohida taning.
- **Ochiq modelni qayta o‘qitish** — belgilangan qo‘ng‘iroqlaringizning bir necha o‘n soatida.
- **LLM bilan keyingi ishlov**: aniq xatolarni tuzatish va bitta yozuvga keltirish. Model mazmunni «o‘ylab topmasligini» kuzating.

## Qanday tanlash kerak

| Mezon | Bulutli API | Ochiq model | Mahalliy provayder |
|---|---|---|---|
| Boshlash | Tez | Infratuzilma va GPU kerak | Tez |
| Ma’lumotlar | Provayderga ketadi | Sizda qoladi | Shartnomaga bog‘liq |
| Qayta o‘qitish | Cheklangan | To‘liq nazorat | Kelishuv bo‘yicha |

## FAQ

### Whisper o‘zbek tilini tushunadimi?

O‘zbek tili Whisper qo‘llab-quvvatlaydigan tillar ro‘yxatida bor, lekin telefon qo‘ng‘iroqlari va aralash nutqdagi sifatni o‘z yozuvlaringizda tekshirish kerak. O‘z ma’lumotlaringizda qayta o‘qitish odatda sezilarli yordam beradi.

### Rus-o‘zbek aralash nutqi bilan nima qilish kerak?

Servis avtoaniqlash yoki bir nechta tilni qo‘llab-quvvatlasa, bitta tilni qat’iy belgilamang. Test namunasiga aralash bo‘laklarni albatta kiriting va yechimlarni aynan ularda solishtiring.

### Qanday WER yaxshi hisoblanadi?

Universal chegara yo‘q. Vazifaga qarang: kalit so‘zlar bo‘yicha qidiruv va tahlil uchun so‘zma-so‘z bayonnomalarga qaraganda ko‘proq xatoga yo‘l qo‘yish mumkin.
