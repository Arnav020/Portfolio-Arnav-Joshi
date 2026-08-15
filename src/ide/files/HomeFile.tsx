'use client'

import { useEffect, useState } from 'react'
import { FolderOpen, Mail, User } from 'lucide-react'
import { useIde } from '../IdeProvider'
import { GithubMark, LinkedinMark } from '../BrandIcons'
import { DotPill, Emphasis, Tagline } from './parts'
import { links, profile, stats } from '@/content/profile'

/**
 * Types each line out, holds it, deletes it, moves to the next — one timeout
 * chain rather than an interval, so the phase durations can differ without
 * juggling counters. Reduced motion pins it to the first line, no animation.
 */
function useTypewriter(lines: readonly string[]) {
  const [shown, setShown] = useState('')

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const id = setTimeout(() => setShown(lines[0]), 0)
      return () => clearTimeout(id)
    }

    let line = 0
    let chars = 0
    let deleting = false
    let timer: ReturnType<typeof setTimeout>

    const step = () => {
      const text = lines[line]
      chars += deleting ? -1 : 1
      setShown(text.slice(0, chars))

      let delay = deleting ? 22 : 55
      if (!deleting && chars === text.length) {
        deleting = true
        delay = 1800 // hold the finished line
      } else if (deleting && chars === 0) {
        deleting = false
        line = (line + 1) % lines.length
        delay = 320
      }
      timer = setTimeout(step, delay)
    }

    timer = setTimeout(step, 400)
    return () => clearTimeout(timer)
  }, [lines])

  return shown
}

export function HomeFile() {
  const { dispatch } = useIde()
  const typed = useTypewriter(profile.taglines)

  const socials = [
    { label: 'GitHub', href: links.github, Icon: GithubMark },
    { label: 'LinkedIn', href: links.linkedin, Icon: LinkedinMark },
    { label: 'Email', href: `mailto:${links.email}`, Icon: Mail },
  ]

  return (
    <>
      <Tagline syntax="slash">hello world !! welcome to my portfolio</Tagline>

      <h1 className="font-display leading-[1] font-extrabold tracking-tight">
        <span className="block text-[clamp(2.5rem,5.5vw,4.25rem)] text-fg-strong">
          {profile.firstName}
        </span>
        <span className="block text-[clamp(2.5rem,5.5vw,4.25rem)] text-name">
          {profile.lastName}
        </span>
      </h1>

      <div className="mt-3 h-[3px] w-56 rounded-full bg-name" />

      <div className="mt-4 flex flex-wrap gap-2">
        {profile.roles.map((r) => (
          <DotPill key={r.label} tone={r.tone}>
            {r.label}
          </DotPill>
        ))}
      </div>

      <p className="mt-4 font-mono text-[13px] text-dim">
        {typed}
        <span className="caret-blink text-accent-2">▌</span>
      </p>

      {/* 14px / 1.9 / --dim with weight-500 blue highlights, matching the
          reference's intro treatment. */}
      <p className="mt-5 max-w-2xl text-[14px] leading-[1.9] text-dim">
        <Emphasis text={profile.intro} />
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => dispatch({ type: 'OPEN', id: 'projects' })}
          className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-statusbar-fg transition-opacity hover:opacity-90"
        >
          <FolderOpen className="h-4 w-4" />
          Projects
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'OPEN', id: 'about' })}
          className="inline-flex items-center gap-2 rounded-md border border-line px-4 py-2.5 text-sm text-fg transition-colors hover:border-accent hover:text-fg-strong"
        >
          <User className="h-4 w-4" />
          About Me
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'OPEN', id: 'contact' })}
          className="inline-flex items-center gap-2 rounded-md border border-line px-4 py-2.5 text-sm text-fg transition-colors hover:border-accent hover:text-fg-strong"
        >
          <Mail className="h-4 w-4" />
          Contact
        </button>
      </div>

      <dl className="mt-7 grid w-full grid-cols-2 gap-3 rounded-lg border border-line bg-panel p-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <dd className="font-display text-2xl font-extrabold text-fg-strong">
              {s.value}
              <span className="ml-1 text-sm font-normal text-faint">{s.suffix}</span>
            </dd>
            <dt className="mt-1 text-[10px] tracking-[0.14em] text-faint uppercase">
              {s.label}
            </dt>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex flex-wrap gap-2">
        {socials.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('mailto:') ? undefined : '_blank'}
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-2 text-xs text-dim transition-colors hover:border-accent hover:text-fg-strong"
          >
            <Icon className="h-4 w-4" />
            {label}
          </a>
        ))}
      </div>
    </>
  )
}
