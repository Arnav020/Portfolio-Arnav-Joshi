'use client'

import { useEffect, useRef, useState } from 'react'
import { themes, useIde } from '../IdeProvider'

/** Brief confirmation after a theme switch, like the reference's toast. */
export function ThemeToast() {
  const { state } = useIde()
  const [visible, setVisible] = useState(false)
  // Hydration restores a saved theme, which is not a "switch" worth announcing.
  const seen = useRef<string | null>(null)

  useEffect(() => {
    if (seen.current === null || seen.current === state.theme) {
      seen.current = state.theme
      return
    }
    seen.current = state.theme
    const show = setTimeout(() => setVisible(true), 0)
    const hide = setTimeout(() => setVisible(false), 2200)
    return () => {
      clearTimeout(show)
      clearTimeout(hide)
    }
  }, [state.theme])

  if (!visible) return null

  const theme = themes.find((t) => t.id === state.theme)!

  return (
    <div
      role="status"
      className="overlay-in pointer-events-none fixed right-4 bottom-9 z-[70] flex items-center gap-2 rounded-md border border-line bg-panel px-3.5 py-2.5 text-xs text-fg-strong shadow-2xl shadow-black/60"
    >
      <span aria-hidden="true">{theme.emoji}</span>
      Theme switched to {theme.name}
    </div>
  )
}
