'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Badge } from '@/components/ui/Badge'
import { projects } from '@/data/projects'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { Project } from '@/types'

const CATEGORY_LABEL: Record<Project['category'], string> = {
  ml: 'ML',
  backend: 'Backend',
  fullstack: 'Full-Stack',
  mlops: 'MLOps',
  other: 'Other',
}

// First letter shown large/faint on the placeholder cover — 'other' and 'mlops'
// nudged so they don't both collide on "M"/"O" ambiguity.
const CATEGORY_MARK: Record<Project['category'], string> = {
  ml: 'M',
  backend: 'B',
  fullstack: 'F',
  mlops: 'O',
  other: '—',
}

export function ProjectCard({ project, index }: { project: Project; index?: number }) {
  const reportNo = (index ?? projects.findIndex((p) => p.slug === project.slug)) + 1

  const cardRef = useRef<HTMLAnchorElement>(null)
  const shadowRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()

  // GSAP takes over hover/press choreography when motion is allowed. Under
  // reduced motion this effect never runs, so no inline styles get set, and
  // the plain CSS opacity classes on the CTA span (below) are what's actually
  // visible — an opacity-only fallback, no lift/scale, per the accessibility
  // pattern already used elsewhere on this site.
  useGSAP(
    () => {
      if (reducedMotion) return
      gsap.set(shadowRef.current, { opacity: 0 })
      gsap.set(imageRef.current, { scale: 1 })
      gsap.set(ctaRef.current, { opacity: 0, y: 6 })
    },
    { scope: cardRef, dependencies: [reducedMotion] }
  )

  function animateIn() {
    if (reducedMotion) return
    gsap.to(cardRef.current, { y: -6, duration: 0.28, ease: 'back.out(1.7)', overwrite: true })
    gsap.to(shadowRef.current, { opacity: 1, duration: 0.28, ease: 'power2.out', overwrite: true })
    gsap.to(imageRef.current, { scale: 1.06, duration: 0.35, ease: 'power2.out', overwrite: true })
    gsap.to(ctaRef.current, { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out', overwrite: true })
  }

  function animateOut() {
    if (reducedMotion) return
    gsap.to(cardRef.current, { y: 0, duration: 0.18, ease: 'power2.out', overwrite: true })
    gsap.to(shadowRef.current, { opacity: 0, duration: 0.18, ease: 'power2.out', overwrite: true })
    gsap.to(imageRef.current, { scale: 1, duration: 0.2, ease: 'power2.out', overwrite: true })
    gsap.to(ctaRef.current, { opacity: 0, y: 6, duration: 0.15, ease: 'power2.out', overwrite: true })
  }

  return (
    <div className="relative">
      {/* Shadow lives on its own layer behind the card — only its opacity animates,
          never box-shadow directly, since box-shadow isn't a compositor-only property. */}
      <div
        ref={shadowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 rounded-2xl"
        style={{ boxShadow: '0 30px 55px -20px rgba(27, 20, 15, 0.45)' }}
      />

      <Link
        ref={cardRef}
        href={`/work/${project.slug}`}
        onPointerEnter={(e) => e.pointerType === 'mouse' && animateIn()}
        onPointerLeave={(e) => e.pointerType === 'mouse' && animateOut()}
        onPointerDown={(e) => e.pointerType === 'touch' && animateIn()}
        onPointerUp={(e) => {
          if (e.pointerType !== 'touch') return
          window.setTimeout(animateOut, 350) // brief tap-feedback before the click-through navigates
        }}
        onFocus={animateIn}
        onBlur={animateOut}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors duration-150 ease-[var(--ease-out)] hover:border-border-strong"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-background">
          {project.image ? (
            <div ref={imageRef} className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt={`${project.title} screenshot`}
                className="h-full w-full object-cover object-top"
                loading="lazy"
                decoding="async"
              />
            </div>
          ) : (
            <div
              ref={imageRef}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background:
                  'radial-gradient(120% 120% at 20% 20%, var(--surface-hover), var(--surface) 70%)',
              }}
            >
              <span className="select-none text-[7rem] leading-none font-bold text-foreground-strong/10">
                {CATEGORY_MARK[project.category]}
              </span>
            </div>
          )}

          <span
            ref={ctaRef}
            className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-background/15 bg-foreground-strong/70 px-3 py-1.5 text-xs font-medium text-background opacity-0 backdrop-blur-md backdrop-saturate-150 transition-opacity duration-200 ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            View field report
            <ArrowUpRight className="h-3 w-3" />
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="mb-3 flex items-start justify-between gap-3">
            <span className="font-mono text-xs font-medium tracking-wide text-muted-foreground">
              Field Report No. {String(reportNo).padStart(2, '0')}
            </span>
          </div>

          <div className="mb-2 flex items-center gap-2">
            <Badge>{CATEGORY_LABEL[project.category]}</Badge>
          </div>

          <h3 className="mb-2 text-lg font-semibold text-foreground-strong">{project.title}</h3>
          <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">{project.description}</p>

          <div className="flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 4).map((t) => (
              <span key={t} className="text-xs text-muted-foreground">
                {t}
                {t !== project.techStack.slice(0, 4).at(-1) && <span className="ml-1.5 text-border-strong">·</span>}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  )
}
