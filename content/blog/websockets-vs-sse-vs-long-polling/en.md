---
title: WebSockets vs Server-Sent Events vs Polling for Real-Time Apps
description: How WebSockets, Server-Sent Events and long polling work, what to watch for with proxies and scaling, and which fits chats, notifications and AI.
summary: Use WebSockets for two-way exchange (chats, collaborative editing, games), SSE for server-only event streams (notifications, dashboards, AI response streaming), and keep polling as a simple fallback.
---
## The short answer

| Task | Best choice |
|---|---|
| Chat, collaborative editing, multiplayer | **WebSockets** |
| Notifications, event feed, live dashboard | **SSE** |
| Streaming an LLM response token by token | **SSE** (or a streamed HTTP response) |
| Rare updates, background job status | **Polling** |
| Environments where only plain HTTP gets through | **Long polling** |

The key question is **who talks to whom**. If data only flows from server to client, WebSockets are usually overkill.

## How each mechanism works

**Short polling.** Every N seconds the client asks "anything new?". Simple and reliable, but latency equals the interval and most requests come back empty.

**Long polling.** The client sends a request and the server holds it open until data appears or a timeout hits. After the response the client immediately sends a new request. Lower latency, but every message is a new HTTP round trip with headers.

**Server-Sent Events (SSE).** The client opens a normal HTTP request, the server responds with `Content-Type: text/event-stream` and keeps the connection open, sending events as text. Direction: server to client only. Browsers have a built-in `EventSource` with automatic reconnection.

```javascript
const es = new EventSource("/api/events");
es.onmessage = (e) => console.log(JSON.parse(e.data));
```

**WebSockets.** The connection starts as HTTP and switches (Upgrade) to a separate protocol. From then on, both sides send text or binary messages at any time with minimal overhead.

```javascript
const ws = new WebSocket("wss://example.com/chat");
ws.onmessage = (e) => render(JSON.parse(e.data));
ws.send(JSON.stringify({ text: "Hello" }));
```

## Comparison

| | Polling | Long polling | SSE | WebSockets |
|---|---|---|---|---|
| Direction | Client to server | Client to server | Server to client | Both |
| Latency | Poll interval | Low | Low | Low |
| Protocol | HTTP | HTTP | HTTP | Separate, after Upgrade |
| Reconnection | Not needed | Manual | Built into `EventSource` | Manual |
| Binary data | Yes | Yes | No, text only | Yes |
| Proxy compatibility | Excellent | Good | Good if buffering is off | Needs configuration |

## Proxies, load balancers and infrastructure

This is where real-time most often breaks.

- **Buffering.** nginx and other proxies may buffer the response, so SSE events arrive in batches. Disable buffering for SSE (in nginx: `proxy_buffering off` or the `X-Accel-Buffering: no` header).
- **Idle timeouts.** Proxies and load balancers close quiet connections. Send heartbeats — a `:` comment in SSE or ping/pong in WebSockets — and raise `proxy_read_timeout`.
- **Upgrade for WebSockets.** The proxy must forward the `Upgrade` and `Connection` headers, or the handshake fails.
- **HTTP/1.1 connection limit.** Browsers cap concurrent HTTP/1.1 connections per domain, and several tabs with SSE can exhaust it. Over HTTP/2 streams are multiplexed and the issue disappears.
- **Serverless.** Many serverless platforms limit request duration and are a poor fit for long-lived WebSocket connections. Time-limited SSE works more often.

## Scaling

A long-lived connection is tied to one server. With several servers:

1. **Shared message bus.** An event raised on server A must reach a client connected to server B. Teams use Redis Pub/Sub, NATS, Kafka or managed services.
2. **Sticky sessions.** Needed for long polling and some libraries with fallback transports, so a client's requests hit the same server.
3. **Resource limits.** Each connection uses memory and a file descriptor. Check OS limits and use an async server.
4. **Smooth deploys.** On restart all clients reconnect at once. Add random delay (jitter) to reconnection.

## Reconnection and lost messages

Connections drop: network changes, laptop sleep, deploys. Plan for it.

- **SSE**: send an `id:` field with events. On reconnect the browser sends a `Last-Event-ID` header and the server can replay what was missed.
- **WebSockets**: reconnection is manual — with exponential backoff and jitter. After reconnecting, the client asks for changes since the last known point.
- **The server is the source of truth.** Treat the real-time channel as a delivery mechanism for updates, and fetch current state with a separate request.

## Common mistakes

- WebSockets where SSE would do, plus the extra infrastructure that comes with them.
- No heartbeat, so connections silently die on the proxy after a minute.
- No authorization on connect, or a token checked once for hours of connection.
- Scaling to several servers without a shared bus, so some clients miss events.

## FAQ

### Why do ChatGPT-like services usually stream responses over SSE?

The model's answer flows one way, from server to client, while the user's prompt goes as a normal HTTP request. SSE runs over HTTP, passes through proxies more easily and needs no separate protocol.

### Can I send data to the server over SSE?

No, SSE is one-way. Data goes to the server via regular HTTP requests (`POST`, `fetch`). For many apps that combination fully replaces WebSockets.

### When is polling a perfectly good solution?

When updates are rare and a small delay does not matter: payment status, checking whether a report is ready, refreshing once a minute. Polling is the easiest to debug and works in any environment.
