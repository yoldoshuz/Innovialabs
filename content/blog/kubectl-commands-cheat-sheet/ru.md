---
title: Шпаргалка kubectl: команды на каждый день
description: Основные команды kubectl по задачам: просмотр ресурсов, логи, exec, port-forward, масштабирование, rollout, контексты и namespaces с примерами.
summary: Почти вся ежедневная работа с Kubernetes укладывается в десяток команд kubectl: get, describe, logs, exec, port-forward, scale, rollout и переключение контекста и namespace.
---
## Какие команды kubectl нужны каждый день

Для повседневной работы с кластером хватает небольшого набора: **get** и **describe** — посмотреть состояние, **logs** и **exec** — разобраться с проблемой, **port-forward** — достучаться до сервиса локально, **scale** и **rollout** — управлять деплоем, **config** — переключаться между кластерами. Ниже они сгруппированы по задачам.

## Просмотр ресурсов

```bash
kubectl get pods                      # поды в текущем namespace
kubectl get pods -A                   # поды во всех namespaces
kubectl get pods -o wide              # плюс нода и IP
kubectl get deploy,svc,ingress        # несколько типов сразу
kubectl get pods -l app=api           # фильтр по label
kubectl get pod api-7d9f -o yaml      # полный манифест
kubectl describe pod api-7d9f         # детали и события
kubectl get events --sort-by=.metadata.creationTimestamp
```

**describe** — первое, что стоит запускать, если под не стартует: в разделе Events видно, почему образ не скачался, не хватило ресурсов или упала проба.

## Логи

```bash
kubectl logs api-7d9f                 # логи пода
kubectl logs -f api-7d9f              # следить в реальном времени
kubectl logs api-7d9f -c worker       # конкретный контейнер
kubectl logs api-7d9f --previous      # логи упавшего экземпляра
kubectl logs deploy/api --tail=100    # последние строки любого пода деплоя
kubectl logs -l app=api --since=10m   # по label за 10 минут
```

Флаг **--previous** незаменим при CrashLoopBackOff: текущий контейнер только что перезапустился, а причина падения осталась в логах предыдущего.

## Exec и отладка внутри пода

```bash
kubectl exec -it api-7d9f -- sh       # интерактивная оболочка
kubectl exec api-7d9f -- env          # одна команда
kubectl exec -it api-7d9f -c worker -- sh
```

Если в образе нет shell (distroless-образы), используйте **kubectl debug** с отдельным отладочным контейнером.

## Port-forward

```bash
kubectl port-forward pod/api-7d9f 8080:3000
kubectl port-forward svc/postgres 5432:5432
```

Так можно открыть базу или внутренний сервис на своём компьютере без публикации наружу. Соединение живёт, пока работает команда.

## Масштабирование и rollout

```bash
kubectl scale deploy/api --replicas=3
kubectl rollout status deploy/api     # дождаться завершения деплоя
kubectl rollout history deploy/api    # история ревизий
kubectl rollout undo deploy/api       # откат на предыдущую ревизию
kubectl rollout restart deploy/api    # перезапуск подов без изменения манифеста
kubectl set image deploy/api api=registry/api:1.4.2
```

**rollout restart** удобен после обновления Secret или ConfigMap, которые подключены как переменные окружения: поды пересоздаются по очереди, без простоя при нормальной стратегии RollingUpdate.

## Контексты и namespaces

```bash
kubectl config get-contexts           # список кластеров
kubectl config current-context
kubectl config use-context prod
kubectl config set-context --current --namespace=backend
kubectl get ns
```

Последняя команда `set-context` избавляет от постоянного `-n backend` в каждой строке.

## Применение и удаление манифестов

```bash
kubectl apply -f k8s/                 # применить папку
kubectl diff -f k8s/                  # что изменится
kubectl delete -f k8s/job.yaml
kubectl top pods                      # CPU и память (нужен metrics-server)
```

## Частые ошибки

- **Работа не в том контексте.** Перед опасными командами проверяйте `current-context`, особенно если рядом есть prod.
- **Забытый namespace.** Пустой вывод `get pods` часто значит, что вы смотрите не туда.
- **Правка живых ресурсов через edit.** `kubectl edit` удобен для экспериментов, но изменения теряются при следующем `apply` из репозитория.
- **Удаление пода вместо исправления причины.** Под под управлением Deployment пересоздастся с той же ошибкой.

## FAQ

### Чем kubectl apply отличается от kubectl create?

`create` создаёт ресурс и выдаёт ошибку, если он уже есть. `apply` работает декларативно: создаёт или обновляет ресурс до состояния из файла, поэтому подходит для CI/CD и хранения манифестов в Git.

### Как быстро посмотреть, почему под не запускается?

Запустите `kubectl describe pod <имя>` и прочитайте Events внизу, затем `kubectl logs <имя> --previous`, если контейнер уже падал.

### Можно ли сократить длинные команды?

Да. Многие ставят alias `k=kubectl` и используют короткие имена ресурсов: `po`, `deploy`, `svc`, `ns`. Также полезно включить автодополнение — инструкция есть в официальной документации kubectl.
