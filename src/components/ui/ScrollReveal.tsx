'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
  className?: string
}

export function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion || !ref.current) return

    const el = ref.current

    const loadGSAP = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const fromVars: gsap.TweenVars = {
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay,
      }

      if (direction === 'up') fromVars.y = 50
      if (direction === 'left') fromVars.x = -50
      if (direction === 'right') fromVars.x = 50

      const toVars: gsap.TweenVars = {
        opacity: 1,
        y: 0,
        x: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }

      gsap.fromTo(el, fromVars, toVars)

      return () => {
        ScrollTrigger.getAll().forEach((t) => t.kill())
      }
    }

    loadGSAP()
  }, [reducedMotion, delay, direction])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
