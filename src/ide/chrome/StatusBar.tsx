'use client'

import { useEffect, useState } from 'react'
import { Terminal as TerminalIcon } from 'lucide-react'
import { themes, useIde } from '../IdeProvider'
import { fileById } from '../registry'

function Clock() {
  // Rendered empty on the server: a timestamp in the HTML would mismatch on
  // hydration and would be stale in any cached response anyway.
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      )
    tick()
    const id = setInterval(tick, 1000 * 10)
    return () => clearInterval(id)
  }, [])

  return <span className="tabular-nums">{time ?? '--:--'}</span>
}

export function StatusBar() {
  const { state, dispatch } = useIde()
  const file = state.activeTab ? fileById(state.activeTab) : null
  const theme = themes.find((t) => t.id === state.theme)!

  // Hover uses a translucent white wash rather than a surface colour, because
  // the bar is now painted in the theme accent, not the panel background.
  const item = 'px-2 py-0.5 rounded transition-colors hover:bg-white/15'

  return (
    <footer className="flex h-[22px] shrink-0 items-center justify-between bg-statusbar px-2 text-[11px] text-statusbar-fg">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => dispatch({ type: 'SCM' })}
          className={`${item} flex items-center gap-1.5`}
          title="Source control"
        >
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor" aria-hidden="true">
            <path d="M11.5 3.5a2 2 0 1 0-2.45 1.95A3 3 0 0 1 6.2 7.9a3 3 0 0 0-1.7.53V5.44a2 2 0 1 0-1 0v5.12a2 2 0 1 0 1 0V10.9a2 2 0 0 1 2-2 4 4 0 0 0 3.98-3.46A2 2 0 0 0 11.5 3.5z" />
          </svg>
          main
        </button>
        <span className="px-1 opacity-80">↑1 ↓3</span>
        <button
          type="button"
          onClick={() => dispatch({ type: 'TERMINAL' })}
          className={`${item} hidden items-center gap-1.5 sm:flex`}
          title="Toggle terminal (Ctrl `)"
        >
          <TerminalIcon className="h-3 w-3" />
          terminal
        </button>
      </div>

      <div className="flex items-center gap-1">
        {file && <span className="hidden px-2 sm:inline">{file.language}</span>}
        <span className="hidden px-2 md:inline">UTF-8</span>
        <span className="hidden px-2 md:inline">Prettier</span>
        <button
          type="button"
          onClick={() => dispatch({ type: 'OVERLAY', overlay: 'settings' })}
          className={`${item} flex items-center gap-1.5`}
          title="Change theme"
        >
          <span aria-hidden="true">{theme.emoji}</span>
          {theme.name}
        </button>
        <span className="px-2">
          <Clock />
        </span>
      </div>
    </footer>
  )
}
