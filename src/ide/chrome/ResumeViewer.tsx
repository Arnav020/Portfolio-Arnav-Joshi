'use client'

import { useState } from 'react'
import { Download, ExternalLink, X } from 'lucide-react'
import { useIde } from '../IdeProvider'
import { FileIcon } from '../FileIcon'
import { resumes } from '@/content/profile'
import { downloadFile } from './MenuBar'

/**
 * Résumés preview before they download. Clicking a PDF anywhere in the shell
 * opens this rather than pushing a file straight into someone's Downloads —
 * a recruiter should be able to read it without committing to a download.
 */
export function ResumeViewer() {
  const { state, dispatch } = useIde()
  const active = resumes.find((r) => r.id === state.resumeId) ?? resumes[0]
  // Some mobile browsers refuse to render PDFs in an iframe; if the frame
  // never loads we surface the open-in-new-tab path instead of a blank box.
  const [loaded, setLoaded] = useState(false)

  const close = () => dispatch({ type: 'OVERLAY', overlay: null })

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8">
      <button
        type="button"
        aria-label="Close résumé preview"
        tabIndex={-1}
        className="absolute inset-0 cursor-default bg-black/65"
        onClick={close}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Preview of ${active.label}`}
        className="overlay-in relative z-10 flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-line bg-panel shadow-2xl shadow-black/70"
      >
        <header className="flex shrink-0 flex-wrap items-center gap-2 border-b border-line px-3 py-2">
          <FileIcon kind="pdf" className="h-4 w-4" />
          <span className="mr-auto text-[13px] text-fg-strong">{active.label}</span>

          {/* Switch between the two résumés without leaving the preview. */}
          {resumes.length > 1 && (
            <div className="flex rounded border border-line p-0.5">
              {resumes.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => dispatch({ type: 'RESUME', id: r.id })}
                  className={`rounded px-2.5 py-1 text-[11px] transition-colors ${
                    r.id === active.id
                      ? 'bg-accent text-statusbar-fg'
                      : 'text-dim hover:text-fg'
                  }`}
                >
                  {r.label.includes('SDE') ? 'SDE' : 'ML'}
                </button>
              ))}
            </div>
          )}

          <a
            href={active.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded border border-line px-2.5 py-1 text-[11px] text-dim transition-colors hover:border-accent hover:text-fg-strong"
          >
            <ExternalLink className="h-3 w-3" />
            New tab
          </a>

          <button
            type="button"
            onClick={() => downloadFile(active.href, active.label)}
            className="inline-flex items-center gap-1.5 rounded bg-accent px-2.5 py-1 text-[11px] font-medium text-statusbar-fg transition-opacity hover:opacity-90"
          >
            <Download className="h-3 w-3" />
            Download
          </button>

          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="rounded p-1 text-faint transition-colors hover:bg-surface hover:text-fg"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="relative flex-1 bg-bg">
          <iframe
            // Keyed so switching résumés reloads the frame rather than
            // leaving the previous document rendered.
            key={active.id}
            src={`${active.href}#view=FitH`}
            title={`${active.label} preview`}
            className="h-full w-full"
            onLoad={() => setLoaded(true)}
          />
          {!loaded && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <p className="text-xs text-faint">Loading preview…</p>
            </div>
          )}
        </div>

        <footer className="shrink-0 border-t border-line px-3 py-2 text-[11px] text-faint">
          Can&apos;t see it? Open in a new tab or download — some mobile browsers
          block inline PDFs.
        </footer>
      </div>
    </div>
  )
}
