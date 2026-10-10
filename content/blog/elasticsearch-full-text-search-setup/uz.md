---
title: Elasticsearch bilan saytda to‘liq matnli qidiruvni qanday qilish
description: Sayt uchun Elasticsearch sozlash: rus va o‘zbek tillari uchun mapping va analizatorlar, asosiy baza bilan sinxronlash, xatolarga chidamlilik va avtoto‘ldirish.
summary: Har bir til uchun alohida maydon va to‘g‘ri analizatorlar bilan indeks yarating, uni asosiy baza bilan hodisalar yoki davriy qayta indekslash orqali sinxronlang, xatolar va takliflar uchun fuzziness va search_as_you_type’dan foydalaning.
---

## Qisqacha qanday ishlaydi

Elasticsearch — asosiy baza yonidagi **alohida qidiruv indeksi**. Haqiqat manbai baza bo‘lib qoladi, Elasticsearch esa qidiruv uchun maydonlar nusxasini oladi. Bu nusxani **analizatorlar** qayta ishlaydi: matnni tokenlarga ajratadi, kichik harflarga va so‘zning asosiy shakliga keltiradi. Qidiruv sifatini uch narsa belgilaydi: mapping, sinxronlash va so‘rov.

## 1-qadam. Indeks va analizatorlar

Har bir tilni alohida maydonda saqlang — shunda har biriga to‘g‘ri analizator ishlaydi.

- **Rus tili**: o‘rnatilgan stop-so‘zlar va rus stemmeri qo‘shimchalarni olib tashlaydi («телефоны» «телефон»ni topadi). ё va е harflarini tenglashtirish foydali.
- **O‘zbek tili**: o‘rnatilgan analizator yo‘q. Amaliy asos — matnni kichik harflarga keltiradigan va turli apostroflarni (‘, ’, ʻ, ʼ, oddiy va teskari apostrof) olib tashlaydigan o‘z analizatoringiz, chunki foydalanuvchilar o‘zbek, o‘zbek va ozbek deb aralash yozadi.

```json
PUT /products
{
  "settings": {
    "analysis": {
      "char_filter": {
        "uz_apostrophes": {
          "type": "pattern_replace",
          "pattern": "[‘’ʻʼ'`]",
          "replacement": ""
        },
        "ru_yo": { "type": "mapping", "mappings": ["ё => е", "Ё => Е"] }
      },
      "analyzer": {
        "uz_text": {
          "type": "custom",
          "char_filter": ["uz_apostrophes"],
          "tokenizer": "standard",
          "filter": ["lowercase"]
        },
        "ru_text": {
          "type": "custom",
          "char_filter": ["ru_yo"],
          "tokenizer": "standard",
          "filter": ["lowercase", "russian_stop", "russian_stemmer"]
        }
      },
      "filter": {
        "russian_stop": { "type": "stop", "stopwords": "_russian_" },
        "russian_stemmer": { "type": "stemmer", "language": "russian" }
      }
    }
  },
  "mappings": {
    "properties": {
      "title_ru": {
        "type": "text", "analyzer": "ru_text",
        "fields": { "suggest": { "type": "search_as_you_type", "analyzer": "ru_text" } }
      },
      "title_uz": {
        "type": "text", "analyzer": "uz_text",
        "fields": { "suggest": { "type": "search_as_you_type", "analyzer": "uz_text" } }
      },
      "description_ru": { "type": "text", "analyzer": "ru_text" },
      "description_uz": { "type": "text", "analyzer": "uz_text" },
      "category": { "type": "keyword" },
      "price": { "type": "integer" },
      "updated_at": { "type": "date" }
    }
  }
}
```

O‘zbek tili agglyutinativ: stemmersiz «kitoblar» va «kitob» — turli tokenlar. Buni qisman xatolarga chidamlilik va prefiks bo‘yicha qidiruv (quyida) yopadi. Foydalanuvchilarning real so‘rovlarida tekshiring, tokenlarga ajratishni esa `_analyze` API orqali ko‘ring.

`keyword` turi — filtrlanadigan va agregatsiya qilinadigan maydonlar uchun (kategoriya, brend, holat), `text` — qidiriladigan maydonlar uchun.

## 2-qadam. Asosiy baza bilan sinxronlash

| Yondashuv | Qanday ishlaydi | Afzallik va kamchiliklar |
|---|---|---|
| Davriy qayta indekslash | Vazifa `updated_at` o‘zgargan qatorlarni tanlab, Bulk API orqali yuboradi | Oddiy; qidiruv vazifa intervaliga kechikadi |
| Ilovadan hodisalar | Saqlashdan keyin ilova hodisani navbatga qo‘yadi, vorker indeksni yangilaydi | Deyarli real vaqtda; navbat va qayta urinishlar kerak |
| Change data capture | Vosita baza o‘zgarishlar jurnalini o‘qib, o‘zgarishlarni uzatadi | Barcha o‘zgarishlarni ushlaydi; ko‘proq infratuzilma |

Amaliy qoidalar:

- Ma’lumotlarni bittalab emas, **Bulk API** orqali paketlab yuboring.
- O‘chirishlarni aniq qayta ishlang, masalan `deleted_at` ustuni orqali.
- **Indeks aliasi** orqali o‘qing va yozing. To‘liq qayta qurish uchun yangi indeks yarating, to‘ldiring va aliasni to‘xtalishsiz almashtiring.

## 3-qadam. Xatolarga chidamlilik

`fuzziness: "AUTO"` so‘z uzunligiga qarab bir nechta belgini tuzatishga ruxsat beradi.

```json
GET /products/_search
{
  "query": {
    "multi_match": {
      "query": "telefn samsung",
      "fields": ["title_ru^3", "title_uz^3", "description_ru", "description_uz"],
      "fuzziness": "AUTO",
      "prefix_length": 1
    }
  }
}
```

`prefix_length: 1` birinchi harf mos kelishini talab qiladi — shovqin kamayadi va so‘rov tezlashadi. `^3` boost nomdagi mosliklarni tavsifdagidan yuqoriga ko‘taradi.

## 4-qadam. Avtoto‘ldirish

`search_as_you_type` maydoni prefiks bo‘yicha qidiruv uchun yordamchi ichki maydonlar yaratadi. Ularni `bool_prefix` orqali so‘rang:

```json
GET /products/_search
{
  "size": 5,
  "_source": ["title_ru", "title_uz"],
  "query": {
    "multi_match": {
      "query": "smartf",
      "type": "bool_prefix",
      "fields": [
        "title_ru.suggest", "title_ru.suggest._2gram", "title_ru.suggest._3gram",
        "title_uz.suggest", "title_uz.suggest._2gram", "title_uz.suggest._3gram"
      ]
    }
  }
}
```

Frontendda so‘rovni qisqa debounce bilan yuboring va eskirgan so‘rovlarni bekor qiling.

## Ko‘p uchraydigan xatolar

- Barcha tillar uchun standart analizatorli bitta `text` maydoni.
- Elasticsearch’ga brauzerdan to‘g‘ridan-to‘g‘ri murojaat. Uni backend ortida saqlang va hech qachon autentifikatsiyasiz internetga ochmang.
- Mapping’ni joyida o‘zgartirishga urinish. Mapping o‘zgarishlarining ko‘pchiligi yangi indeksga qayta indekslashni talab qiladi.

## FAQ

### Elasticsearch kerakmi yoki PostgreSQL qidiruvi yetadimi?

O‘rtacha hajmdagi katalog yoki blog uchun ko‘pincha trigrammalar bilan PostgreSQL to‘liq matnli qidiruvi yetarli. Elasticsearch murakkab relevantlik sozlamalari, og‘ir fasetli qidiruv yoki yuqori qidiruv yuklamasida o‘zini oqlaydi.

### Kirill yozuvidagi o‘zbekcha matn bilan nima qilish kerak?

Kontent yoki foydalanuvchilar yozuvlarni aralashtirsa, transliteratsiya qo‘shing: Elasticsearch’ga yuborishdan oldin ilovada indekslanadigan matnni ham, so‘rovni ham bitta yozuvga keltiring.

### Sinonimlarni qanday qo‘shish mumkin?

Qidiruv analizatorida «smartfon, telefon» kabi ro‘yxat bilan `synonym_graph` token filtridan foydalaning. Sinonimlar faqat qidiruv vaqtida qo‘llansa, ularni yangilash osonroq.
