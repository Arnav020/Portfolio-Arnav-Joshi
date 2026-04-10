'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { fadeInUp } from '@/lib/animations'

interface SectionHeadingProps {
  label: string
  title: string
  description?: string
  className?: string
  align?: 'left' | 'center'
}

export function SectionHeading({
  label,
  title,
  description,
  className,
  align = 'center',
}: SectionHeadingProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className={cn(
        'mb-16',
        align === 'center' ? 'text-center' : 'text-left',
        className
      )}
    >
      <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-indigo-400 mb-4">
        {label}
      </span>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-4 leading-tight">
        {title}
      </h2>
      {description && (
        <p className="text-[var(--muted-foreground)] text-lg max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  )
}
