---
title: Kodni qanday debug qilish: tizimli bosqichma-bosqich yondashuv
description: Takrorlanadigan debugging jarayoni — takrorlash, izolyatsiya, gipoteza, tekshirish — hamda breakpoint, log va o‘rdakcha usulidan samarali foydalanish.
summary: Debugging — taxmin emas, sikl: bagni barqaror takrorlang, xato joyini toraytiring, bitta gipoteza tuzing, uni faktlar bilan tekshiring, tuzatgandan so‘ng test bilan mustahkamlang.
---

## Debuggingning asosiy qoidasi

Kodni tasodifiy o‘zgartirish o‘rniga **jarayon bo‘yicha harakat qilsangiz**, bag deyarli har doim tezroq topiladi. To‘rt qadamli ishchi sikl:

1. **Takrorlash** — xato barqaror paydo bo‘lishiga erishish.
2. **Izolyatsiya** — u yuzaga keladigan sohani toraytirish.
3. **Gipoteza** — bitta aniq sababni ilgari surish.
4. **Tekshirish** — his-tuyg‘u emas, faktlar bilan tasdiqlash yoki rad etish.

Gipoteza tasdiqlanmasa — yangi ma’lumotlar bilan 2-qadamga qaytasiz.

## 1-qadam. Takrorlash

Takrorlashsiz bagni tuzatganingizni bilolmaysiz. To‘plang:

- aniq qadamlar, kirish ma’lumotlari va muhit (brauzer, OT, ilova versiyasi);
- xatoning to‘liq matni va **stack trace** — uni o‘zingizning kodingizdagi birinchi qatorgacha o‘qing;
- nima kutilgan va aslida nima bo‘lgan.

Maqsad — **minimal misol**: bag hali ham bor bo‘lgan holda imkon qadar kam qadam va ma’lumot. Ideal holatda uni hozir yiqiladigan avtotestga aylantiring.

## 2-qadam. Izolyatsiya

Qidiruv doirasini toraytiring:

- **Kod bo‘yicha binar qidiruv**: ma’lumotlar yo‘lining o‘rtasiga tekshiruv qo‘ying. Qiymat allaqachon noto‘g‘rimi? Yuqoridan qidiring. To‘g‘rimi? Pastdan.
- **Tarix bo‘yicha binar qidiruv**: avval ishlagan bo‘lsa, `git bisect` hammasini buzgan kommitni topadi.

```bash
git bisect start
git bisect bad            # joriy versiya buzilgan
git bisect good <hash>    # bu versiya ishlagan
# taklif qilingan har bir versiyani tekshirib, good/bad deb belgilaysiz
git bisect reset
```

- **Ortiqchasini olib tashlang**: kesh, kengaytmalar, ma’lumotlarning bir qismi, uchinchi tomon servislarini o‘chiring — bag yo‘qolguncha. Oxirgi olib tashlangan narsa — gumondor.

## 3-qadam. Gipoteza

Uni bitta jumlada ifodalang: «Narx satr sifatida keladi, shuning uchun `+` qo‘shmaydi, balki yopishtiradi». Yaxshi gipoteza **tekshirib bo‘ladigan** va qaysi kuzatuv uni rad etishini ko‘rsatadigan bo‘ladi. Tekshirilgan gipotezalarni yozib boring — debugging cho‘zilsa, vaqt tejaladi.

## 4-qadam. Vositalar bilan tekshirish

### Breakpointlar

IDE yoki brauzerdagi debugger dasturni kerakli qatorda to‘xtatadi va siz shu paytdagi barcha o‘zgaruvchilarni ko‘rasiz.

- **Shartli breakpointlar** faqat shart bajarilganda ishlaydi, masalan `order.id === 42`, — sikllarda juda foydali.
- **Step over / step into / step out** — kod bo‘ylab qatorma-qator yuring, funksiyalarga faqat kerak bo‘lganda kiring.
- **Call stack** dastur bu yerga qanday kelganini ko‘rsatadi.

### Watch expressions

Kuzatuv paneliga `items.length` yoki `user?.role` kabi ifodalarni qo‘shing: ular har qadamda qayta hisoblanadi va qiymat noto‘g‘ri bo‘ladigan paytni ko‘rasiz.

### Loglash

Debuggerni ulab bo‘lmaydigan joyda loglar almashtirib bo‘lmas: prodakshn, asinxron jarayonlar, vaqt bilan bog‘liq muammolar.

- **Kontekstni** loglang: identifikatorlar, kirish qiymatlari, shartning qaysi tarmog‘i.
- Darajalardan foydalaning: `debug`, `info`, `warn`, `error`.
- Loglarga parollar, tokenlar va shaxsiy ma’lumotlarni yozmang.
- Vaqtinchalik `console.log` va `print`larni tuzatishdan so‘ng o‘chiring.

### O‘rdakcha usuli

Kodni qatorma-qator tushuntiring — hamkasbga, rezina o‘rdakchaga yoki matnli eslatmada. Nima «bo‘lishi kerak»ligini aytib, ko‘pincha haqiqat kutilganidan farq qiladigan joyni o‘zingiz payqaysiz.

## Tuzatgandan so‘ng

- Dastlabki ssenariy endi takrorlanmasligiga ishonch hosil qiling.
- Bag qaytmasligi uchun **regression test** qo‘shing.
- **O‘xshash joylarni** qidiring: xuddi shu xato nusxalangan bo‘lishi mumkin.
- Simptomni emas, sababni tuzating: xatoni shunchaki bostiradigan `try/catch` — tuzatish emas.

## Keng tarqalgan xatolar

- Bir vaqtda bir nechta narsani o‘zgartirish — nima yordam bergani noma’lum qoladi.
- Qiymatlarni tekshirish o‘rniga taxminlarga ishonish.
- Birinchi xato xabarini e’tiborsiz qoldirib, faqat oxirgisiga qarash.
- Soatlab tanaffussiz debug qilish: qisqa pauza ko‘pincha aniq narsani ko‘rishga yordam beradi.

## FAQ

### Qaysi biri yaxshiroq: debugger yoki loglar?

Ular bir-birini to‘ldiradi. Debugger bag takrorlanadigan lokal muhitda qulay; loglar — prodakshnda va asinxron yoki kamdan-kam uchraydigan xatolar uchun.

### Bag takrorlanmasa nima qilish kerak?

Ko‘proq ma’lumot to‘plang: shubhali joy atrofida loglashni kengaytiring, muhitlar va kirish ma’lumotlarini solishtiring. Beqaror baglar ko‘pincha poyga holatlari, kesh yoki vaqt bilan bog‘liq.

### Qachon yordam so‘rash kerak?

Bir nechta gipotezani tekshirib, yangi g‘oyalar qolmaganda. Takrorlash qadamlari va nimalar tekshirilganini yozing — ko‘pincha savolni tayyorlashning o‘zi javobni ko‘rsatadi.
