---
title: How Websites Work: Client, Server, HTTP and the Browser
description: A plain-language guide to how a website works: the roles of the browser, server, DNS and HTTP, and where HTML, CSS, JavaScript and the database fit.
summary: A website is a conversation: the browser (client) finds the server through DNS, sends an HTTP request, and the server returns HTML, CSS, JavaScript and data that the browser turns into a page.
---
## The short answer: a request and a response

Every website follows the **client-server** model. The **client** is your browser (or a mobile app). The **server** is a computer in a data center that stores the site's code and data. They talk over **HTTP**: the client sends a request, the server sends back a response.

Everything else — DNS, databases, CSS, JavaScript — exists to make that conversation fast, good-looking and useful.

## The players and their roles

| Player | What it does |
|---|---|
| **Browser** | Sends requests, receives files and draws the page |
| **DNS** | Translates a domain name (like example.com) into the server's IP address |
| **Server** | Accepts requests, runs code, returns responses |
| **Application (backend)** | Site logic: sign-in, orders, calculations |
| **Database** | Stores users, products, leads and anything that changes |

## The whole journey in one diagram

```text
[You] --type an address--> [Browser]
                              |
                              | 1. "What is the IP of example.com?"
                              v
                            [DNS] --> 203.0.113.10
                              |
                              | 2. HTTP request: GET /catalog
                              v
                           [Server] --3. query--> [Database]
                              |      <--4. products--
                              | 5. HTTP response: 200 OK + HTML
                              v
                          [Browser] --6. loads CSS, JS, images
                              |
                              v
                       [Finished page]
```

## What an HTTP request and response are

A **request** contains a method, an address and headers. The most common methods:

- **GET** — fetch data (open a page, load an image);
- **POST** — send data (a contact form, a payment);
- **PUT/PATCH** and **DELETE** — change or remove data, usually through an API.

A **response** contains a status code and a body. Codes worth knowing:

- **200** — everything is fine;
- **301/302** — the page moved, the browser follows the new address;
- **404** — the page does not exist;
- **500** — something broke on the server.

Almost every site today uses **HTTPS** — the same HTTP inside an encrypted channel. Without it, browsers mark the site as not secure.

## Where HTML, CSS, JavaScript and the database live

- **HTML** — the structure and content of the page: headings, text, links, forms.
- **CSS** — the look: colors, fonts, layout, mobile adaptation.
- **JavaScript** — the behavior: menus, sliders, sending forms without reloading.

These three run **in the browser** — that is the **frontend**. The code on the server that decides what to send and works with the **database** is the **backend**. Users never see the database directly, only what the server chooses to show.

## Static vs dynamic websites

- **Static** — the server returns ready-made files. Fast, cheap to host, great for landing pages and blogs.
- **Dynamic** — the page is assembled at request time from database data. Needed for user accounts, online stores, CRMs.

Modern frameworks often mix both: some pages are generated in advance, others on demand.

## Common misconceptions

- **"The site is stored in the browser."** No, the browser only caches files temporarily; the original lives on the server.
- **"A domain and hosting are the same thing."** A domain is a name, hosting is where the server runs. DNS connects the two.
- **"If the page opens, the server is fine."** The page may come from a cache or CDN while the API is already down.

## FAQ

### What happens if the server goes down?

The site stops opening, except for pages already cached in the browser or a CDN. That is why important projects use monitoring and backup servers.

### Why do we need DNS if a site can be opened by IP?

IP addresses are hard to remember and change when you move to another server. DNS keeps a permanent name and lets you switch the address without users noticing.

### Does every website need a database?

No. A business card site or a landing page does not. A database is needed when users or admins create and change data: orders, profiles, a catalog.
