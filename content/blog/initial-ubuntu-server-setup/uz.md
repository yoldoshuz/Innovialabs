---
title: Production uchun Ubuntu serverni dastlabki sozlash: chek-list
description: Yangi Ubuntu server uchun birinchi soat chek-listi: yangilanishlar, sudo foydalanuvchi, kalit orqali SSH, ufw, vaqt zonasi, swap, fail2ban va avtoyangilanish.
summary: Yangi serverda tizimni yangilang, SSH kalit bilan kiradigan sudo foydalanuvchi yarating, root va parol bilan kirishni yoping, ufw’ni yoqing, vaqtni sozlang, swap qo‘shing, fail2ban va xavfsizlik avtoyangilanishlarini o‘rnating.
---
## Qisqa javob

Ochiq IP’li yangi serverni deyarli darhol skanerlay boshlashadi. Shuning uchun ilovani o‘rnatishdan oldin bazaviy chek-listdan o‘ting:

1. Paketlarni yangilash.
2. SSH kalit orqali kiradigan sudo foydalanuvchi yaratish.
3. Root va parol bilan kirishni taqiqlash.
4. **ufw** firewall’ni yoqish.
5. Vaqt zonasi va vaqt sinxronizatsiyasini sozlash.
6. Xotira kam bo‘lsa, swap qo‘shish.
7. **fail2ban** va **unattended-upgrades** o‘rnatish.
8. Bazaviy dasturlarni o‘rnatish.

Quyidagi buyruqlar Ubuntu’ning amaldagi LTS versiyalari uchun.

## 1. Yangilanishlar

```bash
apt update && apt upgrade -y
reboot   # agar yadro yangilangan bo‘lsa
```

## 2. Sudo foydalanuvchi

Doim root ostida ishlash xavfli: har qanday xato to‘liq huquqlar bilan bajariladi.

```bash
adduser deploy
usermod -aG sudo deploy
```

Ochiq kalitingizni serverga nusxalang (lokal kompyuterdan):

```bash
ssh-copy-id deploy@SERVER_IP
```

SSH sozlamalarini o‘zgartirishdan oldin **yangi foydalanuvchi bilan kirishni alohida oynada tekshiring**.

## 3. SSH himoyasi

`/etc/ssh/sshd_config` (yoki `/etc/ssh/sshd_config.d/` ichidagi fayl)da quyidagilarni belgilang:

```text
PermitRootLogin no
PasswordAuthentication no
```

So‘ng `sudo systemctl restart ssh`. SSH portini o‘zgartirish loglardagi shovqinni kamaytiradi, lekin kalit orqali kirishning o‘rnini bosmaydi.

## 4. ufw firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80,443/tcp
sudo ufw enable
sudo ufw status
```

Avval SSH’ga ruxsat bering, keyin ufw’ni yoqing — aks holda kirish imkonini yo‘qotishingiz mumkin. Ma’lumotlar bazasi va ichki servislarni tashqariga ochmang.

E’tibor bering: **Docker portlarni ufw qoidalarini chetlab o‘tib nashr qiladi**. Docker ishlatsangiz, portlarni `127.0.0.1`ga bog‘lang yoki filtrlashni alohida sozlang.

## 5. Vaqt

```bash
sudo timedatectl set-timezone Asia/Tashkent
timedatectl
```

Vaqt sinxronizatsiyasi faol ekanini tekshiring. Ko‘p jamoalar turli tizimlar loglari mos kelishi uchun serverlarni UTC’da saqlaydi — bitta variantni tanlang va unga amal qiling.

## 6. Swap

RAM kam bo‘lgan serverlarda swap xotira cho‘qqilarida jarayonlar o‘chib qolishidan saqlaydi:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

Hajmini yuklamaga qarab tanlang. Swap — sug‘urta, xotiraning o‘rnini bosmaydi.

## 7. fail2ban va avtoyangilanishlar

```bash
sudo apt install -y fail2ban unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

**fail2ban** bir qator muvaffaqiyatsiz kirish urinishlaridan keyin IP’ni bloklaydi. **unattended-upgrades** xavfsizlik yangilanishlarini avtomatik o‘rnatadi.

## 8. Bazaviy dasturlar

Odatiy to‘plam: `git`, `curl`, `htop`, reverse proxy sifatida nginx, Docker yoki kerakli runtime, HTTPS uchun certbot. Faqat haqiqatan ishlatiladigan narsani o‘rnating.

## Ko‘p uchraydigan xatolar

- Kalit orqali kirishni tekshirmasdan parol bilan kirishni o‘chirish.
- SSH qoidasisiz ufw’ni yoqish.
- Ma’lumotlar bazasi portini internetga ochish.
- Backup va disk monitoringini sozlamaslik — joy tugaguncha server «ishlayveradi».

## FAQ

### Standart SSH portini o‘zgartirish kerakmi?

Bu majburiy emas. Port o‘zgarsa, loglardagi avtomatik kirish urinishlari kamayadi, lekin haqiqiy himoyani faqat kalit orqali kirish, root taqiqi va fail2ban beradi.

### Avtoyangilanishlar ilovani buzib qo‘ymaydimi?

Standart holatda unattended-upgrades faqat xavfsizlik yangilanishlarini o‘rnatadi, shuning uchun xavf kichik. Yadro yangilanganda qayta yuklashni avtomatik qilmasdan, qo‘lda rejalashtirish mumkin.

### Bu chek-listni avtomatlashtirish mumkinmi?

Ha. Uni server yaratishda cloud-init skripti yoki Ansible roli sifatida rasmiylashtirish qulay — shunda har bir yangi server bir xil sozlanadi.
