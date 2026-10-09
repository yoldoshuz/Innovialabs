import type { FormService } from "@/lib/content";

/**
 * Tiny pub-sub that lets any CTA preselect a service (and optionally prefill
 * the message) in the contact form before scrolling to it.
 */
export type ContactIntent = { service: FormService; note?: string };

type Listener = (intent: ContactIntent) => void;
const listeners = new Set<Listener>();

export function requestContact(intent: ContactIntent) {
  listeners.forEach((fn) => fn(intent));
}

export function onContactIntent(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
