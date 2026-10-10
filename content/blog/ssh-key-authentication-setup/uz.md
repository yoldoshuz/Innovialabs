---
title: Serverga SSH kalitlar orqali kirishni qanday sozlash mumkin
description: SSH kalit orqali kirishni bosqichma-bosqich sozlash: kalit yaratish, serverga nusxalash, parolni o‘chirish, ssh config va agent forwarding xavflari.
summary: ssh-keygen bilan ed25519 kalit yarating, ssh-copy-id orqali ochiq qismini serverga nusxalang, kalit bilan kirishni tekshiring va shundan keyingina sshd_config’da parol bilan kirishni o‘chiring.
---

## Qisqa javob: to‘rt qadam

Kalit orqali kirish paroldan ishonchliroq: kalitni tanlab topib bo‘lmaydi va uni har safar kiritish shart emas. Tartib quyidagicha:

1. O‘z kompyuteringizda kalitlar juftligini yarating.
2. **Ochiq kalitni** serverga joylashtiring.
3. Yangi sessiyada kalit bilan kirishni tekshiring.
4. Parol bilan kirishni o‘chiring.

Asosiy qoida: kalit bilan kirish ishlashiga ishonch hosil qilmaguningizcha **joriy SSH sessiyani yopmang**. Aks holda serverga kirish huquqini yo‘qotishingiz mumkin.

## 1-qadam. Kalit yaratish

```bash
ssh-keygen -t ed25519 -C "you@laptop"
```

- **ed25519** — zamonaviy kalit turi: qisqa, tez va ishonchli. RSA’dan faqat eski tizim ed25519’ni qo‘llab-quvvatlamasa foydalaning.
- **Passphrase** o‘rnating. Usiz kalit faylini qo‘lga kiritgan har kim serverlaringizga ham kira oladi.
- Ikki fayl paydo bo‘ladi: `~/.ssh/id_ed25519` (yopiq, hech kimga bermang) va `~/.ssh/id_ed25519.pub` (ochiq, uni istalgan joyga nusxalash mumkin).

## 2-qadam. Kalitni serverga nusxalash

Eng oddiy usul:

```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server
```

Agar `ssh-copy-id` mavjud bo‘lmasa (masalan, Windows’da), `.pub` fayl mazmunini serverdagi `~/.ssh/authorized_keys` oxiriga qo‘lda qo‘shing. Huquqlar muhim — ular juda ochiq bo‘lsa, sshd kalitni e’tiborsiz qoldiradi:

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

## 3-qadam. Tekshirish

**Yangi** terminal oching va `ssh user@server` buyrug‘ini bajaring. Agar server akkaunt parolini so‘ramasa (faqat kalit passphrase’ini, agar u o‘rnatilgan bo‘lsa), hammasi ishlayapti. Tashxis uchun `ssh -v user@server` dan foydalaning — chiqishda qaysi kalitlar taklif qilingani va nima uchun rad etilgani ko‘rinadi.

## 4-qadam. Parol bilan kirishni o‘chirish

`/etc/ssh/sshd_config` faylida (yoki `/etc/ssh/sshd_config.d/` ichidagi alohida faylda) quyidagilarni belgilang:

```text
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin prohibit-password
```

Sintaksisni tekshiring va xizmatni qayta yuklang:

```bash
sudo sshd -t && sudo systemctl reload ssh
```

Ba’zi distributivlarda xizmat `sshd` deb ataladi. E’tibor bering: `sshd_config.d/` dagi fayllar asosiy konfiguratsiyani bekor qilishi mumkin — sozlama qo‘llanmasa, ularni tekshiring.

## Bir nechta server uchun ssh config

IP, port va foydalanuvchi nomlarini yodlamaslik uchun `~/.ssh/config` yarating:

```text
Host prod
    HostName 203.0.113.10
    User deploy
    Port 2222
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes

Host staging
    HostName 203.0.113.20
    User deploy
```

Endi `ssh prod` kifoya. **IdentitiesOnly** mijozni faqat ko‘rsatilgan kalitni taklif qilishga majbur qiladi — kalitlar ko‘p bo‘lsa va server urinishlar ko‘pligi sababli ulanishni uzsa, bu yordam beradi.

## Agent forwarding: qulay, lekin xavfli

`ssh-agent` passphrase’ni qayta kiritmaslik uchun shifrlanmagan kalitlarni xotirada saqlaydi. `ForwardAgent yes` agentni masofaviy serverga uzatadi — masalan, u yerda o‘z kalitingiz bilan `git pull` qilish uchun.

Xavf: siz ulangan paytda **o‘sha serverdagi root yoki buzg‘unchi** agentingizdan foydalanib, sizning nomingizdan boshqa xostlarga kira oladi. Shuning uchun:

- `ForwardAgent` ni global yoqmang, faqat aniq ishonchli xostlar uchun;
- oraliq server orqali o‘tish uchun **ProxyJump** (`ssh -J bastion target`) dan foydalaning — u agentni oraliq xostga bermaydi;
- serverdan deploy qilish uchun repozitoriyga faqat o‘qish huquqi bilan alohida **deploy key** bering.

## Ko‘p uchraydigan xatolar

- Kalitni tekshirmasdan parollarni o‘chirib, kirish huquqini yo‘qotish.
- `~/.ssh` yoki uy papkasidagi noto‘g‘ri huquqlar.
- Barcha serverlar va barcha dasturchilar uchun passphrase’siz bitta kalit.
- Ishdan ketgan xodimlarning kalitlarini `authorized_keys` dan o‘chirmaslik.

## FAQ

### Barcha serverlar uchun bitta kalitdan foydalansa bo‘ladimi?

Texnik jihatdan ha, shaxsiy foydalanish uchun bu normal. Ammo jamoada har bir kishining o‘z kaliti bo‘lgani yaxshi — shunda kirish huquqini alohida bekor qilish mumkin.

### Yopiq kalitni yo‘qotib qo‘ysam nima qilish kerak?

Serverga boshqa yo‘l bilan kiring (boshqa kalit yoki hosting konsoli orqali), eski ochiq kalitni `authorized_keys` dan o‘chiring va yangisini qo‘shing.

### Standart 22-portni o‘zgartirish kerakmi?

Bu loglardagi avtomatik skanerlar shovqinini kamaytiradi, lekin haqiqiy himoyaning o‘rnini bosmaydi. Asosiy xavfsizlik — kalitlar, o‘chirilgan parollar va xohlasangiz fail2ban yoki IP bo‘yicha cheklov.
