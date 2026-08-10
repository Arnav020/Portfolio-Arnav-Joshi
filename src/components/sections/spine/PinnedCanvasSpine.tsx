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
  frameFloatForProgress,
  machineScaleForProgress,
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
// How fast the on-screen (display) progress chases the raw scroll-driven
// (target) progress, per animation frame — see the tick()/requestTick()
// loop below. Lower = smoother/slower-feeling, higher = snappier/closer to
// 1:1 with scroll. 0.15 settles in a handful of frames without ever
// feeling laggy or disconnected from the scroll itself.
const PROGRESS_LERP = 0.15

/**
 * Desktop-only (mounted by DeconstructionSpine only at >=lg and without
 * reduced-motion). Four real grid columns — index, narrative, stage,
 * meta — so the machine is geometrically unable to overlap the editorial
 * text and the chapter index is geometrically unable to overlap either.
 * The stage's grid cell never moves or resizes; only a CSS transform:scale
 * on the stage itself (never on text) gives the machine slightly more
 * presence during Education/Experience — see machineScaleForProgress.
 */
export function PinnedCanvasSpine() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const leftRefs = useRef<(HTMLDivElement | null)[]>([])
  const rightRefs = useRef<(HTMLDivElement | null)[]>([])
  const imagesRef = useRef<HTMLImageElement[]>([])
  const currentRawIndexRef = useRef(-1)
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

  // Cross-fades the two nearest frames by the fractional part of rawIndex
  // instead of hard-cutting on whichever one Math.round lands on. With only
  // 150 source frames, a hard cut between discrete frames is exactly what
  // reads as a slideshow; adjacent frames are visually close enough that a
  // plain alpha blend (not real interpolation, just two draws) is
  // indistinguishable from true in-between motion.
  function drawBlendedFrame(rawIndex: number, force = false) {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const clamped = Math.max(0, Math.min(FRAME_COUNT - 1, rawIndex))
    if (!force && Math.abs(clamped - currentRawIndexRef.current) < 0.001) return

    const i0 = Math.floor(clamped)
    const i1 = Math.min(FRAME_COUNT - 1, i0 + 1)
    const t = clamped - i0

    const img0 = imagesRef.current[i0]
    const img1 = imagesRef.current[i1]
    const ready0 = !!img0 && img0.complete && img0.naturalWidth > 0
    const ready1 = !!img1 && img1.complete && img1.naturalWidth > 0
    if (!ready0 && !ready1) return

    const dpr = dprRef.current
    const cw = canvas.width / dpr
    const ch = canvas.height / dpr

    // Contain-fit: the whole machine stays visible, never cropped, never
    // upscaled beyond what the stage's own bounds require.
    function draw(img: HTMLImageElement, alpha: number) {
      const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight)
      const dw = img.naturalWidth * scale
      const dh = img.naturalHeight * scale
      ctx!.globalAlpha = alpha
      ctx!.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
    }

    ctx.clearRect(0, 0, cw, ch)
    if (ready0 && ready1) {
      draw(img0, 1)
      if (t > 0.002) draw(img1, t)
    } else if (ready0) {
      draw(img0, 1)
    } else if (ready1) {
      draw(img1, 1)
    }
    ctx.globalAlpha = 1
    currentRawIndexRef.current = clamped
  }

  function applyMachineScale(p: number) {
    const stage = stageRef.current
    if (!stage) return
    stage.style.transform = `scale(${machineScaleForProgress(p)})`
  }

  function applyChapterStyles(p: number) {
    CHAPTER_BANDS.forEach((band, i) => {
      const o = trapezoidOpacity(p, band)
      // Opacity only — no transform. A translateY entrance was here before,
      // but any non-identity transform (even one rounded to a whole pixel)
      // forces the browser to promote the panel to its own GPU-composited
      // layer, and that layer's bounds come from the grid's own computed
      // width — which, using `fr` tracks, is essentially never a whole
      // number of pixels. A composited layer with fractional bounds is
      // exactly what produces text that looks soft at 100% zoom and sharpens
      // at other zoom levels (the rounding happens to land differently).
      // Fading opacity alone never triggers that: the panel stays in normal
      // layout, so its text rasterizes the same way static text does.
      const style = {
        opacity: String(o),
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
        drawBlendedFrame(Math.max(currentRawIndexRef.current, 0), true)
        ScrollTrigger.refresh()
      }

      resizeCanvas()

      // scroll position → target progress (proxy.p, tied 1:1 to scroll via
      // scrub: true) → smoothly interpolated progress (displayP, chased
      // every animation frame below) → frame/opacity/scale. Decoupling the
      // actual draw/style work from scroll-event cadence this way is what
      // keeps small, fast scroll deltas from reading as frame jitter — the
      // tick loop only ever moves displayP a fraction of the way to
      // wherever proxy.p currently is, and self-stops once it catches up.
      const proxy = { p: 0 }
      let displayP = 0
      let rafId: number | null = null

      function renderAtProgress(p: number) {
        drawBlendedFrame(frameFloatForProgress(p))
        applyChapterStyles(p)
        applyMachineScale(p)
      }

      function tick() {
        const diff = proxy.p - displayP
        if (Math.abs(diff) < 0.0004) {
          displayP = proxy.p
          renderAtProgress(displayP)
          rafId = null
          return
        }
        displayP += diff * PROGRESS_LERP
        renderAtProgress(displayP)
        rafId = requestAnimationFrame(tick)
      }

      function requestTick() {
        if (rafId === null) rafId = requestAnimationFrame(tick)
      }

      const tween = gsap.to(proxy, {
        p: 1,
        ease: 'none',
        onUpdate: requestTick,
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + window.innerHeight * PIN_DISTANCE_VH,
          scrub: true,
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
        if (rafId !== null) cancelAnimationFrame(rafId)
        window.removeEventListener('resize', onResize)
        window.removeEventListener(SPINE_GOTO_EVENT, onGoto)
        tween.kill()
      }
    },
    { scope: sectionRef, dependencies: [posterReady] }
  )

  return (
    <section id="hero" ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-background">
      {/* Left (narrative) column got squeezed too far in an earlier pass
          (0.75fr) while growing the right column for the Projects chapter —
          since all four chapters share this one grid, that starved Intro's
          heading/paragraph/CTA row of room (the two buttons need ~290px
          side by side; the column was landing well under that). Left's
          305px floor covers the buttons with a safety margin; right keeps a
          345px floor (up from the 230px this whole area started at) so
          Projects' titles don't wrap onto a third line as a side effect.
          Fitting both meant trimming gap and outer padding a bit further
          (24px / 32px, was 40px / 56px) — none of it touches the index or
          stage columns. Right still carries more fr-weight and more xl+
          padding than left, so it grows faster and sits further inward. */}
      <div className="absolute inset-0 z-10 grid grid-cols-[clamp(56px,4vw,84px)_minmax(305px,1fr)_clamp(380px,40vw,720px)_minmax(345px,1.2fr)] items-stretch gap-4 py-16 pr-6 pl-6 lg:gap-6 lg:pr-8 lg:pl-8 xl:pr-16">
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
              className="absolute inset-0 flex flex-col justify-center"
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
          <div ref={stageRef} className="relative aspect-[16/9] w-full will-change-transform">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[22%] bottom-[6%] h-[8%] rounded-[50%] blur-2xl"
              style={{ background: 'radial-gradient(ellipse at center, rgba(43,33,29,0.22), transparent 72%)' }}
            />
            {/* Idle float lives on its own wrapper, separate from stageRef
                (which gets the JS-driven scroll scale) and separate from the
                shadow above (which stays fixed) — so the machine reads as
                hovering above a grounded shadow rather than the whole stage
                bobbing as one block. */}
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

        <div className="relative">
          {CHAPTERS.map(({ Right }, i) => (
            <div
              key={i}
              ref={(el) => {
                rightRefs.current[i] = el
              }}
              className="absolute inset-0 flex flex-col justify-center"
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
