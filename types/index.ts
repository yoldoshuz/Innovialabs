import type ruDict from "@/lib/i18n/dictionaries/ru.json";

/**
 * The dictionary shape is derived from the Russian (base) JSON so translations
 * stay structurally in sync at compile time.
 */
export type Dictionary = typeof ruDict;

/** Convenience aliases for the per-section slices passed to components. */
export type NavDict = Dictionary["nav"];
export type HeroDict = Dictionary["hero"];
export type TrustDict = Dictionary["trust"];
export type ExpertiseDict = Dictionary["expertise"];
export type PlatformDict = Dictionary["platform"];
export type ResultsDict = Dictionary["results"];
export type ProcessDict = Dictionary["process"];
export type SocialDict = Dictionary["social"];
export type FaqDict = Dictionary["faq"];
export type CtaDict = Dictionary["cta"];
export type FooterDict = Dictionary["footer"];

export type CommonDict = Dictionary["common"];
export type CtaBandDict = Dictionary["ctaBand"];
export type CompanyDict = Dictionary["company"];
export type ServicesDict = Dictionary["services"];
export type ServiceItem = ServicesDict["items"][number];
export type CasesDict = Dictionary["cases"];
export type CaseItem = CasesDict["items"][number];
export type ContactsDict = Dictionary["contacts"];
