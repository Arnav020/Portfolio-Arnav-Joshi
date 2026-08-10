import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { RESUME_LINKS } from '@/lib/constants'
import { AnnotationLabels } from './AnnotationLabels'

export function IntroLeft() {
  return (
    <div className="max-w-md">
      <p className="mb-5 flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.22em] text-accent uppercase">
        <span className="h-3 w-px bg-accent" aria-hidden="true" />
        AI / ML Engineer
      </p>

      <h1 className="font-serif text-[clamp(2.75rem,6vw,4.75rem)] leading-[0.95] text-foreground-strong">
        Arnav
        <br />
        Joshi<span className="text-accent">.</span>
      </h1>

      <p className="mt-6 max-w-md text-base leading-relaxed text-foreground">
        Building intelligent systems through research-driven ML and production
        software — agentic LLM pipelines, physics-informed models, and the
        infrastructure underneath them.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Link
          href="/work"
          className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-background transition-[opacity,transform] duration-150 ease-[var(--ease-out)] hover:opacity-90 active:scale-[0.97]"
        >
          Explore Work
          <ArrowRight className="h-4 w-4 transition-transform duration-150 ease-[var(--ease-out)] group-hover:translate-x-0.5" />
        </Link>
        <a
          href="#skills"
          className="inline-flex items-center gap-2 rounded-full border border-border-strong px-6 py-3 text-sm font-medium text-foreground-strong transition-[background-color,transform] duration-150 ease-[var(--ease-out)] hover:bg-surface active:scale-[0.97]"
        >
          About Me
        </a>
      </div>

      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
        <a href={RESUME_LINKS.ml} target="_blank" rel="noopener noreferrer" className="underline decoration-border-strong decoration-1 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent">
          Resume — ML
        </a>
        <a href={RESUME_LINKS.sde} target="_blank" rel="noopener noreferrer" className="underline decoration-border-strong decoration-1 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent">
          Resume — SDE
        </a>
      </div>
    </div>
  )
}

export function IntroRight() {
  return <AnnotationLabels />
}
