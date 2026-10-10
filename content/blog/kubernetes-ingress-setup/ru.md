---
title: Ingress в Kubernetes: как направить внешний трафик в сервисы
description: Чем Ingress отличается от LoadBalancer и NodePort, как установить ingress-nginx, настроить маршрутизацию по домену и пути и подключить TLS через cert-manager.
summary: Ingress — это единая точка входа HTTP(S)-трафика, которая по домену и пути распределяет запросы между сервисами; для работы нужен Ingress-контроллер (например, ingress-nginx), а сертификаты удобно выпускать через cert-manager.
---

## Короткий ответ

**Ingress** — это правила маршрутизации HTTP и HTTPS: «запросы на `shop.example.com` отправлять в сервис `web`, а `/api` — в сервис `api`». Сам объект Ingress ничего не делает: его исполняет **Ingress-контроллер**, чаще всего ingress-nginx. Контроллер получает один внешний адрес, а дальше распределяет трафик по сервисам. TLS-сертификаты автоматически выпускает и продлевает **cert-manager**.

## NodePort, LoadBalancer или Ingress

| Способ | Как работает | Когда подходит |
|---|---|---|
| **NodePort** | Открывает порт на каждой ноде | Тесты, локальные кластеры, нестандартные протоколы |
| **LoadBalancer** | Облако выдаёт отдельный внешний балансировщик на сервис | Один сервис или TCP/UDP-трафик |
| **Ingress** | Один вход, маршрутизация по домену и пути | Несколько HTTP-сервисов за одним адресом |

Ingress экономит балансировщики и собирает TLS, редиректы и маршрутизацию в одном месте. При этом сам контроллер обычно публикуется наружу через Service типа LoadBalancer (в облаке) или NodePort (на своих серверах).

## Установка ingress-nginx

Удобнее всего через Helm:

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace
kubectl get svc -n ingress-nginx
```

В выводе найдите **EXTERNAL-IP** контроллера и направьте на него DNS-записи ваших доменов.

## Маршрутизация по домену и пути

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

Что важно:

- **ingressClassName** указывает, какой контроллер обрабатывает правило. Без него Ingress может просто игнорироваться.
- **pathType: Prefix** совпадает с путём и всеми вложенными, `Exact` — только с точным путём.
- Ingress ссылается на **Service**, а не на поды, и должен находиться в том же namespace, что и сервисы.

## TLS через cert-manager

cert-manager получает сертификаты, например, от Let's Encrypt и сам их продлевает.

```bash
helm repo add jetstack https://charts.jetstack.io
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager --create-namespace --set crds.enabled=true
```

Затем создайте **ClusterIssuer**:

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

И добавьте в Ingress аннотацию и блок `tls`:

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

Проверить выпуск можно командой `kubectl get certificate` — статус Ready должен стать True.

## Частые ошибки

- DNS ещё не указывает на контроллер — HTTP-01 проверка не проходит, сертификат не выпускается.
- Не указан `ingressClassName` или выбран не тот класс.
- Ingress в одном namespace, а Service — в другом.
- Приложение ожидает путь без префикса `/api`, а Ingress передаёт его как есть. Решается настройкой приложения или rewrite-аннотациями контроллера.

## FAQ

### Можно ли обойтись без Ingress?

Да, если у вас один сервис — хватит Service типа LoadBalancer. Ingress становится выгоден, когда за одним адресом несколько доменов или сервисов.

### Чем Ingress отличается от Gateway API?

Gateway API — более новый и гибкий стандарт маршрутизации в Kubernetes с разделением ролей. Ingress проще и поддерживается практически везде; для типичного веб-проекта его достаточно.

### Нужно ли вручную продлевать сертификаты?

Нет. cert-manager отслеживает срок действия и продлевает сертификаты заранее, обновляя Secret, который использует Ingress.
