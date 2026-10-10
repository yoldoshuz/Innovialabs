---
title: "What Is a Headless CMS: Strapi, Sanity, Payload Compared"
description: Headless CMS in plain words — decoupled content and frontend, API delivery, pros and cons versus a traditional CMS, plus Strapi, Sanity and Payload compared.
summary: A headless CMS stores and edits content but does not render it — a website, app or bot fetches the data via API, giving you frontend freedom at the cost of more complex development.
---

## The short answer

A **headless CMS** is a content management system without a built-in "head" — no templates or themes for display. It does two things:

- gives editors an admin panel to create and edit content;
- delivers that content through an **API** (REST or GraphQL).

How the content looks is decided by a separate application: a Next.js or Nuxt site, a mobile app, a Telegram bot, an in-store screen.

In a **traditional CMS** (for example, classic WordPress), content and presentation live in one system: the theme renders the pages itself.

## How it works

1. A developer defines **content models**: an "Article" with title, body, cover and author; a "Service" with price and description.
2. Editors fill in entries in the admin.
3. The frontend requests data through the API and renders it with its own code.
4. When content changes, the CMS can send a **webhook** so the site rebuilds or refreshes the affected pages.

## Pros and cons

| | Headless CMS | Traditional CMS |
|---|---|---|
| Design and frontend freedom | Full | Within the theme |
| One content source for many channels | Yes | Hard |
| Performance | Easy to build a static or cached frontend | Needs cache setup |
| Page preview | Must be configured | Built in |
| Entry barrier | Needs frontend developers | Can launch without code |
| Moving parts | More: CMS, frontend, hosting for both | Fewer |

**Headless fits when:**

- the site is built on a modern framework with a unique design;
- the same content is needed on the site, in an app and in a bot;
- speed and control over the frontend matter;
- there is a development team to maintain it.

**A traditional CMS is better when:**

- you need a simple site editors assemble themselves;
- there are no resources for separate frontend development.

## Strapi, Sanity and Payload: a quick comparison

| | Strapi | Sanity | Payload |
|---|---|---|---|
| Model | Open source, self-hosted or cloud | Hosted content store, open-source Studio editor | Open source, self-hosted or cloud |
| Technology | Node.js | Content in Sanity's cloud, Studio built with React | Node.js and TypeScript, tight Next.js integration |
| Schema definition | Via admin UI or files | In code (JavaScript/TypeScript) | In code (TypeScript) |
| API | REST and GraphQL | GROQ query language and GraphQL | REST, GraphQL and a local API |
| Database | Yours (PostgreSQL, MySQL, SQLite, etc.) | Managed by Sanity | Yours (PostgreSQL, MongoDB, etc.) |
| Strength | Fast start, visual model builder | Real-time collaborative editing, flexible Studio | Code control, typing, developer experience |

### Strapi

A good fit if you want a clear admin and the ability to build content models by clicking. You host the server and database yourself — full control over data, but also responsibility for updates and backups.

### Sanity

Content lives in Sanity's cloud, and the **Sanity Studio** editor is customised in code. Strong for editorial and marketing teams where several people work at once. Keep in mind that data sits with an external provider, and cost depends on plan and usage.

### Payload

A CMS "built for developers": schema and logic are written in TypeScript, and Payload can run inside a Next.js application. Convenient when the team values types, access control and custom business logic next to the content.

## How to choose

1. **Where must the data live?** If on your own server — Strapi or Payload.
2. **Who defines the models?** If managers — Strapi is easier; if developers in code — Sanity or Payload.
3. **What is your frontend?** For a Next.js project Payload offers tight integration; the others work via API too.
4. **Do you need collaborative editing?** Sanity shines here.
5. **Who will maintain it?** Self-hosted options need DevOps: updates, backups, monitoring.

## Common mistakes

- Choosing headless for a simple brochure site just because it is trendy.
- Forgetting about preview — editors cannot see the result before publishing.
- Not designing content models upfront and reworking them on live data later.

## FAQ

### Can WordPress be used as a headless CMS?

Yes. WordPress has a REST API, and plugins add GraphQL. It is an option when editors are used to WordPress but the frontend should be built on a modern framework.

### Is a headless CMS worse for SEO?

No. SEO depends on the frontend: if pages are server-rendered or statically generated with proper meta tags, search engines index them well.

### Do I have to pay for a headless CMS?

Strapi and Payload can be self-hosted for free, paying only for hosting. Sanity has a free tier with limits, and beyond that pricing depends on usage.
