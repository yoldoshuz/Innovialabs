---
title: Как задеплоить приложение в Kubernetes: пошаговая инструкция
description: Пошагово: от Docker-образа до работающих Deployment и Service в Kubernetes, конфигурация через ConfigMap и Secret, проверка и обновление версии.
summary: Опубликуйте образ в registry, опишите Deployment, Service и конфигурацию в YAML, примените их через kubectl apply, проверьте rollout status и обновляйте приложение сменой тега образа.
---

## Короткий ответ

Деплой в Kubernetes — это декларативное описание желаемого состояния. Вы не запускаете контейнеры руками, а говорите кластеру: «держи 3 копии этого образа и открой к ним доступ». Минимальный путь:

1. Собрать образ и отправить его в **container registry**.
2. Описать **Deployment** — какой образ и сколько реплик.
3. Описать **Service** — стабильный адрес для подов.
4. Вынести настройки в **ConfigMap** и **Secret**.
5. Выполнить `kubectl apply` и проверить статус.

## Шаг 1. Образ в registry

Кластер скачивает образ сам, поэтому он должен лежать в доступном registry (Docker Hub, GitHub Container Registry, облачный или собственный).

```bash
docker build -t registry.example.com/shop/api:1.0.0 .
docker push registry.example.com/shop/api:1.0.0
```

Используйте **конкретный тег версии**, а не `latest`: так понятно, что именно запущено, и можно откатиться.

## Шаг 2. Deployment

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

Ключевые моменты:

- **labels и selector** должны совпадать — по ним Deployment находит свои поды.
- **readinessProbe** не пускает трафик на под, пока приложение не готово.
- **resources** помогают планировщику и защищают ноду от прожорливого контейнера. Значения подбирайте под своё приложение.

## Шаг 3. Service

Поды пересоздаются и меняют IP. Service даёт им постоянное имя внутри кластера:

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

Другие сервисы обращаются к приложению по адресу `http://api`. Для доступа извне обычно добавляют Ingress.

## Шаг 4. Конфигурация

```bash
kubectl create configmap api-config --from-literal=LOG_LEVEL=info
kubectl create secret generic api-secrets --from-literal=DB_PASSWORD=change-me
```

Не храните секреты в образе и в открытом виде в Git. Для GitOps-подхода используют зашифрованные секреты или внешние хранилища.

## Шаг 5. Применение и проверка

```bash
kubectl apply -f deployment.yaml -f service.yaml
kubectl rollout status deployment/api
kubectl get pods -l app=api
kubectl logs deployment/api
```

Если под не стартует, начните с `kubectl describe pod <name>` — в разделе Events видны ошибки вроде `ImagePullBackOff` (нет доступа к образу) или `CrashLoopBackOff` (приложение падает при старте).

## Обновление и откат

Чтобы выкатить новую версию, поменяйте тег образа в YAML и снова выполните `kubectl apply`. По умолчанию Deployment делает **rolling update**: поднимает новые поды и убирает старые постепенно, ориентируясь на readinessProbe.

```bash
kubectl rollout history deployment/api
kubectl rollout undo deployment/api
```

## Частые ошибки

- Тег `latest` — непонятно, какая версия работает, а откат становится лотереей.
- Нет readinessProbe — трафик идёт на ещё не готовые поды во время обновления.
- Ручные правки через `kubectl edit` без отражения в YAML — конфигурация в Git и в кластере расходится.
- Отсутствие `imagePullSecrets` для приватного registry.

## FAQ

### Нужен ли Helm для первого деплоя?

Нет. Для одного приложения достаточно обычных YAML-манифестов и `kubectl apply`. Helm полезен, когда появляется несколько окружений и много повторяющихся параметров.

### Чем Deployment отличается от пода?

Под — это один запущенный экземпляр. Deployment следит, чтобы нужное число подов всегда работало, пересоздаёт упавшие и управляет обновлениями.

### Как открыть приложение в браузере?

Для быстрой проверки подойдёт `kubectl port-forward service/api 8080:80`. Для постоянного внешнего доступа настраивают Ingress или Service типа LoadBalancer.
