---
title: C# va .NET nima: yangi boshlovchilar uchun sharh
description: C# tili va .NET platformasi qanday bog‘liq, .NET nega kross-platformaga aylandi va unda nima yoziladi: veb-API, desktop, Unity o‘yinlari, korporativ tizimlar.
summary: C# — dasturlash tili, .NET esa C# kodini kompilyatsiya qilib ishga tushiradigan platforma; bugun u Windows, Linux va macOS’da ishlaydi va veb, desktop, o‘yinlar hamda korporativ tizimlar uchun mos.
---

## C# va .NET: qisqa javob

**C#** («si sharp» deb o‘qiladi) — Microsoft yaratgan, statik tiplashtirilgan obyektga yo‘naltirilgan til. **.NET** — kod yashaydigan platforma: kompilyator, ishga tushirish muhiti, standart kutubxona va vositalar.

Soddaroq aytganda: C# — siz *nimada* yozasiz, .NET esa — bu *qayerda va qanday* ishlaydi. .NET’da boshqa tillar ham bor (F#, Visual Basic), lekin asosiysi — C#.

## C# kodi qanday qilib ishlaydigan dasturga aylanadi

Kod bir necha bosqichdan o‘tadi:

1. Siz `.cs` faylini yozasiz.
2. Kompilyator uni mashina kodiga emas, balki **oraliq tilga (IL)** — universal bayt-kodga aylantiradi.
3. Ishga tushganda **CLR** (Common Language Runtime) **JIT-kompilyator** yordamida IL’ni aniq protsessor uchun mashina kodiga o‘giradi.
4. CLR xotirani **axlat yig‘uvchi** (garbage collector) orqali boshqaradi — xotirani qo‘lda bo‘shatish shart emas.

Yana **AOT-kompilyatsiya** rejimi ham bor (oldindan mashina kodiga): tezroq ishga tushadi, bog‘liqliklar kamroq, lekin ba’zi cheklovlar bilan.

Eng oddiy dastur shunday ko‘rinadi:

```csharp
Console.WriteLine("Salom, .NET!");

var prices = new List<decimal> { 120m, 80m, 45m };
Console.WriteLine($"Jami: {prices.Sum()}");
```

## Faqat Windows’dan kross-platformagacha

Platformaning tarixi uzoq, shuning uchun yangi boshlovchilar nomlarda adashib qolishadi:

| Nomi | Bu nima |
|---|---|
| **.NET Framework** | Dastlabki versiya, faqat Windows’da ishlaydi. Qo‘llab-quvvatlanadi, lekin yirik yangi imkoniyatlar qo‘shilmaydi |
| **.NET Core** | Qayta yozilgan, ochiq kodli kross-platforma versiya |
| **.NET (5 va undan yangi)** | .NET Core davomi bo‘lgan yagona liniya. Yangi loyihalar aynan shuni tanlaydi |

Amaliyot uchun asosiysi: zamonaviy .NET — **open source**, **Windows, Linux va macOS**’da ishlaydi, Docker konteynerlari va bulutda yaxshi ishlaydi.

## C# va .NET’da nimalar yoziladi

- **Veb-API va backend.** **ASP.NET Core** freymvorki — REST API, mikroservislar, saytlar va SignalR orqali real-time uchun.
- **Korporativ tizimlar.** Banklar, logistika, ERP, ichki portallar — u yerda qat’iy tiplashtirish, uzoq muddatli qo‘llab-quvvatlash va yetuk vositalar qadrlanadi.
- **O‘yinlar.** **Unity** dvigateli skriptlar uchun C# dan foydalanadi — geymdevga kirishning eng mashhur yo‘llaridan biri.
- **Desktop.** Windows uchun WPF va WinForms, kross-platforma variantlar — .NET MAUI va Avalonia.
- **Mobil ilovalar.** .NET MAUI orqali bitta kod bazasidan iOS va Android uchun yozish mumkin.
- **Bulut va fon vazifalari.** Worker-servislar, navbatlar, serverless funksiyalar.

## Kuchli va zaif tomonlari

**Afzalliklari:**
- qat’iy tiplashtirish ko‘plab xatolarni dastur ishga tushishidan oldin ushlaydi;
- boy standart kutubxona va **NuGet** paket menejeri;
- **LINQ** — kolleksiyalar va ma’lumotlarga qulay so‘rovlar;
- asinxron kod uchun `async/await`;
- kuchli IDE’lar: Visual Studio, Rider, VS Code.

**Kamchiliklari:**
- kirish chegarasi Python yoki JavaScript’ga qaraganda balandroq;
- «Windows uchun til» degan obro‘ hali ham uchraydi, garchi u allaqachon eskirgan bo‘lsa ham;
- kichik skriptlar va prototiplar uchun ortiqcha og‘ir bo‘lishi mumkin.

## Nimadan boshlash kerak

1. Rasmiy saytdan **.NET SDK**’ni o‘rnating.
2. `dotnet new console` buyrug‘i bilan loyiha yarating va `dotnet run` bilan ishga tushiring.
3. Asoslarni o‘zlashtiring: tiplar, klasslar, kolleksiyalar, LINQ, `async/await`.
4. Yo‘nalish tanlang — veb (ASP.NET Core), o‘yinlar (Unity) yoki desktop — va kichik loyiha qiling.

Batafsil hujjatlar: [learn.microsoft.com/dotnet](https://learn.microsoft.com/dotnet/).

## FAQ

### C# va .NET — bir narsami?

Yo‘q. C# — til, .NET — uni ishga tushiradigan platforma. Ular ko‘pincha birga tilga olinadi, chunki C# — .NET’ning asosiy tili.

### .NET’ni Linux’da ishga tushirish mumkinmi?

Ha. Zamonaviy .NET kross-platforma: ilovalar Linux, macOS va Windows’da, jumladan Docker va Kubernetes’da ishlaydi. Faqat eski .NET Framework Windows’ga bog‘langan.

### C# Java’dan nimasi bilan farq qiladi?

Tillar sintaksis va g‘oyalar bo‘yicha o‘xshash: ikkalasi ham tiplashtirilgan, bayt-kodga kompilyatsiya qilinadi va axlat yig‘uvchidan foydalanadi. Ekotizimlar, freymvorklar va ba’zi til imkoniyatlari farq qiladi; tanlov odatda jamoa va loyiha vazifalariga bog‘liq.
