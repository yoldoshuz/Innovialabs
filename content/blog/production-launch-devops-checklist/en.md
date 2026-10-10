---
title: DevOps Checklist Before Launching a Project to Production
description: A practical pre-launch DevOps checklist: automated deploys, monitoring and alerts, logs, tested backups, scaling headroom, a rollback plan and runbooks.
summary: Before launch, make sure deploys are automated and repeatable, problems trigger alerts to a named person, logs are searchable, backups have been restored at least once, there is capacity headroom, a rollback takes minutes, and common incidents have written runbooks.
---

## The short answer

A project is ready for production when the team can answer "yes" to seven questions:

1. Can we deploy with one command or one click, without manual steps on servers?
2. Will we learn about an outage before users tell us?
3. Can we find what happened in the logs within minutes?
4. Have we actually restored a backup, not just made one?
5. Can the system handle more than the expected peak?
6. Can we roll back a bad release quickly?
7. Does the person on duty know what to do for typical incidents?

Below is the checklist behind each question. Go through it a week or two before launch, not on launch day.

## Automated deploys

- The build and deploy run in CI/CD from the main branch or a tag; nobody copies files to servers by hand.
- The same artifact (for example a Docker image) goes to staging and then to production.
- **Configuration and secrets** live in environment variables or a secret manager, not in the repository.
- Database migrations run as a separate, logged step.
- Staging mirrors production closely enough that a passing release there means something.
- Deploys do not cause downtime: health checks and graceful shutdown are in place.

## Monitoring and alerts

- **Uptime checks** from outside your network hit the main pages and the API.
- Basic metrics are collected: CPU, memory, disk, network, plus app-level metrics such as request rate, error rate and latency.
- Business-critical flows are monitored too: sign-ups, payments, order creation.
- **Alerts** go to a channel someone actually watches, with a named person on duty.
- Alert thresholds are tuned so they fire on real problems; a noisy alert channel gets ignored.
- Disk usage and SSL certificate expiry have their own alerts.

## Logs

- Logs from all services are collected in one place and searchable.
- Logs are structured (for example JSON) and include a request or trace ID.
- Personal data, passwords and tokens are not written to logs.
- Log retention and rotation are configured, so logs do not fill the disk.
- Frontend errors are captured as well, not only server errors.

## Backups with a tested restore

A backup that has never been restored is only a hope.

- Databases, uploaded files and important configuration are backed up automatically.
- Copies are stored outside the main server and, ideally, outside the main provider or region.
- You know your **RPO** (how much data you can afford to lose) and **RTO** (how long recovery may take), and the backup schedule matches them.
- A full restore has been performed on a separate environment, and the steps are written down.
- Backup failures trigger an alert.

## Scaling headroom

- A load test has been run on the critical flows at and above the expected peak.
- You know which component hits its limit first: app servers, database, cache or an external API.
- There is a plan for how to add capacity: more instances, a bigger database tier, autoscaling.
- Rate limits and timeouts are set for external calls, so a slow partner does not freeze the whole app.
- Static files and media are served via a CDN or at least cached properly.

## Rollback plan

- The previous version can be redeployed with the same pipeline.
- Migrations are backward-compatible, so rollback does not break the database.
- **Feature flags** can switch off risky features without a deploy.
- Who decides to roll back, and by what criteria, is agreed in advance.

## Runbooks and access

A **runbook** is a short written guide for a specific situation. Prepare them for at least:

- the site is down or returns errors;
- the database is overloaded or out of disk space;
- a deploy failed halfway;
- a backup needs to be restored;
- a secret or key has leaked and must be rotated.

Also check access: at least two people can reach servers, the cloud account, the domain registrar and DNS; accounts belong to the company, not to one employee; two-factor authentication is enabled.

## FAQ

### Is this checklist overkill for a small project?

The scale changes, the questions do not. A small project can use a managed platform, a simple uptime monitor and provider backups, but it still needs a tested restore, alerts and a rollback path.

### What should be done first if time is short?

Backups with a tested restore, uptime alerts and an automated deploy with rollback. These three cover the most painful scenarios: data loss, unnoticed downtime and a broken release.

### Who should own this checklist?

Usually a DevOps engineer or tech lead, but the product owner should see it too. Several items, such as RPO, RTO and on-duty arrangements, are business decisions, not purely technical ones.
