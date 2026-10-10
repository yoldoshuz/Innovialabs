---
title: Git merge yoki rebase: farqlari va qachon nimani ishlatish kerak
description: Merge, squash va rebase commitlar tarixini qanday shakllantiradi, nega umumiy branchlarni rebase qilib bo‘lmaydi va jamoa qaysi siyosatni tanlashi kerak.
summary: Merge tarixni bo‘lganicha saqlab, birlashtirish commitini qo‘shadi, rebase esa commitlarni to‘g‘ri chiziqqa qayta yozadi. Rebase faqat o‘z lokal branchlaringiz uchun, umumiylari uchun merge.
---

## Qisqa javob

`merge` ham, `rebase` ham bitta vazifani hal qiladi — bir branchdagi o‘zgarishlarni boshqasiga o‘tkazadi. Farq shundaki, keyin **tarix qanday ko‘rinishda** bo‘ladi:

- **Merge** haqiqiy tarixni saqlaydi va alohida birlashtirish commitini qo‘shadi.
- **Rebase** commitlaringizni boshqa branch ustiga qaytadan qo‘llaydi, tarix to‘g‘ri chiziqqa aylanadi.
- **Squash merge** branchdagi barcha commitlarni bittaga jamlab, asosiy branchga qo‘shadi.

Asosiy qoida: **boshqalar allaqachon foydalanayotgan branchlarni rebase qilmang**.

## Tarix qanday ko‘rinadi

Boshlang‘ich holat: siz `main` dan `feature` branchini ochdingiz va D hamda E commitlarini qildingiz, bu orada `main` da B va C commitlari paydo bo‘ldi.

```text
          D---E  feature
         /
    A---B---C  main
```

### Merge dan keyin

```bash
git switch main
git merge feature
```

```text
          D---E
         /     \
    A---B---C---M  main
```

Ikki ota-onali **M** birlashtirish commiti paydo bo‘ladi. Ish parallel borgani ko‘rinib turadi, mavjud commitlarning hech biri o‘zgarmagan.

### Squash merge dan keyin

```bash
git switch main
git merge --squash feature
git commit -m "Add feature"
```

```text
    A---B---C---S  main
```

Branchdagi barcha o‘zgarishlar bitta **S** commitiga jamlangan. `main` tarixi toza, lekin branchning oraliq qadamlari unda ko‘rinmaydi.

### Rebase dan keyin

```bash
git switch feature
git rebase main
```

```text
                  D'--E'  feature
                 /
    A---B---C  main
```

D va E commitlari C ustida **D'** va **E'** sifatida yangi heshlar bilan qayta yaratilgan. Endi `main` ga `git merge feature` oddiy fast-forward bo‘ladi va tarix chiziqli qoladi.

## Taqqoslash

| Mezon | Merge | Squash merge | Rebase |
|---|---|---|---|
| Tarixni qayta yozadi | yo‘q | yo‘q (main uchun) | ha |
| Tarix shakli | tarmoqlangan | chiziqli | chiziqli |
| Branchning alohida commitlarini saqlaydi | ha | yo‘q | ha |
| Umumiy branchlar uchun xavfsiz | ha | ha | yo‘q |
| Konfliktlar hal qilinadi | bir marta | bir marta | har bir commit uchun |

## Rebase ning oltin qoidasi

**Yuborilgan va boshqalar tayanayotgan commitlarni rebase qilmang.**

Rebase eski commitlar o‘rniga yangilarini yaratadi. Agar hamkasbingiz o‘z ishini eski commitlar ustiga qurgan bo‘lsa, sizning `push --force` dan keyin tarixlaringiz ajralib ketadi: dublikatlar, konfliktlar va chalkashlik paydo bo‘ladi.

Rebase xavfsiz bo‘lgan holatlar:

- yuborishdan oldin o‘z lokal branchingiz;
- boshqa hech kim ishlamaydigan shaxsiy branchingiz;
- yangilashda ortiqcha birlashtirish commitlari yaratmaslik uchun `git pull --rebase`.

Agar yuborilgan shaxsiy branchni baribir qayta yozishga to‘g‘ri kelsa, `git push --force-with-lease` dan foydalaning — serverda boshqalarning commitlari paydo bo‘lgan bo‘lsa, u rad etadi.

## Qachon nimani ishlatish kerak

- **Merge** — umumiy uzoq yashaydigan branchlarni birlashtirish uchun (`develop` ni `main` ga, reliz branchlari) va aniq xronologiya muhim bo‘lganda.
- **Squash merge** — «fix typo» kabi ko‘plab mayda commitli pull requestlar uchun: `main` ga bitta mazmunli yozuv tushadi.
- **Rebase** — pull requestdan oldin branchingizni yangi `main` bilan yangilash va lokal commitlarni tartibga keltirish uchun (`git rebase -i`).

## Jamoa uchun siyosat

Ko‘pchilik jamoalar uchun ishlaydigan oddiy sxema:

1. Har bir vazifa — `main` dan ochilgan alohida, qisqa muddatli branch.
2. Pull request ochishdan oldin dasturchi branchni `git rebase main` orqali yangilaydi (branch uning shaxsiy branchi, bu xavfsiz).
3. O‘zgarishlar `main` ga **squash merge** yoki oddiy merge orqali tushadi — bittasini tanlang va repozitoriy sozlamalarida mustahkamlang.
4. `main` va boshqa umumiy branchlarga force push branch himoyasi orqali taqiqlanadi.
5. Dasturchilar Git konfiguratsiyasida `pull.rebase = true` ni yoqishlari mumkin, shunda lokal yangilanishlar birlashtirish commitlarini ko‘paytirmaydi.

Aniq tanlov **bir xillikdan** kamroq muhim: aralash yondashuvlar tarixni ularning har biridan ko‘ra o‘qishni qiyinlashtiradi.

## FAQ

### Yangi boshlovchi uchun nima xavfsizroq — merge yoki rebase?

Merge. U hech qachon mavjud commitlarni qayta yozmaydi, shuning uchun u bilan xato qilish qiyinroq. Qaysi branchlar shaxsiy, qaysilari umumiy ekanini aniq tushungach, rebase ga o‘tish mumkin.

### Muvaffaqiyatsiz rebase ni qanday bekor qilish mumkin?

Agar rebase hali davom etayotgan bo‘lsa, `git rebase --abort` ni bajaring. Agar u tugagan bo‘lsa, branchning oldingi holatini `git reflog` da toping va commit qilinmagan o‘zgarishlarni saqlab, `git reset --hard <hesh>` orqali unga qayting.

### Squash merge da tarix yo‘qoladimi?

`main` da bitta commit qoladi, lekin oraliq commitlar odatda GitHub yoki GitLabdagi pull requestda, manba branch yoki PR mavjud ekan, ko‘rinib turadi.
