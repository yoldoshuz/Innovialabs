import type { CompanyDict } from "@/types";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";
import { Icon } from "@/components/shared/icon";
import { Counter } from "@/components/anim/counter";

export function CompanyView({ dict }: { dict: CompanyDict }) {
  return (
    <>
      {/* Intro + stats */}
      <section className="py-20 lg:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal className="flex flex-col gap-6">
              <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                {dict.intro.title}
              </h2>
              {dict.intro.paragraphs.map((p, i) => (
                <p key={i} className="text-pretty leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </Reveal>

            <RevealGroup className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
              {dict.stats.map((stat) => (
                <RevealItem
                  key={stat.label}
                  className="flex flex-col gap-1 bg-surface/60 px-6 py-8"
                >
                  <span className="font-display text-4xl font-bold tracking-tight text-gradient">
                    <Counter value={stat.value} />
                  </span>
                  <span className="text-sm text-muted">{stat.label}</span>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28">
        <Container>
          <SectionHeading
            title={dict.values.title}
            subtitle={dict.values.subtitle}
          />
          <RevealGroup className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {dict.values.items.map((item) => (
              <RevealItem
                key={item.title}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-surface/40 p-7 transition-colors hover:border-primary/40"
              >
                <span className="grid size-12 place-items-center rounded-xl border border-border-strong bg-elevated text-primary">
                  <Icon name={item.icon} className="size-6" />
                </span>
                <h3 className="text-lg font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* Timeline */}
      <section className="py-20 lg:py-28">
        <Container>
          <SectionHeading
            title={dict.timeline.title}
            subtitle={dict.timeline.subtitle}
            align="left"
          />
          <RevealGroup className="mt-16 flex flex-col">
            {dict.timeline.items.map((item) => (
              <RevealItem
                key={item.year}
                className="grid gap-4 border-t border-border py-8 sm:grid-cols-[160px_1fr]"
              >
                <span className="font-mono text-2xl font-semibold text-gradient">
                  {item.year}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-pretty leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* Team */}
      <section className="py-20 lg:py-28">
        <Container>
          <SectionHeading
            title={dict.team.title}
            subtitle={dict.team.subtitle}
          />
          <RevealGroup className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {dict.team.members.map((member, i) => (
              <RevealItem
                key={i}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-surface/40 p-6 text-center"
              >
                <span
                  aria-hidden
                  className="mx-auto grid size-20 place-items-center rounded-full bg-gradient-to-br from-primary/25 to-secondary/25 text-2xl font-semibold"
                >
                  {member.name.charAt(0)}
                </span>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{member.name}</span>
                  <span className="text-sm text-muted">{member.role}</span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>
    </>
  );
}
