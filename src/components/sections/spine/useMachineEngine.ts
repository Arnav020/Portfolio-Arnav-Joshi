'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { FRAME_COUNT, FRAME_PATH, frameFloatForProgress } from './chapters'

// How fast the on-screen (display) progress chases the raw scroll-driven
// (target) progress, per animation frame — see the tick()/setTarget() loop
// below. Lower = smoother/slower-feeling, higher = snappier/closer to 1:1
// with scroll. 0.15 settles in a handful of frames without ever feeling
// laggy or disconnected from the scroll itself. Shared by every renderer
// (desktop pinned, mobile sticky) so the machine feels the same everywhere.
const PROGRESS_LERP = 0.15

interface MachineEngineOptions {
  /** Concurrent in-flight frame decodes after the poster frame. Desktop can
   * afford more; mobile defaults lower to go easier on constrained
   * bandwidth/CPU. */
  concurrency?: number
  /** Called on every rendered frame (already lerp-smoothed) so a caller can
   * layer extra per-progress effects — chapter crossfade + scale on
   * desktop, nothing extra needed on mobile. */
  onFrame?: (displayProgress: number) => void
}

/**
 * The shared "150 frames, smoothly scrubbed" engine behind both
 * PinnedCanvasSpine (desktop) and MobileSpine (mobile). Extracted so mobile
 * reuses the exact same preload / cross-fade / lerp-smoothing logic instead
 * of a parallel implementation — the only things that differ between
 * renderers are how progress is produced (GSAP pin+scrub vs. a plain
 * non-pinned ScrollTrigger under a CSS-sticky container) and what happens
 * around the machine (crossfading text panels vs. normal-flow sections).
 *
 * Callers own: the element the canvasRef/stageRef get attached to, driving
 * `setTarget(progress)` from their own scroll source, and calling
 * `remeasure()` after any layout change that could resize the stage (this
 * hook does not register its own window resize listener, so a caller that
 * also needs to react to resize — e.g. to re-run ScrollTrigger.refresh() —
 * can sequence both from one debounced handler).
 */
export function useMachineEngine({ concurrency = 8, onFrame }: MachineEngineOptions = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const currentRawIndexRef = useRef(-1)
  const dprRef = useRef(1)
  const targetProgressRef = useRef(0)
  const displayProgressRef = useRef(0)
  const rafIdRef = useRef<number | null>(null)
  const tickRef = useRef<() => void>(() => {})
  const onFrameRef = useRef(onFrame)
  onFrameRef.current = onFrame

  const [posterReady, setPosterReady] = useState(false)

  // Frame 1 loads (and decodes) first for an immediate poster; the
  // remaining 149 stream in afterward with limited concurrency. Scrolling
  // ahead of what's loaded is safe — drawBlendedFrame simply holds the last
  // decoded frame(s) it has.
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
      let cursor = 0
      async function worker() {
        while (cursor < rest.length) {
          const n = rest[cursor++]
          const img = makeImage(n)
          images[n - 1] = img
          await settle(img)
        }
      }
      await Promise.all(Array.from({ length: concurrency }, worker))
    })()

    return () => {
      cancelled = true
    }
  }, [concurrency])

  const remeasureRef = useRef<() => void>(() => {})

  useEffect(() => {
    if (!posterReady) return
    const canvas = canvasRef.current
    const stage = stageRef.current
    if (!canvas || !stage) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Cross-fades the two nearest frames by the fractional part of rawIndex
    // instead of hard-cutting on whichever one Math.round lands on. With
    // only 150 source frames, a hard cut between discrete frames is exactly
    // what reads as a slideshow; adjacent frames are visually close enough
    // that a plain alpha blend (not real interpolation, just two draws) is
    // indistinguishable from true in-between motion.
    function drawBlendedFrame(rawIndex: number, force = false) {
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
      const cw = canvas!.width / dpr
      const ch = canvas!.height / dpr

      // Contain-fit: the whole machine stays visible, never cropped, never
      // upscaled beyond what the stage's own bounds require.
      function draw(img: HTMLImageElement, alpha: number) {
        const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight)
        const dw = img.naturalWidth * scale
        const dh = img.naturalHeight * scale
        ctx!.globalAlpha = alpha
        ctx!.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
      }

      ctx!.clearRect(0, 0, cw, ch)
      if (ready0 && ready1) {
        draw(img0, 1)
        if (t > 0.002) draw(img1, t)
      } else if (ready0) {
        draw(img0, 1)
      } else if (ready1) {
        draw(img1, 1)
      }
      ctx!.globalAlpha = 1
      currentRawIndexRef.current = clamped
    }

    function remeasure() {
      dprRef.current = Math.min(window.devicePixelRatio || 1, 2)
      const rect = stage!.getBoundingClientRect()
      canvas!.width = Math.round(rect.width * dprRef.current)
      canvas!.height = Math.round(rect.height * dprRef.current)
      canvas!.style.width = rect.width + 'px'
      canvas!.style.height = rect.height + 'px'
      ctx!.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0)
      ctx!.imageSmoothingEnabled = true
      ctx!.imageSmoothingQuality = 'high'
      drawBlendedFrame(Math.max(currentRawIndexRef.current, 0), true)
    }
    remeasureRef.current = remeasure
    remeasure()

    // target (raw scroll, set by the caller via setTarget) → display
    // (chased every animation frame here) → frame. Decoupling the actual
    // draw work from scroll-event cadence this way is what keeps small,
    // fast scroll deltas from reading as frame jitter — the loop only ever
    // moves displayP a fraction of the way to wherever target currently is,
    // and self-stops once it catches up.
    function tick() {
      const diff = targetProgressRef.current - displayProgressRef.current
      if (Math.abs(diff) < 0.0004) {
        displayProgressRef.current = targetProgressRef.current
        drawBlendedFrame(frameFloatForProgress(displayProgressRef.current))
        onFrameRef.current?.(displayProgressRef.current)
        rafIdRef.current = null
        return
      }
      displayProgressRef.current += diff * PROGRESS_LERP
      drawBlendedFrame(frameFloatForProgress(displayProgressRef.current))
      onFrameRef.current?.(displayProgressRef.current)
      rafIdRef.current = requestAnimationFrame(tick)
    }
    tickRef.current = tick

    return () => {
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }
  }, [posterReady])

  const setTarget = useCallback((p: number) => {
    targetProgressRef.current = p
    if (rafIdRef.current === null) rafIdRef.current = requestAnimationFrame(tickRef.current)
  }, [])

  const remeasure = useCallback(() => remeasureRef.current(), [])

  return { canvasRef, stageRef, posterReady, setTarget, remeasure }
}
