import type { FaqDict } from "@/types";
import { GiantTitle } from "@/components/motion/giant-title";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/** Single-open accordion: opening a question closes the previous one. */
export function Faq({ dict }: { dict: FaqDict }) {
  return (
    <section id="faq" className="section shell scroll-mt-24">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <GiantTitle className="text-[clamp(2.75rem,7vw,7rem)]">{dict.title}</GiantTitle>
          </div>
        </div>
        <Accordion
          type="single"
          collapsible
          defaultValue="item-0"
          className="flex flex-col gap-3 lg:col-span-7"
        >
          {dict.items.map((item, i) => (
            <AccordionItem key={item.question} value={`item-${i}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
