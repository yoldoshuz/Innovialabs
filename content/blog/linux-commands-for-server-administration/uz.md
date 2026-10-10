---
title: Serverni boshqarish uchun asosiy Linux buyruqlari
description: Server uchun amaliy Linux shpargalkasi: fayllar, jarayonlar, tarmoq, loglar, paketlar va foydalanuvchilar — vazifalar bo‘yicha guruhlangan, misollar bilan.
summary: Server bilan kundalik ishlash uchun yigirmatacha buyruq yetarli: fayllar uchun ls, df, du, jarayonlar uchun ps, top, systemctl, tarmoq uchun ss, curl, loglar uchun journalctl, tail, paketlar uchun apt yoki dnf va huquqlar uchun adduser, chmod.
---
## Birinchi navbatda qaysi buyruqlar kerak

Serverni ishonchli boshqarish uchun yuzlab buyruqlarni bilish shart emas. Vazifalar bo‘yicha guruhlangan asosiy to‘plam yetarli: **fayllar va disk**, **jarayonlar va servislar**, **tarmoq**, **loglar**, **paketlar**, **foydalanuvchilar va huquqlar**. Quyida aynan shu to‘plam, to‘g‘ridan-to‘g‘ri ishga tushirsa bo‘ladigan misollar bilan. Misollar systemd’li distributivlar (Ubuntu, Debian, RHEL oilasi) uchun.

## Fayllar va disk

| Buyruq | Nima qiladi |
|---|---|
| `ls -lah` | Huquqlar, hajmlar va yashirin fayllar bilan ro‘yxat |
| `cd`, `pwd` | Katalogga o‘tish, joriy katalogni ko‘rsatish |
| `cp -r`, `mv`, `rm -r` | Nusxalash, ko‘chirish, o‘chirish |
| `find / -name "*.log"` | Fayllarni nomi bo‘yicha qidirish |
| `df -h` | Disklardagi bo‘sh joy |
| `du -sh /var/*` | Har bir katalog hajmi |

Odatiy holat — “disk to‘lib qoldi”. Ketma-ketlik:

```bash
df -h                          # qaysi bo‘lim to‘lgan
sudo du -sh /var/* | sort -h   # ichida eng ko‘p joyni nima egallagan
```

**`rm -rf` bilan ehtiyot bo‘ling**: savatsiz va tasdiqsiz o‘chiradi. O‘chirishdan oldin yo‘lni `ls` bilan tekshiring.

## Jarayonlar va servislar

- `top` yoki `htop` — CPU va xotira yuklamasi real vaqtda.
- `ps aux | grep nginx` — jarayonni nomi bo‘yicha topish.
- `kill PID` — jarayonni to‘g‘ri yakunlash; `kill -9 PID` — majburan, faqat oddiy usul yordam bermasa.
- `systemctl status nginx` — servis holati.
- `systemctl restart nginx` — qayta ishga tushirish; `reload` — servis qo‘llab-quvvatlasa, to‘xtatmasdan konfigni qayta o‘qish.
- `systemctl enable nginx` — yuklanishda avtomatik ishga tushirish.
- `free -h` va `uptime` — xotira va o‘rtacha yuklama.

## Tarmoq

```bash
ip a                           # interfeyslarning IP manzillari
ss -tulpn                      # qaysi portlar tinglanmoqda va qaysi jarayon
curl -I https://example.com    # sayt javobi sarlavhalari
ping -c 4 8.8.8.8              # aloqa bormi
dig example.com                # domenning DNS yozuvlari
```

`ss -tulpn` — servis “javob bermayotganda” asosiy buyruq: u ishlayaptimi va qaysi portda — darhol ko‘rinadi. Eski muqobili `netstat` ko‘p distributivlarda endi standart o‘rnatilmagan.

Ubuntu’da firewall uchun ko‘pincha `ufw` ishlatiladi: `sudo ufw status`, `sudo ufw allow 443/tcp`. Firewall’ni yoqishdan oldin albatta SSH’ga ruxsat bering, aks holda kirish huquqini yo‘qotasiz.

## Loglar

- `journalctl -u nginx -n 100` — servis logining oxirgi 100 qatori.
- `journalctl -u nginx -f` — logni real vaqtda kuzatish.
- `journalctl --since "1 hour ago"` — oxirgi bir soatdagi hodisalar.
- `tail -f /var/log/nginx/error.log` — fayllarga yoziladigan loglar.
- `grep -i "error" /var/log/syslog` — matn bo‘yicha qidirish.
- `less fayl` — katta fayllarni `/` orqali qidiruv bilan qulay ko‘rish.

Qoida: har qanday muammoda **avval loglar**, keyin qayta ishga tushirish.

## Paketlar

| Vazifa | Debian/Ubuntu | RHEL/Rocky/Alma |
|---|---|---|
| Ro‘yxatni yangilash | `sudo apt update` | `sudo dnf check-update` |
| Tizimni yangilash | `sudo apt upgrade` | `sudo dnf upgrade` |
| Paket o‘rnatish | `sudo apt install nginx` | `sudo dnf install nginx` |
| Paketni o‘chirish | `sudo apt remove nginx` | `sudo dnf remove nginx` |

Tizimni muntazam yangilang, lekin production’da — tekshiruvdan keyin va orqaga qaytarish rejasi bilan.

## Foydalanuvchilar va huquqlar

```bash
sudo adduser deploy                    # foydalanuvchi yaratish (Debian/Ubuntu)
sudo usermod -aG sudo deploy           # sudo huquqini berish
sudo chown -R deploy:deploy /srv/app   # egasini o‘zgartirish
chmod 640 config.env                   # egasi o‘qiydi va yozadi, guruh o‘qiydi
id deploy                              # foydalanuvchi guruhlari
```

`chmod` huquqlari uchta raqam bilan yoziladi: egasi, guruh, qolganlar. 4 — o‘qish, 2 — yozish, 1 — bajarish. **`chmod 777` qo‘ymang** — bu faylni hammaga ochib qo‘yadi.

## Ko‘p uchraydigan xatolar

- **Doim root ostida ishlash.** Oddiy foydalanuvchi va `sudo`’dan foydalaning.
- **Diagnostika o‘rniga serverni qayta yuklash.** Muammo qaytadi, foydali holat esa yo‘qoladi.
- **Konfigni tekshirmasdan tahrirlash.** nginx uchun `nginx -t` bor, boshqa ko‘p servislarda ham shunga o‘xshash tekshiruvlar mavjud.
- **Diskdagi joyni kuzatmaslik.** Loglar bilan to‘lgan bo‘lim ma’lumotlar bazalari va ilovalarni buzadi.

## FAQ

### Serverni boshqarish uchun vim’ni o‘rganish kerakmi?
Asoslarini bilish foydali, chunki u deyarli hamma joyda bor. Boshlash uchun `nano` ham yetadi — u soddaroq va ko‘pincha standart o‘rnatilgan.

### restart va reload’ning farqi nima?
`restart` servisni to‘xtatib, qayta ishga tushiradi va joriy ulanishlarni uzadi. `reload` to‘xtatmasdan konfiguratsiyani qayta o‘qiydi, lekin faqat buni qo‘llab-quvvatlaydigan servislarda ishlaydi.

### Notanish buyruq nima qilishini qanday bilsa bo‘ladi?
`man buyruq` yoki `buyruq --help` ni ishga tushiring. Bu to‘g‘ridan-to‘g‘ri serverdagi rasmiy ma’lumotnoma.
