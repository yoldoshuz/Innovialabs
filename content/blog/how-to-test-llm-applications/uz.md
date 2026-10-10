---
title: LLM ilovalarini qanday testlash: evals, datasetlar va LLM-hakam
description: LLM ilovalarini testlash: etalon dataset, avtomatik va qo‘lda baholash, LLM-as-judge tuzoqlari va prompt yoki model o‘zgarganda regressiya testlari.
summary: LLM ilovasi aniq mezonlarga ega haqiqiy misollardan iborat etalon to‘plamda testlanadi: kod tekshiruvlari, LLM-hakam va tanlab qo‘lda baholash birlashtiriladi, prompt yoki model har safar o‘zgarganda bu to‘plam qayta ishga tushiriladi.
---
## Qisqa javob

Oddiy unit testlar LLM bilan bevosita ishlamaydi: javob har safar biroz boshqacha bo‘ladi. «Satr satrga teng» tekshiruvi o‘rniga **evals** quriladi — avtomatik ishga tushiriladigan, sifat mezonlariga ega misollar to‘plami. Asos — **etalon dataset**, uning ustida baholashning uch darajasi: deterministik tekshiruvlar, **LLM-as-judge** va tanlab qo‘lda tekshirish.

## 1-qadam. Etalon datasetni yig‘ing

**Golden dataset** — bu kiruvchi ma’lumotlar va kutilgan natija yoki yaxshi javob mezonlari.

- To‘qib chiqarilgan emas, foydalanuvchilarning **haqiqiy so‘rovlarini** oling.
- **Murakkab holatlarni** qo‘shing: noaniq savollar, mavzudan tashqari so‘rovlar, qoidalarni chetlab o‘tishga urinishlar.
- Faqat eng ko‘p uchraydiganini emas, ilovaning barcha **ssenariylarini** qamrab oling.
- Har bir misol uchun nima to‘g‘ri hisoblanishini yozing: aniq javob, majburiy faktlar, taqiqlangan kontent.
- Datasetni repozitoriyda promptlar yonida saqlang va versiyalang.

Bir necha o‘nta misoldan boshlash mumkin, so‘ng to‘plamni prodakshnda topilgan har bir nosozlik bilan to‘ldirib boring.

## 2-qadam. Deterministik tekshiruvlar

Kod bilan tekshirish mumkin bo‘lgan hamma narsani kod bilan tekshiring — bu tez, arzon va barqaror:

- javob sxemaga mos to‘g‘ri JSON;
- ajratib olingan maydon etalon bilan mos keladi;
- javobda taqiqlangan so‘zlar yoki shaxsiy ma’lumotlar yo‘q;
- uzunlik ruxsat etilgan chegarada;
- agent kerakli vositani to‘g‘ri argumentlar bilan chaqirgan.

```python
def check(case, output):
    data = json.loads(output)
    assert data["category"] == case["expected_category"]
    assert len(data["reply"]) < 1000
```

## 3-qadam. LLM-as-judge

Ochiq javoblar (ohang, to‘liqlik, kontekstga aniqlik) uchun hakam-modeldan foydalaniladi: u savol, javob va mezonlarni oladi va baho qo‘yadi.

Tuzoqlar:

- **Noaniq mezonlar** — «sifatni 1 dan 10 gacha baholang» shovqin beradi. Ikkilik savollar yaxshiroq: «javobda yetkazib berish muddati bormi? ha/yo‘q».
- **Uzunlikka moyillik** — hakamlar uzun javoblarga ortiqcha baho qo‘yishga moyil.
- **Pozitsiyaga moyillik** — ikki javobni solishtirganda tartib tanlovga ta’sir qiladi; ularning o‘rnini almashtiring.
- **O‘zini afzal ko‘rish** — model o‘z oilasidagi javoblarni yuqoriroq baholashi mumkin.
- **Hakam ham xato qiladi** — unga ishonishdan oldin baholarini tanlamada inson baholari bilan solishtiring.

## 4-qadam. Qo‘lda baholash

Xato narxi yuqori yoki mezon sub’ektiv bo‘lgan joyda odamlar kerak. Baholash foydali bo‘lishi uchun:

- ekspertlarga «yoqadi / yoqmaydi» emas, **aniq rubrika** bering;
- hammasini emas, **tanlamani** tekshiring;
- qo‘lda baholardan LLM-hakamni **kalibrlash** uchun foydalaning.

## 5-qadam. Regressiya testlari

Prompt, model, parametrlar yoki RAG indeksidagi har qanday o‘zgarish bir narsani yaxshilab, boshqasini buzishi mumkin. Shuning uchun:

1. Butun datasetni **har bir relizdan oldin**, yaxshisi CI’da ishga tushiring.
2. Metrikalarni mavhum chegara bilan emas, **oldingi versiya** bilan solishtiring.
3. Faqat o‘rtachaga emas, yomonlashgan **aniq misollarga** ham qarang.
4. Natijalar takrorlanishi uchun model versiyasi va parametrlarni qayd eting.
5. **Tasodifiylikni** hisobga oling: muhim misollar uchun bir necha marta ishga tushiring.

## Ko‘p uchraydigan xatolar

- Bir-ikki so‘rovda «ko‘z bilan» testlash.
- Faqat oddiy misollardan iborat dataset.
- LLM-hakamga odamlar bilan solishtirmasdan ko‘r-ko‘rona ishonish.
- Prodakshndagi nosozliklarni datasetga qo‘shmaslik.

## FAQ

### Datasetda nechta misol bo‘lishi kerak?

Boshlash uchun asosiy ssenariylar va murakkab holatlarni qamrab olgan bir necha o‘nta misol yetarli. Hajmdan ko‘ra xilma-xillik va belgilash sifati muhimroq; to‘plam mahsulot bilan birga o‘sadi.

### Bitta modelni ham generator, ham hakam sifatida ishlatsa bo‘ladimi?

Bo‘ladi, lekin o‘zini afzal ko‘rish riski bor. Hakam uchun boshqa modelni olish va uning baholarini muntazam inson baholari bilan solishtirish ishonchliroq.

### Vositalardan foydalanadigan agentlarni qanday testlash kerak?

Faqat yakuniy javobni emas, traektoriyani ham tekshiring: qaysi vositalar, qanday tartibda va qanday argumentlar bilan chaqirilgan. Testlarda tashqi xizmatlarni zaglushkalar bilan almashtirgan ma’qul.
