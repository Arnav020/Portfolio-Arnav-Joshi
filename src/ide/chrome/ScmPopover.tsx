'use client'

import { ExternalLink } from 'lucide-react'
import { useIde } from '../IdeProvider'

/**
 * Cosmetic git panel. The counts are static on purpose — this is a portfolio,
 * not a live repo view, and pretending to read real VCS state would be a lie
 * the page can't back up.
 */
const CHANGES = [
  { label: 'Modified', count: 3, className: 'text-c-yellow' },
  { label: 'Added', count: 1, className: 'text-c-green' },
  { label: 'Deleted', count: 0, className: 'text-c-red' },
]

export function ScmPopover({ githubUrl }: { githubUrl: string }) {
  const { dispatch } = useIde()

  return (
    <>
      <button
        type="button"
        aria-label="Close source control"
        tabIndex={-1}
        className="fixed inset-0 z-40 cursor-default"
        onClick={() => dispatch({ type: 'SCM', open: false })}
      />
      <div className="overlay-in absolute top-[88px] left-[calc(100%+1px)] z-50 w-72 rounded-md border border-line bg-panel shadow-2xl shadow-black/60">
        <div className="border-b border-line px-3 py-2 text-[10px] tracking-[0.18em] text-faint uppercase">
          Source Control
        </div>

        <div className="flex items-center justify-between px-3 py-2.5 text-xs">
          <span className="flex items-center gap-1.5 text-fg-strong">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
              <path d="M11.5 3.5a2 2 0 1 0-2.45 1.95A3 3 0 0 1 6.2 7.9a3 3 0 0 0-1.7.53V5.44a2 2 0 1 0-1 0v5.12a2 2 0 1 0 1 0V10.9a2 2 0 0 1 2-2 4 4 0 0 0 3.98-3.46A2 2 0 0 0 11.5 3.5z" />
            </svg>
            main
          </span>
          <span className="text-c-green">↑ 1 commit ahead</span>
        </div>

        <div className="grid grid-cols-3 border-y border-line">
          {CHANGES.map((c) => (
            <div key={c.label} className="px-3 py-2.5 text-center">
              <div className={`text-lg font-semibold ${c.className}`}>{c.count}</div>
              <div className="text-[10px] text-faint">{c.label}</div>
            </div>
          ))}
        </div>

        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2.5 text-xs text-accent transition-colors hover:text-fg-strong"
        >
          View on GitHub
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </>
  )
}
