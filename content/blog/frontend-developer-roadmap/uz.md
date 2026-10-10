---
title: Frontend-dasturchi roadmap’i: nimani va qaysi tartibda o‘rganish kerak
description: Bo‘lajak frontend-dasturchi uchun bosqichma-bosqich reja: HTML, CSS va JavaScript’dan freymvorklar, vositalar va testlargacha, har bosqichda loyiha bilan.
summary: Frontend’ni qatlamma-qatlam o‘rganing: HTML va CSS, keyin JavaScript, Git va API, so‘ng bitta freymvork, TypeScript, yig‘ish vositalari va testlar; har bosqichni o‘z loyihangiz bilan mustahkamlang.
---

## Tartib bitta ro‘yxatda

Frontend’ni qatlamlar bo‘yicha o‘rganish eng oson, har bir keyingi qatlam oldingisiga tayanadi:

1. **HTML va CSS** — sahifa tuzilishi va ko‘rinishi.
2. **JavaScript** — mantiq va interaktivlik.
3. **Git, brauzer va API** — kundalik ish vositalari.
4. **Bitta freymvork** — masalan, React, Vue yoki Angular.
5. **TypeScript va vositalar** — tiplashtirish, yig‘ish, linterlar.
6. **Testlash va sifat** — testlar, foydalanish qulayligi (accessibility), tezlik.

Yangi boshlovchilarning asosiy xatosi — darhol freymvorkka sakrash. JavaScript’ni yaxshi bilmasangiz, freymvork sehrli afsunlar to‘plamiga aylanadi.

## 1-bosqich. HTML va CSS

Nimani o‘rganish kerak:

- **Semantik belgilash**: `header`, `main`, `nav`, `article`, formalar va ularning atributlari.
- **CSS asoslari**: selektorlar, kaskad, box model, o‘lchov birliklari.
- **Joylashuv**: Flexbox va Grid.
- **Moslashuvchanlik**: media queries, mobile first.
- **Asosiy accessibility**: alt matnlar, maydon yorliqlari, kontrast.

**Nazorat nuqtasi:** maket bo‘yicha sahifa yasay olasiz va u telefonda ham, kompyuterda ham to‘g‘ri ko‘rinadi.

**Loyiha:** kutubxonalarsiz yasalgan lending yoki rezyume sahifasi.

## 2-bosqich. JavaScript

- O‘zgaruvchilar, tiplar, funksiyalar, ko‘rinish sohalari, closure’lar.
- Massivlar va obyektlar, `map`, `filter`, `reduce` metodlari.
- DOM va hodisalar bilan ishlash.
- Asinxronlik: promise’lar, `async/await`, `fetch`.
- Modullar va xatolarni asosiy qayta ishlash.

**Nazorat nuqtasi:** kichik asinxron kod nima chiqarishini tushuntira olasiz va freymvorksiz interaktiv interfeys yoza olasiz.

**Loyiha:** `localStorage`’da saqlanadigan vazifalar ro‘yxati yoki amallar tarixiga ega kalkulyator.

## 3-bosqich. Git, brauzer va API

- **Git**: commit’lar, branch’lar, birlashtirish, pull request.
- **DevTools**: inspektor, konsol, Network bo‘limi, debugging.
- **HTTP va REST**: metodlar, status kodlari, sarlavhalar, JSON.

```bash
git checkout -b feature/search
git add .
git commit -m "Add search by title"
git push origin feature/search
```

**Nazorat nuqtasi:** loyihalaringiz GitHub’da mazmunli commit tarixi bilan joylashgan.

**Loyiha:** ochiq API’dan (ob-havo, valyuta kurslari, filmlar) ma’lumot yuklaydigan, qidiruv, yuklanish holati va xatolarni qayta ishlashga ega ilova.

## 4-bosqich. Freymvork

O‘z shahringizdagi yoki kerakli kompaniyadagi vakansiyalarga qarab **bitta** freymvorkni tanlang. O‘rganing:

- komponentlar, props va holat (state);
- formalar va ro‘yxatlar bilan ishlash;
- marshrutlash (routing);
- ma’lumot yuklash va holatni boshqarish.

**Nazorat nuqtasi:** interfeysni komponentlarga ajrata olasiz va komponent nega qayta chizilishini tushuntira olasiz.

**Loyiha:** ko‘p sahifali ilova, masalan, filtrlar, savatcha va mahsulot sahifasiga ega katalog.

## 5-bosqich. TypeScript va vositalar

- **TypeScript**: tiplar, interfeyslar, boshlang‘ich darajada generics.
- **Yig‘uvchilar va paket menejerlari**: npm va yig‘uvchi nima qilishini tushunish.
- **Linter va formatter**: ESLint, Prettier.
- **Deploy**: loyihani statik saytlar hostingiga joylash.

**Nazorat nuqtasi:** loyiha tip xatolarisiz yig‘iladi va ochiq havola orqali mavjud.

## 6-bosqich. Testlash va sifat

- Funksiya va komponentlar uchun **unit-testlar**.
- Asosiy ssenariylar uchun **E2E-testlar**.
- **Tezlik**: bundle hajmi, kechiktirilgan yuklash, rasmlarni optimallashtirish.
- **Accessibility**: klaviatura bilan navigatsiya, ekran o‘qish dasturlari bilan ishlash.

**Loyiha:** oldingi loyihalaringizdan biriga testlar va CI’da linter tekshiruvini qo‘shing.

## Ko‘p uchraydigan xatolar

| Xato | Oqibati |
|---|---|
| Uchta freymvorkni bir vaqtda o‘rganish | Hammasida yuzaki bilim |
| Amaliyotsiz kurs ko‘rish | Tushunish illyuziyasi |
| Tutoriallarni aynan ko‘chirish | Portfolio yuzlab boshqalardan farq qilmaydi |
| CSS’ga e’tibor bermaslik | Real vazifalarda sahifa yasashda muammolar |

## FAQ

### Frontend-dasturchi bo‘lish uchun qancha vaqt kerak?

Muddat boshlang‘ich tayyorgarlik, haftasiga ajratiladigan soatlar va amaliyot hajmiga bog‘liq. Kalendarga emas, nazorat nuqtalariga qarang: 4-bosqichni ishonch bilan o‘tsangiz va 2-3 ta o‘z loyihangiz bo‘lsa, vakansiyalarga ariza topshirishni boshlash mumkin.

### Birinchi qaysi freymvorkni tanlash kerak?

Sizni qiziqtirgan vakansiyalarda ko‘proq uchraydiganini. Zamonaviy freymvorklarning tamoyillari o‘xshash, shuning uchun ikkinchisi birinchisiga qaraganda ancha oson o‘zlashtiriladi.

### Juniorga TypeScript kerakmi?

U ko‘p loyihalarda ishlatiladi, shuning uchun asosiy bilim ustunlik bo‘ladi. Lekin JavaScript’dan boshlang: TypeScript uning ustiga qurilgan.
