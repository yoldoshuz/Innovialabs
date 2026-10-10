---
title: What Is Nginx and How It Works as a Web Server
description: Learn what Nginx is, how its event-driven architecture works, which roles it plays and how to read a basic nginx.conf file step by step.
summary: Nginx is a fast, event-driven web server that serves static files and acts as a reverse proxy, load balancer and cache in front of your application.
---
## Nginx in a nutshell

**Nginx** (pronounced "engine-x") is software that accepts HTTP requests from browsers and answers them. It can serve a file straight from disk or forward the request to your application in Node.js, Python, PHP or Go and relay the response.

Nginx is popular for three reasons: it is **fast**, it **uses little memory** even with many connections, and it is **configured flexibly** through a single text file.

## Event-driven architecture

Classic servers often dedicated a process or thread to every connection. A thousand slow clients meant a thousand threads, each with its own memory.

Nginx works differently:

- A **master process** reads the configuration and starts or restarts workers.
- Several **worker processes**, usually one per CPU core, do the actual work.
- Each worker handles **thousands of connections at once** in an event loop. Instead of waiting for a slow client to download a response, it switches to other connections that are ready.

That is why Nginx handles many simultaneous connections, including slow mobile clients, without memory usage exploding.

## The roles Nginx plays

### Static web server

Serves HTML, CSS, JavaScript, images and fonts directly from disk. This is where it shines.

### Reverse proxy

Sits in front of your application and forwards requests to it. Along the way Nginx can:

- terminate **HTTPS** (TLS termination) so the app speaks plain HTTP internally;
- compress responses with gzip;
- limit request rates and body sizes;
- hide the internal structure of your infrastructure.

### Load balancer

Distributes requests across several copies of the application using methods such as round robin, least connections or client IP hash.

### Cache

Stores application responses and serves them again without hitting the backend, which reduces load and speeds up responses.

## Anatomy of a basic nginx.conf

The configuration is made of **directives** and **blocks** (contexts). Here is a minimal site that also proxies an API:

```nginx
worker_processes auto;

events {
    worker_connections 1024;
}

http {
    include       mime.types;
    sendfile      on;
    gzip          on;

    upstream app {
        server 127.0.0.1:3000;
        server 127.0.0.1:3001;
    }

    server {
        listen 80;
        server_name example.com;

        root /var/www/site;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /api/ {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

The key parts:

- **`events`** — connection handling settings.
- **`http`** — everything HTTP: file types, compression, sites.
- **`upstream`** — a group of backends for load balancing.
- **`server`** — a virtual host: which domain and port it serves.
- **`location`** — rules for specific URL paths.

In real setups each site usually lives in its own file under `conf.d/` or `sites-enabled/` and is pulled in with `include`.

## Handy commands

```bash
sudo nginx -t                 # check the config for errors
sudo systemctl reload nginx   # apply changes without dropping connections
sudo tail -f /var/log/nginx/error.log
```

## Common mistakes

- Using `restart` instead of `reload` and skipping the `nginx -t` check.
- Not forwarding the `Host` and `X-Real-IP` headers, so the app sees the wrong domain and client IP.
- Confusing how `proxy_pass` behaves with and without a trailing slash.
- Leaving internal paths and directory listings exposed.

## FAQ

### Does Nginx replace my application server?

No. Nginx does not run your application code. It sits in front of it: serves static files, handles HTTPS and passes dynamic requests to a Node.js, Python or PHP-FPM process.

### What is the difference between reload and restart?

`reload` rereads the configuration and gracefully replaces worker processes without dropping active connections. `restart` fully stops and starts the server, which can cause a brief outage.

### Do I need Nginx if my site runs on a cloud platform?

Not always. Many platforms and CDNs already act as the proxy and load balancer. Nginx is most useful when you manage your own servers or VPS.
