---
title: SSRF hujumlari: server so‘rovlarini qalbakilashtirish qanday ishlaydi
description: «Havola orqali yuklash» funksiyasi ichki servislar va bulut metadata’sini qanday ochadi, filtrlar qanday aylanib o‘tiladi va himoya: allowlist, IMDSv2.
summary: SSRF — hujumchi serveringizni o‘zi tanlagan manzilga, masalan ichki tarmoq yoki bulut metadata servisiga so‘rov yuborishga majbur qiladigan zaiflik. Himoya qatlamli: URL allowlist, DNS’dan keyin IP tekshiruvi, chiquvchi trafikni izolyatsiya qilish va IMDSv2.
---

## SSRF nima

**SSRF (Server-Side Request Forgery)** — ilova foydalanuvchi ko‘rsatgan manzilga o‘z serveridan HTTP so‘rov yuboradigan zaiflik. Hujumchi o‘zi yeta olmaydigan, lekin server yeta oladigan manzilni qo‘yadi: `localhost`, ichki tarmoq, bulutning metadata servisi.

Server perimetr ichida joylashgan, shuning uchun undan chiqqan so‘rov firewall’dan, ko‘pincha autentifikatsiyadan ham o‘tib ketadi: ko‘p ichki servislar «ichkaridan» kelgan har qanday so‘rovga ishonadi.

## SSRF qayerda paydo bo‘ladi

URL qabul qilib, undan biror narsa yuklaydigan har qanday funksiya:

- avatar yoki rasmni havola orqali yuklash;
- chat va CMS’lardagi havola preview’lari;
- manzilini foydalanuvchi belgilaydigan webhook’lar;
- HTML’dan PDF va skrinshot yaratish (ichki brauzer sahifadagi resurslarni yuklaydi);
- tashqi URL’dan fid, RSS yoki fayllarni import qilish;
- tashqi entity’lar bilan XML parsing (XXE ko‘pincha SSRF’ga olib keladi).

## SSRF orqali nimaga yetish mumkin

| Nishon | Manzil misoli | Hujumchi nima oladi |
|---|---|---|
| Lokal servislar | `http://127.0.0.1:6379`, `http://localhost:9200` | Redis, Elasticsearch, parolsiz admin panellar |
| Ichki tarmoq | `http://10.0.0.5/admin` | ichki API’lar, CI, monitoring |
| Bulut metadata’si | `http://169.254.169.254/` | server rolining vaqtinchalik kalitlari, sozlamalar, user-data |
| Skanerlash | portlarni saralash | taymingi va xatolar bo‘yicha ichki infratuzilma xaritasi |

Eng xavfli ssenariy — **metadata endpoint**. AWS’da instance `169.254.169.254` manzilida o‘z IAM rolining vaqtinchalik hisob ma’lumotlarini oladi. Agar SSRF javobni o‘qishga imkon bersa, hujumchi kalitlarni olib ketadi va bulutda server huquqlari bilan harakat qiladi.

Javob qaytarilmaydigan **blind SSRF** ham hujumchiga foydali: tarmoqni skanerlash va biror narsani o‘zgartiradigan ichki endpoint’larni chaqirish mumkin.

## Filtrlar qanday aylanib o‘tiladi

«URL’da `localhost` va `127.0.0.1` yo‘q» degan tekshiruv ishlamaydi. Odatiy usullar:

- **IP’ning muqobil yozilishi**: `2130706433`, `0x7f000001`, `0177.0.0.1`, `127.1`, `[::1]`, `[::ffff:127.0.0.1]`.
- **Ichki IP’ga resolve bo‘ladigan domen** — hujumchining o‘z DNS’ida `127.0.0.1`ga ishora qiluvchi bitta A-yozuv yetarli.
- **DNS rebinding**: tekshiruv paytida domen tashqi IP’ga, so‘rovning o‘zida esa ichki IP’ga ishora qiladi.
- **Redirektlar**: ruxsat etilgan tashqi URL `302` bilan `http://169.254.169.254/`ga yo‘naltiradi va HTTP-mijoz unga ergashadi.
- **Parserlar farqi**: `http://allowed.com@evil.com/`, teskari slesh, fragmentlar — validator va HTTP-mijoz hostni turlicha tushunadi.
- **Boshqa sxemalar**: kutubxona qo‘llasa, `file://`, `gopher://`, `dict://`.

## Qanday himoyalanish kerak

### 1. Blocklist emas, allowlist

Eng yaxshi variant — ixtiyoriy URL’larni umuman qabul qilmaslik. Agar integratsiya aniq servislar bilan ishlasa, faqat ularning domenlari va `https` sxemasiga ruxsat bering.

### 2. Ixtiyoriy URL’lar kerak bo‘lsa

- Faqat `http` va `https` hamda standart portlarga ruxsat bering.
- DNS’ni o‘zingiz resolve qiling, olingan **barcha** IP’larni tekshiring va xususiy, loopback, link-local hamda zaxiralangan diapazonlarni rad eting.
- Nomni qayta resolve qilmasdan, aynan tekshirilgan IP’ga ulaning — bu DNS rebinding’ni yopadi.
- Avtomatik redirektlarni o‘chiring yoki har bir o‘tishni qayta tekshiring.
- Foydalanuvchiga xom javob va batafsil xatolarni qaytarmang; taymaut va hajm limitini qo‘ying.

```python
import ipaddress, socket
from urllib.parse import urlparse

def resolve_public(url: str) -> set:
    u = urlparse(url)
    if u.scheme not in ("http", "https") or not u.hostname:
        raise ValueError("bad url")
    port = u.port or (443 if u.scheme == "https" else 80)
    ips = {ipaddress.ip_address(info[4][0])
           for info in socket.getaddrinfo(u.hostname, port)}
    if not all(ip.is_global for ip in ips):
        raise ValueError("internal address")
    return ips  # keyin faqat shu manzillarga ulaning
```

### 3. Tarmoq izolyatsiyasi

Kodni aylanib o‘tish mumkin, tarmoqni — qiyinroq. Tashqi resurslarni yuklashni ichki tarmoq va metadata’ga yo‘li bo‘lmagan **alohida servis yoki egress-proksi**ga chiqaring. Security group yoki firewall darajasida chiquvchi trafik qoidalarini qo‘shing, ichki servislarni esa «tashqariga ochiq emas» bo‘lsa ham autentifikatsiya bilan yoping.

### 4. IMDSv2 va bulutdagi huquqlar

AWS’da **IMDSv2’ni required rejimida** yoqing. U avval maxsus sarlavhali `PUT` so‘rovi bilan token olishni talab qiladi, SSRF orqali oddiy `GET` buni qila olmaydi. Konteynerlar keraksiz holda metadata’ga yetmasligi uchun hop limit’ni past qoldiring va serverga minimal huquqli IAM rol bering. Boshqa bulutlarda ham metadata majburiy sarlavha bilan himoyalangan, lekin asosiy qatlam baribir tarmoq izolyatsiyasi.

Batafsil — [OWASP SSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html).

## FAQ

### Domenni regulyar ifoda bilan tekshirish yetarlimi?

Yo‘q. Domen ichki IP’ga resolve bo‘lishi mumkin, validator va HTTP-mijoz parseri esa bitta URL’ni turlicha tushunishi mumkin. Ulanish amalda boradigan yakuniy IP’ni tekshirish kerak.

### Javob foydalanuvchiga ko‘rsatilmasa, SSRF xavfsizmi?

Yo‘q. Blind SSRF ham ichki tarmoqni skanerlash va ma’lumotlarni o‘zgartiradigan ichki endpoint’larni chaqirish imkonini beradi. Oqibatlar server nimaga yeta olishiga bog‘liq.

### IMDSv2 SSRF muammosini to‘liq hal qiladimi?

Yo‘q, u faqat AWS metadata’sidan kalitlarni o‘g‘irlashni to‘xtatadi. Ichki servislar va tarmoq ochiq qoladi, shuning uchun allowlist, IP tekshiruvi va tarmoq izolyatsiyasi baribir kerak.
