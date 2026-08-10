import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { ProjectHero } from '@/components/project/ProjectHero'
import { ProjectMeta } from '@/components/project/ProjectMeta'
import { ProjectNav } from '@/components/project/ProjectNav'
import { CaseStudySection } from '@/components/project/CaseStudySection'
import { diagramRegistry } from '@/components/project/diagrams/registry'
import { DiagramFrame } from '@/components/project/diagrams/DiagramFrame'
import { projects } from '@/data/projects'

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) return {}

  return {
    title: `${project.title} — Arnav Joshi`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: 'article',
    },
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) notFound()

  const isCaseStudy = Boolean(project.problem && project.approach && project.outcome)
  const Diagram = project.diagram ? diagramRegistry[project.diagram] : undefined

  return (
    <>
      <ProjectHero project={project} />

      <Container className="py-14 md:py-20">
        {isCaseStudy ? (
          <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
            <div className="min-w-0 max-w-[var(--prose-width)] space-y-12">
              {project.problem && <CaseStudySection section={project.problem} />}
              {Diagram && (
                <DiagramFrame title={`${project.title} — architecture`}>
                  <Diagram />
                </DiagramFrame>
              )}
              {project.approach && <CaseStudySection section={project.approach} />}
              {project.decisions?.map((d, i) => <CaseStudySection key={i} section={d} />)}
              {project.outcome && <CaseStudySection section={project.outcome} />}
            </div>
            <ProjectMeta project={project} />
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
            <div className="min-w-0 max-w-[var(--prose-width)] space-y-6">
              <p className="leading-relaxed text-foreground">{project.longDescription ?? project.description}</p>
              <ul className="space-y-2.5">
                {project.highlights.map((h, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-foreground">
                    <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            <ProjectMeta project={project} />
          </div>
        )}
      </Container>

      <ProjectNav currentSlug={project.slug} />
    </>
  )
}
