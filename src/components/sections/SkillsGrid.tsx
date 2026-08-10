import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { skillsByCategory, skillCategoryMeta } from '@/data/skills'
import type { SkillCategory } from '@/types'

const ORDER: SkillCategory[] = ['languages', 'ml', 'backend', 'frontend', 'data', 'devops']

export function SkillsGrid() {
  return (
    <section id="skills" className="scroll-mt-24 py-20 md:py-28">
      <Container>
        <SectionHeading entry={5} label="Skills" title="What I work with" />

        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
          {ORDER.map((cat, i) => (
            <ScrollReveal key={cat} delay={i * 50} className="border-t border-border-strong pt-4">
              <h3 className="mb-2.5 font-mono text-xs font-semibold tracking-[0.15em] text-accent uppercase">
                {skillCategoryMeta[cat].label}
              </h3>
              <p className="leading-relaxed text-foreground">
                {skillsByCategory[cat].map((skill) => skill.name).join('  ·  ')}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
