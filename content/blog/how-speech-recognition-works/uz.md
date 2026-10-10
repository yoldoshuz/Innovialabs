---
title: Nutqni tanish (ASR) qanday ishlaydi: tovushdan matngacha
description: ASR tizimi audioni qanday matnga aylantiradi, WER nima, nega aksent, shovqin va tillar aralashuvi xalaqit beradi hamda biznes uni qayerda qo‘llaydi.
summary: ASR tovush to‘lqinini belgilarga aylantiradi, neyron tarmoq ularni so‘zlarga moslaydi, til modeli esa eng ehtimolli matnni tanlaydi. Sifat WER bilan o‘lchanadi va doim o‘z yozuvlaringizda tekshiriladi.
---
## Qisqacha: ASR nima qiladi

**ASR (Automatic Speech Recognition)** — nutqni matnga aylantiruvchi texnologiya. Kirishda audiofayl yoki mikrofondan oqim, chiqishda esa ko‘pincha vaqt belgilari va so‘zlovchilar ajratilgan transkripsiya bo‘ladi.

Ichida bu bosqichlar zanjiri: tovushni tayyorlash, belgilarni ajratish, akustik model, tilni hisobga olgan dekodlash va matnni qayta ishlash.

## Pipeline: tovushdan matngacha

1. **Audioni tayyorlash.** Yozuv bitta diskretlash chastotasiga, mono formatga keltiriladi, ovoz balandligi normallashtiriladi. Ba’zan shovqin kamaytiriladi va sukunat kesib tashlanadi (VAD — voice activity detection).
2. **Belgilarni ajratish.** Tovush to‘lqini qisqa oynalarga bo‘linib, spektrogrammaga aylantiriladi — har lahzada qaysi chastotalar yangrayotganini ko‘rsatuvchi tasvir. Ko‘pincha inson qulog‘i idrokiga yaqin **mel-spektrogramma** ishlatiladi.
3. **Akustik model.** Neyron tarmoq spektrogrammaga qarab qaysi tovushlar, harflar yoki so‘z bo‘laklari aytilganini bashorat qiladi.
4. **Dekodlash.** Ko‘plab variantlar orasidan eng ehtimolli so‘zlar ketma-ketligi tanlanadi. Bunda **til modeli** yordam beradi: u qaysi so‘z birikmalari tilda tez-tez uchrashini biladi.
5. **Qayta ishlash.** Tinish belgilari, bosh harflar, «ikki yuz ellik»ni «250» ga aylantirish, so‘zlovchilarni ajratish (diarization).

Zamonaviy tizimlar ko‘pincha 3–4-bosqichlarni bitta **end-to-end modelga** birlashtiradi: u juda ko‘p «audio — matn» juftliklarida o‘qitilgan va tayyor jumlani darhol beradi.

## Sifat qanday o‘lchanadi: WER

Asosiy metrika — **WER (Word Error Rate)**, so‘zlar darajasidagi xatolar ulushi:

```text
WER = (S + D + I) / N
```

- **S** — almashtirishlar (bir so‘z o‘rniga boshqasi tanilgan);
- **D** — tushib qolgan so‘zlar;
- **I** — ortiqcha qo‘shilgan so‘zlar;
- **N** — etalon transkripsiyadagi so‘zlar soni.

WER qancha past bo‘lsa, shuncha yaxshi. So‘z chegaralari aniq bo‘lmagan tillar uchun **CER** — xuddi shu narsa belgilar darajasida ishlatiladi.

Muhim: boshqalarning benchmarkidagi WER sizning ma’lumotlaringiz haqida kam narsa aytadi. Toza studiya nutqida a’lo ishlaydigan model call-markaz yozuvlarida ancha yomonroq natija berishi mumkin.

## Tanishni nima yomonlashtiradi

| Omil | Nega xalaqit beradi | Nima yordam beradi |
|---|---|---|
| Shovqin va aks-sado | So‘z qismlarini yashiradi | Yaxshi mikrofon, shovqinni bostirish, shovqinli ma’lumotlarda o‘qitilgan modellar |
| Aksent va shevalar | Talaffuz o‘qitish ma’lumotlaridan farq qiladi | O‘z yozuvlaringizda qo‘shimcha o‘qitish, kerakli tillarni biladigan model |
| Code-switching | Jumla ichida til almashadi | Ko‘p tilli modellar, atamalar lug‘ati |
| Telefon kanali | Tor chastota diapazoni, siqish | Telefon nutqi uchun modellar |
| Atamalar va ismlar | Model kam uchraydigan so‘zlarni bilmaydi | Hotwords, maxsus lug‘at |
| Gap bo‘lish | Ovozlar ustma-ust tushadi | Diarization, alohida yozuv kanallari |

**Code-switching** O‘zbekiston uchun ayniqsa dolzarb: bitta jumlada o‘zbek, rus tillari va inglizcha atamalar oson aralashadi. Har bir model bunga bardosh bermaydi, shuning uchun aynan shunday yozuvlarda tekshirish kerak.

## Biznes ASR ni qayerda qo‘llaydi

- **Call-markazlar:** qo‘ng‘iroqlarni transkripsiya qilish, suhbatlar bo‘yicha qidiruv, skriptlarga rioya qilishni nazorat qilish, CRM ni avtomatik to‘ldirish.
- **Ovozli xabarlar:** messenjer va chat-botlardagi audioni matnga aylantirish.
- **Ovozli assistentlar va IVR:** mijoz gapiradi, tizim so‘rovni tushunib, yo‘naltiradi.
- **Uchrashuv va intervyular:** bayonnomalar, subtitrlar, LLM orqali qisqa xulosalar.
- **Media:** video uchun subtitrlar, arxiv bo‘yicha qidiruv.

## Yechimni qanday tanlash

- Odatiy sharoitdagi **30–50 ta real yozuv** to‘plang va ular uchun etalon transkripsiya tayyorlang.
- Bir nechta modelni sinab, WER ni o‘z ma’lumotlaringizda hisoblang.
- **Real vaqt** rejimi kerakmi yoki paketli ishlov yetarlimi — hal qiling.
- Audioni bulutga yuborish mumkinmi yoki ma’lumot talablari sababli **lokal o‘rnatish** kerakmi — aniqlang.
- Qayta ishlashni hisobga oling: tinish belgilari, raqamlar, so‘zlovchilarni ajratish.

## FAQ

### O‘zbek nutqini tanish mumkinmi?

Ha, bir qator ko‘p tilli modellar o‘zbek tilini qo‘llab-quvvatlaydi, lekin sifat model va yozuv sharoitlariga kuchli bog‘liq. O‘z audiolaringizda tekshiring, ayniqsa nutqda tillar aralashsa.

### ASR ovozli assistentdan nimasi bilan farq qiladi?

ASR faqat nutqni matnga aylantiradi. Assistent esa ma’noni tushunadi (ko‘pincha LLM yordamida), harakatni bajaradi va nutq sintezi (TTS) orqali ovozli javob berishi mumkin.

### O‘z modelimni o‘qitishim kerakmi?

Ko‘pincha yo‘q: tayyor model va atamalar lug‘ati yetarli. Qo‘shimcha o‘qitish ma’lumotlaringizda xatolar juda ko‘p qolganda — masalan, o‘ziga xos leksika yoki aksentlar tufayli — mantiqli bo‘ladi.
