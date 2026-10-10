"use client";

import { useSearchParams } from "next/navigation";
import { ContactOnboarding } from "@/components/contact/contact-onboarding";

/** Reads `?service=` and hands it to the brief as its starting pick. */
export function BriefFromQuery(props: Omit<React.ComponentProps<typeof ContactOnboarding>, "initialService">) {
  const service = useSearchParams().get("service") ?? "";
  return <ContactOnboarding key={service} {...props} initialService={service} />;
}
