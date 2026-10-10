---
title: Google Sheets yoki Excel: farqlari va qachon qaysi birini tanlash
description: Google Sheets va Excel taqqoslanadi: formulalar, ma’lumot limitlari, birgalikda ishlash, Apps Script, VBA va Power Query, oflayn rejim va katta fayllar.
summary: Google Sheets’ni birgalikda ishlash, formalar, integratsiyalar va o‘rtacha hajmdagi ma’lumotlar uchun, Excel’ni esa og‘ir tahlil, katta fayllar, Power Query va oflayn ish uchun tanlang.
---
## Qisqa javob

- **Google Sheets** — ma’lumotlar bilan bir vaqtda bir necha kishi ishlasa, ma’lumotlar formalar va boshqa servislardan kelsa, hajmi esa o‘rtacha bo‘lsa.
- **Excel** — fayllar katta bo‘lsa, murakkab model, yuz minglab qatorlik pivot jadvallar, Power Query, Power Pivot yoki VBA makroslari kerak bo‘lsa.

Ko‘p kompaniyalar ikkalasidan ham foydalanadi: jonli ishchi ro‘yxatlar uchun Sheets, chuqur tahlil uchun Excel.

## Taqqoslash

| Mezon | Google Sheets | Excel |
|---|---|---|
| Ma’lumotlar limiti | Bitta faylda 10 mln katak | Bitta varaqda 1 048 576 qator va 16 384 ustun |
| Birgalikda ishlash | Tabiiy, brauzerda, havola orqali | OneDrive va SharePoint orqali birgalikda tahrirlash |
| Avtomatizatsiya | Apps Script (JavaScript), makroslar | VBA, Power Query, veb-versiyada Office Scripts |
| Katta fayllar | Limitga yetmasdan ancha oldin sekinlashadi | Desktop-versiya sezilarli darajada yaxshi uddalaydi |
| Oflayn | Chrome’da oflayn rejim, oldindan yoqish kerak | To‘liq desktop dastur |
| Tashqi ma’lumotlar | IMPORTRANGE, IMPORTXML, Apps Script orqali API | Power Query: ma’lumotlar bazalari, fayllar, veb-manbalar |

## Formulalar va funksiyalar

Asosiy funksiyalar bir xil: SUM, IF, VLOOKUP, XLOOKUP, SUMIFS, FILTER, UNIQUE, SORT. Farqlar maxsus funksiyalarda.

**Faqat yoki asosan Google Sheets’da:**

- **QUERY** — diapazonga SQL’ga o‘xshash so‘rovlar;
- **IMPORTRANGE** — boshqa jadvaldan ma’lumot olish;
- **GOOGLEFINANCE**, **GOOGLETRANSLATE**, **IMAGE** — Google’ning o‘rnatilgan servislari.

```text
=QUERY(A1:D, "select A, sum(D) where B = 'Toshkent' group by A", 1)
```

**Excel’ning kuchli tomonlari:**

- **Power Query** — formulalarsiz ko‘plab manbalardan ma’lumotlarni yuklash va tozalash;
- **Power Pivot** va ma’lumotlar modeli — jadvallar orasidagi bog‘lanishlar va DAX o‘lchovlari;
- kengaytirilgan pivot jadvallar, kesimlar (slicers) va «agar shunday bo‘lsa» tahlili.

Formulalar dasturlar o‘rtasida har doim ham ko‘chmaydi: boshqa dasturda yo‘q funksiya fayl ochilganda xato beradi.

## Birgalikda ishlash

Google Sheets’da bir necha kishi faylni bir vaqtda tahrirlaydi, bir-birining kursorini ko‘radi, izoh qoldiradi va versiyalar tarixini ko‘radi. Hamkasblar formulalarni buzmasligi uchun **diapazon va varaqlarni himoyalash** mumkin.

Excel’da birgalikda tahrirlash fayl OneDrive yoki SharePoint’da tursa ishlaydi. Fayllar pochta orqali yuborila boshlasa, «hisobot_yakuniy_2.xlsx» kabi nusxalar paydo bo‘ladi va yagona ma’lumot manbasi yo‘qoladi.

## Avtomatizatsiya

**Apps Script** — Google bulutidagi JavaScript. Xat yuborish, shablon bo‘yicha hujjat yaratish, API’ga so‘rov yuborish, jadval bo‘yicha yoki hodisa bo‘yicha, masalan forma yuborilganda ishga tushirish uchun mos. Skript Google serverlarida ishlaydi, kompyuteringiz o‘chiq bo‘lsa ham.

**VBA** — Excel’ning klassik makroslari. Desktop-versiya ichida kuchli, lekin Excel’ning veb-versiyasida ishlamaydi va makroslar yoqilgan bo‘lishini talab qiladi, bu esa ko‘pincha xavfsizlik siyosati bilan cheklanadi.

**Power Query** — dasturlash emas, balki yozib olingan ma’lumotlarni o‘zgartirish qadamlari. Manbani yangilaysiz, «Yangilash»ni bosasiz — hisobot qayta yig‘iladi.

## Qanday tanlash kerak

1. **Fayl bilan bir vaqtda necha kishi ishlaydi?** Bir-ikki kishidan ko‘p bo‘lsa — Sheets tomon.
2. **Ma’lumot hajmi qancha?** Formulali o‘n minglab va yuz minglab qatorlar — Excel.
3. **Ma’lumotlar qayerdan keladi?** Formalar, API orqali CRM, Google’ning boshqa servislari — Sheets. Tozalash kerak bo‘lgan ma’lumotlar bazalari va eksportlar — Power Query bilan Excel.
4. **Oflayn kerakmi?** Internetsiz muntazam ish — Excel.
5. **Hamkorlarda nima?** Agar sizga makrosli murakkab .xlsx fayllar yuborishsa, Excel’siz bo‘lmaydi.

## Keng tarqalgan xatolar

- Minglab formulali katta ma’lumotlar massivini Sheets’da saqlab, sekin ishlashidan hayron bo‘lish. Jadval — ma’lumotlar bazasi emas.
- Umumiy bulutli xotira o‘rniga Excel fayllarini pochta orqali yuborish.
- Muhim jarayonni faqat bitta xodim tushunadigan makrosga qurish.

## FAQ

### Excel faylini Google Sheets’da ochsa bo‘ladimi?

Ha, .xlsx fayllar ochiladi va tahrirlanadi, ularni Sheets formatiga konvertatsiya qilish mumkin. VBA makroslari ishlamaydi, ba’zi funksiyalar va formatlash esa farq qilishi mumkin.

### Google jadvali sekinlashib qolsa nima qilish kerak?

Butun ustunlarga qo‘llangan ortiqcha formulalarni olib tashlang, iloji bo‘lsa og‘ir IMPORTRANGE va QUERY’larni statik ma’lumotlar bilan almashtiring va ma’lumotlarni bir nechta faylga ajrating. Hajm o‘sishda davom etsa, Excel yoki ma’lumotlar bazasiga o‘tish vaqti keldi.

### Avtomatizatsiya uchun dasturlashni o‘rganish kerakmi?

Oddiy vazifalar uchun yo‘q: formulalar, makrosni yozib olish va Power Query yetarli. Xatlar, integratsiyalar va jadval bo‘yicha ishga tushirish uchun Apps Script uchun JavaScript yoki Excel uchun VBA asoslari kerak bo‘ladi.
