'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
  href?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:opacity-50 disabled:pointer-events-none'

    const variants = {
      primary:
        'bg-[var(--accent)] text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20',
      secondary:
        'glass text-[var(--foreground)] hover:border-indigo-500/40',
      ghost:
        'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-white/5',
      outline:
        'border border-[var(--border)] text-[var(--foreground)] hover:border-indigo-500/60 hover:bg-white/5',
    }

    const sizes = {
      sm: 'text-sm px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2 gap-2',
      lg: 'text-base px-6 py-3 gap-2',
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(base, variants[variant], sizes[size], className)}
        {...(props as any)}
      >
        {children}
      </motion.button>
    )
  }
)
Button.displayName = 'Button'
export { Button }
