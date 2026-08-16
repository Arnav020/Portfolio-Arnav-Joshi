'use client'

import { useIde } from './IdeProvider'
import { useShortcuts } from './useShortcuts'
import { TitleBar } from './chrome/TitleBar'
import { MenuBar } from './chrome/MenuBar'
import { ActivityBar } from './chrome/ActivityBar'
import { Explorer } from './chrome/Explorer'
import { Breadcrumb, TabBar } from './chrome/TabBar'
import { Editor } from './chrome/Editor'
import { TerminalPanel } from './chrome/TerminalPanel'
import { StatusBar } from './chrome/StatusBar'
import { CommandPalette } from './chrome/CommandPalette'
import { SettingsPanel } from './chrome/SettingsPanel'
import { ResumeViewer } from './chrome/ResumeViewer'
import { ThemeToast } from './chrome/ThemeToast'
import { Tour } from './chrome/Tour'

export function IdeShell() {
  const { state } = useIde()
  useShortcuts()

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-bg">
      <TitleBar />
      <MenuBar />

      {/* relative: the explorer anchors to this box when it floats on mobile. */}
      <div className="relative flex min-h-0 flex-1">
        <ActivityBar />
        {state.explorerOpen && <Explorer />}

        {/* min-w-0 stops a long code line in the editor from stretching the shell. */}
        <div className="flex min-w-0 flex-1 flex-col">
          <TabBar />
          <Breadcrumb />
          <Editor />
          {state.terminalOpen && <TerminalPanel />}
        </div>
      </div>

      <StatusBar />

      {state.overlay === 'palette' && <CommandPalette />}
      {state.overlay === 'settings' && <SettingsPanel />}
      {state.overlay === 'resume' && <ResumeViewer />}
      <ThemeToast />
      <Tour />
    </div>
  )
}
