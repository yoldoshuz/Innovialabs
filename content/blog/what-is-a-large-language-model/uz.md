---
title: Katta til modeli (LLM) nima va u qanday ishlaydi
description: LLM haqida sodda tushuntirish: model matnlardan qanday o‘rganadi, nega keyingi tokenni bashorat qiladi, nimalar qila oladi va biznes uchun cheklovlari.
summary: LLM — ulkan hajmdagi matnlarda keyingi matn bo‘lagini bashorat qilishga o‘rgatilgan neyron tarmoq; javob berish, qisqartirish va yozish shu ko‘nikmadan o‘sib chiqadi, lekin model ishonch bilan xato qilishi mumkin va sizning yangi ma’lumotlaringizni bilmaydi.
---
## Qisqacha: LLM nima

**Katta til modeli (Large Language Model, LLM)** — juda ko‘p matnlarda o‘rgatilgan va matnni davom ettira oladigan neyron tarmoq. Savolingizni olib, u bo‘lakma-bo‘lak eng mos davomni yaratadi, siz ko‘radigan javob ana shu.

ChatGPT, Claude, Gemini, Llama — bularning barchasi LLM yoki ular asosidagi mahsulotlar. «Katta» so‘zi parametrlar (ichki sozlanadigan sonlar) sonining va o‘quv ma’lumotlari hajmining ulkanligini bildiradi.

## Token nima

Model so‘zlar bilan emas, **tokenlar** bilan ishlaydi. Token — matn bo‘lagi: butun so‘z, so‘zning bir qismi yoki tinish belgisi. Uzun yoki kam uchraydigan so‘z bir nechta tokenga bo‘linishi mumkin.

Tokenlar ikki amaliy narsaga ta’sir qiladi:

- **narx** — API’lar odatda kirish va chiqishdagi tokenlar soni bo‘yicha hisoblanadi;
- **kontekst oynasi** — model bir vaqtda qancha tokenni hisobga ola oladi (so‘rovingiz, hujjatlar va o‘z javobi).

## LLM qanday o‘rgatiladi

O‘qitish bir necha bosqichda o‘tadi.

1. **Oldindan o‘qitish.** Modelga ulkan matnlar korpusi ko‘rsatiladi va keyingi tokenni topishga o‘rgatiladi. Xato qilsa, ichki og‘irliklar biroz tuzatiladi. Son-sanoqsiz marta takrorlangan bu jarayon modelga grammatika, faktlar, uslub va mantiqiy bog‘lanishlarni o‘zlashtirishga majbur qiladi.
2. **Ko‘rsatmalar bo‘yicha qo‘shimcha o‘qitish.** «Savol — yaxshi javob» misollarida model shunchaki matnni davom ettirish emas, so‘rovlarga amal qilishni o‘rganadi.
3. **Fikr-mulohaza asosida o‘qitish.** Odamlar yoki boshqa modellar javoblarni baholaydi va model foydali, xavfsiz va aniq javoblar tomon siljitiladi.

Zamonaviy LLM’lar **Transformer** arxitekturasiga va **e’tibor (attention)** mexanizmiga asoslangan: har bir tokenni yaratishda model kontekstning qaysi qismlari muhimroq ekanini «tortib ko‘radi».

## Nega oddiy bashorat shuncha ko‘nikma beradi

Har qanday matnning davomini yaxshi topish uchun model ma’noni ilg‘ashi kerak. Shuning uchun bitta qobiliyat turli vazifalarga aylanadi:

| Vazifa | Model uchun qanday ko‘rinadi |
|---|---|
| Savolga javob | «Savol» matnini eng ehtimoliy javob bilan davom ettirish |
| Qisqartirish | Uzun matnni uning qisqa bayoni bilan davom ettirish |
| Tarjima | Matnni boshqa tilda xuddi shu ma’no bilan davom ettirish |
| Kod yozish | Vazifa tavsifini kod bilan davom ettirish |
| Tasniflash | Mijoz murojaatini kerakli toifa bilan davom ettirish |

## Asosiy cheklovlar

LLM’ni biznes jarayonlariga qo‘shishdan oldin ularni tushunish muhim.

- **Gallyutsinatsiyalar.** Model faktlarni tekshirmaydi, ishonarli matn yaratadi. U raqam, havola yoki nomni ishonch bilan to‘qib chiqarishi mumkin.
- **Bilimlar chegarasi.** Model dunyoni faqat o‘qitish tugagan sanagacha biladi va siz bermaguningizcha ichki ma’lumotlaringizni bilmaydi.
- **Cheklangan kontekst.** Oynaga sig‘magan narsani model ko‘rmaydi.
- **Nodeterminizm.** Bir xil so‘rovga javoblar biroz farq qilishi mumkin.
- **Aniq hisob-kitobda zaiflik.** Arifmetika va qat’iy mantiqni kod yoki tashqi vositalarga topshirish ishonchliroq.
- **Maxfiylik.** Bulutli modelga yuborgan ma’lumotlaringiz qayerga ketishini bilish kerak.

## Amalda bu cheklovlar qanday chetlab o‘tiladi

- **RAG (Retrieval-Augmented Generation)** — javobdan oldin tizim kompaniyaning kerakli hujjatlarini topadi va ularni savol bilan birga modelga uzatadi.
- **Vositalar (tool use)** — model taxmin qilish o‘rniga kalkulyator, qidiruv, ma’lumotlar bazasi yoki API’ni chaqiradi.
- **Aniq promptlar** — rol, javob formati, misollar va manbalarda yo‘q narsani to‘qimaslik taqiqi.
- **Inson tekshiruvi** — xato narxi yuqori bo‘lgan joylarda: yuridik, tibbiy, moliyaviy matnlar.

## FAQ

### LLM matnni inson kabi tushunadimi?

Insoniy ma’noda yo‘q. Model tilning statistik qonuniyatlarini shunchalik yaxshi o‘rganganki, javoblari mazmunli ko‘rinadi, lekin uning o‘z tajribasi yoki niyatlari yo‘q va inson xato qilmaydigan joyda xato qilishi mumkin.

### Nega ChatGPT ba’zan faktlarni to‘qib chiqaradi?

Chunki uning vazifasi tekshirilgan faktni topish emas, ehtimoliy davomni yaratish. Kontekstda aniq ma’lumot bo‘lmasa, model bo‘shliqni ishonarli to‘qima bilan to‘ldirishi mumkin. RAG, manbalarga havolalar va tekshiruv yordam beradi.

### LLM’ni kompaniyam ma’lumotlarida o‘rgatish mumkinmi?

Ko‘pincha modelni qayta o‘qitish shart emas: kerakli hujjatlarni RAG orqali uzatish yetarli. Fine-tuning ko‘p sonli bir xil vazifalarda alohida uslub yoki javob formati kerak bo‘lganda mantiqli.
