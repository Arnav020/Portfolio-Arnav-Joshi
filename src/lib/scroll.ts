// Matches the scroll-mt-24 (6rem) applied to every homepage <section> — single
// source of truth so JS-driven scrolling and native fragment navigation land
// in the same place.
export const HEADER_SCROLL_OFFSET = 96

export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return

  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_SCROLL_OFFSET
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
}
