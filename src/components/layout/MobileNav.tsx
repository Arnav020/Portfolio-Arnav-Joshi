'use client'

import * as Dialog from '@radix-ui/react-dialog'
import Link from 'next/link'
import { X } from 'lucide-react'
import { NAV_LINKS, RESUME_LINKS } from '@/lib/constants'
import { useSpineNavigation } from '@/hooks/useSpineNavigation'
import { scrollToSection } from '@/lib/scroll'

interface MobileNavProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isHome: boolean
}

export function MobileNav({ open, onOpenChange, isHome }: MobileNavProps) {
  const { spineChapter, trailingActive, gotoChapter } = useSpineNavigation()

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={
            'fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-200 ease-[var(--ease-out)] ' +
            'data-[state=closed]:opacity-0 data-[state=open]:opacity-100'
          }
        />
        <Dialog.Content
          className={
            'fixed inset-x-0 top-0 z-50 origin-top border-b border-border bg-background/95 p-6 pt-20 shadow-xl backdrop-blur-lg ' +
            'transition-[transform,opacity] duration-200 ease-[var(--ease-out)] ' +
            'data-[state=closed]:translate-y-[-8px] data-[state=closed]:opacity-0 data-[state=open]:translate-y-0 data-[state=open]:opacity-100'
          }
        >
          <Dialog.Title className="sr-only">Navigation menu</Dialog.Title>
          <Dialog.Close
            aria-label="Close menu"
            className="absolute top-5 right-6 flex h-9 w-9 items-center justify-center rounded-full text-foreground-strong transition-colors hover:bg-surface"
          >
            <X className="h-[18px] w-[18px]" />
          </Dialog.Close>

          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                isHome &&
                (link.kind === 'chapter'
                  ? !trailingActive && link.activeChapters.includes(spineChapter)
                  : trailingActive === link.id)
              const href = link.kind === 'chapter' ? '#hero' : `#${link.id}`
              return (
                <Link
                  key={link.label}
                  href={isHome ? href : `/${href}`}
                  onClick={(e) => {
                    onOpenChange(false)
                    if (isHome) {
                      e.preventDefault()
                      if (link.kind === 'chapter') gotoChapter(link.gotoChapter)
                      else scrollToSection(link.id)
                    }
                  }}
                  className={
                    'rounded-lg px-3 py-3 font-serif text-2xl transition-colors ' +
                    (isActive ? 'text-accent' : 'text-foreground-strong hover:text-accent')
                  }
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-6 flex gap-3 border-t border-border pt-6">
            <a
              href={RESUME_LINKS.ml}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border-strong px-4 py-2 text-sm font-medium text-foreground-strong"
            >
              Resume (ML)
            </a>
            <a
              href={RESUME_LINKS.sde}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border-strong px-4 py-2 text-sm font-medium text-foreground-strong"
            >
              Resume (SDE)
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
