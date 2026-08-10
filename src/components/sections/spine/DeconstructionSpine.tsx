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
