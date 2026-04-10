import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'ml' | 'backend' | 'fullstack' | 'mlops'
  className?: string
}

const variantStyles = {
  default: 'bg-white/5 text-[var(--muted-foreground)] border-white/10',
  accent: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  ml: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  backend: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  fullstack: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  mlops: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
