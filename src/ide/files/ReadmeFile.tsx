import { Tagline } from './parts'
import { links, profile } from '@/content/profile'
import { skillGroups } from '@/content/skills'
import { experiences } from '@/content/experience'

/** shields.io-style badges, drawn locally — no external image requests. */
function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded border px-2.5 py-1 text-xs"
      style={{
        borderColor: `color-mix(in srgb, ${color} 45%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
        color,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      {label}
    </span>
  )
}

const BADGES = [
  { label: 'Python', color: '#3776ab' },
  { label: 'TypeScript', color: '#3178c6' },
  { label: 'Go', color: '#00add8' },
  { label: 'PyTorch', color: '#ee4c2c' },
  { label: 'FastAPI', color: '#059669' },
  { label: 'Next.js', color: '#a1a1aa' },
]

export function ReadmeFile() {
  const current = experiences.find((e) => e.current)

  return (
    <>
      <Tagline syntax="html">README.md — start here</Tagline>

      <h1 className="border-b border-line pb-3 font-display text-4xl font-extrabold text-fg-strong">
        {profile.firstName} {profile.lastName}
      </h1>

      <p className="mt-3 text-sm text-dim">
        {current ? `${current.role} @ ${current.company}` : profile.title} ·{' '}
        {profile.location}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {BADGES.map((b) => (
          <Badge key={b.label} {...b} />
        ))}
      </div>

      <h2 className="mt-8 mb-3 font-display text-xl font-bold text-fg-strong">
        <span className="mr-2 text-accent">##</span>About
      </h2>
      <p className="text-sm leading-7 text-fg">{profile.bio}</p>

      <ul className="mt-4 space-y-2">
        {[
          `🛰️ ${current ? `Currently at ${current.company.split(',')[0]}` : profile.title}`,
          '🧠 Agentic LLM pipelines, RAG, and physics-informed ML',
          '⚙️ Go and Python backends that stay observable under failure',
          '📦 MLOps: versioned pipelines, containerised deploys',
        ].map((line) => (
          <li key={line} className="text-sm text-dim">
            {line}
          </li>
        ))}
      </ul>

      <h2 className="mt-8 mb-3 font-display text-xl font-bold text-fg-strong">
        <span className="mr-2 text-accent">##</span>Stack
      </h2>
      <div className="space-y-3">
        {skillGroups.map((g) => (
          <div key={g.key} className="flex flex-wrap items-baseline gap-2">
            <span className="w-full text-xs text-faint sm:w-40 sm:shrink-0">
              {g.label}:
            </span>
            <span className="flex flex-wrap gap-1.5">
              {g.items.map((i) => (
                <span
                  key={i}
                  className="rounded border border-line bg-surface px-2 py-0.5 text-[11px] text-dim"
                >
                  {i}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>

      <h2 className="mt-8 mb-3 font-display text-xl font-bold text-fg-strong">
        <span className="mr-2 text-accent">##</span>Links
      </h2>
      <ul className="space-y-1.5 text-sm">
        {[
          ['GitHub', links.github],
          ['LinkedIn', links.linkedin],
          ['Email', `mailto:${links.email}`],
        ].map(([label, href]) => (
          <li key={label}>
            <span className="text-faint">- </span>
            <a
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="text-c-blue underline underline-offset-4 transition-colors hover:text-accent"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}
