import { i18n } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { caseMeta, type CaseSlug } from "@/lib/content";
import { blogCategories, countByCategory } from "@/lib/blog";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

/**
 * /llms.txt — a plain-text brief for AI assistants and answer engines:
 * who we are, what we do, where the canonical pages are. Built from the
 * same dictionaries as the site, so it never drifts from the copy.
 */
export async function GET() {
  const [ru, en] = await Promise.all([getDictionary("ru"), getDictionary("en")]);
  const base = siteConfig.url;
  const lines = [
    `# ${siteConfig.name} — ${en.meta.slogan}`,
    "",
    `> ${en.meta.description}`,
    "",
    "## About",
    `- Brand: ${siteConfig.name} (${siteConfig.alternateNames.join(", ")})`,
    `- Signature: ${siteConfig.signature}`,
    `- Type: IT development studio (websites, mobile apps, Telegram bots and Mini Apps, CRM, integrations, AI automation)`,
    `- Founded: ${siteConfig.foundingYear}`,
    `- Headquarters: Tashkent, Uzbekistan`,
    `- Languages: ${i18n.locales.join(", ")} (Russian is the default)`,
    `- Email: ${siteConfig.email}`,
    `- Telegram: ${siteConfig.telegram.bot}`,
    ...(siteConfig.phone ? [`- Phone: ${siteConfig.phone}`] : []),
    "",
    "## Services",
    ...en.services.items.map((s) => `- [${s.title}](${base}/en/services/${s.slug}): ${s.subtitle}. ${s.points.join("; ")}.`),
    "",
    "## Case studies",
    ...en.cases.items.map((c) => {
      const meta = caseMeta[c.slug as CaseSlug];
      return `- [${c.name}](${base}/en/cases/${c.slug}): ${c.tagline}. ${c.did}${meta.url ? ` Live: ${meta.url}` : ""}`;
    }),
    "",
    "## How we work",
    ...en.process.steps.map((s, i) => `${i + 1}. ${s.title} — ${s.text}`),
    "",
    "## FAQ",
    ...en.faq.items.flatMap((f) => [`- Q: ${f.question}`, `  A: ${f.answer}`]),
    "",
    "## Blog (practical IT articles in en, ru, uz)",
    ...blogCategories
      .filter((c) => countByCategory()[c] > 0)
      .map((c) => `- [${en.blog.categories[c]}](${base}/en/blog/category/${c}): ${countByCategory()[c]} articles`),
    "",
    "## Key pages",
    `- Home: ${base}/ru · ${base}/en · ${base}/uz`,
    `- Services: ${base}/en/services`,
    `- Cases: ${base}/en/cases`,
    `- About: ${base}/en/company`,
    `- Contacts: ${base}/en/contacts`,
    `- Discuss a project (brief): ${base}/en/brief`,
    `- Blog: ${base}/en/blog`,
    "",
    "## На русском",
    `${ru.meta.slogan} ${ru.meta.description}`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
