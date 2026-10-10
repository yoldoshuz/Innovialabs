---
title: WebAssembly nima va uni brauzerda qachon ishlatish kerak
description: WebAssembly JavaScript bilan yonma-yon qanday ishlaydi, unga qaysi tillar kompilyatsiya qilinadi, qayerda haqiqatan foydali va uning cheklovlari qanday.
summary: WebAssembly — brauzer JavaScript bilan yonma-yon deyarli nativ tezlikda bajaradigan ixcham binar format; u oddiy interfeyslar uchun emas, og‘ir hisob-kitoblar va tayyor kodni ko‘chirish uchun kerak.
---

## WebAssembly haqida qisqacha

**WebAssembly (Wasm)** — brauzer JavaScript bilan bir xil sandboxda, lekin nativ dasturlar tezligiga yaqinroq bajaradigan binar kod formati. Uni odatda qo‘lda yozishmaydi: C, C++, Rust yoki boshqa tildagi kod `.wasm` fayliga kompilyatsiya qilinadi va sahifaga yuklanadi.

Wasm **JavaScript o‘rnini bosmaydi**. U uning yonida ishlaydi: JavaScript sahifa, DOM va hodisalarni boshqaradi, Wasm esa og‘ir hisob-kitoblarni o‘z zimmasiga oladi.

## Wasm JavaScript bilan qanday ishlaydi

O‘zaro ishlash sxemasi:

1. Brauzer `.wasm` modulini yuklaydi va kompilyatsiya qiladi.
2. JavaScript modul nusxasini yaratadi va uning **eksport qilingan funksiyalariga** kirish oladi.
3. Modul JavaScript unga bergan funksiyalarni (**importlar**) chaqira oladi.
4. Ma’lumotlar **chiziqli xotira** orqali uzatiladi — ikkala tomon ko‘radigan umumiy baytlar buferi.

```js
const { instance } = await WebAssembly.instantiateStreaming(
  fetch("/math.wasm"),
  {}
);

console.log(instance.exports.add(2, 3)); // 5
```

Muhim jihat: Wasm ning **DOM ga to‘g‘ridan-to‘g‘ri kirishi yo‘q**. Sahifa bilan har qanday ish JavaScript orqali bo‘ladi. Shuning uchun JS va Wasm o‘rtasida kichik ma’lumot bo‘laklari bilan tez-tez chaqiruvlar foydani yo‘qqa chiqarishi mumkin — ishni katta bloklar bilan bering.

## Qaysi tillar Wasm ga kompilyatsiya qilinadi

| Til | Vositalar | Xususiyatlari |
|---|---|---|
| **Rust** | wasm-pack, wasm-bindgen | Yetuk ekotizim, JS bilan qulay bog‘lanish, ixcham natija |
| **C / C++** | Emscripten | Mavjud kutubxona va dvijoklarni ko‘chirish imkonini beradi |
| **Go** | O‘rnatilgan qo‘llab-quvvatlash, TinyGo | Standart yig‘ish runtime ni qo‘shadi, TinyGo kichikroq fayllar beradi |
| **AssemblyScript** | O‘z kompilyatori | Sintaksisi TypeScript ga o‘xshash, JS-dasturchilar uchun oson boshlanish |
| **C#, Kotlin va boshqalar** | Blazor, Kotlin/Wasm | O‘z runtime ini olib keladi, fayllar odatda kattaroq |

Axlat yig‘uvchili (GC) tillar tarixan uni bandl ichida olib yurgan. Wasm darajasidagi GC qo‘llab-quvvatlashi buni o‘zgartiradi, lekin aniq til va brauzerlar uchun holatni tekshiring.

## Wasm qayerda haqiqatan foydali

- **Rasm va video bilan ishlash**: siqish, formatlarni o‘zgartirish, filtrlar — faylni serverga yubormasdan to‘g‘ridan-to‘g‘ri brauzerda.
- **Muharrirlar va murakkab ilovalar**: grafik va CAD muharrirlar, ofis vositalari — tezlik muhim va C++ yoki Rust da katta kod bazasi allaqachon bor joylarda.
- **O‘yinlar va 3D**: Wasm ga kompilyatsiya qilingan dvijoklar WebGL yoki WebGPU bilan birga ishlaydi.
- **Mavjud kutubxonalarni ko‘chirish**: ma’lumotlar bazalari, kodeklar, parserlar, kriptografiya — JavaScript da qayta yozmasdan.
- **Klientdagi hisob-kitoblar**: simulyatsiyalar, ma’lumotlar tahlili, kichik ML-modellarni lokal ishga tushirish.

## Wasm qachon kerak emas

- Oddiy saytlar, lendinglar, formalar, internet-do‘konlar — u yerda tor joy hisoblash tezligida emas, tarmoq, rasmlar va renderingda.
- Asosan **DOM bilan ishlaydigan** mantiq: JavaScript orqali chaqiruvlar yutuqni yeb qo‘yadi.
- Zamonaviy JavaScript dvijogi allaqachon yetarlicha tez bo‘lgan kichik vazifalar.

Wasm ni tanlashdan oldin **profillang**: muammo aynan hisob-kitoblarda ekaniga ishonch hosil qiling.

## Cheklovlar

- **Fayl hajmi**: til runtime iga ega modul ekvivalent JS dan sezilarli og‘irroq bo‘lishi mumkin.
- **Debag** murakkabroq, garchi DevTools ba’zi tillar uchun source maps va DWARF ni qo‘llab-quvvatlasa ham.
- DOM va ko‘pchilik Web API larga **to‘g‘ridan-to‘g‘ri kirish yo‘q** — faqat JavaScript o‘ramlari orqali.
- **Ko‘p oqimlilik** SharedArrayBuffer va sahifani izolyatsiya qilish uchun maxsus sarlavhalarni talab qiladi.
- **Xavfsizlik**: Wasm sandboxda ishlaydi, lekin C/C++ dagi manba kod zaifliklari (masalan, bufer to‘lib ketishi) modul xotirasi ichidagi ma’lumotlarni buzishi mumkin.

## FAQ

### WebAssembly JavaScript dan tezroqmi?

Intensiv hisob-kitoblar uchun — ko‘pincha ha va eng muhimi, tezligi oldindan bashorat qilinadigan. Oddiy interfeys mantiqi uchun farq sezilmasligi, ma’lumot uzatish xarajatlari esa sezilarli bo‘lishi mumkin.

### Butun frontendni WebAssembly da yozish mumkinmi?

Mumkin, Rust va C# da freymvorklar mavjud. Lekin DOM bilan ish baribir JavaScript orqali bo‘ladi, yuklanish hajmi esa odatda kattaroq. Ko‘pchilik interfeyslar uchun JavaScript va TypeScript amaliyroq bo‘lib qoladi.

### WebAssembly brauzerdan tashqarida ishlatiladimi?

Ha. WASI tufayli u serverda, edge-platformalarda va plagin tizimlarida xavfsiz, izolyatsiyalangan bajariladigan format sifatida ishga tushiriladi.
