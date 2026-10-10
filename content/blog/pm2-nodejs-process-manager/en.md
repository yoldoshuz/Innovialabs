---
title: "PM2 Guide: Running Node.js Apps in Production"
description: How to run Node.js in production with PM2 - cluster mode, ecosystem files, zero-downtime reload, startup on boot, log management and when to use Docker.
summary: PM2 keeps a Node.js app running, restarts it on crashes, spreads load across CPU cores in cluster mode and brings processes back after a server reboot.
---

## The short answer: why PM2

If you start an app with `node server.js`, it stops when you close the terminal, hit an error or reboot the server. **PM2** is a process manager for Node.js that:

- keeps the app running in the background and restarts it on crashes;
- runs several copies across CPU cores (**cluster mode**);
- reloads code without downtime;
- brings processes back after a server restart;
- collects logs and shows resource usage.

## Install and first run

```bash
npm install -g pm2
pm2 start server.js --name api
```

Core commands:

| Command | What it does |
|---|---|
| `pm2 list` | processes and their status |
| `pm2 logs api` | live logs |
| `pm2 monit` | CPU and memory in the terminal |
| `pm2 restart api` | hard restart |
| `pm2 reload api` | zero-downtime restart |
| `pm2 stop api` / `pm2 delete api` | stop / remove from the list |

## An ecosystem file instead of long commands

Keep settings in the repository, in `ecosystem.config.js`:

```js
module.exports = {
  apps: [
    {
      name: "api",
      script: "./dist/server.js",
      instances: "max",
      exec_mode: "cluster",
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
```

Start it with `pm2 start ecosystem.config.js`. The configuration is then identical on every server and tracked in Git. Do not put secrets in this file — pass them via the server's environment variables or a `.env` file that is not committed.

## Cluster mode

Node.js runs JavaScript on a single thread, so one process uses one core. In **cluster mode** PM2 starts several instances and distributes incoming connections between them. `instances: "max"` means one per core.

Key conditions:

- the app must be **stateless**: sessions, cache and queues live in external storage (Redis, a database), not in process memory;
- scheduled jobs inside the app will run in every instance — move them out or run them in only one;
- WebSockets in a cluster need sticky sessions or an external adapter.

## Zero-downtime reload

`pm2 reload api` restarts instances one at a time: while one reloads, the others keep serving requests. This works in cluster mode. To make reloads truly smooth:

- handle the `SIGINT` signal — close the server and database connections cleanly;
- if needed, use `wait_ready: true` and `process.send("ready")` so PM2 waits until the app is actually ready.

## Startup on boot

```bash
pm2 startup
# run the command PM2 prints
pm2 save
```

`pm2 startup` creates a system service and `pm2 save` stores the current process list. Run `pm2 save` again after adding or removing apps.

## Managing logs

By default logs go to `~/.pm2/logs` and are never deleted. Install the rotation module:

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 50M
pm2 set pm2-logrotate:retain 10
```

Otherwise logs will eventually fill the disk.

## PM2 or Docker

| | PM2 | Docker |
|---|---|---|
| Learning curve | low | higher |
| Environment | depends on the server | identical everywhere |
| Multiple languages and services | awkward | natural |
| Scaling across many servers | manual | via an orchestrator |
| Best for | one server, small project | teams, microservices, CI/CD |

With one VPS and one or two Node.js apps, PM2 is a simple and reliable choice. As the project grows, with several services and a need for reproducible environments, move to **Docker**. Inside a container you usually do not need PM2: Docker or the orchestrator handles restarts, and multiple copies run as separate containers.

## FAQ

### What is the difference between restart and reload?

`restart` stops all processes and starts them again — there is a brief outage. `reload` restarts instances one by one and in cluster mode avoids downtime.

### Why did the app not come back after a server reboot?

Most likely `pm2 startup` and `pm2 save` were not run. Also check that the service was created for the same user that started the processes.

### Do I still need nginx if I use PM2?

Usually yes. PM2 manages processes, while nginx accepts traffic, terminates HTTPS, serves static files and proxies requests to the app.
