'use client'

import { motion } from 'framer-motion'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { SECTION_IDS } from '@/lib/constants'

const SECTIONS = [
  { id: SECTION_IDS.HERO, label: 'Hero' },
  { id: SECTION_IDS.ABOUT, label: 'About' },
  { id: SECTION_IDS.SKILLS, label: 'Skills' },
  { id: SECTION_IDS.EXPERIENCE, label: 'Experience' },
  { id: SECTION_IDS.PROJECTS, label: 'Projects' },
  { id: SECTION_IDS.ACHIEVEMENTS, label: 'Achievements' },
  { id: SECTION_IDS.CONTACT, label: 'Contact' },
]

export function SectionProgress() {
  const activeSection = useScrollSpy(SECTIONS.map((s) => s.id))

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3">
      {SECTIONS.map((section) => {
        const isActive = activeSection === section.id
        return (
          <div key={section.id} className="group relative flex items-center">
            {/* Tooltip */}
            <div className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="glass px-2.5 py-1 rounded-lg border border-white/10 whitespace-nowrap">
                <span className="text-xs text-[var(--muted-foreground)]">
                  {section.label}
                </span>
              </div>
            </div>

            {/* Dot */}
            <button
              onClick={() => scrollTo(section.id)}
              aria-label={`Navigate to ${section.label}`}
              className="relative flex items-center justify-center w-5 h-5"
            >
              <motion.div
                animate={{
                  scale: isActive ? 1 : 0.6,
                  backgroundColor: isActive
                    ? '#6366f1'
                    : 'rgba(255,255,255,0.2)',
                }}
                transition={{ duration: 0.25 }}
                className="w-2 h-2 rounded-full"
              />
              {isActive && (
                <motion.div
                  layoutId="section-ring"
                  className="absolute inset-0 rounded-full border border-indigo-500/50"
                  transition={{ type: 'spring', bounce: 0.2 }}
                />
              )}
            </button>
          </div>
        )
      })}
    </div>
  )
}
