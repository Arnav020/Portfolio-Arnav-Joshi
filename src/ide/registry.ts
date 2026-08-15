/**
 * The one array everything reads from.
 *
 * The explorer tree, the tab bar, the breadcrumb, the command palette, the
 * File ▸ Open Recent list and the terminal's `ls` / `cd` / `cat` all derive
 * from this — so a file can never exist in one surface and be missing from
 * another.
 */

export type FileId =
  | 'home'
  | 'about'
  | 'projects'
  | 'skills'
  | 'experience'
  | 'contact'
  | 'achievements'
  | 'readme'

export type IconKind =
  | 'react'
  | 'html'
  | 'js'
  | 'json'
  | 'ts'
  | 'css'
  | 'log'
  | 'md'
  | 'pdf'

export interface IdeFile {
  id: FileId
  /** Display name, including extension. */
  name: string
  /** Folder shown in the palette and breadcrumb. '.' means repo root. */
  folder: string
  icon: IconKind
  /** Shown in the status bar while this tab is active. */
  language: string
  /** Comment syntax used for each section's opening tagline. */
  comment: 'slash' | 'html' | 'css' | 'hash'
  /** 'wide' files use the full editor width instead of the prose column. */
  width?: 'wide'
}

export const files: IdeFile[] = [
  // 'wide' so the stat row spans the editor; the prose blocks cap themselves.
  { id: 'home', name: 'home.tsx', folder: 'src', icon: 'react', language: 'TypeScript React', comment: 'slash', width: 'wide' },
  { id: 'about', name: 'about.html', folder: 'src', icon: 'html', language: 'HTML', comment: 'html' },
  { id: 'projects', name: 'projects.js', folder: 'src', icon: 'js', language: 'JavaScript', comment: 'slash', width: 'wide' },
  { id: 'skills', name: 'skills.json', folder: 'data', icon: 'json', language: 'JSON', comment: 'slash' },
  { id: 'experience', name: 'experience.ts', folder: 'src', icon: 'ts', language: 'TypeScript', comment: 'slash' },
  { id: 'contact', name: 'contact.css', folder: 'src', icon: 'css', language: 'CSS', comment: 'css' },
  { id: 'achievements', name: 'achievements.log', folder: 'logs', icon: 'log', language: 'Log', comment: 'hash' },
  { id: 'readme', name: 'README.md', folder: '.', icon: 'md', language: 'Markdown', comment: 'html' },
]

export const fileById = (id: string): IdeFile | undefined =>
  files.find((f) => f.id === id)

export const fileByName = (name: string): IdeFile | undefined =>
  files.find((f) => f.name.toLowerCase() === name.toLowerCase())

/**
 * Resolve a user-typed token to a file: `about`, `about.html`, or `src/about.html`
 * all land on the same entry — the terminal shouldn't demand exact extensions.
 */
export function resolveFile(token: string): IdeFile | undefined {
  const clean = token.replace(/^\.\//, '').trim()
  const base = clean.includes('/') ? clean.slice(clean.lastIndexOf('/') + 1) : clean
  return (
    fileByName(base) ??
    files.find((f) => f.id === base.toLowerCase()) ??
    files.find((f) => f.name.toLowerCase().startsWith(base.toLowerCase()))
  )
}

/** Folders in tree order, root last so `ls ~` reads like a real repo listing. */
export const folders = ['src', 'data', 'logs'] as const

export const filesInFolder = (folder: string) =>
  files.filter((f) => f.folder === folder)
