---
title: Ilovani Kubernetes’ga qanday deploy qilish: bosqichma-bosqich
description: Bosqichma-bosqich: Docker image’dan Kubernetes’da ishlaydigan Deployment va Service’gacha, ConfigMap va Secret, tekshirish va versiyani yangilash.
summary: Image’ni registry’ga joylang, Deployment, Service va konfiguratsiyani YAML’da tasvirlang, kubectl apply bilan qo‘llang, rollout status’ni tekshiring va ilovani image tegini almashtirib yangilang.
---

## Qisqa javob

Kubernetes’ga deploy — bu kerakli holatni deklarativ tasvirlash. Siz konteynerlarni qo‘lda ishga tushirmaysiz, balki klasterga aytasiz: «shu image’ning 3 nusxasini ishlatib tur va ularga manzil ber». Minimal yo‘l:

1. Image’ni yig‘ib, **container registry**’ga yuborish.
2. **Deployment**’ni tasvirlash — qaysi image va nechta replika.
3. **Service**’ni tasvirlash — pod’lar uchun barqaror manzil.
4. Sozlamalarni **ConfigMap** va **Secret**’ga chiqarish.
5. `kubectl apply` bajarib, holatni tekshirish.

## 1-qadam. Image registry’da

Klaster image’ni o‘zi yuklab oladi, shuning uchun u ochiq registry’da turishi kerak (Docker Hub, GitHub Container Registry, bulutli yoki o‘zingizniki).

```bash
docker build -t registry.example.com/shop/api:1.0.0 .
docker push registry.example.com/shop/api:1.0.0
```

`latest` emas, **aniq versiya tegidan** foydalaning: shunda aynan nima ishlayotgani ma’lum bo‘ladi va orqaga qaytish mumkin.

## 2-qadam. Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: registry.example.com/shop/api:1.0.0
          ports:
            - containerPort: 8080
          envFrom:
            - configMapRef:
                name: api-config
            - secretRef:
                name: api-secrets
          readinessProbe:
            httpGet:
              path: /health
              port: 8080
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              memory: 256Mi
```

Asosiy jihatlar:

- **labels va selector** mos kelishi kerak — Deployment o‘z pod’larini ular orqali topadi.
- **readinessProbe** ilova tayyor bo‘lmaguncha pod’ga trafik yubormaydi.
- **resources** rejalashtiruvchiga yordam beradi va node’ni ochko‘z konteynerdan himoya qiladi. Qiymatlarni ilovangizga moslang.

## 3-qadam. Service

Pod’lar qayta yaratiladi va IP’sini o‘zgartiradi. Service ularga klaster ichida doimiy nom beradi:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api
spec:
  selector:
    app: api
  ports:
    - port: 80
      targetPort: 8080
```

Boshqa servislar ilovaga `http://api` manzili orqali murojaat qiladi. Tashqi kirish uchun odatda Ingress qo‘shiladi.

## 4-qadam. Konfiguratsiya

```bash
kubectl create configmap api-config --from-literal=LOG_LEVEL=info
kubectl create secret generic api-secrets --from-literal=DB_PASSWORD=change-me
```

Maxfiy ma’lumotlarni image’da va Git’da ochiq holda saqlamang. GitOps yondashuvida shifrlangan secret’lar yoki tashqi saqlash tizimlari ishlatiladi.

## 5-qadam. Qo‘llash va tekshirish

```bash
kubectl apply -f deployment.yaml -f service.yaml
kubectl rollout status deployment/api
kubectl get pods -l app=api
kubectl logs deployment/api
```

Agar pod ishga tushmasa, `kubectl describe pod <name>` dan boshlang — Events bo‘limida `ImagePullBackOff` (image’ga kirish yo‘q) yoki `CrashLoopBackOff` (ilova ishga tushishda qulaydi) kabi xatolar ko‘rinadi.

## Yangilash va orqaga qaytarish

Yangi versiyani chiqarish uchun YAML’dagi image tegini o‘zgartiring va yana `kubectl apply` bajaring. Standart holatda Deployment **rolling update** qiladi: readinessProbe’ga tayangan holda yangi pod’larni ko‘taradi va eskilarini asta-sekin olib tashlaydi.

```bash
kubectl rollout history deployment/api
kubectl rollout undo deployment/api
```

## Keng tarqalgan xatolar

- `latest` tegi — qaysi versiya ishlayotgani noma’lum, orqaga qaytish esa tavakkalga aylanadi.
- readinessProbe yo‘q — yangilanish paytida trafik hali tayyor bo‘lmagan pod’larga boradi.
- `kubectl edit` orqali qo‘lda o‘zgartirib, YAML’ga kiritmaslik — Git va klasterdagi konfiguratsiya farqlanib ketadi.
- Yopiq registry uchun `imagePullSecrets` yo‘qligi.

## FAQ

### Birinchi deploy uchun Helm kerakmi?

Yo‘q. Bitta ilova uchun oddiy YAML-manifestlar va `kubectl apply` yetarli. Helm bir nechta muhit va ko‘p takrorlanuvchi parametrlar paydo bo‘lganda foydali.

### Deployment pod’dan nimasi bilan farq qiladi?

Pod — bitta ishlab turgan nusxa. Deployment kerakli miqdordagi pod’lar doim ishlashini kuzatadi, qulaganlarini qayta yaratadi va yangilanishlarni boshqaradi.

### Ilovani brauzerda qanday ochish mumkin?

Tezkor tekshiruv uchun `kubectl port-forward service/api 8080:80` yetarli. Doimiy tashqi kirish uchun Ingress yoki LoadBalancer turidagi Service sozlanadi.
