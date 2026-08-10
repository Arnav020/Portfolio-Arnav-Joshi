'use client'

import { useEffect, useState } from 'react'

/**
 * Deterministic scrollspy: the active section is the last one (in document
 * order) whose top has been scrolled past. Unlike an IntersectionObserver
 * with per-section thresholds, this always resolves to exactly one section
 * regardless of how tall/short neighboring sections are.
 */
export function useScrollSpy(sectionIds: string[], offset = 100) {
  const [active, setActive] = useState('')
  const key = sectionIds.join(',')

  useEffect(() => {
    const ids = key.split(',').filter(Boolean)
    let ticking = false

    function update() {
      const scrollPos = window.scrollY + offset + 1
      let current = ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= scrollPos) current = id
      }
      setActive(current)
      ticking = false
    }

    function onScrollOrResize() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    // Deferred two frames rather than called synchronously: sibling
    // components that resolve their layout via useSyncExternalStore (e.g.
    // a media-query-gated section) may still be on their server snapshot
    // for the very first paint, briefly collapsing to zero height — an
    // immediate measurement here would catch that transient layout instead
    // of the real one.
    const raf1 = requestAnimationFrame(() => requestAnimationFrame(update))
    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize)
    return () => {
      cancelAnimationFrame(raf1)
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [key, offset])

  return active
}
