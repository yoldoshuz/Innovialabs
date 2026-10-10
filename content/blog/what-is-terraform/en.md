---
title: What Is Terraform: Providers, Resources and the Plan-Apply Cycle
description: Terraform describes servers, networks and databases as code. Learn HCL, providers, resources, state and the init, plan, apply cycle with a simple example.
summary: Terraform is an Infrastructure as Code tool: you describe the infrastructure you want in HCL files, and it compares that with reality and creates, changes or deletes resources through the cloud API.
---
## What Terraform is, in plain words

**Terraform** is a tool for **Infrastructure as Code (IaC)**. Instead of clicking through a cloud console, you write a text file: "I need a server of this size, in this network, with this firewall". Terraform reads the file, compares it with what already exists and brings the infrastructure to the described state.

The key idea is that it is **declarative**: you describe the *result*, not the sequence of steps. Terraform figures out how to get there.

What this gives you in practice:

- infrastructure lives in Git and changes go through code review;
- identical environments (staging, production) come from the same code;
- you see what will change before anything is applied;
- after a failure you can rebuild an environment instead of recalling what was configured by hand.

## Core concepts

| Concept | What it is |
|---|---|
| **HCL** | HashiCorp Configuration Language, the language of `.tf` files; readable, like JSON with comments |
| **Provider** | A plugin for a specific platform: AWS, Google Cloud, Azure, DigitalOcean, Cloudflare and many more |
| **Resource** | An object Terraform manages: a server, a DNS record, a bucket, a database |
| **Data source** | Reads existing data (for example an OS image ID) without managing it |
| **Variable / Output** | Input parameters and values Terraform prints after applying |
| **State** | A file where Terraform maps code to real resources |

## A minimal example: one server

This example uses DigitalOcean, but the structure is nearly the same for any provider:

```hcl
terraform {
  required_providers {
    digitalocean = {
      source = "digitalocean/digitalocean"
    }
  }
}

variable "do_token" {
  type      = string
  sensitive = true
}

provider "digitalocean" {
  token = var.do_token
}

resource "digitalocean_droplet" "web" {
  name   = "web-1"
  image  = "ubuntu-24-04-x64"
  region = "fra1"
  size   = "s-1vcpu-1gb"
}

output "ip" {
  value = digitalocean_droplet.web.ipv4_address
}
```

The token never goes into code: pass it via the `TF_VAR_do_token` environment variable or a separate file that is excluded from Git.

## The init → plan → apply cycle

```bash
terraform init     # download providers, set up the state backend
terraform plan     # show what will be created, changed, destroyed
terraform apply    # apply changes after confirmation
terraform destroy  # delete everything described in the configuration
```

- **init** runs once in a new project and again after changing providers or the backend.
- **plan** is the most important step. Read it carefully: `+`, `~` and `-` mean create, update and destroy. Watch out for **replacement** (`-/+`): the server will be deleted and recreated.
- **apply** executes the plan. In CI the plan is usually saved to a file (`terraform plan -out=tfplan`) and exactly that file is applied, so there are no surprises.

## Why state exists and where to keep it

State is Terraform's memory. Without it, Terraform does not know that the `web` server in code is a particular machine with a particular ID in the cloud.

Rules for state:

- **store it remotely** (S3-compatible storage, Terraform Cloud and similar), not on a developer's laptop;
- **enable state locking** so two people cannot run `apply` at the same time;
- **never commit state to Git**, it can contain passwords and keys in plain text;
- **do not edit the file by hand**, use `terraform state` and `terraform import` commands.

## Common mistakes

- **Manual changes in the cloud console.** Terraform detects the drift and reverts it on the next `apply`.
- **One huge file for everything.** Split code into modules and environments.
- **Unpinned provider versions.** Set version constraints and commit `.terraform.lock.hcl`.
- **Applying without reading the plan.** The most common route to an accidentally deleted database.
- **Secrets in `.tf` files.** Use environment variables or a secrets manager.

## When you need Terraform and when you do not

Terraform pays off when your cloud setup has several components, several environments, or a team that needs a history of changes. For a single VPS configured once a year it can be overkill; a documented checklist may be enough.

Know the boundary: Terraform **provisions** infrastructure, while installing packages and configuring software inside servers is usually done by other tools such as Ansible, or by prebuilt images and containers.

Official documentation: [developer.hashicorp.com/terraform](https://developer.hashicorp.com/terraform/docs).

## FAQ

### How is Terraform different from OpenTofu?

OpenTofu is an open-source fork of Terraform created after HashiCorp changed its license. HCL syntax and the basic workflow are compatible, so skills transfer. The choice usually depends on your company's licensing requirements and the integrations you need.

### Can Terraform manage infrastructure that already exists?

Yes. Resources created by hand can be described in code and attached to state with `terraform import` or `import` blocks. Do it gradually and make sure `plan` shows no unexpected changes after importing.

### Do I need to be a programmer to write Terraform?

Deep programming skills are not required: HCL is declarative and easy to read. But you do need to understand networking, cloud services and Git basics, because Terraform only automates what you should already understand.
