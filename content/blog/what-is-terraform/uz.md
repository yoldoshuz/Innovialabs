---
title: Terraform nima: provayderlar, resurslar va plan/apply sikli
description: Terraform serverlar, tarmoqlar va ma’lumotlar bazalarini kod orqali tasvirlaydi. HCL, provayderlar, state va init, plan, apply siklini oddiy misolda ko‘ramiz.
summary: Terraform — Infrastructure as Code vositasi: siz kerakli infratuzilmani HCL fayllarida tasvirlaysiz, u esa uni haqiqiy holat bilan solishtirib, bulut API orqali resurslarni yaratadi, o‘zgartiradi yoki o‘chiradi.
---
## Terraform oddiy so‘zlar bilan

**Terraform** — **Infrastructure as Code (IaC)** yondashuvi uchun vosita. Bulut panelida qo‘lda bosib chiqish o‘rniga siz matnli fayl yozasiz: «shunday o‘lchamdagi server kerak, shu tarmoqda, shunday firewall bilan». Terraform faylni o‘qiydi, mavjud holat bilan solishtiradi va infratuzilmani tasvirlangan holatga keltiradi.

Asosiy g‘oya — **deklarativlik**: siz harakatlar ketma-ketligini emas, *natijani* tasvirlaysiz. Unga qanday erishishni Terraform o‘zi hal qiladi.

Amalda bu nima beradi:

- infratuzilma Git’da saqlanadi, o‘zgarishlar code review’dan o‘tadi;
- bir xil muhitlar (staging, production) bitta koddan yaratiladi;
- nima o‘zgarishini qo‘llashdan oldin ko‘rasiz;
- nosozlikdan keyin muhitni qayta ko‘tarish mumkin, qo‘lda nima sozlanganini eslash shart emas.

## Asosiy tushunchalar

| Tushuncha | Bu nima |
|---|---|
| **HCL** | HashiCorp Configuration Language — `.tf` fayllar tili, izohli JSON’ga o‘xshash va oson o‘qiladi |
| **Provider** | Muayyan platforma bilan ishlash plagini: AWS, Google Cloud, Azure, DigitalOcean, Cloudflare va boshqalar |
| **Resource** | Terraform boshqaradigan obyekt: server, DNS yozuvi, bucket, ma’lumotlar bazasi |
| **Data source** | Mavjud ma’lumotni (masalan, OS image ID) boshqarmasdan o‘qish |
| **Variable / Output** | Kirish parametrlari va qo‘llashdan keyin chiqariladigan qiymatlar |
| **State** | Kod va haqiqiy resurslar o‘rtasidagi moslik saqlanadigan fayl |

## Minimal misol: bitta server

Misol DigitalOcean uchun, lekin tuzilma deyarli har qanday provayderda bir xil:

```hcl
terraform {
  required_providers {
    digitalocean = {
      source = "digitalocean/digitalocean"
    }
  }
}

variable "do_token" {
  type      = string
  sensitive = true
}

provider "digitalocean" {
  token = var.do_token
}

resource "digitalocean_droplet" "web" {
  name   = "web-1"
  image  = "ubuntu-24-04-x64"
  region = "fra1"
  size   = "s-1vcpu-1gb"
}

output "ip" {
  value = digitalocean_droplet.web.ipv4_address
}
```

Token kodga yozilmaydi: u `TF_VAR_do_token` muhit o‘zgaruvchisi yoki Git’ga tushmaydigan alohida fayl orqali beriladi.

## init → plan → apply sikli

```bash
terraform init     # provayderlarni yuklash, state backend’ni tayyorlash
terraform plan     # nima yaratilishi, o‘zgarishi, o‘chirilishini ko‘rsatish
terraform apply    # tasdiqlashdan keyin o‘zgarishlarni qo‘llash
terraform destroy  # konfiguratsiyadagi hamma narsani o‘chirish
```

- **init** yangi loyihada bir marta va provayder yoki backend o‘zgargandan keyin ishga tushiriladi.
- **plan** — eng muhim qadam. Uni diqqat bilan o‘qing: `+`, `~` va `-` yaratish, o‘zgartirish va o‘chirishni bildiradi. Resursni **almashtirish** belgisi (`-/+`) ayniqsa xavfli: server o‘chiriladi va qaytadan yaratiladi.
- **apply** rejani bajaradi. CI’da odatda reja faylga saqlanadi (`terraform plan -out=tfplan`) va aynan o‘sha fayl qo‘llanadi, kutilmagan holatlar bo‘lmasligi uchun.

## State nima uchun kerak va uni qayerda saqlash

State — Terraform’ning «xotirasi». Usiz u koddagi `web` serveri bulutdagi aniq ID’ga ega aniq mashina ekanini bilmaydi.

State bilan ishlash qoidalari:

- **uni masofada saqlang** (S3-mos xotira, Terraform Cloud va h.k.), dasturchining noutbukida emas;
- **bloklashni yoqing** (state locking), ikki kishi bir vaqtda `apply` ishga tushirmasligi uchun;
- **state’ni Git’ga commit qilmang** — unda parollar va kalitlar ochiq holda bo‘lishi mumkin;
- **faylni qo‘lda tahrirlamang** — buning uchun `terraform state` va `terraform import` buyruqlari bor.

## Ko‘p uchraydigan xatolar

- **Bulut panelida qo‘lda o‘zgartirish.** Terraform farqni (drift) ko‘radi va keyingi `apply`’da hammasini koddagidek qaytaradi.
- **Hamma narsa uchun bitta ulkan fayl.** Kodni modullar va muhitlarga ajrating.
- **Provayder versiyalari qotirilmagan.** Versiya cheklovlarini ko‘rsating va `.terraform.lock.hcl`’ni commit qiling.
- **plan’ni o‘qimasdan apply.** Ma’lumotlar bazasini tasodifan o‘chirishning eng keng tarqalgan yo‘li.
- **`.tf` fayllarda sirlar.** Muhit o‘zgaruvchilari yoki sirlar menejeridan foydalaning.

## Terraform qachon kerak, qachon kerak emas

Agar bulut infratuzilmangiz bir nechta komponentdan iborat bo‘lsa, bir nechta muhit bo‘lsa yoki jamoaga o‘zgarishlar tarixi muhim bo‘lsa, Terraform o‘zini oqlaydi. Yiliga bir marta sozlanadigan bitta VPS uchun u ortiqcha bo‘lishi mumkin — hujjatlashtirilgan yo‘riqnoma yetarli.

Chegarani tushunish muhim: Terraform infratuzilmani **yaratadi**, server ichida paketlarni o‘rnatish va dasturlarni sozlashni odatda boshqa vositalar, masalan Ansible, yoki tayyor image va konteynerlar bajaradi.

Rasmiy hujjatlar: [developer.hashicorp.com/terraform](https://developer.hashicorp.com/terraform/docs).

## FAQ

### Terraform OpenTofu’dan nimasi bilan farq qiladi?

OpenTofu — HashiCorp litsenziyani o‘zgartirgandan keyin paydo bo‘lgan Terraform’ning ochiq forki. HCL sintaksisi va asosiy workflow mos keladi, shuning uchun bilimlar ko‘chadi. Tanlov odatda kompaniyaning litsenziya talablari va kerakli integratsiyalarga bog‘liq.

### Terraform’ni mavjud infratuzilmaga ulash mumkinmi?

Ha. Qo‘lda yaratilgan resurslarni kodda tasvirlab, `terraform import` yoki `import` bloklari orqali state’ga bog‘lash mumkin. Buni bosqichma-bosqich qiling va importdan keyin `plan` ortiqcha o‘zgarishlarni ko‘rsatmayotganini tekshiring.

### Terraform yozish uchun dasturlashni bilish kerakmi?

Chuqur ko‘nikmalar shart emas: HCL deklarativ va oson o‘qiladi. Lekin tarmoqlar, bulut xizmatlari va Git asoslarini tushunish majburiy — Terraform faqat siz baribir tushunishingiz kerak bo‘lgan narsani avtomatlashtiradi.
