'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react'
import { fileById, type FileId } from './registry'
import { runCommand, WELCOME, type TerminalLine } from './shell'
import { defaultResume } from '@/content/profile'

export const themes = [
  { id: 'arnav-dark', name: 'Arnav Dark', emoji: '💙', dot: '#2f81f7' },
  { id: 'rose-pine', name: 'Rosé Pine', emoji: '🌹', dot: '#eb6f92' },
  { id: 'tokyo-night', name: 'Tokyo Night', emoji: '🌃', dot: '#7aa2f7' },
  { id: 'catppuccin', name: 'Catppuccin', emoji: '🐱', dot: '#cba6f7' },
  { id: 'nord', name: 'Nord', emoji: '❄️', dot: '#88c0d0' },
  { id: 'gruvbox', name: 'Gruvbox', emoji: '🍂', dot: '#fabd2f' },
] as const

export type ThemeId = (typeof themes)[number]['id']
export type Overlay = 'palette' | 'settings' | 'resume' | null
export type PanelTab = 'terminal' | 'problems' | 'output'

export const THEME_KEY = 'ide.theme'
export const TOUR_KEY = 'ide.tour.seen'
const TABS_KEY = 'ide.tabs'
/** The tab the editor falls back to; it can never be closed into a blank pane. */
const HOME_FILE: FileId = 'home'

interface State {
  tabs: FileId[]
  activeTab: FileId | null
  /** Most-recent-first, drives File ▸ Open Recent. */
  recent: FileId[]
  /** The explorer panel is a real column; source control is a popover on top of it. */
  explorerOpen: boolean
  scmOpen: boolean
  overlay: Overlay
  /** Open menu-bar dropdown, by label. */
  menu: string | null
  terminalOpen: boolean
  panelTab: PanelTab
  theme: ThemeId
  /** Which résumé the preview overlay is showing. */
  resumeId: string
  /** Walkthrough step index, or null when the tour isn't running. */
  tourStep: number | null
  cwd: string
  lines: TerminalLine[]
  history: string[]
  hydrated: boolean
}

type Action =
  | { type: 'OPEN'; id: FileId }
  | { type: 'CLOSE'; id: FileId }
  | { type: 'CLOSE_ALL' }
  | { type: 'EXPLORER'; open?: boolean }
  | { type: 'SCM'; open?: boolean }
  | { type: 'OVERLAY'; overlay: Overlay }
  | { type: 'MENU'; menu: string | null }
  | { type: 'TERMINAL'; open?: boolean }
  | { type: 'PANEL_TAB'; tab: PanelTab }
  | { type: 'THEME'; theme: ThemeId }
  | { type: 'RESUME'; id?: string }
  | { type: 'TOUR'; step: number | null }
  | { type: 'RUN'; input: string }
  | { type: 'HYDRATE'; tabs: FileId[]; theme: ThemeId; explorerOpen: boolean }

const initialState: State = {
  tabs: ['home'],
  activeTab: 'home',
  recent: ['home'],
  explorerOpen: true,
  scmOpen: false,
  overlay: null,
  menu: null,
  terminalOpen: false,
  panelTab: 'terminal',
  theme: 'arnav-dark',
  resumeId: defaultResume.id,
  tourStep: null,
  cwd: '~',
  lines: WELCOME,
  history: [],
  hydrated: false,
}

function openFile(state: State, id: FileId): State {
  return {
    ...state,
    tabs: state.tabs.includes(id) ? state.tabs : [...state.tabs, id],
    activeTab: id,
    recent: [id, ...state.recent.filter((r) => r !== id)].slice(0, 5),
    overlay: null,
    menu: null,
    scmOpen: false,
  }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'OPEN':
      return openFile(state, action.id)

    case 'CLOSE': {
      const idx = state.tabs.indexOf(action.id)
      const tabs = state.tabs.filter((t) => t !== action.id)
      // The editor is never left empty: emptying the tab bar reopens home.
      if (!tabs.length) return openFile({ ...state, tabs }, HOME_FILE)
      // Closing the active tab focuses its left neighbour, like a real editor.
      const activeTab =
        state.activeTab === action.id ? (tabs[Math.max(0, idx - 1)] ?? null) : state.activeTab
      return { ...state, tabs, activeTab }
    }

    case 'CLOSE_ALL':
      return openFile({ ...state, tabs: [], activeTab: null, menu: null }, HOME_FILE)

    case 'EXPLORER':
      // Clicking the active activity-bar icon collapses the panel.
      return {
        ...state,
        explorerOpen: action.open ?? !state.explorerOpen,
        menu: null,
      }

    case 'SCM':
      return { ...state, scmOpen: action.open ?? !state.scmOpen, menu: null }

    case 'OVERLAY':
      return { ...state, overlay: action.overlay, menu: null, scmOpen: false }

    case 'MENU':
      return { ...state, menu: action.menu }

    case 'TERMINAL':
      return {
        ...state,
        terminalOpen: action.open ?? !state.terminalOpen,
        panelTab: 'terminal',
        menu: null,
        // Reopening an emptied terminal restores the banner rather than
        // presenting a bare prompt with no hint of what it accepts.
        lines: state.lines.length ? state.lines : WELCOME,
      }

    case 'PANEL_TAB':
      return { ...state, panelTab: action.tab }

    case 'THEME':
      return { ...state, theme: action.theme }

    case 'RESUME':
      return {
        ...state,
        overlay: 'resume',
        resumeId: action.id ?? state.resumeId,
        menu: null,
      }

    case 'TOUR':
      return { ...state, tourStep: action.step, overlay: null, menu: null }

    case 'RUN': {
      const result = runCommand(action.input, state.cwd)
      const echo: TerminalLine = {
        kind: 'input',
        text: action.input,
        cwd: state.cwd,
      }
      const history = action.input.trim()
        ? [...state.history, action.input.trim()]
        : state.history

      const next: State = {
        ...state,
        history,
        cwd: result.cwd ?? state.cwd,
        // `clear` resets to a fresh terminal, keeping the welcome banner —
        // clearing to a blank pane loses the only pointer to `help`.
        lines: result.clear ? WELCOME : [...state.lines, echo, ...result.output],
      }
      return result.open ? openFile(next, result.open) : next
    }

    case 'HYDRATE':
      return {
        ...state,
        tabs: action.tabs,
        activeTab: action.tabs[action.tabs.length - 1] ?? null,
        recent: [...action.tabs].reverse().slice(0, 5),
        theme: action.theme,
        explorerOpen: action.explorerOpen,
        hydrated: true,
      }
  }
}

const IdeContext = createContext<{
  state: State
  dispatch: Dispatch<Action>
} | null>(null)

export function IdeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Restore the previous session after mount — never during render, so the
  // server HTML and first client render stay identical.
  useEffect(() => {
    let tabs = initialState.tabs
    let theme = initialState.theme
    try {
      const savedTabs = localStorage.getItem(TABS_KEY)
      if (savedTabs) {
        const parsed: unknown = JSON.parse(savedTabs)
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(
            (id): id is FileId => typeof id === 'string' && !!fileById(id)
          )
          // A persisted empty tab list must not restore into a blank editor.
          if (valid.length) tabs = valid
          else tabs = [HOME_FILE]
        }
      }
      const savedTheme = localStorage.getItem(THEME_KEY)
      if (savedTheme && themes.some((t) => t.id === savedTheme)) {
        theme = savedTheme as ThemeId
      }
    } catch {
      // Private mode / disabled storage: defaults are a fine outcome.
    }
    // On phones the explorer floats over the editor, so it starts collapsed.
    dispatch({
      type: 'HYDRATE',
      tabs,
      theme,
      explorerOpen: window.innerWidth >= 768,
    })

    // First-time visitors get the walkthrough once, after the shell settles.
    let seen = true
    try {
      seen = localStorage.getItem(TOUR_KEY) === '1'
    } catch {}
    if (seen) return
    const id = setTimeout(() => dispatch({ type: 'TOUR', step: 0 }), 900)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme
    if (state.hydrated) {
      try {
        localStorage.setItem(THEME_KEY, state.theme)
      } catch {}
    }
  }, [state.theme, state.hydrated])

  useEffect(() => {
    if (!state.hydrated) return
    try {
      localStorage.setItem(TABS_KEY, JSON.stringify(state.tabs))
    } catch {}
  }, [state.tabs, state.hydrated])

  const value = useMemo(() => ({ state, dispatch }), [state])

  return <IdeContext.Provider value={value}>{children}</IdeContext.Provider>
}

export function useIde() {
  const ctx = useContext(IdeContext)
  if (!ctx) throw new Error('useIde must be used inside <IdeProvider>')
  return ctx
}
