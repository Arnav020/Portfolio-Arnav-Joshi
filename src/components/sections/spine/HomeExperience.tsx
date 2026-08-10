'use client'

import { DeconstructionSpine } from './DeconstructionSpine'
import { ScrollProgressRail } from './ScrollProgressRail'

/**
 * Thin composition root — chapter state now lives in the shared
 * useSpineNavigation hook (window-event-driven, see chapters.ts) rather
 * than local state threaded through props, since the header nav needs to
 * read the same value from outside this subtree.
 */
export function HomeExperience() {
  return (
    <>
      <ScrollProgressRail />
      <DeconstructionSpine />
    </>
  )
}
