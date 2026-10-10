---
title: What Is htmx and When You Do Not Need a JS Framework
description: htmx adds interactivity through HTML attributes while the server sends ready markup fragments. Common patterns and its limits compared to SPA frameworks.
summary: htmx is a small library that updates parts of a page with HTML fragments from the server via attributes; for forms, search, tables and admin panels it often replaces React or Vue, but it does not suit rich client-side interfaces.
---
## The short answer

**htmx** is a small JavaScript library that extends HTML with attributes such as `hx-get` and `hx-post`. Any element can send a request to the server, and the response — a **ready HTML fragment** — is inserted into the right place on the page.

Instead of "the server returns JSON and the client renders the UI", the model is **"the server returns HTML and the browser inserts it"**. This is called a **hypermedia-driven** approach: state and logic stay on the server, and there is almost no client code.

You do not need a JS framework when the interface is mostly **forms, lists, tables, filters and cards**, and the data lives on the server anyway.

## How it works

Key attributes:

- `hx-get`, `hx-post`, `hx-put`, `hx-delete` — which request to send;
- `hx-trigger` — on which event (click, input, scroll);
- `hx-target` — where to put the response;
- `hx-swap` — how to insert it: replace content, the whole element, append;
- `hx-indicator` — what to show while loading.

The backend can be anything: Django, Laravel, Rails, Go, Node.js, ASP.NET. It renders templates as on a classic website, only sometimes it returns a piece of a page instead of the whole one.

## Common patterns

### A form without a reload

```html
<form hx-post="/contacts" hx-target="this" hx-swap="outerHTML">
  <input name="email" type="email" required>
  <button>Send</button>
</form>
```

The server validates the data and returns either the form with errors or a success message. Validation lives in one place — on the server.

### Live search

```html
<input type="search" name="q"
       hx-get="/search"
       hx-trigger="input changed delay:300ms"
       hx-target="#results">
<div id="results"></div>
```

The request is sent after a short pause in typing, and the server returns a ready list of results.

### Pagination and infinite scroll

```html
<tr hx-get="/orders?page=2"
    hx-trigger="revealed"
    hx-swap="afterend">
  <td>Loading...</td>
</tr>
```

When the row scrolls into view, the next batch loads. For classic pagination, `hx-get` on a "Load more" button plus `hx-push-url` to update the browser address is enough.

## htmx vs SPA frameworks

| Criterion | htmx | React / Vue (SPA) |
|---|---|---|
| Where state lives | on the server | mostly on the client |
| Response format | HTML | usually JSON |
| Client code size | minimal | significant |
| Frontend build step | optional | required |
| Offline mode | practically none | possible |
| Complex editors, drag and drop | awkward | natural |
| Instant reaction without the server | no | yes |
| Separate frontend team needed | usually not | usually yes |

## When htmx is a good choice

- **admin panels, CRMs, internal systems** with tables and forms;
- the project already uses a server-side framework with templates;
- a small team that does not want to maintain two apps — an API and an SPA;
- you want to add interactivity to an existing multi-page site without a rewrite.

## Where the limits start

- **Rich client interfaces**: graphic editors, drag-and-drop kanban boards, complex dashboards with local state.
- **Offline and unreliable networks**: every action needs a server response.
- **Mobile apps and third-party clients**: they still need a JSON API, which you will have to build separately.
- **Small client-side behaviour** like opening a menu — for that, teams usually add a light library such as Alpine.js next to htmx, or a few lines of plain JavaScript.

## Common mistakes

- **Trying to rebuild an SPA** with htmx: keeping complex state in the DOM and wiring dozens of attributes together.
- **Returning the whole page** from the server instead of a fragment — slow, and it breaks the layout.
- **Forgetting security**: templates must escape user input, and POST requests must be protected against CSRF.

## FAQ

### Is htmx good for SEO?

Yes, as long as the main pages are served as regular HTML. htmx only loads fragments on top of them, so search engines see full content.

### Can htmx be used together with React?

Technically yes, but they are two different approaches to state. Usually one is the main approach and the other is used locally — for example, a single React widget on an htmx page.

### Does htmx need a separate API?

No. Server routes that return HTML fragments are enough. A JSON API is only needed for mobile apps or integrations.
