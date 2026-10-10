---
title: Linux serverda SSH’ni qanday himoyalash kerak
description: SSH’ni amaliy sozlash: kalit orqali kirish, root va parolni taqiqlash, alohida foydalanuvchi, fail2ban, firewall, ikkinchi omil va kirishlar auditi.
summary: Xavfsiz SSH — sudo huquqli alohida foydalanuvchi ostida faqat kalit orqali kirish, root va parol bilan kirishni taqiqlash, parol tanlashga qarshi fail2ban, kirishni cheklaydigan firewall va loglarni muntazam ko‘rib chiqish. Muhim serverlar uchun ikkinchi omil, masalan apparat kalit qo‘shing.
---

## Avvalo nima qilish kerak

22-port ochiq bo‘lgan har qanday serverga botlar doimiy ravishda kirishga urinadi. Himoyaning minimal to‘plami:

1. **Faqat SSH-kalitlar** orqali kirish.
2. **root uchun** va parol bilan kirishni taqiqlash.
3. `sudo` huquqli alohida foydalanuvchi.
4. Parol tanlashga qarshi **fail2ban** yoki uning analogi.
5. Imkon bo‘lsa, SSH’ni faqat kerakli manzillarga ochadigan **firewall**.

Sozlashdagi asosiy qoida: yangi terminal oynasida kirishni tekshirmaguningizcha **joriy sessiyani yopmang**. Aks holda serverga kirish huquqini osongina yo‘qotib qo‘yasiz.

## 1-bosqich. Alohida foydalanuvchi va kalitlar

Serverda foydalanuvchi yarating va unga `sudo` huquqini bering (buyruq distributivga bog‘liq — masalan, Debian/Ubuntu’da `sudo` guruhi yoki RHEL’ga o‘xshash tizimlarda `wheel`).

O‘z kompyuteringizda kalit yarating va ochiq qismini serverga nusxalang:

```bash
ssh-keygen -t ed25519 -C "laptop-work"
ssh-copy-id deploy@your-server
```

Maxfiy kalitni **parol iborasi** bilan himoyalang — shunda o‘g‘irlangan kalit fayli o‘zi foydasiz bo‘ladi. Har bir qurilma uchun alohida kalit yaratgan ma’qul: noutbuk yo‘qolsa, `authorized_keys` faylidan bitta qator o‘chiriladi.

## 2-bosqich. sshd’ni sozlash

`/etc/ssh/sshd_config` faylini oching (yoki distributiv uni ulasa, `/etc/ssh/sshd_config.d/` ichida fayl yarating) va quyidagilarni belgilang:

```text
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
AllowUsers deploy
MaxAuthTries 3
```

Sintaksisni tekshiring va konfiguratsiyani qayta yuklang:

```bash
sudo sshd -t && sudo systemctl reload ssh
```

Ba’zi distributivlarda xizmat `sshd` deb ataladi. Qayta yuklagandan keyin **yangi** oyna oching va kalit bilan kira olishingizga ishonch hosil qiling.

**Portni** 22 dan boshqasiga **o‘zgartirish** loglardagi shovqinni kamaytiradi, lekin himoya emas: skanerlar SSH’ni istalgan portda topadi. Xohlasangiz qiling, lekin boshqa qadamlar o‘rniga emas.

## 3-bosqich. fail2ban

**fail2ban** loglarni o‘qiydi va bir necha muvaffaqiyatsiz urinishdan keyin IP’ni vaqtincha bloklaydi. `/etc/fail2ban/jail.local` faylidagi minimal sozlama:

```ini
[sshd]
enabled = true
maxretry = 5
findtime = 10m
bantime = 1h
```

Holat va bloklangan manzillar:

```bash
sudo fail2ban-client status sshd
```

Faqat kalit orqali kirishda parol tanlash allaqachon befoyda, lekin fail2ban yuklama va loglardagi shovqinni kamaytiradi.

## 4-bosqich. Firewall

Keraksiz hamma narsani yoping va imkon bo‘lsa, SSH’ni ishonchli manzillar bilan cheklang. `ufw` uchun misol:

```bash
sudo ufw default deny incoming
sudo ufw allow from 203.0.113.10 to any port 22 proto tcp
sudo ufw allow 80,443/tcp
sudo ufw enable
```

Doimiy IP bo‘lmasa, **VPN** yoki **bastion-server** (jump host) ishlating: SSH faqat unga ochiq, u esa alohida puxta himoyalangan. Ko‘plab bulutli provayderlar tarmoq filtrlari (security groups) ham beradi — bu server oldidagi qo‘shimcha qatlam.

## 5-bosqich. Ikkinchi omil

Muhim serverlar uchun 2FA qo‘shing. Ikki keng tarqalgan variant:

| Variant | Qanday ishlaydi | Xususiyatlari |
|---|---|---|
| Apparat kalit (FIDO2) | `ed25519-sk` turidagi kalit, jismoniy token kerak | Sozlash oson, kalit fayli o‘g‘irlanishidan himoya |
| PAM orqali TOTP | Kalit va autentifikator ilovasidagi kod | PAM va `AuthenticationMethods` sozlanishi kerak |

Apparat kalit quyidagicha yaratiladi:

```bash
ssh-keygen -t ed25519-sk
```

TOTP varianti uchun distributivingiz yo‘riqnomasiga amal qiling va sinov paytida ishlaydigan sessiyani albatta ochiq qoldiring.

## 6-bosqich. Kirishlar auditi

Kim va qayerdan kirayotganini muntazam ko‘rib turing:

```bash
sudo journalctl -u ssh --since "24 hours ago"
last -n 20
sudo lastb -n 20
```

Nimani tekshirish kerak:

- notanish IP’lardan muvaffaqiyatli kirishlar;
- foydalanuvchilarning `~/.ssh/authorized_keys` faylidagi yangi qatorlar;
- sudo huquqli yangi foydalanuvchilar paydo bo‘lishi.

Bir nechta server bo‘lsa, loglarni markazlashgan tizimga yuborish va ogohlantirishlarni sozlash qulayroq.

## FAQ

### SSH portini o‘zgartirish kerakmi?

Bu majburiy emas. Portni o‘zgartirish avtomatik urinishlarni kamaytiradi, lekin maqsadli skanerlashdan himoya qilmaydi. Kalitlar, parollarni taqiqlash va firewall muhimroq.

### Maxfiy kalitni yo‘qotib qo‘ysam nima qilaman?

Boshqa qurilmadan yoki xosting provayderi konsoli orqali kiring, eski kalitni `authorized_keys`dan o‘chiring va yangisini qo‘shing. Shuning uchun kamida ikkita kalit va provayder paneli orqali favqulodda kirish imkoniga ega bo‘lish foydali.

### Qulaylik uchun parol bilan kirishni qoldirsa bo‘ladimi?

Yaxshisi yo‘q. Turli qurilmalardan kirish noqulay bo‘lsa, har bir qurilma uchun kalit yarating — bu ham tez, ham ancha xavfsiz.
