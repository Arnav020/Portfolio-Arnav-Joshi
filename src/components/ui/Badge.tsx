import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  className?: string
}

// Reserved for the single category tag per project card/hero — not for
// repeated tech-stack tags (those render as plain text lists instead).
export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border border-border-strong px-2.5 py-0.5 text-xs font-semibold tracking-wide text-foreground-strong uppercase',
        className
      )}
    >
      {children}
    </span>
  )
}
