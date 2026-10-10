---
title: Prometheus va Grafana’da monitoringni qanday sozlash mumkin
description: Prometheus va Grafana’ni Docker Compose orqali ishga tushiramiz, node_exporter va ilova metrikalarini ulaymiz, PromQL yozamiz va dashboard yig‘amiz.
summary: Prometheus eksporterlardan HTTP orqali metrikalarni yig‘adi, Grafana ularni vizuallashtiradi; ikkalasi bitta docker-compose.yml bilan ko‘tariladi, birinchi foydali dashboard uchun esa besh-olti PromQL so‘rov yetarli.
---
## Qisqacha: bu qanday ishlaydi

**Prometheus** har bir necha soniyada HTTP `/metrics` endpointlarini so‘rab (scrape) oladi va raqamlarni vaqt qatorlari bazasida saqlaydi. **Eksporterlar** bu metrikalarni beradi: `node_exporter` — server haqida (CPU, xotira, disk, tarmoq), ilovangiz esa — so‘rovlar, xatolar va kechikishlar haqida. **Grafana** Prometheus’ga ma’lumot manbai sifatida ulanadi va grafiklar chizadi.

Eng kichik ishlaydigan sxema — to‘rtta konteyner: Prometheus, Grafana, node_exporter va ilovaning o‘zi.

## 1-qadam. Docker Compose

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

Production’da image’larning aniq versiyalarini belgilang, 9090 va 3000 portlarini tashqariga ochmang — Grafana’ni HTTPS bilan reverse proxy orqali bering.

## 2-qadam. Prometheus konfiguratsiyasi

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

`docker compose up -d` buyrug‘ini ishga tushiring va `http://localhost:9090/targets` sahifasini oching. Barcha targetlar **UP** holatida bo‘lishi kerak. Agar biri DOWN bo‘lsa — servis nomini, portni va konteynerlar bitta tarmoqda ekanini tekshiring.

## 3-qadam. Ilova metrikalari

Ko‘pchilik tillar uchun rasmiy yoki mashhur Prometheus client kutubxonalari bor. `prom-client` bilan Node.js misoli:

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

Label’lar uchun asosiy qoida: **yuqori kardinallikdagi qiymatlarni label’ga qo‘ymang** — user ID, to‘liq URL, email. Har bir noyob label kombinatsiyasi — alohida vaqt qatori, baza esa tez kattalashadi.

## 4-qadam. Asosiy PromQL so‘rovlari

| Nimani kuzatamiz | So‘rov |
|---|---|
| CPU yuklamasi, % | `100 - avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100` |
| Bo‘sh xotira | `node_memory_MemAvailable_bytes` |
| Disk to‘lishi, % | `100 - node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"} * 100` |
| Soniyadagi so‘rovlar | `sum(rate(http_request_duration_seconds_count[5m]))` |
| 5xx xatolar ulushi | `sum(rate(http_request_duration_seconds_count{status=~"5.."}[5m])) / sum(rate(http_request_duration_seconds_count[5m]))` |
| Kechikishning 95-persentili | `histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))` |

Esda tuting: hisoblagichlarga (`_total`, `_count`) deyarli doim `rate()` qo‘llanadi, aks holda cheksiz o‘sib boruvchi chiziqni ko‘rasiz.

## 5-qadam. Grafana’dagi birinchi dashboard

1. Grafana’ga 3000-port orqali kiring va darhol admin parolini almashtiring.
2. **Connections → Data sources → Prometheus**, URL: `http://prometheus:9090`.
3. Dashboard yarating va jadvaldagi so‘rovlar bo‘yicha panellar qo‘shing.
4. Server metrikalari uchun Grafana katalogidan tayyor Node Exporter dashboard’ini ID orqali import qilish mumkin.
5. Serverlar o‘rtasida almashish uchun `instance` o‘zgaruvchisini qo‘shing.

Ma’lumot manbai va dashboard’larni **provisioning** orqali (repozitoriyda YAML va JSON) tasvirlagan ma’qul — shunda ularni tiklash va versiyalash mumkin.

## Ko‘p uchraydigan xatolar

- **Alertlar yo‘q.** Kechasi dashboard’ni hech kim kuzatmaydi. Hech bo‘lmaganda disk to‘lishi, target mavjud emasligi (`up == 0`) va xatolar o‘sishi uchun qoidalar sozlang.
- **Retention o‘ylanmagan.** Prometheus standart holatda ma’lumotni cheklangan vaqt saqlaydi; `--storage.tsdb.retention.time` ni ongli ravishda belgilang.
- **Ochiq portlar.** `/metrics` va avtorizatsiyasiz Prometheus internetdan ochiq bo‘lmasligi kerak.
- **Juda ko‘p label.** Kardinallik — Prometheus «og‘ir» bo‘lib qolishining asosiy sababi.

## FAQ

### Bulutli monitoring bo‘lsa, Prometheus kerakmi?

Shart emas. Bulutli yechimlar infratuzilmaning asosiy metrikalarini qamrab oladi, Prometheus esa ma’lumot ustidan nazorat, ilova metrikalari va o‘z serverlaringizda yagona stek kerak bo‘lganda qulay.

### Bildirishnomalarni qanday olish mumkin?

Prometheus’da alerting rules yozing va Alertmanager’ni ulang — u xabarni Telegram, Slack yoki pochtaga yuboradi. Muqobil variant — Grafana’ning o‘rnatilgan alertlari.

### Bir nechta serverni kuzatish mumkinmi?

Ha. Har bir serverga node_exporter o‘rnating va ularning manzillarini `targets` ga qo‘shing. Dinamik infratuzilma uchun statik ro‘yxat o‘rniga service discovery’dan foydalaning.
