'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import { TOUR_KEY, useIde } from '../IdeProvider'

/**
 * A three-step walkthrough for visitors who don't live in a code editor —
 * recruiters, HR, family. It covers only what someone needs to read the CV:
 * where the sections are, that the page scrolls, and where the résumé is.
 * Deliberately no terminal, no themes, no keyboard shortcuts.
 */
const STEPS = [
  {
    title: 'Each file is a section',
    body: 'About me, projects, experience, skills — click any file in this list to open it.',
    // On phones the panel is collapsed, so the sidebar icon stands in for it.
    target: () =>
      document.querySelector<HTMLElement>('[data-tour="files"]') ??
      document.querySelector<HTMLElement>('[data-tour="explorer-icon"]'),
  },
  {
    title: 'Scroll for the full story',
    body: 'Whatever you open appears here. Scroll down inside the page — most sections continue below the fold.',
    target: () => document.querySelector<HTMLElement>('[data-tour="editor"]'),
  },
  {
    title: 'Résumé and contact',
    body: 'Preview or download my résumé from here. My email and links live in contact.css.',
    target: () => document.querySelector<HTMLElement>('[data-tour="resume"]'),
  },
]

interface Box {
  top: number
  left: number
  width: number
  height: number
}

const PAD = 6

export function Tour() {
  const { state, dispatch } = useIde()
  const step = state.tourStep
  const [box, setBox] = useState<Box | null>(null)

  const active = step !== null ? STEPS[step] : null

  // Measure before paint so the spotlight never renders in the wrong place.
  useLayoutEffect(() => {
    if (!active) return
    const measure = () => {
      const el = active.target()
      if (!el) return setBox(null)
      const r = el.getBoundingClientRect()
      setBox({
        top: r.top - PAD,
        left: r.left - PAD,
        width: r.width + PAD * 2,
        height: r.height + PAD * 2,
      })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [active, step])

  useEffect(() => {
    if (step === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') end()
      if (e.key === 'ArrowRight' || e.key === 'Enter') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  if (step === null || !active) return null

  function end() {
    try {
      localStorage.setItem(TOUR_KEY, '1')
    } catch {}
    dispatch({ type: 'TOUR', step: null })
  }

  function next() {
    if (step === null) return
    if (step >= STEPS.length - 1) end()
    else dispatch({ type: 'TOUR', step: step + 1 })
  }

  // Card sits to the right of narrow targets, below wide ones, and pinned to
  // the bottom on small screens where neither fits.
  const cardStyle: React.CSSProperties = (() => {
    const W = 320
    // No transform-based centring here: the card's entrance animation ends on
    // `transform: none`, which would override an inline translate and throw
    // the card off-screen. Inset both edges instead.
    if (!box || window.innerWidth < 700) {
      return { left: 16, right: 16, bottom: 72, width: 'auto' }
    }
    const rightSpace = window.innerWidth - (box.left + box.width)
    if (rightSpace > W + 32) {
      return {
        left: box.left + box.width + 16,
        top: Math.min(Math.max(16, box.top), window.innerHeight - 210),
        width: W,
      }
    }
    return {
      left: Math.min(Math.max(16, box.left), window.innerWidth - W - 16),
      top: Math.min(box.top + box.height + 16, window.innerHeight - 210),
      width: W,
    }
  })()

  return (
    <div className="fixed inset-0 z-[80]">
      {/* One element does the dimming and the cut-out: a huge spread shadow
          around the target rect, so no four-panel overlay maths is needed. */}
      {box ? (
        <div
          // Keyed per step so each spotlight mounts already in position.
          // Transitioning `left`/`top` would animate the first one in from
          // the viewport corner, since the pre-transition value resolves to 0.
          key={step}
          aria-hidden="true"
          className="pointer-events-none absolute rounded-md ring-2 ring-accent"
          style={{
            top: box.top,
            left: box.left,
            width: box.width,
            height: box.height,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.66)',
          }}
        />
      ) : (
        <div aria-hidden="true" className="absolute inset-0 bg-black/66" />
      )}

      {/* Click-anywhere-to-skip, behind the card. */}
      <button
        type="button"
        aria-label="Skip walkthrough"
        tabIndex={-1}
        className="absolute inset-0 cursor-default"
        onClick={end}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Walkthrough"
        className="overlay-in absolute rounded-lg border border-line bg-panel p-4 shadow-2xl shadow-black/70"
        style={cardStyle}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] tracking-[0.16em] text-accent uppercase">
            Quick tour
          </span>
          <span className="text-[11px] text-faint">
            {step + 1} / {STEPS.length}
          </span>
        </div>

        <h2 className="font-display text-base font-extrabold text-fg-strong">
          {active.title}
        </h2>
        <p className="mt-1.5 text-[13px] leading-6 text-dim">{active.body}</p>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={end}
            className="text-[11px] text-faint transition-colors hover:text-fg"
          >
            Skip
          </button>
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                aria-hidden="true"
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? 'w-4 bg-accent' : 'w-1.5 bg-line'
                }`}
              />
            ))}
            <button
              type="button"
              autoFocus
              onClick={next}
              className="ml-2 rounded bg-accent px-3 py-1.5 text-[12px] font-medium text-statusbar-fg transition-opacity hover:opacity-90"
            >
              {step >= STEPS.length - 1 ? 'Got it' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
