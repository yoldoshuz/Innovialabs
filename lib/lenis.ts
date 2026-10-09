import type Lenis from "lenis";

/** Shared handle to the global Lenis instance (set by <SmoothScroll>). */
let instance: Lenis | null = null;

export const setLenis = (lenis: Lenis | null) => {
  instance = lenis;
};

export const getLenis = () => instance;

/** Smooth-scrolls via Lenis when active, native scroll otherwise. */
export function scrollToTarget(target: number | HTMLElement, offset = 0) {
  if (instance) {
    instance.scrollTo(target, { offset });
    return;
  }
  const top =
    typeof target === "number"
      ? target
      : target.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: "smooth" });
}
