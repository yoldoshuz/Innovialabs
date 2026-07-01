/**
 * Global site configuration. Placeholder values — swap with real brand data
 * once the team approves naming and content.
 */
export const siteConfig = {
  name: "Osmi",
  // Used as metadataBase and for absolute URLs in SEO files.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://osmi.example.com",
  email: "hello@osmi.example.com",
  phone: "+998 (00) 000-00-00",
  social: {
    telegram: "https://t.me/",
    linkedin: "https://linkedin.com/",
    github: "https://github.com/",
  },
} as const;
