import { experiences } from '@/data/experience'

export function ExperienceLeft() {
  return (
    <div className="max-w-sm">
      <p className="mb-4 font-mono text-xs font-semibold tracking-[0.22em] text-accent uppercase">
        03 — The Journey
      </p>
      <h2 className="font-serif text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] text-foreground-strong">
        Research.
        <br />
        Build. Ship.
      </h2>
      <p className="mt-5 max-w-sm text-base leading-relaxed text-muted-foreground">
        Underneath the surface: three internships spent moving between
        research questions and production systems.
      </p>
    </div>
  )
}

export function ExperienceRight() {
  return (
    <div className="relative max-w-md pl-7">
      <div
        data-experience-rule
        className="absolute top-1.5 left-0 w-px bg-border-strong"
        style={{ height: 'calc(100% - 0.375rem)' }}
        aria-hidden="true"
      />
      <div
        data-experience-fill
        className="absolute top-1.5 left-0 w-px origin-top bg-accent"
        style={{ height: '0%' }}
        aria-hidden="true"
      />

      <ul className="space-y-7">
        {experiences.map((exp) => (
          <li key={exp.company} className="relative">
            <span
              data-experience-dot
              className="absolute top-1.5 -left-7 h-3 w-3 rounded-full border-2 bg-background transition-colors duration-300 ease-[var(--ease-out)]"
              style={{ borderColor: 'var(--border-strong)' }}
              aria-hidden="true"
            />
            <div className="font-mono text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
              {exp.period}
            </div>
            <div className="mt-1.5 font-serif text-xl text-foreground-strong">{exp.role}</div>
            <div className="mt-0.5 text-base font-medium text-accent">{exp.company}</div>
            <p className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1">
              {exp.techStack.slice(0, 4).map((t) => (
                <span key={t} className="text-xs font-medium text-muted-foreground">
                  {t}
                </span>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
