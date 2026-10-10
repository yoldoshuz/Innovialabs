---
title: Terraform’da state boshqaruvi: remote backend, locking va workspaces
description: Terraform’ga state nega kerak, remote backend’ni locking bilan sozlash, state’ni muhitlarga ajratish, mavjud resurslarni import qilish va drift’ni tuzatish.
summary: State — kodingiz va real infratuzilma o‘rtasidagi xarita. Uni locking va shifrlash bilan remote backend’da saqlang, muhit va komponentlar bo‘yicha ajrating, nomuvofiqliklarni esa faylni qo‘lda tahrirlash bilan emas, plan, import va refresh orqali tuzating.
---

## State nima va u nega muhim

**State** (`terraform.tfstate`) — Terraform koddagi resurslar va bulutdagi real obyektlar o‘rtasidagi moslikni saqlaydigan fayl: identifikatorlar, atributlar, bog‘liqliklar. Usiz Terraform nima allaqachon yaratilganini bilmaydi va keyingi `apply`’da hammasini qaytadan yaratishga urinadi.

Bundan uchta qoida kelib chiqadi:

- **State — muhim artefakt.** State yo‘qolsa infratuzilma o‘chmaydi, lekin boshqaruvdan uziladi.
- **State’da maxfiy ma’lumotlar bor.** Ma’lumotlar bazasi parollari, kalitlar va boshqa nozik atributlar ochiq matnda saqlanishi mumkin.
- **State bilan bir vaqtda bitta jarayon ishlashi kerak.** Ikkita parallel `apply` uni buzib qo‘yishi mumkin.

## Locking bilan remote backend

Lokal state faqat tajribalar uchun yaraydi. Jamoaga **remote backend** kerak: hamma va CI kira oladigan umumiy ombor.

Yaxshi backend nimani berishi kerak:

| Talab | Nima uchun |
|---|---|
| **Locking (bloklash)** | Ikki ishga tushirish state’ni bir vaqtda o‘zgartirishiga yo‘l qo‘ymaydi |
| **Shifrlash** | State ichidagi maxfiy ma’lumotlarni himoya qiladi |
| **Versiyalash** | State’ning oldingi versiyasiga qaytish imkonini beradi |
| **Kirish nazorati** | State’ni kim o‘qishi va o‘zgartirishini cheklaydi |

AWS S3 uchun misol:

```hcl
terraform {
  backend "s3" {
    bucket       = "company-terraform-state"
    key          = "prod/network/terraform.tfstate"
    region       = "eu-central-1"
    encrypt      = true
    use_lockfile = true
  }
}
```

Bloklash mexanizmi backend va Terraform versiyasiga bog‘liq: eski S3 konfiguratsiyalarida DynamoDB jadvali ishlatilgan. O‘z versiyangiz hujjatlari bilan solishtiring. Muqobillar — GCS, Azure Blob, Terraform Cloud/HCP, GitLab-managed state.

State uchun bucket’ning o‘zini alohida yarating (qo‘lda yoki alohida konfiguratsiya bilan) va unda versiyalashni yoqing.

## State’ni muhit va komponentlarga ajratish

Hamma narsa uchun bitta katta state — muammolar manbai: uzoq `plan`, xatoning katta ta’sir radiusi, bloklash to‘qnashuvlari.

Ikki asosiy yondashuv:

- **Har bir muhit uchun alohida katalog** (`envs/dev`, `envs/prod`) va backend’da turli `key`. Muhitlar aniq ajratilgan, turli kirish huquqlarini berish mumkin.
- **Workspaces** — bitta konfiguratsiyada bir nechta state, `terraform workspace select` bilan almashtiriladi. Bir xil nusxalar uchun qulay, lekin o‘zgarishlarni adashib boshqa muhitga qo‘llash oson.

Production uchun ko‘pincha **alohida kataloglar yoki alohida backend konfiguratsiyalari** tanlanadi, workspaces esa vaqtinchalik va bir xil stendlar uchun qoldiriladi. Muhit ichida state’ni qatlamlarga bo‘lish foydali: tarmoq, ma’lumotlar, ilovalar. Ular `terraform_remote_state` yoki outputs orqali bog‘lanadi.

## Mavjud resurslarni import qilish

Qo‘lda yaratilgan resursni qayta yaratmasdan boshqaruvga olish mumkin:

```hcl
import {
  to = aws_s3_bucket.assets
  id = "company-assets"
}
```

Tartib: resursni kodda tasvirlang (yoki `terraform plan -generate-config-out=...` bilan konfiguratsiya yarating), `plan`’ni ishga tushiring, o‘zgarish yo‘qligiga yoki faqat kutilgan o‘zgarishlar borligiga ishonch hosil qiling, keyin `apply`. Eski versiyalarda `terraform import` buyrug‘i bor.

## Drift: real holat koddan farq qilganda

**Drift** — Terraform’ni chetlab qilingan o‘zgarishlar: kimdir konsolda firewall qoidasini o‘zgartirgan.

1. `terraform plan -refresh-only`’ni ishga tushiring — u real holat state’dan nimasi bilan farqlanishini ko‘rsatadi.
2. Qaysi biri to‘g‘ri ekanini hal qiling: kodmi yoki qo‘lda qilingan o‘zgarishmi.
3. Qo‘lda qilingani to‘g‘ri bo‘lsa — uni kodga o‘tkazing. Kod to‘g‘ri bo‘lsa — oddiy `apply` qiling.
4. Drift’ni erta sezish uchun CI’da `plan`’ni jadval bo‘yicha muntazam ishga tushiring.

Resurslarni qayta nomlash uchun `moved` blokidan yoki `terraform state mv`’dan, obyektni o‘chirmasdan boshqaruvdan chiqarish uchun `removed` blokidan yoki `terraform state rm`’dan foydalaning.

## Ko‘p uchraydigan xatolar

- `terraform.tfstate`’ni Git’da saqlash.
- State’ni matn muharririda qo‘lda tahrirlash.
- Boshqa jarayon haqiqatan tugaganiga ishonch hosil qilmasdan bloklashni olib tashlash (`force-unlock`).
- Barcha dasturchilarga production state’ga yozish huquqini berish.

## FAQ

### State’ni Git’da saqlash mumkinmi?

Tavsiya etilmaydi: unda maxfiy ma’lumotlar bo‘lishi mumkin, Git esa bloklashni bermaydi, shuning uchun parallel o‘zgarishlar to‘qnashuv va state buzilishiga olib keladi.

### State yo‘qolsa nima qilish kerak?

Backend’da versiyalash bo‘lgan bo‘lsa — oldingi versiyani tiklang. Bo‘lmasa — mavjud resurslarni yangi state’ga birma-bir yoki `import` bloklari bilan qayta import qilishga to‘g‘ri keladi.

### Workspaces yoki alohida kataloglar?

Alohida kataloglar aniq ajratish va turli kirish huquqlarini beradi, shuning uchun production uchun ko‘proq tanlanadi. Workspaces bir xil vaqtinchalik muhitlar uchun qulay.
