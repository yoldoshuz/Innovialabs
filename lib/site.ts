/**
 * Global site configuration. Contacts marked TODO need confirmation from the
 * team before launch — everything else is final brand data.
 */
export const siteConfig = {
  name: "Innovialabs",
  legalName: "Innovialabs",
  slogan: "Where ideas become products.",
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
  address: {
    city: "Tashkent",
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
