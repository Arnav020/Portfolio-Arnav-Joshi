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

        <div className="grid gap-4 md:grid-cols-2">
          {achievements.map((a, i) => {
            const Icon = ICONS[a.icon ?? 'star'] ?? Star
            return (
              <ScrollReveal
                key={a.title}
                delay={i * 40}
                className="group flex gap-4 rounded-xl border border-border bg-surface/50 p-5 backdrop-blur-sm transition-colors duration-200 ease-[var(--ease-out)] hover:border-border-strong hover:bg-surface/80"
              >
                <Icon className="mt-1 h-4 w-4 flex-shrink-0 text-accent" />
                <div>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-semibold text-foreground-strong">{a.title}</span>
                    {a.year && <span className="font-mono text-xs text-muted-foreground">{a.year}</span>}
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{a.description}</p>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
