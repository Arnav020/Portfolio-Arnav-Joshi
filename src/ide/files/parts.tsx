import type { CSSProperties, ReactNode } from 'react'

/**
 * The opening italic comment every file leads with, written in that file's
 * native comment syntax — the metaphor falls apart if about.html opens with
 * a `//` line.
 */
export function Tagline({
  syntax,
  children,
}: {
  syntax: 'slash' | 'html' | 'css' | 'hash'
  children: string
}) {
  const wrapped =
    syntax === 'html'
      ? `<!-- ${children} -->`
      : syntax === 'css'
        ? `/* ${children} */`
        : syntax === 'hash'
          ? `# ${children}`
          : `// ${children}`

  // Reference renders these in the theme's green, not its comment grey.
  return (
    <p className="mb-5 font-mono text-[13px] text-c-green italic">{wrapped}</p>
  )
}

export function FileHeading({
  title,
  sub,
}: {
  title: string
  sub?: ReactNode
}) {
  return (
    <header className="mb-8">
      <h1 className="font-display text-4xl font-extrabold tracking-tight text-fg-strong sm:text-5xl">
        {title}
      </h1>
      {sub && <p className="mt-3 text-sm text-dim">{sub}</p>}
    </header>
  )
}

export function SectionLabel({
  children,
  tone = 'accent',
}: {
  children: ReactNode
  tone?: 'accent' | 'green' | 'blue' | 'pink' | 'yellow'
}) {
  const color = {
    accent: 'text-accent',
    green: 'text-c-green',
    blue: 'text-c-blue',
    pink: 'text-c-pink',
    yellow: 'text-c-yellow',
  }[tone]

  return (
    <h2 className={`mb-4 text-sm tracking-[0.18em] uppercase ${color}`}>{children}</h2>
  )
}

export function Card({
  children,
  className = '',
  style,
}: {
  children: ReactNode
  className?: string
  /** Used by staggered lists to set their own animation-delay. */
  style?: CSSProperties
}) {
  return (
    <div className={`rounded-lg border border-line bg-panel p-5 ${className}`} style={style}>
      {children}
    </div>
  )
}

export function TechPill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded border border-line bg-surface px-2 py-0.5 text-[11px] text-dim">
      {children}
    </span>
  )
}

const TONE_TEXT = {
  accent: 'text-accent',
  green: 'text-c-green',
  blue: 'text-c-blue',
  pink: 'text-c-pink',
  yellow: 'text-c-yellow',
  purple: 'text-c-purple',
} as const

export type Tone = keyof typeof TONE_TEXT

export function DotPill({
  children,
  tone = 'accent',
}: {
  children: ReactNode
  tone?: Tone
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-1.5 text-xs text-fg">
      <span
        className={`h-1.5 w-1.5 rounded-full bg-current ${TONE_TEXT[tone]}`}
        aria-hidden="true"
      />
      {children}
    </span>
  )
}

/**
 * Renders `**highlighted**` spans in the accent colour. Deliberately tiny —
 * the content files need emphasis, not a markdown runtime.
 */
export function Emphasis({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((chunk, i) =>
        chunk.startsWith('**') && chunk.endsWith('**') ? (
          <strong key={i} className="font-medium text-c-blue">
            {chunk.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{chunk}</span>
        )
      )}
    </>
  )
}
