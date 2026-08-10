'use client'

import { useEffect } from 'react'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { CHAPTER_SECTION_IDS, MOBILE_CHAPTER_FRAMES, FRAME_PATH, SPINE_CHAPTER_EVENT, SPINE_GOTO_EVENT, type SpineChapterDetail } from './chapters'
import { cn } from '@/lib/utils'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { IntroLeft, IntroRight } from './ChapterIntro'
import { EducationLeft, EducationRight } from './ChapterEducation'
import { ExperienceLeft, ExperienceRight } from './ChapterExperience'
import { ProjectsLeft, ProjectsRight } from './ChapterProjects'

const CHAPTERS = [
  { Left: IntroLeft, Right: IntroRight },
  { Left: EducationLeft, Right: EducationRight },
  { Left: ExperienceLeft, Right: ExperienceRight },
  { Left: ProjectsLeft, Right: ProjectsRight },
]

/**
 * The non-scrubbed fallback: used below the `lg` breakpoint and whenever
 * prefers-reduced-motion is set. Same four chapters, same background-removed
 * machine frames, but laid out as plain stacked sections — heading, then
 * that chapter's exploded state, then content — so overlap is structurally
 * impossible rather than merely avoided.
 */
export function StackedChapters() {
  const active = useScrollSpy(CHAPTER_SECTION_IDS, 160)

  useEffect(() => {
    const index = CHAPTER_SECTION_IDS.indexOf(active)
    if (index >= 0) {
      window.dispatchEvent(new CustomEvent<SpineChapterDetail>(SPINE_CHAPTER_EVENT, { detail: { chapter: index } }))
    }
  }, [active])

  // Real DOM sections here, so a nav "go to chapter" click is a plain scroll.
  useEffect(() => {
    function onGoto(e: Event) {
      const detail = (e as CustomEvent<SpineChapterDetail>).detail
      if (!detail) return
      document.getElementById(CHAPTER_SECTION_IDS[detail.chapter])?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    window.addEventListener(SPINE_GOTO_EVENT, onGoto)
    return () => window.removeEventListener(SPINE_GOTO_EVENT, onGoto)
  }, [])

  return (
    <div id="hero">
      {CHAPTERS.map(({ Left, Right }, i) => {
        const machine = (
          // Intro/Education/Experience (i=0,1,2) get a slightly larger
          // machine box than Projects (i=3) — same ~13% bump, and same
          // boosted range, as the desktop scroll-driven scale (see
          // machineScaleForProgress), just applied statically since this
          // fallback doesn't scrub. Box size, not a CSS transform, so the
          // image itself renders at the larger size instead of being
          // upscaled.
          <div className={cn('relative mx-auto aspect-[16/9] w-full', i === 3 ? 'max-w-md' : 'max-w-lg')}>
            {/* Same constant, content-independent shadow as the pinned
                desktop stage — see PinnedCanvasSpine for why. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[22%] bottom-[6%] h-[8%] rounded-[50%] blur-2xl"
              style={{ background: 'radial-gradient(ellipse at center, rgba(43,33,29,0.22), transparent 72%)' }}
            />
            {/* Same idle bob as the pinned desktop stage — on the image
                itself, not its wrapper, so the shadow above stays fixed. */}
            <img
              src={FRAME_PATH(MOBILE_CHAPTER_FRAMES[i])}
              alt="Exploded-view rendering of the system at this stage"
              className="animate-float relative h-full w-full object-contain"
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          </div>
        )

        return (
          <section
            key={CHAPTER_SECTION_IDS[i]}
            id={CHAPTER_SECTION_IDS[i]}
            className="scroll-mt-24 px-6 py-16 md:px-10 md:py-20"
          >
            <div className="mx-auto flex w-full max-w-xl flex-col gap-8">
              {/* Intro (i=0) stays statically visible — it's already on
                  screen at first paint, so fading it in would just be a
                  flash-from-blank on load, not a reveal. Every chapter below
                  it fades + rises into view on first scroll intersection
                  (same ScrollReveal used by Skills/Achievements), staggered
                  heading → machine → content, so each chapter arrives with
                  a bit of life instead of just snapping onto the screen —
                  about as close as a plain stacked layout gets to the
                  pinned desktop version's continuous reveal, without
                  attempting real scroll-scrubbing on mobile (unreliable
                  across devices: viewport resize on scroll, touch momentum,
                  weaker GPUs — precisely why this fallback exists). */}
              {i === 0 ? (
                <>
                  <Left />
                  {machine}
                  <Right />
                </>
              ) : (
                <>
                  <ScrollReveal>
                    <Left />
                  </ScrollReveal>
                  <ScrollReveal delay={120}>{machine}</ScrollReveal>
                  <ScrollReveal delay={220}>
                    <Right />
                  </ScrollReveal>
                </>
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}
