---
title: Ollama yordamida LLM’ni lokal ishga tushirish
description: Ollama’ni bosqichma-bosqich o‘rnatish, RAM va GPU’ga mos model tanlash, lokal API bilan ishlash hamda sifat va tezlik bo‘yicha real kutilmalar.
summary: Ollama’ni o‘rnating, xotirangizga sig‘adigan modelni yuklab oling va unga 11434-portdagi lokal API orqali murojaat qiling; lokal modellar maxfiy va oddiy vazifalar uchun yaxshi, lekin yirik bulutli modellardan ortda qoladi.
---

## Qisqacha: Ollama nima va u nima uchun kerak

**Ollama** — ochiq til modellarini yuklab olib, ularni kompyuteringiz yoki serveringizda ishga tushiradigan bepul vosita. Ma’lumotlar bulutga ketmaydi, tokenlar uchun to‘lov yo‘q, model yuklab olingandan keyin internetsiz ham ishlaydi.

Lokal LLM uchun odatiy vazifalar:

- kompaniya ichidagi maxfiy hujjatlarni qayta ishlash;
- API xarajatlarisiz prototiplar va tajribalar;
- oddiy vazifalar: klassifikatsiya, maydonlarni ajratib olish, matn qoralamalari;
- tashqi tarmoqqa chiqishsiz yopiq muhitda ishlash.

## 1-qadam. O‘rnatish

- **macOS va Windows** — rasmiy saytdan o‘rnatuvchini yuklab olib, ishga tushiring.
- **Linux** — rasmiy skriptni bajaring:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

O‘rnatilgandan so‘ng Ollama fon servisi sifatida ishlaydi. Tekshirib ko‘ring:

```bash
ollama --version
```

## 2-qadam. Uskunangizga mos model tanlash

Asosiy cheklov — **xotira**. Model GPU video xotirasiga yoki GPU bo‘lmasa, operativ xotiraga sig‘ishi kerak. Parametrlar qancha ko‘p bo‘lsa, model shuncha aqlli va shuncha ko‘p xotira talab qiladi.

Ollama hujjatlaridagi yo‘nalish:

| Model hajmi | Minimal RAM |
|---|---|
| taxminan 7B parametr | 8 GB |
| taxminan 13B | 16 GB |
| taxminan 33B | 32 GB |

Nimalarni hisobga olish kerak:

- **Kvantizatsiya** (masalan, 4-bitli versiyalar) modelni ancha kichraytiradi, sifat esa biroz pasayadi. Ollama kutubxonasidagi ko‘pchilik modellar allaqachon kvantizatsiya qilingan.
- **GPU** generatsiyani protsessorga nisbatan bir necha barobar tezlashtiradi. GPU bo‘lmasa, kichik modellarni tanlang.
- Uzun kontekst ham xotira sarflaydi — zaxira qoldiring.
- O‘zbek va rus tillari uchun modellarni o‘z matnlaringizda sinang: sifat sezilarli farq qiladi.

## 3-qadam. Ishga tushirish va suhbat

```bash
ollama pull llama3.2
ollama run llama3.2
```

`run` buyrug‘i terminalda chat ochadi. Foydali buyruqlar:

- `ollama list` — o‘rnatilgan modellar;
- `ollama ps` — hozir xotiraga nima yuklangan;
- `ollama rm <model>` — modelni o‘chirib, diskni bo‘shatish.

## 4-qadam. Lokal API

Ollama `http://localhost:11434` manzilida HTTP API ishga tushiradi. Ilovangizni unga ulashingiz mumkin:

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "llama3.2",
  "messages": [{"role": "user", "content": "Docker nima ekanini qisqacha tushuntir"}],
  "stream": false
}'
```

Shuningdek, **OpenAI bilan mos** `/v1/chat/completions` endpoint’i bor, shuning uchun ko‘plab mavjud SDK va kutubxonalar bazaviy URL almashtirilgach Ollama bilan ishlaydi. Batafsil — [Ollama hujjatlarida](https://github.com/ollama/ollama/blob/main/docs/api.md).

API boshqa kompyuterdan kerak bo‘lsa, portni himoyasiz internetga ochmang: Ollama’da o‘rnatilgan avtorizatsiya yo‘q. Oldiga autentifikatsiyali reverse proxy qo‘ying yoki VPN ishlating.

## Real kutilmalar

- **Sifat.** Kichik lokal modellar murakkab mulohaza, dasturlash va kam tarqalgan tillarda yetakchi bulutli modellardan ortda qoladi. Oddiy va tor vazifalar uchun ko‘pincha yetarli.
- **Tezlik.** GPU’siz noutbukda javob sekin yaratiladi, ayniqsa yirik modellarda. Birinchi so‘rov uzoqroq — model xotiraga yuklanadi.
- **Yuklama.** Bitta kompyuter cheklangan miqdordagi parallel so‘rovlarga xizmat qiladi. Jamoa yoki mahsulot uchun GPU’li alohida server kerak.
- **Xizmat ko‘rsatish.** Modellarni yangilash, monitoring va xavfsizlik endi sizning zimmangizda.

## Ko‘p uchraydigan xatolar

- Xotiraga sig‘maydigan modelni yuklab olib, swap tufayli juda sekin ishlashga duch kelish.
- Kichik lokal modelni flagman bulutli model bilan solishtirib, hafsalasi pir bo‘lish.
- 11434-portni himoyasiz tashqariga ochish.
- Joriy qilishdan oldin modelni real ma’lumotlarda sinamaslik.

## FAQ

### Ollama’ni videokartasiz ishga tushirish mumkinmi?

Ha, Ollama protsessorda ishlaydi. Lekin generatsiya sekinroq bo‘ladi, shuning uchun kichik modellarni tanlang.

### Ollama’da maxfiy ma’lumotlarni qayta ishlash xavfsizmi?

Model lokal ishlaydi va ma’lumotlar tashqi servislarga yuborilmaydi. Biroq umumiy xavfsizlik kompyuter yoki server hamda API’ga kirish qanchalik himoyalanganiga bog‘liq.

### Ollama production uchun mos keladimi?

O‘rtacha yuklamali ichki vositalar uchun — ha. Yuqori parallel yuklama uchun odatda maxsus inference serverlari yoki bulutli API’lar ishlatiladi.
