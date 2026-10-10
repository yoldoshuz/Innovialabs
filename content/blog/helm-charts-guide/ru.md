---
title: Helm: как упаковывать и устанавливать приложения в Kubernetes
description: Как устроен Helm-чарт, как работают values и шаблоны, как ставить публичные чарты, создать свой чарт и управлять релизами, обновлениями и откатами.
summary: Helm — пакетный менеджер для Kubernetes: чарт объединяет шаблоны манифестов и настройки в values.yaml, а команды install, upgrade и rollback управляют версиями установленного приложения как релизами.
---

## Короткий ответ

**Helm** упаковывает набор Kubernetes-манифестов в **чарт** — шаблон приложения с параметрами. Вы ставите чарт одной командой, а различия между окружениями (реплики, домены, ресурсы) задаёте в файле **values**. Каждая установка — это **релиз** с историей версий, поэтому обновление и откат делаются одной командой.

Helm полезен, когда одно и то же приложение нужно разворачивать в несколько окружений или когда вы ставите готовое ПО — базы данных, мониторинг, Ingress-контроллеры.

## Структура чарта

```text
mychart/
  Chart.yaml          # имя, версия чарта и версия приложения
  values.yaml         # параметры по умолчанию
  templates/          # шаблоны манифестов
    deployment.yaml
    service.yaml
    _helpers.tpl      # общие фрагменты шаблонов
  charts/             # зависимости
```

- **version** в `Chart.yaml` — версия самого чарта, **appVersion** — версия приложения внутри.
- Всё, что лежит в `templates/`, рендерится в обычные YAML-манифесты.

## Values и шаблоны

Шаблоны используют синтаксис Go templates. Значения подставляются из `values.yaml`:

```yaml
# values.yaml
replicaCount: 2
image:
  repository: registry.example.com/shop/api
  tag: "1.0.0"
```

```yaml
# templates/deployment.yaml (фрагмент)
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
        - name: api
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
```

Для каждого окружения создают свой файл, например `values-prod.yaml`, и передают его при установке. Отдельные значения можно переопределить флагом `--set`, но для постоянных настроек файл удобнее: он хранится в Git.

## Установка публичных чартов

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm search repo redis
helm show values bitnami/redis > redis-values.yaml
helm install cache bitnami/redis -f redis-values.yaml -n data --create-namespace
```

Прежде чем ставить, **посмотрите values по умолчанию**: там видно, что включено, какие ресурсы запрашиваются и как настроено хранение данных.

## Свой чарт

```bash
helm create mychart
helm lint mychart
helm template mychart -f values-prod.yaml
helm install api ./mychart -f values-prod.yaml -n shop
```

- `helm create` генерирует заготовку, из которой обычно удаляют лишнее.
- `helm lint` ищет ошибки в структуре.
- `helm template` показывает итоговые манифесты без установки — это главный инструмент отладки.

## Релизы, обновления и откаты

```bash
helm upgrade api ./mychart -f values-prod.yaml -n shop
helm upgrade --install api ./mychart -f values-prod.yaml -n shop
helm history api -n shop
helm rollback api 3 -n shop
helm uninstall api -n shop
```

- `upgrade --install` удобен в CI/CD: ставит релиз, если его нет, и обновляет, если есть.
- `rollback` возвращает конфигурацию нужной ревизии из истории.
- Флаг `--atomic` откатывает неудачное обновление автоматически.

## Частые ошибки

- Хранить пароли прямо в `values.yaml` в Git. Используйте Secret, зашифрованные values или внешнее хранилище.
- Ставить публичный чарт без фиксированной версии (`--version`) — при следующей установке может прийти другая.
- Менять ресурсы релиза через `kubectl edit` — при следующем `helm upgrade` изменения перезапишутся.
- Перегружать шаблоны условиями до нечитаемости. Если чарт сложнее приложения, стоит упростить.

## FAQ

### Чем Helm отличается от Kustomize?

Helm работает с шаблонами и параметрами и умеет управлять релизами. Kustomize накладывает патчи на обычный YAML без шаблонов. Их можно комбинировать, выбор зависит от того, что команде удобнее поддерживать.

### Где хранить свои чарты?

В том же репозитории, что и приложение, или в отдельном. Для распространения подходят Helm-репозитории и OCI-registry, которые многие container registry уже поддерживают.

### Можно ли посмотреть, что изменит upgrade, до его запуска?

Да. Сравните вывод `helm template` с текущими манифестами или используйте плагин helm-diff, который показывает разницу перед обновлением.
