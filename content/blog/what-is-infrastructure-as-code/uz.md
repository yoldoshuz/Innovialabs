---
title: Infrastructure as Code nima va u nega muhim
description: Infrastructure as Code nima, deklarativ va imperativ yondashuv farqi, infratuzilmani nega Git’da saqlash kerak va qaysi IaC vositalarini tanlash mumkin.
summary: Infrastructure as Code — serverlar, tarmoqlar va servislarni Git’da saqlanadigan va avtomatik qo‘llaniladigan matnli fayllarda tavsiflash; shunda infratuzilma qayta yaratiladigan, tekshiriladigan va hujjatlashtirilgan bo‘ladi.
---
## Infrastructure as Code nima

**Infrastructure as Code (IaC)** — infratuzilmani provayder panelida yoki SSH orqali qo‘lda sozlamasdan, **fayllarda tavsiflash** yondashuvi. Bu fayllarda qanday serverlar, tarmoqlar, ma’lumotlar bazalari, DNS yozuvlari va kirish huquqlari kerakligi ko‘rsatiladi. Maxsus vosita tavsifni o‘qiydi va haqiqiy infratuzilmani unga moslashtiradi.

Asosiy g‘oya: infratuzilma ilova kodi bilan bir xil qoidalar bo‘yicha yashaydi — o‘zgarishlar tarixi, ko‘rib chiqish va avtomatik tekshiruvlar bilan.

## Deklarativ va imperativ yondashuv

| | Deklarativ | Imperativ |
|---|---|---|
| Nimani tavsiflaysiz | **Kerakli holatni**: “3 ta server va balanser kerak” | **Qadamlarni**: “server yarat, keyin paket o‘rnat, keyin…” |
| Unga qanday yetishni kim hal qiladi | Vosita | Siz |
| Qayta ishga tushirish | Holatga allaqachon erishilgan bo‘lsa, hech narsani o‘zgartirmaydi | Tekshiruvlar qo‘shilmasa, amallarni takrorlashi mumkin |
| Misollar | Terraform, OpenTofu, CloudFormation, Kubernetes manifestlari | Shell skriptlar, Ansible’ning ayrim ssenariylari, oddiy dasturlash tilidagi Pulumi |

Terraform’dagi deklarativ tavsif misoli:

```hcl
resource "aws_s3_bucket" "assets" {
  bucket = "my-project-assets"
}
```

Siz “bucket yarat” deb yozmaysiz — “bucket mavjud bo‘lishi kerak” deb yozasiz. U bo‘lmasa, Terraform uni yaratadi; bo‘lsa va tavsifga mos kelsa, hech narsa qilmaydi.

Chegara mutlaq emas: Ansible ham **idempotentlikka** intiladi, Pulumi esa kerakli holatni TypeScript yoki Python’da tavsiflaydi. Natijada aynan nima olayotganingizni tushunish muhim — holat tavsifinimi yoki buyruqlar ketma-ketligini.

## Infratuzilmani nega Git’da saqlash kerak

- **O‘zgarishlar tarixi.** Kim, qachon va nima uchun port ochgani yoki serverni kattalashtirgani ko‘rinadi.
- **Ko‘rib chiqish.** Infratuzilma o‘zgarishi har qanday kod kabi pull request’dan o‘tadi. Xato qo‘llashdan oldin aniqlanadi.
- **Orqaga qaytarish.** Konfiguratsiyaning oldingi versiyasiga qaytish mumkin.
- **Hujjatlashtirish.** Fayllarning o‘zi tizimning dolzarb tavsifi — tez eskiradigan alohida sxemani yuritish shart emas.
- **Avtomatlashtirish.** CI/CD o‘zgarishlar rejasini ko‘rsatadi va tasdiqlangandan keyin qo‘llaydi. Bu yondashuv ko‘pincha **GitOps** deb ataladi.

## Qayta yaratish imkoniyati: asosiy amaliy foyda

Infratuzilma kod bilan tavsiflanganda, uni bitta buyruq bilan **qaytadan ko‘tarish** mumkin:

- production bilan bir xil **staging** ko‘tarib, “jonli” tizimda emas, unda test qilish;
- yangi mijoz yoki mintaqa uchun muhitni o‘sha shablondan yaratish;
- avariyadan keyin administratorning xotirasiga tayanishdan ko‘ra tezroq tiklanish;
- **konfiguratsiya drifti**dan qutulish — qo‘lda tahrirlar tufayli serverlar vaqt o‘tib bir-biridan farq qila boshlashi.

## Asosiy vositalar sharhi

- **Terraform / OpenTofu** — turli provayderlarda bulutli infratuzilma yaratish: serverlar, tarmoqlar, bazalar, DNS. OpenTofu — Terraform’ning mos sintaksisli ochiq forki.
- **Pulumi** — xuddi shu vazifa, lekin tavsif TypeScript, Python, Go va boshqa tillarda yoziladi.
- **AWS CloudFormation, Azure Bicep** — muayyan bulut vositalari.
- **Ansible** — allaqachon yaratilgan serverlarni sozlash: paketlar, konfiglar, foydalanuvchilar. SSH orqali agentlarsiz ishlaydi.
- **Kubernetes manifestlari va Helm** — klaster ichidagi ilovalar va ularning muhitini tavsiflash.
- **Docker / Dockerfile** — alohida ilova muhitini tavsiflash.

Odatiy bog‘lanma: **Terraform resurslarni yaratadi**, **Ansible yoki image’lar ularni sozlaydi**, **Kubernetes ilovalarni ishga tushiradi**.

## Qanday boshlash kerak

1. Kodda kichik, lekin haqiqiy bir qismni tavsiflang — masalan, DNS yozuvlari yoki test serverini.
2. **State**’ni (Terraform holat fayli) noutbukda emas, bloklash imkoniyati bor masofaviy xotirada saqlang.
3. Secretlarni koddan secrets menejeri yoki CI o‘zgaruvchilariga chiqaring.
4. Kodda tavsiflangan narsalar uchun panelda qo‘lda o‘zgartirishni taqiqlang.
5. Har bir pull request uchun CI’ga `plan` qadamini qo‘shing.

## Ko‘p uchraydigan xatolar

- **Qo‘lda tahrirlar va IaC’ni aralashtirish** — vosita o‘zgarishlarni qayta yozadi yoki nomuvofiqliklarda yiqiladi.
- **Parollar va kalitlarni repozitoriyda saqlash.**
- **Butun infratuzilma uchun bitta ulkan fayl** — modullar va muhitlarga ajrating.
- **Rejani ko‘rmasdan qo‘llash** — ayniqsa resurslar o‘chirilayotganda.

## FAQ

### Bitta serverli kichik loyihaga IaC kerakmi?
Shart emas, lekin serverning Ansible yoki Docker Compose’dagi oddiy tavsifi ham ko‘chishda va tiklashda vaqtni tejaydi. Loyiha qancha uzoq yashasa, foyda shuncha ko‘p.

### Terraform Ansible’dan nimasi bilan farq qiladi?
Terraform birinchi navbatda infratuzilma resurslarini yaratadi va o‘chiradi, Ansible esa mavjud narsalarni sozlaydi. Ular ko‘pincha birga ishlatiladi.

### Mavjud infratuzilmani kodga o‘tkazish mumkinmi?
Ha. Terraform’da mavjud resurslarni import qilish mexanizmi bor. Odatda bu eng muhim komponentlardan boshlab, bosqichma-bosqich amalga oshiriladi.
