---
title: Ilg‘or Git: interactive rebase, cherry-pick va bisect
description: Interactive rebase bilan tarixni tozalash, cherry-pick orqali tuzatishlarni branchlar orasida ko‘chirish va git bisect bilan xatoli commitni topish.
summary: Interactive rebase lokal commitlaringizni qayta yozadi (birlashtirish, nomini o‘zgartirish, tartiblash), cherry-pick bitta commitni boshqa branchga ko‘chiradi, bisect esa binar qidiruv bilan kodni buzgan commitni topadi.
---
## Uchta vosita va ular qachon kerak

- **`git rebase -i`** — hamkasblar ko‘rishidan oldin commitlaringizni tartibga keltirish: «fix typo»ni asosiy commitga qo‘shish, xabarni qayta yozish, tartibni o‘zgartirish.
- **`git cherry-pick`** — boshqa branchdan bitta aniq commitni olish, masalan hotfixni `develop`dan `release`ga, butun branchni birlashtirmasdan.
- **`git bisect`** — nimadir buzilgan commitni topish: har bir commitni ko‘rib chiqish o‘rniga tarix bo‘yicha binar qidiruv.

Asosiy qoida: **rebase va tarixni qayta yozish faqat hali umumiy branchga tushmagan commitlar uchun**. Agar commitlar allaqachon push qilingan bo‘lsa va boshqalar ular ustida ishlayotgan bo‘lsa, qayta yozilgan tarix butun jamoada konfliktlarga olib keladi.

## Interactive rebase: tarixni tozalash

Oxirgi 4 ta commitni tahrirlash uchun:

```bash
git rebase -i HEAD~4
```

Git commitlar ro‘yxati (yuqorida eng eskisi) va buyruqlar bilan muharrirni ochadi:

| Buyruq | Nima qiladi |
|---|---|
| `pick` | commitni o‘zgarishsiz qoldirish |
| `reword` | o‘zgarishlarni saqlab, xabarni o‘zgartirish |
| `edit` | tarkibini o‘zgartirish uchun commitda to‘xtash |
| `squash` | oldingisi bilan birlashtirish, xabarlarni qo‘shib |
| `fixup` | oldingisi bilan birlashtirish, xabarni tashlab |
| `drop` | commitni o‘chirish |

Qatorlar tartibini o‘zgartirish mumkin — commitlar yangi tartibda qo‘llanadi.

**Foydali usul:** tuzatish kiritganda `git commit --fixup <hash>` qiling, keyin `git rebase -i --autosquash <base>` — Git `fixup` qatorlarini kerakli commitlar yoniga o‘zi joylashtiradi.

Agar rebase vaqtida nimadir noto‘g‘ri ketsa:

- `git rebase --continue` — konfliktni hal qilgandan keyin;
- `git rebase --abort` — hammasini rebase boshlanishidan oldingi holatga qaytarish;
- `git reflog` — abort uchun kech bo‘lsa, branchning rebase’dan oldingi holatini topish.

Allaqachon push qilingan *shaxsiy* branchni rebase qilgandan keyin force push kerak bo‘ladi. Xavfsiz variantdan foydalaning: `git push --force-with-lease` — serverda boshqa birovning commitlari paydo bo‘lgan bo‘lsa, u qayta yozishni rad etadi.

## Cherry-pick: tuzatishni ko‘chirish

```bash
git switch release/2.0
git cherry-pick a1b2c3d
```

Git xuddi shu o‘zgarishlar bilan, lekin boshqa hash bilan **yangi commit** yaratadi. Foydali flaglar:

- `-x` — kelib chiqishi ko‘rinib turishi uchun xabarga «cherry picked from commit …» qatorini qo‘shadi;
- `A..B` — commitlar diapazonini ko‘chiradi (A ning o‘zisiz);
- `--no-commit` — o‘zgarishlarni qo‘llaydi, lekin darhol commit qilmaydi.

**Cherry-pick qachon yomon g‘oya:** agar siz muntazam ravishda ko‘p commitlarni branchlar orasida ko‘chirsangiz, bu branching jarayonidagi muammo belgisi. Takroriy commitlar keyinchalik merge’ni qiyinlashtiradi. Tuzatishni umumiy asosiy branchda qilib, uni kerakli joylarga merge qilish yaxshiroq.

## Bisect: xatoli commitni qidirish

Aytaylik, hozir testlar yiqilmoqda, `v1.4` tegida esa hammasi ishlagan:

```bash
git bisect start
git bisect bad            # joriy commit buzilgan
git bisect good v1.4      # bu yerda ishlagan
```

Git sizni o‘rtadagi commitga o‘tkazadi. Tekshiring va `git bisect good` yoki `git bisect bad` deb belgilang. Har qadamda diapazon ikki baravar qisqaradi, shuning uchun yuzlab commitlar orasida ham bir necha tekshiruv yetarli. Oxirida Git birinchi yomon commitni ko‘rsatadi. Sessiyani `git bisect reset` bilan yakunlang.

**Avtomatlashtirish:** agar tekshiruvni muvaffaqiyatda 0, xatoda noldan farqli kod qaytaradigan skript sifatida yozish mumkin bo‘lsa, Git qidiruvni o‘zi bajaradi:

```bash
git bisect run npm test
```

Agar biror commitni tekshirib bo‘lmasa (masalan, u build bo‘lmasa), `git bisect skip` dan foydalaning.

## Keng tarqalgan xatolar

- Umumiy branchni (`main`, `develop`) rebase qilish — hamkasblar tarixini buzadi.
- `--force-with-lease` o‘rniga oddiy `--force`.
- Beqaror test bilan bisect: o‘zgaruvchan natija qidiruvni noto‘g‘ri yo‘lga boshlaydi.
- Ulkan commitlar: bisect aybdorni topadi, lekin ichida 40 ta fayl bo‘ladi. Kichik, mazmunli commitlar uchala vositani ham foydaliroq qiladi.

## FAQ

### Muvaffaqiyatsiz rebase’ni bekor qilsa bo‘ladimi?

Ha. `git reflog`ni oching, rebase boshlanishidan oldingi yozuvni toping va `git reset --hard <hash>` bajaring. Git’da lokal tarix deyarli hech qachon darhol yo‘qolmaydi.

### Squash va fixup farqi nimada?

Ikkalasi ham commitni oldingisi bilan birlashtiradi. `squash` birlashgan xabarni tahrirlashni taklif qiladi, `fixup` esa qo‘shilayotgan commit xabarini shunchaki tashlab yuboradi.

### Bisect merge-commitlar bilan ishlaydimi?

Ha, Git butun tarixni, jumladan merge’larni ham hisobga oladi. Faqat asosiy chiziq bo‘yicha yurish kerak bo‘lsa, `git bisect start --first-parent` opsiyasi bor.
