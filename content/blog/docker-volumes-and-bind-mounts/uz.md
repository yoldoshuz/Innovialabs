---
title: Docker’da volume va bind mount: konteyner ma’lumotlarini saqlash
description: Volume, bind mount va tmpfs farqi, qachon qaysi birini tanlash, huquqlar muammosi va volume bekapi, hamda konteynerdagi ma’lumotlar nega yo‘qolishi haqida.
summary: Konteyner qatlamiga yozilgan hamma narsa u o‘chirilganda yo‘qoladi. Ilova ma’lumotlari uchun named volume, ishlab chiqishda manba kodi uchun bind mount ishlating, bekapni esa alohida qiling va tiklashni tekshiring.
---

## Konteynerdagi ma’lumotlar nega yo‘qoladi

Har bir konteyner obraz ustida yupqa **yoziladigan qatlam** oladi. Ilova ulangan xotirasiz diskka yozgan hamma narsa o‘sha yerga tushadi. Konteynerni to‘xtatish ma’lumotlarni o‘chirmaydi, lekin `docker rm`, Compose orqali qayta yaratish yoki obrazni yangilashda bu qatlam fayllar bilan birga yo‘qoladi.

Shuning uchun qoida oddiy: konteynerdan uzoqroq yashashi kerak bo‘lgan hamma narsa — ma’lumotlar bazalari, yuklangan fayllar, navbatlar — yoziladigan qatlamdan **tashqarida** saqlanadi.

## Saqlashning uchta varianti

| Turi | Ma’lumotlar qayerda | Nima uchun mos |
|---|---|---|
| **Named volume** | Docker boshqaradigan hududda | Ma’lumotlar bazalari, yuklamalar, prodakshn |
| **Bind mount** | Xostdagi aniq papkada | Ishlab chiqishda manba kodi, konfiglar |
| **tmpfs** | Operativ xotirada | Saqlash shart bo‘lmagan vaqtinchalik va maxfiy ma’lumotlar |

## Named volume

```bash
docker volume create pgdata
docker run -d --name db -v pgdata:/var/lib/postgresql/data postgres:16
```

Nega volume ma’lumotlar uchun standart tanlov:

- Docker ularni o‘zi yaratadi va saqlaydi, xostdagi yo‘lni bilish shart emas.
- Linux, macOS va Windows’da bir xil ishlaydi.
- Agar bo‘sh volume’ni obrazda allaqachon fayllar bor papkaga ulasangiz, Docker birinchi foydalanishda ularni o‘sha yerga nusxalaydi.
- Konteynerlar o‘rtasida oson ko‘chiriladi va ular o‘chirilgandan keyin ham saqlanadi.

Foydali buyruqlar: `docker volume ls`, `docker volume inspect pgdata`, `docker volume rm pgdata`. `docker volume prune` bilan ehtiyot bo‘ling — u foydalanilmayotgan volume’larni ma’lumotlari bilan birga o‘chiradi.

## Bind mount

```bash
docker run -d -v "$(pwd)/src:/app/src" my-app
```

Xost papkasi konteynerga to‘g‘ridan-to‘g‘ri ulanadi: o‘zgarishlar ikkala tomonda darhol ko‘rinadi. Bu **ishlab chiqish** uchun qulay — kodni muharrirda tahrirlaysiz, konteynerdagi ilova o‘zgarishlarni ko‘radi.

Kamchiliklari:

- Muayyan kompyuterning papkalar tuzilishiga bog‘liqlik.
- Konteyner xostdagi fayllarni o‘zgartirishi yoki o‘chirishi mumkin.
- macOS va Windows’da bind mount orqali fayl amallari sekinroq ishlashi mumkin.

Konteyner faqat o‘qiydigan konfiglar uchun `:ro` qo‘shing — faqat o‘qish uchun ulash.

## Kirish huquqlari bilan muammolar

Eng ko‘p uchraydigan xato — `Permission denied`. Sababi: konteyner ichidagi jarayon bitta **UID**li foydalanuvchidan ishlaydi, xostdagi fayllar esa boshqa UID’ga tegishli. Foydalanuvchi nomlari muhim emas — raqamli identifikatorlar solishtiriladi.

Qanday hal qilish mumkin:

- Konteynerdagi jarayon UID’ini bilib oling: `docker exec <container> id`.
- Xostdagi papka egasini `chown` orqali shu UID’ga o‘rnating.
- Ishlab chiqishda konteynerni o‘z UID’ingiz bilan ishga tushirish mumkin: `--user "$(id -u):$(id -g)"`.
- O‘z Dockerfile’ingizda foydalanuvchi va ma’lumotlar papkalarini oldindan to‘g‘ri egasi bilan yarating.
- Muammoni `chmod 777` bilan hal qilmang — bu fayllarni hammaga ochib qo‘yadi.

## Volume bekapini qanday qilish kerak

Universal usul — volume tarkibini xost papkasiga arxivlaydigan vaqtinchalik konteyner:

```bash
docker run --rm \
  -v pgdata:/data:ro \
  -v "$(pwd)":/backup \
  alpine tar czf /backup/pgdata.tar.gz -C /data .
```

Yangi volume’ga tiklash:

```bash
docker run --rm \
  -v pgdata_restored:/data \
  -v "$(pwd)":/backup \
  alpine tar xzf /backup/pgdata.tar.gz -C /data
```

Ma’lumotlar bazalari uchun muhim: ishlayotgan baza fayllarining nusxasi nomuvofiq bo‘lib chiqishi mumkin. Ular uchun standart vositalar — `pg_dump`, `mysqldump` — yoki nusxalash vaqtida konteynerni to‘xtatish ishonchliroq. Eng asosiysi — bekapdan haqiqatan tiklash mumkinligini muntazam tekshiring.

## Qanday tanlash kerak

- Prodakshnda saqlanishi kerak bo‘lgan ma’lumotlar — **named volume**.
- Lokal ishlab chiqishda kod va konfiglar — **bind mount**.
- Vaqtinchalik fayllar, kesh, xotiradagi sirlar — **tmpfs**.
- Konteynerning yoziladigan qatlamida muhim hech narsa bo‘lmasin.

## FAQ

### docker compose down volume’larimni o‘chiradimi?

Yo‘q, oddiy `docker compose down` konteynerlar va tarmoqni o‘chiradi, named volume’larni esa qoldiradi. Ma’lumotlar faqat `-v` bayrog‘ini qo‘shsangiz yoki volume’ni qo‘lda o‘chirsangiz yo‘qoladi.

### Named volume’lar jismonan qayerda saqlanadi?

Linux’da odatda Docker ma’lumotlar katalogida, yo‘lni `docker volume inspect` ko‘rsatadi. Bu fayllar bilan to‘g‘ridan-to‘g‘ri ishlash tavsiya etilmaydi — konteynerlar va Docker buyruqlaridan foydalaning.

### Bitta volume’ni bir nechta konteynerga ulash mumkinmi?

Ha, lekin bir nechta jarayondan bir vaqtda yozish ilova tomonidan ko‘zda tutilgan bo‘lishi kerak. Bitta volume’da ikkita ma’lumotlar bazasini ishga tushirib bo‘lmaydi.
