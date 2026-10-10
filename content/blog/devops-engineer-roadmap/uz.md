---
title: DevOps-muhandis roadmap’i: ko‘nikmalar qadamma-qadam
description: Bo‘lajak DevOps-muhandis uchun reja: Linux, tarmoqlar, skriptlar, Git, Docker, CI/CD, bulut va monitoring, har qadamda amaliy laboratoriya ishi bilan.
summary: DevOps’ni pastdan yuqoriga o‘rganing: Linux va tarmoqlar, keyin skriptlar va Git, konteynerlar, CI/CD, bulut va kod sifatidagi infratuzilma, monitoring; har qadamni o‘z virtual mashinalaringizda laboratoriya ishi bilan mustahkamlang.
---

## Ko‘nikmalar ketma-ketligi

DevOps-muhandis jamoaga **kodni foydalanuvchilarga tez va ishonchli yetkazishda** yordam beradi: yig‘ish, testlar va deploy’ni avtomatlashtiradi, tizimlar barqarorligini kuzatadi. Bu rolda hamma narsa poydevorga tayanadi, shuning uchun tartib muhim:

1. **Linux.**
2. **Tarmoqlar.**
3. **Skriptlar va Git.**
4. **Konteynerlar**: Docker, keyin orkestratsiya asoslari.
5. **CI/CD.**
6. **Bulut va kod sifatidagi infratuzilma.**
7. **Monitoring va loglash.**

Linux va tarmoqlarsiz Kubernetes’dan boshlasangiz, har qanday muammo tushunarsiz bo‘lib ko‘rinadi.

## 1-qadam. Linux

- Fayl tizimi, kirish huquqlari, foydalanuvchilar va guruhlar.
- Jarayonlar, servislar, `systemd`, loglarni ko‘rish.
- Paket menejerlari, SSH, kirish kalitlari.
- Asosiy utilitalar: `grep`, `find`, `tail`, `df`, `top`.

**Laboratoriya:** virtual mashina yarating, faqat SSH-kalit orqali kirishni sozlang, veb-server o‘rnating va uning loglari qayerda ekanini aniqlang.

## 2-qadam. Tarmoqlar

- TCP/IP modeli, IP-manzillar, portlar, quyi tarmoqlar.
- **DNS**, **HTTP/HTTPS**, TLS-sertifikatlar.
- Yuk balansirovkachilari va reverse proxy.
- Diagnostika: `ping`, `curl`, `dig`, `ss`.

**Laboratoriya:** oddiy ilova oldiga reverse proxy qo‘ying, domen va HTTPS-sertifikatni ulang.

## 3-qadam. Skriptlar va Git

- Muntazam vazifalarni avtomatlashtirish uchun **Bash**.
- Boshlang‘ich darajada bitta umumiy maqsadli til, ko‘pincha Python yoki Go.
- **Git**: branch’lar, birlashtirish, pull request, jamoada ishlash.

**Laboratoriya:** katalogning zaxira nusxasini oladigan, uni arxivlaydigan va eski nusxalarni o‘chiradigan skript.

## 4-qadam. Konteynerlar

- Image va konteyner, Dockerfile, qatlamlar, volume’lar, tarmoqlar.
- Bir nechta servisdan iborat lokal muhit uchun **Docker Compose**.
- **Orkestratsiya** asoslari: Kubernetes nima uchun kerak, pod, deployment, service nima.

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

**Laboratoriya:** ilovani ma’lumotlar bazasi bilan Compose’ga joylang, keyin uni lokal Kubernetes klasterida ishga tushiring.

## 5-qadam. CI/CD

- Konveyer: yig‘ish → testlar → image yig‘ish → deploy.
- Maxfiy ma’lumotlarni repozitoriyada emas, CI’da saqlash.
- Chiqarish strategiyalari va xato bo‘lganda orqaga qaytarish.

```yaml
name: ci
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t app .
      - run: docker run --rm app python -m pytest
```

**Laboratoriya:** har bir push’da kod testlanadi, image yig‘iladi, asosiy branch’dagi o‘zgarishlar esa serverga avtomatik chiqariladi.

## 6-qadam. Bulut va kod sifatidagi infratuzilma

- Har qanday bulutning asosiy xizmatlari: virtual mashinalar, tarmoqlar, xotira, managed ma’lumotlar bazalari, IAM.
- **Infrastructure as Code**: infratuzilmani fayllarda tavsiflash, masalan, Terraform bilan.
- Konfiguratsiyani boshqarish, masalan, Ansible bilan.

**Laboratoriya:** tarmoq, virtual mashina va kirish qoidalarini kodda tavsiflang, ularni bitta buyruq bilan yarating va xuddi shunday o‘chiring.

## 7-qadam. Monitoring va loglash

- Metrikalar, loglar, treyslar.
- Shovqin emas, real muammo haqida xabar beradigan alertlar.
- Servisning asosiy ko‘rsatkichlari bo‘yicha dashboard’lar.

**Laboratoriya:** ilovangiz metrikalarini yig‘ing, dashboard yarating va ishlamay qolish haqida ogohlantirishni sozlang.

## Adashib qolmaslik uchun

| Xato | Nima qilish kerak |
|---|---|
| Vazifani tushunmasdan vositalarni o‘rganish | Avval vosita qaysi muammoni hal qilishini tushunish |
| Amaliyot o‘rniga sertifikat yig‘ish | Har bir ko‘nikmani laboratoriya bilan tasdiqlash |
| Hammasini bulut konsolida qo‘lda sozlash | Infratuzilmani kodda tavsiflash |
| Bulut resurslarini yoqiq qoldirish | Ishdan keyin stendlarni o‘chirish, xarajatlarni kuzatish |

## FAQ

### Dasturlash yoki ma’murlash tajribasisiz DevOps-muhandis bo‘lish mumkinmi?

Mumkin, lekin yo‘l uzoqroq bo‘ladi. Ko‘pchilik DevOps’ga tizim ma’murligi yoki backend-dasturlashdan keladi, chunki u yerda Linux, tarmoqlar va kod bo‘yicha poydevor allaqachon bor.

### Boshida Kubernetes’ni o‘rganish shartmi?

Yo‘q. Avval Linux, tarmoqlar, Docker va CI/CD’ni ishonchli o‘zlashtiring. Kubernetes’ni u konteynerlarning qaysi muammolarini hal qilishi tushunarli bo‘lganda o‘rganish mantiqan to‘g‘ri.

### O‘qish uchun qaysi bulutni tanlash kerak?

Yirik bulutlardan istalgani: asosiy tushunchalar o‘xshash. Hududingizdagi vakansiyalarga qarang va o‘quv akkauntida albatta xarajat limitlarini o‘rnating.
