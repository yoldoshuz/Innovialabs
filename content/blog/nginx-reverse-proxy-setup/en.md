---
title: How to Set Up Nginx as a Reverse Proxy
description: Step-by-step Nginx reverse proxy setup: proxy_pass to a backend, correct headers, WebSockets, timeouts, buffering and how to test the configuration.
summary: Nginx becomes a reverse proxy through the proxy_pass directive in a location block; you add Host and X-Forwarded-* headers, WebSocket support and sensible timeouts, then validate the config with nginx -t.
---
## A minimal working configuration

A reverse proxy accepts client requests and passes them to an application listening on a local port (Node.js, Python, Go and so on). In Nginx this is done by **proxy_pass**. A minimal block for an app on port 3000:

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

The application listens only on `127.0.0.1`, and only Nginx is exposed. That gives you one place for HTTPS, compression, limits and logs.

## Why the headers matter

Without them, the application sees every request as coming from Nginx at 127.0.0.1.

- **Host** — the original domain. Needed for link generation, multi-domain apps and CORS checks.
- **X-Real-IP** and **X-Forwarded-For** — the real client IP. Important for logs, rate limiting and fraud checks.
- **X-Forwarded-Proto** — whether the original request used HTTPS. Without it the app may build `http://` links or fall into an endless redirect.

Your framework usually needs proxy trust enabled explicitly (for example, `trust proxy` in Express), otherwise these headers are ignored.

## WebSocket support

A WebSocket starts as an HTTP request with an `Upgrade` header. Nginx does not pass it by default, so the connection fails. The fix is a map in the `http` block and two headers in the `location`:

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

server {
    location /ws/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        proxy_read_timeout 1h;
    }
}
```

A longer **proxy_read_timeout** keeps Nginx from closing idle connections. The alternative is ping/pong from the application.

## Timeouts and request size

| Directive | What it controls |
|---|---|
| `proxy_connect_timeout` | Waiting to connect to the backend |
| `proxy_send_timeout` | Pauses while sending the request to the backend |
| `proxy_read_timeout` | Pauses while reading the backend response |
| `client_max_body_size` | Maximum request body size |

If long reports or exports fail with **504 Gateway Timeout**, raise `proxy_read_timeout` for that specific location rather than globally. **413 Request Entity Too Large** on uploads is fixed with `client_max_body_size`.

## Buffering

By default Nginx buffers the backend response: it reads it quickly, frees the application and delivers the data to a slow client itself. That is good for regular pages and APIs.

For streaming responses — **Server-Sent Events**, streamed LLM output, long exports — turn buffering off, or the client gets everything in one chunk at the end:

```nginx
location /api/stream {
    proxy_pass http://127.0.0.1:3000;
    proxy_buffering off;
    proxy_cache off;
}
```

## The slash in proxy_pass

A common trap. If `proxy_pass` contains a path (even just `/`), Nginx replaces the matched part of the location:

- `location /api/ { proxy_pass http://127.0.0.1:3000; }` — `/api/users` is sent as `/api/users`.
- `location /api/ { proxy_pass http://127.0.0.1:3000/; }` — it is sent as `/users`.

Pick the variant that matches your app's routes and test it explicitly.

## Testing the configuration

1. `sudo nginx -t` — check syntax before applying.
2. `sudo systemctl reload nginx` — apply without dropping active connections.
3. `curl -I http://example.com` — check the response and headers.
4. On **502 Bad Gateway**, read `/var/log/nginx/error.log`: usually the app is not running or listens on a different port.

## FAQ

### What is the difference between 502 and 504?

502 means Nginx could not get a valid response from the backend: the app is down, crashed or the port is wrong. 504 means the backend is reachable but did not answer in time.

### Do I need HTTPS inside the application itself?

Usually not. TLS terminates at Nginx, and the request travels to the app over HTTP inside the server. Just pass `X-Forwarded-Proto` so the app knows the original request was HTTPS.

### How do I proxy to several application instances?

List them in an `upstream` block and use its name in `proxy_pass`. Nginx will distribute requests between the servers, round-robin by default.
