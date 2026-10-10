---
title: Terraform yoki Ansible: farqi nimada va ularni birga qanday ishlatish
description: Terraform va Ansible farqi: infratuzilmani yaratish va serverlarni sozlash, state va stateless yondashuv hamda ikkala vositani birga ishlatishning amaliy sxemasi.
summary: Terraform infratuzilmani (serverlar, tarmoqlar, bazalar, DNS) yaratadi va uning holatini saqlaydi, Ansible esa mavjud resurslarni sozlaydi (paketlar, fayllar, servislar); amalda Terraform resurslarni ko‘taradi, Ansible ularni ishga tayyorlaydi.
---
## Qisqa javob

**Terraform** «qanday infratuzilma mavjud bo‘lishi kerak» degan savolga javob beradi: virtual mashinalar, tarmoqlar, balansirovkachilar, managed bazalar, DNS yozuvlari, bucketlar. **Ansible** esa «server ichida nima bo‘lishi kerak» degan savolga javob beradi: o‘rnatilgan paketlar, nginx konfiguratsiyasi, foydalanuvchilar, systemd servislari, ilovani joylashtirish.

Birinchisi **provisioning** (resurs yaratish), ikkinchisi **configuration management** (konfiguratsiyani boshqarish) deyiladi. Ular raqobatchi emas, bitta vazifaning ikki qatlami.

## Provisioning va configuration farqi

| | Terraform | Ansible |
|---|---|---|
| Asosiy vazifa | Bulut resurslarini yaratish, o‘zgartirish, o‘chirish | Xostlarda OT va ilovalarni sozlash |
| Yondashuv | Deklarativ: yakuniy holatni tasvirlaysiz | Shakli protsedurali (ketma-ket vazifalar), mohiyati idempotent |
| Holat | **State-fayl** saqlaydi | Holat saqlamaydi, har safar xostni tekshiradi |
| Ulanish usuli | Provayder API orqali (AWS, GCP, Yandex Cloud va boshqalar) | SSH (yoki WinRM) orqali |
| Til | HCL | YAML-pleybuklar |
| Serverda agent | Kerak emas | Kerak emas |

## State va stateless

**Terraform state saqlaydi** — kodingiz qaysi real resurslarga mos kelishi yozilgan fayl. Shu sababli `terraform plan` aniq farqni ko‘rsatadi: nima yaratiladi, o‘zgaradi va o‘chiriladi. Resursni koddan olib tashlasangiz, Terraform uni bulutdan ham o‘chiradi.

Bu yondashuvning narxi:

- state repozitoriyda emas, bloklash imkoniyati bor **masofaviy backend**da (S3 bilan mos ombor, Terraform Cloud va hokazo) saqlanishi kerak;
- state ichiga maxfiy ma’lumotlar tushishi mumkin, shuning uchun unga kirish cheklanadi;
- bulut konsolida qo‘lda qilingan o‘zgarishlar **drift**ga — kod va haqiqat o‘rtasidagi tafovutga olib keladi.

**Ansible holat saqlamaydi.** Har bir ishga tushirishda xostga ulanib tekshiradi: paket o‘rnatilganmi? fayl mos keladimi? Agar shunday bo‘lsa, hech narsa qilmaydi. Bu **idempotentlik**. Kamchiligi: Ansible pleybukdan nimani olib tashlaganingizni bilmaydi. Paket o‘rnatish vazifasini o‘chirsangiz, paket serverda qoladi — uni `state: absent` bilan aniq o‘chirish kerak.

## Vositalar qayerda kesishadi

Chegaralar aniq emas:

- Ansible’da bulut modullari bor — ular bilan virtual mashina yaratish mumkin;
- Terraform’da `user_data`/cloud-init va provisionerlar bor — ular bilan serverda skript bajarish mumkin.

Texnik jihatdan bitta vosita bilan ishlash mumkin, lekin odatda bu noqulay. State’siz Ansible bulut resurslarining hayot siklini, ayniqsa o‘chirishni yomon boshqaradi, Terraform hujjatlari esa provisionerlarni oxirgi chora sifatida tavsiya qiladi.

## Odatiy sxema: ikkalasi birga

1. **Terraform** tarmoq, virtual mashinalar, balansirovkachi, baza va DNS yaratadi.
2. Terraform IP manzillarni `output` orqali chiqaradi yoki Ansible uchun inventory yaratadi.
3. **Ansible** yangi mashinalarga ulanadi: Docker yoki runtime o‘rnatadi, konfiguratsiyalarni joylaydi, foydalanuvchilar yaratadi, monitoringni yoqadi.
4. Ilovani joylashtirishni CI/CD bajaradi — o‘sha Ansible yoki alohida pipeline orqali.

Oddiy bog‘lanish misoli:

```hcl
output "web_ips" {
  value = aws_instance.web[*].public_ip
}
```

```bash
terraform apply
terraform output -json web_ips | jq -r '.[]' > hosts.txt
ansible-playbook -i hosts.txt site.yml
```

Konteynerli infratuzilmada Ansible’ning roli ko‘pincha torayadi: imijlar CI’da yig‘iladi, serverlar deyarli qo‘lda sozlanmaydi. Ammo xostlarni dastlabki tayyorlash (yangilanishlar, SSH, monitoring agentlari) uchun Ansible hamon qulay.

## Ko‘p uchraydigan xatolar

- **State’ni lokal saqlash** yoki git’ga commit qilish — fayl yo‘qolishi yoki ikki kishi ishlaganda ziddiyat.
- **Resurslarni konsolda qo‘lda tahrirlash**, keyin Terraform rejasidan hayron qolish.
- **Serverlarni to‘liq provisionerlar orqali sozlash** — nosozlikni topish va takrorlash qiyin.
- **Tayyor modul bor joyda Ansible vazifalarini `shell` va `command` bilan yozish** — idempotentlik yo‘qoladi.
- **Maxfiy ma’lumotlarni ochiq matnda saqlash**; Ansible Vault yoki secrets menejeridan foydalaning.

## Qanday tanlash kerak

- Bulut resurslarini yaratish va o‘chirish, o‘zgarishlar rejasini ko‘rish kerak — **Terraform** (yoki uning ochiq forki OpenTofu).
- Bir xil sozlanishi va qo‘llab-quvvatlanishi kerak bo‘lgan serverlar parki bor — **Ansible**.
- Ikkalasi ham bor — mas’uliyat sohalarini ajratib, ikkalasini ishlating: Terraform «mashina mavjud» bosqichigacha, Ansible undan keyin.

## FAQ

### Faqat Ansible bilan ishlasa bo‘ladimi?

Ha, qo‘lda yoki hosting paneli orqali yaratilgan bir nechta serverdan iborat kichik infratuzilma uchun Ansible ko‘pincha yetarli. Resurslar ko‘payib, ularni to‘g‘ri kuzatish va o‘chirish muhim bo‘lganda qiyinchiliklar boshlanadi.

### Hammasi Kubernetes’da ishlasa, Ansible kerakmi?

Klaster ichida odatda kerak emas, u yerda konfiguratsiya manifestlar va Helm bilan tasvirlanadi. Lekin agar tugunlarni managed klaster emas, o‘zingiz boshqarsangiz, ularni tayyorlash uchun Ansible foydali bo‘lishi mumkin.

### Kimdir resursni qo‘lda o‘zgartirgan bo‘lsa nima qilish kerak?

`terraform plan`ni ishga tushiring: u tafovutni ko‘rsatadi. Keyin yoki `apply` orqali resursni koddagi holatga qaytaring, yoki qo‘lda qilingan o‘zgarishni kodga ko‘chiring, shunda haqiqat manbai bitta bo‘lib qoladi.
