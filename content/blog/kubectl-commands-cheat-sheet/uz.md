---
title: kubectl shpargalkasi: har kuni kerak bo‘ladigan buyruqlar
description: Vazifalar bo‘yicha asosiy kubectl buyruqlari: resurslarni ko‘rish, loglar, exec, port-forward, masshtablash, rollout, kontekst va namespace’lar misollar bilan.
summary: Kubernetes bilan kundalik ishning deyarli hammasi o‘nga yaqin kubectl buyrug‘iga sig‘adi: get, describe, logs, exec, port-forward, scale, rollout hamda kontekst va namespace’ni almashtirish.
---
## Har kuni qaysi kubectl buyruqlari kerak

Klaster bilan kundalik ish uchun kichik to‘plam yetarli: holatni ko‘rish uchun **get** va **describe**, muammoni tekshirish uchun **logs** va **exec**, servisga lokal ulanish uchun **port-forward**, deployni boshqarish uchun **scale** va **rollout**, klasterlar orasida almashish uchun **config**. Quyida ular vazifalar bo‘yicha guruhlangan.

## Resurslarni ko‘rish

```bash
kubectl get pods                      # joriy namespace’dagi podlar
kubectl get pods -A                   # barcha namespace’lardagi podlar
kubectl get pods -o wide              # node va IP bilan
kubectl get deploy,svc,ingress        # bir nechta tur birdaniga
kubectl get pods -l app=api           # label bo‘yicha filtr
kubectl get pod api-7d9f -o yaml      # to‘liq manifest
kubectl describe pod api-7d9f         # tafsilotlar va hodisalar
kubectl get events --sort-by=.metadata.creationTimestamp
```

Pod ishga tushmasa, birinchi navbatda **describe** ni ishlating: Events bo‘limida image yuklanmagani, resurs yetmagani yoki proba yiqilgani ko‘rinadi.

## Loglar

```bash
kubectl logs api-7d9f                 # pod loglari
kubectl logs -f api-7d9f              # real vaqtda kuzatish
kubectl logs api-7d9f -c worker       # aniq konteyner
kubectl logs api-7d9f --previous      # yiqilgan nusxaning loglari
kubectl logs deploy/api --tail=100    # deploy podining oxirgi qatorlari
kubectl logs -l app=api --since=10m   # label bo‘yicha, oxirgi 10 daqiqa
```

**--previous** flagi CrashLoopBackOff holatida juda kerak: joriy konteyner hozirgina qayta ishga tushgan, yiqilish sababi esa oldingisining loglarida qolgan.

## Exec va pod ichida tekshirish

```bash
kubectl exec -it api-7d9f -- sh       # interaktiv shell
kubectl exec api-7d9f -- env          # bitta buyruq
kubectl exec -it api-7d9f -c worker -- sh
```

Agar image’da shell bo‘lmasa (distroless image’lar), alohida debug konteyner bilan **kubectl debug** dan foydalaning.

## Port-forward

```bash
kubectl port-forward pod/api-7d9f 8080:3000
kubectl port-forward svc/postgres 5432:5432
```

Shu tarzda ma’lumotlar bazasi yoki ichki servisni tashqariga chiqarmasdan o‘z kompyuteringizda ochishingiz mumkin. Ulanish buyruq ishlab turgan vaqtgacha yashaydi.

## Masshtablash va rollout

```bash
kubectl scale deploy/api --replicas=3
kubectl rollout status deploy/api     # deploy tugashini kutish
kubectl rollout history deploy/api    # reviziyalar tarixi
kubectl rollout undo deploy/api       # oldingi reviziyaga qaytish
kubectl rollout restart deploy/api    # manifestni o‘zgartirmasdan podlarni qayta ishga tushirish
kubectl set image deploy/api api=registry/api:1.4.2
```

**rollout restart** muhit o‘zgaruvchilari sifatida ulangan Secret yoki ConfigMap yangilangandan keyin qulay: odatiy RollingUpdate strategiyasida podlar navbat bilan, to‘xtab qolmasdan qayta yaratiladi.

## Kontekstlar va namespace’lar

```bash
kubectl config get-contexts           # klasterlar ro‘yxati
kubectl config current-context
kubectl config use-context prod
kubectl config set-context --current --namespace=backend
kubectl get ns
```

`set-context` qatori har bir buyruqqa `-n backend` yozishdan qutqaradi.

## Manifestlarni qo‘llash va o‘chirish

```bash
kubectl apply -f k8s/                 # papkani qo‘llash
kubectl diff -f k8s/                  # nima o‘zgarishini ko‘rish
kubectl delete -f k8s/job.yaml
kubectl top pods                      # CPU va xotira (metrics-server kerak)
```

## Ko‘p uchraydigan xatolar

- **Noto‘g‘ri kontekstda ishlash.** Xavfli buyruqlardan oldin `current-context` ni tekshiring, ayniqsa yonida prod sozlangan bo‘lsa.
- **Namespace’ni unutish.** `get pods` bo‘sh chiqsa, ko‘pincha siz noto‘g‘ri joyga qarayapsiz.
- **Jonli resurslarni edit orqali tahrirlash.** `kubectl edit` tajriba uchun qulay, lekin repozitoriydan keyingi `apply` da o‘zgarishlar yo‘qoladi.
- **Sababni tuzatish o‘rniga podni o‘chirish.** Deployment boshqaradigan pod xuddi shu xato bilan qayta yaratiladi.

## FAQ

### kubectl apply va kubectl create o‘rtasida qanday farq bor?

`create` resurs yaratadi va u allaqachon mavjud bo‘lsa xato beradi. `apply` deklarativ ishlaydi: resursni fayldagi holatga keltirib yaratadi yoki yangilaydi, shuning uchun CI/CD va Git’da saqlanadigan manifestlar uchun mos.

### Pod nega ishga tushmayotganini qanday tez bilish mumkin?

`kubectl describe pod <nom>` ni ishga tushirib, pastdagi Events’ni o‘qing, konteyner allaqachon yiqilgan bo‘lsa, `kubectl logs <nom> --previous` ni bajaring.

### Uzun buyruqlarni qisqartirish mumkinmi?

Ha. Ko‘pchilik `k=kubectl` alias’ini o‘rnatadi va resurslarning qisqa nomlaridan foydalanadi: `po`, `deploy`, `svc`, `ns`. Shell avtoto‘ldirishni yoqish ham foydali, bu haqda rasmiy kubectl hujjatlarida yozilgan.
