---
title: Как настроить мониторинг на Prometheus и Grafana
description: Пошагово поднимаем Prometheus и Grafana через Docker Compose, подключаем node_exporter и метрики приложения, пишем PromQL и собираем дашборд.
summary: Prometheus собирает метрики с экспортеров по HTTP, Grafana их визуализирует; оба поднимаются одним docker-compose.yml, а первый полезный дашборд строится из пяти-шести PromQL-запросов.
---
## Коротко: как это устроено

**Prometheus** раз в несколько секунд опрашивает (scrape) HTTP-эндпоинты `/metrics` и сохраняет числа во временной базе. **Экспортеры** отдают эти метрики: `node_exporter` — про сервер (CPU, память, диск, сеть), а ваше приложение — про запросы, ошибки и задержки. **Grafana** подключается к Prometheus как к источнику данных и рисует графики.

Минимальная рабочая схема — четыре контейнера: Prometheus, Grafana, node_exporter и само приложение.

## Шаг 1. Docker Compose

```yaml
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prom-data:/prometheus
    ports:
      - "9090:9090"

  node-exporter:
    image: prom/node-exporter
    pid: host
    volumes:
      - /:/host:ro,rslave
    command: ["--path.rootfs=/host"]

  grafana:
    image: grafana/grafana
    volumes:
      - grafana-data:/var/lib/grafana
    ports:
      - "3000:3000"

volumes:
  prom-data:
  grafana-data:
```

В продакшене закрепите конкретные версии образов, а порты 9090 и 3000 не открывайте наружу — отдавайте Grafana через reverse proxy с HTTPS.

## Шаг 2. Конфигурация Prometheus

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: prometheus
    static_configs:
      - targets: ["prometheus:9090"]
  - job_name: node
    static_configs:
      - targets: ["node-exporter:9100"]
  - job_name: app
    static_configs:
      - targets: ["app:8080"]
```

Запустите `docker compose up -d` и откройте `http://localhost:9090/targets`. Все цели должны быть в статусе **UP**. Если цель DOWN — проверьте имя сервиса, порт и то, что контейнеры в одной сети.

## Шаг 3. Метрики приложения

Для большинства языков есть официальные или популярные клиентские библиотеки Prometheus. Пример для Node.js с `prom-client`:

```js
import express from "express";
import client from "prom-client";

const app = express();
client.collectDefaultMetrics();

const httpDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration",
  labelNames: ["method", "route", "status"],
});

app.use((req, res, next) => {
  const end = httpDuration.startTimer();
  res.on("finish", () =>
    end({ method: req.method, route: req.route?.path ?? "unknown", status: res.statusCode })
  );
  next();
});

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(8080);
```

Главное правило меток: **не кладите в labels значения с высокой кардинальностью** — user ID, полный URL, email. Каждая уникальная комбинация меток — отдельный временной ряд, и база быстро разрастается.

## Шаг 4. Базовые PromQL-запросы

| Что смотрим | Запрос |
|---|---|
| Загрузка CPU, % | `100 - avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100` |
| Свободная память | `node_memory_MemAvailable_bytes` |
| Заполненность диска, % | `100 - node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"} * 100` |
| Запросов в секунду | `sum(rate(http_request_duration_seconds_count[5m]))` |
| Доля ошибок 5xx | `sum(rate(http_request_duration_seconds_count{status=~"5.."}[5m])) / sum(rate(http_request_duration_seconds_count[5m]))` |
| 95-й перцентиль задержки | `histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))` |

Запомните: к счётчикам (`_total`, `_count`) почти всегда применяют `rate()`, иначе вы увидите бесконечно растущую линию.

## Шаг 5. Первый дашборд в Grafana

1. Зайдите в Grafana на порту 3000 и сразу смените пароль администратора.
2. **Connections → Data sources → Prometheus**, URL: `http://prometheus:9090`.
3. Создайте дашборд и добавьте панели по запросам из таблицы.
4. Для серверных метрик можно импортировать готовый дашборд Node Exporter из каталога Grafana по его ID.
5. Добавьте переменную `instance`, чтобы переключаться между серверами.

Источник данных и дашборды лучше описать через **provisioning** (YAML и JSON в репозитории) — тогда их можно восстановить и версионировать.

## Частые ошибки

- **Нет алертов.** Дашборд никто не смотрит ночью. Настройте хотя бы правила на заполнение диска, недоступность цели (`up == 0`) и рост ошибок.
- **Метрики без retention.** По умолчанию Prometheus хранит данные ограниченное время; задайте `--storage.tsdb.retention.time` осознанно.
- **Открытые порты.** `/metrics` и Prometheus без авторизации не должны быть доступны из интернета.
- **Слишком много меток.** Кардинальность — главная причина «тяжёлого» Prometheus.

## FAQ

### Нужен ли Prometheus, если есть облачный мониторинг?

Не обязательно. Облачные решения закрывают базовые метрики инфраструктуры, а Prometheus удобен, когда нужен контроль над данными, метрики приложения и единый стек на своих серверах.

### Как получать уведомления?

Опишите alerting rules в Prometheus и подключите Alertmanager, который отправит уведомление в Telegram, Slack или почту. Альтернатива — встроенные алерты Grafana.

### Можно ли мониторить несколько серверов?

Да. Установите node_exporter на каждый сервер и добавьте их адреса в `targets`. Для динамической инфраструктуры используйте service discovery вместо статического списка.
