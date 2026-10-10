---
title: Frontend Developer Roadmap: What to Learn and in What Order
description: A staged plan for aspiring frontend developers: HTML, CSS and JavaScript first, then frameworks, tooling and testing, with a project for each stage.
summary: Learn frontend in layers: HTML and CSS, then JavaScript, Git and APIs, then one framework, TypeScript, build tooling and testing, and lock in every stage with a project of your own.
---

## The order in one list

Frontend is easiest to learn in layers, where each layer builds on the previous one:

1. **HTML and CSS** — page structure and appearance.
2. **JavaScript** — logic and interactivity.
3. **Git, the browser and APIs** — everyday working tools.
4. **One framework** — for example React, Vue or Angular.
5. **TypeScript and tooling** — types, bundling, linters.
6. **Testing and quality** — tests, accessibility, performance.

The most common beginner mistake is jumping straight to a framework. Without solid JavaScript, a framework turns into a set of magic spells.

## Stage 1. HTML and CSS

What to learn:

- **Semantic markup**: `header`, `main`, `nav`, `article`, forms and their attributes.
- **CSS basics**: selectors, the cascade, the box model, units.
- **Layout**: Flexbox and Grid.
- **Responsive design**: media queries, mobile first.
- **Basic accessibility**: alt text, form labels, contrast.

**Checkpoint:** you can build a page from a design mockup and it looks right on both phone and desktop.

**Project:** a landing page or résumé page built without any libraries.

## Stage 2. JavaScript

- Variables, types, functions, scope, closures.
- Arrays and objects, `map`, `filter`, `reduce`.
- Working with the DOM and events.
- Async code: promises, `async/await`, `fetch`.
- Modules and basic error handling.

**Checkpoint:** you can explain what a short async snippet will print, and you can build an interactive UI without a framework.

**Project:** a to-do list that saves to `localStorage`, or a calculator with operation history.

## Stage 3. Git, the browser and APIs

- **Git**: commits, branches, merges, pull requests.
- **DevTools**: inspector, console, Network tab, debugging.
- **HTTP and REST**: methods, status codes, headers, JSON.

```bash
git checkout -b feature/search
git add .
git commit -m "Add search by title"
git push origin feature/search
```

**Checkpoint:** your projects live on GitHub with a meaningful commit history.

**Project:** an app that loads data from a public API (weather, exchange rates, movies) with search, loading states and error handling.

## Stage 4. A framework

Pick **one** framework based on job listings in your city or at the companies you are targeting. Learn:

- components, props and state;
- forms and lists;
- routing;
- data fetching and state management.

**Checkpoint:** you can split a UI into components and explain why a component re-renders.

**Project:** a multi-page app, such as a catalog with filters, a cart and a product page.

## Stage 5. TypeScript and tooling

- **TypeScript**: types, interfaces, basic generics.
- **Bundlers and package managers**: npm and a working idea of what a bundler does.
- **Linting and formatting**: ESLint, Prettier.
- **Deployment**: publishing a project to a static hosting service.

**Checkpoint:** the project builds without type errors and is available at a public link.

## Stage 6. Testing and quality

- **Unit tests** for functions and components.
- **End-to-end tests** for key user flows.
- **Performance**: bundle size, lazy loading, image optimization.
- **Accessibility**: keyboard navigation, screen reader support.

**Project:** add tests and a lint check in CI to one of your earlier projects.

## Common mistakes

| Mistake | What it leads to |
|---|---|
| Learning three frameworks at once | Shallow knowledge of all of them |
| Watching courses without practice | An illusion of understanding |
| Copying tutorials line by line | A portfolio identical to hundreds of others |
| Ignoring CSS | Layout trouble on real tasks |

## FAQ

### How long does it take to become a frontend developer?

It depends on your starting point, how many hours a week you study and how much you practice. Measure progress by checkpoints rather than the calendar: once you are confident at stage 4 and have 2-3 projects of your own, start applying for jobs.

### Which framework should I learn first?

The one that appears most often in the job listings you care about. Modern frameworks share similar principles, so the second one comes much easier than the first.

### Does a junior need TypeScript?

Many projects use it, so basic knowledge is a plus. But start with JavaScript: TypeScript is built on top of it.
