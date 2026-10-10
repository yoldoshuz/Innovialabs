/**
 * Global site configuration. Contacts marked TODO need confirmation from the
 * team before launch — everything else is final brand data. The slogan is
 * localized (`meta.slogan` in the dictionaries).
 */
export const siteConfig = {
  name: "Innovialabs",
  legalName: "Innovialabs",
  alternateNames: ["Innovia Labs", "Innovia Lab", "Инновиалабс"],
  signature: "Innovation via Lab",
  // Used as metadataBase and for absolute URLs in SEO files.
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://innovialabs.uz").replace(
    /\/$/,
    "",
  ),
  email: "hello@innovialabs.uz",
  // TODO: real phone number (shown only when set).
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "",
  telegram: {
    // Public bot that also receives form submissions.
    bot: "https://t.me/innovialabs_bot",
    handle: "@innovialabs_bot",
  },
  // Official profiles for Organization.sameAs. TODO: add Instagram/LinkedIn when live.
  sameAs: ["https://t.me/innovialabs_bot"],
  address: {
    city: "Tashkent",
    region: "Toshkent shahri",
    country: "UZ",
  },
  foundingYear: 2025,
  logo: {
    horizontal: "/Innovialabs-logo/svg/innovialabs-logo-horizontal.svg",
    horizontalWhite: "/Innovialabs-logo/svg/innovialabs-logo-horizontal-white.svg",
    mark: "/Innovialabs-logo/svg/innovialabs-mark.svg",
    markSmall: "/Innovialabs-logo/svg/innovialabs-mark-small.svg",
    png: "/Innovialabs-logo/png/innovialabs-app-icon-512.png",
  },
} as const;
