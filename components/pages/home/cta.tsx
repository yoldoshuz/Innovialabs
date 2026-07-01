import { Mail, Phone } from "lucide-react";
import type { CtaDict } from "@/types";
import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/shared/reveal";
import { ContactForm } from "@/components/shared/contact-form";
import { siteConfig } from "@/lib/site";

export function Cta({ dict }: { dict: CtaDict }) {
  return (
    <section id="contact" className="scroll-mt-24 py-20 lg:py-32">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-surface-2/80 to-surface/30 p-8 sm:p-12 lg:p-16">
          <div className="pointer-events-none absolute -left-24 -top-24 size-96 rounded-full bg-primary/15 blur-[120px]" />

          <div className="relative grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal className="flex flex-col gap-6">
              <Badge>{dict.badge}</Badge>
              <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                {dict.title}
              </h2>
              <p className="text-pretty text-base leading-relaxed text-muted sm:text-lg">
                {dict.subtitle}
              </p>

              <div className="mt-2 flex flex-col gap-3">
                <span className="font-mono text-xs uppercase tracking-widest text-subtle">
                  {dict.contactsLabel}
                </span>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex items-center gap-3 text-foreground transition-colors hover:text-primary"
                >
                  <Mail className="size-5 text-primary" />
                  {siteConfig.email}
                </a>
                <a
                  href={`tel:${siteConfig.phone.replace(/[^+\d]/g, "")}`}
                  className="inline-flex items-center gap-3 text-foreground transition-colors hover:text-primary"
                >
                  <Phone className="size-5 text-primary" />
                  {siteConfig.phone}
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <ContactForm dict={dict.form} />
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
