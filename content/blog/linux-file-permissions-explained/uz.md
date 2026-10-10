---
title: Linuxda kirish huquqlari: chmod, chown va foydalanuvchilar
description: Linuxda kirish huquqlari qanday ishlaydi: r, w, x bitlari, raqamli va belgili yozuv, egalar va guruhlar hamda veb-ilova kataloglari uchun xavfsiz sozlama.
summary: Linuxdagi har bir faylning egasi, guruhi va ega, guruh hamda boshqalar uchun uchta huquq to‘plami (o‘qish, yozish, bajarish) bor; chmod huquqlarni, chown esa egasini o‘zgartiradi.
---
## Qisqa javob

Linuxda har bir fayl va katalogning **egasi** (foydalanuvchi), **guruhi** va uchta huquq to‘plami bor:

- **u (user)** — egasining huquqlari;
- **g (group)** — guruh a’zolarining huquqlari;
- **o (others)** — qolgan barcha foydalanuvchilarning huquqlari.

Har bir to‘plamda uchta bit bor: **r** (read, o‘qish), **w** (write, yozish), **x** (execute, bajarish). Ularni `ls -l` buyrug‘i bilan ko‘rish mumkin:

```bash
$ ls -l
-rw-r--r-- 1 deploy www-data  512 app.conf
drwxr-x--- 2 deploy www-data 4096 storage
```

Birinchi belgi — tur (`-` fayl, `d` katalog), keyin uchta uchlik keladi: ega, guruh, boshqalar. Bu yerda `deploy` — ega, `www-data` — guruh.

## Fayl va katalog uchun r, w, x nimani anglatadi

Bitlar fayl va katalogda turlicha ishlaydi va chalkashlikning asosiy sababi aynan shu.

| Bit | Fayl | Katalog |
|---|---|---|
| r | mazmunini o‘qish | ichidagi fayllar ro‘yxatini ko‘rish |
| w | mazmunini o‘zgartirish | ichida fayl yaratish, o‘chirish, nomini o‘zgartirish |
| x | dastur sifatida ishga tushirish | katalogga kirish va fayllarga nom orqali murojaat qilish |

Bundan kelib chiqadigan muhim xulosalar:

- Katalogda **x** bo‘lmasa, fayl o‘qilishi mumkin bo‘lsa ham, uni ochib bo‘lmaydi.
- Faylni o‘chirish faylning emas, **katalogning** huquqlariga (w + x) bog‘liq.
- Veb-server `/var/www/app/public/index.html` faylini o‘qishi uchun yo‘ldagi har bir katalogda **x** kerak.

## Raqamli va belgili yozuv

**Raqamli (sakkizlik)** yozuvda bitlar og‘irligi qo‘shiladi: r = 4, w = 2, x = 1. Har bir to‘plam uchun bitta raqam.

| Raqam | Huquqlar | Odatiy qo‘llanilishi |
|---|---|---|
| 644 | rw-r--r-- | oddiy fayllar, maxfiy ma’lumotsiz konfiglar |
| 640 | rw-r----- | xizmat guruhi o‘qiydigan konfiglar |
| 600 | rw------- | maxfiy kalitlar, `.env` |
| 755 | rwxr-xr-x | kataloglar, bajariladigan skriptlar |
| 750 | rwxr-x--- | begonalardan yopilgan kataloglar |

```bash
chmod 640 .env
chmod 755 deploy.sh
```

**Belgili** yozuv qolganlariga tegmasdan bitta bitni o‘zgartirish kerak bo‘lganda qulay:

```bash
chmod u+x deploy.sh      # egasiga bajarish huquqini qo‘shish
chmod g-w config.yml     # guruhdan yozish huquqini olish
chmod o= secret.key      # boshqalardan barcha huquqlarni olish
chmod -R g+rX storage    # X faqat kataloglarga (va bajariladigan fayllarga) x qo‘yadi
```

## Egalar va guruhlar: chown va chgrp

- `chown deploy file` — egasini o‘zgartirish;
- `chown deploy:www-data file` — egasi va guruhini o‘zgartirish;
- `chgrp www-data file` — faqat guruhini o‘zgartirish;
- `-R` — butun katalog uchun rekursiv.

Foydalanuvchini guruhga qo‘shish: `sudo usermod -aG www-data deploy`. `-a` bayrog‘i majburiy, aks holda foydalanuvchi boshqa guruhlaridan chiqib ketadi. Guruh o‘zgarishlari tizimga qayta kirgandan keyin kuchga kiradi.

## Veb-ilova uchun odatiy sxema

Maqsad: kodni faqat deploy foydalanuvchisi o‘zgartiradi, veb-server yoki PHP-FPM uni o‘qiydi, ilova esa faqat maxsus kataloglarga yozadi.

```bash
# ega — deploy foydalanuvchisi, guruh — veb-server foydalanuvchisi
sudo chown -R deploy:www-data /var/www/app

# kataloglar 750, fayllar 640
sudo find /var/www/app -type d -exec chmod 750 {} \;
sudo find /var/www/app -type f -exec chmod 640 {} \;

# ilova yozadigan kataloglar (yuklamalar, kesh, loglar)
sudo chmod -R g+w /var/www/app/storage

# maxfiy ma’lumotlarni faqat ega va guruh o‘qiydi
sudo chmod 640 /var/www/app/.env
```

Mantiq oddiy: veb-server jarayoni guruhga kiradi, shuning uchun kodni o‘qiy oladi, lekin o‘zgartira olmaydi. Agar ilovadagi zaiflik orqali buzib kirishsa, hujumchi manba kodini qayta yoza olmaydi.

Foydalanuvchi nomlari distributivga bog‘liq: Debian va Ubuntuda odatda `www-data`, RHEL asosidagi tizimlarda `nginx` yoki `apache`.

## Ko‘p uchraydigan xatolar

- **`chmod 777`** bilan kirish xatosini «tuzatish». Bu tizimdagi barcha foydalanuvchilarga yozish huquqini beradi. Qaysi jarayon qaysi foydalanuvchi nomidan ishlayotganini aniqlang va huquqni faqat unga bering.
- **Hamma narsaga `chmod -R 755`**, natijada barcha fayllar bajariladigan bo‘lib qoladi. Fayl va kataloglar huquqlarini `find` orqali alohida bering.
- **root nomidan deploy qilish.** Fayllar root egaligiga o‘tadi va ilova keshga yoza olmay qoladi.
- **Maxfiy SSH kaliti 644 huquq bilan.** OpenSSH undan foydalanishni rad etadi, 600 kerak.
- **Ota katalogda x unutilgan**, shu sababli fayl huquqlari to‘g‘ri bo‘lsa ham nginx 403 qaytaradi.

## FAQ

### umask nima?
Bu yangi yaratilgan fayllarning standart huquqlarini belgilaydigan niqob. Keng tarqalgan `022` qiymati fayllarga 644, kataloglarga 755 beradi; `027` esa yangi fayllarni boshqalardan yopadi. Joriy qiymatni `umask` buyrug‘i ko‘rsatadi.

### setuid, setgid va sticky bit nima?
Bular maxsus bitlar. Katalogdagi **setgid** yangi fayllarning katalog guruhini meros qilib olishini ta’minlaydi, bu umumiy papkalar uchun qulay. **Sticky bit** (`/tmp` dagi kabi) boshqalarning fayllarini o‘chirishni taqiqlaydi. **setuid** dasturni uning egasi huquqlari bilan ishga tushiradi, o‘z skriptlaringizda undan foydalanmagan ma’qul.

### Nega Docker konteyneri ichida huquq xatolari chiqadi?
Chunki huquqlar nomlar bo‘yicha emas, raqamli UID va GID bo‘yicha tekshiriladi. Agar konteynerdagi jarayon UID raqami xostdagi ulangan katalog egasiga mos kelmasa, yozish taqiqlanadi. UID larni moslashtiring yoki katalog egasini oldindan belgilang.
