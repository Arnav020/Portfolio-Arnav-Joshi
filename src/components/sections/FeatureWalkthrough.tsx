'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Container } from '@/components/ui/Container'
import { pillars } from '@/data/pillars'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Sticky-scroll feature walkthrough: the right panel stays pinned on desktop
 * while three copy blocks scroll past on the left. Each block's active state
 * is driven by its own ScrollTrigger (onEnter/onEnterBack), not the
 * IntersectionObserver pattern FeaturedProjectsStack uses — a deliberate,
 * separate technique per section.
 */
export function FeatureWalkthrough() {
  const sectionRef = useRef<HTMLElement>(null)
  const blockRefs = useRef<(HTMLDivElement | null)[]>([])
  const [active, setActive] = useState(0)
  const reducedMotion = useReducedMotion()

  // Wire up one ScrollTrigger per copy block to track which is "active."
  useGSAP(
    () => {
      if (reducedMotion) return

      const triggers = pillars.map((_, i) =>
        ScrollTrigger.create({
          trigger: blockRefs.current[i],
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        })
      )

      return () => triggers.forEach((t) => t.kill())
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  )

  // Fade/highlight blocks via GSAP whenever the active index changes.
  useGSAP(
    () => {
      if (reducedMotion) return
      blockRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.to(el, { opacity: i === active ? 1 : 0.4, duration: 0.4, ease: 'power2.out' })
      })
    },
    { scope: sectionRef, dependencies: [active, reducedMotion] }
  )

  const activePillar = pillars[active]

  return (
    <section ref={sectionRef} className="py-24 md:py-32">
      <Container>
        <div className="mb-16 max-w-xl">
          <p className="mb-4 font-mono text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            What I Do
          </p>
          <h2 className="font-serif text-[clamp(2.25rem,4.5vw,3.25rem)] leading-tight text-foreground-strong">
            Three things I actually build.
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-16">
          <div>
            {pillars.map((p, i) => (
              <div
                key={p.title}
                ref={(el) => {
                  blockRefs.current[i] = el
                }}
                className={cn(
                  'flex flex-col justify-center border-t-2 border-l-2 py-10 pl-6 -ml-6 first:border-t-0 first:pt-0 lg:min-h-[70vh] transition-colors duration-300 ease-[var(--ease-out)]',
                  i === active ? 'border-t-transparent border-l-accent' : 'border-t-border-strong border-l-transparent'
                )}
              >
                <span className={cn('font-mono text-xs font-semibold transition-colors duration-300', i === active ? 'text-accent' : 'text-muted-foreground')}>
                  0{i + 1}
                </span>
                <h3 className="mt-3 font-serif text-3xl text-foreground-strong md:text-4xl">{p.title}</h3>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-foreground">{p.body}</p>
                <Link
                  href={p.href}
                  className="group mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-accent transition-opacity hover:opacity-70"
                >
                  {p.linkLabel}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-150 ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>

                {/* Sticky panel is desktop-only — surface the stat inline here on mobile instead. */}
                <div className="mt-6 border-t border-border pt-4 lg:hidden">
                  <div className="font-mono text-2xl font-semibold text-accent">{p.stat.value}</div>
                  <div className="text-sm text-muted-foreground">{p.stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative hidden lg:block">
            <div className="sticky top-28 border-t-2 border-accent pt-5">
              <span className="font-mono text-xs font-semibold text-accent">
                0{active + 1} / 0{pillars.length}
              </span>
              <h4 className="mt-2 font-serif text-2xl text-foreground-strong">{activePillar.title}</h4>
              <div className="mt-6 border-t border-border-strong pt-4">
                <div className="font-mono text-3xl font-semibold text-accent">{activePillar.stat.value}</div>
                <div className="text-sm text-muted-foreground">{activePillar.stat.label}</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
