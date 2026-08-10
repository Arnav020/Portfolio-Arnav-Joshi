import { cn } from '@/lib/utils'
import { ScrollReveal } from './ScrollReveal'

interface SectionHeadingProps {
  entry: number
  label: string
  title: string
  description?: string
  className?: string
  align?: 'left' | 'center'
}

export function SectionHeading({ entry, label, title, description, className, align = 'left' }: SectionHeadingProps) {
  return (
    <ScrollReveal className={cn('mb-12 md:mb-16', align === 'center' ? 'text-center' : 'text-left', className)}>
      <span className="mb-3 inline-block font-mono text-xs font-semibold tracking-[0.2em] text-accent uppercase">
        {String(entry).padStart(2, '0')} — {label}
      </span>
      <h2 className="mb-4 font-serif text-4xl leading-tight text-foreground-strong md:text-5xl">{title}</h2>
      {description && (
        <p className={cn('max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg', align === 'center' && 'mx-auto')}>
          {description}
        </p>
      )}
    </ScrollReveal>
  )
}
