---
title: Ansible nima: serverlarni agentlarsiz sozlash
description: Ansible serverlarni SSH orqali, hech qanday agent o‘rnatmasdan sozlaydi. Inventory, modullar, playbook, idempotentlik va u olib tashlaydigan rutinani ko‘ramiz.
summary: Ansible — YAML’da tasvirlangan vazifalarni SSH orqali serverlarda bajaradigan avtomatlashtirish vositasi; serverlarga hech narsa o‘rnatish shart emas, idempotentlik tufayli qayta ishga tushirish xavfsiz.
---
## Ansible nima

**Ansible** — serverlarni avtomatik sozlash vositasi (configuration management). Siz YAML faylda server qanday bo‘lishi kerakligini tasvirlaysiz: qaysi paketlar o‘rnatilgan, qaysi foydalanuvchilar yaratilgan, nginx konfiguratsiyasi qanday. Ansible serverlarga **SSH** orqali ulanadi va ularni shu holatga keltiradi.

Asosiy xususiyati — **agentless**: boshqariladigan serverlarga hech qanday agent o‘rnatish kerak emas. SSH kirishi va deyarli har bir Linux distributivida bor Python yetarli. Ansible faqat buyruqlarni ishga tushiradigan mashinaga (noutbuk yoki CI server) o‘rnatiladi.

## To‘rtta asosiy tushuncha

### Inventory

Rollar bo‘yicha guruhlangan serverlar ro‘yxati:

```ini
[web]
web1.example.com
web2.example.com

[db]
db1.example.com ansible_user=deploy
```

Guruhlar bitta buyruq bilan «buni barcha web serverlarda bajar» deyish imkonini beradi.

### Modullar

**Modul** — muayyan harakat uchun tayyor «g‘isht»: `apt` paketlarni o‘rnatadi, `copy` va `template` fayllarni joylashtiradi, `user` foydalanuvchilarni boshqaradi, `service` yoki `systemd` servislarni ishga tushiradi. Modullar yuzlab, va ko‘p vazifalarni qo‘lda yozilgan shell skriptlarsiz hal qilish mumkin.

### Playbook

**Playbook** — ssenariyli YAML fayl: qaysi xostlarda qanday vazifalarni bajarish.

```yaml
- name: Web serverlarni sozlash
  hosts: web
  become: true
  tasks:
    - name: nginx o‘rnatish
      ansible.builtin.apt:
        name: nginx
        state: present
        update_cache: true

    - name: Sayt konfiguratsiyasini joylash
      ansible.builtin.template:
        src: site.conf.j2
        dest: /etc/nginx/sites-enabled/site.conf
      notify: nginx’ni qayta yuklash

  handlers:
    - name: nginx’ni qayta yuklash
      ansible.builtin.service:
        name: nginx
        state: reloaded
```

Ishga tushirish: `ansible-playbook -i inventory.ini site.yml`. `--check` flagi hech narsani o‘zgartirmasdan nima o‘zgarishini ko‘rsatadi.

### Rollar

**Rol** — bitta maqsad (masalan, «nginx» yoki «postgres») uchun vazifalar, shablonlar va o‘zgaruvchilarni qadoqlash usuli, ularni turli loyihalarda qayta ishlatish uchun.

## Idempotentlik — asosiy xususiyat

**Idempotentlik** degani: qayta ishga tushirish xuddi shu natijani beradi va hech narsani buzmaydi. `state: present` vazifasi nginx yo‘q bo‘lsa o‘rnatadi, allaqachon o‘rnatilgan bo‘lsa hech narsa qilmaydi. Ansible hisobotda vazifalarni `ok` (allaqachon kerakli holatda) yoki `changed` (nimadir o‘zgartirildi) deb belgilaydi.

Shuning uchun playbook’ni muntazam ishga tushirish mumkin — serverlar etalondan «chetga chiqmagani»ni tekshirish sifatida.

Muhim: idempotentlikni Ansible o‘zi emas, modullar kafolatlaydi. `shell` yoki `command` orqali vazifalar har safar bajariladi, ular uchun shartlarni o‘zingiz yozishingiz kerak (`creates`, `when`, `changed_when`).

## Ansible qanday rutinani olib tashlaydi

- yangi serverni dastlabki sozlash: foydalanuvchilar, SSH kalitlari, firewall, yangilanishlar;
- o‘nlab mashinalarda dasturlarni bir vaqtda o‘rnatish va yangilash;
- nginx, PostgreSQL, systemd servis konfiguratsiyalarini shablonlardan tarqatish;
- ilovani deploy qilish: kodni olish, yig‘ish, servisni qayta ishga tushirish;
- ommaviy amallar: kalit yoki sertifikatni almashtirish, xavfsizlik patchi;
- staging va production uchun bir xil muhit.

## Ko‘p uchraydigan xatolar

- **Hammasi `shell` orqali.** Idempotentlik va o‘qilishi yo‘qoladi. Avval mos modulni qidiring.
- **O‘zgaruvchilarda ochiq parollar.** **Ansible Vault** yoki tashqi sirlar menejeridan foydalaning.
- **To‘g‘ridan-to‘g‘ri production’da ishga tushirish.** Avval `--check --diff` va staging.
- **Ansible’dan keyin serverlarda qo‘lda o‘zgartirish.** Keyingi ishga tushirish ularni qayta yozadi; har qanday o‘zgarishni playbook’ga kiriting.
- **Ulkan tekis playbook.** Uni rollarga ajrating.

## Ansible va Terraform: farqi nimada

| | Terraform | Ansible |
|---|---|---|
| Asosiy vazifa | Infratuzilma yaratish: serverlar, tarmoqlar, DNS | Server ichidagilarni sozlash |
| Yondashuv | Deklarativ, state fayl bilan | Tartib bilan vazifalar, alohida state’siz |
| Qanday ishlaydi | Bulut API orqali | SSH orqali |

Ular ko‘pincha birga ishlatiladi: Terraform serverlarni yaratadi, Ansible ularni sozlaydi.

Hujjatlar: [docs.ansible.com](https://docs.ansible.com/).

## FAQ

### Ansible Windows serverlar uchun mos keladimi?

Ha, lekin ulanish oddiy SSH emas, odatda WinRM yoki Windows uchun OpenSSH orqali bo‘ladi va `win_` prefiksli alohida modullar ishlatiladi. Aralash infratuzilma uchun bu ishlaydigan variant.

### Hammasi Docker’da ishlasa, Ansible kerakmi?

Kamroq, lekin ko‘pincha hali ham kerak: kimdir Docker’ning o‘zini o‘rnatishi, xostlarda foydalanuvchilar, firewall, monitoring va yangilanishlarni sozlashi kerak. Ansible bu qatlamni yaxshi yopadi.

### O‘rganishni nimadan boshlash kerak?

Qo‘lda bajaradigan bitta rutinali vazifani, masalan yangi serverni sozlashni oling va uni bitta playbook’da tasvirlang. Keyin takrorlanadigan qismlarni rollarga chiqaring va sirlar uchun Vault qo‘shing.
