---
title: CRMdan Google Adsga oflayn konversiyalarni qanday yuklash kerak
description: GCLIDni ariza bilan saqlash, bitim bosqichlari va tushumni CRMdan Google Adsga qaytarish, lidlar uchun kengaytirilgan konversiyalar va stavkalarni yaxshilash.
summary: Har bir ariza bilan GCLIDni CRMda saqlang, lid maqsadli bo‘lganda yoki to‘lovga aylanganda esa bu konversiyani summasi bilan Google Adsga qaytaring; shunda stavka algoritmi to‘ldirilgan formalarga emas, haqiqiy sotuvlarga moslashadi.
---
## Qisqa javob: nima uchun va qanday

Odatiy holatda Google Ads faqat saytda sodir bo‘layotganini ko‘radi: forma yuborish, qo‘ng‘iroq, messenjerga klik. Ammo ariza hali sotuv emas. Lidlarning bir qismi maqsadsiz, bir qismi to‘lovgacha yetmaydi, bitimlar esa summasi bo‘yicha keskin farq qiladi.

**Oflayn konversiyalarni import qilish** bu bo‘shliqni yopadi:

1. E’longa klik qilinganda Google URLga klik identifikatori — **GCLID** qo‘shadi.
2. Sayt uni saqlaydi va ariza bilan birga CRMga uzatadi.
3. Bitim oldinga siljiganda CRM Google Adsga hodisa yuboradi: GCLID, konversiya nomi, vaqti va summasi.
4. Google hodisani klik bilan bog‘laydi va algoritmni o‘xshash xaridorlarni topishga o‘rgatadi.

## 1-qadam. GCLIDni ariza bilan birga saqlang

Akkauntda **avtomatik belgilash** (auto-tagging) yoqilganini tekshiring. So‘ng parametrni birinchi tashrifda saqlang va formaning yashirin maydoniga qo‘ying:

```js
const params = new URLSearchParams(location.search);
const gclid = params.get('gclid');
if (gclid) {
  try { localStorage.setItem('gclid', gclid); } catch {}
}

// forma yuborilganda
const field = document.querySelector('input[name="gclid"]');
if (field) field.value = localStorage.getItem('gclid') || '';
```

Foydalanuvchi reklama orqali kelib, chiqib ketib, keyinroq qaytishi mumkin — shuning uchun qiymat faqat joriy URLdan olinmaydi, saqlab qo‘yiladi. Konversiyalarni bog‘lash yoqilgan Google tag ham GCLIDni o‘zining first-party cookie siga yozadi.

CRMda lid yoki bitim uchun alohida **GCLID** maydonini oching va lid bitimga aylantirilganda u yo‘qolmasligiga ishonch hosil qiling.

## 2-qadam. Bitim bosqichlari uchun konversiyalar yarating

Google Adsda **«Import» → CRM, fayllar yoki boshqa manbalardan → kliklar bo‘yicha konversiyalarni kuzatish** turidagi konversiyalarni yarating. Odatda ikki-uchtasi yetarli:

| Konversiya | Qachon yuborish | Stavkalardagi roli |
|---|---|---|
| Maqsadli lid | Menejer mijoz maqsadli ekanini tasdiqladi | Bitimlar kam bo‘lganda asosiy |
| Bitim yutildi | Shartnoma imzolandi yoki to‘lov olindi, summa bilan | Hajm yetarli bo‘lganda asosiy |
| Saytdan ariza | Forma yuborilishi | Ikkinchi darajali, kuzatish uchun |

Algoritmga **yetarli hajmdagi** konversiyalar kerak. To‘lovlar kam bo‘lsa, maqsadli lidga optimallashtiring, bitimlarni esa qo‘shimcha signal sifatida yuboring.

## 3-qadam. Ma’lumotlarni CRMdan uzating

Oddiydan murakkabga qarab usullar:

- Konversiyalar bo‘limida **CSVni qo‘lda yuklash** — sxemani tekshirish uchun mos.
- Google Sheets, HTTPS yoki SFTP orqali jadval bo‘yicha **muntazam yuklash**.
- CRMning Google Ads bilan **tayyor integratsiyalari** yoki konnektor xizmatlari.
- **Google Ads API** — o‘z CRMingiz va to‘liq avtomatlashtirish uchun.

Faylning minimal formati:

```csv
Parameters:TimeZone=Asia/Tashkent
Google Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency
EAIaIQobChMI...,Bitim yutildi,2026-10-01 14:30:00,1200,USD
```

Muhim:

- **konversiya nomi** Google Adsda yaratilgan nom bilan aynan mos kelishi kerak;
- **konversiya vaqti** klik vaqtidan keyin va to‘g‘ri vaqt mintaqasi bilan bo‘lishi kerak;
- muntazam yuklang: Google Ads klik uchun konversiyalarni cheklangan muddat ichida qabul qiladi, amaldagi muddat yordam markazida ko‘rsatilgan.

## Lidlar uchun kengaytirilgan konversiyalar

GCLID o‘ylaganingizdan ko‘ra tez-tez yo‘qoladi: odam forma to‘ldirmasdan qo‘ng‘iroq qiladi, boshqa qurilmadan kiradi, cookie tozalangan bo‘ladi. **Lidlar uchun kengaytirilgan konversiyalar** (enhanced conversions for leads) buni mijoz ma’lumotlari orqali hal qiladi:

1. Saytda forma yuborilganda Google tag **xeshlangan email yoki telefon**ni uzatadi.
2. Bitim yopilganda konversiyani CRMdagi xuddi shu xeshlangan email yoki telefon bilan yuklaysiz.
3. Google ularni GCLIDsiz moslashtiradi.

Funksiyani konversiya sozlamalarida yoqish va mijoz ma’lumotlarini qayta ishlash shartlarini qabul qilish kerak. Ma’lumotlar normallashtiriladi (kichik harflar, bo‘sh joysiz) va SHA-256 bilan xeshlanadi — buni Google tag yoki integratsiyangiz bajaradi. Tafsilotlar — Google Ads yordam markazida.

## Bu stavkalarni qanday yaxshilaydi

Google Adsga summasi bilan haqiqiy bitimlar kela boshlagach, **«Konversiya qiymatini maksimallashtirish»** yoki **maqsadli ROAS** strategiyalariga o‘tish mumkin. Algoritm shunchaki arizalarni emas, tushum olib keladigan so‘rovlar va auditoriyalarni ustun qo‘ya boshlaydi. Shuningdek, ko‘plab arzon, lekin maqsadsiz lid beradigan kampaniyalar ko‘rinib qoladi.

## Ko‘p uchraydigan xatolar

- GCLID lid maydoniga yoziladi, lekin bitimga o‘tkazilmaydi.
- Noto‘g‘ri vaqt mintaqasi — konversiya klikdan «oldin» bo‘lib chiqadi va rad etiladi.
- Bitta hodisa ikki marta yuklanadi.
- Bitimlar juda kam bo‘lganda qiymatga asoslangan stavkalarga o‘tish.

## FAQ

### Telefon orqali kelgan arizalar bilan nima qilish kerak?

GCLIDni CRMga uzatadigan kolltrekingdan yoki telefon raqami bo‘yicha lidlar uchun kengaytirilgan konversiyalardan foydalaning.

### Konversiyalarni qanchalik tez-tez yuklash kerak?

Hodisaga qanchalik yaqin bo‘lsa, algoritm uchun shuncha yaxshi. Avtomatik kunlik yuklash — oqilona minimum.

### Lidlar uchun kengaytirilgan konversiyalar sozlangan bo‘lsa, GCLID kerakmi?

Ikkalasini ham saqlash ma’qul: GCLID aniq moslikni beradi, mijoz ma’lumotlari esa klik identifikatori yo‘qolganda yordam beradi.
