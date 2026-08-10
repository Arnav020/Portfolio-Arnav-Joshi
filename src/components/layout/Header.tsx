'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Download } from 'lucide-react'
import { NAV_LINKS, RESUME_LINKS } from '@/lib/constants'
import { useSpineNavigation } from '@/hooks/useSpineNavigation'
import { scrollToSection } from '@/lib/scroll'
import { MobileNav } from './MobileNav'
import { cn } from '@/lib/utils'

export function Header() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const { spineChapter, trailingActive, gotoChapter } = useSpineNavigation()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Cross-page nav (e.g. clicking "Skills" from a /work/[slug] page): Header is
  // mounted once in the root layout and persists across client-side route
  // changes, so once we land back on "/" with a hash, scroll to it ourselves —
  // more reliable than depending on the browser's native anchor-jump timing
  // against a route that just mounted.
  useEffect(() => {
    if (!isHome || !window.location.hash) return
    const id = window.location.hash.slice(1)
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToSection(id)))
  }, [isHome])

  const handleNavClick = (e: React.MouseEvent, link: (typeof NAV_LINKS)[number]) => {
    if (!isHome) return
    e.preventDefault()
    if (link.kind === 'chapter') gotoChapter(link.gotoChapter)
    else scrollToSection(link.id)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-lg backdrop-saturate-150 supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-20 max-w-[var(--content-width)] items-center justify-between px-6 md:px-10">
        <Link
          href="/"
          className="font-serif text-2xl text-foreground-strong transition-opacity hover:opacity-80"
        >
          AJ<span className="text-accent">.</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
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
                onClick={(e) => handleNavClick(e, link)}
                className={cn(
                  'relative px-3.5 py-2 font-mono text-xs font-medium tracking-[0.08em] uppercase transition-colors duration-150 ease-[var(--ease-out)] after:absolute after:bottom-0.5 after:left-3.5 after:h-px after:bg-accent after:transition-[width] after:duration-200 after:ease-[var(--ease-out)]',
                  isActive
                    ? 'text-foreground-strong after:w-[calc(100%-1.75rem)]'
                    : 'text-muted-foreground after:w-0 hover:text-foreground-strong'
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={RESUME_LINKS.ml}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-full border border-border-strong px-4 py-2 font-mono text-xs font-medium tracking-[0.08em] text-foreground-strong uppercase transition-[background-color,transform] duration-150 ease-[var(--ease-out)] hover:bg-surface active:scale-[0.97] sm:inline-flex"
          >
            Resume
            <Download className="h-3 w-3" />
          </a>

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground-strong transition-colors duration-150 hover:bg-surface md:hidden"
          >
            <Menu className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} isHome={isHome} />
    </header>
  )
}
