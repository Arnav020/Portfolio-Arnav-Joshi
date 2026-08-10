import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { projects } from '@/data/projects'

export function ProjectNav({ currentSlug }: { currentSlug: string }) {
  const index = projects.findIndex((p) => p.slug === currentSlug)
  const prev = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]

  return (
    <div className="border-t border-border py-10">
      <Container className="flex items-center justify-between gap-4">
        <Link
          href={`/work/${prev.slug}`}
          className="group flex min-w-0 flex-col items-start gap-1 text-left"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-150 ease-[var(--ease-out)] group-hover:-translate-x-0.5" />
            Previous
          </span>
          <span className="truncate text-sm font-medium text-foreground-strong">{prev.title}</span>
        </Link>

        <Link
          href={`/work/${next.slug}`}
          className="group flex min-w-0 flex-col items-end gap-1 text-right"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            Next
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 ease-[var(--ease-out)] group-hover:translate-x-0.5" />
          </span>
          <span className="truncate text-sm font-medium text-foreground-strong">{next.title}</span>
        </Link>
      </Container>
    </div>
  )
}
