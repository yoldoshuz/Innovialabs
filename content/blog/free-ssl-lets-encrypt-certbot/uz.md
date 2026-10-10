---
title: Let’s Encrypt bepul SSL sertifikatini qanday olish mumkin
description: Let’s Encrypt bepul SSL sertifikatini hosting paneli yoki Certbot orqali chiqarish, avtomatik yangilashni sozlash va yangilash haqiqatan ishlashini tekshirish.
summary: Hosting panelida Let’s Encrypt tugmasini bosing yoki serverda certbot’ni ishga tushiring, so‘ng avtomatik yangilash yoqilganini tekshiring, certbot renew --dry-run bajaring va tashqi monitoringni ulang.
---
## Qisqa javob

**Let’s Encrypt** — DV sertifikatlar beradigan bepul sertifikatlash markazi: ular domenni siz boshqarayotganingizni tasdiqlaydi. HTTPS shifrlash uchun ular pulliklaridan qolishmaydi.

Ikki yo‘l bor:

- **Hosting paneli** (cPanel, Plesk, ISPmanager va boshqalar) — sertifikat tugma bilan chiqariladi va yangilanadi.
- **Certbot** o‘z serveringizda (VPS, ajratilgan server) — sertifikatni oladigan, veb-serverga o‘rnatadigan va yangilaydigan rasmiy mijoz.

Let’s Encrypt sertifikatlari **qisqa muddatli**: hozir 90 kun, loyiha esa bu muddatni yanada qisqartirishni rejalashtirmoqda. Shuning uchun asosiysi chiqarish emas, balki **avtomatik yangilash** va uning ishlashini tekshirish.

## Oldindan nimani tayyorlash kerak

- Domen allaqachon serverga ishora qiladi: A yozuvi (IPv6 bo‘lsa, AAAA ham) kerakli IP’ga olib boradi.
- Faervolda **80-port ochiq** — standart HTTP tekshiruvi shu port orqali o‘tadi.
- Agar domenda **AAAA yozuvi** bo‘lsa, IPv6 orqali ham xuddi shu server javob berishi kerak: Let’s Encrypt bu manzilni ham tekshiradi.
- Agar **CAA yozuvlari** bo‘lsa, ular orasida `letsencrypt.org` bo‘lishi kerak.

## 1-variant: hosting paneli orqali

1. «SSL/TLS» yoki «Sertifikatlar» bo‘limini oching.
2. Let’s Encrypt’ni tanlang, domen va `www`ni belgilang.
3. Panel taklif qilsa, HTTP’dan HTTPS’ga yo‘naltirishni yoqing.

Yangilashni panel o‘zi bajaradi. Sizning vazifangiz — bir necha oyda bir marta tugash sanasi siljiyotganini tekshirish va `/.well-known/acme-challenge/` yo‘li uchun xizmat qoidalarini o‘chirmaslik.

## 2-variant: Nginx’li serverda Certbot

Certbot’ni certbot.eff.org saytidagi operatsion tizimingiz va veb-serveringiz uchun rasmiy yo‘riqnoma bo‘yicha o‘rnating. Debian va Ubuntu’da bu shunday ko‘rinishi mumkin:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d example.com -d www.example.com
```

Certbot domenni tekshiradi, sertifikatni oladi, uni Nginx konfiguratsiyasiga yozadi va HTTPS’ga yo‘naltirishni sozlashni taklif qiladi. Apache uchun `--apache` plaginidan foydalaning.

Agar veb-serveringiz boshqa bo‘lsa yoki konfiguratsiyani o‘zingiz tahrirlamoqchi bo‘lsangiz, faqat sertifikatni oling:

```bash
sudo certbot certonly --webroot -w /var/www/example -d example.com -d www.example.com
```

Fayllar `/etc/letsencrypt/live/example.com/` papkasida bo‘ladi. Server konfiguratsiyasida `cert.pem` emas, **`fullchain.pem`** (zanjirli sertifikat) va `privkey.pem`dan foydalaning.

## Avtomatik yangilash

Certbot paketlari odatda `certbot renew`ni muntazam ishga tushiradigan systemd taymeri yoki cron vazifasini o‘zi yaratadi. U faqat muddati tugashiga yaqin sertifikatlarni yangilaydi. Tekshiring:

```bash
systemctl list-timers | grep certbot
sudo certbot renew --dry-run
```

`--dry-run` butun jarayonni test serverida bajaradi va hech narsani o‘zgartirmaydi. Taymer bo‘lmasa, cron vazifasini qo‘lda qo‘shing.

`certonly` rejimida veb-server yangi sertifikatni o‘zi qayta o‘qimaydi. **Deploy-hook** qo‘shing — Certbot muvaffaqiyatli yangilashdan keyin ishga tushiradigan skript:

```bash
sudo tee /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh <<'EOF'
#!/bin/sh
systemctl reload nginx
EOF
sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh
```

## Yangilash haqiqatan ishlayotganini qanday tekshirish

Muvaffaqiyatli `--dry-run` sayt yangi sertifikatni berayotganini kafolatlamaydi. Uch narsani tekshiring:

1. **Certbot nimani biladi:** `sudo certbot certificates` tugash sanasini ko‘rsatadi.
2. **Server nimani beradi:**

```bash
echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null | openssl x509 -noout -enddate
```

   Agar 1 va 2-banddagi sanalar farq qilsa, server yangilashdan keyin qayta yuklanmagan.

3. **Tashqi monitoring.** Let’s Encrypt endi sertifikat muddati tugashi haqida xat yubormaydi, shuning uchun tugashga oz kun qolganda ogohlantiradigan SSL tekshiruvli monitoring xizmatini ulang.

## Ko‘p uchraydigan xatolar

- **80-port yopiq** yoki yo‘naltirish yoki himoya qoidasi `/.well-known/acme-challenge/`ni bloklaydi — tekshiruv o‘tmaydi.
- **`fullchain.pem` o‘rniga `cert.pem` ishlatilgan** — kompyuter brauzerida hammasi ishlaydi, ammo ba’zi qurilmalar va API mijozlarida zanjir xatosi chiqadi.
- **Certbot ikki marta o‘rnatilgan** (paketdan va snap’dan) — biri yangilaydi, siz esa boshqasini tekshirasiz.
- **Ishchi serverda ko‘p marta sinash** — Let’s Encrypt limitlariga urilish mumkin. Tajribalar uchun `--dry-run` yoki `--staging`dan foydalaning.

## FAQ

### Bepul sertifikat pullikdan yomonroqmi?
Shifrlash bir xil. Pullik sertifikatlar tekshiruv turi (OV va EV tashkilotni tasdiqlaydi), amal qilish muddati, qo‘llab-quvvatlash va kafolat majburiyatlari bilan farq qiladi. Ko‘pchilik saytlar uchun Let’s Encrypt’ning DV sertifikati yetarli.

### Wildcard sertifikat olish mumkinmi?
Ha, lekin faqat DNS tekshiruvi orqali: `_acme-challenge` TXT yozuvini qo‘lda yoki DNS provayderingiz API’si uchun plagin yordamida yaratasiz.

### Nega Certbot domenni tekshira olmayapti?
Ko‘pincha domen hali boshqa IP’ga ishora qiladi, 80-port yopiq, AAAA yozuvi boshqa serverga olib boradi yoki CAA yozuvi Let’s Encrypt’ga ruxsat bermaydi. Certbot xato matni odatda sababni to‘g‘ridan-to‘g‘ri ko‘rsatadi.
