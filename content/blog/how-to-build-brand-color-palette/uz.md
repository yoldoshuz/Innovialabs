---
title: Brend va mahsulot uchun rang palitrasini qanday yig‘ish mumkin
description: Ishchi palitrani bosqichma-bosqich yig‘ish: asosiy rangni tanlash, och va to‘q tuslar shkalasi, neytral va semantik ranglar, real interfeysda sinash.
summary: Ma’nosi aniq bitta asosiy rangni tanlang, uni tuslar shkalasiga kengaytiring, biroz tuslangan neytral va semantik ranglarni qo‘shing, hammasini tokenlarga aylantiring va real ekranlarda hamda kontrast bo‘yicha sinang.
---

## Qisqacha javob

Ishchi palitra — bu beshta chiroyli namuna emas, to‘rt qatlamli **tizim**:

1. **Asosiy rang** — brendning asosiy taniqli tusi.
2. Shu rangning och va to‘q variantlari **shkalasi**.
3. **Neytral ranglar** — matn, fon va chegaralar uchun kulranglar.
4. **Semantik ranglar** — muvaffaqiyat, ogohlantirish, xato, ma’lumot.

**Qo‘shimcha yoki aksent** rangni faqat mahsulotga haqiqatan kerak bo‘lsa qo‘shing.

## 1-qadam. Asosiy rangni tanlang

Sevimli rangdan emas, ma’no va kontekstdan kelib chiqing.

- **Assotsiatsiyalar**: ko‘k ko‘pincha xotirjam va ishonchli, yashil — o‘sish yoki pul, qizil — energiya yoki xavf sifatida qabul qilinadi. Assotsiatsiyalar madaniyat va sohaga bog‘liq, ularni o‘z auditoriyangiz uchun tekshiring.
- **Raqobatchilar**: raqobatchilar logotiplarini yonma-yon qo‘ying. Sohada hech kim ishlatmaydigan rangni «o‘zlashtirish» osonroq.
- **Amaliylik**: rang oq yoki to‘q matnli tugma foni sifatida, shuningdek och va to‘q yuzalarda ishlashi kerak.

Bitta bazaviy qiymatni belgilang, masalan HEX va OKLCH formatida.

## 2-qadam. Tuslar shkalasini tuzing

Odatda **10–12 pog‘onali** shkala kerak (ko‘pincha 50, 100, 200 … 900 deb nomlanadi). Och pog‘onalar fon va hover uchun, o‘rtalari tugma va havolalar uchun, to‘qlari och fondagi matn va bosilgan holatlar uchun.

Uni qanday yaxshi qilish mumkin:

- **OKLCH** kabi **perseptiv rang fazosida** ishlang. Shunda pog‘onalar ko‘zga bir tekis ko‘rinadi, HSL’dagi oddiy yorqinlik o‘zgarishidan farqli o‘laroq.
- **Tus**ni (hue) taxminan o‘zgarmas saqlang, lekin eng och va eng to‘q uchlarida **to‘yinganlikni** (chroma) kamaytiring, aks holda ranglar zaharli yoki loyqa bo‘lib qoladi.
- Tusni biroz siljitish yordam beradi: ko‘p palitralarda to‘q pog‘onalar biroz sovuqroq, och pog‘onalar esa biroz iliqroq.
- Vositalar: Adobe Leonardo, Radix Colors, Coolors yoki Figma’dagi shkala generatori plaginlari.

```css
:root {
  --brand-50:  oklch(97% 0.02 270);
  --brand-100: oklch(93% 0.04 270);
  --brand-300: oklch(78% 0.11 270);
  --brand-500: oklch(58% 0.20 270);
  --brand-700: oklch(45% 0.18 270);
  --brand-900: oklch(28% 0.10 270);
}
```

## 3-qadam. Neytral ranglarni qo‘shing

Interfeysdagi ishning katta qismini neytral ranglar bajaradi: matn, fonlar, ajratgichlar, nofaol holatlar.

- Brend shkalasi bilan bir xil pog‘onalar soniga ega kulrang shkala tuzing.
- Kulranglarni asosiy tus tomon biroz tuslang (juda past to‘yinganlik). Yorqin brend rangi yonidagi sof kulrang jonsiz ko‘rinishi mumkin.
- **Asosiy matn** uchun yetarlicha to‘q va **sahifa foni** uchun yetarlicha och pog‘ona borligiga ishonch hosil qiling.

## 4-qadam. Semantik ranglarni belgilang

Foydalanuvchilarda barqaror kutishlar bor:

| Rol | Odatiy tus | Qayerda ishlatiladi |
|---|---|---|
| Muvaffaqiyat | yashil | tasdiqlar, yakunlangan harakatlar |
| Ogohlantirish | qahrabo / to‘q sariq | xavfli harakatlar, e’tibor talab qilinadi |
| Xato | qizil | validatsiya xatolari, o‘chirish |
| Ma’lumot | ko‘k | neytral bildirishnomalar, maslahatlar |

Har bir semantik rang uchun kamida **fon**, **chegara** va **matn** pog‘onalari kerak. Brendingiz qizil yoki yashil bo‘lsa, semantik tuslarni shunday to‘g‘rilangki, xato oddiy tugmaga o‘xshab qolmasin.

## 5-qadam. Ranglarni tokenlarga aylantiring

**Qiymatlar** va **rollarni** ajrating:

- primitiv tokenlar: `brand-500`, `gray-100`;
- semantik tokenlar: `color-bg`, `color-text`, `color-primary`, `color-danger-bg`.

Komponentlar faqat semantik tokenlardan foydalanadi. Shunda qorong‘i mavzu yoki rebrending har bir komponentni emas, faqat moslashtirishni o‘zgartiradi.

## 6-qadam. Real interfeysda sinang

Namunalar aldaydi, ekranlar esa yo‘q. Test sahifasini yig‘ing:

- barcha holatlardagi asosiy, ikkinchi darajali va ghost tugmalar (oddiy, hover, bosilgan, nofaol);
- xato va muvaffaqiyat xabarlari bilan forma maydonlari;
- kartochkalar, jadvallar, navigatsiya, bildirishnomalar;
- bir nechta seriyali grafik;
- xuddi shu sahifa **qorong‘i mavzuda**.

Haqiqatan ishlatiladigan har bir matn va fon juftligi uchun **matn kontrastini** WCAG bo‘yicha tekshiring. Sahifani kunduzgi yorug‘likda telefonda va arzon monitorda ko‘ring. Asosiy savol: asosiy harakat hali ham eng ko‘zga tashlanadigan narsami?

Keng tarqalgan mo‘ljal — **60-30-10**: asosan neytral ranglar, bir qism ikkinchi darajali yuzalar va ozgina brend aksenti. Bu qonun emas, boshlang‘ich nuqta.

## Ko‘p uchraydigan xatolar

- Sof brend rangini hamma joyda, jumladan katta fonlarda ishlatish.
- E’tibor uchun bahslashadigan juda ko‘p aksentlar.
- Shaffoflik orqali ochlashtirish: turli fonlarda rang turlicha chiqadi.
- Qorong‘i mavzuni «keyinroq»ka qoldirish.
- Kontrastni real matn uchun emas, faqat logotip uchun tekshirish.

## FAQ

### Brend palitrasida nechta rang bo‘lishi kerak?

Odatda shkalasi bilan bitta asosiy rang, bitta neytral shkala va to‘rtta semantik rang. Aksent faqat uning uchun aniq vazifa bo‘lganda qo‘shiladi.

### Logotip rangi tugmalar rangi bilan bir xil bo‘lishi shartmi?

Ko‘pincha ha, lekin har doim emas. Agar logotip rangi tugma foni sifatida kontrastdan o‘tmasa, interaktiv elementlar uchun shu tusning to‘qroq pog‘onasidan foydalaning.

### Nega HEX yoki HSL emas, OKLCH?

HEX qiymatlarni saqlash uchun yaxshi, ammo OKLCH yorqinlikni inson qanday qabul qilsa, shunday o‘zgartiradi, shuning uchun yaratilgan shkalalar tekisroq ko‘rinadi.
