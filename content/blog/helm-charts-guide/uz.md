---
title: Helm: Kubernetes’da ilovalarni qanday paketlash va o‘rnatish
description: Helm-chart qanday tuzilgan, values va shablonlar qanday ishlaydi, ochiq chart’larni o‘rnatish, o‘z chart’ingizni yaratish hamda reliz, yangilash va rollback.
summary: Helm — Kubernetes uchun paket menejeri: chart manifest shablonlarini values.yaml’dagi sozlamalar bilan birlashtiradi, install, upgrade va rollback buyruqlari esa o‘rnatilgan ilova versiyalarini reliz sifatida boshqaradi.
---

## Qisqa javob

**Helm** Kubernetes-manifestlar to‘plamini **chart**’ga — parametrli ilova shabloniga — paketlaydi. Chart bitta buyruq bilan o‘rnatiladi, muhitlar o‘rtasidagi farqlar (replikalar, domenlar, resurslar) esa **values** faylida beriladi. Har bir o‘rnatish — versiyalar tarixiga ega **reliz**, shuning uchun yangilash va orqaga qaytarish bitta buyruq bilan bajariladi.

Helm bitta ilovani bir nechta muhitga joylashtirish kerak bo‘lganda yoki tayyor dasturlarni — ma’lumotlar bazalari, monitoring, Ingress-kontrollerlarni — o‘rnatganda foydali.

## Chart tuzilishi

```text
mychart/
  Chart.yaml          # nom, chart versiyasi va ilova versiyasi
  values.yaml         # standart parametrlar
  templates/          # manifest shablonlari
    deployment.yaml
    service.yaml
    _helpers.tpl      # umumiy shablon bo‘laklari
  charts/             # bog‘liqliklar
```

- `Chart.yaml` dagi **version** — chart’ning o‘z versiyasi, **appVersion** — ichidagi ilova versiyasi.
- `templates/` dagi hamma narsa oddiy YAML-manifestlarga render qilinadi.

## Values va shablonlar

Shablonlar Go templates sintaksisidan foydalanadi. Qiymatlar `values.yaml` dan olinadi:

```yaml
# values.yaml
replicaCount: 2
image:
  repository: registry.example.com/shop/api
  tag: "1.0.0"
```

```yaml
# templates/deployment.yaml (parcha)
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
        - name: api
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
```

Har bir muhit uchun alohida fayl yaratiladi, masalan `values-prod.yaml`, va o‘rnatishda uzatiladi. Alohida qiymatlarni `--set` bayrog‘i bilan almashtirish mumkin, lekin doimiy sozlamalar uchun fayl qulayroq: u Git’da saqlanadi.

## Ochiq chart’larni o‘rnatish

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm search repo redis
helm show values bitnami/redis > redis-values.yaml
helm install cache bitnami/redis -f redis-values.yaml -n data --create-namespace
```

O‘rnatishdan oldin **standart values’ni ko‘rib chiqing**: unda nima yoqilgani, qanday resurslar so‘ralayotgani va ma’lumotlarni saqlash qanday sozlangani ko‘rinadi.

## O‘z chart’ingiz

```bash
helm create mychart
helm lint mychart
helm template mychart -f values-prod.yaml
helm install api ./mychart -f values-prod.yaml -n shop
```

- `helm create` tayyor andoza yaratadi, undan odatda ortiqchasi olib tashlanadi.
- `helm lint` tuzilmadagi xatolarni topadi.
- `helm template` o‘rnatmasdan yakuniy manifestlarni ko‘rsatadi — bu debug uchun asosiy vosita.

## Relizlar, yangilash va rollback

```bash
helm upgrade api ./mychart -f values-prod.yaml -n shop
helm upgrade --install api ./mychart -f values-prod.yaml -n shop
helm history api -n shop
helm rollback api 3 -n shop
helm uninstall api -n shop
```

- `upgrade --install` CI/CD’da qulay: reliz bo‘lmasa o‘rnatadi, bo‘lsa yangilaydi.
- `rollback` tarixdagi kerakli reviziya konfiguratsiyasini qaytaradi.
- `--atomic` bayrog‘i muvaffaqiyatsiz yangilanishni avtomatik orqaga qaytaradi.

## Keng tarqalgan xatolar

- Parollarni to‘g‘ridan-to‘g‘ri Git’dagi `values.yaml` da saqlash. Secret, shifrlangan values yoki tashqi saqlash tizimidan foydalaning.
- Ochiq chart’ni versiyasini qotirmasdan (`--version`) o‘rnatish — keyingi o‘rnatishda boshqa versiya kelishi mumkin.
- Reliz resurslarini `kubectl edit` orqali o‘zgartirish — keyingi `helm upgrade` bu o‘zgarishlarni ustidan yozib yuboradi.
- Shablonlarni o‘qib bo‘lmaydigan darajada shartlar bilan to‘ldirish. Agar chart ilovaning o‘zidan murakkab bo‘lsa, uni soddalashtirish kerak.

## FAQ

### Helm Kustomize’dan nimasi bilan farq qiladi?

Helm shablonlar va parametrlar bilan ishlaydi hamda relizlarni boshqaradi. Kustomize esa shablonsiz oddiy YAML ustiga patch qo‘llaydi. Ularni birga ishlatish mumkin, tanlov jamoaga nimani qo‘llab-quvvatlash qulayroq ekaniga bog‘liq.

### O‘z chart’larimni qayerda saqlash kerak?

Ilova bilan bir repozitoriyda yoki alohida repozitoriyda. Tarqatish uchun Helm-repozitoriylar va OCI-registry’lar mos keladi, ko‘plab container registry’lar ularni allaqachon qo‘llab-quvvatlaydi.

### Upgrade nimani o‘zgartirishini oldindan ko‘rish mumkinmi?

Ha. `helm template` natijasini joriy manifestlar bilan solishtiring yoki yangilashdan oldin farqni ko‘rsatadigan helm-diff plaginidan foydalaning.
