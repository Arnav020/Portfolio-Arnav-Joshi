import { FileHeading, Tagline } from './parts'
import { skillGroups } from '@/content/skills'

const TONE_CLASS = {
  accent: { label: 'text-accent', pill: 'hover:border-accent' },
  green: { label: 'text-c-green', pill: 'hover:border-c-green' },
  blue: { label: 'text-c-blue', pill: 'hover:border-c-blue' },
  pink: { label: 'text-c-pink', pill: 'hover:border-c-pink' },
  yellow: { label: 'text-c-yellow', pill: 'hover:border-c-yellow' },
  purple: { label: 'text-c-purple', pill: 'hover:border-c-purple' },
} as const

export function SkillsFile() {
  return (
    <>
      <Tagline syntax="slash">skills.json — the stack I actually reach for</Tagline>

      <FileHeading
        title="Skills"
        sub={
          <span className="font-mono">
            {'{ "status": "always_learning", "depth": "over_breadth" }'}
          </span>
        }
      />

      {/* Groups rise in sequence; each group's pills pop in behind it, so the
          eye is led down the column instead of everything landing at once. */}
      <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
        {skillGroups.map((g, gi) => {
          const tone = TONE_CLASS[g.tone]
          const groupDelay = gi * 70
          return (
            <section
              key={g.key}
              className="rise-item"
              style={{ animationDelay: `${groupDelay}ms` }}
            >
              <h2 className={`mb-3 text-xs tracking-[0.16em] uppercase ${tone.label}`}>
                {g.label}
              </h2>
              <ul className="flex flex-wrap gap-1.5">
                {g.items.map((item, i) => (
                  <li
                    key={item}
                    className={`pop-item rounded border border-line bg-surface px-2.5 py-1 text-xs text-dim transition-colors ${tone.pill}`}
                    style={{ animationDelay: `${groupDelay + 80 + i * 22}ms` }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </>
  )
}
