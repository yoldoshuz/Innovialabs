---
title: Git’da o‘zgarishlarni bekor qilish: reset, revert va restore
description: Odatiy holatda qaysi Git buyrug‘ini tanlash kerak: noto‘g‘ri commit, main’dagi bug, yo‘qolgan branch. reset, revert, restore va reflog tahlili.
summary: restore fayllardagi tahrirlarni bekor qiladi, reset branch’ni lokal tarixda orqaga suradi, revert e’lon qilingan kod uchun yangi bekor qiluvchi commit yaratadi, reflog esa «yo‘qolgan»ni qaytaradi.
---
## Qisqa javob

Buyruq tanlovi ikki savolga bog‘liq: **nimani** bekor qilmoqchisiz va o‘zgarishlar **allaqachon push qilinganmi**.

| Holat | Buyruq |
|---|---|
| Faylni buzdim, hali `git add` qilmadim | `git restore <fayl>` |
| Indeksga ortiqcha narsa qo‘shdim | `git restore --staged <fayl>` |
| Oxirgi commit noto‘g‘ri, push qilinmagan | `git reset --soft HEAD~1` |
| Oxirgi commit xabarini tuzatish kerak | `git commit --amend` |
| Bug allaqachon umumiy branch’da | `git revert <hash>` |
| Branch’ni o‘chirdim yoki xato bilan `reset --hard` qildim | `git reflog` + `git branch` / `git reset` |

Asosiy qoida: **boshqalar allaqachon tortib olgan tarixni qayta yozmang**. E’lon qilingan commit’lar uchun `revert` ishlating.

## restore: fayllardagi tahrirlarni bekor qilish

`git restore` commit’lar bilan emas, fayllar bilan ishlaydi.

```bash
git restore src/app.js           # faylni oxirgi commit holatiga qaytarish
git restore --staged src/app.js  # indeksdan olib tashlash, tahrirlar qoladi
git restore --source=HEAD~2 src/app.js  # ikki commit oldingi versiyani olish
```

Ehtiyot bo‘ling: `--staged`siz `git restore <fayl>` shu fayldagi commit qilinmagan tahrirlarni **qaytarib bo‘lmas darajada** o‘chiradi. Git ularni saqlamagan — reflog yordam bermaydi.

## reset: branch’ni orqaga surish

`git reset` joriy branch ko‘rsatkichini boshqa commit’ga ko‘chiradi. Uch rejim «tashlab yuborilgan» commit’lardagi o‘zgarishlarga nima bo‘lishi bilan farqlanadi:

| Rejim | Branch | Indeks (staged) | Ishchi fayllar |
|---|---|---|---|
| `--soft` | suriladi | o‘zgarishlar indeksda qoladi | tegilmaydi |
| `--mixed` (standart) | suriladi | tozalanadi | o‘zgarishlar fayllarda qoladi |
| `--hard` | suriladi | tozalanadi | **qayta yoziladi** |

Amaliyotda:

- `git reset --soft HEAD~1` — commit’ni qayta qilish yoki bir nechtasini bittaga birlashtirish uchun «commit’dan chiqarish».
- `git reset HEAD~1` — xuddi shunday, lekin o‘zgarishlarni `git add` bilan qayta qo‘shish kerak; commit’ni bir nechtaga bo‘lish uchun qulay.
- `git reset --hard origin/main` — barcha lokal o‘zgarishlarni tashlab, branch’ni remote holatiga keltirish. Commit qilinmagan ish yo‘qoladi.

Agar branch allaqachon push qilingan bo‘lsa, `reset`dan keyin `git push --force-with-lease` kerak bo‘ladi. Shaxsiy branch’da bu maqbul, `main`da esa deyarli hech qachon.

## revert: e’lon qilingan ishni xavfsiz bekor qilish

`git revert` commit’ni o‘chirmaydi, balki **teskari o‘zgarishlarga ega yangi commit** yaratadi. Tarix saqlanadi, hamkasblar hech narsani tuzatishi shart emas.

```bash
git revert a1b2c3d          # bitta commit’ni bekor qilish
git revert HEAD~3..HEAD     # oxirgi uchtasini bekor qilish
git revert -m 1 <merge-hash> # merge commit’ni bekor qilish
```

Merge commit uchun `-m 1` qaysi ota-commit asosiy ekanini ko‘rsatadi (odatda birinchisi — birlashtirilgan branch). E’tibor bering: keyinroq xuddi shu branch’ni yana birlashtirsangiz, Git uning o‘zgarishlarini allaqachon qo‘llangan deb hisoblaydi va «bekor qilishni bekor qilish» kerak bo‘ladi.

## reflog: qutqaruv chambaragi

Git `HEAD`ning har bir harakatini **reflog**’ga yozadi. Bu lokal jurnal bo‘lib, commit’lar bilan bog‘liq deyarli har qanday xatoni tuzatadi.

```bash
git reflog
# 9f8e7d6 HEAD@{0}: reset: moving to HEAD~3
# 4c5d6e7 HEAD@{1}: commit: add payment form
# ...

git reset --hard 4c5d6e7        # branch’ni avvalgi holatga qaytarish
git branch recovered 4c5d6e7    # yoki o‘chirilgan branch’ni tiklash
```

Cheklovlar: reflog faqat sizning kompyuteringizda saqlanadi, eski yozuvlar vaqt o‘tib garbage collection tomonidan o‘chiriladi va unda hech qachon commit qilinmagan narsa yo‘q.

## Ko‘p uchraydigan xatolar

- **Commit qilinmagan ish bilan `reset --hard`.** Xavfli amaldan oldin `git stash` yoki vaqtinchalik commit qiling.
- **Umumiy branch’ga force push.** Hamkasblar uchun tarixni buzadi. `revert` ishlating.
- **`revert` va `reset`ni adashtirish.** Revert commit qo‘shadi, reset branch’ni suradi.
- **Vahima.** Agar biror narsa bir marta bo‘lsa ham commit qilingan bo‘lsa, uni deyarli har doim reflog orqali tiklash mumkin.

## FAQ

### `git restore` va `git checkout` qanday farq qiladi?

`git checkout` tarixan ham branch almashtirish, ham fayllarni tiklash vazifasini bajargan. Git 2.23 dan boshlab bu rollar `git switch` va `git restore` o‘rtasida bo‘lingan, shunda ularni adashtirish qiyinroq. Eski variant hali ham ishlaydi.

### main’ga push qilingan commit’ni qanday bekor qilish mumkin?

`git revert <hash>` dan foydalaning va yangi commit’ni push qiling. Bu o‘zgarishlarni allaqachon tortib olganlar uchun xavfsiz.

### `git reset --hard`dan keyin fayllarni tiklash mumkinmi?

Commit qilinganlarini — ha, `git reflog` orqali. Ishchi fayllardagi commit qilinmagan tahrirlarni Git saqlamagan, shuning uchun Git vositalari bilan ularni odatda qaytarib bo‘lmaydi; ba’zan muharriringizning lokal tarixi yordam beradi.
