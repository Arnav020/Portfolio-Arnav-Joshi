'use client'

import { Search } from 'lucide-react'
import { useIde } from '../IdeProvider'
import { profile } from '@/content/profile'

/** Traffic lights are decoration — they carry no window controls by design. */
const LIGHTS = [
  { color: '#ff5f57', label: 'close' },
  { color: '#febc2e', label: 'minimise' },
  { color: '#28c840', label: 'zoom' },
]

export function TitleBar() {
  const { dispatch } = useIde()

  return (
    // The only surface that uses --titlebar. Every other bar is a neutral grey.
    <div className="relative flex h-[30px] shrink-0 items-center bg-titlebar px-3">
      <div className="flex items-center gap-2" aria-hidden="true">
        {LIGHTS.map((l) => (
          <span
            key={l.label}
            className="h-[11px] w-[11px] rounded-full"
            style={{ backgroundColor: l.color }}
          />
        ))}
      </div>

      {/* Absolutely centred so it stays put regardless of what's on either side. */}
      <button
        type="button"
        onClick={() => dispatch({ type: 'OVERLAY', overlay: 'palette' })}
        className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded bg-white/[0.07] px-3 py-[3px] text-[11px] text-dim transition-colors hover:bg-white/15 hover:text-fg sm:flex"
        aria-label="Open command palette"
      >
        <Search className="h-[11px] w-[11px]" />
        <span className="text-fg">{profile.repoName}</span>
        <kbd className="ml-1 rounded bg-white/10 px-1.5 py-px text-[9px] text-dim">
          Ctrl P
        </kbd>
      </button>
    </div>
  )
}
