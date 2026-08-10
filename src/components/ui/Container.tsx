import { cn } from '@/lib/utils'

export function Container({
  className,
  children,
  narrow = false,
}: {
  className?: string
  children: React.ReactNode
  narrow?: boolean
}) {
  return (
    <div
      className={cn('mx-auto w-full px-6 md:px-10', narrow ? 'max-w-[var(--prose-width)]' : 'max-w-[var(--content-width)]', className)}
    >
      {children}
    </div>
  )
}
