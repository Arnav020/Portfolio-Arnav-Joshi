'use client'

import { useEffect } from 'react'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { CHAPTER_SECTION_IDS, MOBILE_CHAPTER_FRAMES, FRAME_PATH, SPINE_CHAPTER_EVENT, SPINE_GOTO_EVENT, type SpineChapterDetail } from './chapters'
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
      {CHAPTERS.map(({ Left, Right }, i) => (
        <section
          key={CHAPTER_SECTION_IDS[i]}
          id={CHAPTER_SECTION_IDS[i]}
          className="scroll-mt-24 border-b border-border px-6 py-20 last:border-b-0 md:px-10"
        >
          <div className="mx-auto flex w-full max-w-xl flex-col gap-10">
            <Left />

            <div className="relative mx-auto aspect-[16/9] w-full max-w-md">
              {/* Same constant, content-independent shadow as the pinned
                  desktop stage — see PinnedCanvasSpine for why. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-[22%] bottom-[6%] h-[8%] rounded-[50%] blur-2xl"
                style={{ background: 'radial-gradient(ellipse at center, rgba(43,33,29,0.22), transparent 72%)' }}
              />
              <img
                src={FRAME_PATH(MOBILE_CHAPTER_FRAMES[i])}
                alt="Exploded-view rendering of the system at this stage"
                className="relative h-full w-full object-contain"
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </div>

            <Right />
          </div>
        </section>
      ))}
    </div>
  )
}
