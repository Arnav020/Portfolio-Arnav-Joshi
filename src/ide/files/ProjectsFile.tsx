import { ExternalLink } from 'lucide-react'
import { GithubMark } from '../BrandIcons'
import { FileHeading, Tagline, TechPill } from './parts'
import { projects, type ProjectTone } from '@/content/projects'

/**
 * Full class strings, not interpolated fragments — Tailwind only ships classes
 * it can see literally in the source.
 */
const TONE: Record<ProjectTone, { text: string; border: string; hover: string }> = {
  purple: { text: 'text-c-purple', border: 'bg-c-purple', hover: 'hover:border-c-purple/60' },
  orange: { text: 'text-c-orange', border: 'bg-c-orange', hover: 'hover:border-c-orange/60' },
  green: { text: 'text-c-green', border: 'bg-c-green', hover: 'hover:border-c-green/60' },
  blue: { text: 'text-c-blue', border: 'bg-c-blue', hover: 'hover:border-c-blue/60' },
  pink: { text: 'text-c-pink', border: 'bg-c-pink', hover: 'hover:border-c-pink/60' },
  yellow: { text: 'text-c-yellow', border: 'bg-c-yellow', hover: 'hover:border-c-yellow/60' },
}

export function ProjectsFile() {
  return (
    <>
      <Tagline syntax="slash">projects.js — things I&apos;ve built &amp; shipped</Tagline>

      <FileHeading
        title="Projects"
        sub={<span className="font-mono">const projects = [ ...shipped, ...building ]</span>}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {projects.map((p, i) => {
          const tone = TONE[p.tone]
          return (
            <article
              key={p.id}
              // Cards deal in reading order, so the stagger follows the grid.
              style={{ animationDelay: `${i * 70}ms` }}
              className={`rise-item group relative flex flex-col overflow-hidden rounded-lg border border-line bg-panel p-5 transition-colors ${tone.hover}`}
            >
              {/* Wipes in from the left on hover. scale-x on a full-width bar
                  animates on the compositor; animating width would not. */}
              <span
                className={`absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 ${tone.border}`}
                aria-hidden="true"
              />

              <div className="mb-3 flex items-start justify-between gap-3">
                <span className="text-2xl leading-none" aria-hidden="true">
                  {p.emoji}
                </span>
                <div className="flex gap-1.5">
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded border border-line px-2 py-1 text-[11px] text-dim transition-colors hover:border-accent hover:text-fg-strong"
                  >
                    <GithubMark className="h-3 w-3" />
                    GitHub
                    <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                  </a>
                  {p.demoUrl && (
                    <a
                      href={p.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded border border-line px-2 py-1 text-[11px] text-dim transition-colors hover:border-accent hover:text-fg-strong"
                    >
                      Live
                      <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                    </a>
                  )}
                </div>
              </div>

              <p className={`mb-2 text-[11px] tracking-[0.16em] uppercase ${tone.text}`}>
                {p.tags.join(' · ')}
              </p>

              <h3 className="font-display text-xl leading-tight font-bold text-fg-strong">
                {p.title}
              </h3>

              <p className="mt-2 text-[13px] leading-6 text-dim">{p.description}</p>

              <ul className="mt-3 flex-1 space-y-2">
                {p.highlights.map((h) => (
                  <li key={h} className="flex gap-2 text-[12px] leading-5 text-dim">
                    <span className={`mt-px shrink-0 ${tone.text}`} aria-hidden="true">
                      ▹
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.techStack.map((t) => (
                  <TechPill key={t}>{t}</TechPill>
                ))}
              </div>
            </article>
          )
        })}
      </div>
    </>
  )
}
