'use client'

import { useIde } from '../IdeProvider'
import { fileById } from '../registry'
import { HomeFile } from '../files/HomeFile'
import { AboutFile } from '../files/AboutFile'
import { ProjectsFile } from '../files/ProjectsFile'
import { SkillsFile } from '../files/SkillsFile'
import { ExperienceFile } from '../files/ExperienceFile'
import { ContactFile } from '../files/ContactFile'
import { AchievementsFile } from '../files/AchievementsFile'
import { ReadmeFile } from '../files/ReadmeFile'

/** Edit ▸ Select All / Copy operate on this subtree. */
export const EDITOR_ID = 'ide-editor'

const VIEWS = {
  home: HomeFile,
  about: AboutFile,
  projects: ProjectsFile,
  skills: SkillsFile,
  experience: ExperienceFile,
  contact: ContactFile,
  achievements: AchievementsFile,
  readme: ReadmeFile,
} as const

export function Editor() {
  const { state, dispatch } = useIde()
  const file = state.activeTab ? fileById(state.activeTab) : null

  if (!file) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-bg text-center">
        <p className="text-sm text-faint">No file open</p>
        <button
          type="button"
          onClick={() => dispatch({ type: 'OVERLAY', overlay: 'palette' })}
          className="rounded border border-line px-3 py-1.5 text-xs text-dim transition-colors hover:border-accent hover:text-fg-strong"
        >
          Go to file
          <kbd className="ml-2 rounded border border-line bg-surface px-1.5 py-0.5 text-[10px] text-faint">
            Ctrl P
          </kbd>
        </button>
      </div>
    )
  }

  const View = VIEWS[file.id]

  return (
    <main
      id={EDITOR_ID}
      data-tour="editor"
      // Keyed on the file id so switching tabs resets scroll position rather
      // than carrying one file's offset into the next.
      key={file.id}
      className="ide-scroll flex-1 overflow-y-auto bg-bg"
    >
      {/* Left-aligned, not centred: an editor lays text out from the gutter,
          and a centred column reads as a marketing page instead. Card grids
          opt into the full width so they don't strand empty space on the right. */}
      <div
        className={`file-enter w-full px-5 py-10 sm:px-10 sm:py-12 ${
          file.width === 'wide' ? 'max-w-[1500px]' : 'max-w-4xl'
        }`}
      >
        <View />
      </div>
    </main>
  )
}
