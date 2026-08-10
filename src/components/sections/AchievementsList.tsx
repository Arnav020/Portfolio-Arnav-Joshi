import { Trophy, Star, Award, Rocket, Satellite } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { achievements } from '@/data/achievements'

const ICONS: Record<string, typeof Trophy> = {
  trophy: Trophy,
  star: Star,
  certificate: Award,
  rocket: Rocket,
  satellite: Satellite,
}

export function AchievementsList() {
  return (
    <section id="achievements" className="scroll-mt-24 py-20 md:py-28">
      <Container>
        <SectionHeading entry={6} label="Achievements" title="Waypoints collected along the way" />

        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
          {achievements.map((a, i) => {
            const Icon = ICONS[a.icon ?? 'star'] ?? Star
            return (
              <ScrollReveal
                key={a.title}
                delay={i * 40}
                className="border-l-2 border-accent/70 py-1 pl-5 transition-colors duration-200 ease-[var(--ease-out)] hover:border-accent"
              >
                <div className="flex items-start justify-between gap-3">
                  <Icon className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                  {a.year && <span className="font-mono text-xs tracking-[0.08em] text-muted-foreground uppercase">{a.year}</span>}
                </div>
                <div className="mt-3 font-serif text-xl text-foreground-strong">{a.title}</div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{a.description}</p>
              </ScrollReveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
