---
title: Git nima va versiyalarni boshqarish tizimi qanday ishlaydi
description: Git haqida sodda tushuntirish: versiyalarni boshqarish nima uchun kerak, commit, branch va staging area nima, birinchi repozitoriy va commit qanday yaratiladi.
summary: Git — kod o‘zgarishlari tarixini commit deb ataladigan suratlar ko‘rinishida saqlaydigan, branchlarda ishlash va bir necha kishining ishini xavfsiz birlashtirish imkonini beruvchi versiyalarni boshqarish tizimi.
---

## Git oddiy so‘zlar bilan

**Git** — loyihangizning har bir saqlangan holatini eslab qoladigan dastur. «loyiha_final», «loyiha_final_2» va «loyiha_aniq_final» kabi papkalar o‘rniga sizda bitta papka va to‘liq tarix bo‘ladi: kim, qachon va nimani o‘zgartirgani.

Git — **taqsimlangan** tizim: har bir dasturchining kompyuterida tarixning to‘liq nusxasi bor. Internetsiz ishlab, keyin serverga (GitHub, GitLab, Bitbucket yoki o‘zingizniki) sinxronlash mumkin.

## Versiyalarni boshqarish nima uchun kerak

Versiyalarni boshqarishsiz jamoa tezda bir xil muammolarga duch keladi:

- **Ish yo‘qoladi.** Kimdir hamkasbining faylini ustidan yozib yuboradi va o‘zgarishlar yo‘qoladi.
- **Orqaga qaytish yo‘q.** Yangilanish saytni buzdi, ishlaydigan versiyaga qaytishning oson yo‘li yo‘q.
- **Xato qayerdan kelgani noma’lum.** Qaysi o‘zgarish muammoni keltirib chiqarganini ko‘rib bo‘lmaydi.
- **Parallel ish to‘qnashadi.** Ikki kishi bitta modulni tahrirlab, bir-biriga xalaqit beradi.

Git bularning barchasini hal qiladi: istalgan holatni tiklash mumkin, har bir o‘zgarish muallifi bilan imzolangan, parallel ish esa alohida branchlarda boradi.

## Git modeli: uchta asosiy tushuncha

### Commit

**Commit** — ma’lum bir paytdagi barcha kuzatiladigan fayllarning surati hamda xabar, muallif va sana. Har bir commitning noyob heshi (masalan, `a3f9c21`) va oldingi commitga havolasi bor. Shu tariqa tarix zanjirga aylanadi.

### Staging area (indeks)

Fayllaringiz va tarix o‘rtasida oraliq hudud bor — **staging area**. Keyingi commitga qaysi o‘zgarishlar kirishini o‘zingiz tanlaysiz. Bu commitlarni tartibli qilish imkonini beradi: xato tuzatish alohida, uslub o‘zgarishi alohida, hatto ikkalasini bir vaqtda qilgan bo‘lsangiz ham.

Gitda fayl uch holatdan o‘tadi:

| Holat | Qayerda | Qanday o‘tadi |
|---|---|---|
| O‘zgartirilgan (modified) | ishchi papka | faylni tahrirlaysiz |
| Tayyorlangan (staged) | staging area | `git add` |
| Qayd etilgan (committed) | repozitoriy tarixi | `git commit` |

### Branch

**Branch** — commitga ishora qiluvchi siljiydigan ko‘rsatkich, xolos. Asosiy branch odatda `main` deb ataladi. Yangi vazifani boshlaganda branch yaratasiz, unda ishlaysiz, keyin asosiysi bilan birlashtirasiz (merge). Gitda branchlar bir zumda yaratiladi va deyarli joy egallamaydi, shuning uchun har bir vazifaga alohida branch ochish odatiy hol.

## Birinchi repozitoriy: init dan birinchi commitgacha

Gitni o‘rnating va bir marta ism hamda pochtangizni ko‘rsating — ular commitlaringizni imzolaydi:

```bash
git config --global user.name "Ismingiz"
git config --global user.email "you@example.com"
```

Endi loyiha va birinchi commitni yaratamiz:

```bash
mkdir my-project
cd my-project
git init                      # tarix saqlanadigan yashirin .git papkasini yaratadi
echo "# My project" > README.md
git status                    # README.md kuzatilmayotgan fayl sifatida ko‘rinadi
git add README.md             # faylni staging areaga o‘tkazamiz
git commit -m "Add README"    # suratni qayd etamiz
git log --oneline             # tarixni ko‘ramiz
```

`git init` dan so‘ng papkada `.git` katalogi paydo bo‘ladi — bu butun tarixi bilan repozitoriyning o‘zi. Uni o‘chirsangiz, loyiha Git-repozitoriy bo‘lmay qoladi, fayllar esa joyida qoladi.

Loyihani serverga yuborish uchun GitHub yoki GitLabda bo‘sh repozitoriy yarating va bajaring:

```bash
git remote add origin <repozitoriy-manzili>
git push -u origin main
```

## Yangi boshlovchilarning keng tarqalgan xatolari

- **Kun oxirida bitta ulkan commit.** Kichik, mantiqiy qadamlar bilan commit qiling — xatoni topish va qaytarish osonroq bo‘ladi.
- **«fix» yoki «update» kabi xabarlar.** Nima va nima uchun o‘zgarganini yozing: «Fix price rounding in cart».
- **Repozitoriyda parollar va kalitlar.** Maxfiy ma’lumotlar tarixga tushmasligi kerak — `.gitignore` va muhit o‘zgaruvchilaridan foydalaning.
- **To‘g‘ridan-to‘g‘ri `main` da ishlash.** Yolg‘iz ishlasangiz ham, branchlar asosiy versiyani ishchi holatda saqlaydi.
- **Git va GitHubni adashtirish.** Git — vosita, GitHub — repozitoriylarni saqlash va birgalikda ishlash xizmati.

## FAQ

### Git va GitHub o‘rtasidagi farq nima?

Git — kompyuteringizda ishlaydigan versiyalarni boshqarish dasturi. GitHub, GitLab va Bitbucket — Git-repozitoriylarni saqlaydigan, code review va CI/CD imkoniyatlarini qo‘shadigan onlayn xizmatlar.

### Yolg‘iz ishlasam ham Git kerakmi?

Ha. U o‘zgarishlar tarixini, ishlaydigan versiyaga oson qaytishni, serverda zaxira nusxani va jamoaga qo‘shilganingizda albatta kerak bo‘ladigan odatni beradi.

### Gitda koddan boshqa narsalarni saqlash mumkinmi?

Har qanday matnli fayllar yaxshi saqlanadi: hujjatlar, konfiguratsiyalar, matnlar. Video yoki arxiv kabi katta binar fayllar samarasiz saqlanadi, ular uchun Git LFS kengaytmasi mavjud.
