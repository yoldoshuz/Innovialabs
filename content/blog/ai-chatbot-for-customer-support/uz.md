---
title: Mijozlarni qo‘llab-quvvatlash uchun AI chat-bot: to‘g‘ri joriy etish
description: AI qo‘llab-quvvatlash botini ishga tushirish: bilimlar bazasini tayyorlash, operatorga uzatish, ko‘p tilli javoblar, metrikalar va joriy etish bosqichlari.
summary: Yaxshi AI qo‘llab-quvvatlash boti faqat tekshirilgan bilimlar bazasidan javob beradi, murakkab savollarni odamga muammosiz uzatadi va har bosqichda deflection rate hamda CSAT o‘lchanib, bosqichma-bosqich ishga tushiriladi.
---

## Qisqacha: «to‘g‘ri joriy etish» nimani anglatadi

AI qo‘llab-quvvatlash chat-boti — bu «saytdagi ChatGPT» emas. U uch qismdan iborat:

- **bilimlar bazasi** — tekshirilgan javoblar, qoidalar, tariflar, yo‘riqnomalar;
- **bazadan qidiruvli LLM (RAG)** — model o‘z «xotirasidan» emas, topilgan parchalarga tayanib javob beradi;
- **operatorga uzatish** — bot javob berishni to‘xtatib, odamni chaqiradigan aniq lahza.

Bulardan biri bo‘lmasa, bot yo javoblarni o‘ylab topadi, yo mijozlarning asabiga tegadi. To‘g‘ri joriy etish — bot odatiy savollarni yopadi, qolgan hammasi esa tezda odamlarga yetib boradi.

## 1-qadam. Bilimlar bazasini tayyorlash

Bot sifati deyarli butunlay baza sifatiga bog‘liq. Model eskirgan narxlar ro‘yxatini yoki bir-biriga zid yo‘riqnomalarni tuzatmaydi.

Ishga tushirishdan oldin:

- Chatlar, pochta va qo‘ng‘iroqlardan **mijozlarning haqiqiy savollarini** yig‘ing va mavzular bo‘yicha guruhlang.
- Har bir tez-tez uchraydigan mavzu uchun **qisqa namunaviy javob** yozing: bitta savol — bitta maqola.
- Takrorlar va qarama-qarshiliklarni olib tashlang. Ikki hujjat turlicha javob bersa, bot adashadi.
- **Baza egasini** tayinlang: narxlar, muddatlar va qoidalar o‘zgarganda uni yangilaydigan odam.
- Bot **muhokama qilmasligi kerak** bo‘lgan mavzularni belgilang: qoidadan tashqari pul qaytarish, huquqiy nizolar, shikoyatlar.

Format oddiy bo‘lgani ma’qul: savol-sarlavha, 3–7 gapli javob, yangilangan sana.

## 2-qadam. Operatorga uzatish (handoff)

Handoff — eng kam baholanadigan qism. Mijoz odamga oson chiqa olishi, operator esa kontekstni darhol ko‘rishi kerak.

Bot suhbatni qachon uzatadi:

- mijoz to‘g‘ridan-to‘g‘ri operatorni so‘raganda;
- bazada javob bo‘lmasa yoki qidiruv ishonchi past bo‘lsa;
- mavzu «taqiqlangan» ro‘yxatda bo‘lsa: pul, da’volar, shaxsiy ma’lumotlar;
- mijoz savolni ikki marta takrorlasa yoki aniq norozi bo‘lsa.

Operator qayta so‘ramasligi uchun botdan **butun yozishma va qisqa xulosa** olishi kerak. Onlayn operator bo‘lmasa, bot qachon javob berilishini rostini aytadi va kontaktni yig‘adi.

## 3-qadam. Ko‘p tilli javoblar

Zamonaviy LLMlar ko‘plab tillarni, jumladan rus, o‘zbek va ingliz tillarini tushunadi va ularda yozadi. Ammo nozik jihatlar bor:

- **Savol qaysi tilda bo‘lsa, o‘sha tilda** javob bering — buni tizim yo‘riqnomasida yozib qo‘ying.
- Baza faqat bitta tilda bo‘lsa, model o‘zi tarjima qiladi, lekin **atamalar, tarif nomlari va raqamlarni** alohida tekshiring.
- O‘zbek tili uchun yozuvni (lotin yoki kirill) belgilab qo‘ying, aks holda bot ularni aralashtirib yuborishi mumkin.
- Mijozlarning haqiqiy iboralarida, jumladan aralash tillar va xatolar bilan sinab ko‘ring.

## 4-qadam. Muvaffaqiyat metrikalari

Metrikalarsiz bot yordam beryaptimi yoki xalaqit beryaptimi — bilib bo‘lmaydi.

| Metrika | Nimani ko‘rsatadi |
|---|---|
| **Deflection rate** | Operatorsiz bot yopgan murojaatlar ulushi |
| **CSAT** | Suhbatdan keyingi mijoz bahosi |
| **Handoff rate** | Bot qanchalik tez-tez odamni chaqiradi |
| **Birinchi javob vaqti** | Mijoz reaksiyani qanchalik tezroq oladi |
| **Noto‘g‘ri javoblar ulushi** | Tanlab, qo‘lda tekshiriladi |

Metrikalarga **birgalikda** qarang. Yuqori deflection va pasayayotgan CSAT bot mijozlarga yordam bermay, ularni «qaytarayotganini» bildiradi.

## 5-qadam. Joriy etish bosqichlari

1. **Jamoa ichida pilot.** Operatorlar botga haqiqiy savollar beradi va xatolarni belgilaydi.
2. **Maslahat rejimi.** Bot javob qoralamasini taklif qiladi, operator uni yuboradi yoki tahrirlaydi.
3. **Cheklangan ishga tushirish.** Bot bir nechta tez-tez uchraydigan mavzular bo‘yicha javob beradi, qolganlari darhol operatorga o‘tadi.
4. **Kengaytirish.** Baza va metrikalar imkon bergani sari mavzular qo‘shiladi.
5. **Doimiy qo‘llab-quvvatlash.** Past baholangan suhbatlarni muntazam tahlil qilib, bazani yangilaysiz.

## Ko‘p uchraydigan xatolar

- Modelni bilimlar bazasisiz ulab, u «o‘zi biladi» deb umid qilish.
- «Operator bilan bog‘lanish» tugmasini yashirish.
- Darhol barcha mijozlar va barcha mavzular uchun ishga tushirish.
- Narx va shartlar o‘zgargandan keyin bazani yangilamaslik.
- Faqat deflectionni hisoblab, mijoz baholarini e’tiborsiz qoldirish.

## FAQ

### Bot operatorlarni to‘liq almashtira oladimi?

Yo‘q, maqsad ham bu emas. Bot takrorlanuvchi savollarni o‘z zimmasiga oladi, murakkab, nizoli va nostandart holatlar esa odamlarda qoladi. Operatorlar aynan shunday murojaatlarga ko‘proq vaqt topadi.

### Bot noto‘g‘ri javob bersa nima qilish kerak?

Sababini toping: eskirgan maqola, bazada javob yo‘qligi yoki yo‘riqnomaning noaniq ifodasi. Bitta suhbatni emas, manbani tuzating va bu holatni test savollari to‘plamiga qo‘shing.

### Botni qayerda ishga tushirgan ma’qul: saytdami yoki messenjerdami?

Mijozlar ko‘pincha qayerga yozsa, o‘sha yerda. Mantiq va bilimlar bazasi bir xil qoladi, sayt, Telegram va boshqa kanallar esa alohida interfeys sifatida ulanadi.
