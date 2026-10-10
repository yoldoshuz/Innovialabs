---
title: Terraform vs Ansible: Provisioning vs Configuration Management
description: How Terraform differs from Ansible: provisioning versus configuration, state versus stateless, where they overlap and a practical workflow that uses both.
summary: Terraform creates and changes infrastructure (servers, networks, databases, DNS) and tracks it in a state file, while Ansible configures what already exists (packages, files, services); in practice Terraform provisions resources and Ansible makes them ready to run.
---
## The short answer

**Terraform** answers "what infrastructure should exist": virtual machines, networks, load balancers, managed databases, DNS records, storage buckets. **Ansible** answers "what should be inside a server": installed packages, nginx configs, users, systemd services, application deployment.

The first is called **provisioning**, the second **configuration management**. They are not rivals but two layers of the same job.

## Provisioning vs configuration

| | Terraform | Ansible |
|---|---|---|
| Main job | Create, change, delete cloud resources | Configure OS and applications on hosts |
| Style | Declarative: describe the end state | Procedural in form (ordered tasks), idempotent in effect |
| State | Keeps a **state file** | Keeps no state, checks the host every run |
| How it connects | Provider APIs (AWS, GCP, Azure and others) | SSH (or WinRM) to hosts |
| Language | HCL | YAML playbooks |
| Agent on server | Not needed | Not needed |

## State vs stateless

**Terraform keeps state**: a file mapping your code to the real resources it created. That is why `terraform plan` can show an exact diff of what will be created, changed and destroyed. Remove a resource from code and Terraform removes it from the cloud.

The price:

- state belongs in a **remote backend** (S3-compatible storage, Terraform Cloud and similar) with locking, not in your repo;
- state can contain secrets, so access must be restricted;
- manual changes in the cloud console cause **drift** between code and reality.

**Ansible keeps no state.** Every run connects to the host and checks: is the package installed? does the file match? If yes, it does nothing. That is **idempotency**. The downside: Ansible does not know what you removed from a playbook. Delete the task that installs a package and the package stays on the server; you must remove it explicitly with `state: absent`.

## Where they overlap

The line is blurry:

- Ansible has cloud modules and can create virtual machines;
- Terraform has `user_data`/cloud-init and provisioners that can run scripts on a server.

You can technically get by with one tool, but it is usually awkward. Without state, Ansible struggles to manage the lifecycle of cloud resources, especially deletion, and Terraform's own documentation treats provisioners as a last resort.

## A common workflow using both

1. **Terraform** creates the network, VMs, load balancer, database and DNS.
2. Terraform exposes IP addresses via `output` or generates an Ansible inventory.
3. **Ansible** connects to the new machines: installs Docker or a runtime, places configs, creates users, enables monitoring agents.
4. Application deployment runs in CI/CD, through Ansible or a separate pipeline.

A minimal handoff:

```hcl
output "web_ips" {
  value = aws_instance.web[*].public_ip
}
```

```bash
terraform apply
terraform output -json web_ips | jq -r '.[]' > hosts.txt
ansible-playbook -i hosts.txt site.yml
```

In container-based setups Ansible's role often shrinks: images are built in CI and servers barely need hand configuration. Still, baseline host preparation (updates, SSH hardening, monitoring agents) is a natural fit for Ansible.

## Common mistakes

- **Keeping state locally** or committing it to git: lost files and conflicts when two people work.
- **Editing resources by hand in the console**, then being surprised by the Terraform plan.
- **Doing all server setup through provisioners**: hard to debug and repeat.
- **Writing Ansible tasks with `shell` and `command`** where a proper module exists, losing idempotency.
- **Storing secrets in plain text** variables; use Ansible Vault or a secrets manager.

## How to choose

- You need to create and destroy cloud resources and review a change plan: **Terraform** (or its open fork OpenTofu).
- You have a fleet of servers that must be configured the same way: **Ansible**.
- You have both: use both, with clear boundaries. Terraform owns everything up to "the machine exists", Ansible owns what happens after.

## FAQ

### Can I use only Ansible?

Yes. For a small setup of a few servers created manually or through a hosting panel, Ansible is often enough. Trouble starts when resources multiply and you need to track and delete them reliably.

### Do I need Ansible if everything runs on Kubernetes?

Inside the cluster, usually not: configuration lives in manifests and Helm charts. Ansible can still help prepare nodes if you run them yourself instead of using a managed cluster.

### What if someone changed a resource manually?

Run `terraform plan` to see the drift. Then either apply to bring the resource back to what the code says, or move the manual change into code so there is a single source of truth.
