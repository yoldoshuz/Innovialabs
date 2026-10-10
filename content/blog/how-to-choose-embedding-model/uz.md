---
title: Qidiruv va RAG uchun embedding modelini qanday tanlash kerak
description: Embedding modellarini rus va o‘zbek tilidagi sifati, o‘lchami, narxi va joylashuvi bo‘yicha qanday solishtirish va o‘z ma’lumotlaringizda tekshirish.
summary: Embedding modelini umumiy reyting bo‘yicha emas, o‘z hujjatlaringiz va savollaringizdagi natijalar bo‘yicha tanlang: kichik test to‘plamini yig‘ing, 2–4 nomzodni sinang va kerakli parcha qanchalik tez-tez yuqori natijalarga tushishini solishtiring.
---

## Asosiy qoida

**Embedding modeli** matnni vektorga aylantiradi va qidiruv kerakli parchani topishi aynan unga bog‘liq. Ommaviy reytinglar qisqa ro‘yxat tuzish uchun foydali, lekin yakuniy tanlov **sizning ma’lumotlaringizda** qilinadi: tillaringiz, atamalaringiz va savollaringiz qanday yozilishida.

Agar xodimlar va mijozlar rus va o‘zbek tillarida yozsa, hujjatlarning bir qismi esa ingliz tilida bo‘lsa, buni alohida tekshirish kerak — modelning umumiy bali bu haqda hech narsa aytmaydi.

## Tanlash mezonlari

### Ko‘p tillilik

- Rus tili uchun tanlov keng: ko‘pchilik ko‘p tilli modellar uni yaxshi tushunadi.
- **O‘zbek tili** — o‘qitish ma’lumotlari kamroq bo‘lgan til. Modellar sifati sezilarli farq qiladi, ayniqsa apostrofli lotin yozuvida (o‘, g‘) hamda lotin va kirill aralashganda.
- **Tillararo qidiruv** muhim: agar shunday vazifa bo‘lsa, o‘zbekcha savol ruscha hujjatdagi javobni topishi kerak.

### Vektor o‘lchami

O‘lcham indeks hajmi, xotira va qidiruv tezligiga ta’sir qiladi. Kattaroq har doim ham yaxshiroq emas. Ba’zi modellar **vektorni qisqartirishga** o‘rtacha sifat yo‘qotish bilan ruxsat beradi — bu katta indekslar uchun qulay.

### Kirishning maksimal uzunligi

Agar chunklar model limitidan uzun bo‘lsa, matn jimgina kesiladi. Chunk o‘lchamini limit bilan solishtiring.

### Narx va joylashtirish

| Variant | Afzalliklari | Kamchiliklari |
|---|---|---|
| API-model | Tez start, uskuna kerak emas | Ma’lumotlar provayderga ketadi, hajm uchun to‘lov, xizmatga qaramlik |
| O‘z serveringizdagi ochiq model | Ma’lumotlar sizda qoladi, so‘rov uchun to‘lov yo‘q | Server (ko‘pincha GPU bilan), sozlash va qo‘llab-quvvatlash kerak |

Faqat indekslashni emas, **har bir foydalanuvchi so‘rovini** ham hisobga oling — uni ham vektorga aylantirish kerak.

### Asimmetrik qidiruv

Ko‘p modellar so‘rov va hujjat uchun turli prefiks yoki rejimlarni kutadi. Ulardan foydalanmasangiz, sifat pasayadi. Model kartasini o‘qing.

## O‘z ma’lumotlaringizda benchmarkni qanday o‘tkazish kerak

1. **To‘plam yig‘ing**: 50–100 ta haqiqiy savol va har biri uchun to‘g‘ri parcha yoki hujjat. Foydalanuvchilarning barcha tillaridagi savollarni qo‘shing.
2. **Bo‘lishni qotiring**: barcha modellar uchun bir xil chunklar, aks holda solishtirish adolatsiz bo‘ladi.
3. Hujjatlarni har bir nomzod model bilan **indekslang**.
4. **Metrikalarni hisoblang**:
   - **Recall@k** — to‘g‘ri parcha top-k ichida bo‘lgan savollar ulushi;
   - **MRR** — to‘g‘ri parcha natijalarda qanchalik yuqorida turishi.
5. **Natijalarni tillar bo‘yicha ajrating** — model rus tilida kuchli, o‘zbek tilida zaif bo‘lishi mumkin.
6. Muvaffaqiyatsiz holatlarni **ko‘z bilan ko‘ring**: ko‘pincha u yerda tizimli muammo ko‘rinadi, masalan atamalar yoki qisqartmalar.

Recall@k ning minimal hisobi:

```python
def recall_at_k(results, gold, k=5):
    hits = sum(1 for q, ids in results.items() if gold[q] in ids[:k])
    return hits / len(results)
```

## Modeldan tashqari qidiruvni yana nima yaxshilaydi

- To‘liq matnli indeks bilan **gibrid qidiruv** — artikullar, raqamlar va kam uchraydigan atamalar uchun.
- top-k nomzodlar ustidan **reranker**.
- Chunklarni bo‘lim sarlavhalari bilan **boyitish**.

Ba’zan bu qadamlar modelni almashtirishdan ko‘ra ko‘proq foyda beradi.

## Ko‘p uchraydigan xatolar

- O‘z tillaringizda tekshirmasdan reyting bo‘yicha tanlash.
- Bitta indeksda turli modellar vektorlarini aralashtirish — ular mos kelmaydi.
- So‘rov va hujjat prefikslarini e’tiborsiz qoldirish.
- Faqat dasturchilar yozgan "qulay" savollarda test qilish.

## FAQ

### Keyinroq modelni almashtirish mumkinmi?
Ha, lekin barcha hujjatlarni qayta vektorlashtirish va indeksni qayta qurish kerak bo‘ladi. Shuning uchun faqat vektorlarni emas, chunklarning asl matnini ham saqlang.

### Hech bir model o‘zbek tilini yaxshi tushunmasa nima qilish kerak?
Gibrid qidiruv va reranker qo‘shing, matn normalizatsiyasini (apostroflar, lotin va kirill) tekshiring. Yirik loyihalarda ochiq modelni o‘zingizning savol–javob juftliklaringizda qo‘shimcha o‘qitish mumkin.

### Test uchun nechta savol kerak?
Birinchi solishtirish uchun bir necha o‘nta haqiqiy savol yetarli. Ularning haqiqiy so‘rovlarni va foydalanuvchilarning barcha tillarini aks ettirishi muhimroq.
