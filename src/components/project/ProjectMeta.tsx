import { Star } from 'lucide-react'
import { getRepoStats, repoNameForSlug } from '@/lib/github'
import type { Project } from '@/types'

export async function ProjectMeta({ project }: { project: Project }) {
  const repoName = repoNameForSlug(project.slug)
  const stats = repoName ? await getRepoStats(repoName) : null
  const hasStars = Boolean(stats && stats.stars > 0)
  const hasMetrics = Boolean(project.metrics && project.metrics.length > 0)

  return (
    <aside className="space-y-6">
      {(hasStars || hasMetrics) && (
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            At a glance
          </h3>
          <dl className="space-y-3">
            {stats && stats.stars > 0 && (
              <div className="flex items-center justify-between text-sm">
                <dt className="flex items-center gap-1.5 text-muted-foreground">
                  <Star className="h-3.5 w-3.5" />
                  GitHub stars
                </dt>
                <dd className="font-mono font-medium text-foreground-strong">{stats.stars}</dd>
              </div>
            )}
            {project.metrics?.map((m) => (
              <div key={m.label} className="flex items-center justify-between gap-4 text-sm">
                <dt className="text-muted-foreground">{m.label}</dt>
                <dd className="text-right font-mono font-medium text-foreground-strong">{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </aside>
  )
}
