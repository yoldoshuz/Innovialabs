import type ruDict from "@/lib/i18n/dictionaries/ru.json";

/**
 * The dictionary shape is derived from the Russian (base) JSON so translations
 * stay structurally in sync at compile time.
 */
export type Dictionary = typeof ruDict;

export type NavDict = Dictionary["nav"];
export type HeroDict = Dictionary["hero"];
export type TrustDict = Dictionary["trust"];
export type ServicesDict = Dictionary["services"];
export type ServiceItem = ServicesDict["items"][number];
export type AiDict = Dictionary["ai"];
export type TelegramDict = Dictionary["telegram"];
export type WhyDict = Dictionary["why"];
export type ProcessDict = Dictionary["process"];
export type CasesDict = Dictionary["cases"];
export type CaseItem = CasesDict["items"][number];
export type StackDict = Dictionary["stack"];
export type FormatsDict = Dictionary["formats"];
export type FaqDict = Dictionary["faq"];
export type ContactDict = Dictionary["contact"];
export type ContactFormDict = Dictionary["contactForm"];
export type FooterDict = Dictionary["footer"];
export type BriefDict = Dictionary["brief"];
export type BlogDict = Dictionary["blog"];
export type OnboardingDict = Dictionary["onboarding"];
