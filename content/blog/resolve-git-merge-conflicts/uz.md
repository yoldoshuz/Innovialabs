---
title: Git’da merge konfliktlarini qanday hal qilish kerak
description: Git’da merge konfliktlari nega paydo bo‘ladi, markerlarni qanday o‘qish, terminal va VS Code’da hal qilish hamda birlashtirishni xavfsiz bekor qilish.
summary: Konflikt ikki branch bir xil qatorlarni turlicha o‘zgartirganda yuzaga keladi; siz yakuniy variantni tanlaysiz, markerlarni o‘chirasiz, git add qilasiz va merge’ni yakunlaysiz.
---
## Qisqa javob

Merge konflikti xato emas, balki Git’ning sizga savoli: «ikki branch bir joyni turlicha o‘zgartirdi, qaysi variant qolsin?». Tartib har doim bir xil:

1. `git status` ni ishga tushiring va **Unmerged paths** bo‘limidagi fayllarni toping.
2. Har bir faylni oching, `<<<<<<<`, `=======`, `>>>>>>>` markerlarini toping.
3. To‘g‘ri kodni qoldiring va markerlarni o‘chiring.
4. Har bir tuzatilgan fayl uchun `git add <fayl>` bajaring.
5. Amalni yakunlang: merge uchun `git commit`, rebase uchun `git rebase --continue`.

## Konfliktlar nega paydo bo‘ladi

Git o‘zgarishlar turli qatorlar yoki turli fayllarga tegsa, ularni avtomatik birlashtiradi. Konflikt quyidagi hollarda chiqadi:

- ikkala branch’da bitta faylning **bir xil qatorlari** o‘zgartirilgan;
- bir branch’da fayl **o‘chirilgan**, boshqasida esa o‘zgartirilgan;
- ikkala branch **bir xil nomli faylni** turli tarkib bilan yaratgan.

Branch asosiy branch’dan qancha uzoq alohida yashasa, kimdir xuddi shu kodni o‘zgartirish ehtimoli shuncha yuqori.

## Konflikt markerlarini qanday o‘qish kerak

Fayl ichida Git ikkala versiyani ko‘rsatadi:

```text
<<<<<<< HEAD
const timeout = 3000;
=======
const timeout = 5000;
>>>>>>> feature/retry
```

- `<<<<<<< HEAD` va `=======` orasida — **joriy branch’ingiz** (siz birlashtirayotgan branch).
- `=======` va `>>>>>>> feature/retry` orasida — **kiruvchi o‘zgarishlar**.

Muhim jihat: `rebase` paytida rollar almashadi. U yerda `HEAD` — siz rebase qilayotgan asos branch, «kiruvchi» esa sizning o‘z commit’laringiz.

`diff3` uslubini (yangi Git versiyalarida `zdiff3`) yoqsangiz, o‘zgarishlardan oldingi asl versiya ham ko‘rinadi — bu kim nimani o‘zgartirganini tushunishni ancha osonlashtiradi:

```bash
git config --global merge.conflictStyle diff3
```

## Terminalda hal qilish

```bash
git merge feature/retry
# CONFLICT (content): Merge conflict in src/config.js

git status                 # konfliktli fayllar ro‘yxati
# faylni qo‘lda tahrirlaymiz
git add src/config.js
git commit                 # Git tayyor merge commit xabarini taklif qiladi
```

Fayl uchun bir tomonni to‘liq olish kerak bo‘lsa:

```bash
git checkout --ours src/config.js    # joriy branch versiyasini qoldirish
git checkout --theirs src/config.js  # kiruvchi versiyani olish
git add src/config.js
```

Rebase paytidagi rollar almashinuvini unutmang: u yerda `--ours` va `--theirs` ham o‘rin almashadi.

## VS Code’da hal qilish

VS Code konfliktlarni ajratib ko‘rsatadi va ularning ustida tugmalar chiqaradi:

- **Accept Current Change** — sizning versiyangizni qoldirish;
- **Accept Incoming Change** — kiruvchi versiyani olish;
- **Accept Both Changes** — ikkalasini qoldirish (ko‘pincha keyin qo‘lda tuzatish kerak);
- **Compare Changes** — taqqoslashni ochish.

Murakkab holatlar uchun **Merge Editor** bor: uchta panel — kiruvchi, joriy va yakuniy natija. Tahrirdan so‘ng faylni saqlang va Source Control panelida «+» (stage) tugmasini bosing.

## Xavfsiz bekor qilish

Chalkashib ketsangiz, boshlang‘ich holatga qaytish mumkin:

```bash
git merge --abort    # merge’ni bekor qilish
git rebase --abort   # rebase’ni bekor qilish
git cherry-pick --abort
```

Bu buyruqlar branch’ni amal boshlanishidan oldingi holatga qaytaradi. Merge’dan oldin tugallanmagan ishni commit qiling yoki yashiring (`git stash`), shunda bekor qilish unga tegmaydi.

## Ko‘p uchraydigan xatolar

- **Unutilgan markerlar.** `<<<<<<<` bor kod commit qilinadi va build buziladi. Commit’dan oldin markerlarni qidiring yoki `git diff --check` bajaring.
- **Tekshirmasdan «Accept Both».** Funksiyaning ikki versiyasi yonma-yon turishi — ko‘pincha dublikat yoki buzilgan mantiq.
- **Testlar ishga tushirilmagan.** Konflikt sintaktik hal qilingan, lekin xatti-harakat o‘zgargan bo‘lishi mumkin. Testlarni yurgizing va loyihani yig‘ing.
- **Taxminan hal qilish.** Hamkasbingiz kodni nega o‘zgartirganini tushunmasangiz, so‘rang — bu keyin bug qidirishdan tezroq.

## Konfliktlarni qanday kamaytirish mumkin

- **Kichik PR’lar.** O‘zgarishlar qancha kam va tez qo‘shilsa, kesishmalar shuncha kam.
- **Asosiy branch’ni muntazam tortib oling** (`git pull --rebase` yoki `main`’dan merge).
- **Yagona formatlash.** Prettier, Black kabi vositalar bo‘shliq va qo‘shtirnoqlar sababli chiqadigan konfliktlarni yo‘qotadi.
- **Refaktoring va fichalarni aralashtirmang.** Ommaviy qayta nomlashni alohida, tez qo‘shiladigan PR’ga chiqaring.
- **Mas’uliyat sohalarini kelishib oling**, agar bir modulda bir necha kishi ishlasa.

## FAQ

### Konfliktlarda merge yaxshimi yoki rebase?

Konfliktlar bir xil, farq tarixda. Merge ularni bir marta merge commit’da hal qiladi, rebase esa har bir qayta qo‘llanayotgan commit’da. Lokal branch’lar uchun rebase qulay, umumiy branch’lar uchun — merge.

### Konflikt markerlari qolgan faylni commit qilish mumkinmi?

Texnik jihatdan ha, Git taqiqlamaydi. Lekin kod deyarli aniq kompilyatsiya bo‘lmaydi. Buni ushlash uchun `git diff --check` yoki pre-commit hook’dan foydalaning.

### Bir xil konfliktlarni qayta-qayta hal qilmaslik uchun nima qilish kerak?

`git config --global rerere.enabled true` ni yoqing. Git konfliktni qanday hal qilganingizni eslab qoladi va u takrorlansa, xuddi shu yechimni qo‘llaydi.
