'use client'

import { useInView } from '@/hooks/useInView'
import { cn } from '@/lib/utils'

interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'li'
}

/**
 * Fades + rises content into view on first intersection. CSS-transition based
 * (not keyframes) so it stays interruptible, and off Framer's rAF loop.
 * prefers-reduced-motion is handled globally in globals.css (opacity survives, motion doesn't).
 */
export function ScrollReveal({ children, delay = 0, className, as = 'div' }: ScrollRevealProps) {
  const { ref, isInView } = useInView({ threshold: 0.15, triggerOnce: true })
  const Tag = as

  return (
    <Tag
      ref={ref as never}
      className={cn('transition-[opacity,transform] duration-[600ms] ease-[var(--ease-out)]', className)}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(12px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </Tag>
  )
}
