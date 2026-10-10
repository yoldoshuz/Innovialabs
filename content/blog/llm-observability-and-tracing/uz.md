---
title: "LLM kuzatuvchanligi: tracing, loglar va AI ilovalar monitoringi"
description: Har bir LLM so‘rovi uchun nimani loglash, ko‘p bosqichli agentlarni qanday kuzatish, sifat driftini sezish va loglarni shaxsiy ma’lumotlar uchun xavfsiz saqlash.
summary: Har bir LLM chaqiruvini prompt versiyasi, kirish, chiqish, tool call’lar, tokenlar, kechikish va narx bilan loglang, bosqichlarni bitta trace’ga bog‘lang, sifatni kuzating va shaxsiy ma’lumotlarni yozishdan oldin niqoblang.
---
## AI ilovalarga nega alohida kuzatuvchanlik kerak

Klassik monitoring «servis ishlayaptimi va tezmi?» degan savolga javob beradi. AI ilova uchun bu yetarli emas: servis HTTP 200 ni tez qaytarishi, lekin **noto‘g‘ri, to‘qilgan yoki xavfli javob** berishi mumkin. Javoblar deterministik emas, foydalanuvchining bitta harakati esa bir nechta model chaqiruvi, qidiruv va vositalarni ishga tushirishi mumkin.

**LLM kuzatuvchanligi** — istalgan so‘rov bo‘yicha uchta savolga javob bera olish:

- Model aynan nimani oldi va nimani qaytardi?
- Qaysi bosqichlar, vositalar va hujjatlar ishtirok etdi?
- Bu qancha turdi, qancha vaqt oldi va javob yaxshi bo‘ldimi?

## Har bir so‘rov uchun nimani loglash kerak

Har bir LLM chaqiruvi uchun foydali minimum:

| Maydon | Nima uchun |
|---|---|
| **Trace ID va foydalanuvchi/sessiya ID** | bitta harakatning barcha bosqichlarini bog‘lash, foydalanuvchi shikoyatini topish |
| **Model va parametrlar** | temperature, max tokens; xatti-harakat ularga bog‘liq |
| **Prompt shabloni va versiyasi** | qaysi prompt javob berganini bilish |
| **Kirish va chiqish** (niqoblangan) | muammolarni qayta tiklash va tahlil qilish |
| **Topilgan hujjatlar** | RAG kerakli kontekstni topganini tekshirish |
| **Tool call’lar** argument va natijalari bilan | agent aslida nima qilganini ko‘rish |
| **Kirish/chiqish tokenlari va narx** | funksiya va foydalanuvchi bo‘yicha xarajatni nazorat qilish |
| **Kechikish** (umumiy va birinchi tokengacha) | sekin bosqichlarni topish |
| **Xatolar, qayta urinishlar, finish reason** | kesilish, timeout va rad etishlarni sezish |
| **Foydalanuvchi fikri** | like/dislike, tuzatishlar, operatorga o‘tkazish |

## Ko‘p bosqichli agentlarni kuzatish

Agent reja tuzishi, qidirishi, API chaqirishi, yana modelga murojaat qilishi va shundan keyingina javob berishi mumkin. Har bir chaqiruvni alohida loglasangiz, umumiy manzarani tiklab bo‘lmaydi. **Trace va span**lardan foydalaning:

- **trace** — foydalanuvchining bitta so‘rovi boshidan oxirigacha;
- **span** — uning ichidagi bitta bosqich: LLM chaqiruvi, vektor qidiruv, vosita chaqiruvi;
- span’lar bir-birining ichida joylashadi, shuning uchun hodisalar daraxti va vaqt hamda tokenlar qayerga ketgani ko‘rinadi.

Buning umumiy standarti — **OpenTelemetry**, unda generativ AI uchun semantik kelishuvlar rivojlanmoqda. Ixtisoslashgan vositalar (open-source va SaaS) ustiga LLM’ga yo‘naltirilgan ko‘rinishlarni qo‘shadi: prompt sinov maydonchalari, narx dashboardlari, baholash yugurishlari.

```python
from opentelemetry import trace

tracer = trace.get_tracer("support-bot")

with tracer.start_as_current_span("answer_question") as span:
    span.set_attribute("prompt.version", "support-v7")
    docs = search_docs(question)          # ichidagi bola span
    span.set_attribute("rag.docs_count", len(docs))
    reply = call_llm(question, docs)      # ichidagi bola span
    span.set_attribute("llm.tokens.total", reply.usage.total_tokens)
```

Agentlarning odatiy nosozliklarini kuzating: **aylanib qolish** (bitta vosita qayta-qayta chaqiriladi), **juda ko‘p bosqich**, model e’tiborsiz qoldiradigan vosita xatolari va nazoratsiz token sarfi.

## Sifat va driftni monitoring qilish

Kodingiz o‘zgarmasa ham javob sifati o‘zgarishi mumkin: provayder modelni yangiladi, foydalanuvchi savollari o‘zgardi, bilimlar bazasi eskirdi. Buni kuzating:

- **Oflayn baholash** — prompt yoki model har o‘zgarganda ishga tushiriladigan qat’iy test to‘plami.
- **Onlayn tekshiruvlar** — real trafikdan tanlanma namunani avtomatik baholash (LLM-as-judge, format tekshiruvi, javobning topilgan hujjatlarga tayanishi).
- **Bilvosita signallar** — salbiy fikrlar ulushi, operatorga o‘tkazishlar, takroriy savollar, bo‘sh javoblar va rad etishlar.
- **Kirish ma’lumotlari drifti** — so‘rovlarda promptlar mo‘ljallanmagan yangi mavzular yoki tillar paydo bo‘lishi.

Alertlarni nafaqat mutlaq chegaralarga, balki keskin o‘zgarishlarga ham sozlang.

## Maxfiylikka xavfsiz loglash

Promptlarda ko‘pincha ismlar, telefonlar, manzillar, hujjatlar bo‘ladi. Ularni loglarga shundayligicha yozish — sizib chiqishga tayyorgarlik.

- Loglarga yozishdan oldin shaxsiy ma’lumotlarni (PII) **niqoblang yoki o‘chiring**.
- To‘liq matnlarni **faqat kerakli joyda** va qisqa muddatga saqlang.
- Xom trace’larga kirishni rollar bo‘yicha cheklang va kim o‘qiyotganini qayd eting.
- Metrikalarni (tokenlar, kechikish, narx) kontentdan alohida saqlang, shunda dashboardlar matnlarni oshkor qilmaydi.
- Loglash servisining ma’lumot saqlash joyi va shartlari mahalliy qonunchilik va shartnomalaringizga mos kelishini tekshiring.

## Ko‘p uchraydigan xatolar

- Faqat xatolarni loglash — ishonarli, lekin noto‘g‘ri javoblar ko‘rinmay qoladi.
- Promptlarni versiyalamaslik — qaysi o‘zgarish sifatni buzganini aniqlab bo‘lmaydi.
- Narxni oy bo‘yicha hisoblash, lekin funksiya va foydalanuvchi bo‘yicha emas.
- Foydalanuvchilarning xom ma’lumotlarini tekshirmasdan tashqi loglash servisiga yuborish.

## FAQ

### Mavjud APM vositamdan foydalansam bo‘ladimi?

Ha — kechikish, xatolar va infratuzilma uchun. Promptlar, tool call’lar, token narxi va sifatni baholash uchun odatda qo‘shimcha atributlar yoki LLM’ga moslashtirilgan vosita kerak, yaxshisi OpenTelemetry orqali ulangan.

### Promptlar va javoblarni to‘liq loglash kerakmi?

Muammolarni tahlil qilish va sifatni baholash kerak bo‘lsa — ha, lekin niqoblangan holda, cheklangan muddat va cheklangan kirish bilan. Ko‘p dashboardlar uchun metama’lumotlar yetarli.

### Model yomonroq javob bera boshlaganini qanday sezish mumkin?

Qat’iy baholash to‘plamini muntazam va har bir o‘zgarishdan keyin ishga tushiring, jonli trafikdan namunalarni tekshiring hamda foydalanuvchi fikrlari va operatorga o‘tkazishlar ulushidagi keskin o‘zgarishlarni kuzating.
