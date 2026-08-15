'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useIde } from '../IdeProvider'
import { FileIcon } from '../FileIcon'
import { files } from '../registry'

export function CommandPalette() {
  const { dispatch } = useIde()
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return files
    return files.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.folder.toLowerCase().includes(q) ||
        f.language.toLowerCase().includes(q)
    )
  }, [query])

  useEffect(() => {
    listRef.current?.children[index]?.scrollIntoView({ block: 'nearest' })
  }, [index])

  const close = () => dispatch({ type: 'OVERLAY', overlay: null })

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIndex((i) => (i + 1) % Math.max(1, results.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIndex((i) => (i - 1 + results.length) % Math.max(1, results.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const hit = results[index]
      if (hit) dispatch({ type: 'OPEN', id: hit.id })
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex justify-center bg-black/55 px-4 pt-[12vh]">
      <button
        type="button"
        aria-label="Close command palette"
        tabIndex={-1}
        className="absolute inset-0 cursor-default"
        onClick={close}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Go to file"
        className="overlay-in relative z-10 h-fit w-full max-w-xl overflow-hidden rounded-lg border border-line bg-panel shadow-2xl shadow-black/60"
      >
        <div className="flex items-center gap-2 border-b border-line px-3 py-2.5">
          <span className="text-faint">&gt;</span>
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              // A new result set invalidates the old highlight position.
              setIndex(0)
            }}
            onKeyDown={onKeyDown}
            placeholder="Go to file or run command..."
            spellCheck={false}
            className="flex-1 bg-transparent text-sm text-fg-strong caret-accent outline-none placeholder:text-faint"
          />
          <kbd className="rounded border border-line bg-surface px-1.5 py-0.5 text-[10px] text-faint">
            Esc
          </kbd>
        </div>

        <div className="px-3 py-1.5 text-[10px] tracking-[0.18em] text-faint uppercase">
          Files
        </div>

        <ul ref={listRef} className="ide-scroll max-h-[46vh] overflow-y-auto pb-1">
          {results.map((f, i) => (
            <li key={f.id}>
              <button
                type="button"
                onMouseEnter={() => setIndex(i)}
                onClick={() => dispatch({ type: 'OPEN', id: f.id })}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors ${
                  i === index ? 'bg-surface-hi text-fg-strong' : 'text-fg hover:bg-surface'
                }`}
              >
                <FileIcon kind={f.icon} />
                <span className="flex-1 truncate">{f.name}</span>
                <span className="text-xs text-faint">
                  {f.folder === '.' ? './' : `${f.folder}/`}
                </span>
              </button>
            </li>
          ))}

          {!results.length && (
            <li className="px-3 py-3 text-sm text-faint">No matching files</li>
          )}
        </ul>

        <div className="border-t border-line px-3 py-2 text-[11px] text-faint">
          ↑↓ navigate · ↵ open · Esc close
        </div>
      </div>
    </div>
  )
}
