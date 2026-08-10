'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Container } from '@/components/ui/Container'
import { useReducedMotion } from '@/hooks/useReducedMotion'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * A "how I work" statement, staged as three layers moving at different
 * scroll-linked speeds — background barely drifts, the midground photo moves
 * more (reads as closer/heavier), the headline moves least so it stays the
 * most stable, readable thing on screen. Leads straight into ScrollSequence
 * below: this section ends on the intact object, the next one takes it apart.
 */
export function ParallaxIntro() {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const midRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion || !sectionRef.current) return

      const isMobile = window.innerWidth < 768
      const bgRange = isMobile ? 3 : 6
      const midRange = isMobile ? 6 : 18
      const textRange = isMobile ? 1.5 : 4

      const trigger = {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.6,
      }

      gsap.fromTo(bgRef.current, { yPercent: -bgRange }, { yPercent: bgRange, ease: 'none', scrollTrigger: trigger })
      gsap.fromTo(midRef.current, { yPercent: -midRange }, { yPercent: midRange, ease: 'none', scrollTrigger: trigger })
      gsap.fromTo(textRef.current, { yPercent: -textRange }, { yPercent: textRange, ease: 'none', scrollTrigger: trigger })
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  )

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-24 md:min-h-[90vh] md:py-32">
      {/* Background layer — barely moves, reads as "furthest away" */}
      <div
        ref={bgRef}
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(1200px circle at 80% 20%, color-mix(in srgb, var(--accent) 7%, transparent), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <Container className="relative grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-8">
        {/* Foreground text — moves least, stays the readable anchor */}
        <div ref={textRef} className="relative z-10">
          <p className="mb-4 font-mono text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            How I Work
          </p>
          <h2 className="font-serif text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] text-foreground-strong">
            I don&apos;t trust a system until I&apos;ve taken it apart.
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            The Failure Injection Engine exists because I&apos;d rather break something on
            purpose than find out how it fails in production. The physics-informed ML
            work is the same instinct pointed at data: understand what a system is
            actually built from before you trust what it tells you. Scroll on — this is
            what that looks like, one layer at a time.
          </p>
        </div>

        {/* Midground — the framed image, moves the most, reads as "closest" */}
        <div ref={midRef} className="relative z-0">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface p-3 shadow-[0_30px_60px_-20px_rgba(43,33,29,0.25)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/frames/ezgif-frame-001.jpg"
              alt="A system, still fully assembled — before it comes apart below."
              className="aspect-[16/10] w-full rounded-lg object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
