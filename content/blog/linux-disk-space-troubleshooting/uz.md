---
title: "Linux’da diskda joy tugadi: uni qanday topish va bo‘shatish"
description: Linux’da diskni nima egallayotganini df, du va ncdu orqali topish, loglar, Docker va paket keshlarini tozalash, inode tanqisligi va log rotatsiyasi.
summary: df -h va df -i ni tekshiring, du yoki ncdu bilan katta papkalarni toping, eski loglar, Docker qoldiqlari va paket keshlarini tozalang, so‘ng muammo qaytmasligi uchun logrotate’ni sozlang.
---

## Qisqa javob: harakatlar tartibi

**No space left on device** xatosi ikki narsadan birini anglatadi: baytlar tugagan yoki **inode** (fayllar haqidagi yozuvlar) tugagan. Bosqichma-bosqich harakat qiling:

1. Qaysi bo‘lim to‘lganini aniqlang: `df -h`.
2. Inode’larni tekshiring: `df -i`.
3. Joyni nima egallayotganini toping: `du` yoki `ncdu`.
4. Xavfsiz tozalang: loglar, Docker, keshlar.
5. Vaziyat takrorlanmasligi uchun rotatsiyani sozlang.

`/var` yoki `/usr` dagi fayllarni tavakkal o‘chirmang — avval ular nima ekanini aniqlang.

## 1-qadam. Qaysi bo‘lim to‘lgan

```bash
df -h
```

**Use%** va **Mounted on** ustunlariga qarang. Ko‘pincha butun disk emas, alohida bo‘lim to‘lgan bo‘ladi: `/`, `/var` yoki `/boot`.

## 2-qadam. Aybdorni topish

Ildiz bo‘limdagi eng og‘ir papkalar:

```bash
sudo du -xh --max-depth=1 / | sort -rh | head -20
```

`-x` bayrog‘i boshqa bo‘limlarga o‘tishga yo‘l qo‘ymaydi. Keyin chuqurroq tushing: `/var`, `/var/log`, `/home`, `/opt`.

Interaktiv usulda qulayroq — **ncdu**:

```bash
sudo apt install ncdu   # yoki dnf install ncdu
sudo ncdu -x /
```

Papkalar bo‘ylab strelkalar bilan yurish va hajmlarni darhol ko‘rish mumkin.

Alohida katta fayllar:

```bash
sudo find / -xdev -type f -size +500M -exec ls -lh {} \;
```

## 3-qadam. Odatiy aybdorlar va ularni tozalash

**Loglar.** systemd tizim jurnali kattalashib ketishi mumkin:

```bash
journalctl --disk-usage
sudo journalctl --vacuum-size=500M
```

`/var/log` yoki loyiha papkasidagi ilova loglari: agar fayl hozir yozilayotgan bo‘lsa, uni `rm` bilan o‘chirmang, balki nolga tushiring — `sudo truncate -s 0 /var/log/app.log`.

**Docker.** Eski obrazlar, to‘xtatilgan konteynerlar, ishlatilmayotgan tomlar va build keshi:

```bash
docker system df
docker system prune
docker image prune -a
```

`--volumes` bayrog‘i ishlatilmayotgan tomlarni ham o‘chiradi — ularda baza ma’lumotlari bo‘lishi mumkin. Undan faqat ichida nima borligini aniq bilsangiz foydalaning. Konteyner loglari ham o‘sadi: ularni logging driver sozlamalarida cheklang (`max-size`, `max-file`).

**Paket keshlari:**

```bash
sudo apt clean          # Debian/Ubuntu
sudo dnf clean all      # RHEL/Fedora
```

Shuningdek, uy papkalaridagi npm, pip va CI build keshlarini, eski bekaplar va baza damplarini tekshiring.

## Fayl o‘chirildi, lekin joy bo‘shamadi

Agar jarayon ochiq ushlab turgan faylni o‘chirsangiz, joy faqat fayl yopilgandan keyin bo‘shaydi. Bunday fayllarni topish:

```bash
sudo lsof +L1
```

Ularni ushlab turgan jarayonni qayta ishga tushiring — joy qaytadi.

## Inode’lar tugadi

`df -h` bo‘sh joy borligini ko‘rsatadi, lekin fayllar yaratilmaydi — `df -i` ni tekshiring. Agar **IUse%** 100% ga yaqin bo‘lsa, sabab juda ko‘p mayda fayllarda: sessiyalar, kesh, vaqtinchalik fayllar, navbatdagi xatlar.

Eng ko‘p fayl bor papkani topish:

```bash
sudo du --inodes -x / 2>/dev/null | sort -rn | head -20
```

Keraksizini o‘chiring va sababni tuzating: masalan, eski sessiyalarni avtomatik tozalashni sozlang.

## 4-qadam. Log rotatsiyasini sozlash

**logrotate** eski loglarni jadval bo‘yicha arxivlaydi va o‘chiradi. Ilova uchun misol — `/etc/logrotate.d/myapp` fayli:

```text
/var/www/myapp/logs/*.log {
    daily
    rotate 14
    compress
    missingok
    notifempty
    copytruncate
}
```

Qo‘llamasdan tekshirish: `sudo logrotate -d /etc/logrotate.d/myapp`. journald uchun `/etc/systemd/journald.conf` da `SystemMaxUse` chegarasini belgilang.

Eng muhimi — xizmat yiqilgandan keyin emas, oldindan ogohlantiradigan **disk to‘lishi monitoringini** sozlang.

## FAQ

### /var/log dagi hamma narsani shunchaki o‘chirsa bo‘ladimi?

Yo‘q. Fayllarning bir qismi xizmatlarga kerak, ochiq loglarni o‘chirish esa joy bo‘shatmaydi. `journalctl --vacuum-*`, `truncate` va logrotate’dan foydalaning.

### docker system prune buyrug‘i xavfsizmi?

Bayroqlarsiz u to‘xtatilgan konteynerlar, ishlatilmayotgan tarmoqlar, «osilib qolgan» obrazlar va build keshini o‘chiradi. Ishlayotgan konteynerlarga tegmaydi. Tomlar faqat `--volumes` bilan o‘chiriladi, unda ehtiyot bo‘lish kerak.

### Nega disk yana tez to‘lib qoladi?

Sabab bartaraf etilmagan: log rotatsiyasi yo‘q, ilova juda batafsil log yozadi yoki bekaplar to‘planib boryapti. Faqat qo‘lda tozalash o‘rniga o‘sish manbasini toping va uni cheklang.
