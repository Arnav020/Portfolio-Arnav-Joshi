import { files, filesInFolder, folders, resolveFile, type FileId } from './registry'
import { links, profile, resumes } from '@/content/profile'

export interface TerminalLine {
  kind: 'input' | 'output' | 'error' | 'muted' | 'accent'
  text: string
  /** Set on echoed input so scrollback keeps the directory the command ran in. */
  cwd?: string
}

export interface ShellResult {
  output: TerminalLine[]
  /** New working directory, when the command was a successful `cd`. */
  cwd?: string
  /** File the editor should open, when the command was `cat` / `open`. */
  open?: FileId
  clear?: boolean
}

const HOME = '~'
const ROOT_FILES = ['README.md', ...resumes.map((r) => r.label)]

const isFolder = (name: string) => (folders as readonly string[]).includes(name)

/** '~/src' -> 'src'; '~' -> '' */
const folderOf = (cwd: string) => (cwd === HOME ? '' : cwd.slice(HOME.length + 1))

const out = (text: string): TerminalLine => ({ kind: 'output', text })
const err = (text: string): TerminalLine => ({ kind: 'error', text })
const dim = (text: string): TerminalLine => ({ kind: 'muted', text })

const HELP: string[] = [
  'ls — list files in current directory',
  'pwd — print working directory',
  'cd <dir> — change directory (cd .. to go up)',
  'cat <file> — view / open a file in the editor',
  'open <file> — same as cat',
  'whoami — who am I?',
  'echo <text> — print text',
  'date — show current date & time',
  'git log — show recent commits',
  'python --version — show Python version',
  'clear — clear the terminal',
]

/** Cosmetic scrollback for `git log` — the real history of this repo. */
const GIT_LOG: Array<[string, string]> = [
  ['74c05da', 'version 2.3'],
  ['d53917c', 'Updated ReadMe Version 2.2'],
  ['1368d3a', 'Version 2.2'],
  ['1202b18', 'Version 2.1'],
  ['81691cb', 'Version 2.0'],
]

const PYTHON_VERSION = 'Python 3.11.9'

/**
 * Pure-ish command evaluation — no DOM, no state mutation. (`date` reads the
 * clock; everything else is a function of its arguments.) The provider applies
 * whatever effects come back, which keeps terminal behaviour from drifting
 * away from the explorer's idea of the tree.
 */
export function runCommand(raw: string, cwd: string): ShellResult {
  const input = raw.trim()
  if (!input) return { output: [] }

  const [cmd, ...args] = input.split(/\s+/)
  const arg = args[0]
  const lower = cmd.toLowerCase()

  // Two-word commands are matched before the single-word switch.
  if (lower === 'git') {
    if (arg === 'log') {
      return {
        output: GIT_LOG.map(([hash, subject]) => ({
          kind: 'output' as const,
          text: `${hash}  ${subject}`,
        })),
      }
    }
    return { output: [err(`git: '${args.join(' ') || ''}' is not supported here — try 'git log'`)] }
  }

  if (lower === 'python' || lower === 'python3') {
    if (arg === '--version' || arg === '-V') {
      return { output: [out(PYTHON_VERSION)] }
    }
    return { output: [dim('No REPL here — try `python --version`.')] }
  }

  switch (lower) {
    case 'help':
      return {
        output: [
          out('Available commands:'),
          ...HELP.map(out),
          dim("Tip: 'cat projects' opens projects.js in the editor."),
        ],
      }

    case 'pwd':
      return { output: [out(cwd.replace(HOME, `/home/${profile.shellUser}`))] }

    case 'clear':
      return { output: [], clear: true }

    case 'echo':
      return { output: [out(args.join(' '))] }

    case 'date':
      return {
        output: [
          out(
            new Date().toLocaleString(undefined, {
              weekday: 'short',
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
          ),
        ],
      }

    case 'whoami':
      return {
        output: [
          out(`${profile.firstName} ${profile.lastName} — ${profile.title}`),
          dim(profile.tagline),
          dim(`${links.github} · ${links.email}`),
        ],
      }

    case 'ls': {
      const target = arg ? arg.replace(/\/$/, '') : folderOf(cwd)

      if (arg && !isFolder(target) && target !== HOME) {
        return { output: [err(`ls: cannot access '${arg}': no such directory`)] }
      }
      if (!target) {
        return {
          output: [
            out(folders.map((f) => `${f}/`).join('   ')),
            out(ROOT_FILES.join('   ')),
          ],
        }
      }
      const listed = filesInFolder(target)
      if (!listed.length) return { output: [dim('(empty)')] }
      return { output: [out(listed.map((f) => f.name).join('   '))] }
    }

    case 'cd': {
      if (!arg || arg === HOME || arg === '/' || arg === '~/') {
        return { output: [], cwd: HOME }
      }
      if (arg === '..') return { output: [], cwd: HOME }
      if (arg === '.') return { output: [] }

      const target = arg.replace(/^~\//, '').replace(/\/$/, '')
      if (isFolder(target)) return { output: [], cwd: `${HOME}/${target}` }
      if (files.some((f) => f.name.toLowerCase() === target.toLowerCase())) {
        return { output: [err(`cd: not a directory: ${arg}`)] }
      }
      return { output: [err(`cd: no such directory: ${arg}`)] }
    }

    case 'cat':
    case 'open': {
      if (!arg) {
        return { output: [err(`${cmd}: missing operand — try '${cmd} about'`)] }
      }
      const resume = resumes.find((r) => r.label.toLowerCase() === arg.toLowerCase())
      if (resume) {
        return {
          output: [
            dim(`${resume.label}: binary file (PDF)`),
            dim('Use the download icon in the activity bar to get it.'),
          ],
        }
      }
      const file = resolveFile(arg)
      if (!file) return { output: [err(`${cmd}: no such file: ${arg}`)] }
      return {
        output: [{ kind: 'accent', text: `opening ${file.folder}/${file.name}…` }],
        open: file.id,
      }
    }

    default:
      return {
        output: [
          err(`command not found: ${cmd}`),
          dim("Type 'help' to see available commands."),
        ],
      }
  }
}

export const WELCOME: TerminalLine[] = [
  { kind: 'accent', text: "Welcome! Type 'help' to see available commands." },
]
