'use client'

import { useIde } from '../IdeProvider'
import { FileIcon } from '../FileIcon'
import { fileById, files, type FileId } from '../registry'
import { defaultResume, links, resumes } from '@/content/profile'
import { EDITOR_ID } from './Editor'

type Item =
  | { kind: 'divider' }
  | { kind: 'header'; label: string }
  | { kind: 'item'; label: string; hint?: string; icon?: FileId; run: () => void }

/** Programmatic download — same-origin file, so `download` is honoured. */
export function downloadFile(href: string, name: string) {
  const a = document.createElement('a')
  a.href = href
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
}

function selectEditorText() {
  const el = document.getElementById(EDITOR_ID)
  if (!el) return null
  const range = document.createRange()
  range.selectNodeContents(el)
  const sel = window.getSelection()
  sel?.removeAllRanges()
  sel?.addRange(range)
  return sel
}

async function copySelection() {
  const sel = window.getSelection()
  const text = sel && !sel.isCollapsed ? sel.toString() : selectEditorText()?.toString()
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // Clipboard permission denied — the text stays selected, so Ctrl+C still works.
  }
}

function toggleFullscreen() {
  if (document.fullscreenElement) void document.exitFullscreen()
  else void document.documentElement.requestFullscreen().catch(() => {})
}

export function MenuBar() {
  const { state, dispatch } = useIde()

  const openPalette = () => dispatch({ type: 'OVERLAY', overlay: 'palette' })
  const open = (id: FileId) => dispatch({ type: 'OPEN', id })
  const runInTerminal = (input: string) => {
    dispatch({ type: 'TERMINAL', open: true })
    dispatch({ type: 'RUN', input })
  }

  const menus: Record<string, Item[]> = {
    File: [
      { kind: 'item', label: 'New Tab', hint: 'Ctrl P', run: openPalette },
      { kind: 'item', label: 'Open File…', hint: 'Ctrl P', run: openPalette },
      {
        kind: 'item',
        label: 'Close Tab',
        run: () => state.activeTab && dispatch({ type: 'CLOSE', id: state.activeTab }),
      },
      { kind: 'item', label: 'Close All Tabs', run: () => dispatch({ type: 'CLOSE_ALL' }) },
      { kind: 'divider' },
      { kind: 'header', label: 'Open Recent' },
      ...state.recent.map((id): Item => {
        const f = fileById(id)!
        return { kind: 'item', label: f.name, icon: id, run: () => open(id) }
      }),
      { kind: 'divider' },
      ...resumes.map(
        (r): Item => ({
          kind: 'item',
          label: `Download ${r.label.includes('SDE') ? 'Resume — SDE' : 'Resume — ML'}`,
          run: () => downloadFile(r.href, r.label),
        })
      ),
    ],
    Edit: [
      { kind: 'item', label: 'Find…', hint: 'Ctrl P', run: openPalette },
      { kind: 'item', label: 'Select All', hint: 'Ctrl A', run: () => selectEditorText() },
      { kind: 'item', label: 'Copy', hint: 'Ctrl C', run: () => void copySelection() },
    ],
    View: [
      { kind: 'item', label: 'Explorer', hint: 'Ctrl B', run: () => dispatch({ type: 'EXPLORER' }) },
      { kind: 'item', label: 'Source Control', run: () => dispatch({ type: 'SCM' }) },
      { kind: 'item', label: 'Terminal', hint: 'Ctrl `', run: () => dispatch({ type: 'TERMINAL' }) },
      { kind: 'divider' },
      { kind: 'item', label: 'Command Palette…', hint: 'Ctrl P', run: openPalette },
      {
        kind: 'item',
        label: 'Settings',
        run: () => dispatch({ type: 'OVERLAY', overlay: 'settings' }),
      },
      { kind: 'item', label: 'Toggle Fullscreen', hint: 'F11', run: toggleFullscreen },
    ],
    Go: [
      { kind: 'item', label: 'Go to File…', hint: 'Ctrl P', run: openPalette },
      { kind: 'divider' },
      ...files.map((f): Item => ({ kind: 'item', label: f.name, icon: f.id, run: () => open(f.id) })),
    ],
    Run: [
      { kind: 'item', label: 'Run whoami', run: () => runInTerminal('whoami') },
      { kind: 'item', label: 'List Files', run: () => runInTerminal('ls') },
      { kind: 'divider' },
      { kind: 'item', label: 'Open projects.js', run: () => open('projects') },
      { kind: 'item', label: 'Open experience.ts', run: () => open('experience') },
    ],
    Terminal: [
      {
        kind: 'item',
        label: 'New Terminal',
        hint: 'Ctrl `',
        run: () => dispatch({ type: 'TERMINAL', open: true }),
      },
      { kind: 'item', label: 'Toggle Terminal', run: () => dispatch({ type: 'TERMINAL' }) },
      { kind: 'item', label: 'Clear Terminal', run: () => runInTerminal('clear') },
      { kind: 'divider' },
      { kind: 'item', label: 'Show Help', run: () => runInTerminal('help') },
    ],
    Help: [
      { kind: 'item', label: 'About This Portfolio', icon: 'readme', run: () => open('readme') },
      {
        kind: 'item',
        label: 'Keyboard Shortcuts',
        run: () => dispatch({ type: 'OVERLAY', overlay: 'settings' }),
      },
      { kind: 'divider' },
      {
        kind: 'item',
        label: 'View Source on GitHub ↗',
        run: () => window.open(links.github, '_blank', 'noopener,noreferrer'),
      },
      {
        kind: 'item',
        label: 'Download Resume',
        run: () => downloadFile(defaultResume.href, defaultResume.label),
      },
    ],
  }

  return (
    // No overflow/scroll on this row: it would establish a clipping context
    // and cut every dropdown off at the bar's height.
    <div className="relative z-40 flex h-[22px] shrink-0 items-center bg-surface px-2">
      {state.menu && (
        <button
          type="button"
          aria-label="Close menu"
          tabIndex={-1}
          className="fixed inset-0 z-40 cursor-default"
          onClick={() => dispatch({ type: 'MENU', menu: null })}
        />
      )}

      {Object.entries(menus).map(([label, items]) => (
        <div key={label} className="relative z-50">
          <button
            type="button"
            onClick={() =>
              dispatch({ type: 'MENU', menu: state.menu === label ? null : label })
            }
            // Once one menu is open, hovering the others switches between them.
            onMouseEnter={() => state.menu && dispatch({ type: 'MENU', menu: label })}
            className={`rounded px-2 py-px text-[11px] transition-colors ${
              state.menu === label
                ? 'bg-white/15 text-fg-strong'
                : 'text-fg hover:bg-white/10'
            }`}
            aria-expanded={state.menu === label}
            aria-haspopup="menu"
          >
            {label}
          </button>

          {state.menu === label && (
            <div
              role="menu"
              className="overlay-in absolute top-[calc(100%+4px)] left-0 min-w-[240px] rounded-md border border-line bg-panel py-1.5 shadow-2xl shadow-black/60"
            >
              {items.map((item, i) => {
                if (item.kind === 'divider') {
                  return <div key={i} className="my-1.5 h-px bg-line" />
                }
                if (item.kind === 'header') {
                  return (
                    <div
                      key={i}
                      className="px-3 py-1 text-[10px] tracking-[0.15em] text-faint uppercase"
                    >
                      {item.label}
                    </div>
                  )
                }
                return (
                  <button
                    key={i}
                    type="button"
                    role="menuitem"
                    onClick={item.run}
                    className="flex w-full items-center gap-2.5 px-3 py-1 text-left text-[11px] whitespace-nowrap text-fg transition-colors hover:bg-surface-hi hover:text-fg-strong"
                  >
                    {item.icon && <FileIcon kind={fileById(item.icon)!.icon} />}
                    <span className="flex-1">{item.label}</span>
                    {item.hint && (
                      <kbd className="text-[10px] text-faint">{item.hint}</kbd>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
