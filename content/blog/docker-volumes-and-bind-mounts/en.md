---
title: Docker Volumes vs Bind Mounts: How to Persist Container Data
description: How volumes differ from bind mounts and tmpfs, when to use each, how to fix permission issues and back up volumes, and why container data gets lost.
summary: Anything written to a container's layer disappears when the container is removed. Use named volumes for application data and bind mounts for source code in development, and back up separately with tested restores.
---

## Why data in a container gets lost

Every container gets a thin **writable layer** on top of its image. Anything the app writes to disk without attached storage ends up there. Stopping a container keeps that data, but `docker rm`, recreating via Compose or updating the image removes the layer along with its files.

So the rule is simple: anything that must outlive the container, such as databases, uploaded files and queues, lives **outside** the writable layer.

## Three storage options

| Type | Where data lives | Good for |
|---|---|---|
| **Named volume** | An area managed by Docker | Databases, uploads, production |
| **Bind mount** | A specific folder on the host | Source code in development, configs |
| **tmpfs** | Memory | Temporary or sensitive data that should not persist |

## Named volumes

```bash
docker volume create pgdata
docker run -d --name db -v pgdata:/var/lib/postgresql/data postgres:16
```

Why volumes are the default choice for data:

- Docker creates and stores them, so you do not need to know a host path.
- They behave the same on Linux, macOS and Windows.
- If you mount an empty volume over a folder that already has files in the image, Docker copies them in on first use.
- They are easy to share between containers and survive container removal.

Useful commands: `docker volume ls`, `docker volume inspect pgdata`, `docker volume rm pgdata`. Be careful with `docker volume prune`: it removes unused volumes together with their data.

## Bind mounts

```bash
docker run -d -v "$(pwd)/src:/app/src" my-app
```

A host folder is mounted directly into the container, and changes are visible both ways immediately. This is convenient for **development**: you edit code in your editor and the app in the container sees it.

Downsides:

- Dependence on one machine's folder layout.
- The container can modify or delete files on the host.
- On macOS and Windows, file operations through bind mounts can be slower.

For configs the container only reads, add `:ro` for a read-only mount.

## Permission issues

The most common error is `Permission denied`. The cause: the process inside the container runs as a user with one **UID**, while the host files belong to another UID. User names do not matter; numeric IDs are compared.

How to fix it:

- Find the process UID in the container: `docker exec <container> id`.
- Set the host folder's owner to that UID with `chown`.
- In development, run the container with your UID: `--user "$(id -u):$(id -g)"`.
- In your own Dockerfile, create the user and data folders in advance with the right owner.
- Do not "fix" it with `chmod 777`: that opens the files to everyone.

## How to back up a volume

A universal approach is a temporary container that archives the volume into a host folder:

```bash
docker run --rm \
  -v pgdata:/data:ro \
  -v "$(pwd)":/backup \
  alpine tar czf /backup/pgdata.tar.gz -C /data .
```

Restoring into a new volume:

```bash
docker run --rm \
  -v pgdata_restored:/data \
  -v "$(pwd)":/backup \
  alpine tar xzf /backup/pgdata.tar.gz -C /data
```

Important for databases: a file copy of a running database may be inconsistent. Native tools such as `pg_dump` or `mysqldump`, or stopping the container during the copy, are more reliable. Above all, regularly verify that you can actually restore from the backup.

## How to choose

- Data you must keep in production: a **named volume**.
- Code and configs in local development: a **bind mount**.
- Temporary files, cache, secrets in memory: **tmpfs**.
- Nothing important in the container's writable layer.

## FAQ

### Does docker compose down delete my volumes?

No. A plain `docker compose down` removes containers and the network but keeps named volumes. Data is lost only if you add the `-v` flag or remove the volume manually.

### Where are named volumes physically stored?

On Linux, usually in Docker's data directory; `docker volume inspect` shows the path. Working with those files directly is not recommended; use containers and Docker commands instead.

### Can one volume be attached to several containers?

Yes, but concurrent writes from multiple processes must be supported by the application. Never run two databases on the same volume.
