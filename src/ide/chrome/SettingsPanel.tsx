'use client'

import {
  Check,
  Compass,
  FileText,
  Maximize,
  Search,
  Terminal as TerminalIcon,
} from 'lucide-react'
import { themes, useIde } from '../IdeProvider'
import { SHORTCUTS } from '../useShortcuts'
import { defaultResume } from '@/content/profile'

export function SettingsPanel() {
  const { state, dispatch } = useIde()
  const close = () => dispatch({ type: 'OVERLAY', overlay: null })

  const actions = [
    {
      label: 'Command Palette',
      hint: 'Ctrl P',
      Icon: Search,
      run: () => dispatch({ type: 'OVERLAY', overlay: 'palette' }),
    },
    {
      label: 'Toggle Terminal',
      hint: 'Ctrl `',
      Icon: TerminalIcon,
      run: () => {
        dispatch({ type: 'TERMINAL' })
        close()
      },
    },
    {
      label: 'View Résumé',
      Icon: FileText,
      run: () => dispatch({ type: 'RESUME', id: defaultResume.id }),
    },
    {
      label: 'Take the quick tour',
      Icon: Compass,
      run: () => dispatch({ type: 'TOUR', step: 0 }),
    },
    {
      label: 'Toggle Fullscreen',
      hint: 'F11',
      Icon: Maximize,
      run: () => {
        if (document.fullscreenElement) void document.exitFullscreen()
        else void document.documentElement.requestFullscreen().catch(() => {})
        close()
      },
    },
  ]

  return (
    <div className="fixed inset-0 z-[60] flex">
      <button
        type="button"
        aria-label="Close settings"
        tabIndex={-1}
        className="absolute inset-0 cursor-default bg-black/45"
        onClick={close}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        // Floats clear of the activity bar rather than clamping to the window
        // edge, so it reads as a panel over the editor, not a second sidebar.
        className="ide-scroll overlay-in relative z-10 my-4 ml-16 h-[calc(100%-2rem)] w-full max-w-[340px] overflow-y-auto rounded-lg border border-line bg-panel shadow-2xl shadow-black/70"
      >
        <div className="border-b border-line px-4 py-3 text-[10px] tracking-[0.18em] text-faint uppercase">
          Settings
        </div>

        <section className="px-2 py-3">
          <h3 className="px-2 pb-2 text-xs tracking-[0.12em] text-c-pink uppercase">
            🎨 Color Theme
          </h3>
          {themes.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => dispatch({ type: 'THEME', theme: t.id })}
              className={`flex w-full items-center gap-2.5 rounded px-2 py-2 text-left text-sm transition-colors ${
                state.theme === t.id
                  ? 'bg-surface-hi text-fg-strong'
                  : 'text-fg hover:bg-surface'
              }`}
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: t.dot }}
                aria-hidden="true"
              />
              <span aria-hidden="true">{t.emoji}</span>
              <span className="flex-1">{t.name}</span>
              {state.theme === t.id && <Check className="h-3.5 w-3.5 text-accent" />}
            </button>
          ))}
        </section>

        <section className="border-t border-line px-2 py-3">
          <h3 className="px-2 pb-2 text-xs tracking-[0.12em] text-c-yellow uppercase">
            ⚡ Quick Actions
          </h3>
          {actions.map(({ label, hint, Icon, run }) => (
            <button
              key={label}
              type="button"
              onClick={run}
              className="flex w-full items-center gap-2.5 rounded px-2 py-2 text-left text-sm text-fg transition-colors hover:bg-surface"
            >
              <Icon className="h-4 w-4 shrink-0 text-dim" strokeWidth={1.6} />
              <span className="flex-1">{label}</span>
              {hint && <kbd className="text-[10px] text-faint">{hint}</kbd>}
            </button>
          ))}
        </section>

        <section className="border-t border-line px-4 py-3">
          <h3 className="pb-2 text-xs tracking-[0.12em] text-c-blue uppercase">
            ⌨ Keyboard Shortcuts
          </h3>
          <dl className="space-y-1.5">
            {SHORTCUTS.map(([keys, desc]) => (
              <div key={keys} className="flex items-center gap-3 text-xs">
                <dt className="w-16 shrink-0">
                  <kbd className="rounded border border-line bg-surface px-1.5 py-0.5 text-[10px] text-fg">
                    {keys}
                  </kbd>
                </dt>
                <dd className="text-dim">{desc}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="border-t border-line px-4 py-3 text-[11px] text-faint">
          Portfolio v3.0 · Next.js 16 + React 19 + Tailwind v4
        </div>
      </div>
    </div>
  )
}
