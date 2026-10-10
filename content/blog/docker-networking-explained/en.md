---
title: Docker Networking Explained: Bridge, Host and Custom Networks
description: How Docker containers talk to each other and the outside world: bridge and host networks, port publishing, DNS by service name and common mistakes.
summary: Containers on the same user-defined network find each other by service name, and the outside world reaches an app only through a published port (-p). Host networking removes isolation and is rarely needed.
---
## How Docker networking works

Every container gets its own network stack: its own IP address, its own ports, its own `localhost`. Docker connects containers to each other and to the host through **network drivers**. In everyday work three options matter:

- **bridge (default)** — a virtual network inside the host. Containers get internal addresses and reach the outside through NAT.
- **user-defined bridge network** — the same idea, plus built-in **DNS by container name** and better isolation. This is the standard choice.
- **host** — the container uses the host's network stack directly, with no isolation and no port publishing.

Other drivers exist (`none`, `overlay`, `macvlan`), but they serve special cases: full isolation, clusters, or attaching a container directly to a physical network.

## Publishing ports: reaching a container from outside

By default, a port inside a container is not reachable from the host or the internet. To open it, you **publish** it:

```bash
docker run -d -p 8080:80 nginx
```

Read it as `HOST:CONTAINER`: requests to port 8080 on the host go to port 80 in the container.

Details that matter:

- `-p 8080:80` listens on all host interfaces, so the port may be visible from the internet. If the service is for local use only, use `-p 127.0.0.1:8080:80`.
- Docker adds its own firewall rules on the host, and they can bypass tools like `ufw`. Do not publish database ports unless you have to.
- `EXPOSE` in a Dockerfile is documentation only — it does **not** open a port.

## DNS by service name

On a user-defined network, containers address each other by name, not IP. IP addresses change every time a container is recreated; names do not.

```bash
docker network create app-net
docker run -d --name db --network app-net postgres
docker run -d --name api --network app-net my-api
```

Now `api` connects to the database at `db:5432`. On the default `bridge` network this DNS does not work, which is a common cause of "host not found" errors.

In **Docker Compose**, a user-defined network is created automatically, and each service name from `docker-compose.yml` becomes its DNS name:

```yaml
services:
  api:
    build: .
    ports:
      - "8080:3000"
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/app
  db:
    image: postgres:16
```

Note that `db` has no `ports` section. The database does not need to be reachable from outside — `api` reaches it over the internal network.

## Comparing the modes

| Mode | Isolation | DNS by name | Needs -p | When to use |
|---|---|---|---|---|
| default bridge | yes | no | yes | quick experiments |
| user-defined bridge | yes | yes | yes, for outside access | almost always |
| host | no | — | no | special network performance cases, Linux only |
| none | full | — | — | workloads without network |

## Common mistakes

- **`localhost` inside a container.** For a container, `localhost` is itself — not the host and not a neighbour container. Reach neighbours by service name.
- **The app listens on 127.0.0.1.** If the server inside the container binds to `127.0.0.1`, the published port will not work. Listen on `0.0.0.0`.
- **Swapped ports in `-p`.** The host port is on the left, the container port on the right.
- **Port already taken on the host.** Docker will not start the container if another process uses that host port.
- **Containers on different networks.** Services from different Compose projects cannot see each other by default. Attach them to a shared external network.
- **A database exposed to the world.** Publishing `5432` or `3306` on all interfaces is a direct security risk.

## How to check connectivity

- `docker network ls` — list networks.
- `docker network inspect app-net` — which containers are attached and their addresses.
- `docker exec -it api sh`, then `ping db` or `nc -zv db 5432` (if the image has these tools) — test reachability from inside.
- `docker port api` — which ports are published.

Driver details are in the [official Docker documentation](https://docs.docker.com/engine/network/).

## FAQ

### How do I reach a service on the host from a container?

Docker Desktop provides the name `host.docker.internal`. On Linux you can add it with `--add-host=host.docker.internal:host-gateway` or via `extra_hosts` in Compose.

### Do I need to publish ports for containers to talk to each other?

No. On the same network, containers can reach all of each other's ports. Publishing is only for access from the host or the outside.

### When should I use host networking?

Rarely: when you want to avoid NAT overhead or the app needs direct access to the host's network interfaces. The price is lost isolation and possible port conflicts.
