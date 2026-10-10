---
title: Elasticsearch nima va qidiruv indeksi qanday tuzilgan
description: Elasticsearch qanday ishlaydi: teskari indeks, hujjatlar, shardlar, analizatorlar va relevantlik, hamda loyihaga u yoki OpenSearch qachon kerak bo‘ladi.
summary: Elasticsearch — JSON hujjatlarni teskari indeksda saqlaydigan taqsimlangan qidiruv tizimi, shuning uchun u millionlab yozuvlar orasidan so‘zlarni tez topadi va natijalarni relevantlik bo‘yicha saralaydi; bazadagi LIKE so‘rovlari to‘liq matnli qidiruvga yetmay qolganda u kerak bo‘ladi.
---

## Qisqacha javob

**Elasticsearch** — Apache Lucene kutubxonasi asosida qurilgan qidiruv va tahlil tizimi. Siz unga JSON **hujjatlar** yuborasiz (mahsulotlar, maqolalar, log qatorlari), u matnni termlarga ajratadi va ularni **teskari indeksga** (inverted index) joylaydi. Keyin qidiruv barcha yozuvlarni ko‘rib chiqmasdan termlar bo‘yicha ishlaydi va natijalar shunchaki «topildi / topilmadi» emas, balki **relevantlik** bo‘yicha saralanadi.

**OpenSearch** — Elasticsearch’ning Linux Foundation doirasida hamjamiyat rivojlantirayotgan forki. Ushbu maqoladagi asosiy tushunchalar bo‘yicha ikkalasi bir xil ishlaydi.

## Teskari indeks

Oddiy jadval «hujjat → so‘zlar» tarzida tuzilgan. Teskari indeks buni «so‘z → hujjatlar» ko‘rinishiga aylantiradi — kitob oxiridagi mavzular ko‘rsatkichi kabi.

Uchta mahsulot tavsifini olaylik:

1. «Qizil charm sumka»
2. «Charm hamyon, jigarrang»
3. «Qizil paxta futbolka»

Indeks taxminan shunday ko‘rinadi:

| Term | Hujjatlar |
|---|---|
| qizil | 1, 3 |
| charm | 1, 2 |
| sumka | 1 |
| hamyon | 2 |
| jigarrang | 2 |
| paxta | 3 |

«qizil charm» so‘rovi ikkita qisqa ro‘yxatni o‘qiydi va birlashtiradi. 1-hujjatda ikkala term bor — u birinchi bo‘ladi, 2 va 3-hujjatlar bittadan term bo‘yicha mos keladi. To‘liq ko‘rib chiqish yo‘q, shuning uchun ma’lumotlar ko‘payganda ham qidiruv tez qoladi.

## Analizatorlar: matn termlarga qanday aylanadi

Indeksga tushishdan oldin matn **analizator** orqali o‘tadi:

- **Character filters** kiritilgan matnni tozalaydi, masalan HTML teglarni olib tashlaydi.
- **Tokenizator** matnni so‘zlarga ajratadi.
- **Token filters** so‘zlarni kichik harfga o‘tkazadi, stop-so‘zlarni olib tashlaydi, qo‘shimchalarni kesadi (stemming: «sumkalar» → «sumka»), sinonimlar qo‘shadi.

Xuddi shu analizator qidiruv so‘roviga ham qo‘llanadi, shuning uchun so‘rovdagi «Sumkalar» hujjatdagi «sumka»ni topadi. O‘zbek va rus tillarida qo‘shimchalar ko‘p, shu sababli to‘g‘ri tanlangan til analizatori natija sifatiga sezilarli ta’sir qiladi. Amalda qidiruvdagi muammolarning ko‘pi — analizator muammolari.

## Hujjatlar, indekslar va mapping

- **Hujjat** — unikal ID’ga ega bitta JSON obyekt.
- **Indeks** — bir turdagi hujjatlar to‘plami, taxminan jadvalga o‘xshaydi.
- **Mapping** maydon turlarini belgilaydi: `text` to‘liq matnli qidiruv uchun tahlil qilinadi, `keyword` esa aniq filtrlar, saralash va agregatsiyalar uchun o‘zgarishsiz saqlanadi.

```json
{
  "mappings": {
    "properties": {
      "title":    { "type": "text" },
      "brand":    { "type": "keyword" },
      "price":    { "type": "float" },
      "in_stock": { "type": "boolean" }
    }
  }
}
```

Mavjud maydon turini o‘zgartirish odatda faqat **qayta indekslash** orqali mumkin, shuning uchun mapping’ni ma’lumot yuklashdan oldin o‘ylab chiqing.

## Shardlar va replikalar

Indeks **shardlarga** bo‘linadi — har biri mustaqil Lucene indeksi. Shardlar klaster tugunlari bo‘ylab taqsimlanadi, ma’lumot va yuklama ular orasida bo‘linadi. **Replikalar** — shardlarning boshqa tugunlardagi nusxalari: ular tugun ishdan chiqishidan himoya qiladi va o‘qish so‘rovlariga xizmat qila oladi.

Ko‘p uchraydigan xato — juda ko‘p mayda shardlar. Har bir shardning o‘z xarajati bor, shuning uchun kichik va o‘rta loyihalarga odatda kamroq, lekin kattaroq shardlar ma’qul.

## Relevantlik qanday hisoblanadi

Har bir moslik uchun Elasticsearch **score** hisoblaydi. Standart algoritm — **BM25** — quyidagilarni hisobga oladi:

- term hujjatda qanchalik tez-tez uchrashi;
- term butun indeksda qanchalik kam uchrashi (kam uchraydigan so‘zlar og‘irroq);
- maydon uzunligi (qisqa sarlavhadagi moslik uzun matndagidan og‘irroq).

Saralashni sozlash mumkin: `title` maydonining vaznini `description`dan oshirish, yangilik yoki ommaboplikni hisobga olish, xatoli yozuvlar uchun noaniq (fuzzy) qidiruvni yoqish.

## Loyihaga u qachon haqiqatan kerak

Elasticsearch yoki OpenSearch quyidagi hollarda o‘zini oqlaydi:

- katta katalog yoki kontent bazasi bo‘yicha xatolar, so‘z shakllari va sinonimlarni hisobga oladigan **to‘liq matnli qidiruv**;
- **fasetli filtrlar**: natijalar yonida brend, narx va kategoriya bo‘yicha sonlar;
- **avtoto‘ldirish** va yozish davomida qidiruv;
- **loglar va hodisalar**: katta hajmlar bo‘yicha markazlashgan qidiruv va agregatsiyalar.

Ehtimol, u kerak emas, agar:

- ma’lumot kam va `LIKE` yoki bazaning o‘rnatilgan to‘liq matnli qidiruvi (masalan, PostgreSQL’da) yetarli bo‘lsa;
- faqat ID, status yoki sana bo‘yicha aniq filtrlar kerak bo‘lsa;
- jamoa holatga ega yana bitta servisni yuritishga tayyor bo‘lmasa.

Yodda tuting: Elasticsearch odatda **ikkilamchi ombor**. Haqiqat manbai asosiy bazada qoladi, ma’lumotlar esa qidiruv indeksiga sinxronlanadi. Ana shu sinxronlash, klaster monitoringi va xotira — joriy etishning haqiqiy narxi.

## FAQ

### Elasticsearch asosiy ma’lumotlar bazasini almashtira oladimi?

Bunga arzimaydi. Unda PostgreSQL kabi qat’iy tranzaksiyalar va relyatsion cheklovlar yo‘q. Asosiy ma’lumotlarni bazada saqlang, Elasticsearch’dan esa uning ustidagi tezkor qidiruv qatlami sifatida foydalaning.

### Elasticsearch va OpenSearch o‘rtasida qanday farq bor?

OpenSearch Elasticsearch’ning forki sifatida paydo bo‘lgan va ochiq litsenziya ostida alohida rivojlanmoqda. Asosiy g‘oyalar, so‘rovlar tili va tushunchalar juda o‘xshash; farqlar litsenziya, ayrim funksiyalar va hosting variantlarida.

### Nega qidiruv matnda aniq bor so‘zni topmayapti?

Ko‘pincha sabab analizator yoki mapping’da: maydon `text` o‘rniga `keyword` deb e’lon qilingan yoki analizator tilning so‘z shakllarini hisobga olmaydi. Matn qanday bo‘linishini `_analyze` API orqali tekshiring.
