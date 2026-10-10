---
title: How to Self-Host n8n: Setup, Security and Updates
description: Self-hosting n8n on a VPS: Docker Compose, PostgreSQL over SQLite, queue mode with Redis, the encryption key, HTTPS, backups, updates and when it beats cloud.
summary: A solid setup is n8n in Docker Compose with PostgreSQL behind an HTTPS proxy, a saved N8N_ENCRYPTION_KEY, regular database backups and updates to a pinned version; queue mode with Redis is only needed once a single process is no longer enough.
---
## The short answer

A production-ready self-hosted n8n needs:

- a **VPS** with Docker and Docker Compose;
- **PostgreSQL** instead of the default SQLite;
- a **reverse proxy with HTTPS** (Caddy, Nginx or Traefik) and a domain;
- a **persistent encryption key**, `N8N_ENCRYPTION_KEY`;
- **database backups** and **planned updates** to a specific version.

## Installing with Docker Compose

A minimal setup with PostgreSQL. Keep secrets in a `.env` file next to it, not in the compose file itself:

```yaml
services:
  postgres:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_USER: n8n
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: n8n
    volumes:
      - pg_data:/var/lib/postgresql/data

  n8n:
    image: docker.n8n.io/n8nio/n8n:${N8N_VERSION}
    restart: unless-stopped
    ports:
      - "127.0.0.1:5678:5678"
    environment:
      DB_TYPE: postgresdb
      DB_POSTGRESDB_HOST: postgres
      DB_POSTGRESDB_DATABASE: n8n
      DB_POSTGRESDB_USER: n8n
      DB_POSTGRESDB_PASSWORD: ${POSTGRES_PASSWORD}
      N8N_ENCRYPTION_KEY: ${N8N_ENCRYPTION_KEY}
      N8N_HOST: n8n.example.com
      N8N_PROTOCOL: https
      WEBHOOK_URL: https://n8n.example.com/
      GENERIC_TIMEZONE: Asia/Tashkent
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      - postgres

volumes:
  pg_data:
  n8n_data:
```

The port is bound to `127.0.0.1` only, so n8n is reachable from outside only through the proxy. With Caddy, the HTTPS certificate is issued automatically:

```
n8n.example.com {
    reverse_proxy localhost:5678
}
```

`WEBHOOK_URL` matters behind a proxy: without it, n8n shows the internal address in webhook URLs instead of the public one.

## SQLite or PostgreSQL

| | SQLite | PostgreSQL |
|---|---|---|
| Setup | Nothing to do | A separate container |
| Workload | Testing, personal use | Team and business workflows |
| Queue mode | Not suitable | Required |
| Backups | Copy a file | `pg_dump` and standard tooling |

For anything the business depends on, start with PostgreSQL: migrating later is harder than setting it up from day one.

## Queue mode: when you need it

By default every execution runs in a single process. When you have many or heavy workflows, or webhooks arrive in bursts, switch to **queue mode**:

- the main process receives triggers and webhooks and pushes jobs to a **Redis** queue;
- separate **workers** (`n8n worker`) pick up and run the jobs;
- you add workers as the load grows.

It is enabled with `EXECUTIONS_MODE=queue` plus the Redis settings. Every process must share the **same** `N8N_ENCRYPTION_KEY`. Do not enable queue mode "for the future" — it adds components you then have to maintain.

## Security

- **Encryption key.** n8n encrypts stored credentials with this key. Set it explicitly and keep a copy in a password manager. Lose the key and every credential has to be re-entered.
- **Access.** Use individual user accounts with two-factor authentication, not one shared login for the whole team.
- **Network.** Expose only ports 80 and 443, use key-based SSH and never publish the database port.
- **Webhooks.** Turn on authentication in the Webhook node (header, Basic or JWT) whenever the caller supports it.
- **Execution history.** Enable pruning of old executions (`EXECUTIONS_DATA_PRUNE`), otherwise the database keeps growing and stores personal data longer than necessary.

## Backups

Back up three things:

1. **The database** — workflows, credentials and history live there.
2. **The encryption key** — without it, encrypted credentials in a backup are useless.
3. **The `/home/node/.n8n` volume** — the instance configuration.

```bash
docker compose exec -T postgres pg_dump -U n8n n8n | gzip > n8n-$(date +%F).sql.gz
```

Store copies off the server and test a restore on a separate machine from time to time.

## Updates

- **Pin the version** in `N8N_VERSION`; avoid `latest` in production.
- Read the release notes and any breaking-changes section before upgrading.
- Take a backup, then run:

```bash
docker compose pull
docker compose up -d
```

- Afterwards, check your key workflows and the logs. For a major version jump, rehearse it on a copy first.

## When self-hosting beats the cloud plan

**Your own server** makes sense when:

- data must stay in your infrastructure or jurisdiction;
- you run many executions and cloud limits get in the way;
- you need custom nodes, access to internal services or non-standard settings;
- someone on the team will own updates, backups and monitoring.

**The cloud plan** is better when nobody can administer a server and the load is moderate. Also review n8n's license: internal business use is generally allowed, while offering n8n itself as a service to others is restricted — check the official documentation.

## FAQ

### Can I move workflows from n8n Cloud to my own server?

Yes. Workflows export to JSON and import into the new instance. Credentials are usually easier to recreate than to move, because they are encrypted with the original instance's key.

### How much server capacity do I need?

It depends on the number and weight of workflows, data volume and run frequency. Start with a small VPS, watch memory and CPU in monitoring and scale when you hit real limits.

### What happens if I change N8N_ENCRYPTION_KEY?

n8n can no longer decrypt previously saved credentials, and workflows that use them stop working. Set the key once and do not change it without a planned migration.
