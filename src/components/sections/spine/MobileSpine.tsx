'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { CHAPTER_SECTION_IDS, SPINE_CHAPTER_EVENT, SPINE_GOTO_EVENT, type SpineChapterDetail } from './chapters'
import { useMachineEngine } from './useMachineEngine'
import { IntroLeft, IntroRight } from './ChapterIntro'
import { EducationLeft, EducationRight } from './ChapterEducation'
import { ExperienceLeft, ExperienceRight } from './ChapterExperience'
import { ProjectsLeft, ProjectsRight } from './ChapterProjects'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Mobile/tablet, motion-allowed (mounted by DeconstructionSpine below `lg`
 * whenever prefers-reduced-motion is off — see StackedChapters for the
 * reduced-motion fallback, which stays fully static on purpose).
 *
 * The desktop pinned spine overlays four chapters in one grid cell and
 * crossfades between them — there's no equivalent single "cell" to reuse on
 * a single-column phone layout, and stacking each chapter with its own
 * static machine frame (the old approach) is exactly what read as a
 * slideshow of unrelated images instead of one continuous object. Instead:
 *
 * ONE canvas, `position: sticky` inside `wrapperRef` (which spans from
 * Intro through the end of Projects). Content sections are normal in-flow
 * siblings before/after it. Sticky positioning means the canvas stays
 * visually pinned near the top of the viewport for the *entire* height of
 * `wrapperRef` — through Education, Experience, and Projects — and then
 * releases naturally, scrolling away with the rest of the page, once the
 * wrapper ends (right before Skills). No JS pin/unpin logic needed for
 * that release; it's what sticky does once its containing block runs out.
 *
 * Because every content section sits *after* the sticky machine in the
 * document, the machine can never be spatially overlapped by text: normal
 * flow means a later section's visible portion only ever starts on-screen
 * below the sticky element's own reserved height, never behind or through
 * it. That's what keeps "machine and content visually separate" true
 * without any manual z-index/overlay work.
 *
 * Frame selection reuses the exact same preload/cross-fade/lerp-smoothing
 * engine as the desktop renderer (useMachineEngine) — only the progress
 * *source* differs: a plain, non-pinned ScrollTrigger tracking overall
 * scroll through the wrapper, instead of GSAP's pin+scrub.
 */
export function MobileSpine() {
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Mobile connections are more bandwidth/CPU constrained than desktop —
  // fewer frames decoding in parallel, same poster-first strategy.
  const { canvasRef, stageRef, posterReady, setTarget, remeasure } = useMachineEngine({ concurrency: 4 })

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

  useGSAP(
    () => {
      if (!posterReady || !wrapperRef.current) return
      const wrapper = wrapperRef.current

      // No pin: CSS `sticky` on the machine already handles staying in
      // place. This trigger exists purely to turn "how far scrolled through
      // the wrapper" into a 0-1 progress value.
      const st = ScrollTrigger.create({
        trigger: wrapper,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => setTarget(self.progress),
      })

      let resizeTimeout: ReturnType<typeof setTimeout> | undefined
      const onResize = () => {
        clearTimeout(resizeTimeout)
        resizeTimeout = setTimeout(() => {
          remeasure()
          ScrollTrigger.refresh()
        }, 150)
      }
      window.addEventListener('resize', onResize)

      return () => {
        clearTimeout(resizeTimeout)
        window.removeEventListener('resize', onResize)
        st.kill()
      }
    },
    { scope: wrapperRef, dependencies: [posterReady] }
  )

  return (
    <div id="hero">
      <div ref={wrapperRef} className="relative">
        <section id={CHAPTER_SECTION_IDS[0]} className="scroll-mt-24 px-6 pt-28 pb-6">
          <div className="mx-auto w-full max-w-xl">
            <IntroLeft />
            <div className="mt-10">
              <IntroRight />
            </div>
          </div>
        </section>

        {/* The one persistent machine — see the component doc comment for
            why sticky positioning here is what keeps it from ever repeating.
            top-20 matches the fixed header's own height so the machine sits
            directly below it, never under it. Left un-positioned relative
            to z-index (no z-0/z-10 tug of war with the sections below): a
            `sticky` element already paints above normal in-flow content by
            default, which is what's wanted here — the machine stays
            continuously visible rather than getting fully hidden behind a
            section's opaque background during the brief window where that
            section's box happens to pass through the same screen band (a
            plain `position:relative` + higher z-index on the sections was
            tried and caused exactly that: the machine vanishing for most of
            the scroll instead of remaining "one continuous object"). Since
            it's always the topmost layer, `pointer-events-none` keeps it
            from ever intercepting taps meant for a project link or button
            that happens to sit in the same band. */}
        <div className="pointer-events-none sticky top-20 flex justify-center px-4 py-5">
          {/* w-[85%] here is relative to this wrapper's own content box
              (already inset by px-4), which works out to ~76-80% of the
              full viewport width — inside the requested 70-85% range —
              while still leaving px-4 (16px) as a hard minimum margin so
              the machine can never reach the screen edges. */}
          <div ref={stageRef} className="relative aspect-[16/9] w-[85%] max-w-md">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[22%] bottom-[6%] h-[8%] rounded-[50%] blur-2xl"
              style={{ background: 'radial-gradient(ellipse at center, rgba(43,33,29,0.22), transparent 72%)' }}
            />
            <div className="absolute inset-0 animate-float">
              <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
            </div>
            {!posterReady && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-border-strong" />
              </div>
            )}
          </div>
        </div>

        <section id={CHAPTER_SECTION_IDS[1]} className="scroll-mt-24 bg-background px-6 py-16">
          <div className="mx-auto w-full max-w-xl">
            <EducationLeft />
            <div className="mt-10">
              <EducationRight />
            </div>
          </div>
        </section>

        <section id={CHAPTER_SECTION_IDS[2]} className="scroll-mt-24 bg-background px-6 py-16">
          <div className="mx-auto w-full max-w-xl">
            <ExperienceLeft />
            <div className="mt-10">
              <ExperienceRight />
            </div>
          </div>
        </section>

        <section id={CHAPTER_SECTION_IDS[3]} className="scroll-mt-24 bg-background px-6 py-16">
          <div className="mx-auto w-full max-w-xl">
            <ProjectsLeft />
            <div className="mt-10">
              <ProjectsRight />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
