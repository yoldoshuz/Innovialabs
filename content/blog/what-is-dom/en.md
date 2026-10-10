---
title: What Is the DOM and How JavaScript Changes a Page
description: A plain explanation of the DOM: the element tree, finding and changing nodes, events and delegation, and why React and Vue hide direct DOM work.
summary: The DOM is a live tree of objects the browser builds from HTML; JavaScript finds nodes in it, changes them and reacts to events, and the browser redraws the page right away.
---

## What the DOM is

The **DOM** (Document Object Model) represents a page as a tree of objects. The browser reads HTML and builds a structure: the document has `<html>`, inside it `<head>` and `<body>`, and inside body come headings, paragraphs and buttons. Every element, piece of text and comment is a **node** in the tree.

The key point: the DOM is not the HTML file. HTML is the source text; the DOM is a **live model in memory**. JavaScript changes the model, and the browser displays the changes immediately. "View source" shows the original HTML; DevTools → Elements shows the current DOM.

## Finding an element

```js
const title = document.querySelector("h1");          // first h1
const buttons = document.querySelectorAll(".btn");  // all .btn
const form = document.getElementById("order-form");
```

- `querySelector` takes any CSS selector and returns the first match or `null`.
- `querySelectorAll` returns a static list of all matches.

## Changing the page

```js
title.textContent = "New heading";
title.classList.add("is-active");
form.setAttribute("aria-busy", "true");

const item = document.createElement("li");
item.textContent = "New item";
document.querySelector("ul").append(item);

item.remove();
```

A couple of rules:

- Use **textContent** for text, not `innerHTML`. Inserting user data through `innerHTML` opens the door to XSS attacks.
- Change styles through **classes** rather than `element.style`, so presentation stays in CSS.

## Events

A page responds to the user through **events**: clicks, typing, form submits, scrolling.

```js
const button = document.querySelector("#buy");

button.addEventListener("click", (event) => {
  console.log("Clicked", event.target);
});

form.addEventListener("submit", (event) => {
  event.preventDefault(); // do not reload the page
});
```

Events **bubble**: a click on a button fires on the button first, then on its parent, then further up to `document`.

## Event delegation

Bubbling lets you attach one handler to a container instead of a hundred handlers to individual elements:

```js
document.querySelector("#list").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (!button) return;
  console.log("Delete", button.dataset.id);
});
```

Benefits of delegation:

- **Fewer handlers**: less memory and less code.
- **Works for new elements**: items added later are handled automatically.

## Why frameworks hide the DOM

In a small script, working with the DOM directly is fine. In a large interface, problems appear fast:

- state lives in both your data and the DOM, and the two **drift apart**;
- you must remember by hand which elements to update after every change;
- frequent changes trigger extra **layout** recalculations and repaints.

React, Vue, Svelte and others solve this **declaratively**: you describe what the UI should look like for the current data, and the framework works out the minimal DOM changes. React uses a virtual tree for this, others use compilation or reactivity, but the idea is the same: developers change **data**, not nodes.

## Common beginner mistakes

- Looking for an element before it exists. A script in `<head>` without `defer` runs before the body is built.
- Reading an element's size and then changing styles inside a loop, which forces the browser to recalculate layout again and again.
- Inserting user input via `innerHTML`.
- Manually editing the DOM inside a React or Vue component: the framework will overwrite those changes.

## FAQ

### Is the DOM part of JavaScript?

No. The DOM is a standard interface provided by the browser. JavaScript is just the most common language for working with it. Node.js, for example, has no DOM by default.

### Do I need to learn the DOM if I write React?

Yes, at least the basics. Events, bubbling, forms, focus and accessibility follow DOM rules, and refs or third-party library integrations require direct access to elements.

### What is the Shadow DOM?

An isolated subtree inside an element whose styles and markup do not mix with the rest of the page. Web components use it.
