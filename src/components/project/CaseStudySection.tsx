import type { CaseStudySection as CaseStudySectionType } from '@/types'

export function CaseStudySection({ section }: { section: CaseStudySectionType }) {
  return (
    <div>
      <h2 className="mb-3 text-xl font-semibold tracking-tight text-foreground-strong">{section.heading}</h2>
      <div className="space-y-4">
        {section.body.map((p, i) => (
          <p key={i} className="leading-relaxed text-foreground">
            {p}
          </p>
        ))}
      </div>
    </div>
  )
}
