---
title: VS Code Shortcuts and Tricks to Code Faster
description: Multi-cursor editing, the command palette, quick navigation, refactoring, snippets and custom keybindings in VS Code for Windows and macOS, with examples.
summary: Most of the speed in VS Code comes from five habits: using the command palette instead of menus, jumping to files and symbols from the keyboard, multi-cursor editing, refactoring with F2 and Ctrl+., and your own snippets and keybindings.
---
## The habits that save the most time

You do not need to memorize a hundred shortcuts. A handful of techniques deliver nearly all of the gain:

- **Command palette** — every editor feature is reachable by name, no menu hunting.
- **Quick navigation** — open a file, jump to a function or a line without touching the mouse.
- **Multi-cursor** — edit several places at once.
- **Refactoring** — renames and quick fixes that understand code, not just text.
- **Snippets and custom keys** — repetitive actions become a single keystroke.

Shortcuts below are written as **Windows / macOS**. Linux mostly matches Windows.

## Command palette and file search

| Action | Windows | macOS |
|---|---|---|
| Command palette | Ctrl+Shift+P | Cmd+Shift+P |
| Open file by name | Ctrl+P | Cmd+P |
| Symbol in current file | Ctrl+Shift+O | Cmd+Shift+O |
| Symbol in workspace | Ctrl+T | Cmd+T |
| Go to line | Ctrl+G | Ctrl+G |
| Search across files | Ctrl+Shift+F | Cmd+Shift+F |

A useful detail: the **Ctrl+P** box accepts prefixes. `>` turns it into the command palette, `@` searches symbols in the file, `:` jumps to a line. One shortcut covers all of them.

## Navigating code

- **F12** — go to the definition of a function or class.
- **Alt+F12 / Option+F12** — peek the definition inline without leaving the current file.
- **Shift+F12** — show every reference to a symbol.
- **Alt+← / Ctrl+-** — go back to where you were before the jump.
- **Ctrl+Tab** — switch between open editors.

The loop "F12, read, go back" replaces manual project-wide searching most of the time.

## Multi-cursor editing

| Action | Windows | macOS |
|---|---|---|
| Add cursor by click | Alt+click | Option+click |
| Cursor above / below | Ctrl+Alt+↑/↓ | Cmd+Option+↑/↓ |
| Select next match | Ctrl+D | Cmd+D |
| Skip a match | Ctrl+K Ctrl+D | Cmd+K Cmd+D |
| Select all matches | Ctrl+Shift+L | Cmd+Shift+L |
| Cursor at end of each selected line | Shift+Alt+I | Shift+Option+I |

A typical flow: select a variable name, press **Ctrl+D** a few times and start typing — every selected occurrence changes. For a column (box) selection, drag with **Shift+Alt** held (**Shift+Option** on macOS).

## Line editing

- **Alt+↑/↓ / Option+↑/↓** — move a line.
- **Shift+Alt+↑/↓ / Shift+Option+↑/↓** — duplicate a line.
- **Ctrl+Shift+K / Cmd+Shift+K** — delete a line.
- **Ctrl+/ / Cmd+/** — toggle a comment.
- **Shift+Alt+F / Shift+Option+F** — format the document.

## Refactoring

- **F2** — rename a symbol across the project. Unlike find-and-replace, the editor respects scope and leaves same-named variables elsewhere alone.
- **Ctrl+. / Cmd+.** — quick fixes and refactorings: add a missing import, extract code into a function or constant, fix a linter warning.

What is available depends on the language and installed extensions. TypeScript and JavaScript get a rich set out of the box; other languages need their language extension.

## Your own snippets

A snippet is a template that expands from a short prefix. Open the command palette, type "snippets" and choose to configure snippets for a language or for the current project.

```json
{
  "React component": {
    "prefix": "rfc",
    "body": [
      "export function ${1:Component}() {",
      "  return <div>$0</div>;",
      "}"
    ],
    "description": "React function component"
  }
}
```

`$1` is the first tab stop, `$0` is where the cursor ends up. Project-level snippets live in the `.vscode` folder and get committed, so the whole team can use them.

## Custom keybindings

Open the keyboard shortcuts editor with **Ctrl+K Ctrl+S / Cmd+K Cmd+S**. It shows which keys are already taken. For precise control, open the JSON view (icon in the top-right corner of the shortcuts editor):

```json
[
  {
    "key": "shift+alt+d",
    "command": "editor.action.duplicateSelection",
    "when": "editorTextFocus"
  }
]
```

The `when` clause limits where the binding applies and helps avoid conflicts.

## Common mistakes

- Trying to learn everything at once. Pick 3–4 shortcuts per week until they become muscle memory.
- Clicking through menus for actions that are one search away in the command palette.
- Renaming with find-and-replace instead of **F2** and catching unrelated matches.
- Binding custom keys on top of operating system shortcuts.

## FAQ

### Can I keep the shortcuts from my previous editor?

Yes. The extensions marketplace has keymap packs for popular editors and IDEs. They remap the main shortcuts so you do not have to relearn everything.

### How do I sync shortcuts and snippets between computers?

Turn on the built-in Settings Sync with your account. It carries settings, keybindings, snippets and the list of installed extensions.

### Where can I see the full list of shortcuts?

The command palette has a command that opens a printable keyboard shortcuts reference for your OS. The shortcuts editor is often handier, though: you can search by action name or by the key itself.
