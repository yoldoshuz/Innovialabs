---
title: VS Code for Beginners: Installation and First Setup
description: Install VS Code, learn its interface, open a project, use the built-in terminal, sync settings and pick a theme and font, plus the first settings to change.
summary: Download VS Code from the official site, open a project folder rather than single files, learn the Command Palette and the built-in terminal, turn on Settings Sync, and change a handful of settings such as auto save and format on save.
---
## The short answer

**Visual Studio Code** is a free code editor from Microsoft that works on Windows, macOS and Linux. To get going:

1. Install it from the official site, code.visualstudio.com.
2. Open a **folder** with your project, not individual files.
3. Learn two shortcuts: **Command Palette** and **Quick Open**.
4. Use the **built-in terminal** instead of a separate window.
5. Turn on **Settings Sync** and change a few defaults.

That takes about half an hour and saves time every day afterwards.

## Installation

- **Windows.** Download the User Installer. During setup, tick **Add to PATH** and the **Open with Code** options for the context menu: then you can open any folder from Explorer or type `code .` in a terminal.
- **macOS.** Download the archive, move Visual Studio Code to Applications. Then open the Command Palette and run **Shell Command: Install 'code' command in PATH**.
- **Linux.** Use the `.deb` or `.rpm` package from the official site or the package for your distribution.

Download only from the official site or your system's trusted package manager — rebuilt "portable" versions from random sites are a security risk.

## The interface in one minute

- **Activity Bar** — the icon strip on the left: Explorer, Search, Source Control (Git), Run and Debug, Extensions.
- **Side Bar** — the panel opened by those icons, for example the file tree.
- **Editor** — the main area with tabs; you can split it to see files side by side.
- **Panel** — bottom area: Terminal, Problems, Output, Debug Console.
- **Status Bar** — the bottom line: Git branch, errors, file language, line endings, indentation.

Key shortcuts (on macOS use Cmd instead of Ctrl):

| Action | Shortcut |
|---|---|
| Command Palette — any command by name | `Ctrl+Shift+P` |
| Quick Open — file by name | `Ctrl+P` |
| Toggle terminal | ``Ctrl+` `` |
| Search across the project | `Ctrl+Shift+F` |
| Toggle side bar | `Ctrl+B` |
| Settings | `Ctrl+,` |

If you remember only one, make it the **Command Palette**: type part of a command name and VS Code finds it.

## Opening projects

Use **File → Open Folder** or run `code .` in the project directory. VS Code treats the folder as a **workspace**: search, Git, the terminal and project settings all work relative to it. Recent projects are under **File → Open Recent**.

Project-specific settings live in `.vscode/settings.json` inside the folder and override your personal ones — useful when a team agrees on indentation or formatting.

## The integrated terminal

Open it with ``Ctrl+` ``. It starts in the project folder, so `npm install`, `git status` or `python main.py` run right away. You can open several terminals, split them and choose the shell: on Windows that might be PowerShell, Command Prompt or Git Bash. The default shell is set by **Terminal: Select Default Profile** in the Command Palette.

## Settings Sync

Click the account icon in the lower left and turn on **Backup and Sync Settings**, signing in with a GitHub or Microsoft account. VS Code then syncs settings, keyboard shortcuts, extensions, snippets and UI state between your computers. On a new laptop you sign in and get your familiar editor in a minute.

## Themes and fonts

- **Theme:** Command Palette → **Preferences: Color Theme**. The built-in Dark Modern and Light Modern themes are a good start; more are available as extensions.
- **Font:** a monospaced font designed for code, such as JetBrains Mono, Fira Code or Cascadia Code. Install it in the system first, then set it in settings.
- **Size:** comfortable for long sessions. Use `Ctrl+=` and `Ctrl+-` to zoom the whole interface.

## Essential first settings

Open **Preferences: Open User Settings (JSON)** from the Command Palette and add:

```json
{
  "files.autoSave": "afterDelay",
  "editor.formatOnSave": true,
  "editor.tabSize": 2,
  "editor.wordWrap": "on",
  "editor.fontFamily": "JetBrains Mono, Consolas, monospace",
  "editor.fontSize": 15,
  "editor.fontLigatures": true,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "editor.minimap.enabled": false
}
```

- `files.autoSave` — no more lost changes.
- `editor.formatOnSave` — code is formatted on every save once a formatter extension is installed.
- `editor.tabSize` — indentation width; follow your project's convention.
- `files.trimTrailingWhitespace` and `files.insertFinalNewline` — cleaner Git diffs.
- `editor.minimap.enabled` — the minimap takes space; many people turn it off.

## FAQ

### Is VS Code the same as Visual Studio?

No. Visual Studio is a full IDE mainly for .NET and C++ development on Windows. VS Code is a lighter, cross-platform editor that becomes an IDE for almost any language through extensions.

### Do I need extensions right away?

Only for your language and a formatter, for example Python or ESLint and Prettier. Add others when you feel a specific need — too many extensions slow the editor down.

### Where are my settings stored?

Personal settings are stored in a `settings.json` file in your user profile, project settings in `.vscode/settings.json`. Both open from the Command Palette, and project settings take priority.
