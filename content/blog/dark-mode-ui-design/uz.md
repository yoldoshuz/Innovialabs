---
title: Sayt va ilova uchun qorong‘i mavzuni qanday loyihalash kerak
description: Qorong‘i mavzu: qora o‘rniga to‘q kulrang fon, ochroq yuzalar orqali chuqurlik, xiralashtirilgan aksentlar, kontrastni tekshirish va light/dark tokenlari.
summary: Qorong‘i mavzu — ranglarni teskari aylantirish emas: sof qora o‘rniga to‘q kulrangdan foydalaning, chuqurlikni ochroq yuzalar bilan ko‘rsating, aksentlar uchun ochroq va kamroq to‘yingan tuslarni oling, kontrastni ikkala mavzuda tekshiring va hammasini semantik tokenlarga quring.
---

## Qisqa javob

Yaxshi qorong‘i mavzu avtomatik yaratilmaydi, balki loyihalanadi. Beshta qoida ishning katta qismini qamrab oladi:

1. Sof qora emas, **to‘q kulrang fon**.
2. Soyalar emas, **ochroq yuzalar orqali chuqurlik**.
3. **Ochroq, kamroq to‘yingan aksent ranglar.**
4. Ikkala mavzuda **tekshirilgan kontrast**.
5. Komponentlar avtomatik almashishi uchun **semantik tokenlar**.

## Sof qora va sof oqdan qoching

`#000000` ustidagi oq matn juda keskin kontrast beradi. Ba’zi o‘quvchilarda harflar «yoyilib» yoki porlab ko‘rina boshlaydi, uzoq o‘qish esa charchatadi. Bundan tashqari sof qora chuqurlik uchun joy qoldirmaydi: fonni bundan to‘qroq qilib bo‘lmaydi, soyalar esa yo‘qoladi.

**To‘q kulrang** asosdan boshlang — masalan, Material Design bazaviy qorong‘i yuza sifatida `#121212` dan foydalanadi. Matn uchun `#FFFFFF` o‘rniga **biroz xiralashtirilgan oq**, ikkinchi darajali matn uchun esa yumshoqroq kulrang oling.

Sof qoraning ham o‘z o‘rni bor: ba’zi ilovalar OLED ekranlar uchun alohida «true black» rejimini taklif qiladi. Faqat uni sinovsiz standart variant qilmang.

## Ochroq yuzalar orqali chuqurlik

Yorug‘ mavzuda chuqurlikni soyalar yaratadi. Qorong‘i fonda soyalar deyarli ko‘rinmaydi, shuning uchun mantiq o‘zgaradi: **yuza qanchalik baland bo‘lsa, shunchalik och bo‘ladi**.

| Daraja | Element misollari | Yuza |
|---|---|---|
| 0 | Sahifa foni | Eng to‘q |
| 1 | Kartochkalar, ro‘yxat elementlari | Biroz ochroq |
| 2 | Sarlavha qismlari, qotirilgan panellar | Yanada ochroq |
| 3 | Menyular, dialoglar, popoverlar | Eng och |

Qadamlar kichik va izchil bo‘lsin. Faqat ochlik yetmagan joyda yuzalarni ajratishga xira och tusdagi ingichka chegaralar yordam beradi.

## Xiralashtirilgan aksentlar

Oq fonda yaxshi ko‘rinadigan yorqin, to‘yingan ranglar qorong‘i fonda «titray» boshlaydi va ko‘pincha kontrastdan o‘tmaydi. Xuddi shu tonning **ochroq va kamroq to‘yingan tuslaridan** foydalaning: agar palitrada 50 dan 900 gacha shkala bo‘lsa, qorong‘i mavzu odatda yorug‘ mavzuga qaraganda ochroq pog‘onalarni oladi.

Holat ranglari ham shunday: xatolar uchun qizil, muvaffaqiyat uchun yashil va ogohlantirish uchun sariqning qorong‘i versiyalari kerak. Brend tanilishini tekshiring — ton saqlanadi, faqat ochlik va to‘yinganlik o‘zgaradi.

## Kontrastni ikkala mavzuda tekshiring

WCAG chegaralari ikkala mavzu uchun bir xil:

- oddiy matn uchun **4,5:1**;
- yirik matn uchun **3:1**;
- boshqaruv elementlari chegaralari, ikonkalar va ma’noli grafika uchun **3:1**.

Qorong‘i mavzuda ko‘pincha nimalar e’tibordan chetda qoladi: ikkinchi darajali matn va plaseholderlar, maydon chegaralari, fokus chizig‘i, ajratgichlar, grafik ranglari va faol bo‘lmagan holatlar. **Rasmlarni** ham tekshiring: shaffof fondagi to‘q elementli logotiplar yo‘qolib qoladi, shuning uchun ularning och versiyalarini tayyorlang.

## Light va dark tokenlarini sozlang

Ikki qatlam quring:

- **Primitiv tokenlar** — palitraning o‘zi: `violet-300`, `grey-900`.
- **Semantik tokenlar** — rollar: `bg`, `surface`, `text`, `text-muted`, `border`, `accent`. Har birining yorug‘ va qorong‘i mavzu uchun qiymati bor.

Komponentlar **faqat semantik tokenlardan** foydalanadi. Shunda mavzuni almashtirish ekranlarni qayta chizish emas, qiymatlarni almashtirish bo‘ladi. Figma da bu Light va Dark rejimli Variables, kodda esa CSS o‘zgaruvchilari:

```css
:root {
  color-scheme: light dark;
  --bg: #ffffff;
  --surface: #f4f3f7;
  --text: #1a1033;
  --text-muted: #5c5670;
  --accent: #7c3aed;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #121212;
    --surface: #1e1e22;
    --text: #ececf1;
    --text-muted: #a3a1ad;
    --accent: #a78bfa;
  }
}
```

`color-scheme` xossasi brauzerga native elementlar va aylantirish chiziqlarini ham moslashtirishni bildiradi. Qo‘lda almashtirish uchun qiymatlarni `[data-theme="dark"]` kabi atribut ostida takrorlang.

## Mavzuni qanday almashtirish kerak

- Standart holatda **tizim sozlamasiga** amal qiling.
- **Qo‘lda tanlash** imkonini bering (Yorug‘ / Qorong‘i / Tizimdagidek) va tanlovni eslab qoling.
- Vebda sahifa yuklanganda noto‘g‘ri ranglar bilan miltillamasligi uchun mavzuni **birinchi chizishdan oldin** qo‘llang.

## Ko‘p uchraydigan xatolar

- Mavzuni loyihalash o‘rniga ranglarni avtomatik teskari aylantirish.
- Sof qora fonda sof oq matn.
- Yorug‘ mavzudagi kabi to‘yingan brend ranglari.
- Chuqurlikni faqat soyalar hisobiga berish.
- Komponentlarda mavzuni inobatga olmaydigan qattiq yozilgan hex qiymatlar.
- Unutilgan logotiplar, illyustratsiyalar va grafiklar.

## FAQ

### Har bir mahsulotga qorong‘i mavzu kerakmi?

Yo‘q, lekin ko‘plab foydalanuvchilar uni kutadi, ayniqsa kechqurun yoki uzoq vaqt ishlatiladigan ilovalarda. Agar hozircha uni sifatli qo‘llab-quvvatlay olmasangiz, o‘qib bo‘lmaydigan burchaklari bor qorong‘i mavzudan ko‘ra bitta puxta mavzu chiqargan ma’qul.

### Qorong‘i mavzu batareyani tejaydimi?

OLED ekranlarda to‘q piksellar kamroq energiya sarflaydi, shuning uchun qorong‘i interfeys yordam berishi mumkin. LCD ekranlarda yoritgich doim ishlaydi va farq kichik. Buni asosiy sabab emas, qo‘shimcha bonus deb hisoblang.

### Avval qaysi mavzuni loyihalash kerak — yorug‘ yoki qorong‘i?

Foydalanuvchilaringizning ko‘pchiligi ko‘radigan mavzudan boshlang, lekin semantik tokenlarni birinchi kundan kiriting. Shunda ikkinchi mavzu har bir ekranni qayta ishlash emas, qiymatlarni tanlash va kontrastni tekshirish bo‘ladi.
