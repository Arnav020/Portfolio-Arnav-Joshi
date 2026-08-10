const LABELS = [
  { title: 'Surface', body: 'What you see is the product.' },
  { title: 'Systems', body: 'Every system has a purpose.' },
  { title: 'Intelligence', body: 'Models learn. Agents reason.' },
  { title: 'Foundation', body: 'Data. Compute. Infrastructure.' },
]

export function AnnotationLabels() {
  return (
    <ul className="max-w-sm space-y-7">
      {LABELS.map((l) => (
        <li key={l.title} className="flex items-start gap-3.5">
          <span className="mt-2.5 h-px w-6 flex-shrink-0 bg-accent" aria-hidden="true" />
          <div>
            <div className="font-mono text-xs font-semibold tracking-[0.18em] text-foreground-strong uppercase">
              {l.title}
            </div>
            <p className="mt-1.5 max-w-[17rem] text-base leading-relaxed text-foreground">{l.body}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
