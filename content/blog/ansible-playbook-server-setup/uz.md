---
title: Ansible playbook yordamida server sozlashni qanday avtomatlashtirish
description: Foydalanuvchilar yaratadigan, paketlar o‘rnatadigan, shablonlar orqali konfiglar tarqatadigan, handlers va rollardan foydalanadigan Ansible inventory va playbook yozamiz.
summary: Ansible SSH orqali serverlarni YAML’da tasvirlangan holatga keltiradi: inventory xostlarni, playbook vazifalarni sanaydi, shablonlar konfiglarni yaratadi, handlers servislarni faqat o‘zgarish bo‘lganda qayta ishga tushiradi, rollar esa hammasini qayta ishlatiladigan qiladi.
---
## Nega Ansible va u qanday ishlaydi

Serverni yo‘riqnoma bo‘yicha qo‘lda sozlash — har safar biror qadamni o‘tkazib yuborish xavfi demak. **Ansible** serverning kerakli holatini YAML’da tasvirlaydi va uni mashinalarda agentlarsiz **SSH** orqali qo‘llaydi. Faqat maqsadli serverda Python va kalit orqali kirish kerak.

Asosiy xususiyati — **idempotentlik**: qayta ishga tushirish hech narsani buzmaydi. Paket allaqachon o‘rnatilgan bo‘lsa, Ansible uni o‘tkazib yuboradi va `changed` emas, `ok` ko‘rsatadi.

## 1-qadam. Inventory

Inventory — serverlar va ularning guruhlari ro‘yxati:

```ini
[web]
web1 ansible_host=203.0.113.10
web2 ansible_host=203.0.113.11

[web:vars]
ansible_user=root
```

Aloqani tekshiring: `ansible web -i inventory.ini -m ping`. Har bir xostdan `pong` javobi SSH va Python joyida ekanini bildiradi.

## 2-qadam. Loyiha tuzilmasi

```text
inventory.ini
site.yml
roles/
  base/
    tasks/main.yml
    handlers/main.yml
  nginx/
    tasks/main.yml
    handlers/main.yml
    templates/site.conf.j2
    defaults/main.yml
```

**Rol** — bitta mas’uliyat uchun vazifalar, shablonlar, handlers va standart o‘zgaruvchilar joylashgan papka. `base` roli har qanday serverni tayyorlaydi, `nginx` roli — faqat veb-serverlarni.

## 3-qadam. Foydalanuvchilar va paketlar

`roles/base/tasks/main.yml`:

```yaml
- name: Install base packages
  ansible.builtin.apt:
    name: [curl, git, ufw, fail2ban]
    state: present
    update_cache: true

- name: Create deploy user
  ansible.builtin.user:
    name: deploy
    groups: sudo
    append: true
    shell: /bin/bash

- name: Add SSH key for deploy
  ansible.posix.authorized_key:
    user: deploy
    key: "{{ lookup('file', 'files/deploy.pub') }}"

- name: Disable SSH password login
  ansible.builtin.lineinfile:
    path: /etc/ssh/sshd_config
    regexp: '^#?PasswordAuthentication'
    line: 'PasswordAuthentication no'
  notify: Restart ssh
```

`roles/base/handlers/main.yml`:

```yaml
- name: Restart ssh
  ansible.builtin.service:
    name: ssh
    state: restarted
```

**Handler** faqat uni chaqirgan (`notify`) vazifa haqiqatan nimanidir o‘zgartirgan bo‘lsa ishga tushadi va play oxirida bir marta bajariladi. Shunda servis sababsiz qayta ishga tushirilmaydi. SSH servisining nomi distributivlarda farq qiladi — uni o‘z OS’ingiz uchun tekshiring.

## 4-qadam. Shablonlar orqali konfiglar

Shablonlar **Jinja2** da yoziladi va o‘zgaruvchilar bilan to‘ldiriladi. `roles/nginx/defaults/main.yml`:

```yaml
server_name: example.com
app_port: 3000
```

`roles/nginx/templates/site.conf.j2`:

```nginx
server {
    listen 80;
    server_name {{ server_name }};

    location / {
        proxy_pass http://127.0.0.1:{{ app_port }};
        proxy_set_header Host $host;
    }
}
```

`roles/nginx/tasks/main.yml`:

```yaml
- name: Install nginx
  ansible.builtin.apt:
    name: nginx
    state: present

- name: Deploy site config
  ansible.builtin.template:
    src: site.conf.j2
    dest: /etc/nginx/sites-available/site.conf
  notify: Reload nginx

- name: Enable site
  ansible.builtin.file:
    src: /etc/nginx/sites-available/site.conf
    dest: /etc/nginx/sites-enabled/site.conf
    state: link
  notify: Reload nginx
```

`roles/nginx/handlers/main.yml` ichiga `state: reloaded` bilan `Reload nginx` handler’ini qo‘shing.

## 5-qadam. Playbook

`site.yml`:

```yaml
- name: Base setup for all servers
  hosts: all
  become: true
  roles:
    - base

- name: Web servers
  hosts: web
  become: true
  roles:
    - nginx
```

Avval `ansible-playbook -i inventory.ini site.yml --check --diff` ni ishga tushiring (o‘zgarishlarni qo‘llamasdan ko‘rsatadi), keyin `--check` siz.

## Ko‘p uchraydigan xatolar

- **Maxsus modullar o‘rniga `shell`.** `shell` idempotent emas; `apt`, `user`, `template`, `service` dan foydalaning.
- **Ochiq ko‘rinishdagi sirlar.** Parollar va tokenlarni **Ansible Vault** da saqlang.
- **Kalit tekshirilmasdan parol bilan kirishni taqiqlash.** Avval kalit orqali kirish ishlashiga ishonch hosil qiling, aks holda kirish huquqini yo‘qotasiz.
- **Serverda qo‘lda tahrirlash.** Playbook’da tasvirlanmagan hamma narsa keyingi sozlashda yo‘qoladi yoki farqlanib ketadi.

## FAQ

### Ansible Terraform’dan nimasi bilan farq qiladi?

Terraform infratuzilma yaratadi: bulutdagi serverlar, tarmoqlar, bazalar. Ansible esa allaqachon yaratilgan narsani sozlaydi: paketlar, foydalanuvchilar, konfiglar. Ular ko‘pincha birga ishlatiladi.

### Serverga biror narsa o‘rnatish kerakmi?

Agent kerak emas. SSH orqali kirish va Python kerak, u esa ko‘pchilik Linux distributivlarida allaqachon bor.

### Tayyor rollarni qayerdan olish mumkin?

Ansible Galaxy’da hamjamiyat rollari va kolleksiyalari bor. Ishlatishdan oldin ularning kodini o‘qing: rol root huquqlari bilan bajariladi.
