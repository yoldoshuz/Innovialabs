---
title: What Is Infrastructure as Code and Why It Matters
description: What Infrastructure as Code is, how declarative and imperative approaches differ, why infrastructure belongs in Git, and which IaC tools to consider.
summary: Infrastructure as Code means describing servers, networks and services in text files that live in Git and are applied automatically, which makes infrastructure reproducible, reviewable and self-documenting.
---
## What Infrastructure as Code is

**Infrastructure as Code (IaC)** is an approach where you do not configure infrastructure by hand in a provider's console or over SSH. Instead, you **describe it in files**: which servers, networks, databases, DNS records and access rules you need. A tool reads that description and makes the real infrastructure match it.

The core idea: infrastructure follows the same rules as application code, with change history, reviews and automated checks.

## Declarative vs imperative

| | Declarative | Imperative |
|---|---|---|
| What you describe | **Desired state**: "I need 3 servers and a load balancer" | **Steps**: "create a server, then install a package, then…" |
| Who decides how to get there | The tool | You |
| Running it again | Changes nothing if the state is already reached | May repeat actions unless you add checks |
| Examples | Terraform, OpenTofu, CloudFormation, Kubernetes manifests | Shell scripts, some Ansible playbooks, Pulumi in a general-purpose language |

A declarative example in Terraform:

```hcl
resource "aws_s3_bucket" "assets" {
  bucket = "my-project-assets"
}
```

You do not write "create a bucket"; you write "this bucket must exist". If it does not, Terraform creates it; if it exists and matches, nothing happens.

The line is not absolute: Ansible also aims for **idempotency**, and Pulumi describes desired state in TypeScript or Python. What matters is understanding what you actually produce: a description of state or a sequence of commands.

## Why infrastructure belongs in Git

- **Change history.** You see who opened a port or resized a server, when and why.
- **Review.** Infrastructure changes go through pull requests like any code, so mistakes are caught before they are applied.
- **Rollback.** You can return to a previous configuration version.
- **Documentation.** The files are the current description of the system, with no separate diagram that goes stale.
- **Automation.** CI/CD shows the change plan and applies it after approval. This workflow is often called **GitOps**.

## Reproducibility: the main practical benefit

When infrastructure is code, you can **rebuild it** with a single command:

- spin up a **staging** environment identical to production and test there instead of on live systems;
- create an environment for a new client or region from the same template;
- recover from an outage faster than from an administrator's memory;
- eliminate **configuration drift**, where servers slowly diverge because of manual edits.

## Overview of the main tools

- **Terraform / OpenTofu** create cloud infrastructure across providers: servers, networks, databases, DNS. OpenTofu is an open-source fork of Terraform with compatible syntax.
- **Pulumi** solves the same task, but you write in TypeScript, Python, Go and other languages.
- **AWS CloudFormation, Azure Bicep** are tools tied to one cloud.
- **Ansible** configures servers that already exist: packages, configs, users. It works over SSH with no agents.
- **Kubernetes manifests and Helm** describe applications and their environment inside a cluster.
- **Docker / Dockerfile** describes the environment of a single application.

A typical combination: **Terraform creates** resources, **Ansible or images configure** them, **Kubernetes runs** the applications.

## How to get started

1. Describe one small but real piece in code, such as DNS records or a test server.
2. Store **state** (Terraform's state file) in remote storage with locking, not on a laptop.
3. Move secrets out of code into a secrets manager or CI variables.
4. Forbid manual console changes for anything already described in code.
5. Add a `plan` step to CI for every pull request.

## Common mistakes

- **Mixing manual edits with IaC**: the tool will overwrite changes or fail on mismatches.
- **Storing passwords and keys in the repository.**
- **One giant file for all infrastructure**: split it into modules and environments.
- **Applying without reading the plan**, especially when resources are being destroyed.

## FAQ

### Does a small project with one server need IaC?
Not necessarily, but even a simple server description in Ansible or Docker Compose saves time when you move or restore it. The longer a project lives, the more it pays off.

### How is Terraform different from Ansible?
Terraform mainly creates and destroys infrastructure resources, while Ansible configures what already exists. They are often used together.

### Can existing infrastructure be moved into code?
Yes. Terraform has a mechanism for importing existing resources. Teams usually do it gradually, starting with the most important components.
