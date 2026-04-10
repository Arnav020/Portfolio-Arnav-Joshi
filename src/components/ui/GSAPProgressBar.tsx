'use client'

import { useEffect, useRef } from 'react'

export function GSAPProgressBar() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      if (!barRef.current) return

      gsap.to(barRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        },
      })
    }

    loadGSAP()
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent pointer-events-none">
      <div
        ref={barRef}
        className="h-full w-full origin-left scale-x-0"
        style={{
          background:
            'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
        }}
      />
    </div>
  )
}
