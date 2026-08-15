'use client'

import { useEffect } from 'react'
import { useIde } from './IdeProvider'

/**
 * One keydown listener for the whole shell.
 *
 * Only shortcuts the browser will actually surrender are bound: Ctrl/Cmd+W is
 * deliberately absent because Chrome closes the browser tab before the page
 * ever sees it — a "Close Tab ⌃W" label that nukes the window is worse than no
 * label, so the File menu shows that item without a keybinding.
 */
export function useShortcuts() {
  const { state, dispatch } = useIde()

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const mod = e.ctrlKey || e.metaKey
      const target = e.target as HTMLElement | null
      const typing =
        !!target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)

      if (e.key === 'Escape') {
        if (state.overlay || state.menu || state.scmOpen) {
          e.preventDefault()
          dispatch({ type: 'OVERLAY', overlay: null })
          dispatch({ type: 'MENU', menu: null })
          dispatch({ type: 'SCM', open: false })
        }
        return
      }

      if (!mod) return

      switch (e.key.toLowerCase()) {
        case 'p':
          e.preventDefault()
          dispatch({
            type: 'OVERLAY',
            overlay: state.overlay === 'palette' ? null : 'palette',
          })
          break
        case '`':
          e.preventDefault()
          dispatch({ type: 'TERMINAL' })
          break
        case 'b':
          // Don't steal Ctrl+B from a field where it might mean something.
          if (typing) return
          e.preventDefault()
          dispatch({ type: 'EXPLORER' })
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [state.overlay, state.menu, state.scmOpen, dispatch])
}

/** Shown verbatim in the settings panel's shortcut reference. */
export const SHORTCUTS: Array<[string, string]> = [
  ['Ctrl P', 'Go to file (command palette)'],
  ['Ctrl `', 'Toggle terminal'],
  ['Ctrl B', 'Toggle sidebar'],
  ['Esc', 'Close overlay'],
  ['↑ / ↓', 'Terminal history'],
]
