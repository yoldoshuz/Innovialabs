---
title: Kubernetes’da Pod, Deployment va Service: misollar bilan tushuntirish
description: Kubernetes’ning asosiy obyektlari minimal YAML misollarida: Pod, Deployment va Service nima va ilovani ishga tushirish uchun ular qanday bog‘lanadi.
summary: Pod — ishlab turgan konteyner, Deployment kerakli sondagi podlar doim ishlashini va to‘xtovsiz yangilanishini ta’minlaydi, Service esa ularga doimiy manzil beradi. Ular metkalar (labels) va selektorlar orqali bog‘lanadi.
---
## Qisqa javob

Kubernetes’da ilovani ishga tushirish uchun odatda uchta obyekt kerak:

- **Pod** — ishga tushirishning eng kichik birligi: umumiy tarmoqqa ega bir yoki bir nechta konteyner.
- **Deployment** — nechta pod kerakligini va qaysi obrazdan ekanini tasvirlaydi hamda shu holatni saqlab turadi.
- **Service** — podlar guruhi uchun barqaror manzil va balanslovchi.

Ular o‘rtasidagi bog‘liqlik **metkalar (labels)** orqali ta’minlanadi: Deployment `app: web` metkali podlarni yaratadi, Service esa shu metkali barcha podlarga trafik yuboradi.

## Pod: konteyner yashaydigan joy

Pod — konteyner atrofidagi qobiq. Bitta poddagi konteynerlar IP-manzilni bo‘lishadi va `localhost` orqali muloqot qila oladi. Ko‘pincha podda bitta konteyner bo‘ladi.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: web
  labels:
    app: web
spec:
  containers:
    - name: web
      image: nginx:1.27
      ports:
        - containerPort: 80
```

Asosiy xususiyat: **podlar vaqtinchalik**. Agar pod tushib qolsa yoki noda ishdan chiqsa, bu pod o‘z-o‘zidan tiklanmaydi, yangisi esa boshqa IP oladi. Shuning uchun podlar deyarli hech qachon qo‘lda yaratilmaydi — bu bilan Deployment shug‘ullanadi.

## Deployment: nechta nusxa va qaysi versiya

Deployment aytadi: «shu shablon bo‘yicha uchta podni ushlab tur». Pod yo‘qolsa, Deployment o‘rniga yangisini yaratadi. Obraz o‘zgartirilsa, u eski podlarni asta-sekin yangilari bilan almashtiradi.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: web
          image: nginx:1.27
          ports:
            - containerPort: 80
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              memory: 256Mi
```

Bu yerda nima muhim:

- `replicas` — kerakli podlar soni.
- `selector.matchLabels` `template.metadata.labels` bilan mos kelishi shart, aks holda Deployment qabul qilinmaydi.
- `template` — pod shabloni, aslida yuqoridagi misoldagi Pod’ning o‘zi.
- `resources` rejalashtiruvchiga podlarni joylashtirishda yordam beradi va nodani ortiqcha yuklamadan himoya qiladi.

Ichkarida Deployment **ReplicaSet** yaratadi, u esa podlar sonini bevosita kuzatadi. ReplicaSet bilan to‘g‘ridan-to‘g‘ri ishlash odatda shart emas.

## Service: doimiy manzil

Podlarning IP’lari o‘zgaradi, shuning uchun ularga to‘g‘ridan-to‘g‘ri murojaat qilib bo‘lmaydi. Service klaster ichida doimiy nom va IP oladi hamda so‘rovlarni mos podlar o‘rtasida taqsimlaydi.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web
spec:
  selector:
    app: web
  ports:
    - port: 80
      targetPort: 80
  type: ClusterIP
```

Endi shu namespace’dagi boshqa podlar ilovaga `http://web` manzili orqali murojaat qiladi.

Service’ning asosiy turlari:

| Tur | Kirish | Qachon ishlatish |
|---|---|---|
| ClusterIP | faqat klaster ichida | servislararo aloqa, standart tur |
| NodePort | har bir nodadagi port | testlar, oddiy o‘rnatishlar |
| LoadBalancer | bulutning tashqi balanslovchisi | bulutda ommaviy kirish |

Domenli HTTP saytlar uchun odatda **Ingress** qo‘shiladi — u so‘rovlarni domen va yo‘l bo‘yicha kerakli Service’ga yo‘naltiradi.

## Hammasi birgalikda qanday ishlaydi

1. Fayllarni qo‘llaysiz: `kubectl apply -f deployment.yaml -f service.yaml`.
2. Deployment ReplicaSet yaratadi, u esa `app: web` metkali uchta pod yaratadi.
3. Scheduler podlarni nodalarga taqsimlaydi.
4. Service `app: web` selektori orqali podlarni topadi va ularga trafik yubora boshlaydi.
5. Pod tushdi — Deployment yangisini yaratadi, Service uni avtomatik ravishda balanslashga qo‘shadi.

Tekshirish uchun foydali buyruqlar:

```bash
kubectl get pods -l app=web
kubectl describe deployment web
kubectl get endpoints web
kubectl rollout status deployment/web
```

## Keng tarqalgan xatolar

- **Metkalar mos kelmaydi.** Service selektori podlarni topmaydi — `kubectl get endpoints` bo‘sh ro‘yxat ko‘rsatadi.
- **`port` va `targetPort` almashib ketgan.** `port` — Service porti, `targetPort` — konteyner porti.
- **Deployment’siz podlar.** Qo‘lda yaratilgan pod noda ishdan chiqishiga bardosh bermaydi.
- **Readiness probe yo‘q.** Service hali so‘rov qabul qilishga tayyor bo‘lmagan podga trafik yuborishi mumkin.
- **`latest` tegi.** Qaysi versiya ishlayotganini tushunish va orqaga qaytish qiyin.

Batafsil — [Kubernetes hujjatlarida](https://kubernetes.io/docs/concepts/workloads/).

## FAQ

### Konteyner bo‘lsa, Pod nima uchun kerak?

Pod umumiy tarmoq va xotiraga ega, bir-biri bilan chambarchas bog‘liq konteynerlarni birlashtirishga imkon beradi, masalan, ilova va loglar uchun yordamchi jarayon. Kubernetes aynan podlarni rejalashtiradi va masshtablaydi.

### Deployment StatefulSet’dan nimasi bilan farq qiladi?

Deployment podlar bir-birining o‘rnini bosa oladigan holatsiz ilovalar uchun mos. StatefulSet esa har bir nusxaga doimiy nom va alohida xotira kerak bo‘lganda, masalan, ma’lumotlar bazalari uchun ishlatiladi.

### Ilovani internetga qanday ochish mumkin?

Bulutda — LoadBalancer turidagi Service yoki HTTP uchun kontrollerli Ingress orqali. Bitta manzil ortida bir nechta domen yoki yo‘lga xizmat ko‘rsatish kerak bo‘lsa, Ingress qulayroq.
