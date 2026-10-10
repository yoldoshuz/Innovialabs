---
title: Maxfiy kalit Git’ga tushib qoldi: hozir nima qilish kerak
description: Kalit yoki parol repozitoriyga tushganda bosqichma-bosqich reja: bekor qilish va almashtirish, log’larni tekshirish, git-filter-repo va gitleaks.
summary: Avval sizib chiqqan kalitni bekor qilib, yangisiga almashtiring, so‘ng log’larda shubhali foydalanishni tekshiring, keyin tarixni git-filter-repo bilan tozalang va takrorlanmasligi uchun gitleaks’ni pre-commit va CI’ga qo‘shing.
---
## Harakatlar tartibi

Agar kalit, parol yoki token commit’ga tushib qolgan bo‘lsa, aynan shu tartibda harakat qiling:

1. **Maxfiy kalitni bekor qiling va almashtiring.** Bu birinchi va eng muhim qadam.
2. Commit qilingan paytdan beri **kirish log’larini tekshiring**.
3. Repozitoriy **tarixini tozalang**.
4. Takrorlanmasligi uchun **himoyani sozlang**.

Kalitni almashtirmasdan tarixni tozalash deyarli hech narsa bermaydi: uni allaqachon nusxalab olgan bo‘lishlari mumkin.

## 1-qadam. Bekor qilish va rotatsiya

Repozitoriy yopiq bo‘lsa va commit bir daqiqadan keyin o‘chirilgan bo‘lsa ham, kalitni **oshkor bo‘lgan** deb hisoblang. Nusxalar clone yoki pull qilgan har bir kishida, fork’larda, CI keshlarida va ochiq repozitoriylarni skanerlaydigan botlarda qoladi.

- Servis panelida yangi kalit yarating.
- Uni maxfiy omborda yangilang va deploy qiling.
- Hammasi ishlayotganiga ishonch hosil qilib, **eski kalitni bekor qiling**.
- Tez almashtirib bo‘lmasa (masalan, ko‘p client ishlatadigan baza paroli), vaqtincha tarmoq orqali kirishni cheklang va imkon qadar tezroq almashtiring.

Qatorni yangi commit bilan o‘chirish yechim emas: maxfiy kalit tarixda qoladi.

## 2-qadam. Log’larni tekshirish

Commit paytidan boshlab kalitdan begonalar foydalanganmi, tekshiring:

- servisning kirish va audit jurnallari (bulutlarda AWS CloudTrail kabi audit log’lar);
- notanish IP manzillardan va odatiy bo‘lmagan vaqtdagi so‘rovlar;
- siz yaratmagan yangi resurslar, foydalanuvchilar, webhook’lar;
- hisoblar va limitlar sarfining kutilmagan o‘sishi.

Iz topilsa — bu endi incident: qaysi ma’lumotlarga kirilganini aniqlang. Agar **shaxsiy ma’lumotlar** zarar ko‘rgan bo‘lsa, yurisdiksiyangiz talablariga ko‘ra foydalanuvchilar yoki regulyatorni xabardor qilish kerakmi, tekshiring.

## 3-qadam. Tarixni tozalash

**Commit hali masofaviy repozitoriyga yuborilmagan** bo‘lsa — uni lokal qayta yozing:

```bash
git rm --cached .env
echo ".env" >> .gitignore
git add .gitignore
git commit --amend
```

Agar kalit oldingi commit’da bo‘lsa, rebase yoki quyidagi vosita kerak bo‘ladi.

**Commit allaqachon masofaviy repozitoriyda** bo‘lsa — **git-filter-repo**dan foydalaning. Yangi clone’da ishlang:

```bash
git clone git@github.com:org/repo.git repo-clean
cd repo-clean

# faylni butun tarixdan o‘chirish
git filter-repo --path .env --invert-paths

# yoki kalit satrini barcha fayllarda almashtirish
git filter-repo --replace-text ../replacements.txt
```

`replacements.txt` faylida `eski_qiymat==>REMOVED` ko‘rinishidagi qatorlar bo‘ladi. Uni repozitoriydan tashqarida saqlang va ishdan keyin o‘chiring.

git-filter-repo xavfsizlik maqsadida `origin` remote’ni o‘chiradi, shuning uchun uni qayta qo‘shing va qayta yozilgan tarixni yuboring:

```bash
git remote add origin git@github.com:org/repo.git
git push origin --force --all
git push origin --force --tags
```

Shundan so‘ng:

- Jamoani ogohlantiring: hamma pull emas, repozitoriyni **qaytadan clone** qilishi kerak. Aks holda eski tarix keyingi merge’da qaytib keladi.
- Barcha branch’lar va teglar qayta yozilganini tekshiring.
- GitHub va shunga o‘xshash platformalarda eski commit’lar to‘g‘ridan-to‘g‘ri havola, fork’lar va pull request’lar orqali ochiq qolishi mumkin. Ularni o‘chirish uchun platforma qo‘llab-quvvatlash xizmatiga murojaat qiling.

## 4-qadam. Takrorlanishning oldini olish

Pre-commit’dagi **gitleaks** o‘zgarishlarni commit’dan oldin tekshiradi. Uni pre-commit framework orqali ulash qulay:

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0 # dolzarb relizni ko‘rsating
    hooks:
      - id: gitleaks
```

So‘ng `pre-commit install` buyrug‘ini bajaring — hook har bir commit’da ishga tushadi.

Lokal hook’ni `--no-verify` bayrog‘i bilan chetlab o‘tish mumkin, shuning uchun **CI’da tekshiruv** ham qo‘shing: har bir pull request’dagi o‘zgarishlar bo‘yicha o‘sha gitleaks. Butun tarixni bir martalik skanerlash uchun `gitleaks git -v` mos keladi (eski versiyalarda — `gitleaks detect`).

Qo‘shimcha ravishda:

- `.env` va shunga o‘xshash fayllar birinchi kundan `.gitignore`da bo‘lsin, repozitoriyda faqat `.env.example`.
- Platformangiz qo‘llab-quvvatlasa, secret scanning va push protection’ni yoqing.
- Maxfiy ma’lumotlarni loyiha fayllarida emas, secret manager yoki CI omborida saqlang.

## Ko‘p uchraydigan xatolar

- Tarixni tozalashdan boshlab, kalitni almashtirishni unutish.
- Yangi commit’da `git rm` qilib, muammo hal bo‘ldi deb hisoblash.
- Jamoani ogohlantirmaslik — kimdir eski tarixni yana yuboradi.
- CI tekshiruvisiz faqat lokal hook’ga tayanish.

## FAQ

### Repozitoriy yopiq bo‘lsa ham kalitni almashtirish kerakmi?

Ha. Yopiq repozitoriyga xodimlar, pudratchilar, CI tizimlari va integratsiyalar kira oladi, lokal nusxalar esa noutbuk bilan birga sizib chiqishi mumkin. Kalitni almashtirish uni kim ko‘rganini aniqlashdan arzonroq.

### Nega git filter-branch emas, git-filter-repo?

git-filter-repo tezroq ishlaydi, ishlatish osonroq va Git hujjatlarining o‘zida filter-branch o‘rniga tavsiya etiladi. Oddiy holatlar uchun muqobil — BFG Repo-Cleaner.

### Kalit allaqachon almashtirilgan bo‘lsa, tarixni tozalash kerakmi?

Tavsiya etiladi. Eski kalit endi ishlamaydi, lekin tarixda boshqa ma’lumotlar bo‘lishi mumkin, skanerlar va auditorlar esa uni topib, xavotir bildirishda davom etadi.
