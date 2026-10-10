---
title: "LLM kvantlash: 8 bit, 4 bit, GGUF va sifat yo‘qotilishi"
description: Kvantlash LLM’ni qanday kichraytiradi, 8 bit, 4 bit, GGUF, GPTQ va AWQ farqi nimada va o‘z vazifalaringizda sifat pasayishini qanday o‘lchash mumkin.
summary: Kvantlash model og‘irliklarini kamroq bitda saqlab, xotirani tejaydi va ko‘pincha tezlashtiradi; 8 bit odatda aslidan deyarli farq qilmaydi, 4 bit amaliy murosa, sifatni esa faqat o‘z ma’lumotlaringizda ishonchli tekshirish mumkin.
---
## Kvantlash nima qiladi

Til modeli asosan ulkan sonlar to‘plami — **og‘irliklar**dan iborat. Odatda ular 16 bitli suzuvchi nuqtali sonlar (FP16 yoki BF16) sifatida saqlanadi. **Kvantlash** ularni kamroq bitda saqlaydi: 8, 4 yoki undan ham kam.

Natija oddiy arifmetika. 7B parametrli modelga 16 bitda taxminan 14 GB, 8 bitda taxminan 7 GB, 4 bitda esa taxminan 3,5-4 GB kerak (qo‘shimcha xarajatlardan tashqari). Bu quyidagilarga imkon beradi:

- modelni kichikroq yoki arzonroq GPU’da, hatto CPU yoki noutbukda ishga tushirish;
- o‘sha uskunaga kattaroq modelni sig‘dirish;
- KV-kesh uchun xotira bo‘shatib, ko‘proq parallel so‘rovga xizmat qilish;
- ko‘pincha generatsiyani tezlashtirish, chunki xotira orqali kamroq ma’lumot o‘tadi.

Buning narxi — **aniqlik**. Bit kamaysa, yaxlitlash xatolari ko‘payadi va model biroz kamroq aniq bo‘lib qolishi mumkin.

## Qisqacha qanday ishlaydi

Haqiqiy qiymatlar diapazoni kichik butun sonli darajalar to‘plamiga moslanadi. 4 bitda atigi 16 ta daraja bor, shuning uchun usullar ularni qanchalik aqlli tanlashi bilan farqlanadi:

- **Guruhlar bo‘yicha masshtab** — og‘irliklar o‘z masshtabiga ega kichik guruhlarga bo‘linadi, shunda chetga chiqqan qiymatlar butun matritsani buzmaydi.
- **Kalibrlash** — ba’zi usullar qaysi og‘irliklar muhimroq ekanini aniqlash uchun model orqali namunaviy ma’lumotlarni o‘tkazadi.
- **Aralash aniqlik** — sezgir qatlamlar ko‘proq bit oladi, qolganlari kamroq.

## Format va usullarni taqqoslash

| Usul / format | Qayerda ishlatiladi | Asosiy g‘oya |
|---|---|---|
| **8 bit (INT8, FP8)** | GPU serverlar, vLLM, TensorRT-LLM | Sifat yo‘qotilishi minimal, xotira taxminan ikki baravar kam |
| **GPTQ** | GPU’da inference | 4 bit, kalibrlash ma’lumotlari xatoni qatlamma-qatlam kamaytiradi |
| **AWQ** | GPU’da inference | 4 bit, aktivatsiyalar uchun muhim og‘irliklarni himoya qiladi |
| **bitsandbytes (NF4)** | Hugging Face, QLoRA fine-tuning | Yuklashda kvantlaydi, tajriba va o‘qitish uchun qulay |
| **GGUF** | llama.cpp, Ollama, LM Studio | CPU va aralash CPU/GPU uchun fayl formati, Q8_0, Q5_K_M, Q4_K_M kabi darajalar |

**GGUF** — bitta usul emas, balki konteyner format. Daraja nomida yozilgan: `Q8_0` — 8 bit, `Q4_K_M` — mashhur 4 bitli «K-quant» varianti. Raqam katta bo‘lsa — bit ko‘p va sifat yuqori, kichik bo‘lsa — fayl kichikroq.

## Qancha sifat yo‘qotiladi

Kafolat emas, umumiy qonuniyatlar:

- **8 bit** ko‘pchilik vazifalarda odatda aslidan deyarli farq qilmaydi.
- **5-6 bit** — xavfsiz o‘rta yo‘l.
- **4 bit** — keng tarqalgan murosa: sezilarli darajada kichik, ko‘pincha yetarlicha yaxshi, lekin murakkab mulohaza, matematika, kod va kam tarqalgan tillarda yo‘qotishlar ko‘rinadi.
- **3 bit va undan past** tez yomonlashadi, ayniqsa kichik modellarda.

Katta modellar odatda kvantlashni kichiklariga qaraganda yaxshiroq ko‘taradi. Kvantlangan katta model xotira hajmi o‘xshash bo‘lgan to‘liq aniqlikdagi kichik modeldan ustun kelishi mumkin.

## O‘z vazifangiz uchun pasayishni qanday o‘lchash mumkin

Ommaviy benchmarklar model sizning ma’lumotlaringizda qanday ishlashini ko‘rsatmaydi. O‘zingiz tekshiring:

1. **Eval to‘plam yig‘ing** — o‘z sohangizdan kutilgan javoblar yoki baholash mezonlari bilan 50-200 ta real so‘rov.
2. **Bazaviy versiyani ishga tushiring** — o‘sha modelni 16 yoki 8 bitda.
3. **Kvantlangan variantlarni ishga tushiring** — masalan Q8, Q5, Q4 — bir xil promptlar va temperature 0 bilan.
4. **Javoblarni baholang** — tuzilgan vazifalar uchun aniq moslik, erkin matn uchun LLM-as-judge yoki qo‘lda tekshirish.
5. **Format xatolarini tekshiring** — buzilgan JSON yoki muvaffaqiyatsiz tool call’lar ko‘pincha umumiy sifat pasayishidan oldin paydo bo‘ladi.
6. **Tezlik va xotirani o‘lchang** — real yuklama ostida.

Perplexity bitta modelning kvantlashlarini solishtirishda foydali tezkor signal, lekin o‘z vazifalaringizdagi testlar o‘rnini bosmaydi.

## Qanday tanlash kerak

- **GPU xotirasi yetarlimi?** 16 yoki 8 bitni oling va tavakkal qilmang.
- **GPU byudjeti cheklanganmi?** 4 bitli AWQ yoki GPTQ’ni sinab ko‘ring va eval to‘plamingizda tekshiring.
- **CPU, noutbuk yoki edge qurilmami?** llama.cpp yoki Ollama bilan GGUF; Q4_K_M yoki Q5_K_M dan boshlang.
- **Kichik GPU’da fine-tuning?** Standart yo‘l — 4 bitli bitsandbytes bilan QLoRA.

## Ko‘p uchraydigan xatolar

- Real vazifalarni tekshirmasdan eng kichik faylni tanlash.
- Bir vaqtda turli modellar va turli kvantlashlarni solishtirish — farqni nima keltirib chiqargani noma’lum qoladi.
- KV-keshga ham xotira kerakligini unutish — og‘irliklar to‘liq manzara emas.
- Kvantlangan model boshqa tilda ham ingliz tilidagidek ishlaydi deb o‘ylash.

## FAQ

### 4 bit production uchun yetarlimi?

Chat, klassifikatsiya va qisqacha mazmun uchun ko‘pincha ha, lekin hammasi vazifaga bog‘liq. Qaror qabul qilishdan oldin eval to‘plamingizni 8 yoki 16 bitli bazaviy versiyaga qarshi sinab ko‘ring.

### GGUF va GPTQ farqi nimada?

GGUF — llama.cpp asosidagi vositalar uchun fayl formati, asosan CPU va aralash uskunaga mo‘ljallangan. GPTQ — ko‘pincha GPU’da inference uchun ishlatiladigan kvantlash usuli. Ular turli ishga tushirish muhitlariga yo‘naltirilgan.

### Kvantlash modelni tezlashtiradimi?

Odatda ha, chunki xotira orqali kamroq ma’lumot o‘tadi. Haqiqiy tezlashish uskunaga va ishga tushirish muhitida shu format uchun optimallashtirilgan yadrolar borligiga bog‘liq.
