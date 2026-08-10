import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { projects } from '@/data/projects'

const FEATURED = projects.slice(0, 3)

export function ProjectsLeft() {
  return (
    <div className="max-w-sm">
      <p className="mb-4 font-mono text-xs font-semibold tracking-[0.22em] text-accent uppercase">
        04 — The Build
      </p>
      <h2 className="font-serif text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] text-foreground-strong">
        Projects.
        <br />
        Ideas <em className="italic">engineered</em>
        <br />
        into solutions.
      </h2>
      <Link
        href="/work"
        className="group mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-background transition-[opacity,transform] duration-150 ease-[var(--ease-out)] hover:opacity-90 active:scale-[0.97]"
      >
        View all projects
        <ArrowRight className="h-4 w-4 transition-transform duration-150 ease-[var(--ease-out)] group-hover:translate-x-0.5" />
      </Link>
    </div>
  )
}

export function ProjectsRight() {
  return (
    <ul className="max-w-md divide-y divide-border-strong">
      {FEATURED.map((p, i) => (
        <li key={p.slug}>
          <Link href={`/work/${p.slug}`} className="group block py-6 first:pt-0 last:pb-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-semibold text-accent">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-serif text-2xl leading-[1.15] text-foreground-strong">{p.title}</h3>
              </div>
              <ArrowRight className="mt-2 h-4 w-4 flex-shrink-0 -translate-x-0.5 text-accent opacity-0 transition-[transform,opacity] duration-150 ease-[var(--ease-out)] group-hover:translate-x-0 group-hover:opacity-100" />
            </div>
            <p className="mt-2.5 pl-[2.35rem] text-sm leading-relaxed text-muted-foreground">{p.description}</p>
            <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 pl-[2.35rem]">
              {p.techStack.slice(0, 3).map((t) => (
                <span key={t} className="text-xs font-medium text-muted-foreground/80">
                  {t}
                </span>
              ))}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  )
}
