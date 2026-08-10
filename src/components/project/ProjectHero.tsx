import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Github } from '@/components/ui/BrandIcons'
import { Badge } from '@/components/ui/Badge'
import { Container } from '@/components/ui/Container'
import { projects } from '@/data/projects'
import type { Project } from '@/types'

const CATEGORY_LABEL: Record<Project['category'], string> = {
  ml: 'ML',
  backend: 'Backend',
  fullstack: 'Full-Stack',
  mlops: 'MLOps',
  other: 'Other',
}

export function ProjectHero({ project }: { project: Project }) {
  const reportNo = projects.findIndex((p) => p.slug === project.slug) + 1

  return (
    <div className="border-b border-border pt-28 pb-14 md:pt-32 md:pb-20">
      <Container>
        <Link
          href="/work"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground-strong"
        >
          <ArrowLeft className="h-4 w-4" />
          All field reports
        </Link>

        <p className="mb-3 font-mono text-xs font-semibold tracking-[0.2em] text-accent uppercase">
          Field Report No. {String(reportNo).padStart(2, '0')}
        </p>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge>{CATEGORY_LABEL[project.category]}</Badge>
          {project.timeframe && <span className="font-mono text-xs text-muted-foreground">{project.timeframe}</span>}
        </div>

        <h1 className="max-w-3xl font-serif text-[clamp(2.25rem,4.5vw,3.5rem)] leading-tight text-foreground-strong">
          {project.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{project.description}</p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-foreground-strong px-5 py-2.5 text-sm font-medium text-background transition-[transform,opacity] duration-150 ease-[var(--ease-out)] hover:opacity-90 active:scale-[0.97]"
          >
            <Github className="h-4 w-4" />
            View on GitHub
          </a>
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border-strong px-5 py-2.5 text-sm font-medium text-foreground-strong transition-colors duration-150 ease-[var(--ease-out)] hover:bg-surface active:scale-[0.97]"
            >
              Live demo
              <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1.5">
          {project.techStack.map((t) => (
            <span key={t} className="text-sm text-muted-foreground">
              {t}
            </span>
          ))}
        </div>

        {project.image && (
          <div className="mt-10 overflow-hidden rounded-2xl border border-border shadow-[0_30px_60px_-30px_rgba(43,33,29,0.3)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.image}
              alt={`${project.title} screenshot`}
              className="w-full object-cover object-top"
              loading="eager"
              decoding="async"
            />
          </div>
        )}
      </Container>
    </div>
  )
}
