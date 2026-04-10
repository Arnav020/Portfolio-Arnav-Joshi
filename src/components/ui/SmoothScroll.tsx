'use client'

import { useEffect } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    let lenis: any

    const loadLenis = async () => {
      const Lenis = (await import('lenis')).default

      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.8,
      })

      function raf(time: number) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }

      requestAnimationFrame(raf)
    }

    loadLenis()
    return () => lenis?.destroy()
  }, [reducedMotion])

  return <>{children}</>
}
