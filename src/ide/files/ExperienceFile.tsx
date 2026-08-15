import { FileHeading, Tagline } from './parts'
import { experiences } from '@/content/experience'

export function ExperienceFile() {
  return (
    <>
      <Tagline syntax="slash">experience.ts — where the work happened</Tagline>

      <FileHeading
        title="Experience"
        sub={<span className="font-mono">interface Career extends Timeline {'{}'}</span>}
      />

      <ol className="relative">
        {experiences.map((e, i) => (
          <li
            key={e.company}
            className="rise-item relative pb-8 pl-8 last:pb-0"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            {/* Rail stops at the last node instead of trailing into whitespace. */}
            {i < experiences.length - 1 && (
              <span
                className="absolute top-5 bottom-0 left-[7px] w-px bg-line"
                aria-hidden="true"
              />
            )}

            <span
              className={`absolute top-1 left-0 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 ${
                e.current ? 'border-accent' : 'border-faint'
              }`}
              aria-hidden="true"
            >
              {e.current && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
            </span>

            <p className="font-mono text-xs text-faint">
              {e.period}
              {e.current && <span className="ml-2 text-c-green">● current</span>}
            </p>

            <h3 className="mt-1 font-display text-xl font-bold text-fg-strong">
              {e.role}
            </h3>
            <p className="mt-0.5 text-sm text-accent">@ {e.company}</p>

            <ul className="mt-3 space-y-2">
              {e.description.map((d) => (
                <li key={d} className="flex gap-2 text-sm leading-6 text-dim">
                  <span className="mt-[2px] text-faint" aria-hidden="true">
                    ▹
                  </span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>

            {/* Accent-tinted rather than the neutral pills used elsewhere, so
                the timeline's stack reads as part of the role, not chrome. */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {e.techStack.map((t) => (
                <span
                  key={t}
                  className="rounded border border-accent/35 bg-accent/10 px-2 py-0.5 text-[11px] text-accent-2"
                >
                  {t}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </>
  )
}
