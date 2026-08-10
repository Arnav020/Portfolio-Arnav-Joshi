import { education } from '@/data/education'

export function EducationLeft() {
  return (
    <div className="max-w-sm">
      <p className="mb-4 font-mono text-xs font-semibold tracking-[0.22em] text-accent uppercase">
        02 — Foundations
      </p>
      <h2 className="font-serif text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] text-foreground-strong">
        The foundation
        <br />
        behind everything I <em className="italic">build</em>.
      </h2>
      <p className="mt-5 max-w-sm text-base leading-relaxed text-muted-foreground">
        Every system starts with the fundamentals — the coursework, the
        scholarships earned for staying at the top of the class, the years
        before any of the projects existed.
      </p>
    </div>
  )
}

export function EducationRight() {
  return (
    <ul className="max-w-md space-y-8">
      {education.map((e) => (
        <li key={e.institution} className="border-l-2 border-accent pl-5">
          <div className="font-mono text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
            {e.period}
          </div>
          <div className="mt-1.5 font-serif text-xl text-foreground-strong">{e.institution}</div>
          <div className="mt-1 text-base text-foreground">{e.degree}</div>
          <div className="mt-2.5 font-mono text-lg font-semibold text-accent">{e.score}</div>
          {e.highlights.length > 0 && (
            <ul className="mt-2.5 space-y-1.5">
              {e.highlights.map((h) => (
                <li key={h} className="text-sm leading-relaxed text-foreground">
                  {h}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  )
}
