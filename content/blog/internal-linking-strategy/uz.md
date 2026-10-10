---
title: Saytning ichki perelinkovkasi: strategiya va qoidalar
description: Ichki havolalar og‘irlikni qanday taqsimlaydi, xab-sahifalar nima uchun kerak, ankorlarni tanlash, yetim sahifalarni topish va blog va katalog uchun sxemalar.
summary: Ichki havolalar qidiruv tizimiga qaysi sahifalar muhim va ular qanday bog‘langanini ko‘rsatadi: asosiy sahifalarga xablar orqali ko‘proq havola bering, tavsiflovchi ankorlardan foydalaning va kiruvchi havolasiz sahifa qoldirmang.
---
## Ichki perelinkovka qanday ishlaydi

Ichki havolalar uchta vazifani hal qiladi:

- **Sahifalarni topishga yordam beradi.** Qidiruv roboti havolalar bo‘ylab o‘tadi; havolasiz sahifani u topmasligi yoki kamdan-kam ko‘rishi mumkin.
- **Og‘irlikni taqsimlaydi.** Ko‘p ichki havola, ayniqsa bosh sahifa va bo‘limlardan, keladigan sahifalarni qidiruv tizimi muhimroq deb hisoblaydi.
- **Mavzuni tushuntiradi.** Havola matni va atrofidagi kontent maqsadli sahifa nima haqida ekanini bildiradi.

Bundan asosiy qoida: **biznes uchun eng muhim sahifalar eng ko‘p ichki havola olishi va bosh sahifadan uzoq bo‘lmasligi kerak** — bir necha bosish masofasida.

## Xab-sahifalar

**Xab** — mavzu bo‘yicha umumiy sahifa bo‘lib, u barcha batafsil materiallarga havola beradi, ular esa xabga va bir-biriga qaytib havola beradi. Shunday qilib tematik klaster quriladi.

Blog uchun misol:

- xab: «Kichik biznes uchun CRM haqida hammasi»;
- maqolalar: CRM tanlash, joriy etish, xatolar, telefoniya bilan integratsiya, Excel’dan ko‘chirish;
- har bir maqola xabga va 2–3 qo‘shni maqolaga havola beradi.

Katalogda kategoriyalar va to‘plamlar xab vazifasini bajaradi: «Noutbuklar» → «Ish uchun noutbuklar» → mahsulot kartochkalari.

## Ankorlarni qanday tanlash

Ankor — havolaning bosiladigan matni. Ichki havolalar uchun qoidalar tashqi havolalarga qaraganda yumshoqroq, ammo mazmuni bir xil:

| Yomon | Yaxshi |
|---|---|
| «bu yerni bosing» | «CRM’ni qanday tanlash» |
| «batafsil» | «amoCRM va Bitrix24 taqqoslash» |
| barcha havolalarda bir xil ankor | ifodaning tabiiy variantlari |

- Ankor **maqsadli sahifani tavsiflashi** kerak.
- Turli ifodalardan foydalaning — shunda sahifa kengroq so‘rovlar to‘plami bilan bog‘lanadi.
- Bitta abzatsda bir sahifaga turli ankorli ikkita havola qo‘ymang.

## Yetim sahifalar

**Yetim sahifa** — unga birorta ham ichki havola olib bormaydigan sahifa. U sitemap’da bo‘lishi mumkin, lekin qidiruv tizimi uchun bu muhimlikning zaif signali.

Qanday topish:

1. Saytni krauler (masalan, Screaming Frog yoki shunga o‘xshash) bilan skanerlang va havolalar orqali topilgan sahifalar ro‘yxatini oling.
2. Uni sitemap’dagi ro‘yxat va Google Search Console’da trafik olayotgan URL’lar bilan solishtiring.
3. Sitemap yoki analitikada bor, lekin krauler topmagan hamma narsa — yetim sahifa nomzodlari.

Keyin qaror qiling: yoki tegishli sahifalar va xablardan havola qo‘shing, yoki sahifa kerak bo‘lmasa, uni boshqasi bilan birlashtiring yoki redirekt bilan o‘chiring.

## Amaliy sxemalar

### Blog uchun

- Har bir maqolada bog‘liq materiallarga matn ichida 3–5 ta kontekstli havola.
- Shunchaki oxirgi emas, mavzuga yaqin maqolalar bilan «Shuningdek o‘qing» bloki.
- O‘quvchiga mos joyda maqolalardan tijoriy xizmat sahifalariga havolalar.
- Yangi maqola chop etilganda, unga 2–3 ta eski materialdan havola qo‘shing.

### Katalog uchun

- Barcha sahifalarda **non uvoqlari** (breadcrumbs): ular ota bo‘limlarga havola beradi.
- Qidiruv uchun muhim filtrlar — kategoriyalardan havola qilingan alohida indekslanadigan sahifalar sifatida.
- Kartochkalar ichida «O‘xshash mahsulotlar» va «Bu bilan birga sotib olishadi» bloklari.
- Maqola va qo‘llanmalardan mos kategoriyalarga havolalar.

## Ko‘p uchraydigan xatolar

- Muhim sahifalar chuqurda yashiringan — ularga ko‘p bosish kerak.
- Yuzlab havolali menyu va futer, ular tufayli qimmatli havolalar yo‘qolib ketadi.
- Redirekt yoki 404 sahifalarga olib boradigan havolalar.
- `nofollow` bilan ichki havolalar — og‘irlik o‘z sahifalaringiz bo‘ylab uzatilmaydi.
- Oddiy `<a href>` havolalarsiz faqat JavaScript’dagi navigatsiya.

```html
<!-- Yaxshi: robot ko‘radigan oddiy havola -->
<a href="/blog/crm-tanlash">CRM’ni qanday tanlash</a>

<!-- Yomon: o‘tish faqat bosish ishlovchisi orqali -->
<span onclick="go('/blog/crm-tanlash')">batafsil</span>
```

## FAQ

### Maqolada nechta ichki havola qo‘yish kerak?

Qat’iy cheklov yo‘q. Foydaga qarab ish tuting: havolani son uchun emas, o‘quvchiga bog‘liq mavzu haqiqatan kerak bo‘lishi mumkin bo‘lgan joyga qo‘ying.

### Menyu va futerdagi havolalar yordam beradimi?

Ha, ular sahifalarni butun saytdan ochiq qiladi. Ammo matn ichidagi kontekstli havolalar qidiruv tizimiga mavzu haqida ko‘proq ma’lumot beradi, shuning uchun ikkala tur ham muhim.

### Perelinkovkani qanchalik tez-tez qayta ko‘rib chiqish kerak?

Har bir yangi maqola chop etilganda unga havolalar qo‘shing, bir necha oyda bir marta esa saytni yetim sahifalar, buzilgan havolalar va redirektlar uchun krauler bilan tekshiring.
