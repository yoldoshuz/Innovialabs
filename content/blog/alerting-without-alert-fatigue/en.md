---
title: Alerting Best Practices: How to Avoid Alert Fatigue
description: Symptom-based vs cause-based alerts, severity levels, routing to Telegram and on-call tools, deduplication and regular reviews of noisy alerts.
summary: Page a human only when users are hurting or about to, and action is required; send everything else to tickets or dashboards, and prune noisy alerts regularly.
---

## The golden rule of alerting

Every alert that reaches the on-call engineer must be **urgent, important and require human action**. If a notification can safely be ignored, it is not an alert, it is noise.

**Alert fatigue** happens when there are so many notifications that people stop reading them. A real incident then drowns among false positives.

## Symptom-based vs cause-based alerts

- **Symptoms** — what the user sees: error rate rising, pages loading slowly, orders failing.
- **Causes** — internal states: high CPU, memory running out, a pod restarted.

| | Symptom-based | Cause-based |
|---|---|---|
| What it shows | Users are affected | Something might go wrong |
| False positives | Few | Many |
| Where to send | On-call, urgently | Ticket or dashboard |

**Page people on symptoms.** Cause-based alerts are useful as diagnostic context and as warnings handled during working hours. The exception is a cause that will certainly lead to an outage soon, such as a disk filling up within hours.

A solid base for symptom alerts is your **SLOs and burn rate**: the alert fires when the error budget is being consumed too fast.

## Severity levels

Three or four levels with clear rules are enough:

- **Critical** — users are affected now. Call or push the on-call engineer at any hour.
- **Warning** — will become a problem soon. Message in a team channel, handled during working hours.
- **Info** — for history and dashboards. No notifications.

If the team cannot explain how critical differs from warning, the levels are not working.

## Routing notifications

A typical setup with Prometheus Alertmanager:

```yaml
route:
  receiver: telegram-team
  group_by: ['alertname', 'service']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  routes:
    - matchers:
        - severity="critical"
      receiver: oncall-pager
```

- **Telegram or Slack** — fine for warnings and shared context, but easy to miss at night.
- **On-call tools** (PagerDuty, Opsgenie, Grafana OnCall and similar) — for critical alerts: rotations, escalations, acknowledgements.
- Every alert needs an **owner** — a team or a service.

## Deduplication and grouping

One database outage can trigger hundreds of alerts from different services. To prevent that:

- **Group** alerts by service and type.
- Use **inhibition**: if the whole cluster is down, you do not need an alert per pod.
- Add a `for:` delay to rules so short spikes do not wake anyone.
- Set a **sensible repeat_interval** so the same alert does not arrive every five minutes.

## Reviewing noisy alerts regularly

Alerting is not a one-time setup. Once a week or once a sprint, check:

1. Which alerts fired most often?
2. Which of them actually led to action?
3. Which resolved on their own with nothing done?

A noisy alert should be **fixed, downgraded or deleted**. Every alert should link to a **runbook** — a short guide on what to check and what to do.

## FAQ

### How many alerts per shift is normal?

There is no universal number. A good guide: the on-call engineer should be able to investigate every critical alert and fix its cause. If alerts are acknowledged without looking, there are too many.

### Can we use only Telegram for on-call?

For a small team it is a workable start, but Telegram has no escalations or acknowledgements. For critical services, add an on-call tool with phone calls and schedules.

### Should we alert on CPU usage?

Usually not as a page: high CPU on its own does not mean users are suffering. Show it on a dashboard and alert on latency and errors instead.
