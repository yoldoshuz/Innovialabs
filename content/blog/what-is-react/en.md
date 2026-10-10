---
title: What Is React and Why It Is So Popular
description: A plain explanation of React: components, JSX, props, state and the virtual DOM, a tiny example app, and when React is or is not the right choice.
summary: React is a JavaScript library for building interfaces from components: you describe how the screen should look for a given state, and React updates the right parts of the page itself.
---

## React in a nutshell

**React** is a JavaScript library for building user interfaces. It was created at Meta (Facebook) and open-sourced in 2013. React handles only the view layer: how data turns into what the user sees on screen.

The core idea is being **declarative**. You do not write "find the element, change its text, add a class". You describe how the interface should look for the current data, and React works out what to change in the DOM.

## Five core concepts

**Components.** The interface is built from independent pieces: a button, a product card, a form. A component is a plain function that returns markup. Write it once, reuse it everywhere.

**JSX.** HTML-like syntax inside JavaScript. It compiles to function calls, so curly braces can hold any expression: `{user.name}`, `{items.length > 0 && <List />}`.

**Props.** A component's inputs, passed by its parent. A component does not change them — it only reads them. Data flows **top-down**.

**State.** A component's internal data: a field value, whether a list is open, a counter. When state changes, React calls the component again and updates the screen.

**Virtual DOM.** Working with the real DOM is relatively expensive. React builds a lightweight description of the UI in memory, compares the new version with the old one (a process called **reconciliation**) and applies only the actual differences to the page.

## A tiny app

A to-do list in a single component:

```jsx
import { useState } from "react";

function TodoApp() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");

  function add() {
    if (!text.trim()) return;
    setItems([...items, text]);
    setText("");
  }

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={add}>Add</button>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```

What is going on:

- `useState` is a **hook** that keeps state between renders.
- The input is **controlled**: its value always comes from state.
- `setItems` creates a new array instead of mutating the old one — that is how React notices the change.
- `key` helps React tell which list item changed. In real projects, use a stable id rather than the index.

## Why React is so popular

- The **component approach** scales well: a large interface splits into understandable parts.
- A **huge ecosystem**: routing, forms, state management, UI kits — there is a ready solution for almost any task.
- **Frameworks built on React**, such as Next.js, add server rendering, routing and optimizations out of the box.
- **React Native** lets you reuse the same knowledge for mobile apps.
- A **large community**: plenty of documentation, answered questions and developers on the market.

## When React fits and when it does not

| Good fit | Probably not needed |
|---|---|
| Interactive apps: dashboards, CRMs, user accounts | A simple landing page with no interactivity |
| Interfaces with lots of state | A static blog where a site generator is enough |
| Projects a team will grow for a long time | A small widget on an existing site |
| Web and mobile apps sharing one approach | A team strong in another stack under tight deadlines |

Note: plain React without a framework renders content in the browser. For pages where SEO matters, teams usually use a framework with server rendering.

## Common beginner mistakes

- Mutating state directly (`items.push(...)`) instead of creating a new value.
- Keeping in state what can be computed from other data.
- Putting the whole interface into one giant component.
- Using the array index as `key` in lists that get sorted or filtered.
- Adding a state management library to a project where built-in `useState` and `useContext` are enough.

The easiest place to start learning is the [official documentation](https://react.dev).

## FAQ

### Is React a framework or a library?

Formally a library: it handles the interface, while routing, data fetching and bundling are covered by other tools or by frameworks such as Next.js.

### Do I need to know JavaScript before React?

Yes. Without a solid grasp of functions, arrays, objects, destructuring and modules, React will feel like magic and its errors will be confusing.

### Is React good for SEO?

Yes, if you use server rendering or static generation — for example, through Next.js. A site that renders only in the browser is harder for search engines to index.
