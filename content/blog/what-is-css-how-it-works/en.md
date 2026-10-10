---
title: What Is CSS: Selectors, Cascade and Specificity Explained
description: How browsers apply CSS: selectors, the cascade, specificity, inheritance and the box model, explained with short examples you can run right away.
summary: CSS is the styling language: a selector picks elements, a rule sets styles, and in a conflict the declaration with higher specificity wins or, if equal, the one that comes last.
---

## What CSS is and how it works

**CSS** (Cascading Style Sheets) describes how HTML elements look: colors, fonts, spacing, layout. HTML handles structure, CSS handles appearance.

Every rule is made of a **selector** and **declarations**:

```css
p {
  color: #333;
  line-height: 1.6;
}
```

`p` is the selector (all paragraphs), `color: #333` is a "property: value" declaration. The browser reads the HTML, builds a tree of elements, finds every matching rule for each one and computes the final styles.

## Core selectors

| Selector | Example | What it selects |
|---|---|---|
| Type | `p` | All paragraphs |
| Class | `.card` | Elements with `class="card"` |
| ID | `#logo` | The element with `id="logo"` |
| Attribute | `[type="email"]` | Inputs of that type |
| Descendant | `.card p` | Paragraphs inside `.card` |
| Child | `ul > li` | Only direct `li` children |
| Pseudo-class | `a:hover` | A link under the cursor |

In practice, **classes** are the backbone of styling. They're reusable and don't cause specificity headaches.

## The cascade: what happens when rules collide

Several rules often target the same property on one element. The browser resolves the conflict in order:

1. **Origin and importance.** The site author's styles override the browser's defaults. `!important` raises a declaration's priority.
2. **Specificity.** The more precise selector wins.
3. **Source order.** With equal specificity, the rule declared later wins.

```css
.title { color: blue; }
.title { color: red; } /* wins: declared later */
```

## Specificity in plain terms

Specificity is counted as three numbers: **IDs — classes — types**.

| Selector | Specificity |
|---|---|
| `p` | 0-0-1 |
| `.card p` | 0-1-1 |
| `.card .title` | 0-2-0 |
| `#main .title` | 1-1-0 |

Compare from left to right: one ID beats any number of classes. Attributes and pseudo-classes count as "classes", pseudo-elements like `::before` count as "types". An inline `style="..."` beats any selector.

```html
<p id="intro" class="lead">Text</p>
```

```css
#intro { color: green; } /* 1-0-0, wins */
.lead  { color: blue; }  /* 0-1-0 */
p      { color: gray; }  /* 0-0-1 */
```

## Inheritance

Some properties are **inherited** from the parent: `color`, `font-family`, `font-size`, `line-height`. That's why setting the font on `body` is enough.

Others aren't inherited: `margin`, `padding`, `border`, `background`, `width`. You can force inheritance with `inherit`:

```css
button { font: inherit; }
```

## The box model

Every element is a rectangle with four layers: **content**, **padding** (inner space), **border**, and **margin** (outer space).

By default, `width` sets only the content width, and padding and border are added on top. So a box with `width: 300px; padding: 20px` actually takes 340px. Most projects change this:

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

Now `width` includes padding and border, which makes sizing much easier.

## Common mistakes

- **Fighting with `!important`.** It silences the conflict for now, but the next `!important` will need overriding again. Simplify selectors instead.
- **Styling by ID.** High specificity makes later overrides painful.
- **Long chains** like `.page .content .list .item a`. They're fragile and tied to the markup.
- **Forgetting `box-sizing`**, so boxes overflow their layout.

The Styles tab in DevTools shows which rule applied: crossed-out declarations lost the cascade. For a full reference, see [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS).

## FAQ

### Should CSS go in a separate file or in the HTML?

Usually in a separate file linked with `<link rel="stylesheet">`. That way styles are cached and reused across pages. Keep inline styles for rare one-off cases.

### Why isn't my style being applied?

Most often a rule with higher specificity, or one declared later, overrides it. Open DevTools, select the element and see which declaration is crossed out and what beat it.

### Do I need to learn CSS if I use Tailwind or Bootstrap?

Yes. Frameworks produce plain CSS, and without understanding the cascade, the box model and specificity it's hard to tell why a layout behaves unexpectedly.
