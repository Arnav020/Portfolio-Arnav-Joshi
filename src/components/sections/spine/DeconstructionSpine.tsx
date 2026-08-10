'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { StackedChapters } from './StackedChapters'
import { PinnedCanvasSpine } from './PinnedCanvasSpine'

/**
 * Picks between the pinned, scroll-scrubbed canvas experience (desktop,
 * motion allowed) and the static stacked fallback (mobile, or
 * prefers-reduced-motion at any size) — see PinnedCanvasSpine.tsx and
 * StackedChapters.tsx respectively. Both report their active chapter over
 * the same window event (see chapters.ts) rather than a prop, since the
 * header nav — mounted in the root layout, outside this subtree — needs to
 * read it too.
 *
 * A third renderer (MobileSpine.tsx, still in the tree but intentionally
 * unused) tried a single `position: sticky` canvas with content scrolling
 * underneath it instead of StackedChapters' per-chapter static frames. In
 * practice the sticky machine — a positioned element — paints on top of
 * the in-flow text scrolling past it, and on a single-column phone layout
 * where text routinely spans the same width the machine occupies, that
 * meant headings and body copy became genuinely unreadable mid-scroll, not
 * just briefly grazed. That's a regression on the one hard rule this
 * project has never compromised on (machine must never cover text), so
 * mobile is back on StackedChapters until a version of that idea can keep
 * text fully clear — e.g. z-indexing content above the machine with an
 * opaque backdrop, or shrinking/fading the machine while it'd overlap a
 * section, rather than relying on transparency margins alone.
 */
export function DeconstructionSpine() {
  const reducedMotion = useReducedMotion()
  // The pinned 4-column stage (index / narrative / machine / meta) needs
  // real room to breathe — below lg it falls back to the same stacked
  // layout used for reduced-motion, which recomposes safely at any width.
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  if (reducedMotion || isDesktop === false) {
    return <StackedChapters />
  }

  if (isDesktop === null) return null

  return <PinnedCanvasSpine />
}
