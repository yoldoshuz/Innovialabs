---
title: GitHub Actions va SSH orqali VPS’ga avtomatik deploy
description: VPS’ga avtodeployni sozlash: SSH kalitlar va repozitoriya secret’lari, pull, build va qayta ishga tushirish workflow’i, production himoya qoidalari.
summary: Deploy uchun alohida foydalanuvchi va SSH kalit yarating, yopiq kalitni GitHub secret’lariga qo‘ying, main’ga push bo‘lganda workflow serverga ulanib kodni yangilaydi, build qiladi va servisni qayta ishga tushiradi; production muhitini qoidalar bilan himoyalang.
---

## Bu qanday ishlaydi

Sxema oddiy: `main`ga push qilinganda GitHub Actions job’ni ishga tushiradi, u **SSH** orqali VPS’ingizga ulanadi va u yerda deploy skriptini bajaradi — kodni yangilash, bog‘liqliklarni o‘rnatish, build qilish va ilovani qayta ishga tushirish. Sizga uch narsa kerak: kirish kalitlari, repozitoriyadagi secret’lar va workflow’ning o‘zi.

## 1-qadam. Serverda foydalanuvchi va kalitlar

`root` nomidan deploy qilmang. Faqat ilova katalogiga kirish huquqi bo‘lgan alohida foydalanuvchi yarating, masalan `deploy`.

Ikkita kalit kerak bo‘ladi va ularni adashtirish oson:

| Kalit | Qayerdan → qayerga | Qayerda saqlanadi |
|---|---|---|
| **CI kaliti** | GitHub Actions → serveringiz | Yopiq qismi GitHub secret’larida, ochiq qismi `deploy` foydalanuvchisining `~/.ssh/authorized_keys` faylida |
| **Deploy key** | Serveringiz → GitHub | Yopiq qismi serverda, ochiq qismi repozitoriyaning **Settings → Deploy keys** bo‘limida (faqat o‘qish) |

Deploy key repozitoriya yopiq bo‘lsa va server `git pull`ni o‘zi bajarsa kerak. Kalitni shunday yaratish mumkin:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ./deploy_ci -N ""
```

Har bir vazifa uchun alohida kalitdan foydalaning: shunda uni boshqa kirish huquqlariga ta’sir qilmasdan bekor qilish oson.

## 2-qadam. Repozitoriya secret’lari

**Settings → Secrets and variables → Actions** bo‘limiga qo‘shing:

- `SSH_PRIVATE_KEY` — CI yopiq kalitining mazmuni;
- `SSH_HOST` va `SSH_USER` — server manzili va foydalanuvchi nomi;
- `SSH_KNOWN_HOSTS` — `ssh-keyscan your-server.com` natijasi, yaxshisi serverning o‘zida ko‘rgan kalit izi (fingerprint) bilan solishtirilgan holda.

Oxirgi bandni ko‘pincha o‘tkazib yuborib, host tekshiruvini o‘chirib qo‘yishadi. Bunday qilmang: usiz server almashtirilganini sezmaysiz.

## 3-qadam. Serverdagi deploy skripti

Deploy mantig‘ini serverdagi skriptda saqlang, masalan `/srv/app/deploy.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail
cd /srv/app
git pull --ff-only origin main
npm ci
npm run build
sudo systemctl restart app
```

`set -euo pipefail` skriptni birinchi xatoda to‘xtatadi, shunda servis chala yig‘ilgan kod bilan qayta ishga tushmaydi. `deploy` servisni parolsiz qayta ishga tushira olishi uchun `visudo` orqali faqat shu buyruqqa ruxsat bering:

```text
deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart app
```

`systemctl` yo‘lini `which systemctl` buyrug‘i bilan tekshiring.

## 4-qadam. Deploy workflow’i

`.github/workflows/deploy.yml` fayli:

```yaml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: deploy-production
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Configure SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/id_ed25519
          chmod 600 ~/.ssh/id_ed25519
          echo "${{ secrets.SSH_KNOWN_HOSTS }}" > ~/.ssh/known_hosts

      - name: Run deploy script
        run: ssh ${{ secrets.SSH_USER }}@${{ secrets.SSH_HOST }} "/srv/app/deploy.sh"
```

- **concurrency** ikki deploy bir vaqtda ketishiga yo‘l qo‘ymaydi; `cancel-in-progress: false` joriy deploy’ning tugashiga imkon beradi.
- **workflow_dispatch** qo‘lda ishga tushirishni qo‘shadi — qayta deploy uchun foydali.
- CI tekshiruvlaringiz bo‘lsa, ularni alohida job’ga chiqaring va `needs` qo‘shing, shunda deploy faqat testlar muvaffaqiyatli o‘tgandan keyin boshlanadi.

## 5-qadam. Production muhitini himoyalash

`environment: production` qatori job’ni muhit bilan bog‘laydi. **Settings → Environments** bo‘limida u uchun quyidagilarni sozlash mumkin:

- **Required reviewers** — deploy mas’ul shaxsning qo‘lda tasdiqlashini kutadi;
- **Wait timer** — boshlanishdan oldin kechikish;
- **Deployment branches** — faqat `main`dan deploy qilish mumkin;
- **Environment secrets** — SSH kalitlarni muhit darajasida saqlang, shunda ularni faqat shu muhitdagi job oladi.

Yopiq repozitoriyalar uchun ayrim qoidalarning mavjudligi GitHub tarifingizga bog‘liq.

## Ko‘p uchraydigan xatolar

- `root` nomidan yoki butun serverga kirish huquqi bor kalit bilan deploy qilish.
- known_hosts o‘rniga `StrictHostKeyChecking=no`.
- `set -e` yo‘q: build muvaffaqiyatsiz tugadi, servis esa baribir qayta ishga tushdi.
- Serverda qo‘lda qilingan o‘zgarishlar, ular sababli `git pull --ff-only` ishlashdan bosh tortadi.

## FAQ

### Nega loyihani GitHub Actions’da build qilib, tayyor natijani ko‘chirmaslik kerak?

Shunday qilsa ham bo‘ladi va bu ko‘pincha yaxshiroq: server build’ga resurs sarflamaydi, unga allaqachon tekshirilgan artefakt keladi. Uni o‘sha SSH orqali `rsync` yoki `scp` bilan uzatish mumkin. `git pull` varianti esa boshlash uchun soddaroq.

### Uzilishsiz deploy qanday qilinadi?

`systemctl restart` qisqa uzilish beradi. Undan qochish uchun silliq qayta yuklashli jarayon menejerlari, symlink orqali ikki reliz katalogi orasida almashish yoki balanser ortidagi konteynerlardan foydalaniladi.

### Deploy saytni buzsa, qanday orqaga qaytish mumkin?

Eng oddiy yo‘l — `main`dagi commit’ni revert qilish: workflow oldingi versiyani deploy qiladi. Tezroq qaytish uchun serverda oxirgi bir nechta relizni saqlang va ular orasida almashing.
