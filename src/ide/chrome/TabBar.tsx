'use client'

import { ChevronRight, X } from 'lucide-react'
import { useIde } from '../IdeProvider'
import { FileIcon } from '../FileIcon'
import { fileById } from '../registry'
import { profile } from '@/content/profile'

export function TabBar() {
  const { state, dispatch } = useIde()

  return (
    <div className="ide-scroll-none flex h-[30px] shrink-0 items-stretch overflow-x-auto bg-panel">
      {state.tabs.map((id) => {
        const file = fileById(id)
        if (!file) return null
        const active = state.activeTab === id

        return (
          <div
            key={id}
            className={`group relative flex shrink-0 items-center gap-2 border-r border-line pr-1.5 pl-3 text-[11px] transition-colors ${
              active ? 'bg-bg text-fg-strong' : 'bg-panel text-dim hover:text-fg'
            }`}
          >
            {/* Active tab gets the accent top rule, same as the editor. */}
            {active && <span className="absolute inset-x-0 top-0 h-px bg-accent" />}
            <button
              type="button"
              onClick={() => dispatch({ type: 'OPEN', id })}
              className="flex items-center gap-2 py-1"
            >
              <FileIcon kind={file.icon} className="h-3.5 w-3.5" />
              {file.name}
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: 'CLOSE', id })}
              aria-label={`Close ${file.name}`}
              className={`rounded p-0.5 transition-opacity hover:bg-surface-hi ${
                active ? 'opacity-70' : 'opacity-0 group-hover:opacity-70'
              }`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export function Breadcrumb() {
  const { state } = useIde()
  const file = state.activeTab ? fileById(state.activeTab) : null
  if (!file) return null

  const crumbs = [profile.handle, ...(file.folder === '.' ? [] : [file.folder])]

  return (
    <div className="flex h-[26px] shrink-0 items-center gap-1 bg-bg px-4 text-[11px] text-dim">
      {crumbs.map((c) => (
        <span key={c} className="flex items-center gap-1">
          {c}
          <ChevronRight className="h-3 w-3" />
        </span>
      ))}
      <span className="flex items-center gap-1.5 text-fg">
        <FileIcon kind={file.icon} className="h-3 w-3" />
        {file.name}
      </span>
    </div>
  )
}
