---
title: What Happens When You Type a URL and Press Enter
description: Step by step: DNS lookup, TCP and TLS handshakes, the HTTP request, the server response, HTML parsing and rendering, plus where page load time is lost.
summary: The browser finds the IP via DNS, opens a secure connection (TCP + TLS), sends an HTTP request, receives HTML, loads CSS, JS and images, then builds and paints the page.
---
## The short answer: six stages in a fraction of a second

After you press Enter, the browser goes through a chain of steps:

1. **Parses the address** and checks the cache.
2. **DNS** — finds the server's IP address from the domain name.
3. **TCP** — opens a connection to the server.
4. **TLS** — agrees on encryption (for HTTPS).
5. **HTTP** — sends a request and receives a response.
6. **Rendering** — turns HTML, CSS and JavaScript into pixels on the screen.

Each stage takes time, and knowing the chain helps you find out why a site is slow.

## Step 1. Parsing the address and the cache

The browser decides what you typed: an address or a search query. If it is an address, it checks the **cache** for a saved page, files or an already known IP. If they are there and still fresh, some of the next steps are skipped.

## Step 2. DNS: finding the IP address

Computers talk using IP addresses, not names. The browser asks a **DNS resolver** (usually your ISP's or a public one) for the domain's IP. If the resolver does not know, it asks the root servers, then the servers of the domain zone (such as .uz or .com), and finally the authoritative server for your domain.

The answer is cached for the time set in the record (**TTL**), so repeat visits are faster.

## Steps 3–4. TCP and TLS: connection and encryption

- **TCP handshake** — the client and server exchange service packets and confirm they are ready to send data.
- **TLS handshake** — the server presents a **certificate**, and the browser checks that it was issued by a trusted authority and matches the domain. Then both sides agree on encryption keys.

If the certificate has expired or does not match the domain, the browser shows a warning and will not open the page without your consent. Newer protocol versions (HTTP/2, HTTP/3) reduce the number of round trips and let many files travel over a single connection.

## Step 5. The HTTP request and the server response

The browser sends a request like this:

```http
GET / HTTP/1.1
Host: example.com
Accept: text/html
```

The server (often behind a **CDN** and a reverse proxy such as nginx) passes the request to the application. The application may query the database, build the page and return a response with a status code (**200**, **301**, **404**, **500**) and HTML in the body.

What matters here is how fast the server responds — **TTFB** (time to first byte). Slow database queries or no server-side caching show up at this stage.

## Step 6. Parsing and rendering the page

Once it has the HTML, the browser:

1. **Builds the DOM** — the tree of page elements.
2. **Discovers resources** — CSS, JavaScript, fonts, images — and requests them.
3. **Builds the CSSOM** — the style model. Until CSS arrives, the browser usually holds off painting content to avoid showing an unstyled page.
4. **Runs JavaScript.** A plain `<script>` pauses HTML parsing, which is why scripts are loaded with `defer` or `async`.
5. **Layout** — calculates sizes and positions of elements.
6. **Paint and composite** — draws pixels and assembles layers on the screen.

At this point the page is visible, but JavaScript may keep loading data and making it interactive.

## Where speed is usually lost

| Stage | Typical cause of delay |
|---|---|
| DNS | Slow DNS provider, very short TTL |
| TCP/TLS | Server far from the user, no CDN |
| Server response | Heavy database queries, no caching |
| Resource loading | Large images, extra scripts and fonts |
| Rendering | Blocking JavaScript, complex layout |

## FAQ

### Why does a site open faster the second time?

The browser already knows the domain's IP, can reuse the connection and takes CSS, scripts and images from its cache. The server only sends what has changed.

### What does a CDN do in this chain?

A CDN is a network of servers in different countries. It serves files from the node closest to the user, cutting connection and download time, and takes load off the main server.

### Can I see these stages myself?

Yes. Open the browser's developer tools (F12), go to the Network tab and reload the page. For each request you will see the time spent on DNS, connecting, waiting for the response and downloading.
