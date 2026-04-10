'use client'

import { useEffect, useRef } from 'react'
import { useInView } from '@/hooks/useInView'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface AnimatedCounterProps {
  value: string
  className?: string
}

export function AnimatedCounter({ value, className = '' }: AnimatedCounterProps) {
  const { ref, isInView } = useInView({ threshold: 0.5, triggerOnce: true })
  const reducedMotion = useReducedMotion()
  const spanRef = useRef<HTMLSpanElement>(null)

  // Extract numeric part from value string like "9.55" or "19" or "96.7"
  const numericMatch = value.match(/[\d.]+/)
  const numericValue = numericMatch ? parseFloat(numericMatch[0]) : 0
  const isDecimal = value.includes('.')
  const decimals = isDecimal ? (value.split('.')[1]?.length ?? 0) : 0

  useEffect(() => {
    if (!isInView || !spanRef.current) return

    if (reducedMotion) {
      spanRef.current.textContent = value
      return
    }

    const loadGSAP = async () => {
      const { gsap } = await import('gsap')
      const obj = { val: 0 }

      gsap.to(obj, {
        val: numericValue,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: () => {
          if (spanRef.current) {
            spanRef.current.textContent = obj.val.toFixed(decimals)
          }
        },
      })
    }

    loadGSAP()
  }, [isInView, numericValue, decimals, value, reducedMotion])

  return (
    <span ref={ref as any} className={className}>
      <span ref={spanRef}>{reducedMotion ? value : '0'}</span>
    </span>
  )
}
