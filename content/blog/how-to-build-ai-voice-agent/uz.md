---
title: Telefon qo‘ng‘iroqlari uchun ovozli AI-agentni qanday yaratish kerak
description: Ovozli AI-agent nimalardan iborat: ASR, LLM va TTS zanjiri, telefoniyaga ulash, kechikish byudjeti, gapni bo‘lishni qayta ishlash va operatorga o‘tkazish.
summary: Ovozli agent — SIP yoki bulutli ATS orqali telefoniyaga ulangan «nutqni tanish → LLM → nutq sintezi» zanjiri; muvaffaqiyatni past kechikish, gap bo‘linishini to‘g‘ri qayta ishlash va insonga o‘tkazishning aniq qoidalari belgilaydi.
---

## Ovozli agent qanday tuzilgan

Ovozli AI-agent bitta model emas, balki oqim rejimida ishlaydigan **uch bo‘g‘inli zanjir**:

1. **ASR** (speech-to-text) mijoz nutqini matnga aylantiradi.
2. **LLM** so‘rovni tushunadi, kerakli funksiyalarni chaqiradi (buyurtmani tekshirish, qabulga yozish) va javob tuzadi.
3. **TTS** (text-to-speech) javobni ovozga aylantiradi.

Zanjir atrofida **telefoniya** (qo‘ng‘iroq agentga qanday yetib keladi), **VAD** (odam gapira boshlagani yoki tugatganini aniqlash), **instrumentlar** (CRM, jadval, buyurtmalar bazasi API’lari) va **logging** bor.

Audioni to‘g‘ridan-to‘g‘ri qabul qilib, audio qaytaradigan speech-to-speech modellar ham mavjud. Ular tezroq javob beradi, lekin ularni nazorat qilish qiyinroq. Klassik zanjirni sozlash osonroq va alohida bo‘g‘inlarni almashtirish mumkin.

## Telefoniyaga ulash

Asosiy variantlar:

- Aloqa operatoringiz yoki bulutli ATS’dan **SIP-trank** → media server (masalan, Asterisk yoki FreeSWITCH) → agentga audio oqim.
- Qo‘ng‘iroq audiosini WebSocket orqali uzatadigan **bulutli ovoz platformalari**.
- Telefoniya ichiga o‘rnatilgan, faqat mantiqni sozlaysiz bo‘lgan **tayyor ovozli agent platformalari**.

E’tibor bering: telefon ovozi odatda tor polosada (8 kHz) keladi. ASR va VAD’ni aynan shunday audioda tekshiring.

## Kechikish byudjeti

Odam suhbatdagi pauzani juda tez sezadi. Shuning uchun kechikish bo‘g‘inlar bo‘yicha taqsimlanadi va har biri optimallashtiriladi:

| Bo‘g‘in | Nimaga bog‘liq | Qanday tezlashtirish |
|---|---|---|
| Gap tugashini aniqlash | VAD sozlamalari | Jimlik chegarasini juda uzun qilmay tanlash |
| ASR | Oqimli yoki paketli rejim | Oqimli tanishdan foydalanish |
| LLM | Model hajmi, prompt uzunligi | Tez model, qisqa kontekst, token striming |
| TTS | Birinchi tovushgacha vaqt | Oqimli sintez, gaplar bo‘yicha ovozlashtirish |
| Tarmoq | Serverlar joylashuvi | Servislarni bir-biriga va telefoniyaga yaqin saqlash |

Asosiy usul — **barcha bosqichlarda striming**: LLM ikkinchi gapni yozayotganda TTS birinchisini aytishni boshlaydi. Uzoq operatsiyalarda (bazadan qidirish) agent qisqa to‘ldiruvchi ibora aytishi mumkin.

## Gapni bo‘lish (barge-in)

Mijozlar gapni bo‘ladi — bu normal holat. Agent quyidagilarni bajarishi kerak:

- VAD mijoz nutqini eshitishi bilan TTS’ni **darhol to‘xtatish**;
- javob bo‘linganini va qaysi qismi eshitilganini **kontekstda hisobga olish**;
- **shovqinga javob bermaslik**: yo‘tal, «ha-ha», orqa fondagi ovozlar. Buning uchun VAD sezgirligi va nutqning minimal davomiyligi sozlanadi.

Gap bo‘linishini to‘g‘ri qayta ishlamasa, agent mijoz «ustidan» gapiradi va suhbat tezda buziladi.

## Qachon insonga o‘tkazish kerak

Modelga umid qilmay, qoidalarni aniq yozing:

- mijoz to‘g‘ridan-to‘g‘ri operatorni so‘raydi;
- agent ketma-ket bir necha marta so‘rovni tushunmadi;
- mavzu ssenariydan tashqarida: shikoyat, yuridik savol, nizo;
- nozik operatsiyalar: pulni qaytarish, to‘lov ma’lumotlarini o‘zgartirish;
- shovqin yoki til sababli ASR ishonchi past.

O‘tkazishda operatorga **qisqa xulosa** va agent yig‘gan ma’lumotlarni bering, shunda mijoz hammasini qaytadan aytishi shart bo‘lmaydi.

## Ishga tushirish tartibi

1. **Bitta tor ssenariy** tanlang: qabulga yozish, buyurtma holati, yetkazib berishni tasdiqlash.
2. Dialog, funksiyalar va o‘tkazish qoidalarini tavsiflang.
3. Prototip yig‘ing va uni yozib olingan hamda jonli test qo‘ng‘iroqlarida sinang.
4. Trafikning bir qismida ishga tushiring, yozuvlarni tinglang, promptlar va chegaralarni tuzating.
5. Birinchisi barqaror ishlagandan keyingina ssenariylarni kengaytiring.

Mijozga u AI bilan gaplashayotganini aytishni va suhbat yozuvlarini saqlash qoidalariga rioya qilishni unutmang.

## FAQ

### Ovozli agent uchun qanday model kerak?

Tez javob beradigan va funksiya chaqirishni qo‘llab-quvvatlaydigan har qanday LLM mos keladi. Ovozda tezlik ko‘pincha maksimal aqldan muhimroq: qisqa javoblar va tez birinchi replika ideal ifodadan qimmatroq.

### Agent o‘zbek va rus tillarida gapira oladimi?

Ha, agar ASR va TTS ikkala tilni qo‘llab-quvvatlasa va LLM mijoz tilida javob berishga ko‘rsatma olsa. O‘zbek nutqini tanish va sintez qilish sifatini ishga tushirishdan oldin real qo‘ng‘iroqlarda tekshiring.

### Ovozli agent IVR’dan nimasi bilan farq qiladi?

IVR mijozni tugmalar yoki kalit so‘zlar orqali qat’iy menyu bo‘yicha boshqaradi. Ovozli agent erkin nutqni tushunadi, tafsilotlarni aniqlashtiradi va tizimlaringizda amallarni bajaradi.
