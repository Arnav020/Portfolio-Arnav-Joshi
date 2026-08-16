'use client'

import { ChevronDown } from 'lucide-react'
import { useIde } from '../IdeProvider'
import { FileIcon } from '../FileIcon'
import { files } from '../registry'
import { profile, resumes } from '@/content/profile'

export function Explorer() {
  const { state, dispatch } = useIde()

  return (
    <aside
      aria-label="File explorer"
      data-tour="files"
      // Below md the panel would eat the whole editor, so it floats over it
      // instead of taking a column — the activity-bar toggle still works.
      className="ide-scroll absolute inset-y-0 left-12 z-30 w-56 shrink-0 overflow-y-auto border-r border-line bg-panel shadow-2xl shadow-black/50 md:static md:z-auto md:shadow-none"
    >
      <div className="flex items-center gap-1 px-3 py-2 text-[10px] tracking-[0.14em] text-dim uppercase">
        <ChevronDown className="h-3 w-3" />
        {profile.firstName}&apos;s Portfolio
      </div>

      <ul className="pb-4">
        {files.map((file) => {
          const active = state.activeTab === file.id
          const open = state.tabs.includes(file.id)
          return (
            <li key={file.id}>
              <button
                type="button"
                onClick={() => dispatch({ type: 'OPEN', id: file.id })}
                className={`flex w-full items-center gap-2 px-3 py-[5px] text-left text-[11px] transition-colors ${
                  active
                    ? 'bg-white/[0.07] text-fg-strong'
                    : open
                      ? 'text-fg hover:bg-white/[0.04]'
                      : 'text-dim hover:bg-white/[0.04] hover:text-fg'
                }`}
              >
                <FileIcon kind={file.icon} className="h-3.5 w-3.5" />
                <span className="truncate">{file.name}</span>
              </button>
            </li>
          )
        })}

        {/* PDFs open in a preview overlay first — downloading is then a choice. */}
        {resumes.map((r) => (
          <li key={r.id}>
            <button
              type="button"
              onClick={() => dispatch({ type: 'RESUME', id: r.id })}
              title={`Preview ${r.label}`}
              className="flex w-full items-center gap-2 px-3 py-[5px] text-left text-[11px] text-dim transition-colors hover:bg-white/[0.04] hover:text-fg"
            >
              <FileIcon kind="pdf" className="h-3.5 w-3.5" />
              <span className="truncate">{r.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
