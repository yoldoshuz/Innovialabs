import type { Locale } from "@/lib/i18n/config";
import type { ContactDict, ContactFormDict } from "@/types";
import { GiantTitle } from "@/components/motion/giant-title";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/contact/contact-form";

/** Final brief: calm, same white/paper palette as the rest of the page. */
export function ContactSection({
  lang,
  dict,
  form,
}: {
  lang: Locale;
  dict: ContactDict;
  form: ContactFormDict;
}) {
  return (
    <section id="contact" className="section shell scroll-mt-24">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <GiantTitle className="text-[clamp(2.5rem,5.6vw,5.5rem)] leading-[0.92]">
            {dict.title}
          </GiantTitle>
          <Reveal delay={0.1}>
            <p className="type-lead mt-6 max-w-md text-muted">{dict.lead}</p>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="lg:col-span-7">
          <ContactForm lang={lang} dict={form} telegramLabel={dict.telegram} />
        </Reveal>
      </div>
    </section>
  );
}
