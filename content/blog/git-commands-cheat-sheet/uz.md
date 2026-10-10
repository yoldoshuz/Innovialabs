---
title: Gitning asosiy buyruqlari: kundalik ish uchun shpargalka
description: Vazifalar bo‘yicha guruhlangan Git shpargalkasi: boshlash, saqlash, branchlar, sinxronlash va tarixni ko‘rish, misollar hamda .gitignore asoslari bilan.
summary: Kundalik ish uchun yigirmatacha Git buyrug‘i yetarli: clone, status, add, commit, switch, merge, pull, push, log va diff, shuningdek to‘g‘ri sozlangan .gitignore fayli.
---

## Qisqa javob

Git bilan ishning katta qismi bitta sikldan iborat: **so‘nggi o‘zgarishlarni olish → branch yaratish → fayllarni tahrirlash → add → commit → push**. Quyida buyruqlar vazifalar bo‘yicha guruhlangan, kerakligini tez topishingiz uchun.

## Ishni boshlash

| Buyruq | Nima qiladi |
|---|---|
| `git init` | joriy papkada yangi repozitoriy yaratadi |
| `git clone <url>` | mavjud repozitoriyni butun tarixi bilan yuklab oladi |
| `git config --global user.name "Ism"` | commit muallifi ismini belgilaydi |
| `git config --global user.email "mail"` | muallif pochtasini belgilaydi |

```bash
git clone https://github.com/user/project.git
cd project
```

## O‘zgarishlarni saqlash

| Buyruq | Nima qiladi |
|---|---|
| `git status` | o‘zgargan, tayyorlangan va yangi fayllarni ko‘rsatadi |
| `git add <fayl>` | faylni staging areaga qo‘shadi |
| `git add -p` | o‘zgarishlarning alohida qismlarini tanlash imkonini beradi |
| `git commit -m "xabar"` | tayyorlangan o‘zgarishlarni qayd etadi |
| `git commit --amend` | oxirgi commitni tuzatadi (faqat hali push qilinmagan bo‘lsa) |
| `git restore <fayl>` | fayldagi saqlanmagan o‘zgarishlarni bekor qiladi |
| `git restore --staged <fayl>` | faylni staging areadan chiqaradi, tahrirlar saqlanib qoladi |

```bash
git status
git add src/cart.js
git commit -m "Fix discount calculation in cart"
```

**Maslahat:** bitta faylda turli o‘zgarishlar aralashgan bo‘lsa, `git add -p` tartibli commitlar qilishning eng yaxshi usuli.

## Branchlar bilan ishlash

| Buyruq | Nima qiladi |
|---|---|
| `git branch` | lokal branchlar ro‘yxati |
| `git switch -c <branch>` | branch yaratadi va unga o‘tadi |
| `git switch <branch>` | mavjud branchga o‘tadi |
| `git merge <branch>` | ko‘rsatilgan branchni joriysiga birlashtiradi |
| `git branch -d <branch>` | allaqachon birlashtirilgan branchni o‘chiradi |
| `git stash` / `git stash pop` | commit qilinmagan tahrirlarni vaqtincha yashiradi va qaytaradi |

```bash
git switch -c feature/login-form
# ...ish...
git switch main
git merge feature/login-form
```

`switch` va `restore` — ko‘p vazifali `git checkout` buyrug‘ining yangiroq va tushunarliroq o‘rinbosarlari, `checkout` esa hamon ishlaydi.

## Server bilan sinxronlash

| Buyruq | Nima qiladi |
|---|---|
| `git remote -v` | ulangan masofaviy repozitoriylarni ko‘rsatadi |
| `git fetch` | branchlaringizga tegmasdan o‘zgarishlarni yuklab oladi |
| `git pull` | o‘zgarishlarni yuklab, joriy branchga birlashtiradi |
| `git push` | commitlaringizni serverga yuboradi |
| `git push -u origin <branch>` | yangi branchni birinchi marta yuborib, masofaviysiga bog‘laydi |

```bash
git pull
git push -u origin feature/login-form
```

Serverdan nima kelishiga ishonchingiz komil bo‘lmasa, avval `git fetch` qiling va farqni ko‘rib chiqing.

## Tarix va o‘zgarishlarni ko‘rish

| Buyruq | Nima qiladi |
|---|---|
| `git log --oneline --graph` | branchlar bilan ixcham tarix |
| `git diff` | hali staging areaga qo‘shilmagan o‘zgarishlar |
| `git diff --staged` | commitga kiradigan o‘zgarishlar |
| `git show <hesh>` | aniq bir commit tarkibi |
| `git blame <fayl>` | har bir qatorni kim va qaysi commitda o‘zgartirgani |

```bash
git log --oneline --graph --all
git diff --staged
```

## .gitignore asoslari

Loyiha ildizidagi `.gitignore` fayli Git kuzatmasligi kerak bo‘lgan narsalarni sanab o‘tadi: bog‘liqliklar, build natijalari, loglar va maxfiy ma’lumotlar.

```gitignore
# bog‘liqliklar va build
node_modules/
dist/

# muhit o‘zgaruvchilari va maxfiy ma’lumotlar
.env
.env.local

# tizim va muharrir fayllari
.DS_Store
.idea/
*.log
```

Muhim jihatlar:

- `.gitignore` **allaqachon kuzatilayotgan** fayllarga ta’sir qilmaydi. Faylni kuzatishni to‘xtatish uchun `git rm --cached <fayl>` bajaring va commit qiling.
- Agar maxfiy kalit tarixga tushib qolgan bo‘lsa, `.gitignore` yetarli emas: kalitni bekor qilib, almashtirish kerak.
- Turli tillar uchun tayyor shablonlar rasmiy `github/gitignore` repozitoriysida bor.

## Keng tarqalgan xatolar

- **`git status` siz `git add .`.** Ortiqcha narsani commit qilib yuborish oson — avval nima o‘zgarganini ko‘ring.
- **Push qilingandan keyin `--amend`.** Bu boshqalar allaqachon olgan tarixni qayta yozadi.
- **Uzoq vaqt `pull` siz ishlash.** Branch qancha uzoq alohida yashasa, birlashtirishda shuncha ko‘p konflikt chiqadi.

## FAQ

### git fetch va git pull o‘rtasidagi farq nima?

`git fetch` faqat serverdan o‘zgarishlarni yuklab, masofaviy branchlarni yangilaydi, fayllaringiz o‘zgarmaydi. `git pull` esa fetch qilib, darhol o‘zgarishlarni joriy branchga birlashtiradi.

### Oxirgi commitni qanday bekor qilish mumkin?

Agar u hali yuborilmagan bo‘lsa, `git reset --soft HEAD~1` commitni olib tashlaydi, o‘zgarishlar esa tayyorlangan holda qoladi. Agar u allaqachon serverda bo‘lsa, `git revert <hesh>` xavfsizroq — u o‘zgarishlarni bekor qiluvchi yangi commit yaratadi.

### Nega .gitignore dagi fayl baribir commitga tushadi?

Ehtimol, u `.gitignore` dagi qoidadan oldin repozitoriyga qo‘shilgan. Uni `git rm --cached <fayl>` buyrug‘i bilan indeksdan olib tashlang va commit qiling.
