'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useSpineNavigation } from '@/hooks/useSpineNavigation'
import { CHAPTER_LABELS } from './chapters'
import { cn } from '@/lib/utils'

/**
 * Fixed-left chapter index, driven by the shared useSpineNavigation hook
 * (see chapters.ts for the underlying window-event bus) so it always agrees
 * with the header nav on "where are we."
 *
 * While PinnedCanvasSpine is the active renderer it draws its own in-flow
 * index column (a real grid cell, immune to overlap) — this fixed rail
 * would just duplicate it, so it fades out (opacity, not unmounting) for
 * chapters 0-3 in that case and only fades in once the pin releases into
 * the trailing sections.
 *
 * Deliberately never conditionally unmounts (no early `return null`):
 * GSAP's ScrollTrigger pin restructures the DOM around the pinned section
 * (wrapping it in a pin-spacer) outside React's tracking, and mounting a
 * new sibling node into that altered tree mid-scroll is what previously
 * crashed with "insertBefore … not a child of this node." Toggling
 * visibility on an always-present node sidesteps the whole hazard.
 */
export function ScrollProgressRail() {
  const { activeIndex, gotoChapter } = useSpineNavigation()
  const reducedMotion = useReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const pinnedSpineActive = isDesktop === true && !reducedMotion

  const visible = !(pinnedSpineActive && activeIndex < 4)

  return (
    <nav
      aria-label="Page progress"
      className={cn(
        'fixed top-1/2 left-6 z-40 hidden -translate-y-1/2 transition-opacity duration-300 ease-[var(--ease-out)] lg:block',
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
    >
      <div className="relative flex flex-col gap-4">
        <span className="absolute top-1 bottom-1 left-[3px] w-px bg-border" aria-hidden="true" />
        {CHAPTER_LABELS.map((label, i) => {
          const active = i === activeIndex
          return (
            <button
              key={label}
              type="button"
              onClick={() => (i < 4 ? gotoChapter(i) : document.getElementById(label.toLowerCase())?.scrollIntoView({ behavior: 'smooth' }))}
              className="group flex items-center gap-3 text-left"
            >
              <span
                className={cn(
                  'h-1.5 w-1.5 flex-shrink-0 rounded-full border transition-colors duration-300 ease-[var(--ease-out)]',
                  active ? 'border-accent bg-accent' : 'border-border-strong bg-transparent group-hover:border-accent/60'
                )}
              />
              <span
                className={cn(
                  'font-mono text-[10px] tracking-[0.14em] uppercase transition-colors duration-300 ease-[var(--ease-out)]',
                  active ? 'text-foreground-strong' : 'text-muted-foreground/60 group-hover:text-muted-foreground'
                )}
              >
                {String(i + 1).padStart(2, '0')} {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
