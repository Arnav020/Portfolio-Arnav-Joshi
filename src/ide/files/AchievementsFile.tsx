import { Card, FileHeading, Tagline } from './parts'
import { achievements } from '@/content/skills'

export function AchievementsFile() {
  return (
    <>
      <Tagline syntax="hash">achievements.log — tail -f the wins</Tagline>

      <FileHeading
        title="Achievements"
        sub={<span className="font-mono">[INFO] 5 entries · sorted by recency</span>}
      />

      <div className="space-y-3">
        {achievements.map((a, i) => (
          <Card
            key={a.title}
            className="rise-item flex gap-4"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <span className="text-xl" aria-hidden="true">
              {a.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-base font-bold text-fg-strong">
                  {a.title}
                </h3>
                <span className="font-mono text-xs text-faint">{a.year}</span>
              </div>
              <p className="mt-1.5 text-sm leading-6 text-dim">{a.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}
