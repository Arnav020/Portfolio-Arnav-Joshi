import { Card, Emphasis, FileHeading, SectionLabel, Tagline } from './parts'
import { currentFocus, profile } from '@/content/profile'
import { education } from '@/content/experience'

export function AboutFile() {
  return (
    <>
      <Tagline syntax="html">{`about.html — ${profile.firstName} ${profile.lastName}`}</Tagline>

      <FileHeading title="About Me" sub="// who I am · what I build · why it works" />

      <Card className="mb-8">
        <p className="text-[14px] leading-[1.9] text-dim">
          <Emphasis text={profile.bio} />
        </p>
      </Card>

      <Card className="mb-8">
        <SectionLabel tone="green">Current Focus</SectionLabel>
        <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {currentFocus.map((f) => (
            <li key={f.text} className="flex gap-2.5 text-sm leading-6 text-dim">
              <span aria-hidden="true">{f.emoji}</span>
              <span>{f.text}</span>
            </li>
          ))}
        </ul>
      </Card>

      <section>
        <SectionLabel tone="blue">Education</SectionLabel>
        <div className="space-y-3">
          {education.map((e) => (
            <Card key={e.institution}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="flex items-baseline gap-2 font-display text-lg font-bold text-fg-strong">
                  <span aria-hidden="true">{e.emoji}</span>
                  {e.institution}
                </h3>
                <span className="font-mono text-xs text-faint">{e.period}</span>
              </div>
              <p className="mt-1 text-sm text-dim">{e.degree}</p>
              <p className="mt-1 font-mono text-xs text-c-green">{e.score}</p>
              {e.highlights.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {e.highlights.map((h) => (
                    <li key={h} className="text-xs text-dim">
                      <span className="mr-2 text-faint">▹</span>
                      {h}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>
      </section>
    </>
  )
}
