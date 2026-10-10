---
title: Best VS Code Extensions for Web Developers
description: VS Code extensions for web developers by purpose: linting, formatting, Git, Docker, REST and AI assistants, how to configure them and keep the editor fast.
summary: A web developer needs one extension per job — ESLint, Prettier, GitLens, the Docker or Dev Containers extension, a REST client and an AI assistant — configured per project in .vscode and checked regularly so the editor stays fast.
---
## The short answer

A good set of extensions is small: **one tool per task**. For most web projects that means:

| Purpose | Extension | What it does |
|---|---|---|
| Linting | **ESLint**, **Stylelint** | Highlights errors and bad patterns in JS/TS and CSS |
| Inline errors | **Error Lens** | Shows the error text right on the line |
| Formatting | **Prettier**, **EditorConfig** | One code style for the whole team |
| Git | **GitLens**, **Git Graph** | Who changed a line and why, branch history |
| Containers | **Docker** / **Container Tools** (Microsoft), **Dev Containers** | Manage containers, develop inside one |
| REST | **REST Client** or **Thunder Client** | Send API requests without leaving the editor |
| AI | **GitHub Copilot** or an alternative such as **Continue** | Completions, chat, explanations |
| Frontend | **Tailwind CSS IntelliSense**, **Code Spell Checker** | Class hints, typo detection |

Install only the rows you actually use. Each extension is code running in your editor.

## Linting and formatting

**ESLint** finds problems, **Prettier** formats. They should not fight: in a modern setup ESLint handles code quality and Prettier handles layout, so formatting rules in ESLint are disabled with the project's config.

Settings that make them work on save:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

The ESLint extension uses the `eslint` package and config from your project, so install them as dev dependencies. The same goes for Prettier: a `.prettierrc` in the repository makes formatting identical for everyone. **EditorConfig** adds basic rules — indentation, line endings — that work in any editor.

## Git

The built-in Source Control panel covers commits, diffs and branches. **GitLens** adds blame annotations on each line, file and line history, and comparisons between branches. **Git Graph** draws the commit graph. If GitLens feels heavy, turn off the features you do not use in its settings — inline blame and code lens can be switched off separately.

## Docker and Dev Containers

The **Docker** extension from Microsoft (newer releases are named **Container Tools**) shows containers, images and volumes, gives syntax help for `Dockerfile` and `compose` files and lets you view logs or open a shell with a click. **Dev Containers** goes further: the project describes its environment in `.devcontainer/devcontainer.json`, and VS Code opens the code inside a container with the right Node or Python version. New team members get a working environment without manual installation.

## REST clients

**REST Client** keeps requests in plain `.http` files that you can commit next to the code:

```http
@baseUrl = http://localhost:3000

### List users
GET {{baseUrl}}/api/users
Accept: application/json

### Create user
POST {{baseUrl}}/api/users
Content-Type: application/json

{"name": "Aziz"}
```

Click **Send Request** above a request and the response opens beside it. **Thunder Client** offers a Postman-like visual interface inside VS Code. Never commit real tokens: keep them in environment variables or local, git-ignored files.

## AI assistants

**GitHub Copilot** offers completions and a chat that sees your open files. Alternatives such as **Continue** can connect to different models, including locally run ones. Before using any assistant on commercial code, check the company's policy: what code is sent to the provider and whether it may be used for training. Treat suggestions like a junior colleague's code — review them, especially around security.

## Share the set with the team

Put recommendations into `.vscode/extensions.json` in the repository:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "EditorConfig.EditorConfig"
  ]
}
```

VS Code offers to install them when someone opens the project. Shared settings go into `.vscode/settings.json`.

## Keeping the editor fast

- **Measure.** Command Palette → **Developer: Show Running Extensions** shows activation time for each extension.
- **Find the culprit.** **Help: Start Extension Bisect** disables half the extensions at a time until the problem is found.
- **Disable per workspace.** A Python linter is not needed in a frontend project: use **Disable (Workspace)**.
- **Use Profiles** — separate sets of extensions and settings for web, Python or writing.
- **Avoid duplicates:** two formatters or two Git UIs doing the same thing.
- **Exclude build folders** from file watching and search:

```json
{
  "files.watcherExclude": { "**/dist/**": true, "**/.next/**": true },
  "search.exclude": { "**/dist": true, "**/.next": true }
}
```

- **Check the publisher.** Prefer verified publishers and actively maintained extensions; an extension has the same access to your files as you do.

## FAQ

### Prettier or ESLint for formatting?

Prettier for formatting, ESLint for code quality. Let Prettier own the layout and keep ESLint focused on bugs and patterns; this avoids conflicting fixes on save.

### How many extensions is too many?

There is no magic number. If startup or typing feels slow, check running extensions and their activation time, then remove or disable per workspace whatever you have not used recently.

### Do I need Postman if I have REST Client?

For personal testing and requests stored next to code, REST Client or Thunder Client is usually enough. Postman is more useful for shared collections, documentation, mock servers and automated API tests across a team.
