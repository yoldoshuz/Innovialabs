---
title: Sass vs CSS Modules vs CSS-in-JS: How to Style a Modern App
description: Comparing Sass, CSS Modules and CSS-in-JS on scoping, performance, developer experience and SSR support, with a recommendation matrix per project type.
summary: Sass is a preprocessor for writing CSS more comfortably, CSS Modules scope classes per file, and CSS-in-JS defines styles in JavaScript. For most React apps with SSR, CSS Modules (optionally with Sass) or zero-runtime CSS-in-JS is the safe choice.
---
## Each approach in brief

- **Sass (SCSS)** is a preprocessor. It adds variables, nesting, mixins and functions, and outputs plain CSS. On its own it **does not scope** styles: classes stay global.
- **CSS Modules** are regular `.css` or `.scss` files whose class names the bundler makes unique. Styles are **scoped per file**, and the output is static CSS.
- **CSS-in-JS** defines styles in JavaScript next to the component. There are two branches: **runtime** (styles are generated in the browser during render) and **zero-runtime** (styles are extracted into CSS files at build time).

These approaches can be combined: Sass is often used inside CSS Modules.

## Comparison on key criteria

| Criterion | Sass (global) | CSS Modules | Runtime CSS-in-JS | Zero-runtime CSS-in-JS |
|---|---|---|---|---|
| Scoping | manual, via BEM | automatic | automatic | automatic |
| In the browser | CSS only | CSS only | JS generates styles | CSS only |
| Styles from props | via classes and CSS variables | via classes and CSS variables | directly | limited, via variables |
| SSR and server components | fine | fine | needs setup, has limits | usually fine |
| Typing | no | can be generated | yes | yes |
| Learning curve | low | low | medium | medium |

## Scoping

The main problem of large CSS codebases is **name collisions**: a `.title` class from one component breaks another. Options:

- **Sass plus BEM**: a naming convention like `.card__title--active`. It works, but relies on team discipline.
- **CSS Modules**: `styles.title` becomes a unique name automatically. Collisions are ruled out without conventions.
- **CSS-in-JS**: styles are bound to the component, and global rules are declared explicitly.

## Performance

- **Static CSS** (Sass, CSS Modules, zero-runtime) is downloaded and cached separately from JS and needs no computation during render.
- **Runtime CSS-in-JS** adds to the JS bundle and does work on every render: it serializes styles and injects them into the document. On simple pages this is invisible; in complex interfaces with frequent re-renders it can be noticeable.

If load speed and Core Web Vitals matter, prefer approaches that ship **ready-made CSS**.

## SSR and server components

In modern React frameworks with server rendering and server components, runtime CSS-in-JS needs extra setup to collect styles on the server, and such libraries generally do not work inside server components. Check the framework and library docs before choosing. CSS Modules and Sass are supported by most frameworks out of the box.

## Developer experience

- **Sass** is familiar to most front-end developers, but the global namespace demands care.
- **CSS Modules** are the same CSS, imported as an object. The downside: dynamic styles need class combinations or CSS variables.
- **CSS-in-JS** is convenient when styles depend heavily on state and props, and it types well with TypeScript. The downside is mixing logic and styles in one file, which not everyone likes.

## Recommendation matrix

| Project type | Recommendation |
|---|---|
| Landing page or multi-page site without a framework | Sass + BEM |
| React/Next.js app with SSR | CSS Modules (optionally with Sass) or zero-runtime CSS-in-JS |
| SPA without SSR and with rich theme dynamics | CSS-in-JS, runtime is acceptable |
| Design system for several products | zero-runtime CSS-in-JS or CSS Modules + CSS variables for tokens |
| Legacy project on global CSS | gradual migration to CSS Modules, component by component |

A separate option is utility-first frameworks such as Tailwind CSS: a different approach that solves scoping by not writing your own classes at all.

## Common mistakes

- **Mixing all three approaches** in one project without rules, which makes styles hard to find.
- **Computing at runtime what a CSS variable could express**: theme colors, spacing, sizes.
- **Not centralizing tokens** (colors, fonts, spacing). Whatever the approach, they should live in one place.

## FAQ

### Do I need Sass now that CSS has variables and nesting?

Less and less. Native CSS variables and nesting cover most tasks. Sass is still useful for mixins, functions and loops, and in projects that already use it.

### Can CSS Modules be used with Sass?

Yes, it is a common pairing: a `component.module.scss` file gives you both scoped classes and Sass features. Most bundlers support it with minimal setup.

### Is runtime CSS-in-JS obsolete?

No, but in projects with server rendering and server components it is increasingly replaced by zero-runtime approaches. In client-side SPAs it remains a workable option.
