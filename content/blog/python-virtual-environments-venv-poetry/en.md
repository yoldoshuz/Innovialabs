---
title: Python Virtual Environments: venv, pip and Poetry Guide
description: Why Python virtual environments matter, how to set up venv and Poetry, pin dependency versions and avoid common mistakes on Windows and Linux.
summary: A virtual environment is an isolated folder with Python and the packages of one project; create it with venv or Poetry and pin dependency versions in a file.
---

## Why you need a virtual environment

A **virtual environment** is a separate folder with its own Python interpreter and its own packages. Without it, every project installs libraries into the shared system Python, and sooner or later one project needs one version of a library while another needs an incompatible one.

An environment solves three problems:

- **Isolation**: one project's packages do not break another.
- **Reproducibility**: a colleague or a server installs exactly the same versions.
- **A clean system**: no global installs and no admin rights needed.

## venv and pip: the built-in option

The `venv` module is part of the Python standard library, so there is nothing to install.

```bash
# create an environment in the .venv folder
python -m venv .venv

# activate: Linux / macOS
source .venv/bin/activate

# activate: Windows (PowerShell)
.venv\Scripts\Activate.ps1

# install a package and pin versions
pip install requests
pip freeze > requirements.txt
```

On another machine you restore the environment like this:

```bash
python -m venv .venv
# activate, then:
pip install -r requirements.txt
```

`pip freeze` records the **exact versions** of every installed package, including transitive dependencies. It is simple, but the file does not distinguish "packages you chose" from "packages pulled in by them".

## Poetry: dependencies and a lock file

**Poetry** manages the environment, dependencies and package builds through a single `pyproject.toml` file. Installing it with `pipx` keeps it separate from your projects.

```bash
pipx install poetry

poetry init            # create pyproject.toml in an existing project
poetry add requests    # add a dependency
poetry add --group dev pytest   # development-only dependency
poetry install         # install everything from poetry.lock
poetry run python main.py       # run inside the environment
```

Poetry keeps two files:

- `pyproject.toml` — **which** packages you need and the allowed version ranges;
- `poetry.lock` — the **exact** versions actually installed. Commit it to the repository.

## venv or Poetry

| Criterion | venv + pip | Poetry |
|---|---|---|
| Installation | Built into Python | Installed separately |
| Version pinning | Manual `pip freeze` | Automatic `poetry.lock` |
| Dev dependencies | Separate file by hand | Dependency groups |
| Learning curve | Minimal | Commands to learn |
| Best for | Scripts, small services, Docker | Team projects and libraries |

## Common mistakes

- **Environment in git.** Add `.venv` to `.gitignore`; commit only `requirements.txt` or `pyproject.toml` and `poetry.lock`.
- **Forgot to activate.** Packages silently go into the system Python. Check with `which python` (Linux) or `where python` (Windows).
- **Windows blocks activation.** PowerShell may forbid running scripts. `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` helps, or use `cmd` with `activate.bat`.
- **Linux without venv.** Some distributions ship the module as a separate package, such as `python3-venv`. You often need to type `python3` instead of `python` there too.
- **externally-managed-environment error.** Newer distributions block `pip install` into the system Python. Treat it as a signal to create an environment, not to bypass the block.
- **Moving the environment folder.** `.venv` contains absolute paths; after moving it, recreating is easier.

## FAQ

### Do I need a virtual environment inside Docker?

Not necessarily: the container is already isolated. You still need to pin dependency versions, otherwise builds made on different days will differ.

### Can I move from requirements.txt to Poetry?

Yes. Create `pyproject.toml` with `poetry init` and add your main packages with `poetry add`. Poetry resolves transitive dependencies itself and writes them to `poetry.lock`.

### What if the environment breaks?

Delete the `.venv` folder and recreate it from your dependency file. That is exactly why versions are pinned.
