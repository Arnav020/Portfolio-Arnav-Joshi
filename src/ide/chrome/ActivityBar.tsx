'use client'

import { FileText, Files, GitBranch, Search, Settings } from 'lucide-react'
import { useIde } from '../IdeProvider'
import { defaultResume, links } from '@/content/profile'
import { ScmPopover } from './ScmPopover'

export function ActivityBar() {
  const { state, dispatch } = useIde()

  const items = [
    {
      key: 'explorer',
      Icon: Files,
      label: 'Explorer',
      active: state.explorerOpen,
      run: () => dispatch({ type: 'EXPLORER' }),
    },
    {
      key: 'search',
      Icon: Search,
      label: 'Search files',
      active: state.overlay === 'palette',
      run: () => dispatch({ type: 'OVERLAY', overlay: 'palette' }),
    },
    {
      key: 'scm',
      Icon: GitBranch,
      label: 'Source control',
      active: state.scmOpen,
      run: () => dispatch({ type: 'SCM' }),
    },
    {
      key: 'resume',
      Icon: FileText,
      label: 'Résumé — preview and download',
      active: state.overlay === 'resume',
      run: () => dispatch({ type: 'RESUME', id: defaultResume.id }),
    },
  ]

  return (
    <nav
      aria-label="Activity bar"
      className="relative z-30 flex w-12 shrink-0 flex-col items-center justify-between bg-surface-hi py-2"
    >
      <div className="flex flex-col items-center gap-1">
        {items.map(({ key, Icon, label, active, run }) => (
          <button
            key={key}
            type="button"
            onClick={run}
            title={label}
            aria-label={label}
            data-tour={
              key === 'resume' ? 'resume' : key === 'explorer' ? 'explorer-icon' : undefined
            }
            aria-pressed={active}
            className={`group relative flex h-10 w-10 items-center justify-center rounded transition-colors ${
              active ? 'text-fg-strong' : 'text-faint hover:text-fg'
            }`}
          >
            {/* VS Code marks the active view with a left rail, not a fill. */}
            <span
              className={`absolute top-1.5 bottom-1.5 left-0 w-0.5 rounded-r bg-accent transition-opacity ${
                active ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <Icon className="h-5 w-5" strokeWidth={1.6} />
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => dispatch({ type: 'OVERLAY', overlay: 'settings' })}
        title="Settings"
        aria-label="Settings"
        className={`flex h-10 w-10 items-center justify-center rounded transition-colors ${
          state.overlay === 'settings' ? 'text-fg-strong' : 'text-faint hover:text-fg'
        }`}
      >
        <Settings className="h-5 w-5" strokeWidth={1.6} />
      </button>

      {state.scmOpen && <ScmPopover githubUrl={links.github} />}
    </nav>
  )
}
