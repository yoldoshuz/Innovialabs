---
title: Kubernetes’da Ingress: tashqi trafikni servislarga yo‘naltirish
description: Ingress LoadBalancer va NodePort’dan nimasi bilan farq qiladi, ingress-nginx’ni o‘rnatish, domen va yo‘l bo‘yicha marshrutlash hamda cert-manager orqali TLS.
summary: Ingress — HTTP(S) trafik uchun yagona kirish nuqtasi bo‘lib, so‘rovlarni domen va yo‘l bo‘yicha servislarga taqsimlaydi; u Ingress-kontroller (masalan, ingress-nginx) talab qiladi, sertifikatlarni esa cert-manager chiqaradi.
---

## Qisqa javob

**Ingress** — HTTP va HTTPS marshrutlash qoidalari: «`shop.example.com` ga kelgan so‘rovlarni `web` servisiga, `/api` ni esa `api` servisiga yubor». Ingress obyektining o‘zi hech narsa qilmaydi: uni **Ingress-kontroller** bajaradi, ko‘pincha bu ingress-nginx. Kontroller bitta tashqi manzil oladi va trafikni servislar o‘rtasida taqsimlaydi. TLS-sertifikatlarni **cert-manager** avtomatik chiqaradi va yangilaydi.

## NodePort, LoadBalancer yoki Ingress

| Usul | Qanday ishlaydi | Qachon mos |
|---|---|---|
| **NodePort** | Har bir node’da port ochadi | Testlar, lokal klasterlar, nostandart protokollar |
| **LoadBalancer** | Bulut har bir servis uchun alohida tashqi balanser beradi | Bitta servis yoki TCP/UDP trafik |
| **Ingress** | Bitta kirish, domen va yo‘l bo‘yicha marshrutlash | Bitta manzil ortidagi bir nechta HTTP-servis |

Ingress balanserlarni tejaydi va TLS, redirect hamda marshrutlashni bir joyda jamlaydi. Kontrollerning o‘zi odatda tashqariga LoadBalancer turidagi Service (bulutda) yoki NodePort (o‘z serverlaringizda) orqali chiqariladi.

## ingress-nginx’ni o‘rnatish

Eng qulayi — Helm orqali:

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace
kubectl get svc -n ingress-nginx
```

Natijada kontrollerning **EXTERNAL-IP** manzilini toping va domenlaringizning DNS-yozuvlarini unga yo‘naltiring.

## Domen va yo‘l bo‘yicha marshrutlash

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: shop
spec:
  ingressClassName: nginx
  rules:
    - host: shop.example.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api
                port:
                  number: 80
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web
                port:
                  number: 80
```

Muhim jihatlar:

- **ingressClassName** qoidani qaysi kontroller bajarishini ko‘rsatadi. Usiz Ingress shunchaki e’tiborsiz qolishi mumkin.
- **pathType: Prefix** yo‘l va uning ichidagi barcha yo‘llarga mos keladi, `Exact` — faqat aniq yo‘lga.
- Ingress pod’larga emas, **Service**’ga ishora qiladi va servislar bilan bir namespace’da bo‘lishi kerak.

## cert-manager orqali TLS

cert-manager sertifikatlarni, masalan, Let’s Encrypt’dan oladi va ularni o‘zi yangilaydi.

```bash
helm repo add jetstack https://charts.jetstack.io
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager --create-namespace --set crds.enabled=true
```

So‘ng **ClusterIssuer** yarating:

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@example.com
    privateKeySecretRef:
      name: letsencrypt-key
    solvers:
      - http01:
          ingress:
            ingressClassName: nginx
```

Va Ingress’ga annotatsiya hamda `tls` blokini qo‘shing:

```yaml
metadata:
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt
spec:
  tls:
    - hosts:
        - shop.example.com
      secretName: shop-tls
```

Sertifikat chiqarilganini `kubectl get certificate` buyrug‘i bilan tekshirish mumkin — Ready holati True bo‘lishi kerak.

## Keng tarqalgan xatolar

- DNS hali kontrollerga yo‘naltirilmagan — HTTP-01 tekshiruvi o‘tmaydi, sertifikat chiqarilmaydi.
- `ingressClassName` ko‘rsatilmagan yoki noto‘g‘ri klass tanlangan.
- Ingress bir namespace’da, Service esa boshqasida.
- Ilova `/api` prefiksisiz yo‘lni kutadi, Ingress esa uni o‘zgartirmasdan uzatadi. Bu ilovani sozlash yoki kontrollerning rewrite-annotatsiyalari bilan hal qilinadi.

## FAQ

### Ingress’siz ishlash mumkinmi?

Ha, agar sizda bitta servis bo‘lsa, LoadBalancer turidagi Service yetarli. Ingress bitta manzil ortida bir nechta domen yoki servis bo‘lganda foydali bo‘ladi.

### Ingress Gateway API’dan nimasi bilan farq qiladi?

Gateway API — Kubernetes’dagi rollar ajratilgan, yangiroq va moslashuvchanroq marshrutlash standarti. Ingress soddaroq va deyarli hamma joyda qo‘llab-quvvatlanadi; odatiy veb-loyiha uchun u yetarli.

### Sertifikatlarni qo‘lda yangilash kerakmi?

Yo‘q. cert-manager amal qilish muddatini kuzatadi va sertifikatlarni oldindan yangilab, Ingress ishlatadigan Secret’ni yangilaydi.
