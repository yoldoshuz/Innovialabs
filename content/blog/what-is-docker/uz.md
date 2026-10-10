---
title: Docker nima va dasturchilarga konteynerlar nima uchun kerak
description: Docker sodda tilda: image, konteyner, Dockerfile va registry, hello-world misoli hamda konteynerlar ishlab chiqish va deploy’da hal qiladigan real muammolar.
summary: Docker ilovani barcha bog‘liqliklari bilan birga image’ga joylaydi, undan esa izolyatsiyalangan konteyner ishga tushadi. Shu sababli kod dasturchi noutbukida, CI’da va serverda bir xil ishlaydi.
---
## Qisqa javob

**Docker** — ilovani muhiti bilan birga qadoqlaydigan vosita: tilning kerakli versiyasi, kutubxonalar, tizim paketlari va sozlamalar. Bunday qadoqni Docker o‘rnatilgan istalgan mashinada ishga tushirish mumkin va u bir xil ishlaydi.

Ishga tushirilgan qadoq **konteyner** deb ataladi. Bu operatsion tizimning oddiy jarayoni, lekin izolyatsiyalangan: uning o‘z fayl tizimi, o‘z tarmog‘i va resurslar bo‘yicha o‘z cheklovlari bor.

## To‘rtta asosiy tushuncha

- **Image (obraz)** — o‘zgarmas shablon: ilova va bog‘liqliklar joylashgan fayl tizimi hamda ishga tushirish buyrug‘i. Image qatlamlardan iborat, bir xil qatlamlar esa image’lar o‘rtasida qayta ishlatiladi.
- **Container (konteyner)** — image’ning ishga tushirilgan nusxasi. Bitta image’dan istalgancha konteyner ishga tushirish mumkin.
- **Dockerfile** — image yig‘ishning matnli retsepti: qaysi bazaviy image’dan boshlash, nimani nusxalash, nimani o‘rnatish va nimani ishga tushirish.
- **Registry (reyestr)** — image’lar ombori. Ommaviy misol — Docker Hub, shuningdek GitHub, GitLab va bulutlarda xususiy reyestrlar bor. Server image’ni qayta yig‘maydi, tayyorini reyestrdan yuklab oladi.

O‘xshatish: Dockerfile — retsept, image — muzlatilgan tayyor taom, konteyner — isitilib, dasturxonga tortilgan porsiya.

## Misol: besh daqiqada hello-world

Docker o‘rnatilganini tekshirishning eng qisqa yo‘li:

```bash
docker run hello-world
```

Endi o‘z ilovangiz. `app.py` fayli:

```python
print("Hello from Docker")
```

Yonida `Dockerfile`:

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY app.py .
CMD ["python", "app.py"]
```

Image’ni yig‘amiz va konteynerni ishga tushiramiz:

```bash
docker build -t hello-app .
docker run --rm hello-app
```

Mashinaga Python o‘rnatish shart emas: kerakli versiya allaqachon image ichida. `--rm` bayrog‘i konteyner tugagach uni o‘chirib yuboradi.

Image’ni reyestrga yuborish uchun unga reyestr manzili bilan teg qo‘yiladi va `docker push` bajariladi. Serverda `docker pull` va `docker run` yetarli.

## Docker qanday muammolarni hal qiladi

- **«Menda ishlayapti».** Muhit Dockerfile’da tasvirlangan va hamma uchun bir xil: dasturchilarda, CI’da va production’da. Turli mashinalardagi turli kutubxona versiyalari endi xatolar manbai bo‘lmaydi.
- **Izolyatsiya.** Node.js yoki PostgreSQL’ning turli versiyalari kerak bo‘lgan ikki loyiha bitta serverda bemalol ishlaydi.
- **Takrorlanadigan deploy.** Serverga testlardan o‘tgan aynan o‘sha image chiqariladi. Orqaga qaytish — image’ning oldingi tegini ishga tushirish.
- **Yangi xodimning tez boshlashi.** Uzun o‘rnatish yo‘riqnomasi o‘rniga `docker compose up` — va loyiha barcha servislari bilan ishga tushadi.
- **Orkestratsiya uchun asos.** Kubernetes va boshqa platformalar aynan konteynerlar bilan ishlaydi.

## Yangi boshlovchilarning ko‘p uchraydigan xatolari

- **Ma’lumotlarni konteyner ichida saqlash.** Konteyner o‘chirilganda ular yo‘qoladi. Bazalar va yuklangan fayllar uchun volume’lardan foydalaning.
- **Production’da `latest` tegi.** Aynan qaysi versiya ishlayotgani noma’lum bo‘ladi. Aniq teglardan foydalaning, masalan versiya raqami yoki commit xeshi.
- **Image ichidagi sirlar.** Parol va kalitlar Dockerfile’ga nusxalanmaydi — ular muhit o‘zgaruvchilari yoki sirlar menejeri orqali uzatiladi.
- **Juda katta image’lar.** Slim image’lardan foydalaning, `.dockerignore` qo‘shing, kompilyatsiya qilinadigan tillar uchun esa multi-stage yig‘ishni qo‘llang.
- **Bitta konteynerda bir nechta servis.** Qoida: bitta konteyner — bitta jarayon. Baza va ilova alohida ishga tushiriladi va tarmoq orqali bog‘lanadi.

## FAQ

### Docker — bu virtual mashinami?

Yo‘q. Konteyner xost tizimining yadrosidan foydalanadi va butun OTni ishga tushirmaydi, shuning uchun tezroq ishga tushadi va kamroq resurs sarflaydi. Biroq izolyatsiyasi to‘laqonli virtual mashinanikidan kuchsizroq.

### Loyiha kichik bo‘lsa, Docker kerakmi?

Ko‘pincha ha: u muhit bilan bog‘liq muammolarni olib tashlaydi va hatto bitta servis uchun ham deploy’ni soddalashtiradi. Ammo loyiha hostingdagi statik sayt bo‘lsa, Docker ortiqcha bo‘lishi mumkin.

### Docker Docker Compose’dan nimasi bilan farq qiladi?

Docker alohida konteynerlarni ishga tushiradi. Docker Compose esa bir nechta bog‘langan servislarni (ilova, baza, kesh) bitta YAML faylda tasvirlaydi va ularni bitta buyruq bilan ko‘taradi.
