'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface GSAPTextRevealProps {
  text: string
  className?: string
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  delay?: number
  stagger?: number
}

export function GSAPTextReveal({
  text,
  className = '',
  tag: Tag = 'p',
  delay = 0,
  stagger = 0.025,
}: GSAPTextRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion || !ref.current) return
    const el = ref.current

    const loadGSAP = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      // Split text into word spans
      const words = text.split(' ')
      el.innerHTML = words
        .map(
          (w) =>
            `<span class="gsap-word-wrap" style="display:inline-block;overflow:hidden;vertical-align:bottom;margin-right:0.25em">` +
            `<span class="gsap-word" style="display:inline-block;transform:translateY(110%)">${w}</span>` +
            `</span>`
        )
        .join('')

      gsap.to(el.querySelectorAll('.gsap-word'), {
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger,
        delay,
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      })
    }

    loadGSAP()
  }, [text, reducedMotion, delay, stagger])

  return (
    <Tag
      ref={ref as any}
      className={className}
      aria-label={text}
    >
      {text}
    </Tag>
  )
}
