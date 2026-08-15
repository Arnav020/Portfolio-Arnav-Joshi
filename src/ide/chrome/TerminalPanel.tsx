'use client'

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { useIde, type PanelTab } from '../IdeProvider'
import { profile } from '@/content/profile'

const TABS: PanelTab[] = ['terminal', 'problems', 'output']

const LINE_STYLES: Record<string, string> = {
  input: 'text-fg-strong',
  output: 'text-fg',
  error: 'text-c-red',
  muted: 'text-faint',
  accent: 'text-c-green',
}

const OUTPUT_LOG = [
  '> next dev',
  '  ▲ Next.js 16.2.3 (Turbopack)',
  '  - Local:   http://localhost:3000',
  '',
  ' ✓ Ready in 1.2s',
  ' ✓ Compiled / in 340ms',
]

export function TerminalPanel() {
  const { state, dispatch } = useIde()
  const [input, setInput] = useState('')
  /** -1 means "typing a fresh command", 0+ indexes back through history. */
  const [histIdx, setHistIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (state.panelTab === 'terminal') inputRef.current?.focus()
  }, [state.panelTab])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [state.lines])

  const promptFor = (cwd: string) => `${profile.shellUser}@portfolio:${cwd}$`
  const prompt = promptFor(state.cwd)

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      dispatch({ type: 'RUN', input })
      setInput('')
      setHistIdx(-1)
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!state.history.length) return
      const next = histIdx < 0 ? state.history.length - 1 : Math.max(0, histIdx - 1)
      setHistIdx(next)
      setInput(state.history[next])
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (histIdx < 0) return
      const next = histIdx + 1
      if (next >= state.history.length) {
        setHistIdx(-1)
        setInput('')
      } else {
        setHistIdx(next)
        setInput(state.history[next])
      }
    }
  }

  return (
    <div className="flex h-64 shrink-0 flex-col border-t border-line bg-panel">
      <div className="flex h-8 shrink-0 items-center border-b border-line px-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => dispatch({ type: 'PANEL_TAB', tab })}
            className={`relative px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase transition-colors ${
              state.panelTab === tab ? 'text-fg-strong' : 'text-faint hover:text-fg'
            }`}
          >
            {tab}
            {state.panelTab === tab && (
              <span className="absolute inset-x-2 -bottom-[7px] h-px bg-accent" />
            )}
          </button>
        ))}
        <button
          type="button"
          onClick={() => dispatch({ type: 'TERMINAL', open: false })}
          aria-label="Close panel"
          className="ml-auto rounded p-1 text-faint transition-colors hover:bg-surface hover:text-fg"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {state.panelTab === 'terminal' && (
        <div
          ref={scrollRef}
          className="ide-scroll flex-1 cursor-text overflow-y-auto px-3 py-2 text-[13px] leading-6"
          onClick={() => inputRef.current?.focus()}
        >
          {state.lines.map((line, i) => (
            <div key={i} className={LINE_STYLES[line.kind]}>
              {line.kind === 'input' ? (
                <>
                  <span className="text-accent">{promptFor(line.cwd ?? state.cwd)}</span>{' '}
                  <span>{line.text}</span>
                </>
              ) : (
                <span className="whitespace-pre-wrap">{line.text}</span>
              )}
            </div>
          ))}

          <div className="flex items-center gap-2">
            <span className="shrink-0 text-accent">{prompt}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              aria-label="Terminal input"
              className="min-w-0 flex-1 bg-transparent text-fg-strong caret-accent outline-none"
            />
          </div>
        </div>
      )}

      {state.panelTab === 'problems' && (
        <div className="flex-1 px-3 py-3 text-[13px] text-faint">
          No problems have been detected in the workspace.
        </div>
      )}

      {state.panelTab === 'output' && (
        <div className="ide-scroll flex-1 overflow-y-auto px-3 py-2 text-[13px] leading-6 text-dim">
          {OUTPUT_LOG.map((l, i) => (
            <div key={i} className={l.startsWith(' ✓') ? 'text-c-green' : undefined}>
              {l}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
