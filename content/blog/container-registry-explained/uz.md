---
title: Konteyner reyestri nima: Docker Hub, GHCR va xususiy registry
description: Docker obrazlari registry’da qanday saqlanadi, teglanadi va yuklab olinadi, mashhur reyestrlar farqi va eski obrazlarni tozalashni sozlash haqida.
summary: Container registry — Docker obrazlari ombori bo‘lib, serverlar va CI undan ilovaning tayyor yig‘masini yuklab oladi. Reyestrni CI yoki bulutingizga yaqin tanlang, obrazlarni kommit yoki versiya bo‘yicha teglang va eskilarini avtomatik tozalashni sozlang.
---

## Qisqacha: container registry nima

**Container registry** (konteynerlar reyestri) — **Docker obrazlarini** saqlaydigan va so‘rov bo‘yicha beradigan server. Sxema oddiy:

1. CI ilova obrazini yig‘adi.
2. Obraz `push` buyrug‘i bilan reyestrga yuboriladi.
3. Server yoki Kubernetes uni `pull` buyrug‘i bilan yuklab oladi va konteynerni ishga tushiradi.

Reyestr — yig‘ish va ishga tushirish o‘rtasidagi ko‘prik: aynan bitta obraz staging’ga ham, production’ga ham tushadi.

## Obrazlar qanday saqlanadi

Obrazning to‘liq nomi quyidagicha:

```text
ghcr.io/my-org/api:1.4.2
└reyestr┘└repozitoriy┘└teg┘
```

- **Repozitoriy** — bitta obrazning versiyalari to‘plami.
- **Teg** — versiyaning odam o‘qiy oladigan belgisi. Uni qayta yozish mumkin.
- **Digest** (`sha256:...`) — tarkibning o‘zgarmas izi. Aynan o‘sha obraz ishga tushishiga kafolat kerak bo‘lsa, digest’ga havola qiling.
- **Qatlamlar.** Obraz qatlamlardan iborat, umumiy qatlamlar bir marta saqlanadi va yuklanadi — shuning uchun takroriy `pull` tez.

Odatiy sikl:

```bash
docker build -t ghcr.io/my-org/api:1.4.2 .
docker push ghcr.io/my-org/api:1.4.2
docker pull ghcr.io/my-org/api:1.4.2
```

## Mashhur reyestrlarni solishtirish

| Reyestr | Qachon qulay | Nimaga e’tibor berish |
|---|---|---|
| **Docker Hub** | Ommaviy obrazlar, open-source | Anonim va bepul akkauntlar uchun yuklab olish limitlari |
| **GitHub Container Registry (GHCR)** | Kod va CI allaqachon GitHub’da | Kirish huquqlari GitHub tashkilotiga bog‘langan |
| **GitLab Container Registry** | GitLab’dagi loyihalar | Loyihaga o‘rnatilgan, GitLab CI bilan qulay |
| **Bulutli (AWS ECR, Google Artifact Registry, Azure ACR)** | Infratuzilma shu bulutda | Bulut ichida tez pull, kirish IAM orqali |
| **Self-hosted (Harbor, Distribution)** | Ma’lumotlarni kompaniya ichida saqlash talabi | Xizmat ko‘rsatish, bekap va yangilanishlar — sizda |

Umumiy tamoyil: reyestrni **ishga tushirish joyiga yaqinroq** saqlang — bu tezroq va odatda trafik bo‘yicha arzonroq.

## Teglash strategiyalari

- **`latest`ga tayanmang.** Qaysi versiya aslida ishlayotgani noma’lum, orqaga qaytarish esa lotereyaga aylanadi.
- **Kommit bo‘yicha teg** (`api:3f9c2ab`) — obraz va kod o‘rtasidagi aniq bog‘liqlik.
- **Semantik versiya** (`api:1.4.2`) — relizlar va changelog uchun qulay.
- **Muhit tegi** (`api:staging`) harakatlanuvchi ko‘rsatkich sifatida mumkin, lekin deployni o‘zgarmas teg yoki digest bo‘yicha qiling.
- Yaxshi amaliyot — bitta obrazga bir nechta teg qo‘yish: versiya va kommit xeshi.

## Tozalash va saqlash

Har bir CI ishga tushishi obraz qo‘shadi va reyestr tez o‘sadi. **Retention policy** sozlang:

- tegsiz (untagged) obrazlarni o‘chirish;
- ishlab chiqish branchlari uchun oxirgi N ta yig‘mani saqlash;
- reliz teglari bor obrazlarga tegmaslik;
- production’da ishlayotgan obraz orqaga qaytarish uchun mavjud qolishi kerakligini hisobga olish.

Ko‘pchilik bulutli reyestrlar va Harbor bunday qoidalarni tayyor holda qo‘llab-quvvatlaydi.

## Xavfsizlik

- Xususiy obrazlar — faqat xususiy repozitoriylarda.
- CI uchun shaxsiy parol emas, minimal huquqli alohida tokenlardan foydalaning.
- Sirlarni obraz ichiga joylamang: ular qatlamlarda ko‘rinadi.
- Reyestr qo‘llab-quvvatlasa, zaifliklarni skanerlashni yoqing.

## FAQ

### Reyestrsiz ishlash mumkinmi?

Bitta server bo‘lsa, obrazni to‘g‘ridan-to‘g‘ri unda yig‘ish mumkin. Lekin CI, bir nechta server paydo bo‘lishi yoki tez orqaga qaytarish kerak bo‘lishi bilan reyestr zarur bo‘lib qoladi.

### Teg digest’dan nimasi bilan farq qiladi?

Teg — qayta yozish mumkin bo‘lgan harakatlanuvchi belgi. Digest — tarkib xeshi, u doim aynan bitta obrazga ishora qiladi.

### Kichik jamoa qaysi reyestrni tanlashi kerak?

Git-xosting yoki bulutingizga o‘rnatilganini: GitHub uchun GHCR, GitLab uchun GitLab Registry, AWS uchun ECR. Shunda kirish sozlamalari kamroq va pull tezroq bo‘ladi.
