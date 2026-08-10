import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { ProjectCard } from '@/components/project/ProjectCard'
import { SOCIAL_LINKS } from '@/lib/constants'
import { projects } from '@/data/projects'

export const metadata: Metadata = {
  title: 'Field Reports — Arnav Joshi',
  description: 'Selected field reports — the most impactful ML systems, agentic AI pipelines, and full-stack apps.',
}

export default function WorkIndexPage() {
  return (
    <Container className="pt-28 pb-14 md:pt-32 md:pb-20">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground-strong"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <p className="mb-3 font-mono text-xs font-semibold tracking-[0.2em] text-accent uppercase">
        Field Reports
      </p>
      <h1 className="mb-4 font-serif text-4xl text-foreground-strong md:text-5xl">Selected work</h1>
      <p className="mb-12 max-w-xl text-base leading-relaxed text-muted-foreground">
        {projects.length} field reports — the projects I&apos;d point you to first. For
        everything else I&apos;ve shipped, my{' '}
        <a
          href={SOCIAL_LINKS.github}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-border-strong decoration-1 underline-offset-4 transition-colors hover:text-foreground-strong hover:decoration-accent"
        >
          GitHub
        </a>{' '}
        has the full log.
      </p>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>
    </Container>
  )
}
