import type { FaqDict } from "@/types";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Accordion } from "@/components/ui/accordion";

export function Faq({ dict }: { dict: FaqDict }) {
  return (
    <section id="faq" className="scroll-mt-24 py-20 lg:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.3fr] lg:items-start">
          <SectionHeading
            badge={dict.badge}
            title={dict.title}
            subtitle={dict.subtitle}
            align="left"
            className="lg:sticky lg:top-28"
          />
          <Reveal>
            <Accordion items={dict.items} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
