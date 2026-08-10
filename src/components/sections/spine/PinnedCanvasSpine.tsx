'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/utils'
import {
  CHAPTER_BANDS,
  CHAPTER_LABELS,
  CHAPTER_TARGET_PROGRESS,
  chapterIndexForProgress,
  frameIndexForProgress,
  trapezoidOpacity,
  FRAME_COUNT,
  FRAME_PATH,
  SPINE_CHAPTER_EVENT,
  SPINE_GOTO_EVENT,
  type SpineChapterDetail,
} from './chapters'
import { IntroLeft, IntroRight } from './ChapterIntro'
import { EducationLeft, EducationRight } from './ChapterEducation'
import { ExperienceLeft, ExperienceRight } from './ChapterExperience'
import { ProjectsLeft, ProjectsRight } from './ChapterProjects'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const CHAPTERS = [
  { Left: IntroLeft, Right: IntroRight },
  { Left: EducationLeft, Right: EducationRight },
  { Left: ExperienceLeft, Right: ExperienceRight },
  { Left: ProjectsLeft, Right: ProjectsRight },
]
const EXPERIENCE_BAND = CHAPTER_BANDS[2]
const PIN_DISTANCE_VH = 5.5
const SCRUB = 0.2

/**
 * Desktop-only (mounted by DeconstructionSpine only at >=lg and without
 * reduced-motion). Four real grid columns — index, narrative, stage,
 * meta — so the machine is geometrically unable to overlap the editorial
 * text and the chapter index is geometrically unable to overlap either.
 * Only the drawn frame changes; the stage itself never moves or resizes.
 */
export function PinnedCanvasSpine() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const leftRefs = useRef<(HTMLDivElement | null)[]>([])
  const rightRefs = useRef<(HTMLDivElement | null)[]>([])
  const imagesRef = useRef<HTMLImageElement[]>([])
  const currentIndexRef = useRef(-1)
  const currentChapterRef = useRef(-1)
  const dprRef = useRef(1)

  const [posterReady, setPosterReady] = useState(false)
  const [activeChapter, setActiveChapter] = useState(0)

  // Frame 1 loads (and decodes) first for an immediate poster; the remaining
  // 149 stream in afterward with limited concurrency. Scrolling ahead of
  // what's loaded is safe — drawFrame simply holds the last decoded frame.
  useEffect(() => {
    let cancelled = false
    const images: HTMLImageElement[] = new Array(FRAME_COUNT)

    function makeImage(n: number) {
      const img = new Image()
      img.decoding = 'async'
      img.src = FRAME_PATH(n)
      return img
    }

    async function settle(img: HTMLImageElement) {
      try {
        await img.decode()
      } catch {
        await new Promise<void>((resolve) => {
          if (img.complete) return resolve()
          img.onload = () => resolve()
          img.onerror = () => resolve()
        })
      }
    }

    ;(async () => {
      const first = makeImage(1)
      images[0] = first
      await settle(first)
      if (cancelled) return
      imagesRef.current = images
      setPosterReady(true)

      const rest = Array.from({ length: FRAME_COUNT - 1 }, (_, k) => k + 2)
      const CONCURRENCY = 8
      let cursor = 0
      async function worker() {
        while (cursor < rest.length) {
          const n = rest[cursor++]
          const img = makeImage(n)
          images[n - 1] = img
          await settle(img)
        }
      }
      await Promise.all(Array.from({ length: CONCURRENCY }, worker))
    })()

    return () => {
      cancelled = true
    }
  }, [])

  function drawFrame(index: number, force = false) {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    if (!force && index === currentIndexRef.current) return

    const img = imagesRef.current[index]
    if (!img || !img.complete || img.naturalWidth === 0) return

    const dpr = dprRef.current
    const cw = canvas.width / dpr
    const ch = canvas.height / dpr
    // Contain-fit: the whole machine stays visible, never cropped, never
    // upscaled beyond what the stage's own bounds require.
    const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight)
    const dw = img.naturalWidth * scale
    const dh = img.naturalHeight * scale
    const dx = (cw - dw) / 2
    const dy = (ch - dh) / 2

    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, dx, dy, dw, dh)
    currentIndexRef.current = index
  }

  function applyChapterStyles(p: number) {
    CHAPTER_BANDS.forEach((band, i) => {
      const o = trapezoidOpacity(p, band)
      // Rounded to a whole pixel and expressed as translate3d rather than
      // translateY: a fractional-pixel transform forces the browser to
      // interpolate text between pixel boundaries every single scroll tick,
      // which is what made the right-column copy look soft/"broken" while
      // scrolling — translate3d also reliably promotes the panel to its own
      // GPU layer instead of leaving that to chance, keeping glyph
      // rendering stable while it animates.
      const y = Math.round((1 - o) * 16)
      const style = {
        opacity: String(o),
        transform: `translate3d(0, ${y}px, 0)`,
        pointerEvents: o > 0.5 ? 'auto' : 'none',
      } as const
      const left = leftRefs.current[i]
      const right = rightRefs.current[i]
      if (left) Object.assign(left.style, style)
      if (right) Object.assign(right.style, style)
    })

    const chapter = chapterIndexForProgress(p)
    if (chapter !== currentChapterRef.current) {
      currentChapterRef.current = chapter
      setActiveChapter(chapter)
      window.dispatchEvent(new CustomEvent<SpineChapterDetail>(SPINE_CHAPTER_EVENT, { detail: { chapter } }))
    }

    if (p > EXPERIENCE_BAND.inStart - 0.05 && p < EXPERIENCE_BAND.outEnd + 0.05) {
      const root = rightRefs.current[2]
      const span = EXPERIENCE_BAND.outStart - EXPERIENCE_BAND.inEnd
      const local = span > 0 ? Math.max(0, Math.min(1, (p - EXPERIENCE_BAND.inEnd) / span)) : 1
      const fill = root?.querySelector<HTMLElement>('[data-experience-fill]')
      if (fill) fill.style.height = `${local * 100}%`
      const dots = root?.querySelectorAll<HTMLElement>('[data-experience-dot]')
      dots?.forEach((dot, i) => {
        const threshold = dots.length > 1 ? i / (dots.length - 1) : 0
        const active = local >= threshold - 0.02
        dot.style.backgroundColor = active ? 'var(--accent)' : 'var(--background)'
        dot.style.borderColor = active ? 'var(--accent)' : 'var(--border-strong)'
      })
    }
  }

  useGSAP(
    () => {
      if (!posterReady || !sectionRef.current || !canvasRef.current || !stageRef.current) return

      const section = sectionRef.current
      const canvas = canvasRef.current
      const stage = stageRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      function resizeCanvas() {
        section.style.height = window.innerHeight + 'px'
        dprRef.current = Math.min(window.devicePixelRatio || 1, 2)
        const rect = stage.getBoundingClientRect()
        canvas.width = Math.round(rect.width * dprRef.current)
        canvas.height = Math.round(rect.height * dprRef.current)
        canvas.style.width = rect.width + 'px'
        canvas.style.height = rect.height + 'px'
        ctx!.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0)
        ctx!.imageSmoothingEnabled = true
        ctx!.imageSmoothingQuality = 'high'
        drawFrame(Math.max(currentIndexRef.current, 0), true)
        ScrollTrigger.refresh()
      }

      resizeCanvas()

      const proxy = { p: 0 }
      const tween = gsap.to(proxy, {
        p: 1,
        ease: 'none',
        onUpdate: () => {
          drawFrame(frameIndexForProgress(proxy.p))
          applyChapterStyles(proxy.p)
        },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + window.innerHeight * PIN_DISTANCE_VH,
          scrub: SCRUB,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // Debounced: resize fires repeatedly during a drag-resize (and on some
      // mobile browsers, during scroll-triggered address-bar collapse) —
      // recomputing canvas backing-store size and calling
      // ScrollTrigger.refresh() on every single event is expensive enough to
      // visibly stutter. Settle on the final size instead.
      let resizeTimeout: ReturnType<typeof setTimeout> | undefined
      const onResize = () => {
        clearTimeout(resizeTimeout)
        resizeTimeout = setTimeout(resizeCanvas, 150)
      }
      window.addEventListener('resize', onResize)

      // Header nav clicks land here — translate "go to chapter N" into a
      // real scroll position using this trigger's own live pixel bounds
      // (start = pin begins, end = pin releases), rather than approximating
      // pin distance independently and risking drift from the real value.
      const st = tween.scrollTrigger
      function onGoto(e: Event) {
        const detail = (e as CustomEvent<SpineChapterDetail>).detail
        if (!detail || !st) return
        const target = st.start + CHAPTER_TARGET_PROGRESS[detail.chapter] * (st.end - st.start)
        window.scrollTo({ top: target, behavior: 'smooth' })
      }
      window.addEventListener(SPINE_GOTO_EVENT, onGoto)

      return () => {
        clearTimeout(resizeTimeout)
        window.removeEventListener('resize', onResize)
        window.removeEventListener(SPINE_GOTO_EVENT, onGoto)
        tween.kill()
      }
    },
    { scope: sectionRef, dependencies: [posterReady] }
  )

  return (
    <section id="hero" ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-background">
      {/* The right column (education/experience/project details — the actual
          content the site is about) is still given a bit more weight than
          the left; the stage now runs larger (targeting ~40-48vw on a
          1440px viewport) since it no longer has to fight a card boundary
          for visual space. */}
      <div className="absolute inset-0 z-10 grid grid-cols-[clamp(56px,4vw,84px)_minmax(200px,0.9fr)_clamp(400px,44vw,760px)_minmax(230px,1.05fr)] items-stretch gap-6 px-8 py-16 lg:gap-10 lg:px-14">
        {/* Index rail — its own protected column, never overlapping content. */}
        <div className="relative">
          <div className="absolute top-1/2 left-0 flex -translate-y-1/2 flex-col gap-5">
            {CHAPTER_LABELS.map((label, i) => {
              const active = i === activeChapter
              return (
                <div key={label} className="flex flex-col items-start gap-1.5">
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full border transition-colors duration-300 ease-[var(--ease-out)]',
                      active ? 'border-accent bg-accent' : 'border-border-strong bg-transparent'
                    )}
                  />
                  <span
                    className={cn(
                      'font-mono text-[10px] tracking-[0.1em] uppercase transition-colors duration-300 ease-[var(--ease-out)]',
                      active ? 'text-foreground-strong' : 'text-muted-foreground/50'
                    )}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="relative">
          {CHAPTERS.map(({ Left }, i) => (
            <div
              key={i}
              ref={(el) => {
                leftRefs.current[i] = el
              }}
              className="absolute inset-0 flex flex-col justify-center will-change-transform"
              style={{ opacity: i === 0 ? 1 : 0, pointerEvents: i === 0 ? 'auto' : 'none' }}
            >
              <Left />
            </div>
          ))}
        </div>

        <div className="relative flex items-center justify-center">
          {/* No card: no border, no rounded rect, no background fill, no
              box-shadow on a bounding box. The frames themselves carry real
              alpha (see scripts/matte-frames.js) so the canvas only ever
              paints the machine — the cream page shows through everywhere
              else. The grounding shadow below is a fixed, constant CSS
              radial gradient, completely independent of what's drawn in the
              canvas: it cannot grow, smudge, or disperse as the machine
              explodes because it isn't derived from the frame content at
              all — it's the same shadow whether the machine is assembled or
              fully exploded. */}
          <div ref={stageRef} className="relative aspect-[16/9] w-full">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[22%] bottom-[6%] h-[8%] rounded-[50%] blur-2xl"
              style={{ background: 'radial-gradient(ellipse at center, rgba(43,33,29,0.22), transparent 72%)' }}
            />
            <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
            {!posterReady && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-border-strong" />
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          {CHAPTERS.map(({ Right }, i) => (
            <div
              key={i}
              ref={(el) => {
                rightRefs.current[i] = el
              }}
              className="absolute inset-0 flex flex-col justify-center will-change-transform"
              style={{ opacity: i === 0 ? 1 : 0, pointerEvents: i === 0 ? 'auto' : 'none' }}
            >
              <Right />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
