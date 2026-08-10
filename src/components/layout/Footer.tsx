import Link from 'next/link'
import { Mail } from 'lucide-react'
import { Github, Linkedin } from '@/components/ui/BrandIcons'
import { SOCIAL_LINKS } from '@/lib/constants'
import { Container } from '@/components/ui/Container'

const LINKS = [
  { icon: Github, label: 'GitHub', href: SOCIAL_LINKS.github },
  { icon: Linkedin, label: 'LinkedIn', href: SOCIAL_LINKS.linkedin },
  { icon: Mail, label: 'Email', href: `mailto:${SOCIAL_LINKS.email}` },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <Container className="flex flex-col items-center justify-between gap-6 py-10 md:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Arnav Joshi. Built with Next.js.
        </p>

        <div className="flex items-center gap-2">
          {LINKS.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 ease-[var(--ease-out)] hover:bg-surface-hover hover:text-foreground-strong"
            >
              <Icon className="h-[18px] w-[18px]" />
            </a>
          ))}
        </div>

        <Link
          href="#hero"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
        >
          Back to top ↑
        </Link>
      </Container>
    </footer>
  )
}
