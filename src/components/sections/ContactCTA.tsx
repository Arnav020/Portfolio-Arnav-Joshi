import { Mail } from 'lucide-react'
import { Github, Linkedin } from '@/components/ui/BrandIcons'
import { Container } from '@/components/ui/Container'
import { SOCIAL_LINKS } from '@/lib/constants'

export function ContactCTA() {
  return (
    <section id="contact" className="scroll-mt-24 py-20 md:py-28">
      <Container narrow className="text-center">
        <p className="mb-3 font-mono text-xs font-semibold tracking-[0.2em] text-accent uppercase">
          07 — Contact
        </p>
        <h2 className="mb-4 font-serif text-4xl text-foreground-strong md:text-5xl">
          Let&apos;s talk about what you&apos;re building.
        </h2>
        <p className="mx-auto mb-10 max-w-md text-base leading-relaxed text-muted-foreground">
          Open to internships, research collaborations, and interesting problems in
          ML/AI and full-stack engineering. The fastest way to reach me is email.
        </p>

        <a
          href={`mailto:${SOCIAL_LINKS.email}`}
          className="mb-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-background transition-[transform,opacity] duration-150 ease-[var(--ease-out)] hover:opacity-90 active:scale-[0.97]"
        >
          <Mail className="h-4 w-4" />
          {SOCIAL_LINKS.email}
        </a>

        <div className="flex items-center justify-center gap-2">
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 ease-[var(--ease-out)] hover:bg-surface hover:text-foreground-strong"
          >
            <Github className="h-[18px] w-[18px]" />
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 ease-[var(--ease-out)] hover:bg-surface hover:text-foreground-strong"
          >
            <Linkedin className="h-[18px] w-[18px]" />
          </a>
        </div>
      </Container>
    </section>
  )
}
